import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollObserver from "@/components/ScrollObserver";
import InteractiveMenuSection from "@/components/InteractiveMenuSection";
import CompanyVerificationGallery from "@/components/CompanyVerificationGallery";
import { displayFont } from "@/components/home/fonts";
import { SectionHeading } from "@/components/home/ui";
import HomeHero from "@/components/home/HomeHero";
import ClientStrip from "@/components/home/ClientStrip";
import AboutSection from "@/components/home/AboutSection";
import CapacitySection from "@/components/home/CapacitySection";
import MenuSpotlight from "@/components/home/MenuSpotlight";
import WorkflowSection from "@/components/home/WorkflowSection";
import FoodSafetySection from "@/components/home/FoodSafetySection";
import ContactCta from "@/components/home/ContactCta";

/**
 * Public homepage. Dark chapters cover the company and its operations; the light chapter holds
 * the documents and menu, which read best on paper-like background.
 */
export default function HomePage() {
  return (
    <div className={`${displayFont.variable} flex min-h-screen flex-col bg-[#141413]`}>
      <Navbar variant="overlay" />

      <main id="main-content" className="flex-1">
        <ScrollObserver />
        <HomeHero />
        <ClientStrip />
        <AboutSection />
        <CapacitySection />
        <MenuSpotlight />
        <WorkflowSection />
        <FoodSafetySection />
        <CompanyVerificationGallery />

        <section id="menu-katering" className="bg-[#FAF9F5] pb-24 pt-8 text-[#141413] sm:pb-32 reveal-on-scroll">
          <div className="mx-auto max-w-7xl space-y-12 px-6 sm:px-8 lg:px-12">
            <SectionHeading theme="light" eyebrow="Contoh menu mingguan" title="Pilih paket, lihat menunya" />
            <InteractiveMenuSection />
          </div>
        </section>

        <ContactCta />
      </main>

      <Footer />
    </div>
  );
}
