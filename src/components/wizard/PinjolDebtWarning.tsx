import { AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { assessPinjolRisk } from '@/utils/calculators';

interface PinjolDebtWarningProps {
  debtAmount: number;
  monthlyInterest: number;
}

export function PinjolDebtWarning({ debtAmount, monthlyInterest }: PinjolDebtWarningProps) {
  const assessment = assessPinjolRisk(true, monthlyInterest);

  if (!assessment.hasPinjolDebt) {
    return null;
  }

  const annualRate = monthlyInterest * 12;
  const monthlyInterestCost = (debtAmount * monthlyInterest) / 100;

  const riskColorMap = {
    critical: 'red',
    high: 'orange',
    moderate: 'yellow',
    low: 'blue',
    none: 'gray',
  };

  const color = riskColorMap[assessment.riskLevel];

  return (
    <Card className={`border-${color}-200 bg-${color}-50`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 text-${color}-800`}>
          <AlertTriangle className="h-5 w-5" />
          Pinjol Debt Alert:{' '}
          {assessment.riskLevel.charAt(0).toUpperCase() + assessment.riskLevel.slice(1)} Risk
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className={`rounded-lg bg-${color}-100 p-3`}>
            <p className="text-xs text-muted-foreground">Total Pinjol Debt</p>
            <p className="mt-1 text-lg font-bold">{formatCurrency(debtAmount)}</p>
          </div>
          <div className={`rounded-lg bg-${color}-100 p-3`}>
            <p className="text-xs text-muted-foreground">Interest Rate (APR)</p>
            <p className="mt-1 text-lg font-bold">{annualRate.toFixed(1)}%</p>
          </div>
        </div>

        <div className={`rounded-lg border-${color}-300 bg-${color}-100 p-4`}>
          <div className="flex items-start gap-3">
            <TrendingUp className="mt-0.5 h-5 w-5" />
            <div>
              <p className={`mb-1 font-medium text-${color}-800`}>{assessment.message}</p>
              <p className={`text-sm text-${color}-700`}>
                Monthly interest cost:{' '}
                <span className="font-semibold">{formatCurrency(monthlyInterestCost)}</span>
              </p>
            </div>
          </div>
        </div>

        {assessment.recommendPayoffFirst ? (
          <div className={`rounded-lg border-2 border-${color}-300 bg-white p-4`}>
            <p className="mb-2 text-sm font-semibold">⚠️ Priority Action Required</p>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-${color}-600">•</span>
                <span>
                  <strong>STOP</strong> taking new pinjol to pay old pinjol
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-${color}-600">•</span>
                <span>List all pinjol debts and total amounts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-${color}-600">•</span>
                <span>Consider debt consolidation with formal banks (12-24% APR)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-${color}-600">•</span>
                <span>Pay highest interest rate pinjol first (avalanche method)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-${color}-600">•</span>
                <span>
                  Contact OJK hotline: <strong>157</strong> for free counseling
                </span>
              </li>
            </ul>
          </div>
        ) : null}

        {!assessment.recommendPayoffFirst && (
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="mb-2 text-sm font-medium">Recommendation:</p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Include in regular debt payoff strategy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Consider refinancing to lower rate if available</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Maintain minimum monthly payments</span>
              </li>
            </ul>
          </div>
        )}

        <div className="border-t pt-2 text-xs text-muted-foreground">
          <p>
            <strong>Resources:</strong> OJK Hotline (157) | Debt consolidation at banks | See{' '}
            <a href="/docs/pinjol.md" className="text-primary underline">
              pinjol guide
            </a>{' '}
            for more help
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
