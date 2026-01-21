import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StepIndicators } from './StepIndicators';
import { Step1Income } from './Step1Income';
import { Step2Expenses } from './Step2Expenses';
import { Step3Rule } from './Step3Rule';
import { Step4Results } from './Step4Results';
import { SalaryInsights } from './SalaryInsights';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface WizardState {
  currentStep: number;
  income: number | null;
  expenses: number | null;
  selectedRuleId: string;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  province: string | null;
  incomeType: 'fixed' | 'variable' | 'mixed';
  hasElderlyParents: boolean;
  hasOtherFamily: boolean;
  hasPinjolDebt: boolean;
  familySupportAmount: number | null;
  pinjolDebtAmount: number | null;
  pinjolDebtInterest: number | null;
}

export function Wizard() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL params
  const [state, setState] = useState<WizardState>(() => ({
    currentStep: parseInt(searchParams.get('step') ?? '1', 10),
    income: searchParams.get('income') ? parseInt(searchParams.get('income')!, 10) : null,
    expenses: searchParams.get('expenses') ? parseInt(searchParams.get('expenses')!, 10) : null,
    selectedRuleId: searchParams.get('rule') ?? '60-30-10',
    riskProfile:
      (searchParams.get('risk') as 'conservative' | 'moderate' | 'aggressive') ?? 'conservative',
    province: searchParams.get('province') ?? null,
    incomeType: (searchParams.get('incomeType') as 'fixed' | 'variable' | 'mixed') ?? 'fixed',
    hasElderlyParents: searchParams.get('elderlyParents') === 'true',
    hasOtherFamily: searchParams.get('youngerSiblings') === 'true',
    hasPinjolDebt: searchParams.get('pinjolDebt') === 'true',
    familySupportAmount: searchParams.get('familySupport')
      ? parseInt(searchParams.get('familySupport')!, 10)
      : null,
    pinjolDebtAmount: searchParams.get('pinjolAmount')
      ? parseInt(searchParams.get('pinjolAmount')!, 10)
      : null,
    pinjolDebtInterest: searchParams.get('pinjolInterest')
      ? parseFloat(searchParams.get('pinjolInterest')!)
      : null,
  }));

  // Sync state changes to URL
  useEffect(() => {
    const params: Record<string, string> = {};
    params.step = state.currentStep.toString();
    if (state.income) params.income = state.income.toString();
    if (state.expenses) params.expenses = state.expenses.toString();
    params.rule = state.selectedRuleId;
    params.risk = state.riskProfile;
    if (state.province) params.province = state.province;
    params.incomeType = state.incomeType;
    params.elderlyParents = state.hasElderlyParents.toString();
    params.youngerSiblings = state.hasOtherFamily.toString();
    params.pinjolDebt = state.hasPinjolDebt.toString();
    if (state.familySupportAmount) params.familySupport = state.familySupportAmount.toString();
    if (state.pinjolDebtAmount) params.pinjolAmount = state.pinjolDebtAmount.toString();
    if (state.pinjolDebtInterest) params.pinjolInterest = state.pinjolDebtInterest.toString();
    setSearchParams(params, { replace: true });
  }, [state, setSearchParams]);

  const canProceed = useCallback(() => {
    switch (state.currentStep) {
      case 1:
        return (
          state.income !== null &&
          state.income > 0 &&
          state.province !== null &&
          state.province !== ''
        );
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
      setState(s => ({ ...s, currentStep: s.currentStep + 1 }));
    }
  }, [state.currentStep, canProceed]);

  const handleBack = useCallback(() => {
    if (state.currentStep > 1) {
      setState(s => ({ ...s, currentStep: s.currentStep - 1 }));
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
            province={state.province}
            onChange={v => setState(s => ({ ...s, income: v }))}
            onProvinceChange={p => setState(s => ({ ...s, province: p }))}
            onFamilyContextChange={answers =>
              setState(s => ({
                ...s,
                hasElderlyParents: answers.hasElderlyParents,
                hasOtherFamily: answers.hasOtherFamily,
                hasPinjolDebt: answers.hasPinjolDebt,
                familySupportAmount: answers.familySupportAmount,
                pinjolDebtAmount: answers.pinjolDebtAmount,
                pinjolDebtInterest: answers.pinjolDebtInterest,
              }))
            }
          />
        );
      case 2:
        return (
          <Step2Expenses
            value={state.expenses}
            income={state.income ?? undefined}
            onChange={v => setState(s => ({ ...s, expenses: v }))}
          />
        );
      case 3:
        return (
          <Step3Rule
            selected={state.selectedRuleId}
            onChange={v => setState(s => ({ ...s, selectedRuleId: v }))}
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
