import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

interface IncomeInputProps {
  value: number;
  onChange: (_value: number) => void;
}

export function IncomeInput({ value, onChange }: IncomeInputProps) {
  const [displayValue, setDisplayValue] = useState(formatCurrency(value));

  useEffect(() => {
    setDisplayValue(formatCurrency(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericString = e.target.value.replace(/[^0-9]/g, '');
    const rawValue = parseInt(numericString, 10) || 0;
    setDisplayValue(e.target.value);
    onChange(rawValue);
  };

  const handleBlur = () => {
    if (value > 0) {
      setDisplayValue(formatCurrency(value));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Income</CardTitle>
        <CardDescription>Enter your monthly income to calculate your budget allocation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            Rp
          </span>
          <Input
            type="text"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0"
            className="pl-8 text-lg font-semibold"
          />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your take-home monthly income
        </p>
      </CardContent>
    </Card>
  );
}
