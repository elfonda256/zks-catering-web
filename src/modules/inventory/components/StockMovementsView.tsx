"use client";

import { useMemo, useState } from "react";
import {
  STOCK_MOVEMENTS,
  formatMovementQty,
  getIngredient,
  relativeDay,
  type MovementType,
  type StockMovement,
} from "@/modules/sample-data";
import { Badge, type BadgeVariant } from "@/shared/components/ui/Badge";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { ListToolbar } from "@/shared/components/ui/ListToolbar";
import { SampleDataNotice } from "@/shared/components/ui/SampleDataNotice";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";

type MovementTab = "semua" | MovementType;

const TYPE_BADGE: Record<MovementType, { label: string; variant: BadgeVariant }> = {
  masuk: { label: "Masuk", variant: "completed" },
  keluar: { label: "Keluar", variant: "processing" },
  transfer: { label: "Transfer", variant: "reserved" },
  penyesuaian: { label: "Penyesuaian", variant: "low_stock" },
};

const COLUMNS: DataColumn<StockMovement>[] = [
  {
    key: "item",
    header: "Bahan",
    mobile: "title",
    cell: (m) => <span className="font-medium text-slate-900">{getIngredient(m.code).name}</span>,
  },
  { key: "time", header: "Waktu", mobile: "subtitle", cell: (m) => <span className="whitespace-nowrap">{relativeDay(m.day)}, {m.time}</span> },
  {
    key: "type",
    header: "Jenis mutasi",
    mobile: "status",
    cell: (m) => <Badge variant={TYPE_BADGE[m.type].variant}>{TYPE_BADGE[m.type].label}</Badge>,
  },
  {
    key: "qty",
    header: "Jumlah",
    align: "right",
    isNumeric: true,
    cell: (m) => formatMovementQty(m.type, m.qty, getIngredient(m.code).unit),
  },
  { key: "ref", header: "Referensi", cell: (m) => <span className="font-mono text-[13px]">{m.reference}</span> },
  { key: "note", header: "Keterangan", wide: true, cell: (m) => <span className="text-slate-600">{m.note}</span> },
];

export function StockMovementsView() {
  const [tab, setTab] = useState<MovementTab>("semua");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.toLowerCase().trim();
    return STOCK_MOVEMENTS.filter((m) => {
      const item = getIngredient(m.code);
      return (
        (tab === "semua" || m.type === tab) &&
        (!q || [item.name, m.reference, m.note].some((field) => field.toLowerCase().includes(q)))
      );
    });
  }, [tab, query]);

  const countOf = (type: MovementType) => STOCK_MOVEMENTS.filter((m) => m.type === type).length;

  return (
    <div className="space-y-6">
      <SampleDataNotice />

      <ListToolbar
        tabs={[
          { id: "semua", label: "Semua", count: STOCK_MOVEMENTS.length },
          ...(Object.keys(TYPE_BADGE) as MovementType[]).map((type) => ({
            id: type,
            label: TYPE_BADGE[type].label,
            count: countOf(type),
          })),
        ]}
        tab={tab}
        onTabChange={setTab}
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Cari bahan, referensi, atau catatan"
      />

      {rows.length === 0 ? (
        <EmptyState title="Tidak ada mutasi" description="Tidak ada mutasi yang cocok dengan filter ini." />
      ) : (
        <DataList rows={rows} columns={COLUMNS} rowKey={(m) => m.id} />
      )}
    </div>
  );
}
