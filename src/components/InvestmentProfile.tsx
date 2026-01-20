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
  onRiskProfileChange: (profile: RiskProfile) => void;
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
        <div className="space-y-3 mt-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-3 rounded-lg border">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium">{rec.name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(rec.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                <span>{rec.percentage * 100}% of investment</span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-xs",
                  rec.risk === 'low' && "bg-green-100 text-green-700",
                  rec.risk === 'medium' && "bg-yellow-100 text-yellow-700",
                  rec.risk === 'high' && "bg-orange-100 text-orange-700",
                  rec.risk === 'very-high' && "bg-red-100 text-red-700"
                )}>
                  {rec.risk} risk
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
              {rec.warning && (
                <div className="flex items-start gap-2 mt-2 p-2 bg-orange-50 rounded text-sm text-orange-700">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{rec.warning}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total Investment</span>
            <span className="font-semibold">{formatCurrency(breakdown.totalInvestment)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
