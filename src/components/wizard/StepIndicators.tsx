import { Check } from 'lucide-react';

interface StepIndicatorsProps {
  current: number;
  total: number;
}

export function StepIndicators({ current, total }: StepIndicatorsProps) {
  return (
    <nav aria-label="Progress" className="step-indicators" role="navigation">
      <ol className="flex items-center justify-center gap-2" role="list">
        {Array.from({ length: total }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < current;
          const isCurrent = step === current;

          let buttonElement;
          if (isCompleted) {
            buttonElement = (
              <button
                type="button"
                aria-label={`Step ${step} completed`}
                className="step-indicator completed"
                disabled
              >
                <Check className="h-4 w-4" aria-hidden="true" />
              </button>
            );
          } else if (isCurrent) {
            buttonElement = (
              <button
                type="button"
                aria-current="step"
                className="step-indicator current"
              >
                <span className="sr-only">Current Step: </span>
                {step}
              </button>
            );
          } else {
            buttonElement = (
              <span
                role="presentation"
                className="step-indicator pending"
                aria-hidden="true"
              >
                {step}
              </span>
            );
          }

          return (
            <li key={step} className="step-item">
              {buttonElement}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
