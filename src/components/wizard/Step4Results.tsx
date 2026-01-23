import { useMemo, useState } from 'react';
import { calculateResults } from '@/utils/calculators';
import { compareAllocations, getCutNeeded } from '@/utils/expenseRuleFit';
import { calculatePayoffForecast, formatPayoffForecast } from '@/utils/pinjolCalculator';
import { Calculator as CalculatorIcon } from 'lucide-react';
import { DailyLifeBreakdown } from '@/components/DailyLifeBreakdown';
import { SavingsBreakdown } from '@/components/SavingsBreakdown';
import { InvestmentBreakdown } from '@/components/InvestmentBreakdown';
import { PinjolDebtWarning } from './PinjolDebtWarning';
import { SandwichGenerationNotice } from './SandwichGenerationNotice';
import { formatCurrency } from '@/utils/formatters';
import { ArrowRight, AlertTriangle, TrendingDown, Calendar, Clock, TrendingDown as TrendingDownIcon, Download, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { exportToPDF } from '@/utils/pdfExport';

interface Step4ResultsProps {
  data: {
    income: number | null;
    expenses: number | null;
    selectedRuleId: string;
    riskProfile: 'conservative' | 'moderate' | 'aggressive';
    hasElderlyParents: boolean;
    hasOtherFamily: boolean;
    hasPinjolDebt: boolean;
    familySupportAmount: number | null;
    pinjolDebtAmount: number | null;
    pinjolDebtInterest: number | null;
    pinjolDebtPayment: number | null;
  };
  clearState?: () => void;
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
            Reduce spending by{' '}
            <span className="font-semibold">{formatCurrency(cutNeeded)}/month</span>
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
            <span>
              Target spending:{' '}
              {formatCurrency((comparison?.target.needs ?? 0) + (comparison?.target.wants ?? 0))}
            </span>
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
          <p className="text-sm text-muted-foreground">
            {formatCurrency(comparison?.adjusted.needs ?? 0)}
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <p className="mb-1 text-xs text-muted-foreground">Wants</p>
          <p className="text-sm font-semibold">{formatCurrency(comparison?.target.wants ?? 0)}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(comparison?.adjusted.wants ?? 0)}
          </p>
        </div>
      </div>
    </div>
  );
}

interface PinjolPayoffAnalysisProps {
  debtAmount: number;
  interestRate: number;
  monthlyPayment: number;
}

