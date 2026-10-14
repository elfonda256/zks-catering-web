import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy Next.js 16.4.0 untuk memproteksi rute administratif /admin/*.
 * Sesuai dokumentasi Next.js 16, konvensi 'middleware' telah didepresiasi dan digantikan oleh 'proxy'.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lindungi seluruh rute /admin/* kecuali halaman /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value ||
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
