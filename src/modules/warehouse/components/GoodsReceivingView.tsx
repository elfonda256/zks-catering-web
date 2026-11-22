"use client";

import { useState } from "react";
import { formatQuantity } from "@/modules/inventory/stock";
import { OPEN_ORDER_STATUSES } from "@/modules/procurement/status";
import type { OrderRow, ProcurementOptions, ReceiptRow } from "@/modules/procurement/types";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { DetailList } from "@/shared/components/ui/DetailList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { KpiGrid } from "@/shared/components/ui/KpiGrid";
import { Modal } from "@/shared/components/ui/Modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/Table";
import { formatDateTime } from "@/shared/utils/formatters";
import { ReceiveGoodsDialog } from "./ReceiveGoodsDialog";

const hasRejection = (receipt: ReceiptRow) => receipt.lines.some((line) => line.rejected > 0);

interface GoodsReceivingViewProps {
  receipts: ReceiptRow[];
  orders: OrderRow[];
  options: ProcurementOptions;
}

export function GoodsReceivingView({ receipts, orders, options }: GoodsReceivingViewProps) {
  const [receiving, setReceiving] = useState(false);
  const [selected, setSelected] = useState<ReceiptRow | null>(null);
  const awaiting = orders.filter((o) => OPEN_ORDER_STATUSES.includes(o.status));

  const columns: DataColumn<ReceiptRow>[] = [
    {
      key: "code",
      header: "Nomor",
      mobile: "title",
      cell: (r) => (
        <button
          type="button"
          onClick={() => setSelected(r)}
          className="whitespace-nowrap font-mono font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-900 cursor-pointer"
        >
          {r.code}
        </button>
      ),
    },
    { key: "supplier", header: "Supplier", mobile: "subtitle", cell: (r) => r.supplierName },
    { key: "time", header: "Waktu", cell: (r) => <span className="whitespace-nowrap">{formatDateTime(r.createdAt)}</span> },
    { key: "po", header: "Dari PO", cell: (r) => <span className="font-mono text-[13px]">{r.orderCode}</span> },
    { key: "location", header: "Masuk ke", cell: (r) => r.locationName },
    {
      key: "qc",
      header: "Cek kualitas",
      mobile: "status",
      cell: (r) =>
        hasRejection(r) ? (
          <Badge variant="low_stock" dot>
            Sebagian ditolak
          </Badge>
        ) : (
          <Badge variant="completed" dot>
            Lolos
          </Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <KpiGrid label="Ringkasan penerimaan" columns={3}>
        <KpiCard label="PO menunggu barang" tone="brand" value={awaiting.length} subtext={awaiting.map((o) => o.code).slice(0, 4).join(", ") || "Tidak ada"} />
        <KpiCard label="Penerimaan tercatat" value={receipts.length} subtext="200 terbaru" />
        <KpiCard label="Ada barang ditolak" tone="danger" value={receipts.filter(hasRejection).length} subtext="Gagal cek kualitas" />
      </KpiGrid>

      <div className="flex justify-end">
        <Button onClick={() => setReceiving(true)} disabled={awaiting.length === 0}>
          Terima barang
        </Button>
      </div>

      {receipts.length === 0 ? (
        <EmptyState
          title="Belum ada penerimaan barang"
          description={
            awaiting.length === 0
              ? "Penerimaan dicatat dari PO yang sudah dikirim ke supplier. Buat PO dulu di Pengadaan."
              : "Saat barang datang, klik Terima barang, cek kualitasnya, lalu barang yang lolos langsung masuk stok."
          }
        />
      ) : (
        <DataList rows={receipts} columns={columns} rowKey={(r) => String(r.id)} />
      )}

      {receiving && <ReceiveGoodsDialog orders={awaiting} locations={options.locations} onClose={() => setReceiving(false)} />}

      {selected && (
        <Modal
          isOpen
          onClose={() => setSelected(null)}
          title={`Penerimaan ${selected.code}`}
          subtitle={`${selected.supplierName} · ${formatDateTime(selected.createdAt)}`}
          maxWidth="2xl"
          footer={
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Tutup
            </Button>
          }
        >
          <DetailList
            items={[
              { label: "Dari PO", value: selected.orderCode },
              { label: "Masuk ke", value: selected.locationName },
              { label: "Diterima oleh", value: selected.receivedBy ?? "—" },
              ...(selected.note ? [{ label: "Catatan", value: selected.note }] : []),
            ]}
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bahan</TableHead>
                <TableHead align="right">Diterima</TableHead>
                <TableHead align="right">Ditolak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selected.lines.map((line) => (
                <TableRow key={line.ingredientName}>
                  <TableCell>
                    <span className="font-medium text-stone-900">{line.ingredientName}</span>
                    {line.note && <span className="block text-[12px] text-rose-700">{line.note}</span>}
                  </TableCell>
                  <TableCell align="right" isNumeric>
                    {formatQuantity(line.accepted, line.unit)}
                  </TableCell>
                  <TableCell align="right" isNumeric>
                    {line.rejected > 0 ? formatQuantity(line.rejected, line.unit) : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Modal>
      )}
    </div>
  );
}
