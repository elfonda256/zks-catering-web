"use client";

import { useState, useEffect, useActionState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createOrderAction, type CreateOrderState } from "./actions";
import { MENU_PACKAGES } from "@/data/catering-data";
import { ArrowUpRight } from "@/components/icons";
import { HEADING } from "@/components/site/ui";
import { FIELD_HINT, FIELD_INPUT, FIELD_LABEL, REQUIRED_MARK } from "@/components/site/form";

const PACKAGE_PRICES = Object.values(MENU_PACKAGES).map((pkg) => pkg.price);
const DEFAULT_PRICE = 17000;

const formatRupiah = (value: number) => `Rp${value.toLocaleString("id-ID")}`;

function FormSection({ step, title, hint, children }: { step: string; title: string; hint: string; children: ReactNode }) {
  return (
    <section className="space-y-6 border-t border-white/15 pt-10">
      <div>
        <span className="font-heading text-sm font-bold uppercase text-[#E07A35]">{step}</span>
        <h2 className={`${HEADING} mt-1 text-[1.75rem] sm:text-[2rem]`}>{title}</h2>
        <p className={`${FIELD_HINT} mt-2`}>{hint}</p>
      </div>
      {children}
    </section>
  );
}

function Required() {
  return <span className={REQUIRED_MARK}> *</span>;
}

