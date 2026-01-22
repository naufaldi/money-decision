export const WIZARD_ROUTES = [
  { path: '/wizard/income', step: 1, label: 'Enter Income' },
  { path: '/wizard/expenses', step: 2, label: 'Monthly Expenses' },
  { path: '/wizard/pinjol', step: 3, label: 'Pinjol Debt Status' },
  { path: '/wizard/sandwich', step: 4, label: 'Family Support' },
  { path: '/wizard/rule', step: 5, label: 'Select Budget Rule' },
  { path: '/wizard/results', step: 6, label: 'Your Plan' },
] as const;

export const WIZARD_STEPS = WIZARD_ROUTES.length;

export function getWizardPath(step: number): string {
  const route = WIZARD_ROUTES.find(r => r.step === step);
  return route?.path ?? '/wizard/income';
}

export function getNextStepPath(currentStep: number): string {
  if (currentStep >= WIZARD_STEPS) {
    return getWizardPath(WIZARD_STEPS);
  }
  return getWizardPath(currentStep + 1);
}

export function getPreviousStepPath(currentStep: number): string {
  if (currentStep <= 1) {
    return getWizardPath(1);
  }
  return getWizardPath(currentStep - 1);
}
