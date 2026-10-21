/**
 * Validation helpers for dashboard actions.
 */

export function validateShippingFee(shippingFee: number): { isValid: boolean; error?: string } {
  if (isNaN(shippingFee) || shippingFee < 0) {
    return { isValid: false, error: "Ongkos kirim tidak boleh bernilai negatif." };
  }
  return { isValid: true };
}

export function validateRejectionReason(reason: string): { isValid: boolean; error?: string } {
  if (!reason || reason.trim().length < 5) {
    return { isValid: false, error: "Alasan penolakan minimal 5 karakter." };
  }
  return { isValid: true };
}
