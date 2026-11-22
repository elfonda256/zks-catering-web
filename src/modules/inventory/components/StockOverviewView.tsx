"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { KpiGrid } from "@/shared/components/ui/KpiGrid";
import { ListToolbar } from "@/shared/components/ui/ListToolbar";
import { formatRupiahShort } from "@/shared/utils/formatters";
import type { CatalogItem, InventoryFormOptions } from "../types";
import { STOCK_LEVEL_BADGE, formatQuantity, stockLevel } from "../stock";
import { CategoryIcon } from "./CategoryIcon";
import { MovementFormDialog } from "./MovementFormDialog";

type StockTab = "semua" | "beli";

interface StockOverviewViewProps {
  items: CatalogItem[];
  options: InventoryFormOptions;
}

function StockBar({ item }: { item: CatalogItem }) {
  // Full at twice the minimum, so the minimum sits in the middle.
  const percent = item.minStock > 0 ? Math.min(100, (item.stock / (item.minStock * 2)) * 100) : 100;
  const low = stockLevel(item) !== "aman";
  return (
    <div className="h-1.5 w-24 rounded-full bg-stone-100" aria-hidden="true">
      <div className={`h-1.5 rounded-full ${low ? "bg-amber-500" : "bg-stone-700"}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

export function StockOverviewView({ items, options }: StockOverviewViewProps) {
  const [tab, setTab] = useState<StockTab>("semua");
  const [query, setQuery] = useState("");
  const [movementFor, setMovementFor] = useState<number | "new" | null>(null);

  const active = useMemo(() => items.filter((item) => item.isActive), [items]);
  const toBuy = active.filter((item) => stockLevel(item) !== "aman");
  const stockValue = active.reduce((sum, item) => sum + Math.max(item.stock, 0) * item.lastPrice, 0);

  const groups = useMemo(() => {
    const q = query.toLowerCase().trim();
    return options.categories
      .map((category) => ({
        category,
        rows: active.filter(
          (item) =>
            item.categorySlug === category.slug &&
            (tab === "semua" || stockLevel(item) !== "aman") &&
            (!q || [item.name, item.code, item.typeName].some((field) => field.toLowerCase().includes(q)))
        ),
      }))
      .filter((group) => group.rows.length > 0);
  }, [active, options.categories, tab, query]);

  const columns: DataColumn<CatalogItem>[] = [
    {
      key: "name",
      header: "Bahan",
      width: "w-[24%]",
      mobile: "title",
      cell: (item) => (
        <>
          <span className="font-medium text-stone-900">{item.name}</span>
          <span className="block font-mono text-[12px] font-normal text-stone-500">{item.code}</span>
        </>
      ),
    },
    { key: "type", header: "Jenis", width: "w-[13%]", cell: (item) => item.typeName },
    { key: "location", header: "Lokasi utama", width: "w-[14%]", cell: (item) => item.locationName },
    { key: "stock", header: "Stok", width: "w-[11%]", align: "right", isNumeric: true, cell: (item) => formatQuantity(item.stock, item.unit) },
    {
      key: "min",
      header: "Minimum",
      width: "w-[17%]",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <StockBar item={item} />
          <span className="text-[12px] text-stone-500">{formatQuantity(item.minStock, item.unit)}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-[12%]",
      mobile: "status",
      cell: (item) => (
        <Badge variant={STOCK_LEVEL_BADGE[stockLevel(item)].variant} dot>
          {STOCK_LEVEL_BADGE[stockLevel(item)].label}
        </Badge>
      ),
    },
    {
      key: "action",
      header: "Aksi",
      width: "w-[9%]",
      align: "right",
      cell: (item) => (
        <Button size="sm" variant="ghost" onClick={() => setMovementFor(item.id)}>
          Catat
        </Button>
      ),
    },
  ];

  if (active.length === 0) {
    return (
      <EmptyState
        title="Belum ada bahan"
        description="Tambahkan bahan di Katalog bahan dulu. Setelah itu stok bisa dicatat dari halaman ini."
        action={
          <Link href="/admin/inventory/items" className="text-[13px] font-medium text-stone-900 underline underline-offset-4">
            Buka Katalog bahan
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <KpiGrid label="Ringkasan stok" columns={3}>
        <KpiCard label="Jenis bahan" value={active.length} subtext={`${options.categories.length} kategori`} />
        <KpiCard label="Perlu dibeli" tone="warning" value={toBuy.length} subtext="Di bawah stok minimum" />
        <KpiCard label="Nilai stok" value={formatRupiahShort(stockValue)} subtext="Harga beli terakhir" />
      </KpiGrid>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-[13px] text-stone-600">Stok dihitung dari semua mutasi yang tercatat.</p>
        <Button onClick={() => setMovementFor("new")}>Catat mutasi</Button>
      </div>

      <ListToolbar
        tabs={[
          { id: "semua", label: "Semua", count: active.length },
          { id: "beli", label: "Perlu dibeli", count: toBuy.length },
        ]}
        tab={tab}
        onTabChange={setTab}
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Cari bahan, kode, atau jenis"
      />

      {groups.length === 0 ? (
        <EmptyState title="Tidak ada bahan" description="Tidak ada bahan yang cocok dengan filter ini." />
      ) : (
        groups.map(({ category, rows }) => (
          <section key={category.slug} aria-labelledby={`cat-${category.slug}`} className="space-y-3">
            <h2 id={`cat-${category.slug}`} className="flex items-center gap-3 text-[15px] font-semibold text-stone-900">
              <CategoryIcon category={category.slug} />
              <span>
                {category.name} <span className="font-normal text-stone-500">· {rows.length} bahan</span>
              </span>
            </h2>
            <DataList rows={rows} columns={columns} rowKey={(item) => String(item.id)} fixed />
          </section>
        ))
      )}

      {movementFor !== null && (
        <MovementFormDialog
          items={items}
          options={options}
          initialItemId={movementFor === "new" ? undefined : movementFor}
          onClose={() => setMovementFor(null)}
        />
      )}
    </div>
  );
}
