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

interface CutNeededWarningProps {
  allocation: { savings: number };
  cutNeeded: number;
  comparison: ReturnType<typeof compareAllocations>;
  expenses: number;
}

function CutNeededWarning({ allocation, cutNeeded, comparison, expenses }: CutNeededWarningProps) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <TrendingDown className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="font-medium text-amber-800">
            To reach your target savings of {formatCurrency(allocation.savings)}/mo
          </p>
          <p className="mt-1 text-sm text-amber-700">
            Reduce spending by <span className="font-semibold">{formatCurrency(cutNeeded)}/month</span>
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
            <span>Target spending: {formatCurrency((comparison?.target.needs ?? 0) + (comparison?.target.wants ?? 0))}</span>
            <ArrowRight className="h-3 w-3" />
            <span>Current spending: {formatCurrency(expenses)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PerfectFitSuccessProps {
  allocation: { savings: number };
}

function PerfectFitSuccess({ allocation }: PerfectFitSuccessProps) {
  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
        <div>
          <p className="font-medium text-green-800">
            Your spending fits this budget rule perfectly!
          </p>
          <p className="mt-1 text-sm text-green-700">
            You can save {formatCurrency(allocation.savings)}/month without changing your lifestyle.
          </p>
        </div>
      </div>
    </div>
  );
}

interface AllocationComparisonProps {
  comparison: ReturnType<typeof compareAllocations>;
}

function AllocationComparison({ comparison }: AllocationComparisonProps) {
  return (
    <div className="border-t pt-4">
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">Allocation Comparison</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <p className="mb-1 text-xs text-muted-foreground">Category</p>
          <p className="text-xs font-medium">Target</p>
          <p className="text-xs font-medium text-muted-foreground">Current</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <p className="mb-1 text-xs text-muted-foreground">Needs</p>
          <p className="text-sm font-semibold">{formatCurrency(comparison?.target.needs ?? 0)}</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(comparison?.adjusted.needs ?? 0)}</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <p className="mb-1 text-xs text-muted-foreground">Wants</p>
          <p className="text-sm font-semibold">{formatCurrency(comparison?.target.wants ?? 0)}</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(comparison?.adjusted.wants ?? 0)}</p>
        </div>
      </div>
    </div>
  );
}

export function Step4Results({ data }: Step4ResultsProps) {
  const results = useMemo(() => {
    if (!data.income || data.income <= 0) return null;
    const estimatedExpenses = data.expenses ?? data.income * 0.7 * 0.6;
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
  const income = data.income ?? 1;

  const needsPercent = Math.round((allocation.needs / income) * 100);
  const savingsPercent = Math.round((allocation.savings / income) * 100);
  const wantsPercent = Math.round((allocation.wants / income) * 100);

  const hasEnteredExpenses = !!data.expenses && data.expenses > 0;
  const showComparison = hasEnteredExpenses && !!comparison;

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-bold">
          <CalculatorIcon className="h-8 w-8 text-primary" />
          Money Decision
        </h1>
        <p className="text-muted-foreground">Your personalized budget allocation</p>
      </div>

      {!!showComparison && cutNeeded > 0 && (
        <CutNeededWarning
          allocation={allocation}
          cutNeeded={cutNeeded}
          comparison={comparison}
          expenses={data.expenses ?? 0}
        />
      )}

      {!!showComparison && cutNeeded === 0 && (
        <PerfectFitSuccess allocation={allocation} />
      )}

      <DailyLifeBreakdown amount={allocation.needs} percentage={needsPercent} />

      <SavingsBreakdown amount={allocation.savings} percentage={savingsPercent} />

      <InvestmentBreakdown
        amount={allocation.wants}
        percentage={wantsPercent}
        riskProfile={data.riskProfile}
        recommendations={investmentBreakdown.recommendations}
      />

      {!!showComparison && !!comparison && (
        <AllocationComparison comparison={comparison} />
      )}
    </div>
  );
}
