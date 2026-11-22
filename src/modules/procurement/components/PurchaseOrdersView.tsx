"use client";

import { useMemo, useState, useTransition } from "react";
import { cancelOrderAction } from "@/app/admin/procurement/actions";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { DetailList } from "@/shared/components/ui/DetailList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { KpiGrid } from "@/shared/components/ui/KpiGrid";
import { ListToolbar } from "@/shared/components/ui/ListToolbar";
import { Modal } from "@/shared/components/ui/Modal";
import { formatDate, formatDateTime, formatRupiah, formatRupiahShort } from "@/shared/utils/formatters";
import { lineTotal } from "../documents";
import { OPEN_ORDER_STATUSES, PO_STATUS } from "../status";
import type { OrderRow, OrderStatus, ProcurementOptions } from "../types";
import { LinesTable } from "./LinesTable";
import { OrderFormDialog } from "./OrderFormDialog";

type OrderTab = "semua" | OrderStatus;

interface PurchaseOrdersViewProps {
  orders: OrderRow[];
  options: ProcurementOptions;
}

export function PurchaseOrdersView({ orders, options }: PurchaseOrdersViewProps) {
  const [tab, setTab] = useState<OrderTab>("semua");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<OrderRow | null>(null);

  const open = orders.filter((o) => OPEN_ORDER_STATUSES.includes(o.status));
  const active = orders.filter((o) => o.status !== "CANCELLED");

  const rows = useMemo(() => {
    const q = query.toLowerCase().trim();
    return orders.filter(
      (o) =>
        (tab === "semua" || o.status === tab) &&
        (!q || [o.code, o.supplierName, o.requestCode ?? "", ...o.lines.map((l) => l.ingredientName)].some((f) => f.toLowerCase().includes(q)))
    );
  }, [orders, tab, query]);

  const columns: DataColumn<OrderRow>[] = [
    {
      key: "code",
      header: "Nomor",
      mobile: "title",
      cell: (o) => (
        <button
          type="button"
          onClick={() => setSelected(o)}
          className="whitespace-nowrap font-mono font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-900 cursor-pointer"
        >
          {o.code}
        </button>
      ),
    },
    { key: "supplier", header: "Supplier", mobile: "subtitle", cell: (o) => o.supplierName },
    { key: "created", header: "Dibuat", cell: (o) => formatDate(o.createdAt) },
    { key: "delivery", header: "Jadwal kirim", cell: (o) => (o.expectedDate ? formatDate(o.expectedDate) : "—") },
    { key: "value", header: "Nilai", align: "right", isNumeric: true, cell: (o) => formatRupiah(lineTotal(o.lines)) },
    {
      key: "status",
      header: "Status",
      mobile: "status",
      cell: (o) => (
        <Badge variant={PO_STATUS[o.status].variant} dot>
          {PO_STATUS[o.status].label}
        </Badge>
      ),
    },
  ];

  const missing =
    options.items.length === 0 ? "Tambahkan bahan di Katalog bahan dulu." : options.suppliers.length === 0 ? "Tambahkan supplier aktif dulu." : null;

  return (
    <div className="space-y-6">
      <KpiGrid label="Ringkasan pembelian" columns={3}>
        <KpiCard label="PO berjalan" tone="brand" value={open.length} subtext="Belum diterima penuh" />
        <KpiCard label="Nilai PO berjalan" value={formatRupiahShort(open.reduce((s, o) => s + lineTotal(o.lines), 0))} subtext="Sebelum ongkir supplier" />
        <KpiCard label="Total nilai PO" value={formatRupiahShort(active.reduce((s, o) => s + lineTotal(o.lines), 0))} subtext="Tanpa PO dibatalkan" />
      </KpiGrid>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
        <div className="flex-1">
          <ListToolbar
            tabs={[
              { id: "semua", label: "Semua", count: orders.length },
              ...(Object.keys(PO_STATUS) as OrderStatus[]).map((status) => ({
                id: status,
                label: PO_STATUS[status].label,
                count: orders.filter((o) => o.status === status).length,
              })),
            ]}
            tab={tab}
            onTabChange={setTab}
            query={query}
            onQueryChange={setQuery}
            searchPlaceholder="Cari nomor, supplier, atau bahan"
          />
        </div>
        <Button onClick={() => setCreating(true)} disabled={missing !== null}>
          Buat PO
        </Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={orders.length === 0 ? "Belum ada PO" : "Tidak ada PO"}
          description={
            missing ??
            (orders.length === 0
              ? "Buat PO langsung di sini, atau dari permintaan pembelian yang sudah disetujui."
              : "Tidak ada PO yang cocok dengan filter ini.")
          }
        />
      ) : (
        <DataList rows={rows} columns={columns} rowKey={(o) => String(o.id)} />
      )}

      {creating && <OrderFormDialog options={options} onClose={() => setCreating(false)} />}
      {selected && <OrderDialog order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function OrderDialog({ order, onClose }: { order: OrderRow; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const cancellable = order.status === "SENT" && order.receiptCount === 0;

  function cancel() {
    setError(null);
    startTransition(async () => {
      const result = await cancelOrderAction(order.id);
      if (result.error) setError(result.error);
      else onClose();
    });
  }

  return (
    <Modal
      isOpen
      onClose={() => !isPending && onClose()}
      title={`Pembelian ${order.code}`}
      subtitle={`${order.supplierName} · ${formatDateTime(order.createdAt)}`}
      maxWidth="2xl"
      footer={
        <>
          {cancellable && (
            <Button variant="danger" onClick={cancel} disabled={isPending}>
              {isPending ? "Membatalkan..." : "Batalkan PO"}
            </Button>
          )}
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Tutup
          </Button>
        </>
      }
    >
      <DetailList
        items={[
          { label: "Status", value: <Badge variant={PO_STATUS[order.status].variant}>{PO_STATUS[order.status].label}</Badge> },
          { label: "Jadwal kirim", value: order.expectedDate ? formatDate(order.expectedDate) : "Belum ditentukan" },
          { label: "Pembayaran", value: order.supplierTerms ?? "—" },
          { label: "Dari permintaan", value: order.requestCode ?? "Langsung, tanpa PR" },
          { label: "Penerimaan", value: order.receiptCount > 0 ? `${order.receiptCount} kali` : "Belum ada" },
          ...(order.note ? [{ label: "Catatan", value: order.note }] : []),
        ]}
      />
      <LinesTable lines={order.lines} />
      {error && (
        <p role="alert" className="text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
          {error}
        </p>
      )}
    </Modal>
  );
}
