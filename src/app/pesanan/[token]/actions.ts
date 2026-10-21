"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { hashAccessToken } from "@/lib/order-logic";
import type { PaymentType } from "@/generated/prisma/enums";

export interface SubmitPaymentProofState {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function submitPaymentProofAction(
  rawToken: string,
  _prevState: SubmitPaymentProofState,
  formData: FormData
): Promise<SubmitPaymentProofState> {
  try {
    if (!rawToken || rawToken.length !== 64) {
      return { error: "Token akses pesanan tidak valid." };
    }

    const tokenHash = hashAccessToken(rawToken);
    const order = await prisma.order.findUnique({
      where: { accessTokenHash: tokenHash },
    });

    if (!order) {
      return { error: "Pesanan tidak ditemukan di sistem." };
    }

    if (order.status !== "CONFIRMED_AWAITING_PAYMENT" && order.status !== "DP_PAID") {
      return {
        error: `Pesanan saat ini berstatus ${order.status}. Bukti pembayaran hanya dapat diunggah untuk pesanan yang menunggu pembayaran.`,
      };
    }

    const paymentTypeInput = String(formData.get("paymentType") || "FULL") as PaymentType;
    const senderBank = String(formData.get("senderBank") || "").trim();
    const senderName = String(formData.get("senderName") || "").trim();
    const customerNotes = String(formData.get("notes") || "").trim();
    const file = formData.get("proofFile") as File | null;

    if (!senderBank) {
      return { error: "Nama bank pengirim wajib dipilih / diisi." };
    }

    if (!senderName || senderName.length < 2) {
      return { error: "Nama pemilik rekening pengirim wajib diisi." };
    }

    if (!file || file.size === 0) {
      return { error: "Berkas foto / tangkapan layar bukti transfer wajib diunggah." };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { error: "Ukuran berkas bukti transfer maksimal 5 MB." };
    }

    const allowedMime = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedMime.includes(file.type)) {
      return { error: "Format berkas tidak valid. Harap unggah gambar JPG, PNG, atau WebP." };
    }

    // Tentukan ekstensi
    let ext = "jpg";
    if (file.type === "image/png") ext = "png";
    if (file.type === "image/webp") ext = "webp";

    const cleanOrderCode = order.orderCode.replace(/[^A-Za-z0-9-]/g, "");
    const fileName = `proof-${cleanOrderCode}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "payments");

    await mkdir(uploadDir, { recursive: true });
    const targetFilePath = path.join(uploadDir, fileName);

    const arrayBuffer = await file.arrayBuffer();
    await writeFile(targetFilePath, Buffer.from(arrayBuffer));

    const paymentType: PaymentType =
      paymentTypeInput === "DP" && order.dpAmount ? "DP" : "FULL";

    const amount =
      paymentType === "DP"
        ? order.dpAmount || order.totalAmount || order.subtotal
        : order.totalAmount || order.subtotal;

    // Simpan record Payment dengan status PENDING
    await prisma.payment.create({
      data: {
        orderId: order.id,
        paymentRef: `${order.orderCode}-${paymentType}-${Date.now()}`,
        paymentType,
        amount: amount || order.subtotal,
        status: "PENDING",
        paymentChannel: senderBank,
        paymentUrl: `/uploads/payments/${fileName}`,
        gatewayName: "MANUAL_BANK_TRANSFER",
        providerTransactionId: `manual-proof-${Date.now()}`,
        maskedResponse: JSON.stringify({
          senderBank,
          senderName,
          customerNotes: customerNotes || null,
          uploadedAt: new Date().toISOString(),
          originalFilename: file.name,
        }),
      },
    });

    revalidatePath(`/pesanan/${rawToken}`);
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Bukti transfer berhasil dikirim. Tim operasional ZKS sedang memverifikasi pembayaran Anda.",
    };
  } catch (err: unknown) {
    console.error("Gagal memproses unggah bukti transfer:", err);
    return {
      error:
        err instanceof Error
          ? err.message
          : "Terjadi kendala saat menyimpan berkas bukti transfer.",
    };
  }
}
