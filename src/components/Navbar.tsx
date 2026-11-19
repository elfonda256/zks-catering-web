"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@/components/icons";

const NAV_LINKS = [
  { href: "/#operasional", label: "Kapasitas & Fasilitas", mobileLabel: "Kapasitas & Fasilitas Dapur" },
  { href: "/#keamanan-pangan", label: "Standar ISO 22000", mobileLabel: "Standar ISO 22000" },
  { href: "/#klien-industri", label: "Klien Manufaktur", mobileLabel: "Klien Manufaktur" },
  { href: "/menu", label: "Katalog Menu", mobileLabel: "Katalog Menu", highlight: true },
  { href: "/#kontak-korporat", label: "Kontak Procurement", mobileLabel: "Kontak Procurement" },
];

/** "overlay" sits transparent over a dark full-bleed hero and turns solid charcoal on scroll. */
const THEMES = {
  default: {
    desktop: "lg:flex",
    mobile: "lg:hidden",
    top: "bg-transparent border-b border-transparent py-5",
    scrolled: "bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#141413]/[0.07] py-3.5 shadow-xs",
    brand: "text-[#141413]",
    brandSub: "text-[#6B685F]",
    nav: "text-xs font-medium text-[#57544C]",
    link: "hover:text-[#141413]",
    highlight: "text-[#C85A17] font-semibold hover:text-[#A4460E]",
    cta: "btn-interactive-primary gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-tight",
    admin: "text-xs font-medium text-[#6B685F] hover:text-[#141413]",
    toggle: "text-[#141413] hover:bg-[#141413]/[0.05]",
    drawer: "border-[#141413]/[0.08] bg-[#FAF9F5] text-[#141413]",
    drawerLink: "text-xs font-medium hover:bg-[#141413]/[0.04]",
  },
  overlay: {
    desktop: "xl:flex",
    mobile: "xl:hidden",
    top: "bg-transparent border-b border-white/10 py-5",
    scrolled: "bg-[#141413]/95 backdrop-blur-md border-b border-white/10 py-3.5",
    brand: "text-white",
    brandSub: "text-white/60",
    nav: "font-condensed text-[15px] font-bold uppercase tracking-[0.06em] text-white/80",
    link: "hover:text-white",
    highlight: "text-[#E07A35] hover:text-white",
    cta: "inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#C85A17] px-5 font-condensed text-[15px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#A4460E]",
    admin: "font-condensed text-[15px] font-bold uppercase tracking-[0.08em] text-white/60 hover:text-white",
    toggle: "text-white hover:bg-white/10",
    drawer: "border-white/10 bg-[#1C1C1A] text-white",
    drawerLink: "font-condensed text-base font-bold uppercase tracking-[0.06em] hover:bg-white/[0.06]",
  },
} as const;

interface NavbarProps {
  variant?: keyof typeof THEMES;
}

export default function Navbar({ variant = "default" }: NavbarProps) {
  const theme = THEMES[variant];
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled || isOpen ? theme.scrolled : theme.top
      }`}
    >
      {/* Skip to Main Content Link for Keyboard Accessibility (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-link">
        Lewati ke Konten Utama
      </a>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-8">
          {/* Brand Wordmark with Official ZKS Logo */}
          <Link href="/" className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded-lg p-0.5">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[#0d2238] border border-[#141413]/10 shadow-xs">
              <Image
                src="/images/zks-logo-official.png"
                alt="PT. Zahdan Kamal Sentosa Logo"
                fill
                className="object-cover object-left"
                priority
              />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className={`font-display font-bold text-sm sm:text-[15px] leading-tight tracking-[-0.02em] ${theme.brand}`}>
                PT. Zahdan Kamal Sentosa
              </span>
              <span className={`text-[10px] font-medium tracking-[0.06em] uppercase ${theme.brandSub}`}>
                Industrial Catering · Karawang
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className={`hidden items-center gap-6 whitespace-nowrap ${theme.desktop} ${theme.nav}`}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded-sm ${
                  link.highlight ? theme.highlight : theme.link
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions (Minimal, Elegant, Sprint 07 accessible micro-interactions) */}
          <div className={`hidden items-center gap-3 whitespace-nowrap ${theme.desktop}`}>
            <Link
              href="/pesan"
              className={`group ${theme.cta}`}
            >
              <span>Pesan Katering</span>
              <ArrowUpRight className="w-3 h-3 opacity-70 btn-arrow" />
            </Link>
            <Link
              href="/admin/login"
              className={`px-2.5 py-1.5 transition-colors rounded-lg focus-visible:ring-2 focus-visible:ring-[#C85A17] ${theme.admin}`}
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Toggle Button (Standard 44px min touch target) */}
          <div className={`flex items-center ${theme.mobile}`}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#C85A17] ${theme.toggle}`}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="8" x2="20" y2="8" />
                    <line x1="4" y1="16" x2="20" y2="16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isOpen && (
          <div className={`${theme.mobile} mt-4 pt-4 border-t rounded-xl p-4 shadow-lg space-y-3 ${theme.drawer}`}>
            <div className="space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md ${theme.drawerLink} ${link.highlight ? "text-[#C85A17]" : ""}`}
                >
                  {link.mobileLabel}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-current/10 flex items-center justify-between">
              <Link
                href="/pesan"
                onClick={() => setIsOpen(false)}
                className={theme.cta}
              >
                Pesan Katering
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setIsOpen(false)}
                className={`px-2 py-1 ${theme.admin}`}
              >
                Admin Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
