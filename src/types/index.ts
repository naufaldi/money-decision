export interface BudgetRule {
  id: string;
  name: string;
  description: string;
  allocation: {
    needs: number;
    savings: number;
    wants: number;
  };
}

export type RiskProfile = 'passive' | 'conservative' | 'moderate' | 'aggressive';

export interface InvestmentRecommendation {
  name: string;
  percentage: number;
  risk: 'low' | 'medium' | 'high' | 'very-high';
  description: string;
  warning?: string;
}

export interface AllocationResult {
  needs: number;
  savings: number;
  wants: number;
}

export interface SavingsBreakdown {
  emergencyFund: number;
  shortTermGoals: number;
  longTermGoals: number;
  emergencyFundTarget: number;
}

export interface InvestmentBreakdown {
  recommendations: InvestmentRecommendation[];
  totalInvestment: number;
}

// New types for v1.2 features

export interface ExpenseBreakdown {
  housing: {
    rentMortgage: number;
    electricity: number;
    water: number;
    gas: number;
    internet: number;
  };
  essentials: {
    groceries: number;
    dining: number;
    transportation: number;
    healthcare: number;
  };
  lifestyle: {
    clothing: number;
    entertainment: number;
    subscriptions: number;
  };
  insurance: {
    health: number;
    vehicle: number;
    personal: number;
  };
}

export interface DebtAssessment {
  hasHighInterestDebt: boolean;
  debtAmount: number;
  debtType: 'credit-card' | 'personal-loan' | 'other';
  annualInterest: number;
}

export interface Citation {
  id: string;
  source: string;
  url: string;
  quote: string;
}

export interface CalculatorState {
  income: number;
  selectedRuleId: string;
  riskProfile: RiskProfile;
  expenseBreakdown?: ExpenseBreakdown;
  debtAssessment?: DebtAssessment;
}

export interface CalculatorResult {
  allocation: AllocationResult;
  savingsBreakdown: SavingsBreakdown;
  investmentBreakdown: InvestmentBreakdown;
}
