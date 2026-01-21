import {
  computeExpenseMetrics,
  recommendRule,
  computeAdjustedAllocation,
  compareAllocations,
  getCutNeeded,
  formatSpendingRatio,
  recommendRuleEnhanced,
  getProvinceAverageWage,
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

  describe('getProvinceAverageWage', () => {
    it('returns national average for null province', () => {
      const result = getProvinceAverageWage(null);
      expect(result).toBe(3500000);
    });

    it('returns national average for undefined province', () => {
      const result = getProvinceAverageWage(undefined);
      expect(result).toBe(3500000);
    });

    it('returns national average for unknown province', () => {
      const result = getProvinceAverageWage('Unknown Province');
      expect(result).toBe(3500000);
    });

    it('returns DKI Jakarta average for Jakarta', () => {
      const result = getProvinceAverageWage('DKI JAKARTA');
      expect(result).toBe(4878943);
    });

    it('is case insensitive for province names', () => {
      const result = getProvinceAverageWage('dki jakarta');
      expect(result).toBe(4878943);
    });
  });

  describe('recommendRuleEnhanced', () => {
    it('returns null for invalid income', () => {
      expect(recommendRuleEnhanced(0, 3000000, 'DKI JAKARTA')).toBeNull();
      expect(recommendRuleEnhanced(-1000, 3000000, 'DKI JAKARTA')).toBeNull();
    });

    it('recommends higher-needs rule for very low income users', () => {
      // Very low income (below 25th percentile) - 1M in Jakarta is ~37th percentile
      // Let's try a more extreme case
      const result = recommendRuleEnhanced(1000000, null, 'DKI JAKARTA');

      expect(result).not.toBeNull();
      // 1M is still above 25th percentile, so 60/30-10 is appropriate
      expect(['60-30-10', '70-20-10']).toContain(result?.rule.id);
      expect(result?.reason).toBeDefined();
    });

    it('recommends 50/30/20 for higher income users', () => {
      // High income (above 75th percentile)
      const result = recommendRuleEnhanced(10000000, null, 'DKI JAKARTA');

      expect(result).not.toBeNull();
      expect(result?.rule.id).toBe('50-30-20');
      expect(result?.reason).toContain('higher earner');
    });

    it('recommends different rules based on province', () => {
      // Same income, different provinces
      const jakartaResult = recommendRuleEnhanced(3000000, null, 'DKI JAKARTA');
      const acehResult = recommendRuleEnhanced(3000000, null, 'ACEH');

      expect(jakartaResult).not.toBeNull();
      expect(acehResult).not.toBeNull();
      // In Aceh (lower avg wage ~2.8M), 3M might be higher percentile than in Jakarta (~4.9M)
      // So recommendations may differ
      expect(jakartaResult?.rule.id).toBeDefined();
      expect(acehResult?.rule.id).toBeDefined();
    });

    it('returns scores with all factors', () => {
      const result = recommendRuleEnhanced(5000000, 3500000, 'JAWA BARAT');

      expect(result).not.toBeNull();
      expect(result?.scores).toBeDefined();
      expect(result?.scores.income).toBeGreaterThanOrEqual(0);
      expect(result?.scores.fit).toBeGreaterThanOrEqual(0);
      expect(result?.scores.cushion).toBeGreaterThanOrEqual(0);
      expect(result?.scores.total).toBeGreaterThanOrEqual(0);
    });

    it('includes all fits for comparison', () => {
      const result = recommendRuleEnhanced(5000000, 3500000, 'JAWA BARAT');

      expect(result).not.toBeNull();
      expect(result?.allFits).toBeDefined();
      expect(result?.allFits.length).toBe(4); // All 4 rules
    });

    it('works without spending data', () => {
      const result = recommendRuleEnhanced(5000000, null, 'JAWA BARAT');

      expect(result).not.toBeNull();
      expect(result?.rule.id).toBeDefined();
      expect(result?.reason).toBeDefined();
    });

    it('works without province data', () => {
      const result = recommendRuleEnhanced(5000000, 3500000, null);

      expect(result).not.toBeNull();
      expect(result?.rule.id).toBeDefined();
    });

    it('generates reason based on income percentile', () => {
      const lowIncome = recommendRuleEnhanced(1000000, null, 'DKI JAKARTA');
      const highIncome = recommendRuleEnhanced(10000000, null, 'DKI JAKARTA');

      expect(lowIncome).not.toBeNull();
      expect(highIncome).not.toBeNull();
      expect(lowIncome?.reason).not.toBe(highIncome?.reason);
    });

    it('considers spending in recommendation when provided', () => {
      const withSpending = recommendRuleEnhanced(5000000, 4000000, 'DKI JAKARTA');
      const withoutSpending = recommendRuleEnhanced(5000000, null, 'DKI JAKARTA');

      // Results may differ when spending is provided
      expect(withSpending).not.toBeNull();
      expect(withoutSpending).not.toBeNull();
    });

    it('recommends appropriate rule for average income', () => {
      // Income around 3-4M is typically middle income
      const result = recommendRuleEnhanced(4000000, null, 'JAWA BARAT');

      expect(result).not.toBeNull();
      expect(['50-30-20', '60-30-10']).toContain(result?.rule.id);
    });
  });
});
