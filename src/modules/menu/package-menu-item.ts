/** Links the public menu packages (src/data/catering-data.ts) to MenuItem rows. Server only. */

import type { Prisma } from "@/generated/prisma/client";
import { MENU_PACKAGES } from "@/data/catering-data";

const PACKAGE_CATEGORY = { name: "Paket Katering", slug: "paket-katering" };

/**
 * Returns the MenuItem for the package with this price, creating it (and its category) the
 * first time a package is ordered, given a recipe, or scheduled for production.
 */
export async function ensurePackageMenuItem(tx: Prisma.TransactionClient, price: number) {
  const selectedPackage = MENU_PACKAGES[price];
  if (!selectedPackage) throw new Error(`Unknown menu package price ${price}`);

  const category = await tx.category.upsert({
    where: { slug: PACKAGE_CATEGORY.slug },
    update: {},
    create: PACKAGE_CATEGORY,
  });

  const existing = await tx.menuItem.findFirst({ where: { categoryId: category.id, price } });
  if (existing) return existing;

  return tx.menuItem.create({
    data: {
      name: selectedPackage.name,
      description: selectedPackage.description,
      price,
      categoryId: category.id,
      isActive: true,
    },
  });
}
