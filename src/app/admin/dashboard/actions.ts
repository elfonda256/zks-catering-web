"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import {
  calculateOrderLockValues,
  generateOrderAccessToken,
} from "@/lib/order-logic";
import type { OrderStatus } from "@/generated/prisma/enums";
import { sendWhatsAppMessage, getAppBaseUrl } from "@/lib/whatsapp";
import type { OrderStatusValue } from "@/modules/dashboard/constants";
import { canAdvanceStatus, statusAfterPaymentApproval } from "@/modules/dashboard/services/order-status";

export interface AdminActionResult {
  success?: boolean;
  error?: string;
  newRawToken?: string;
  trackingUrl?: string;
}

class StaleOrderError extends Error {}

/** Parses a stored JSON object; anything else (null, invalid, array) becomes an empty object. */
function parseJsonObject(value: string | null): Record<string, unknown> {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

const STATUS_CHANGED_ERROR = "Status pesanan sudah berubah. Muat ulang halaman lalu coba lagi.";

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
      return { error: STATUS_CHANGED_ERROR };
    }

    const now = new Date();
    const lockValues = calculateOrderLockValues(
      order.subtotal,
      shippingFee,
      order.eventDate,
      now
    );

    const locked = await prisma.order.updateMany({
      where: { id: orderId, status: "WAITING_ADMIN_CONFIRMATION" },
      data: {
        shippingFee,
        totalAmount: lockValues.totalAmount,
        dpAmount: lockValues.dpAmount,
        confirmedAt: now,
        initialPaymentDueAt: lockValues.initialPaymentDueAt,
        status: "CONFIRMED_AWAITING_PAYMENT",
      },
    });

    if (locked.count === 0) {
      return { error: STATUS_CHANGED_ERROR };
    }

    // Kirim notifikasi WhatsApp otomatis ke pelanggan
    try {
      const dpSection =
        lockValues.dpAmount !== null
          ? `• Opsi Uang Muka (DP 20%) : Rp${lockValues.dpAmount.toLocaleString("id-ID")}\n`
          : "";

      const waText =
        `*PT. ZAHDAN KAMAL SENTOSA*\n` +
        `_Konfirmasi Total Tagihan Pesanan_\n\n` +
        `Halo Bpk/Ibu *${order.customerName}*,\n` +
        `Pesanan katering Anda (*${order.orderCode}*) telah kami tinjau dan total tagihan resmi telah ditetapkan.\n\n` +
        `📋 *Rincian Pembayaran:*\n` +
        `• Subtotal Makanan : Rp${order.subtotal.toLocaleString("id-ID")}\n` +
        `• Ongkos Kirim : Rp${shippingFee.toLocaleString("id-ID")}\n` +
        `• *Total Tagihan* : *Rp${lockValues.totalAmount.toLocaleString("id-ID")}*\n` +
        `${dpSection}\n` +
        `💳 *Rekening Pembayaran Resmi ZKS:*\n` +
        `• Bank Mandiri : 173-00-1122334-5\n` +
        `• Bank BCA : 109-8877-665\n` +
        `• Atas Nama : PT. Zahdan Kamal Sentosa\n` +
        `• Berita Transfer : *${order.orderCode}*\n\n` +
        `Silakan buka kembali tautan pelacakan pesanan Anda di chat sebelumnya untuk mengunggah bukti transfer (DP 20% atau Pelunasan Penuh).\n\n` +
        `_Batas pembayaran awal: ${lockValues.initialPaymentDueAt.toLocaleDateString("id-ID", { dateStyle: "full" })}_`;

      await sendWhatsAppMessage({
        targetPhone: order.customerPhone,
        message: waText,
      });
    } catch (waErr) {
      console.warn("Gagal mengirim WA lock total order:", waErr);
    }

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("Gagal mengunci total pesanan oleh admin:", err);
    return { error: "Terjadi galat sistem saat mengunci total pesanan." };
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

    // Penolakan hanya untuk pesanan yang belum dikonfirmasi (tanpa biaya bagi pelanggan).
    if (order.status !== "WAITING_ADMIN_CONFIRMATION") {
      return { error: STATUS_CHANGED_ERROR };
    }

    const rejected = await prisma.order.updateMany({
      where: { id: orderId, status: "WAITING_ADMIN_CONFIRMATION" },
      data: {
        status: "REJECTED_BY_ADMIN",
        cancellationReason: cleanReason,
        cancelledAt: new Date(),
      },
    });

    if (rejected.count === 0) {
      return { error: STATUS_CHANGED_ERROR };
    }

    // Kirim notifikasi WhatsApp otomatis ke pelanggan
    try {
      const waText =
        `*PT. ZAHDAN KAMAL SENTOSA*\n` +
        `_Pemberitahuan Status Pesanan Katering_\n\n` +
        `Halo Bpk/Ibu *${order.customerName}*,\n` +
        `Mohon maaf, pengajuan pesanan katering Anda dengan kode *${order.orderCode}* belum dapat kami terima saat ini.\n\n` +
        `📝 *Alasan:* ${cleanReason}\n\n` +
        `Untuk informasi lebih lanjut atau penjadwalan alternatif, Anda dapat membalas pesan WhatsApp ini. Terima kasih atas pengertian Anda.`;

      await sendWhatsAppMessage({
        targetPhone: order.customerPhone,
        message: waText,
      });
    } catch (waErr) {
      console.warn("Gagal mengirim WA reject order:", waErr);
    }

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("Gagal menolak pesanan oleh admin:", err);
    return { error: "Terjadi kendala saat memproses penolakan pesanan." };
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

    if (!canAdvanceStatus(order.status as OrderStatusValue, newStatus as OrderStatusValue)) {
      return { error: STATUS_CHANGED_ERROR };
    }

    const { count } = await prisma.order.updateMany({
      where: { id: orderId, status: order.status },
      data: {
        status: newStatus,
      },
    });

    if (count === 0) {
      return { error: STATUS_CHANGED_ERROR };
    }

    // Kirim notifikasi status operasional via WhatsApp jika relevan
    try {
      let statusDesc = "";
      if (newStatus === "IN_PREPARATION") {
        statusDesc = "🍳 Dapur katering kami telah memulai proses pengolahan dan pengemasan higienis untuk pesanan Anda.";
      } else if (newStatus === "IN_DELIVERY") {
        statusDesc = "🚚 Armada pengantaran katering ZKS sedang dalam perjalanan menuju alamat pabrik/lokasi Anda.";
      } else if (newStatus === "COMPLETED") {
        statusDesc = "✅ Pesanan katering Anda telah berhasil diserahterimakan di lokasi. Terima kasih atas kepercayaan Anda kepada PT. Zahdan Kamal Sentosa.";
      }

      if (statusDesc) {
        const waText =
          `*PT. ZAHDAN KAMAL SENTOSA*\n` +
          `_Pembaruan Status Pesanan_\n\n` +
          `Halo Bpk/Ibu *${order.customerName}*,\n` +
          `Status pesanan katering Anda (*${order.orderCode}*) saat ini:\n\n` +
          `${statusDesc}\n\n` +
          `Tim operasional kami senantiasa memastikan standar kebersihan, higienitas, dan ketepatan waktu pengantaran terbaik untuk Anda.`;

        await sendWhatsAppMessage({
          targetPhone: order.customerPhone,
          message: waText,
        });
      }
    } catch (waErr) {
      console.warn("Gagal mengirim WA update status order:", waErr);
    }

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("Gagal memperbarui status pesanan oleh admin:", err);
    return { error: "Terjadi kendala saat memperbarui status pesanan." };
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

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { customerPhone: true, customerName: true, orderCode: true },
    });

    const { rawToken, accessTokenHash } = generateOrderAccessToken();

    await prisma.order.update({
      where: { id: orderId },
      data: {
        accessTokenHash,
      },
    });

    const fullTrackingUrl = `${getAppBaseUrl()}/pesanan/${rawToken}`;

    // Otomatis kirim tautan baru langsung ke WhatsApp pelanggan
    if (order) {
      try {
        const waText =
          `*PT. ZAHDAN KAMAL SENTOSA*\n` +
          `_Tautan Pelacakan Pesanan Katering_\n\n` +
          `Halo Bpk/Ibu *${order.customerName}*,\n` +
          `Berikut adalah tautan pelacakan resmi terbaru untuk memantau status dan melakukan pembayaran pesanan Anda (*${order.orderCode}*):\n\n` +
          `🔗 *Tautan Akses:*\n` +
          `${fullTrackingUrl}\n\n` +
          `_Tautan ini bersifat privat. Simpan pesan ini untuk kemudahan akses Anda._`;

        await sendWhatsAppMessage({
          targetPhone: order.customerPhone,
          message: waText,
        });
      } catch (waErr) {
        console.warn("Gagal mengirim WA token baru:", waErr);
      }
    }

    revalidatePath("/admin/dashboard");
    return {
      success: true,
      newRawToken: rawToken,
      trackingUrl: fullTrackingUrl,
    };
  } catch (err: unknown) {
    console.error("Gagal membuat ulang token pesanan:", err);
    return { error: "Terjadi kendala saat membuat ulang token pesanan." };
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
      include: {
        order: {
          select: {
            customerName: true,
            customerPhone: true,
            orderCode: true,
            status: true,
          },
        },
      },
    });

    if (!payment || payment.orderId !== orderId) {
      return { error: "Data pembayaran tidak ditemukan." };
    }

    if (payment.status !== "PENDING") {
      return { error: "Bukti bayar ini sudah diproses. Muat ulang halaman." };
    }

    const currentStatus = payment.order.status as OrderStatusValue;
    const newOrderStatus = statusAfterPaymentApproval(currentStatus, payment.paymentType);
    if (!newOrderStatus) {
      return { error: "Pesanan ini sudah dibatalkan atau kedaluwarsa, pembayaran tidak dapat disetujui." };
    }

    const applied = await prisma.$transaction(async (tx) => {
      const settled = await tx.payment.updateMany({
        where: { id: paymentId, status: "PENDING" },
        data: {
          status: "SETTLED",
          settledAt: new Date(),
        },
      });
      if (settled.count === 0) return false;

      const moved = await tx.order.updateMany({
        where: { id: orderId, status: currentStatus },
        data: { status: newOrderStatus },
      });
      if (moved.count === 0) {
        throw new StaleOrderError();
      }
      return true;
    });

    if (!applied) {
      return { error: "Bukti bayar ini sudah diproses. Muat ulang halaman." };
    }

    // Kirim notifikasi WhatsApp otomatis ke pelanggan bahwa pembayaran diterima
    if (payment.order) {
      try {
        const paymentTypeLabel = payment.paymentType === "DP" ? "Uang Muka (DP 20%)" : "Pelunasan Penuh";
        const statusLabel = payment.paymentType === "DP" ? "DP Terkonfirmasi (Jadwal Terkunci)" : "Lunas Terverifikasi";
        const waText =
          `*PT. ZAHDAN KAMAL SENTOSA*\n` +
          `_Pembayaran Berhasil Diverifikasi_\n\n` +
          `Halo Bpk/Ibu *${payment.order.customerName}*,\n` +
          `Kabar baik! Bukti transfer pembayaran untuk pesanan katering *${payment.order.orderCode}* telah *DIVERIFIKASI & DITERIMA* oleh admin ZKS.\n\n` +
          `📋 *Detail Pembayaran:*\n` +
          `• Jenis Pembayaran : ${paymentTypeLabel}\n` +
          `• Nominal Diterima : Rp${payment.amount.toLocaleString("id-ID")}\n` +
          `• Status Pesanan : ${statusLabel}\n\n` +
          `Jadwal produksi dapur katering higienis dan armada pengantaran untuk tanggal acara Anda telah resmi dikunci di sistem kami.\n\n` +
          `Terima kasih telah mempercayakan konsumsi industri Anda kepada PT. Zahdan Kamal Sentosa.`;

        await sendWhatsAppMessage({
          targetPhone: payment.order.customerPhone,
          message: waText,
        });
      } catch (waErr) {
        console.warn("Gagal mengirim WA approve payment:", waErr);
      }
    }

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof StaleOrderError) {
      return { error: STATUS_CHANGED_ERROR };
    }
    console.error("Gagal menyetujui pembayaran:", err);
    return { error: "Terjadi kendala saat memverifikasi pembayaran." };
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
      include: {
        order: {
          select: {
            customerName: true,
            customerPhone: true,
            orderCode: true,
          },
        },
      },
    });

    if (!payment || payment.orderId !== orderId) {
      return { error: "Data pembayaran tidak ditemukan." };
    }

    const cleanReason = reason.trim();
    if (cleanReason.length < 5) {
      return { error: "Tulis alasan minimal 5 karakter." };
    }

    const rejected = await prisma.payment.updateMany({
      where: { id: paymentId, status: "PENDING" },
      data: {
        status: "FAILED",
        // Keep what the customer sent (bank, sender name, notes) next to the rejection.
        maskedResponse: JSON.stringify({
          ...parseJsonObject(payment.maskedResponse),
          rejectedReason: cleanReason,
          rejectedAt: new Date().toISOString(),
        }),
      },
    });

    if (rejected.count === 0) {
      return { error: "Bukti bayar ini sudah diproses. Muat ulang halaman." };
    }

    // Kirim notifikasi WhatsApp otomatis ke pelanggan tentang alasan penolakan
    if (payment.order) {
      try {
        const waText =
          `*PT. ZAHDAN KAMAL SENTOSA*\n` +
          `_Pemberitahuan Verifikasi Pembayaran_\n\n` +
          `Halo Bpk/Ibu *${payment.order.customerName}*,\n` +
          `Bukti pembayaran yang Anda unggah untuk pesanan *${payment.order.orderCode}* belum dapat kami verifikasi.\n\n` +
          `⚠️ *Catatan Admin:* ${cleanReason}\n\n` +
          `Mohon periksa kembali bukti transfer Anda dan unggah ulang bukti yang valid melalui tautan pelacakan pesanan Anda, atau hubungi admin kami jika ada kendala.`;

        await sendWhatsAppMessage({
          targetPhone: payment.order.customerPhone,
          message: waText,
        });
      } catch (waErr) {
        console.warn("Gagal mengirim WA reject payment:", waErr);
      }
    }

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("Gagal menolak pembayaran:", err);
    return { error: "Terjadi kendala saat menolak bukti pembayaran." };
  }
}

