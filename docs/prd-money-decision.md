# Product Requirements Document (PRD)
## Money Decision Web App

**Version:** 1.2
**Status:** Draft
**Created:** 2026-01-15

---

## 1. Executive Summary

### 1.1 Purpose
Build a web application that helps makers, freelancers, and individuals make better decisions about money allocation. The app provides guidance on how to split income across daily expenses, savings, and investments based on proven financial frameworks.

### 1.2 Problem Statement
Many makers and freelancers struggle with:
- Not knowing how much to spend vs. save vs. invest
- Unclear emergency fund targets
- Uncertainty about investment options and risk levels
- No structured approach to personal finance management

### 1.3 Solution
A web-based tool that:
- Calculates optimal money allocation based on user income
- Provides educational guidance on savings and investment options
- Offers personalized recommendations based on risk tolerance and goals

### 1.4 Target Users
- Makers and indie hackers
- Freelancers and consultants
- Remote workers with variable income
- Anyone seeking structured personal finance guidance

---

## 2. Money Allocation Frameworks

### 2.1 Budget Rules Comparison

Based on research from financial experts and personal finance platforms (NerdWallet, WalletHub, TIME, I Will Teach You To Be Rich), here are the most effective budget rules:

| Rule | Needs/Fixed | Wants | Savings | Investment | Notes |
|------|-------------|-------|---------|------------|-------|
| **50/30/20** | 50% | 30% | 20% | - | Classic rule from Elizabeth Warren |
| **60/30/10** | 60% | 30% | 10% | - | Modern adaptation for high-cost areas |
| **70/20/10** | 70% | - | 20% | 10% | Living expenses, savings, debt/donations |
| **75/15/10** | 75% | - | 15% | 10% | Higher living costs |
| **60/20/20** | 60% | 20% | 20% | - | Balanced |
| **80/20** | 80% | - | 20% | - | Simple approach |

**Sources:** TIME (Mar 2024), WalletHub (Sep 2025), NerdWallet, SoFi, US News

### 2.2 Ramit Sethi's Conscious Spending Plan (CSP)

A popular framework from I Will Teach You To Be Rich that focuses on **"living your Rich Life"** with four categories:

| Category | Percentage | Examples |
|----------|------------|----------|
| **Fixed Costs** | 50-60% | Rent, utilities, insurance, subscriptions |
| **Investments** | 10% | Retirement accounts, future you |
| **Savings** | 5-10% | Short-term goals, emergency fund |
| **Guilt-Free Spending** | 20-35% | Enjoyment without guilt |

**Key Insight:** "The CSP is about living your Rich Life, focusing on what matters most to you while ensuring your financial priorities are taken care of."

**Flexibility Note:** High-cost areas may see fixed costs climb to 65-70%.

### 2.3 Detailed Spending Categories by Percentage

Based on WalletHub and financial planning research:

| Category | Recommended % | Examples |
|----------|---------------|----------|
| **Housing** | 25-30% | Rent, mortgage, property tax |
| **Food** | 10-15% | Groceries, dining out |
| **Transportation** | 10-15% | Car payment, gas, public transit |
| **Utilities** | 5-10% | Electricity, water, internet, phone |
| **Insurance** | 10-25% | Health, car, life insurance |
| **Savings** | 10-20% | Emergency fund, goals |
| **Personal Care** | 5-10% | Clothing, grooming |
| **Medical** | 5-10% | Medications, doctor visits |
| **Entertainment** | 5-10% | Streaming, hobbies, recreation |
| **Giving** | 1-10% | Donations, gifts |
| **Miscellaneous** | 5-10% | Unexpected expenses |

### 2.4 Expert Recommendations

| Expert/Source | Key Advice |
|---------------|------------|
| **Kevin L. Matthews II** (BuildingBread) | "Rules of thumb are never concrete. It's important to be flexible." |
| **Michael Finke** (American College) | "Make sure you get every single cent of the employer match. It's a 100% return." |
| **Brian Walsh** (SoFi) | "Use a five-year window to work up to your optimal savings level." |
| **Paul Chaney** | "Cap necessities at 60% and make savings a fixed 'bill' paid first." |
| **Eugene Natali** | Advocates "save first" philosophy—prioritizing savings before necessities |

