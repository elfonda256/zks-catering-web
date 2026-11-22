"use client";

import { FOOD_SAFETY_CHECKS, WORK_ORDERS, type FoodSafetyCheck, type WorkOrderStatus } from "@/modules/sample-data";
import { getRecipe } from "@/modules/production/recipes";
import { WORK_ORDER_STATUS } from "@/modules/production/status";
import { Badge } from "@/shared/components/ui/Badge";
import { SampleDataNotice } from "@/shared/components/ui/SampleDataNotice";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";

const COLUMNS: WorkOrderStatus[] = ["dijadwalkan", "persiapan", "dimasak", "packing", "siap-kirim"];

const SAFETY_COLUMNS: DataColumn<FoodSafetyCheck>[] = [
  { key: "point", header: "Titik cek", mobile: "title", cell: (c) => <span className="font-medium text-stone-900">{c.point}</span> },
  { key: "time", header: "Jam", mobile: "subtitle", cell: (c) => `${c.time} · ${c.checkedBy}` },
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

/** Today's production as a kitchen board, plus today's food-safety checks. */
export function KitchenBoardView() {
  const today = WORK_ORDERS.filter((wo) => wo.day === 0);
  const failed = FOOD_SAFETY_CHECKS.filter((check) => !check.ok);

  return (
    <div className="space-y-6">
      <SampleDataNotice />

      <section aria-label="Antrean dapur hari ini" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {COLUMNS.map((status) => {
          const orders = today.filter((wo) => wo.status === status);
          return (
            <div key={status} className="rounded-[12px] border border-stone-200 bg-white">
              <h2 className="flex items-center justify-between border-b border-stone-100 px-4 py-3 text-[13px] font-semibold text-stone-900">
                {WORK_ORDER_STATUS[status].label}
                <span className="tabular-nums text-stone-400">{orders.length}</span>
              </h2>
              <ul className="space-y-3 p-3">
                {orders.length === 0 && <li className="px-1 py-2 text-[13px] text-stone-400">Kosong</li>}
                {orders.map((wo) => (
                  <li key={wo.id} className="rounded-[8px] border border-stone-200 bg-stone-50 p-3 text-[13px]">
                    <p className="font-mono text-[12px] text-stone-500">{wo.id}</p>
                    <p className="mt-1 font-semibold text-stone-900">{getRecipe(wo.recipeId).name}</p>
                    <p className="text-stone-700">{wo.portions} porsi</p>
                    <p className="mt-2 text-[12px] text-stone-500">
                      Kirim {wo.deliveryTime} · {wo.customer}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section aria-labelledby="safety-title" className="space-y-3">
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
        <DataList rows={FOOD_SAFETY_CHECKS} columns={SAFETY_COLUMNS} rowKey={(c) => c.id} />
      </section>
    </div>
  );
}
