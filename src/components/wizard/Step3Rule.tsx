import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { recommendRule } from '@/utils/expenseRuleFit';
import { Check, Sparkles } from 'lucide-react';

interface Step3RuleProps {
  selected: string;
  onChange: (value: string) => void;
  income?: number;
  expenses?: number;
}

export function Step3Rule({ selected, onChange, income, expenses }: Step3RuleProps) {
  const recommendation = income && income > 0 ? recommendRule(income, expenses ?? null) : null;
  const showRecommendation = recommendation && recommendation.rule.id !== selected;

  return (
    <Card className="wizard-card">
      <CardHeader>
        <CardTitle className="text-center">Select Your Budget Rule</CardTitle>
        <CardDescription className="text-center">Choose the allocation strategy that fits your goals</CardDescription>
      </CardHeader>
      <CardContent>
        {showRecommendation && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
              <Sparkles className="w-4 h-4" />
              Recommended based on your spending
            </div>
            <p className="text-xs text-muted-foreground">
              {recommendation.reason}
            </p>
          </div>
        )}
        <fieldset className="space-y-3">
          <legend className="sr-only">Choose a budget rule</legend>
          {RULES.map((rule) => (
            <label
              key={rule.id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
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
              <span className="font-medium mr-3">{rule.name}</span>
              <span id={`${rule.id}-description`} className="text-muted-foreground text-sm">
                {rule.description}
              </span>
              {recommendation?.rule.id === rule.id && selected !== rule.id && (
                <span className="ml-auto inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Suggested
                </span>
              )}
              {selected === rule.id && (
                <span className="ml-auto inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  <Check className="w-3 h-3" />
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
