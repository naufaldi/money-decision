import {
  BudgetRule,
  RiskProfile,
  AllocationResult,
  SavingsBreakdown,
  InvestmentBreakdown,
  CalculatorResult
} from '@/types';
import {
  BUDGET_RULES,
  INVESTMENT_RECOMMENDATIONS,
  SAVINGS_BREAKDOWN,
  EMERGENCY_FUND_MONTHS
} from '@/constants/rules';

/**
 * Calculate allocation based on income and budget rule
 */
export function calculateAllocation(income: number, ruleId: string): AllocationResult {
  const rule = BUDGET_RULES.find(r => r.id === ruleId) ?? BUDGET_RULES[1]; // Default to 60/30/10

  return {
    needs: income * rule.allocation.needs,
    savings: income * rule.allocation.savings,
    wants: income * rule.allocation.wants
  };
}

/**
 * Calculate savings breakdown (emergency fund, short-term, long-term)
 */
export function calculateSavingsBreakdown(
  savingsAmount: number,
  monthlyExpenses: number
): SavingsBreakdown {
  const emergencyFund = savingsAmount * SAVINGS_BREAKDOWN.emergencyFund;
  const shortTermGoals = savingsAmount * SAVINGS_BREAKDOWN.shortTermGoals;
  const longTermGoals = savingsAmount * SAVINGS_BREAKDOWN.longTermGoals;
  const emergencyFundTarget = monthlyExpenses * EMERGENCY_FUND_MONTHS;

  return {
    emergencyFund,
    shortTermGoals,
    longTermGoals,
    emergencyFundTarget
  };
}

/**
 * Calculate investment breakdown based on risk profile
 */
export function calculateInvestmentBreakdown(
  investmentAmount: number,
  riskProfile: RiskProfile
): InvestmentBreakdown {
  const recommendations = INVESTMENT_RECOMMENDATIONS[riskProfile].map(rec => ({
    ...rec,
    amount: investmentAmount * rec.percentage
  }));

  return {
    recommendations,
    totalInvestment: investmentAmount
  };
}

/**
 * Calculate all results for the calculator
 */
export function calculateResults(
  income: number,
  ruleId: string,
  riskProfile: RiskProfile,
  monthlyExpenses: number
): CalculatorResult {
  const allocation = calculateAllocation(income, ruleId);
  const savingsBreakdown = calculateSavingsBreakdown(allocation.savings, monthlyExpenses);
  const investmentBreakdown = calculateInvestmentBreakdown(allocation.wants, riskProfile);

  return {
    allocation,
    savingsBreakdown,
    investmentBreakdown
  };
}

/**
 * Get budget rule by ID
 */
export function getBudgetRule(ruleId: string): BudgetRule {
  return BUDGET_RULES.find(r => r.id === ruleId) ?? BUDGET_RULES[1];
}

/**
 * Calculate needs percentage from rule
 */
export function getNeedsPercentage(ruleId: string): number {
  return getBudgetRule(ruleId).allocation.needs;
}

/**
 * Calculate how many months of emergency fund the savings will cover
 */
export function getEmergencyFundMonths(savingsAmount: number, monthlyExpenses: number): number {
  if (monthlyExpenses <= 0) return 0;
  return Math.floor(savingsAmount * SAVINGS_BREAKDOWN.emergencyFund / monthlyExpenses);
}
