import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollObserver from "@/components/ScrollObserver";
import SplitFeature from "@/components/site/SplitFeature";
import { TextLink } from "@/components/site/ui";
import HomeHero from "@/components/home/HomeHero";
import IntroSection from "@/components/home/IntroSection";
import ClientStrip from "@/components/home/ClientStrip";
import PackageCards from "@/components/home/PackageCards";
import CapacityBand from "@/components/home/CapacityBand";
import DocumentCards from "@/components/home/DocumentCards";
import ContactBlock from "@/components/home/ContactBlock";
import BusinessJsonLd from "@/components/home/BusinessJsonLd";
import { QA_PROTOCOLS, WORKFLOW_STAGES } from "@/data/home-content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** Numbered list used inside the feature sections. */
function StepList({ steps }: { steps: { title: string }[] }) {
  return (
    <ol className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-3 font-heading text-[15px] font-bold uppercase">
          <span className="w-6 shrink-0 text-[#E07A35]">{String(index + 1).padStart(2, "0")}</span>
          {step.title}
        </li>
      ))}
    </ol>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1A1F22] font-text">
      <BusinessJsonLd />
      <Navbar overlay />

      <main id="main-content" className="flex-1">
        <ScrollObserver />
        <HomeHero />
        <IntroSection />
        <ClientStrip />
        <PackageCards />

        <SplitFeature
          id="keamanan-pangan"
          imageSide="left"
          image={{ src: "/images/food-safety-audit.jpg", alt: "Petugas mutu ZKS mengukur suhu inti masakan" }}
          eyebrow="Keamanan pangan"
          title="Siap diaudit kapan pun"
        >
          <p>
            Satu insiden keracunan bisa menghentikan lini perakitan. Kendali mutu kami berbasis HACCP dan ISO 22000,
            terbuka untuk audit tim safety dan HRGA perusahaan Anda.
          </p>
          <StepList steps={QA_PROTOCOLS} />
          <TextLink href="#dokumen">Lihat dokumen resmi</TextLink>
        </SplitFeature>

        <SplitFeature
          id="alur-produksi"
          imageSide="right"
          image={{ src: "/images/hero-culinary.jpg", alt: "Juru masak ZKS menata hidangan" }}
          eyebrow="Alur produksi"
          title="Tujuh tahap, satu arah"
        >
          <p>
            Setiap porsi melewati alur kerja satu arah, dari bahan masuk sampai serah terima di kantin, agar nutrisi,
            rasa, dan sanitasi tetap konsisten.
          </p>
          <StepList steps={WORKFLOW_STAGES} />
          <TextLink href="/menu">Lihat katalog menu</TextLink>
        </SplitFeature>

        <CapacityBand />
        <DocumentCards />
        <ContactBlock />
      </main>

      <Footer />
    </div>
  );
}
