import { timingSafeEqual } from "node:crypto";
import { expireOverdueOrders } from "@/modules/dashboard/services/order-expiry.repository";

function isAuthorized(header: string | null, secret: string | undefined): boolean {
  if (!secret || !header) return false;
  const given = Buffer.from(header);
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/**
 * Daily sweep scheduled in vercel.json. Vercel Cron sends `Authorization: Bearer $CRON_SECRET`;
 * without that variable set, the route refuses every call.
 */
export async function GET(request: Request) {
  if (!isAuthorized(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const expired = await expireOverdueOrders();
    return Response.json({ expired });
  } catch (err) {
    console.error("Gagal menjalankan kedaluwarsa pesanan:", err);
    return Response.json({ error: "Sweep failed" }, { status: 500 });
  }
}
