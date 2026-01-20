import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Step3RuleProps {
  selected: string;
  onChange: (value: string) => void;
}

const RULES = [
  { id: '60-30-10', name: '60/30/10', description: 'Recommended for beginners' },
  { id: '50-30-20', name: '50/30/20', description: 'Balanced approach' },
  { id: '70-20-10', name: '70/20/10', description: 'Higher lifestyle allocation' },
];

export function Step3Rule({ selected, onChange }: Step3RuleProps) {
  return (
    <Card className="wizard-card">
      <CardHeader>
        <CardTitle className="text-center">Select Your Budget Rule</CardTitle>
        <CardDescription className="text-center">Choose the allocation strategy that fits your goals</CardDescription>
      </CardHeader>
      <CardContent>
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
            </label>
          ))}
        </fieldset>
      </CardContent>
    </Card>
  );
}
