import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepIndicators } from '../StepIndicators';
import { Step2Expenses } from '../Step2Expenses';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useWizardStep } from '@/hooks/useWizardState';
import { getNextStepPath, getPreviousStepPath } from '../wizardRoutes';

export function ExpensesPage() {
  const navigate = useNavigate();
  const { state, updateState, canProceed } = useWizardStep(2);
  const currentStep = 2;

  const handleContinue = useCallback(() => {
    if (canProceed()) {
      void navigate(getNextStepPath(currentStep), { replace: true });
    }
  }, [currentStep, canProceed, navigate]);

  const handleBack = useCallback(() => {
    void navigate(getPreviousStepPath(currentStep), { replace: true });
  }, [currentStep, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && canProceed()) {
        e.preventDefault();
        handleContinue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canProceed, handleContinue]);

  return (
    <div role="main" aria-label="Money Decision Wizard - Step 2" className="wizard-container">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Step 2 of 6: Enter your monthly expenses
      </div>
      <StepIndicators current={2} total={6} />
      <Step2Expenses
        value={state.expenses}
        onChange={v => updateState({ expenses: v })}
        income={state.income ?? undefined}
      />
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={handleBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!canProceed()} className="gap-2">
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
