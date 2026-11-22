"use client";

import { useState } from "react";
import {
  WORK_ORDERS,
  WORK_ORDER_STATUSES_BEFORE_COOKING,
  formatQty,
  getIngredient,
  relativeDay,
  type WorkOrder,
} from "@/modules/sample-data";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DetailList } from "@/shared/components/ui/DetailList";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { Modal } from "@/shared/components/ui/Modal";
import { SampleDataNotice } from "@/shared/components/ui/SampleDataNotice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/Table";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { KpiGrid } from "@/shared/components/ui/KpiGrid";
import { getRecipe, materialNeeds } from "../recipes";
import { WORK_ORDER_STATUS } from "../status";

const DAYS = [...new Set(WORK_ORDERS.map((wo) => wo.day))].sort((a, b) => a - b);

export function ProductionScheduleView() {
  const [selected, setSelected] = useState<WorkOrder | null>(null);

  const columns: DataColumn<WorkOrder>[] = [
    {
      key: "id",
      header: "Nomor",
      mobile: "title",
      cell: (wo) => (
        <button
          type="button"
          onClick={() => setSelected(wo)}
          className="whitespace-nowrap font-mono font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 cursor-pointer"
        >
          {wo.id}
        </button>
      ),
    },
    { key: "recipe", header: "Paket", mobile: "subtitle", cell: (wo) => getRecipe(wo.recipeId).name },
    { key: "portions", header: "Porsi", align: "right", isNumeric: true, cell: (wo) => wo.portions },
    { key: "shift", header: "Shift", cell: (wo) => wo.shift },
    { key: "customer", header: "Tujuan", wide: true, cell: (wo) => wo.customer },
    { key: "delivery", header: "Kirim", cell: (wo) => wo.deliveryTime },
    {
      key: "status",
      header: "Status",
      mobile: "status",
      cell: (wo) => (
        <Badge variant={WORK_ORDER_STATUS[wo.status].variant} dot>
          {WORK_ORDER_STATUS[wo.status].label}
        </Badge>
      ),
    },
  ];
  const today = WORK_ORDERS.filter((wo) => wo.day === 0);
  // Orders already cooking have taken their ingredients, so only upcoming ones count.
  const upcoming = WORK_ORDERS.filter((wo) => wo.day <= 1 && WORK_ORDER_STATUSES_BEFORE_COOKING.includes(wo.status));
  const shortages = materialNeeds(upcoming).filter((need) => need.short);

  return (
    <div className="space-y-6">
      <SampleDataNotice />

      <KpiGrid label="Ringkasan produksi" columns={3}>
        <KpiCard label="Porsi hari ini" value={today.reduce((s, wo) => s + wo.portions, 0)} subtext={`${today.length} perintah produksi`} />
        <KpiCard label="Porsi besok" value={WORK_ORDERS.filter((wo) => wo.day === 1).reduce((s, wo) => s + wo.portions, 0)} subtext="Sudah dijadwalkan" />
        <KpiCard
          label="Bahan kurang"
          value={shortages.length}
          subtext={shortages.map((n) => getIngredient(n.code).name).join(", ") || "Stok cukup untuk 2 hari"}
        />
      </KpiGrid>

      {DAYS.map((day) => (
        <section key={day} aria-labelledby={`day-${day}`} className="space-y-3">
          <h2 id={`day-${day}`} className="text-[15px] font-semibold text-slate-900">
            {relativeDay(day)}
          </h2>
          <DataList rows={WORK_ORDERS.filter((wo) => wo.day === day)} columns={columns} rowKey={(wo) => wo.id} />
        </section>
      ))}

      {selected && <WorkOrderDialog order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function WorkOrderDialog({ order, onClose }: { order: WorkOrder; onClose: () => void }) {
  const recipe = getRecipe(order.recipeId);
  const needs = materialNeeds([order]);
  const taken = !WORK_ORDER_STATUSES_BEFORE_COOKING.includes(order.status);

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Produksi ${order.id}`}
      subtitle={`${recipe.name} · ${order.portions} porsi`}
      maxWidth="2xl"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Tutup
        </Button>
      }
    >
      <DetailList
        items={[
          { label: "Jadwal", value: `${relativeDay(order.day)}, shift ${order.shift.toLowerCase()}` },
          { label: "Kirim", value: `${order.deliveryTime} ke ${order.customer}` },
          { label: "Menu", value: recipe.menu },
          { label: "Status", value: WORK_ORDER_STATUS[order.status].label },
        ]}
      />
      {taken && <p className="text-[13px] text-slate-600">Bahan untuk produksi ini sudah diambil dari gudang.</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bahan</TableHead>
            <TableHead align="right">Kebutuhan</TableHead>
            {!taken && <TableHead align="right">Stok</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {needs.map((need) => {
            const item = getIngredient(need.code);
            return (
              <TableRow key={need.code}>
                <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
                <TableCell align="right" isNumeric>
                  {formatQty(need.required, item.unit)}
                </TableCell>
                {!taken && (
                  <TableCell align="right" isNumeric className={need.short ? "text-rose-700" : undefined}>
                    {formatQty(need.stock, item.unit)}
                    {need.short && <span className="block font-sans text-[12px]">Kurang</span>}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Modal>
  );
}
