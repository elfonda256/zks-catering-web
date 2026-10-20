"use server";

import { signIn, RateLimitError } from "@/auth";
import { AuthError } from "next-auth";

export interface LoginActionState {
  error?: string;
}

/**
 * Server Action untuk menangani autentikasi formulir login admin.
 */
export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const callbackUrlRaw = String(formData.get("callbackUrl") || "");

  let callbackUrl = "/admin/dashboard";
  if (callbackUrlRaw.startsWith("/admin/") && !callbackUrlRaw.startsWith("/admin/login")) {
    callbackUrl = callbackUrlRaw;
  }

  if (!username || !password) {
    return { error: "Nama pengguna dan kata sandi wajib diisi." };
  }

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: callbackUrl,
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      const isRateLimited =
        error instanceof RateLimitError ||
        (error as unknown as { code?: string }).code === "rate_limited" ||
        (error.cause as unknown as { code?: string } | undefined)?.code === "rate_limited";

      if (isRateLimited) {
        return {
          error: "Terlalu banyak percobaan login gagal. Silakan tunggu 15 menit.",
        };
      }

      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Nama pengguna atau kata sandi salah." };
        default:
          return { error: "Terjadi kesalahan saat masuk. Silakan coba lagi." };
      }
    }

    // Galat pengalihan Next.js (NEXT_REDIRECT) wajib dilempar kembali
    throw error;
  }
}
