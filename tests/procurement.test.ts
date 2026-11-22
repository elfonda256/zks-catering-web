import test from "node:test";
import assert from "node:assert/strict";
import { documentCode, lineTotal, orderStatusFromLines, receiptError, remainingQuantity } from "../src/modules/procurement/documents.ts";
import { parseDecisionInput, parseLines, parseOrderInput, parseReceiptInput, parseRequestInput } from "../src/modules/procurement/validation.ts";
import { wibDayStart } from "../src/lib/wib-date.ts";

function form(entries: [string, string][]): FormData {
  const data = new FormData();
  for (const [key, value] of entries) data.append(key, value);
  return data;
}

// 22 Nov 2026, 10:00 WIB
const NOW = new Date("2026-11-22T03:00:00Z");

test("documentCode dan lineTotal", () => {
  assert.equal(documentCode("PO", 7), "PO-0007");
  assert.equal(documentCode("GRN", 12345), "GRN-12345");
  assert.equal(lineTotal([{ quantity: 1.5, unitPrice: 36000 }, { quantity: 3, unitPrice: 1500 }]), 58500);
});

test("wibDayStart memakai tengah malam WIB dan menolak tanggal mustahil", () => {
  assert.equal(wibDayStart("2026-11-23")?.toISOString(), "2026-11-22T17:00:00.000Z");
  assert.equal(wibDayStart("2026-02-30"), null);
  assert.equal(wibDayStart("23-11-2026"), null);
});

test("parseLines melewati baris kosong, menolak bahan ganda dan harga rusak", () => {
  const ok = parseLines(
    form([
      ["lineIngredient", "3"], ["lineQuantity", "2,5"], ["linePrice", "36000"],
      ["lineIngredient", ""], ["lineQuantity", ""], ["linePrice", ""],
    ]),
    { withPrice: true }
  );
  assert.deepEqual(ok, { ok: true, value: [{ ingredientId: 3, quantity: 2.5, unitPrice: 36000 }] });

  const dup = parseLines(form([["lineIngredient", "3"], ["lineQuantity", "1"], ["lineIngredient", "3"], ["lineQuantity", "2"]]), { withPrice: false });
  assert.equal(dup.ok, false);
  assert.equal(parseLines(form([["lineIngredient", "3"], ["lineQuantity", "1"], ["linePrice", "36.000"]]), { withPrice: true }).ok, false);
  assert.equal(parseLines(form([]), { withPrice: false }).ok, false);
});

test("parseRequestInput menolak tanggal kemarin", () => {
  const base: [string, string][] = [["requestedBy", "Kepala dapur"], ["reason", "Stok ayam menipis"], ["lineIngredient", "1"], ["lineQuantity", "10"]];
  assert.ok(parseRequestInput(form([...base, ["neededBy", "2026-11-22"]]), NOW).ok);
  assert.equal(parseRequestInput(form([...base, ["neededBy", "2026-11-21"]]), NOW).ok, false);
});

test("parseDecisionInput: penolakan wajib beralasan", () => {
  assert.deepEqual(parseDecisionInput(form([["decision", "approve"]])), { ok: true, value: { approve: true, note: null } });
  assert.equal(parseDecisionInput(form([["decision", "reject"]])).ok, false);
  assert.ok(parseDecisionInput(form([["decision", "reject"], ["decisionNote", "Stok masih cukup"]])).ok);
});

test("parseOrderInput: supplier wajib, jadwal kirim opsional", () => {
  const lines: [string, string][] = [["lineIngredient", "1"], ["lineQuantity", "10"], ["linePrice", "14500"]];
  const ok = parseOrderInput(form([["supplierId", "2"], ...lines]), NOW);
  assert.ok(ok.ok && ok.value.expectedDate === null && ok.value.requestId === null);
  assert.equal(parseOrderInput(form(lines), NOW).ok, false);
  assert.equal(parseOrderInput(form([["supplierId", "2"], ["expectedDate", "2026-11-01"], ...lines]), NOW).ok, false);
});

test("parseReceiptInput: baris nol dilewati, barang ditolak wajib beralasan", () => {
  const base: [string, string][] = [["orderId", "5"], ["locationId", "2"], ["receiptLine", "11"], ["receiptLine", "12"]];
  const ok = parseReceiptInput(form([...base, ["accepted:11", "10"], ["accepted:12", "0"]]));
  assert.deepEqual(ok.ok && ok.value.lines, [{ orderLineId: 11, accepted: 10, rejected: 0, note: null }]);
  assert.equal(parseReceiptInput(form([...base, ["accepted:11", "8"], ["rejected:11", "2"]])).ok, false);
  assert.ok(parseReceiptInput(form([...base, ["accepted:11", "8"], ["rejected:11", "2"], ["lineNote:11", "Layu"]])).ok);
  assert.equal(parseReceiptInput(form(base)).ok, false);
});

test("receiptError menolak penerimaan melebihi sisa PO", () => {
  const lines = [{ id: 1, quantity: 10, receivedQuantity: 4, ingredientName: "Ayam" }];
  assert.equal(remainingQuantity(lines[0]), 6);
  assert.equal(receiptError(lines, [{ orderLineId: 1, accepted: 6 }]), null);
  assert.match(receiptError(lines, [{ orderLineId: 1, accepted: 6.5 }]) ?? "", /melebihi sisa/);
  assert.match(receiptError(lines, [{ orderLineId: 9, accepted: 1 }]) ?? "", /bukan milik/);
});

test("orderStatusFromLines mengikuti jumlah yang diterima", () => {
  assert.equal(orderStatusFromLines([{ quantity: 10, receivedQuantity: 0 }]), "SENT");
  assert.equal(orderStatusFromLines([{ quantity: 10, receivedQuantity: 10 }, { quantity: 2, receivedQuantity: 1 }]), "PARTIALLY_RECEIVED");
  assert.equal(orderStatusFromLines([{ quantity: 0.3, receivedQuantity: 0.1 + 0.2 }]), "RECEIVED");
});
