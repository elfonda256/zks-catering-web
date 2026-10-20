"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@/components/icons";

export default function Navbar() {
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
        isScrolled
          ? "bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#141413]/[0.07] py-3.5 shadow-xs"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      {/* Skip to Main Content Link for Keyboard Accessibility (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-link">
        Lewati ke Konten Utama
      </a>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
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
            <div className="flex flex-col">
              <span className="font-display font-bold text-[#141413] text-sm sm:text-[15px] leading-tight tracking-[-0.02em]">
                PT. Zahdan Kamal Sentosa
              </span>
              <span className="text-[10px] text-[#6B685F] font-medium tracking-[0.06em] uppercase">
                Industrial Catering · Karawang
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium text-[#57544C]">
            <Link
              href="/#operasional"
              className="hover:text-[#141413] transition-colors py-1 focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded-sm"
            >
              Kapasitas &amp; Fasilitas
            </Link>
            <Link
              href="/#keamanan-pangan"
              className="hover:text-[#141413] transition-colors py-1 focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded-sm"
            >
              Standar ISO 22000
            </Link>
            <Link
              href="/#klien-industri"
              className="hover:text-[#141413] transition-colors py-1 focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded-sm"
            >
              Klien Manufaktur
            </Link>
            <Link
              href="/menu"
              className="text-[#C85A17] font-semibold hover:text-[#A4460E] transition-colors py-1 focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded-sm"
            >
              Katalog Menu
            </Link>
            <Link
              href="/#kontak-korporat"
              className="hover:text-[#141413] transition-colors py-1 focus-visible:ring-2 focus-visible:ring-[#C85A17] rounded-sm"
            >
              Kontak Procurement
            </Link>
          </nav>

          {/* Desktop Actions (Minimal, Elegant, Sprint 07 accessible micro-interactions) */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/pesan"
              className="btn-interactive-primary gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-tight group"
            >
              <span>Pesan Katering</span>
              <ArrowUpRight className="w-3 h-3 opacity-70 btn-arrow" />
            </Link>
            <Link
              href="/admin/login"
              className="px-2.5 py-1.5 text-xs font-medium text-[#6B685F] hover:text-[#141413] transition-colors rounded-lg focus-visible:ring-2 focus-visible:ring-[#C85A17]"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Toggle Button (Standard 44px min touch target) */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#141413] hover:bg-[#141413]/[0.05] rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#C85A17]"
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
          <div className="lg:hidden mt-4 pt-4 border-t border-[#141413]/[0.08] bg-[#FAF9F5] rounded-xl p-4 shadow-lg space-y-3">
            <div className="space-y-1">
              <Link
                href="/#operasional"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-[#141413] hover:bg-[#141413]/[0.04] rounded-md"
              >
                Kapasitas & Fasilitas Dapur
              </Link>
              <Link
                href="/#keamanan-pangan"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-[#141413] hover:bg-[#141413]/[0.04] rounded-md"
              >
                Standar ISO 22000
              </Link>
              <Link
                href="/#klien-industri"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-[#141413] hover:bg-[#141413]/[0.04] rounded-md"
              >
                Klien Manufaktur
              </Link>
              <Link
                href="/menu"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-xs font-semibold text-[#C85A17] hover:bg-[#141413]/[0.04] rounded-md"
              >
                Katalog Menu
              </Link>
              <Link
                href="/#kontak-korporat"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-[#141413] hover:bg-[#141413]/[0.04] rounded-md"
              >
                Kontak Procurement
              </Link>
            </div>

            <div className="pt-3 border-t border-[#141413]/[0.08] flex items-center justify-between">
              <Link
                href="/pesan"
                onClick={() => setIsOpen(false)}
                className="btn-interactive-primary px-4 py-2 rounded-md text-xs font-semibold"
              >
                Pesan Katering
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setIsOpen(false)}
                className="text-xs font-medium text-[#8E8B81] hover:text-[#141413] px-2 py-1"
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
