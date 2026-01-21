/**
 * Format a number as Indonesian Rupiah (IDR)
 * Example: 1000000 -> "Rp 1.000.000"
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp 0';
  }

  const absAmount = Math.abs(amount);
  const formattedNumber = absAmount.toLocaleString('id-ID');
  return amount < 0 ? `-Rp ${formattedNumber}` : `Rp ${formattedNumber}`;
}

/**
 * Format a number as percentage
 * Example: 0.5 -> "50%"
 */
export function formatPercentage(value: number, decimals = 0): string {
  if (isNaN(value) || value === null || value === undefined) {
    return '0%';
  }
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a number with thousand separators
 * Example: 1000000 -> "1.000.000"
 */
export function formatNumber(value: number): string {
  if (isNaN(value) || value === null || value === undefined) {
    return '0';
  }
  return value.toLocaleString('id-ID');
}

/**
 * Parse a formatted currency string back to number
 * Example: "Rp 1.000.000" -> 1000000
 */
export function parseCurrency(value: string): number {
  // Remove non-numeric characters except minus sign
  const numericString = value.replace(/[^0-9-]/g, '');
  return parseInt(numericString, 10) || 0;
}
