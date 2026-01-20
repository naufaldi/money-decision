import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { SavingsBreakdown } from '@/types';
import { cn } from '@/lib/utils';

interface SavingsBreakdownProps {
  breakdown: SavingsBreakdown;
}

export function SavingsBreakdownComponent({ breakdown }: SavingsBreakdownProps) {
  const items = [
    {
      label: 'Emergency Fund',
      amount: breakdown.emergencyFund,
      percentage: 50,
      color: 'bg-blue-600',
      description: 'Safety net for unexpected expenses',
      target: `Target: ${formatCurrency(breakdown.emergencyFundTarget)} (6 months)`,
    },
    {
      label: 'Short-term Goals',
      amount: breakdown.shortTermGoals,
      percentage: 30,
      color: 'bg-blue-400',
      description: 'Vacation, gadgets, courses (within 1 year)',
    },
    {
      label: 'Long-term Goals',
      amount: breakdown.longTermGoals,
      percentage: 20,
      color: 'bg-blue-300',
      description: 'Education, vehicle, wedding (1-5 years)',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Breakdown</CardTitle>
        <CardDescription>Recommended allocation for your savings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", item.color)} />
                <span className="font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">({item.percentage}%)</span>
              </div>
              <span className="font-semibold">{formatCurrency(item.amount)}</span>
            </div>
            <div className="pl-4 space-y-1">
              <p className="text-sm text-muted-foreground">{item.description}</p>
              {item.target && (
                <p className="text-sm text-blue-600">{item.target}</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
