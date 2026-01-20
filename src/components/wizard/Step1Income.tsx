import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatters';

interface Step1IncomeProps {
  value: number | null;
  onChange: (value: number) => void;
}

export function Step1Income({ value, onChange }: Step1IncomeProps) {
  const [displayValue, setDisplayValue] = useState(formatCurrency(value || 0));
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && value > 0) {
      setDisplayValue(formatCurrency(value));
    }
  }, [value]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericString = e.target.value.replace(/[^0-9]/g, '');
    const rawValue = parseInt(numericString, 10) || 0;
    setDisplayValue(e.target.value);
    onChange(rawValue);
    if (error) setError(null);
  };

  const handleBlur = () => {
    const numericValue = parseInt(displayValue.replace(/[^0-9]/g, '') || '0', 10);
    if (!numericValue || numericValue <= 0) {
      setError('Please enter a valid amount greater than 0');
    } else {
      setDisplayValue(formatCurrency(numericValue));
    }
  };

  return (
    <Card className="wizard-card">
      <CardHeader>
        <CardTitle className="text-center">Enter Your Income</CardTitle>
        <CardDescription className="text-center">Enter your monthly take-home income</CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          ref={inputRef}
          type="text"
          aria-label="Monthly income"
          aria-describedby={error ? 'income-error' : undefined}
          aria-invalid={error ? true : undefined}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0"
          className="text-lg font-semibold"
        />
        {error && (
          <p id="income-error" role="alert" className="text-sm text-destructive mt-2">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
