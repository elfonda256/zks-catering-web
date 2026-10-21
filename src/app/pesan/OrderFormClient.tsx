"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { createOrderAction, type CreateOrderState } from "./actions";
import { MENU_PACKAGES } from "@/data/catering-data";
import { ArrowUpRight } from "@/components/icons";

export default function OrderFormClient({
  initialPrice = 17000,
}: {
  initialPrice?: number;
}) {
  const router = useRouter();

  const [packagePrice, setPackagePrice] = useState<number>(initialPrice);
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
    <form action={formAction} className="space-y-14">
      {/* Hidden Security Fields */}
      <input type="hidden" name="formLoadedAt" value={formLoadedAt} />
      <input
        type="text"
        name="hp_website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {/* Error Alert */}
      {state.error && (
        <div
          role="alert"
          className="border-l-2 border-red-600 bg-red-50/50 p-4 text-xs text-red-900 flex items-start gap-3"
        >
          <span className="font-mono font-bold uppercase tracking-wider">Perhatian:</span>
          <span>{state.error}</span>
        </div>
      )}

      {/* Bagian 01: Pilihan Paket & Volume (Clean Editorial Layout, No Nested Card Box) */}
      <div className="space-y-6 pt-2">
        <div className="space-y-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
            01 / PILIHAN PAKET &amp; KUANTITAS
          </span>
          <h2 className="font-display font-bold text-2xl text-[#141413] tracking-tight">
            Pilihan Paket Menu &amp; Volume Pemesanan
          </h2>
          <p className="text-xs text-[#626058] leading-relaxed">
            Pilih paket menu sesuai preferensi anggaran dan tentukan total porsi (minimal 20 porsi).
          </p>
        </div>

        {/* Tier Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.values(MENU_PACKAGES).map((pkg) => {
            const isSelected = packagePrice === pkg.price;
            return (
              <label
                key={pkg.id}
                className={`p-6 border block cursor-pointer transition-all ${
                  isSelected
                    ? "border-[#141413] bg-[#141413] text-[#FAF9F5]"
                    : "border-[#141413]/15 bg-transparent text-[#141413] hover:border-[#141413]/40"
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
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">
                    TIER {pkg.price === 17000 ? "01" : pkg.price === 20000 ? "02" : "03"}
                  </span>
                  <span className="font-display font-bold text-sm tracking-tight">{pkg.name}</span>
                </div>
                <p className="font-display font-extrabold text-2xl mt-2 tracking-tight">
                  Rp{pkg.price.toLocaleString("id-ID")}
                  <span className={`text-xs font-normal ml-1 ${isSelected ? "text-[#A8A69E]" : "text-[#8E8B81]"}`}>
                    / porsi
                  </span>
                </p>
                <p className={`text-xs mt-2 leading-relaxed line-clamp-2 ${isSelected ? "text-[#A8A69E]" : "text-[#626058]"}`}>
                  {pkg.itemsSummary}
                </p>
              </label>
            );
          })}
        </div>

        {/* Input Kuantitas Porsi & Estimasi Nilai */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-[#141413]/10">
          <div className="space-y-2">
            <label
              htmlFor="quantity"
              className="block font-mono text-[11px] uppercase tracking-wider text-[#141413] font-semibold"
            >
              Jumlah Porsi (Minimal 20) <span className="text-[#C85A17]">*</span>
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
              className="w-full border border-[#141413]/15 bg-transparent px-4 py-3 text-[#141413] text-sm focus:border-[#141413] focus:outline-none disabled:opacity-50"
              placeholder="50"
            />
            <p className="text-xs text-[#626058]">
              {isLargeOrder ? (
                <span className="text-[#C85A17] font-medium">
                  Pesanan skala besar (≥ 500 pcs) memerlukan batas pemesanan minimal H-3 sebelum acara.
                </span>
              ) : (
                <span>Batas pemesanan reguler (&lt; 500 pcs) adalah minimal H-1 sebelum acara.</span>
              )}
            </p>
          </div>

          <div className="space-y-1.5 border-l border-[#141413]/10 pl-6 flex flex-col justify-center">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#8E8B81]">
              Estimasi Subtotal Makanan:
            </span>
            <span className="font-display font-extrabold text-3xl text-[#141413] tracking-tight">
              Rp{subtotalEstimate.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-[#8E8B81]">
              Biaya pengantaran akan ditentukan admin setelah verifikasi rute di Karawang.
            </span>
          </div>
        </div>
      </div>

      {/* Bagian 02: Jadwal Acara & Pengiriman */}
      <div className="space-y-6 pt-10 border-t border-[#141413]/10">
        <div className="space-y-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
            02 / JADWAL PENGANTARAN
          </span>
          <h2 className="font-display font-bold text-2xl text-[#141413] tracking-tight">
            Jadwal Acara &amp; Waktu Tiba di Pabrik
          </h2>
          <p className="text-xs text-[#626058] leading-relaxed">
            Waktu pengantaran disesuaikan dengan zona waktu WIB untuk ketepatan pergantian shift kerja karyawan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label
              htmlFor="eventDate"
              className="block font-mono text-[11px] uppercase tracking-wider text-[#141413] font-semibold"
            >
              Tanggal Acara <span className="text-[#C85A17]">*</span>
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="date"
              min={minDateStr}
              required
              disabled={isPending}
              className="w-full border border-[#141413]/15 bg-transparent px-4 py-3 text-[#141413] text-sm focus:border-[#141413] focus:outline-none disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="eventTime"
              className="block font-mono text-[11px] uppercase tracking-wider text-[#141413] font-semibold"
            >
              Jam Tiba di Lokasi (WIB) <span className="text-[#C85A17]">*</span>
            </label>
            <input
              id="eventTime"
              name="eventTime"
              type="time"
              defaultValue="11:30"
              required
              disabled={isPending}
              className="w-full border border-[#141413]/15 bg-transparent px-4 py-3 text-[#141413] text-sm focus:border-[#141413] focus:outline-none disabled:opacity-50"
            />
            <p className="text-xs text-[#8E8B81]">
              Armada siap melayani kebutuhan makan shift pagi, siang, dan lembur malam.
            </p>
          </div>
        </div>
      </div>

      {/* Bagian 03: Kontak Pemesan & Alamat */}
      <div className="space-y-6 pt-10 border-t border-[#141413]/10">
        <div className="space-y-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
            03 / DATA PIC &amp; LOKASI PABRIK
          </span>
          <h2 className="font-display font-bold text-2xl text-[#141413] tracking-tight">
            Data Pemesan &amp; Alamat Pengantaran
          </h2>
          <p className="text-xs text-[#626058] leading-relaxed">
            Informasi PIC operasional untuk konfirmasi status pesanan dan rute armada.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label
              htmlFor="customerName"
              className="block font-mono text-[11px] uppercase tracking-wider text-[#141413] font-semibold"
            >
              Nama Pemesan / Entitas Perusahaan <span className="text-[#C85A17]">*</span>
            </label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              required
              disabled={isPending}
              className="w-full border border-[#141413]/15 bg-transparent px-4 py-3 text-[#141413] text-sm focus:border-[#141413] focus:outline-none disabled:opacity-50"
              placeholder="PT. Nama Perusahaan / Nama Pemesan"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="customerPhone"
              className="block font-mono text-[11px] uppercase tracking-wider text-[#141413] font-semibold"
            >
              Nomor WhatsApp PIC <span className="text-[#C85A17]">*</span>
            </label>
            <input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              required
              disabled={isPending}
              className="w-full border border-[#141413]/15 bg-transparent px-4 py-3 text-[#141413] text-sm focus:border-[#141413] focus:outline-none disabled:opacity-50"
              placeholder="0812xxxxxxxx"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label
              htmlFor="customerEmail"
              className="block font-mono text-[11px] uppercase tracking-wider text-[#141413] font-semibold"
            >
              Email Kantor (Opsional)
            </label>
            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              disabled={isPending}
              className="w-full border border-[#141413]/15 bg-transparent px-4 py-3 text-[#141413] text-sm focus:border-[#141413] focus:outline-none disabled:opacity-50"
              placeholder="procurement@company.co.id"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="notes"
              className="block font-mono text-[11px] uppercase tracking-wider text-[#141413] font-semibold"
            >
              Catatan Menu / Permintaan Khusus
            </label>
            <input
              id="notes"
              name="notes"
              type="text"
              disabled={isPending}
              className="w-full border border-[#141413]/15 bg-transparent px-4 py-3 text-[#141413] text-sm focus:border-[#141413] focus:outline-none disabled:opacity-50"
              placeholder="Contoh: Pisahkan sambal, variasi ayam kecap"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="customerAddress"
            className="block font-mono text-[11px] uppercase tracking-wider text-[#141413] font-semibold"
          >
            Alamat Lengkap Pengantaran di Karawang <span className="text-[#C85A17]">*</span>
          </label>
          <textarea
            id="customerAddress"
            name="customerAddress"
            rows={3}
            required
            disabled={isPending}
            className="w-full border border-[#141413]/15 bg-transparent px-4 py-3 text-[#141413] text-sm focus:border-[#141413] focus:outline-none disabled:opacity-50"
            placeholder="Sebutkan gedung/pabrik, nama jalan, blok, dan nama kawasan industri (KIIC, Suryacipta, KIM, BIC, dll.)."
          />
        </div>
      </div>

      {/* Bagian 04: Persetujuan Syarat & Submit (Minimalist Confirmation Ledger) */}
      <div className="space-y-8 pt-10 border-t border-[#141413]/10">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="acceptTerms"
            required
            disabled={isPending}
            className="mt-1 w-4 h-4 border-[#141413]/30 text-[#141413] focus:ring-0 cursor-pointer"
          />
          <span className="text-xs text-[#626058] leading-relaxed">
            Saya mengonfirmasi bahwa spesifikasi pesanan di atas telah sesuai dengan kebutuhan perusahaan kami, dan menyetujui ketentuan pemesanan katering PT. Zahdan Kamal Sentosa. Saya memahami bahwa status pesanan awal adalah <strong>Menunggu Konfirmasi Admin</strong> dan besaran ongkos kirim akan ditetapkan setelah verifikasi rute pengantaran.
          </span>
        </label>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-[#141413]/10">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#8E8B81] block">
              Estimasi Nilai Pesanan:
            </span>
            <span className="font-display font-extrabold text-3xl text-[#141413] tracking-tight">
              Rp{subtotalEstimate.toLocaleString("id-ID")}
            </span>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#141413] text-[#FAF9F5] hover:bg-[#141413]/90 text-xs font-semibold tracking-tight transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
          >
            <span>{isPending ? "Memproses Data..." : "Kirim Pengajuan Pesanan"}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>
      </div>
    </form>
  );
}
