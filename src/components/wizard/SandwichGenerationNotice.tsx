import { AlertTriangle, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { adjustIncomeForFamilySupport, calculatePinjolMonthlyPayment } from '@/utils/calculators';

interface SandwichGenerationNoticeProps {
  income: number;
  familySupportAmount: number;
  hasElderlyParents: boolean;
  hasOtherFamily: boolean;
  hasPinjolDebt?: boolean;
  pinjolDebtAmount?: number | null;
  pinjolDebtInterest?: number | null;
}

export function SandwichGenerationNotice({
  income,
  familySupportAmount,
  hasElderlyParents,
  hasOtherFamily,
  hasPinjolDebt = false,
  pinjolDebtAmount,
  pinjolDebtInterest,
}: SandwichGenerationNoticeProps) {
  const adjustment = adjustIncomeForFamilySupport(
    income,
    familySupportAmount,
    hasElderlyParents,
    hasOtherFamily
  );

  // Calculate Pinjol payment if applicable
  const pinjolPayment =
    hasPinjolDebt && pinjolDebtAmount && pinjolDebtInterest
      ? calculatePinjolMonthlyPayment(pinjolDebtAmount, pinjolDebtInterest)
      : 0;

  // Calculate final discretionary income after both deductions
  const finalDiscretionaryIncome = Math.max(0, adjustment.adjustedIncome - pinjolPayment);

  // Show notice if there's sandwich generation OR Pinjol debt
  const shouldShow =
    (adjustment.isSandwichGeneration && adjustment.familySupport > 0) || pinjolPayment > 0;

  if (!shouldShow) {
    return null;
  }

  const burdenLevel =
    adjustment.supportBurden < 20
      ? 'sustainable'
      : adjustment.supportBurden < 35
        ? 'high'
        : 'critical';
  const burdenColor =
    burdenLevel === 'sustainable' ? 'blue' : burdenLevel === 'high' ? 'amber' : 'red';

  const cardTitle =
    adjustment.isSandwichGeneration && adjustment.familySupport > 0
      ? 'Sandwich Generation Adjustment'
      : pinjolPayment > 0
        ? 'Income Adjustment'
        : 'Income Adjustment';

  return (
    <Card className={`border-${burdenColor}-200 bg-${burdenColor}-50`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 text-${burdenColor}-800`}>
          <DollarSign className="h-5 w-5" />
          {cardTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Gross Monthly Income</span>
            <span className="font-semibold">{formatCurrency(adjustment.originalIncome)}</span>
          </div>
          {adjustment.familySupport > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Family Support</span>
              <span className={`font-semibold text-${burdenColor}-700`}>
                - {formatCurrency(adjustment.familySupport)}
              </span>
            </div>
          )}
          {pinjolPayment > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Pinjol Debt Payment</span>
              <span className={`font-semibold text-${burdenColor}-700`}>
                - {formatCurrency(pinjolPayment)}
              </span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between items-center">
            <span className="text-sm font-semibold">Discretionary Income</span>
            <span className="text-lg font-bold">{formatCurrency(finalDiscretionaryIncome)}</span>
          </div>
        </div>

        {adjustment.isSandwichGeneration && adjustment.familySupport > 0 && (
          <div className={`rounded-lg bg-${burdenColor}-100 p-3`}>
            <div className="flex items-start gap-2">
              <AlertTriangle className={`h-4 w-4 mt-0.5 text-${burdenColor}-700`} />
              <div>
                <p className={`text-sm font-medium text-${burdenColor}-800`}>
                  Support Burden: {adjustment.supportBurden.toFixed(1)}%
                  {burdenLevel === 'sustainable' && ' (Sustainable)'}
                  {burdenLevel === 'high' && ' (High)'}
                  {burdenLevel === 'critical' && ' (Critical)'}
                </p>
                <p className={`text-xs text-${burdenColor}-700 mt-1`}>
                  {burdenLevel === 'sustainable' &&
                    'Your family support is manageable. Budget calculations are based on your discretionary income.'}
                  {burdenLevel === 'high' &&
                    'Consider reviewing emergency fund priority and delaying aggressive investments. Seek support from other family members if possible.'}
                  {burdenLevel === 'critical' &&
                    'Your support burden is very high. Consider government assistance programs (BPJS, PKH) and professional financial counseling.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Budget Adjustments:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            {adjustment.isSandwichGeneration && adjustment.familySupport > 0 && (
              <>
                <li>Emergency fund target: 6-9 months (vs standard 3-6 months)</li>
                <li>Savings rate: 10-20% acceptable (vs 20-30% standard)</li>
              </>
            )}
            <li>
              Calculations use discretionary income after{' '}
              {adjustment.familySupport > 0 && 'family support'}
              {adjustment.familySupport > 0 && pinjolPayment > 0 && ' and '}
              {pinjolPayment > 0 && 'Pinjol debt payment'}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
