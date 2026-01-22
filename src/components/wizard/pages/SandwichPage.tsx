import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepIndicators } from '../StepIndicators';
import { Step4Sandwich } from '../Step4Sandwich';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useWizardStep } from '@/hooks/useWizardState';
import { getNextStepPath, getPreviousStepPath } from '../wizardRoutes';

export function SandwichPage() {
  const navigate = useNavigate();
  const { state, updateState, canProceed } = useWizardStep(4);
  const currentStep = 4;

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
    <div role="main" aria-label="Money Decision Wizard - Step 4" className="wizard-container">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Step 4 of 6: Family financial support
      </div>
      <StepIndicators current={4} total={6} />
      <Step4Sandwich
        hasElderlyParents={state.hasElderlyParents}
        hasOtherFamily={state.hasOtherFamily}
        familySupportAmount={state.familySupportAmount}
        elderlySupportAmount={state.elderlySupportAmount}
        otherFamilySupportAmount={state.otherFamilySupportAmount}
        onHasElderlyParentsChange={v => updateState({ hasElderlyParents: v })}
        onHasOtherFamilyChange={v => updateState({ hasOtherFamily: v })}
        onFamilySupportAmountChange={v => updateState({ familySupportAmount: v })}
        onElderlySupportAmountChange={v => updateState({ elderlySupportAmount: v })}
        onOtherFamilySupportAmountChange={v => updateState({ otherFamilySupportAmount: v })}
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
