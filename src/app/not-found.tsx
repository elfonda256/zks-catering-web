import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ButtonLink, CONTAINER, HEADING, TITLE_SIZE } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  robots: { index: false },
};

/** Any unknown address, including an order link that is wrong or no longer valid. */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-ink font-text text-white">
      <Navbar />
      <main id="main-content" className={`${CONTAINER} flex flex-1 flex-col justify-center py-24 lg:py-32`}>
        <p className="font-heading text-sm font-bold uppercase text-brand-300">Kesalahan 404</p>
        <h1 className={`${HEADING} ${TITLE_SIZE.large} mt-3 max-w-3xl`}>Halaman ini tidak ada di dapur kami</h1>
        <p className="mt-6 max-w-xl text-[17px] leading-[1.7] text-white/85">
          Alamatnya mungkin salah ketik. Kalau Anda membuka tautan status pesanan, pastikan tautannya utuh seperti yang
          dikirim lewat WhatsApp, atau hubungi kami.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/">Ke beranda</ButtonLink>
          <ButtonLink href="/menu" variant="outline">
            Lihat menu
          </ButtonLink>
        </div>
      </main>
      <Footer />
    </div>
  );
}
