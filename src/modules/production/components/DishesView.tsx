"use client";

import { useState, useTransition } from "react";
import { saveDishRecipeAction } from "@/app/admin/production/actions";
import { formatQuantity } from "@/modules/inventory/stock";
import { LineEditor } from "@/modules/procurement/components/LineEditor";
import type { ProcurementItem } from "@/modules/procurement/types";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { ListToolbar } from "@/shared/components/ui/ListToolbar";
import { Modal } from "@/shared/components/ui/Modal";
import { formatRupiah } from "@/shared/utils/formatters";
import { costPerPortion } from "../rules";
import type { DishRow } from "../types";

type DishTab = "semua" | "kosong" | "ada";

interface DishesViewProps {
  dishes: DishRow[];
  items: ProcurementItem[];
}

/** Recipes per dish of the public menu; a daily menu's needs and food cost are built from them. */
export function DishesView({ dishes, items }: DishesViewProps) {
  const [tab, setTab] = useState<DishTab>("kosong");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<DishRow | null>(null);

  const withRecipe = dishes.filter((d) => d.lines.length > 0);
  const q = query.toLowerCase().trim();
  const rows = dishes.filter(
    (d) =>
      (tab === "semua" || (tab === "ada" ? d.lines.length > 0 : d.lines.length === 0)) &&
      (!q || [d.name, ...d.lines.map((l) => l.ingredientName)].some((f) => f.toLowerCase().includes(q)))
  );

  const columns: DataColumn<DishRow>[] = [
    {
      key: "name",
      header: "Hidangan",
      mobile: "title",
      cell: (d) => (
        <button
          type="button"
          onClick={() => setEditing(d)}
          disabled={items.length === 0}
          className="text-left font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-900 cursor-pointer disabled:cursor-not-allowed"
        >
          {d.name}
        </button>
      ),
    },
    {
      key: "lines",
      header: "Bahan per porsi",
      mobile: "subtitle",
      width: "max-w-sm",
      cell: (d) =>
        d.lines.length > 0 ? (
          <span className="text-[13px] text-stone-600">{d.lines.map((l) => `${l.ingredientName} ${formatQuantity(l.quantityPerPortion, l.unit)}`).join(", ")}</span>
        ) : (
          <span className="text-[13px] text-stone-400">Belum ada resep</span>
        ),
    },
    { key: "used", header: "Dipakai di menu", align: "right", isNumeric: true, cell: (d) => d.usedIn.length },
    {
      key: "cost",
      header: "Biaya per porsi",
      align: "right",
      isNumeric: true,
      mobile: "status",
      cell: (d) => (d.lines.length > 0 ? formatRupiah(Math.round(costPerPortion(d.lines))) : <Badge variant="draft">Kosong</Badge>),
    },
  ];

  return (
    <div className="space-y-6">
      <p className="text-[13px] text-stone-600">
        {withRecipe.length} dari {dishes.length} hidangan sudah punya resep. Produksi dengan menu harian baru bisa mulai dimasak bila semua
        hidangannya punya resep; tanpa menu harian, produksi memakai resep paket.
      </p>

      <ListToolbar
        tabs={[
          { id: "kosong", label: "Belum ada resep", count: dishes.length - withRecipe.length },
          { id: "ada", label: "Sudah ada resep", count: withRecipe.length },
          { id: "semua", label: "Semua", count: dishes.length },
        ]}
        tab={tab}
        onTabChange={setTab}
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Cari hidangan atau bahan"
      />

      {items.length === 0 ? (
        <EmptyState title="Belum ada bahan" description="Tambahkan bahan di Katalog bahan dulu, lalu isi resep hidangan di sini." />
      ) : rows.length === 0 ? (
        <EmptyState title="Tidak ada hidangan" description="Tidak ada hidangan yang cocok dengan filter ini." />
      ) : (
        <DataList rows={rows} columns={columns} rowKey={(d) => d.name} />
      )}

      {editing && <DishFormDialog dish={editing} items={items} onClose={() => setEditing(null)} />}
    </div>
  );
}

function DishFormDialog({ dish, items, onClose }: { dish: DishRow; items: ProcurementItem[]; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await saveDishRecipeAction(form);
      if (result.error) setError(result.error);
      else onClose();
    });
  }

  return (
    <Modal
      isOpen
      onClose={() => !isPending && onClose()}
      title={`Resep ${dish.name}`}
      subtitle="Jumlah bahan untuk satu porsi hidangan ini, dalam satuan bahan."
      maxWidth="2xl"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="dish-form" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan resep"}
          </Button>
        </>
      }
    >
      <form id="dish-form" onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="dishName" value={dish.name} />
        {dish.usedIn.length > 0 && (
          <p className="text-[12px] text-stone-500">
            Dipakai di: {dish.usedIn.slice(0, 6).join("; ")}
            {dish.usedIn.length > 6 && ` dan ${dish.usedIn.length - 6} menu lain`}
          </p>
        )}
        <LineEditor
          items={items}
          withPrice={false}
          disabled={isPending}
          initialLines={dish.lines.map((l) => ({ ingredientId: l.ingredientId, quantity: l.quantityPerPortion, unitPrice: 0 }))}
        />
        {error && (
          <p role="alert" className="text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
