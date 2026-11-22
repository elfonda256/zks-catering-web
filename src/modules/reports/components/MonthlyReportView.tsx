"use client";

import { useRouter } from "next/navigation";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { KpiGrid } from "@/shared/components/ui/KpiGrid";
import { SelectField } from "@/shared/components/ui/SelectField";
import { formatRupiah, formatRupiahShort } from "@/shared/utils/formatters";
import type { MonthlyReport } from "../monthly-report";

interface MonthlyReportViewProps {
  report: MonthlyReport;
  month: string;
  months: { key: string; label: string }[];
}

const PANEL = "rounded-[12px] border border-stone-200 bg-white p-5 space-y-4";

export function MonthlyReportView({ report, month, months }: MonthlyReportViewProps) {
  const router = useRouter();
  const monthLabel = months.find((m) => m.key === month)?.label ?? month;
  const maxPortions = Math.max(1, ...report.packages.map((p) => p.portions));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="sm:w-56">
          <SelectField label="Bulan" value={month} onChange={(e) => router.push(`/admin/reports?month=${e.target.value}`)}>
            {months.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </SelectField>
        </div>
        <p className="text-[13px] text-stone-600 sm:max-w-md sm:text-right">
          Pesanan dihitung pada bulan acaranya. Uang diterima dihitung pada bulan pembayaran disetujui.
        </p>
      </div>

      <KpiGrid label={`Ringkasan ${monthLabel}`} columns={4}>
        <KpiCard label="Pesanan berjalan" tone="brand" value={report.orders} subtext={`${report.portions.toLocaleString("id-ID")} porsi`} />
        <KpiCard label="Nilai pesanan" value={formatRupiahShort(report.orderValue)} subtext={`Rata-rata ${formatRupiahShort(report.averageOrderValue)}`} />
        <KpiCard label="Uang diterima" tone="success" value={formatRupiahShort(report.received)} subtext="Pembayaran disetujui" />
        <KpiCard
          label="Batal / ditolak"
          tone="danger"
          value={report.cancelled}
          subtext={`${Math.round(report.cancelRate * 100)}% dari pesanan yang diputuskan`}
        />
      </KpiGrid>

      {report.orders === 0 ? (
        <EmptyState title="Belum ada pesanan berjalan" description={`Tidak ada pesanan dibayar dengan tanggal acara di ${monthLabel}.`} />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className={PANEL} aria-labelledby="pkg-title">
            <h2 id="pkg-title" className="text-[15px] font-semibold text-stone-900">
              Porsi per paket
            </h2>
            <ul className="space-y-4">
              {report.packages.map((pkg) => (
                <li key={pkg.name} className="space-y-2 text-[14px]">
                  <div className="flex justify-between gap-4">
                    <span className="text-stone-800">{pkg.name}</span>
                    <span className="tabular-nums text-stone-900">{pkg.portions.toLocaleString("id-ID")} porsi</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100" aria-hidden="true">
                    <div className="h-2 rounded-full bg-brand-500" style={{ width: `${(pkg.portions / maxPortions) * 100}%` }} />
                  </div>
                  <p className="text-[12px] text-stone-500">{formatRupiah(pkg.value)}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className={PANEL} aria-labelledby="cust-title">
            <h2 id="cust-title" className="text-[15px] font-semibold text-stone-900">
              Pelanggan terbesar
            </h2>
            <ol className="divide-y divide-stone-100 text-[14px]">
              {report.topCustomers.map((customer, index) => (
                <li key={customer.name} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[12px] text-stone-400">{index + 1}</span>
                    <span className="text-stone-800">{customer.name}</span>
                  </span>
                  <span className="text-right">
                    <span className="block tabular-nums text-stone-900">{formatRupiah(customer.value)}</span>
                    <span className="text-[12px] text-stone-500">{customer.orders} pesanan</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </div>
  );
}
