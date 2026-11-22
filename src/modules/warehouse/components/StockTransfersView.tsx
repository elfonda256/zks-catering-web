"use client";

import { useMemo, useState } from "react";
import { MovementFormDialog } from "@/modules/inventory/components/MovementFormDialog";
import { formatQuantity } from "@/modules/inventory/stock";
import type { CatalogItem, InventoryFormOptions, MovementRow } from "@/modules/inventory/types";
import { Button } from "@/shared/components/ui/Button";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { SearchInput } from "@/shared/components/ui/SearchInput";
import { formatDateTime } from "@/shared/utils/formatters";

interface StockTransfersViewProps {
  transfers: MovementRow[];
  items: CatalogItem[];
  options: InventoryFormOptions;
}

const COLUMNS: DataColumn<MovementRow>[] = [
  { key: "item", header: "Bahan", mobile: "title", cell: (t) => <span className="font-medium text-stone-900">{t.ingredientName}</span> },
  {
    key: "route",
    header: "Dari → ke",
    mobile: "subtitle",
    cell: (t) => (
      <span className="whitespace-nowrap">
        {t.fromName} → {t.toName}
      </span>
    ),
  },
  { key: "qty", header: "Jumlah", align: "right", isNumeric: true, mobile: "status", cell: (t) => formatQuantity(t.quantity, t.unit) },
  { key: "time", header: "Waktu", cell: (t) => <span className="whitespace-nowrap">{formatDateTime(t.createdAt)}</span> },
  {
    key: "note",
    header: "Alasan",
    wide: true,
    cell: (t) => (
      <span className="text-stone-600">
        {t.note ?? "—"}
        {t.createdBy && <span className="block text-[12px] text-stone-500">oleh {t.createdBy}</span>}
      </span>
    ),
  },
];

export function StockTransfersView({ transfers, items, options }: StockTransfersViewProps) {
  const [query, setQuery] = useState("");
  const [recording, setRecording] = useState(false);

  const rows = useMemo(() => {
    const q = query.toLowerCase().trim();
    return transfers.filter(
      (t) => !q || [t.ingredientName, t.fromName ?? "", t.toName ?? "", t.note ?? ""].some((field) => field.toLowerCase().includes(q))
    );
  }, [transfers, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Cari bahan, lokasi, atau alasan"
          aria-label="Cari transfer"
          className="sm:max-w-xs"
        />
        <Button onClick={() => setRecording(true)} disabled={items.length === 0 || options.locations.length < 2}>
          Catat transfer
        </Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={transfers.length === 0 ? "Belum ada transfer" : "Transfer tidak ditemukan"}
          description={
            transfers.length === 0 ? "Catat perpindahan bahan, misalnya dari freezer ke dapur produksi." : "Coba kata kunci lain."
          }
        />
      ) : (
        <DataList rows={rows} columns={COLUMNS} rowKey={(t) => String(t.id)} />
      )}
      <p className="text-[12px] text-stone-500">Menampilkan 200 transfer terbaru.</p>

      {recording && <MovementFormDialog items={items} options={options} initialType="TRANSFER" onClose={() => setRecording(false)} />}
    </div>
  );
}
