// Budget rule configuration
export interface BudgetRule {
  id: string;
  name: string;
  description: string;
  allocation: {
    needs: number;      // Daily life / Fixed costs
    savings: number;    // Savings
    wants: number;      // Wants / Investment
  };
}

export const BUDGET_RULES: BudgetRule[] = [
  {
    id: '50-30-20',
    name: '50/30/20 Rule',
    description: 'Classic rule: 50% needs, 30% wants, 20% savings',
    allocation: { needs: 0.50, savings: 0.20, wants: 0.30 }
  },
  {
    id: '60-30-10',
    name: '60/30/10 Rule',
    description: 'Modern adaptation: 60% needs, 30% wants, 10% savings',
    allocation: { needs: 0.60, savings: 0.10, wants: 0.30 }
  },
  {
    id: '70-20-10',
    name: '70/20/10 Rule',
    description: 'Higher lifestyle focus: 70% needs, 20% savings, 10% wants',
    allocation: { needs: 0.70, savings: 0.20, wants: 0.10 }
  },
  {
    id: 'csp',
    name: 'Conscious Spending Plan',
    description: 'Ramit Sethi: Fixed costs 50-60%, Investments 10%, Savings 5-10%, Guilt-free 20-35%',
    allocation: { needs: 0.55, savings: 0.10, wants: 0.35 }
  }
];

export type RiskProfile = 'passive' | 'conservative' | 'moderate' | 'aggressive';

export interface InvestmentRecommendation {
  name: string;
  percentage: number;
  risk: 'low' | 'medium' | 'high' | 'very-high';
  description: string;
  warning?: string;
}

export const INVESTMENT_RECOMMENDATIONS: Record<RiskProfile, InvestmentRecommendation[]> = {
  passive: [
    { name: 'Reksadana Pasar Uang', percentage: 0.50, risk: 'low', description: 'Low risk, liquid, steady returns 4-6%' },
    { name: 'Reksadana Pendapatan Tetap', percentage: 0.50, risk: 'low', description: 'Bond-focused, stable returns 6-8%' }
  ],
  conservative: [
    { name: 'Reksadana Pasar Uang', percentage: 0.40, risk: 'low', description: 'Low risk, liquid, steady returns 4-6%' },
    { name: 'Reksadana Pendapatan Tetap', percentage: 0.35, risk: 'low', description: 'Bond-focused, stable returns 6-8%' },
    { name: 'Deposito', percentage: 0.25, risk: 'low', description: 'Fixed deposit, guaranteed returns' }
  ],
  moderate: [
    { name: 'Reksadana Campuran', percentage: 0.40, risk: 'medium', description: 'Mixed stocks and bonds, balanced growth 6-10%' },
    { name: 'Reksadana Pendapatan Tetap', percentage: 0.30, risk: 'low', description: 'Bond-focused, stable returns 6-8%' },
    { name: 'Reksadana Saham', percentage: 0.30, risk: 'high', description: 'Stock-focused, growth potential 10-15%' }
  ],
  aggressive: [
    { name: 'Reksadana Saham', percentage: 0.50, risk: 'high', description: 'High risk, high return potential 10-15%+' },
    { name: 'Crypto (BTC/ETH)', percentage: 0.25, risk: 'very-high', description: 'Very high risk, very high return potential', warning: 'Only invest what you can afford to lose' },
    { name: 'Reksadana Campuran', percentage: 0.25, risk: 'medium', description: 'Balanced growth, medium risk' }
  ]
};

// Citations for educational content
export const CITATIONS = {
  wallet2024: {
    id: 'wallet2024',
    source: 'WalletHub',
    url: 'https://wallethub.com/edu/cc/credit-card-statistics/10551',
    quote: 'Average credit card APR is 20.74% as of 2024'
  },
  nerdwealth: {
    id: 'nerdwealth',
    source: 'NerdWallet',
    url: 'https://www.nerdwallet.com/article/banking/50-30-20-rule',
    quote: 'The 50/30/20 rule is a proven budgeting framework'
  },
  time2024: {
    id: 'time2024',
    source: 'TIME',
    url: 'https://time.com/6881304/budgeting-tips-50-30-20-rule',
    quote: 'Budgeting methods help allocate income effectively'
  },
  ramit: {
    id: 'ramit',
    source: 'Ramit Sethi - Conscious Spending Plan',
    url: 'https://www.iwillteachyoutoberich.com/blog/conscious-spending-plan/',
    quote: 'Conscious spending plan allows for guilt-free spending within limits'
  }
};

export const SAVINGS_BREAKDOWN = {
  emergencyFund: 0.50,      // 50% of savings
  shortTermGoals: 0.30,     // 30% of savings
  longTermGoals: 0.20       // 20% of savings
};

export const EMERGENCY_FUND_MONTHS = 6;
