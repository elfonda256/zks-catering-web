"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MENU_PACKAGES } from "@/data/catering-data";
import { ArrowUpRight, CheckCircle2, Utensils } from "@/components/icons";

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
      {/* Top Controls: Package Switcher & Day Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[#141413]/[0.08]">
        {/* Tier Buttons with Smooth Transition */}
        <div className="flex flex-wrap items-center gap-2">
          {packagesList.map((pkg) => {
            const isSelected = selectedPrice === pkg.price;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPrice(pkg.price)}
                className={`px-5 py-3 rounded-lg text-xs font-semibold transition-all duration-[180ms] active:scale-[0.98] cursor-pointer ${
                  isSelected
                    ? "bg-[#141413] text-[#FAF9F5] shadow-xs"
                    : "bg-[#F3F1E9] text-[#626058] hover:bg-[#E8E5DA] hover:text-[#141413]"
                }`}
              >
                <span className="block font-display text-sm tracking-tight">{pkg.name}</span>
                <span className={`text-[11px] block mt-0.5 transition-colors duration-[180ms] ${isSelected ? "text-[#D96B27]" : "text-[#68655C]"}`}>
                  Rp{pkg.price.toLocaleString("id-ID")} / porsi
                </span>
              </button>
            );
          })}
        </div>

        {/* Day Selector with Animated Sliding Underline */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#68655C] mr-2 shrink-0">
            Rotasi:
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
                  className={`px-3.5 py-2 text-xs font-medium transition-colors duration-[180ms] shrink-0 cursor-pointer active:scale-[0.98] ${
                    isDaySelected
                      ? "text-[#141413] font-semibold"
                      : "text-[#626058] hover:text-[#141413]"
                  }`}
                >
                  {day}
                </button>
              );
            })}

            {/* Apple-style Animated Underline Indicator */}
            <span
              className="absolute bottom-0 h-[2px] bg-[#C85A17] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
              style={{
                left: `${underlineStyle.left}px`,
                width: `${underlineStyle.width}px`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Interactive Catalog Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Package Specifications & Macro Overview (5 Kolom) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#C85A17] uppercase tracking-[0.1em]">
              Karakteristik Sajian
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#141413] tracking-[-0.03em] transition-all duration-300">
              {currentPackage.name}
            </h3>
            <p className="text-sm text-[#626058] leading-relaxed transition-all duration-300">
              {currentPackage.description}
            </p>
          </div>

          {/* Editorial Plate Preview with Crossfade */}
          <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden bg-[#141413] border border-[#141413]/10 shadow-xs">
            <Image
              key={`${selectedPrice}`}
              src="/images/hero-culinary.jpg"
              alt={`Sajian hidangan ${currentPackage.name}`}
              fill
              className="object-cover opacity-90 transition-opacity duration-500 ease-out"
              sizes="(max-width: 1024px) 100vw, 420px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs text-white">
              <span className="font-semibold text-xs text-[#FAF9F5] tracking-tight">
                Standar Porsi Higienis
              </span>
              <span className="text-[11px] font-mono text-[#D96B27]">
                Shift Dapur ZKS
              </span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#F3F1E9] border border-[#141413]/[0.06] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#141413]/[0.08]">
              <span className="text-xs font-medium text-[#626058]">Nilai Investasi:</span>
              <span className="font-display font-bold text-xl text-[#141413]">
                Rp{displayedPrice.toLocaleString("id-ID")}
                <span className="text-xs font-normal text-[#68655C]"> / porsi</span>
              </span>
            </div>

            <div className="space-y-2 text-xs text-[#626058]">
              <p className="font-semibold text-[#141413]">Standar Komposisi Wadah:</p>
              <p className="leading-relaxed">{currentPackage.itemsSummary}</p>
            </div>

            <div className="text-xs text-[#68655C]">
              <strong className="text-[#141413]">Rekomendasi Penempatan:</strong> {currentPackage.idealFor}
            </div>
          </div>

          {/* Premium CTA Buttons with Sprint 05 180ms duration, 4px arrow move, and animated underline */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              href={`/pesan?paket=${selectedPrice}`}
              className="w-full sm:w-auto btn-interactive-primary gap-2 px-6 py-3.5 rounded-lg text-xs font-semibold tracking-tight group shadow-xs"
            >
              <span>Ajukan Pesanan Paket Ini</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70 btn-arrow" />
            </Link>
            <Link
              href="/menu"
              className="w-full sm:w-auto btn-interactive-secondary gap-1.5 px-5 py-3.5 rounded-lg border border-[#141413]/10 text-[#626058] text-xs font-medium hover:text-[#141413] tracking-tight group"
            >
              <span className="btn-text-underline">Lihat Seluruh Rotasi Lengkap</span>
              <ArrowUpRight className="w-3.5 h-3.5 btn-secondary-icon text-[#626058]" />
            </Link>
          </div>
        </div>

        {/* Menu Variations for Selected Day (7 Kolom) with Fade Transition */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#141413]/[0.06]">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#C85A17]" />
              <span className="font-display font-bold text-base text-[#141413]">
                Set Menu Hari {selectedDay}
              </span>
            </div>
            <span className="text-xs font-mono text-[#68655C]">
              4 Pilihan Menu Rotasi
            </span>
          </div>

          {/* Clean Editorial List with Key-based Fade Transition */}
          <div
            key={`${selectedPrice}-${selectedDay}`}
            className="divide-y divide-[#141413]/[0.06] transition-opacity duration-300 ease-out"
          >
            {dayVariations.map((dishes, idx) => {
              const mainDish = dishes[1] || `Variasi #${idx + 1}`;
              return (
                <div
                  key={idx}
                  className="py-5 first:pt-0 last:pb-0 group transition-all duration-[180ms] hover:bg-[#F3F1E9]/50 px-3 rounded-lg -mx-3"
                >
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <span className="font-display font-bold text-base text-[#141413] group-hover:text-[#C85A17] transition-colors duration-[180ms]">
                      {mainDish}
                    </span>
                    <span className="text-[11px] font-mono text-[#68655C] uppercase tracking-wider shrink-0">
                      Menu Varian {idx + 1}
                    </span>
                  </div>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-[#626058]">
                    {dishes.map((dish, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C85A17] shrink-0" />
                        <span className={dIdx === 1 ? "font-semibold text-[#141413]" : ""}>{dish}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Hygiene & Calorie Guarantee Note */}
          <div className="p-4 rounded-lg bg-[#FAF9F5] border border-[#141413]/[0.08] flex items-center gap-3 text-xs text-[#626058]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Seluruh hidangan diproduksi pada hari pengantaran di dapur Ciampel, Karawang dengan standar suhu saji aman dan kontrol gizi seimbang.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
