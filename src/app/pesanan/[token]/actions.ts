"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { hashAccessToken } from "@/lib/order-logic";
import { expireOverdueOrdersOnAccess } from "@/modules/dashboard/services/order-expiry.repository";
import { getAmountDue } from "./payment-due";
import { MAX_PROOF_BYTES, PROOF_MIME_TYPES } from "./proof-image";
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
    await expireOverdueOrdersOnAccess({ accessTokenHash: tokenHash });
    const order = await prisma.order.findUnique({
      where: { accessTokenHash: tokenHash },
      include: { payments: { select: { status: true, amount: true } } },
    });

    if (!order) {
      return { error: "Pesanan tidak ditemukan di sistem." };
    }

    const due = getAmountDue(order);
    if (!due) {
      return {
        error: "Pesanan ini sedang tidak menunggu pembayaran. Muat ulang halaman.",
      };
    }

    if (order.payments.some((p) => p.status === "PENDING")) {
      return {
        error: "Bukti bayar sebelumnya masih diverifikasi admin. Tunggu sebentar, lalu muat ulang halaman.",
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
      return {
        error: "Berkas foto / tangkapan layar bukti transfer wajib diunggah.",
      };
    }

    if (file.size > MAX_PROOF_BYTES) {
      return {
        error: "Foto bukti terlalu besar. Kirim tangkapan layar dari aplikasi bank, atau muat ulang halaman lalu pilih fotonya lagi.",
      };
    }

    if (!PROOF_MIME_TYPES.includes(file.type)) {
      return {
        error: "Format berkas tidak valid. Harap unggah gambar JPG, PNG, atau WebP.",
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || "image/jpeg";
    const base64DataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

    let paymentUrl = base64DataUrl;

    // Di lingkungan lokal (non-produksi), coba simpan berkas cadangan jika direktori dapat ditulis
    if (process.env.NODE_ENV !== "production") {
      try {
        let ext = "jpg";
        if (file.type === "image/png") ext = "png";
        if (file.type === "image/webp") ext = "webp";

        const cleanOrderCode = order.orderCode.replace(/[^A-Za-z0-9-]/g, "");
        const fileName = `proof-${cleanOrderCode}-${Date.now()}.${ext}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads", "payments");

        await mkdir(uploadDir, { recursive: true });
        const targetFilePath = path.join(uploadDir, fileName);
        await writeFile(targetFilePath, buffer);
        paymentUrl = `/uploads/payments/${fileName}`;
      } catch {
        // Jika sistem berkas read-only, tetap gunakan base64DataUrl
        paymentUrl = base64DataUrl;
      }
    }

    const { paymentType, amount } =
      due.kind === "settlement"
        ? { paymentType: "SETTLEMENT" as PaymentType, amount: due.remaining }
        : paymentTypeInput === "DP" && due.dpAmount
          ? { paymentType: "DP" as PaymentType, amount: due.dpAmount }
          : { paymentType: "FULL" as PaymentType, amount: due.totalAmount };

    // Simpan record Payment PENDING. Baris pesanan dikunci agar dua kiriman bersamaan
    // tidak menghasilkan dua bukti yang menunggu verifikasi.
    // The status is read again under the lock: the order may have expired or changed meanwhile.
    const outcome = await prisma.$transaction(async (tx) => {
      const [locked] = await tx.$queryRaw<{ status: string }[]>`SELECT status FROM "Order" WHERE id = ${order.id} FOR UPDATE`;
      if (locked?.status !== order.status) return "changed";
      const pending = await tx.payment.count({
        where: { orderId: order.id, status: "PENDING" },
      });
      if (pending > 0) return "pending";

      await tx.payment.create({
        data: {
          orderId: order.id,
          paymentRef: `${order.orderCode}-${paymentType}-${Date.now()}`,
          paymentType,
          amount,
          status: "PENDING",
          paymentChannel: senderBank,
          paymentUrl,
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
      return "created";
    });

    if (outcome === "changed") {
      return { error: "Status pesanan baru saja berubah. Muat ulang halaman." };
    }
    if (outcome === "pending") {
      return {
        error: "Bukti bayar sebelumnya masih diverifikasi admin. Tunggu sebentar, lalu muat ulang halaman.",
      };
    }

    revalidatePath(`/pesanan/${rawToken}`);
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Bukti transfer berhasil dikirim. Tim operasional ZKS sedang memverifikasi pembayaran Anda.",
    };
  } catch (err: unknown) {
    console.error("Gagal memproses unggah bukti transfer:", err);
    return {
      error: "Bukti transfer belum terkirim karena kendala sistem. Silakan coba lagi.",
    };
  }
}
