"use client";

import { useState, useTransition } from "react";
import { saveSupplierAction } from "@/app/admin/supplier/actions";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Modal } from "@/shared/components/ui/Modal";
import type { SupplierRow } from "../types";

interface SupplierFormDialogProps {
  /** The supplier to edit, or null to add a new one. */
  supplier: SupplierRow | null;
  onClose: () => void;
}

export function SupplierFormDialog({ supplier, onClose }: SupplierFormDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await saveSupplierAction(supplier?.id ?? null, form);
      if (result.error) setError(result.error);
      else onClose();
    });
  }

  return (
    <Modal
      isOpen
      onClose={() => !isPending && onClose()}
      title={supplier ? `Ubah ${supplier.name}` : "Tambah supplier"}
      subtitle={supplier ? supplier.area ?? undefined : "Supplier aktif bisa dipilih di Katalog bahan"}
      maxWidth="2xl"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="supplier-form" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </>
      }
    >
      <form id="supplier-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input id="sup-name" name="name" label="Nama supplier" required defaultValue={supplier?.name} placeholder="CV Sumber Pangan" autoFocus />
        </div>
        <Input id="sup-contact" name="contactName" label="Nama kontak" defaultValue={supplier?.contactName ?? ""} placeholder="Opsional" />
        <Input id="sup-phone" name="phone" label="Telepon / WhatsApp" inputMode="tel" defaultValue={supplier?.phone ?? ""} placeholder="0812-3456-7890" />
        <Input id="sup-area" name="area" label="Area" defaultValue={supplier?.area ?? ""} placeholder="Pasar Induk Karawang" />
        <Input id="sup-terms" name="paymentTerms" label="Ketentuan pembayaran" defaultValue={supplier?.paymentTerms ?? ""} placeholder="Tunai / tempo 14 hari" />
        <label className="sm:col-span-2 flex cursor-pointer items-center gap-3 text-[14px] text-stone-700">
          <input type="checkbox" name="isActive" defaultChecked={supplier?.isActive ?? true} className="h-4 w-4 cursor-pointer accent-brand-500" />
          Aktif (bisa dipilih sebagai supplier bahan)
        </label>

        {supplier && (
          <section className="sm:col-span-2 space-y-2">
            <h3 className="text-[13px] font-semibold text-stone-900">Bahan yang dipasok</h3>
            <p className="text-[13px] text-stone-600">
              {supplier.ingredients.length > 0
                ? supplier.ingredients.map((i) => i.name).join(", ")
                : "Belum ada bahan yang memilih supplier ini di Katalog bahan."}
            </p>
          </section>
        )}

        {error && (
          <p role="alert" className="sm:col-span-2 text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
