# RFC: Money Allocation Calculator - Tech Stack & Design

**Status:** Draft
**Version:** 1.3
**Created:** 2026-01-15
**Updated:** 2026-01-15

---

## 1. Overview

This RFC defines the technical stack and design system for building the Money Allocation Calculator as a fully client-side React application.

---

## 2. Tech Stack

### 2.1 Core Technologies

| Layer | Technology | Reason |
|-------|------------|--------|
| **Framework** | React 18+ | Component-based, large ecosystem |
| **Build Tool** | Vite 5+ | Fast dev server, optimized builds |
| **Language** | TypeScript 5+ | Type safety, better developer experience |
| **State Management** | Effect.solutions | Simple, reactive state management |
| **UI Components** | shadcn/ui + Tailwind CSS | Beautiful, accessible components |
| **Routing** | Not needed (single page) | Fully client-side, one view |

### 2.2 Why Effect.solutions?

[Effect.solutions](https://www.effect.solutions/) is a lightweight state management library for React that provides:

- **Simple API** - Easy to learn and use
- **Reactive** - Automatic dependency tracking
- **No useEffect boilerplate** - Clean, declarative state updates
- **Type-safe** - Full TypeScript support
- **Lightweight** - Minimal bundle size impact

Compared to useEffect:
- No manual dependency arrays
- Automatic cleanup
- Easier to reason about
- Better performance characteristics

### 2.4 Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@effect/react": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

**shadcn/ui Setup:**
```bash
# Initialize shadcn with Vite
npx shadcn@latest init

# Add components we'll use
npx shadcn@latest add button input card radio-group tabs toggle
```

### 2.5 Project Structure

```
money-decision/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx           # Entry point
│   ├── App.tsx            # Main component
│   ├── components/
│   │   ├── Calculator.tsx         # Core calculator
│   │   ├── IncomeInput.tsx        # Income form (uses shadcn Input)
│   │   ├── RuleSelector.tsx       # Budget rule picker (uses shadcn RadioGroup)
│   │   ├── ResultsDisplay.tsx     # Results breakdown
│   │   ├── SavingsBreakdown.tsx   # Savings sub-categories
│   │   └── InvestmentProfile.tsx  # Investment risk selector (uses shadcn Tabs)
│   ├── lib/
│   │   ├── utils.ts               # cn() utility for shadcn
│   │   └── formatters.ts          # Currency formatting
│   ├── hooks/
│   │   └── useCalculator.ts   # Calculator logic
│   ├── utils/
│   │   ├── formatters.ts      # Currency formatting
│   │   └── calculators.ts     # Calculation functions
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   ├── constants/
│   │   └── rules.ts           # Budget rules config
│   ├── styles/
│   │   ├── variables.css      # CSS variables (colors)
│   │   └── global.css         # Global styles
│   └── assets/
│       └── (static assets)
└── public/
```

### 2.4 Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

---

## 3. Color Schema

Based on PRD Section 8.2 - designed for trust, clarity, and financial context.

### 3.1 Primary Palette (Money/Finance)

| Color | Variable | Usage |
|-------|----------|-------|
| **Forest Green** | `--color-primary` | Main brand color, primary buttons, success states |
| **Light Green** | `--color-primary-light` | Hover states, subtle backgrounds |
| **Dark Green** | `--color-primary-dark` | Active states, text on light backgrounds |

**Hex Values (Recommended):**
- Primary: `#16a34a` (Tailwind green-600 equivalent)
- Primary Light: `#22c55e` (green-500)
- Primary Dark: `#15803d` (green-700)

### 3.2 Secondary Palette (Trust)

| Color | Variable | Usage |
|-------|----------|-------|
| **Trust Blue** | `--color-secondary` | Information, links, secondary actions |
| **Light Blue** | `--color-secondary-light` | Backgrounds, borders |
| **Dark Blue** | `--color-secondary-dark` | Text, headings |

**Hex Values (Recommended):**
- Secondary: `#2563eb` (Tailwind blue-600)
- Secondary Light: `#3b82f6` (blue-500)
- Secondary Dark: `#1d4ed8` (blue-700)

### 3.3 Accent Palette (Action Items)

| Color | Variable | Usage |
|-------|----------|-------|
| **Vibrant Orange** | `--color-accent` | CTAs, warnings, highlights |
| **Light Orange** | `--color-accent-light` | Hover states, tags |
| **Dark Orange** | `--color-accent-dark` | Active states |

**Hex Values (Recommended):**
- Accent: `#f97316` (Tailwind orange-500)
- Accent Light: `#fb923c` (orange-400)
- Accent Dark: `#ea580c` (orange-600)

### 3.4 Semantic Colors

| Color | Variable | Usage |
|-------|----------|-------|
| **Success** | `--color-success` | Positive results, savings goals |
| **Warning** | `--color-warning` | Attention needed, limits |
| **Error** | `--color-error` | Validation errors, problems |
| **Info** | `--color-info` | General information |

**Hex Values:**
- Success: `#22c55e` (green-500)
- Warning: `#eab308` (yellow-500)
- Error: `#ef4444` (red-500)
- Info: `#3b82f6` (blue-500)

### 3.5 Neutral Palette

| Color | Variable | Usage |
|-------|----------|-------|
| **White** | `--color-white` | Card backgrounds, inputs |
| **Gray 50** | `--color-gray-50` | Page background |
| **Gray 100** | `--color-gray-100` | Secondary backgrounds |
| **Gray 200** | `--color-gray-200` | Borders, dividers |
| **Gray 300** | `--color-gray-300` | Subtle borders |
| **Gray 400** | `--color-gray-400` | Disabled states |
| **Gray 500** | `--color-gray-500` | Muted text |
| **Gray 600** | `--color-gray-600` | Body text |
| **Gray 700** | `--color-gray-700` | Headings |
| **Gray 800** | `--color-gray-800` | Strong headings |
| **Gray 900** | `--color-gray-900` | Primary text |

### 3.6 Category Colors (Budget Categories)

| Category | Color | Variable | Hex |
|----------|-------|----------|-----|
| **Daily Life/Needs** | Green | `--color-category-needs` | `#16a34a` |
| **Savings** | Blue | `--color-category-savings` | `#2563eb` |
| **Investment/Wants** | Orange | `--color-category-wants` | `#f97316` |

These colors should be used consistently in:
- Progress bars
- Category badges
- Result cards
- Charts/visuals

### 3.7 CSS Variables Setup (shadcn/ui Pattern)

shadcn/ui uses CSS variables for theming. We'll override the default colors:

```css
@layer base {
  :root {
    /* shadcn/ui default variables - customized for money app */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    /* Primary - Money/Finance (Green) */
    --primary: 142.1 76.2% 36.3%;  /* #16a34a */
    --primary-foreground: 355.7 100% 97.3%;

    /* Secondary - Trust (Blue) */
    --secondary: 221.2 83.2% 53.3%;  /* #2563eb */
    --secondary-foreground: 210 40% 98%;

    /* Accent - Action Items (Orange) */
    --accent: 25 95% 53%;  /* #f97316 */
    --accent-foreground: 222.2 47.4% 11.2%;

    /* Destructive - Error (Red) */
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    /* Muted colors */
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    /* Borders */
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 142.1 76.2% 36.3%;

    /* Radius */
    --radius: 0.75rem;

    /* Category Colors - Custom for budget categories */
    --category-needs: 142.1 76.2% 36.3%;  /* Green - Daily Life */
    --category-savings: 221.2 83.2% 53.3%; /* Blue - Savings */
    --category-wants: 25 95% 53%;          /* Orange - Investment */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Category Color Usage:**
```css
.category-needs {
  background-color: hsl(var(--category-needs));
  color: white;
}

.category-savings {
  background-color: hsl(var(--category-savings));
  color: white;
}

.category-wants {
  background-color: hsl(var(--category-wants));
  color: white;
}
```

---

## 4. Design Principles

Based on PRD Section 8.1:

1. **Clean & Simple** - Minimalist interface, focus on content
2. **Trustworthy** - Professional look, clear information
3. **Accessible** - High contrast (WCAG 2.1 AA)
4. **Mobile-First** - Design for mobile first, then desktop

---

## 5. Component Guidelines (shadcn/ui)

We use shadcn/ui components for consistency and accessibility.

### 5.1 Button Variants (shadcn Button)

Use shadcn's `cva` (class-variance-authority) for button variants:

```typescript
// Button.tsx
import { cva } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### 5.2 Input Component (shadcn Input)

```typescript
// Input.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
```

### 5.3 Card Component (shadcn Card)

```typescript
// Card.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
  )
)
```

### 5.4 Category Color Classes

```typescript
// Utility for category colors
const categoryColors = {
  needs: "bg-green-600 text-white",
  savings: "bg-blue-600 text-white",
  wants: "bg-orange-500 text-white",
}
```

---

## 6. Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| **Mobile** | < 640px | Primary focus |
| **Tablet** | 640px - 1024px | Adjust layouts |
| **Desktop** | >= 1024px | Full experience |

---

## 7. Accessibility Requirements

- Minimum color contrast ratio: 4.5:1 for text
- Focus indicators on all interactive elements
- Keyboard navigation support
- Screen reader friendly (proper ARIA labels)
- No reliance on color alone (use icons + text)

---

## 8. File Checklist

### Must Create (shadcn/ui Setup)

- [ ] `package.json` - Dependencies with shadcn/ui
- [ ] `tailwind.config.js` - Tailwind config
- [ ] `tsconfig.json` - TypeScript config
- [ ] `vite.config.ts` - Vite config
- [ ] `index.html` - Entry HTML
- [ ] `src/main.tsx` - React entry
- [ ] `src/App.tsx` - Main app
- [ ] `src/lib/utils.ts` - cn() utility for shadcn
- [ ] `src/types/index.ts` - TypeScript types
- [ ] `src/constants/rules.ts` - Budget rules
- [ ] `src/utils/formatters.ts` - Currency formatting (IDR)
- [ ] `src/utils/calculators.ts` - Calculation logic
- [ ] `src/hooks/useCalculator.ts` - Calculator logic with Effect.solutions
- [ ] `src/components/Calculator.tsx` - Main component
- [ ] `src/components/IncomeInput.tsx` - Income form (shadcn Input)
- [ ] `src/components/RuleSelector.tsx` - Rule picker (shadcn RadioGroup)
- [ ] `src/components/ResultsDisplay.tsx` - Results view
- [ ] `src/components/SavingsBreakdown.tsx` - Savings sub-categories
- [ ] `src/components/InvestmentProfile.tsx` - Risk selector (shadcn Tabs)
- [ ] `components.json` - shadcn config

---

## 9. User Stories

Each task in the development process maps to these user stories:

### 9.1 Project Setup (money-decision-5ri)

**User Story:**
> As a developer, I want a properly configured React + Vite + TypeScript project so that I can start building the application with modern tooling.

**Acceptance Criteria:**
- [ ] `npm install` completes without errors
- `npm run dev` starts development server
- TypeScript compilation works without errors
- Vite builds production bundle successfully

### 9.2 CSS Variables & Design System (money-decision-vxk)

**User Story:**
> As a user, I want a visually consistent application with colors that convey trust and financial responsibility so that I feel confident using the app.

**Acceptance Criteria:**
- [ ] Primary green used for main actions and positive states
- [ ] Secondary blue used for information and trust elements
- [ ] Accent orange used for CTAs and highlights
- [ ] Category colors (green/blue/orange) distinguish needs/savings/wants
- [ ] All colors meet WCAG 2.1 AA contrast requirements

### 9.3 Utility Functions (money-decision-lcn)

**User Story:**
> As a user, I want to see my amounts formatted correctly in Indonesian Rupiah (IDR) so that I can easily understand the calculated values.

**Acceptance Criteria:**
- [ ] Input income shows formatted as "Rp 10.000.000"
- [ ] Calculated results show with proper thousand separators
- [ ] Budget rules (50/30/20, 60/30/10, etc.) calculate correctly
- [ ] Emergency fund calculations work based on monthly expenses

### 9.4 Calculator Hook (money-decision-g7g)

**User Story:**
> As a user, I want the calculator to update in real-time as I enter my income and select budget rules so that I can see the impact of my choices immediately.

**Acceptance Criteria:**
- [ ] Entering income number updates calculation instantly
- [ ] Selecting a different budget rule updates all results
- [ ] Reset button clears all inputs and results
- [ ] Calculator works with all 5 budget rules

### 9.5 Income Input Component (money-decision-511)

**User Story:**
> As a user, I want to easily enter my monthly income with a clear input field so that I can start calculating my budget allocation.

**Acceptance Criteria:**
- [ ] Input field accepts numeric values only
- [ ] Placeholder shows example format (e.g., "10.000.000")
- [ ] Validation shows error for negative numbers
- [ ] Input is keyboard accessible

### 9.6 Rule Selector Component (money-decision-511)

**User Story:**
> As a user, I want to easily understand and select from different budget rules so that I can choose the one that fits my lifestyle.

**Acceptance Criteria:**
- [ ] All 5 budget rules displayed as selectable cards
- [ ] Each rule shows name and brief description
- [ ] Selected rule has clear visual indicator
- [ ] Rule descriptions explain each allocation clearly

### 9.7 Results Display Component (money-decision-3ld)

**User Story:**
> As a user, I want to clearly see my money allocation broken down by category with appropriate colors so that I can quickly understand how to distribute my income.

**Acceptance Criteria:**
- [ ] Needs category shown in green with amount and percentage
- [ ] Savings category shown in blue with amount and percentage
- [ ] Wants/Investment category shown in orange with amount and percentage
- [ ] Results update in real-time as inputs change
- [ ] Emergency fund target displayed in savings section

### 9.8 Savings Breakdown Recommendations (NEW)

**User Story:**
> As a user, when I have a savings allocation (e.g., 30%), I want to see recommendations on how to split it between emergency fund, short-term goals, and long-term goals so that I can plan my savings strategically.

**Acceptance Criteria:**
- [ ] Savings amount automatically divided into:
  - **Emergency Fund**: 50% of savings (safety net)
  - **Short-term Goals**: 30% of savings (vacation, gadgets, courses - within 1 year)
  - **Long-term Goals**: 20% of savings (education, vehicle, wedding - 1-5 years)
- [ ] Each sub-category shows the calculated amount
- [ ] Emergency fund target shows months of expenses (e.g., "6 months = Rp 18,000,000")
- [ ] Recommendations are based on financial best practices from PRD

**Example Display:**
```
SAVINGS (30%): Rp 3,000,000

├── Emergency Fund (50%): Rp 1,500,000
│   └── Target: 6 months = Rp 18,000,000
│   └── Where: High-Yield Savings Account
│
├── Short-term Goals (30%): Rp 900,000
│   └── Examples: Vacation, gadgets, courses
│   └── Timeline: Within 1 year
│
└── Long-term Goals (20%): Rp 600,000
    └── Examples: Education, vehicle, wedding
    └── Timeline: 1-5 years
```

### 9.9 Investment Recommendations by Risk Profile (NEW)

**User Story:**
> As a user, when I have an investment allocation (e.g., 10%), I want to choose my risk profile (aggressive or passive) and see specific investment recommendations so that I can make informed investment decisions.

**Acceptance Criteria:**
- [ ] User can toggle between "Aggressive" and "Passive" investment profiles
- [ ] **Passive Profile** recommendations:
  - Low risk tolerance
  - Focus: Stability and steady returns
  - Examples: Reksadana Pasar Uang, Reksadana Pendapatan Tetap, Bonds
  - Expected return: 4-8% annually
- [ ] **Aggressive Profile** recommendations:
  - High risk tolerance
  - Focus: Maximum growth potential
  - Examples: Reksadana Saham, Crypto (BTC/ETH), Individual Stocks
  - Expected return: 10-50% annually (higher volatility)
- [ ] Each recommendation shows:
  - Investment type name
  - Percentage of investment allocation
  - Amount in IDR
  - Brief description of risk/return profile
- [ ] Warning displayed for high-risk investments (e.g., crypto)

**Example Display:**
```
INVESTMENT (10%): Rp 1,000,000

Risk Profile: [Aggressive] [Passive]

AGGRESSIVE SELECTED:
├── Reksadana Saham (50%): Rp 500,000
│   └── High risk, high return potential
│
├── Crypto - BTC/ETH (30%): Rp 300,000
│   └── Very high risk, very high return potential
│   └── ⚠️ Only invest what you can afford to lose
│
└── Reksadana Campuran (20%): Rp 200,000
    └── Medium risk, balanced growth
```

### 9.11 Reusable UI Components (money-decision-mv6)

**User Story:**
> As a user, I want a consistent and polished UI with smooth interactions so that the application feels professional and trustworthy.

**Acceptance Criteria:**
- [ ] Buttons have consistent styling (primary, secondary, outline, ghost)
- [ ] Inputs show clear focus and error states
- [ ] Cards provide visual separation for content areas
- [ ] All interactive elements have hover and focus states
- [ ] Responsive layout works on mobile and desktop

### 9.12 App Integration (money-decision-yy6)

**User Story:**
> As a user, I want a complete, working Money Allocation Calculator that I can use on any device so that I can plan my finances wherever I am.

**Acceptance Criteria:**
- [ ] All components work together seamlessly
- [ ] Application loads in under 2 seconds
- [ ] Mobile responsive layout works on all screen sizes
- [ ] Keyboard navigation works throughout the app
- [ ] Screen readers can announce all content correctly

---

## 10. Task Summary

| ID | Task | Priority | User Story |
|----|------|----------|------------|
| money-decision-5ri | Setup React Vite TypeScript project | P1 | 9.1 |
| money-decision-vxk | Create CSS variables and design system | P1 | 9.2 |
| money-decision-lcn | Create utility functions | P1 | 9.3 |
| money-decision-g7g | Build Calculator component | P0 | 9.4 |
| money-decision-511 | Build IncomeInput and RuleSelector | P1 | 9.5, 9.6 |
| money-decision-3ld | Build ResultsDisplay | P1 | 9.7 |
| money-decision-new1 | Add Savings Breakdown Recommendations | P1 | 9.8 |
| money-decision-new2 | Add Investment Risk Profile Selector | P1 | 9.9 |
| money-decision-mv6 | Create reusable UI components | P2 | 9.11 |
| money-decision-yy6 | Finalize App integration | P1 | 9.12 |

---

## 8. Detailed Expense Breakdown Wizard

Based on PRD Section 5 - A 5-step guided wizard for expense categorization.

### 8.1 Wizard Flow

```
+---------------------------------------------------------+
|  STEP 1: Housing & Utilities                            |
|  -> Rent/Mortgage, Electricity, Water, Gas, Internet    |
+---------------------------------------------------------+
|  STEP 2: Daily Essentials                               |
|  -> Food, Groceries, Transportation, Healthcare         |
+---------------------------------------------------------+
|  STEP 3: Personal & Lifestyle                           |
|  -> Clothing, Entertainment, Subscriptions, Dining      |
+---------------------------------------------------------+
|  STEP 4: Insurance & Protection                         |
|  -> Health, Vehicle, Personal Insurance                 |
+---------------------------------------------------------+
|  STEP 5: Review & Adjust                                |
|  -> Summary view with edit capability                   |
+---------------------------------------------------------+
```

### 8.2 Component Structure

```typescript
// New components to create
ExpenseBreakdownWizard.tsx    // Main wizard container
StepHousing.tsx               // Step 1: Housing & Utilities
StepEssentials.tsx            // Step 2: Daily Essentials
StepLifestyle.tsx             // Step 3: Personal & Lifestyle
StepInsurance.tsx             // Step 4: Insurance & Protection
StepReview.tsx                // Step 5: Summary review
```

### 8.3 State Management

```typescript
interface ExpenseBreakdown {
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
```

### 8.4 Wizard Features

- **Progress indicator** - Show current step (1/5)
- **Back/Next navigation** - Button controls
- **Skip option** - "I'll add this later" for optional steps
- **Inline validation** - Highlight missing required fields
- **Summary calculation** - Running total display
- **Persisted state** - Save progress in localStorage

---

## 9. Three Investment Profiles

Based on PRD Section 7 - Expanded from 2 to 3 profiles for better risk matching.

### 9.1 Profile Definitions

| Profile | Risk Level | Target Return | Best For |
|---------|------------|---------------|----------|
| **Conservative** | Low | 4-6% annually | Stability priority, near retirement, risk-averse |
| **Moderate** | Medium | 6-10% annually | Balanced growth, 5-10 year horizon |
| **Aggressive** | High | 10-15% annually | Long-term growth, high risk tolerance |

### 9.2 Investment Allocation by Profile

```typescript
// src/constants/investment-profiles.ts

export const INVESTMENT_PROFILES = {
  conservative: {
    name: 'Conservative',
    description: 'Focus on capital preservation with steady, low-risk returns',
    riskLevel: 'low',
    allocations: [
      { type: 'Reksadana Pasar Uang', percentage: 40, description: 'Low risk, liquid' },
      { type: 'Reksadana Pendapatan Tetap', percentage: 35, description: 'Bond-focused, stable returns' },
      { type: 'Deposito', percentage: 25, description: 'Fixed deposit, guaranteed returns' },
    ],
    expectedReturn: '4-6% annually',
    warning: null,
  },
  moderate: {
    name: 'Moderate',
    description: 'Balanced approach with mix of stability and growth',
    riskLevel: 'medium',
    allocations: [
      { type: 'Reksadana Campuran', percentage: 40, description: 'Mixed stocks and bonds' },
      { type: 'Reksadana Pendapatan Tetap', percentage: 30, description: 'Bond-focused, stable returns' },
      { type: 'Reksadana Saham', percentage: 30, description: 'Stock-focused, growth potential' },
    ],
    expectedReturn: '6-10% annually',
    warning: null,
  },
  aggressive: {
    name: 'Aggressive',
    description: 'Maximum growth potential with higher volatility',
    riskLevel: 'high',
    allocations: [
      { type: 'Reksadana Saham', percentage: 50, description: 'High growth, high volatility' },
      { type: 'Crypto - BTC/ETH', percentage: 25, description: 'Very high risk, very high return' },
      { type: 'Reksadana Campuran', percentage: 25, description: 'Balanced growth' },
    ],
    expectedReturn: '10-15% annually',
    warning: 'High-risk investments. Only invest what you can afford to lose.',
  },
};
```

### 9.3 UI Component Update

```typescript
// InvestmentProfile.tsx - Update to 3-button toggle

interface InvestmentProfileProps {
  selectedProfile: 'conservative' | 'moderate' | 'aggressive';
  onProfileChange: (profile: RiskProfile) => void;
  breakdown: InvestmentBreakdown;
}

// Replace RadioGroup/Tabs with segmented control or toggle group
<ToggleGroup type="single" value={selectedProfile} onValueChange={(v) => v && onProfileChange(v as RiskProfile)}>
  <ToggleGroupItem value="conservative">Conservative</ToggleGroupItem>
  <ToggleGroupItem value="moderate">Moderate</ToggleGroupItem>
  <ToggleGroupItem value="aggressive">Aggressive</ToggleGroupItem>
</ToggleGroup>
```

---

## 10. Debt Assessment Section

Based on PRD Section 6 - High-interest debt warning and payoff calculator.

### 10.1 Credit Card Debt Warning

```
+-----------------------------------------------------------+
|  HIGH-INTEREST DEBT ALERT                                 |
|                                                           |
|  Credit Card Debt: ~20.74% APR (WalletHub 2024)           |
|                                                           |
|  Priority: Pay off high-interest debt BEFORE investing    |
|                                                           |
|  Example: Rp 10,000,000 debt at 20.74% = Rp 2,074,000/year|
|  in interest charges                                      |
+-----------------------------------------------------------+
```

### 10.2 Debt Assessment Component

```typescript
// DebtAssessment.tsx - New component

interface DebtAssessmentProps {
  hasHighInterestDebt: boolean;
  debtAmount: number;
  debtType: 'credit-card' | 'personal-loan' | 'other';
}

function DebtAssessment({ hasHighInterestDebt, debtAmount }: DebtAssessmentProps) {
  if (!hasHighInterestDebt) return null;

  const annualInterest = debtAmount * 0.2074;

  return (
    <Card className="border-orange-500 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-orange-700">High-Interest Debt Alert</CardTitle>
        <CardDescription>
          Consider paying off high-interest debt before aggressive investing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Your potential interest cost:</p>
          <p className="text-2xl font-bold text-orange-700">
            {formatCurrency(annualInterest)}/year
          </p>
          <p className="text-sm text-muted-foreground">
            At ~20.74% average credit card APR (WalletHub 2024)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 10.3 Payoff Recommendation

- **Avalanche Method**: Pay highest interest first
- **Snowball Method**: Pay smallest balance first (psychological wins)
- **Recommendation**: Use savings allocation to pay down debt first if APR > 10%

---

## 11. Educational Content & Citations

Based on PRD Section 8 - Inline expandable sections with verifiable sources.

### 11.1 Citation System

```typescript
// src/components/EducationalContent.tsx

interface Citation {
  id: string;
  source: string;
  url: string;
  quote: string;
}

const CITATIONS: Record<string, Citation> = {
  wallet2024: {
    id: 'wallet2024',
    source: 'WalletHub',
    url: 'https://wallethub.com/edu/cc/credit-card-statistics/10551',
    quote: 'Average credit card APR is 20.74% as of 2024',
  },
  nerdwealth: {
    id: 'nerdwealth',
    source: 'NerdWallet',
    url: 'https://www.nerdwallet.com/article/banking/50-30-20-rule',
    quote: 'The 50/30/20 rule is a proven budgeting framework',
  },
  time2024: {
    id: 'time2024',
    source: 'TIME',
    url: 'https://time.com/6881304/budgeting-tips-50-30-20-rule',
    quote: 'Budgeting methods help allocate income effectively',
  },
  ramit: {
    id: 'ramit',
    source: 'Ramit Sethi - Conscious Spending Plan',
    url: 'https://www.iwillteachyoutoberich.com/blog/conscious-spending-plan/',
    quote: 'Conscious spending plan allows for guilt-free spending within limits',
  },
};
```

### 11.2 Educational Expandable Component

```typescript
// EducationalExpander.tsx - New component

interface EducationalExpanderProps {
  title: string;
  children: React.ReactNode;
  citationId: keyof typeof CITATIONS;
}

function EducationalExpander({ title, children, citationId }: EducationalExpanderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const citation = CITATIONS[citationId];

  return (
    <div className="border rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 text-left"
      >
        <span className="font-medium">{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 pt-0 bg-muted/30">
          <p className="mb-3">{children}</p>
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            Source: {citation.source}
          </a>
        </div>
      )}
    </div>
  );
}
```

### 11.3 Usage Examples

```typescript
// In Calculator.tsx or other components

