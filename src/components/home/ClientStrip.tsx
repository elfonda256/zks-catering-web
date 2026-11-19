import Image from "next/image";
import { PARTNER_CLIENTS } from "@/data/home-content";
import { CANVAS, CONTAINER, RuledEyebrow } from "@/components/site/ui";

/** Client logos sit on white tiles because the artwork has white backgrounds. */
export default function ClientStrip() {
  return (
    <section id="klien" className={`${CANVAS} pb-20 lg:pb-28`}>
      <div className={CONTAINER}>
        <RuledEyebrow>Dipercaya industri manufaktur</RuledEyebrow>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {PARTNER_CLIENTS.map((client) => (
            <li key={client.name} className="relative h-24 overflow-hidden rounded-[10px] bg-white">
              <Image src={client.src} alt={client.name} fill sizes="200px" className="object-contain p-5" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