### 2.5 Debt Consideration

**Important:** Credit card debt at record **20.74%** (Bankrate) should be prioritized before investing. High-interest debt is an emergency that needs immediate attention.

### 2.6 Default Recommendation

For makers and freelancers with variable income, we recommend:

1. **Start with 60/30/10** for simplicity (adjustable based on circumstances)
2. **Use CSP framework** if you want more detailed tracking
3. **Pay off high-interest debt first** before aggressive investing
4. **Increase savings gradually** over 5 years to reach optimal levels

---

## 3. Savings Guidance

### 3.1 Emergency Fund Recommendations

| Stage | Target Amount | Where to Keep |
|-------|---------------|---------------|
| **Starter** | 1 month expenses | High-Yield Savings Account |
| **Basic** | 3 months expenses | High-Yield Savings Account |
| **Standard** | 6 months expenses | High-Yield Savings Account |
| **Strong** | 12 months expenses | Split: 50% HYSA, 50% Money Market |

### 3.2 Savings Options Comparison

| Option | Risk | Return | Liquidity | Best For |
|--------|------|--------|-----------|----------|
| **High-Yield Savings Account** | Very Low | 3-5% APY | High | Emergency fund |
| **Money Market Account** | Very Low | 3-5% APY | High | Short-term savings |
| **Certificates of Deposit (CD)** | Very Low | 4-5% APY | Medium | Fixed-term goals |
| **Treasury Bonds** | Very Low | 4-5% | Medium | Conservative investors |
| **Digital Wallet (OVO, DANA, etc.)** | Low | 1-3% | Very High | Daily spending buffer |

### 3.3 Savings Distribution Guidelines

```
Monthly Income Allocation Example (60/30/10):

Income: Rp 10,000,000

├── Daily Life (60%): Rp 6,000,000
│   ├── Fixed expenses: Rp 3,000,000
│   ├── Variable expenses: Rp 2,000,000
│   └── Buffer: Rp 1,000,000
│
├── Savings (30%): Rp 3,000,000
│   ├── Emergency Fund (50%): Rp 1,500,000
│   │   └── Target: 6 months = Rp 18,000,000
│   │
│   ├── Short-term Goals (30%): Rp 900,000
│   │   └── Vacation, gadgets, courses
│   │
│   └── Medium-term Goals (20%): Rp 600,000
│       └── Education, vehicle, wedding
│
└── Investment (10%): Rp 1,000,000
    ├── Retirement (50%): Rp 500,000
    ├── Index Funds (30%): Rp 300,000
    └── Growth/探索 (20%): Rp 200,000
```

---

## 4. Investment Guidance

### 4.1 Investment Options Overview

| Option | Risk Level | Return Potential | Liquidity | Min. Investment | Recommended For |
|--------|------------|------------------|-----------|-----------------|-----------------|
| **Reksadana Pasar Uang** | Very Low | 4-6% | High | Rp 100,000 | Beginners, safety-first |
| **Reksadana Pendapatan Tetap** | Low | 6-8% | Medium | Rp 100,000 | Conservative |
| **Reksadana Saham** | High | 10-15%+ | Medium | Rp 100,000 | Aggressive, long-term |
| **Saham Langsung (Stocks)** | Very High | Variable | High | Varies | Experienced investors |
| **Obligasi/Surat Utang** | Low | 6-8% | Medium | Rp 1,000,000 | Steady income focus |
| **Reksadana Campuran** | Medium | 8-12% | Medium | Rp 100,000 | Balanced portfolio |
| **Crypto (BTC/ETH)** | Very High | 20-50%+ | High | Rp 50,000 | High risk tolerance |
| **P2P Lending** | Medium | 10-15% | Medium | Rp 100,000 | Diversification |

### 4.2 Risk Profile Assessment

#### Conservative Investor
- **Allocation:** 70% Reksadana Pendapatan Tetap, 20% Pasar Uang, 10% Saham
- **Goal:** Capital preservation, steady returns
- **Time Horizon:** 1-3 years

#### Moderate Investor
- **Allocation:** 40% Reksadana Saham, 30% Campuran, 20% Pendapatan Tetap, 10% Pasar Uang
- **Goal:** Growth with some stability
- **Time Horizon:** 3-5 years

