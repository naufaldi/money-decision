import { useState, useCallback, useEffect } from 'react';
import { StepIndicators } from './StepIndicators';
import { Step1Income } from './Step1Income';
import { Step2Expenses } from './Step2Expenses';
import { Step3Rule } from './Step3Rule';
import { Step4Results } from './Step4Results';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface WizardState {
  currentStep: number;
  income: number | null;
  expenses: number | null;
  selectedRuleId: string;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
}

const initialState: WizardState = {
  currentStep: 1,
  income: null,
  expenses: null,
  selectedRuleId: '60-30-10',
  riskProfile: 'conservative',
};

export function Wizard() {
  const [state, setState] = useState<WizardState>(initialState);

  const canProceed = useCallback(() => {
    switch (state.currentStep) {
      case 1:
        return state.income !== null && state.income > 0;
      case 2:
        return true;
      case 3:
        return !!state.selectedRuleId;
      default:
        return true;
    }
  }, [state]);

  const handleNext = useCallback(() => {
    if (canProceed() && state.currentStep < 4) {
      setState((s) => ({ ...s, currentStep: s.currentStep + 1 }));
    }
  }, [state.currentStep, canProceed]);

  const handleBack = useCallback(() => {
    if (state.currentStep > 1) {
      setState((s) => ({ ...s, currentStep: s.currentStep - 1 }));
    }
  }, [state.currentStep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.currentStep >= 4) return;

      if (e.key === 'Enter' && canProceed() && !e.shiftKey) {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' && e.shiftKey) {
        e.preventDefault();
        if (state.currentStep > 1) handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.currentStep, canProceed, handleNext, handleBack]);

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <Step1Income
            value={state.income}
            onChange={(v) => setState((s) => ({ ...s, income: v }))}
          />
        );
      case 2:
        return (
          <Step2Expenses
            value={state.expenses}
            income={state.income || undefined}
            onChange={(v) => setState((s) => ({ ...s, expenses: v }))}
          />
        );
      case 3:
        return (
          <Step3Rule
            selected={state.selectedRuleId}
            onChange={(v) => setState((s) => ({ ...s, selectedRuleId: v }))}
          />
        );
      case 4:
        return <Step4Results data={state} />;
      default:
        return null;
    }
  };

  return (
    <div role="main" aria-label="Money Decision Wizard" className="wizard-container">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {state.currentStep === 1 && 'Step 1 of 4: Enter your income'}
        {state.currentStep === 2 && 'Step 2 of 4: Enter your monthly expenses'}
        {state.currentStep === 3 && 'Step 3 of 4: Select your budget rule'}
        {state.currentStep === 4 && 'Step 4 of 4: Your financial plan'}
      </div>
      <StepIndicators current={state.currentStep} total={4} />
      {renderStep()}
      {state.currentStep < 4 && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={state.currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!canProceed()} className="gap-2">
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
