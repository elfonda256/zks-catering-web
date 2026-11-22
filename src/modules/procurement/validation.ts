/**
 * Input validation for the procurement server actions. Pure functions so they can be unit tested.
 * Every value comes from the browser, so nothing here is trusted until it passes.
 */

import { startOfWibDay, wibDayStart } from "@/lib/wib-date";
import { parseBatchInput, parseQuantity, type BatchInput } from "@/modules/inventory/validation";

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const MAX_LINES = 50;
const MAX_PRICE = 100_000_000;

function text(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

function positiveInt(value: string): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export interface LineInput {
  ingredientId: number;
  quantity: number;
  unitPrice: number;
}

/**
 * Reads the line editor: parallel `lineIngredient`, `lineQuantity` and (for a PO) `linePrice`
 * fields. Fully empty rows are skipped; an ingredient may appear only once.
 */
export function parseLines(form: FormData, { withPrice }: { withPrice: boolean }): Result<LineInput[]> {
  const ingredients = form.getAll("lineIngredient").map((v) => String(v).trim());
  const quantities = form.getAll("lineQuantity").map((v) => String(v).trim());
  const prices = form.getAll("linePrice").map((v) => String(v).trim());

  const lines: LineInput[] = [];
  const seen = new Set<number>();
  for (let i = 0; i < ingredients.length; i++) {
    const rawIngredient = ingredients[i];
    const rawQuantity = quantities[i] ?? "";
    const rawPrice = prices[i] ?? "";
    if (!rawIngredient && !rawQuantity) continue;

    const ingredientId = positiveInt(rawIngredient);
    if (!ingredientId) return { ok: false, error: `Baris ${i + 1}: pilih bahan.` };
    if (seen.has(ingredientId)) return { ok: false, error: `Baris ${i + 1}: bahan yang sama sudah ada di baris lain.` };
    const quantity = parseQuantity(rawQuantity, { allowZero: false });
    if (quantity === null) return { ok: false, error: `Baris ${i + 1}: jumlah harus lebih dari 0, maksimal 3 desimal.` };

    let unitPrice = 0;
    if (withPrice) {
      if (!/^\d+$/.test(rawPrice) || Number(rawPrice) > MAX_PRICE) {
        return { ok: false, error: `Baris ${i + 1}: harga satuan berupa angka rupiah tanpa titik.` };
      }
      unitPrice = Number(rawPrice);
    }

    seen.add(ingredientId);
    lines.push({ ingredientId, quantity, unitPrice });
  }

  if (lines.length === 0) return { ok: false, error: "Tambahkan minimal satu bahan." };
  if (lines.length > MAX_LINES) return { ok: false, error: `Maksimal ${MAX_LINES} bahan per dokumen.` };
  return { ok: true, value: lines };
}

/** A date from <input type="date">, not earlier than today in WIB. */
function futureDate(raw: string, now: Date): Date | null {
  const date = wibDayStart(raw);
  return date && date >= startOfWibDay(now) ? date : null;
}

export interface RequestInput {
  requestedBy: string;
  reason: string;
  neededBy: Date;
  lines: LineInput[];
}

export function parseRequestInput(form: FormData, now: Date): Result<RequestInput> {
  const requestedBy = text(form, "requestedBy");
  const reason = text(form, "reason");
  const neededBy = futureDate(text(form, "neededBy"), now);

  if (requestedBy.length < 2 || requestedBy.length > 60) return { ok: false, error: "Isi siapa yang meminta (2–60 karakter)." };
  if (reason.length < 5 || reason.length > 300) return { ok: false, error: "Alasan permintaan 5–300 karakter." };
  if (!neededBy) return { ok: false, error: "Tanggal dibutuhkan tidak boleh sebelum hari ini." };

  const lines = parseLines(form, { withPrice: false });
  if (!lines.ok) return lines;
  return { ok: true, value: { requestedBy, reason, neededBy, lines: lines.value } };
}

export interface DecisionInput {
  approve: boolean;
  note: string | null;
}

export function parseDecisionInput(form: FormData): Result<DecisionInput> {
  const decision = text(form, "decision");
  const note = text(form, "decisionNote").slice(0, 200) || null;
  if (decision !== "approve" && decision !== "reject") return { ok: false, error: "Pilih setujui atau tolak." };
  if (decision === "reject" && !note) return { ok: false, error: "Tulis alasan penolakan." };
  return { ok: true, value: { approve: decision === "approve", note } };
}

export interface OrderInput {
  supplierId: number;
  requestId: number | null;
  expectedDate: Date | null;
  note: string | null;
  lines: LineInput[];
}

export function parseOrderInput(form: FormData, now: Date): Result<OrderInput> {
  const supplierId = positiveInt(text(form, "supplierId"));
  const requestRaw = text(form, "requestId");
  const requestId = requestRaw ? positiveInt(requestRaw) : null;
  const expectedRaw = text(form, "expectedDate");
  const expectedDate = expectedRaw ? futureDate(expectedRaw, now) : null;
  const note = text(form, "note").slice(0, 200) || null;

  if (!supplierId) return { ok: false, error: "Pilih supplier." };
  if (requestRaw && !requestId) return { ok: false, error: "Permintaan pembelian tidak valid." };
  if (expectedRaw && !expectedDate) return { ok: false, error: "Jadwal kirim tidak boleh sebelum hari ini." };

  const lines = parseLines(form, { withPrice: true });
  if (!lines.ok) return lines;
  return { ok: true, value: { supplierId, requestId, expectedDate, note, lines: lines.value } };
}

export interface ReceiptInput {
  orderId: number;
  locationId: number;
  note: string | null;
  lines: { orderLineId: number; accepted: number; rejected: number; note: string | null; batch: BatchInput | null }[];
}

/** Reads the receiving form: one `receiptLine` id per PO line, with `accepted:<id>` and `rejected:<id>`. */
export function parseReceiptInput(form: FormData, now: Date = new Date()): Result<ReceiptInput> {
  const orderId = positiveInt(text(form, "orderId"));
  const locationId = positiveInt(text(form, "locationId"));
  const note = text(form, "note").slice(0, 200) || null;
  if (!orderId) return { ok: false, error: "Pilih PO yang diterima." };
  if (!locationId) return { ok: false, error: "Pilih lokasi barang masuk." };

  const lines: ReceiptInput["lines"] = [];
  const seen = new Set<number>();
  for (const raw of form.getAll("receiptLine")) {
    const orderLineId = positiveInt(String(raw));
    if (!orderLineId || seen.has(orderLineId)) return { ok: false, error: "Baris penerimaan tidak valid. Muat ulang halaman." };
    seen.add(orderLineId);
    const acceptedRaw = text(form, `accepted:${orderLineId}`) || "0";
    const rejectedRaw = text(form, `rejected:${orderLineId}`) || "0";
    const accepted = parseQuantity(acceptedRaw, { allowZero: true });
    const rejected = parseQuantity(rejectedRaw, { allowZero: true });
    if (accepted === null || rejected === null) return { ok: false, error: "Jumlah diterima dan ditolak berupa angka, maksimal 3 desimal." };
    if (accepted === 0 && rejected === 0) continue;
    const lineNote = text(form, `lineNote:${orderLineId}`).slice(0, 120) || null;
    if (rejected > 0 && !lineNote) return { ok: false, error: "Barang yang ditolak wajib diberi alasan." };
    let batch: BatchInput | null = null;
    if (accepted > 0) {
      const parsedBatch = parseBatchInput(text(form, `batchCode:${orderLineId}`), text(form, `expiresAt:${orderLineId}`), now);
      if (!parsedBatch.ok) return parsedBatch;
      batch = parsedBatch.value;
    }
    lines.push({ orderLineId, accepted, rejected, note: lineNote, batch });
  }

  if (lines.length === 0) return { ok: false, error: "Isi jumlah diterima atau ditolak minimal satu bahan." };
  return { ok: true, value: { orderId, locationId, note, lines } };
}
