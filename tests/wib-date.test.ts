import test from "node:test";
import assert from "node:assert/strict";
import { recentWibMonths, startOfWibDay, wibDateKey, wibMonthKey, wibMonthRange } from "../src/lib/wib-date.ts";

test("startOfWibDay: tengah malam WIB = 17.00 UTC hari sebelumnya", () => {
  const now = new Date("2026-11-22T01:00:00Z"); // 08.00 WIB, 22 Nov
  assert.equal(startOfWibDay(now).toISOString(), "2026-11-21T17:00:00.000Z");
  assert.equal(startOfWibDay(now, 1).toISOString(), "2026-11-22T17:00:00.000Z");
  // 23.30 WIB masih tanggal yang sama
  assert.equal(startOfWibDay(new Date("2026-11-22T16:30:00Z")).toISOString(), "2026-11-21T17:00:00.000Z");
});

test("wibDateKey dan wibMonthKey memakai kalender WIB", () => {
  assert.equal(wibDateKey(new Date("2026-11-30T17:30:00Z")), "2026-12-01");
  assert.equal(wibMonthKey(new Date("2026-11-30T17:30:00Z")), "2026-12");
});

test("wibMonthRange memberi awal dan akhir bulan dalam WIB", () => {
  const range = wibMonthRange("2026-12");
  assert.ok(range);
  assert.equal(range.start.toISOString(), "2026-11-30T17:00:00.000Z");
  assert.equal(range.end.toISOString(), "2026-12-31T17:00:00.000Z");
  assert.equal(wibMonthRange("2026-13"), null);
  assert.equal(wibMonthRange("Desember"), null);
});

test("recentWibMonths mundur melewati pergantian tahun", () => {
  const months = recentWibMonths(new Date("2026-01-31T18:00:00Z"), 3); // 1 Feb 2026 01.00 WIB
  assert.deepEqual(months.map((m) => m.key), ["2026-02", "2026-01", "2025-12"]);
  assert.equal(months[2].label, "Desember 2025");
});
