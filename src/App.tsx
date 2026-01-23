import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { IncomePage } from '@/components/wizard/pages/IncomePage';
import { ExpensesPage } from '@/components/wizard/pages/ExpensesPage';
import { PinjolPage } from '@/components/wizard/pages/PinjolPage';
import { SandwichPage } from '@/components/wizard/pages/SandwichPage';
import { RulePage } from '@/components/wizard/pages/RulePage';
import { ResultsPage } from '@/components/wizard/pages/ResultsPage';
import { WizardRouteGuard } from '@/components/wizard/WizardRouteGuard';
import { InvestmentEducationModal } from '@/components/investment-education/InvestmentEducationModal';

function App() {
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [modalIncome, setModalIncome] = useState<number | null>(null);

  useEffect(() => {
    const handleShowInvestmentEducation = (event: Event) => {
      const customEvent = event as CustomEvent<{ monthlyIncome?: number | null }>;
      setModalIncome(customEvent.detail?.monthlyIncome ?? null);
      setIsInvestmentModalOpen(true);
    };
    
    window.addEventListener('showInvestmentEducation', handleShowInvestmentEducation);
    return () => window.removeEventListener('showInvestmentEducation', handleShowInvestmentEducation);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <Routes>
          <Route
            path="/wizard/income"
            element={
              <WizardRouteGuard step={1}>
                <IncomePage />
              </WizardRouteGuard>
            }
          />
          <Route
            path="/wizard/expenses"
            element={
              <WizardRouteGuard step={2}>
                <ExpensesPage />
              </WizardRouteGuard>
            }
          />
          <Route
            path="/wizard/pinjol"
            element={
              <WizardRouteGuard step={3}>
                <PinjolPage />
              </WizardRouteGuard>
            }
          />
          <Route
            path="/wizard/sandwich"
            element={
              <WizardRouteGuard step={4}>
                <SandwichPage />
              </WizardRouteGuard>
            }
          />
          <Route
            path="/wizard/rule"
            element={
              <WizardRouteGuard step={5}>
                <RulePage />
              </WizardRouteGuard>
            }
          />
          <Route
            path="/wizard/results"
            element={
              <WizardRouteGuard step={6}>
                <ResultsPage />
              </WizardRouteGuard>
            }
          />
          <Route path="/" element={<Navigate to="/wizard/income" replace />} />
          <Route path="*" element={<Navigate to="/wizard/income" replace />} />
        </Routes>
      </main>
      <InvestmentEducationModal 
        isOpen={isInvestmentModalOpen} 
        onClose={() => setIsInvestmentModalOpen(false)}
        monthlyIncome={modalIncome}
      />
    </div>
  );
}

export default App;
