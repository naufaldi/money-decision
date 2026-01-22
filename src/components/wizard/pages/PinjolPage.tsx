import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepIndicators } from '../StepIndicators';
import { Step3Pinjol } from '../Step3Pinjol';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useWizardStep } from '@/hooks/useWizardState';
import { getNextStepPath, getPreviousStepPath } from '../wizardRoutes';

export function PinjolPage() {
  const navigate = useNavigate();
  const { state, updateState, canProceed } = useWizardStep(3);
  const currentStep = 3;

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
    <div role="main" aria-label="Money Decision Wizard - Step 3" className="wizard-container">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Step 3 of 6: Pinjol debt status
      </div>
      <StepIndicators current={3} total={6} />
      <Step3Pinjol
        hasPinjolDebt={state.hasPinjolDebt}
        pinjolDebtAmount={state.pinjolDebtAmount}
        pinjolDebtInterest={state.pinjolDebtInterest}
        pinjolDebtPayment={state.pinjolDebtPayment}
        onHasPinjolDebtChange={v => updateState({ hasPinjolDebt: v })}
        onPinjolDebtAmountChange={v => updateState({ pinjolDebtAmount: v })}
        onPinjolDebtInterestChange={v => updateState({ pinjolDebtInterest: v })}
        onPinjolDebtPaymentChange={v => updateState({ pinjolDebtPayment: v })}
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
