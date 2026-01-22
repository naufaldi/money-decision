import { PinjolCalculationResult } from '@/types/guidance';

/**
 * Calculate pinjol debt payoff scenarios
 */
export function calculatePinjolPayoff(params: {
  principal: number;
  monthlyInterestRate: number;
  monthlyPayment: number;
}): PinjolCalculationResult {
  const { principal, monthlyInterestRate, monthlyPayment } = params;

  let balance = principal;
  let totalInterest = 0;
  let months = 0;
  const monthlyRate = monthlyInterestRate / 100;

  while (balance > 0 && months < 600) {
    const interest = balance * monthlyRate;
    totalInterest += interest;
    const principalPayment = Math.max(0, monthlyPayment - interest);
    balance -= principalPayment;
    months++;

    if (balance < 0) balance = 0;
  }

  const totalPaid = principal + totalInterest;

  return {
    totalDebt: principal,
    totalInterest,
    monthlyPayment,
    monthsToPayoff: months,
    totalPaid,
    interestSavedWithConsolidation: 0,
  };
}

/**
 * Compare pinjol with formal bank loan consolidation
 */
export function compareConsolidationOptions(params: {
  pinjolPrincipal: number;
  pinjolMonthlyRate: number;
  pinjolMonthlyPayment: number;
  bankLoanPrincipal: number;
  bankMonthlyRate: number;
  bankMonthlyPayment: number;
}): {
  pinjol: PinjolCalculationResult;
  bank: PinjolCalculationResult;
  savings: number;
  monthsSaved: number;
} {
  const pinjol = calculatePinjolPayoff({
    principal: params.pinjolPrincipal,
    monthlyInterestRate: params.pinjolMonthlyRate,
    monthlyPayment: params.pinjolMonthlyPayment,
  });

  const bank = calculatePinjolPayoff({
    principal: params.bankLoanPrincipal,
    monthlyInterestRate: params.bankMonthlyRate,
    monthlyPayment: params.bankMonthlyPayment,
  });

  return {
    pinjol,
    bank,
    savings: Math.max(0, pinjol.totalPaid - bank.totalPaid),
    monthsSaved: Math.max(0, pinjol.monthsToPayoff - bank.monthsToPayoff),
  };
}

/**
 * Calculate how much to pay to eliminate pinjol within X months
 */
export function calculateRequiredPayment(params: {
  principal: number;
  monthlyInterestRate: number;
  targetMonths: number;
}): number {
  const { principal, monthlyInterestRate, targetMonths } = params;
  const monthlyRate = monthlyInterestRate / 100;

  if (monthlyRate === 0) {
    return principal / targetMonths;
  }

  const requiredPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, targetMonths)) /
    (Math.pow(1 + monthlyRate, targetMonths) - 1);

  return Math.ceil(requiredPayment);
}

/**
 * Calculate snowball debt payoff order
 */
export function calculateSnowballOrder(debts: {
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}[]): {
  order: Array<{
    name: string;
    balance: number;
    rate: number;
    minPayment: number;
  }>;
  totalInterest: number;
  totalMonths: number;
} {
  const sorted = [...debts].sort((a, b) => a.balance - b.balance);

  let totalInterest = 0;
  let totalMonths = 0;
  const remainingDebts = [...sorted];

  while (remainingDebts.length > 0 && totalMonths < 600) {
    const current = remainingDebts[0];
    const monthlyRate = current.rate / 100;
    const interest = current.balance * monthlyRate;
    totalInterest += interest;

    const extraPayment = totalMonths === 0 ? 100000 : 0;
    const payment = Math.min(current.balance + interest, current.minPayment + extraPayment);
    current.balance = Math.max(0, current.balance + interest - payment);

    if (current.balance <= 0) {
      remainingDebts.shift();
    }
    totalMonths++;
  }

  return {
    order: sorted,
    totalInterest,
    totalMonths,
  };
}

/**
 * Calculate avalanche debt payoff order (highest interest first)
 */
export function calculateAvalancheOrder(debts: {
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}[]): {
  order: Array<{
    name: string;
    balance: number;
    rate: number;
    minPayment: number;
  }>;
  totalInterest: number;
  totalMonths: number;
} {
  const sorted = [...debts].sort((a, b) => b.rate - a.rate);

  let totalInterest = 0;
  let totalMonths = 0;
  const remainingDebts = [...sorted];

  while (remainingDebts.length > 0 && totalMonths < 600) {
    const current = remainingDebts[0];
    const monthlyRate = current.rate / 100;
    const interest = current.balance * monthlyRate;
    totalInterest += interest;

    const extraPayment = totalMonths === 0 ? 100000 : 0;
    const payment = Math.min(current.balance + interest, current.minPayment + extraPayment);
    current.balance = Math.max(0, current.balance + interest - payment);

    if (current.balance <= 0) {
      remainingDebts.shift();
    }
    totalMonths++;
  }

  return {
    order: sorted,
    totalInterest,
    totalMonths,
  };
}

/**
 * Format currency for Indonesian Rupiah
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate monthly interest cost for pinjol
 */
