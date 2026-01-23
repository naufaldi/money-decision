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
  const finalDiscretionaryIncome = adjustment.adjustedIncome - pinjolPayment;

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
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Gross Monthly Income</span>
            <span className="font-semibold">{formatCurrency(adjustment.originalIncome)}</span>
          </div>
          {adjustment.familySupport > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Family Support</span>
              <span className={`font-semibold text-${burdenColor}-700`}>
                - {formatCurrency(adjustment.familySupport)}
              </span>
            </div>
          )}
          {pinjolPayment > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pinjol Debt Payment</span>
              <span className={`font-semibold text-${burdenColor}-700`}>
                - {formatCurrency(pinjolPayment)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-sm font-semibold">Discretionary Income</span>
            <span className={`text-lg font-bold ${finalDiscretionaryIncome < 0 ? 'text-red-700' : ''}`}>
              {formatCurrency(finalDiscretionaryIncome)}
            </span>
          </div>
        </div>

        {finalDiscretionaryIncome < 0 && (
          <div className="rounded-lg border-2 border-red-600 bg-red-100 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-700" />
              <div>
                <p className="font-bold text-red-900 mb-2">
                  🚨 Critical: Income Deficit
                </p>
                <p className="text-sm text-red-800 mb-3">
                  Your monthly expenses exceed your income by{' '}
                  <strong>{formatCurrency(Math.abs(finalDiscretionaryIncome))}</strong>.
                  This is unsustainable and requires immediate action.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-red-900">Immediate Actions:</p>
                  <ul className="ml-4 space-y-1 list-disc">
                    <li>Review family support - can siblings/relatives help share burden?</li>
                    <li>Apply for government assistance (BPJS Kesehatan, PKH, Kartu Sembako)</li>
                    <li>Contact OJK Hotline <strong>157</strong> for debt counseling</li>
                    <li>Consider debt restructuring with formal banks</li>
                    <li>Seek professional financial counselor through LSM or community services</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {adjustment.isSandwichGeneration && adjustment.familySupport > 0 ? <div className={`rounded-lg bg-${burdenColor}-100 p-3`}>
            <div className="flex items-start gap-2">
              <AlertTriangle className={`mt-0.5 h-4 w-4 text-${burdenColor}-700`} />
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
          </div> : null}

        <div className="space-y-1 text-xs text-muted-foreground">
          <p className="font-medium">Budget Adjustments:</p>
          {finalDiscretionaryIncome >= 0 ? (
            <ul className="ml-2 list-inside list-disc space-y-0.5">
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
          ) : (
            <p className="text-red-700 font-medium">
              ⚠️ Budget calculations cannot proceed with negative discretionary income.
              Address income deficit first before setting financial goals.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
