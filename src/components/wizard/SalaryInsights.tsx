import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { calculatePercentile, formatPercentile, getProvinceGini } from '@/utils/salaryPercentile';
import wageData from '@/data/salary/avg_wages_total_august_2025.json';
import { formatCurrency } from '@/utils/formatters';

interface SalaryInsightsProps {
  income: number;
  province: string;
}

const NATIONAL_MEAN_WAGE = 3331012; // From CSV "MEAN" row, Total/August 2025

export function SalaryInsights({ income, province }: SalaryInsightsProps) {
  const provinceData = useMemo(() => {
    return wageData.find(item => item.province === province);
  }, [province]);

  const nationalPercentile = useMemo(() => {
    return calculatePercentile(income, NATIONAL_MEAN_WAGE);
  }, [income]);

  const provincePercentile = useMemo(() => {
    if (!provinceData) return null;
    const provinceGini = getProvinceGini(province);
    return calculatePercentile(income, provinceData.total_august_2025, provinceGini);
  }, [income, provinceData, province]);

  if (!provinceData) {
    return null;
  }

  const nationalPosition = formatPercentile(nationalPercentile);
  const provincePosition = provincePercentile !== null ? formatPercentile(provincePercentile) : null;

  return (
    <Card className="wizard-card mt-6">
      <CardHeader>
        <CardTitle className="text-center text-lg">Your Salary Position</CardTitle>
        <CardDescription className="text-center">
          Estimated position based on average wages and income distribution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Position in Indonesia:</span>
            <span className="text-sm font-semibold text-primary">{nationalPosition}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            National average: {formatCurrency(NATIONAL_MEAN_WAGE)}/month
          </div>
        </div>
        
        {provincePosition ? <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Position in {province}:</span>
              <span className="text-sm font-semibold text-primary">{provincePosition}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {province} average: {formatCurrency(provinceData.total_august_2025)}/month
            </div>
          </div> : null}

        <div className="border-t pt-2">
          <p className="text-xs text-muted-foreground">
            Note: Estimated from mean wages and inequality data. Not an official percentile calculation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
