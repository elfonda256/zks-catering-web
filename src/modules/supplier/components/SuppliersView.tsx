"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { SearchInput } from "@/shared/components/ui/SearchInput";
import type { SupplierRow } from "../types";
import { SupplierFormDialog } from "./SupplierFormDialog";

/** Category names supplied, derived from the ingredients that use this supplier. */
function suppliedCategories(s: SupplierRow): string {
  return [...new Set(s.ingredients.map((i) => i.categoryName))].join(", ") || "—";
}

export function SuppliersView({ suppliers }: { suppliers: SupplierRow[] }) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<SupplierRow | "new" | null>(null);

  const columns: DataColumn<SupplierRow>[] = [
    {
      key: "name",
      header: "Supplier",
      mobile: "title",
      cell: (s) => (
        <>
          <button
            type="button"
            onClick={() => setEditing(s)}
            className="text-left font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-900 cursor-pointer"
          >
            {s.name}
          </button>
          <span className="block text-[12px] font-normal text-stone-500">{s.area ?? "—"}</span>
        </>
      ),
    },
    { key: "categories", header: "Memasok", mobile: "subtitle", width: "max-w-xs", cell: suppliedCategories },
    {
      key: "contact",
      header: "Kontak",
      wide: true,
      cell: (s) => (
        <>
          {s.contactName ?? "—"}
          {s.phone && <span className="block font-mono text-[12px] text-stone-500">{s.phone}</span>}
        </>
      ),
    },
    { key: "terms", header: "Pembayaran", cell: (s) => s.paymentTerms ?? "—" },
    {
      key: "status",
      header: "Status",
      align: "right",
      mobile: "status",
      cell: (s) => <Badge variant={s.isActive ? "completed" : "neutral"}>{s.isActive ? "Aktif" : "Nonaktif"}</Badge>,
    },
  ];

  const rows = useMemo(() => {
    const q = query.toLowerCase().trim();
    return suppliers.filter(
      (s) => !q || [s.name, s.area ?? "", s.contactName ?? "", suppliedCategories(s)].some((field) => field.toLowerCase().includes(q))
    );
  }, [suppliers, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Cari supplier, area, atau kategori"
          aria-label="Cari supplier"
          className="sm:max-w-xs"
        />
        <Button onClick={() => setEditing("new")}>Tambah supplier</Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={suppliers.length === 0 ? "Belum ada supplier" : "Supplier tidak ditemukan"}
          description={
            suppliers.length === 0
              ? "Tambahkan pemasok bahan, lalu pilih supplier utama tiap bahan di Katalog bahan."
              : "Coba kata kunci lain."
          }
        />
      ) : (
        <DataList rows={rows} columns={columns} rowKey={(s) => String(s.id)} />
      )}

      {editing && <SupplierFormDialog supplier={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
