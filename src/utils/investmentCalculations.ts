export interface CompoundInterestResult {
  totalContribution: number;
  interestEarned: number;
  finalValue: number;
  yearByYear: Array<{
    year: number;
    contributed: number;
    balance: number;
    interestEarned: number;
  }>;
}

export function calculateCompoundInterest(
  initialInvestment: number,
  monthlyContribution: number,
  annualReturnRate: number,
  years: number
): CompoundInterestResult {
  const monthlyRate = annualReturnRate / 100 / 12;
  const months = years * 12;
  const yearByYear: CompoundInterestResult['yearByYear'] = [];
  
  let balance = initialInvestment;
  let totalContributed = initialInvestment;
  
  // Calculate month by month
  for (let month = 1; month <= months; month++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    totalContributed += monthlyContribution;
    
    // Record year-end values
    if (month % 12 === 0) {
      yearByYear.push({
        year: month / 12,
        contributed: totalContributed,
        balance: Math.round(balance),
        interestEarned: Math.round(balance - totalContributed)
      });
    }
  }
  
  const finalValue = Math.round(balance);
  const interestEarned = finalValue - totalContributed;
  
  return {
    totalContribution: totalContributed,
    interestEarned,
    finalValue,
    yearByYear
  };
}

export interface GoalBasedResult {
  monthlyNeeded: number;
  totalInvested: number;
  interestEarned: number;
}

export function calculateMonthlyForGoal(
  targetAmount: number,
  annualReturnRate: number,
  years: number,
  initialInvestment: number = 0
): GoalBasedResult {
  const monthlyRate = annualReturnRate / 100 / 12;
  const months = years * 12;
  
  // Future value of initial investment
  const futureValueOfInitial = initialInvestment * Math.pow(1 + monthlyRate, months);
  
  // Remaining amount needed from monthly contributions
  const remainingAmount = targetAmount - futureValueOfInitial;
  
  // Calculate monthly payment needed using future value of annuity formula
  // FV = PMT * [(1 + r)^n - 1] / r
  // PMT = FV * r / [(1 + r)^n - 1]
  const numerator = remainingAmount * monthlyRate;
  const denominator = Math.pow(1 + monthlyRate, months) - 1;
  const monthlyNeeded = Math.round(numerator / denominator);
  
  const totalInvested = initialInvestment + (monthlyNeeded * months);
  const interestEarned = targetAmount - totalInvested;
  
  return {
    monthlyNeeded: Math.max(0, monthlyNeeded),
    totalInvested,
    interestEarned
  };
}

export function formatLargeNumber(num: number): string {
  if (num >= 1000000000) {
    return `Rp ${(num / 1000000000).toFixed(2)} miliar`;
  } else if (num >= 1000000) {
    return `Rp ${Math.round(num / 1000000)} juta`;
  } else {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  }
}
