"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { documentCode, orderStatusFromLines, receiptError } from "@/modules/procurement/documents";
import { parseDecisionInput, parseOrderInput, parseReceiptInput, parseRequestInput } from "@/modules/procurement/validation";

export interface ProcurementActionResult {
  error?: string;
  success?: boolean;
}

interface OrderLineState {
  id: number;
  ingredientId: number;
  ingredientName: string;
  unitPrice: number;
  quantity: number;
  receivedQuantity: number;
}

/** Thrown inside a transaction to roll it back and show the message to the admin. */
class RejectedError extends Error {}

const PROCUREMENT_PATHS = [
  "/admin/purchase-requests",
  "/admin/purchase-orders",
  "/admin/inventory/receiving",
  "/admin/inventory",
  "/admin/inventory/items",
  "/admin/inventory/movements",
];

function revalidateProcurement() {
  for (const path of PROCUREMENT_PATHS) revalidatePath(path);
}

function failure(err: unknown, action: string): ProcurementActionResult {
  if (err instanceof RejectedError) return { error: err.message };
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
    return { error: "Bahan, supplier, atau lokasi yang dipilih tidak ditemukan. Muat ulang halaman." };
  }
  console.error(`Gagal ${action}:`, err);
  return { error: `Gagal ${action} karena kendala sistem. Silakan coba lagi.` };
}

export async function createRequestAction(form: FormData): Promise<ProcurementActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = parseRequestInput(form, new Date());
    if (!parsed.ok) return { error: parsed.error };
    const { lines, ...request } = parsed.value;

    await prisma.purchaseRequest.create({
      data: {
        ...request,
        createdById: Number(admin.id) || null,
        lines: { create: lines.map(({ ingredientId, quantity }) => ({ ingredientId, quantity })) },
      },
    });
    revalidateProcurement();
    return { success: true };
  } catch (err) {
    return failure(err, "menyimpan permintaan pembelian");
  }
}

/** Approves or rejects a pending request. Only the first decision counts. */
export async function decideRequestAction(requestId: number, form: FormData): Promise<ProcurementActionResult> {
  try {
    await requireAdmin();
    const parsed = parseDecisionInput(form);
    if (!parsed.ok) return { error: parsed.error };

    const { count } = await prisma.purchaseRequest.updateMany({
      where: { id: requestId, status: "PENDING" },
      data: {
        status: parsed.value.approve ? "APPROVED" : "REJECTED",
        decisionNote: parsed.value.note,
        decidedAt: new Date(),
      },
    });
    if (count === 0) return { error: "Permintaan ini sudah diputuskan sebelumnya. Muat ulang halaman." };
    revalidateProcurement();
    return { success: true };
  } catch (err) {
    return failure(err, "menyimpan keputusan");
  }
}

/** Creates a PO, optionally from an approved request, which then becomes ORDERED. */
export async function createOrderAction(form: FormData): Promise<ProcurementActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = parseOrderInput(form, new Date());
    if (!parsed.ok) return { error: parsed.error };
    const { lines, ...order } = parsed.value;

    await prisma.$transaction(async (tx) => {
      const supplier = await tx.supplier.findUnique({ where: { id: order.supplierId }, select: { isActive: true } });
      if (!supplier?.isActive) throw new RejectedError("Supplier tidak aktif atau tidak ditemukan.");

      if (order.requestId !== null) {
        const { count } = await tx.purchaseRequest.updateMany({
          where: { id: order.requestId, status: "APPROVED" },
          data: { status: "ORDERED" },
        });
        if (count === 0) throw new RejectedError("Permintaan ini belum disetujui atau sudah dibuatkan PO.");
      }

      await tx.purchaseOrder.create({
        data: { ...order, createdById: Number(admin.id) || null, lines: { create: lines } },
      });
    });
    revalidateProcurement();
    return { success: true };
  } catch (err) {
    return failure(err, "membuat PO");
  }
}

