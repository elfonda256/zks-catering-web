"use client";

import { useState } from "react";
import {
  GOODS_RECEIPTS,
  LOCATIONS,
  PURCHASE_ORDERS,
  formatQty,
  getIngredient,
  getSupplier,
  relativeDay,
  type GoodsReceipt,
} from "@/modules/sample-data";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DetailList } from "@/shared/components/ui/DetailList";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { Modal } from "@/shared/components/ui/Modal";
import { SampleDataNotice } from "@/shared/components/ui/SampleDataNotice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/Table";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { KpiGrid } from "@/shared/components/ui/KpiGrid";

const hasRejection = (receipt: GoodsReceipt) => receipt.lines.some((line) => line.rejectedQty > 0);

function supplierOf(receipt: GoodsReceipt) {
  const po = PURCHASE_ORDERS.find((p) => p.id === receipt.poId);
  return po ? getSupplier(po.supplierId).name : "—";
}

export function GoodsReceivingView() {
  const [selected, setSelected] = useState<GoodsReceipt | null>(null);
  const awaiting = PURCHASE_ORDERS.filter((po) => po.status === "dikirim");

  const columns: DataColumn<GoodsReceipt>[] = [
    { key: "id", header: "Nomor", mobile: "title", cell: (r) => (
        <button
          type="button"
          onClick={() => setSelected(r)}
          className="whitespace-nowrap font-mono font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-900 cursor-pointer"
        >
          {r.id}
        </button>
      ) },
    { key: "supplier", header: "Supplier", mobile: "subtitle", cell: (r) => supplierOf(r) },
    { key: "day", header: "Tanggal", cell: (r) => relativeDay(r.day) },
    { key: "po", header: "Dari PO", cell: (r) => <span className="font-mono text-[13px]">{r.poId}</span> },
    { key: "location", header: "Masuk ke", cell: (r) => LOCATIONS[r.location].name },
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
      <SampleDataNotice />

      <KpiGrid label="Ringkasan penerimaan" columns={3}>
        <KpiCard label="PO menunggu barang" tone="brand" value={awaiting.length} subtext={awaiting.map((po) => po.id).join(", ") || "Tidak ada"} />
        <KpiCard label="Penerimaan tercatat" value={GOODS_RECEIPTS.length} subtext="Termasuk hasil cek kualitas" />
        <KpiCard label="Ada barang ditolak" tone="danger" value={GOODS_RECEIPTS.filter(hasRejection).length} subtext="Gagal cek kualitas" />
      </KpiGrid>

      <DataList rows={GOODS_RECEIPTS} columns={columns} rowKey={(r) => r.id} />

      {selected && (
        <Modal
          isOpen
          onClose={() => setSelected(null)}
          title={`Penerimaan ${selected.id}`}
          subtitle={`${supplierOf(selected)} · ${relativeDay(selected.day)}`}
          maxWidth="2xl"
          footer={
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Tutup
            </Button>
          }
        >
          <DetailList
            items={[
              { label: "Dari PO", value: selected.poId },
              { label: "Masuk ke", value: LOCATIONS[selected.location].name },
              { label: "Diterima oleh", value: selected.receivedBy },
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
              {selected.lines.map((line) => {
                const item = getIngredient(line.code);
                return (
                  <TableRow key={line.code}>
                    <TableCell>
                      <span className="font-medium text-stone-900">{item.name}</span>
                      {line.note && <span className="block text-[12px] text-rose-700">{line.note}</span>}
                    </TableCell>
                    <TableCell align="right" isNumeric>
                      {formatQty(line.qty, item.unit)}
                    </TableCell>
                    <TableCell align="right" isNumeric>
                      {line.rejectedQty > 0 ? formatQty(line.rejectedQty, item.unit) : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Modal>
      )}
    </div>
  );
}
