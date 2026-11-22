"use client";

import { useState, useEffect, useActionState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createOrderAction, type CreateOrderState } from "./actions";
import { MENU_PACKAGES } from "@/data/catering-data";
import { FIELD_HINT, FIELD_INPUT, FIELD_LABEL, REQUIRED_MARK } from "@/components/site/form";
import { earliestEventDateWib } from "@/lib/order-rules";
import { FormStep } from "./FormStep";
import { PackagePicker } from "./PackagePicker";
import { QuantityField } from "./QuantityField";
import { OrderSummary } from "./OrderSummary";
import { PRIMARY_BUTTON, formatRupiah } from "./order-form-ui";

const PACKAGES = Object.values(MENU_PACKAGES);
const DEFAULT_QUANTITY = 50;
const DEFAULT_TIME = "11:30";

function Required() {
  return <span className={REQUIRED_MARK}> *</span>;
}

function formatSchedule(date: string, time: string): string | null {
  if (!date) return null;
  const [year, month, day] = date.split("-").map(Number);
  const label = new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
  return time ? `${label}, ${time} WIB` : label;
}

export default function OrderFormClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPrice = Number(searchParams.get("paket"));

  // The selection only drives the on-screen estimate; the server recomputes every total.
  const [packagePrice, setPackagePrice] = useState<number>(
    MENU_PACKAGES[requestedPrice] ? requestedPrice : PACKAGES[0].price
  );
  const [quantity, setQuantity] = useState<number>(DEFAULT_QUANTITY);
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState(DEFAULT_TIME);
  const [formLoadedAt] = useState<number>(() => Date.now());

  const [state, formAction, isActionPending] = useActionState<CreateOrderState, FormData>(createOrderAction, {});
  const [isTransitionPending, startTransition] = useTransition();
  const isPending = isActionPending || isTransitionPending;

  useEffect(() => {
    if (state.success && state.redirectUrl) {
      router.push(state.redirectUrl);
    }
  }, [state.success, state.redirectUrl, router]);

  const selectedPackage = MENU_PACKAGES[packagePrice];
  const minDate = earliestEventDateWib(quantity);
  const dateTooEarly = eventDate !== "" && eventDate < minDate;
  const subtotal = selectedPackage.price * (quantity || 0);

  return (
    <form
      onSubmit={(e) => {
        // Submit manually so a server error does not reset what the customer already typed.
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => formAction(formData));
      }}
    >
      <input type="hidden" name="formLoadedAt" value={formLoadedAt} />
      <input type="text" name="hp_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
        <div className="space-y-10">
          <FormStep number={1} title="Pilih paket" hint="Harga per porsi, sudah termasuk nasi, lauk, sayur, dan buah.">
            <PackagePicker
              packages={PACKAGES}
              selectedPrice={packagePrice}
              onSelect={setPackagePrice}
              disabled={isPending}
            />
          </FormStep>

          <FormStep number={2} title="Jumlah porsi">
            <QuantityField value={quantity} onChange={setQuantity} disabled={isPending} />
          </FormStep>

          <FormStep number={3} title="Jadwal & alamat" hint="Waktu dalam WIB. Armada melayani shift pagi, siang, dan malam.">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="eventDate" className={FIELD_LABEL}>
                  Tanggal acara
                  <Required />
                </label>
                <input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  min={minDate}
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  disabled={isPending}
                  aria-invalid={dateTooEarly}
                  aria-describedby="eventDate-hint"
                  className={FIELD_INPUT}
                />
                <p id="eventDate-hint" className={dateTooEarly ? "text-sm font-medium text-red-300" : FIELD_HINT}>
                  {dateTooEarly
                    ? `Untuk ${quantity} porsi, tanggal paling cepat ${formatSchedule(minDate, "")}.`
                    : `Paling cepat ${formatSchedule(minDate, "")}.`}
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="eventTime" className={FIELD_LABEL}>
                  Jam tiba di lokasi
                  <Required />
                </label>
                <input
                  id="eventTime"
                  name="eventTime"
                  type="time"
                  required
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  disabled={isPending}
                  className={FIELD_INPUT}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="customerAddress" className={FIELD_LABEL}>
                Alamat pengantaran
                <Required />
              </label>
              <textarea
                id="customerAddress"
                name="customerAddress"
                rows={3}
                required
                minLength={10}
                autoComplete="street-address"
                disabled={isPending}
                className={FIELD_INPUT}
                placeholder="Nama gedung atau pabrik, jalan, blok, dan kawasan (KIIC, Suryacipta, KIM, BIC)"
              />
              <p className={FIELD_HINT}>Area layanan Karawang dan sekitarnya.</p>
            </div>
          </FormStep>

          <FormStep number={4} title="Kontak pemesan" hint="Status pesanan dan tagihan dikirim ke nomor WhatsApp ini.">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="customerName" className={FIELD_LABEL}>
                  Nama pemesan atau perusahaan
                  <Required />
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  required
                  minLength={3}
                  autoComplete="organization"
                  disabled={isPending}
                  className={FIELD_INPUT}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="customerPhone" className={FIELD_LABEL}>
                  Nomor WhatsApp
                  <Required />
                </label>
                <input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  inputMode="tel"
                  required
                  autoComplete="tel"
                  disabled={isPending}
                  className={FIELD_INPUT}
                  placeholder="0812 3456 7890"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="customerEmail" className={FIELD_LABEL}>
                  Email (opsional)
                </label>
                <input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  autoComplete="email"
                  disabled={isPending}
                  className={FIELD_INPUT}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className={FIELD_LABEL}>
                  Catatan untuk dapur (opsional)
                </label>
                <input
                  id="notes"
                  name="notes"
                  type="text"
                  disabled={isPending}
                  className={FIELD_INPUT}
                  placeholder="Contoh: sambal dipisah"
                />
              </div>
            </div>
          </FormStep>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary
            pkg={selectedPackage}
            quantity={quantity}
            scheduleLabel={formatSchedule(eventDate, eventTime)}
            error={state.error}
            isPending={isPending}
          />
        </div>
      </div>

      {/* Mobile order bar: total and the main action stay in reach, as in food-ordering apps. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-soft/95 px-6 py-4 backdrop-blur lg:hidden">
        {state.error && (
          <p role="alert" className="mx-auto mb-3 max-w-xl text-sm font-medium text-red-300">
            {state.error}
          </p>
        )}
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-white/60">
              {quantity || 0} porsi · {selectedPackage.name}
            </p>
            <p className="font-heading text-xl font-extrabold tabular-nums">
              {formatRupiah(subtotal)} <span className="font-text text-sm font-medium text-white/60">+ ongkir</span>
            </p>
          </div>
          <button type="submit" disabled={isPending} className={`${PRIMARY_BUTTON} shrink-0 px-6`}>
            {isPending ? "Mengirim…" : "Pesan"}
          </button>
        </div>
      </div>
    </form>
  );
}
