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

const ORDER_STEPS = [
  { step: "01", title: "Isi formulir", description: "Tentukan paket, jumlah porsi, dan jam tiba di pabrik." },
  { step: "02", title: "Verifikasi admin", description: "Tim dapur memeriksa kapasitas dan menetapkan ongkos kirim." },
  { step: "03", title: "Pembayaran", description: "Lunas atau DP 20% sebelum batas waktu H-1 acara." },
];

export default function OrderPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1A1F22] font-text text-white">
      <Navbar />

      <main id="main-content" className="flex-1 pb-24 pt-16 lg:pb-32 lg:pt-24">
        <div className={`${CONTAINER} max-w-5xl`}>
          <Eyebrow>Pengajuan katering</Eyebrow>
          <h1 className={`${HEADING} ${TITLE_SIZE.large} mt-3`}>Formulir pemesanan</h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-[1.7] text-white/85">
            Lengkapi kebutuhan katering Anda. Tim operasional kami memverifikasi kapasitas dapur lalu menghubungi kontak
            Anda untuk memastikan rute dan jadwal pengantaran.
          </p>

          <ol className="mt-12 grid gap-6 sm:grid-cols-3">
            {ORDER_STEPS.map((item) => (
              <li key={item.step} className="border-t-4 border-[#C85A17] pt-5">
                <span className="font-heading text-sm font-bold uppercase text-[#E07A35]">Tahap {item.step}</span>
                <span className="mt-1 block font-heading text-xl font-extrabold uppercase">{item.title}</span>
                <p className="mt-2 text-[15px] leading-relaxed text-white/70">{item.description}</p>
              </li>
            ))}
          </ol>

          <div className="mt-14">
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
