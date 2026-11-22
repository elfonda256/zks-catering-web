"use server";

import { signIn, RateLimitError } from "@/auth";
import { AuthError } from "next-auth";
import { unstable_rethrow } from "next/navigation";

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
    // A successful sign-in ends with a redirect, which Next.js signals by throwing; pass it on unlogged.
    unstable_rethrow(error);

    // Wrong passwords and rate limiting are expected outcomes, not errors, so they are not logged.
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
          console.error("Login action error:", error);
          return { error: "Terjadi kesalahan saat masuk. Silakan coba lagi." };
      }
    }

    console.error("Login action error:", error);
    throw error;
  }
}
