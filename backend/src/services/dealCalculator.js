/**
 * Validates the raw deal input payload before calculations.
 * @param {Object} input - Raw deal input data
 * @returns {Array} errors - Array of validation error messages, empty if valid
 */
function validateDealInput(input) {
  const errors = [];

  const requiredFields = [
    'itemName', 'quantity', 'costPricePerItem', 
    'investor1Name', 'investor1Contribution',
    'investor2Name', 'investor2Contribution',
    'currency'
  ];

  for (const field of requiredFields) {
    if (input[field] === undefined || input[field] === null || input[field] === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (input.quantity !== undefined && Number(input.quantity) <= 0) {
    errors.push('Quantity must be greater than 0');
  }

  const numericFields = [
    'costPricePerItem', 'flightCost', 'luggageCost', 'transportCost', 
    'packageCost', 'salaryExpense', 'additionalExpenses', 
    'investor1Contribution', 'investor2Contribution', 'totalSaleRevenue'
  ];

  for (const field of numericFields) {
    if (input[field] !== undefined && Number(input[field]) < 0) {
      errors.push(`${field} cannot be negative`);
    }
  }

  if (input.currency && !['GBP', 'AED'].includes(input.currency.toUpperCase())) {
    errors.push('Currency must be GBP or AED');
  }

  return errors;
}

/**
 * Generates the next sequential Deal ID
 * @param {string} lastDealId - The ID of the last created deal, e.g., 'DL-0042'. Pass null if first.
 * @returns {string} The newly generated Deal ID
 */
function generateDealId(lastDealId) {
  if (!lastDealId) return 'DL-0001';
  
  const numericPart = parseInt(lastDealId.replace('DL-', ''), 10);
  if (isNaN(numericPart)) return 'DL-0001';

  const nextNumber = numericPart + 1;
  return `DL-${String(nextNumber).padStart(4, '0')}`;
}

/**
 * Formats a numeric amount to a standard currency format string.
 * @param {number} amount - The amount to format
 * @param {string} currency - 'GBP' or 'AED'
 * @returns {string} Formatted string, e.g., '£1,000.00'
 */
function formatCurrency(amount, currency = 'GBP') {
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase() === 'AED' ? 'AED' : 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(Number(amount));
}

/**
 * Calculates all financial totals, profits, and splits for a deal.
 * @param {Object} input - Validated deal input
 * @returns {Object} Calculated deal object
 */
function calculateDealTotals(input) {
  // Coerce inputs to numbers, defaulting to 0 where applicable
  const quantity = Number(input.quantity) || 0;
  const costPricePerItem = Number(input.costPricePerItem) || 0;
  const flightCost = Number(input.flightCost) || 0;
  const luggageCost = Number(input.luggageCost) || 0;
  const transportCost = Number(input.transportCost) || 0;
  const packageCost = Number(input.packageCost) || 0;
  const salaryExpense = Number(input.salaryExpense) || 0;
  const additionalExpenses = Number(input.additionalExpenses) || 0;

  const investor1Contribution = Number(input.investor1Contribution) || 0;
  const investor2Contribution = Number(input.investor2Contribution) || 0;
  
  const totalSaleRevenue = input.totalSaleRevenue !== undefined && input.totalSaleRevenue !== null 
    ? Number(input.totalSaleRevenue) 
    : 0;

  // Manual status override
  const manualStatus = input.status;

  // --- 1. Basic Expenses ---
  const totalStockCost = quantity * costPricePerItem;
  
  const totalExpenses = totalStockCost 
    + flightCost 
    + luggageCost 
    + transportCost 
    + packageCost 
    + salaryExpense 
    + additionalExpenses;

  // --- 2. Investments ---
  const totalCapitalInvested = investor1Contribution + investor2Contribution;

  // --- 3. Profit Calculation ---
  const netProfit = totalSaleRevenue - totalExpenses;

  let profitShareInvestor1 = 0;
  let profitShareInvestor2 = 0;
  let finalPayoutInvestor1 = 0;
  let finalPayoutInvestor2 = 0;
  let calculatedStatus = 'PENDING';

  // --- 4. Logic Branches ---
  if (!totalSaleRevenue || totalSaleRevenue === 0 || manualStatus === 'PENDING') {
    // If sale revenue is missing or 0, or explicitly set to pending
    calculatedStatus = 'PENDING';
    finalPayoutInvestor1 = investor1Contribution; // Base payout, no profit
    finalPayoutInvestor2 = investor2Contribution;
  } else if (netProfit > 0) {
    calculatedStatus = manualStatus === 'CLOSED' ? 'CLOSED' : 'PROFITABLE';
    profitShareInvestor1 = netProfit / 2;
    profitShareInvestor2 = netProfit / 2;
    finalPayoutInvestor1 = investor1Contribution + profitShareInvestor1;
    finalPayoutInvestor2 = investor2Contribution + profitShareInvestor2;
  } else if (netProfit < 0) {
    calculatedStatus = 'LOSS';
    const lossAmount = Math.abs(netProfit);
    const investor1LossShare = lossAmount / 2;
    const investor2LossShare = lossAmount / 2;
    finalPayoutInvestor1 = investor1Contribution - investor1LossShare;
    finalPayoutInvestor2 = investor2Contribution - investor2LossShare;
  } else {
    // Break-even
    calculatedStatus = manualStatus === 'CLOSED' ? 'CLOSED' : 'PENDING';
    finalPayoutInvestor1 = investor1Contribution;
    finalPayoutInvestor2 = investor2Contribution;
  }

  return {
    ...input,
    totalStockCost,
    totalExpenses,
    totalCapitalInvested,
    totalSaleRevenue,
    netProfit,
    profitShareInvestor1,
    profitShareInvestor2,
    finalPayoutInvestor1,
    finalPayoutInvestor2,
    status: calculatedStatus
  };
}

module.exports = {
  validateDealInput,
  generateDealId,
  formatCurrency,
  calculateDealTotals
};
