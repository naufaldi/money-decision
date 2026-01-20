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
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InvestmentBreakdownProps {
  amount: number;
  percentage: number;
  riskProfile: string;
  recommendations: Array<{
    name: string;
    percentage: number;
    risk: 'low' | 'medium' | 'high' | 'very-high';
    description: string;
    warning?: string;
  }>;
  defaultExpanded?: boolean;
}

const riskStyles = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  'very-high': 'bg-red-100 text-red-700',
};

const iconMap: Record<string, React.ElementType> = {
  'reksadana-pasar-uang': TrendingUp,
  'reksadana-pendapatan-tetap': TrendingUp,
  'reksadana-saham': TrendingUp,
  'reksadana-campuran': TrendingUp,
  deposito: DollarSign,
  crypto: TrendingDown,
  default: TrendingUp,
};

function getIconForInvestment(name: string): React.ElementType {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('pasar uang')) return iconMap['reksadana-pasar-uang'];
  if (lowercaseName.includes('pendapatan tetap')) return iconMap['reksadana-pendapatan-tetap'];
  if (lowercaseName.includes('saham')) return iconMap['reksadana-saham'];
  if (lowercaseName.includes('campuran')) return iconMap['reksadana-campuran'];
  if (lowercaseName.includes('deposito')) return iconMap['deposito'];
  if (lowercaseName.includes('crypto')) return iconMap['crypto'];
  return iconMap['default'];
}

export function InvestmentBreakdown({
  amount,
  percentage,
  riskProfile,
  recommendations,
  defaultExpanded = false,
}: InvestmentBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className="investment-card">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Investment
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
          <div className="mb-3">
            <span className="text-xs text-muted-foreground">
              Risk Profile: <span className="font-medium capitalize">{riskProfile}</span>
            </span>
          </div>
          <div className="space-y-3 mt-2">
            {recommendations.map((rec, index) => (
              <RecommendationRow
                key={index}
                recommendation={rec}
                totalAmount={amount}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

interface RecommendationRowProps {
  recommendation: {
    name: string;
    percentage: number;
    risk: 'low' | 'medium' | 'high' | 'very-high';
    description: string;
    warning?: string;
  };
  totalAmount: number;
}

function RecommendationRow({
  recommendation,
  totalAmount,
}: RecommendationRowProps) {
  const amount = Math.round(totalAmount * recommendation.percentage);
  const actualPercentage = (amount / totalAmount) * 100;
  const Icon = getIconForInvestment(recommendation.name);

  return (
    <div className="border-b last:border-0 pb-3 last:pb-0">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-muted rounded-md">
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">{recommendation.name}</p>
            <p className="text-xs text-muted-foreground">
              {recommendation.description}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">{formatCurrency(amount)}</p>
          <p className="text-xs text-muted-foreground">
            {actualPercentage.toFixed(0)}%
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-1 ml-9">
        <span
          className={cn(
            'px-2 py-0.5 rounded text-xs capitalize',
            riskStyles[recommendation.risk]
          )}
        >
          {recommendation.risk} risk
        </span>
      </div>
      {recommendation.warning && (
        <div className="flex items-start gap-2 mt-2 ml-9 p-2 bg-orange-50 rounded text-sm text-orange-700">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{recommendation.warning}</span>
        </div>
      )}
    </div>
  );
}