#### Aggressive Investor
- **Allocation:** 60% Reksadana Saham, 20% Stocks, 10% Crypto, 10% Campuran
- **Goal:** Maximum growth
- **Time Horizon:** 5-10+ years

### 4.3 Investment Education Content

#### Reksadana (Mutual Funds)
- Managed by professional fund managers
- Diversification automatically
- Low barrier to entry (Rp 100K)
- Suitable for long-term investing

#### Stocks (Saham)
- Direct ownership in companies
- Higher potential returns
- Requires more knowledge
- Higher risk, especially short-term

#### Crypto
- High volatility
- High potential returns
- Only invest what you can afford to lose
- Research thoroughly before investing

---

## 5. Detailed Expense Breakdown

### 5.1 Category Breakdown

Users can use the guided wizard to input their monthly expenses by category. Each category shows the recommended percentage range based on financial research.

| Category | Recommended % | Examples | Source |
|----------|---------------|----------|--------|
| **Housing** | 25-30% | Rent, mortgage, property tax | WalletHub 2025 |
| **Food** | 10-15% | Groceries, dining out | NerdWallet 2024 |
| **Transportation** | 10-15% | Car payment, gas, public transit | WalletHub 2025 |
| **Utilities** | 5-10% | Electricity, water, internet, phone | NerdWallet 2024 |
| **Insurance** | 10-25% | Health, car, life insurance | WalletHub 2025 |

### 5.2 Wizard Interface

The expense wizard provides real-time feedback:

- **Below recommended range**: Green checkmark ✓
- **Within recommended range**: Blue "On target"
- **Above recommended range**: Orange warning ⚠️

The wizard shows:
- Estimated expenses based on income and budget rule
- Actual vs recommended comparison
- Total monthly expenses vs income
- Progress tracking as categories are filled

### 5.3 Sources & Citations

All recommendations include inline citations with numbered references. A "Sources" toggle at the bottom of results displays full citations:

| # | Source | URL |
|---|--------|-----|
| 1 | WalletHub: Budget Percentages (2025) | wallethub.com/edu/b/budget-percentages/145359 |
| 2 | NerdWallet: How to Budget (2024) | nerdwallet.com/finance/learn/how-to-budget |
| 3 | TIME: 60/30/10 Budget Rule (2024) | time.com/6916834/how-to-budget-60-30-10/ |
| 4 | Ramit Sethi: Conscious Spending Plan | iwillteachyoutoberich.com/conscious-spending-basics/ |

---

## 6. Debt Consideration

### 6.1 High-Interest Debt Priority

**Important:** Credit card debt at record **20.74%** (Bankrate) should be prioritized before investing. High-interest debt is an emergency that needs immediate attention.

The app includes a debt section that:

1. **Asks about high-interest debt** (credit cards, payday loans)
2. **Shows debt payoff calculator**
3. **Recommends paying off debt first** if interest rate > 10%
4. **Provides guidance** on debt payoff strategies (avalanche vs snowball)

### 6.2 Debt Assessment Questions

| Question | Purpose |
|----------|---------|
| Do you have credit card debt? | Identify high-interest debt |
| Total credit card balance | Calculate payoff amount |
| Average interest rate | Determine priority level |
| Minimum monthly payment | Calculate payoff timeline |

### 6.3 Debt Payoff Recommendations

| Scenario | Recommendation |
|----------|----------------|
| Debt interest > 15% | Prioritize debt payoff before investing |
| Debt interest 10-15% | Balance debt payoff with some investing |
| Debt interest < 10% | Focus on investing after minimum payments |

---

## 7. Investment Profiles

### 7.1 Three Profile Options

Users select from three investment profiles using a simple toggle:

| Profile | Risk Level | Return Target | Best For |
|---------|------------|---------------|----------|
| **Conservative** | Low | 4-8% | Safety-first investors |
| **Moderate** | Medium | 8-12% | Balanced growth |
| **Aggressive** | High | 10-50% | Maximum growth seekers |

### 7.2 Profile Allocations

#### Conservative Investor
- **70%** Reksadana Pendapatan Tetap (low risk, steady)
- **20%** Reksadana Pasar Uang (easy access)
- **10%** Reksadana Saham (small growth allocation)

