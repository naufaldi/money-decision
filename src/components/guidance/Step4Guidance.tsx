import { useMemo } from 'react';
import { DecisionTree } from './DecisionTree';
import {
  GuidanceContext,
  RESULTS_GUIDANCE_NODES,
  buildGuidanceContext,
} from '@/data/guidance';

interface Step4GuidanceProps {
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
  debtType: string | null;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  hasElderlyParents: boolean;
  hasYoungerSiblings: boolean;
  familySupportAmount: number | null;
  hasPinjolDebt: boolean;
  pinjolDebtAmount: number | null;
  pinjolDebtInterest: number | null;
  pinjolCount: number;
  emergencyFundMonths?: number;
}

export function Step4Guidance({
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
  debtType,
  riskProfile,
  hasElderlyParents,
  hasYoungerSiblings,
  familySupportAmount,
  hasPinjolDebt,
  pinjolDebtAmount,
  pinjolDebtInterest,
  pinjolCount,
  emergencyFundMonths,
}: Step4GuidanceProps) {
  const context = useMemo(
    () => {
      const baseContext = buildGuidanceContext({
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
        debtPaymentMonthly: debtPaymentMonthly || null,
        riskProfile,
        hasElderlyParents,
        hasYoungerSiblings,
        familySupportAmount,
        hasPinjolDebt,
        pinjolDebtAmount,
        pinjolDebtInterest,
        pinjolCount,
      });
      return {
        ...baseContext,
        emergencyFundMonths,
      };
    },
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
      debtType,
      debtPaymentMonthly,
      riskProfile,
      hasElderlyParents,
      hasYoungerSiblings,
      familySupportAmount,
      hasPinjolDebt,
      pinjolDebtAmount,
      pinjolDebtInterest,
      pinjolCount,
      emergencyFundMonths,
    ]
  );

  const matchingNodes = useMemo(
    () => RESULTS_GUIDANCE_NODES.filter((node) => node.condition(context)),
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
        title="Your Action Plan"
        maxDisplay={5}
        showCategories
      />
    </div>
  );
}

export default Step4Guidance;
