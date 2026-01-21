import { AlertTriangle, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { adjustIncomeForFamilySupport } from '@/utils/calculators';

interface SandwichGenerationNoticeProps {
  income: number;
  familySupportAmount: number;
  hasElderlyParents: boolean;
  hasOtherFamily: boolean;
}

export function SandwichGenerationNotice({
  income,
  familySupportAmount,
  hasElderlyParents,
  hasOtherFamily,
}: SandwichGenerationNoticeProps) {
  const adjustment = adjustIncomeForFamilySupport(
    income,
    familySupportAmount,
    hasElderlyParents,
    hasOtherFamily
  );

  if (!adjustment.isSandwichGeneration || adjustment.familySupport === 0) {
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

  return (
    <Card className={`border-${burdenColor}-200 bg-${burdenColor}-50`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 text-${burdenColor}-800`}>
          <DollarSign className="h-5 w-5" />
          Sandwich Generation Adjustment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Gross Monthly Income</span>
            <span className="font-semibold">{formatCurrency(adjustment.originalIncome)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Family Support</span>
            <span className={`font-semibold text-${burdenColor}-700`}>
              - {formatCurrency(adjustment.familySupport)}
            </span>
          </div>
          <div className="border-t pt-2 flex justify-between items-center">
            <span className="text-sm font-semibold">Discretionary Income</span>
            <span className="text-lg font-bold">{formatCurrency(adjustment.adjustedIncome)}</span>
          </div>
        </div>

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

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Budget Adjustments for Sandwich Generation:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>Emergency fund target: 6-9 months (vs standard 3-6 months)</li>
            <li>Savings rate: 10-20% acceptable (vs 20-30% standard)</li>
            <li>Calculations use discretionary income after family support</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
