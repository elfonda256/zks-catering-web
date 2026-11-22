"use client";

import { useState, useTransition } from "react";
import { advanceProductionAction, recordSafetyCheckAction } from "@/app/admin/production/actions";
import { ProductionOrderDialog } from "@/modules/production/components/ProductionOrderDialog";
import { KITCHEN_COLUMNS, PRODUCTION_STATUS } from "@/modules/production/status";
import type { ProductionRow, SafetyCheckRow } from "@/modules/production/types";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Input } from "@/shared/components/ui/Input";
import { Modal } from "@/shared/components/ui/Modal";
import { SelectField } from "@/shared/components/ui/SelectField";
import { formatDateTime } from "@/shared/utils/formatters";

const SAFETY_COLUMNS: DataColumn<SafetyCheckRow>[] = [
  {
    key: "point",
    header: "Titik cek",
    mobile: "title",
    cell: (c) => (
      <>
        <span className="font-medium text-stone-900">{c.point}</span>
        {c.productionCode && <span className="block font-mono text-[12px] text-stone-500">{c.productionCode}</span>}
      </>
    ),
  },
  { key: "time", header: "Waktu", mobile: "subtitle", cell: (c) => `${formatDateTime(c.createdAt)} · ${c.checkedBy}` },
  { key: "reading", header: "Hasil", align: "right", isNumeric: true, cell: (c) => c.reading },
  { key: "limit", header: "Batas", cell: (c) => c.limit },
  {
    key: "status",
    header: "Status",
    mobile: "status",
    cell: (c) => (
      <Badge variant={c.ok ? "completed" : "critical"} dot>
        {c.ok ? "Sesuai" : "Perlu tindakan"}
      </Badge>
    ),
  },
];

interface KitchenBoardViewProps {
  orders: ProductionRow[];
  checks: SafetyCheckRow[];
}

/** Today's production as a kitchen board, plus today's food-safety checks. */
export function KitchenBoardView({ orders, checks }: KitchenBoardViewProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [boardError, setBoardError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();
  const selected = orders.find((o) => o.id === selectedId) ?? null;
  const failed = checks.filter((check) => !check.ok);

  function advance(order: ProductionRow) {
    // Starting to cook takes stock, so it goes through the detail dialog with its needs list.
    if (order.status === "PREPARING") {
      setSelectedId(order.id);
      return;
    }
    setBoardError(null);
    setPendingId(order.id);
    startTransition(async () => {
      const result = await advanceProductionAction(order.id);
      if (result.error) setBoardError(result.error);
      setPendingId(null);
    });
  }

  return (
    <div className="space-y-6">
      {boardError && (
        <p role="alert" className="text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
          {boardError}
        </p>
      )}

      {orders.length === 0 ? (
        <EmptyState title="Tidak ada produksi hari ini" description="Produksi yang dijadwalkan untuk hari ini muncul di sini per tahap." />
      ) : (
        <section aria-label="Antrean dapur hari ini" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {KITCHEN_COLUMNS.map((status) => {
            const column = orders.filter((o) => o.status === status);
            return (
              <div key={status} className="rounded-[12px] border border-stone-200 bg-white">
                <h2 className="flex items-center justify-between border-b border-stone-100 px-4 py-3 text-[13px] font-semibold text-stone-900">
                  {PRODUCTION_STATUS[status].label}
                  <span className="tabular-nums text-stone-400">{column.length}</span>
                </h2>
                <ul className="space-y-3 p-3">
                  {column.length === 0 && <li className="px-1 py-2 text-[13px] text-stone-400">Kosong</li>}
                  {column.map((o) => (
                    <li key={o.id} className="rounded-[8px] border border-stone-200 bg-stone-50 p-3 text-[13px]">
                      <button type="button" onClick={() => setSelectedId(o.id)} className="text-left cursor-pointer">
                        <span className="block font-mono text-[12px] text-stone-500 underline decoration-stone-300 underline-offset-4">{o.code}</span>
                        <span className="mt-1 block font-semibold text-stone-900">{o.packageName}</span>
                      </button>
                      <p className="text-stone-700">{o.portions} porsi</p>
                      <p className="mt-2 text-[12px] text-stone-500">
                        Kirim {o.deliveryTime} · {o.destination}
                      </p>
                      {PRODUCTION_STATUS[status].action && (
                        <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={() => advance(o)} disabled={pendingId === o.id}>
                          {pendingId === o.id ? "Menyimpan..." : PRODUCTION_STATUS[status].action}
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      )}

      <section aria-labelledby="safety-title" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="safety-title" className="text-[15px] font-semibold text-stone-900">
              Cek keamanan pangan hari ini
            </h2>
            {failed.length > 0 && (
              <Badge variant="critical" dot>
                {failed.length} perlu tindakan
              </Badge>
            )}
          </div>
          <Button variant="secondary" onClick={() => setChecking(true)}>
            Catat cek
          </Button>
        </div>
        {checks.length === 0 ? (
          <p className="text-[13px] text-stone-600">Belum ada cek hari ini. Catat suhu chiller, freezer, dan suhu inti masakan.</p>
        ) : (
          <DataList rows={checks} columns={SAFETY_COLUMNS} rowKey={(c) => String(c.id)} />
        )}
      </section>

      {selected && <ProductionOrderDialog order={selected} onClose={() => setSelectedId(null)} />}
      {checking && <SafetyCheckDialog orders={orders} onClose={() => setChecking(false)} />}
    </div>
  );
}

function SafetyCheckDialog({ orders, onClose }: { orders: ProductionRow[]; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await recordSafetyCheckAction(form);
      if (result.error) setError(result.error);
      else onClose();
    });
  }

  return (
    <Modal
      isOpen
      onClose={() => !isPending && onClose()}
      title="Catat cek keamanan pangan"
      maxWidth="2xl"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="safety-form" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </>
      }
    >
      <form id="safety-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="chk-point" name="point" label="Titik cek" required maxLength={80} placeholder="Suhu inti ayam goreng" autoFocus />
        <SelectField name="productionOrderId" label="Untuk produksi" defaultValue="">
          <option value="">Umum (bukan satu produksi)</option>
          {orders.map((o) => (
            <option key={o.id} value={o.id}>
              {o.code} · {o.packageName}
            </option>
          ))}
        </SelectField>
        <Input id="chk-reading" name="reading" label="Hasil ukur" required maxLength={40} placeholder="78 °C" />
        <Input id="chk-limit" name="limit" label="Batas aman" required maxLength={40} placeholder="≥ 75 °C" />
        <SelectField name="result" label="Hasil" required defaultValue="">
          <option value="" disabled>
            Pilih
          </option>
          <option value="ok">Sesuai batas</option>
          <option value="fail">Di luar batas, perlu tindakan</option>
        </SelectField>
        <Input id="chk-by" name="checkedBy" label="Dicek oleh" required maxLength={60} placeholder="Kepala dapur" />
        {error && (
          <p role="alert" className="sm:col-span-2 text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
