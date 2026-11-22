"use client";

import { useState, useTransition } from "react";
import { advanceProductionAction, cancelProductionAction } from "@/app/admin/production/actions";
import { formatQuantity } from "@/modules/inventory/stock";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DetailList } from "@/shared/components/ui/DetailList";
import { Modal } from "@/shared/components/ui/Modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/Table";
import { formatDate, formatDateTime } from "@/shared/utils/formatters";
import { SHIFT_LABELS, isBeforeCooking } from "../rules";
import { PRODUCTION_STATUS } from "../status";
import type { ProductionRow } from "../types";

/** Details of one production order, with its ingredient needs and the next kitchen step. */
export function ProductionOrderDialog({ order, onClose }: { order: ProductionRow; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const status = PRODUCTION_STATUS[order.status];
  const taken = order.materialsIssuedAt !== null;
  const short = order.needs.filter((need) => need.required > need.available);

  function run(action: () => Promise<{ error?: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.error) setError(result.error);
      else onClose();
    });
  }

  return (
    <Modal
      isOpen
      onClose={() => !isPending && onClose()}
      title={`Produksi ${order.code}`}
      subtitle={`${order.packageName} · ${order.portions} porsi`}
      maxWidth="2xl"
      footer={
        <>
          {isBeforeCooking(order.status) && (
            <Button variant="danger" onClick={() => run(() => cancelProductionAction(order.id))} disabled={isPending}>
              Batalkan
            </Button>
          )}
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Tutup
          </Button>
          {status.action && (
            <Button onClick={() => run(() => advanceProductionAction(order.id))} disabled={isPending}>
              {isPending ? "Menyimpan..." : status.action}
            </Button>
          )}
        </>
      }
    >
      <DetailList
        items={[
          { label: "Status", value: <Badge variant={status.variant}>{status.label}</Badge> },
          { label: "Jadwal", value: `${formatDate(order.productionDate)}, shift ${SHIFT_LABELS[order.shift].toLowerCase()}` },
          { label: "Kirim", value: `${order.deliveryTime} WIB ke ${order.destination}` },
          { label: "Pesanan", value: order.orderCode ?? "Tanpa pesanan online" },
          { label: "Menu", value: order.menu ? `Variasi ${order.menu.variation}: ${order.menu.dishes.join(", ")}` : "Resep paket" },
          ...(order.note ? [{ label: "Catatan", value: order.note }] : []),
        ]}
      />
      {!taken && order.menu && order.menu.missingRecipes.length > 0 && (
        <p role="status" className="text-[13px] text-amber-800 bg-amber-50 border border-amber-200 rounded-[8px] px-3 py-2">
          Resep hidangan belum diisi: {order.menu.missingRecipes.join(", ")}. Lengkapi di Hidangan sebelum mulai masak.
        </p>
      )}
      {taken ? (
        <p className="text-[13px] text-stone-600">Bahan sudah diambil dari stok pada {formatDateTime(order.materialsIssuedAt!)}.</p>
      ) : order.status === "PREPARING" ? (
        <p className="text-[13px] text-stone-600">
          &ldquo;Mulai masak&rdquo; mengurangi stok bahan di bawah dari lokasi simpannya.
          {short.length > 0 && " Bahan yang kurang harus ditambah dulu."}
        </p>
      ) : null}
      {taken && order.issued.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-[13px] font-semibold text-stone-900">Bahan yang dipakai (penelusuran batch)</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bahan</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead align="right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.issued.map((line, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <span className="font-medium text-stone-900">{line.ingredientName}</span>
                    <span className="block text-[12px] text-stone-500">{line.locationName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-[13px]">{line.batchCode ?? "Stok lama (tanpa batch)"}</span>
                    {line.expiresAt && <span className="block text-[12px] text-stone-500">Kedaluwarsa {formatDate(line.expiresAt)}</span>}
                  </TableCell>
                  <TableCell align="right" isNumeric>
                    {formatQuantity(line.quantity, line.unit)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}
      {taken ? null : order.needs.length === 0 ? (
        <p className="text-[13px] text-amber-800">
          {order.menu ? "Resep hidangan menu ini belum diisi" : "Resep paket ini belum diisi"}, jadi kebutuhan bahan belum bisa dihitung.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bahan</TableHead>
              <TableHead align="right">Kebutuhan</TableHead>
              <TableHead align="right">Stok di lokasi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.needs.map((need) => {
              const isShort = need.required > need.available;
              return (
                <TableRow key={need.ingredientId}>
                  <TableCell>
                    <span className="font-medium text-stone-900">{need.ingredientName}</span>
                    <span className="block text-[12px] text-stone-500">{need.locationName}</span>
                  </TableCell>
                  <TableCell align="right" isNumeric>
                    {formatQuantity(need.required, need.unit)}
                  </TableCell>
                  <TableCell align="right" isNumeric className={isShort ? "text-rose-700" : undefined}>
                    {formatQuantity(need.available, need.unit)}
                    {isShort && <span className="block font-sans text-[12px]">Kurang</span>}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      {error && (
        <p role="alert" className="text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
          {error}
        </p>
      )}
    </Modal>
  );
}
