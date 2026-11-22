"use client";

import { useMemo, useState } from "react";
import {
  INGREDIENTS,
  PURCHASE_ORDERS,
  getCategory,
  relativeDay,
  SUPPLIERS,
  type Supplier,
} from "@/modules/sample-data";
import { PO_STATUS } from "@/modules/procurement/status";
import { lineTotal } from "@/modules/procurement/lines";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DetailList } from "@/shared/components/ui/DetailList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Modal } from "@/shared/components/ui/Modal";
import { SampleDataNotice } from "@/shared/components/ui/SampleDataNotice";
import { SearchInput } from "@/shared/components/ui/SearchInput";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { formatRupiah } from "@/shared/utils/formatters";

/** On-time delivery below this share is flagged for follow-up. */
const ON_TIME_TARGET = 90;

export function SuppliersView() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Supplier | null>(null);

  const columns: DataColumn<Supplier>[] = [
    {
      key: "name",
      header: "Supplier",
      mobile: "title",
      cell: (s) => (
        <>
          {<button
          type="button"
          onClick={() => setSelected(s)}
          className="text-left font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-900 cursor-pointer"
        >
          {s.name}
        </button>}
          <span className="block text-[12px] font-normal text-stone-500">{s.area}</span>
        </>
      ),
    },
    {
      key: "categories",
      header: "Memasok",
      mobile: "subtitle",
      width: "max-w-xs",
      cell: (s) => s.categories.map((c) => getCategory(c).name).join(", "),
    },
    {
      key: "contact",
      header: "Kontak",
      wide: true,
      cell: (s) => (
        <>
          {s.contact}
          <span className="block font-mono text-[12px] text-stone-500">{s.phone}</span>
        </>
      ),
    },
    { key: "terms", header: "Pembayaran", cell: (s) => s.paymentTerms },
    {
      key: "onTime",
      header: "Tepat waktu",
      align: "right",
      mobile: "status",
      cell: (s) => <Badge variant={s.onTimeRate >= ON_TIME_TARGET ? "completed" : "low_stock"}>{s.onTimeRate}%</Badge>,
    },
  ];

  const suppliers = useMemo(() => {
    const q = query.toLowerCase().trim();
    return SUPPLIERS.filter(
      (s) =>
        !q ||
        [s.name, s.area, ...s.categories.map((c) => getCategory(c).name)].some((field) =>
          field.toLowerCase().includes(q)
        )
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <SampleDataNotice />

      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Cari supplier, area, atau kategori"
        aria-label="Cari supplier"
        className="lg:max-w-xs"
      />

      {suppliers.length === 0 ? (
        <EmptyState title="Supplier tidak ditemukan" description="Coba kata kunci lain." />
      ) : (
        <DataList rows={suppliers} columns={columns} rowKey={(s) => s.id} />
      )}

      {selected && <SupplierDialog supplier={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function SupplierDialog({ supplier, onClose }: { supplier: Supplier; onClose: () => void }) {
  const orders = PURCHASE_ORDERS.filter((po) => po.supplierId === supplier.id);
  const items = INGREDIENTS.filter((item) => item.supplierId === supplier.id);

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={supplier.name}
      subtitle={supplier.area}
      maxWidth="2xl"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Tutup
        </Button>
      }
    >
      <DetailList
        items={[
          { label: "Kontak", value: `${supplier.contact} · ${supplier.phone}` },
          { label: "Pembayaran", value: supplier.paymentTerms },
          { label: "Tepat waktu (3 bulan)", value: `${supplier.onTimeRate}%` },
          { label: "Bahan dipasok", value: items.map((item) => item.name).join(", ") || "—" },
        ]}
      />
      <section className="space-y-2">
        <h3 className="text-[13px] font-semibold text-stone-900">Pembelian terakhir</h3>
        {orders.length === 0 ? (
          <p className="text-[13px] text-stone-600">Belum ada PO dalam data contoh.</p>
        ) : (
          <ul className="divide-y divide-stone-100 rounded-[8px] border border-stone-200 text-[13px]">
            {orders.map((po) => (
              <li key={po.id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
                <span className="font-mono text-stone-900">{po.id}</span>
                <span className="text-stone-600">{relativeDay(po.day)}</span>
                <span className="tabular-nums text-stone-900">{formatRupiah(lineTotal(po.lines))}</span>
                <Badge variant={PO_STATUS[po.status].variant}>{PO_STATUS[po.status].label}</Badge>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Modal>
  );
}
