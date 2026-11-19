import { COMPANY_PROFILE } from "@/data/catering-data";
import { WA_MESSAGES, buildWhatsAppUrl } from "@/data/home-content";
import { LABEL, PillLink, SectionHeading } from "./ui";

export default function ContactCta() {
  return (
    <section id="kontak-korporat" className="bg-[#A4460E] py-24 text-white sm:py-32 reveal-on-scroll">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <SectionHeading
          theme="brand"
          eyebrow="Pengadaan katering korporat & pabrik"
          title="Mulai bahas kebutuhan karyawan Anda"
          lead="Jadwalkan presentasi, survei dapur bersama tim HRGA atau purchasing, atau minta paket sampel rasa dikirim ke pabrik Anda."
        />
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <PillLink href={buildWhatsAppUrl(WA_MESSAGES.proposal)} variant="dark">
            WhatsApp manajemen
          </PillLink>
          <PillLink href="/pesan" variant="outline">
            Formulir pemesanan
          </PillLink>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-x-8 gap-y-6 border-t border-white/30 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {COMPANY_PROFILE.contacts.map((contact) => (
            <li key={contact.name}>
              <span className={`${LABEL} block text-xl`}>{contact.name}</span>
              <span className="mt-1 block text-sm text-white/75">{contact.role}</span>
              <a
                href={buildWhatsAppUrl(WA_MESSAGES.proposal, contact.waNumber)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-semibold underline decoration-white/40 underline-offset-4 hover:decoration-white"
              >
                {contact.phone}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
