"use client";

import { useMemo, useState } from "react";
import {
  CATEGORIES,
  INGREDIENTS,
  LOCATIONS,
  RECIPES,
  STOCK_MOVEMENTS,
  formatMovementQty,
  formatQty,
  getCategory,
  getSupplier,
  relativeDay,
  stockLevel,
  type Ingredient,
} from "@/modules/sample-data";
import { Badge } from "@/shared/components/ui/Badge";
import { DetailList } from "@/shared/components/ui/DetailList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { SearchInput } from "@/shared/components/ui/SearchInput";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { Modal } from "@/shared/components/ui/Modal";
import { SampleDataNotice } from "@/shared/components/ui/SampleDataNotice";
import { formatRupiah } from "@/shared/utils/formatters";
import { STOCK_LEVEL_BADGE } from "../stock";
import { CategoryIcon } from "./CategoryIcon";

export function IngredientCatalogView() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Ingredient | null>(null);

  // Each category lists its items grouped by kind (jenis), in the category's own order.
  const groups = useMemo(() => {
    const q = query.toLowerCase().trim();
    return CATEGORIES.map((category) => ({
      category,
      items: INGREDIENTS.filter(
        (item) =>
          item.category === category.id &&
          (!q || [item.name, item.code, item.type].some((field) => field.toLowerCase().includes(q)))
      ).sort((a, b) => category.types.indexOf(a.type) - category.types.indexOf(b.type) || a.name.localeCompare(b.name)),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  const columns: DataColumn<Ingredient>[] = [
    {
      key: "name",
      header: "Bahan",
      width: "w-[28%]",
      mobile: "title",
      cell: (item) => (
        <>
          <button
            type="button"
            onClick={() => setSelected(item)}
            className="text-left font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 cursor-pointer"
          >
            {item.name}
          </button>
          <span className="block font-mono text-[12px] font-normal text-slate-500">{item.code}</span>
        </>
      ),
    },
    { key: "type", header: "Jenis", width: "w-[16%]", cell: (item) => item.type },
    { key: "unit", header: "Satuan", width: "w-[10%]", cell: (item) => item.unit },
    { key: "supplier", header: "Supplier", width: "w-[30%]", mobile: "subtitle", cell: (item) => getSupplier(item.supplierId).name },
    { key: "price", header: "Harga terakhir", width: "w-[16%]", align: "right", isNumeric: true, cell: (item) => formatRupiah(item.price) },
  ];

  return (
    <div className="space-y-6">
      <SampleDataNotice />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-[13px] text-slate-600">
          {INGREDIENTS.length} bahan dalam {CATEGORIES.length} kategori. Klik nama bahan untuk detail.
        </p>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Cari nama, kode, atau jenis"
          aria-label="Cari bahan"
          className="sm:max-w-xs"
        />
      </div>

      {groups.length === 0 ? (
        <EmptyState title="Bahan tidak ditemukan" description="Coba kata kunci lain." />
      ) : (
        groups.map(({ category, items }) => (
          <section key={category.id} aria-labelledby={`catalog-${category.id}`} className="space-y-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h2 id={`catalog-${category.id}`} className="flex items-center gap-3 text-[15px] font-semibold text-slate-900">
                <CategoryIcon category={category.id} />
                {category.name}
              </h2>
              <ul className="flex flex-wrap gap-2" aria-label={`Jenis ${category.name}`}>
                {category.types.map((type) => (
                  <li key={type} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-600">
                    {type}
                  </li>
                ))}
              </ul>
            </div>
            <DataList rows={items} columns={columns} rowKey={(item) => item.code} fixed />
          </section>
        ))
      )}

      {selected && <IngredientDialog item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function IngredientDialog({ item, onClose }: { item: Ingredient; onClose: () => void }) {
  const level = STOCK_LEVEL_BADGE[stockLevel(item)];
  const movements = STOCK_MOVEMENTS.filter((m) => m.code === item.code);
  const usedIn = RECIPES.filter((r) => r.perPortion.some((line) => line.code === item.code));

  return (
    <Modal isOpen onClose={onClose} title={item.name} subtitle={`${item.code} · ${getCategory(item.category).name}`} maxWidth="2xl">
      <DetailList
        items={[
          { label: "Jenis", value: item.type },
          { label: "Lokasi simpan", value: `${LOCATIONS[item.location].name} (${LOCATIONS[item.location].note})` },
          {
            label: "Stok",
            value: (
              <span className="flex flex-wrap items-center gap-2">
                <span className="tabular-nums">{formatQty(item.stock, item.unit)}</span>
                <Badge variant={level.variant}>{level.label}</Badge>
              </span>
            ),
          },
          { label: "Stok minimum", value: formatQty(item.minStock, item.unit) },
          { label: "Supplier utama", value: getSupplier(item.supplierId).name },
          { label: "Harga beli terakhir", value: `${formatRupiah(item.price)} / ${item.unit}` },
        ]}
      />

      <section className="space-y-2">
        <h3 className="text-[13px] font-semibold text-slate-900">Dipakai di resep</h3>
        <p className="text-[13px] text-slate-600">
          {usedIn.length > 0 ? usedIn.map((r) => r.name).join(", ") : "Belum dipakai di resep paket."}
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="text-[13px] font-semibold text-slate-900">Mutasi terakhir</h3>
        {movements.length === 0 ? (
          <p className="text-[13px] text-slate-600">Belum ada mutasi tercatat.</p>
        ) : (
          <ul className="divide-y divide-slate-100 rounded-[8px] border border-slate-200 text-[13px]">
            {movements.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-4 px-3 py-2">
                <span className="text-slate-700">
                  {relativeDay(m.day)}, {m.time} · {m.note}
                </span>
                <span className="tabular-nums text-slate-900">
                  {formatMovementQty(m.type, m.qty, item.unit)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Modal>
  );
}
