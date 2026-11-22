"use client";

import { useState, useTransition } from "react";
import { saveIngredientAction } from "@/app/admin/inventory/actions";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Modal } from "@/shared/components/ui/Modal";
import { SelectField } from "@/shared/components/ui/SelectField";
import type { CatalogItem, InventoryFormOptions } from "../types";
import { INGREDIENT_UNITS } from "../validation";

interface IngredientFormDialogProps {
  /** The ingredient to edit, or null to add a new one. */
  item: CatalogItem | null;
  options: InventoryFormOptions;
  onClose: () => void;
}

export function IngredientFormDialog({ item, options, onClose }: IngredientFormDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await saveIngredientAction(item?.id ?? null, form);
      if (result.error) setError(result.error);
      else onClose();
    });
  }

  return (
    <Modal
      isOpen
      onClose={() => !isPending && onClose()}
      title={item ? `Ubah ${item.name}` : "Tambah bahan"}
      subtitle={item ? item.code : "Bahan baru masuk katalog dengan stok 0"}
      maxWidth="2xl"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="ingredient-form" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </>
      }
    >
      <form id="ingredient-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="ing-code" name="code" label="Kode" required defaultValue={item?.code} placeholder="BRS-01" autoFocus />
        <Input id="ing-name" name="name" label="Nama bahan" required defaultValue={item?.name} placeholder="Beras putih medium" />
        <SelectField name="typeId" label="Kategori & jenis" required defaultValue={item?.typeId ?? ""}>
          <option value="" disabled>
            Pilih jenis
          </option>
          {options.categories.map((category) => (
            <optgroup key={category.slug} label={category.name}>
              {category.types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </optgroup>
          ))}
        </SelectField>
        <SelectField name="unit" label="Satuan" required defaultValue={item?.unit ?? ""}>
          <option value="" disabled>
            Pilih satuan
          </option>
          {INGREDIENT_UNITS.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </SelectField>
        <SelectField name="locationId" label="Lokasi simpan" required defaultValue={item?.locationId ?? ""}>
          <option value="" disabled>
            Pilih lokasi
          </option>
          {options.locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </SelectField>
        <SelectField name="supplierId" label="Supplier utama" defaultValue={item?.supplierId ?? ""}>
          <option value="">Belum ditentukan</option>
          {options.suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </SelectField>
        <Input
          id="ing-min"
          name="minStock"
          label="Stok minimum"
          inputMode="decimal"
          defaultValue={item?.minStock ?? 0}
          helperText="Di bawah angka ini, bahan masuk daftar perlu dibeli."
        />
        <Input
          id="ing-price"
          name="lastPrice"
          label="Harga beli terakhir (Rp)"
          inputMode="numeric"
          defaultValue={item?.lastPrice ?? 0}
          helperText="Per satuan, tanpa titik."
        />
        {error && (
          <p role="alert" className="sm:col-span-2 text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
