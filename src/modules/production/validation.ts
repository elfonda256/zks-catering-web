/** Input validation for the production server actions. Pure so it can be unit tested. */

import { MENU_PACKAGES } from "@/data/catering-data";
import { startOfWibDay, wibDayStart } from "@/lib/wib-date";
import { parseLines } from "@/modules/procurement/validation";
import { getControlPoint, isWithinLimit, limitText } from "./control-points";
import { allScheduledDishes, menuDishes, wibWeekday } from "./menu";
import type { ProductionShift } from "./types";

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const SHIFTS: ProductionShift[] = ["MORNING", "AFTERNOON", "NIGHT"];
const MAX_PORTIONS = 10_000;

function text(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

function packagePrice(raw: string): number | null {
  const price = Number(raw);
  return Number.isInteger(price) && MENU_PACKAGES[price] ? price : null;
}

export interface RecipeInput {
  price: number;
  lines: { ingredientId: number; quantityPerPortion: number }[];
}

/** A recipe is the package price plus ingredient lines, quantities per portion. */
export function parseRecipeInput(form: FormData): Result<RecipeInput> {
  const price = packagePrice(text(form, "packagePrice"));
  if (!price) return { ok: false, error: "Paket tidak dikenal. Muat ulang halaman." };
  const lines = parseLines(form, { withPrice: false });
  if (!lines.ok) return lines;
  return { ok: true, value: { price, lines: lines.value.map((l) => ({ ingredientId: l.ingredientId, quantityPerPortion: l.quantity })) } };
}

export interface DishRecipeInput {
  dishName: string;
  lines: { ingredientId: number; quantityPerPortion: number }[];
}

/** A dish recipe: one of the dishes in the public menu schedule, plus quantities per portion. */
export function parseDishRecipeInput(form: FormData): Result<DishRecipeInput> {
  const dishName = text(form, "dishName");
  if (!allScheduledDishes().includes(dishName)) return { ok: false, error: "Hidangan tidak ada di jadwal menu. Muat ulang halaman." };
  const lines = parseLines(form, { withPrice: false });
  if (!lines.ok) return lines;
  return { ok: true, value: { dishName, lines: lines.value.map((l) => ({ ingredientId: l.ingredientId, quantityPerPortion: l.quantity })) } };
}

export interface ProductionInput {
  price: number;
  orderId: number | null;
  portions: number;
  productionDate: Date;
  shift: ProductionShift;
  deliveryTime: string;
  destination: string;
  note: string | null;
  /** Daily menu variation (1-based) and its dishes; null = cook from the package recipe. */
  menuVariation: number | null;
  dishNames: string[] | null;
}

export function parseProductionInput(form: FormData, now: Date): Result<ProductionInput> {
  const price = packagePrice(text(form, "packagePrice"));
  const orderRaw = text(form, "orderId");
  const orderId = orderRaw ? Number(orderRaw) : null;
  const portions = Number(text(form, "portions"));
  const productionDate = wibDayStart(text(form, "productionDate"));
  const shift = text(form, "shift") as ProductionShift;
  const deliveryTime = text(form, "deliveryTime");
  const destination = text(form, "destination");
  const note = text(form, "note").slice(0, 200) || null;

  if (!price) return { ok: false, error: "Pilih paket." };
  if (orderRaw && !(Number.isInteger(orderId) && orderId! > 0)) return { ok: false, error: "Pesanan tidak valid." };
  if (!Number.isInteger(portions) || portions < 1 || portions > MAX_PORTIONS) return { ok: false, error: `Porsi 1–${MAX_PORTIONS.toLocaleString("id-ID")}.` };
  if (!productionDate || productionDate < startOfWibDay(now)) return { ok: false, error: "Tanggal produksi tidak boleh sebelum hari ini." };
  if (!SHIFTS.includes(shift)) return { ok: false, error: "Pilih shift." };
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(deliveryTime)) return { ok: false, error: "Jam kirim berformat JJ:MM, misalnya 11:30." };
  if (destination.length < 3 || destination.length > 120) return { ok: false, error: "Tujuan kirim 3–120 karakter." };

  const variationRaw = text(form, "menuVariation");
  let menuVariation: number | null = null;
  let dishNames: string[] | null = null;
  if (variationRaw) {
    menuVariation = Number(variationRaw);
    dishNames = Number.isInteger(menuVariation) ? menuDishes(price, wibWeekday(productionDate), menuVariation) : null;
    if (!dishNames) return { ok: false, error: "Variasi menu tidak ada untuk paket dan hari produksi ini." };
  }

  return { ok: true, value: { price, orderId, portions, productionDate, shift, deliveryTime, destination, note, menuVariation, dishNames } };
}

