"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { KpiGrid } from "@/shared/components/ui/KpiGrid";
import { ListToolbar } from "@/shared/components/ui/ListToolbar";
import { formatRupiahShort } from "@/shared/utils/formatters";
import { formatDate } from "@/shared/utils/formatters";
import { daysUntilExpiry } from "../fefo";
import type { BatchStockRow, CatalogItem, InventoryFormOptions } from "../types";
import { EXPIRY_WARNING_DAYS, STOCK_LEVEL_BADGE, formatQuantity, stockLevel } from "../stock";
import { CategoryIcon } from "./CategoryIcon";
import { MovementFormDialog } from "./MovementFormDialog";

type StockTab = "semua" | "beli" | "kedaluwarsa";

interface StockOverviewViewProps {
  items: CatalogItem[];
  options: InventoryFormOptions;
  /** Batches still in stock, earliest expiry first. */
  batches: BatchStockRow[];
  /** Server time (ISO) so expiry days are computed the same way on every render. */
  now: string;
}

/** Batches expiring within this many days are listed under the stock table. */
const BATCH_LIST_DAYS = 7;

function ExpiryLabel({ expiresAt, now }: { expiresAt: string | null; now: Date }) {
  if (!expiresAt) return <span className="text-stone-400">—</span>;
  const days = daysUntilExpiry(expiresAt, now);
  const text = days < 0 ? "Sudah lewat" : days === 0 ? "Hari ini" : days === 1 ? "Besok" : formatDate(expiresAt);
  return <span className={days <= EXPIRY_WARNING_DAYS ? "font-medium text-rose-700" : undefined}>{text}</span>;
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

export function StockOverviewView({ items, options, batches, now: nowIso }: StockOverviewViewProps) {
  const now = new Date(nowIso);
  const [tab, setTab] = useState<StockTab>("semua");
  const [query, setQuery] = useState("");
  const [movementFor, setMovementFor] = useState<number | "new" | null>(null);

  const active = items.filter((item) => item.isActive);
  const toBuy = active.filter((item) => stockLevel(item) !== "aman");
  const expiring = (item: CatalogItem) => item.nearestExpiry !== null && daysUntilExpiry(item.nearestExpiry, now) <= EXPIRY_WARNING_DAYS;
  const expiringItems = active.filter(expiring);
  const soonBatches = batches.filter((b) => b.expiresAt && daysUntilExpiry(b.expiresAt, now) <= BATCH_LIST_DAYS);
  const stockValue = active.reduce((sum, item) => sum + Math.max(item.stock, 0) * item.lastPrice, 0);

  const q = query.toLowerCase().trim();
  const groups = options.categories
    .map((category) => ({
      category,
      rows: active.filter(
        (item) =>
          item.categorySlug === category.slug &&
          (tab === "semua" || (tab === "beli" ? stockLevel(item) !== "aman" : expiring(item))) &&
          (!q || [item.name, item.code, item.typeName].some((field) => field.toLowerCase().includes(q)))
      ),
    }))
    .filter((group) => group.rows.length > 0);

  const columns: DataColumn<CatalogItem>[] = [
    {
      key: "name",
      header: "Bahan",
      width: "w-[20%]",
      mobile: "title",
      cell: (item) => (
        <>
          <span className="font-medium text-stone-900">{item.name}</span>
          <span className="block font-mono text-[12px] font-normal text-stone-500">{item.code}</span>
        </>
      ),
    },
    { key: "type", header: "Jenis", width: "w-[10%]", cell: (item) => item.typeName },
    { key: "location", header: "Lokasi utama", width: "w-[12%]", cell: (item) => item.locationName },
    { key: "stock", header: "Stok", width: "w-[10%]", align: "right", isNumeric: true, cell: (item) => formatQuantity(item.stock, item.unit) },
    { key: "expiry", header: "Kedaluwarsa terdekat", width: "w-[11%]", cell: (item) => <ExpiryLabel expiresAt={item.nearestExpiry} now={now} /> },
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
      <KpiGrid label="Ringkasan stok" columns={4}>
        <KpiCard label="Jenis bahan" value={active.length} subtext={`${options.categories.length} kategori`} />
        <KpiCard label="Perlu dibeli" tone="warning" value={toBuy.length} subtext="Di bawah stok minimum" />
        <KpiCard label="Segera kedaluwarsa" tone="danger" value={expiringItems.length} subtext={`Dalam ${EXPIRY_WARNING_DAYS} hari`} />
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
          { id: "kedaluwarsa", label: "Segera kedaluwarsa", count: expiringItems.length },
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

      <section aria-labelledby="batch-title" className="space-y-3">
        <h2 id="batch-title" className="text-[15px] font-semibold text-stone-900">
          Batch kedaluwarsa dalam {BATCH_LIST_DAYS} hari
        </h2>
        {soonBatches.length === 0 ? (
          <p className="text-[13px] text-stone-600">Tidak ada. Isi tanggal kedaluwarsa saat menerima barang agar batch muncul di sini.</p>
        ) : (
          <DataList
            rows={soonBatches}
            rowKey={(b) => `${b.batchId}:${b.locationId}`}
            columns={[
              { key: "item", header: "Bahan", mobile: "title", cell: (b) => <span className="font-medium text-stone-900">{b.ingredientName}</span> },
              { key: "batch", header: "Batch", mobile: "subtitle", cell: (b) => <span className="font-mono text-[13px]">{b.batchCode}</span> },
              { key: "location", header: "Lokasi", cell: (b) => b.locationName },
              { key: "qty", header: "Sisa", align: "right", isNumeric: true, cell: (b) => formatQuantity(b.quantity, b.unit) },
              { key: "expiry", header: "Kedaluwarsa", mobile: "status", cell: (b) => <ExpiryLabel expiresAt={b.expiresAt} now={now} /> },
            ]}
          />
        )}
        <p className="text-[12px] text-stone-500">Bahan keluar, transfer, dan produksi selalu mengambil batch yang paling cepat kedaluwarsa (FEFO).</p>
      </section>

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
