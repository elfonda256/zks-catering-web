import "./load-env";
import { CATEGORIES, LOCATIONS } from "../src/modules/inventory/master-data";
import { prisma } from "../src/lib/prisma";

/**
 * Creates or updates the ingredient categories, their kinds and the storage locations.
 * Safe to run more than once. Ingredients themselves are added by the admin in Katalog bahan.
 */
async function main() {
  for (const [categoryIndex, category] of CATEGORIES.entries()) {
    const saved = await prisma.ingredientCategory.upsert({
      where: { slug: category.id },
      update: { name: category.name, sortOrder: categoryIndex },
      create: { slug: category.id, name: category.name, sortOrder: categoryIndex },
    });
    for (const [typeIndex, type] of category.types.entries()) {
      await prisma.ingredientType.upsert({
        where: { categoryId_name: { categoryId: saved.id, name: type } },
        update: { sortOrder: typeIndex },
        create: { categoryId: saved.id, name: type, sortOrder: typeIndex },
      });
    }
  }

  for (const [code, location] of Object.entries(LOCATIONS)) {
    await prisma.storageLocation.upsert({
      where: { code },
      update: { name: location.name, note: location.note },
      create: { code, name: location.name, note: location.note },
    });
  }

  console.log(`Selesai: ${CATEGORIES.length} kategori dan ${Object.keys(LOCATIONS).length} lokasi simpan.`);
}

main()
  .catch((error) => {
    console.error("Gagal mengisi data induk gudang:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
