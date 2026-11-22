"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { SearchInput } from "@/shared/components/ui/SearchInput";
import { formatRupiah } from "@/shared/utils/formatters";
import type { CatalogItem, InventoryFormOptions } from "../types";
import { formatQuantity } from "../stock";
import { CategoryIcon } from "./CategoryIcon";
import { IngredientFormDialog } from "./IngredientFormDialog";

interface IngredientCatalogViewProps {
  items: CatalogItem[];
  options: InventoryFormOptions;
}

export function IngredientCatalogView({ items, options }: IngredientCatalogViewProps) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<CatalogItem | "new" | null>(null);

  // Each category lists its items grouped by kind (jenis); the server already sorts them.
  const groups = useMemo(() => {
    const q = query.toLowerCase().trim();
    return options.categories
      .map((category) => ({
        category,
        rows: items.filter(
          (item) =>
            item.categorySlug === category.slug &&
            (!q || [item.name, item.code, item.typeName].some((field) => field.toLowerCase().includes(q)))
        ),
      }))
      .filter((group) => group.rows.length > 0);
  }, [items, options.categories, query]);

  const columns: DataColumn<CatalogItem>[] = [
    {
      key: "name",
      header: "Bahan",
      width: "w-[26%]",
      mobile: "title",
      cell: (item) => (
        <>
          <button
            type="button"
            onClick={() => setEditing(item)}
            className="text-left font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 cursor-pointer"
          >
            {item.name}
          </button>
          <span className="block font-mono text-[12px] font-normal text-slate-500">{item.code}</span>
        </>
      ),
    },
    { key: "type", header: "Jenis", width: "w-[14%]", cell: (item) => item.typeName },
    { key: "unit", header: "Satuan", width: "w-[9%]", cell: (item) => item.unit },
    { key: "min", header: "Stok minimum", width: "w-[13%]", cell: (item) => formatQuantity(item.minStock, item.unit) },
    { key: "supplier", header: "Supplier", width: "w-[22%]", mobile: "subtitle", cell: (item) => item.supplierName ?? "—" },
    { key: "price", header: "Harga terakhir", width: "w-[16%]", align: "right", isNumeric: true, cell: (item) => formatRupiah(item.lastPrice) },
  ];

  const noMasterData = options.categories.length === 0 || options.locations.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Cari nama, kode, atau jenis"
          aria-label="Cari bahan"
          className="sm:max-w-xs"
        />
        <Button onClick={() => setEditing("new")} disabled={noMasterData}>
          Tambah bahan
        </Button>
      </div>

      {noMasterData && (
        <p className="rounded-[12px] border border-amber-200 bg-amber-50/70 px-4 py-3 text-[13px] text-amber-950">
          Kategori dan lokasi simpan belum ada. Jalankan <code className="font-mono">npm run seed:inventory</code> sekali.
        </p>
      )}

      {items.length === 0 ? (
        <EmptyState title="Katalog masih kosong" description="Tambahkan bahan pertama dengan tombol Tambah bahan." />
      ) : groups.length === 0 ? (
        <EmptyState title="Bahan tidak ditemukan" description="Coba kata kunci lain." />
      ) : (
        groups.map(({ category, rows }) => (
          <section key={category.slug} aria-labelledby={`catalog-${category.slug}`} className="space-y-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h2 id={`catalog-${category.slug}`} className="flex items-center gap-3 text-[15px] font-semibold text-slate-900">
                <CategoryIcon category={category.slug} />
                {category.name}
              </h2>
              <ul className="flex flex-wrap gap-2" aria-label={`Jenis ${category.name}`}>
                {category.types.map((type) => (
                  <li key={type.id} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-600">
                    {type.name}
                  </li>
                ))}
              </ul>
              {rows.some((item) => !item.isActive) && <Badge variant="draft">Ada bahan nonaktif</Badge>}
            </div>
            <DataList rows={rows} columns={columns} rowKey={(item) => String(item.id)} fixed />
          </section>
        ))
      )}

      {editing !== null && (
        <IngredientFormDialog item={editing === "new" ? null : editing} options={options} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
