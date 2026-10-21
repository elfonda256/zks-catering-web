"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Download, ExternalLink } from "@/components/icons";

export interface DocumentItem {
  id: string;
  category: "Legalitas" | "Dapur" | "Cold Storage" | "Produksi" | "Armada" | "Gudang" | "Office";
  title: string;
  subtitle: string;
  image: string;
  description: string;
  operationalFunction: string;
  auditPurpose: string;
  factoryLocation: string;
  certificationStatus: string;
  relatedSop: string;
  fileSize: string;
  docCode: string;
}

const CATEGORIES = [
  "Semua",
  "Legalitas",
  "Dapur",
  "Cold Storage",
  "Produksi",
  "Armada",
  "Gudang",
  "Office",
] as const;

type CategoryType = (typeof CATEGORIES)[number];

const DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-legalitas",
    category: "Legalitas",
    title: "Sertifikat Laik Higiene Sanitasi & Halal BPJPH",
    subtitle: "Izin Operasional Jasaboga Gol. B & Kepatuhan Syariah",
    image: "/images/profile-docs/legalitas-resmi-1.png",
    description:
      "Arsip legalitas primer izin operasional Jasaboga Golongan B dari Dinas Kesehatan Karawang No. 115/2021 serta Sertifikat Halal resmi Badan Penyelenggara Jaminan Produk Halal (BPJPH) Kemenag RI.",
    operationalFunction:
      "Izin dasar mutlak penyediaan makanan massal untuk industri pabrik PMA dan syarat kualifikasi tender vendor.",
    auditPurpose:
      "Verifikasi kepatuhan hukum jasaboga, uji mikrobiologi berkala Dinkes, dan kepatuhan syariah sertifikasi Halal.",
    factoryLocation: "Kantor Manajemen ZKS, Griya Indah Ciampel, Karawang",
    certificationStatus: "Terverifikasi Aktif · Nomor Registrasi 115/2021 & ID32110001349510223",
    relatedSop: "SOP-LEG-001: Kepatuhan Regulasi & Pembaruan Izin Sanitasi Berkala",
    fileSize: "1.8 MB (PDF)",
    docCode: "DOC-ZKS-LEG-01",
  },
  {
    id: "doc-dapur",
    category: "Dapur",
    title: "Ketel Boiler Uap Industri & Filtrasi Air RO",
    subtitle: "Instalasi Pemurnian Air Murni & Steam Cooking Otomatis",
    image: "/images/profile-docs/galeri-teknologi-ro-steamer.png",
    description:
      "Sistem pembangkit uap boiler bertekanan tinggi untuk memasak serentak volume ribuan porsi, terintegrasi tabung filtrasi Reverse Osmosis (RO) mandiri untuk menjamin kemurnian air konsumsi.",
    operationalFunction:
      "Pemasakan cepat dengan uap konstan menjaga suhu inti masakan > 75°C seragam serta menyediakan air olahan steril bebas kontaminan.",
    auditPurpose:
      "Pengujian berkala kualitas air laboratorium Sucofindo dan uji berkala ketahanan tabung uap boiler bertekanan.",
    factoryLocation: "Dapur Sentral Utama — Zona Utilitas & Thermal, Ciampel",
    certificationStatus: "Standar Stainless Steel 304 & Kualitas Air Uji Lab Sesuai Baku Mutu WHO",
    relatedSop: "SOP-ENG-003: Pemeliharaan Tabung RO & Kalibrasi Tekanan Boiler Masak",
    fileSize: "2.4 MB (PDF)",
    docCode: "DOC-ZKS-DAP-01",
  },
  {
    id: "doc-cold-storage",
    category: "Cold Storage",
    title: "Deep Freezer Rantai Dingin Protein -18°C",
    subtitle: "Unit Pendingin Suhu Rendah Daging, Ayam & Ikan",
    image: "/images/profile-docs/galeri-gudang-freezer.png",
    description:
      "Kamar pendingin dan deretan deep freezer industri dengan kontrol termometer presisi di bawah -18°C guna mengunci kesegaran bahan protein hewani dan menghambat pertumbuhan patogen.",
    operationalFunction:
      "Pengamanan rantai dingin (cold chain) bahan baku protein sebelum proses thawing terjadwal di ruang persiapan.",
    auditPurpose:
      "Audit logbook pemantauan suhu digital harian dan kepatuhan sertifikat Halal dari Rumah Potong Hewan rekanan.",
    factoryLocation: "Gedung Logistik — Zona Rantai Dingin Terisolasi, Ciampel",
    certificationStatus: "Inspeksi Termal 24 Jam Terjaga < -18°C Tanpa Interupsi",
    relatedSop: "SOP-COLD-002: Manajemen Rantai Dingin & Pencatatan Digital Suhu Freezer",
    fileSize: "1.6 MB (PDF)",
    docCode: "DOC-ZKS-CLD-01",
  },
  {
    id: "doc-produksi",
    category: "Produksi",
    title: "Lini Masak Stainless Steel 304 (One-Way Flow)",
    subtitle: "Tata Ruang Produksi Searah Berstandar Higiene",
    image: "/images/profile-docs/galeri-dapur-industri.png",
    description:
      "Fasilitas lantai produksi dapur sentral dengan seluruh meja kerja baja tahan karat SUS 304, tudung pembuangan sentral, serta pemisahan alur ketat antara barang mentah dan matang.",
    operationalFunction:
      "Pengolahan makanan skala industri hingga 5.000+ porsi/hari dengan alur kerja bebas perpotongan alur kotor dan bersih.",
    auditPurpose:
      "Peninjauan denah tata ruang HACCP, sertifikasi food handling koki, dan sanitasi berkala permukaan kontak makanan.",
    factoryLocation: "Lantai Produksi Dapur Sentral ZKS, Ciampel Karawang",
    certificationStatus: "Audit Sanitasi Berkala Dinas Kesehatan Karawang & Tim HSE Klien",
    relatedSop: "SOP-PRD-001: Tata Tertib Masuk Ruang Produksi & Sanitasi Meja Stainless",
    fileSize: "2.1 MB (PDF)",
    docCode: "DOC-ZKS-PRD-01",
  },
  {
    id: "doc-armada",
    category: "Armada",
    title: "Dok Distribusi & Armada Van Tertutup Bersekat",
    subtitle: "Pengantaran Rantai Panas Tepat Waktu Antar Shift",
    image: "/images/profile-docs/galeri-packing-armada.png",
    description:
      "Fasilitas dok pemuatan dan armada tertutup khusus pengiriman katering kargo kering/panas menuju kantin pabrik di kawasan KIIC, Suryacipta, KIM, dan sekitarnya.",
    operationalFunction:
      "Pengantaran bento box dan thermal container dengan estimasi waktu tempuh rata-rata di bawah 35 menit di area Karawang.",
    auditPurpose:
      "Pemeriksaan kebersihan berkala kabin kendaraan, pencatatan waktu keberangkatan/kedatangan, dan uji ketahanan panas boks.",
    factoryLocation: "Dok Logistik & Distribusi ZKS, Ciampel Karawang",
    certificationStatus: "Armada Khusus Makanan Bersih & Kelaikan Jalan Uji Dishub",
    relatedSop: "SOP-LOG-004: Prosedur Pengiriman Tepat Waktu & Protokol Kebersihan Armada",
    fileSize: "1.9 MB (PDF)",
    docCode: "DOC-ZKS-ARM-01",
  },
  {
    id: "doc-gudang",
    category: "Gudang",
    title: "Gudang Bahan Kering & Manajemen Inventaris FIFO",
    subtitle: "Penyimpanan Bahan Baku Pokok Tonase di Atas Palet",
    image: "/images/profile-docs/galeri-fasilitas-operasional.png",
    description:
      "Gudang logistik bahan kering (beras, minyak, bumbu kemasan) dengan sirkulasi udara terkontrol, rak penyimpanan bertingkat, serta palet bebas kontak langsung dengan lantai.",
    operationalFunction:
      "Penyimpanan cadangan stok aman bahan pangan untuk menjamin keberlanjutan suplai catering pabrik tanpa gangguan kelangkaan pasar.",
    auditPurpose:
      "Pemeriksaan kartu kendali First-In First-Out (FIFO), masa kedaluwarsa bahan, dan sertifikasi pengendalian hama (pest control).",
    factoryLocation: "Zona Gudang Logistik Kering Dapur ZKS, Ciampel",
    certificationStatus: "Rotasi FIFO Terdata & Bebas Hama Bersertifikat Pest Control",
    relatedSop: "SOP-WHS-002: Tata Kelola Penyimpanan Kering & Pengendalian Inventaris FIFO",
    fileSize: "1.5 MB (PDF)",
    docCode: "DOC-ZKS-GDG-01",
  },
  {
    id: "doc-office",
    category: "Office",
    title: "Gedung Kantor Manajemen & Ruang Audiensi Audit",
    subtitle: "Pusat Tata Kelola Administrasi & Penerimaan Auditor",
    image: "/images/profile-docs/galeri-gedung-kantor.png",
    description:
      "Fasilitas kantor mandiri milik PT Zahdan Kamal Sentosa di Griya Indah Ciampel yang dilengkapi ruang rapat ber-AC untuk audiensi resmi tender, presentasi menu, dan audit vendor.",
    operationalFunction:
      "Pusat tata kelola operasional perusahaan, arsip legalitas fisik, administrasi keuangan, dan fasilitas penerimaan audit pabrik.",
    auditPurpose:
      "Verifikasi legalitas perusahaan (Akta Notaris, NIB OSS, NPWP), struktur organisasi, dan kesiapan fasilitas pendukung.",
    factoryLocation: "Perum Griya Indah Blok D1 No. 19, Parung Mulya, Ciampel Karawang",
    certificationStatus: "Aset Bangunan Kepemilikan Mandiri Resmi Terdaftar OSS NIB",
    relatedSop: "SOP-ADM-005: Protokol Penerimaan Kunjungan Audit & Keamanan Kantor",
    fileSize: "1.4 MB (PDF)",
    docCode: "DOC-ZKS-OFC-01",
  },
];

