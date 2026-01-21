import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { RiskProfile, InvestmentBreakdown, InvestmentRecommendation } from '@/types';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface InvestmentProfileProps {
  breakdown: InvestmentBreakdown;
  riskProfile: RiskProfile;
  onRiskProfileChange: (_profile: RiskProfile) => void;
}

export function InvestmentProfile({ breakdown, riskProfile, onRiskProfileChange }: InvestmentProfileProps) {
  const [selectedProfile, setSelectedProfile] = useState<RiskProfile>(riskProfile);

  const handleProfileChange = (profile: RiskProfile) => {
    setSelectedProfile(profile);
    onRiskProfileChange(profile);
  };

  const recommendations: (InvestmentRecommendation & { amount: number })[] = breakdown.recommendations.map(rec => ({
    ...rec,
    amount: breakdown.totalInvestment * rec.percentage
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Recommendations</CardTitle>
        <CardDescription>Choose your risk profile to see personalized investment options</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Profile Toggle */}
        <div className="flex gap-2">
          <Button
            variant={selectedProfile === 'passive' ? 'default' : 'outline'}
            onClick={() => handleProfileChange('passive')}
            className="flex-1"
          >
            Passive
            <span className="ml-2 text-xs opacity-70">Low risk</span>
          </Button>
          <Button
            variant={selectedProfile === 'aggressive' ? 'default' : 'outline'}
            onClick={() => handleProfileChange('aggressive')}
            className={cn(
              "flex-1",
              selectedProfile === 'aggressive' && "bg-orange-500 hover:bg-orange-600"
            )}
          >
            Aggressive
            <span className="ml-2 text-xs opacity-70">High risk</span>
          </Button>
        </div>

        {/* Investment Breakdown */}
        <div className="mt-4 space-y-3">
          {recommendations.map((rec, index) => (
            <div key={index} className="rounded-lg border p-3">
              <div className="mb-1 flex items-start justify-between">
                <span className="font-medium">{rec.name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(rec.amount)}
                </span>
              </div>
              <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>{rec.percentage * 100}% of investment</span>
                <span className={cn(
                  "rounded px-2 py-0.5 text-xs",
                  rec.risk === 'low' && "bg-green-100 text-green-700",
                  rec.risk === 'medium' && "bg-yellow-100 text-yellow-700",
                  rec.risk === 'high' && "bg-orange-100 text-orange-700",
                  rec.risk === 'very-high' && "bg-red-100 text-red-700"
                )}>
                  {rec.risk} risk
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
              {rec.warning ? <div className="mt-2 flex items-start gap-2 rounded bg-orange-50 p-2 text-sm text-orange-700">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{rec.warning}</span>
                </div> : null}
            </div>
          ))}
        </div>

        <div className="border-t pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Investment</span>
            <span className="font-semibold">{formatCurrency(breakdown.totalInvestment)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
