"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUS_LABELS, PAYMENT_TYPE_LABELS, type OrderStatusValue } from "@/modules/dashboard/constants";
import { Badge } from "@/shared/components/ui/Badge";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { KpiGrid } from "@/shared/components/ui/KpiGrid";
import { ListToolbar } from "@/shared/components/ui/ListToolbar";
import { SelectField } from "@/shared/components/ui/SelectField";
import { formatDate, formatDateTime, formatRupiah, formatRupiahShort } from "@/shared/utils/formatters";
import type { FinanceSummary, PaymentRow, ReceivableRow, RefundRow } from "../types";

type FinanceTab = "diterima" | "verifikasi" | "piutang" | "refund";

interface FinanceViewProps {
  summary: FinanceSummary;
  months: { key: string; label: string }[];
}

const statusBadge = (status: string) => {
  const meta = ORDER_STATUS_LABELS[status as OrderStatusValue] ?? { label: status, variant: "neutral" as const };
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
};

const paymentColumns = (timeField: "settledAt" | "createdAt"): DataColumn<PaymentRow>[] => [
  {
    key: "customer",
    header: "Pelanggan",
    mobile: "title",
    cell: (p) => (
      <>
        <span className="font-medium text-slate-900">{p.customerName}</span>
        <span className="block font-mono text-[12px] font-normal text-slate-500">{p.orderCode}</span>
      </>
    ),
  },
  { key: "time", header: timeField === "settledAt" ? "Diterima" : "Dikirim", mobile: "subtitle", cell: (p) => formatDateTime(p[timeField] ?? p.createdAt) },
  { key: "type", header: "Jenis", cell: (p) => PAYMENT_TYPE_LABELS[p.paymentType] ?? p.paymentType },
  { key: "channel", header: "Bank pengirim", cell: (p) => p.channel ?? "—" },
  { key: "amount", header: "Nominal", align: "right", isNumeric: true, mobile: "status", cell: (p) => formatRupiah(p.amount) },
];

const receivableColumns: DataColumn<ReceivableRow>[] = [
  {
    key: "customer",
    header: "Pelanggan",
    mobile: "title",
    cell: (r) => (
      <>
        <span className="font-medium text-slate-900">{r.customerName}</span>
        <span className="block font-mono text-[12px] font-normal text-slate-500">
          {r.orderCode} · {r.customerPhone}
        </span>
      </>
    ),
  },
  { key: "event", header: "Acara", mobile: "subtitle", cell: (r) => formatDate(r.eventDate) },
  { key: "status", header: "Status", cell: (r) => statusBadge(r.status) },
  { key: "total", header: "Total", align: "right", isNumeric: true, cell: (r) => formatRupiah(r.totalAmount) },
  { key: "paid", header: "Dibayar", align: "right", isNumeric: true, cell: (r) => formatRupiah(r.paidAmount) },
  {
    key: "remaining",
    header: "Sisa",
    align: "right",
    isNumeric: true,
    mobile: "status",
    cell: (r) => <span className="font-semibold text-amber-900">{formatRupiah(r.totalAmount - r.paidAmount)}</span>,
  },
];

const refundColumns: DataColumn<RefundRow>[] = [
  {
    key: "customer",
    header: "Pelanggan",
    mobile: "title",
    cell: (r) => (
      <>
        <span className="font-medium text-slate-900">{r.customerName}</span>
        <span className="block font-mono text-[12px] font-normal text-slate-500">{r.orderCode}</span>
      </>
    ),
  },
  { key: "cancelled", header: "Dibatalkan", mobile: "subtitle", cell: (r) => (r.cancelledAt ? formatDate(r.cancelledAt) : "—") },
  { key: "status", header: "Status", cell: (r) => statusBadge(r.status) },
  {
    key: "amount",
    header: "Dikembalikan",
    align: "right",
    isNumeric: true,
    mobile: "status",
    cell: (r) => (r.refundAmount !== null ? formatRupiah(r.refundAmount) : "Belum dihitung"),
  },
];

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

export function FinanceView({ summary, months }: FinanceViewProps) {
  const router = useRouter();
  const [tab, setTab] = useState<FinanceTab>(summary.pending.length > 0 ? "verifikasi" : "diterima");
  const monthLabel = months.find((m) => m.key === summary.month)?.label ?? summary.month;
  const outstanding = sum(summary.receivables.map((r) => r.totalAmount - r.paidAmount));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="sm:w-56">
          <SelectField
            label="Periode"
            value={summary.month}
            onChange={(e) => router.push(`/admin/finance?month=${e.target.value}`)}
          >
            {months.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </SelectField>
        </div>
        <a
          href={`/admin/finance/export?month=${summary.month}`}
          className="inline-flex h-9 items-center justify-center rounded-[8px] border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Unduh CSV {monthLabel}
        </a>
      </div>

      <KpiGrid label="Ringkasan keuangan" columns={4}>
        <KpiCard label="Diterima" value={formatRupiahShort(sum(summary.received.map((p) => p.amount)))} subtext={`${summary.received.length} pembayaran · ${monthLabel}`} />
        <KpiCard label="Menunggu verifikasi" value={summary.pending.length} subtext={formatRupiah(sum(summary.pending.map((p) => p.amount)))} />
        <KpiCard label="Piutang" value={formatRupiahShort(outstanding)} subtext={`${summary.receivables.length} pesanan belum lunas`} />
        <KpiCard label="Refund tertunda" value={summary.refunds.length} subtext="Perlu dikembalikan" />
      </KpiGrid>

      <ListToolbar
        tabs={[
          { id: "diterima", label: "Diterima", count: summary.received.length },
          { id: "verifikasi", label: "Menunggu verifikasi", count: summary.pending.length },
          { id: "piutang", label: "Piutang", count: summary.receivables.length },
          { id: "refund", label: "Refund", count: summary.refunds.length },
        ]}
        tab={tab}
        onTabChange={setTab}
        query=""
        onQueryChange={() => undefined}
        searchPlaceholder=""
        hideSearch
      />

      {tab === "diterima" &&
        (summary.received.length === 0 ? (
          <EmptyState title="Belum ada pembayaran diterima" description={`Tidak ada pembayaran yang disetujui pada ${monthLabel}.`} />
        ) : (
          <DataList rows={summary.received} columns={paymentColumns("settledAt")} rowKey={(p) => String(p.id)} />
        ))}
      {tab === "verifikasi" &&
        (summary.pending.length === 0 ? (
          <EmptyState title="Tidak ada bukti menunggu" description="Semua bukti transfer sudah diverifikasi." />
        ) : (
          <>
            <p className="text-[13px] text-slate-600">Setujui atau tolak bukti transfer dari halaman Pesanan.</p>
            <DataList rows={summary.pending} columns={paymentColumns("createdAt")} rowKey={(p) => String(p.id)} />
          </>
        ))}
      {tab === "piutang" &&
        (summary.receivables.length === 0 ? (
          <EmptyState title="Tidak ada piutang" description="Semua pesanan yang sudah berjalan sudah lunas." />
        ) : (
          <DataList rows={summary.receivables} columns={receivableColumns} rowKey={(r) => r.orderCode} />
        ))}
      {tab === "refund" &&
        (summary.refunds.length === 0 ? (
          <EmptyState title="Tidak ada refund tertunda" description="Belum ada pesanan batal yang menunggu pengembalian dana." />
        ) : (
          <DataList rows={summary.refunds} columns={refundColumns} rowKey={(r) => r.orderCode} />
        ))}
    </div>
  );
}
