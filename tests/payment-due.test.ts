import test from "node:test";
import assert from "node:assert/strict";
import { getAmountDue, getPaidAmount, getPaymentDueAt } from "../src/app/pesanan/[token]/payment-due.ts";

const base = { totalAmount: 3_150_000, dpAmount: 600_000, payments: [] as { status: string; amount: number }[] };

test("getAmountDue: belum ada total (ongkir belum dikunci) berarti belum bisa bayar", () => {
  assert.equal(getAmountDue({ ...base, status: "WAITING_ADMIN_CONFIRMATION", totalAmount: null }), null);
});

test("getAmountDue: menunggu pembayaran menawarkan DP dan lunas", () => {
  assert.deepEqual(getAmountDue({ ...base, status: "CONFIRMED_AWAITING_PAYMENT" }), {
    kind: "initial",
    totalAmount: 3_150_000,
    dpAmount: 600_000,
  });
});

test("getAmountDue: setelah DP, sisa = total dikurangi pembayaran yang sudah diterima", () => {
  const payments = [
    { status: "SETTLED", amount: 600_000 },
    { status: "FAILED", amount: 600_000 },
  ];
  for (const status of ["DP_PAID", "IN_PREPARATION", "IN_DELIVERY"]) {
    assert.deepEqual(getAmountDue({ ...base, status, payments }), { kind: "settlement", remaining: 2_550_000 });
  }
});

test("getAmountDue: lunas, selesai, atau batal tidak bisa dibayar lagi", () => {
  const settled = [{ status: "SETTLED", amount: 3_150_000 }];
  assert.equal(getAmountDue({ ...base, status: "IN_PREPARATION", payments: settled }), null);
  for (const status of ["FULLY_PAID", "COMPLETED", "REJECTED_BY_ADMIN", "CANCELLED_DP_FORFEITED"]) {
    assert.equal(getAmountDue({ ...base, status }), null);
  }
});

test("getPaidAmount hanya menghitung pembayaran berstatus SETTLED", () => {
  assert.equal(
    getPaidAmount({
      payments: [
        { status: "SETTLED", amount: 600_000 },
        { status: "PENDING", amount: 2_550_000 },
        { status: "FAILED", amount: 100 },
      ],
    }),
    600_000
  );
});

test("getPaymentDueAt memilih batas yang benar dan mengabaikan batas yang sudah lewat", () => {
  const now = new Date("2026-11-22T00:00:00Z");
  const deadlines = { initial: new Date("2026-11-23T00:00:00Z"), settlement: new Date("2026-11-25T16:59:59Z") };
  assert.equal(getPaymentDueAt({ kind: "initial", totalAmount: 1, dpAmount: null }, deadlines, now), "2026-11-23T00:00:00.000Z");
  assert.equal(getPaymentDueAt({ kind: "settlement", remaining: 1 }, deadlines, now), "2026-11-25T16:59:59.000Z");
  assert.equal(getPaymentDueAt({ kind: "initial", totalAmount: 1, dpAmount: null }, deadlines, new Date("2026-11-24T00:00:00Z")), null);
  assert.equal(getPaymentDueAt(null, deadlines, now), null);
});
