import test from "node:test";
import assert from "node:assert/strict";
import { paymentsToCsv } from "../src/modules/finance/csv.ts";

test("paymentsToCsv: kolom dikutip, jam dalam WIB, rumus spreadsheet dinetralkan", () => {
  const csv = paymentsToCsv([
    {
      id: 1,
      orderCode: "ZKS-20261122-AB12",
      customerName: '=HYPERLINK("x"), PT "Maju"',
      paymentType: "DP",
      amount: 600000,
      channel: "BCA",
      createdAt: "2026-11-22T01:00:00Z",
      settledAt: "2026-11-22T03:30:00Z",
    },
  ]);
  const [header, row] = csv.split("\r\n");
  assert.equal(header, '"Diterima (WIB)","Kode pesanan","Pelanggan","Jenis","Nominal","Bank pengirim"');
  assert.equal(row, '"2026-11-22 10:30","ZKS-20261122-AB12","\'=HYPERLINK(""x""), PT ""Maju""","DP 20%","600000","BCA"');
});
