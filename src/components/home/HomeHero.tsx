import Image from "next/image";
import { WA_MESSAGES, buildWhatsAppUrl } from "@/data/home-content";
import { ButtonLink, HEADING, TITLE_SIZE } from "@/components/site/ui";

export default function HomeHero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#1A1F22] text-white">
      <Image
        src="/images/industrial-facility.jpg"
        alt="Dapur sentral PT Zahdan Kamal Sentosa saat produksi katering industri"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[#1A1F22]/55" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-[#1A1F22] to-transparent" aria-hidden="true" />

      <div className="mx-auto w-full max-w-[90rem] px-6 pb-40 pt-32 sm:px-10">
        <div className="mx-auto w-fit">
          <h1 className={`${HEADING} ${TITLE_SIZE.hero} hero-enter-headline`}>
            <span className="block">Dapur sentral,</span>
            <span className="block sm:pl-[1.4em]">katering industri</span>
          </h1>
          <div className="mt-10 flex justify-center hero-enter-actions">
            <ButtonLink href={buildWhatsAppUrl(WA_MESSAGES.consultation)}>Konsultasi &amp; uji rasa</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
