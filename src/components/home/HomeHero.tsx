import Image from "next/image";
import { HERO_FACTS, WA_MESSAGES, buildWhatsAppUrl } from "@/data/home-content";
import { DISPLAY, Eyebrow, PillLink } from "./ui";

export default function HomeHero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-[#141413] text-white">
      <Image
        src="/images/industrial-facility.jpg"
        alt="Dapur sentral PT Zahdan Kamal Sentosa saat produksi katering industri"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#141413] via-[#141413]/70 to-[#141413]/35"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-7xl px-6 pb-12 pt-36 sm:px-8 lg:px-12 lg:pb-16">
        <div className="max-w-4xl">
          <div className="hero-enter-badge">
            <Eyebrow>PT Zahdan Kamal Sentosa · Karawang · Sejak 2007</Eyebrow>
          </div>

          <h1 className={`${DISPLAY} mt-5 text-[clamp(3.25rem,8vw,7.5rem)] hero-enter-headline`}>
            Dapur sentral katering industri
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-white/80 sm:text-lg hero-enter-sub">
            Ribuan porsi untuk pekerja pabrik manufaktur Karawang setiap hari, tepat jadwal lintas shift, dengan
            standar ISO 22000 dan Halal resmi.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row hero-enter-actions">
            <PillLink href={buildWhatsAppUrl(WA_MESSAGES.consultation)}>Konsultasi &amp; uji rasa</PillLink>
            <PillLink href="/menu" variant="outline">
              Lihat menu
            </PillLink>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/20 pt-8 sm:grid-cols-4 hero-enter-assurances">
          {HERO_FACTS.map((fact) => (
            <div key={fact.label} className="flex flex-col-reverse gap-1">
              <dt className="text-sm text-white/65">{fact.label}</dt>
              <dd className={`${DISPLAY} text-4xl`}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
