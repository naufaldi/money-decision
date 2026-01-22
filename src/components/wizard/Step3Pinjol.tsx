import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertTriangle } from 'lucide-react';
import { calculatePayoffForecast, formatPayoffForecast } from '@/utils/pinjolCalculator';
import { PayoffForecastCard } from './PayoffForecastCard';

interface Step3PinjolProps {
  hasPinjolDebt: boolean;
  pinjolDebtAmount: number | null;
  pinjolDebtInterest: number | null;
  pinjolDebtPayment: number | null;
  onHasPinjolDebtChange: (_value: boolean) => void;
  onPinjolDebtAmountChange: (_value: number | null) => void;
  onPinjolDebtInterestChange: (_value: number | null) => void;
  onPinjolDebtPaymentChange: (_value: number | null) => void;
}

export function Step3Pinjol({
  hasPinjolDebt,
  pinjolDebtAmount,
  pinjolDebtInterest,
  pinjolDebtPayment,
  onHasPinjolDebtChange,
  onPinjolDebtAmountChange,
  onPinjolDebtInterestChange,
  onPinjolDebtPaymentChange,
}: Step3PinjolProps) {
  const [debtAmountDisplay, setDebtAmountDisplay] = useState('');
  const [interestDisplay, setInterestDisplay] = useState('');
  const [paymentDisplay, setPaymentDisplay] = useState('');

  useEffect(() => {
    if (pinjolDebtAmount) {
      setDebtAmountDisplay(new Intl.NumberFormat('id-ID').format(pinjolDebtAmount));
    }
  }, [pinjolDebtAmount]);

  useEffect(() => {
    if (pinjolDebtInterest) {
      setInterestDisplay(`${pinjolDebtInterest}`);
    }
  }, [pinjolDebtInterest]);

  useEffect(() => {
    if (pinjolDebtPayment) {
      setPaymentDisplay(new Intl.NumberFormat('id-ID').format(pinjolDebtPayment));
    }
  }, [pinjolDebtPayment]);

  const handleDebtAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/[^0-9]/g, '');
    setDebtAmountDisplay(e.target.value);
    onPinjolDebtAmountChange(numeric ? parseInt(numeric, 10) : null);
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setInterestDisplay(value);
    onPinjolDebtInterestChange(value ? parseFloat(value) : null);
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/[^0-9]/g, '');
    setPaymentDisplay(e.target.value);
    onPinjolDebtPaymentChange(numeric ? parseInt(numeric, 10) : null);
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Rp 0';
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
  };

  const forecast = useMemo(() => {
    if (pinjolDebtAmount && pinjolDebtInterest && pinjolDebtPayment) {
      return calculatePayoffForecast(pinjolDebtAmount, pinjolDebtInterest, pinjolDebtPayment);
    }
    return null;
  }, [pinjolDebtAmount, pinjolDebtInterest, pinjolDebtPayment]);

  const formattedForecast = forecast ? formatPayoffForecast(forecast) : null;

  return (
    <Card className="wizard-card">
      <CardHeader>
        <CardTitle className="text-center">Pinjol Debt Status</CardTitle>
        <CardDescription className="text-center">
          Do you have any pinjol (online loan) or high-interest debt?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            Pinjol refers to digital lending platforms. Understanding your debt helps us provide better recommendations.
          </p>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Pinjol debt status">
            <button
              type="button"
              onClick={() => onHasPinjolDebtChange(true)}
              className={`rounded-lg border p-4 text-center transition-all ${
                hasPinjolDebt
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:bg-muted'
              }`}
              role="radio"
              aria-checked={hasPinjolDebt}
            >
              <span className="text-sm font-medium">Yes, I have pinjol debt</span>
            </button>
            <button
              type="button"
              onClick={() => onHasPinjolDebtChange(false)}
              className={`rounded-lg border p-4 text-center transition-all ${
                !hasPinjolDebt
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:bg-muted'
              }`}
              role="radio"
              aria-checked={!hasPinjolDebt}
            >
              <span className="text-sm font-medium">No pinjol debt</span>
            </button>
          </div>
        </div>

        {hasPinjolDebt && (
          <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Pinjol Debt Details</span>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="pinjol-debt-amount" className="mb-1 block text-sm font-medium">
                  Total Pinjol Debt Amount
                </label>
                <Input
                  id="pinjol-debt-amount"
                  type="text"
                  placeholder="Rp 5,000,000"
                  value={debtAmountDisplay}
                  onChange={handleDebtAmountChange}
                  className="border-red-200 focus:border-red-400"
                  aria-describedby="pinjol-debt-hint"
                />
                <p id="pinjol-debt-hint" className="mt-1 text-xs text-red-600">
                  Enter the total amount you owe across all pinjol platforms
                </p>
              </div>

              <div>
                <label htmlFor="pinjol-interest" className="mb-1 block text-sm font-medium">
                  Estimated Monthly Interest Rate (%)
                </label>
                <Input
                  id="pinjol-interest"
                  type="text"
                  placeholder="e.g., 5"
                  value={interestDisplay}
                  onChange={handleInterestChange}
                  className="border-red-200 focus:border-red-400"
                  aria-describedby="pinjol-interest-hint"
                />
                <p id="pinjol-interest-hint" className="mt-1 text-xs text-red-600">
                  Approximate monthly interest rate percentage
                </p>
              </div>

              {pinjolDebtAmount && pinjolDebtInterest && (
                <div className="rounded-lg bg-red-100 p-3">
                  <p className="text-xs font-medium text-red-800">Monthly Interest Cost:</p>
                  <p className="text-sm font-semibold text-red-900">
                    {formatCurrency((pinjolDebtAmount * pinjolDebtInterest) / 100)}
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="pinjol-payment" className="mb-1 block text-sm font-medium">
                  Monthly Payment Amount
                </label>
                <Input
                  id="pinjol-payment"
                  type="text"
                  placeholder="Rp 500,000"
                  value={paymentDisplay}
                  onChange={handlePaymentChange}
                  className="border-red-200 focus:border-red-400"
                  aria-describedby="pinjol-payment-hint"
                />
                <p id="pinjol-payment-hint" className="mt-1 text-xs text-red-600">
                  How much can you pay each month toward this debt?
                </p>
              </div>
            </div>

            {forecast && formattedForecast && (
              <PayoffForecastCard
                forecast={forecast}
                formattedForecast={formattedForecast}
                monthlyInterest={forecast.monthlyInterest}
              />
            )}

            <div className="border-t border-red-200 pt-3">
              <p className="text-xs text-red-700">
                <strong>Important:</strong> High-interest pinjol debt should be prioritized in your budget. We&apos;ll provide guidance on managing and reducing this debt.
              </p>
            </div>
          </div>
        )}

        {!hasPinjolDebt && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            Great! Not having pinjol debt gives you more flexibility in your financial planning.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
