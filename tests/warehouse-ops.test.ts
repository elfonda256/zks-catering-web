import test from "node:test";
import assert from "node:assert/strict";
import { parseOpnameInput } from "../src/modules/inventory/validation.ts";
import { opnameAdjustments, opnameReference } from "../src/modules/inventory/opname.ts";
import { parseSupplierInput } from "../src/modules/supplier/validation.ts";

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

test("parseOpnameInput melewati baris kosong dan menerima hitungan 0", () => {
  const result = parseOpnameInput(form({ locationId: "2", "count:5": "1,5", "count:6": "", "count:7": "0" }));
  assert.ok(result.ok);
  assert.deepEqual(result.value.counts, [
    { ingredientId: 5, counted: 1.5 },
    { ingredientId: 7, counted: 0 },
  ]);
  assert.equal(result.value.note, null);
});

test("parseOpnameInput menolak lembar tanpa lokasi, tanpa hitungan, atau angka rusak", () => {
  assert.equal(parseOpnameInput(form({ "count:5": "1" })).ok, false);
  assert.equal(parseOpnameInput(form({ locationId: "2", "count:5": "" })).ok, false);
  assert.equal(parseOpnameInput(form({ locationId: "2", "count:5": "-3" })).ok, false);
  assert.equal(parseOpnameInput(form({ locationId: "2", "count:5": "1.2345" })).ok, false);
});

test("opnameAdjustments hanya membuat koreksi untuk bahan yang berselisih", () => {
  const system = new Map([
    [1, 10],
    [2, 4.2],
    [3, 0.1 + 0.2],
  ]);
  const result = opnameAdjustments(
    [
      { ingredientId: 1, counted: 10 },
      { ingredientId: 2, counted: 3.7 },
      { ingredientId: 3, counted: 0.3 },
      { ingredientId: 4, counted: 2 },
    ],
    system
  );
  assert.deepEqual(result, [
    { ingredientId: 2, quantity: 0.5, direction: "minus" },
    { ingredientId: 4, quantity: 2, direction: "plus" },
  ]);
});

test("opnameReference memakai jam WIB dan kode lokasi", () => {
  assert.equal(opnameReference(new Date("2026-11-22T17:05:09Z"), "chiller"), "OPN-20261123-000509-CHILLER");
  assert.ok(opnameReference(new Date(), "gudang-kering").length <= 40);
});

test("parseSupplierInput merapikan spasi dan memeriksa telepon", () => {
  const ok = parseSupplierInput(form({ name: "  CV  Sumber Pangan ", phone: "0812-3456-7890", isActive: "on" }));
  assert.ok(ok.ok);
  assert.equal(ok.value.name, "CV Sumber Pangan");
  assert.equal(ok.value.isActive, true);
  assert.equal(ok.value.area, null);

  const inactive = parseSupplierInput(form({ name: "Toko Tani" }));
  assert.ok(inactive.ok && inactive.value.isActive === false);

  assert.equal(parseSupplierInput(form({ name: "A" })).ok, false);
  assert.equal(parseSupplierInput(form({ name: "Toko Tani", phone: "abc" })).ok, false);
});