#### Moderate Investor
- **40%** Reksadana Saham (growth)
- **30%** Reksadana Campuran (balanced)
- **20%** Reksadana Pendapatan Tetap (stability)
- **10%** Reksadana Pasar Uang (liquidity)

#### Aggressive Investor
- **60%** Reksadana Saham (maximum growth)
- **20%** Direct Stocks (individual picks)
- **10%** Crypto (BTC/ETH) [with warning]
- **10%** Reksadana Campuran (diversification)

---

## 8. Educational Content

### 8.1 Inline Expandable Explanations

Each investment and savings option includes an expandable "What is this?" section:

```
What is Reksadana Pendapatan Tetap? [▼]
[Expanded: Managed by professional fund managers,
diversification automatically, low barrier to entry
(Rp 100K), suitable for long-term investing]
```

### 8.2 Financial Education Section

A dedicated education section provides deeper understanding:

#### Investment Types
| Topic | Content |
|-------|---------|
| Reksadana (Mutual Funds) | How it works, types, pros/cons |
| Stocks (Saham) | Direct ownership, risks, getting started |
| Crypto | Volatility, research requirements, warnings |
| Bonds/Obligasi | Government vs corporate, steady income |

#### Savings Options
| Topic | Content |
|-------|---------|
| Emergency Fund | Target amounts, where to keep |
| High-Yield Savings | Banks, rates, liquidity |
| Money Market | What it is, pros/cons |
| Certificates of Deposit | Terms, laddering strategy |

#### Key Concepts
| Topic | Content |
|-------|---------|
| Compound Interest | Explanation, calculator |
| Dollar Cost Averaging | Strategy explanation |
| Asset Allocation | How to diversify |
| Risk Tolerance | Self-assessment guide |

### 8.3 Disclaimer

All educational content includes:
- "Not financial advice" disclaimer
- Encouragement to consult professionals
- Links to official financial regulators (OJK for Indonesia)

---

## 9. Features & Requirements

### 9.1 Core Features (MVP)

| Feature | Priority | Description |
|---------|----------|-------------|
| Income Input | P0 | User enters monthly/annual income |
| Allocation Calculator | P0 | Calculates breakdown based on selected rule |
| Expense Breakdown Wizard | P0 | Guided category-by-category expense input |
| Emergency Fund Calculator | P0 | Calculates target based on monthly expenses |
| Savings Guidance | P0 | Shows where to keep savings by purpose |
| Investment Options Info | P0 | Educational content on investment types |
| Investment Profiles | P0 | Conservative/Moderate/Aggressive toggle |
| Debt Assessment | P0 | Credit card debt check and recommendations |
| Rule Selection | P0 | Choose from presets or custom allocation |
| Results Summary | P0 | Clear breakdown of amounts and categories |
| Citations | P1 | Sources for all recommendations |

### 9.2 Future Features (Phase 2)

| Feature | Description |
|---------|-------------|
| Risk Assessment Quiz | Determine investor profile with questions |
| Progress Tracking | Track savings/investment goals over time |
| Multiple Currency Support | IDR, USD, etc. |
| Export PDF | Download financial plan |
| Local Storage | Save calculations |
| Investment Returns Calculator | Project future wealth |

---

