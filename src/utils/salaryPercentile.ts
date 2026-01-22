/**
 * Calculate percentile using lognormal distribution approximation
 * Based on mean wage and Gini coefficient
 * 
 * Formula: For lognormal distribution with mean μ and Gini G,
 * we can estimate the percentile for a given salary value.
 * 
 * Gini coefficient relates to the standard deviation of the log-normal distribution:
 * G ≈ erf(σ/2) where σ is the standard deviation of the log values
 * 
 * For a lognormal distribution:
 * - Mean = exp(μ + σ²/2)
 * - We solve for σ from Gini, then calculate percentile
 */

import giniData from '@/data/salary/gini_ratio_march_2025.json';

const NATIONAL_GINI = 0.375; // BPS March 2025 (Semester 1)

/**
 * Convert Gini coefficient to lognormal standard deviation (σ)
 * Approximation: σ ≈ sqrt(2) * erf^(-1)(G)
 * Using approximation: σ ≈ 2 * sqrt(2) * G for small to moderate Gini values
 */
function giniToSigma(gini: number): number {
  // More accurate approximation using inverse error function approximation
  // For Gini in [0, 0.5], we use: σ ≈ 2 * sqrt(2) * G * (1 + G/2)
  return 2 * Math.sqrt(2) * gini * (1 + gini / 2);
}

/**
 * Calculate the mean of log values (μ) from the mean wage and sigma
 * For lognormal: mean_wage = exp(μ + σ²/2)
 * So: μ = ln(mean_wage) - σ²/2
 */
function calculateMu(meanWage: number, sigma: number): number {
  return Math.log(meanWage) - (sigma * sigma) / 2;
}

/**
 * Calculate percentile for a given salary using lognormal distribution
 * @param salary - User's monthly salary (Rupiah)
 * @param meanWage - Mean wage for the population (Rupiah)
 * @param gini - Gini coefficient for inequality
 * @returns Percentile (0-100), where higher means top earners
 */
export function calculatePercentile(
  salary: number,
  meanWage: number,
  gini: number = NATIONAL_GINI
): number {
  if (salary <= 0 || meanWage <= 0) return 0;
  
  const sigma = giniToSigma(gini);
  const mu = calculateMu(meanWage, sigma);
  
  // For lognormal distribution, percentile = Φ((ln(x) - μ) / σ)
  // where Φ is the cumulative distribution function of standard normal
  const logSalary = Math.log(salary);
  const z = (logSalary - mu) / sigma;
  
  // Approximate CDF of standard normal using error function
  // Φ(z) = 0.5 * (1 + erf(z / sqrt(2)))
  const percentile = 0.5 * (1 + erf(z / Math.sqrt(2)));
  
  // Convert to percentage (0-100) and ensure it's in valid range
  return Math.max(0, Math.min(100, percentile * 100));
}

/**
 * Approximate error function using Abramowitz and Stegun approximation
 */
function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return sign * y;
}

/**
 * Get Gini coefficient for a province
 * Uses BPS March 2025 (Semester 1) data for all 38 provinces
 */
export function getProvinceGini(province: string): number {
  const provinceNormalized = province.trim().toUpperCase();
  const provinceData = giniData.find(
    item => item.province.trim().toUpperCase() === provinceNormalized
  );
  
  if (provinceData) {
    return provinceData.gini_ratio_march_2025;
  }
  
  // Fallback to national Gini if province not found
  console.warn(`Gini data not found for province: "${province}". Using national average.`);
  return NATIONAL_GINI;
}

/**
 * Format percentile as "Top X%" or "Bottom X%"
 * Percentile is 0-100, where 100 = top earner
 */
export function formatPercentile(percentile: number): string {
  const topPercent = 100 - percentile;
  if (percentile >= 90) {
    return `Top ${Math.round(topPercent)}%`;
  } else if (percentile >= 50) {
    return `Top ${Math.round(topPercent)}%`;
  } else if (percentile >= 10) {
    return `Bottom ${Math.round(percentile)}%`;
  } else {
    return `Bottom ${Math.round(percentile)}%`;
  }
}
