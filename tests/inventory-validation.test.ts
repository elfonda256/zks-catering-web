import test from "node:test";
import assert from "node:assert/strict";
import { parseIngredientInput, parseMovementInput, parseQuantity } from "../src/modules/inventory/validation.ts";

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

test("parseQuantity menerima koma dan titik, maksimal 3 desimal", () => {
  assert.equal(parseQuantity("1,5", { allowZero: false }), 1.5);
  assert.equal(parseQuantity("0.125", { allowZero: false }), 0.125);
  assert.equal(parseQuantity("2.1234", { allowZero: false }), null);
  assert.equal(parseQuantity("-1", { allowZero: false }), null);
  assert.equal(parseQuantity("abc", { allowZero: false }), null);
  assert.equal(parseQuantity("0", { allowZero: false }), null);
  assert.equal(parseQuantity("0", { allowZero: true }), 0);
});

test("parseMovementInput menentukan lokasi asal dan tujuan dari jenis mutasi", () => {
  const base = { ingredientId: "3", quantity: "10", locationId: "1" };

  const masuk = parseMovementInput(form({ ...base, type: "IN" }));
  assert.ok(masuk.ok && masuk.value.toLocationId === 1 && masuk.value.fromLocationId === null);

  const keluar = parseMovementInput(form({ ...base, type: "OUT" }));
  assert.ok(keluar.ok && keluar.value.fromLocationId === 1 && keluar.value.toLocationId === null);

  const transfer = parseMovementInput(form({ ...base, type: "TRANSFER", targetLocationId: "2" }));
  assert.ok(transfer.ok && transfer.value.fromLocationId === 1 && transfer.value.toLocationId === 2);

  const kurang = parseMovementInput(form({ ...base, type: "ADJUSTMENT", direction: "minus", note: "Susut" }));
  assert.ok(kurang.ok && kurang.value.fromLocationId === 1 && kurang.value.toLocationId === null);
});

test("parseMovementInput menolak input yang tidak masuk akal", () => {
  const base = { ingredientId: "3", quantity: "10", locationId: "1" };
  assert.equal(parseMovementInput(form({ ...base, type: "TRANSFER", targetLocationId: "1" })).ok, false);
  assert.equal(parseMovementInput(form({ ...base, type: "ADJUSTMENT", direction: "plus" })).ok, false, "penyesuaian wajib catatan");
  assert.equal(parseMovementInput(form({ ...base, type: "IN", quantity: "0" })).ok, false);
  assert.equal(parseMovementInput(form({ ...base, type: "DELETE" })).ok, false);
});

test("parseIngredientInput merapikan kode dan memeriksa field wajib", () => {
  const valid = {
    code: "brs-01",
    name: "Beras putih medium",
    typeId: "1",
    unit: "kg",
    locationId: "1",
    minStock: "200",
    lastPrice: "14500",
    supplierId: "",
  };
  const result = parseIngredientInput(form(valid));
  assert.ok(result.ok);
  assert.equal(result.ok && result.value.code, "BRS-01");
  assert.equal(result.ok && result.value.supplierId, null);

  assert.equal(parseIngredientInput(form({ ...valid, unit: "ton" })).ok, false);
  assert.equal(parseIngredientInput(form({ ...valid, lastPrice: "14.500" })).ok, false);
  assert.equal(parseIngredientInput(form({ ...valid, code: "X" })).ok, false);
});