## 10. User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        HOME PAGE                            │
│                  "Money Decision Helper"                    │
│                                                             │
│   [Start Your Financial Plan] ──►                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      STEP 1: INCOME                         │
│                                                             │
│   Monthly Income: Rp [____________]                         │
│   Annual Income:   Rp [____________]                        │
│   [Next]                                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   STEP 2: ALLOCATION RULE                   │
│                                                             │
│   Select Rule:                                              │
│   ○ 60/30/10 (Recommended for beginners)                   │
│   ○ 50/30/20 (Balanced)                                    │
│   ○ 70/20/10 (Higher lifestyle)                            │
│   ○ Custom                                                 │
│                                                             │
│   [Previous]  [Next]                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   STEP 3: MONTHLY EXPENSES                  │
│                                                             │
│   Housing:           Rp [____________]                      │
│   Utilities:         Rp [____________]                      │
│   Food/Groceries:    Rp [____________]                      │
│   Transportation:    Rp [____________]                      │
│   Insurance:         Rp [____________]                      │
│   Other:             Rp [____________]                      │
│                                                             │
│   Total Monthly: Rp [___________]                          │
│                                                             │
│   [Previous]  [Calculate]                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   STEP 4: RESULTS                           │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ DAILY LIFE (60%): Rp 6,000,000                      │   │
│   │   - Fixed: Rp 3,000,000                             │   │
│   │   - Variable: Rp 2,000,000                          │   │
│   │   - Buffer: Rp 1,000,000                            │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ SAVINGS (30%): Rp 3,000,000                         │   │
│   │   Emergency Fund Target: Rp 18,000,000              │   │
│   │   Where to keep:                                    │   │
│   │   - 50% HYSA (Rp 1,500,000)                        │   │
│   │   - 50% Money Market (Rp 1,500,000)                │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ INVESTMENT (10%): Rp 1,000,000                      │   │
│   │   Recommended:                                       │   │
│   │   - 50% Reksadana Saham (Rp 500,000)                │   │
│   │   - 30% Reksadana Pasar Uang (Rp 300,000)           │   │
│   │   - 20% Reksadana Campuran (Rp 200,000)             │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   [Save Plan]  [Share]  [Start Over]                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. Technical Requirements

### 11.1 Tech Stack (Recommended)

| Layer | Technology |
|-------|------------|
| Frontend | React / Next.js + TypeScript |
| Styling | Tailwind CSS |
| State Management | React Context or Zustand |
| Deployment | Vercel / Netlify |
| Analytics | Plausible (privacy-focused) |

### 11.2 Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Load Time | < 2 seconds |
| Mobile Responsive | Yes, all breakpoints |
| Accessibility | WCAG 2.1 AA |
| Browser Support | Last 2 versions of Chrome, Firefox, Safari |
| Privacy | No cookies, no tracking |

---

## 12. Design Guidelines

### 12.1 Design Principles
- **Clean & Simple:** Minimalist interface, focus on content
- **Trustworthy:** Professional look, clear information
- **Accessible:** High contrast, readable fonts
- **Mobile-First:** Design for mobile first, then desktop

### 12.2 Color Palette (TBD)
- Primary: Green (money/finance association)
- Secondary: Blue (trust)
- Accent: Orange (action items)
- Neutral: Grays for text and backgrounds

### 12.3 Typography
- Headings: Sans-serif (Inter or Poppins)
- Body: Readable sans-serif (system fonts)
- Monospace: For numbers/currency (JetBrains Mono)

---

## 13. Success Metrics

### 13.1 Quantitative Metrics
| Metric | Target (6 months) |
|--------|-------------------|
| Monthly Active Users | 1,000 |
| Session Duration | 3+ minutes |
| Plan Completion Rate | 60% |
| Return Visitors | 30% |

### 13.2 Qualitative Metrics
- User feedback on clarity of recommendations
- Ease of use ratings
- NPS score (target: 40+)

---

## 14. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Financial advice disclaimer needed | High | Clear disclaimers, not actual financial advice |
| Complex calculations | Medium | Simplify UI, show clear breakdowns |
| Currency fluctuation | Low | Base on local currency (IDR) for MVP |
| User trust | High | Transparent, no hidden data collection |

---

## 15. Appendix

### 15.1 Glossary
- **Reksadana:** Mutual fund - pooled investment vehicle
- **HYSA:** High-Yield Savings Account
- **APY:** Annual Percentage Yield
- **P2P Lending:** Peer-to-Peer Lending

### 15.2 References
- 50/30/20 Rule: Various personal finance resources
- Emergency Fund: 3-6 months expenses (Ramit Sethi, Suze Orman)
- Indonesia specific products: Various bank offerings (2024-2025 rates)

---

## 17. Wizard UX Enhancement

### 17.1 Overview

The Money Decision app transforms from a single-page calculator to a focused 4-step wizard. Each step presents one task at a time, with clear visual hierarchy and accessibility baked in.

### 17.2 The 4-Step Flow

