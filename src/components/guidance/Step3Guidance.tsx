import { useMemo } from 'react';
import { DecisionTree } from './DecisionTree';
import {
  GuidanceContext,
  RULES_GUIDANCE_NODES,
  buildGuidanceContext,
} from '@/data/guidance';

interface Step3GuidanceProps {
  income: number | null;
  incomeType: 'fixed' | 'variable' | 'mixed';
  expenses: number | null;
  expensesByCategory: Record<string, number>;
  selectedRule: string;
  province: string | null;
  hasDebt: boolean;
  debtAmount: number | null;
  debtInterest: number | null;
  debtPaymentMonthly: number | null;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  hasElderlyParents: boolean;
  hasYoungerSiblings: boolean;
  familySupportAmount: number | null;
  hasPinjolDebt: boolean;
  pinjolDebtAmount: number | null;
  pinjolDebtInterest: number | null;
  pinjolCount: number;
}

export function Step3Guidance({
  income,
  incomeType,
  expenses,
  expensesByCategory,
  selectedRule,
  province,
  hasDebt,
  debtAmount,
  debtInterest,
  debtPaymentMonthly,
  riskProfile,
  hasElderlyParents,
  hasYoungerSiblings,
  familySupportAmount,
  hasPinjolDebt,
  pinjolDebtAmount,
  pinjolDebtInterest,
  pinjolCount,
}: Step3GuidanceProps) {
  const context = useMemo(
    () =>
      buildGuidanceContext({
        income,
        incomeType,
        expenses,
        expensesByCategory,
        selectedRule,
        province,
        hasDebt,
        debtAmount,
        debtInterest,
        debtType: hasPinjolDebt ? 'pinjol' : null,
        debtPaymentMonthly: debtPaymentMonthly || null,
        riskProfile,
        hasElderlyParents,
        hasYoungerSiblings,
        familySupportAmount,
        hasPinjolDebt,
        pinjolDebtAmount,
        pinjolDebtInterest,
        pinjolCount,
      }),
    [
      income,
      incomeType,
      expenses,
      expensesByCategory,
      selectedRule,
      province,
      hasDebt,
      debtAmount,
      debtInterest,
      debtPaymentMonthly,
      riskProfile,
      hasElderlyParents,
      hasYoungerSiblings,
      familySupportAmount,
      hasPinjolDebt,
      pinjolDebtAmount,
      pinjolDebtInterest,
      pinjolCount,
    ]
  );

  const matchingNodes = useMemo(
    () => RULES_GUIDANCE_NODES.filter((node) => node.condition(context)),
    [context]
  );

  if (matchingNodes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <DecisionTree
        nodes={matchingNodes}
        context={context}
        title="Budget Rule Insights"
        maxDisplay={3}
        showCategories
      />
    </div>
  );
}

export default Step3Guidance;
