"use client";

import { useMemo, useState, useTransition } from "react";
import { recordOpnameAction } from "@/app/admin/inventory/actions";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Modal } from "@/shared/components/ui/Modal";
import { SelectField } from "@/shared/components/ui/SelectField";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/Table";
import type { CatalogItem, InventoryFormOptions, LocationStock } from "../types";
import { formatQuantity } from "../stock";

interface OpnameSheetDialogProps {
  items: CatalogItem[];
  options: InventoryFormOptions;
  stock: LocationStock[];
  onClose: () => void;
  onSaved: (message: string) => void;
}

/** Count sheet for one location: every active ingredient kept there or with stock there. */
export function OpnameSheetDialog({ items, options, stock, onClose, onSaved }: OpnameSheetDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<number | "">("");

  const rows = useMemo(() => {
    if (locationId === "") return [];
    const here = new Map(stock.filter((s) => s.locationId === locationId).map((s) => [s.ingredientId, s.quantity]));
    return items
      .filter((item) => item.isActive && (item.locationId === locationId || here.has(item.id)))
      .map((item) => ({ item, system: here.get(item.id) ?? 0 }));
  }, [items, stock, locationId]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await recordOpnameAction(form);
      if (result.error) setError(result.error);
      else
        onSaved(
          result.adjusted
            ? `Stock opname ${result.reference} tersimpan: ${result.adjusted} bahan disesuaikan.`
            : "Semua hasil hitung cocok dengan sistem. Tidak ada stok yang diubah."
        );
    });
  }

  return (
    <Modal
      isOpen
      onClose={() => !isPending && onClose()}
      title="Stock opname"
      subtitle="Isi hasil hitung fisik. Baris yang dikosongkan tidak dihitung."
      maxWidth="2xl"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="opname-form" disabled={isPending || rows.length === 0}>
            {isPending ? "Menyimpan..." : "Simpan hasil hitung"}
          </Button>
        </>
      }
    >
      <form id="opname-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            name="locationId"
            label="Lokasi yang dihitung"
            required
            value={locationId}
            onChange={(e) => setLocationId(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="" disabled>
              Pilih lokasi
            </option>
            {options.locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </SelectField>
          <Input id="opn-note" name="note" label="Catatan" maxLength={200} placeholder="Opsional, misalnya hitung akhir bulan" />
        </div>

        {locationId !== "" && rows.length === 0 && (
          <p className="text-[13px] text-stone-600">Belum ada bahan yang disimpan atau berstok di lokasi ini.</p>
        )}

        {rows.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bahan</TableHead>
                <TableHead align="right">Sistem</TableHead>
                <TableHead align="right">Fisik</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ item, system }) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <span className="font-medium text-stone-900">{item.name}</span>
                    <span className="block font-mono text-[12px] text-stone-500">{item.code}</span>
                  </TableCell>
                  <TableCell align="right" isNumeric>
                    {formatQuantity(system, item.unit)}
                  </TableCell>
                  <TableCell align="right">
                    <label className="sr-only" htmlFor={`count-${item.id}`}>
                      Hasil hitung {item.name} ({item.unit})
                    </label>
                    <input
                      id={`count-${item.id}`}
                      name={`count:${item.id}`}
                      inputMode="decimal"
                      placeholder={item.unit}
                      className="h-9 w-28 rounded-lg border border-stone-300 bg-white px-2 text-right text-sm tabular-nums text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-3 focus:ring-brand-500/15"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {error && (
          <p role="alert" className="text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
