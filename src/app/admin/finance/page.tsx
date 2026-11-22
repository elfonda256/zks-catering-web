import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { FinanceView } from "@/modules/finance/components/FinanceView";
import { getFinanceSummary } from "@/modules/finance/services/finance.repository";
import { recentWibMonths } from "@/lib/wib-date";

export const metadata: Metadata = {
  title: "Keuangan | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

async function Content({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const months = recentWibMonths(new Date(), 12);
  const requested = (await searchParams).month;
  const month = months.some((m) => m.key === requested) ? requested! : months[0].key;
  const summary = await getFinanceSummary(month);
  return <FinanceView summary={summary} months={months} />;
}

export default function Page(props: { searchParams: Promise<{ month?: string }> }) {
  return (
    <AdminPage title="Keuangan" description="Pembayaran diterima, bukti yang menunggu verifikasi, piutang, dan refund.">
      <Content searchParams={props.searchParams} />
    </AdminPage>
  );
}
