import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PayoffForecast } from '@/utils/pinjolCalculator';
import { Calendar, Clock, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PayoffForecastCardProps {
  forecast: PayoffForecast;
  formattedForecast: {
    durationText: string;
    debtFreeText: string;
    totalInterestText: string;
    totalPaymentText: string;
    warningText: string | null;
  };
  monthlyInterest: number;
}

export function PayoffForecastCard({
  forecast,
  formattedForecast,
  monthlyInterest,
}: PayoffForecastCardProps) {
  const { isSustainable, willGrow, totalInterest, totalPayment } = forecast;
  const { durationText, debtFreeText, totalInterestText, totalPaymentText, warningText } = formattedForecast;

  if (!isSustainable || willGrow) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg text-amber-800">
            <AlertCircle className="h-5 w-5" />
            Payment Too Low
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-amber-700">{warningText}</p>

          <div className="rounded-lg bg-amber-100 p-4">
            <div className="mb-2 flex items-center gap-2 text-amber-800">
              <TrendingDown className="h-4 w-4" />
              <span className="font-medium">Monthly Interest:</span>
            </div>
            <p className="text-xl font-bold text-amber-900">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(monthlyInterest)}
            </p>
            <p className="mt-1 text-xs text-amber-600">
              Your payment is not enough to cover the interest, so your debt will grow each month.
            </p>
          </div>

          <div className="text-sm text-amber-700">
            <strong>Recommendation:</strong> Try to increase your monthly payment to at least cover the interest plus some principal. This will prevent your debt from growing.
          </div>
        </CardContent>
      </Card>
    );
  }

  const principal = totalPayment - totalInterest;
  const principalPercent = (principal / totalPayment) * 100;
  const interestPercent = (totalInterest / totalPayment) * 100;

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-green-800">
          <CheckCircle2 className="h-5 w-5" />
          Debt Payoff Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-green-100 p-3">
            <div className="mb-1 flex items-center gap-2 text-green-700">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">Debt-free in</span>
            </div>
            <p className="text-lg font-bold text-green-900">{durationText}</p>
          </div>

          <div className="rounded-lg bg-green-100 p-3">
            <div className="mb-1 flex items-center gap-2 text-green-700">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium">Target date</span>
            </div>
            <p className="text-lg font-bold text-green-900">{debtFreeText}</p>
          </div>

          <div className="rounded-lg bg-red-100 p-3">
            <div className="mb-1 flex items-center gap-2 text-red-700">
              <TrendingDown className="h-4 w-4" />
              <span className="text-xs font-medium">Total interest</span>
            </div>
            <p className="text-lg font-bold text-red-900">{totalInterestText}</p>
          </div>

          <div className="rounded-lg bg-blue-100 p-3">
            <div className="mb-1 flex items-center gap-2 text-blue-700">
              <span className="text-xs font-medium">Total paid</span>
            </div>
            <p className="text-lg font-bold text-blue-900">{totalPaymentText}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-green-700">Principal: {new Intl.NumberFormat('id-ID').format(principal)}</span>
            <span className="text-red-700">Interest: {totalInterestText}</span>
          </div>
          <div className="flex h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-green-500"
              style={{ width: `${principalPercent}%` }}
              role="progressbar"
              aria-valuenow={principalPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Principal portion"
            />
            <div
              className="h-full bg-red-400"
              style={{ width: `${interestPercent}%` }}
              role="progressbar"
              aria-valuenow={interestPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Interest portion"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{principalPercent.toFixed(0)}% principal</span>
            <span>{interestPercent.toFixed(0)}% interest</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
