import StatCounter from "@/components/StatCounter";
import { CAPACITY_STATS, CORRIDOR_ROUTES } from "@/data/home-content";
import { CANVAS, CONTAINER, HEADING, TITLE_SIZE } from "@/components/site/ui";

export default function CapacityBand() {
  return (
    <section id="operasional" className={`${CANVAS} py-20 lg:py-28 reveal-on-scroll`}>
      <div className={CONTAINER}>
        <h2 className={`${HEADING} ${TITLE_SIZE.medium} max-w-3xl reveal-title`}>Dibangun untuk skala pabrik</h2>

        <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {CAPACITY_STATS.map((stat, index) => (
            <div key={stat.label} className={`border-t-4 border-brand-500 pt-6 reveal-fade-up stagger-${index + 1}`}>
              <StatCounter
                value={stat.value}
                suffix={stat.suffix}
                separator="."
                className={`${HEADING} block text-6xl xl:text-7xl`}
              />
              <span className="mt-3 block font-heading text-base font-bold uppercase">{stat.label}</span>
              <p className="mt-2 text-[15px] leading-relaxed text-white/75">{stat.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 rounded-[10px] bg-ink-soft p-8 lg:grid-cols-12 lg:items-center lg:p-10">
          <div className="lg:col-span-4">
            <span className="block font-heading text-xl font-extrabold uppercase">Waktu tempuh armada</span>
            <p className="mt-2 text-[15px] text-white/75">Via gerbang tol Karawang Barat &amp; Timur.</p>
          </div>
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:col-span-8">
            {CORRIDOR_ROUTES.map((route) => (
              <li key={route.area}>
                <span className={`${HEADING} block text-4xl`}>
                  ±{route.minutes}
                  <span className="ml-1 text-base">mnt</span>
                </span>
                <span className="mt-1 block text-sm text-white/75">{route.area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
