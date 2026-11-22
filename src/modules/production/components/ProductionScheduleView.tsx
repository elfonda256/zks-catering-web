"use client";

import { useState } from "react";
import { wibDateKey } from "@/lib/wib-date";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { KpiGrid } from "@/shared/components/ui/KpiGrid";
import { formatDate } from "@/shared/utils/formatters";
import { SHIFT_LABELS, isBeforeCooking } from "../rules";
import { PRODUCTION_STATUS } from "../status";
import type { ProductionRow, SchedulableOrder } from "../types";
import { ProductionFormDialog } from "./ProductionFormDialog";
import { ProductionOrderDialog } from "./ProductionOrderDialog";

interface ProductionScheduleViewProps {
  orders: ProductionRow[];
  schedulable: SchedulableOrder[];
}

const portionsOf = (rows: ProductionRow[]) => rows.reduce((sum, o) => sum + o.portions, 0);

export function ProductionScheduleView({ orders, schedulable }: ProductionScheduleViewProps) {
  const [creating, setCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = orders.find((o) => o.id === selectedId) ?? null;

  const now = new Date();
  const todayKey = wibDateKey(now);
  const tomorrowKey = wibDateKey(new Date(now.getTime() + 24 * 60 * 60 * 1000));
  const active = orders.filter((o) => o.status !== "CANCELLED");
  const dayOf = (o: ProductionRow) => wibDateKey(new Date(o.productionDate));

  // Only orders that have not cooked yet still need stock; sum their needs per ingredient.
  const pending = active.filter((o) => isBeforeCooking(o.status) && dayOf(o) <= tomorrowKey);
  const shortNames = new Set<string>();
  const totals = new Map<number, { name: string; required: number; available: number }>();
  for (const order of pending) {
    for (const need of order.needs) {
      const entry = totals.get(need.ingredientId) ?? { name: need.ingredientName, required: 0, available: need.available };
      entry.required += need.required;
      totals.set(need.ingredientId, entry);
    }
  }
  for (const entry of totals.values()) if (entry.required > entry.available + 1e-9) shortNames.add(entry.name);

  const days = [...new Set(orders.map(dayOf))].sort();

  const columns: DataColumn<ProductionRow>[] = [
    {
      key: "code",
      header: "Nomor",
      mobile: "title",
      cell: (o) => (
        <button
          type="button"
          onClick={() => setSelectedId(o.id)}
          className="whitespace-nowrap font-mono font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-900 cursor-pointer"
        >
          {o.code}
        </button>
      ),
    },
    { key: "package", header: "Paket", mobile: "subtitle", cell: (o) => o.packageName },
    { key: "portions", header: "Porsi", align: "right", isNumeric: true, cell: (o) => o.portions },
    { key: "shift", header: "Shift", cell: (o) => SHIFT_LABELS[o.shift] },
    { key: "destination", header: "Tujuan", wide: true, cell: (o) => o.destination },
    { key: "delivery", header: "Kirim", cell: (o) => o.deliveryTime },
    {
      key: "status",
      header: "Status",
      mobile: "status",
      cell: (o) => (
        <Badge variant={PRODUCTION_STATUS[o.status].variant} dot>
          {PRODUCTION_STATUS[o.status].label}
        </Badge>
      ),
    },
  ];

  const todayOrders = active.filter((o) => dayOf(o) === todayKey);

  return (
    <div className="space-y-6">
      <KpiGrid label="Ringkasan produksi" columns={3}>
        <KpiCard label="Porsi hari ini" tone="brand" value={portionsOf(todayOrders)} subtext={`${todayOrders.length} perintah produksi`} />
        <KpiCard label="Porsi besok" value={portionsOf(active.filter((o) => dayOf(o) === tomorrowKey))} subtext="Sudah dijadwalkan" />
        <KpiCard label="Bahan kurang" tone="danger" value={shortNames.size} subtext={[...shortNames].join(", ") || "Stok cukup untuk hari ini dan besok"} />
      </KpiGrid>

      <div className="flex justify-end">
        <Button onClick={() => setCreating(true)}>Jadwalkan produksi</Button>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="Belum ada jadwal produksi"
          description="Jadwalkan produksi dari pesanan yang sudah dibayar, atau langsung untuk pesanan rutin. Isi resep paket dulu agar kebutuhan bahan terhitung."
        />
      ) : (
        days.map((day) => (
          <section key={day} aria-labelledby={`day-${day}`} className="space-y-3">
            <h2 id={`day-${day}`} className="text-[15px] font-semibold text-stone-900">
              {day === todayKey ? "Hari ini" : day === tomorrowKey ? "Besok" : formatDate(`${day}T00:00:00+07:00`)}
            </h2>
            <DataList rows={orders.filter((o) => dayOf(o) === day)} columns={columns} rowKey={(o) => String(o.id)} />
          </section>
        ))
      )}

      {creating && <ProductionFormDialog orders={schedulable} onClose={() => setCreating(false)} />}
      {selected && <ProductionOrderDialog order={selected} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
