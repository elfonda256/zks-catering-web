"use client";

import { useState, useTransition } from "react";
import { createRequestAction } from "@/app/admin/procurement/actions";
import { wibDateKey } from "@/lib/wib-date";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Modal } from "@/shared/components/ui/Modal";
import type { ProcurementItem } from "../types";
import { LineEditor } from "./LineEditor";

export function RequestFormDialog({ items, onClose }: { items: ProcurementItem[]; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const today = wibDateKey(new Date());

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await createRequestAction(form);
      if (result.error) setError(result.error);
      else onClose();
    });
  }

  return (
    <Modal
      isOpen
      onClose={() => !isPending && onClose()}
      title="Buat permintaan pembelian"
      subtitle="Permintaan menunggu persetujuan sebelum dibelikan."
      maxWidth="2xl"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="request-form" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Ajukan"}
          </Button>
        </>
      }
    >
      <form id="request-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input id="pr-by" name="requestedBy" label="Diminta oleh" required maxLength={60} placeholder="Kepala dapur" autoFocus />
          <Input id="pr-needed" name="neededBy" type="date" label="Dibutuhkan tanggal" required min={today} defaultValue={today} />
          <div className="sm:col-span-2">
            <Input id="pr-reason" name="reason" label="Alasan" required maxLength={300} placeholder="Stok ayam di bawah minimum untuk pesanan Sabtu" />
          </div>
        </div>
        <LineEditor items={items} withPrice={false} disabled={isPending} />
        {error && (
          <p role="alert" className="text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
