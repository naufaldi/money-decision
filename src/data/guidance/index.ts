export { INCOME_GUIDANCE_NODES } from './income';
export { EXPENSES_GUIDANCE_NODES } from './expenses';
export { RULES_GUIDANCE_NODES } from './rules';
export { RESULTS_GUIDANCE_NODES } from './results';
export { SANDWICH_GUIDANCE_NODES } from './sandwich';

import { INCOME_GUIDANCE_NODES } from './income';
import { EXPENSES_GUIDANCE_NODES } from './expenses';
import { RULES_GUIDANCE_NODES } from './rules';
import { RESULTS_GUIDANCE_NODES } from './results';
import { SANDWICH_GUIDANCE_NODES } from './sandwich';
import { GuidanceNode, GuidanceContext } from '@/types/guidance';

/** All guidance nodes combined */
export const ALL_GUIDANCE_NODES: GuidanceNode[] = [
  ...INCOME_GUIDANCE_NODES,
  ...EXPENSES_GUIDANCE_NODES,
  ...RULES_GUIDANCE_NODES,
  ...RESULTS_GUIDANCE_NODES,
  ...SANDWICH_GUIDANCE_NODES,
];

/** Build guidance context from wizard state */
export function buildGuidanceContext(params: {
  income: number | null;
  incomeType: 'fixed' | 'variable' | 'mixed';
  expenses: number | null;
  expensesByCategory: Record<string, number>;
  selectedRule: string;
  province: string | null;
  hasDebt: boolean;
  debtAmount: number | null;
  debtInterest: number | null;
  debtType: string | null;
  debtPaymentMonthly: number | null;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  hasElderlyParents: boolean;
  hasOtherFamily: boolean;
  familySupportAmount: number | null;
  hasPinjolDebt: boolean;
  pinjolDebtAmount: number | null;
  pinjolDebtInterest: number | null;
  pinjolCount: number;
}): GuidanceContext {
  const {
    income,
    incomeType,
    expenses,
    expensesByCategory,
    selectedRule,
    province,
    hasDebt,
    debtAmount,
    debtInterest,
    debtType,
    debtPaymentMonthly,
    riskProfile,
    hasElderlyParents,
    hasOtherFamily,
    familySupportAmount,
    hasPinjolDebt,
    pinjolDebtAmount,
    pinjolDebtInterest,
    pinjolCount,
  } = params;

  const isSandwichGeneration = hasElderlyParents || hasOtherFamily;
  const dependentsCount = (hasElderlyParents ? 1 : 0) + (hasOtherFamily ? 1 : 0);
  const discretionaryIncome =
    income && familySupportAmount
      ? Math.max(0, income - familySupportAmount)
      : income;

  const savingsRate = income && expenses ? 1 - expenses / income : null;
  const debtToIncomeRatio = income && hasDebt ? (debtPaymentMonthly || 0) / income : null;
  const monthlyDebtPayment = debtPaymentMonthly || 0;

  return {
    income,
    incomeType,
    expenses,
    expensesByCategory,
    selectedRule,
    province,
    hasDebt,
    debtAmount,
    debtInterest,
    debtType: debtType as GuidanceContext['debtType'],
    debtPaymentMonthly: monthlyDebtPayment > 0 ? monthlyDebtPayment : null,
    savingsRate,
    emergencyFundMonths: null,
    riskProfile,
    investmentExperience: 'beginner',
    isSandwichGeneration,
    hasElderlyParents,
    hasOtherFamily,
    familySupportAmount,
    dependentsCount,
    hasPinjolDebt,
    pinjolDebtAmount,
    pinjolDebtInterest,
    pinjolCount,
    discretionaryIncome,
    savingsGap:
      savingsRate !== null && income
        ? Math.max(0, income * 0.15 - income * (savingsRate || 0))
        : null,
    debtToIncomeRatio,
  };
}

/** Get relevant guidance nodes for a specific step */
export function getGuidanceForStep(
  step: 1 | 2 | 3 | 4,
  context: GuidanceContext
): GuidanceNode[] {
  const stepNodeMap: Record<number, string[]> = {
    1: ['income', 'sandwich', 'pinjol'],
    2: ['expenses', 'debt', 'savings'],
    3: ['budget-rules', 'sandwich', 'debt'],
    4: ['savings', 'investments', 'emergency-fund', 'debt', 'pinjol', 'sandwich'],
  };

  const relevantCategories = stepNodeMap[step] || [];

  return ALL_GUIDANCE_NODES.filter(
    (node) =>
      relevantCategories.includes(node.category || '') ||
      (step === 1 && node.id.startsWith('income')) ||
      (step === 2 && node.id.startsWith('expenses')) ||
      (step === 3 && node.id.startsWith('rule')) ||
      (step === 4 && node.id.startsWith('results'))
  );
}

/** Filter nodes by category */
export function getGuidanceByCategory(category: string): GuidanceNode[] {
  return ALL_GUIDANCE_NODES.filter((node) => node.category === category);
}

/** Get emergency/high priority nodes */
export function getEmergencyNodes(context: GuidanceContext): GuidanceNode[] {
  return ALL_GUIDANCE_NODES.filter(
    (node) =>
      (node.icon === 'emergency' || node.icon === 'warning') &&
      node.condition(context)
  );
}

export default {
  INCOME_GUIDANCE_NODES,
  EXPENSES_GUIDANCE_NODES,
  RULES_GUIDANCE_NODES,
  RESULTS_GUIDANCE_NODES,
  SANDWICH_GUIDANCE_NODES,
  ALL_GUIDANCE_NODES,
  buildGuidanceContext,
  getGuidanceForStep,
  getGuidanceByCategory,
  getEmergencyNodes,
};
