"use client";

import { useState, useTransition } from "react";
import { receiveGoodsAction } from "@/app/admin/procurement/actions";
import { formatQuantity } from "@/modules/inventory/stock";
import { remainingQuantity } from "@/modules/procurement/documents";
import type { Option, OrderRow } from "@/modules/procurement/types";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Modal } from "@/shared/components/ui/Modal";
import { SelectField } from "@/shared/components/ui/SelectField";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/Table";

interface ReceiveGoodsDialogProps {
  /** POs still waiting for goods. */
  orders: OrderRow[];
  locations: Option[];
  onClose: () => void;
}

const QTY_INPUT =
  "h-9 w-24 rounded-lg border border-stone-300 bg-white px-2 text-right text-sm tabular-nums text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-3 focus:ring-brand-500/15";

export function ReceiveGoodsDialog({ orders, locations, onClose }: ReceiveGoodsDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | "">(orders.length === 1 ? orders[0].id : "");
  const order = orders.find((o) => o.id === orderId);
  const outstanding = order?.lines.filter((line) => remainingQuantity(line) > 0) ?? [];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await receiveGoodsAction(form);
      if (result.error) setError(result.error);
      else onClose();
    });
  }

  return (
    <Modal
      isOpen
      onClose={() => !isPending && onClose()}
      title="Terima barang"
      subtitle="Barang lolos cek kualitas masuk stok sebagai batch baru; isi kedaluwarsa untuk bahan segar. Yang ditolak hanya dicatat."
      maxWidth="2xl"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="receipt-form" disabled={isPending || outstanding.length === 0}>
            {isPending ? "Menyimpan..." : "Simpan penerimaan"}
          </Button>
        </>
      }
    >
      <form id="receipt-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            name="orderId"
            label="PO"
            required
            value={orderId}
            onChange={(e) => setOrderId(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="" disabled>
              Pilih PO
            </option>
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.code} · {o.supplierName}
              </option>
            ))}
          </SelectField>
          <SelectField name="locationId" label="Masuk ke" required defaultValue="">
            <option value="" disabled>
              Pilih lokasi
            </option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </SelectField>
          <div className="sm:col-span-2">
            <Input id="grn-note" name="note" label="Catatan" maxLength={200} placeholder="Opsional, misalnya nomor surat jalan" />
          </div>
        </div>

        {outstanding.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bahan</TableHead>
                <TableHead align="right">Sisa PO</TableHead>
                <TableHead align="right">Diterima</TableHead>
                <TableHead align="right">Ditolak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outstanding.map((line) => (
                <TableRow key={line.lineId}>
                  <TableCell>
                    <input type="hidden" name="receiptLine" value={line.lineId} />
                    <span className="font-medium text-stone-900">{line.ingredientName}</span>
                    <label className="sr-only" htmlFor={`grn-note-${line.lineId}`}>
                      Alasan ditolak {line.ingredientName}
                    </label>
                    <div className="mt-1 grid grid-cols-2 gap-1">
                      <label className="sr-only" htmlFor={`grn-lot-${line.lineId}`}>
                        Nomor lot {line.ingredientName}
                      </label>
                      <input
                        id={`grn-lot-${line.lineId}`}
                        name={`batchCode:${line.lineId}`}
                        maxLength={40}
                        placeholder="Nomor lot (opsional)"
                        className="block h-8 w-full rounded-lg border border-stone-200 bg-white px-2 text-[12px] text-stone-700 focus:border-brand-500 focus:outline-none"
                      />
                      <label className="sr-only" htmlFor={`grn-exp-${line.lineId}`}>
                        Kedaluwarsa {line.ingredientName}
                      </label>
                      <input
                        id={`grn-exp-${line.lineId}`}
                        name={`expiresAt:${line.lineId}`}
                        type="date"
                        title="Tanggal kedaluwarsa"
                        className="block h-8 w-full rounded-lg border border-stone-200 bg-white px-2 text-[12px] text-stone-700 focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                    <input
                      id={`grn-note-${line.lineId}`}
                      name={`lineNote:${line.lineId}`}
                      maxLength={120}
                      placeholder="Alasan jika ada yang ditolak"
                      className="mt-1 block h-8 w-full rounded-lg border border-stone-200 bg-white px-2 text-[12px] text-stone-700 focus:border-brand-500 focus:outline-none"
                    />
                  </TableCell>
                  <TableCell align="right" isNumeric>
                    {formatQuantity(remainingQuantity(line), line.unit)}
                  </TableCell>
                  <TableCell align="right">
                    <label className="sr-only" htmlFor={`grn-acc-${line.lineId}`}>
                      Diterima {line.ingredientName} ({line.unit})
                    </label>
                    <input
                      id={`grn-acc-${line.lineId}`}
                      name={`accepted:${line.lineId}`}
                      inputMode="decimal"
                      defaultValue={remainingQuantity(line)}
                      className={QTY_INPUT}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <label className="sr-only" htmlFor={`grn-rej-${line.lineId}`}>
                      Ditolak {line.ingredientName} ({line.unit})
                    </label>
                    <input id={`grn-rej-${line.lineId}`} name={`rejected:${line.lineId}`} inputMode="decimal" placeholder="0" className={QTY_INPUT} />
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
