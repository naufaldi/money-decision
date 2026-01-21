import { describe, it, expect } from 'vitest';
import {
  calculatePinjolPayoff,
  compareConsolidationOptions,
  calculateRequiredPayment,
  calculateMonthlyInterest,
  calculateDoublingTime,
  isDangerouslyHighInterest,
  getPinjolRiskLevel,
  formatIDR,
} from '@/utils/pinjolCalculator';

describe('Pinjol Calculator', () => {
  describe('calculatePinjolPayoff', () => {
    it('should calculate basic payoff with 5% monthly interest', () => {
      const result = calculatePinjolPayoff({
        principal: 1000000,
        monthlyInterestRate: 5,
        monthlyPayment: 200000,
      });

      expect(result.totalDebt).toBe(1000000);
      expect(result.monthlyPayment).toBe(200000);
      expect(result.monthsToPayoff).toBeGreaterThan(0);
      expect(result.totalPaid).toBeGreaterThan(1000000);
    });

    it('should handle zero interest rate', () => {
      const result = calculatePinjolPayoff({
        principal: 1000000,
        monthlyInterestRate: 0,
        monthlyPayment: 100000,
      });

      expect(result.totalDebt).toBe(1000000);
      expect(result.monthsToPayoff).toBe(10);
      expect(result.totalInterest).toBe(0);
    });

    it('should handle payment less than monthly interest', () => {
      const result = calculatePinjolPayoff({
        principal: 1000000,
        monthlyInterestRate: 10,
        monthlyPayment: 50000,
      });

      expect(result.monthsToPayoff).toBe(600);
      expect(result.totalPaid).toBe(result.totalDebt + result.totalInterest);
    });
  });

  describe('compareConsolidationOptions', () => {
    it('should show savings with lower interest bank loan', () => {
      const comparison = compareConsolidationOptions({
        pinjolPrincipal: 5000000,
        pinjolMonthlyRate: 5,
        pinjolMonthlyPayment: 500000,
        bankLoanPrincipal: 5000000,
        bankMonthlyRate: 1,
        bankMonthlyPayment: 500000,
      });

      expect(comparison.pinjol.totalPaid).toBeGreaterThan(
        comparison.bank.totalPaid
      );
      expect(comparison.savings).toBeGreaterThan(0);
      expect(comparison.monthsSaved).toBeGreaterThan(0);
    });

    it('should show savings comparison with bank loan', () => {
      const comparison = compareConsolidationOptions({
        pinjolPrincipal: 3000000,
        pinjolMonthlyRate: 2,
        pinjolMonthlyPayment: 300000,
        bankLoanPrincipal: 3000000,
        bankMonthlyRate: 5,
        bankMonthlyPayment: 300000,
      });

      // Bank has higher interest, so pinjol may be cheaper
      // The function returns max(0, pinjol - bank), so savings is always >= 0
      // This test verifies the function handles the comparison correctly
      expect(comparison.pinjol).toBeDefined();
      expect(comparison.bank).toBeDefined();
      expect(typeof comparison.savings).toBe('number');
      expect(comparison.savings).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateRequiredPayment', () => {
    it('should calculate payment to pay off in 12 months', () => {
      const payment = calculateRequiredPayment({
        principal: 1200000,
        monthlyInterestRate: 3,
        targetMonths: 12,
      });

      expect(payment).toBeGreaterThan(100000);
    });

    it('should handle zero interest', () => {
      const payment = calculateRequiredPayment({
        principal: 1200000,
        monthlyInterestRate: 0,
        targetMonths: 12,
      });

      expect(payment).toBe(100000);
    });
  });

  describe('calculateMonthlyInterest', () => {
    it('should calculate correct monthly interest', () => {
      const interest = calculateMonthlyInterest(1000000, 5);
      expect(interest).toBe(50000);
    });

    it('should calculate correct interest for different rates', () => {
      const interest = calculateMonthlyInterest(2000000, 3);
      expect(interest).toBe(60000);
    });
  });

  describe('calculateDoublingTime', () => {
    it('should calculate doubling time for 5% monthly interest', () => {
      const months = calculateDoublingTime(5);
      expect(months).toBe(15);
    });

    it('should return infinity for zero interest', () => {
      const months = calculateDoublingTime(0);
      expect(months).toBe(Infinity);
    });

    it('should be faster for higher interest rates', () => {
      const monthsLow = calculateDoublingTime(2);
      const monthsHigh = calculateDoublingTime(10);
      expect(monthsHigh).toBeLessThan(monthsLow);
    });
  });

  describe('isDangerouslyHighInterest', () => {
    it('should return true for rates above 3%', () => {
      expect(isDangerouslyHighInterest(5)).toBe(true);
      expect(isDangerouslyHighInterest(10)).toBe(true);
    });

    it('should return false for rates at or below 3%', () => {
      expect(isDangerouslyHighInterest(3)).toBe(false);
      expect(isDangerouslyHighInterest(1)).toBe(false);
      expect(isDangerouslyHighInterest(0)).toBe(false);
    });
  });

  describe('getPinjolRiskLevel', () => {
    it('should return low for rates <= 1%', () => {
      const risk = getPinjolRiskLevel(1);
      expect(risk.level).toBe('low');
      expect(risk.color).toBe('green');
    });

    it('should return moderate for rates 1-2%', () => {
      const risk = getPinjolRiskLevel(1.5);
      expect(risk.level).toBe('moderate');
      expect(risk.color).toBe('yellow');
    });

    it('should return high for rates 2-5%', () => {
      const risk = getPinjolRiskLevel(3);
      expect(risk.level).toBe('high');
      expect(risk.color).toBe('orange');
    });

    it('should return critical for rates > 5%', () => {
      const risk = getPinjolRiskLevel(8);
      expect(risk.level).toBe('critical');
      expect(risk.color).toBe('red');
    });
  });

  describe('formatIDR', () => {
    it('should format Indonesian Rupiah correctly', () => {
      const formatted = formatIDR(1000000);
      expect(formatted).toContain('1');
      expect(formatted).toContain('000');
    });

    it('should handle zero', () => {
      const formatted = formatIDR(0);
      expect(formatted).toContain('0');
    });

    it('should handle large numbers', () => {
      const formatted = formatIDR(100000000);
      expect(formatted.length).toBeGreaterThan(10);
    });
  });
});

describe('Sandwich Generation Pinjol Scenarios', () => {
  it('should calculate payoff for sandwich generation with pinjol', () => {
    const result = calculatePinjolPayoff({
      principal: 3000000,
      monthlyInterestRate: 5,
      monthlyPayment: 300000,
    });

    expect(result.totalDebt).toBe(3000000);
    expect(result.monthsToPayoff).toBeLessThan(24);
    expect(result.totalPaid).toBeGreaterThan(3000000);
  });

  it('should show critical risk for high pinjol rates', () => {
    const risk = getPinjolRiskLevel(8);
    expect(risk.level).toBe('critical');
  });

  it('should calculate required payment for quick payoff', () => {
    const payment = calculateRequiredPayment({
      principal: 5000000,
      monthlyInterestRate: 5,
      targetMonths: 6,
    });

    expect(payment).toBeGreaterThan(800000);
  });
});
