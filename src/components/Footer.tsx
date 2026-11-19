import Link from "next/link";
import Image from "next/image";
import { COMPANY_PROFILE } from "@/data/catering-data";
import { CREDENTIALS, buildWhatsAppUrl } from "@/data/home-content";

const COLUMN_TITLE = "font-heading text-xl font-extrabold uppercase";
const FOOTER_LINK = "font-heading text-[13px] font-bold uppercase transition-opacity hover:opacity-70";

const SITE_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/menu", label: "Katalog menu" },
  { href: "/#paket", label: "Paket katering" },
  { href: "/#keamanan-pangan", label: "Keamanan pangan" },
  { href: "/#dokumen", label: "Fasilitas & dokumen" },
  { href: "/pesan", label: "Pesan katering" },
];

export default function Footer() {
  return (
    <footer className="bg-[#C85A17] font-text text-white">
      <div className="mx-auto max-w-[90rem] px-6 pb-10 pt-20 sm:px-10 lg:px-[6.25rem]">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex flex-col items-start gap-4">
              <span className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-[#0d2238]">
                <Image src="/images/zks-logo-official.png" alt="" fill sizes="64px" className="object-cover object-left" />
              </span>
              <span className="font-heading text-3xl font-extrabold uppercase leading-none">
                ZKS Catering
                <span className="mt-1 block text-xs font-bold tracking-[0.12em]">{COMPANY_PROFILE.name}</span>
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-white/90">{COMPANY_PROFILE.address}</p>
          </div>

          <div className="lg:col-span-2">
            <p className={COLUMN_TITLE}>ZKS</p>
            <ul className="mt-5 space-y-3">
              {SITE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={FOOTER_LINK}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className={COLUMN_TITLE}>Hubungi kami</p>
            <ul className="mt-5 space-y-4">
              {COMPANY_PROFILE.contacts.map((contact) => (
                <li key={contact.name}>
                  <span className="block font-heading text-[13px] font-bold uppercase">{contact.name}</span>
                  <span className="block text-sm text-white/85">{contact.role}</span>
                  <a
                    href={buildWhatsAppUrl("Halo PT Zahdan Kamal Sentosa,", contact.waNumber)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold underline underline-offset-4"
                  >
                    {contact.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className={COLUMN_TITLE}>Sertifikasi</p>
            <ul className="mt-5 space-y-4">
              {CREDENTIALS.map((credential) => (
                <li key={credential.title}>
                  <span className="block font-heading text-[13px] font-bold uppercase">{credential.title}</span>
                  <span className="block text-sm text-white/85">{credential.reference}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/30 pt-6 text-xs text-white/85 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {COMPANY_PROFILE.name}. Hak cipta dilindungi.
          </span>
          <Link href="/admin/login" className="underline underline-offset-4 hover:text-white">
            Portal staf
          </Link>
        </div>
      </div>
    </footer>
  );
}
