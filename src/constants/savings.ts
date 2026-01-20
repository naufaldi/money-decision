/**
 * Savings Categories for Indonesia
 * Based on research from docs/prd-money-decision.md (Section 3.1-3.3)
 * Recommended allocation percentages for "Savings" portion of budget
 */

export interface SavingsSubcategory {
  id: string;
  name: string;
  description: string;
  defaultPercentage: number;
  minPercentage: number;
  maxPercentage: number;
  icon?: string;
  whereToKeep?: string;
}

export const SAVINGS_SUBCATEGORIES: SavingsSubcategory[] = [
  {
    id: 'emergency-fund',
    name: 'Emergency Fund',
    description: '3-6 months of essential expenses for unexpected events',
    defaultPercentage: 50,
    minPercentage: 40,
    maxPercentage: 60,
    icon: 'shield',
    whereToKeep: 'High-Yield Savings Account (3-5% APY) - Most liquid and safe',
  },
  {
    id: 'short-term-goals',
    name: 'Short-term Goals',
    description: 'Vacation, gadgets, courses (within 1 year)',
    defaultPercentage: 30,
    minPercentage: 20,
    maxPercentage: 40,
    icon: 'target',
    whereToKeep: 'Money Market Account or Digital Wallet (OVO, DANA) - Easy access',
  },
  {
    id: 'medium-term-goals',
    name: 'Medium-term Goals',
    description: 'Education, vehicle, wedding (1-5 years)',
    defaultPercentage: 20,
    minPercentage: 10,
    maxPercentage: 30,
    icon: 'graduation-cap',
    whereToKeep: 'Certificates of Deposit (CD) or Treasury Bonds (4-5% return)',
  },
];

// Verify percentages add up to 100%
const totalDefaultPercentage = SAVINGS_SUBCATEGORIES.reduce(
  (sum, cat) => sum + cat.defaultPercentage,
  0
);

if (Math.abs(totalDefaultPercentage - 100) > 0.1) {
  console.warn(
    `Savings subcategories default percentages add up to ${totalDefaultPercentage}%, not 100%`
  );
}

/**
 * Calculate subcategory amount based on savings budget
 */
export function calculateSubcategoryAmount(
  savingsBudget: number,
  percentage: number
): number {
  return Math.round(savingsBudget * (percentage / 100));
}

/**
 * Calculate all subcategory amounts for a savings budget
 */
export function calculateSavingsBreakdown(
  savingsBudget: number,
  customPercentages?: Record<string, number>
): Array<{ category: SavingsSubcategory; amount: number }> {
  return SAVINGS_SUBCATEGORIES.map((category) => {
    const percentage =
      customPercentages?.[category.id] ?? category.defaultPercentage;
    const amount = calculateSubcategoryAmount(savingsBudget, percentage);
    return { category, amount };
  });
}
