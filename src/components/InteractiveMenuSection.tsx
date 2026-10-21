"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MENU_PACKAGES } from "@/data/catering-data";
import { ArrowUpRight } from "@/components/icons";

export default function InteractiveMenuSection() {
  const [selectedPrice, setSelectedPrice] = useState<number>(17000);
  const [selectedDay, setSelectedDay] = useState<string>("Senin");
  const [displayedPrice, setDisplayedPrice] = useState<number>(17000);

  const daysContainerRef = useRef<HTMLDivElement>(null);
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const packagesList = Object.values(MENU_PACKAGES);
  const currentPackage = MENU_PACKAGES[selectedPrice as 17000 | 20000 | 25000] || MENU_PACKAGES[17000];
  const dayVariations = currentPackage.schedule[selectedDay] || [];

  const daysList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  // Smooth number transition for price
  useEffect(() => {
    const start = displayedPrice;
    const end = selectedPrice;
    if (start === end) return;

    const startTime = performance.now();
    const duration = 350;
    let animFrameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(start + (end - start) * ease);
      setDisplayedPrice(val);

      if (progress < 1) {
        animFrameId = requestAnimationFrame(tick);
      } else {
        setDisplayedPrice(end);
      }
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [selectedPrice, displayedPrice]);

  // Sliding animated underline for days selector
  useEffect(() => {
    const updateUnderline = () => {
      const container = daysContainerRef.current;
      if (!container) return;
      const activeBtn = container.querySelector(`[data-day="${selectedDay}"]`) as HTMLElement | null;
      if (activeBtn) {
        setUnderlineStyle({
          left: activeBtn.offsetLeft,
          width: activeBtn.offsetWidth,
        });
      }
    };

    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [selectedDay]);

  return (
    <div className="space-y-12">
      {/* Top Controls: Architectural Tier Selector & Day Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#141413]/10">
        {/* Tier Selector (Minimal Monograph Specs, No Identical Rounded Pill Cards) */}
        <div className="flex flex-wrap items-center gap-2">
          {packagesList.map((pkg) => {
            const isSelected = selectedPrice === pkg.price;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPrice(pkg.price)}
                className={`px-4 py-2.5 text-left transition-all duration-[180ms] cursor-pointer border ${
                  isSelected
                    ? "bg-[#141413] text-[#FAF9F5] border-[#141413]"
                    : "bg-transparent text-[#626058] border-[#141413]/15 hover:border-[#141413]/40 hover:text-[#141413]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-wider uppercase opacity-75">
                    TIER
                  </span>
                  <span className="font-display font-bold text-xs tracking-tight">
                    {pkg.name}
                  </span>
                </div>
                <span className={`text-[11px] font-mono block mt-0.5 ${isSelected ? "text-[#D96B27]" : "text-[#8E8B81]"}`}>
                  Rp{pkg.price.toLocaleString("id-ID")}
                </span>
              </button>
            );
          })}
        </div>

        {/* Day Selector with Clean Animated Underline */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8E8B81] mr-2 shrink-0">
            Jadwal:
          </span>
          <div ref={daysContainerRef} className="relative flex items-center gap-1">
            {daysList.map((day) => {
              const isDaySelected = selectedDay === day;
              return (
                <button
                  key={day}
                  data-day={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 font-mono text-xs transition-colors duration-[180ms] shrink-0 cursor-pointer ${
                    isDaySelected
                      ? "text-[#141413] font-bold"
                      : "text-[#8E8B81] hover:text-[#141413]"
                  }`}
                >
                  {day}
                </button>
              );
            })}

            {/* Architectural Sliding Underline Indicator */}
            <span
              className="absolute bottom-0 h-0.5 bg-[#C85A17] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
              style={{
                left: `${underlineStyle.left}px`,
                width: `${underlineStyle.width}px`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Specification Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Nutritional & Operational Spec Sheet (5 Kolom) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
              Spesifikasi Paket Nutrisi
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#141413] tracking-[-0.03em] transition-all duration-300">
              {currentPackage.name}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#626058] leading-relaxed transition-all duration-300">
              {currentPackage.description}
            </p>
          </div>

          {/* Authentic Industrial Grammage Specification Matrix (No Fake Photos, Pure Engineering Specs) */}
          <div className="pt-6 border-t border-[#141413]/10 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#8E8B81]">
                Standar Porsi Industri:
              </span>
              <span className="font-mono text-xs font-bold text-[#141413]">
                Rp{displayedPrice.toLocaleString("id-ID")}
                <span className="font-sans text-[11px] font-normal text-[#8E8B81]"> / porsi</span>
              </span>
            </div>

            <div className="divide-y divide-[#141413]/10 border-y border-[#141413]/10 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#626058]">Karbohidrat (Nasi Pulen)</span>
                <span className="font-mono font-semibold text-[#141413]">~250 gram</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#626058]">Lauk Hewani Utama (Ayam/Daging/Ikan)</span>
                <span className="font-mono font-semibold text-[#141413]">~100 gram</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#626058]">Olahan Sayur &amp; Serat Higienis</span>
                <span className="font-mono font-semibold text-[#141413]">~80 gram</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#626058]">Lauk Nabati / Pendamping</span>
                <span className="font-mono font-semibold text-[#141413]">~40 gram</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#626058]">Pelengkap &amp; Buah Segar</span>
                <span className="font-mono font-semibold text-emerald-800">Termasuk</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-[#626058] pt-1">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#8E8B81] block">
                Alokasi Penggunaan Pabrik:
              </span>
              <p className="leading-relaxed">
                {currentPackage.idealFor}
              </p>
            </div>
          </div>

          {/* Restrained Action Buttons (Supporting Content, Clean Borders) */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              href={`/pesan?paket=${selectedPrice}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#141413] text-[#FAF9F5] hover:bg-[#141413]/90 transition-all text-xs font-semibold tracking-tight active:scale-[0.98]"
            >
              <span>Ajukan Pesanan Paket Ini</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </Link>
            <Link
              href="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 border border-[#141413]/15 text-[#626058] hover:border-[#141413]/40 hover:text-[#141413] transition-all text-xs font-medium tracking-tight active:scale-[0.98]"
            >
              <span>Lihat Seluruh Rotasi Lengkap</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
            </Link>
          </div>
        </div>

        {/* Right Column: Menu Variations for Selected Day (7 Kolom, Pure Whitespace & Typography) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#141413]/10">
            <span className="font-display font-bold text-base text-[#141413]">
              Set Menu Hari {selectedDay}
            </span>
            <span className="font-mono text-[11px] text-[#8E8B81] uppercase tracking-wider">
              4 Pilihan Rotasi Shift
            </span>
          </div>

          {/* Clean Specification Ledger (No Nested Cards, No Bullet Dots) */}
          <div
            key={`${selectedPrice}-${selectedDay}`}
            className="divide-y divide-[#141413]/10 transition-opacity duration-300 ease-out"
          >
            {dayVariations.map((dishes, idx) => {
              const mainDish = dishes[1] || `Variasi #${idx + 1}`;
              return (
                <div
                  key={idx}
                  className="py-6 first:pt-0 last:pb-0 space-y-3"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-display font-bold text-base sm:text-lg text-[#141413]">
                      {mainDish}
                    </span>
                    <span className="font-mono text-[11px] text-[#8E8B81] tracking-wider shrink-0">
                      VAR-0{idx + 1}
                    </span>
                  </div>

                  {/* Clean Dish List (Typography Grid) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs text-[#626058]">
                    {dishes.map((dish, dIdx) => (
                      <div key={dIdx} className="space-y-0.5">
                        <span className="font-mono text-[10px] text-[#8E8B81] block">
                          ITEM 0{dIdx + 1}
                        </span>
                        <span className={`block ${dIdx === 1 ? "font-semibold text-[#141413]" : ""}`}>
                          {dish}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quality Assurance Note (Clean Typographic Line, No Card Container) */}
          <div className="pt-6 border-t border-[#141413]/10 text-xs text-[#8E8B81]">
            <p>
              Dapur Sentral Ciampel — Diproduksi segar pada hari pengantaran dengan standar suhu saji higienis dan kontrol nutrisi seimbang untuk ribuan pekerja industri.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