export interface SafetyCheckInput {
  productionOrderId: number | null;
  /** Snapshot shown in the log, so later limit changes do not rewrite history. */
  point: string;
  reading: string;
  limit: string;
  ok: boolean;
  checkedBy: string;
  controlPoint: string | null;
  value: number | null;
  correctiveAction: string | null;
}

/**
 * A standard control point (`controlPoint` = its key) is judged by the server from `value`;
 * `controlPoint` empty or "custom" keeps the free-text check. A failed check needs a
 * corrective action.
 */
export function parseSafetyCheckInput(form: FormData): Result<SafetyCheckInput> {
  const productionRaw = text(form, "productionOrderId");
  const productionOrderId = productionRaw ? Number(productionRaw) : null;
  const key = text(form, "controlPoint");
  const checkedBy = text(form, "checkedBy");
  const correctiveAction = text(form, "correctiveAction").slice(0, 300) || null;

  if (productionRaw && !(Number.isInteger(productionOrderId) && productionOrderId! > 0)) return { ok: false, error: "Perintah produksi tidak valid." };
  if (checkedBy.length < 2 || checkedBy.length > 60) return { ok: false, error: "Isi siapa yang mengecek." };

  let check: Pick<SafetyCheckInput, "point" | "reading" | "limit" | "ok" | "controlPoint" | "value">;
  if (key && key !== "custom") {
    const cp = getControlPoint(key);
    if (!cp) return { ok: false, error: "Titik kendali tidak dikenal. Muat ulang halaman." };
    if (cp.scope === "production" && !productionOrderId) return { ok: false, error: `${cp.name} harus dikaitkan ke satu produksi.` };
    const raw = text(form, "value").replace(",", ".").replace("−", "-");
    if (!/^-?\d{1,3}(\.\d)?$/.test(raw)) return { ok: false, error: "Hasil ukur berupa angka, maksimal 1 desimal (contoh 3,5 atau -18)." };
    const value = Number(raw);
    check = {
      point: cp.name,
      reading: `${value.toLocaleString("id-ID").replace("-", "−")} ${cp.unit}`,
      limit: limitText(cp),
      ok: isWithinLimit(cp, value),
      controlPoint: cp.key,
      value,
    };
  } else {
    const point = text(form, "point");
    const reading = text(form, "reading");
    const limit = text(form, "limit");
    const result = text(form, "result");
    if (point.length < 3 || point.length > 80) return { ok: false, error: "Titik cek 3–80 karakter, misalnya Suhu chiller." };
    if (reading.length < 1 || reading.length > 40) return { ok: false, error: "Isi hasil ukur, misalnya 3 °C." };
    if (limit.length < 1 || limit.length > 40) return { ok: false, error: "Isi batas aman, misalnya 0–4 °C." };
    if (result !== "ok" && result !== "fail") return { ok: false, error: "Pilih sesuai atau perlu tindakan." };
    check = { point, reading, limit, ok: result === "ok", controlPoint: null, value: null };
  }

  if (!check.ok && (!correctiveAction || correctiveAction.length < 5)) {
    return { ok: false, error: "Hasil di luar batas: tulis tindakan koreksinya (minimal 5 karakter)." };
  }
  return { ok: true, value: { ...check, productionOrderId, checkedBy, correctiveAction: check.ok ? null : correctiveAction } };
}

export interface SampleInput {
  storageLocation: string;
  note: string | null;
}

export function parseSampleInput(form: FormData): Result<SampleInput> {
  const storageLocation = text(form, "storageLocation");
  const note = text(form, "note").slice(0, 200) || null;
  if (storageLocation.length < 3 || storageLocation.length > 60) return { ok: false, error: "Isi tempat sampel disimpan (3–60 karakter)." };
  return { ok: true, value: { storageLocation, note } };
}
