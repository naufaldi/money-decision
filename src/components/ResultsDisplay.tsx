import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { AllocationResult } from '@/types';
import { cn } from '@/lib/utils';

interface ResultsDisplayProps {
  allocation: AllocationResult;
}

export function ResultsDisplay({ allocation }: ResultsDisplayProps) {
  const categories = [
    {
      key: 'needs' as const,
      label: 'Daily Life',
      amount: allocation.needs,
      color: 'bg-green-600',
      borderColor: 'border-green-600',
      textColor: 'text-green-600',
    },
    {
      key: 'savings' as const,
      label: 'Savings',
      amount: allocation.savings,
      color: 'bg-blue-600',
      borderColor: 'border-blue-600',
      textColor: 'text-blue-600',
    },
    {
      key: 'wants' as const,
      label: 'Investment/Wants',
      amount: allocation.wants,
      color: 'bg-orange-500',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-500',
    },
  ];

  const total = allocation.needs + allocation.savings + allocation.wants;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Allocation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category) => {
            const percentage = total > 0 ? category.amount / total : 0;
            return (
              <div key={category.key}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", category.color)} />
                    <span className="font-medium">{category.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(category.amount)}</div>
                    <div className={cn("text-sm", category.textColor)}>
                      {formatPercentage(percentage, 0)}
                    </div>
                  </div>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full transition-all duration-300", category.color)}
                    style={{ width: `${percentage * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total Monthly Income</span>
            <span className="font-semibold">{formatCurrency(total)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
