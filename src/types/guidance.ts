/**
 * Guidance system types for Decision Tree Guidance Enhancement
 * Includes support for Indonesian sandwich generation context
 */

import { ReactNode } from 'react';

/** Icon types for guidance nodes */
export type GuidanceIconType = 'check' | 'warning' | 'info' | 'action' | 'emergency';

/** Priority levels for guidance nodes (1 = highest priority) */
export type GuidancePriority = 1 | 2 | 3 | 4 | 5;

/** Risk profile options */
export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

/** Debt type options with pinjol support */
export type DebtType = 'pinjol' | 'credit-card' | 'personal' | 'formal' | 'multiguna';

/** Core guidance node structure */
export interface GuidanceNode {
  /** Unique identifier for the guidance node */
  id: string;
  /** Condition function that determines if this guidance applies */
  condition: (context: GuidanceContext) => boolean;
  /** Priority level (lower = more important) */
  priority: GuidancePriority;
  /** Icon type to display */
  icon: GuidanceIconType;
  /** Title of the guidance */
  title: string;
  /** Main content (can be string, React component, or function that returns string) */
  content: ReactNode | ((context: GuidanceContext) => ReactNode);
  /** Optional action buttons */
  actions?: GuidanceAction[];
  /** Category for grouping related guidance */
  category?: GuidanceCategory;
}

/** Action button for guidance */
export interface GuidanceAction {
  /** Button label */
  label: string;
  /** Action to perform when clicked */
  onClick: () => void;
  /** Optional icon for the button */
  icon?: 'arrow-right' | 'external-link' | 'calculator' | 'share';
  /** Whether this is a primary action */
  variant?: 'primary' | 'outline' | 'secondary';
}

/** Guidance categories for organization */
export type GuidanceCategory =
  | 'income'
  | 'expenses'
  | 'savings'
  | 'investments'
  | 'debt'
  | 'sandwich'
  | 'pinjol'
  | 'emergency-fund'
  | 'budget-rules';

/** Family context answers */
export interface FamilyContextAnswers {
  hasElderlyParents: boolean;
  hasOtherFamily: boolean; // Changed from hasYoungerSiblings for broader family support
  hasPinjolDebt: boolean;
  familySupportAmount: number | null;
  pinjolDebtAmount: number | null;
  pinjolDebtInterest: number | null;
  dependentsCount: number;
}

/** Complete guidance context built from wizard state */
export interface GuidanceContext {
  // Income information
  income: number | null;
  incomeType: 'fixed' | 'variable' | 'mixed';
  province: string | null;

  // Expense information
  expenses: number | null;
  expensesByCategory: Record<string, number>;

  // Budget rule selection
  selectedRule: string;

  // Debt information
  hasDebt: boolean;
  debtAmount: number | null;
  debtInterest: number | null;
  debtType: DebtType | null;
  debtPaymentMonthly: number | null;

  // Savings information
  savingsRate: number | null;
  emergencyFundMonths: number | null;

  // Investment information
  riskProfile: RiskProfile;
  investmentExperience: 'beginner' | 'intermediate' | 'advanced';

  // Sandwich generation context
  isSandwichGeneration: boolean;
  hasElderlyParents: boolean;
  hasOtherFamily: boolean;
  familySupportAmount: number | null;
  dependentsCount: number;

  // Pinjol (online loan) specific context
  hasPinjolDebt: boolean;
  pinjolDebtAmount: number | null;
  pinjolDebtInterest: number | null;
  pinjolCount: number;

  // Calculated derived values
  discretionaryIncome: number | null;
  savingsGap: number | null;
  debtToIncomeRatio: number | null;
}

/** Family context question for sandwich generation detection */
export interface FamilyContextQuestion {
  id: string;
  question: string;
  description?: string;
  options: FamilyContextOption[];
  guidanceNodeId: string;
  required?: boolean;
}

/** Option for family context question */
export interface FamilyContextOption {
  value: boolean | string | number;
  label: string;
  description?: string;
}

/** Props for DecisionTree component */
export interface DecisionTreeProps {
  nodes: GuidanceNode[];
  context: GuidanceContext;
  title?: string;
  emptyMessage?: string;
  maxDisplay?: number;
  showCategories?: boolean;
}

/** Props for GuidanceCollapsible component */
export interface GuidanceCollapsibleProps {
  title?: string;
  icon?: GuidanceIconType;
  defaultOpen?: boolean;
  autoOpenOnMatch?: boolean;
  context: GuidanceContext;
  nodes: GuidanceNode[];
  children?: ReactNode;
}

/** Pinjol debt calculation result */
export interface PinjolCalculationResult {
  totalDebt: number;
  totalInterest: number;
  monthlyPayment: number;
  monthsToPayoff: number;
  totalPaid: number;
  interestSavedWithConsolidation: number;
}

/** Emergency fund calculation result */
export interface EmergencyFundResult {
  monthlyExpenses: number;
  currentEmergencyFund: number;
  monthsCovered: number;
  targetMonths: number;
  amountNeeded: number;
  monthsToGoal: number;
  priority: 'critical' | 'moderate' | 'low';
}

/** Budget rule recommendation result */
export interface BudgetRuleRecommendation {
  ruleId: string;
  ruleName: string;
  allocation: {
    needs: number;
    savings: number;
    wants: number;
  };
  amounts: {
    needs: number;
    savings: number;
    wants: number;
  };
  rationale: string;
  isRecommended: boolean;
  isSandwichAdjusted: boolean;
  adjustments?: string[];
}

/** Family support budget breakdown */
export interface FamilySupportBudget {
  monthlySupport: number;
  percentageOfIncome: number;
  category: 'elderly-care' | 'siblings-education' | 'general-family' | 'mixed';
  recommendedAmount: number;
  suggestions: string[];
}

/** Guidance action payload for analytics */
export interface GuidanceAnalytics {
  nodeId: string;
  action: 'viewed' | 'expanded' | 'clicked' | 'completed';
  timestamp: Date;
  context: Partial<GuidanceContext>;
}
