import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { recommendRuleEnhanced } from '@/utils/expenseRuleFit';
import { Check, Sparkles } from 'lucide-react';

interface Step3RuleProps {
  selected: string;
  onChange: (_value: string) => void;
  income?: number;
  expenses?: number;
  province?: string | null;
}

export function Step3Rule({ selected, onChange, income, expenses, province }: Step3RuleProps) {
  const hasSpendingData = expenses !== undefined && expenses !== null;
  const recommendation = income && income > 0 && (hasSpendingData || province)
    ? recommendRuleEnhanced(income, expenses ?? null, province ?? undefined)
    : null;
  const showRecommendation = recommendation && recommendation.rule.id !== selected;

  return (
    <Card className="wizard-card">
      <CardHeader>
        <CardTitle className="text-center">Select Your Budget Rule</CardTitle>
        <CardDescription className="text-center">Choose the allocation strategy that fits your goals</CardDescription>
      </CardHeader>
      <CardContent>
        {showRecommendation ? <div className="mb-4 rounded-lg border border-primary/20 bg-primary/10 p-3">
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              {hasSpendingData ? 'Recommended based on your spending' : 'Recommended based on your income'}
            </div>
            <p className="text-xs text-muted-foreground">
              {recommendation.reason}
            </p>
          </div> : null}
        <fieldset className="space-y-3">
          <legend className="sr-only">Choose a budget rule</legend>
          {RULES.map((rule) => (
            <label
              key={rule.id}
              className={`flex cursor-pointer items-center rounded-lg border p-4 transition-colors ${
                selected === rule.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-muted'
              }`}
            >
              <input
                type="radio"
                name="budget-rule"
                value={rule.id}
                checked={selected === rule.id}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
                aria-describedby={`${rule.id}-description`}
              />
              <span className="mr-3 font-medium">{rule.name}</span>
              <span id={`${rule.id}-description`} className="text-sm text-muted-foreground">
                {rule.description}
              </span>
              {recommendation?.rule.id === rule.id && selected !== rule.id && (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  <Sparkles className="h-3 w-3" />
                  Suggested
                </span>
              )}
              {selected === rule.id && (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                  <Check className="h-3 w-3" />
                  Selected
                </span>
              )}
            </label>
          ))}
        </fieldset>
      </CardContent>
    </Card>
  );
}

const RULES = [
  { id: '60-30-10', name: '60/30/10', description: 'Recommended for beginners' },
  { id: '50-30-20', name: '50/30/20', description: 'Balanced approach' },
  { id: '70-20-10', name: '70/20/10', description: 'Higher lifestyle allocation' },
];
