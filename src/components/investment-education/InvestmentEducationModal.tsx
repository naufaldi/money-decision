import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvestmentBasicsSection } from './InvestmentBasicsSection';
import { IndonesianProductsSection } from './IndonesianProductsSection';
import { CompoundInterestCalculator } from './CompoundInterestCalculator';
import { RiskProfileMiniQuiz } from './RiskProfileMiniQuiz';

interface InvestmentEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlyIncome?: number | null;
}

export function InvestmentEducationModal({ isOpen, onClose, monthlyIncome }: InvestmentEducationModalProps) {
  const [activeTab, setActiveTab] = useState<string>('basics');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('basics');
      
      // Announce modal opening to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = 'Investment education modal opened. Use tab key to navigate, escape to close.';
      document.body.appendChild(announcement);
      
      setTimeout(() => document.body.removeChild(announcement), 1000);
    }
  }, [isOpen]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Announce tab change to screen readers
    const tabNames: Record<string, string> = {
      basics: 'Investment Basics',
      products: 'Indonesian Products',
      calculators: 'Calculators',
      risk: 'Risk Profile Quiz'
    };
    
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Switched to ${tabNames[value]} tab`;
    document.body.appendChild(announcement);
    
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto p-0"
        ref={modalRef}
        aria-labelledby="investment-education-title"
        aria-describedby="investment-education-description"
      >
        <DialogHeader className="sticky top-0 z-10 bg-background border-b p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle id="investment-education-title" className="text-2xl font-bold">
                Investment Education
              </DialogTitle>
              <p id="investment-education-description" className="text-sm text-muted-foreground mt-1">
                Learn about investing with practical examples and interactive tools
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              aria-label="Close investment education modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 sticky top-[88px] z-10 bg-background border-b rounded-none h-auto">
            <TabsTrigger 
              value="basics"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
              aria-label="Investment basics tab"
            >
              Basics
            </TabsTrigger>
            <TabsTrigger 
              value="products"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
              aria-label="Indonesian products tab"
            >
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="calculators"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
              aria-label="Investment calculators tab"
            >
              Calculators
            </TabsTrigger>
            <TabsTrigger 
              value="risk"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3"
              aria-label="Risk profile quiz tab"
            >
              Risk Quiz
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="basics" className="mt-0 focus:outline-none" tabIndex={-1}>
              <InvestmentBasicsSection />
            </TabsContent>

            <TabsContent value="products" className="mt-0 focus:outline-none" tabIndex={-1}>
              <IndonesianProductsSection />
            </TabsContent>

            <TabsContent value="calculators" className="mt-0 focus:outline-none" tabIndex={-1}>
              <CompoundInterestCalculator monthlyIncome={monthlyIncome} />
            </TabsContent>

            <TabsContent value="risk" className="mt-0 focus:outline-none" tabIndex={-1}>
              <RiskProfileMiniQuiz />
            </TabsContent>
          </div>
        </Tabs>

        <div className="border-t p-4 bg-muted/50 text-xs text-muted-foreground text-center">
          <p className="font-semibold">Disclaimer</p>
          <p className="mt-1">
            This information is for educational purposes only and does not constitute financial advice. 
            Past performance does not guarantee future results. Always consult with a licensed financial advisor 
            before making investment decisions. All investment products are regulated by OJK.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
