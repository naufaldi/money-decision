import { GuidanceNode } from '@/types/guidance';

export const EXPENSES_GUIDANCE_NODES: GuidanceNode[] = [
  {
    id: 'expenses-housing-high',
    condition: (ctx) => {
      if (!(ctx).income || !(ctx).expenses) return false;
      const housingRatio =
        ((ctx).expensesByCategory?.housing || 0) / (ctx).income;
      return housingRatio > 0.35;
    },
    priority: 1,
    icon: 'warning',
    title: 'Housing Costs Exceed Recommended 35%',
    content: `Your housing costs are above the recommended 35% of income. This leaves less for savings and other needs.

**Quick fixes:**
1. Consider cheaper location (outer Jakarta, nearby cities)
2. Find roommates to split costs
3. Negotiate rent or look for smaller place

**Alternatives to consider:**
- Kos-kosan with shared facilities
- Living with family temporarily
- Moving to satellite cities (Bekasi, Tangerang, Bogor)

**Long-term:**
- Consider KPR if planning to stay long-term
- Balance between convenience and cost
- Location affects transport costs too`,
    actions: [
      {
        label: 'See housing cost comparison',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showHousingComparison'));
        },
        icon: 'arrow-right',
        variant: 'outline',
      },
    ],
    category: 'expenses',
  },
  {
    id: 'expenses-food-high',
    condition: (ctx) => {
      if (!(ctx).income || !(ctx).expenses) return false;
      const foodRatio =
        ((ctx).expensesByCategory?.food || 0) / (ctx).income;
      return foodRatio > 0.20;
    },
    priority: 2,
    icon: 'warning',
    title: 'Food Spending Above Recommended Range',
    content: `Food spending above 20% of income may indicate dining out too frequently or premium grocery choices.

**Budget-friendly tips:**
1. Meal prep for the week
2. Cook at home most days
3. Limit dining out to once per week
4. Shop at traditional markets

**Reasonable food budget:**
- Groceries: Rp 500,000-800,000/month
- Dining out: Rp 200,000-400,000/month
- Total food: Rp 700,000-1,200,000/month

**Savings potential:**
- Cooking at home 80% of the time vs eating out can save Rp 500,000+/month`,
    category: 'expenses',
  },
  {
    id: 'expenses-transport-high',
    condition: (ctx) => {
      if (!(ctx).income || !(ctx).expenses) return false;
      const transportRatio =
        ((ctx).expensesByCategory?.transport || 0) / (ctx).income;
      return transportRatio > 0.15;
    },
    priority: 2,
    icon: 'warning',
    title: 'Transportation Costs Are High',
    content: `Your transportation costs are above the recommended 15% of income. Here's how to reduce:

**Immediate savings:**
1. Use public transport consistently (TransJakarta, MRT)
2. Carpool with colleagues
3. Walk for short distances

**If you drive:**
- Consider motorcycle over car
- Optimize routes to save fuel
- Regular maintenance improves efficiency

**Reasonable transport budget:**
- Public transport: Rp 150,000-300,000
- With occasional ride-hail: Rp 300,000-500,000

**Consider:**
- Living closer to work
- Remote work options`,
    category: 'expenses',
  },
  {
    id: 'expenses-utilities-high',
    condition: (ctx) => {
      if (!(ctx).income || !(ctx).expenses) return false;
      const utilitiesRatio =
        ((ctx).expensesByCategory?.utilities || 0) / (ctx).income;
      return utilitiesRatio > 0.10;
    },
    priority: 3,
    icon: 'info',
    title: 'Review Utility Expenses',
    content: `Utilities above 10% of income may include high electricity, water, or internet costs.

**Saving on utilities:**
1. Use energy-efficient appliances
2. Turn off unused electronics
3. Use natural light when possible
4. Consider cheaper internet packages

**Typical utility costs:**
- Electricity: Rp 200,000-400,000
- Water: Rp 50,000-100,000
- Internet: Rp 300,000-500,000
- Mobile: Rp 50,000-150,000
- Total: Rp 600,000-1,150,000

**Tips:**
- Air conditioning only when needed
- LED bulbs use less electricity
- Compare internet providers`,
    category: 'expenses',
  },
  {
    id: 'expenses-debt-high',
    condition: (ctx) => {
      if (!(ctx).income || !(ctx).expenses) return false;
      const debtRatio =
        ((ctx).expensesByCategory?.debt || 0) / (ctx).income;
      return debtRatio > 0.20;
    },
    priority: 1,
    icon: 'emergency',
    title: 'High Debt Payments Detected',
    content: `Debt payments above 20% of income are a warning sign. This creates a "debt trap" that makes it hard to build wealth.

**Immediate action needed:**
1. List all debts with interest rates
2. Use avalanche method (pay highest interest first)
3. Consider debt consolidation

**If you have pinjol:**
- Stop taking new pinjol immediately
- List all pinjol balances
- Seek OJK counseling

**Debt payoff strategies:**
- Avalanche: Highest interest first (saves most money)
- Snowball: Smallest balance first (psychological wins)
- Debt snowball with balance transfer

**Remember:** High-interest debt is an emergency. Paying it off is like getting a guaranteed return.`,
    actions: [
      {
        label: 'Calculate debt payoff plan',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showDebtPayoffCalculator'));
        },
        icon: 'calculator',
        variant: 'primary',
      },
    ],
    category: 'debt',
  },
  {
    id: 'expenses-family-support',
    condition: (ctx) =>
      (ctx).isSandwichGeneration === true &&
      (ctx).familySupportAmount !== null &&
      (ctx).familySupportAmount > 0,
    priority: 2,
    icon: 'info',
    title: 'Family Support Budget Allocation',
    content: (ctx) => `You're allocating Rp ${new Intl.NumberFormat('id-ID').format((ctx).familySupportAmount || 0)}/month to family support. This is a significant commitment.

**Best practices:**
1. Treat it as a fixed expense (like rent)
2. Set clear expectations with family
3. Budget for it first, before discretionary spending
4. Have an emergency fund for unexpected needs

**Considerations:**
- Is this amount sustainable?
- Can it be adjusted if your income changes?
- Are there government programs that could help?

**For elderly parents:**
- Healthcare costs can be unpredictable
- Consider dedicated health fund
- Look into BPJS for parents`,
    actions: [
      {
        label: 'Plan family support budget',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showFamilyBudgetPlanner'));
        },
        icon: 'calculator',
        variant: 'outline',
      },
    ],
    category: 'sandwich',
  },
  {
    id: 'expenses-savings-low',
    condition: (ctx) => {
      if (!(ctx).income || !(ctx).expenses) return false;
      const savingsRate = 1 - (ctx).expenses / (ctx).income;
      return savingsRate < 0.10 && savingsRate > 0;
    },
    priority: 2,
    icon: 'warning',
    title: 'Savings Rate Below 10%',
    content: `Your savings rate is below 10%. This makes it harder to build wealth and handle emergencies.

**Strategies to increase savings:**
1. Automate savings on payday
2. Treat savings as a "bill" to pay yourself first
3. Review expenses for cuts
4. Increase income through side work

**Quick wins:**
- Cancel unused subscriptions
- Reduce dining out
- Shop with a list
- Use cashback wisely

**Realistic target:**
- Start with 5% and increase by 1% every few months
- Aim for 20% long-term
- The key is consistency, not perfection`,
    actions: [
      {
        label: 'Create savings plan',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showSavingsPlan'));
        },
        icon: 'calculator',
        variant: 'outline',
      },
    ],
    category: 'savings',
  },
  {
    id: 'expenses-overall-good',
    condition: (ctx) => {
      if (!(ctx).income || !(ctx).expenses) return false;
      const savingsRate = 1 - (ctx).expenses / (ctx).income;
      return savingsRate >= 0.15 && savingsRate <= 0.35;
    },
    priority: 4,
    icon: 'check',
    title: 'Your Expenses Are Well-Managed',
    content: `Great job! Your expense-to-income ratio is in a healthy range, which means you're balancing spending and saving well.

**What this means:**
- You have room for savings and investments
- Your lifestyle is sustainable
- You're building good financial habits

**To optimize further:**
1. Continue tracking expenses
2. Increase savings rate gradually
3. Review investment options
4. Build emergency fund to target (6 months)

**Next level:**
- Consider maximizing retirement accounts
- Look into wealth-building opportunities
- Share knowledge with friends/family`,
    category: 'expenses',
  },
  {
    id: 'expenses-overall-high',
    condition: (ctx) => {
      if (!(ctx).income || !(ctx).expenses) return false;
      return (ctx).expenses >= (ctx).income;
    },
    priority: 1,
    icon: 'emergency',
    title: 'Expenses Exceed Income',
    content: `Your expenses equal or exceed your income. This is a critical situation that requires immediate attention.

**Immediate actions:**
1. Track every single expense for 30 days
2. Categorize all spending
3. Identify non-essential expenses to cut
4. Look for ways to increase income

**Essential vs non-essential:**
Essential (keep): Housing, food, transport to work, utilities, minimum debt payments
Non-essential (cut or reduce): Dining out, entertainment, subscriptions, hobbies

**Short-term survival plan:**
- Survive mode: Cut everything non-essential
- Communicate with creditors if needed
- Look for emergency assistance
- Consider temporary measures

**Long-term fix:**
- Increase income (skill development, side work)
- Reduce fixed costs (housing, transportation)
- Build emergency fund once stable`,
    actions: [
      {
        label: 'Start expense tracking',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('startExpenseTracking'));
        },
        icon: 'calculator',
        variant: 'primary',
      },
    ],
    category: 'expenses',
  },
];

export default EXPENSES_GUIDANCE_NODES;
