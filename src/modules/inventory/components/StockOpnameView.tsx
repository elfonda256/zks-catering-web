"use client";

import { useState } from "react";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Modal } from "@/shared/components/ui/Modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/Table";
import { formatDateTime, formatRupiah } from "@/shared/utils/formatters";
import type { CatalogItem, InventoryFormOptions, LocationStock, OpnameRecord } from "../types";
import { formatQuantity } from "../stock";
import { OpnameSheetDialog } from "./OpnameSheetDialog";

interface StockOpnameViewProps {
  items: CatalogItem[];
  options: InventoryFormOptions;
  stock: LocationStock[];
  history: OpnameRecord[];
}

function signedQuantity(qty: number, unit: string): string {
  return `${qty > 0 ? "+" : "−"}${formatQuantity(Math.abs(qty), unit)}`;
}

export function StockOpnameView({ items, options, stock, history }: StockOpnameViewProps) {
  const [counting, setCounting] = useState(false);
  const [selected, setSelected] = useState<OpnameRecord | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const columns: DataColumn<OpnameRecord>[] = [
    {
      key: "ref",
      header: "Nomor",
      mobile: "title",
      cell: (o) => (
        <button
          type="button"
          onClick={() => setSelected(o)}
          className="whitespace-nowrap font-mono font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-900 cursor-pointer"
        >
          {o.reference}
        </button>
      ),
    },
    { key: "time", header: "Waktu", mobile: "subtitle", cell: (o) => `${formatDateTime(o.createdAt)} · ${o.locationName}` },
    { key: "lines", header: "Bahan selisih", align: "right", isNumeric: true, cell: (o) => o.lines.length },
    {
      key: "value",
      header: "Nilai selisih",
      align: "right",
      isNumeric: true,
      mobile: "status",
      cell: (o) => (
        <Badge variant={o.varianceValue < 0 ? "critical" : "completed"}>
          {o.varianceValue > 0 ? "+" : ""}
          {formatRupiah(o.varianceValue)}
        </Badge>
      ),
    },
    { key: "by", header: "Oleh", cell: (o) => o.createdBy ?? "—" },
  ];

  const noMasterData = options.locations.length === 0 || items.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-[13px] text-stone-600">
          Hitung fisik per lokasi. Selisih dengan sistem langsung menjadi mutasi penyesuaian.
        </p>
        <Button onClick={() => setCounting(true)} disabled={noMasterData}>
          Mulai stock opname
        </Button>
      </div>

      {notice && (
        <p role="status" className="text-[13px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-[8px] px-3 py-2">
          {notice}
        </p>
      )}

      {history.length === 0 ? (
        <EmptyState
          title="Belum ada stock opname dengan selisih"
          description={
            noMasterData
              ? "Tambahkan bahan di Katalog bahan dulu, lalu hitung stoknya di sini."
              : "Hitungan yang cocok dengan sistem tidak membuat catatan; yang berselisih muncul di sini."
          }
        />
      ) : (
        <DataList rows={history} columns={columns} rowKey={(o) => o.reference} />
      )}

      {counting && (
        <OpnameSheetDialog
          items={items}
          options={options}
          stock={stock}
          onClose={() => setCounting(false)}
          onSaved={(message) => {
            setCounting(false);
            setNotice(message);
          }}
        />
      )}

      {selected && (
        <Modal
          isOpen
          onClose={() => setSelected(null)}
          title={`Stock opname ${selected.reference}`}
          subtitle={`${selected.locationName} · ${formatDateTime(selected.createdAt)}${selected.createdBy ? ` · ${selected.createdBy}` : ""}`}
          maxWidth="2xl"
          footer={
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Tutup
            </Button>
          }
        >
          {selected.note && <p className="text-[13px] text-stone-600">{selected.note}</p>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bahan</TableHead>
                <TableHead align="right">Selisih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selected.lines.map((line) => (
                <TableRow key={line.ingredientName}>
                  <TableCell>
                    <span className="font-medium text-stone-900">{line.ingredientName}</span>
                  </TableCell>
                  <TableCell align="right" isNumeric className={line.difference < 0 ? "text-rose-700" : undefined}>
                    {signedQuantity(line.difference, line.unit)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-[12px] text-stone-500">Nilai selisih dihitung dengan harga beli terakhir tiap bahan.</p>
        </Modal>
      )}
    </div>
  );
}
