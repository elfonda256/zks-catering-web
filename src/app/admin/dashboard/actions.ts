"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import {
  calculateOrderLockValues,
  generateOrderAccessToken,
} from "@/lib/order-logic";
import type { OrderStatus } from "@/generated/prisma/enums";

export interface AdminActionResult {
  success?: boolean;
  error?: string;
  newRawToken?: string;
  trackingUrl?: string;
}

/**
 * Mengunci total tagihan pesanan oleh admin:
 * Menetapkan ongkos kirim resmi, menghitung totalAmount dan dpAmount (20% dari subtotal makanan),
 * menetapkan confirmedAt dan initialPaymentDueAt, serta mengubah status ke CONFIRMED_AWAITING_PAYMENT.
 */
export async function lockOrderTotalAction(
  orderId: number,
  shippingFee: number
): Promise<AdminActionResult> {
  try {
    await requireAdmin();

    if (!orderId || isNaN(orderId)) {
      return { error: "ID pesanan tidak valid." };
    }

    if (isNaN(shippingFee) || shippingFee < 0) {
      return { error: "Nominal ongkos kirim tidak boleh bernilai negatif." };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { error: "Pesanan tidak ditemukan di basis data." };
    }

    if (order.status !== "WAITING_ADMIN_CONFIRMATION") {
      return {
        error: `Pesanan sudah berstatus ${order.status}, tidak dapat dikunci ulang.`,
      };
    }

    const now = new Date();
    const lockValues = calculateOrderLockValues(
      order.subtotal,
      shippingFee,
      order.eventDate,
      now
    );

    await prisma.order.update({
      where: { id: orderId },
      data: {
        shippingFee,
        totalAmount: lockValues.totalAmount,
        dpAmount: lockValues.dpAmount,
        confirmedAt: now,
        initialPaymentDueAt: lockValues.initialPaymentDueAt,
        status: "CONFIRMED_AWAITING_PAYMENT",
      },
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("Gagal mengunci total pesanan oleh admin:", err);
    return {
      error:
        err instanceof Error
          ? err.message
          : "Terjadi galat sistem saat mengunci total pesanan.",
    };
  }
}

/**
 * Menolak pesanan masuk oleh admin (misal kapasitas produksi penuh atau di luar rute).
 */
export async function rejectOrderAction(
  orderId: number,
  cancellationReason: string
): Promise<AdminActionResult> {
  try {
    await requireAdmin();

    if (!orderId || isNaN(orderId)) {
      return { error: "ID pesanan tidak valid." };
    }

    const cleanReason = cancellationReason.trim();
    if (!cleanReason) {
      return { error: "Alasan penolakan pesanan wajib diisi." };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { error: "Pesanan tidak ditemukan di basis data." };
    }

    if (["COMPLETED", "REFUNDED"].includes(order.status)) {
      return { error: `Pesanan berstatus ${order.status} tidak dapat ditolak.` };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "REJECTED_BY_ADMIN",
        cancellationReason: cleanReason,
        cancelledAt: new Date(),
      },
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("Gagal menolak pesanan oleh admin:", err);
    return {
      error:
        err instanceof Error
          ? err.message
          : "Terjadi kendala saat memproses penolakan pesanan.",
    };
  }
}

/**
 * Memperbarui status operasional pesanan secara manual oleh admin.
 * (Misal: verifikasi bukti transfer manual DP/Lunas, persiapan dapur, pengantaran armada, selesai).
 */
export async function updateOrderStatusAction(
  orderId: number,
  newStatus: OrderStatus
): Promise<AdminActionResult> {
  try {
    await requireAdmin();

    if (!orderId || isNaN(orderId)) {
      return { error: "ID pesanan tidak valid." };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { error: "Pesanan tidak ditemukan di basis data." };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
      },
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("Gagal memperbarui status pesanan oleh admin:", err);
    return {
      error:
        err instanceof Error
          ? err.message
          : "Terjadi kendala saat memperbarui status pesanan.",
    };
  }
}

/**
 * Membuat ulang token tautan tracking pelanggan secara acak (64 hex).
 * Berguna bila pelanggan kehilangan link tracking pesanan privat.
 */
export async function regenerateOrderTokenAction(
  orderId: number
): Promise<AdminActionResult> {
  try {
    await requireAdmin();

    if (!orderId || isNaN(orderId)) {
      return { error: "ID pesanan tidak valid." };
    }

    const { rawToken, accessTokenHash } = generateOrderAccessToken();

    await prisma.order.update({
      where: { id: orderId },
      data: {
        accessTokenHash,
      },
    });

    revalidatePath("/admin/dashboard");
    return {
      success: true,
      newRawToken: rawToken,
      trackingUrl: `/pesanan/${rawToken}`,
    };
  } catch (err: unknown) {
    console.error("Gagal membuat ulang token pesanan:", err);
    return {
      error:
        err instanceof Error
          ? err.message
          : "Terjadi kendala saat membuat ulang token pesanan.",
    };
  }
}

/**
 * Menyetujui bukti transfer pembayaran yang diunggah oleh pelanggan di web:
 * Mengubah Payment.status menjadi SETTLED dan Order.status menjadi DP_PAID atau FULLY_PAID.
 */
export async function approvePaymentAction(
  paymentId: number,
  orderId: number
): Promise<AdminActionResult> {
  try {
    await requireAdmin();

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment || payment.orderId !== orderId) {
      return { error: "Data pembayaran tidak ditemukan." };
    }

    const newOrderStatus = payment.paymentType === "DP" ? "DP_PAID" : "FULLY_PAID";

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: "SETTLED",
          settledAt: new Date(),
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: {
          status: newOrderStatus,
        },
      });
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("Gagal menyetujui pembayaran:", err);
    return {
      error:
        err instanceof Error
          ? err.message
          : "Terjadi kendala saat memverifikasi pembayaran.",
    };
  }
}

/**
 * Menolak bukti transfer jika tidak valid, buram, atau nominal tidak sesuai.
 */
export async function rejectPaymentAction(
  paymentId: number,
  orderId: number,
  reason: string
): Promise<AdminActionResult> {
  try {
    await requireAdmin();

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment || payment.orderId !== orderId) {
      return { error: "Data pembayaran tidak ditemukan." };
    }

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "FAILED",
        maskedResponse: JSON.stringify({
          rejectedReason: reason,
          rejectedAt: new Date().toISOString(),
        }),
      },
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("Gagal menolak pembayaran:", err);
    return {
      error:
        err instanceof Error
          ? err.message
          : "Terjadi kendala saat menolak bukti pembayaran.",
    };
  }
}

