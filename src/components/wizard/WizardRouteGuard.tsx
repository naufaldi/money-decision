import { useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWizardState } from '@/hooks/useWizardState';
import { getWizardPath } from './wizardRoutes';

interface WizardRouteGuardProps {
  step: number;
  children: ReactNode;
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

    switch (step) {
      case 2:
        if (!state.income) {
          void navigate('/wizard/income', { replace: true });
        }
        break;
      case 3:
        if (!state.income) {
          void navigate('/wizard/income', { replace: true });
        }
        break;
      case 4:
        if (!state.income) {
          void navigate('/wizard/income', { replace: true });
        } else if (!state.selectedRuleId) {
          void navigate('/wizard/rule', { replace: true });
        }
        break;
      default:
        break;
    }
  }, [step, state, navigate, location.pathname]);

  return <>{children}</>;
}
