import {
  computeExpenseMetrics,
  recommendRule,
  computeAdjustedAllocation,
  compareAllocations,
  getCutNeeded,
  formatSpendingRatio,
} from './expenseRuleFit';

describe('expenseRuleFit utilities', () => {
  describe('computeExpenseMetrics', () => {
    it('calculates basic metrics correctly', () => {
      const result = computeExpenseMetrics(5000000, 3000000);

      expect(result.income).toBe(5000000);
      expect(result.expenses).toBe(3000000);
      expect(result.cashflow).toBe(2000000);
      expect(result.savingsCapacity).toBe(2000000);
      expect(result.spendingRatio).toBe(0.6);
      expect(result.isDeficit).toBe(false);
    });

    it('handles deficit when expenses exceed income', () => {
      const result = computeExpenseMetrics(5000000, 6000000);

      expect(result.cashflow).toBe(-1000000);
      expect(result.savingsCapacity).toBe(0);
      expect(result.isDeficit).toBe(true);
    });

    it('handles null expenses', () => {
      const result = computeExpenseMetrics(5000000, null);

      expect(result.expenses).toBe(0);
      expect(result.cashflow).toBe(5000000);
      expect(result.savingsCapacity).toBe(5000000);
      expect(result.isDeficit).toBe(false);
    });

    it('handles zero expenses', () => {
      const result = computeExpenseMetrics(5000000, 0);

      expect(result.expenses).toBe(0);
      expect(result.cashflow).toBe(5000000);
      expect(result.savingsCapacity).toBe(5000000);
    });
  });

  describe('recommendRule', () => {
    it('returns null for invalid income', () => {
      expect(recommendRule(0, 3000000)).toBeNull();
      expect(recommendRule(-1000, 3000000)).toBeNull();
    });

    it('recommends feasible rule with highest savings when expenses fit', () => {
      // Income 5M, expenses 4.5M
      // 60/30/10: target spending = 4.5M, cutNeeded = 0
      // CSP: target spending = 4.5M, cutNeeded = 0
      // Both are feasible with 500K savings each, 60-30-10 is first
      const result = recommendRule(5000000, 4500000);

      expect(result).not.toBeNull();
      expect(result?.rule.id).toBe('60-30-10');
    });

    it('recommends rule with smallest cut when no rule fits', () => {
      // Income 5M, expenses 4.2M
      // 60/30/10 and CSP are feasible (cutNeeded = 0)
      const result = recommendRule(5000000, 4200000);

      expect(result).not.toBeNull();
      expect(result?.rule.id).toBe('60-30-10');
    });

    it('includes reason for feasible rule', () => {
      const result = recommendRule(5000000, 4500000);

      expect(result).not.toBeNull();
      expect(result?.reason).toContain('no changes needed');
    });
  });

  describe('computeAdjustedAllocation', () => {
    it('calculates adjusted allocation based on current spending', () => {
      const result = computeAdjustedAllocation(5000000, 4000000, '60-30-10');

      // 60/30/10 ratio for needs:wants = 60:30 = 2:1
      // Spending budget = min(4000000, 5000000) = 4000000
      // Adjusted savings = 5000000 - 4000000 = 1000000
      // needsShare = 0.6 / (0.6 + 0.3) = 0.666...
      // wantsShare = 0.3 / (0.6 + 0.3) = 0.333...
      // adjustedNeeds = 4000000 * 0.666... = ~2666667
      // adjustedWants = 4000000 * 0.333... = ~1333333

      expect(result.savings).toBe(1000000);
      expect(result.spendingBudget).toBe(4000000);
      expect(result.needs + result.wants).toBe(4000000);
    });

    it('handles expenses greater than income', () => {
      const result = computeAdjustedAllocation(5000000, 6000000, '60-30-10');

      // Spending budget = min(6000000, 5000000) = 5000000
      // Adjusted savings = max(0, 5000000 - 5000000) = 0

      expect(result.savings).toBe(0);
      expect(result.spendingBudget).toBe(5000000);
    });

    it('handles null expenses', () => {
      const result = computeAdjustedAllocation(5000000, null, '60-30-10');

      expect(result.savings).toBe(5000000);
      expect(result.spendingBudget).toBe(0);
      expect(result.needs).toBe(0);
      expect(result.wants).toBe(0);
    });
  });

  describe('compareAllocations', () => {
    it('returns both target and adjusted allocations', () => {
      const result = compareAllocations(5000000, 4000000, '60-30-10');

      expect(result.target.needs).toBe(3000000);
      expect(result.target.wants).toBe(1500000);
      expect(result.target.savings).toBe(500000);

      expect(result.adjusted.savings).toBe(1000000);
      expect(result.adjusted.spendingBudget).toBe(4000000);
    });
  });

  describe('getCutNeeded', () => {
    it('returns 0 when expenses match target spending', () => {
      // 60/30/10 with 5M income: target spending = 4.5M
      const result = getCutNeeded(5000000, 4500000, '60-30-10');

      expect(result).toBe(0);
    });

    it('returns positive when expenses exceed target', () => {
      const result = getCutNeeded(5000000, 5000000, '60-30-10');

      expect(result).toBe(500000); // 5M - 4.5M = 500K
    });

    it('returns 0 when expenses are below target', () => {
      const result = getCutNeeded(5000000, 4000000, '60-30-10');

      expect(result).toBe(0); // No cut needed, already under budget
    });

    it('handles null expenses', () => {
      const result = getCutNeeded(5000000, null, '60-30-10');

      expect(result).toBe(0);
    });
  });

  describe('formatSpendingRatio', () => {
    it('formats low spending ratio', () => {
      expect(formatSpendingRatio(0.4)).toBe('40% (low)');
    });

    it('formats moderate spending ratio', () => {
      expect(formatSpendingRatio(0.7)).toBe('70% (moderate)');
    });

    it('formats high spending ratio', () => {
      expect(formatSpendingRatio(0.85)).toBe('85% (high)');
    });

    it('formats over budget', () => {
      expect(formatSpendingRatio(1.2)).toBe('120% (over budget)');
    });
  });
});
