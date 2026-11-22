"use client";

import { useMemo, useState, useTransition } from "react";
import { updateOrderStatusAction } from "@/app/admin/dashboard/actions";
import { NEXT_OPERATIONAL_STATUS, NEXT_STATUS_ACTION_LABELS, ORDER_STATUS_LABELS, type OrderStatusValue } from "@/modules/dashboard/constants";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { KpiGrid } from "@/shared/components/ui/KpiGrid";
import { ListToolbar } from "@/shared/components/ui/ListToolbar";
import { Modal } from "@/shared/components/ui/Modal";
import { formatRupiah } from "@/shared/utils/formatters";
import type { DeliveryStop } from "../types";

interface DeliveryViewProps {
  stops: DeliveryStop[];
  /** Delivery days, computed on the server so the browser's clock does not matter. */
  days: { key: string; label: string }[];
}

/** Only these moves belong to the delivery crew; cooking is started from Pesanan. */
const DELIVERY_STEPS: OrderStatusValue[] = ["IN_DELIVERY", "COMPLETED"];

const LINK_BUTTON =
  "inline-flex h-8 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors";

function timeOf(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(new Date(iso));
}

export function DeliveryView({ stops, days }: DeliveryViewProps) {
  const [day, setDay] = useState(days[0]?.key ?? "");
  const [confirming, setConfirming] = useState<{ stop: DeliveryStop; next: OrderStatusValue } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const forDay = useMemo(() => stops.filter((s) => s.dateKey === day), [stops, day]);
  const portions = forDay.reduce((sum, s) => sum + s.totalPcs, 0);
  const unpaid = forDay.filter((s) => s.totalAmount !== null && s.paidAmount < s.totalAmount);

  function confirm() {
    if (!confirming) return;
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatusAction(confirming.stop.orderId, confirming.next);
      if (result.error) setError(result.error);
      else setConfirming(null);
    });
  }

  return (
    <div className="space-y-6">
      <ListToolbar
        tabs={days.map((d) => ({ id: d.key, label: d.label, count: stops.filter((s) => s.dateKey === d.key).length }))}
        tab={day}
        onTabChange={setDay}
        query=""
        onQueryChange={() => undefined}
        searchPlaceholder=""
        hideSearch
      />

      <KpiGrid label="Ringkasan pengiriman" columns={3}>
        <KpiCard label="Titik antar" tone="brand" value={forDay.length} subtext="Pesanan dibayar" />
        <KpiCard label="Total porsi" value={portions} subtext="Untuk dimuat ke armada" />
        <KpiCard label="Belum lunas" tone="warning" value={unpaid.length} subtext="Tagih sisa saat serah terima" />
      </KpiGrid>

      {forDay.length === 0 ? (
        <EmptyState title="Tidak ada pengiriman" description="Belum ada pesanan dibayar untuk tanggal ini." />
      ) : (
        <ol className="space-y-4">
          {forDay.map((stop, index) => {
            const status = stop.status as OrderStatusValue;
            const next = NEXT_OPERATIONAL_STATUS[status];
            const canAct = next !== undefined && DELIVERY_STEPS.includes(next);
            const remaining = stop.totalAmount !== null ? stop.totalAmount - stop.paidAmount : 0;
            const meta = ORDER_STATUS_LABELS[status] ?? { label: stop.status, variant: "neutral" as const };
            return (
              <li key={stop.orderId} className="rounded-[12px] border border-slate-200 bg-white">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                  <div className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-100 font-mono text-[13px] font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-[18px] font-bold tabular-nums text-slate-900">{timeOf(stop.eventDate)}</p>
                      <p className="font-medium text-slate-900">{stop.customerName}</p>
                      <p className="font-mono text-[12px] text-slate-500">{stop.orderCode}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={meta.variant} dot>
                      {meta.label}
                    </Badge>
                    {remaining > 0 ? (
                      <Badge variant="pending">Sisa {formatRupiah(remaining)}</Badge>
                    ) : (
                      // FULLY_PAID already reads "Lunas" in the status badge.
                      status !== "FULLY_PAID" && <Badge variant="completed">Lunas</Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 px-5 py-4 text-[14px] md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-[12px] font-medium text-slate-500">Alamat</p>
                    <p className="text-slate-800">{stop.customerAddress}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[12px] font-medium text-slate-500">Muatan</p>
                    <p className="text-slate-800">
                      {stop.totalPcs} porsi · {stop.packages}
                    </p>
                    {stop.notes && <p className="text-[13px] text-amber-900">Catatan: {stop.notes}</p>}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3">
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.customerAddress)}`}
                      target="_blank"
                      rel="noreferrer"
                      className={LINK_BUTTON}
                    >
                      Buka Maps <span aria-hidden="true">↗</span>
                    </a>
                    <a href={`https://wa.me/${stop.customerPhone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className={LINK_BUTTON}>
                      WhatsApp {stop.customerPhone} <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                  {canAct && next && (
                    <Button size="sm" onClick={() => {
                      setError(null);
                      setConfirming({ stop, next });
                    }} disabled={isPending}>
                      {NEXT_STATUS_ACTION_LABELS[next]}
                    </Button>
                  )}
                  {!canAct && status !== "COMPLETED" && (
                    <p className="text-[12px] text-slate-500">Mulai dikirim setelah dapur memulai masak.</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {confirming && (
        <Modal
          isOpen
          onClose={() => !isPending && setConfirming(null)}
          title={NEXT_STATUS_ACTION_LABELS[confirming.next] ?? "Ubah status"}
          subtitle={`${confirming.stop.orderCode} · ${confirming.stop.customerName}`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirming(null)} disabled={isPending}>
                Batal
              </Button>
              <Button onClick={confirm} disabled={isPending}>
                {isPending ? "Memproses..." : "Ya, ubah status"}
              </Button>
            </>
          }
        >
          <p className="text-[14px] text-slate-700">
            Status menjadi <strong>{ORDER_STATUS_LABELS[confirming.next].label}</strong>. Pelanggan menerima pemberitahuan
            WhatsApp.
          </p>
          {error && (
            <p role="alert" className="text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
              {error}
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}
