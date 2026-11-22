import type { PaymentRow } from "./types";

const PAYMENT_TYPE_CSV: Record<string, string> = { DP: "DP 20%", SETTLEMENT: "Pelunasan", FULL: "Bayar penuh" };

/** Quotes a CSV cell and neutralises leading characters that spreadsheets run as formulas. */
function cell(value: string | number | null): string {
  let text = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text) && typeof value === "string") text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

/** One row per settled payment, WIB timestamps, ready for Excel or Google Sheets. */
export function paymentsToCsv(rows: PaymentRow[]): string {
  const time = new Intl.DateTimeFormat("sv-SE", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Jakarta" });
  const header = ["Diterima (WIB)", "Kode pesanan", "Pelanggan", "Jenis", "Nominal", "Bank pengirim"];
  const lines = rows.map((r) =>
    [
      time.format(new Date(r.settledAt ?? r.createdAt)),
      r.orderCode,
      r.customerName,
      PAYMENT_TYPE_CSV[r.paymentType] ?? r.paymentType,
      r.amount,
      r.channel,
    ]
      .map(cell)
      .join(",")
  );
  return [header.map(cell).join(","), ...lines].join("\r\n");
}
