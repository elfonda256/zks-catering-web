import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuCatalogClient from "./MenuCatalogClient";

export const metadata: Metadata = {
  title: "Katalog Menu Katering Industri | PT. Zahdan Kamal Sentosa Karawang",
  description:
    "Daftar spesifikasi paket menu katering harian dan event industri Karawang. Paket Rp17.000, Rp20.000, dan Rp25.000 dengan rotasi menu Senin sampai Sabtu.",
};

export default function MenuPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5] text-[#141413] selection:bg-[#D96B27]/20 selection:text-[#141413]">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-14">
          {/* Header Judul Halaman (Editorial Left Aligned or Refined Centered) */}
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#C85A17]">
              Katalog Menu Katering Industri
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#141413] tracking-[-0.03em] leading-tight">
              Spesifikasi Sajian Seimbang dengan Rotasi Terjadwal.
            </h1>
            <p className="text-sm sm:text-base text-[#626058] leading-relaxed">
              Daftar menu lengkap harian dengan komposisi gizi seimbang, standar gramasi porsi presisi, dan bahan baku bersertifikat halal untuk kebutuhan tenaga kerja pabrik dan jamuan eksekutif.
            </p>
          </div>

          {/* Katalog Interaktif dalam Suspense */}
          <Suspense
            fallback={
              <div className="p-16 text-center text-[#8E8B81] text-xs font-mono">
                Memuat data rotasi menu katering...
              </div>
            }
          >
            <MenuCatalogClient />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
