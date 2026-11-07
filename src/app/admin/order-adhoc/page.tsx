"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { formatRupiah, formatNumber } from "@/shared/utils/formatters";

interface ClientOption {
  id: string;
  name: string;
  estate: string;
  defaultDrop: string;
}

const CLIENT_OPTIONS: ClientOption[] = [
  {
    id: "fcc",
    name: "PT FCC Indonesia",
    estate: "Kawasan Industri KIIC Karawang",
    defaultDrop: "Kantin Gedung B - Pos Satpam Gate 2",
  },
  {
    id: "indosafety",
    name: "PT Indosafety Sentosa",
    estate: "Kawasan Industri Surya Cipta Karawang",
    defaultDrop: "Loading Dock Logistik & Kantin Timur",
  },
  {
    id: "indoplating",
    name: "PT Indo Plating Tech",
    estate: "Kawasan Industri Mitra Karawang (KIM)",
    defaultDrop: "Pos Gerbang Utama / Ruang Satpam GA",
  },
  {
    id: "asahimas",
    name: "PT Asahimas Flat Glass Tbk",
    estate: "Kawasan Industri KIIC Karawang",
    defaultDrop: "Kantin Central Plant - Gate 3",
  },
];

interface ShiftOption {
  id: string;
  label: string;
  eatingTime: string;
  targetArrival: string;
}

const SHIFT_OPTIONS: ShiftOption[] = [
  {
    id: "shift-1",
    label: "Shift 1 — Lembur Sore",
    eatingTime: "17:30 - 18:30 WIB",
    targetArrival: "17:00 WIB",
  },
  {
    id: "shift-2",
    label: "Shift 2 — Lembur Malam",
    eatingTime: "21:00 - 22:30 WIB",
    targetArrival: "20:30 WIB",
  },
  {
    id: "shift-3",
    label: "Shift 3 — Lembur Dini Hari",
    eatingTime: "02:00 - 03:30 WIB",
    targetArrival: "01:30 WIB",
  },
];

interface TierOption {
  id: "17k" | "20k" | "25k";
  name: string;
  price: number;
  description: string;
  menuSummary: string;
  badge: string;
}

const TIER_OPTIONS: TierOption[] = [
  {
    id: "17k",
    name: "Tier Basic — Shift Box",
    price: 17000,
    description: "Standard industrial overtime meal untuk lini perakitan & operator.",
    menuSummary: "Nasi Putih Pulen, Ayam Goreng Lengkuas / Fillet Ikan Crispy, Orek Tempe Manis, Sayur Buncis Jagung, Sambal Bajak, Sendok Higienis.",
    badge: "Efisiensi B2B",
  },
  {
    id: "20k",
    name: "Tier Standard — Industrial Nutrition",
    price: 20000,
    description: "Keseimbangan makronutrisi pekerja pabrik bershift malam + protein ganda.",
    menuSummary: "Nasi Putih/Merah, Semur Daging Sapi / Ayam Bakar Bumbu Rujak, Tahu Bacem, Capcay Brokoli Wortel, Buah Segar (Semangka/Pisang), Air Mineral Cup.",
    badge: "Paling Banyak Dipilih",
  },
  {
    id: "25k",
    name: "Tier Premium — Heavy Duty & Executive",
    price: 25000,
    description: "Porsi energi ekstra untuk staf teknis, maintenance lembur akhir pekan, dan supervisor.",
    menuSummary: "Nasi Timbel Daun Pisang, Daging Sapi Lada Hitam / Ayam Panggang Madu, Telur Balado, Cah Kailan Jamur, Kerupuk Udang, Puding Dingin, Air Mineral Botol.",
    badge: "Executive Quality",
  },
];

const QUICK_PORTION_PRESETS = [50, 100, 150, 250, 400, 600];

