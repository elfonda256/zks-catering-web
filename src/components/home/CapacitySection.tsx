import StatCounter from "@/components/StatCounter";
import { CAPACITY_STATS, CORRIDOR_ROUTES } from "@/data/home-content";
import { DISPLAY, LABEL, SectionHeading } from "./ui";

export default function CapacitySection() {
  return (
    <section id="operasional" className="bg-[#1C1C1A] py-24 text-white sm:py-32 reveal-on-scroll">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Skala operasional"
          title="Dibangun untuk skala pabrik"
          lead="Fasilitas terpusat di Ciampel dengan boiler uap berkapasitas ratusan kilogram dan cold room independen, menjaga suplai tetap jalan saat lembur atau lonjakan shift mendadak."
        />

        <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {CAPACITY_STATS.map((stat, index) => (
            <div key={stat.label} className={`border-t border-white/15 pt-6 reveal-fade-up stagger-${index + 1}`}>
              <StatCounter
                value={stat.value}
                suffix={stat.suffix}
                separator="."
                className={`${DISPLAY} block text-7xl text-white xl:text-8xl`}
              />
              <span className={`${LABEL} mt-4 block text-[#E07A35]`}>{stat.label}</span>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-white/60">{stat.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-8 rounded-3xl bg-white/[0.04] p-8 lg:grid-cols-12 lg:items-center lg:p-10 reveal-fade-up">
          <div className="lg:col-span-4">
            <span className={`${LABEL} block text-xl`}>Waktu tempuh armada</span>
            <p className="mt-2 text-sm text-pretty text-white/60">
              Via gerbang tol Karawang Barat &amp; Timur, rata-rata di bawah 35 menit.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 lg:col-span-8">
            {CORRIDOR_ROUTES.map((route) => (
              <li key={route.area}>
                <span className={`${DISPLAY} block text-4xl`}>
                  ±{route.minutes}
                  <span className="ml-1 text-lg text-white/60">mnt</span>
                </span>
                <span className="mt-1 block text-sm text-white/70">{route.area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
