import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';
import { calculateResults } from '@/utils/calculators';
import { Calculator as CalculatorIcon } from 'lucide-react';

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

  const { allocation, savingsBreakdown, investmentBreakdown } = results;
  const income = data.income || 1;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <CalculatorIcon className="w-8 h-8 text-primary" />
          Money Decision
        </h1>
        <p className="text-muted-foreground">Your personalized budget allocation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Daily Life ({allocation.needs}%)</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-2xl font-bold">Rp {(income * allocation.needs / 100).toLocaleString('id-ID')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Savings ({allocation.savings}%)</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-2xl font-bold">Rp {(income * allocation.savings / 100).toLocaleString('id-ID')}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Emergency Fund Target: Rp {savingsBreakdown.emergencyFundTarget.toLocaleString('id-ID')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Investment ({allocation.wants}%)</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-2xl font-bold">Rp {(income * allocation.wants / 100).toLocaleString('id-ID')}</p>
          <div className="mt-4 space-y-2">
            {investmentBreakdown.recommendations.map((rec) => (
              <p key={rec.name} className="text-sm">
                {rec.percentage}% {rec.name}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
