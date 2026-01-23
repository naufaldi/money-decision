import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepIndicators } from '../StepIndicators';
import { Step1Income } from '../Step1Income';
import { SalaryInsights } from '../SalaryInsights';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useWizardStep } from '@/hooks/useWizardState';
import { getNextStepPath, getPreviousStepPath } from '../wizardRoutes';

export function IncomePage() {
  const navigate = useNavigate();
  const { state, updateState, canProceed } = useWizardStep(1);
  const currentStep = 1;

  const handleContinue = useCallback(() => {
    const canProceedNow =
      state.income !== null &&
      state.income > 0 &&
      state.province !== null &&
      state.province !== '';

    if (canProceedNow) {
      void navigate(getNextStepPath(currentStep), { replace: true });
    }
  }, [currentStep, state.income, state.province, navigate]);

  const handleBack = useCallback(() => {
    void navigate(getPreviousStepPath(currentStep), { replace: true });
  }, [currentStep, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const canProceedNow =
        state.income !== null &&
        state.income > 0 &&
        state.province !== null &&
        state.province !== '';

      if (e.key === 'Enter' && canProceedNow) {
        e.preventDefault();
        handleContinue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.income, state.province, handleContinue]);

  return (
    <div role="main" aria-label="Money Decision Wizard - Step 1" className="wizard-container">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Step 1 of 6: Enter your income
      </div>
      <StepIndicators current={1} total={6} />
      <Step1Income
        value={state.income}
        province={state.province}
        onChange={v => updateState({ income: v })}
        onProvinceChange={p => updateState({ province: p })}
      />
      {!!state.income && !!state.province && (
        <SalaryInsights income={state.income} province={state.province} />
      )}
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
