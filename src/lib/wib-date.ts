/**
 * Calendar helpers in WIB (UTC+7, no daylight saving), independent of the server's time zone.
 * Pure functions: safe for the browser and the server.
 */

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

/** The instant WIB midnight starts for the WIB day `offsetDays` after the day of `now`. */
export function startOfWibDay(now: Date, offsetDays = 0): Date {
  const wib = new Date(now.getTime() + WIB_OFFSET_MS);
  const midnightWibAsUtc = Date.UTC(wib.getUTCFullYear(), wib.getUTCMonth(), wib.getUTCDate() + offsetDays);
  return new Date(midnightWibAsUtc - WIB_OFFSET_MS);
}

/** WIB calendar date as YYYY-MM-DD. */
export function wibDateKey(date: Date): string {
  return new Date(date.getTime() + WIB_OFFSET_MS).toISOString().slice(0, 10);
}

/** Start and end (exclusive) of a WIB calendar month, from "YYYY-MM". */
export function wibMonthRange(month: string): { start: Date; end: Date } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(month);
  if (!match) return null;
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  if (monthIndex < 0 || monthIndex > 11) return null;
  return {
    start: new Date(Date.UTC(year, monthIndex, 1) - WIB_OFFSET_MS),
    end: new Date(Date.UTC(year, monthIndex + 1, 1) - WIB_OFFSET_MS),
  };
}

/** WIB month of `date` as "YYYY-MM". */
export function wibMonthKey(date: Date): string {
  return wibDateKey(date).slice(0, 7);
}


/** The last `count` WIB months, newest first, with Indonesian labels ("November 2026"). */
export function recentWibMonths(now: Date, count: number): { key: string; label: string }[] {
  const [year, month] = wibMonthKey(now).split("-").map(Number);
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(Date.UTC(year, month - 1 - i, 1));
    const key = date.toISOString().slice(0, 7);
    const label = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
    return { key, label };
  });
}
