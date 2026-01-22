import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepIndicators } from '../StepIndicators';
import { Step3Rule } from '../Step3Rule';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useWizardStep } from '@/hooks/useWizardState';
import { getNextStepPath, getPreviousStepPath } from '../wizardRoutes';

export function RulePage() {
  const navigate = useNavigate();
  const { state, updateState, canProceed } = useWizardStep(5);
  const currentStep = 5;

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
    <div role="main" aria-label="Money Decision Wizard - Step 5" className="wizard-container">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Step 5 of 6: Select your budget rule
      </div>
      <StepIndicators current={5} total={6} />
      <Step3Rule
        selected={state.selectedRuleId}
        onChange={v => updateState({ selectedRuleId: v })}
        income={state.income ?? undefined}
        expenses={state.expenses ?? undefined}
        province={state.province}
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
