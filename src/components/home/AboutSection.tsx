import Image from "next/image";
import { CREDENTIALS, MILESTONES } from "@/data/home-content";
import { DISPLAY, LABEL, SectionHeading } from "./ui";

/** Text column aligns with the max-w-7xl grid while the photo bleeds to the left viewport edge. */
const ALIGN_RIGHT = "lg:pr-[max(3rem,calc((100vw-80rem)/2+3rem))]";

export default function AboutSection() {
  return (
    <section id="tentang" className="bg-[#141413] py-24 text-white sm:py-32 reveal-on-scroll">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/11] lg:aspect-[4/5] lg:max-h-[760px] lg:rounded-r-[2rem] reveal-image">
          <Image
            src="/images/hero-industrial-kitchen.jpg"
            alt="Juru masak ZKS menyiapkan masakan di ketel uap dapur sentral Ciampel"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className={`px-6 sm:px-8 lg:pl-0 ${ALIGN_RIGHT}`}>
          <SectionHeading
            eyebrow="Tentang ZKS"
            title="Energi untuk lini produksi Anda"
            lead="Berdiri di Karawang sejak 2007, PT Zahdan Kamal Sentosa tumbuh dari penyedia boga korporat menjadi mitra utama industri manufaktur. Dapur mandiri kami di Griya Indah Ciampel menerapkan ISO 22000, Halal MUI, dan sanitasi berkala Dinas Kesehatan untuk ribuan porsi setiap hari."
          />

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/15 pt-8 reveal-fade-up stagger-2">
            {CREDENTIALS.map((credential) => (
              <div key={credential.title} className="space-y-1">
                <dt className={LABEL}>{credential.title}</dt>
                <dd className="font-mono text-xs text-white/55">{credential.reference}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <ol className="mx-auto mt-20 grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-6 sm:px-8 lg:mt-28 lg:grid-cols-4 lg:px-12">
        {MILESTONES.map((milestone, index) => (
          <li key={milestone.year} className={`border-t border-white/15 pt-6 reveal-fade-up stagger-${index + 1}`}>
            <span className={`${DISPLAY} block text-5xl text-[#E07A35]`}>{milestone.year}</span>
            <span className={`${LABEL} mt-3 block`}>{milestone.title}</span>
            <p className="mt-2 text-sm leading-relaxed text-pretty text-white/60">{milestone.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