export function calculateMonthlyInterest(balance: number, monthlyRate: number): number {
  return balance * (monthlyRate / 100);
}

/**
 * Calculate how long until pinjol debt doubles
 */
export function calculateDoublingTime(monthlyRate: number): number {
  if (monthlyRate <= 0) return Infinity;
  return Math.ceil(Math.log(2) / Math.log(1 + monthlyRate / 100));
}

/**
 * Check if pinjol interest rate is dangerously high
 */
export function isDangerouslyHighInterest(monthlyRate: number): boolean {
  return monthlyRate > 3;
}

/**
 * Get pinjol risk level based on interest rate
 */
export function getPinjolRiskLevel(monthlyRate: number): {
  level: 'low' | 'moderate' | 'high' | 'critical';
  message: string;
  color: string;
} {
  if (monthlyRate <= 1) {
    return {
      level: 'low',
      message: 'Relatively manageable interest rate',
      color: 'green',
    };
  } else if (monthlyRate <= 2) {
    return {
      level: 'moderate',
      message: 'Moderate interest - pay off as soon as possible',
      color: 'yellow',
    };
  } else if (monthlyRate <= 5) {
    return {
      level: 'high',
      message: 'High interest - consider refinancing',
      color: 'orange',
    };
  } else {
    return {
      level: 'critical',
      message: 'Critical interest rate - seek help immediately',
      color: 'red',
    };
  }
}

/**
 * Calculate payoff forecast with debt-free date and sustainability check
 */
export interface PayoffForecast {
  monthsToPayoff: number;
  totalInterest: number;
  totalPayment: number;
  debtFreeDate: Date;
  isSustainable: boolean;
  willGrow: boolean;
  monthlyInterest: number;
}

export function calculatePayoffForecast(
  debtAmount: number,
  monthlyInterestRate: number,
  monthlyPayment: number
): PayoffForecast {
  const monthlyRate = monthlyInterestRate / 100;
  const monthlyInterest = debtAmount * monthlyRate;

  // Handle edge cases
  if (monthlyPayment <= 0) {
    return {
      monthsToPayoff: Infinity,
      totalInterest: 0,
      totalPayment: 0,
      debtFreeDate: new Date('2099-12-31'),
      isSustainable: false,
      willGrow: true,
      monthlyInterest,
    };
  }

  // Check if payment covers only interest or less
  if (monthlyPayment <= monthlyInterest) {
    return {
      monthsToPayoff: Infinity,
      totalInterest: Infinity,
      totalPayment: Infinity,
      debtFreeDate: new Date('2099-12-31'),
      isSustainable: false,
      willGrow: monthlyPayment < monthlyInterest,
      monthlyInterest,
    };
  }

  // Use iterative approach similar to calculatePinjolPayoff
  let balance = debtAmount;
  let totalInterest = 0;
  let months = 0;

  while (balance > 0 && months < 600) {
    const interest = balance * monthlyRate;
    totalInterest += interest;
    const principalPayment = Math.max(0, monthlyPayment - interest);
    balance -= principalPayment;
    months++;

    if (balance < 0) balance = 0;
  }

  const totalPayment = monthlyPayment * months;

  // Calculate debt-free date
  const debtFreeDate = new Date();
  debtFreeDate.setMonth(debtFreeDate.getMonth() + months);

  return {
    monthsToPayoff: months,
    totalInterest,
    totalPayment,
    debtFreeDate,
    isSustainable: true,
    willGrow: false,
    monthlyInterest,
  };
}

/**
 * Format payoff forecast for display
 */
export function formatPayoffForecast(forecast: PayoffForecast): {
  durationText: string;
  debtFreeText: string;
  totalInterestText: string;
  totalPaymentText: string;
  warningText: string | null;
} {
  const { monthsToPayoff, debtFreeDate, totalInterest, totalPayment, willGrow, isSustainable, monthlyInterest } = forecast;

  if (!isSustainable || willGrow) {
    return {
      durationText: 'Never',
      debtFreeText: 'Debt will grow',
      totalInterestText: 'Increasing',
      totalPaymentText: 'Increasing',
      warningText: willGrow
        ? 'Payment too low - debt will grow monthly'
        : 'Payment covers only interest - debt never decreases',
    };
  }

  const years = Math.floor(monthsToPayoff / 12);
  const remainingMonths = monthsToPayoff % 12;
  const durationText = years > 0
    ? `${monthsToPayoff} months (${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''})`
    : `${monthsToPayoff} months`;

  const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
  const debtFreeText = debtFreeDate.toLocaleDateString('id-ID', options);

  return {
    durationText,
    debtFreeText,
    totalInterestText: formatIDR(totalInterest),
    totalPaymentText: formatIDR(totalPayment),
    warningText: null,
  };
}

export default {
  calculatePinjolPayoff,
  compareConsolidationOptions,
  calculateRequiredPayment,
  calculateSnowballOrder,
  calculateAvalancheOrder,
  formatIDR,
  calculateMonthlyInterest,
  calculateDoublingTime,
  isDangerouslyHighInterest,
  getPinjolRiskLevel,
  calculatePayoffForecast,
  formatPayoffForecast,
};
