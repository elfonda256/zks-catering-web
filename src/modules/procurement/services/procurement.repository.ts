/** Database reads for the procurement and receiving pages. Server only: imports Prisma. */

import { prisma } from "@/lib/prisma";
import { documentCode } from "../documents";
import type { OrderRow, ProcurementOptions, ReceiptRow, RequestRow } from "../types";

const LIST_LIMIT = 200;

export async function getProcurementOptions(): Promise<ProcurementOptions> {
  const [items, suppliers, locations] = await Promise.all([
    prisma.ingredient.findMany({
      where: { isActive: true },
      orderBy: [{ type: { category: { sortOrder: "asc" } } }, { name: "asc" }],
      select: {
        id: true,
        code: true,
        name: true,
        unit: true,
        lastPrice: true,
        supplierId: true,
        type: { select: { category: { select: { name: true } } } },
      },
    }),
    prisma.supplier.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.storageLocation.findMany({ orderBy: { id: "asc" }, select: { id: true, name: true } }),
  ]);
  return {
    items: items.map(({ type, ...item }) => ({ ...item, categoryName: type.category.name })),
    suppliers,
    locations,
  };
}

export async function getRequests(): Promise<RequestRow[]> {
  const rows = await prisma.purchaseRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: LIST_LIMIT,
    include: {
      createdBy: { select: { username: true } },
      order: { select: { id: true } },
      lines: { include: { ingredient: { select: { name: true, unit: true, lastPrice: true } } }, orderBy: { id: "asc" } },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    code: documentCode("PR", r.id),
    requestedBy: r.requestedBy,
    reason: r.reason,
    neededBy: r.neededBy.toISOString(),
    status: r.status,
    decisionNote: r.decisionNote,
    createdAt: r.createdAt.toISOString(),
    createdBy: r.createdBy?.username ?? null,
    orderCode: r.order ? documentCode("PO", r.order.id) : null,
    lines: r.lines.map((l) => ({
      ingredientId: l.ingredientId,
      ingredientName: l.ingredient.name,
      unit: l.ingredient.unit,
      quantity: Number(l.quantity),
      unitPrice: l.ingredient.lastPrice,
    })),
  }));
}

export async function getOrders(): Promise<OrderRow[]> {
  const rows = await prisma.purchaseOrder.findMany({
    orderBy: { createdAt: "desc" },
    take: LIST_LIMIT,
    include: {
      supplier: { select: { name: true, paymentTerms: true } },
      createdBy: { select: { username: true } },
      _count: { select: { receipts: true } },
      lines: { include: { ingredient: { select: { name: true, unit: true } } }, orderBy: { id: "asc" } },
    },
  });
  return rows.map((o) => ({
    id: o.id,
    code: documentCode("PO", o.id),
    supplierName: o.supplier.name,
    supplierTerms: o.supplier.paymentTerms,
    requestCode: o.requestId ? documentCode("PR", o.requestId) : null,
    status: o.status,
    expectedDate: o.expectedDate?.toISOString() ?? null,
    note: o.note,
    createdAt: o.createdAt.toISOString(),
    createdBy: o.createdBy?.username ?? null,
    receiptCount: o._count.receipts,
    lines: o.lines.map((l) => ({
      lineId: l.id,
      ingredientId: l.ingredientId,
      ingredientName: l.ingredient.name,
      unit: l.ingredient.unit,
      quantity: Number(l.quantity),
      unitPrice: l.unitPrice,
      receivedQuantity: Number(l.receivedQuantity),
    })),
  }));
}

export async function getReceipts(): Promise<ReceiptRow[]> {
  const rows = await prisma.goodsReceipt.findMany({
    orderBy: { createdAt: "desc" },
    take: LIST_LIMIT,
    include: {
      order: { select: { id: true, supplier: { select: { name: true } } } },
      location: { select: { name: true } },
      receivedBy: { select: { username: true } },
      lines: { include: { orderLine: { select: { ingredient: { select: { name: true, unit: true } } } } }, orderBy: { id: "asc" } },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    code: documentCode("GRN", r.id),
    orderCode: documentCode("PO", r.order.id),
    supplierName: r.order.supplier.name,
    locationName: r.location.name,
    note: r.note,
    createdAt: r.createdAt.toISOString(),
    receivedBy: r.receivedBy?.username ?? null,
    lines: r.lines.map((l) => ({
      ingredientName: l.orderLine.ingredient.name,
      unit: l.orderLine.ingredient.unit,
      accepted: Number(l.acceptedQuantity),
      rejected: Number(l.rejectedQuantity),
      note: l.note,
    })),
  }));
}
