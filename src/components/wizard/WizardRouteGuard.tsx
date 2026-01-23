import { useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWizardState } from '@/hooks/useWizardState';
import { getWizardPath } from './wizardRoutes';

interface WizardRouteGuardProps {
  step: number;
  children: ReactNode;
}

function loadStateFromStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem('money-decision-wizard-state');
    if (stored) {
      return JSON.parse(stored) as { income?: number | null; selectedRuleId?: string | null };
    }
  } catch {
    return null;
  }

  return null;
}

export function WizardRouteGuard({ step, children }: WizardRouteGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useWizardState();

  useEffect(() => {
    const currentPath = location.pathname;
    const targetPath = getWizardPath(step);

    if (currentPath !== targetPath) {
      return;
    }

    const storedState = loadStateFromStorage();
    const income = storedState?.income ?? state.income;
    const selectedRuleId = storedState?.selectedRuleId ?? state.selectedRuleId;

    switch (step) {
      case 2:
        if (!income || income <= 0) {
          void navigate('/wizard/income', { replace: true });
        }
        break;
      case 3:
        if (!income || income <= 0) {
          void navigate('/wizard/income', { replace: true });
        }
        break;
      case 4:
        if (!income || income <= 0) {
          void navigate('/wizard/income', { replace: true });
        } else if (!selectedRuleId) {
          void navigate('/wizard/rule', { replace: true });
        }
        break;
      default:
        break;
    }
  }, [step, state, navigate, location.pathname]);

  return <>{children}</>;
}
