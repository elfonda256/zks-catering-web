"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/shared/components/ui/Badge";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { ListToolbar } from "@/shared/components/ui/ListToolbar";
import { formatDateTime } from "@/shared/utils/formatters";
import type { MovementRow, MovementType } from "../types";
import { MOVEMENT_TYPE_LABELS } from "../movement-types";
import { formatQuantity } from "../stock";

type MovementTab = "semua" | MovementType;

function route(m: MovementRow): string {
  if (m.fromName && m.toName) return `${m.fromName} → ${m.toName}`;
  return m.toName ? `Ke ${m.toName}` : `Dari ${m.fromName}`;
}

function signedQuantity(m: MovementRow): string {
  if (m.type === "TRANSFER") return `${formatQuantity(m.quantity, m.unit)} dipindah`;
  return `${m.toName ? "+" : "−"}${formatQuantity(m.quantity, m.unit)}`;
}

const COLUMNS: DataColumn<MovementRow>[] = [
  { key: "item", header: "Bahan", mobile: "title", cell: (m) => <span className="font-medium text-stone-900">{m.ingredientName}</span> },
  { key: "time", header: "Waktu", mobile: "subtitle", cell: (m) => <span className="whitespace-nowrap">{formatDateTime(m.createdAt)}</span> },
  {
    key: "type",
    header: "Jenis",
    mobile: "status",
    cell: (m) => <Badge variant={MOVEMENT_TYPE_LABELS[m.type].variant}>{MOVEMENT_TYPE_LABELS[m.type].label}</Badge>,
  },
  { key: "qty", header: "Jumlah", align: "right", isNumeric: true, cell: signedQuantity },
  { key: "route", header: "Lokasi", wide: true, cell: route },
  {
    key: "ref",
    header: "Referensi",
    cell: (m) => (
      <span className="font-mono text-[13px]">
        {m.reference ?? "—"}
        {m.batchCode && m.batchCode !== m.reference && <span className="block text-[12px] text-stone-500">Batch {m.batchCode}</span>}
      </span>
    ),
  },
  {
    key: "note",
    header: "Catatan",
    wide: true,
    cell: (m) => (
      <span className="text-stone-600">
        {m.note ?? "—"}
        {m.createdBy && <span className="block text-[12px] text-stone-500">oleh {m.createdBy}</span>}
      </span>
    ),
  },
];

export function StockMovementsView({ movements }: { movements: MovementRow[] }) {
  const [tab, setTab] = useState<MovementTab>("semua");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.toLowerCase().trim();
    return movements.filter(
      (m) =>
        (tab === "semua" || m.type === tab) &&
        (!q || [m.ingredientName, m.reference ?? "", m.note ?? "", m.batchCode ?? ""].some((field) => field.toLowerCase().includes(q)))
    );
  }, [movements, tab, query]);

  return (
    <div className="space-y-6">
      <ListToolbar
        tabs={[
          { id: "semua", label: "Semua", count: movements.length },
          ...(Object.keys(MOVEMENT_TYPE_LABELS) as MovementType[]).map((type) => ({
            id: type,
            label: MOVEMENT_TYPE_LABELS[type].label,
            count: movements.filter((m) => m.type === type).length,
          })),
        ]}
        tab={tab}
        onTabChange={setTab}
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Cari bahan, referensi, atau catatan"
      />

      {rows.length === 0 ? (
        <EmptyState
          title={movements.length === 0 ? "Belum ada mutasi" : "Tidak ada mutasi"}
          description={
            movements.length === 0
              ? "Mutasi muncul di sini setelah dicatat dari halaman Stok."
              : "Tidak ada mutasi yang cocok dengan filter ini."
          }
        />
      ) : (
        <DataList rows={rows} columns={COLUMNS} rowKey={(m) => String(m.id)} />
      )}
      <p className="text-[12px] text-stone-500">Menampilkan 200 mutasi terbaru.</p>
    </div>
  );
}
