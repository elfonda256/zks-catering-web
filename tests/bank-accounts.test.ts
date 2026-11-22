import test from "node:test";
import assert from "node:assert/strict";
import { bankAccountsForWhatsApp, parseBankAccounts, validateBankAccounts } from "../src/modules/settings/bank-accounts.ts";

test("parseBankAccounts: data rusak dianggap belum diatur", () => {
  assert.deepEqual(parseBankAccounts(null), []);
  assert.deepEqual(parseBankAccounts("bukan json"), []);
  assert.deepEqual(parseBankAccounts('{"bank":"BCA"}'), []);
  assert.deepEqual(parseBankAccounts('[{"bank":"BCA","number":"123 456 7890","holder":"PT ZKS"},{"bank":1}]'), [
    { bank: "BCA", number: "123 456 7890", holder: "PT ZKS" },
  ]);
});

test("validateBankAccounts: baris kosong dilewati, nomor harus angka", () => {
  const result = validateBankAccounts([
    { bank: " BCA ", number: "123-456-7890", holder: "PT Zahdan Kamal Sentosa" },
    { bank: "", number: "", holder: "" },
  ]);
  assert.deepEqual(result, { ok: true, value: [{ bank: "BCA", number: "123-456-7890", holder: "PT Zahdan Kamal Sentosa" }] });
  assert.equal(validateBankAccounts([{ bank: "BCA", number: "12AB45", holder: "PT ZKS" }]).ok, false);
  assert.equal(validateBankAccounts([{ bank: "BCA", number: "1234567", holder: "" }]).ok, false);
});

test("bankAccountsForWhatsApp tidak menampilkan nomor contoh saat belum diatur", () => {
  assert.match(bankAccountsForWhatsApp([]), /akan dikirim admin/);
  assert.equal(bankAccountsForWhatsApp([{ bank: "BCA", number: "1234567", holder: "PT ZKS" }]), "• BCA : 1234567 a.n. PT ZKS\n");
});
