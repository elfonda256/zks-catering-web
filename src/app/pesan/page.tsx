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

          {/* Alur Transparansi Pemesanan (Editorial Linear Datum Line, No Box Container) */}
          <div className="pt-8 border-t border-[#141413]/10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs">
            <div className="space-y-1.5 border-l border-[#141413]/10 pl-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                FASE 01 / FORMULIR
              </span>
              <h3 className="font-display font-bold text-sm text-[#141413]">Rincian &amp; Jadwal</h3>
              <p className="text-[#626058] text-xs leading-relaxed">
                Tentukan paket menu, volume porsi harian, dan jam tiba di pabrik Karawang.
              </p>
            </div>

            <div className="space-y-1.5 border-l border-[#141413]/10 pl-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E8B81] font-semibold block">
                FASE 02 / VERIFIKASI
              </span>
              <h3 className="font-display font-bold text-sm text-[#141413]">Kapasitas &amp; Rute</h3>
              <p className="text-[#626058] text-xs leading-relaxed">
                Tim operasional dapur memverifikasi slot boiler uap dan menetapkan logistik rute.
              </p>
            </div>

            <div className="space-y-1.5 border-l border-[#141413]/10 pl-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E8B81] font-semibold block">
                FASE 03 / KONTRAK
              </span>
              <h3 className="font-display font-bold text-sm text-[#141413]">Pembayaran Terkunci</h3>
              <p className="text-[#626058] text-xs leading-relaxed">
                Pelunasan penuh atau skema uang muka (DP 20%) sebelum batas waktu H-1 acara.
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
