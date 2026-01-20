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
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <PiggyBank className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
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
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0 border-t">
          <div className="space-y-3 mt-4">
            {breakdown.map(({ category, amount: categoryAmount }) => (
              <SubcategoryRow
                key={category.id}
                category={category}
                amount={categoryAmount}
                totalAmount={amount}
              />
            ))}
          </div>
        </CardContent>
      )}
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
  const actualPercentage = (amount / totalAmount) * 100;
  const Icon = iconMap[category.icon || 'wallet'] || PiggyBank;

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-muted rounded-md">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">{category.name}</p>
          <p className="text-xs text-muted-foreground">{category.description}</p>
          {category.whereToKeep && (
            <p className="text-xs text-green-600 mt-1">
              Where to keep: {category.whereToKeep}
            </p>
          )}
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
