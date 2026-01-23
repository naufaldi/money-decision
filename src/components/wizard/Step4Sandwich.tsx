import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Users, Heart } from 'lucide-react';

interface Step4SandwichProps {
  hasElderlyParents: boolean;
  hasOtherFamily: boolean;
  elderlySupportAmount: number | null;
  otherFamilySupportAmount: number | null;
  onHasElderlyParentsChange: (_value: boolean) => void;
  onHasOtherFamilyChange: (_value: boolean) => void;
  onFamilySupportAmountChange: (_value: number | null) => void;
  onElderlySupportAmountChange: (_value: number | null) => void;
  onOtherFamilySupportAmountChange: (_value: number | null) => void;
}

export function Step4Sandwich({
  hasElderlyParents,
  hasOtherFamily,
  elderlySupportAmount,
  otherFamilySupportAmount,
  onHasElderlyParentsChange,
  onHasOtherFamilyChange,
  onFamilySupportAmountChange,
  onElderlySupportAmountChange,
  onOtherFamilySupportAmountChange,
}: Step4SandwichProps) {
  const [elderlySupportDisplay, setElderlySupportDisplay] = useState('');
  const [otherFamilySupportDisplay, setOtherFamilySupportDisplay] = useState('');

  useEffect(() => {
    if (elderlySupportAmount) {
      setElderlySupportDisplay(new Intl.NumberFormat('id-ID').format(elderlySupportAmount));
    }
  }, [elderlySupportAmount]);

  useEffect(() => {
    if (otherFamilySupportAmount) {
      setOtherFamilySupportDisplay(new Intl.NumberFormat('id-ID').format(otherFamilySupportAmount));
    }
  }, [otherFamilySupportAmount]);

  const handleElderlySupportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/[^0-9]/g, '');
    setElderlySupportDisplay(e.target.value);
    const value = numeric ? parseInt(numeric, 10) : null;
    onElderlySupportAmountChange(value);
    updateTotalFamilySupport(value, otherFamilySupportAmount);
  };

  const handleOtherFamilySupportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/[^0-9]/g, '');
    setOtherFamilySupportDisplay(e.target.value);
    const value = numeric ? parseInt(numeric, 10) : null;
    onOtherFamilySupportAmountChange(value);
    updateTotalFamilySupport(elderlySupportAmount, value);
  };

  const updateTotalFamilySupport = (elderly: number | null, other: number | null) => {
    const elderlyAmt = elderly ?? 0;
    const otherAmt = other ?? 0;
    const total = elderlyAmt + otherAmt;
    onFamilySupportAmountChange(total > 0 ? total : null);
  };

  const hasAnyFamilySupport = hasElderlyParents || hasOtherFamily;

  return (
    <Card className="wizard-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2 text-center">
          <Users className="h-5 w-5" aria-hidden="true" />
          Family Financial Support
        </CardTitle>
        <CardDescription className="text-center">
          Do you financially support family members?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-sm text-muted-foreground">
            The "sandwich generation" refers to those who support both elderly parents and younger family members. Understanding this helps us provide realistic budget recommendations.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <p className="mb-3 text-sm font-medium">Do you financially support elderly parents?</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onHasElderlyParentsChange(true)}
                className={`rounded-lg border p-3 text-center transition-all ${
                  hasElderlyParents
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:bg-muted'
                }`}
                role="button"
                aria-pressed={hasElderlyParents}
              >
                <span className="text-sm">Yes</span>
              </button>
              <button
                type="button"
                onClick={() => onHasElderlyParentsChange(false)}
                className={`rounded-lg border p-3 text-center transition-all ${
                  !hasElderlyParents
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:bg-muted'
                }`}
                role="button"
                aria-pressed={!hasElderlyParents}
              >
                <span className="text-sm">No</span>
              </button>
            </div>
            {hasElderlyParents ? <div className="mt-3 space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-primary">
                  <Heart className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm font-medium">Monthly Elderly Parents Support</span>
                </div>
                <div>
                  <Input
                    id="elderly-support-amount"
                    type="text"
                    placeholder="Rp 1,000,000"
                    value={elderlySupportDisplay}
                    onChange={handleElderlySupportChange}
                    className="border-primary/30 focus:border-primary"
                    aria-describedby="elderly-support-hint"
                  />
                  <p id="elderly-support-hint" className="mt-1 text-xs text-muted-foreground">
                    Monthly support for elderly parents (healthcare, daily expenses, etc.)
                  </p>
                </div>
              </div> : null}
          </div>

          <div>
            <p className="mb-3 text-sm font-medium">
              Do you support other family members (siblings, relatives)?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onHasOtherFamilyChange(true)}
                className={`rounded-lg border p-3 text-center transition-all ${
                  hasOtherFamily
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:bg-muted'
                }`}
                role="button"
                aria-pressed={hasOtherFamily}
              >
                <span className="text-sm">Yes</span>
              </button>
              <button
                type="button"
                onClick={() => onHasOtherFamilyChange(false)}
                className={`rounded-lg border p-3 text-center transition-all ${
                  !hasOtherFamily
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:bg-muted'
                }`}
                role="button"
                aria-pressed={!hasOtherFamily}
              >
                <span className="text-sm">No</span>
              </button>
            </div>
            {hasOtherFamily ? <div className="mt-3 space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-primary">
                  <Heart className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm font-medium">Monthly Other Family Support</span>
                </div>
                <div>
                  <Input
                    id="other-family-support-amount"
                    type="text"
                    placeholder="Rp 500,000"
                    value={otherFamilySupportDisplay}
                    onChange={handleOtherFamilySupportChange}
                    className="border-primary/30 focus:border-primary"
                    aria-describedby="other-family-support-hint"
                  />
                  <p id="other-family-support-hint" className="mt-1 text-xs text-muted-foreground">
                    Monthly support for siblings or other relatives (education, living costs, etc.)
                  </p>
                </div>
              </div> : null}
          </div>
        </div>

        {hasAnyFamilySupport ? <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              Total family support:{' '}
              <span className="font-medium">
                Rp {new Intl.NumberFormat('id-ID').format((elderlySupportAmount || 0) + (otherFamilySupportAmount || 0))}
              </span>{' '}
              / month
            </p>
          </div> : null}

        {!hasAnyFamilySupport && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            You can focus your budget on your own needs, savings, and goals without family support obligations.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
