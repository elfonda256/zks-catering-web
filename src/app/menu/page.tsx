import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTAINER, Eyebrow, HEADING, TITLE_SIZE } from "@/components/site/ui";
import MenuCatalogClient from "./MenuCatalogClient";

export const metadata: Metadata = {
  title: "Katalog Menu Katering Industri | PT. Zahdan Kamal Sentosa Karawang",
  description:
    "Daftar spesifikasi paket menu katering harian dan event industri Karawang. Paket Rp17.000, Rp20.000, dan Rp25.000 dengan rotasi menu Senin sampai Sabtu.",
};

export default function MenuPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1A1F22] font-text text-white">
      <Navbar overlay />

      <main id="main-content" className="flex-1">
        <section className="relative isolate flex min-h-[560px] items-end overflow-hidden h-[72svh]">
          <Image
            src="/images/hero-culinary.jpg"
            alt="Juru masak ZKS menata hidangan"
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[#1A1F22]/50" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-[#1A1F22] to-transparent" aria-hidden="true" />

          <div className={`${CONTAINER} pb-16 lg:pb-20`}>
            <Eyebrow>Rotasi Senin sampai Sabtu</Eyebrow>
            <h1 className={`${HEADING} ${TITLE_SIZE.hero} mt-3 hero-enter-headline`}>Katalog menu</h1>
            <p className="mt-6 max-w-xl text-[17px] leading-[1.7] text-white/85 hero-enter-sub">
              Tiga paket dengan gizi seimbang dan gramasi porsi terukur, dimasak dari bahan bersertifikat halal untuk
              pekerja pabrik dan jamuan perusahaan.
            </p>
          </div>
        </section>

        <Suspense fallback={<p className={`${CONTAINER} py-24 text-white/70`}>Memuat menu…</p>}>
          <MenuCatalogClient />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
