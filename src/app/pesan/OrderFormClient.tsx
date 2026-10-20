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
    <form action={formAction} className="space-y-10">
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
          className="rounded-xl bg-red-50 border border-red-200 p-5 text-xs text-red-800 flex items-start gap-3"
        >
          <span className="font-bold">Perhatian:</span>
          <span>{state.error}</span>
        </div>
      )}

      {/* 1. Pilih Paket & Jumlah Porsi */}
      <div className="p-8 rounded-2xl bg-[#F3F1E9] border border-[#141413]/[0.08] space-y-6">
        <div>
          <span className="text-xs font-semibold text-[#8E8B81] uppercase tracking-[0.1em] block">
            Bagian 01
          </span>
          <h2 className="font-display font-bold text-xl text-[#141413] mt-1">
            Pilihan Paket Menu & Volume Pemesanan
          </h2>
          <p className="text-xs text-[#626058] mt-1">
            Pilih paket menu sesuai preferensi anggaran dan tentukan total porsi (minimal 20 porsi).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.values(MENU_PACKAGES).map((pkg) => {
            const isSelected = packagePrice === pkg.price;
            return (
              <label
                key={pkg.id}
                className={`p-5 rounded-xl border block cursor-pointer transition-all ${
                  isSelected
                    ? "border-[#141413] bg-[#141413] text-[#FAF9F5] shadow-sm"
                    : "border-[#141413]/[0.08] bg-[#FAF9F5] text-[#141413] hover:border-[#141413]/20"
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
                  <span className="font-display font-bold text-sm tracking-tight">{pkg.name}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#D96B27]" />
                  )}
                </div>
                <p className="font-display font-extrabold text-xl mt-1.5 tracking-tight">
                  Rp{pkg.price.toLocaleString("id-ID")}
                  <span className={`text-xs font-normal ml-1 ${isSelected ? "text-[#A8A69E]" : "text-[#8E8B81]"}`}>
                    / porsi
                  </span>
                </p>
                <p className={`text-xs mt-2 line-clamp-2 ${isSelected ? "text-[#A8A69E]" : "text-[#626058]"}`}>
                  {pkg.itemsSummary}
                </p>
              </label>
            );
          })}
        </div>

        {/* Input Kuantitas Porsi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#141413]/[0.08]">
          <div className="space-y-2">
            <label
              htmlFor="quantity"
              className="block text-xs font-semibold text-[#141413] uppercase tracking-wider"
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
              className="w-full rounded-lg border border-[#141413]/15 bg-[#FAF9F5] px-4 py-3 text-[#141413] text-sm focus:border-[#141413] focus:outline-none focus:ring-1 focus:ring-[#141413] disabled:opacity-50"
              placeholder="50"
            />
            <p className="text-[11px] text-[#626058]">
              {isLargeOrder ? (
                <span className="text-[#C85A17] font-medium">
                  Pesanan skala besar (≥ 500 pcs) memerlukan batas pemesanan minimal H-3 sebelum acara.
                </span>
              ) : (
                <span>Batas pemesanan reguler (&lt; 500 pcs) adalah minimal H-1 sebelum acara.</span>
              )}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FAF9F5] border border-[#141413]/[0.08] flex flex-col justify-center space-y-1">
            <span className="text-xs text-[#8E8B81]">Estimasi Subtotal Makanan:</span>
            <span className="font-display font-extrabold text-2xl text-[#141413]">
              Rp{subtotalEstimate.toLocaleString("id-ID")}
            </span>
            <span className="text-[11px] text-[#8E8B81]">
              Biaya pengantaran akan ditentukan admin setelah verifikasi alamat di Karawang.
            </span>
          </div>
        </div>
      </div>

      {/* 2. Jadwal Acara & Pengiriman */}
      <div className="p-8 rounded-2xl bg-[#F3F1E9] border border-[#141413]/[0.08] space-y-6">
        <div>
          <span className="text-xs font-semibold text-[#8E8B81] uppercase tracking-[0.1em] block">
            Bagian 02
          </span>
          <h2 className="font-display font-bold text-xl text-[#141413] mt-1">
            Jadwal Acara & Waktu Pengantaran
          </h2>
          <p className="text-xs text-[#626058] mt-1">
            Waktu pengantaran disesuaikan dengan zona waktu WIB untuk ketepatan jam makan karyawan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="eventDate"
              className="block text-xs font-semibold text-[#141413] uppercase tracking-wider"
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
              className="w-full rounded-lg border border-[#141413]/15 bg-[#FAF9F5] px-4 py-3 text-[#141413] text-sm focus:border-[#141413] focus:outline-none focus:ring-1 focus:ring-[#141413] disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="eventTime"
              className="block text-xs font-semibold text-[#141413] uppercase tracking-wider"
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
              className="w-full rounded-lg border border-[#141413]/15 bg-[#FAF9F5] px-4 py-3 text-[#141413] text-sm focus:border-[#141413] focus:outline-none focus:ring-1 focus:ring-[#141413] disabled:opacity-50"
            />
            <p className="text-[11px] text-[#8E8B81]">
              Armada siap melayani kebutuhan makan shift pagi, siang, dan lembur malam.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Kontak Pemesan & Alamat */}
      <div className="p-8 rounded-2xl bg-[#F3F1E9] border border-[#141413]/[0.08] space-y-6">
        <div>
          <span className="text-xs font-semibold text-[#8E8B81] uppercase tracking-[0.1em] block">
            Bagian 03
          </span>
          <h2 className="font-display font-bold text-xl text-[#141413] mt-1">
            Data Pemesan & Alamat Pengantaran
          </h2>
          <p className="text-xs text-[#626058] mt-1">
            Informasi PIC operasional untuk konfirmasi status pesanan dan rute pengantaran armada.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="customerName"
              className="block text-xs font-semibold text-[#141413] uppercase tracking-wider"
            >
              Nama Pemesan / Entitas Perusahaan <span className="text-[#C85A17]">*</span>
            </label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              required
              disabled={isPending}
              className="w-full rounded-lg border border-[#141413]/15 bg-[#FAF9F5] px-4 py-3 text-[#141413] text-sm focus:border-[#141413] focus:outline-none focus:ring-1 focus:ring-[#141413] disabled:opacity-50"
              placeholder="PT. Nama Perusahaan / Nama Pemesan"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="customerPhone"
              className="block text-xs font-semibold text-[#141413] uppercase tracking-wider"
            >
              Nomor WhatsApp PIC <span className="text-[#C85A17]">*</span>
            </label>
            <input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              required
              disabled={isPending}
              className="w-full rounded-lg border border-[#141413]/15 bg-[#FAF9F5] px-4 py-3 text-[#141413] text-sm focus:border-[#141413] focus:outline-none focus:ring-1 focus:ring-[#141413] disabled:opacity-50"
              placeholder="0812xxxxxxxx"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="customerEmail"
              className="block text-xs font-semibold text-[#141413] uppercase tracking-wider"
            >
              Email Kantor (Opsional)
            </label>
            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              disabled={isPending}
              className="w-full rounded-lg border border-[#141413]/15 bg-[#FAF9F5] px-4 py-3 text-[#141413] text-sm focus:border-[#141413] focus:outline-none focus:ring-1 focus:ring-[#141413] disabled:opacity-50"
              placeholder="procurement@company.co.id"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="notes"
              className="block text-xs font-semibold text-[#141413] uppercase tracking-wider"
            >
              Catatan Menu / Permintaan Khusus
            </label>
            <input
              id="notes"
              name="notes"
              type="text"
              disabled={isPending}
              className="w-full rounded-lg border border-[#141413]/15 bg-[#FAF9F5] px-4 py-3 text-[#141413] text-sm focus:border-[#141413] focus:outline-none focus:ring-1 focus:ring-[#141413] disabled:opacity-50"
              placeholder="Contoh: Pisahkan sambal, variasi ayam kecap"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="customerAddress"
            className="block text-xs font-semibold text-[#141413] uppercase tracking-wider"
          >
            Alamat Lengkap Pengantaran di Karawang <span className="text-[#C85A17]">*</span>
          </label>
          <textarea
            id="customerAddress"
            name="customerAddress"
            rows={3}
            required
            disabled={isPending}
            className="w-full rounded-lg border border-[#141413]/15 bg-[#FAF9F5] px-4 py-3 text-[#141413] text-sm focus:border-[#141413] focus:outline-none focus:ring-1 focus:ring-[#141413] disabled:opacity-50"
            placeholder="Sebutkan gedung/pabrik, nama jalan, blok, dan nama kawasan industri (KIIC, Suryacipta, KIM, dll.)."
          />
        </div>
      </div>

      {/* 4. Persetujuan Syarat & Submit */}
      <div className="p-8 rounded-2xl bg-[#141413] text-[#FAF9F5] space-y-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="acceptTerms"
            required
            disabled={isPending}
            className="mt-1 w-4 h-4 rounded border-[#FAF9F5]/30 text-[#C85A17] focus:ring-0 cursor-pointer"
          />
          <span className="text-xs text-[#A8A69E] leading-relaxed">
            Saya mengonfirmasi bahwa spesifikasi pesanan di atas telah sesuai dengan kebutuhan perusahaan kami, dan menyetujui ketentuan pemesanan katering PT. Zahdan Kamal Sentosa. Saya memahami bahwa status pesanan awal adalah <strong>Menunggu Konfirmasi Admin</strong> dan besaran ongkos kirim akan ditetapkan setelah verifikasi rute pengantaran.
          </span>
        </label>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-[#FAF9F5]/[0.1]">
          <div>
            <span className="text-xs text-[#8E8B81] block">Estimasi Nilai Pesanan:</span>
            <span className="font-display font-extrabold text-2xl text-[#FAF9F5]">
              Rp{subtotalEstimate.toLocaleString("id-ID")}
            </span>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-[#C85A17] text-white text-xs sm:text-sm font-semibold hover:bg-[#A4460E] transition-all tracking-tight cursor-pointer disabled:opacity-50"
          >
            <span>{isPending ? "Memproses Data..." : "Kirim Pengajuan Pesanan"}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
}
