export type RiskLevel = 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
export type LiquidityLevel = 'very-high' | 'high' | 'medium' | 'low';

export interface InvestmentProduct {
  id: string;
  name: string;
  category: 'reksadana' | 'sbn-ritel' | 'deposito' | 'crypto' | 'stocks';
  risk: RiskLevel;
  returnRange: string;
  averageReturn: number;
  minInvestment: number;
  liquidity: LiquidityLevel;
  example: string;
  bestFor: string;
  realProduct?: string;
  warning?: string;
  guarantee?: string;
  description: string;
}

export const investmentProducts: InvestmentProduct[] = [
  // Reksadana (Mutual Funds)
  {
    id: 'reksadana-pasar-uang',
    name: 'Reksadana Pasar Uang',
    category: 'reksadana',
    risk: 'very-low',
    returnRange: '4-6%',
    averageReturn: 5,
    minInvestment: 100000,
    liquidity: 'high',
    example: 'Invest Rp 1,000,000 → Rp 1,050,000 in 1 year (5% return)',
    realProduct: 'Eastspring Cash Reserve (4.0% annual, 2026 data)',
    bestFor: 'Emergency fund, short-term savings (< 1 year)',
    description: 'Money market funds invest in short-term, low-risk instruments. Perfect for parking your emergency fund with better returns than savings accounts.'
  },
  {
    id: 'reksadana-pendapatan-tetap',
    name: 'Reksadana Pendapatan Tetap',
    category: 'reksadana',
    risk: 'low',
    returnRange: '6-8%',
    averageReturn: 7,
    minInvestment: 100000,
    liquidity: 'medium',
    example: 'Invest Rp 5,000,000 → Rp 5,350,000 in 1 year (7% return)',
    realProduct: 'Eastspring IDR High Grade (6.5% annual)',
    bestFor: 'Conservative investors, 2-5 year goals',
    description: 'Bond funds provide stable income through government and corporate bonds. Lower risk than stocks with predictable returns.'
  },
  {
    id: 'reksadana-campuran',
    name: 'Reksadana Campuran',
    category: 'reksadana',
    risk: 'medium',
    returnRange: '8-12%',
    averageReturn: 10,
    minInvestment: 100000,
    liquidity: 'medium',
    example: 'Invest Rp 3,000,000 → Rp 3,300,000 in 1 year (10% return)',
    bestFor: 'Moderate risk tolerance, 5-10 year goals',
    description: 'Balanced funds mix stocks and bonds for moderate growth with some stability. Good middle-ground option for most investors.'
  },
  {
    id: 'reksadana-saham',
    name: 'Reksadana Saham',
    category: 'reksadana',
    risk: 'high',
    returnRange: '10-15%+',
    averageReturn: 12,
    minInvestment: 100000,
    liquidity: 'medium',
    example: 'Invest Rp 2,000,000 → Rp 2,300,000 in 1 year (15% return)',
    warning: 'Can also lose 10-20% in bad years',
    bestFor: 'Long-term (10+ years), aggressive investors',
    description: 'Equity funds invest primarily in stocks for maximum growth potential. Historical data shows some funds achieved 32-39% returns over 5 years (2021-2026), but expect volatility.'
  },
  
  // SBN Ritel (Government Bonds)
  {
    id: 'ori',
    name: 'ORI (Obligasi Negara Ritel)',
    category: 'sbn-ritel',
    risk: 'very-low',
    returnRange: '5-6%',
    averageReturn: 5.5,
    minInvestment: 1000000,
    liquidity: 'medium',
    example: 'Invest Rp 10,000,000 → Rp 10,550,000 in 1 year',
    guarantee: '100% Government Guaranteed',
    bestFor: 'Ultra-conservative investors, capital preservation',
    description: 'Government retail bonds backed by the Republic of Indonesia. Tradable in secondary market, providing flexibility if you need to sell before maturity.'
  },
  {
    id: 'sukuk-ritel',
    name: 'Sukuk Ritel (SR)',
    category: 'sbn-ritel',
    risk: 'very-low',
    returnRange: '5-6%',
    averageReturn: 5.5,
    minInvestment: 1000000,
    liquidity: 'medium',
    example: 'Invest Rp 5,000,000 → Rp 5,275,000 in 1 year',
    guarantee: '100% Government Guaranteed',
    bestFor: 'Muslim investors preferring halal investments',
    description: 'Sharia-compliant government bonds following Islamic finance principles. Same government guarantee as ORI with halal certification.'
  },
  {
    id: 'sbr',
    name: 'SBR (Savings Bond Ritel)',
    category: 'sbn-ritel',
    risk: 'very-low',
    returnRange: '5-6%',
    averageReturn: 5.5,
    minInvestment: 1000000,
    liquidity: 'low',
    example: 'Invest Rp 3,000,000 → Rp 3,150,000 in 1 year',
    guarantee: '100% Government Guaranteed',
    bestFor: 'Long-term savers who won\'t need early access',
    description: 'Government savings bonds that cannot be traded. Lower liquidity but guaranteed returns backed by the state.'
  },
  
  // Other Investment Options
  {
    id: 'deposito',
    name: 'Deposito',
    category: 'deposito',
    risk: 'very-low',
    returnRange: '3-5%',
    averageReturn: 4.5,
    minInvestment: 1000000,
    liquidity: 'low',
    example: 'Deposit Rp 10,000,000 for 1 year at 4.5% = Rp 10,450,000',
    guarantee: 'Guaranteed by LPS (up to Rp 2 billion)',
    bestFor: 'Ultra-conservative, guaranteed returns',
    description: 'Time deposits with fixed rates and locked terms. Guaranteed by Indonesia Deposit Insurance Corporation (LPS) up to Rp 2 billion per bank.'
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    category: 'crypto',
    risk: 'very-high',
    returnRange: '-50% to +100%+',
    averageReturn: 0,
    minInvestment: 50000,
    liquidity: 'high',
    example: 'Bitcoin can gain 100%+ or lose 50%+ in one year',
    warning: 'Not recommended for beginners. No government protection.',
    bestFor: 'High risk tolerance, can afford to lose entire investment',
    description: 'Digital currencies with extreme volatility. Only invest what you can afford to lose completely. Not regulated by OJK.'
  },
  {
    id: 'direct-stocks',
    name: 'Direct Stocks',
    category: 'stocks',
    risk: 'high',
    returnRange: '-20% to +20%+',
    averageReturn: 10,
    minInvestment: 500000,
    liquidity: 'high',
    example: 'Buy 1 lot (100 shares) of blue-chip stock',
    warning: 'Requires active monitoring and research',
    bestFor: 'Experienced investors with time and knowledge',
    description: 'Direct stock ownership through Indonesia Stock Exchange (IDX). Potential for high returns but requires market knowledge and active management.'
  }
];

export const getReksadanaProducts = () => 
  investmentProducts.filter(p => p.category === 'reksadana');

export const getSBNRitelProducts = () => 
  investmentProducts.filter(p => p.category === 'sbn-ritel');

export const getProductsByRisk = (risk: RiskLevel) => 
  investmentProducts.filter(p => p.risk === risk);

export const getProductById = (id: string) => 
  investmentProducts.find(p => p.id === id);
