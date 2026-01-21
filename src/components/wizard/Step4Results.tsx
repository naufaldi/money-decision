import { useMemo } from 'react';
import { calculateResults } from '@/utils/calculators';
import { compareAllocations, getCutNeeded } from '@/utils/expenseRuleFit';
import { Calculator as CalculatorIcon } from 'lucide-react';
import { DailyLifeBreakdown } from '@/components/DailyLifeBreakdown';
import { SavingsBreakdown } from '@/components/SavingsBreakdown';
import { InvestmentBreakdown } from '@/components/InvestmentBreakdown';
import { formatCurrency } from '@/utils/formatters';
import { ArrowRight, AlertTriangle, TrendingDown } from 'lucide-react';

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

  const comparison = useMemo(() => {
    if (!data.income || data.income <= 0) return null;
    return compareAllocations(data.income, data.expenses, data.selectedRuleId);
  }, [data]);

  const cutNeeded = useMemo(() => {
    if (!data.income || data.income <= 0) return 0;
    return getCutNeeded(data.income, data.expenses, data.selectedRuleId);
  }, [data]);

  if (!results) return null;

  const { allocation, investmentBreakdown } = results;
  const income = data.income || 1;

  const needsPercent = Math.round((allocation.needs / income) * 100);
  const savingsPercent = Math.round((allocation.savings / income) * 100);
  const wantsPercent = Math.round((allocation.wants / income) * 100);

  const hasEnteredExpenses = data.expenses && data.expenses > 0;
  const showComparison = hasEnteredExpenses && comparison;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <CalculatorIcon className="w-8 h-8 text-primary" />
          Money Decision
        </h1>
        <p className="text-muted-foreground">Your personalized budget allocation</p>
      </div>

      {showComparison && cutNeeded > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <TrendingDown className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">
                To reach your target savings of {formatCurrency(allocation.savings)}/mo
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Reduce spending by <span className="font-semibold">{formatCurrency(cutNeeded)}/month</span>
              </p>
              <div className="flex items-center gap-2 mt-3 text-xs text-amber-600">
                <span>Target spending: {formatCurrency(comparison!.target.needs + comparison!.target.wants)}</span>
                <ArrowRight className="w-3 h-3" />
                <span>Current spending: {formatCurrency(data.expenses!)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showComparison && cutNeeded === 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">
                Your spending fits this budget rule perfectly!
              </p>
              <p className="text-sm text-green-700 mt-1">
                You can save {formatCurrency(allocation.savings)}/month without changing your lifestyle.
              </p>
            </div>
          </div>
        </div>
      )}

      <DailyLifeBreakdown amount={allocation.needs} percentage={needsPercent} />

      <SavingsBreakdown amount={allocation.savings} percentage={savingsPercent} />

      <InvestmentBreakdown
        amount={allocation.wants}
        percentage={wantsPercent}
        riskProfile={data.riskProfile}
        recommendations={investmentBreakdown.recommendations}
      />

      {showComparison && (
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Allocation Comparison</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Category</p>
              <p className="text-xs font-medium">Target</p>
              <p className="text-xs font-medium text-muted-foreground">Current</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Needs</p>
              <p className="text-sm font-semibold">{formatCurrency(comparison!.target.needs)}</p>
              <p className="text-sm text-muted-foreground">{formatCurrency(comparison!.adjusted.needs)}</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Wants</p>
              <p className="text-sm font-semibold">{formatCurrency(comparison!.target.wants)}</p>
              <p className="text-sm text-muted-foreground">{formatCurrency(comparison!.adjusted.wants)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
