import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatters';
import { computeExpenseMetrics, formatSpendingRatio } from '@/utils/expenseRuleFit';
import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Step2ExpensesProps {
  value: number | null;
  onChange: (value: number) => void;
  income?: number;
}

export function Step2Expenses({ value, onChange, income }: Step2ExpensesProps) {
  const [displayValue, setDisplayValue] = useState(formatCurrency(value || 0));
  const [warning, setWarning] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ReturnType<typeof computeExpenseMetrics> | null>(null);

  useEffect(() => {
    if (value && value > 0) {
      setDisplayValue(formatCurrency(value));
    }
  }, [value]);

  useEffect(() => {
    if (income && income > 0) {
      const computed = computeExpenseMetrics(income, value);
      setMetrics(computed);

      if (value && value > income) {
        setWarning('Expenses exceed your income');
      } else {
        setWarning(null);
      }
    }
  }, [income, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericString = e.target.value.replace(/[^0-9]/g, '');
    const rawValue = parseInt(numericString, 10) || 0;
    setDisplayValue(e.target.value);
    onChange(rawValue);
  };

  const showMetrics = income && income > 0 && value && value > 0;

  return (
    <Card className="wizard-card">
      <CardHeader>
        <CardTitle className="text-center">Total Monthly Spending (Optional)</CardTitle>
        <CardDescription className="text-center">Enter all your expenses to get personalized recommendations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          aria-label="Total monthly spending"
          value={displayValue}
          onChange={handleChange}
          placeholder="Enter total monthly expenses"
        />

        {warning && (
          <div role="alert" className="flex items-center gap-2 text-sm text-amber-600 p-3 bg-amber-50 rounded-lg">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{warning}</span>
          </div>
        )}

        {showMetrics && metrics && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Spending ratio:</span>
              <span className="font-medium">{formatSpendingRatio(metrics.spendingRatio)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monthly cashflow:</span>
              <span className={`font-medium ${metrics.cashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(metrics.cashflow)}
              </span>
            </div>
            {metrics.isDeficit && (
              <p className="text-xs text-amber-600 mt-2">
                You are spending more than you earn. Consider reducing expenses or increasing income.
              </p>
            )}
          </div>
        )}

        {!showMetrics && income && income > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Enter your expenses above to see your spending breakdown
          </p>
        )}
      </CardContent>
    </Card>
  );
}
