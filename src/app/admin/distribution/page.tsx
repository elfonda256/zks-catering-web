import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { DeliveryView } from "@/modules/delivery/components/DeliveryView";
import { DELIVERY_DAYS, getDeliveryStops } from "@/modules/delivery/services/delivery.repository";
import { startOfWibDay, wibDateKey } from "@/lib/wib-date";

export const metadata: Metadata = {
  title: "Pengiriman | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

const RELATIVE = ["Hari ini", "Besok", "Lusa"];

async function Content() {
  const now = new Date();
  const days = Array.from({ length: DELIVERY_DAYS }, (_, offset) => {
    const start = startOfWibDay(now, offset);
    const date = new Intl.DateTimeFormat("id-ID", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Jakarta" }).format(start);
    return { key: wibDateKey(start), label: `${RELATIVE[offset]} · ${date}` };
  });
  const stops = await getDeliveryStops(now);
  return <DeliveryView stops={stops} days={days} />;
}

export default function Page() {
  return (
    <AdminPage title="Pengiriman" description="Daftar antar pesanan yang sudah dibayar, urut jam tiba.">
      <Content />
    </AdminPage>
  );
}
