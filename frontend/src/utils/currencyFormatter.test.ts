import { formatMoney, getCurrencyPrefix } from './currencyFormatter';

describe('Currency Formatter Utilities', () => {
  describe('getCurrencyPrefix', () => {
    it('returns £ for GBP SYMBOL', () => {
      expect(getCurrencyPrefix('GBP', 'SYMBOL')).toBe('£');
    });

    it('returns GBP for GBP CODE', () => {
      expect(getCurrencyPrefix('GBP', 'CODE')).toBe('GBP');
    });

    it('returns د.إ for AED SYMBOL', () => {
      expect(getCurrencyPrefix('AED', 'SYMBOL')).toBe('د.إ');
    });

    it('returns AED for AED CODE', () => {
      expect(getCurrencyPrefix('AED', 'CODE')).toBe('AED');
    });
  });

  describe('formatMoney', () => {
    it('formats GBP symbol correctly', () => {
      expect(formatMoney(1400, 'GBP', 'SYMBOL')).toBe('£1,400.00');
    });

    it('formats GBP code correctly', () => {
      expect(formatMoney(1400, 'GBP', 'CODE')).toBe('GBP 1,400.00');
    });

    it('formats AED symbol correctly', () => {
      expect(formatMoney(1400, 'AED', 'SYMBOL')).toBe('د.إ1,400.00');
    });

    it('formats AED code correctly', () => {
      expect(formatMoney(1400, 'AED', 'CODE')).toBe('AED 1,400.00');
    });

    it('handles negative numbers', () => {
      expect(formatMoney(-500.5, 'GBP', 'SYMBOL')).toBe('£-500.50');
    });
  });
});
