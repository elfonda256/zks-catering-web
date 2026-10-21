"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getClientIp, checkOrderRateLimit, recordOrderAttempt } from "@/lib/rate-limit";
import {
  validateOrderLeadTime,
  generateOrderCode,
  generateOrderAccessToken,
  calculateSubtotal,
} from "@/lib/order-logic";
import { MENU_PACKAGES } from "@/data/catering-data";
import { sendWhatsAppMessage, getAppBaseUrl } from "@/lib/whatsapp";

export interface CreateOrderState {
  error?: string;
  success?: boolean;
  redirectUrl?: string;
}

export async function createOrderAction(
  _prevState: CreateOrderState,
  formData: FormData
): Promise<CreateOrderState> {
  // 1. Proteksi Anti-Bot (Honeypot)
  const honeypot = String(formData.get("hp_website") || "");
  if (honeypot) {
    return { error: "Permintaan pemesanan tidak dapat diproses." };
  }

  // 2. Proteksi Waktu Pengisian Form (Minimal 2.5 detik)
  const formLoadedAt = Number(formData.get("formLoadedAt") || 0);
  if (formLoadedAt > 0 && Date.now() - formLoadedAt < 2500) {
    return { error: "Pengisian formulir terdeteksi terlalu cepat. Harap tinjau kembali data Anda." };
  }

  // 3. Persetujuan Syarat & Ketentuan
  const acceptTerms = formData.get("acceptTerms");
  if (!acceptTerms) {
    return { error: "Anda wajib menyetujui syarat & ketentuan pemesanan katering ZKS." };
  }

  // 4. Ekstraksi & Sanitasi Data Formulir
  const customerName = String(formData.get("customerName") || "").trim();
  const customerPhone = String(formData.get("customerPhone") || "").trim();
  const customerAddress = String(formData.get("customerAddress") || "").trim();
  const customerEmail = String(formData.get("customerEmail") || "").trim() || null;
  const eventDateStr = String(formData.get("eventDate") || "").trim();
  const eventTimeStr = String(formData.get("eventTime") || "").trim() || "11:00";
  const packagePrice = Number(formData.get("packagePrice") || 0);
  const quantity = Number(formData.get("quantity") || 0);
  const notes = String(formData.get("notes") || "").trim() || null;

  // 5. Validasi Kolom Data Pelanggan
  if (!customerName || customerName.length < 3) {
    return { error: "Nama lengkap pemesan wajib diisi (minimal 3 karakter)." };
  }

  const phoneRegex = /^[0-9+-\s]{10,20}$/;
  if (!customerPhone || !phoneRegex.test(customerPhone)) {
    return { error: "Nomor telepon / WhatsApp tidak valid (minimal 10 digit angka)." };
  }

  if (!customerAddress || customerAddress.length < 10) {
    return { error: "Alamat pengantaran di Karawang wajib diisi lengkap (minimal 10 karakter)." };
  }

  // 6. Validasi Paket & Kuantitas
  if (![17000, 20000, 25000].includes(packagePrice)) {
    return { error: "Paket katering yang dipilih tidak valid." };
  }

  if (!quantity || quantity < 20) {
    return { error: "Pemesanan katering minimal 20 porsi." };
  }

  // 7. Validasi Tanggal & Jeda Pemesanan (WIB)
  if (!eventDateStr) {
    return { error: "Tanggal acara wajib dipilih." };
  }

  const [year, month, day] = eventDateStr.split("-").map(Number);
  const [hours, minutes] = eventTimeStr.split(":").map(Number);

  if (!year || !month || !day || isNaN(hours) || isNaN(minutes)) {
    return { error: "Format tanggal atau waktu acara tidak valid." };
  }

  // Konversi jam WIB (UTC+7) ke objek Date UTC
  const fullEventDate = new Date(Date.UTC(year, month - 1, day, hours - 7, minutes, 0));

  const validation = validateOrderLeadTime(fullEventDate, quantity);
  if (!validation.valid) {
    return { error: validation.error || "Tanggal acara tidak memenuhi batas minimum pemesanan." };
  }

  // 8. Pembatasan Laju (Rate Limiting)
  const reqHeaders = await headers();
  const clientIp = getClientIp(reqHeaders);

  try {
    const rateLimit = await checkOrderRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return { error: rateLimit.reason || "Terlalu banyak pengajuan pesanan dari jaringan Anda." };
    }
  } catch (err) {
    console.error("Peringatan: Gagal memeriksa rate limit pesanan:", err);
  }

  // 9. Komputasi Subtotal di Server
  const subtotal = calculateSubtotal(packagePrice, quantity);
  const orderCode = generateOrderCode(fullEventDate);
  const { rawToken, accessTokenHash } = generateOrderAccessToken();

  const selectedPackage = MENU_PACKAGES[packagePrice];

  // 10. Simpan Pesanan ke Basis Data
  try {
    await prisma.$transaction(async (tx) => {
      // Pastikan kategori katering tersedia
      let category = await tx.category.findUnique({
        where: { slug: "paket-katering" },
      });

      if (!category) {
        category = await tx.category.create({
          data: {
            name: "Paket Katering",
            slug: "paket-katering",
          },
        });
      }

      // Pastikan MenuItem untuk paket ini tersedia
      let menuItem = await tx.menuItem.findFirst({
        where: {
          categoryId: category.id,
          price: packagePrice,
        },
      });

      if (!menuItem) {
        menuItem = await tx.menuItem.create({
          data: {
            name: selectedPackage.name,
            description: selectedPackage.description,
            price: packagePrice,
            categoryId: category.id,
            isActive: true,
          },
        });
      }

      // Buat record Order dan OrderItem
      await tx.order.create({
        data: {
          orderCode,
          accessTokenHash,
          customerName,
          customerPhone,
          customerAddress,
          customerEmail,
          eventDate: fullEventDate,
          totalPcs: quantity,
          subtotal,
          status: "WAITING_ADMIN_CONFIRMATION",
          termsAcceptedAt: new Date(),
          notes,
          items: {
            create: [
              {
                menuItemId: menuItem.id,
                quantity,
                unitPrice: packagePrice,
                subtotal,
                notes: notes ? `Catatan: ${notes}` : null,
              },
            ],
          },
        },
      });
    });

    // Catat log percobaan pemesanan untuk rate limit
    try {
      await recordOrderAttempt(clientIp);
    } catch {
      // Non-blocking
    }

    // Kirim notifikasi WhatsApp otomatis ke pelanggan
    try {
      const trackingUrl = `${getAppBaseUrl()}/pesanan/${rawToken}`;
      const waText =
        `*PT. ZAHDAN KAMAL SENTOSA*\n` +
        `_Konfirmasi Pengajuan Pesanan Katering_\n\n` +
        `Halo Bpk/Ibu *${customerName}*,\n` +
        `Terima kasih telah mengajukan pesanan katering industri di PT. Zahdan Kamal Sentosa.\n\n` +
        `📋 *Detail Pengajuan Pesanan:*\n` +
        `• Kode Pesanan : *${orderCode}*\n` +
        `• Paket Menu : ${selectedPackage.name}\n` +
        `• Jumlah Porsi : ${quantity} Porsi\n` +
        `• Subtotal Makanan : Rp${subtotal.toLocaleString("id-ID")}\n` +
        `• Alamat Pabrik : ${customerAddress}\n\n` +
        `Tim operasional kami sedang meninjau pesanan Anda dan menghitung estimasi ongkos kirim resmi ke lokasi pabrik Anda.\n\n` +
        `🔗 *Tautan Pelacakan & Pembayaran:*\n` +
        `${trackingUrl}\n\n` +
        `_Simpan pesan dan tautan ini untuk memantau status pesanan dan melakukan pembayaran._`;

      await sendWhatsAppMessage({
        targetPhone: customerPhone,
        message: waText,
      });
    } catch (waErr) {
      console.warn("Gagal mengirim WA notifikasi order baru:", waErr);
    }

    return {
      success: true,
      redirectUrl: `/pesanan/${rawToken}`,
    };
  } catch (error) {
    console.error("Gagal menyimpan pesanan baru:", error);
    return {
      error: "Terjadi kendala saat menyimpan pesanan Anda ke sistem. Silakan hubungi kami via WhatsApp.",
    };
  }
}
