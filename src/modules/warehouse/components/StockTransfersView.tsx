"use client";

import { LOCATIONS, STOCK_TRANSFERS, formatQty, getIngredient, relativeDay, type StockTransfer } from "@/modules/sample-data";
import { Badge } from "@/shared/components/ui/Badge";
import { SampleDataNotice } from "@/shared/components/ui/SampleDataNotice";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";

const COLUMNS: DataColumn<StockTransfer>[] = [
  { key: "id", header: "Nomor", mobile: "title", cell: (t) => <span className="whitespace-nowrap font-mono">{t.id}</span> },
  {
    key: "route",
    header: "Dari → ke",
    mobile: "subtitle",
    cell: (t) => (
      <span className="whitespace-nowrap">
        {LOCATIONS[t.from].name} → {LOCATIONS[t.to].name}
      </span>
    ),
  },
  { key: "day", header: "Tanggal", cell: (t) => relativeDay(t.day) },
  {
    key: "lines",
    header: "Bahan",
    wide: true,
    cell: (t) => (
      <ul className="space-y-1">
        {t.lines.map((line) => {
          const item = getIngredient(line.code);
          return (
            <li key={line.code}>
              {item.name} <span className="tabular-nums text-stone-500">{formatQty(line.qty, item.unit)}</span>
            </li>
          );
        })}
      </ul>
    ),
  },
  { key: "reason", header: "Alasan", wide: true, cell: (t) => <span className="text-stone-600">{t.reason}</span> },
  {
    key: "status",
    header: "Status",
    mobile: "status",
    cell: (t) => (
      <Badge variant={t.status === "selesai" ? "completed" : "pending"} dot>
        {t.status === "selesai" ? "Selesai" : "Direncanakan"}
      </Badge>
    ),
  },
];

export function StockTransfersView() {
  return (
    <div className="space-y-6">
      <SampleDataNotice />

      <DataList rows={STOCK_TRANSFERS} columns={COLUMNS} rowKey={(t) => t.id} />
    </div>
  );
}
