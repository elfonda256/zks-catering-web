"use client";

import { useState, useTransition } from "react";
import { recordMovementAction } from "@/app/admin/inventory/actions";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Modal } from "@/shared/components/ui/Modal";
import { SelectField } from "@/shared/components/ui/SelectField";
import type { CatalogItem, InventoryFormOptions, MovementType } from "../types";
import { MOVEMENT_TYPE_LABELS } from "../movement-types";

interface MovementFormDialogProps {
  items: CatalogItem[];
  options: InventoryFormOptions;
  /** Pre-selects an ingredient when opened from its row. */
  initialItemId?: number;
  /** Pre-selects the movement type, for example TRANSFER on the Transfer page. */
  initialType?: MovementType;
  onClose: () => void;
}

export function MovementFormDialog({ items, options, initialItemId, initialType = "IN", onClose }: MovementFormDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<MovementType>(initialType);
  const [itemId, setItemId] = useState<number | "">(initialItemId ?? "");
  const selected = items.find((item) => item.id === itemId);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await recordMovementAction(form);
      if (result.error) setError(result.error);
      else onClose();
    });
  }

  const locationLabel = type === "IN" ? "Masuk ke" : type === "ADJUSTMENT" ? "Lokasi" : "Dari lokasi";
  const activeItems = items.filter((item) => item.isActive);

  return (
    <Modal
      isOpen
      onClose={() => !isPending && onClose()}
      title="Catat mutasi stok"
      subtitle="Setiap perubahan stok tercatat dan tidak bisa dihapus."
      maxWidth="2xl"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="movement-form" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan mutasi"}
          </Button>
        </>
      }
    >
      <form id="movement-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <fieldset className="sm:col-span-2">
          <legend className="text-[14px] font-medium text-stone-700">Jenis mutasi</legend>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(MOVEMENT_TYPE_LABELS) as MovementType[]).map((option) => (
              <label
                key={option}
                className={`cursor-pointer rounded-[8px] border px-3 py-2 text-[13px] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-stone-900 ${
                  type === option ? "border-stone-900 bg-stone-50 font-semibold text-stone-900" : "border-stone-200 text-stone-700"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={option}
                  checked={type === option}
                  onChange={() => setType(option)}
                  className="sr-only"
                />
                {MOVEMENT_TYPE_LABELS[option].label}
                <span className="block text-[11px] font-normal text-stone-500">{MOVEMENT_TYPE_LABELS[option].hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <SelectField
            name="ingredientId"
            label="Bahan"
            required
            value={itemId}
            onChange={(e) => setItemId(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="" disabled>
              Pilih bahan
            </option>
            {options.categories.map((category) => {
              const inCategory = activeItems.filter((item) => item.categorySlug === category.slug);
              if (inCategory.length === 0) return null;
              return (
                <optgroup key={category.slug} label={category.name}>
                  {inCategory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.code})
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </SelectField>
        </div>

        <Input
          id="mv-qty"
          name="quantity"
          label={selected ? `Jumlah (${selected.unit})` : "Jumlah"}
          inputMode="decimal"
          required
          placeholder="0"
          helperText="Boleh desimal, misalnya 1,5."
        />

        <SelectField name="locationId" label={locationLabel} required defaultValue={selected?.locationId ?? ""} key={`loc-${itemId}`}>
          <option value="" disabled>
            Pilih lokasi
          </option>
          {options.locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </SelectField>

        {type === "TRANSFER" && (
          <SelectField name="targetLocationId" label="Ke lokasi" required defaultValue="">
            <option value="" disabled>
              Pilih lokasi tujuan
            </option>
            {options.locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </SelectField>
        )}

        {type === "ADJUSTMENT" && (
          <SelectField name="direction" label="Arah koreksi" required defaultValue="">
            <option value="" disabled>
              Pilih
            </option>
            <option value="plus">Tambah stok (fisik lebih banyak)</option>
            <option value="minus">Kurangi stok (fisik lebih sedikit)</option>
          </SelectField>
        )}

        {type === "IN" && (
          <>
            <Input id="mv-batch" name="batchCode" label="Nomor lot / batch" maxLength={40} placeholder="Opsional, dari label supplier" />
            <Input id="mv-exp" name="expiresAt" type="date" label="Kedaluwarsa" helperText="Isi untuk bahan segar agar FEFO berjalan." />
          </>
        )}

        <Input id="mv-ref" name="reference" label="Referensi" placeholder="Nomor PO, nota, atau produksi" maxLength={40} />
        <Input
          id="mv-note"
          name="note"
          label="Catatan"
          required={type === "ADJUSTMENT"}
          maxLength={200}
          placeholder={type === "ADJUSTMENT" ? "Alasan selisih" : "Opsional"}
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
