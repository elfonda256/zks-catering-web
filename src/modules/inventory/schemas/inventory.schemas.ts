/**
 * Runtime validation for Inventory items, adjustments, and movements.
 */

export function validateItemAdjustment(qty: number, reason: string): { isValid: boolean; error?: string } {
  if (isNaN(qty) || qty === 0) {
    return { isValid: false, error: "Jumlah penyesuaian stok tidak boleh nol." };
  }
  if (!reason || reason.trim().length < 5) {
    return { isValid: false, error: "Alasan penyesuaian audit wajib diisi minimal 5 karakter." };
  }
  return { isValid: true };
}

export function validateStockCount(physicalQty: number): { isValid: boolean; error?: string } {
  if (isNaN(physicalQty) || physicalQty < 0) {
    return { isValid: false, error: "Hasil perhitungan fisik tidak boleh bernilai negatif." };
  }
  return { isValid: true };
}
