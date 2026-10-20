import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderFormClient from "./OrderFormClient";

export const metadata: Metadata = {
  title: "Formulir Pengajuan Pemesanan Katering | PT. Zahdan Kamal Sentosa",
  description:
    "Formulir pengajuan pemesanan katering industri untuk pabrik, kantor, dan event di Karawang. Higienis, bergizi, bersertifikasi ISO 22000.",
};

export default function OrderPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5] text-[#141413] selection:bg-[#D96B27]/20 selection:text-[#141413]">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-12">
          {/* Header Judul (Editorial Left-Aligned) */}
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#C85A17]">
              Pengajuan Katering Resmi
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#141413] tracking-[-0.03em] leading-tight">
              Formulir Pemesanan Katering ZKS
            </h1>
            <p className="text-sm sm:text-base text-[#626058] leading-relaxed max-w-2xl">
              Lengkapi data kebutuhan katering Anda di bawah. Tim operasional dapur kami akan memverifikasi ketersediaan kapasitas dan segera menghubungi kontak terdaftar untuk finalisasi rute dan jadwal pengantaran.
            </p>
          </div>

          {/* Alur Transparansi Pemesanan (Editorial Timeline) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#141413]/[0.08] border border-[#141413]/[0.08] rounded-xl overflow-hidden text-xs">
            <div className="bg-[#FAF9F5] p-5 space-y-2">
              <span className="font-mono text-[11px] font-bold text-[#C85A17] block">
                LANGKAH 01
              </span>
              <p className="font-display font-bold text-sm text-[#141413]">Rincian & Jadwal</p>
              <p className="text-[#626058] text-[11px] leading-relaxed">
                Pilih paket menu, jumlah porsi, dan waktu pengantaran di Karawang.
              </p>
            </div>

            <div className="bg-[#FAF9F5] p-5 space-y-2">
              <span className="font-mono text-[11px] font-bold text-[#8E8B81] block">
                LANGKAH 02
              </span>
              <p className="font-display font-bold text-sm text-[#141413]">Verifikasi Dapur & Ongkir</p>
              <p className="text-[#626058] text-[11px] leading-relaxed">
                Admin memeriksa slot kapasitas dapur dan menetapkan biaya pengantaran.
              </p>
            </div>

            <div className="bg-[#FAF9F5] p-5 space-y-2">
              <span className="font-mono text-[11px] font-bold text-[#8E8B81] block">
                LANGKAH 03
              </span>
              <p className="font-display font-bold text-sm text-[#141413]">Pembayaran Terkunci</p>
              <p className="text-[#626058] text-[11px] leading-relaxed">
                Pelunasan penuh atau skema DP 20% sebelum batas waktu H-1 acara.
              </p>
            </div>
          </div>

          {/* Form Client */}
          <Suspense
            fallback={
              <div className="p-16 text-center text-[#8E8B81] text-xs font-mono">
                Memuat formulir pemesanan...
              </div>
            }
          >
            <OrderFormClient />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
