import test from "node:test";
import assert from "node:assert/strict";
import { allScheduledDishes, combineRecipes, menuDishes, menuVariations, wibWeekday } from "../src/modules/production/menu.ts";
import { parseDishRecipeInput, parseProductionInput } from "../src/modules/production/validation.ts";

function form(entries: [string, string][]): FormData {
  const data = new FormData();
  for (const [key, value] of entries) data.append(key, value);
  return data;
}

// 22 Nov 2026 (Minggu), 10:00 WIB
const NOW = new Date("2026-11-22T03:00:00Z");

test("wibWeekday memakai hari kalender WIB", () => {
  assert.equal(wibWeekday(new Date("2026-11-22T17:00:00Z")), "Senin"); // 23 Nov 00:00 WIB
  assert.equal(wibWeekday(new Date("2026-11-22T16:59:00Z")), "Minggu");
});

test("menu harian diambil dari jadwal paket situs publik", () => {
  assert.equal(menuVariations(17000, "Senin").length, 4);
  assert.deepEqual(menuDishes(17000, "Senin", 1)?.slice(0, 2), ["Nasi Putih", "Ayam Pop"]);
  assert.equal(menuDishes(17000, "Senin", 9), null);
  assert.deepEqual(menuVariations(17000, "Minggu"), []);
  const dishes = allScheduledDishes();
  assert.ok(dishes.includes("Nasi Putih") && dishes.includes("Ayam Pop"));
  assert.equal(new Set(dishes).size, dishes.length);
});

test("combineRecipes menjumlahkan bahan yang sama dari beberapa hidangan", () => {
  assert.deepEqual(
    combineRecipes([
      [{ ingredientId: 1, quantityPerPortion: 0.12 }],
      [{ ingredientId: 2, quantityPerPortion: 0.1 }, { ingredientId: 1, quantityPerPortion: 0.005 }],
    ]),
    [
      { ingredientId: 1, quantityPerPortion: 0.125 },
      { ingredientId: 2, quantityPerPortion: 0.1 },
    ]
  );
});

test("parseProductionInput membaca variasi menu sesuai hari produksi", () => {
  const base: [string, string][] = [
    ["packagePrice", "17000"], ["portions", "350"], ["productionDate", "2026-11-23"],
    ["shift", "MORNING"], ["deliveryTime", "11:30"], ["destination", "Pabrik komponen, KIIC"],
  ];
  const plain = parseProductionInput(form(base), NOW);
  assert.ok(plain.ok && plain.value.menuVariation === null && plain.value.dishNames === null);

  const withMenu = parseProductionInput(form([...base, ["menuVariation", "2"]]), NOW);
  assert.ok(withMenu.ok && withMenu.value.dishNames?.[1] === "Ayam Serundeng");

  assert.equal(parseProductionInput(form([...base, ["menuVariation", "9"]]), NOW).ok, false);
  const sunday = base.map(([k, v]) => [k, k === "productionDate" ? "2026-11-22" : v] as [string, string]);
  assert.equal(parseProductionInput(form([...sunday, ["menuVariation", "1"]]), NOW).ok, false);
});

test("parseDishRecipeInput hanya untuk hidangan di jadwal menu", () => {
  const lines: [string, string][] = [["lineIngredient", "1"], ["lineQuantity", "0,12"]];
  assert.ok(parseDishRecipeInput(form([["dishName", "Nasi Putih"], ...lines])).ok);
  assert.equal(parseDishRecipeInput(form([["dishName", "Pizza"], ...lines])).ok, false);
});
