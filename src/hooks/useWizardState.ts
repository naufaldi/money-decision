import { useState, useCallback } from 'react';

export interface WizardState {
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
  elderlySupportAmount: number | null;
  otherFamilySupportAmount: number | null;
  pinjolDebtAmount: number | null;
  pinjolDebtInterest: number | null;
  pinjolDebtPayment: number | null;
}

const STORAGE_KEY = 'money-decision-wizard-state';

const defaultState: WizardState = {
  currentStep: 1,
  income: null,
  expenses: null,
  selectedRuleId: '60-30-10',
  riskProfile: 'conservative',
  province: null,
  incomeType: 'fixed',
  hasElderlyParents: false,
  hasOtherFamily: false,
  hasPinjolDebt: false,
  familySupportAmount: null,
  elderlySupportAmount: null,
  otherFamilySupportAmount: null,
  pinjolDebtAmount: null,
  pinjolDebtInterest: null,
  pinjolDebtPayment: null,
};

function loadState(): WizardState {
  if (typeof window === 'undefined') {
    return defaultState;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const typedParsed = parsed as Partial<WizardState>;
        return { ...defaultState, ...typedParsed };
      }
    }
  } catch {
    console.warn('Failed to load wizard state from localStorage');
  }

  return defaultState;
}

function saveState(state: WizardState): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn('Failed to save wizard state to localStorage');
  }
}

export function useWizardState() {
  const [state, setState] = useState<WizardState>(loadState);

  const updateState = useCallback((updates: Partial<WizardState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      saveState(newState);
      return newState;
    });
  }, []);

  const clearState = useCallback(() => {
    const resetState = { ...defaultState, currentStep: 1 };
    setState(resetState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return { state, updateState, clearState };
}

export function useWizardStep(stepNumber: number) {
  const { state, updateState, clearState } = useWizardState();

  const canProceed = useCallback((): boolean => {
    switch (stepNumber) {
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
        return true;
      case 4:
        return true;
      case 5:
        return !!state.selectedRuleId;
      default:
        return true;
    }
  }, [stepNumber, state]);

  const isStepValid = useCallback((): boolean => {
    return canProceed();
  }, [canProceed]);

  return {
    state,
    updateState,
    clearState,
    canProceed,
    isStepValid,
  };
}
