/**
 * Input validation for the inventory server actions. Pure functions so they can be unit tested.
 * Every value comes from the browser, so nothing here is trusted until it passes.
 */

import type { MovementType } from "./types";

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const MAX_DECIMALS = 3;
const UNITS = ["kg", "gram", "liter", "ml", "pcs", "papan", "ikat", "butir", "pack", "botol", "karung"] as const;

export const INGREDIENT_UNITS: readonly string[] = UNITS;

function text(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

function positiveInt(value: string): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/** Non-negative quantity with at most three decimals; accepts "1,5" as well as "1.5". */
export function parseQuantity(raw: string, { allowZero }: { allowZero: boolean }): number | null {
  const normalized = raw.replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null;
  const n = Number(normalized);
  const decimals = normalized.split(".")[1]?.length ?? 0;
  if (!Number.isFinite(n) || decimals > MAX_DECIMALS) return null;
  if (n === 0 && !allowZero) return null;
  return n;
}

export interface IngredientInput {
  code: string;
  name: string;
  typeId: number;
  unit: string;
  locationId: number;
  minStock: number;
  lastPrice: number;
  supplierId: number | null;
}

export function parseIngredientInput(form: FormData): Result<IngredientInput> {
  const code = text(form, "code").toUpperCase();
  const name = text(form, "name");
  const unit = text(form, "unit");
  const typeId = positiveInt(text(form, "typeId"));
  const locationId = positiveInt(text(form, "locationId"));
  const minStock = parseQuantity(text(form, "minStock") || "0", { allowZero: true });
  const priceRaw = text(form, "lastPrice") || "0";
  const lastPrice = /^\d+$/.test(priceRaw) ? Number(priceRaw) : null;
  const supplierRaw = text(form, "supplierId");
  const supplierId = supplierRaw ? positiveInt(supplierRaw) : null;

  if (!/^[A-Z0-9-]{3,20}$/.test(code)) return { ok: false, error: "Kode 3–20 karakter: huruf, angka, atau tanda hubung (contoh BRS-01)." };
  if (name.length < 2 || name.length > 80) return { ok: false, error: "Nama bahan 2–80 karakter." };
  if (!typeId) return { ok: false, error: "Pilih kategori dan jenis bahan." };
  if (!UNITS.includes(unit as (typeof UNITS)[number])) return { ok: false, error: "Pilih satuan dari daftar." };
  if (!locationId) return { ok: false, error: "Pilih lokasi simpan." };
  if (minStock === null) return { ok: false, error: "Stok minimum berupa angka, maksimal 3 desimal." };
  if (lastPrice === null || lastPrice > 100_000_000) return { ok: false, error: "Harga terakhir berupa angka rupiah tanpa titik." };
  if (supplierRaw && !supplierId) return { ok: false, error: "Supplier tidak valid." };

  return { ok: true, value: { code, name, typeId, unit, locationId, minStock, lastPrice, supplierId } };
}

export interface MovementInput {
  ingredientId: number;
  type: MovementType;
  quantity: number;
  fromLocationId: number | null;
  toLocationId: number | null;
  reference: string | null;
  note: string | null;
}

const MOVEMENT_TYPES: MovementType[] = ["IN", "OUT", "TRANSFER", "ADJUSTMENT"];

export function parseMovementInput(form: FormData): Result<MovementInput> {
  const type = text(form, "type") as MovementType;
  const ingredientId = positiveInt(text(form, "ingredientId"));
  const quantity = parseQuantity(text(form, "quantity"), { allowZero: false });
  const locationId = positiveInt(text(form, "locationId"));
  const targetId = positiveInt(text(form, "targetLocationId"));
  const direction = text(form, "direction");
  const reference = text(form, "reference").slice(0, 40) || null;
  const note = text(form, "note").slice(0, 200) || null;

  if (!MOVEMENT_TYPES.includes(type)) return { ok: false, error: "Pilih jenis mutasi." };
  if (!ingredientId) return { ok: false, error: "Pilih bahan." };
  if (quantity === null) return { ok: false, error: "Jumlah harus lebih dari 0, maksimal 3 desimal." };
  if (!locationId) return { ok: false, error: "Pilih lokasi." };

  let fromLocationId: number | null = null;
  let toLocationId: number | null = null;
  switch (type) {
    case "IN":
      toLocationId = locationId;
      break;
    case "OUT":
      fromLocationId = locationId;
      break;
    case "TRANSFER":
      if (!targetId) return { ok: false, error: "Pilih lokasi tujuan." };
      if (targetId === locationId) return { ok: false, error: "Lokasi asal dan tujuan harus berbeda." };
      fromLocationId = locationId;
      toLocationId = targetId;
      break;
    case "ADJUSTMENT":
      if (direction !== "plus" && direction !== "minus") return { ok: false, error: "Pilih tambah atau kurangi." };
      if (!note) return { ok: false, error: "Penyesuaian stok wajib diberi catatan alasannya." };
      if (direction === "plus") toLocationId = locationId;
      else fromLocationId = locationId;
      break;
  }

  return { ok: true, value: { ingredientId, type, quantity, fromLocationId, toLocationId, reference, note } };
}

export interface OpnameInput {
  locationId: number;
  note: string | null;
  /** Physical counts entered by the admin; ingredients left blank are not counted. */
  counts: { ingredientId: number; counted: number }[];
}

const COUNT_FIELD = /^count:(\d+)$/;

/** Reads a count sheet: `locationId`, optional `note`, and one `count:<ingredientId>` field per row. */
export function parseOpnameInput(form: FormData): Result<OpnameInput> {
  const locationId = positiveInt(text(form, "locationId"));
  const note = text(form, "note").slice(0, 200) || null;
  if (!locationId) return { ok: false, error: "Pilih lokasi yang dihitung." };

  const counts: OpnameInput["counts"] = [];
  for (const [key, raw] of form.entries()) {
    const match = COUNT_FIELD.exec(key);
    const value = String(raw).trim();
    if (!match || value === "") continue;
    const counted = parseQuantity(value, { allowZero: true });
    if (counted === null) return { ok: false, error: `Hasil hitung "${value}" tidak valid. Pakai angka, maksimal 3 desimal.` };
    counts.push({ ingredientId: Number(match[1]), counted });
  }

  if (counts.length === 0) return { ok: false, error: "Isi hasil hitung fisik minimal satu bahan." };
  return { ok: true, value: { locationId, note, counts } };
}