export default function CompanyVerificationGallery() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("Semua");
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem>(DOCUMENTS[0]);

  const stripRef = useRef<HTMLDivElement>(null);
  const categoryNavRef = useRef<HTMLDivElement>(null);

  // Mouse Dragging states for document strip
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Filtered documents based on active category
  const filteredDocs =
    activeCategory === "Semua"
      ? DOCUMENTS
      : DOCUMENTS.filter((doc) => doc.category === activeCategory);

  // Update selected doc if current doc is not in filtered list
  const handleSelectCategory = (cat: CategoryType) => {
    setActiveCategory(cat);
    if (cat === "Semua") return;
    const match = DOCUMENTS.find((doc) => doc.category === cat);
    if (match) {
      setSelectedDoc(match);
    }
  };

  // Convert vertical mouse wheel into horizontal scroll on document strip
  const handleWheel = useCallback((e: WheelEvent) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      if (stripRef.current && stripRef.current.contains(e.target as Node)) {
        e.preventDefault();
        stripRef.current.scrollLeft += e.deltaY;
      }
    }
  }, []);

  useEffect(() => {
    const stripEl = stripRef.current;
    if (stripEl) {
      stripEl.addEventListener("wheel", handleWheel, { passive: false });
      return () => stripEl.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  // Mouse Drag Event Handlers for smooth momentum feeling
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stripRef.current) return;
    isMouseDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - stripRef.current.offsetLeft;
    scrollLeftRef.current = stripRef.current.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current || !stripRef.current) return;
    e.preventDefault();
    const x = e.pageX - stripRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.2;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    stripRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const onMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const onMouseLeave = () => {
    isMouseDownRef.current = false;
  };

  return (
    <section
      id="verifikasi-dokumen"
      className="py-24 sm:py-32 bg-[#FAF9F5] relative"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10 sm:space-y-12">
        {/* Section Header: Editorial & Architectural */}
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#8E8B81] block">
            Eksplorer Arsip &amp; Verifikasi Industri
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#141413] tracking-[-0.03em] leading-tight">
            Dokumentasi Fasilitas &amp; Kualifikasi Legalitas Resmi.
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#626058] font-normal leading-relaxed">
            Akses langsung bukti fisik kapasitas dapur, kepatuhan sanitasi, unit pendingin, dan perizinan operasional PT Zahdan Kamal Sentosa untuk kepastian audit vendor.
          </p>
        </div>

        {/* ==============================================================
            PART 1: HORIZONTAL CATEGORY NAVIGATION
            - Smooth horizontal scroll
            - Hidden scrollbar
            - Snap scrolling
            - Desktop mouse wheel horizontal & Mobile touch swipe
            ============================================================== */}
        <div className="relative border-b border-[#141413]/10">
          <div
            ref={categoryNavRef}
            className="flex items-center gap-8 sm:gap-10 overflow-x-auto scrollbar-none snap-x pb-4"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`shrink-0 text-xs sm:text-sm tracking-tight transition-colors duration-200 pb-1 cursor-pointer whitespace-nowrap snap-start ${
                    isActive
                      ? "text-[#141413] font-semibold border-b-2 border-[#141413] -mb-[17px]"
                      : "text-[#8E8B81] font-medium hover:text-[#141413]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ==============================================================
            MAIN EXPLORER LAYOUT:
            Left Column: Document Strip (PART 2) + Live High-Res Loupe
            Right Column: Inspector Panel (PART 3)
            ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Kolom Kiri: Document Strip & Visual Viewer (7 Kolom di Desktop) */}
          <div className="lg:col-span-7 space-y-6">
            {/* PART 2: SCROLLABLE DOCUMENT STRIP */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8E8B81] px-0.5">
                <span>Daftar Dokumen Terdaftar ({filteredDocs.length})</span>
                <span className="hidden sm:inline">Geser atau Seret untuk Menjelajah</span>
              </div>

              <div
                ref={stripRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                className="flex items-start gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory py-2 cursor-grab active:cursor-grabbing select-none"
              >
                {filteredDocs.map((doc) => {
                  const isSelected = selectedDoc.id === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => {
                        if (!hasDraggedRef.current) {
                          setSelectedDoc(doc);
                        }
                      }}
                      className={`w-[270px] sm:w-[290px] shrink-0 snap-start transition-opacity duration-[220ms] ease-out ${
                        isSelected ? "opacity-100" : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* Large Preview */}
                      <div
                        className={`relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-neutral-100 transition-all duration-[220ms] ease-out ${
                          isSelected
                            ? "ring-2 ring-[#141413] ring-offset-2 ring-offset-[#FAF9F5] shadow-md -translate-y-[2px]"
                            : "border border-[#141413]/10 hover:-translate-y-[2px] hover:shadow-md"
                        }`}
                      >
                        <Image
                          src={doc.image}
                          alt={doc.title}
                          fill
                          sizes="300px"
                          className="object-cover object-center pointer-events-none"
                        />
                      </div>

                      {/* Small Title & Subtitle */}
                      <div className="pt-2.5 px-0.5 space-y-0.5">
                        <h4 className="text-xs font-semibold text-[#141413] tracking-tight truncate">
                          {doc.title}
                        </h4>
                        <p className="text-[11px] text-[#8E8B81] tracking-tight truncate">
                          {doc.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* High-Resolution Focus View of Selected Document */}
            <div className="relative aspect-[16/10] sm:aspect-[16/11] w-full rounded-xl overflow-hidden border border-[#141413]/10 bg-neutral-900 shadow-sm transition-all duration-[220ms] ease-out">
              <Image
                src={selectedDoc.image}
                alt={selectedDoc.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-contain object-center transition-opacity duration-[220ms] ease-out"
              />
              <div className="absolute top-3 left-3 bg-[#141413]/80 backdrop-blur-xs text-[#FAF9F5] text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded">
                {selectedDoc.docCode}
              </div>
            </div>
          </div>

          {/* ==============================================================
              PART 3: INSPECTOR PANEL
              - Updates instantly on card click (No modal, No popup, No reload)
              - Apple style, large hierarchy, text aligned, high readability
              - Outlined buttons (NOT giant black buttons)
              - 220ms mechanical transition
              ============================================================== */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#141413]/10 p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Header: Category & Doc Code */}
            <div className="flex items-center justify-between border-b border-[#141413]/10 pb-3.5">
              <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#C85A17] font-semibold">
                {selectedDoc.category} · {selectedDoc.docCode}
              </span>
              <span className="text-[11px] font-mono text-[#8E8B81]">
                {selectedDoc.fileSize}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#141413] tracking-tight leading-snug">
                {selectedDoc.title}
              </h3>
              <p className="text-xs text-[#8E8B81]">
                {selectedDoc.subtitle}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#484640] leading-relaxed">
              {selectedDoc.description}
            </p>

            {/* Architectural Inspector Specs */}
            <div className="space-y-4 pt-2 border-t border-[#141413]/10">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8B81] block">
                  Fungsi Operasional
                </span>
                <p className="text-xs sm:text-sm text-[#141413] font-medium leading-relaxed">
                  {selectedDoc.operationalFunction}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8B81] block">
                  Tujuan Audit Klien
                </span>
                <p className="text-xs sm:text-sm text-[#141413] font-medium leading-relaxed">
                  {selectedDoc.auditPurpose}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8B81] block">
                  Lokasi Fasilitas
                </span>
                <p className="text-xs sm:text-sm text-[#141413] font-medium">
                  {selectedDoc.factoryLocation}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8B81] block">
                  Status Sertifikasi
                </span>
                <p className="text-xs sm:text-sm text-emerald-800 font-medium">
                  {selectedDoc.certificationStatus}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8B81] block">
                  SOP Terkait
                </span>
                <p className="text-xs sm:text-sm text-[#141413] font-mono">
                  {selectedDoc.relatedSop}
                </p>
              </div>
            </div>

            {/* Outlined Action Buttons (NOT giant black buttons) */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#141413]/10">
              <a
                href={selectedDoc.image}
                download={`${selectedDoc.docCode}.png`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#141413]/25 hover:border-[#141413] hover:bg-[#141413]/5 text-[#141413] text-xs font-semibold tracking-tight transition-colors duration-[220ms] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#141413]" />
                <span>Unduh Salinan PDF</span>
              </a>

              <a
                href={selectedDoc.image}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#141413]/25 hover:border-[#141413] hover:bg-[#141413]/5 text-[#141413] text-xs font-semibold tracking-tight transition-colors duration-[220ms]"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#141413]" />
                <span>Buka Resolusi Penuh</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
