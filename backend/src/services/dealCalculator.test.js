const { 
  validateDealInput, 
  generateDealId, 
  formatCurrency, 
  calculateDealTotals 
} = require('./dealCalculator');

describe('Deal Calculator Service', () => {

  describe('validateDealInput', () => {
    it('returns empty array for valid input', () => {
      const valid = {
        itemName: 'Phones', quantity: 10, costPricePerItem: 100,
        investor1Name: 'Inv A', investor1Contribution: 500,
        investor2Name: 'Inv B', investor2Contribution: 500,
        currency: 'GBP'
      };
      const errors = validateDealInput(valid);
      expect(errors).toEqual([]);
    });

    it('returns errors for negative numeric fields', () => {
      const invalid = {
        itemName: 'Phones', quantity: -5, costPricePerItem: -100,
        investor1Name: 'Inv A', investor1Contribution: -500,
        investor2Name: 'Inv B', investor2Contribution: 500,
        currency: 'GBP'
      };
      const errors = validateDealInput(invalid);
      expect(errors).toContain('Quantity must be greater than 0');
      expect(errors).toContain('costPricePerItem cannot be negative');
      expect(errors).toContain('investor1Contribution cannot be negative');
    });

    it('returns errors for missing required fields', () => {
      const invalid = {};
      const errors = validateDealInput(invalid);
      expect(errors).toContain('Missing required field: itemName');
      expect(errors).toContain('Missing required field: currency');
    });

    it('returns error for invalid currency', () => {
      const invalid = {
        itemName: 'Phones', quantity: 10, costPricePerItem: 100,
        investor1Name: 'Inv A', investor1Contribution: 500,
        investor2Name: 'Inv B', investor2Contribution: 500,
        currency: 'USD' // invalid
      };
      const errors = validateDealInput(invalid);
      expect(errors).toContain('Currency must be GBP or AED');
    });
  });

  describe('generateDealId', () => {
    it('generates DL-0001 if no last ID is provided', () => {
      expect(generateDealId(null)).toBe('DL-0001');
    });

    it('increments correctly', () => {
      expect(generateDealId('DL-0042')).toBe('DL-0043');
      expect(generateDealId('DL-0999')).toBe('DL-1000');
    });
  });

  describe('formatCurrency', () => {
    it('formats GBP correctly', () => {
      expect(formatCurrency(1234.5, 'GBP')).toMatch(/£1,234.50/);
    });
    
    it('formats AED correctly', () => {
      expect(formatCurrency(1234.5, 'AED')).toMatch(/AED\s?1,234.50/);
    });
  });

  describe('calculateDealTotals', () => {
    it('calculates a PROFITABLE deal correctly', () => {
      const input = {
        quantity: 50,
        costPricePerItem: 200, // 10000 total stock cost
        flightCost: 500,
        luggageCost: 100,
        transportCost: 150,
        packageCost: 50,
        // Total Expenses = 10000 + 800 = 10800
        investor1Contribution: 5400,
        investor2Contribution: 5400,
        // Total Capital = 10800
        totalSaleRevenue: 15000 // Net Profit = 15000 - 10800 = 4200
      };

      const result = calculateDealTotals(input);
      
      expect(result.totalStockCost).toBe(10000);
      expect(result.totalExpenses).toBe(10800);
      expect(result.totalCapitalInvested).toBe(10800);
      expect(result.netProfit).toBe(4200);
      
      // Profit split 50/50 -> 2100 each
      expect(result.profitShareInvestor1).toBe(2100);
      expect(result.profitShareInvestor2).toBe(2100);
      
      // Final Payout = 5400 + 2100 = 7500
      expect(result.finalPayoutInvestor1).toBe(7500);
      expect(result.finalPayoutInvestor2).toBe(7500);
      
      expect(result.status).toBe('PROFITABLE');
    });

    it('calculates a LOSS deal correctly', () => {
      const input = {
        quantity: 10,
        costPricePerItem: 100, // 1000
        flightCost: 200,
        // Total Expenses = 1200
        investor1Contribution: 600,
        investor2Contribution: 600,
        totalSaleRevenue: 1000 // Net profit = 1000 - 1200 = -200
      };

      const result = calculateDealTotals(input);
      
      expect(result.totalExpenses).toBe(1200);
      expect(result.netProfit).toBe(-200);
      
      // Loss share 50/50 -> 100 each
      expect(result.profitShareInvestor1).toBe(0); 
      
      // Final Payout = 600 - 100 = 500
      expect(result.finalPayoutInvestor1).toBe(500);
      expect(result.finalPayoutInvestor2).toBe(500);
      
      expect(result.status).toBe('LOSS');
    });

    it('sets status to PENDING if revenue is missing or 0', () => {
      const input = {
        quantity: 10,
        costPricePerItem: 100, // 1000
        investor1Contribution: 500,
        investor2Contribution: 500,
        totalSaleRevenue: 0 // Missing revenue
      };

      const result = calculateDealTotals(input);
      
      expect(result.netProfit).toBe(-1000); // 0 - 1000
      expect(result.status).toBe('PENDING'); // Not loss, because revenue is 0
      expect(result.finalPayoutInvestor1).toBe(500); // Base return
    });
  });
});
