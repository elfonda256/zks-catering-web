import Image from "next/image";
import { HERO_FACTS } from "@/data/home-content";
import { CANVAS, CONTAINER, Eyebrow, HEADING } from "@/components/site/ui";

/** Heading and portrait photo overlap the bottom of the hero, then the intro copy continues below. */
export default function IntroSection() {
  return (
    <section id="tentang" className={`${CANVAS} relative z-10 pb-20 lg:pb-28`}>
      <div className={`${CONTAINER} grid gap-12 lg:grid-cols-12`}>
        <div className="lg:col-span-6 lg:-mt-48">
          <Eyebrow>Katering industri Karawang</Eyebrow>
          <h2 className={`${HEADING} mt-2 text-[2.5rem] sm:text-[2.75rem]`}>
            Energi untuk
            <br />
            lini produksi
          </h2>

          <p className="mt-16 max-w-md text-[17px] leading-[1.7] text-white/85 lg:mt-28">
            Sejak 2007, PT Zahdan Kamal Sentosa menyiapkan ribuan porsi setiap hari untuk pekerja pabrik di Karawang.
            Dapur sentral kami di Ciampel menerapkan ISO 22000, Halal, dan sanitasi berkala Dinas Kesehatan.
          </p>

          <dl className="mt-12 grid max-w-md grid-cols-2 gap-x-8 gap-y-6">
            {HERO_FACTS.map((fact) => (
              <div key={fact.label} className="flex flex-col-reverse">
                <dt className="text-sm text-white/70">{fact.label}</dt>
                <dd className={`${HEADING} text-3xl`}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:-mt-64">
          <div className="relative aspect-[356/427] w-full overflow-hidden">
            <Image
              src="/images/hero-industrial-kitchen.jpg"
              alt="Juru masak ZKS menyiapkan masakan di ketel uap dapur sentral"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
