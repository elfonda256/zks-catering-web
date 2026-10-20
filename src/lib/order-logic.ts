import { createHash, randomBytes } from "node:crypto";

/**
 * Konversi tanggal ke tanggal kalender zona waktu Asia/Jakarta (WIB, UTC+7)
 */
export function getWibCalendarDate(date: Date): { year: number; month: number; day: number } {
  const wibTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return {
    year: wibTime.getUTCFullYear(),
    month: wibTime.getUTCMonth(),
    day: wibTime.getUTCDate(),
  };
}

/**
 * Menghitung selisih hari kalender WIB antara tanggal pemesanan (now) dan tanggal acara (eventDate).
 */
export function getCalendarDayDifferenceWib(eventDate: Date, nowDate: Date = new Date()): number {
  const eventWib = getWibCalendarDate(eventDate);
  const nowWib = getWibCalendarDate(nowDate);

  const eventUtcDays = Date.UTC(eventWib.year, eventWib.month, eventWib.day);
  const nowUtcDays = Date.UTC(nowWib.year, nowWib.month, nowWib.day);

  return Math.round((eventUtcDays - nowUtcDays) / (24 * 60 * 60 * 1000));
}

export interface DateValidationResult {
  valid: boolean;
  error?: string;
  minDaysRequired: number;
  actualDaysDiff: number;
}

/**
 * Validasi jeda minimum pemesanan berdasarkan aturan bisnis ZKS:
 * - Total < 500 pcs: minimal H-1 hari kalender WIB
 * - Total >= 500 pcs: minimal H-3 hari kalender WIB
 */
export function validateOrderLeadTime(
  eventDate: Date,
  totalPcs: number,
  nowDate: Date = new Date()
): DateValidationResult {
  const diffDays = getCalendarDayDifferenceWib(eventDate, nowDate);
  const minDaysRequired = totalPcs >= 500 ? 3 : 1;

  if (diffDays < minDaysRequired) {
    if (minDaysRequired === 3) {
      return {
        valid: false,
        minDaysRequired,
        actualDaysDiff: diffDays,
        error: "Pemesanan katering volume besar (≥ 500 porsi) wajib diajukan paling lambat H-3 sebelum tanggal acara.",
      };
    }
    return {
      valid: false,
      minDaysRequired,
      actualDaysDiff: diffDays,
      error: "Pemesanan katering (< 500 porsi) wajib diajukan paling lambat H-1 sebelum tanggal acara.",
    };
  }

  return {
    valid: true,
    minDaysRequired,
    actualDaysDiff: diffDays,
  };
}

/**
 * Membuat token akses acak 64 karakter heksadesimal dan hash SHA-256 untuk disimpan di database.
 */
export function generateOrderAccessToken(): { rawToken: string; accessTokenHash: string } {
  const rawToken = randomBytes(32).toString("hex"); // 64 heksadesimal
  const accessTokenHash = createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, accessTokenHash };
}

/**
 * Menghitung hash SHA-256 dari rawToken untuk verifikasi query ke basis data.
 */
export function hashAccessToken(rawToken: string): string {
  return createHash("sha256").update(rawToken.trim()).digest("hex");
}

/**
 * Menghasilkan kode pesanan unik dengan format ZKS-YYYYMMDD-XXXX
 */
export function generateOrderCode(date: Date = new Date()): string {
  const wib = getWibCalendarDate(date);
  const yyyy = String(wib.year);
  const mm = String(wib.month + 1).padStart(2, "0");
  const dd = String(wib.day).padStart(2, "0");

  const randomPart = randomBytes(2).toString("hex").toUpperCase();
  return `ZKS-${yyyy}${mm}${dd}-${randomPart}`;
}

/**
 * Menghitung subtotal pesanan murni di server.
 */
export function calculateSubtotal(unitPrice: number, quantity: number): number {
  if (unitPrice < 0 || quantity < 0) {
    throw new Error("Harga satuan dan jumlah tidak boleh bernilai negatif.");
  }
  return Math.round(unitPrice * quantity);
}
