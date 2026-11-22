import test from "node:test";
import assert from "node:assert/strict";
import { canAdvanceStatus, statusAfterPaymentApproval } from "../src/modules/dashboard/services/order-status.ts";

test("canAdvanceStatus: hanya maju satu langkah, DP boleh langsung dimasak", () => {
  assert.equal(canAdvanceStatus("DP_PAID", "IN_PREPARATION"), true);
  assert.equal(canAdvanceStatus("FULLY_PAID", "IN_PREPARATION"), true);
  assert.equal(canAdvanceStatus("IN_PREPARATION", "IN_DELIVERY"), true);
  assert.equal(canAdvanceStatus("IN_DELIVERY", "COMPLETED"), true);

  assert.equal(canAdvanceStatus("CONFIRMED_AWAITING_PAYMENT", "FULLY_PAID"), false, "lunas hanya lewat verifikasi bayar");
  assert.equal(canAdvanceStatus("IN_PREPARATION", "COMPLETED"), false, "tidak boleh melompati tahap");
  assert.equal(canAdvanceStatus("IN_DELIVERY", "IN_PREPARATION"), false, "tidak boleh mundur");
  assert.equal(canAdvanceStatus("COMPLETED", "IN_DELIVERY"), false);
});

test("statusAfterPaymentApproval: pembayaran pertama", () => {
  assert.equal(statusAfterPaymentApproval("CONFIRMED_AWAITING_PAYMENT", "DP"), "DP_PAID");
  assert.equal(statusAfterPaymentApproval("CONFIRMED_AWAITING_PAYMENT", "FULL"), "FULLY_PAID");
});

test("statusAfterPaymentApproval: pelunasan tidak memundurkan pesanan yang sudah di dapur", () => {
  assert.equal(statusAfterPaymentApproval("DP_PAID", "SETTLEMENT"), "FULLY_PAID");
  assert.equal(statusAfterPaymentApproval("IN_PREPARATION", "SETTLEMENT"), "IN_PREPARATION");
  assert.equal(statusAfterPaymentApproval("IN_DELIVERY", "SETTLEMENT"), "IN_DELIVERY");
  assert.equal(statusAfterPaymentApproval("COMPLETED", "SETTLEMENT"), "COMPLETED");
  assert.equal(statusAfterPaymentApproval("FULLY_PAID", "DP"), "FULLY_PAID");
});

test("statusAfterPaymentApproval: pesanan batal atau kedaluwarsa tidak bisa dibayar", () => {
  for (const status of ["REJECTED_BY_ADMIN", "EXPIRED_PAYMENT_TIMEOUT", "CANCELLED_BY_CUSTOMER", "REFUNDED"] as const) {
    assert.equal(statusAfterPaymentApproval(status, "FULL"), null);
  }
});
