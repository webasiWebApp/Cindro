/**
 * Returns the correct string prefix for a currency given a format style.
 * @param currency 'GBP' or 'AED'
 * @param format 'SYMBOL' or 'CODE'
 * @returns string prefix
 */
export function getCurrencyPrefix(currency: 'GBP' | 'AED', format: 'SYMBOL' | 'CODE'): string {
  if (format === 'CODE') {
    return currency;
  }
  
  if (currency === 'GBP') return '£';
  if (currency === 'AED') return 'د.إ';
  
  return '';
}

/**
 * Formats a numeric amount with the correct currency prefix and thousand separators.
 * @param amount Number to format
 * @param currency 'GBP' or 'AED'
 * @param format 'SYMBOL' or 'CODE'
 * @returns Formatted currency string
 */
export function formatMoney(amount: number, currency: 'GBP' | 'AED', format: 'SYMBOL' | 'CODE'): string {
  const prefix = getCurrencyPrefix(currency, format);
  
  // Create base number format (comma for thousands, 2 decimal places)
  const numberString = new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${prefix}${format === 'CODE' ? ' ' : ''}${numberString}`;
}
