import Image from "next/image";
import { PARTNER_CLIENTS } from "@/data/home-content";
import { Eyebrow } from "./ui";

/** Logos sit on the light canvas because the client artwork has white backgrounds. */
export default function ClientStrip() {
  return (
    <section id="klien-industri" className="bg-[#FAF9F5] py-14 text-[#141413] sm:py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:px-8 lg:flex-row lg:items-center lg:gap-12 lg:px-12">
        <div className="shrink-0 lg:w-56">
          <Eyebrow theme="light">Dipercaya oleh industri manufaktur</Eyebrow>
        </div>

        <div className="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <ul className="logo-marquee-track items-center gap-14 sm:gap-20">
            {[...PARTNER_CLIENTS, ...PARTNER_CLIENTS].map((client, index) => (
              <li
                key={`${client.name}-${index}`}
                className="relative h-14 w-32 shrink-0"
                aria-hidden={index >= PARTNER_CLIENTS.length}
              >
                <Image src={client.src} alt={client.name} fill sizes="128px" className="object-contain" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
