import { useId } from 'react';
import { BUDGET_RULES } from '@/constants/rules';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RuleSelectorProps {
  selectedRuleId: string;
  onChange: (ruleId: string) => void;
}

export function RuleSelector({ selectedRuleId, onChange }: RuleSelectorProps) {
  const groupId = useId();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Rule</CardTitle>
        <CardDescription>Choose a budget rule that fits your lifestyle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {BUDGET_RULES.map((rule) => (
            <label
              key={rule.id}
              className={cn(
                "flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all",
                selectedRuleId === rule.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <input
                type="radio"
                name={groupId}
                value={rule.id}
                checked={selectedRuleId === rule.id}
                onChange={() => onChange(rule.id)}
                className="sr-only"
              />
              <div className="flex items-center justify-between">
                <span className="font-semibold">{rule.name}</span>
                {selectedRuleId === rule.id && (
                  <span className="text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                )}
              </div>
              <span className="text-sm text-muted-foreground mt-1">
                {rule.allocation.needs * 100}% needs • {rule.allocation.savings * 100}% savings • {rule.allocation.wants * 100}% wants
              </span>
              <span className="text-sm mt-2">{rule.description}</span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
