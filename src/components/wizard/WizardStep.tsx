import { ReactNode } from 'react';

interface WizardStepProps {
  children: ReactNode;
  title: string;
  stepNumber: number;
  totalSteps: number;
}

export function WizardStep({ children, title, stepNumber, totalSteps }: WizardStepProps) {
  return (
    <article
      role="group"
      aria-labelledby={`step-title-${stepNumber}`}
      className="wizard-step step-enter"
    >
      <h2 id={`step-title-${stepNumber}`} className="sr-only">
        Step {stepNumber} of {totalSteps}: {title}
      </h2>
      {children}
    </article>
  );
}
