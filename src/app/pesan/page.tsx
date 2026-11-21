import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTAINER, Eyebrow, HEADING, TITLE_SIZE } from "@/components/site/ui";
import OrderFormClient from "./OrderFormClient";

export const metadata: Metadata = {
  title: "Formulir Pemesanan Katering",
  description:
    "Ajukan pemesanan katering industri untuk pabrik, kantor, dan event di Karawang. Higienis, bergizi, bersertifikat ISO 22000 dan Halal.",
  alternates: { canonical: "/pesan" },
};

export default function OrderPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1A1F22] pb-24 font-text text-white lg:pb-0">
      <Navbar />

      <main id="main-content" className="flex-1 pb-16 pt-16 lg:pb-32 lg:pt-24">
        <div className={`${CONTAINER} max-w-7xl`}>
          <Eyebrow>Pesan katering</Eyebrow>
          <h1 className={`${HEADING} ${TITLE_SIZE.medium} mt-3`}>Buat pesanan</h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] text-white/85">
            Pilih paket dan jadwal. Admin memeriksa kapasitas dapur, menetapkan ongkos kirim, lalu mengirim total tagihan
            ke WhatsApp Anda.
          </p>

          <div className="mt-12">
            <Suspense fallback={<p className="py-16 text-center text-white/60">Memuat formulir pemesanan…</p>}>
              <OrderFormClient />
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
