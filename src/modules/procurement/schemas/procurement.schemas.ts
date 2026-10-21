/**
 * Validation rules for Purchase Requests and Purchase Orders
 */

export function validatePOLineItems(items: { qty: number; unitPrice: number }[]): { isValid: boolean; error?: string } {
  if (!items || items.length === 0) {
    return { isValid: false, error: "Purchase Order wajib memiliki minimal 1 line item." };
  }
  for (const item of items) {
    if (isNaN(item.qty) || item.qty <= 0) {
      return { isValid: false, error: "Kuantitas item wajib lebih besar dari 0." };
    }
    if (isNaN(item.unitPrice) || item.unitPrice < 0) {
      return { isValid: false, error: "Harga satuan item tidak boleh negatif." };
    }
  }
  return { isValid: true };
}

export function validatePRSubmission(requester: string, itemsCount: number): { isValid: boolean; error?: string } {
  if (!requester || requester.trim().length === 0) {
    return { isValid: false, error: "Nama pemohon PR wajib diisi." };
  }
  if (itemsCount <= 0) {
    return { isValid: false, error: "Pengajuan PR harus memiliki minimal 1 barang." };
  }
  return { isValid: true };
}
