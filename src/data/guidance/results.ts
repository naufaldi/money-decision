import { GuidanceNode } from '@/types/guidance';

export const RESULTS_GUIDANCE_NODES: GuidanceNode[] = [
  {
    id: 'results-savings-gap',
    condition: (ctx) =>
      (ctx).savingsRate !== null &&
      (ctx).savingsRate < 0.10 &&
      (ctx).income !== null,
    priority: 1,
    icon: 'warning',
    title: 'Savings Gap Detected',
    content: (ctx) => `Your current savings rate is ${((ctx).savingsRate * 100).toFixed(1)}%, which is below the recommended 10-20%.

**Your savings gap:**
- Current: Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * ((ctx).savingsRate || 0))}/month
- Recommended (15%): Rp ${new Intl.NumberFormat('id-ID').format(((ctx).income || 0) * 0.15)}/month
- Gap: Rp ${new Intl.NumberFormat('id-ID').format(Math.max(0, ((ctx).income || 0) * 0.15 - ((ctx).income || 0) * ((ctx).savingsRate || 0)))}/month

**Ways to close the gap:**

1. **Increase income:**
   - Side gigs or freelance work
   - Skills development for raises
   - Monetize hobbies

2. **Reduce expenses:**
   - Review all subscriptions
   - Cook at home more
   - Use public transport

3. **Automate:**
   - Set up automatic transfers on payday
   - Pay yourself first before spending

4. **Start small:**
   - Even Rp 100,000 more per month helps
   - Increase gradually over time`,
    actions: [
      {
        label: 'Create savings action plan',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showSavingsActionPlan'));
        },
        icon: 'calculator',
        variant: 'outline',
      },
    ],
    category: 'savings',
  },
  {
    id: 'results-emergency-fund-low',
    condition: (ctx) =>
      (ctx).emergencyFundMonths !== null &&
      (ctx).emergencyFundMonths < 3,
    priority: 1,
    icon: 'warning',
    title: 'Emergency Fund Needs Building',
    content: (ctx) => `You have approximately ${((ctx).emergencyFundMonths || 0).toFixed(1)} months of expenses saved. The recommended minimum is 3-6 months.

**Why emergency fund matters:**
- Job loss protection
- Medical emergencies
- Unexpected repairs
- Prevents debt accumulation

**Your situation:**
- Current fund: Rp ${new Intl.NumberFormat('id-ID').format((ctx).expenses || 0 * ((ctx).emergencyFundMonths || 0))}
- Monthly expenses: Rp ${new Intl.NumberFormat('id-ID').format((ctx).expenses || 0)}
- Target (6 months): Rp ${new Intl.NumberFormat('id-ID').format(((ctx).expenses || 0) * 6)}
- Gap: Rp ${new Intl.NumberFormat('id-ID').format(Math.max(0, ((ctx).expenses || 0) * 6 - ((ctx).expenses || 0 * ((ctx).emergencyFundMonths || 0))))}

**Building plan:**
- Target: Rp ${new Intl.NumberFormat('id-ID').format(Math.ceil(((ctx).expenses || 0) * 6 / 12))}/month for 12 months
- Use high-yield savings account
- Keep it accessible, not invested`,
    actions: [
      {
        label: 'Calculate emergency fund timeline',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showEmergencyFundCalculator'));
        },
        icon: 'calculator',
        variant: 'outline',
      },
    ],
    category: 'emergency-fund',
  },
  {
    id: 'results-emergency-fund-complete',
    condition: (ctx) =>
      (ctx).emergencyFundMonths !== null &&
      (ctx).emergencyFundMonths >= 6,
    priority: 4,
    icon: 'check',
    title: 'Emergency Fund Complete',
    content: (ctx) => `Excellent! You have ${((ctx).emergencyFundMonths || 0).toFixed(1)} months of expenses saved, which exceeds the recommended 6-month minimum.

**What this means:**
- You can handle most financial emergencies
- You're protected from unexpected events
- You can focus on building wealth

**Next steps:**
1. Consider increasing to 9-12 months for extra security
2. Keep emergency fund in accessible account (HYSA)
3. Don't touch it for non-emergencies
4. Replenish immediately if used

**After emergency fund:**
- Maximize retirement accounts
- Start or increase investment contributions
- Consider other financial goals`,
    category: 'emergency-fund',
  },
  {
    id: 'results-debt-payoff-plan',
    condition: (ctx) =>
      (ctx).hasDebt === true &&
      (ctx).debtType !== 'pinjol',
    priority: 1,
    icon: 'action',
    title: 'Your Debt Payoff Strategy',
    content: (ctx) => `You have active debt that needs attention. Here's your action plan:

**Recommended method: Avalanche Method**

Pay off highest-interest debt first to save money:

1. List all debts with rates:
   - Credit card: ${(ctx).debtInterest}% (if applicable)
   - Personal loan: ${(ctx).debtInterest}% (if applicable)

2. Pay minimums on all
3. Put extra toward highest interest
4. Snowball effect kicks in

**Your estimated payoff:**
- With Rp ${new Intl.NumberFormat('id-ID').format(((ctx).debtPaymentMonthly || 0) - ((ctx).debtAmount || 0) * 0.02)}/month extra
- You could be debt-free in ~${Math.ceil(((ctx).debtAmount || 0) / (((ctx).debtPaymentMonthly || 0) - ((ctx).debtAmount || 0) * 0.02))} months
- Interest saved: Significant

**If you have credit card debt:**
- Credit card interest (20%+) is financial emergency
- Pay more than minimum every month
- Consider balance transfer if available`,
    actions: [
      {
        label: 'Create detailed payoff plan',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showDetailedPayoffPlan'));
        },
        icon: 'calculator',
        variant: 'primary',
      },
    ],
    category: 'debt',
  },
  {
    id: 'results-investment-ready',
    condition: (ctx) =>
      (ctx).hasDebt !== true &&
      ((ctx).emergencyFundMonths || 0) >= 3,
    priority: 3,
    icon: 'check',
    title: 'Ready to Start Investing',
    content: `Great! You're in an excellent position to start building wealth through investing.

**Your position:**
- No high-interest debt
- Emergency fund established
- Disposable income available

**Investment options by risk profile:**

**Conservative (Low risk, 4-8% returns):**
- Reksadana Pasar Uang
- Deposito
- Obligasi

**Moderate (Medium risk, 8-12% returns):**
- Reksadana Campuran
- Reksadana Pendapatan Tetap

**Aggressive (High risk, 10-15%+ returns):**
- Reksadana Saham
- Stocks directly
- Crypto (small allocation only)

**Getting started:**
1. Open brokerage account (Ajaib, Bareksa, etc.)
2. Start with Reksadana (easiest)
3. Invest consistently monthly
4. Diversify across types`,
    actions: [
      {
        label: 'Explore investment options',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showInvestmentGuide'));
        },
        icon: 'arrow-right',
        variant: 'primary',
      },
    ],
    category: 'investments',
  },
  {
    id: 'results-sandwich-progress',
    condition: (ctx) =>
      (ctx).isSandwichGeneration === true &&
      (ctx).hasPinjolDebt !== true &&
      ((ctx).emergencyFundMonths || 0) >= 3,
    priority: 3,
    icon: 'check',
    title: 'Sandwich Generation Success',
    content: `Despite the challenges of supporting family, you're building a solid financial foundation:

**What you've achieved:**
- No high-interest pinjol debt
- 3+ months emergency fund
- Following a budget plan

**This is significant!**

**Your path forward:**

1. **Continue building emergency fund** to 6 months
   - Family health emergencies happen

2. **Consider your own retirement**
   - It's easy to neglect self while caring for others
   - Even small contributions compound

3. **Plan for the future**
   - When will sibling support decrease?
   - Parents' care needs may increase
   - Your own goals matter too

4. **Maintain boundaries**
   - You can't pour from an empty cup
   - Sustainable support is better than burnout`,
    category: 'sandwich',
  },
  {
    id: 'results-pinjol-priority',
    condition: (ctx) => (ctx).hasPinjolDebt === true,
    priority: 1,
    icon: 'emergency',
    title: 'Pinjol Debt Elimination Priority',
    content: (ctx) => `Your financial plan must prioritize eliminating pinjol debt. This is your #1 financial goal until it's gone.

**Your commitment:**
- No new pinjol loans
- Aggressive payoff strategy
- Lifestyle adjustments if needed

**Payoff timeline estimate:**
- Total pinjol debt: Rp ${new Intl.NumberFormat('id-ID').format((ctx).pinjolDebtAmount || 0)}
- Monthly payment available: Rp ${new Intl.NumberFormat('id-ID').format(((ctx).debtPaymentMonthly || 0) - ((ctx).debtAmount || 0) * 0.02)}
- Estimated payoff: ${Math.ceil(((ctx).pinjolDebtAmount || 0) / Math.max(1, ((ctx).debtPaymentMonthly || 0) - ((ctx).debtAmount || 0) * 0.02))} months

**Daily reminder:**
- Every payment reduces your burden
- Freedom from pinjol is achievable
- Stay focused on this goal`,
    actions: [
      {
        label: 'Start pinjol payoff journey',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('startPinjolPayoff'));
        },
        icon: 'calculator',
        variant: 'primary',
      },
    ],
    category: 'pinjol',
  },
  {
    id: 'results-next-steps',
    condition: (ctx) => true,
    priority: 5,
    icon: 'info',
    title: 'Your Personalized Next Steps',
    content: (ctx) => `Based on your inputs, here are your immediate action items:

**Priority 1 (This Week):**
${(ctx).hasPinjolDebt ? '- Address pinjol debt situation' : (ctx).hasDebt ? '- Review debt payoff strategy' : '- Start emergency fund if not complete'}

**Priority 2 (This Month):**
- Set up automatic savings
- Track all expenses for 30 days
- Review subscriptions

**Priority 3 (This Quarter):**
- Increase emergency fund to 3 months
- Research investment options
- Consider skill development for income

**Monthly Habits:**
1. Review spending against budget
2. Adjust as needed
3. Celebrate wins, however small
4. Stay consistent

**Remember:** Personal finance is a journey, not a destination. Progress over perfection.`,
    actions: [
      {
        label: 'Create action checklist',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showActionChecklist'));
        },
        icon: 'share',
        variant: 'outline',
      },
    ],
    category: 'budget-rules',
  },
];

export default RESULTS_GUIDANCE_NODES;
