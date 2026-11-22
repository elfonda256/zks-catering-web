import Image from "next/image";
import { WA_MESSAGES, buildWhatsAppUrl } from "@/data/home-content";
import { ButtonLink, CANVAS, HEADING, TITLE_SIZE } from "@/components/site/ui";

/** Full-width photo banner with an orange block overlapping its lower edge. */
export default function ContactBlock() {
  return (
    <section id="kontak" className={`${CANVAS} pb-20 lg:pb-28 reveal-on-scroll`}>
      <div className="relative h-[320px] w-full overflow-hidden sm:h-[420px] lg:h-[520px]">
        <Image
          src="/images/industrial-facility.jpg"
          alt="Hidangan siap dikemas di lini produksi ZKS"
          fill
          sizes="100vw"
          className="object-cover object-[center_80%]"
        />
      </div>

      <div className="relative -mt-24 ml-6 bg-brand-600 px-8 py-14 sm:ml-10 sm:px-12 lg:-mt-40 lg:ml-[6.25rem] lg:rounded-bl-[3.125rem] lg:px-16 lg:py-20">
        <span className="block font-heading text-base font-bold uppercase">Pengadaan katering</span>
        <h2 className={`${HEADING} ${TITLE_SIZE.large} mt-3 max-w-3xl`}>Mulai bahas kebutuhan karyawan Anda</h2>
        <p className="mt-6 max-w-xl text-[17px] leading-[1.7] text-white/90">
          Jadwalkan presentasi, survei dapur bersama tim HRGA atau purchasing, atau minta paket sampel rasa dikirim ke
          pabrik Anda.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={buildWhatsAppUrl(WA_MESSAGES.proposal)} variant="light">
            WhatsApp manajemen
          </ButtonLink>
          <ButtonLink href="/pesan" variant="outline">
            Formulir pemesanan
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
