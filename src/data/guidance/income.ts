import { GuidanceNode } from '@/types/guidance';
import wageData from '@/data/salary/avg_wages_total_august_2025.json';

export const INCOME_GUIDANCE_NODES: GuidanceNode[] = [
  {
    id: 'income-below-minimum',
    condition: (ctx) =>
      (ctx).income !== null &&
      (ctx).income > 0 &&
      (ctx).income < 2000000,
    priority: 1,
    icon: 'warning',
    title: 'Income Below Minimum Wage',
    content: (ctx) => {
      const provinceName = ctx.province || 'Indonesia';
      const provinceWageData = wageData.find(
        item => item.province.toUpperCase() === provinceName.toUpperCase()
      );
      const averageWage = provinceWageData?.total_august_2025 || 3331012;
      const formattedWage = new Intl.NumberFormat('id-ID').format(averageWage);

      return `Your monthly income is below the ${provinceName} average wage (Rp ~${formattedWage}). This is challenging but manageable with careful planning.

**Immediate priorities:**
1. Track every expense - use the expense wizard
2. Look for income increase opportunities
3. Consider government assistance programs (BPJS, PKH)

**Short-term goals:**
- Build Rp 1,000,000 emergency fund first
- Focus on essential expenses only
- Look for side income opportunities

**Realistic budget (adjust based on ${provinceName}):**
- Housing: Find the cheapest option (with family, kos-kosan)
- Food: Rp 500,000-800,000/month
- Transport: Public transport or walk`;
    },
    category: 'income',
  },
  {
    id: 'income-entry-level',
    condition: (ctx) =>
      (ctx).income !== null &&
      (ctx).income >= 2000000 &&
      (ctx).income < 5000000,
    priority: 2,
    icon: 'info',
    title: 'Entry-Level Income',
    content: `Your income is in the entry-level range. This is a common starting point - the key is building habits that will serve you as income grows.

**Recommended approach:**
1. Start with 50/30/20 rule but adjust for reality
2. Aim for 10% savings initially
3. Focus on skill development for income growth

**Savings strategy:**
- Even Rp 200,000/month adds up to Rp 2,400,000/year
- Automate transfers if possible
- Use HYSA for better returns

**Investment (once stable):**
- Start with Reksadana Pasar Uang (low risk)
- Learn about compound interest`,
    actions: [
      {
        label: 'See investment basics',
        onClick: (ctx) => {
          window.dispatchEvent(
            new CustomEvent('showInvestmentEducation', {
              detail: { monthlyIncome: ctx.income }
            })
          );
        },
        icon: 'arrow-right',
        variant: 'outline',
      },
    ],
    category: 'income',
  },
  {
    id: 'income-middle-class',
    condition: (ctx) =>
      (ctx).income !== null &&
      (ctx).income >= 5000000 &&
      (ctx).income < 15000000,
    priority: 2,
    icon: 'check',
    title: 'Middle Income - Good Foundation',
    content: `Your income provides a solid foundation for financial health. With proper management, you can build wealth over time.

**Recommended strategy:**
- Use 60/30/10 budget rule as default
- Build 6-month emergency fund
- Start investing 10% of income

**If you have variable income:**
- Base your budget on 80% of average income
- Save variable amounts in good months
- Build larger buffer for security`,
    category: 'income',
  },
  {
    id: 'income-high',
    condition: (ctx) =>
      (ctx).income !== null &&
      (ctx).income >= 15000000,
    priority: 3,
    icon: 'check',
    title: 'Higher Income - Optimize Your Wealth',
    content: `Your income provides significant opportunity for wealth building. Here are optimization strategies:

**Maximize tax advantages:**
- Consider pension fund deductions (deductible from taxable income)
- Use tax-free allowance effectively
- Review tax treaties if applicable

**Investment opportunities:**
- Max out retirement accounts first
- Consider diversified portfolio across asset classes
- Explore real estate investment options

**Wealth building:**
- Consider multiple income streams
- Review insurance coverage (health, life)
- Create a structured investment plan`,
    actions: [
      {
        label: 'Explore advanced investing',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showAdvancedInvesting'));
        },
        icon: 'arrow-right',
        variant: 'outline',
      },
    ],
    category: 'income',
  },
  {
    id: 'income-variable',
    condition: (ctx) => (ctx).incomeType === 'variable' || (ctx).incomeType === 'mixed',
    priority: 2,
    icon: 'warning',
    title: 'Variable Income Requires Planning',
    content: `With variable income, traditional budgeting doesn't work. Here's how to adapt:

**The envelope method:**
1. Calculate your average monthly income (last 6-12 months)
2. Base your budget on 80% of that average
3. In good months: save the excess
4. In slow months: use saved buffer

**Recommended emergency fund:**
- 6-9 months instead of 3-6
- This is your income insurance
- Build it aggressively

**Monthly allocation (variable income):**
- Fixed expenses: max 50% of baseline
- Savings: 20% (this is non-negotiable)
- Variable expenses: remaining from actual income`,
    category: 'income',
  },
  {
    id: 'income-jakarta-high-cost',
    condition: (ctx) =>
      (ctx).province === 'DKI JAKARTA' &&
      (ctx).income !== null &&
      (ctx).income < 8000000,
    priority: 2,
    icon: 'warning',
    title: 'Jakarta Cost of Living Adjustment',
    content: `Living in Jakarta with this income level can be challenging. Here are strategies:

**Housing options:**
- Consider areas outside central Jakarta (Depok, Bekasi, Tangerang)
- Kos-kosan can be Rp 1-3 million/month for decent options
- Consider roommates to split costs

**Transportation:**
- Use TransJakarta/MRT consistently
- Avoid ojek online for daily commute
- Consider motorcycle if you can afford it

**Realistic budget for Jakarta:**
- Housing: Rp 2-4 million
- Food: Rp 1-1.5 million
- Transport: Rp 300-500K
- Total essentials: Rp 3.5-6 million

**Consider:**
- Working remotely to live elsewhere
- Finding a job in cheaper city`,
    category: 'income',
  },
  {
    id: 'income-freelancer',
    condition: (ctx) => (ctx).incomeType === 'variable',
    priority: 2,
    icon: 'info',
    title: 'Freelancer Income Strategy',
    content: `As a freelancer, you have unique opportunities and challenges:

**Income smoothing:**
- Set aside 30% of every payment for taxes
- Save 6 months of expenses before investing
- Build relationships for recurring income

**Client diversification:**
- Don't rely on one client
- Aim for 3-5+ income sources
- Consider retainer agreements

**Business expenses:**
- Track all business expenses
- Consider SPT Tahunan carefully
- Explore PKP (Pengusaha Kena Pajak) if beneficial`,
    actions: [
      {
        label: 'Freelancer tax guide',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showTaxGuide'));
        },
        icon: 'arrow-right',
        variant: 'outline',
      },
    ],
    category: 'income',
  },
  {
    id: 'income-salary-insights',
    condition: (ctx) => (ctx).income !== null,
    priority: 4,
    icon: 'info',
    title: 'Understanding Your Salary Position',
    content: (ctx) => {
      const nationalAvg = new Intl.NumberFormat('id-ID').format(3331012);
      const provinceName = ctx.province || 'your area';
      const provinceWageData = wageData.find(
        item => item.province.toUpperCase() === (ctx.province || '').toUpperCase()
      );
      const provinceAvg = provinceWageData 
        ? new Intl.NumberFormat('id-ID').format(provinceWageData.total_august_2025)
        : null;

      return `Based on BPS data, the average formal employee in Indonesia earns Rp ${nationalAvg}/month${provinceAvg ? `, while in ${provinceName} it's Rp ${provinceAvg}/month` : ''}.

**What this means:**
- Your income comparison gives context
- Higher income doesn't mean financial success
- Habits matter more than absolute numbers

**Focus on:**
- Your personal financial health
- Progress relative to your own goals
- Building sustainable habits

**Remember:** Everyone's situation is different. Compare yourself to your past self, not others.`;
    },
    category: 'income',
  },
];

export default INCOME_GUIDANCE_NODES;
