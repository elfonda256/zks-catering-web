import Image from "next/image";
import { QA_PROTOCOLS } from "@/data/home-content";
import { DISPLAY, LABEL, SectionHeading } from "./ui";

/** Text column aligns with the max-w-7xl grid while the photo bleeds to the right viewport edge. */
const ALIGN_LEFT = "lg:pl-[max(3rem,calc((100vw-80rem)/2+3rem))]";

export default function FoodSafetySection() {
  return (
    <section id="keamanan-pangan" className="bg-[#FAF9F5] py-24 text-[#141413] sm:py-32 reveal-on-scroll">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className={`order-2 px-6 sm:px-8 lg:order-1 lg:pr-0 ${ALIGN_LEFT}`}>
          <SectionHeading
            theme="light"
            eyebrow="Keamanan pangan"
            title="Siap diaudit kapan pun"
            lead="Satu insiden keracunan bisa menghentikan lini perakitan. Kendali mutu kami berbasis HACCP dan ISO 22000, terbuka untuk audit tim safety dan HRGA perusahaan Anda."
          />

          <ol className="mt-12 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {QA_PROTOCOLS.map((protocol, index) => (
              <li key={protocol.title} className={`flex gap-4 reveal-fade-up stagger-${index + 1}`}>
                <span className={`${DISPLAY} w-8 shrink-0 text-2xl text-[#C85A17]`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className={LABEL}>{protocol.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-pretty text-[#57544C]">{protocol.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative order-1 aspect-[4/3] w-full overflow-hidden lg:order-2 lg:aspect-[4/5] lg:max-h-[760px] lg:rounded-l-[2rem] reveal-image">
          <Image
            src="/images/food-safety-audit.jpg"
            alt="Petugas mutu ZKS mengukur suhu inti masakan dengan termometer probe"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
