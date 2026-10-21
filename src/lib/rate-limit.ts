import { createHmac } from "node:crypto";
import { prisma } from "./prisma";

/**
 * Mendapatkan secret key untuk HMAC identitas rate limit dari environment variable.
 */
function getRateLimitSecret(): string {
  const secret =
    process.env.ADMIN_RATE_LIMIT_SECRET ||
    process.env.AUTH_SECRET ||
    "zks_catering_fallback_rate_limit_secret_2026";
  return secret;
}

/**
 * Menghitung HMAC-SHA256 untuk menyamarkan identitas (IP atau username) sehingga
 * alamat IP asli tidak pernah disimpan mentah di basis data.
 */
export function computeHmac(identifier: string): string {
  const secret = getRateLimitSecret();
  return createHmac("sha256", secret).update(identifier.trim().toLowerCase()).digest("hex");
}

/**
 * Mengambil alamat IP klien dari header request.
 * Mengambil elemen pertama dari x-forwarded-for, atau x-real-ip, atau fallback ke "unknown".
 * CATATAN PENTING: Keandalan x-forwarded-for sangat bergantung pada konfigurasi hosting/reverse proxy.
 * Bila di-host di balik proxy tepercaya, proxy harus menimpa atau menormalisasi header ini.
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }
  const realIp = headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();
  return "unknown";
}

export interface RateLimitResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Memeriksa apakah percobaan login diizinkan berdasarkan riwayat kegagalan 15 menit terakhir:
 * - Maksimal 5 kegagalan per 15 menit per IP (action: "admin_login")
 * - Maksimal 10 kegagalan per 15 menit per username ber-HMAC (action: "admin_login_user")
 */
export async function checkLoginRateLimit(clientIp: string, username: string): Promise<RateLimitResult> {
  try {
    const windowStart = new Date(Date.now() - 15 * 60 * 1000); // 15 menit yang lalu
    const ipHmac = computeHmac(clientIp);
    const userHmac = computeHmac(username);

    // Periksa batas kegagalan IP
    const ipFailures = await prisma.rateLimitAttempt.count({
      where: {
        ipHmac,
        action: "admin_login",
        createdAt: { gte: windowStart },
      },
    });

    if (ipFailures >= 5) {
      return {
        allowed: false,
        reason: "Terlalu banyak percobaan login gagal dari jaringan Anda. Silakan coba lagi setelah 15 menit.",
      };
    }

    // Periksa batas kegagalan username
    const userFailures = await prisma.rateLimitAttempt.count({
      where: {
        ipHmac: userHmac,
        action: "admin_login_user",
        createdAt: { gte: windowStart },
      },
    });

    if (userFailures >= 10) {
      return {
        allowed: false,
        reason: "Terlalu banyak percobaan login gagal untuk akun ini. Silakan coba lagi setelah 15 menit.",
      };
    }

    return { allowed: true };
  } catch (err) {
    console.warn("Gagal memeriksa rate limit login (mengizinkan akses):", err);
    return { allowed: true };
  }
}

/**
 * Mencatat kegagalan login untuk IP dan username (keduanya disamarkan dengan HMAC),
 * sekaligus membersihkan baris RateLimitAttempt yang lebih tua dari 72 jam.
 */
export async function recordLoginFailure(clientIp: string, username: string): Promise<void> {
  const cutoff72h = new Date(Date.now() - 72 * 60 * 60 * 1000); // 72 jam yang lalu
  const ipHmac = computeHmac(clientIp);
  const userHmac = computeHmac(username);

  // Hapus log kedaluwarsa (> 72 jam)
  try {
    await prisma.rateLimitAttempt.deleteMany({
      where: {
        createdAt: { lt: cutoff72h },
      },
    });
  } catch (error) {
    // Jangan gagalkan pencatatan jika pembersihan baris lama menemui kendala
    console.error("Gagal membersihkan rate limit lama:", error);
  }

  // Catat kegagalan baru untuk IP dan username
  await prisma.rateLimitAttempt.createMany({
    data: [
      { ipHmac, action: "admin_login" },
      { ipHmac: userHmac, action: "admin_login_user" },
    ],
  });
}

/**
 * Memeriksa pembatasan laju pengajuan pesanan tamu:
 * - Maksimal 5 pengajuan pesanan per 15 menit per IP (action: "order_submission")
 */
export async function checkOrderRateLimit(clientIp: string): Promise<RateLimitResult> {
  const windowStart = new Date(Date.now() - 15 * 60 * 1000);
  const ipHmac = computeHmac(clientIp);

  const attempts = await prisma.rateLimitAttempt.count({
    where: {
      ipHmac,
      action: "order_submission",
      createdAt: { gte: windowStart },
    },
  });

  if (attempts >= 5) {
    return {
      allowed: false,
      reason: "Terlalu banyak pengajuan pesanan dari jaringan Anda. Silakan coba lagi setelah 15 menit.",
    };
  }

  return { allowed: true };
}

/**
 * Mencatat percobaan pengajuan pesanan untuk membatasi laju spam.
 */
export async function recordOrderAttempt(clientIp: string): Promise<void> {
  const ipHmac = computeHmac(clientIp);
  await prisma.rateLimitAttempt.create({
    data: {
      ipHmac,
      action: "order_submission",
    },
  });
}

