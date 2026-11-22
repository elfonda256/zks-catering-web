import { requireAdmin } from "@/lib/require-admin";
import { wibMonthRange } from "@/lib/wib-date";
import { paymentsToCsv } from "@/modules/finance/csv";
import { getSettledPayments } from "@/modules/finance/services/finance.repository";

/** CSV of payments received in one WIB month: /admin/finance/export?month=YYYY-MM */
export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return new Response("Sesi admin tidak valid.", { status: 401 });
  }

  const month = new URL(request.url).searchParams.get("month") ?? "";
  if (!wibMonthRange(month)) {
    return new Response("Parameter month harus berformat YYYY-MM.", { status: 400 });
  }

  const csv = paymentsToCsv(await getSettledPayments(month));
  // Byte-order mark so Excel opens the file as UTF-8.
  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pembayaran-zks-${month}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
