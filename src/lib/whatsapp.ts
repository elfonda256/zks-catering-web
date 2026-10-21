/**
 * src/lib/whatsapp.ts
 *
 * Layanan integrasi WhatsApp Gateway resmi via Fonnte API.
 * Digunakan untuk mengirim notifikasi transaksional otomatis ke pelanggan katering ZKS.
 */

interface SendWhatsAppParams {
  targetPhone: string;
  message: string;
}

export function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://zks-catering-web-6fkr.vercel.app";
}

/**
 * Mengirim pesan WhatsApp melalui Fonnte API.
 */
export async function sendWhatsAppMessage({
  targetPhone,
  message,
}: SendWhatsAppParams): Promise<boolean> {
  const token = process.env.FONNTE_TOKEN;
  if (!token) {
    console.warn("[WhatsApp] FONNTE_TOKEN belum dikonfigurasi di environment variable.");
    return false;
  }

  // Format nomor telepon (standar Indonesia)
  let clean = targetPhone.replace(/[^0-9]/g, "");
  if (clean.startsWith("62")) {
    clean = "0" + clean.substring(2);
  } else if (clean.startsWith("8")) {
    clean = "0" + clean;
  }

  if (!clean || clean.length < 9) {
    console.warn(`[WhatsApp] Nomor tujuan '${targetPhone}' tidak valid.`);
    return false;
  }

  try {
    const formData = new FormData();
    formData.append("target", clean);
    formData.append("message", message);
    formData.append("countryCode", "62");

    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    });

    const result = await response.json();
    console.log(`[WhatsApp] Status pengiriman ke ${clean}:`, result?.status, result?.reason || "");
    return result?.status === true;
  } catch (error) {
    console.error("[WhatsApp] Gagal mengirim pesan:", error);
    return false;
  }
}
