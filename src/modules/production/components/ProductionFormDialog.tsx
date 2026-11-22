"use client";

import { useState, useTransition } from "react";
import { createProductionOrderAction } from "@/app/admin/production/actions";
import { MENU_PACKAGES } from "@/data/catering-data";
import { wibDateKey, wibDayStart } from "@/lib/wib-date";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Modal } from "@/shared/components/ui/Modal";
import { SelectField } from "@/shared/components/ui/SelectField";
import { formatDate } from "@/shared/utils/formatters";
import { menuVariations, wibWeekday } from "../menu";
import { SHIFT_LABELS } from "../rules";
import type { ProductionShift, SchedulableOrder } from "../types";

const PACKAGES = Object.values(MENU_PACKAGES).sort((a, b) => a.price - b.price);

interface FormState {
  packagePrice: string;
  portions: string;
  productionDate: string;
  destination: string;
  menuVariation: string;
}

/** Schedules a production order, optionally copied from a paid customer order. */
export function ProductionFormDialog({ orders, onClose }: { orders: SchedulableOrder[]; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const today = wibDateKey(new Date());
  const [source, setSource] = useState("");
  const [values, setValues] = useState<FormState>({ packagePrice: "", portions: "", productionDate: today, destination: "", menuVariation: "" });

  function pickOrder(key: string) {
    setSource(key);
    const order = orders.find((o) => `${o.orderId}:${o.packagePrice}` === key);
    if (!order) return;
    setValues({
      packagePrice: String(order.packagePrice),
      portions: String(order.portions),
      productionDate: wibDateKey(new Date(order.eventDate)),
      destination: `${order.customerName}, ${order.customerAddress}`.slice(0, 120),
      menuVariation: "",
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await createProductionOrderAction(form);
      if (result.error) setError(result.error);
      else onClose();
    });
  }

  // Changing the package or the day changes which daily menus exist, so the choice is reset.
  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setValues((current) => ({
      ...current,
      [key]: e.target.value,
      ...(key === "packagePrice" || key === "productionDate" ? { menuVariation: "" } : {}),
    }));
  const dayStart = wibDayStart(values.productionDate);
  const weekday = dayStart ? wibWeekday(dayStart) : null;
  const variations = weekday && values.packagePrice ? menuVariations(Number(values.packagePrice), weekday) : [];
  const chosenDishes = values.menuVariation ? variations[Number(values.menuVariation) - 1] : undefined;
  const sourceOrder = orders.find((o) => `${o.orderId}:${o.packagePrice}` === source);

  return (
    <Modal
      isOpen
      onClose={() => !isPending && onClose()}
      title="Jadwalkan produksi"
      subtitle="Bahan baru diambil dari stok saat dapur mulai memasak."
      maxWidth="2xl"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="production-form" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Jadwalkan"}
          </Button>
        </>
      }
    >
      <form id="production-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <SelectField label="Dari pesanan" value={source} onChange={(e) => pickOrder(e.target.value)} helperText="Opsional: pesanan yang sudah dibayar (DP atau lunas).">
            <option value="">Tanpa pesanan online</option>
            {orders.map((o) => (
              <option key={`${o.orderId}:${o.packagePrice}`} value={`${o.orderId}:${o.packagePrice}`}>
                {o.orderCode} · {o.customerName} · {o.packageName} {o.portions} porsi · {formatDate(o.eventDate)}
              </option>
            ))}
          </SelectField>
          {sourceOrder && <input type="hidden" name="orderId" value={sourceOrder.orderId} />}
        </div>
        <SelectField name="packagePrice" label="Paket" required value={values.packagePrice} onChange={set("packagePrice")}>
          <option value="" disabled>
            Pilih paket
          </option>
          {PACKAGES.map((pkg) => (
            <option key={pkg.price} value={pkg.price}>
              {pkg.name}
            </option>
          ))}
        </SelectField>
        <Input id="wo-portions" name="portions" label="Porsi" required inputMode="numeric" value={values.portions} onChange={set("portions")} placeholder="350" />
        <Input id="wo-date" name="productionDate" type="date" label="Tanggal produksi" required min={today} value={values.productionDate} onChange={set("productionDate")} />
        <div className="sm:col-span-2">
          <SelectField
            name="menuVariation"
            label={weekday ? `Menu harian (${weekday})` : "Menu harian"}
            value={values.menuVariation}
            onChange={set("menuVariation")}
            disabled={variations.length === 0}
            helperText={
              !values.packagePrice
                ? "Pilih paket dan tanggal dulu."
                : variations.length === 0
                  ? "Tidak ada menu harian untuk hari ini; bahan dihitung dari resep paket."
                  : "Bahan dihitung dari resep tiap hidangan. Kosongkan untuk memakai resep paket."
            }
          >
            <option value="">Tanpa menu harian (resep paket)</option>
            {variations.map((dishes, index) => (
              <option key={index} value={index + 1}>
                Variasi {index + 1}: {dishes.slice(0, 3).join(", ")}…
              </option>
            ))}
          </SelectField>
          {chosenDishes && <p className="mt-2 text-[13px] text-stone-600">{chosenDishes.join(" · ")}</p>}
        </div>
        <SelectField name="shift" label="Shift" required defaultValue="">
          <option value="" disabled>
            Pilih shift
          </option>
          {(Object.keys(SHIFT_LABELS) as ProductionShift[]).map((shift) => (
            <option key={shift} value={shift}>
              {SHIFT_LABELS[shift]}
            </option>
          ))}
        </SelectField>
        <Input id="wo-time" name="deliveryTime" type="time" label="Jam kirim (WIB)" required defaultValue="11:30" />
        <Input id="wo-dest" name="destination" label="Tujuan kirim" required maxLength={120} value={values.destination} onChange={set("destination")} placeholder="Pabrik komponen, Kawasan KIIC" />
        <div className="sm:col-span-2">
          <Input id="wo-note" name="note" label="Catatan dapur" maxLength={200} placeholder="Opsional" />
        </div>
        {error && (
          <p role="alert" className="sm:col-span-2 text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
