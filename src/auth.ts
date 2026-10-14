import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { checkLoginRateLimit, recordLoginFailure, getClientIp } from "@/lib/rate-limit";

export class RateLimitError extends CredentialsSignin {
  code = "rate_limited";
}

// String hash scrypt dummy berformat valid untuk menyamakan waktu respon
// ketika nama pengguna tidak ditemukan (mitigasi timing attack)
const DUMMY_SCRYPT_HASH =
  "$scrypt$N=131072,r=8,p=1$e3b0c44298fc1c149afbf4c8996fb924$00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 jam
    updateAge: 60 * 60, // 1 jam
  },
  pages: {
    signIn: "/admin/login",
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const username =
          typeof credentials?.username === "string"
            ? credentials.username.trim()
            : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (!username || !password) {
          return null;
        }

        const clientIp = request?.headers
          ? getClientIp(request.headers)
          : "unknown";

        // 1. Terapkan rate limit sebelum verifikasi kredensial
        const rateLimit = await checkLoginRateLimit(clientIp, username);
        if (!rateLimit.allowed) {
          throw new RateLimitError();
        }

        // 2. Cari admin di database
        const admin = await prisma.admin.findUnique({
          where: { username },
        });

        // 3. Jika admin tidak ditemukan, tetap jalankan satu kali verifikasi scrypt palsu
        if (!admin) {
          await verifyPassword(password, DUMMY_SCRYPT_HASH);
          await recordLoginFailure(clientIp, username);
          return null;
        }

        // 4. Verifikasi hash kata sandi asli
        const isValid = await verifyPassword(password, admin.passwordHash);
        if (!isValid) {
          await recordLoginFailure(clientIp, username);
          return null;
        }

        return {
          id: String(admin.id),
          name: admin.username,
        };
      },
    }),
  ],
  callbacks: {
    redirect({ url, baseUrl }) {
      // callbackUrl hanya boleh berupa jalur relatif yang diawali /admin/
      if (url.startsWith("/admin/")) {
        return `${baseUrl}${url}`;
      }
      if (url.startsWith(`${baseUrl}/admin/`)) {
        return url;
      }
      return `${baseUrl}/admin/dashboard`;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.name;
        token.role = "admin";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.name = token.username as string;
        (session.user as unknown as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});
