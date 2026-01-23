import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calculator, Sparkles, Target } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { calculateCompoundInterest, calculateMonthlyForGoal, formatLargeNumber } from '@/utils/investmentCalculations';
import { quickScenarios } from '@/data/investmentScenarios';
import { InvestmentGrowthCalculator } from './InvestmentGrowthCalculator';

type CalculatorMode = 'standard' | 'goal-based' | 'age-based';

export function CompoundInterestCalculator() {
  const [mode, setMode] = useState<CalculatorMode>('standard');
  
  // Standard mode inputs
  const [initialInvestment, setInitialInvestment] = useState<number>(1000000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500000);
  const [returnRate, setReturnRate] = useState<number>(7);
  const [years, setYears] = useState<number>(10);
  
  // Goal-based mode inputs
  const [targetAmount, setTargetAmount] = useState<number>(100000000);
  const [goalYears, setGoalYears] = useState<number>(10);
  const [goalReturnRate, setGoalReturnRate] = useState<number>(10);
  
  const standardResult = useMemo(() => {
    return calculateCompoundInterest(initialInvestment, monthlyContribution, returnRate, years);
  }, [initialInvestment, monthlyContribution, returnRate, years]);
  
  const goalResult = useMemo(() => {
    return calculateMonthlyForGoal(targetAmount, goalReturnRate, goalYears, 0);
  }, [targetAmount, goalReturnRate, goalYears]);
  
  const loadScenario = (scenarioId: string) => {
    const scenario = quickScenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setInitialInvestment(0);
      setMonthlyContribution(scenario.monthlyAmount);
      setReturnRate(scenario.returnRate);
      setYears(scenario.years);
      setMode('standard');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant={mode === 'standard' ? 'default' : 'outline'}
          onClick={() => setMode('standard')}
          size="sm"
        >
          <Calculator className="h-4 w-4 mr-2" />
          Standard
        </Button>
        <Button
          variant={mode === 'goal-based' ? 'default' : 'outline'}
          onClick={() => setMode('goal-based')}
          size="sm"
        >
          <Target className="h-4 w-4 mr-2" />
          Goal-Based
        </Button>
        <Button
          variant={mode === 'age-based' ? 'default' : 'outline'}
          onClick={() => setMode('age-based')}
          size="sm"
        >
          Age Planner
        </Button>
      </div>

      {mode === 'standard' && (
        <>
          {/* Quick Scenarios */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Quick Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {quickScenarios.map(scenario => (
                  <Button
                    key={scenario.id}
                    variant="outline"
                    size="sm"
                    onClick={() => loadScenario(scenario.id)}
                    className="h-auto py-2 px-3 flex flex-col items-start"
                  >
                    <span className="text-xs font-bold">{scenario.name}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {formatCurrency(scenario.monthlyAmount)}/mo
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Standard Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Investment Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Initial Investment</label>
                  <Input
                    type="number"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(Math.max(0, Number(e.target.value)))}
                    placeholder="Rp 1,000,000"
                    aria-label="Initial investment amount"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Monthly Contribution</label>
                  <Input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                    placeholder="Rp 500,000"
                    aria-label="Monthly contribution amount"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Annual Return Rate (%)</label>
                  <Input
                    type="number"
                    value={returnRate}
                    onChange={(e) => setReturnRate(Math.max(0, Math.min(50, Number(e.target.value))))}
                    placeholder="7"
                    aria-label="Annual return rate percentage"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Investment Period (years)</label>
                  <Input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(Math.max(1, Math.min(50, Number(e.target.value))))}
                    placeholder="10"
                    aria-label="Investment period in years"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 space-y-3">
                <p className="text-sm font-bold text-blue-900">Results:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-lg bg-white p-3 border border-blue-300">
                    <p className="text-xs text-blue-700">Total Contribution</p>
                    <p className="text-lg font-bold text-blue-900">
                      {formatCurrency(standardResult.totalContribution)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-3 border border-green-300">
                    <p className="text-xs text-green-700">Interest Earned</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(standardResult.interestEarned)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-3 border border-indigo-300">
                    <p className="text-xs text-indigo-700">Final Value</p>
                    <p className="text-lg font-bold text-indigo-900">
                      {formatCurrency(standardResult.finalValue)}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-white border border-blue-200 p-3">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Without investing:</strong> You'd have only {formatCurrency(standardResult.totalContribution)}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    <strong>With investing:</strong> You gain an extra {formatCurrency(standardResult.interestEarned)} ({Math.round((standardResult.interestEarned / standardResult.totalContribution) * 100)}%)
                  </p>
                </div>
              </div>

              {/* Year by Year Table */}
              {standardResult.yearByYear.length > 0 && (
                <div className="rounded-lg border p-3 space-y-2">
                  <p className="text-sm font-bold">Year-by-Year Growth</p>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-background">
                        <tr className="border-b">
                          <th className="text-left py-2">Year</th>
                          <th className="text-right py-2">Invested</th>
                          <th className="text-right py-2">Interest</th>
                          <th className="text-right py-2">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {standardResult.yearByYear.map((row) => (
                          <tr key={row.year} className="border-b">
                            <td className="py-2">{row.year}</td>
                            <td className="text-right">{formatLargeNumber(row.contributed)}</td>
                            <td className="text-right text-green-600">{formatLargeNumber(row.interestEarned)}</td>
                            <td className="text-right font-bold">{formatLargeNumber(row.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {mode === 'goal-based' && (
        <>
          {/* Goal-Based Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Goal-Based Calculator</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter your target amount and see how much you need to save monthly
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Amount</label>
                  <Input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Math.max(0, Number(e.target.value)))}
                    placeholder="Rp 100,000,000"
                    aria-label="Target amount"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Period (years)</label>
                  <Input
                    type="number"
                    value={goalYears}
                    onChange={(e) => setGoalYears(Math.max(1, Math.min(50, Number(e.target.value))))}
                    placeholder="10"
                    aria-label="Time period in years"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expected Return (%)</label>
                  <Input
                    type="number"
                    value={goalReturnRate}
                    onChange={(e) => setGoalReturnRate(Math.max(0, Math.min(50, Number(e.target.value))))}
                    placeholder="10"
                    aria-label="Expected annual return rate"
                  />
                </div>
              </div>

              {/* Goal Results */}
              <div className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-4 space-y-3">
                <p className="text-sm font-bold text-indigo-900">To reach your goal:</p>
                <div className="rounded-lg bg-white p-4 border-2 border-indigo-300">
                  <p className="text-xs text-indigo-700">You need to save monthly</p>
                  <p className="text-3xl font-bold text-indigo-900 mt-1">
                    {formatCurrency(goalResult.monthlyNeeded)}
                  </p>
                  <p className="text-xs text-indigo-600 mt-2">
                    For {goalYears} years at {goalReturnRate}% annual return
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white p-3 border">
                    <p className="text-xs text-muted-foreground">Total You'll Invest</p>
                    <p className="font-bold">{formatCurrency(goalResult.totalInvested)}</p>
                  </div>
                  <div className="rounded-lg bg-white p-3 border border-green-300">
                    <p className="text-xs text-green-700">Interest Earned</p>
                    <p className="font-bold text-green-600">{formatCurrency(goalResult.interestEarned)}</p>
                  </div>
                </div>
              </div>

              {/* Quick Goal Examples */}
              <div className="rounded-lg border p-3 space-y-2">
                <p className="text-sm font-bold">Popular Goals:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTargetAmount(500000000);
                      setGoalYears(20);
                      setGoalReturnRate(10);
                    }}
                    className="h-auto py-2 flex flex-col items-start"
                  >
                    <span className="text-xs font-bold">Modest Retirement</span>
                    <span className="text-xs text-muted-foreground">Rp 500M in 20y</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTargetAmount(1000000000);
                      setGoalYears(20);
                      setGoalReturnRate(10);
                    }}
                    className="h-auto py-2 flex flex-col items-start"
                  >
                    <span className="text-xs font-bold">Retirement Goal</span>
                    <span className="text-xs text-muted-foreground">Rp 1B in 20y</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTargetAmount(2000000000);
                      setGoalYears(25);
                      setGoalReturnRate(10);
                    }}
                    className="h-auto py-2 flex flex-col items-start"
                  >
                    <span className="text-xs font-bold">Comfortable Life</span>
                    <span className="text-xs text-muted-foreground">Rp 2B in 25y</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {mode === 'age-based' && (
        <InvestmentGrowthCalculator />
      )}

      {/* Educational Note */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <p className="text-xs text-amber-900">
            <strong>Note:</strong> These calculations assume consistent monthly contributions and steady returns. 
            Real investment returns fluctuate. Past performance does not guarantee future results.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
