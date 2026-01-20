/**
 * Daily Life Expense Categories for Indonesia
 * Based on research from docs/daily-life.md
 * Recommended allocation percentages for "Needs" portion of budget
 */

export interface DailyLifeSubcategory {
  id: string;
  name: string;
  description: string;
  defaultPercentage: number; // Default % of daily life budget
  minPercentage: number; // Minimum recommended
  maxPercentage: number; // Maximum recommended
  icon?: string;
}

export const DAILY_LIFE_SUBCATEGORIES: DailyLifeSubcategory[] = [
  {
    id: 'housing',
    name: 'Housing',
    description: 'Rent, mortgage, house/room maintenance',
    defaultPercentage: 35,
    minPercentage: 30,
    maxPercentage: 40,
    icon: 'home',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    description: 'Electricity, water, gas, internet, phone',
    defaultPercentage: 8,
    minPercentage: 5,
    maxPercentage: 10,
    icon: 'zap',
  },
  {
    id: 'transportation',
    name: 'Transportation',
    description: 'Fuel, public transport, vehicle maintenance',
    defaultPercentage: 10,
    minPercentage: 8,
    maxPercentage: 12,
    icon: 'car',
  },
  {
    id: 'food',
    name: 'Food & Groceries',
    description: 'Rice, meat, vegetables, fruits, dairy, staples',
    defaultPercentage: 20,
    minPercentage: 15,
    maxPercentage: 25,
    icon: 'utensils',
  },
  {
    id: 'dining-out',
    name: 'Dining Out',
    description: 'Meals away from home, coffee, snacks',
    defaultPercentage: 5,
    minPercentage: 3,
    maxPercentage: 8,
    icon: 'coffee',
  },
  {
    id: 'religious',
    name: 'Religious',
    description: 'Zakat, infak, donations, mosque contributions',
    defaultPercentage: 2.5,
    minPercentage: 2.5,
    maxPercentage: 5,
    icon: 'prayer',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Health insurance, medications, doctor visits',
    defaultPercentage: 4,
    minPercentage: 3,
    maxPercentage: 7,
    icon: 'heart-pulse',
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    description: 'Toiletries, haircut, laundry, skincare',
    defaultPercentage: 3,
    minPercentage: 2,
    maxPercentage: 5,
    icon: 'user',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Streaming, hobbies, gym, cinema',
    defaultPercentage: 5,
    minPercentage: 3,
    maxPercentage: 7,
    icon: 'gamepad-2',
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Monthly clothing allowance, footwear',
    defaultPercentage: 3,
    minPercentage: 2,
    maxPercentage: 4,
    icon: 'shirt',
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Courses, books, professional development',
    defaultPercentage: 2,
    minPercentage: 1,
    maxPercentage: 5,
    icon: 'graduation-cap',
  },
  {
    id: 'social',
    name: 'Social',
    description: 'Social activities, gifts, events',
    defaultPercentage: 2.5,
    minPercentage: 2,
    maxPercentage: 5,
    icon: 'users',
  },
];

// Verify percentages add up to 100%
const totalDefaultPercentage = DAILY_LIFE_SUBCATEGORIES.reduce(
  (sum, cat) => sum + cat.defaultPercentage,
  0
);

if (Math.abs(totalDefaultPercentage - 100) > 0.1) {
  console.warn(
    `Daily Life subcategories default percentages add up to ${totalDefaultPercentage}%, not 100%`
  );
}

/**
 * Calculate subcategory amount based on daily life budget
 */
export function calculateSubcategoryAmount(
  dailyLifeBudget: number,
  percentage: number
): number {
  return Math.round(dailyLifeBudget * (percentage / 100));
}

/**
 * Calculate all subcategory amounts for a daily life budget
 */
export function calculateDailyLifeBreakdown(
  dailyLifeBudget: number,
  customPercentages?: Record<string, number>
): Array<{ category: DailyLifeSubcategory; amount: number }> {
  return DAILY_LIFE_SUBCATEGORIES.map((category) => {
    const percentage =
      customPercentages?.[category.id] ?? category.defaultPercentage;
    const amount = calculateSubcategoryAmount(dailyLifeBudget, percentage);
    return { category, amount };
  });
}
