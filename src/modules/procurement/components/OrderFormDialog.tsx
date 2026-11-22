"use client";

import { useState, useTransition } from "react";
import { createOrderAction } from "@/app/admin/procurement/actions";
import { wibDateKey } from "@/lib/wib-date";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Modal } from "@/shared/components/ui/Modal";
import { SelectField } from "@/shared/components/ui/SelectField";
import type { ProcurementOptions, RequestRow } from "../types";
import { LineEditor } from "./LineEditor";

interface OrderFormDialogProps {
  options: ProcurementOptions;
  /** An approved request to turn into this PO; its lines are copied in. */
  request?: RequestRow;
  onClose: () => void;
}

/** The supplier most of the request's ingredients name as their main supplier. */
function suggestedSupplier(options: ProcurementOptions, request?: RequestRow): number | "" {
  if (!request) return "";
  const counts = new Map<number, number>();
  for (const line of request.lines) {
    const supplierId = options.items.find((item) => item.id === line.ingredientId)?.supplierId;
    if (supplierId && options.suppliers.some((s) => s.id === supplierId)) counts.set(supplierId, (counts.get(supplierId) ?? 0) + 1);
  }
  const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return best ? best[0] : "";
}

export function OrderFormDialog({ options, request, onClose }: OrderFormDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const today = wibDateKey(new Date());

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await createOrderAction(form);
      if (result.error) setError(result.error);
      else onClose();
    });
  }

  return (
    <Modal
      isOpen
      onClose={() => !isPending && onClose()}
      title={request ? `Buat PO dari ${request.code}` : "Buat PO"}
      subtitle="Harga terisi dari harga beli terakhir; sesuaikan dengan harga yang disepakati."
      maxWidth="2xl"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="order-form" disabled={isPending || options.suppliers.length === 0}>
            {isPending ? "Menyimpan..." : "Kirim PO"}
          </Button>
        </>
      }
    >
      <form id="order-form" onSubmit={handleSubmit} className="space-y-4">
        {request && <input type="hidden" name="requestId" value={request.id} />}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField name="supplierId" label="Supplier" required defaultValue={suggestedSupplier(options, request)}>
            <option value="" disabled>
              {options.suppliers.length === 0 ? "Tambahkan supplier dulu" : "Pilih supplier"}
            </option>
            {options.suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </SelectField>
          <Input id="po-date" name="expectedDate" type="date" label="Jadwal kirim" min={today} helperText="Opsional" />
          <div className="sm:col-span-2">
            <Input id="po-note" name="note" label="Catatan untuk supplier" maxLength={200} placeholder="Opsional" />
          </div>
        </div>
        <LineEditor
          items={options.items}
          withPrice
          disabled={isPending}
          initialLines={request?.lines.map((l) => ({ ingredientId: l.ingredientId, quantity: l.quantity, unitPrice: l.unitPrice }))}
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
