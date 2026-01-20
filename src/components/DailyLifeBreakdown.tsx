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
  calculateDailyLifeBreakdown,
  type DailyLifeSubcategory,
} from '@/constants/daily-life';
import {
  Home,
  Zap,
  Car,
  Utensils,
  Coffee,
  HeartPulse,
  User,
  Gamepad2,
  Shirt,
  GraduationCap,
  Users,
  ChevronDown,
  ChevronUp,
  Building,
} from 'lucide-react';

interface DailyLifeBreakdownProps {
  amount: number;
  percentage: number;
  defaultExpanded?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  home: Home,
  zap: Zap,
  car: Car,
  utensils: Utensils,
  coffee: Coffee,
  'heart-pulse': HeartPulse,
  user: User,
  'gamepad-2': Gamepad2,
  shirt: Shirt,
  'graduation-cap': GraduationCap,
  users: Users,
};

export function DailyLifeBreakdown({
  amount,
  percentage,
  defaultExpanded = false,
}: DailyLifeBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const breakdown = calculateDailyLifeBreakdown(amount);

  return (
    <Card className="daily-life-card">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Daily Life
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
  category: DailyLifeSubcategory;
  amount: number;
  totalAmount: number;
}

function SubcategoryRow({
  category,
  amount,
  totalAmount,
}: SubcategoryRowProps) {
  const actualPercentage = (amount / totalAmount) * 100;
  const Icon = iconMap[category.icon || 'home'] || Building;

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-muted rounded-md">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">{category.name}</p>
          <p className="text-xs text-muted-foreground">{category.description}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold">{formatCurrency(amount)}</p>
        <p className="text-xs text-muted-foreground">{actualPercentage.toFixed(1)}%</p>
      </div>
    </div>
  );
}
