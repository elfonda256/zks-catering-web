import Image from "next/image";
import { PARTNER_CLIENTS } from "@/data/home-content";
import { CANVAS, CONTAINER, RuledEyebrow } from "@/components/site/ui";

/**
 * Client logos scrolling in a continuous loop (pauses on hover, static with reduced motion).
 * The list is rendered four times (two identical halves, each wider than large screens) so the
 * -50% marquee translation loops seamlessly; spacing uses per-item margin rather than gap so both
 * halves are exactly the same width.
 * Logos sit on white tiles because the artwork has white backgrounds.
 */
export default function ClientStrip() {
  const loop = Array.from({ length: 4 }, () => PARTNER_CLIENTS).flat();

  return (
    <section id="klien" className={`${CANVAS} pb-20 lg:pb-28`}>
      <div className={CONTAINER}>
        <RuledEyebrow>Dipercaya industri manufaktur</RuledEyebrow>
      </div>

      <div className="mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <ul className="logo-marquee-track">
          {loop.map((client, index) => (
            <li
              key={`${client.name}-${index}`}
              aria-hidden={index >= PARTNER_CLIENTS.length}
              className="relative mr-4 h-24 w-48 shrink-0 overflow-hidden rounded-[10px] bg-white sm:mr-6 sm:w-56"
            >
              <Image src={client.src} alt={client.name} fill sizes="224px" className="object-contain p-5" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
