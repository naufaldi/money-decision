import {
  BudgetRule,
  RiskProfile,
  AllocationResult,
  SavingsBreakdown,
  InvestmentBreakdown,
  CalculatorResult,
} from '@/types';
import {
  BUDGET_RULES,
  INVESTMENT_RECOMMENDATIONS,
  SAVINGS_BREAKDOWN,
  EMERGENCY_FUND_MONTHS,
} from '@/constants/rules';
import { getPinjolRiskLevel, calculateRequiredPayment, calculateMonthlyInterest } from './pinjolCalculator';

/**
 * Family context for adjusted calculations
 */
export interface FamilyContext {
  familySupportAmount: number | null;
  hasPinjolDebt: boolean;
  pinjolDebtAmount: number | null;
  pinjolMonthlyInterest: number | null;
  hasElderlyParents: boolean;
  hasOtherFamily: boolean;
}

/**
 * Sandwich generation income adjustment result
 */
export interface SandwichAdjustment {
  originalIncome: number;
  familySupport: number;
  adjustedIncome: number;
  supportBurden: number; // Percentage
  isSandwichGeneration: boolean;
}

/**
 * Pinjol risk assessment result
 */
export interface PinjolRiskAssessment {
  hasPinjolDebt: boolean;
  riskLevel: 'none' | 'low' | 'moderate' | 'high' | 'critical';
  recommendPayoffFirst: boolean;
  message: string;
}

/**
 * Adjust income for sandwich generation family support
 */
export function adjustIncomeForFamilySupport(
  income: number,
  familySupport: number | null,
  hasElderlyParents: boolean,
  hasOtherFamily: boolean
): SandwichAdjustment {
  const support = familySupport ?? 0;
  const isSandwichGeneration = hasElderlyParents || hasOtherFamily;

  return {
    originalIncome: income,
    familySupport: support,
    adjustedIncome: income - support,
    supportBurden: income > 0 ? (support / income) * 100 : 0,
    isSandwichGeneration,
  };
}

/**
 * Assess pinjol debt risk level
 */
export function assessPinjolRisk(
  hasPinjolDebt: boolean,
  monthlyInterest: number | null
): PinjolRiskAssessment {
  if (!hasPinjolDebt || !monthlyInterest) {
    return {
      hasPinjolDebt: false,
      riskLevel: 'none',
      recommendPayoffFirst: false,
      message: '',
    };
  }

  const riskData = getPinjolRiskLevel(monthlyInterest);
  const critical = riskData.level === 'critical' || riskData.level === 'high';

  return {
    hasPinjolDebt: true,
    riskLevel: riskData.level,
    recommendPayoffFirst: critical,
    message: riskData.message,
  };
}

/**
 * Calculate emergency fund months for sandwich generation
 */
export function getEmergencyFundMonthsTarget(isSandwichGeneration: boolean): number {
  return isSandwichGeneration ? 9 : EMERGENCY_FUND_MONTHS;
}

/**
 * Calculate recommended monthly Pinjol payment
 * Uses 24-month payoff target, with fallback to minimum payment (interest + small principal)
 */
export function calculatePinjolMonthlyPayment(
  debtAmount: number,
  monthlyInterestRate: number
): number {
  if (!debtAmount || !monthlyInterestRate || debtAmount <= 0 || monthlyInterestRate <= 0) {
    return 0;
  }

  try {
    // Try to calculate payment for 24-month payoff
    const requiredPayment = calculateRequiredPayment({
      principal: debtAmount,
      monthlyInterestRate: monthlyInterestRate,
      targetMonths: 24,
    });

    // Validate the payment is reasonable (not more than 50% of debt, not less than interest)
    const monthlyInterestCost = calculateMonthlyInterest(debtAmount, monthlyInterestRate);
    const maxReasonablePayment = debtAmount * 0.5; // Cap at 50% of debt per month

    if (requiredPayment >= monthlyInterestCost && requiredPayment <= maxReasonablePayment) {
      return Math.ceil(requiredPayment);
    }
  } catch (error) {
    // Fall through to fallback calculation
  }

  // Fallback: minimum payment = interest + small principal portion (5% annually = ~0.42% monthly)
  const monthlyInterestCost = calculateMonthlyInterest(debtAmount, monthlyInterestRate);
  const principalPortion = debtAmount * 0.05 / 12; // 5% of principal per year, divided by 12 months
  return Math.ceil(monthlyInterestCost + principalPortion);
}

/**
 * Calculate allocation based on income and budget rule
 */
export function calculateAllocation(income: number, ruleId: string): AllocationResult {
  const rule = BUDGET_RULES.find(r => r.id === ruleId) ?? BUDGET_RULES[1]; // Default to 60/30/10

  return {
    needs: income * rule.allocation.needs,
    savings: income * rule.allocation.savings,
    wants: income * rule.allocation.wants,
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
    emergencyFundTarget,
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
    amount: investmentAmount * rec.percentage,
  }));

  return {
    recommendations,
    totalInvestment: investmentAmount,
  };
}

/**
 * Calculate all results for the calculator with family context
 */
export function calculateResults(
  income: number,
  ruleId: string,
  riskProfile: RiskProfile,
  monthlyExpenses: number,
  familyContext?: FamilyContext
): CalculatorResult {
  // Adjust income for sandwich generation if applicable
  let effectiveIncome = income;
  if (familyContext) {
    const adjustment = adjustIncomeForFamilySupport(
      income,
      familyContext.familySupportAmount,
      familyContext.hasElderlyParents,
      familyContext.hasOtherFamily
    );
    effectiveIncome = adjustment.adjustedIncome;
  }

  // Subtract Pinjol debt payment if applicable
  let pinjolMonthlyPayment: number | undefined;
  if (familyContext?.hasPinjolDebt && familyContext.pinjolDebtAmount && familyContext.pinjolMonthlyInterest) {
    pinjolMonthlyPayment = calculatePinjolMonthlyPayment(
      familyContext.pinjolDebtAmount,
      familyContext.pinjolMonthlyInterest
    );
    effectiveIncome = Math.max(0, effectiveIncome - pinjolMonthlyPayment);
  }

  // Calculate allocations based on adjusted income (after sandwich and Pinjol deductions)
  const allocation = calculateAllocation(effectiveIncome, ruleId);
  const savingsBreakdown = calculateSavingsBreakdown(allocation.savings, monthlyExpenses);
  const investmentBreakdown = calculateInvestmentBreakdown(allocation.wants, riskProfile);

  return {
    allocation,
    savingsBreakdown,
    investmentBreakdown,
    pinjolMonthlyPayment,
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
  return Math.floor((savingsAmount * SAVINGS_BREAKDOWN.emergencyFund) / monthlyExpenses);
}
