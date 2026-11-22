"use client";

import { useState } from "react";
import Link from "next/link";
import { ORDER_STATUS_LABELS } from "@/modules/dashboard/constants";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { KpiGrid } from "@/shared/components/ui/KpiGrid";
import { SearchInput } from "@/shared/components/ui/SearchInput";
import { formatDateTime, formatRupiah, formatRupiahShort } from "@/shared/utils/formatters";
import { DIRECT_ORDER_SOURCES } from "../sources";
import type { DirectOrderRow } from "../types";
import { DirectOrderFormDialog } from "./DirectOrderFormDialog";

/** Finished or cancelled orders; everything else is still running. */
const CLOSED = new Set<string>([
  "COMPLETED",
  "EXPIRED_UNCONFIRMED_BY_ADMIN",
  "EXPIRED_PAYMENT_TIMEOUT",
  "REJECTED_BY_ADMIN",
  "CANCELLED_BY_ADMIN_REFUND_REQ",
  "CANCELLED_BY_CUSTOMER",
  "CANCELLED_DP_FORFEITED",
  "CANCELLED_FULL_REFUND_PENDING",
  "REFUNDED",
]);

const COLUMNS: DataColumn<DirectOrderRow>[] = [
  {
    key: "customer",
    header: "Pemesan",
    mobile: "title",
    cell: (o) => (
      <>
        <span className="font-medium text-stone-900">{o.customerName}</span>
        <span className="block text-[12px] font-normal text-stone-500">
          <span className="font-mono">{o.orderCode}</span> · {DIRECT_ORDER_SOURCES[o.source]} · {o.customerPhone}
        </span>
      </>
    ),
  },
  { key: "packages", header: "Paket", mobile: "subtitle", cell: (o) => o.packages },
  { key: "event", header: "Acara", cell: (o) => <span className="whitespace-nowrap">{formatDateTime(o.eventDate)}</span> },
  { key: "value", header: "Nilai makanan", align: "right", isNumeric: true, cell: (o) => formatRupiah(o.subtotal) },
  { key: "note", header: "Catatan", wide: true, cell: (o) => <span className="text-[13px] text-stone-600">{o.notes ?? "—"}</span> },
  {
    key: "status",
    header: "Status",
    mobile: "status",
    cell: (o) => (
      <Badge variant={ORDER_STATUS_LABELS[o.status].variant} dot>
        {ORDER_STATUS_LABELS[o.status].label}
      </Badge>
    ),
  },
];

/** Orders taken by phone, WhatsApp or in person, entered by the admin instead of the online form. */
export function DirectOrdersView({ orders }: { orders: DirectOrderRow[] }) {
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  const open = orders.filter((o) => !CLOSED.has(o.status));
  const needsFee = orders.filter((o) => o.status === "WAITING_ADMIN_CONFIRMATION");
  const q = query.toLowerCase().trim();
  const rows = orders.filter(
    (o) => !q || [o.customerName, o.orderCode, o.customerPhone, o.packages, o.notes ?? ""].some((f) => f.toLowerCase().includes(q))
  );

  return (
    <div className="space-y-6">
      <KpiGrid label="Ringkasan pesanan langsung" columns={3}>
        <KpiCard label="Perlu ongkir" tone="warning" value={needsFee.length} subtext="Tetapkan di Dasbor" />
        <KpiCard label="Porsi berjalan" value={open.reduce((s, o) => s + o.totalPcs, 0)} subtext={`${open.length} pesanan berjalan`} />
        <KpiCard label="Nilai makanan berjalan" value={formatRupiahShort(open.reduce((s, o) => s + o.subtotal, 0))} subtext="Sebelum ongkir" />
      </KpiGrid>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Cari pemesan, kode, atau telepon"
          aria-label="Cari pesanan langsung"
          className="sm:max-w-xs"
        />
        <Button onClick={() => setCreating(true)}>Catat pesanan</Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={orders.length === 0 ? "Belum ada pesanan langsung" : "Pesanan tidak ditemukan"}
          description={
            orders.length === 0
              ? "Catat pesanan dari telepon, WhatsApp, atau pelanggan yang datang langsung. Selanjutnya diproses di Dasbor seperti pesanan online."
              : "Coba kata kunci lain."
          }
        />
      ) : (
        <DataList rows={rows} columns={COLUMNS} rowKey={(o) => String(o.id)} />
      )}
      <p className="text-[12px] text-stone-500">
        Ongkir, pembayaran, dan status pesanan diproses di{" "}
        <Link href="/admin/dashboard" className="underline decoration-stone-300 underline-offset-4 hover:decoration-stone-900">
          Dasbor
        </Link>
        .
      </p>

      {creating && <DirectOrderFormDialog onClose={() => setCreating(false)} />}
    </div>
  );
}
