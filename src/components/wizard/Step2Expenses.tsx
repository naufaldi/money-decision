import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatters';
import { useState, useEffect } from 'react';

interface Step2ExpensesProps {
  value: number | null;
  onChange: (value: number) => void;
  income?: number;
}

export function Step2Expenses({ value, onChange, income }: Step2ExpensesProps) {
  const [displayValue, setDisplayValue] = useState(formatCurrency(value || 0));
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    if (value && value > 0) {
      setDisplayValue(formatCurrency(value));
    }
  }, [value]);

  useEffect(() => {
    if (income && value && value > income) {
      setWarning('Expenses exceed your income');
    } else {
      setWarning(null);
    }
  }, [income, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericString = e.target.value.replace(/[^0-9]/g, '');
    const rawValue = parseInt(numericString, 10) || 0;
    setDisplayValue(e.target.value);
    onChange(rawValue);
  };

  return (
    <Card className="wizard-card">
      <CardHeader>
        <CardTitle className="text-center">Monthly Expenses (Optional)</CardTitle>
        <CardDescription className="text-center">For more accurate emergency fund calculations</CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          aria-label="Monthly expenses"
          value={displayValue}
          onChange={handleChange}
          placeholder="Enter monthly expenses"
        />
        {warning && (
          <p role="alert" className="text-sm text-amber-600 mt-2">
            {warning}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
