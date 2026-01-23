import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatters';
import { computeExpenseMetrics, formatSpendingRatio } from '@/utils/expenseRuleFit';
import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { BUDGET_RULES, type BudgetRule } from '@/constants/rules';

interface RuleImpact {
  id: string;
  name: string;
  savingsAmount: number;
  wantsAmount: number;
  needsAmount: number;
  isFeasible: boolean;
  cutNeeded: number;
}

function calculateRuleImpact(income: number, expenses: number): RuleImpact[] {
  return BUDGET_RULES.map((rule) => ({
    id: rule.id,
    name: rule.name,
    savingsAmount: income * rule.allocation.savings,
    wantsAmount: income * rule.allocation.wants,
    needsAmount: income * rule.allocation.needs,
    isFeasible: expenses <= income - income * rule.allocation.savings,
    cutNeeded: Math.max(0, expenses - (income - income * rule.allocation.savings)),
  }));
}

interface BudgetImpactMessageProps {
  income: number;
  expenses: number;
  surplus: number;
  spendingRatio: number;
}

function BudgetImpactMessage({
  income,
  expenses,
  surplus,
  spendingRatio,
}: BudgetImpactMessageProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const ruleImpacts = calculateRuleImpact(income, expenses);
  const hasDeficit = surplus < 0;
  const hasSurplus = surplus > 0;
  const isBreakEven = surplus === 0;

  if (isBreakEven) {
    return (
      <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800">
              Your spending matches your income perfectly
            </p>
            <p className="mt-1 text-xs text-blue-700">
              To start saving, you'll need to reduce expenses. Choose a budget rule in the next step to see recommended cuts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (hasSurplus) {
    const feasibleRules = ruleImpacts.filter((r) => r.isFeasible);
    const bestSavingsRule = [...feasibleRules].sort(
      (a, b) => b.savingsAmount - a.savingsAmount
    )[0];

    return (
      <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
        <div className="flex items-start gap-3">
          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">
              Great news! You have {formatCurrency(surplus)} monthly surplus
            </p>
            <p className="mt-1 text-xs text-green-700">
              Your spending is {Math.round(spendingRatio * 100)}% of your income. You can
              allocate this surplus to savings and wants based on your budget rule.
            </p>

            {feasibleRules.length > 0 && (
              <details
                className="mt-2 text-xs text-green-700"
                open={isExpanded}
                onToggle={(e) => setIsExpanded(e.currentTarget.open)}
              >
                <summary className="cursor-pointer font-medium hover:text-green-900">
                  How different budget rules use your surplus
                </summary>
                <div className="mt-2 space-y-2">
                  {feasibleRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="rounded border border-green-200 bg-white p-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-green-800">{rule.name}</span>
                        {rule.id === bestSavingsRule?.id && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-2 py-0.5 text-xs font-medium text-white">
                            <Sparkles className="h-3 w-3" />
                            Best Savings
                          </span>
                        )}
                      </div>
                      <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-green-600">Savings:</span>{' '}
                          <span className="font-medium">
                            {formatCurrency(rule.savingsAmount)}
                          </span>
                        </div>
                        <div>
                          <span className="text-green-600">Wants:</span>{' '}
                          <span className="font-medium">
                            {formatCurrency(rule.wantsAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

interface Step2ExpensesProps {
  value: number | null;
  onChange: (_value: number) => void;
  income?: number;
}

export function Step2Expenses({ value, onChange, income }: Step2ExpensesProps) {
  const [displayValue, setDisplayValue] = useState(formatCurrency(value ?? 0));
  const [warning, setWarning] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ReturnType<typeof computeExpenseMetrics> | null>(null);

  useEffect(() => {
    if (value && value > 0) {
      setDisplayValue(formatCurrency(value));
    }
  }, [value]);

  useEffect(() => {
    if (income && income > 0) {
      const computed = computeExpenseMetrics(income, value);
      setMetrics(computed);

      if (value && value > income) {
        setWarning('Expenses exceed your income');
      } else {
        setWarning(null);
      }
    }
  }, [income, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericString = e.target.value.replace(/[^0-9]/g, '');
    const rawValue = parseInt(numericString, 10) || 0;
    setDisplayValue(e.target.value);
    onChange(rawValue);
  };

  const showMetrics = income && income > 0 && value && value > 0;

  return (
    <Card className="wizard-card">
      <CardHeader>
        <CardTitle className="text-center">Total Monthly Spending (Optional)</CardTitle>
        <CardDescription className="text-center">
          <p>Enter all your expenses to get personalized recommendations</p>
          <details className="mt-2 text-xs text-muted-foreground">
            <summary className="cursor-pointer transition-colors hover:text-foreground">
              What's included in monthly spending?
            </summary>
            <ul className="mt-2 list-none space-y-1 text-left">
              <li>• Housing (rent, utilities, maintenance)</li>
              <li>• Transportation (fuel, public transport)</li>
              <li>• Food (groceries, dining out)</li>
              <li>• Healthcare, personal care, clothing</li>
              <li>• Entertainment, education, social activities</li>
            </ul>
          </details>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          aria-label="Total monthly spending"
          value={displayValue}
          onChange={handleChange}
          placeholder="Enter total monthly expenses"
        />

        {warning ? <div role="alert" className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-600">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{warning}</span>
          </div> : null}

        {showMetrics && metrics ? <div className="space-y-3 rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Spending ratio:</span>
              <span className="font-medium">{formatSpendingRatio(metrics.spendingRatio)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monthly cashflow:</span>
              <span className={`font-medium ${metrics.cashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(metrics.cashflow)}
              </span>
            </div>
            {metrics.isDeficit ? <p className="mt-2 text-xs text-amber-600">
                You are spending more than you earn. Consider reducing expenses or increasing income.
              </p> : null}

            {income && value ? (
              <BudgetImpactMessage
                income={income}
                expenses={value}
                surplus={metrics.cashflow}
                spendingRatio={metrics.spendingRatio}
              />
            ) : null}
          </div> : null}

        {!showMetrics && income && income > 0 ? <p className="text-center text-xs text-muted-foreground">
            Enter your expenses above to see your spending breakdown
          </p> : null}
      </CardContent>
    </Card>
  );
}
