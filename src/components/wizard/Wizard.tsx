import { useCallback, useEffect } from 'react';
import { StepIndicators } from './StepIndicators';
import { Step1Income } from './Step1Income';
import { Step2Expenses } from './Step2Expenses';
import { Step3Rule } from './Step3Rule';
import { Step4Results } from './Step4Results';
import { SalaryInsights } from './SalaryInsights';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useWizardStep } from '@/hooks/useWizardState';

export function Wizard() {
  const { state, updateState, canProceed } = useWizardStep(1);

  const handleNext = useCallback(() => {
    if (canProceed() && state.currentStep < 4) {
      updateState({ currentStep: state.currentStep + 1 });
    }
  }, [state.currentStep, canProceed, updateState]);

  const handleBack = useCallback(() => {
    if (state.currentStep > 1) {
      updateState({ currentStep: state.currentStep - 1 });
    }
  }, [state.currentStep, updateState]);

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
            province={state.province}
            onChange={v => updateState({ income: v })}
            onProvinceChange={p => updateState({ province: p })}
            onFamilyContextChange={answers =>
              updateState({
                hasElderlyParents: answers.hasElderlyParents,
                hasOtherFamily: answers.hasOtherFamily,
                hasPinjolDebt: answers.hasPinjolDebt,
                familySupportAmount: answers.familySupportAmount,
                pinjolDebtAmount: answers.pinjolDebtAmount,
                pinjolDebtInterest: answers.pinjolDebtInterest,
              })
            }
          />
        );
      case 2:
        return (
          <Step2Expenses
            value={state.expenses}
            income={state.income ?? undefined}
            onChange={v => updateState({ expenses: v })}
          />
        );
      case 3:
        return (
          <Step3Rule
            selected={state.selectedRuleId}
            onChange={v => updateState({ selectedRuleId: v })}
            income={state.income ?? undefined}
            expenses={state.expenses ?? undefined}
            province={state.province}
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
      {state.currentStep >= 2 && !!state.income && !!state.province && (
        <SalaryInsights income={state.income} province={state.province} />
      )}
      {state.currentStep < 4 && (
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={state.currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!canProceed()} className="gap-2">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
