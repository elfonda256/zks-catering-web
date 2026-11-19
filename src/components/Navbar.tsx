"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { WA_MESSAGES, buildWhatsAppUrl } from "@/data/home-content";

const NAV_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/#paket", label: "Paket" },
  { href: "/#keamanan-pangan", label: "Keamanan pangan" },
  { href: "/#dokumen", label: "Fasilitas" },
  { href: "/#kontak", label: "Kontak" },
];

const NAV_LINK = "font-heading text-[13px] font-bold uppercase tracking-[0.02em] text-white transition-colors hover:text-[#E07A35]";
const OUTLINE_PILL =
  "inline-flex min-h-10 items-center rounded-full border-2 border-white/80 px-4 font-heading text-[13px] font-bold uppercase text-white transition-colors hover:bg-white hover:text-[#1A1F22]";

interface NavbarProps {
  /** Start transparent over a full-bleed hero and turn solid on scroll. */
  overlay?: boolean;
}

export default function Navbar({ overlay = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const solid = !overlay || isScrolled || isOpen;

  return (
    <header
      className={`${overlay ? "fixed" : "sticky"} inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-[#1A1F22]" : "bg-transparent"
      }`}
    >
      <a href="#main-content" className="skip-link">
        Lewati ke konten utama
      </a>

      <div className="mx-auto flex h-20 max-w-[90rem] items-center justify-between gap-8 px-6 sm:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-3 rounded-lg" aria-label="Beranda PT Zahdan Kamal Sentosa">
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#0d2238]">
            <Image src="/images/zks-logo-official.png" alt="" fill sizes="40px" className="object-cover object-left" priority />
          </span>
          <span className="flex flex-col leading-none text-white">
            <span className="font-heading text-xl font-extrabold uppercase">ZKS Catering</span>
            <span className="mt-1 font-heading text-[10px] font-bold uppercase tracking-[0.12em] text-white/75">
              Katering industri Karawang
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 xl:flex" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={NAV_LINK}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <a href={buildWhatsAppUrl(WA_MESSAGES.consultation)} target="_blank" rel="noreferrer" className={OUTLINE_PILL}>
            WhatsApp
          </a>
          <Link href="/pesan" className={OUTLINE_PILL}>
            Pesan katering
          </Link>
          <Link href="/admin/login" className={`${NAV_LINK} ml-2 text-white/60`}>
            Admin
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-white xl:hidden"
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isOpen}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            {isOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-[#1A1F22] px-6 pb-8 pt-4 sm:px-10 xl:hidden">
          <nav className="flex flex-col" aria-label="Navigasi seluler">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="border-b border-white/10 py-4 font-heading text-2xl font-extrabold uppercase text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/pesan" onClick={() => setIsOpen(false)} className={OUTLINE_PILL}>
              Pesan katering
            </Link>
            <a href={buildWhatsAppUrl(WA_MESSAGES.consultation)} target="_blank" rel="noreferrer" className={OUTLINE_PILL}>
              WhatsApp
            </a>
            <Link href="/admin/login" onClick={() => setIsOpen(false)} className={`${NAV_LINK} ml-2 text-white/60`}>
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
