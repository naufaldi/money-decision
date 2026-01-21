# Salary Position Insights Feature

## User Story

**As a** user of the Money Decision Wizard  
**I want to** see how my monthly salary compares to others in Indonesia and my selected province  
**So that** I can understand my financial position and make better-informed decisions about budgeting and savings

### Acceptance Criteria

1. User must select a province in Step 1 before proceeding
2. After entering income and clicking Continue, an insight card appears below the wizard showing:
   - Estimated position (percentile) in Indonesia
   - Estimated position (percentile) in the selected province
3. Insight card displays average wages for context
4. Insight card includes a disclaimer that calculations are estimates, not official percentiles

## Dataset

### Source File
- **File**: `Average Wages_Net Salaries of Labor_Employee per Month by Province and Main Job Type, 2025.csv`
- **Extracted Column**: `Total / August 2025` (net monthly wage in Rupiah)
- **Data Location**: `src/data/salary/avg_wages_total_august_2025.json`

### Data Description
- Contains average net monthly wages for 38 provinces in Indonesia
- Based on BPS (Badan Pusat Statistik) Sakernas survey data
- Represents wages for formal employees (buruh/karyawan/pegawai)
- Period: August 2025
- National mean: Rp 3,331,012/month

### Data Structure
```json
[
  { "province": "DKI JAKARTA", "total_august_2025": 4878943 },
  ...
]
```

## Methodology

### Percentile Calculation

Since we only have **mean wages** (not full wage distributions), we use a **lognormal distribution approximation** to estimate percentiles.

#### Formula
1. **Gini to Sigma conversion**: Convert Gini coefficient to lognormal standard deviation (σ)
   - Approximation: σ ≈ 2 * √2 * G * (1 + G/2)

2. **Mean of log values (μ)**: Calculate from mean wage and sigma
   - μ = ln(mean_wage) - σ²/2

3. **Percentile calculation**: For a given salary x
   - z = (ln(x) - μ) / σ
   - Percentile = Φ(z) where Φ is the CDF of standard normal distribution

### Inequality Data Sources

#### National Level
- **Gini Coefficient**: 0.381 (September 2024)
- **Source**: BPS Press Release No. 2399, January 15, 2025
- **URL**: https://www.bps.go.id/en/pressrelease/2025/01/15/2399
- **Mean Wage**: Rp 3,331,012/month (from CSV "MEAN" row)

#### Province Level
- **DKI Jakarta**: Gini coefficient 0.431 (September 2024)
  - Source: Secondary source via ANTARA News (BPS DKI Jakarta data)
  - Note: Province-specific Gini data is limited; Jakarta is the only province with available data
- **Other Provinces**: Fallback to national Gini (0.381)
  - Limitation: Province-specific inequality data not available for most provinces

## Limitations & Assumptions

1. **Distribution Assumption**: Assumes lognormal distribution of wages, which is a common approximation but may not perfectly match actual distributions

2. **Limited Province Inequality Data**: Only DKI Jakarta has province-specific Gini coefficient. All other provinces use the national average, which may not accurately reflect local inequality

3. **Mean vs. Median**: Dataset provides mean wages, not median. Mean can be skewed by high earners

4. **Formal Sector Only**: Data represents formal employees (buruh/karyawan/pegawai), excluding informal workers and self-employed individuals

5. **Temporal Mismatch**: Wage data is from August 2025, while Gini data is from September 2024. Small temporal differences may exist

6. **Not Official Percentiles**: These are statistical estimates, not official BPS percentile calculations. Actual percentiles would require access to microdata from BPS

7. **Job Type Aggregation**: Uses "Total" across all job types. Individual job categories may have different distributions

## Implementation Notes

- Percentile calculations performed in `src/utils/salaryPercentile.ts`
- Component: `src/components/wizard/SalaryInsights.tsx`
- Error function approximation uses Abramowitz and Stegun method
- Percentiles formatted as "Top X%" or "Bottom X%" for clarity

## Future Enhancements

- Access BPS microdata (SILASTIK) for more accurate percentile calculations
- Obtain province-specific Gini coefficients for all provinces
- Add breakdown by job type/category
- Include median wage data if available
- Add historical trends/comparisons
