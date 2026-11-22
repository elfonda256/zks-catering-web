/**
 * Centralized formatting utilities for PT. Zahdan Kamal Sentosa Enterprise ERP.
 */

/**
 * Format currency to Indonesian Rupiah (IDR).
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format standard number with thousand separators.
 */
export function formatNumber(val: number): string {
  return new Intl.NumberFormat("id-ID").format(val);
}

/**
 * Format percentage string.
 */
export function formatPercent(val: number, decimals: number = 1): string {
  return `${val.toFixed(decimals)}%`;
}

/** Dates are always shown in WIB, whatever time zone the server or browser runs in. */
const BUSINESS_TIME_ZONE = "Asia/Jakarta";

/**
 * Format ISO or Date string into Indonesian locale standard date (e.g. 21 Okt 2026).
 */
export function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: BUSINESS_TIME_ZONE,
  }).format(date);
}

/**
 * Format Date with time (e.g. 21 Okt 2026, 14:30 WIB).
 */
export function formatDateTime(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "-";
  const dateStr = formatDate(date);
  const timeStr = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: BUSINESS_TIME_ZONE,
  }).format(date);
  return `${dateStr}, ${timeStr} WIB`;
}

/** Rupiah without a space, as written on the public site: Rp17.000 */
export function formatRupiahCompact(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

/** Short rupiah for KPI tiles on narrow screens: Rp 17,8 jt / Rp 950 rb. */
export function formatRupiahShort(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `Rp ${Math.round(amount / 1_000).toLocaleString("id-ID")} rb`;
  }
  return formatRupiah(amount);
}