<EducationalExpander
  title="What is the 50/30/20 rule?"
  citationId="nerdwealth"
>
  The 50/30/20 rule suggests allocating 50% of income to needs,
  30% to wants, and 20% to savings and debt repayment.
</EducationalExpander>

<EducationalExpander
  title="Why pay off credit card debt first?"
  citationId="wallet2024"
>
  With average credit card APR at 20.74%, paying $1,000 in debt
  saves you ~$207/year in interest - a guaranteed 20.74% return.
</EducationalExpander>
```

### 11.4 Citations Table (Reference)

| ID | Source | Key Point |
|----|--------|-----------|
| wallet2024 | WalletHub (2024) | Credit card APR: 20.74% |
| nerdwealth | NerdWallet | 50/30/20 rule explanation |
| time2024 | TIME (2024) | Budgeting best practices |
| ramit | Ramit Sethi | Conscious Spending Plan |

---

## 14. Task Summary

| ID | Task | Priority | User Story | Status |
|----|------|----------|------------|--------|
| money-decision-5ri | Setup React Vite TypeScript project | P1 | 9.1 | Complete |
| money-decision-vxk | Create CSS variables and design system | P1 | 9.2 | Complete |
| money-decision-lcn | Create utility functions | P1 | 9.3 | Complete |
| money-decision-g7g | Build Calculator component | P0 | 9.4 | Complete |
| money-decision-511 | Build IncomeInput and RuleSelector | P1 | 9.5, 9.6 | Complete |
| money-decision-3ld | Build ResultsDisplay | P1 | 9.7 | Complete |
| money-decision-new1 | Add Savings Breakdown Recommendations | P1 | 9.8 | Complete |
| money-decision-new2 | Add Investment Risk Profile Selector | P1 | 9.9 | Complete |
| money-decision-new3 | Add Detailed Expense Breakdown Wizard | P1 | NEW | Pending |
| money-decision-new4 | Add 3 Investment Profiles (Conservative/Moderate/Aggressive) | P1 | NEW | Pending |
| money-decision-new5 | Add Debt Assessment Section | P2 | NEW | Pending |
| money-decision-new6 | Add Educational Content with Citations | P2 | NEW | Pending |
| money-decision-mv6 | Create reusable UI components | P2 | 9.11 | Complete |
| money-decision-yy6 | Finalize App integration | P1 | 9.12 | Complete |

---

## 15. Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.3 | 2026-01-15 | - Added Section 8: Detailed Expense Breakdown Wizard<br>- Added Section 9: Three Investment Profiles (Conservative/Moderate/Aggressive)<br>- Added Section 10: Debt Assessment Section<br>- Added Section 11: Educational Content & Citations<br>- Updated Task Summary with 4 new features<br>- Updated investment profiles from 2 to 3 |
| 1.2 | 2026-01-15 | - Changed state management from React useEffect to Effect.solutions<br>- Added shadcn/ui + Tailwind CSS for components<br>- Added User Story 9.8: Savings Breakdown Recommendations<br>- Added User Story 9.9: Investment Risk Profile Selector<br>- Updated project structure for shadcn components<br>- Updated CSS variables to shadcn/ui pattern |
| 1.1 | 2026-01-15 | - Added user stories for each task |
| 1.0 | 2026-01-15 | - Initial draft |

---

## 11. References

- **PRD:** `/docs/prd-money-decision.md`
- **Color inspiration:** Tailwind CSS color palette
- **Design principles:** PRD Section 8.1
- **Budget rules:** PRD Section 2

---

*This RFC serves as the technical foundation for building the Money Allocation Calculator.*
