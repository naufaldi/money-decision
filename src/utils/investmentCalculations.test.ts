import { describe, it, expect } from 'vitest';
import { calculateCompoundInterest, calculateMonthlyForGoal, formatLargeNumber } from './investmentCalculations';

describe('calculateCompoundInterest', () => {
  it('should calculate correct final value with only initial investment', () => {
    const result = calculateCompoundInterest(1000000, 0, 7, 10);
    
    expect(result.totalContribution).toBe(1000000);
    expect(result.finalValue).toBeGreaterThan(1950000);
    expect(result.finalValue).toBeLessThan(2050000);
    expect(result.interestEarned).toBeGreaterThan(950000);
  });

  it('should calculate correct final value with monthly contributions', () => {
    const result = calculateCompoundInterest(1000000, 500000, 7, 10);
    
    expect(result.totalContribution).toBe(61000000);
    expect(result.finalValue).toBeGreaterThan(85000000);
    expect(result.finalValue).toBeLessThan(90000000);
    expect(result.interestEarned).toBeGreaterThan(24000000);
  });

  it('should handle zero initial investment', () => {
    const result = calculateCompoundInterest(0, 500000, 10, 10);
    
    expect(result.totalContribution).toBe(60000000);
    expect(result.finalValue).toBeGreaterThan(100000000);
    expect(result.finalValue).toBeLessThan(105000000);
    expect(result.interestEarned).toBeGreaterThan(40000000);
  });

  it('should calculate entry-level starter scenario correctly', () => {
    const result = calculateCompoundInterest(0, 100000, 7, 5);
    
    expect(result.totalContribution).toBe(6000000);
    expect(result.finalValue).toBeGreaterThan(7100000);
    expect(result.finalValue).toBeLessThan(7300000);
    expect(result.interestEarned).toBeGreaterThan(1100000);
  });

  it('should generate year-by-year breakdown', () => {
    const result = calculateCompoundInterest(0, 500000, 10, 5);
    
    expect(result.yearByYear).toHaveLength(5);
    expect(result.yearByYear[0].year).toBe(1);
    expect(result.yearByYear[4].year).toBe(5);
    expect(result.yearByYear[4].balance).toBeGreaterThan(38000000);
    expect(result.yearByYear[4].balance).toBeLessThan(39000000);
  });

  it('should handle high return rates', () => {
    const result = calculateCompoundInterest(0, 1000000, 15, 10);
    
    expect(result.finalValue).toBeGreaterThan(result.totalContribution);
    expect(result.interestEarned).toBeGreaterThan(0);
  });

  it('should handle zero return rate', () => {
    const result = calculateCompoundInterest(1000000, 100000, 0, 5);
    
    expect(result.finalValue).toBe(result.totalContribution);
    expect(result.interestEarned).toBe(0);
  });
});

describe('calculateMonthlyForGoal', () => {
  it('should calculate monthly amount needed for Rp 1B goal', () => {
    const result = calculateMonthlyForGoal(1000000000, 10, 30, 0);
    
    expect(result.monthlyNeeded).toBeGreaterThan(400000);
    expect(result.monthlyNeeded).toBeLessThan(450000);
    expect(result.totalInvested).toBeGreaterThan(140000000);
  });

  it('should calculate monthly amount for shorter time period', () => {
    const result = calculateMonthlyForGoal(1000000000, 10, 20, 0);
    
    expect(result.monthlyNeeded).toBeGreaterThan(1300000);
    expect(result.monthlyNeeded).toBeLessThan(1350000);
  });

  it('should calculate monthly amount for aggressive return', () => {
    const result = calculateMonthlyForGoal(1000000000, 15, 20, 0);
    
    expect(result.monthlyNeeded).toBeLessThan(1330000);
  });

  it('should account for initial investment', () => {
    const withInitial = calculateMonthlyForGoal(10000000, 10, 10, 5000000);
    const withoutInitial = calculateMonthlyForGoal(10000000, 10, 10, 0);
    
    expect(withInitial.monthlyNeeded).toBeLessThan(withoutInitial.monthlyNeeded);
  });

  it('should handle Rp 500M retirement goal', () => {
    const result = calculateMonthlyForGoal(500000000, 10, 30, 0);
    
    expect(result.monthlyNeeded).toBeGreaterThan(200000);
    expect(result.monthlyNeeded).toBeLessThan(225000);
  });
});

describe('formatLargeNumber', () => {
  it('should format numbers in millions correctly', () => {
    expect(formatLargeNumber(1000000)).toContain('1 juta');
    expect(formatLargeNumber(103000000)).toContain('103 juta');
  });

  it('should format numbers in billions correctly', () => {
    expect(formatLargeNumber(1000000000)).toContain('1.00 miliar');
    expect(formatLargeNumber(1520000000)).toContain('1.52 miliar');
  });

  it('should format small numbers with full currency', () => {
    const formatted = formatLargeNumber(500000);
    expect(formatted).toContain('Rp');
    expect(formatted).toContain('500');
  });

  it('should handle zero', () => {
    const formatted = formatLargeNumber(0);
    expect(formatted).toContain('Rp');
    expect(formatted).toContain('0');
  });
});
