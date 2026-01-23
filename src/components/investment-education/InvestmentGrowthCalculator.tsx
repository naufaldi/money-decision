import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { calculateCompoundInterest, formatLargeNumber } from '@/utils/investmentCalculations';
import { lifePlanningScenarios } from '@/data/investmentScenarios';

type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

const RISK_PROFILE_RETURNS: Record<RiskProfile, number> = {
  conservative: 5,
  moderate: 10,
  aggressive: 15,
};

interface InvestmentGrowthCalculatorProps {
  monthlyIncome?: number | null;
}

export function InvestmentGrowthCalculator({ monthlyIncome }: InvestmentGrowthCalculatorProps) {
  const personalizedDefault = monthlyIncome && monthlyIncome > 0
    ? Math.round((monthlyIncome * 0.1) / 1000) * 1000
    : 500000;
  
  const [startAge, setStartAge] = useState<number>(25);
  const [monthlyAmount, setMonthlyAmount] = useState<number>(personalizedDefault);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>('moderate');
  const [targetAge, setTargetAge] = useState<number>(55);

  const years = Math.max(1, targetAge - startAge);
  const returnRate = RISK_PROFILE_RETURNS[riskProfile];

  const result = useMemo(() => {
    return calculateCompoundInterest(0, monthlyAmount, returnRate, years);
  }, [monthlyAmount, returnRate, years]);

  const loadLifeScenario = (scenarioId: string) => {
    const scenario = lifePlanningScenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setStartAge(scenario.startAge);
      setMonthlyAmount(scenario.monthlyAmount);
      setRiskProfile('moderate');
      setTargetAge(55);
    }
  };

  // Calculate all three profiles for comparison
  const profileComparison = useMemo(() => {
    return {
      conservative: calculateCompoundInterest(0, monthlyAmount, RISK_PROFILE_RETURNS.conservative, years),
      moderate: calculateCompoundInterest(0, monthlyAmount, RISK_PROFILE_RETURNS.moderate, years),
      aggressive: calculateCompoundInterest(0, monthlyAmount, RISK_PROFILE_RETURNS.aggressive, years),
    };
  }, [monthlyAmount, years]);

  return (
    <div className="space-y-6">
      {/* Life Planning Scenarios */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Life Planning Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {lifePlanningScenarios.map(scenario => (
              <Button
                key={scenario.id}
                variant="outline"
                size="sm"
                onClick={() => loadLifeScenario(scenario.id)}
                className="h-auto py-2 px-3 flex flex-col items-start"
              >
                <span className="text-xs font-bold">{scenario.name}</span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  Age {scenario.startAge}, {formatCurrency(scenario.monthlyAmount)}/mo
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Age-Based Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Age-Based Investment Planner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Age</label>
              <Input
                type="number"
                value={startAge}
                onChange={(e) => setStartAge(Math.max(18, Math.min(65, Number(e.target.value))))}
                placeholder="25"
                aria-label="Current age"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Age</label>
              <Input
                type="number"
                value={targetAge}
                onChange={(e) => setTargetAge(Math.max(startAge + 1, Math.min(70, Number(e.target.value))))}
                placeholder="55"
                aria-label="Target retirement age"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Monthly Investment</label>
              <Input
                type="number"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Math.max(0, Number(e.target.value)))}
                placeholder="Rp 500,000"
                aria-label="Monthly investment amount"
              />
            </div>
          </div>

          {/* Risk Profile Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Risk Profile</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={riskProfile === 'conservative' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRiskProfile('conservative')}
                className="h-auto py-2 flex flex-col"
              >
                <span className="text-xs font-bold">Conservative</span>
                <span className="text-xs">5% return</span>
              </Button>
              <Button
                variant={riskProfile === 'moderate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRiskProfile('moderate')}
                className="h-auto py-2 flex flex-col"
              >
                <span className="text-xs font-bold">Moderate</span>
                <span className="text-xs">10% return</span>
              </Button>
              <Button
                variant={riskProfile === 'aggressive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRiskProfile('aggressive')}
                className="h-auto py-2 flex flex-col"
              >
                <span className="text-xs font-bold">Aggressive</span>
                <span className="text-xs">15% return</span>
              </Button>
            </div>
          </div>

          {/* Main Result */}
          <div className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-4 space-y-3">
            <p className="text-sm font-bold text-indigo-900">
              By age {targetAge} ({years} years):
            </p>
            <div className="rounded-lg bg-white p-4 border-2 border-indigo-300">
              <p className="text-xs text-indigo-700">Your Investment Will Grow To</p>
              <p className="text-3xl font-bold text-indigo-900 mt-1">
                {formatCurrency(result.finalValue)}
              </p>
              <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Total Invested</p>
                  <p className="font-bold">{formatCurrency(result.totalContribution)}</p>
                </div>
                <div>
                  <p className="text-xs text-green-700">Interest Earned</p>
                  <p className="font-bold text-green-600">{formatCurrency(result.interestEarned)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Comparison */}
          <div className="rounded-lg border p-3 space-y-3">
            <p className="text-sm font-bold">Compare All Risk Profiles:</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded bg-green-50 border border-green-200">
                <div>
                  <p className="text-sm font-medium">Conservative (5%)</p>
                  <p className="text-xs text-muted-foreground">Low risk, steady growth</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">
                    {formatLargeNumber(profileComparison.conservative.finalValue)}
                  </p>
                  <p className="text-xs text-green-600">
                    +{formatLargeNumber(profileComparison.conservative.interestEarned)}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-blue-50 border border-blue-200">
                <div>
                  <p className="text-sm font-medium">Moderate (10%)</p>
                  <p className="text-xs text-muted-foreground">Balanced risk/return</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-700">
                    {formatLargeNumber(profileComparison.moderate.finalValue)}
                  </p>
                  <p className="text-xs text-blue-600">
                    +{formatLargeNumber(profileComparison.moderate.interestEarned)}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-orange-50 border border-orange-200">
                <div>
                  <p className="text-sm font-medium">Aggressive (15%)</p>
                  <p className="text-xs text-muted-foreground">Higher risk, max growth</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-700">
                    {formatLargeNumber(profileComparison.aggressive.finalValue)}
                  </p>
                  <p className="text-xs text-orange-600">
                    +{formatLargeNumber(profileComparison.aggressive.interestEarned)}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 The difference shows the impact of taking calculated risks over long periods
            </p>
          </div>

          {/* Break-even Indicator */}
          {result.yearByYear.length > 0 && (() => {
            const breakEvenYear = result.yearByYear.find(row => row.interestEarned > row.contributed);
            return breakEvenYear ? (
              <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                <p className="text-sm font-bold text-green-900">🎯 Break-Even Point</p>
                <p className="text-sm text-green-800 mt-1">
                  Around year {breakEvenYear.year}, your interest earned will exceed your total investment!
                  That's when compound interest really kicks in.
                </p>
              </div>
            ) : null;
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
