import test from "node:test";
import assert from "node:assert/strict";
import { newOrderWhatsAppText, parseOrderDetails } from "../src/lib/order-form.ts";
import { isDirectOrderSource } from "../src/modules/sales/sources.ts";

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

// 22 Nov 2026, 10:00 WIB
const NOW = new Date("2026-11-22T03:00:00Z");
const BASE = {
  customerName: "PT Contoh Industri",
  customerPhone: "0812-3456-7890",
  customerAddress: "Kawasan KIIC Jl. Permata Raya, Karawang",
  packagePrice: "20000",
  quantity: "120",
  eventDate: "2026-11-24",
  eventTime: "12:00",
};

test("parseOrderDetails mengubah jam WIB ke UTC dan merapikan opsional", () => {
  const result = parseOrderDetails(form(BASE), NOW);
  assert.ok(result.ok);
  assert.equal(result.value.eventDate.toISOString(), "2026-11-24T05:00:00.000Z");
  assert.equal(result.value.customerEmail, null);
  assert.equal(result.value.notes, null);
});

test("parseOrderDetails menolak paket asing, porsi kurang, dan tanggal terlalu dekat", () => {
  assert.equal(parseOrderDetails(form({ ...BASE, packagePrice: "1000" }), NOW).ok, false);
  assert.equal(parseOrderDetails(form({ ...BASE, quantity: "5" }), NOW).ok, false);
  assert.equal(parseOrderDetails(form({ ...BASE, customerPhone: "12" }), NOW).ok, false);
  // 600 porsi butuh H-3
  assert.equal(parseOrderDetails(form({ ...BASE, quantity: "600", eventDate: "2026-11-24" }), NOW).ok, false);
  assert.ok(parseOrderDetails(form({ ...BASE, quantity: "600", eventDate: "2026-11-25" }), NOW).ok);
});

test("newOrderWhatsAppText memuat kode, paket, dan tautan pelacakan", () => {
  const text = newOrderWhatsAppText({
    customerName: "Bu Sari",
    orderCode: "ZKS-20261124-AB12",
    packageName: "Paket Favorit Korporat",
    quantity: 120,
    subtotal: 2_400_000,
    customerAddress: "KIIC",
    trackingUrl: "https://contoh.test/pesanan/abc",
  });
  assert.match(text, /ZKS-20261124-AB12/);
  assert.match(text, /Rp2\.400\.000/);
  assert.match(text, /https:\/\/contoh\.test\/pesanan\/abc/);
});

test("isDirectOrderSource hanya menerima sumber pesanan langsung", () => {
  assert.ok(isDirectOrderSource("WHATSAPP"));
  assert.equal(isDirectOrderSource("ONLINE"), false);
});
