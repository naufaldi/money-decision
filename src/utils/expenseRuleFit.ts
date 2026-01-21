import { BUDGET_RULES, type BudgetRule } from '@/constants/rules';
import SALARY_DATA from '@/data/salary/avg_wages_total_august_2025.json';
import { calculatePercentile, getProvinceGini } from '@/utils/salaryPercentile';

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

export interface EnhancedRecommendation {
  rule: BudgetRule;
  reason: string;
  scores: {
    income: number;
    fit: number;
    cushion: number;
    total: number;
  };
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

// Constants
const NATIONAL_AVG_WAGE = 3500000;
const INCOME_WEIGHT = 0.40;
const FIT_WEIGHT = 0.35;
const CUSHION_WEIGHT = 0.25;

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

/**
 * Get the average wage for a province, falling back to national average if not found.
 */
export function getProvinceAverageWage(province: string | null | undefined): number {
  if (!province) return NATIONAL_AVG_WAGE;

  const provinceUpper = province.toUpperCase();
  const data = SALARY_DATA.find(
    (item) => item.province.toUpperCase() === provinceUpper
  );

  return data?.total_august_2025 ?? NATIONAL_AVG_WAGE;
}

/**
 * Calculate how well a rule's allocation matches the user's income position.
 * Returns a score from 0 to 1, where 1 is a perfect match.
 */
function calculateIncomeScore(income: number, province: string | null | undefined): { rule: BudgetRule; score: number }[] {
  const meanWage = getProvinceAverageWage(province);
  const gini = getProvinceGini(province ?? '');
  const percentile = calculatePercentile(income, meanWage, gini);

  // Define ideal savings rate based on income percentile
  let idealSavingsRate: number;
  let idealNeedsRate: number;
  let idealWantsRate: number;

  if (percentile < 25) {
    // Low income: prioritize needs, minimal savings
    idealNeedsRate = 0.70;
    idealWantsRate = 0.20;
    idealSavingsRate = 0.10;
  } else if (percentile < 50) {
    // Lower-middle income
    idealNeedsRate = 0.65;
    idealWantsRate = 0.25;
    idealSavingsRate = 0.10;
  } else if (percentile < 75) {
    // Upper-middle income
    idealNeedsRate = 0.55;
    idealWantsRate = 0.25;
    idealSavingsRate = 0.20;
  } else {
    // High income: can save more
    idealNeedsRate = 0.50;
    idealWantsRate = 0.30;
    idealSavingsRate = 0.20;
  }

  // Score each rule based on how close its allocation is to ideal
  return BUDGET_RULES.map((rule) => {
    const savingsDiff = Math.abs(rule.allocation.savings - idealSavingsRate);
    const needsDiff = Math.abs(rule.allocation.needs - idealNeedsRate);
    const wantsDiff = Math.abs(rule.allocation.wants - idealWantsRate);

    // Combined difference (lower is better)
    const totalDiff = (savingsDiff + needsDiff + wantsDiff) / 3;

    // Convert to score (1 - diff, capped at 0)
    return {
      rule,
      score: Math.max(0, 1 - totalDiff * 2),
    };
  });
}

/**
 * Calculate how well the user's spending fits each rule.
 * Returns a score from 0 to 1, where 1 is a perfect fit.
 */
function calculateFitScore(income: number, expenses: number | null): number[] {
  const expenseValue = expenses ?? income * 0.70; // Default to 70% if not provided
  const spendingRatio = income > 0 ? expenseValue / income : 0.70;

  // Ideal spending ratio is 70% (30% savings) for most users
  const idealRatio = 0.70;
  const deviation = Math.abs(spendingRatio - idealRatio);

  // Convert to score - penalize deviation from ideal
  return BUDGET_RULES.map(() => Math.max(0, 1 - deviation * 2));
}

/**
 * Calculate financial cushion score based on how much room the user has.
 * Higher cushion = higher score.
 */
function calculateCushionScore(income: number, expenses: number | null): number[] {
  const expenseValue = expenses ?? income * 0.70;
  const cushion = income > 0 ? (income - expenseValue) / income : 0;

  // Normalize cushion: 0% cushion = 0.3 score, 30% cushion = 1.0 score
  const normalizedScore = Math.min(1, Math.max(0, cushion + 0.3));

  return BUDGET_RULES.map(() => normalizedScore);
}

/**
 * Generate a personalized reason for the recommendation.
 */
function generateReason(
  rule: BudgetRule,
  percentile: number
): string {
  if (percentile < 25) {
    return `Based on your income level, this rule provides higher needs allocation (${(rule.allocation.needs * 100).toFixed(0)}%) to help cover essential expenses while still saving ${(rule.allocation.savings * 100).toFixed(0)}%.`;
  } else if (percentile < 50) {
    return `Your income is slightly below average, so this rule balances needs (${(rule.allocation.needs * 100).toFixed(0)}%) with savings (${(rule.allocation.savings * 100).toFixed(0)}%) for sustainable budgeting.`;
  } else if (percentile < 75) {
    return `With your income level, this rule offers a balanced approach with ${(rule.allocation.savings * 100).toFixed(0)}% savings and ${(rule.allocation.needs * 100).toFixed(0)}% for needs.`;
  } else {
    return `As a higher earner, this rule maximizes your savings potential at ${(rule.allocation.savings * 100).toFixed(0)}% while maintaining ${(rule.allocation.needs * 100).toFixed(0)}% for needs.`;
  }
}

/**
 * Enhanced recommendation function that uses multiple factors:
 * - Income percentile within province (40%)
 * - Spending fit score (35%) - only if spending provided
 * - Financial cushion score (25%)
 */
export function recommendRuleEnhanced(
  income: number,
  expenses: number | null,
  province: string | null | undefined
): EnhancedRecommendation | null {
  if (!income || income <= 0) return null;

  const hasSpendingData = expenses !== null && expenses !== undefined;
  const expenseValue = hasSpendingData ? expenses : income * 0.70;
  const fits = calculateRuleFits(income, expenseValue);

  // Calculate scores for each factor
  const incomeScores = calculateIncomeScore(income, province ?? undefined);
  const fitScores = calculateFitScore(income, hasSpendingData ? expenses : null);
  const cushionScores = calculateCushionScore(income, hasSpendingData ? expenses : null);

  // Calculate weighted total score for each rule
  const scoredRules = BUDGET_RULES.map((rule, index) => {
    const incomeScore = incomeScores[index]?.score ?? 0;
    const fitScore = hasSpendingData ? fitScores[index] : fitScores[0]; // Use first if no spending data
    const cushionScore = cushionScores[index];

    // Adjust weights if no spending data - income dominates
    const totalScore = hasSpendingData
      ? incomeScore * INCOME_WEIGHT + fitScore * FIT_WEIGHT + cushionScore * CUSHION_WEIGHT
      : incomeScore * 0.75 + cushionScore * 0.25; // Income dominates when no spending data

    return {
      rule,
      scores: {
        income: incomeScore,
        fit: fitScore,
        cushion: cushionScore,
        total: totalScore,
      },
    };
  });

  // Find best scoring rule
  const bestScored = scoredRules.reduce((best, current) =>
    current.scores.total > best.scores.total ? current : best
  );

  // Calculate percentile for reason generation
  const meanWage = getProvinceAverageWage(province ?? undefined);
  const gini = getProvinceGini(province ?? '');
  const percentile = calculatePercentile(income, meanWage, gini);

  return {
    rule: bestScored.rule,
    reason: generateReason(bestScored.rule, percentile),
    scores: bestScored.scores,
    allFits: fits,
  };
}
