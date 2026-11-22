/** Database reads for the supplier page. Server only: imports Prisma. */

import { prisma } from "@/lib/prisma";
import type { SupplierRow } from "../types";

export async function getSuppliers(): Promise<SupplierRow[]> {
  const suppliers = await prisma.supplier.findMany({
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    include: {
      ingredients: {
        orderBy: { name: "asc" },
        select: { name: true, type: { select: { category: { select: { name: true } } } } },
      },
    },
  });

  return suppliers.map((s) => ({
    id: s.id,
    name: s.name,
    contactName: s.contactName,
    phone: s.phone,
    area: s.area,
    paymentTerms: s.paymentTerms,
    isActive: s.isActive,
    ingredients: s.ingredients.map((i) => ({ name: i.name, categoryName: i.type.category.name })),
  }));
}
