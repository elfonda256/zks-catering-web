import type { Metadata } from "next";
import { AdminPage } from "@/app/admin/_components/AdminPage";
import { MonthlyReportView } from "@/modules/reports/components/MonthlyReportView";
import { getMonthlyReport } from "@/modules/reports/services/reports.repository";
import { recentWibMonths } from "@/lib/wib-date";

export const metadata: Metadata = {
  title: "Laporan bulanan | Admin ZKS Catering",
  robots: { index: false, follow: false },
};

async function Content({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const months = recentWibMonths(new Date(), 12);
  const requested = (await searchParams).month;
  const month = months.some((m) => m.key === requested) ? requested! : months[0].key;
  const report = await getMonthlyReport(month);
  return <MonthlyReportView report={report} month={month} months={months} />;
}

export default function Page(props: { searchParams: Promise<{ month?: string }> }) {
  return (
    <AdminPage title="Laporan bulanan" description="Pesanan, porsi, pendapatan, dan pelanggan per bulan.">
      <Content searchParams={props.searchParams} />
    </AdminPage>
  );
}
