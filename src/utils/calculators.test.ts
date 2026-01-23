import { describe, it, expect } from 'vitest';
import { calculateResults } from './calculators';

describe('calculateResults', () => {
  describe('effectiveIncome calculation', () => {
    it('should return original income as effectiveIncome when no family context', () => {
      const result = calculateResults(
        5000000,
        '60-30-10',
        'moderate',
        2000000
      );

      expect(result.effectiveIncome).toBe(5000000);
    });

    it('should return effectiveIncome after family support deduction', () => {
      const result = calculateResults(
        5000000,
        '60-30-10',
        'moderate',
        2000000,
        {
          familySupportAmount: 2000000,
          hasElderlyParents: true,
          hasOtherFamily: false,
        }
      );

      expect(result.effectiveIncome).toBe(3000000);
    });

    it('should return effectiveIncome after pinjol debt payment deduction', () => {
      const result = calculateResults(
        10000000,
        '60-30-10',
        'moderate',
        5000000,
        {
          hasPinjolDebt: true,
          pinjolDebtAmount: 5000000,
          pinjolMonthlyInterest: 2,
        }
      );

      // Pinjol payment should be deducted from income
      expect(result.effectiveIncome).toBeLessThan(10000000);
      expect(result.effectiveIncome).toBeGreaterThan(0);
    });

    it('should return 0 effectiveIncome when obligations exceed income', () => {
      const result = calculateResults(
        5000000,
        '60-30-10',
        'moderate',
        2000000,
        {
          familySupportAmount: 8000000,
          hasElderlyParents: true,
          hasOtherFamily: true,
          hasPinjolDebt: true,
          pinjolDebtAmount: 10000000,
          pinjolMonthlyInterest: 2,
        }
      );

      // Should be clamped to 0, not negative
      expect(result.effectiveIncome).toBe(0);
    });

    it('should handle both family support and pinjol debt', () => {
      const result = calculateResults(
        10000000,
        '60-30-10',
        'moderate',
        5000000,
        {
          familySupportAmount: 3000000,
          hasElderlyParents: true,
          hasOtherFamily: false,
          hasPinjolDebt: true,
          pinjolDebtAmount: 5000000,
          pinjolMonthlyInterest: 2,
        }
      );

      // Should deduct both family support and pinjol payment
      expect(result.effectiveIncome).toBeLessThan(7000000); // Less than income - family support
      expect(result.effectiveIncome).toBeGreaterThan(0);
    });

    it('should use effectiveIncome for allocation calculations', () => {
      const result = calculateResults(
        10000000,
        '60-30-10',
        'moderate',
        5000000,
        {
          familySupportAmount: 4000000,
          hasElderlyParents: true,
          hasOtherFamily: false,
        }
      );

      // With 60/30/10 rule and effectiveIncome of 6M
      expect(result.effectiveIncome).toBe(6000000);
      expect(result.allocation.needs).toBe(3600000); // 60% of 6M
      expect(result.allocation.savings).toBe(600000); // 10% of 6M
      expect(result.allocation.wants).toBe(1800000); // 30% of 6M
    });
  });
});
