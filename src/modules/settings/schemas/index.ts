export function validateTaxRate(rate: number): { isValid: boolean; error?: string } {
  if (isNaN(rate) || rate < 0 || rate > 1) return { isValid: false, error: "Tarif pajak harus berada di antara 0 dan 100%." };
  return { isValid: true };
}
