export function validateWorkOrder(portions: number): { isValid: boolean; error?: string } {
  if (isNaN(portions) || portions <= 0) return { isValid: false, error: "Jumlah porsi wajib lebih dari 0." };
  return { isValid: true };
}
