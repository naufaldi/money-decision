import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import {
  calculateSavingsBreakdown,
  type SavingsSubcategory,
} from '@/constants/savings';
import {
  Shield,
  Target,
  GraduationCap,
  PiggyBank,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SavingsBreakdownProps {
  amount: number;
  percentage: number;
  defaultExpanded?: boolean;
}

interface SavingsBreakdownComponentProps {
  breakdown: {
    emergencyFund: number;
    shortTermGoals: number;
    longTermGoals: number;
    emergencyFundTarget: number;
  };
}

const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  target: Target,
  'graduation-cap': GraduationCap,
  wallet: PiggyBank,
};

export function SavingsBreakdown({
  amount,
  percentage,
  defaultExpanded = false,
}: SavingsBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const breakdown = calculateSavingsBreakdown(amount);

  return (
    <Card className="savings-card">
      <CardHeader
        className="cursor-pointer transition-colors hover:bg-muted/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <PiggyBank className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                Savings
                <span className="text-sm font-normal text-muted-foreground">
                  ({percentage}%)
                </span>
              </CardTitle>
              <CardDescription className="text-base font-semibold text-foreground">
                {formatCurrency(amount)}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {isExpanded ? 'Hide' : 'Show'} details
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      {isExpanded ? <CardContent className="border-t pt-0">
          <div className="mt-4 space-y-3">
            {breakdown.map(({ category, amount: categoryAmount }) => (
              <SubcategoryRow
                key={category.id}
                category={category}
                amount={categoryAmount}
                totalAmount={amount}
              />
            ))}
          </div>
        </CardContent> : null}
    </Card>
  );
}

// Alias export for backward compatibility with Calculator.tsx
export function SavingsBreakdownComponent({ breakdown }: SavingsBreakdownComponentProps) {
  const amount = breakdown.emergencyFund + breakdown.shortTermGoals + breakdown.longTermGoals;
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="savings-card">
      <CardHeader
        className="cursor-pointer transition-colors hover:bg-muted/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <PiggyBank className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Savings Breakdown</CardTitle>
              <CardDescription className="text-base font-semibold text-foreground">
                {formatCurrency(amount)}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {isExpanded ? 'Hide' : 'Show'} details
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      {isExpanded ? <CardContent className="border-t pt-0">
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between border-b py-2">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-muted p-1.5">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Emergency Fund</p>
                  <p className="text-xs text-muted-foreground">3-6 months of essential expenses</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatCurrency(breakdown.emergencyFund)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-b py-2">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-muted p-1.5">
                  <Target className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Short-term Goals</p>
                  <p className="text-xs text-muted-foreground">Vacation, gadgets, courses</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatCurrency(breakdown.shortTermGoals)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-muted p-1.5">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Long-term Goals</p>
                  <p className="text-xs text-muted-foreground">Education, vehicle, wedding</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatCurrency(breakdown.longTermGoals)}</p>
              </div>
            </div>
          </div>
        </CardContent> : null}
    </Card>
  );
}

interface SubcategoryRowProps {
  category: SavingsSubcategory;
  amount: number;
  totalAmount: number;
}

function SubcategoryRow({
  category,
  amount,
  totalAmount,
}: SubcategoryRowProps) {
  const actualPercentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
  const Icon = iconMap[category.icon ?? 'wallet'] ?? PiggyBank;

  return (
    <div className="flex items-center justify-between border-b py-2 last:border-0">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-muted p-1.5">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">{category.name}</p>
          <p className="text-xs text-muted-foreground">{category.description}</p>
          {category.whereToKeep ? <p className="mt-1 text-xs text-green-600">
              Where to keep: {category.whereToKeep}
            </p> : null}
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold">{formatCurrency(amount)}</p>
        <p className="text-xs text-muted-foreground">
          {actualPercentage.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
