import { GuidanceNode } from '@/types/guidance';

export const RULES_GUIDANCE_NODES: GuidanceNode[] = [
  {
    id: 'rule-60-30-10-beginner',
    condition: (ctx) =>
      (ctx).income !== null &&
      (ctx).income >= 3000000 &&
      (ctx).income < 10000000 &&
      !(ctx).isSandwichGeneration,
    priority: 1,
    icon: 'check',
    title: '60/30/10 Rule - Good Starting Point',
    content: (ctx) => `For your income level, the 60/30/10 rule is an excellent starting point:

**60% Needs (Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * 0.6)}/month):**
- Housing: Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * 0.25)}/month
- Utilities: Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * 0.05)}/month
- Food: Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * 0.15)}/month
- Transport: Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * 0.10)}/month
- Insurance: Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * 0.05)}/month

**30% Wants (Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * 0.3)}/month):**
- Entertainment
- Dining out
- Hobbies
- Shopping

**10% Savings (Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * 0.1)}/month):**
- Emergency fund
- Investments`,
    category: 'budget-rules',
  },
  {
    id: 'rule-sandwich-adjustment',
    condition: (ctx) =>
      (ctx).isSandwichGeneration === true &&
      (ctx).familySupportAmount !== null &&
      (ctx).familySupportAmount > 0,
    priority: 1,
    icon: 'warning',
    title: 'Adjusted Rule for Sandwich Generation',
    content: (ctx) => `For sandwich generation members, the traditional rules don't account for family support. Here's an adjusted approach:

**Your adjusted allocation:**

1. **Family Support (Fixed)**: ${(((ctx).familySupportAmount || 0) / ((ctx).income || 1) * 100).toFixed(1)}% of income
   - Rp ${new Intl.NumberFormat('id-ID').format((ctx).familySupportAmount || 0)}/month

2. **Your Essential Expenses**: 40-50% of remaining income
   - Housing, utilities, food, transport

3. **Debt Payoff**: 20-30% of remaining income
   - Focus on high-interest debt first

4. **Your Savings**: 10-20% of remaining income
   - Start small, build gradually

**Reality check:** Your "discretionary income" after family support is lower than it appears. Be realistic about what you can save.`,
    category: 'sandwich',
  },
  {
    id: 'rule-csp-ramit',
    condition: (ctx) =>
      (ctx).riskProfile === 'moderate' &&
      !(ctx).isSandwichGeneration,
    priority: 2,
    icon: 'info',
    title: 'Ramit Sethi\'s Conscious Spending Plan',
    content: (ctx) => `For someone with your risk profile, Ramit Sethi's CSP offers a more detailed approach:

**Fixed Costs: 50-60%**
- Rent/mortgage
- Utilities
- Insurance
- Minimum debt payments
- Subscriptions

**Investments: 10%**
- Retirement accounts
- Long-term investments

**Savings: 5-10%**
- Emergency fund
- Specific goals

**Guilt-Free Spending: 20-35%**
- Everything else
- No tracking needed!

**Why this works:**
- Fixed costs are predictable
- Investments are automatic
- Guilt-free spending removes stress

**Your numbers (based on Rp ${new Intl.NumberFormat('id-ID').format((ctx).income || 0)}/month):**
- Fixed: Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * 0.55)}/month
- Investments: Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * 0.1)}/month
- Savings: Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * 0.07)}/month
- Guilt-free: Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * 0.28)}/month`,
    category: 'budget-rules',
  },
  {
    id: 'rule-variable-income',
    condition: (ctx) =>
      (ctx).incomeType === 'variable' ||
      (ctx).incomeType === 'mixed',
    priority: 2,
    icon: 'action',
    title: 'Budget Rule for Variable Income',
    content: `With variable income, traditional percentage rules need adaptation:

**The 50/30/20 Variable Approach:**

1. **Essential Expenses: 50% of baseline income**
   - Calculate baseline as 80% of average income
   - This ensures you can cover basics in slow months

2. **Debt Payoff: 20% of actual income**
   - Increase when income is high
   - Minimum payments in slow months

3. **Savings: 20% of actual income**
   - Build buffer in good months
   - Emergency fund first

4. **Flexible Spending: Remaining**
   - Enjoy good months guilt-free
   - No stress about every purchase

**Example (average Rp 8M/month, baseline Rp 6.4M):**
- Essentials: Rp 3,200,000 (always covered)
- In good month (Rp 10M): Savings Rp 2M, Debt Rp 2M, Flexible Rp 2.8M`,
    category: 'budget-rules',
  },
  {
    id: 'rule-debt-payoff',
    condition: (ctx) =>
      (ctx).hasDebt === true &&
      ((ctx).debtToIncomeRatio || 0) > 0.20,
    priority: 1,
    icon: 'emergency',
    title: 'Debt-Focused Budget Adjustment',
    content: (ctx) => `With high debt payments, your budget should prioritize debt elimination:

**Temporary allocation:**

1. **Essential Expenses: 50%**
   - Cut non-essentials completely
   - Housing, food, transport only

2. **Debt Payoff: 35%**
   - Avalanche method (highest interest first)
   - Any extra money goes to debt

3. **Minimum Savings: 5%**
   - Keep some savings for emergencies
   - Prevents new debt

4. **Flexible Spending: 10%**
   - Small buffer for necessities
   - No dining out, entertainment

**When debt is gone:**
- Celebrate, then redirect that 35%
- Build emergency fund to 6 months
- Start investing aggressively

**Your current debt situation:**
- Monthly debt payments: Rp ${new Intl.NumberFormat('id-ID').format((ctx).debtPaymentMonthly || 0)}
- Debt-to-income ratio: ${(((ctx).debtToIncomeRatio || 0) * 100).toFixed(1)}%`,
    actions: [
      {
        label: 'Calculate debt payoff timeline',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showDebtPayoffTimeline'));
        },
        icon: 'calculator',
        variant: 'primary',
      },
    ],
    category: 'debt',
  },
  {
    id: 'rule-pinjol-crisis',
    condition: (ctx) => (ctx).hasPinjolDebt === true,
    priority: 1,
    icon: 'emergency',
    title: 'Pinjol Crisis Budget',
    content: `With pinjol debt, you need an aggressive but realistic budget:

**Survival budget (until pinjol is gone):**

1. **Essentials Only: 60%**
   - Housing (cheapest possible)
   - Food (cooking at home)
   - Basic transport
   - Utilities

2. **Pinjol Payoff: 30%**
   - Pay more than minimum
   - Target highest interest first
   - No new pinjol allowed!

3. **Tiny Savings: 5%**
   - Rp 100,000-200,000/month
   - For emergencies only
   - Prevents new borrowing

4. **Buffer: 5%**
   - Unexpected expenses
   - Keep small for flexibility

**Reality check:**
- This is temporary (6-24 months typically)
- Once pinjol is gone, budget returns to normal
- The pain is worth the freedom`,
    actions: [
      {
        label: 'Create pinjol payoff plan',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showPinjolPayoffPlan'));
        },
        icon: 'calculator',
        variant: 'primary',
      },
    ],
    category: 'pinjol',
  },
  {
    id: 'rule-high-income',
    condition: (ctx) =>
      (ctx).income !== null &&
      (ctx).income >= 15000000 &&
      !(ctx).isSandwichGeneration,
    priority: 2,
    icon: 'check',
    title: 'Wealth Building Rule',
    content: (ctx) => `With your income level, you can accelerate wealth building:

**Recommended allocation:**

1. **Needs: 40%**
   - Can afford more comfort
   - Still avoid lifestyle inflation

2. **Investments: 30%**
   - Max out retirement accounts
   - Diversified portfolio
   - Consider real estate

3. **Savings: 15%**
   - Emergency fund (already complete?)
   - Specific goals
   - Big purchases

4. **Wants: 15%**
   - Enjoy your success
   - Travel, experiences
   - Quality of life

**Your numbers (Rp ${new Intl.NumberFormat('id-ID').format((ctx).income || 0)}/month):**
- Needs: Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * 0.4)}/month
- Investments: Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * 0.3)}/month
- Savings: Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * 0.15)}/month
- Wants: Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * 0.15)}/month`,
    actions: [
      {
        label: 'Explore investment options',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showInvestmentOptions'));
        },
        icon: 'arrow-right',
        variant: 'outline',
      },
    ],
    category: 'budget-rules',
  },
  {
    id: 'rule-customize',
    condition: (ctx) => true,
    priority: 5,
    icon: 'info',
    title: 'Customize Your Budget Rule',
    content: `Budget rules are guidelines, not rigid laws. Customize based on your situation:

**Factors to consider:**
- Income stability (fixed vs variable)
- Current debt level
- Life stage and goals
- Family obligations
- Cost of living in your area

**Common customizations:**
- Higher savings if you have specific goals
- Lower fixed costs if optimizing
- Debt focus when paying off
- More flexible spending when stable

**Start simple, iterate:**
- Begin with 50/30/20 or 60/30/10
- Track for 2-3 months
- Adjust based on reality
- Find what works for YOU

**Key principle:** The best budget is one you can actually follow.`,
    category: 'budget-rules',
  },
];

export default RULES_GUIDANCE_NODES;
