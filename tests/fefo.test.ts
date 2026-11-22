import test from "node:test";
import assert from "node:assert/strict";
import { allocateFefo, daysUntilExpiry, type BatchBucket } from "../src/modules/inventory/fefo.ts";
import { parseBatchInput, parseMovementInput } from "../src/modules/inventory/validation.ts";
import { parseReceiptInput } from "../src/modules/procurement/validation.ts";

// 22 Nov 2026, 10:00 WIB
const NOW = new Date("2026-11-22T03:00:00Z");

const bucket = (batchId: number | null, quantity: number, expiresAt: string | null, createdAt = "2026-11-01T00:00:00Z"): BatchBucket => ({
  batchId,
  quantity,
  expiresAt,
  createdAt,
});

test("allocateFefo mengambil yang paling cepat kedaluwarsa, lalu tanpa tanggal", () => {
  const buckets = [
    bucket(3, 10, null, "2026-11-10T00:00:00Z"),
    bucket(1, 4, "2026-11-25T00:00:00Z"),
    bucket(2, 5, "2026-11-23T00:00:00Z"),
    bucket(null, 2, null),
  ];
  assert.deepEqual(allocateFefo(buckets, 10), {
    ok: true,
    allocations: [
      { batchId: 2, quantity: 5 },
      { batchId: 1, quantity: 4 },
      { batchId: null, quantity: 1 },
    ],
  });
});

test("allocateFefo melaporkan stok tersedia bila kurang, dan mengabaikan saldo nol", () => {
  assert.deepEqual(allocateFefo([bucket(1, 1.25, null), bucket(2, 0, "2026-11-23T00:00:00Z")], 2), { ok: false, available: 1.25 });
  assert.deepEqual(allocateFefo([bucket(1, 0.1 + 0.2, null)], 0.3), { ok: true, allocations: [{ batchId: 1, quantity: 0.3 }] });
});

test("daysUntilExpiry memakai hari kalender WIB", () => {
  assert.equal(daysUntilExpiry("2026-11-22T17:00:00Z", NOW), 1); // 23 Nov WIB
  assert.equal(daysUntilExpiry("2026-11-21T17:00:00Z", NOW), 0);
  assert.equal(daysUntilExpiry("2026-11-20T17:00:00Z", NOW), -1);
});

test("parseBatchInput: opsional, menolak tanggal rusak dan barang kedaluwarsa", () => {
  assert.deepEqual(parseBatchInput("", "", NOW), { ok: true, value: null });
  const ok = parseBatchInput(" LOT-77 ", "2026-11-25", NOW);
  assert.ok(ok.ok && ok.value?.code === "LOT-77" && ok.value.expiresAt?.toISOString() === "2026-11-24T17:00:00.000Z");
  assert.equal(parseBatchInput("", "2026-11-21", NOW).ok, false);
  assert.equal(parseBatchInput("", "2026-02-30", NOW).ok, false);
});

test("batch hanya dibaca untuk mutasi masuk dan baris yang diterima", () => {
  const form = (entries: [string, string][]) => {
    const data = new FormData();
    for (const [k, v] of entries) data.append(k, v);
    return data;
  };
  const masuk = parseMovementInput(form([["type", "IN"], ["ingredientId", "1"], ["quantity", "5"], ["locationId", "2"], ["batchCode", "LOT-1"]]), NOW);
  assert.ok(masuk.ok && masuk.value.batch?.code === "LOT-1");
  const keluar = parseMovementInput(form([["type", "OUT"], ["ingredientId", "1"], ["quantity", "5"], ["locationId", "2"], ["batchCode", "LOT-1"]]), NOW);
  assert.ok(keluar.ok && keluar.value.batch === null);

  const receipt = parseReceiptInput(
    form([["orderId", "5"], ["locationId", "2"], ["receiptLine", "11"], ["accepted:11", "10"], ["expiresAt:11", "2026-11-24"]]),
    NOW
  );
  assert.ok(receipt.ok && receipt.value.lines[0].batch?.expiresAt?.toISOString() === "2026-11-23T17:00:00.000Z");
  assert.equal(parseReceiptInput(form([["orderId", "5"], ["locationId", "2"], ["receiptLine", "11"], ["receiptLine", "11"], ["accepted:11", "1"]]), NOW).ok, false);
});
