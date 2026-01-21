import { useMemo } from 'react';
import { GuidanceCollapsible } from './GuidanceCollapsible';
import { DecisionTree } from './DecisionTree';
import {
  GuidanceContext,
  INCOME_GUIDANCE_NODES,
  SANDWICH_GUIDANCE_NODES,
  buildGuidanceContext,
} from '@/data/guidance';

interface Step1GuidanceProps {
  income: number | null;
  incomeType: 'fixed' | 'variable' | 'mixed';
  province: string | null;
  hasElderlyParents: boolean;
  hasYoungerSiblings: boolean;
  hasPinjolDebt: boolean;
  familySupportAmount: number | null;
  pinjolDebtAmount: number | null;
  pinjolDebtInterest: number | null;
  pinjolCount: number;
  selectedRule: string;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
}

export function Step1Guidance({
  income,
  incomeType,
  province,
  hasElderlyParents,
  hasYoungerSiblings,
  hasPinjolDebt,
  familySupportAmount,
  pinjolDebtAmount,
  pinjolDebtInterest,
  pinjolCount,
  selectedRule,
  riskProfile,
}: Step1GuidanceProps) {
  const context = useMemo(
    () =>
      buildGuidanceContext({
        income,
        incomeType,
        expenses: null,
        expensesByCategory: {},
        selectedRule,
        province,
        hasDebt: hasPinjolDebt,
        debtAmount: pinjolDebtAmount,
        debtInterest: pinjolDebtInterest,
        debtType: hasPinjolDebt ? 'pinjol' : null,
        debtPaymentMonthly: null,
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
      selectedRule,
      province,
      hasPinjolDebt,
      pinjolDebtAmount,
      pinjolDebtInterest,
      riskProfile,
      hasElderlyParents,
      hasYoungerSiblings,
      familySupportAmount,
      pinjolCount,
    ]
  );

  const incomeNodes = useMemo(
    () => INCOME_GUIDANCE_NODES.filter((node) => node.condition(context)),
    [context]
  );

  const sandwichNodes = useMemo(
    () => SANDWICH_GUIDANCE_NODES.filter((node) => node.condition(context)),
    [context]
  );

  const allNodes = useMemo(
    () => [...incomeNodes, ...sandwichNodes].sort((a, b) => a.priority - b.priority),
    [incomeNodes, sandwichNodes]
  );

  if (income === null) {
    return (
      <GuidanceCollapsible
        title="Income Guidance"
        icon="info"
        defaultOpen={false}
        context={context}
        nodes={INCOME_GUIDANCE_NODES.filter((n) =>
          n.id.includes('salary-insights')
        )}
      />
    );
  }

  if (allNodes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <DecisionTree
        nodes={allNodes}
        context={context}
        title="Personalized Guidance"
        maxDisplay={3}
        showCategories
      />
    </div>
  );
}

export default Step1Guidance;
