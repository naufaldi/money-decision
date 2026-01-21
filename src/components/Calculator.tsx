import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IncomeInput } from './IncomeInput';
import { RuleSelector } from './RuleSelector';
import { ResultsDisplay } from './ResultsDisplay';
import { SavingsBreakdownComponent } from './SavingsBreakdown';
import { InvestmentProfile } from './InvestmentProfile';
import { RiskProfile, CalculatorResult } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { calculateResults } from '@/utils/calculators';
import { Calculator as CalculatorIcon, RefreshCcw, TrendingUp } from 'lucide-react';

export function MoneyCalculator() {
  const [income, setIncome] = useState<number>(0);
  const [selectedRuleId, setSelectedRuleId] = useState<string>('60-30-10');
  const [riskProfile, setRiskProfile] = useState<RiskProfile>('passive');
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);

  // Calculate results based on current state
  const results: CalculatorResult = useMemo(() => {
    if (income <= 0) {
      return {
        allocation: { needs: 0, savings: 0, wants: 0 },
        savingsBreakdown: { emergencyFund: 0, shortTermGoals: 0, longTermGoals: 0, emergencyFundTarget: 0 },
        investmentBreakdown: { recommendations: [], totalInvestment: 0 }
      };
    }

    // Estimate monthly expenses as 70% of needs (rough estimate)
    const estimatedExpenses = monthlyExpenses > 0 ? monthlyExpenses : income * 0.7 * 0.6;

    return calculateResults(income, selectedRuleId, riskProfile, estimatedExpenses);
  }, [income, selectedRuleId, riskProfile, monthlyExpenses]);

  const handleReset = () => {
    setIncome(0);
    setMonthlyExpenses(0);
    setSelectedRuleId('60-30-10');
    setRiskProfile('passive');
  };

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericString = e.target.value.replace(/[^0-9]/g, '');
    const rawValue = parseInt(numericString, 10) || 0;
    setMonthlyExpenses(rawValue);
  };

  const hasResults = income > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-bold">
          <CalculatorIcon className="h-8 w-8 text-primary" />
          Money Decision
        </h1>
        <p className="text-muted-foreground">
          Calculate your money allocation with proven budget rules
        </p>
      </div>

      {/* Income Input */}
      <IncomeInput value={income} onChange={setIncome} />

      {/* Monthly Expenses (Optional) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Expenses (Optional)</CardTitle>
          <CardDescription>For more accurate emergency fund calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              Rp
            </span>
            <Input
              type="text"
              value={monthlyExpenses > 0 ? formatCurrency(monthlyExpenses) : ''}
              onChange={handleExpenseChange}
              placeholder="Enter monthly expenses"
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Rule Selector */}
      <RuleSelector
        selectedRuleId={selectedRuleId}
        onChange={setSelectedRuleId}
      />

      {/* Results */}
      {!!hasResults && <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
          {/* Main Allocation */}
          <ResultsDisplay allocation={results.allocation} />

          {/* Savings Breakdown */}
          <SavingsBreakdownComponent breakdown={results.savingsBreakdown} />

          {/* Investment Profile */}
          <InvestmentProfile
            breakdown={results.investmentBreakdown}
            riskProfile={riskProfile}
            onRiskProfileChange={setRiskProfile}
          />

          {/* Reset Button */}
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Reset Calculator
            </Button>
          </div>
        </div>}

      {/* Empty State */}
      {!hasResults && (
        <Card className="bg-muted/50">
          <CardContent className="py-8 text-center">
            <TrendingUp className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              Enter your income above to see your personalized budget allocation
            </p>
          </CardContent>
        </Card>
      )}

      {/* Footer Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Based on proven financial frameworks like 50/30/20 and 60/30/10 rules</p>
        <p className="mt-1">Always consider your personal circumstances before making financial decisions</p>
      </div>
    </div>
  );
}