```
┌─────────────────────────────────────────────────────────┐
│  Step 1: Income                                    [1●] │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Monthly Income                                │   │
│  │  Rp [ ____________ ]                          │   │
│  │                              [ Continue → ]   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  [1○] Step 2: Expenses                            [2●] │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Monthly Expenses (Optional)                   │   │
│  │  Rp [ ____________ ]                          │   │
│  │                              [ ← Back ] [ → ] │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  [2○] Step 3: Allocation Rule                    [3●] │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Select your budget rule                      │   │
│  │  ○ 60/30/10 (Recommended)                     │   │
│  │  ○ 50/30/20 (Balanced)                        │   │
│  │  ○ Custom                                     │   │
│  │                              [ ← Back ] [ → ] │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  [3○] Step 4: Your Plan                          [4●] │
│  ┌─────────────────────────────────────────────────┐   │
│  │  DAILY LIFE (60%): Rp 6,000,000               │   │
│  │  SAVINGS (30%): Rp 3,000,000                  │   │
│  │  INVESTMENT (10%): Rp 1,000,000               │   │
│  │                              [ ← Back ]       │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 17.3 Key Behavior

- **Current step is full-screen focused** - Previous steps appear as disabled indicators above; future steps show as empty circles
- **Manual Next button** - User must click "Continue" or press Enter; no auto-advance
- **Back button on every step** - Allows editing previous entries; displays user's entered data when editing
- **Step indicators** - Numbered circles (1-4) with clear active state distinction

### 17.4 Card-Based Step Layout (Each Step)

```
┌─────────────────────────────────────────────────────────┐
│                     Step 1 of 4                         │
│                  Enter Your Income                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│         ┌───────────────────────────────────┐          │
│         │                                   │          │
│         │     Rp [ 1,000,000              ]│          │
│         │      ↑                            │          │
│         │   Large input, auto-focused       │          │
│         │                                   │          │
│         └───────────────────────────────────┘          │
│                                                         │
│         Enter your monthly take-home income             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│              [ ← Back ]    [ Continue → ]              │
└─────────────────────────────────────────────────────────┘
```

### 17.5 Accessibility Features (WCAG 2.1 AA Compliance)

**Screen Reader Announcements:**
- `aria-live="polite"` region announces: "Step 1 of 4: Enter your income"
- On step transition: "Moved to Step 2: Enter your monthly expenses"
- On validation error: "Error: Please enter a valid amount" (validate on blur)

**Keyboard Navigation:**

| Key | Action |
|-----|--------|
| `Tab` | Move between input and buttons |
| `Enter` | Activate "Continue" / "Back" |
| `Escape` | Cancel / Return to current step |
| `Arrow Up/Down` | Navigate radio options in Rule Selector |

**Focus Management:**
- Each step auto-focuses the input field on mount
- Visual focus ring with 2px contrast ratio ≥ 3:1
- Skip link available: "Skip to main content"

**Validation Behavior (On Blur):**
- Input validates when user leaves the field
- Error appears inline below input with `aria-describedby`
- Error message: "Please enter an amount greater than 0"
- "Continue" button disabled until valid

### 17.6 Visual States

**Step Indicators:**
```
○ ○ ○ ●    ← Active step (filled circle)
○ ○ ○ ○    ← Future step (empty circle)  
○ ● ○ ○    ← Completed step (disabled, dimmed)
```

**Disabled Previous Steps (when going back):**
```
[ 1✓ ]  ──►  [ 2✓ ]  ──►  [ 3● ]  ──►  [ 4○ ]
          ↑              ↑
     Rp 1,000,000    Editable
    (summary shown   when clicked
     if expanded)
```

### 17.7 Animation: Slide Transitions

- `animation: slideIn 0.3s ease-out` for step entry
- `animation: slideOut 0.2s ease-in` for step exit
- Direction alternates: Right→Left for forward, Left→Right for back
- Reduced motion preference: `prefers-reduced-motion` media query disables animations

### 17.8 State Architecture

```typescript
interface WizardState {
  currentStep: number;           // 1-4
  income: number | null;         // Step 1 data
  expenses: number | null;       // Step 2 data (optional)
  selectedRuleId: string;        // Step 3 data
  riskProfile: RiskProfile;      // Step 3 data
  isValid: {
    step1: boolean;
    step2: boolean;
    step3: boolean;
  };
}

