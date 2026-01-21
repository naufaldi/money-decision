import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { formatCurrency } from '@/utils/formatters';
import wageData from '@/data/salary/avg_wages_total_august_2025.json';

interface Step1IncomeProps {
  value: number | null;
  province: string | null;
  onChange: (_value: number) => void;
  onProvinceChange: (_province: string) => void;
}

const PROVINCES = wageData.map(item => item.province).sort();

export function Step1Income({ value, province, onChange, onProvinceChange }: Step1IncomeProps) {
  const [displayValue, setDisplayValue] = useState(formatCurrency(value ?? 0));
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
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="province-select" className="mb-2 block text-sm font-medium">
            Province <span className="text-destructive">*</span>
          </label>
          <Select
            id="province-select"
            value={province ?? ''}
            onChange={(e) => onProvinceChange(e.target.value)}
            className="w-full"
            required
          >
            <option value="">Select a province</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="income-input" className="mb-2 block text-sm font-medium">
            Monthly Income <span className="text-destructive">*</span>
          </label>
          <Input
            id="income-input"
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
          {error ? <p id="income-error" role="alert" className="mt-2 text-sm text-destructive">
              {error}
            </p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
