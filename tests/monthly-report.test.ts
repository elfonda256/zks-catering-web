import test from "node:test";
import assert from "node:assert/strict";
import { buildMonthlyReport, type ReportOrder } from "../src/modules/reports/monthly-report.ts";

const order = (overrides: Partial<ReportOrder>): ReportOrder => ({
  status: "COMPLETED",
  customerName: "PT A",
  totalPcs: 100,
  totalAmount: 1_800_000,
  subtotal: 1_700_000,
  items: [{ packageName: "Paket Hemat Industri", quantity: 100, subtotal: 1_700_000 }],
  ...overrides,
});

test("buildMonthlyReport hanya menghitung pesanan yang berjalan, batal dihitung terpisah", () => {
  const report = buildMonthlyReport(
    [
      order({}),
      order({ customerName: "PT B", totalPcs: 50, totalAmount: 1_100_000, subtotal: 1_000_000, items: [{ packageName: "Paket Favorit Korporat", quantity: 50, subtotal: 1_000_000 }] }),
      order({ customerName: "PT A", status: "DP_PAID", totalPcs: 20, totalAmount: 400_000, items: [{ packageName: "Paket Hemat Industri", quantity: 20, subtotal: 340_000 }] }),
      order({ status: "REJECTED_BY_ADMIN" }),
      order({ status: "WAITING_ADMIN_CONFIRMATION" }),
    ],
    [600_000, 1_100_000]
  );

  assert.equal(report.orders, 3);
  assert.equal(report.portions, 170);
  assert.equal(report.orderValue, 3_300_000);
  assert.equal(report.averageOrderValue, 1_100_000);
  assert.equal(report.received, 1_700_000);
  assert.equal(report.cancelled, 1);
  assert.equal(report.cancelRate, 0.25);
  assert.deepEqual(report.packages[0], { name: "Paket Hemat Industri", portions: 120, value: 2_040_000 });
  assert.deepEqual(report.topCustomers[0], { name: "PT A", orders: 2, value: 2_200_000 });
});

test("buildMonthlyReport bulan kosong tidak membagi dengan nol", () => {
  const report = buildMonthlyReport([], []);
  assert.equal(report.averageOrderValue, 0);
  assert.equal(report.cancelRate, 0);
});
