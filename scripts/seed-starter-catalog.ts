import "./load-env";
import { STARTER_INGREDIENTS, STARTER_RECIPES } from "../src/modules/inventory/starter-catalog";
import { ensurePackageMenuItem } from "../src/modules/menu/package-menu-item";
import { prisma } from "../src/lib/prisma";

/**
 * Adds the starter ingredients and package recipes. Run `npm run seed:inventory` first.
 * Safe to run more than once: existing ingredients (by code) and packages that already have a
 * recipe are left exactly as the admin edited them. No stock is created.
 */
async function main() {
  const [types, locations] = await Promise.all([
    prisma.ingredientType.findMany({ select: { id: true, name: true, category: { select: { slug: true } } } }),
    prisma.storageLocation.findMany({ select: { id: true, code: true } }),
  ]);
  const typeId = new Map(types.map((t) => [`${t.category.slug}:${t.name}`, t.id]));
  const locationId = new Map(locations.map((l) => [l.code, l.id]));

  const missing = STARTER_INGREDIENTS.filter((i) => !typeId.has(`${i.category}:${i.type}`) || !locationId.has(i.location));
  if (missing.length > 0) {
    throw new Error(`Data induk gudang belum lengkap (${missing.map((i) => i.code).join(", ")}). Jalankan npm run seed:inventory dulu.`);
  }

  const created = await prisma.ingredient.createMany({
    data: STARTER_INGREDIENTS.map((i) => ({
      code: i.code,
      name: i.name,
      typeId: typeId.get(`${i.category}:${i.type}`)!,
      unit: i.unit,
      defaultLocationId: locationId.get(i.location)!,
      minStock: i.minStock,
      lastPrice: i.lastPrice,
    })),
    skipDuplicates: true,
  });

  const ingredients = await prisma.ingredient.findMany({ select: { id: true, code: true } });
  const ingredientId = new Map(ingredients.map((i) => [i.code, i.id]));

  let recipes = 0;
  for (const [price, lines] of Object.entries(STARTER_RECIPES)) {
    await prisma.$transaction(async (tx) => {
      const menuItem = await ensurePackageMenuItem(tx, Number(price));
      if ((await tx.recipeLine.count({ where: { menuItemId: menuItem.id } })) > 0) return;
      await tx.recipeLine.createMany({
        data: lines.map((l) => ({ menuItemId: menuItem.id, ingredientId: ingredientId.get(l.code)!, quantityPerPortion: l.quantityPerPortion })),
      });
      recipes++;
    });
  }

  console.log(`Selesai: ${created.count} bahan baru, ${recipes} resep paket baru.`);
}

main()
  .catch((error) => {
    console.error("Gagal mengisi katalog awal:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
