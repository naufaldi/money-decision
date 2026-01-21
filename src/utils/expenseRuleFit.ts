import { BUDGET_RULES, type BudgetRule } from '@/constants/rules';

export interface ExpenseMetrics {
  income: number;
  expenses: number;
  cashflow: number;
  spendingRatio: number;
  savingsCapacity: number;
  isDeficit: boolean;
}

export interface RuleFit {
  rule: BudgetRule;
  requiredSavings: number;
  targetSpending: number;
  cutNeeded: number;
  isFeasible: boolean;
}

export interface RecommendedRule {
  rule: BudgetRule;
  reason: string;
  allFits: RuleFit[];
}

export interface AdjustedAllocation {
  needs: number;
  wants: number;
  savings: number;
  spendingBudget: number;
  cutNeeded: number;
}

export interface AllocationComparison {
  target: {
    needs: number;
    wants: number;
    savings: number;
  };
  adjusted: AdjustedAllocation;
}

/**
 * Compute basic expense metrics from income and expenses.
 */
export function computeExpenseMetrics(
  income: number,
  expenses: number | null
): ExpenseMetrics {
  const expenseValue = expenses ?? 0;
  const cashflow = income - expenseValue;
  const savingsCapacity = Math.max(0, cashflow);
  const spendingRatio = income > 0 ? expenseValue / income : 0;

  return {
    income,
    expenses: expenseValue,
    cashflow,
    spendingRatio,
    savingsCapacity,
    isDeficit: cashflow < 0,
  };
}

/**
 * Calculate how each rule fits the user's current spending.
 */
function calculateRuleFits(income: number, expenses: number): RuleFit[] {
  return BUDGET_RULES.map((rule) => {
    const requiredSavings = income * rule.allocation.savings;
    const targetSpending = income - requiredSavings;
    const cutNeeded = Math.max(0, expenses - targetSpending);

    return {
      rule,
      requiredSavings,
      targetSpending,
      cutNeeded,
      isFeasible: cutNeeded === 0,
    };
  });
}

/**
 * Recommend the best budget rule based on user's spending.
 */
export function recommendRule(
  income: number,
  expenses: number | null
): RecommendedRule | null {
  if (!income || income <= 0) return null;

  const expenseValue = expenses ?? 0;
  const fits = calculateRuleFits(income, expenseValue);
  const feasibleFits = fits.filter((f) => f.isFeasible);

  let bestFit: RuleFit;
  let reason: string;

  if (feasibleFits.length > 0) {
    // Pick the rule with highest savings among feasible ones
    bestFit = feasibleFits.reduce((best, current) =>
      current.requiredSavings > best.requiredSavings ? current : best
    );
    reason = 'Your current spending fits this rule with no changes needed.';
  } else {
    // Pick the rule with smallest cut needed
    bestFit = fits.reduce((best, current) =>
      current.cutNeeded < best.cutNeeded ? current : best
    );
    reason = `Based on your current spending, this requires the smallest cut (Rp ${bestFit.cutNeeded.toLocaleString()}/mo).`;
  }

  return {
    rule: bestFit.rule,
    reason,
    allFits: fits,
  };
}

/**
 * Calculate adjusted allocation based on user's actual spending.
 * This splits current spending between needs/wants using the rule's ratio.
 */
export function computeAdjustedAllocation(
  income: number,
  expenses: number | null,
  ruleId: string
): AdjustedAllocation {
  const rule = BUDGET_RULES.find((r) => r.id === ruleId) ?? BUDGET_RULES[0];
  const expenseValue = expenses ?? 0;

  const spendingBudget = Math.min(expenseValue, income);
  const adjustedSavings = Math.max(0, income - spendingBudget);

  // Split spending between needs and wants based on rule's ratio
  const needsShare = rule.allocation.needs / (rule.allocation.needs + rule.allocation.wants);
  const wantsShare = rule.allocation.wants / (rule.allocation.needs + rule.allocation.wants);

  const adjustedNeeds = spendingBudget * needsShare;
  const adjustedWants = spendingBudget * wantsShare;

  const targetSpending = income - income * rule.allocation.savings;
  const cutNeeded = Math.max(0, expenseValue - targetSpending);

  return {
    needs: Math.round(adjustedNeeds),
    wants: Math.round(adjustedWants),
    savings: Math.round(adjustedSavings),
    spendingBudget,
    cutNeeded,
  };
}

/**
 * Compare target allocation (rule ideal) with adjusted allocation (current reality).
 */
export function compareAllocations(
  income: number,
  expenses: number | null,
  ruleId: string
): AllocationComparison {
  const rule = BUDGET_RULES.find((r) => r.id === ruleId) ?? BUDGET_RULES[0];

  const target = {
    needs: Math.round(income * rule.allocation.needs),
    wants: Math.round(income * rule.allocation.wants),
    savings: Math.round(income * rule.allocation.savings),
  };

  const adjusted = computeAdjustedAllocation(income, expenses, ruleId);

  return { target, adjusted };
}

/**
 * Get cut needed to reach target savings for a specific rule.
 */
export function getCutNeeded(
  income: number,
  expenses: number | null,
  ruleId: string
): number {
  const rule = BUDGET_RULES.find((r) => r.id === ruleId) ?? BUDGET_RULES[0];
  const expenseValue = expenses ?? 0;
  const targetSpending = income - income * rule.allocation.savings;
  return Math.max(0, expenseValue - targetSpending);
}

/**
 * Format spending ratio as a readable percentage.
 */
export function formatSpendingRatio(ratio: number): string {
  const percentage = Math.round(ratio * 100);
  if (percentage > 100) return `${percentage}% (over budget)`;
  if (percentage > 80) return `${percentage}% (high)`;
  if (percentage > 60) return `${percentage}% (moderate)`;
  return `${percentage}% (low)`;
}
