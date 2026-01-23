export interface InvestmentScenario {
  id: string;
  name: string;
  description: string;
  monthlyAmount: number;
  returnRate: number;
  years: number;
  result: {
    totalInvested: number;
    interestEarned: number;
    finalValue: number;
  };
}

export interface AgeMilestone {
  age: number;
  years: number;
  value: number;
}

export interface LifePlanningScenario {
  id: string;
  name: string;
  description: string;
  startAge: number;
  monthlyAmount: number;
  returnRate: number;
  milestones: AgeMilestone[];
}

export interface RetirementGoalScenario {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  targetAge: number;
  returnRate: number;
  options: Array<{
    startAge: number;
    monthlyNeeded: number;
    years: number;
    description: string;
  }>;
}

// Quick scenario examples for compound interest calculator
export const quickScenarios: InvestmentScenario[] = [
  {
    id: 'entry-level-starter',
    name: 'Entry-level Starter',
    description: 'Perfect for fresh graduates just starting their career',
    monthlyAmount: 100000,
    returnRate: 7,
    years: 5,
    result: {
      totalInvested: 6000000,
      interestEarned: 1200000,
      finalValue: 7200000
    }
  },
  {
    id: 'moderate-saver',
    name: 'Moderate Saver',
    description: 'Balanced approach for mid-career professionals',
    monthlyAmount: 500000,
    returnRate: 10,
    years: 10,
    result: {
      totalInvested: 60000000,
      interestEarned: 43000000,
      finalValue: 103000000
    }
  },
  {
    id: 'aggressive-investor',
    name: 'Aggressive Investor',
    description: 'Maximum growth for high earners with long horizon',
    monthlyAmount: 1000000,
    returnRate: 12,
    years: 15,
    result: {
      totalInvested: 180000000,
      interestEarned: 321000000,
      finalValue: 501000000
    }
  },
  {
    id: 'conservative-builder',
    name: 'Conservative Builder',
    description: 'Steady, low-risk wealth building over time',
    monthlyAmount: 300000,
    returnRate: 5,
    years: 20,
    result: {
      totalInvested: 72000000,
      interestEarned: 51000000,
      finalValue: 123000000
    }
  }
];

// Life planning scenarios with age milestones
export const lifePlanningScenarios: LifePlanningScenario[] = [
  {
    id: 'fresh-graduate',
    name: 'Fresh Graduate Plan',
    description: 'Start investing at 22 and see your wealth grow by retirement',
    startAge: 22,
    monthlyAmount: 200000,
    returnRate: 10,
    milestones: [
      { age: 30, years: 8, value: 29000000 },
      { age: 40, years: 18, value: 121000000 },
      { age: 55, years: 33, value: 609000000 }
    ]
  },
  {
    id: 'mid-career-boost',
    name: 'Mid-Career Boost',
    description: 'Accelerate savings in your 30s when income is higher',
    startAge: 35,
    monthlyAmount: 2000000,
    returnRate: 10,
    milestones: [
      { age: 45, years: 10, value: 413000000 },
      { age: 55, years: 20, value: 1520000000 }
    ]
  },
  {
    id: 'late-starter',
    name: 'Late Starter Recovery',
    description: 'Start at 40 and still build significant wealth',
    startAge: 40,
    monthlyAmount: 1500000,
    returnRate: 10,
    milestones: [
      { age: 50, years: 10, value: 310000000 },
      { age: 55, years: 15, value: 625000000 }
    ]
  }
];

// Retirement goal-based scenarios (reverse calculation)
export const retirementGoalScenarios: RetirementGoalScenario[] = [
  {
    id: 'retirement-1b',
    name: 'Retirement Goal: Rp 1 Billion by 55',
    description: 'How much you need to save monthly to reach Rp 1 billion',
    targetAmount: 1000000000,
    targetAge: 55,
    returnRate: 10,
    options: [
      {
        startAge: 25,
        monthlyNeeded: 417000,
        years: 30,
        description: 'Start early, save less per month'
      },
      {
        startAge: 35,
        monthlyNeeded: 1330000,
        years: 20,
        description: 'Mid-career start requires more'
      },
      {
        startAge: 45,
        monthlyNeeded: 5830000,
        years: 10,
        description: 'Late start needs aggressive saving'
      }
    ]
  },
  {
    id: 'retirement-500m',
    name: 'Modest Retirement: Rp 500 Million by 55',
    description: 'More achievable goal for modest retirement',
    targetAmount: 500000000,
    targetAge: 55,
    returnRate: 10,
    options: [
      {
        startAge: 25,
        monthlyNeeded: 209000,
        years: 30,
        description: 'Just Rp 209K/month for 30 years'
      },
      {
        startAge: 35,
        monthlyNeeded: 665000,
        years: 20,
        description: 'Still manageable at mid-career'
      },
      {
        startAge: 45,
        monthlyNeeded: 2915000,
        years: 10,
        description: 'Challenging but possible'
      }
    ]
  },
  {
    id: 'retirement-2b',
    name: 'Comfortable Retirement: Rp 2 Billion by 55',
    description: 'For a more comfortable retirement lifestyle',
    targetAmount: 2000000000,
    targetAge: 55,
    returnRate: 10,
    options: [
      {
        startAge: 25,
        monthlyNeeded: 834000,
        years: 30,
        description: 'Under Rp 1M/month achieves this'
      },
      {
        startAge: 35,
        monthlyNeeded: 2660000,
        years: 20,
        description: 'Requires strong income'
      },
      {
        startAge: 45,
        monthlyNeeded: 11660000,
        years: 10,
        description: 'Very difficult to achieve'
      }
    ]
  }
];

// Comparison scenarios for different investment products
export interface ProductComparisonScenario {
  monthlyAmount: number;
  years: number;
  products: Array<{
    name: string;
    returnRate: number;
    finalValue: number;
    gain: number;
  }>;
}

export const productComparisonScenarios: ProductComparisonScenario[] = [
  {
    monthlyAmount: 1000000,
    years: 10,
    products: [
      {
        name: 'Pasar Uang (5%)',
        returnRate: 5,
        finalValue: 155000000,
        gain: 35000000
      },
      {
        name: 'Pendapatan Tetap (7%)',
        returnRate: 7,
        finalValue: 174000000,
        gain: 54000000
      },
      {
        name: 'Campuran (10%)',
        returnRate: 10,
        finalValue: 206000000,
        gain: 86000000
      },
      {
        name: 'Saham (12%)',
        returnRate: 12,
        finalValue: 230000000,
        gain: 110000000
      }
    ]
  }
];

// Helper function to get scenario by ID
export const getScenarioById = (id: string): InvestmentScenario | undefined => {
  return quickScenarios.find(s => s.id === id);
};

export const getLifePlanningById = (id: string): LifePlanningScenario | undefined => {
  return lifePlanningScenarios.find(s => s.id === id);
};

export const getRetirementGoalById = (id: string): RetirementGoalScenario | undefined => {
  return retirementGoalScenarios.find(s => s.id === id);
};

// Get scenario by income level
export const getScenarioForIncome = (monthlyIncome: number): InvestmentScenario => {
  if (monthlyIncome < 4000000) {
    return quickScenarios[0]; // Entry-level starter
  } else if (monthlyIncome < 8000000) {
    return quickScenarios[1]; // Moderate saver
  } else if (monthlyIncome < 15000000) {
    return quickScenarios[2]; // Aggressive investor
  } else {
    return quickScenarios[2]; // Aggressive investor (high earner)
  }
};
