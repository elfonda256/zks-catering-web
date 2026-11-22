import test from "node:test";
import assert from "node:assert/strict";
import { MENU_PACKAGES } from "../src/data/catering-data.ts";
import { CATEGORIES, LOCATIONS } from "../src/modules/inventory/master-data.ts";
import { STARTER_INGREDIENTS, STARTER_RECIPES } from "../src/modules/inventory/starter-catalog.ts";
import { INGREDIENT_UNITS, parseQuantity } from "../src/modules/inventory/validation.ts";

test("setiap bahan awal memakai kategori, jenis, lokasi, dan satuan yang ada", () => {
  const codes = new Set<string>();
  for (const item of STARTER_INGREDIENTS) {
    const category = CATEGORIES.find((c) => c.id === item.category);
    assert.ok(category?.types.includes(item.type), `${item.code}: jenis ${item.type}`);
    assert.ok(item.location in LOCATIONS, `${item.code}: lokasi ${item.location}`);
    assert.ok(INGREDIENT_UNITS.includes(item.unit), `${item.code}: satuan ${item.unit}`);
    assert.match(item.code, /^[A-Z0-9-]{3,20}$/);
    assert.ok(Number.isInteger(item.lastPrice) && item.lastPrice > 0);
    assert.equal(codes.has(item.code), false, `kode ganda ${item.code}`);
    codes.add(item.code);
  }
});

test("resep awal hanya memakai paket menu dan bahan yang ada, maksimal 3 desimal", () => {
  const codes = new Set(STARTER_INGREDIENTS.map((i) => i.code));
  for (const [price, lines] of Object.entries(STARTER_RECIPES)) {
    assert.ok(MENU_PACKAGES[Number(price)], `paket ${price}`);
    assert.equal(new Set(lines.map((l) => l.code)).size, lines.length, `bahan ganda di paket ${price}`);
    for (const line of lines) {
      assert.ok(codes.has(line.code), `${price}: ${line.code}`);
      assert.equal(parseQuantity(String(line.quantityPerPortion), { allowZero: false }), line.quantityPerPortion);
    }
  }
});

test("food cost resep awal di bawah 50% harga jual", () => {
  const priceOf = new Map(STARTER_INGREDIENTS.map((i) => [i.code, i.lastPrice]));
  for (const [price, lines] of Object.entries(STARTER_RECIPES)) {
    const cost = lines.reduce((sum, l) => sum + l.quantityPerPortion * priceOf.get(l.code)!, 0);
    assert.ok(cost / Number(price) < 0.5, `paket ${price}: food cost ${Math.round((cost / Number(price)) * 100)}%`);
  }
});
