"use client";

import { useState } from "react";
import { PURCHASE_ORDERS, getSupplier, relativeDay, type PurchaseOrder } from "@/modules/sample-data";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DetailList } from "@/shared/components/ui/DetailList";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { Modal } from "@/shared/components/ui/Modal";
import { SampleDataNotice } from "@/shared/components/ui/SampleDataNotice";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { KpiGrid } from "@/shared/components/ui/KpiGrid";
import { formatRupiah, formatRupiahShort } from "@/shared/utils/formatters";
import { PO_STATUS } from "../status";
import { LinesTable } from "./LinesTable";
import { lineTotal } from "../lines";

export function PurchaseOrdersView() {
  const [selected, setSelected] = useState<PurchaseOrder | null>(null);
  const open = PURCHASE_ORDERS.filter((po) => po.status !== "diterima");

  const columns: DataColumn<PurchaseOrder>[] = [
    { key: "id", header: "Nomor", mobile: "title", cell: (po) => (
        <button
          type="button"
          onClick={() => setSelected(po)}
          className="whitespace-nowrap font-mono font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 cursor-pointer"
        >
          {po.id}
        </button>
      ) },
    { key: "supplier", header: "Supplier", mobile: "subtitle", cell: (po) => getSupplier(po.supplierId).name },
    { key: "day", header: "Dibuat", cell: (po) => relativeDay(po.day) },
    { key: "delivery", header: "Jadwal kirim", cell: (po) => relativeDay(po.deliveryDay) },
    { key: "value", header: "Nilai", align: "right", isNumeric: true, cell: (po) => formatRupiah(lineTotal(po.lines)) },
    {
      key: "status",
      header: "Status",
      mobile: "status",
      cell: (po) => (
        <Badge variant={PO_STATUS[po.status].variant} dot>
          {PO_STATUS[po.status].label}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <SampleDataNotice />

      <KpiGrid label="Ringkasan pembelian" columns={3}>
        <KpiCard label="PO berjalan" tone="brand" value={open.length} subtext="Belum diterima penuh" />
        <KpiCard label="Nilai PO berjalan" value={formatRupiahShort(open.reduce((s, po) => s + lineTotal(po.lines), 0))} subtext="Sebelum ongkir supplier" />
        <KpiCard label="Total nilai PO" value={formatRupiahShort(PURCHASE_ORDERS.reduce((s, po) => s + lineTotal(po.lines), 0))} subtext="Minggu ini" />
      </KpiGrid>

      <DataList rows={PURCHASE_ORDERS} columns={columns} rowKey={(po) => po.id} />

      {selected && (
        <Modal
          isOpen
          onClose={() => setSelected(null)}
          title={`Pembelian ${selected.id}`}
          subtitle={getSupplier(selected.supplierId).name}
          maxWidth="2xl"
          footer={
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Tutup
            </Button>
          }
        >
          <DetailList
            items={[
              { label: "Status", value: <Badge variant={PO_STATUS[selected.status].variant}>{PO_STATUS[selected.status].label}</Badge> },
              { label: "Jadwal kirim", value: relativeDay(selected.deliveryDay) },
              { label: "Pembayaran", value: getSupplier(selected.supplierId).paymentTerms },
              { label: "Dari permintaan", value: selected.prId ?? "Langsung, tanpa PR" },
            ]}
          />
          <LinesTable lines={selected.lines} />
        </Modal>
      )}
    </div>
  );
}