const [wizardState, setWizardState] = useState<WizardState>({
  currentStep: 1,
  income: null,
  expenses: null,
  selectedRuleId: '60-30-10',
  riskProfile: 'passive',
  isValid: { step1: false, step2: true, step3: false }
});
```

### 17.9 Data Persistence

- **Local state only** (no backend for MVP)
- **Optional localStorage**: Save progress to avoid data loss on refresh
- **Clear data on reset**: All state resets when user clicks "Start Over"

### 17.10 Step-by-Step Validation Rules

**Step 1: Income:**
- Required: Must have value
- Minimum: > 0
- Maximum: Optional cap (e.g., 1 billion IDR)
- Format: Numeric with thousand separators
- On blur: Format as currency (Rp 1,000,000)

**Step 2: Expenses (Optional):**
- Required: No (marked optional)
- Minimum: If provided, must be > 0
- Logic: Compare to income (warn if > income)
- Validation: "Expenses exceed income" warning if applicable

**Step 3: Rule Selection:**
- Required: Must select one option
- Options: 60/30/10, 50/30/20, 70/20/10, Custom
- Custom: Opens additional input fields

**Step 4: Results:**
- Read-only: No validation needed
- Shows: Complete allocation breakdown
- Actions: Save, Share, Start Over

### 17.11 Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| User refreshes page | Restore from localStorage if enabled |
| User enters non-numeric | Input sanitized onChange (regex `/[^0-9]/g`) |
| Amount exceeds realistic range | Warning: "This seems unusually high" |
| No income entered | "Continue" disabled, error on blur |
| Browser back button | Confirm: "Leave this page? Progress will be lost." |
| Screen reader navigation | Logical tab order enforced; skip links |

### 17.12 Mobile Considerations

- Touch targets: Minimum 44×44px for buttons
- Keyboard: Hide on focus for numeric inputs
- Responsive: Card width 100% on mobile, max-width 400px on desktop
- Viewport: Prevent zoom on input focus (`<input font-size="16px">`)

### 17.13 Component Structure

```
src/components/wizard/
├── Wizard.tsx              ← Main container with step logic
├── WizardStep.tsx          ← Reusable step wrapper with animations
├── StepIndicators.tsx      ← Progress circles (1-4)
├── Step1Income.tsx         ← Income input with validation
├── Step2Expenses.tsx       ← Optional expenses input
├── Step3Rule.tsx           ← Rule selection with radio options
└── Step4Results.tsx        ← Read-only results display
```

### 17.14 CSS Animations

```css
@keyframes slideIn {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(-20px); opacity: 0; }
}

.step-enter { animation: slideIn 0.3s ease-out; }
.step-exit { animation: slideOut 0.2s ease-in; }

@media (prefers-reduced-motion: reduce) {
  .step-enter, .step-exit { animation: none; }
}
```

### 17.15 Accessibility Checklist

- [x] `role="main"` on wizard container
- [x] `aria-live="polite"` for step announcements
- [x] `aria-current="step"` on current indicator
- [x] `aria-invalid` and `aria-describedby` on invalid inputs
- [x] Focus management on step transitions
- [x] Keyboard navigation (Tab, Enter, Escape)
- [x] Skip link for keyboard users
- [x] Color contrast ≥ 4.5:1 for text
- [x] Touch targets ≥ 44×44px

---

## 18. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.3 | 2026-01-20 | - | Added Section 17: Wizard UX Enhancement (4-step focused wizard, accessibility WCAG 2.1 AA, keyboard navigation, card-based layout, slide animations) |
| 1.2 | 2026-01-15 | - | Added Section 5: Detailed Expense Breakdown (guided wizard with 5 categories), Section 6: Debt Consideration (credit card debt at 20.74%), Section 7: Investment Profiles (Conservative/Moderate/Aggressive), Section 8: Educational Content (inline expanders + education section), Section 9: Updated Features & Requirements |
| 1.1 | 2026-01-15 | - | Updated Section 2 with web research: added 6 budget rules comparison, Ramit Sethi's Conscious Spending Plan (CSP), detailed spending categories by percentage, expert recommendations, debt consideration (20.74% credit card rate) |
| 1.0 | 2026-01-15 | - | Initial draft |

---

*This PRD serves as the foundation for developing the Money Decision Web App. All team members should review and align on requirements before development begins.*
