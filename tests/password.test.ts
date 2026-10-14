import test from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../src/lib/password.ts";

test("hashPassword lalu verifyPassword berhasil dengan kata sandi benar", async () => {
  const password = "RahasiaAdmin123!#";
  const hash = await hashPassword(password);

  assert.ok(hash.startsWith("$scrypt$N=131072,r=8,p=1$"));
  const isValid = await verifyPassword(password, hash);
  assert.equal(isValid, true);
});

test("verifyPassword gagal dengan kata sandi salah", async () => {
  const password = "PasswordAdminBenar!";
  const wrongPassword = "PasswordAdminSalah!";
  const hash = await hashPassword(password);

  const isValid = await verifyPassword(wrongPassword, hash);
  assert.equal(isValid, false);
});

test("verifyPassword mengembalikan false untuk string hash rusak / tidak valid", async () => {
  const password = "AdminPassword2026!";

  // Format tidak cocok
  assert.equal(await verifyPassword(password, "bukan-hash-scrypt"), false);
  assert.equal(await verifyPassword(password, ""), false);
  assert.equal(await verifyPassword(password, "$2b$12$e8Yh76t..."), false);

  // Parameter di luar batas wajar (misal N = 10, bukan pangkat dua)
  assert.equal(await verifyPassword(password, "$scrypt$N=10,r=8,p=1$0123456789abcdef0123456789abcdef$012345"), false);

  // Parameter N terlalu besar melebihi batas (DoS protection)
  assert.equal(await verifyPassword(password, "$scrypt$N=2097152,r=8,p=1$0123456789abcdef0123456789abcdef$012345"), false);

  // Salt rusak (panjang ganjil / bukan hex)
  assert.equal(await verifyPassword(password, "$scrypt$N=131072,r=8,p=1$saltpendek$0123456789abcdef"), false);
});

test("dua hash dari kata sandi yang sama menghasilkan string berbeda (salt acak unik)", async () => {
  const password = "KataSandiIdentik123";
  const hash1 = await hashPassword(password);
  const hash2 = await hashPassword(password);

  assert.notEqual(hash1, hash2);
  assert.equal(await verifyPassword(password, hash1), true);
  assert.equal(await verifyPassword(password, hash2), true);
});
