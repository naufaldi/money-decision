import { useMemo } from 'react';
import { calculateResults } from '@/utils/calculators';
import { Calculator as CalculatorIcon } from 'lucide-react';
import { DailyLifeBreakdown } from '@/components/DailyLifeBreakdown';
import { SavingsBreakdown } from '@/components/SavingsBreakdown';
import { InvestmentBreakdown } from '@/components/InvestmentBreakdown';

interface Step4ResultsProps {
  data: {
    income: number | null;
    expenses: number | null;
    selectedRuleId: string;
    riskProfile: 'conservative' | 'moderate' | 'aggressive';
  };
}

export function Step4Results({ data }: Step4ResultsProps) {
  const results = useMemo(() => {
    if (!data.income || data.income <= 0) return null;
    const estimatedExpenses = data.expenses || data.income * 0.7 * 0.6;
    return calculateResults(data.income, data.selectedRuleId, data.riskProfile, estimatedExpenses);
  }, [data]);

  if (!results) return null;

  const { allocation, investmentBreakdown } = results;
  const income = data.income || 1;

  // Calculate percentages from absolute allocation values
  const needsPercent = Math.round((allocation.needs / income) * 100);
  const savingsPercent = Math.round((allocation.savings / income) * 100);
  const wantsPercent = Math.round((allocation.wants / income) * 100);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <CalculatorIcon className="w-8 h-8 text-primary" />
          Money Decision
        </h1>
        <p className="text-muted-foreground">Your personalized budget allocation</p>
      </div>

      <DailyLifeBreakdown amount={allocation.needs} percentage={needsPercent} />

      <SavingsBreakdown amount={allocation.savings} percentage={savingsPercent} />

      <InvestmentBreakdown
        amount={allocation.wants}
        percentage={wantsPercent}
        riskProfile={data.riskProfile}
        recommendations={investmentBreakdown.recommendations}
      />
    </div>
  );
}
