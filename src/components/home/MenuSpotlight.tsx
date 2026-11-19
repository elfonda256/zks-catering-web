import Image from "next/image";
import { PillLink, SectionHeading } from "./ui";

export default function MenuSpotlight() {
  return (
    <section className="bg-[#141413] px-4 py-4 text-white sm:px-6 sm:py-6 reveal-on-scroll">
      <div className="relative isolate mx-auto flex min-h-[560px] max-w-[96rem] items-end overflow-hidden rounded-[2rem] sm:min-h-[640px] reveal-image">
        <Image
          src="/images/hero-culinary.jpg"
          alt="Juru masak menata hidangan di dapur ZKS"
          fill
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#141413]/90 via-[#141413]/45 to-transparent"
          aria-hidden="true"
        />

        <div className="max-w-2xl p-8 sm:p-12 lg:p-16">
          <SectionHeading
            eyebrow="Katalog menu"
            title="Rotasi menu Senin sampai Sabtu"
            lead="Setiap paket dihitung gramasinya: karbohidrat, protein hewani, dan serat yang seimbang, supaya karyawan tidak jenuh dan tetap bertenaga."
          />
          <div className="mt-9">
            <PillLink href="/menu">Lihat katalog menu</PillLink>
          </div>
        </div>
      </div>
    </section>
  );
}
