import test from "node:test";
import assert from "node:assert/strict";
import { canDeleteAdmin, validateNewPassword, validateUsername } from "../src/modules/users/validation.ts";

test("validateUsername membuang spasi tepi dan menolak karakter aneh", () => {
  assert.deepEqual(validateUsername("  Didiet "), { ok: true, value: "Didiet" });
  assert.equal(validateUsername("ab").ok, false);
  assert.equal(validateUsername("admin zks").ok, false);
});

test("validateNewPassword: minimal 12 karakter dan konfirmasi harus sama", () => {
  assert.equal(validateNewPassword("pendek", "pendek").ok, false);
  assert.equal(validateNewPassword("kata-sandi-panjang", "kata-sandi-beda!!").ok, false);
  assert.equal(validateNewPassword("kata-sandi-panjang", "kata-sandi-panjang").ok, true);
});

test("canDeleteAdmin: tidak bisa hapus diri sendiri atau admin terakhir", () => {
  assert.equal(canDeleteAdmin(1, 1, 3).ok, false);
  assert.equal(canDeleteAdmin(2, 1, 1).ok, false);
  assert.equal(canDeleteAdmin(2, 1, 2).ok, true);
});