function PinjolPayoffAnalysis({ debtAmount, interestRate, monthlyPayment }: PinjolPayoffAnalysisProps) {
  const forecast = useMemo(() => {
    return calculatePayoffForecast(debtAmount, interestRate, monthlyPayment);
  }, [debtAmount, interestRate, monthlyPayment]);

  const formatted = useMemo(() => {
    return formatPayoffForecast(forecast);
  }, [forecast]);

  const monthlyInterest = debtAmount * (interestRate / 100);

  if (!forecast.isSustainable || forecast.willGrow) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            Pinjol Payoff Warning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-amber-700">{formatted.warningText}</p>
          <div className="rounded-lg bg-amber-100 p-4">
            <div className="mb-2 flex items-center gap-2 text-amber-800">
              <TrendingDownIcon className="h-4 w-4" />
              <span className="font-medium">Monthly Interest:</span>
            </div>
            <p className="text-xl font-bold text-amber-900">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(monthlyInterest)}
            </p>
          </div>
          <div className="text-sm text-amber-700">
            <strong>Recommendation:</strong> Increase your monthly payment to at least{' '}
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(monthlyInterest + 100000)}{' '}
            to start paying down the principal.
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPayment = forecast.totalPayment;
  const totalInterest = forecast.totalInterest;
  const principalPercent = ((totalPayment - totalInterest) / totalPayment) * 100;
  const interestPercent = (totalInterest / totalPayment) * 100;

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-green-800">
          <Calendar className="h-5 w-5" />
          Pinjol Payoff Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-green-100 p-3">
            <div className="mb-1 flex items-center gap-2 text-green-700">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">Debt-free in</span>
            </div>
            <p className="text-lg font-bold text-green-900">{formatted.durationText}</p>
          </div>

          <div className="rounded-lg bg-green-100 p-3">
            <div className="mb-1 flex items-center gap-2 text-green-700">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium">Target date</span>
            </div>
            <p className="text-lg font-bold text-green-900">{formatted.debtFreeText}</p>
          </div>

          <div className="rounded-lg bg-red-100 p-3">
            <div className="mb-1 flex items-center gap-2 text-red-700">
              <TrendingDownIcon className="h-4 w-4" />
              <span className="text-xs font-medium">Total interest</span>
            </div>
            <p className="text-lg font-bold text-red-900">{formatted.totalInterestText}</p>
          </div>

          <div className="rounded-lg bg-blue-100 p-3">
            <div className="mb-1 flex items-center gap-2 text-blue-700">
              <span className="text-xs font-medium">Total paid</span>
            </div>
            <p className="text-lg font-bold text-blue-900">{formatted.totalPaymentText}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-green-700">
              Principal:{' '}
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(debtAmount)}
            </span>
            <span className="text-red-700">Interest: {formatted.totalInterestText}</span>
          </div>
          <div className="flex h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-green-500"
              style={{ width: `${principalPercent}%` }}
              role="progressbar"
              aria-valuenow={principalPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
            <div
              className="h-full bg-red-400"
              style={{ width: `${interestPercent}%` }}
              role="progressbar"
              aria-valuenow={interestPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{principalPercent.toFixed(0)}% principal</span>
            <span>{interestPercent.toFixed(0)}% interest</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Step4Results({ data, clearState }: Step4ResultsProps) {
  const results = useMemo(() => {
    if (!data.income || data.income <= 0) return null;
    const estimatedExpenses = data.expenses ?? data.income * 0.7 * 0.6;

    // Prepare family context for calculations
    const familyContext = {
      familySupportAmount: data.familySupportAmount,
      hasPinjolDebt: data.hasPinjolDebt,
      pinjolDebtAmount: data.pinjolDebtAmount,
      pinjolMonthlyInterest: data.pinjolDebtInterest,
      hasElderlyParents: data.hasElderlyParents,
      hasOtherFamily: data.hasOtherFamily,
    };

    return calculateResults(
      data.income,
      data.selectedRuleId,
      data.riskProfile,
      estimatedExpenses,
      familyContext
    );
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

  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExportPDF = async () => {
    if (isExporting) return;

    setIsExporting(true);
    setExportError(null);

    try {
      await exportToPDF('step4-results-content', 'money-decision-results');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export PDF. Please try again.';
      console.error('Failed to export PDF:', error);
      setExportError(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearAndRestart = () => {
    if (clearState) {
      clearState();
    }
    window.location.href = '/';
  };

  return (
    <div id="step4-results-content" className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-bold">
          <CalculatorIcon className="h-8 w-8 text-primary" />
          Money Decision
        </h1>
        <p className="text-muted-foreground">Your personalized budget allocation</p>
      </div>

      <div className="space-y-3 border-b pb-4">
        {exportError ? <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Export Failed</p>
                <p className="mt-1 text-xs text-red-700">{exportError}</p>
              </div>
            </div>
          </div> : null}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex-1 gap-2"
          >
            <Download className={`h-4 w-4 ${isExporting ? 'animate-pulse' : ''}`} />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
          <Button variant="outline" onClick={handleClearAndRestart} className="flex-1 gap-2">
            <RefreshCw className="h-4 w-4" />
            New Calculation
          </Button>
        </div>
      </div>

      {!!showComparison && cutNeeded > 0 && (
        <CutNeededWarning
          allocation={allocation}
          cutNeeded={cutNeeded}
          comparison={comparison}
          expenses={data.expenses ?? 0}
        />
      )}

      {!!showComparison && cutNeeded === 0 && <PerfectFitSuccess allocation={allocation} />}

      {data.hasPinjolDebt && data.pinjolDebtAmount && data.pinjolDebtInterest ? (
        <PinjolDebtWarning
          debtAmount={data.pinjolDebtAmount}
          monthlyInterest={data.pinjolDebtInterest}
        />
      ) : null}

      {data.hasPinjolDebt &&
      data.pinjolDebtAmount &&
      data.pinjolDebtInterest &&
      data.pinjolDebtPayment ? (
        <PinjolPayoffAnalysis
          debtAmount={data.pinjolDebtAmount}
          interestRate={data.pinjolDebtInterest}
          monthlyPayment={data.pinjolDebtPayment}
        />
      ) : null}

      {((data.hasElderlyParents || data.hasOtherFamily) &&
        data.familySupportAmount &&
        data.familySupportAmount > 0) ||
      (data.hasPinjolDebt && data.pinjolDebtAmount && data.pinjolDebtInterest) ? (
        <SandwichGenerationNotice
          income={data.income ?? 0}
          familySupportAmount={data.familySupportAmount ?? 0}
          hasElderlyParents={data.hasElderlyParents}
          hasOtherFamily={data.hasOtherFamily}
          hasPinjolDebt={data.hasPinjolDebt}
          pinjolDebtAmount={data.pinjolDebtAmount}
          pinjolDebtInterest={data.pinjolDebtInterest}
        />
      ) : null}

      <DailyLifeBreakdown amount={allocation.needs} percentage={needsPercent} />

      <SavingsBreakdown amount={allocation.savings} percentage={savingsPercent} />

      <InvestmentBreakdown
        amount={allocation.wants}
        percentage={wantsPercent}
        riskProfile={data.riskProfile}
        recommendations={investmentBreakdown.recommendations}
      />

      {!!showComparison && !!comparison && <AllocationComparison comparison={comparison} />}
    </div>
  );
}