export default function OrderAdhocPage() {
  const portionInputId = useId();
  const picNameId = useId();
  const picPhoneId = useId();
  const dropPointId = useId();
  const dietaryTextId = useId();

  // Mobile navigation state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form states
  const [selectedClientId, setSelectedClientId] = useState<string>("fcc");
  const [selectedShiftId, setSelectedShiftId] = useState<string>("shift-1");
  const [selectedTierId, setSelectedTierId] = useState<"17k" | "20k" | "25k">("20k");
  const [portionCount, setPortionCount] = useState<number>(150);
  const [picName, setPicName] = useState<string>("Hendra Gunawan (Supervisor GA)");
  const [picPhone, setPicPhone] = useState<string>("0812-9876-5432");
  const [dropPoint, setDropPoint] = useState<string>("Kantin Gedung B - Pos Satpam Gate 2");
  const [dietaryTags, setDietaryTags] = useState<string[]>(["Bebas Seafood / Alergi Udang"]);
  const [dietaryNote, setDietaryNote] = useState<string>("Mohon 25 porsi non-pedas untuk departemen Quality Inspection.");

  // Action status feedback states
  const [isCopied, setIsCopied] = useState(false);
  const [isTransmitted, setIsTransmitted] = useState(false);

  // Active selections
  const currentClient = CLIENT_OPTIONS.find((c) => c.id === selectedClientId) || CLIENT_OPTIONS[0];
  const currentShift = SHIFT_OPTIONS.find((s) => s.id === selectedShiftId) || SHIFT_OPTIONS[0];
  const currentTier = TIER_OPTIONS.find((t) => t.id === selectedTierId) || TIER_OPTIONS[1];

  // Billing Calculations
  const subtotal = portionCount * currentTier.price;
  const ppnRate = 0.11;
  const ppnAmount = Math.round(subtotal * ppnRate);
  const grandTotal = subtotal + ppnAmount;

  // Kitchen Feasibility Logic
  const BOILER_BUFFER_CAPACITY = 850;
  const remainingBuffer = BOILER_BUFFER_CAPACITY - portionCount;

  let feasibilityStatus: "PASS" | "WARNING" | "CRITICAL" = "PASS";
  let feasibilityLabel = "PASS HACCP: Dapur Sentral Mampu Kirim On-Time";
  let feasibilityColor = "text-[#16A34A] bg-[#16A34A]/10 border-[#16A34A]/30";
  let feasibilityMessage = `Kapasitas boiler buffer mencukupi (${remainingBuffer} porsi tersisa). Tim dapur dapat langsung batching otomatis.`;

  if (portionCount > BOILER_BUFFER_CAPACITY && portionCount <= 1200) {
    feasibilityStatus = "WARNING";
    feasibilityLabel = "KITCHEN ATTENTION: Aktivasi Line Boiler Sekunder Diperlukan";
    feasibilityColor = "text-[#D97706] bg-[#D97706]/10 border-[#D97706]/30";
    feasibilityMessage = `Pesanan melebihi buffer aktif (+${Math.abs(remainingBuffer)} porsi). Head Chef Ciampel membutuhkan waktu priming steam boiler cadangan +15 menit.`;
  } else if (portionCount > 1200) {
    feasibilityStatus = "CRITICAL";
    feasibilityLabel = "ALERT CRITICAL: Melebihi Batas Darurat Batching 1 Jam";
    feasibilityColor = "text-[#DC2626] bg-[#DC2626]/10 border-[#DC2626]/30";
    feasibilityMessage = `Kuantitas darurat sangat tinggi (${portionCount} porsi). Wajib koordinasi radio dengan Manajer Produksi Dapur sebelum klik transmisi.`;
  }

  // Dietary tag toggling
  const availableTags = [
    "Bebas Seafood / Alergi Udang",
    "Pemisahan Non-Pedas",
    "Vegetarian / Tanpa Daging",
    "Label Nama Khusus Operator",
  ];

  const toggleTag = (tag: string) => {
    setDietaryTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // WhatsApp Dispatch Generator
  const generateWhatsAppDispatch = () => {
    const todayStr = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return `*SURAT PERINTAH KERJA (SPK) - ORDER LEMBUR AD-HOC*
*PT. ZAHDAN KAMAL SENTOSA (ZKS CATERING)*
Dapur Sentral Ciampel, Karawang (${todayStr})
ISO 22000:2009 | Halal BPJPH ID32110006798080623
--------------------------------------------------
*Klien Pabrik:* ${currentClient.name}
*Lokasi Pabrik:* ${currentClient.estate}
*Jadwal Santap:* ${currentShift.label} (${currentShift.eatingTime})
*Target Tiba Armada:* ${currentShift.targetArrival} (SOP Suhu Bain-Marie > 65°C)
*Jumlah Porsi:* ${portionCount} Porsi
*Paket:* ${currentTier.name} (Rp ${formatNumber(currentTier.price)} / porsi)
*Titik Drop Off:* ${dropPoint}
*PIC Pabrik:* ${picName} (${picPhone})
--------------------------------------------------
*Catatan Pantangan & Alergen:*
${dietaryTags.length > 0 ? dietaryTags.map((t) => `• ${t}`).join("\n") : "• Standar higienis umum"}
${dietaryNote ? `Catatan Tambahan: ${dietaryNote}` : ""}
--------------------------------------------------
*Estimasi Billing B2B Real-Time:*
- Subtotal: ${formatRupiah(subtotal)}
- PPN 11% (Faktur Pajak): ${formatRupiah(ppnAmount)}
- *Grand Total Tagihan:* ${formatRupiah(grandTotal)}
--------------------------------------------------
*Status Feasibility Dapur:*
${feasibilityLabel}
_Diteruskan otomatis dari Konsol Ad-Hoc ZKS ERP Ciampel._`;
  };

  const handleCopyWhatsApp = async () => {
    try {
      const text = generateWhatsAppDispatch();
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      alert("Gagal menyalin format WhatsApp secara otomatis. Silakan salin manual.");
    }
  };

  const handleTransmitKitchen = () => {
    setIsTransmitted(true);
    setTimeout(() => setIsTransmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#F6FBF5] text-[#191C19] flex flex-col md:flex-row antialiased">
      {/* Sidebar PC & Mobile Overlay */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Operational Header Bar */}
        <header className="sticky top-0 z-30 bg-[#F6FBF5]/95 backdrop-blur-md border-b border-[#D7DBD6] px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg bg-[#E8EFE4] text-[#1B4332] border border-[#D7DBD6] hover:bg-[#d8e3d3] transition-colors"
              aria-label="Buka menu navigasi"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold tracking-wider text-[#1B4332] uppercase bg-[#E8EFE4] px-2 py-0.5 rounded border border-[#3F704D]/20">
                  Modul Operasional B2B
                </span>
                <span className="text-[11px] text-[#2D5A3E] hidden sm:inline">
                  • Konsol Dapur Ciampel Karawang
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-sans font-bold text-[#1B4332] tracking-tight mt-0.5">
                Input Pesanan Lembur Ad-Hoc
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="text-[12px] font-medium text-[#1B4332] bg-[#E8EFE4] hover:bg-[#d8e3d3] border border-[#3F704D]/30 px-3 py-1.5 rounded-md transition-colors inline-flex items-center gap-1.5"
            >
              <span>← Konsol Dashboard</span>
            </Link>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Continuous Metric Strip (Apple-Style Top KPI Bar) */}
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {/* KPI 1: Respon Dapur */}
            <div className="p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-[#2D5A3E]">
                <span className="font-semibold uppercase tracking-wider">Respon Dapur</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#1B4332] tabular-nums">15</span>
                <span className="text-xs font-medium text-slate-500">Menit SLA</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Konfirmasi kuota & kesiapan bahan</p>
            </div>

            {/* KPI 2: Lead Time Armada */}
            <div className="p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-[#2D5A3E]">
                <span className="font-semibold uppercase tracking-wider">Lead Time Armada</span>
                <span className="text-[#0284C7] font-mono text-[10px]">Thermobox</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#1B4332] tabular-nums">45</span>
                <span className="text-xs font-medium text-slate-500">Menit</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Ciampel → KIIC / KIM / Surya Cipta</p>
            </div>

            {/* KPI 3: Boiler Buffer Standby */}
            <div className="p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-[#2D5A3E]">
                <span className="font-semibold uppercase tracking-wider">Boiler Buffer</span>
                <span className="text-emerald-700 font-mono text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded font-medium">Aktif</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#16A34A] tabular-nums">850</span>
                <span className="text-xs font-medium text-slate-500">Porsi</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Kapasitas uap thermal nasi & lauk</p>
            </div>

            {/* KPI 4: Standar Suhu Saji */}
            <div className="p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-[#2D5A3E]">
                <span className="font-semibold uppercase tracking-wider">Suhu Saji SOP</span>
                <span className="text-[#D97706] font-mono text-[10px] font-medium">HACCP</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#D97706] tabular-nums">&gt; 65°C</span>
                <span className="text-xs font-medium text-slate-500">Bain-Marie</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Garansi hangat saat tiba di pabrik</p>
            </div>
          </section>

          {/* Transmit Notification Banner (jika terkirim) */}
          {isTransmitted && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl flex items-start gap-3 shadow-xs">
              <div className="p-1 rounded-full bg-emerald-200 text-emerald-800 mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">SPK Berhasil Ditransmisikan ke Dapur Sentral!</h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Dapur Sentral Ciampel telah menerima kuota batching {portionCount} porsi ({currentTier.name}) untuk {currentClient.name}. Armada dispatch bersiap untuk target tiba {currentShift.targetArrival}.
                </p>
              </div>
            </div>
          )}

          {/* FORMULIR 2 KOLOM (Main Interactive Section) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ========================================================
                KOLOM 1 (KIRI, 7-Cols): Single Continuous Form Sheet
               ======================================================== */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 md:p-8 space-y-8 divide-y divide-slate-100">
              {/* Bagian 1: Pabrik Klien & Jadwal Santap */}
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-[#1B4332] uppercase tracking-wider">
                    Langkah 01 / Verifikasi Klien Manufaktur
                  </span>
                  <h2 className="text-lg font-sans font-bold text-[#191C19] tracking-tight mt-0.5">
                    Pabrik Klien & Waktu Jam Santap Lembur
                  </h2>
                </div>

                {/* Pemilihan Pabrik Riil */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wide">
                    Pilih Perusahaan Manufaktur
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CLIENT_OPTIONS.map((client) => {
                      const isSelected = selectedClientId === client.id;
                      return (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => {
                            setSelectedClientId(client.id);
                            setDropPoint(client.defaultDrop);
                          }}
                          className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#E8EFE4] border-[#1B4332] shadow-2xs ring-1 ring-[#1B4332]"
                              : "bg-slate-50/60 border-slate-200 hover:bg-slate-100/70 hover:border-slate-300"
                          }`}
                        >
                          <div className="font-semibold text-xs text-[#191C19] flex items-center justify-between">
                            <span>{client.name}</span>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[#1B4332]" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 truncate">
                            {client.estate}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pemilihan Shift & Jam Santap */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wide">
                    Shift Jam Santap Pekerja
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {SHIFT_OPTIONS.map((shift) => {
                      const isSelected = selectedShiftId === shift.id;
                      return (
                        <button
                          key={shift.id}
                          type="button"
                          onClick={() => setSelectedShiftId(shift.id)}
                          className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#1B4332] text-white border-[#1B4332] shadow-2xs"
                              : "bg-slate-50/60 border-slate-200 text-slate-800 hover:bg-slate-100/70 hover:border-slate-300"
                          }`}
                        >
                          <div className={`font-semibold text-xs ${isSelected ? "text-white" : "text-slate-900"}`}>
                            {shift.label}
                          </div>
                          <div className={`text-[11px] font-mono mt-1 ${isSelected ? "text-emerald-200" : "text-slate-500"}`}>
                            {shift.eatingTime}
                          </div>
                          <div className={`text-[10px] mt-1 ${isSelected ? "text-[#D4AF37]" : "text-[#B38400]"}`}>
                            Tiba: {shift.targetArrival}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bagian 2: Pemilihan Tier Paket Makan & Porsi */}
              <div className="pt-8 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#1B4332] uppercase tracking-wider">
                      Langkah 02 / Menu & Kuantitas
                    </span>
                    <h2 className="text-lg font-sans font-bold text-[#191C19] tracking-tight mt-0.5">
                      Pilihan Tier Paket Makanan & Volume Porsi
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-[#D4AF37] bg-[#1B4332] px-2 py-0.5 rounded font-semibold">
                    ISO 22000 Certified
                  </span>
                </div>

                {/* Tier Selection Rows */}
                <div className="space-y-2.5">
                  {TIER_OPTIONS.map((tier) => {
                    const isSelected = selectedTierId === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTierId(tier.id)}
                        className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? "bg-[#E8EFE4]/60 border-[#1B4332] ring-1 ring-[#1B4332] shadow-2xs"
                            : "bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-[#191C19]">
                                {tier.name}
                              </span>
                              <span className="text-[10px] font-semibold text-[#1B4332] bg-[#E8EFE4] px-2 py-0.5 rounded border border-[#3F704D]/30">
                                {tier.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {tier.description}
                            </p>
                            <div className="mt-2 text-[11px] text-[#2D5A3E] bg-white p-2 rounded-lg border border-slate-200/80 leading-normal">
                              <span className="font-semibold text-slate-800">Spesifikasi Menu: </span>
                              {tier.menuSummary}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-base font-bold font-mono text-[#1B4332] block tabular-nums">
                              {formatRupiah(tier.price)}
                            </span>
                            <span className="text-[10px] text-slate-500">per porsi net</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input Jumlah Porsi & Stepper */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor={portionInputId} className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
                      Jumlah Porsi Lembur
                    </label>
                    <span className="text-[11px] font-mono text-slate-500">
                      Buffer tersisa: <strong className="text-[#16A34A]">{remainingBuffer > 0 ? remainingBuffer : 0} porsi</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPortionCount((prev) => Math.max(10, prev - 25))}
                      className="w-10 h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center font-bold text-lg text-slate-700 cursor-pointer transition-colors shadow-2xs"
                      aria-label="Kurangi 25 porsi"
                    >
                      −
                    </button>
                    <div className="relative flex-1">
                      <input
                        id={portionInputId}
                        type="number"
                        min="1"
                        max="3000"
                        value={portionCount}
                        onChange={(e) => setPortionCount(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full text-center text-xl font-bold font-mono text-[#1B4332] py-2 px-3 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1B4332]"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-sans pointer-events-none">
                        Porsi
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPortionCount((prev) => prev + 25)}
                      className="w-10 h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center font-bold text-lg text-slate-700 cursor-pointer transition-colors shadow-2xs"
                      aria-label="Tambah 25 porsi"
                    >
                      +
                    </button>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-500 mr-1">Preset cepat:</span>
                    {QUICK_PORTION_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setPortionCount(preset)}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                          portionCount === preset
                            ? "bg-[#1B4332] text-white border-[#1B4332]"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {preset} porsi
                      </button>
                    ))}
                  </div>

                  {/* Pengecekan Kitchen Feasibility Status */}
                  <div className={`p-3.5 rounded-xl border mt-3 transition-colors ${feasibilityColor}`}>
                    <div className="flex items-center gap-2 font-bold text-xs">
                      {feasibilityStatus === "PASS" ? (
                        <svg className="w-4 h-4 shrink-0 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : feasibilityStatus === "WARNING" ? (
                        <svg className="w-4 h-4 shrink-0 text-[#D97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 shrink-0 text-[#DC2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span>{feasibilityLabel}</span>
                    </div>
                    <p className="text-[11px] mt-1 leading-normal opacity-90">
                      {feasibilityMessage}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bagian 3: Dietary, PIC & Drop Point */}
              <div className="pt-8 space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-[#1B4332] uppercase tracking-wider">
                    Langkah 03 / Catatan Khusus & PIC Lapangan
                  </span>
                  <h2 className="text-lg font-sans font-bold text-[#191C19] tracking-tight mt-0.5">
                    Dietary Alergen & Titik Serah Terima
                  </h2>
                </div>

                {/* Dietary Tag Toggles */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wide">
                    Pantangan Makanan & Alergen Produksi
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => {
                      const isActive = dietaryTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                            isActive
                              ? "bg-[#1B4332] text-white border-[#1B4332]"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {isActive ? "✓ " : "+ "}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2">
                    <label htmlFor={dietaryTextId} className="sr-only">Instruksi Khusus Dapur</label>
                    <textarea
                      id={dietaryTextId}
                      value={dietaryNote}
                      onChange={(e) => setDietaryNote(e.target.value)}
                      placeholder="Tuliskan catatan khusus dapur jika ada..."
                      rows={2}
                      className="w-full text-xs p-2.5 bg-slate-50/60 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#1B4332] focus:bg-white"
                    />
                  </div>
                </div>

                {/* PIC & Drop Point Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label htmlFor={picNameId} className="block text-[11px] font-semibold text-slate-700 uppercase">
                      Nama PIC Pemesan
                    </label>
                    <input
                      id={picNameId}
                      type="text"
                      value={picName}
                      onChange={(e) => setPicName(e.target.value)}
                      className="mt-1 w-full text-xs p-2.5 bg-slate-50/60 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#1B4332] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label htmlFor={picPhoneId} className="block text-[11px] font-semibold text-slate-700 uppercase">
                      No. WhatsApp / Pos Satpam
                    </label>
                    <input
                      id={picPhoneId}
                      type="text"
                      value={picPhone}
                      onChange={(e) => setPicPhone(e.target.value)}
                      className="mt-1 w-full text-xs p-2.5 bg-slate-50/60 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#1B4332] focus:bg-white font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={dropPointId} className="block text-[11px] font-semibold text-slate-700 uppercase">
                      Titik Drop Off Bongkar Muatan Pabrik
                    </label>
                    <input
                      id={dropPointId}
                      type="text"
                      value={dropPoint}
                      onChange={(e) => setDropPoint(e.target.value)}
                      className="mt-1 w-full text-xs p-2.5 bg-slate-50/60 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#1B4332] focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                KOLOM 2 (KANAN, 5-Cols): Billing Real-Time & Aksi Dispatch
               ======================================================== */}
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
              <div className="bg-[#1B4332] text-[#F6FBF5] p-6 sm:p-7 rounded-2xl border border-[#2D5A3E] shadow-sm space-y-5">
                {/* Header Billing */}
                <div className="border-b border-[#2D5A3E] pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                      Ledger Keuangan B2B
                    </span>
                    <h2 className="text-lg font-sans font-bold text-white tracking-tight mt-0.5">
                      Kalkulator Billing Otomatis
                    </h2>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono bg-[#16382a] border border-[#2D5A3E] px-2 py-0.5 rounded font-medium">
                    E-Faktur Ready
                  </span>
                </div>

                {/* Ringkasan Parameter Pesanan (Flat Apple-Style Ledger Rows) */}
                <div className="space-y-2.5 text-xs text-[#D7DBD6] border-b border-[#2D5A3E] pb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Pabrik Klien:</span>
                    <strong className="text-white text-right truncate max-w-[200px]">{currentClient.name}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Target Shift:</span>
                    <span className="text-white font-medium">{currentShift.label}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Target Tiba:</span>
                    <span className="text-[#D4AF37] font-mono font-bold">{currentShift.targetArrival}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Paket Terpilih:</span>
                    <span className="text-white">{currentTier.name}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-[#2D5A3E]/60">
                    <span className="text-slate-300">Kuantitas:</span>
                    <span className="text-white font-mono font-bold">{formatNumber(portionCount)} Porsi</span>
                  </div>
                </div>

                {/* Calculation Rows */}
                <div className="space-y-2.5 pt-1 text-sm font-mono">
                  <div className="flex justify-between items-center text-[#D7DBD6]">
                    <span className="font-sans text-xs">
                      Subtotal ({formatNumber(portionCount)} × {formatNumber(currentTier.price)})
                    </span>
                    <span className="text-white tabular-nums">{formatRupiah(subtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center text-[#D7DBD6]">
                    <div className="flex items-center gap-1.5 font-sans text-xs">
                      <span>PPN 11% (UU HPP Faktur Pajak)</span>
                      <span className="text-[9px] text-[#D4AF37] bg-[#16382a] px-1 rounded">B2B</span>
                    </div>
                    <span className="text-white tabular-nums">{formatRupiah(ppnAmount)}</span>
                  </div>

                  <div className="border-t border-[#2D5A3E] pt-3.5 mt-2 flex justify-between items-baseline">
                    <div>
                      <span className="font-sans text-xs uppercase font-semibold text-[#D4AF37] block">
                        Grand Total Tagihan SPK
                      </span>
                      <span className="text-[10px] text-[#D7DBD6]/75 font-sans">
                        Faktur Pajak resmi diterbitkan ke NPWP Klien
                      </span>
                    </div>
                    <span className="text-2xl font-bold font-mono text-[#D4AF37] tabular-nums">
                      {formatRupiah(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-[#2D5A3E] space-y-2.5">
                  {/* Button 1: Transmisikan ke Dapur */}
                  <button
                    type="button"
                    onClick={handleTransmitKitchen}
                    disabled={isTransmitted}
                    className="w-full py-3 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#c29f2f] text-[#191C19] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>{isTransmitted ? "SPK Terkirim ke Dapur!" : "Transmisikan SPK ke Dapur Sentral"}</span>
                  </button>

                  {/* Button 2: Salin Dispatch WhatsApp */}
                  <button
                    type="button"
                    onClick={handleCopyWhatsApp}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#2D5A3E] hover:bg-[#3F704D] text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#3F704D]"
                  >
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>{isCopied ? "Format WhatsApp Tersalin!" : "Salin Format Dispatch WhatsApp Dapur & Supir"}</span>
                  </button>
                </div>

                {/* Legal & Compliance Footer Note */}
                <div className="pt-2 text-[10px] text-[#D7DBD6]/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Legalitas Standar:</span>
                    <span className="text-white font-mono">ISO 22000 & Halal BPJPH</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ketentuan Pembayaran:</span>
                    <span className="text-white">TOP 30 Hari (Faktur Pajak B2B)</span>
                  </div>
                </div>
              </div>

              {/* Secondary Guidance / Dispatch Protocol Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-bold text-[#1B4332]">
                  <svg className="w-4 h-4 text-[#D97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Protokol Dispatch Dapur Ciampel:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1 leading-relaxed">
                  <li>Kemasan menggunakan food container microwave-safe berstandar food-grade.</li>
                  <li>Armada pengiriman dilengkapi insulasi thermobox tertutup rapat untuk menjaga suhu &gt; 65°C.</li>
                  <li>Surat Jalan resmi rangkap 3 akan diserahkan kepada Security / PIC saat tiba di pos pabrik.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