export default function OrderFormClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPrice = Number(searchParams.get("paket"));

  // The selected price only drives the on-screen estimate; the server recomputes every total.
  const [packagePrice, setPackagePrice] = useState<number>(
    PACKAGE_PRICES.includes(requestedPrice) ? requestedPrice : DEFAULT_PRICE
  );
  const [quantity, setQuantity] = useState<number>(50);
  const [formLoadedAt] = useState<number>(() => Date.now());

  const initialState: CreateOrderState = {};
  const [state, formAction, isPending] = useActionState(createOrderAction, initialState);

  useEffect(() => {
    if (state.success && state.redirectUrl) {
      router.push(state.redirectUrl);
    }
  }, [state.success, state.redirectUrl, router]);

  const subtotalEstimate = packagePrice * (quantity || 0);
  const isLargeOrder = quantity >= 500;

  // Tanggal minimal untuk input datepicker (besok)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  return (
    <form action={formAction} className="space-y-10">
      {/* Hidden Security Fields */}
      <input type="hidden" name="formLoadedAt" value={formLoadedAt} />
      <input type="text" name="hp_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {state.error && (
        <div role="alert" className="rounded-[10px] border-l-4 border-red-500 bg-red-500/10 p-4 text-[15px] text-red-100">
          <span className="font-heading font-bold uppercase">Perhatian: </span>
          {state.error}
        </div>
      )}

      <FormSection
        step="01 / Paket & kuantitas"
        title="Pilih paket dan jumlah porsi"
        hint="Pilih paket sesuai anggaran dan tentukan total porsi (minimal 20 porsi)."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Object.values(MENU_PACKAGES).map((pkg) => {
            const isSelected = packagePrice === pkg.price;
            return (
              <label
                key={pkg.id}
                className={`block cursor-pointer rounded-[10px] border-2 p-6 transition-colors ${
                  isSelected ? "border-[#C85A17] bg-[#C85A17]/15" : "border-white/15 bg-[#232A2E] hover:border-white/40"
                }`}
              >
                <input
                  type="radio"
                  name="packagePrice"
                  value={pkg.price}
                  checked={isSelected}
                  onChange={() => setPackagePrice(pkg.price)}
                  className="sr-only"
                />
                <span className="block font-heading text-lg font-extrabold uppercase leading-tight">{pkg.name}</span>
                <span className={`${HEADING} mt-3 block text-3xl text-[#E07A35]`}>
                  {formatRupiah(pkg.price)}
                  <span className="ml-1 font-text text-sm font-medium normal-case text-white/60">/ porsi</span>
                </span>
                <span className="mt-3 block text-sm leading-relaxed text-white/70 line-clamp-3">{pkg.itemsSummary}</span>
              </label>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="quantity" className={FIELD_LABEL}>
              Jumlah porsi (minimal 20)
              <Required />
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min={20}
              step={1}
              required
              value={quantity || ""}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={isPending}
              className={FIELD_INPUT}
              placeholder="50"
            />
            <p className={FIELD_HINT}>
              {isLargeOrder ? (
                <span className="font-medium text-[#E07A35]">
                  Pesanan skala besar (≥ 500 porsi) perlu dipesan minimal H-3 sebelum acara.
                </span>
              ) : (
                <span>Pesanan reguler (&lt; 500 porsi) minimal H-1 sebelum acara.</span>
              )}
            </p>
          </div>

          <div className="rounded-[10px] bg-[#232A2E] p-6">
            <span className="block font-heading text-sm font-bold uppercase text-white/70">Estimasi subtotal makanan</span>
            <span className={`${HEADING} mt-2 block text-4xl`}>{formatRupiah(subtotalEstimate)}</span>
            <span className={`${FIELD_HINT} mt-2 block`}>
              Ongkos kirim ditentukan admin setelah verifikasi rute di Karawang.
            </span>
          </div>
        </div>
      </FormSection>

      <FormSection
        step="02 / Jadwal pengantaran"
        title="Tanggal dan jam tiba"
        hint="Waktu pengantaran dalam WIB, disesuaikan dengan pergantian shift karyawan."
      >
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="eventDate" className={FIELD_LABEL}>
              Tanggal acara
              <Required />
            </label>
            <input id="eventDate" name="eventDate" type="date" min={minDateStr} required disabled={isPending} className={FIELD_INPUT} />
          </div>

          <div className="space-y-2">
            <label htmlFor="eventTime" className={FIELD_LABEL}>
              Jam tiba di lokasi (WIB)
              <Required />
            </label>
            <input
              id="eventTime"
              name="eventTime"
              type="time"
              defaultValue="11:30"
              required
              disabled={isPending}
              className={FIELD_INPUT}
            />
            <p className={FIELD_HINT}>Armada melayani shift pagi, siang, dan lembur malam.</p>
          </div>
        </div>
      </FormSection>

      <FormSection
        step="03 / Data PIC & lokasi"
        title="Data pemesan dan alamat"
        hint="Kontak PIC untuk konfirmasi status pesanan dan rute armada."
      >
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="customerName" className={FIELD_LABEL}>
              Nama pemesan / perusahaan
              <Required />
            </label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              required
              disabled={isPending}
              className={FIELD_INPUT}
              placeholder="PT. Nama Perusahaan / Nama Pemesan"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="customerPhone" className={FIELD_LABEL}>
              Nomor WhatsApp PIC
              <Required />
            </label>
            <input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              required
              disabled={isPending}
              className={FIELD_INPUT}
              placeholder="0812xxxxxxxx"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="customerEmail" className={FIELD_LABEL}>
              Email kantor (opsional)
            </label>
            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              disabled={isPending}
              className={FIELD_INPUT}
              placeholder="procurement@company.co.id"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className={FIELD_LABEL}>
              Catatan menu / permintaan khusus
            </label>
            <input
              id="notes"
              name="notes"
              type="text"
              disabled={isPending}
              className={FIELD_INPUT}
              placeholder="Contoh: pisahkan sambal, variasi ayam kecap"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="customerAddress" className={FIELD_LABEL}>
            Alamat lengkap pengantaran di Karawang
            <Required />
          </label>
          <textarea
            id="customerAddress"
            name="customerAddress"
            rows={3}
            required
            disabled={isPending}
            className={FIELD_INPUT}
            placeholder="Gedung/pabrik, nama jalan, blok, dan kawasan industri (KIIC, Suryacipta, KIM, BIC, dll.)."
          />
        </div>
      </FormSection>

      <section className="space-y-8 border-t border-white/15 pt-10">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="acceptTerms"
            required
            disabled={isPending}
            className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[#C85A17]"
          />
          <span className="text-[15px] leading-relaxed text-white/80">
            Saya mengonfirmasi spesifikasi pesanan di atas sudah sesuai kebutuhan perusahaan kami dan menyetujui ketentuan
            pemesanan PT. Zahdan Kamal Sentosa. Status awal pesanan adalah <strong className="text-white">Menunggu
            Konfirmasi Admin</strong>, dan ongkos kirim ditetapkan setelah verifikasi rute pengantaran.
          </span>
        </label>

        <div className="flex flex-col justify-between gap-6 rounded-[10px] bg-[#232A2E] p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <span className="block font-heading text-sm font-bold uppercase text-white/70">Estimasi nilai pesanan</span>
            <span className={`${HEADING} mt-1 block text-4xl`}>{formatRupiah(subtotalEstimate)}</span>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#C85A17] px-8 font-heading text-base font-bold uppercase text-white transition-colors hover:bg-[#A4460E] active:scale-[0.98] disabled:opacity-50"
          >
            <span>{isPending ? "Memproses data…" : "Kirim pengajuan pesanan"}</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </form>
  );
}
