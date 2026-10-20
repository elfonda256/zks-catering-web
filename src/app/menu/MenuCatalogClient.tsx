"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MENU_PACKAGES, COMPANY_PROFILE } from "@/data/catering-data";
import { ArrowUpRight, ShieldCheck, Utensils } from "@/components/icons";

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
    <div className="space-y-14">
      {/* Selector Paket & Hari (Editorial Tabs) */}
      <div className="space-y-6 pb-8 border-b border-[#141413]/[0.08]">
        {/* Tier Buttons */}
        <div>
          <span className="block text-xs font-semibold text-[#8E8B81] uppercase tracking-[0.1em] mb-3">
            01 / Pilih Kategori Anggaran Paket
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.values(MENU_PACKAGES).map((pkg) => {
              const isSelected = selectedPrice === pkg.price;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPrice(pkg.price)}
                  className={`p-5 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#141413] bg-[#141413] text-[#FAF9F5] shadow-sm"
                      : "border-[#141413]/[0.08] bg-[#F3F1E9] text-[#141413] hover:border-[#141413]/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-sm tracking-tight">{pkg.name}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#D96B27]" />
                    )}
                  </div>
                  <p className="font-display font-extrabold text-2xl mt-1.5 tracking-tight">
                    Rp{pkg.price.toLocaleString("id-ID")}
                    <span className={`text-xs font-normal ml-1 ${isSelected ? "text-[#A8A69E]" : "text-[#8E8B81]"}`}>
                      / porsi
                    </span>
                  </p>
                  <p className={`text-xs mt-2 line-clamp-2 ${isSelected ? "text-[#A8A69E]" : "text-[#626058]"}`}>
                    {pkg.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Hari */}
        <div className="pt-2">
          <span className="block text-xs font-semibold text-[#8E8B81] uppercase tracking-[0.1em] mb-3">
            02 / Pilih Siklus Rotasi Hari
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {DAYS.map((day) => {
              const isDaySelected = selectedDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-lg font-medium text-xs transition-all shrink-0 cursor-pointer ${
                    isDaySelected
                      ? "bg-[#C85A17] text-white font-semibold"
                      : "bg-[#F3F1E9] text-[#626058] hover:bg-[#E8E5DA] hover:text-[#141413]"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rincian Paket Terpilih */}
      <div className="p-8 rounded-2xl bg-[#141413] text-[#FAF9F5] flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D96B27]">
            <Utensils className="w-3.5 h-3.5" />
            <span>Sajian Terpilih: Hari {selectedDay}</span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-[#FAF9F5]">
            {currentPackage.name} — Rp{currentPackage.price.toLocaleString("id-ID")} / porsi
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A69E] leading-relaxed">
            {currentPackage.itemsSummary}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            href={`/pesan?paket=${selectedPrice}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#C85A17] text-white font-semibold text-xs hover:bg-[#A4460E] transition-all tracking-tight"
          >
            <span>Pesan Paket Ini Secara Online</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <a
            href={`https://wa.me/${COMPANY_PROFILE.mainWhatsApp}?text=Halo%20PT%20Zahdan%20Kamal%20Sentosa,%20saya%20tertarik%20dengan%20${encodeURIComponent(
              currentPackage.name
            )}%20(Rp${currentPackage.price.toLocaleString("id-ID")})%20untuk%20hari%20${selectedDay}.`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-5 py-3.5 rounded-lg border border-[#FAF9F5]/20 text-[#FAF9F5] text-xs font-medium hover:bg-[#FAF9F5]/[0.05] transition-all"
          >
            Konsultasi WhatsApp
          </a>
        </div>
      </div>

      {/* Variasi Menu Hari Ini (Editorial List Layout) */}
      <div className="space-y-6">
        <div className="flex items-end justify-between pb-4 border-b border-[#141413]/[0.08]">
          <div>
            <span className="text-xs font-semibold text-[#8E8B81] uppercase tracking-[0.1em] block">
              Menu Tersedia
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#141413]">
              Pilihan Set Hidangan Hari {selectedDay}
            </h3>
          </div>
          <span className="text-xs font-mono text-[#8E8B81]">
            4 Opsi Rotasi Berbeda
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dayVariations.map((items, vIndex) => (
            <div
              key={vIndex}
              className="p-7 rounded-xl bg-[#F3F1E9] border border-[#141413]/[0.06] space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#141413]/[0.08] pb-3">
                  <span className="font-display font-bold text-base text-[#141413]">
                    Set Hidangan #{vIndex + 1}
                  </span>
                  <span className="text-[11px] font-mono text-[#8E8B81] uppercase">
                    {selectedDay} · {currentPackage.name}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-[#8E8B81] uppercase tracking-wider">
                    Komposisi Lauk & Sajian:
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#626058]">
                    {items.map((item, itemIdx) => {
                      const isMainDish = itemIdx === 1 || itemIdx === 2;
                      return (
                        <li key={itemIdx} className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isMainDish ? "bg-[#C85A17]" : "bg-[#8E8B81]"
                            }`}
                          />
                          <span className={isMainDish ? "font-bold text-[#141413]" : ""}>
                            {item}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-[#141413]/[0.08] flex items-center justify-between text-xs">
                <span className="text-[#8E8B81] text-[11px]">Dapur Bersertifikasi ISO 22000</span>
                <Link
                  href={`/pesan?paket=${selectedPrice}`}
                  className="font-semibold text-[#141413] hover:text-[#C85A17] transition-colors flex items-center gap-1"
                >
                  <span>Pesan Menu Ini</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ketentuan Pemesanan Korporat */}
      <div className="p-8 rounded-2xl bg-[#FAF9F5] border border-[#141413]/[0.08] space-y-4 text-xs text-[#626058]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C85A17]" />
          <h4 className="font-display font-bold text-sm text-[#141413]">
            Ketentuan & Jaminan Mutu Layanan Katering ZKS
          </h4>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <li className="space-y-1">
            <strong className="text-[#141413] block">Ketentuan Lead Time Pemesanan:</strong>
            <p className="leading-relaxed">
              Pesanan di bawah 500 porsi wajib diajukan minimal H-1 sebelum tanggal acara. Untuk pesanan 500 porsi ke atas, minimal H-3 WIB demi kepastian kapasitas bahan baku segar.
            </p>
          </li>
          <li className="space-y-1">
            <strong className="text-[#141413] block">Skema Pembayaran Bertahap (DP 20%):</strong>
            <p className="leading-relaxed">
              Tersedia fasilitas uang muka (DP) 20% bagi pesanan yang telah dikonfirmasi admin paling lambat H-2 sebelum acara. Sisa tagihan diselesaikan H-1 pukul 23:59 WIB.
            </p>
          </li>
          <li className="space-y-1">
            <strong className="text-[#141413] block">Jangkauan Logistik Kawasan Industri:</strong>
            <p className="leading-relaxed">
              Pengiriman langsung ke kantin perusahaan di KIIC, Suryacipta, KIM, dan Karawang Timur/Barat menggunakan armada boks berinsulasi termal.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