/** Cancels a PO that has received nothing yet; its request goes back to APPROVED. */
export async function cancelOrderAction(orderId: number): Promise<ProcurementActionResult> {
  try {
    await requireAdmin();
    await prisma.$transaction(async (tx) => {
      const order = await tx.purchaseOrder.findUnique({ where: { id: orderId }, select: { requestId: true } });
      const { count } = await tx.purchaseOrder.updateMany({
        where: { id: orderId, status: "SENT", receipts: { none: {} } },
        data: { status: "CANCELLED", cancelledAt: new Date(), requestId: null },
      });
      if (count === 0) throw new RejectedError("PO yang sudah menerima barang tidak bisa dibatalkan.");
      if (order?.requestId) {
        await tx.purchaseRequest.update({ where: { id: order.requestId }, data: { status: "APPROVED" } });
      }
    });
    revalidateProcurement();
    return { success: true };
  } catch (err) {
    return failure(err, "membatalkan PO");
  }
}

/**
 * Records goods received against a PO. Accepted goods become IN movements and update the
 * ingredient's last price; rejected goods are recorded but never enter stock.
 */
export async function receiveGoodsAction(form: FormData): Promise<ProcurementActionResult> {
  try {
    const admin = await requireAdmin();
    const parsed = parseReceiptInput(form);
    if (!parsed.ok) return { error: parsed.error };
    const receipt = parsed.value;
    const adminId = Number(admin.id) || null;

    await prisma.$transaction(async (tx) => {
      // One receiver per PO at a time, so outstanding quantities are read exactly once.
      await tx.$executeRaw`SELECT 1 FROM "PurchaseOrder" WHERE "id" = ${receipt.orderId} FOR UPDATE`;
      const order = await tx.purchaseOrder.findUnique({
        where: { id: receipt.orderId },
        include: { supplier: { select: { name: true } }, lines: { include: { ingredient: { select: { name: true } } } } },
      });
      if (!order) throw new RejectedError("PO tidak ditemukan. Muat ulang halaman.");
      if (order.status !== "SENT" && order.status !== "PARTIALLY_RECEIVED") {
        throw new RejectedError("PO ini sudah selesai atau dibatalkan.");
      }

      const orderLines: OrderLineState[] = order.lines.map((l) => ({
        id: l.id,
        ingredientId: l.ingredientId,
        ingredientName: l.ingredient.name,
        unitPrice: l.unitPrice,
        quantity: Number(l.quantity),
        receivedQuantity: Number(l.receivedQuantity),
      }));
      const error = receiptError(orderLines, receipt.lines);
      if (error) throw new RejectedError(error);

      const saved = await tx.goodsReceipt.create({
        data: {
          orderId: order.id,
          locationId: receipt.locationId,
          note: receipt.note,
          receivedById: adminId,
          lines: {
            create: receipt.lines.map((l) => ({
              orderLineId: l.orderLineId,
              acceptedQuantity: l.accepted,
              rejectedQuantity: l.rejected,
              note: l.note,
            })),
          },
        },
      });

      const reference = documentCode("GRN", saved.id);
      const byId = new Map(orderLines.map((l) => [l.id, l]));
      for (const line of receipt.lines) {
        if (line.accepted === 0) continue;
        const orderLine = byId.get(line.orderLineId)!;
        orderLine.receivedQuantity += line.accepted;
        await tx.purchaseOrderLine.update({
          where: { id: orderLine.id },
          data: { receivedQuantity: { increment: line.accepted } },
        });
        await tx.stockMovement.create({
          data: {
            ingredientId: orderLine.ingredientId,
            type: "IN",
            quantity: line.accepted,
            toLocationId: receipt.locationId,
            reference,
            note: `Dari ${documentCode("PO", order.id)} · ${order.supplier.name}`,
            createdById: adminId,
          },
        });
        await tx.ingredient.update({ where: { id: orderLine.ingredientId }, data: { lastPrice: orderLine.unitPrice } });
      }

      await tx.purchaseOrder.update({ where: { id: order.id }, data: { status: orderStatusFromLines(orderLines) } });
    });

    revalidateProcurement();
    return { success: true };
  } catch (err) {
    return failure(err, "menyimpan penerimaan barang");
  }
}
