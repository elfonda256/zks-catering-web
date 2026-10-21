export function validateDateRange(start: string, end: string): { isValid: boolean; error?: string } {
  if (!start || !end) return { isValid: false, error: "Rentang tanggal awal dan akhir wajib diisi." };
  if (new Date(start) > new Date(end)) return { isValid: false, error: "Tanggal awal tidak boleh melebihi tanggal akhir." };
  return { isValid: true };
}
