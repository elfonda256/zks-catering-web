/**
 * Validation for Goods Receiving and Warehouse Transfers
 */

export function validateTransferRequest(fromWh: string, toWh: string, itemsCount: number): { isValid: boolean; error?: string } {
  if (!fromWh || !toWh) {
    return { isValid: false, error: "Gudang asal dan gudang tujuan wajib dipilih." };
  }
  if (fromWh === toWh) {
    return { isValid: false, error: "Gudang asal tidak boleh sama dengan gudang tujuan." };
  }
  if (itemsCount <= 0) {
    return { isValid: false, error: "Transfer wajib menyertakan minimal 1 item." };
  }
  return { isValid: true };
}

export function validateReceivingQC(acceptedQty: number, rejectedQty: number, totalReceived: number): { isValid: boolean; error?: string } {
  if (acceptedQty + rejectedQty !== totalReceived) {
    return { isValid: false, error: "Total diterima harus sama dengan penjumlahan qty diterima dan ditolak." };
  }
  return { isValid: true };
}
