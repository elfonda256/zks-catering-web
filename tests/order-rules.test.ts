import test from "node:test";
import assert from "node:assert/strict";
import { earliestEventDateWib, minLeadDays, LARGE_ORDER_PCS } from "../src/lib/order-rules.ts";

test("minLeadDays: H-1 di bawah 500 porsi, H-3 mulai 500 porsi", () => {
  assert.equal(minLeadDays(20), 1);
  assert.equal(minLeadDays(LARGE_ORDER_PCS - 1), 1);
  assert.equal(minLeadDays(LARGE_ORDER_PCS), 3);
  assert.equal(minLeadDays(1200), 3);
});

test("earliestEventDateWib memakai tanggal kalender WIB, bukan UTC", () => {
  // 21 Nov 2026 pukul 23.30 WIB = 16.30 UTC; tanggal WIB masih 21 Nov.
  const lateEvening = new Date("2026-11-21T16:30:00Z");
  assert.equal(earliestEventDateWib(100, lateEvening), "2026-11-22");
  assert.equal(earliestEventDateWib(600, lateEvening), "2026-11-24");

  // 22 Nov 2026 pukul 00.30 WIB = 21 Nov 17.30 UTC; tanggal WIB sudah 22 Nov.
  const afterMidnight = new Date("2026-11-21T17:30:00Z");
  assert.equal(earliestEventDateWib(100, afterMidnight), "2026-11-23");
});

test("earliestEventDateWib melewati batas bulan dan tahun", () => {
  assert.equal(earliestEventDateWib(100, new Date("2026-12-31T03:00:00Z")), "2027-01-01");
  assert.equal(earliestEventDateWib(500, new Date("2026-11-29T03:00:00Z")), "2026-12-02");
});
