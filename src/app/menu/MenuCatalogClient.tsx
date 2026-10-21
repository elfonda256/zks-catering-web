"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MENU_PACKAGES, COMPANY_PROFILE } from "@/data/catering-data";
import { ArrowUpRight } from "@/components/icons";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;
type DayType = (typeof DAYS)[number];

export default function MenuCatalogClient() {
  const searchParams = useSearchParams();
  const rawPaket = Number(searchParams.get("paket"));
  const defaultPrice = [17000, 20000, 25000].includes(rawPaket) ? rawPaket : 17000;

  const [selectedPrice, setSelectedPrice] = useState<number>(defaultPrice);
  const [selectedDay, setSelectedDay] = useState<DayType>("Senin");

  const currentPackage = MENU_PACKAGES[selectedPrice as 17000 | 20000 | 25000] || MENU_PACKAGES[17000];
  const dayVariations = currentPackage.schedule[selectedDay] || [];

  return (
    <div className="space-y-16">
      {/* Top Controls: Tier Switcher & Day Tabs (Architectural Precision, No Rounded Pill Cards) */}
      <div className="space-y-8 pb-8 border-b border-[#141413]/10">
        {/* Tier Selector */}
        <div className="space-y-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8E8B81] block">
            01 / Kategori Anggaran Paket
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.values(MENU_PACKAGES).map((pkg) => {
              const isSelected = selectedPrice === pkg.price;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPrice(pkg.price)}
                  className={`p-6 text-left border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#141413] bg-[#141413] text-[#FAF9F5]"
                      : "border-[#141413]/15 bg-transparent text-[#141413] hover:border-[#141413]/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider opacity-75">
                      TIER {pkg.price === 17000 ? "01" : pkg.price === 20000 ? "02" : "03"}
                    </span>
                    <span className="font-display font-bold text-sm tracking-tight">{pkg.name}</span>
                  </div>
                  <p className="font-display font-extrabold text-2xl mt-2 tracking-tight">
                    Rp{pkg.price.toLocaleString("id-ID")}
                    <span className={`text-xs font-normal ml-1 ${isSelected ? "text-[#A8A69E]" : "text-[#8E8B81]"}`}>
                      / porsi
                    </span>
                  </p>
                  <p className={`text-xs mt-2 leading-relaxed line-clamp-2 ${isSelected ? "text-[#A8A69E]" : "text-[#626058]"}`}>
                    {pkg.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Selector */}
        <div className="space-y-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8E8B81] block">
            02 / Siklus Rotasi Jadwal
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {DAYS.map((day) => {
              const isDaySelected = selectedDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 font-mono text-xs transition-colors shrink-0 cursor-pointer border ${
                    isDaySelected
                      ? "border-[#141413] bg-[#141413] text-[#FAF9F5] font-semibold"
                      : "border-[#141413]/15 bg-transparent text-[#626058] hover:border-[#141413]/40 hover:text-[#141413]"
                  }`}
                >
                  {day.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Package Specification Ledger (Clean Typography, No Floating Bulky Boxes) */}
      <div className="pt-2 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-baseline">
        <div className="lg:col-span-8 space-y-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
            Spesifikasi Terpilih · Hari {selectedDay}
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#141413] tracking-[-0.03em]">
            {currentPackage.name} — Rp{currentPackage.price.toLocaleString("id-ID")} / porsi
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#626058] leading-relaxed max-w-2xl">
            {currentPackage.itemsSummary}
          </p>
        </div>

        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
          <Link
            href={`/pesan?paket=${selectedPrice}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#141413] text-[#FAF9F5] hover:bg-[#141413]/90 transition-all text-xs font-semibold tracking-tight active:scale-[0.98]"
          >
            <span>Pesan Paket Ini Secara Online</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </Link>
          <a
            href={`https://wa.me/${COMPANY_PROFILE.mainWhatsApp}?text=Halo%20PT%20Zahdan%20Kamal%20Sentosa,%20kami%20tertarik%20dengan%20${encodeURIComponent(
              currentPackage.name
            )}%20(Rp${currentPackage.price.toLocaleString("id-ID")})%20untuk%20hari%20${selectedDay}.`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-6 py-3.5 border border-[#141413]/15 text-[#626058] hover:border-[#141413]/40 hover:text-[#141413] transition-all text-xs font-medium tracking-tight active:scale-[0.98]"
          >
            Konsultasi WhatsApp Manajemen
          </a>
        </div>
      </div>

      {/* Variasi Menu Hari Ini (Clean Editorial Schedule Ledger) */}
      <div className="space-y-8 pt-4">
        <div className="flex items-baseline justify-between pb-4 border-b border-[#141413]/10">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8E8B81] block">
              Jadwal Rotasi Shift
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#141413] mt-1">
              4 Pilihan Set Hidangan Hari {selectedDay}
            </h3>
          </div>
          <span className="font-mono text-[11px] text-[#8E8B81]">
            Dapur Sentral Ciampel
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {dayVariations.map((items, vIndex) => (
            <div
              key={vIndex}
              className="space-y-4 pb-6 border-b border-[#141413]/10"
            >
              <div className="flex items-baseline justify-between pb-2 border-b border-[#141413]/10">
                <span className="font-display font-bold text-base text-[#141413]">
                  {items[1] || `Set Hidangan #${vIndex + 1}`}
                </span>
                <span className="font-mono text-[11px] text-[#8E8B81] tracking-wider">
                  VAR-0{vIndex + 1}
                </span>
              </div>

              {/* Clean Typography Grid (No Bullets, No Box Inside Box) */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs text-[#626058]">
                {items.map((item, itemIdx) => {
                  const isMainDish = itemIdx === 1 || itemIdx === 2;
                  return (
                    <div key={itemIdx} className="space-y-0.5">
                      <span className="font-mono text-[10px] text-[#8E8B81] block">
                        ITEM 0{itemIdx + 1}
                      </span>
                      <span className={`block leading-snug ${isMainDish ? "font-bold text-[#141413]" : ""}`}>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-[#8E8B81]">Standar Suhu Saji &gt; 65°C</span>
                <Link
                  href={`/pesan?paket=${selectedPrice}`}
                  className="font-mono text-xs font-semibold text-[#141413] hover:text-[#C85A17] transition-colors inline-flex items-center gap-1"
                >
                  <span>Pesan Varian Ini</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ketentuan Pemesanan Korporat (Clean Architectural Spec Ledger, No Cards) */}
      <div className="pt-8 border-t border-[#141413]/10 space-y-6 text-xs text-[#626058]">
        <div className="space-y-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
            Jaminan Standar Mutu
          </span>
          <h4 className="font-display font-bold text-base sm:text-lg text-[#141413]">
            Ketentuan &amp; Standarisasi Layanan Katering Industri ZKS
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
          <div className="space-y-2 border-l border-[#141413]/10 pl-4">
            <strong className="text-[#141413] block font-mono text-xs">LEAD TIME PEMESANAN</strong>
            <p className="leading-relaxed">
              Pesanan di bawah 500 porsi diajukan minimal H-1 sebelum tanggal acara. Untuk pesanan skala besar (≥ 500 porsi), wajib diajukan minimal H-3 WIB demi kepastian kapasitas bahan baku segar.
            </p>
          </div>
          <div className="space-y-2 border-l border-[#141413]/10 pl-4">
            <strong className="text-[#141413] block font-mono text-xs">SKEMA UANG MUKA (DP 20%)</strong>
            <p className="leading-relaxed">
              Tersedia fasilitas uang muka (DP) 20% bagi pesanan yang dikonfirmasi admin paling lambat H-2 sebelum acara. Sisa tagihan diselesaikan H-1 pukul 23:59 WIB.
            </p>
          </div>
          <div className="space-y-2 border-l border-[#141413]/10 pl-4">
            <strong className="text-[#141413] block font-mono text-xs">LOGISTIK KORIDOR INDUSTRI</strong>
            <p className="leading-relaxed">
              Pengiriman langsung menuju kantin pabrik di KIIC, Suryacipta, KIM, dan Karawang Timur/Barat menggunakan armada boks berinsulasi termal berpengatur suhu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
