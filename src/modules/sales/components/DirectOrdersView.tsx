"use client";

import { DIRECT_ORDERS, relativeDay, type DirectOrder, type DirectOrderStatus } from "@/modules/sample-data";
import { getRecipe } from "@/modules/production/recipes";
import { Badge, type BadgeVariant } from "@/shared/components/ui/Badge";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { SampleDataNotice } from "@/shared/components/ui/SampleDataNotice";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { KpiGrid } from "@/shared/components/ui/KpiGrid";
import { formatRupiah, formatRupiahShort } from "@/shared/utils/formatters";

const STATUS: Record<DirectOrderStatus, { label: string; variant: BadgeVariant }> = {
  baru: { label: "Perlu konfirmasi", variant: "pending" },
  dikonfirmasi: { label: "Dikonfirmasi", variant: "approved" },
  selesai: { label: "Selesai", variant: "completed" },
};

const orderValue = (order: DirectOrder) => getRecipe(order.recipeId).packagePrice * order.portions;

const COLUMNS: DataColumn<DirectOrder>[] = [
  {
    key: "customer",
    header: "Pemesan",
    mobile: "title",
    cell: (o) => (
      <>
        <span className="font-medium text-slate-900">{o.customer}</span>
        <span className="block text-[12px] font-normal text-slate-500">
          {o.id} · {o.contact} · {o.channel}
        </span>
      </>
    ),
  },
  { key: "note", header: "Catatan", mobile: "subtitle", width: "max-w-xs", cell: (o) => <span className="text-[13px] text-slate-600">{o.note}</span> },
  { key: "event", header: "Acara", cell: (o) => <span className="whitespace-nowrap">{relativeDay(o.day)}, {o.deliveryTime}</span> },
  { key: "recipe", header: "Paket", cell: (o) => getRecipe(o.recipeId).name },
  { key: "portions", header: "Porsi", align: "right", isNumeric: true, cell: (o) => o.portions },
  { key: "value", header: "Nilai", align: "right", isNumeric: true, cell: (o) => formatRupiah(orderValue(o)) },
  {
    key: "status",
    header: "Status",
    mobile: "status",
    cell: (o) => (
      <Badge variant={STATUS[o.status].variant} dot>
        {STATUS[o.status].label}
      </Badge>
    ),
  },
];

/** Orders taken by phone, WhatsApp or in person, entered by the admin instead of the online form. */
export function DirectOrdersView() {
  return (
    <div className="space-y-6">
      <SampleDataNotice />

      <KpiGrid label="Ringkasan pesanan langsung" columns={3}>
        <KpiCard label="Perlu konfirmasi" tone="warning" value={DIRECT_ORDERS.filter((o) => o.status === "baru").length} subtext="Hubungi pemesan" />
        <KpiCard label="Porsi 3 hari ke depan" value={DIRECT_ORDERS.reduce((s, o) => s + o.portions, 0)} subtext={`${DIRECT_ORDERS.length} pesanan`} />
        <KpiCard label="Nilai makanan" value={formatRupiahShort(DIRECT_ORDERS.reduce((s, o) => s + orderValue(o), 0))} subtext="Sebelum ongkir" />
      </KpiGrid>

      <DataList rows={DIRECT_ORDERS} columns={COLUMNS} rowKey={(o) => o.id} />
    </div>
  );
}
