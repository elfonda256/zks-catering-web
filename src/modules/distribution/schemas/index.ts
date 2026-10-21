export function validateDeliveryRun(boxesCount: number): { isValid: boolean; error?: string } {
  if (isNaN(boxesCount) || boxesCount <= 0) return { isValid: false, error: "Jumlah box thermal wajib lebih dari 0." };
  return { isValid: true };
}
