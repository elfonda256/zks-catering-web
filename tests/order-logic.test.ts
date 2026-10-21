import test from "node:test";
import assert from "node:assert/strict";
import {
  validateOrderLeadTime,
  generateOrderAccessToken,
  hashAccessToken,
  generateOrderCode,
  calculateSubtotal,
  calculateOrderLockValues,
} from "../src/lib/order-logic.ts";

test("validateOrderLeadTime: < 500 pcs memerlukan minimal H-1", () => {
  // Misal sekarang tanggal 20 Oktober 2026 pukul 10:00 WIB (UTC 03:00)
  const now = new Date("2026-10-20T03:00:00Z");

  // Hari ini (H-0) -> ditolak
  const sameDay = new Date("2026-10-20T11:00:00Z");
  const resSameDay = validateOrderLeadTime(sameDay, 100, now);
  assert.equal(resSameDay.valid, false);
  assert.match(resSameDay.error || "", /H-1/);

  // Besok (H-1) -> diterima
  const tomorrow = new Date("2026-10-21T03:00:00Z");
  const resTomorrow = validateOrderLeadTime(tomorrow, 100, now);
  assert.equal(resTomorrow.valid, true);

  // 3 hari lagi (H-3) -> diterima
  const in3Days = new Date("2026-10-23T03:00:00Z");
  const resIn3Days = validateOrderLeadTime(in3Days, 100, now);
  assert.equal(resIn3Days.valid, true);
});

test("validateOrderLeadTime: >= 500 pcs memerlukan minimal H-3", () => {
  const now = new Date("2026-10-20T03:00:00Z");

  // H-2 (22 Oktober) untuk 500 porsi -> ditolak
  const in2Days = new Date("2026-10-22T03:00:00Z");
  const resIn2Days = validateOrderLeadTime(in2Days, 500, now);
  assert.equal(resIn2Days.valid, false);
  assert.match(resIn2Days.error || "", /H-3/);

  // H-3 (23 Oktober) untuk 500 porsi -> diterima
  const in3Days = new Date("2026-10-23T03:00:00Z");
  const resIn3Days = validateOrderLeadTime(in3Days, 500, now);
  assert.equal(resIn3Days.valid, true);

  // H-5 (25 Oktober) untuk 1000 porsi -> diterima
  const in5Days = new Date("2026-10-25T03:00:00Z");
  const resIn5Days = validateOrderLeadTime(in5Days, 1000, now);
  assert.equal(resIn5Days.valid, true);
});

test("generateOrderAccessToken dan hashAccessToken menghasilkan hash SHA-256 yang valid", () => {
  const { rawToken, accessTokenHash } = generateOrderAccessToken();

  assert.equal(rawToken.length, 64);
  assert.match(rawToken, /^[0-9a-f]{64}$/);

  assert.equal(accessTokenHash.length, 64);
  assert.match(accessTokenHash, /^[0-9a-f]{64}$/);

  // Verifikasi hash ulang sama persis
  assert.equal(hashAccessToken(rawToken), accessTokenHash);

  // Dua pemanggilan menghasilkan token unik acak yang berbeda
  const second = generateOrderAccessToken();
  assert.notEqual(rawToken, second.rawToken);
  assert.notEqual(accessTokenHash, second.accessTokenHash);
});

test("generateOrderCode menghasilkan format ZKS-YYYYMMDD-XXXX yang benar", () => {
  const date = new Date("2026-10-20T03:00:00Z");
  const code = generateOrderCode(date);

  assert.match(code, /^ZKS-20261020-[0-9A-F]{4}$/);
});

test("calculateSubtotal menghitung nilai secara akurat dan menolak nilai negatif", () => {
  assert.equal(calculateSubtotal(17000, 50), 850000);
  assert.equal(calculateSubtotal(20000, 100), 2000000);
  assert.equal(calculateSubtotal(25000, 20), 500000);

  assert.throws(() => calculateSubtotal(-1000, 10));
  assert.throws(() => calculateSubtotal(1000, -5));
});

test("calculateOrderLockValues: menghitung total, DP 20%, dan batas bayar awal dengan akurat", () => {
  const eventDate = new Date("2026-10-25T04:00:00Z"); // 25 Oktober 11:00 WIB
  const confirmedAtH3 = new Date("2026-10-22T03:00:00Z"); // 22 Oktober 10:00 WIB (H-3)

  const resH3 = calculateOrderLockValues(2000000, 50000, eventDate, confirmedAtH3);
  assert.equal(resH3.totalAmount, 2050000);
  assert.equal(resH3.isEligibleForDp, true);
  assert.equal(resH3.dpAmount, 400000); // 20% dari 2.000.000
  // Batas bayar awal adalah confirmedAt + 24 jam (karena 23 Okt 10:00 WIB < 24 Okt 23:59 WIB)
  assert.equal(resH3.initialPaymentDueAt.getTime(), confirmedAtH3.getTime() + 24 * 60 * 60 * 1000);

  // Dikunci di H-1 (24 Oktober 10:00 WIB) -> Opsi DP tidak tersedia, hanya lunas penuh
  const confirmedAtH1 = new Date("2026-10-24T03:00:00Z");
  const resH1 = calculateOrderLockValues(2000000, 50000, eventDate, confirmedAtH1);
  assert.equal(resH1.totalAmount, 2050000);
  assert.equal(resH1.isEligibleForDp, false);
  assert.equal(resH1.dpAmount, null);
  // Batas bayar awal dipotong ke H-1 23:59:59 WIB (karena +24 jam melampaui H-1 23:59:59 WIB)
  assert.equal(resH1.initialPaymentDueAt.toISOString(), "2026-10-24T16:59:59.999Z");

  // Jika dikunci setelah H-1 23:59:59 WIB -> throws error
  const confirmedAtH0 = new Date("2026-10-25T01:00:00Z");
  assert.throws(
    () => calculateOrderLockValues(2000000, 50000, eventDate, confirmedAtH0),
    /Batas waktu konfirmasi pesanan/
  );
});

