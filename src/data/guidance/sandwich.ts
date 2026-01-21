import { GuidanceNode } from '@/types/guidance';

export const SANDWICH_GUIDANCE_NODES: GuidanceNode[] = [
  {
    id: 'sandwich-parents',
    condition: (ctx) => (ctx).isSandwichGeneration === true && (ctx).hasElderlyParents === true,
    priority: 1,
    icon: 'warning',
    title: 'You are part of the Sandwich Generation',
    content: `Based on BPS data, approximately 33% of Indonesian households include elderly members, and about 71 million Indonesians support both parents and their own families. This is a common situation, but requires special financial planning.

**Your situation:** You're supporting elderly parents while managing your own expenses. This means:
- Your "discretionary income" is actually family support money
- Emergency fund is critical for both your family and parents' health needs
- Investment timeline may be longer due to ongoing support obligations`,
    actions: [
      {
        label: 'See adjusted budget recommendations',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('scrollToRuleSelection'));
        },
        icon: 'arrow-right',
        variant: 'outline',
      },
    ],
    category: 'sandwich',
  },
  {
    id: 'pinjol-crisis',
    condition: (ctx) => (ctx).hasPinjolDebt === true,
    priority: 1,
    icon: 'emergency',
    title: 'Pinjol Debt Requires Immediate Attention',
    content: `Based on OJK data, there are 9.18 million pinjol accounts among ages 19-34 with Rp 28.80 trillion in outstanding loans. Many young Indonesians are trapped in high-interest debt cycles.

**Why pinjol is dangerous:**
- Interest rates can exceed 100% APR (legal limit often ignored)
- Rolling over loans creates debt spiral
- Affects credit score and future loan eligibility

**Your action plan:**
1. **Stop taking new pinjol** - this is the most important rule
2. **List all pinjol balances** - you cannot fix what you don't know
3. **Consider debt consolidation** through formal banks with lower rates
4. **Prioritize paying off highest interest first**
5. **Seek free counseling** from OJK or financial advisors`,
    actions: [
      {
        label: 'Calculate debt payoff plan',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showPinjolCalculator'));
        },
        icon: 'calculator',
        variant: 'primary',
      },
    ],
    category: 'pinjol',
  },
  {
    id: 'pinjol-crisis-multiple',
    condition: (ctx) => (ctx).hasPinjolDebt === true && (ctx).pinjolCount > 1,
    priority: 1,
    icon: 'emergency',
    title: 'Multiple Pinjol Accounts - Critical Situation',
    content: `Having multiple pinjol accounts is a sign of a debt spiral. Each time you take a new loan to pay off another, interest compounds and the situation worsens.

**Immediate steps:**
1. Stop all new pinjol applications today
2. List every single pinjol account you have
3. Calculate total debt and total monthly interest
4. Consider the OJK pengaduan service for formal help
5. Talk to family - they may be able to help with a lower-interest loan to consolidate`,
    actions: [
      {
        label: 'Get help from OJK',
        onClick: () => {
          window.open('https://www.ojk.go.id/id/kanal/edu/pages/Layanan-Konsumen.aspx', '_blank');
        },
        icon: 'external-link',
        variant: 'outline',
      },
    ],
    category: 'pinjol',
  },
  {
    id: 'pinjol-high-interest',
    condition: (ctx) => (ctx).hasPinjolDebt === true && ((ctx).pinjolDebtInterest || 0) > 5,
    priority: 1,
    icon: 'warning',
    title: 'High Pinjol Interest Rate Detected',
    content: (ctx) => `With an estimated ${(ctx).pinjolDebtInterest}% monthly interest, your pinjol debt could double in just ${Math.ceil(14 / ((ctx).pinjolDebtInterest || 1))} months if unpaid.

**Monthly interest calculation:**
- Rp ${new Intl.NumberFormat('id-ID').format((ctx).pinjolDebtAmount || 0)} × ${(ctx).pinjolDebtInterest}% = Rp ${new Intl.NumberFormat('id-ID').format((((ctx).pinjolDebtAmount || 0) * ((ctx).pinjolDebtInterest || 0)) / 100)} in interest alone each month

**You need:**
- Either pay significantly more than minimum
- Or refinance with a formal institution`,
    actions: [
      {
        label: 'Compare refinancing options',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showRefinancingComparison'));
        },
        icon: 'arrow-right',
        variant: 'outline',
      },
    ],
    category: 'pinjol',
  },
  {
    id: 'sandwich-budget-adjustment',
    condition: (ctx) => (ctx).isSandwichGeneration === true,
    priority: 2,
    icon: 'action',
    title: 'Adjusted Budget for Sandwich Generation',
    content: `For sandwich generation members, traditional budget rules may not apply. Consider this adjusted approach:

**Your Reality:**
- Income shown may be "gross" - after family support, your true discretionary income is lower
- Emergency fund needs may be higher (parents' health emergencies)
- Investment timeline is likely longer

**Recommended Adjustments:**
1. **Budget family support as a fixed expense** - treat it like rent
2. **Build 3-month "family buffer"** before personal investments
3. **Consider side income** - your time is an asset
4. **Review government programs** - some assistance exists for elderly care

**Realistic goal:** Focus on not going into more debt first. Once stable, then build savings.`,
    actions: [
      {
        label: 'Calculate realistic savings rate',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showSavingsCalculator'));
        },
        icon: 'calculator',
        variant: 'outline',
      },
    ],
    category: 'sandwich',
  },
  {
    id: 'sandwich-siblings',
    condition: (ctx) => (ctx).isSandwichGeneration === true && (ctx).hasOtherFamily === true,
    priority: 2,
    icon: 'info',
    title: 'Supporting Younger Siblings',
    content: `Supporting younger siblings with education or living costs is both a financial and emotional responsibility. Here's how to manage it:

**Education costs:**
- Look for scholarships and grants
- Consider cheaper alternatives (state universities vs private)
- Part-time work for older siblings can help

**Budget allocation:**
- Treat sibling support as a fixed monthly expense
- Set clear expectations about amounts
- Plan for education milestones (entrance fees, books)`,
    category: 'sandwich',
  },
  {
    id: 'sandwich-double-burden',
    condition: (ctx) =>
      (ctx).isSandwichGeneration === true &&
      (ctx).hasElderlyParents === true &&
      (ctx).hasOtherFamily === true,
    priority: 1,
    icon: 'warning',
    title: 'Double Sandwich Burden - Both Parents and Siblings',
    content: `You're supporting both elderly parents and younger siblings - this is a significant financial burden that few people discuss openly.

**Acknowledge the challenge:**
- You're not alone - millions of Indonesians face this
- It's okay to set boundaries
- Your own financial health matters too

**Strategies:**
1. **Prioritize** - Parents' health needs come first, then education
2. **Communicate** - Family discussions about realistic expectations
3. **Plan** - Create a timeline for when sibling support can decrease
4. **Self-care** - Protect your own mental and financial health`,
    actions: [
      {
        label: 'Talk to a financial counselor',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showCounselingResources'));
        },
        icon: 'arrow-right',
        variant: 'outline',
      },
    ],
    category: 'sandwich',
  },
  {
    id: 'sandwich-elderly-health',
    condition: (ctx) => (ctx).isSandwichGeneration === true && (ctx).hasElderlyParents === true,
    priority: 2,
    icon: 'warning',
    title: 'Plan for Elderly Parents Healthcare',
    content: `Healthcare costs for elderly parents can be unpredictable. Here's how to prepare:

**Monthly considerations:**
- BPJS contribution (if not yet enrolled)
- Regular medications
- Doctor visits and checkups
- Emergency health fund

**Recommended fund:**
- Set aside Rp 500,000 - 1,000,000 monthly for elderly healthcare
- Consider elderly-specific insurance options
- Know what government programs exist (JKK, JKM from BPJS)`,
    category: 'sandwich',
  },
  {
    id: 'sandwich-side-income',
    condition: (ctx) =>
      (ctx).isSandwichGeneration === true &&
      ((ctx).discretionaryIncome || 0) < 1000000,
    priority: 3,
    icon: 'action',
    title: 'Consider Side Income Opportunities',
    content: `With your current discretionary income after family obligations, consider ways to increase your income:

**Quick-start options:**
- Freelance work (design, writing, programming)
- Online selling (drop shipping, thrifted items)
- Part-time work on weekends
- Skills-based services (tutoring, photography)

**Longer-term:**
- Develop a marketable skill
- Start a small business
- Invest in education that increases earning potential

**Remember:** Every rupiah you earn beyond your obligations is progress.`,
    actions: [
      {
        label: 'Explore income opportunities',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('showSideIncomeResources'));
        },
        icon: 'arrow-right',
        variant: 'outline',
      },
    ],
    category: 'sandwich',
  },
  {
    id: 'sandwich-not-alone',
    condition: (ctx) => (ctx).isSandwichGeneration === true,
    priority: 5,
    icon: 'check',
    title: 'You Are Not Alone',
    content: `Being part of the sandwich generation is challenging, but you should know:

**Facts:**
- ~71 million Indonesians are sandwich generation (BPS 2020)
- 33% of Indonesian households have elderly members
- This is a shared cultural responsibility, not a personal failure

**Community resources:**
- Family support is valuable in Indonesian culture
- Religious organizations may have assistance programs
- Government programs exist for elderly care (check BPJS, PKH)

**Mental health matters:**
- Financial stress affects mental health
- Consider talking to someone
- Small progress is still progress`,
    category: 'sandwich',
  },
];

export default SANDWICH_GUIDANCE_NODES;
