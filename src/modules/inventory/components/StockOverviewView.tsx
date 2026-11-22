"use client";

import { useMemo, useState } from "react";
import {
  CATEGORIES,
  INGREDIENTS,
  LOCATIONS,
  formatQty,
  stockLevel,
  type Ingredient,
} from "@/modules/sample-data";
import { Badge } from "@/shared/components/ui/Badge";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { ListToolbar } from "@/shared/components/ui/ListToolbar";
import { SampleDataNotice } from "@/shared/components/ui/SampleDataNotice";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { KpiGrid } from "@/shared/components/ui/KpiGrid";
import { formatRupiahShort } from "@/shared/utils/formatters";
import { EXPIRY_WARNING_DAYS, STOCK_LEVEL_BADGE } from "../stock";
import { CategoryIcon } from "./CategoryIcon";

type StockTab = "semua" | "beli" | "kedaluwarsa";

const isExpiringSoon = (item: Ingredient) =>
  item.expiresInDays !== undefined && item.expiresInDays <= EXPIRY_WARNING_DAYS;

const TAB_FILTER: Record<StockTab, (item: Ingredient) => boolean> = {
  semua: () => true,
  beli: (item) => stockLevel(item) !== "aman",
  kedaluwarsa: isExpiringSoon,
};

function StockBar({ item }: { item: Ingredient }) {
  // Bar is full at twice the minimum, so the minimum sits in the middle.
  const percent = Math.min(100, (item.stock / (item.minStock * 2)) * 100);
  const low = stockLevel(item) !== "aman";
  return (
    <div className="h-1.5 w-24 rounded-full bg-slate-100" aria-hidden="true">
      <div className={`h-1.5 rounded-full ${low ? "bg-amber-500" : "bg-slate-700"}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

const COLUMNS: DataColumn<Ingredient>[] = [
  {
    key: "name",
    header: "Bahan",
    width: "w-[24%]",
    mobile: "title",
    cell: (item) => (
      <>
        <span className="font-medium text-slate-900">{item.name}</span>
        <span className="block font-mono text-[12px] font-normal text-slate-500">{item.code}</span>
      </>
    ),
  },
  { key: "type", header: "Jenis", width: "w-[14%]", cell: (item) => item.type },
  { key: "location", header: "Lokasi", width: "w-[14%]", cell: (item) => LOCATIONS[item.location].name },
  { key: "stock", header: "Stok", width: "w-[11%]", align: "right", isNumeric: true, cell: (item) => formatQty(item.stock, item.unit) },
  {
    key: "min",
    header: "Minimum",
    width: "w-[17%]",
    cell: (item) => (
      <div className="flex items-center gap-3">
        <StockBar item={item} />
        <span className="text-[12px] text-slate-500">{formatQty(item.minStock, item.unit)}</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "w-[20%]",
    mobile: "status",
    cell: (item) => {
      const level = STOCK_LEVEL_BADGE[stockLevel(item)];
      return (
        <div className="flex flex-wrap justify-end gap-2 md:justify-start">
          <Badge variant={level.variant} dot>
            {level.label}
          </Badge>
          {isExpiringSoon(item) && <Badge variant="expired">Kedaluwarsa {item.expiresInDays} hari</Badge>}
        </div>
      );
    },
  },
];

export function StockOverviewView() {
  const [tab, setTab] = useState<StockTab>("semua");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      beli: INGREDIENTS.filter(TAB_FILTER.beli).length,
      kedaluwarsa: INGREDIENTS.filter(isExpiringSoon).length,
      nilai: INGREDIENTS.reduce((sum, item) => sum + item.stock * item.price, 0),
    }),
    []
  );

  const groups = useMemo(() => {
    const q = query.toLowerCase().trim();
    return CATEGORIES.map((category) => ({
      category,
      items: INGREDIENTS.filter(
        (item) =>
          item.category === category.id &&
          TAB_FILTER[tab](item) &&
          (!q || item.name.toLowerCase().includes(q) || item.type.toLowerCase().includes(q))
      ),
    })).filter((group) => group.items.length > 0);
  }, [tab, query]);

  return (
    <div className="space-y-6">
      <SampleDataNotice />

      <KpiGrid label="Ringkasan stok" columns={4}>
        <KpiCard label="Jenis bahan" value={INGREDIENTS.length} subtext={`${CATEGORIES.length} kategori`} />
        <KpiCard label="Perlu dibeli" value={counts.beli} subtext="Di bawah stok minimum" />
        <KpiCard label="Segera kedaluwarsa" value={counts.kedaluwarsa} subtext={`Dalam ${EXPIRY_WARNING_DAYS} hari`} />
        <KpiCard label="Nilai stok" value={formatRupiahShort(counts.nilai)} subtext="Harga beli terakhir" />
      </KpiGrid>

      <ListToolbar
        tabs={[
          { id: "semua", label: "Semua", count: INGREDIENTS.length },
          { id: "beli", label: "Perlu dibeli", count: counts.beli },
          { id: "kedaluwarsa", label: "Segera kedaluwarsa", count: counts.kedaluwarsa },
        ]}
        tab={tab}
        onTabChange={setTab}
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Cari bahan atau jenis"
      />

      {groups.length === 0 ? (
        <EmptyState title="Tidak ada bahan" description="Tidak ada bahan yang cocok dengan filter ini." />
      ) : (
        groups.map(({ category, items }) => (
          <section key={category.id} aria-labelledby={`cat-${category.id}`} className="space-y-3">
            <h2 id={`cat-${category.id}`} className="flex items-center gap-3 text-[15px] font-semibold text-slate-900">
              <CategoryIcon category={category.id} />
              <span>
                {category.name} <span className="font-normal text-slate-500">· {items.length} bahan</span>
              </span>
            </h2>
            <DataList rows={items} columns={COLUMNS} rowKey={(item) => item.code} fixed />
          </section>
        ))
      )}
    </div>
  );
}
