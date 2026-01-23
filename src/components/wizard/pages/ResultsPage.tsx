import { StepIndicators } from '../StepIndicators';
import { Step4Results } from '../Step4Results';
import { useWizardStep } from '@/hooks/useWizardState';

export function ResultsPage() {
  const { state, clearState } = useWizardStep(6);

  return (
    <div role="main" aria-label="Money Decision Wizard - Step 6" className="wizard-container">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Step 6 of 6: Your personalized budget results
      </div>
      <StepIndicators current={6} total={6} />
      <Step4Results
        data={{
          income: state.income,
          expenses: state.expenses,
          selectedRuleId: state.selectedRuleId,
          riskProfile: state.riskProfile,
          hasElderlyParents: state.hasElderlyParents,
          hasOtherFamily: state.hasOtherFamily,
          hasPinjolDebt: state.hasPinjolDebt,
          familySupportAmount: state.familySupportAmount,
          pinjolDebtAmount: state.pinjolDebtAmount,
          pinjolDebtInterest: state.pinjolDebtInterest,
          pinjolDebtPayment: state.pinjolDebtPayment,
        }}
        clearState={clearState}
      />
    </div>
  );
}
