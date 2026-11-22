import test from "node:test";
import assert from "node:assert/strict";
import { costPerPortion, isBeforeCooking, materialRequirements, nextProductionStatus, productionCode } from "../src/modules/production/rules.ts";
import { parseProductionInput, parseRecipeInput, parseSafetyCheckInput } from "../src/modules/production/validation.ts";

function form(entries: [string, string][]): FormData {
  const data = new FormData();
  for (const [key, value] of entries) data.append(key, value);
  return data;
}

// 22 Nov 2026, 10:00 WIB
const NOW = new Date("2026-11-22T03:00:00Z");

test("status produksi maju satu langkah; batal hanya sebelum masak", () => {
  assert.equal(nextProductionStatus("SCHEDULED"), "PREPARING");
  assert.equal(nextProductionStatus("PREPARING"), "COOKING");
  assert.equal(nextProductionStatus("PACKING"), "READY");
  assert.equal(nextProductionStatus("READY"), null);
  assert.equal(nextProductionStatus("CANCELLED"), null);
  assert.ok(isBeforeCooking("PREPARING"));
  assert.equal(isBeforeCooking("COOKING"), false);
  assert.equal(productionCode(42), "WO-0042");
});

test("materialRequirements mengalikan resep per porsi dan membulatkan 3 desimal", () => {
  assert.deepEqual(
    materialRequirements(
      [
        { ingredientId: 1, quantityPerPortion: 0.12 },
        { ingredientId: 2, quantityPerPortion: 0.005 },
      ],
      350
    ),
    [
      { ingredientId: 1, quantity: 42 },
      { ingredientId: 2, quantity: 1.75 },
    ]
  );
  assert.equal(Math.round(costPerPortion([{ quantityPerPortion: 0.12, lastPrice: 14500 }, { quantityPerPortion: 0.1, lastPrice: 36000 }])), 5340);
});

test("parseRecipeInput hanya menerima paket yang ada di menu", () => {
  const lines: [string, string][] = [["lineIngredient", "1"], ["lineQuantity", "0,12"]];
  const ok = parseRecipeInput(form([["packagePrice", "20000"], ...lines]));
  assert.deepEqual(ok, { ok: true, value: { price: 20000, lines: [{ ingredientId: 1, quantityPerPortion: 0.12 }] } });
  assert.equal(parseRecipeInput(form([["packagePrice", "12345"], ...lines])).ok, false);
});

test("parseProductionInput memeriksa porsi, tanggal, shift, dan jam kirim", () => {
  const base: [string, string][] = [
    ["packagePrice", "17000"], ["portions", "350"], ["productionDate", "2026-11-22"],
    ["shift", "MORNING"], ["deliveryTime", "11:30"], ["destination", "Pabrik komponen, KIIC"],
  ];
  const ok = parseProductionInput(form(base), NOW);
  assert.ok(ok.ok && ok.value.orderId === null && ok.value.productionDate.toISOString() === "2026-11-21T17:00:00.000Z");

  const swap = (key: string, value: string) => form(base.map(([k, v]) => [k, k === key ? value : v] as [string, string]));
  assert.equal(parseProductionInput(swap("portions", "0"), NOW).ok, false);
  assert.equal(parseProductionInput(swap("productionDate", "2026-11-21"), NOW).ok, false);
  assert.equal(parseProductionInput(swap("shift", "SORE"), NOW).ok, false);
  assert.equal(parseProductionInput(swap("deliveryTime", "25:00"), NOW).ok, false);
});

test("parseSafetyCheckInput wajib hasil sesuai atau perlu tindakan", () => {
  const base: [string, string][] = [["point", "Suhu chiller"], ["reading", "3 °C"], ["limit", "0–4 °C"], ["checkedBy", "Kepala dapur"]];
  const ok = parseSafetyCheckInput(form([...base, ["result", "ok"]]));
  assert.ok(ok.ok && ok.value.ok === true && ok.value.productionOrderId === null);
  assert.equal(parseSafetyCheckInput(form(base)).ok, false);
});
