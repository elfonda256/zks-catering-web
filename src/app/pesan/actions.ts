"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getClientIp, checkOrderRateLimit, recordOrderAttempt } from "@/lib/rate-limit";
import { generateOrderCode, generateOrderAccessToken, calculateSubtotal } from "@/lib/order-logic";
import { newOrderWhatsAppText, parseOrderDetails } from "@/lib/order-form";
import { MENU_PACKAGES } from "@/data/catering-data";
import { ensurePackageMenuItem } from "@/modules/menu/package-menu-item";
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

  // 4–7. Data pelanggan, paket, kuantitas, dan jeda pemesanan (WIB)
  const details = parseOrderDetails(formData);
  if (!details.ok) {
    return { error: details.error };
  }
  const {
    customerName,
    customerPhone,
    customerAddress,
    customerEmail,
    eventDate: fullEventDate,
    packagePrice,
    quantity,
    notes,
  } = details.value;

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
      const menuItem = await ensurePackageMenuItem(tx, packagePrice);

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
      const waText = newOrderWhatsAppText({
        customerName,
        orderCode,
        packageName: selectedPackage.name,
        quantity,
        subtotal,
        customerAddress,
        trackingUrl,
      });

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
