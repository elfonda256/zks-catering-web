"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ArrowUpRight, ArrowLeft, ArrowRight, ShieldCheck, FileCheck, CheckCircle2, X } from "@/components/icons";

interface EvidenceItem {
  id: string;
  categoryCode: string;
  categoryLabel: string;
  title: string;
  shortDesc: string;
  image: string;
  evidenceCount: string;
  itemsList: string[];
  // Fullscreen Technical Specification Fields
  specs: {
    nama: string;
    kategori: string;
    lokasi: string;
    tanggal: string;
    keterangan: string;
    auditStatus: string;
    dokumenPendukung: string[];
    verification: string;
  };
}

const EVIDENCE_ARCHIVE: EvidenceItem[] = [
  {
    id: "legalitas-01",
    categoryCode: "LEGALITAS",
    categoryLabel: "LEGALITAS & IZIN RESMI",
    title: "Sertifikasi Mutu & Izin Jasaboga Gol. B",
    shortDesc: "Dokumen primer izin Laik Higiene Sanitasi resmi Dinkes No. 115/2021, Halal BPJPH, SPPL Lingkungan, & BPJS Ketenagakerjaan.",
    image: "/images/profile-docs/legalitas-resmi-1.png",
    evidenceCount: "4 Dokumen Primer Terverifikasi",
    itemsList: ["Laik Higiene Dinkes Gol. B", "Halal BPJPH ID32110001349510223", "Surat Lingkungan SPPL", "BPJS Ketenagakerjaan"],
    specs: {
      nama: "Sertifikat Laik Hygiene Sanitasi Jasaboga Golongan B & Sertifikat Halal BPJPH",
      kategori: "Kepatuhan Hukum & Legalitas Primer Pemerintah",
      lokasi: "Arsip Fisik Kantor Manajemen ZKS, Griya Indah Ciampel",
      tanggal: "No. 115 Tahun 2021 / Berlaku Penuh 2026",
      keterangan: "Legalitas resmi dan mutlak untuk kualifikasi tender katering pabrik multinasional PMA di Kawasan Industri KIIC, Suryacipta, KIM, dan BIC.",
      auditStatus: "Terverifikasi Aktif & Lolos Inspeksi Sanitasi Berkala",
      dokumenPendukung: [
        "Sertifikat Dinkes Karawang No. 115/2021 (Golongan B)",
        "Sertifikat Halal Resmi BPJPH No. ID32110001349510223",
        "Surat Pernyataan Kesanggupan Lingkungan Hidup (SPPL)",
        "Sertifikat Kepesertaan Jamsostek / BPJS Ketenagakerjaan",
      ],
      verification: "QR Code Resmi Dinas Kesehatan & BPJPH Kemenag RI",
    },
  },
  {
    id: "dapur-01",
    categoryCode: "DAPUR SENTRAL",
    categoryLabel: "TEKNOLOGI PENGOLAHAN",
    title: "Ketel Boiler Uap & Pemurnian Air RO",
    shortDesc: "Tabung filtrasi Reverse Osmosis berkapasitas industri untuk air memasak bebas kontaminasi serta ketel boiler masak uap volume tinggi.",
    image: "/images/profile-docs/galeri-teknologi-ro-steamer.png",
    evidenceCount: "4 Unit Mesin Industri Utama",
    itemsList: ["Filter Air Reverse Osmosis", "Steamer Sayur Uap Khusus", "Ketel Boiler Masak Kuah", "Wastafel Stainless Steel 304"],
    specs: {
      nama: "Instalasi Tabung Filtrasi Air Reverse Osmosis (RO) & Ketel Boiler Uap Tekanan Tinggi",
      kategori: "Infrastruktur Mesin Pengolahan & Sanitasi Air",
      lokasi: "Zona Pengolahan Utama Dapur Sentral ZKS, Ciampel",
      tanggal: "Inspeksi & Kalibrasi Berkala Q1 2026",
      keterangan: "Pemasakan serentak volume tinggi dengan uap bertekanan konstan memastikan suhu inti masakan > 75°C seragam dan kelembutan serat daging terjaga tanpa kehilangan nutrisi.",
      auditStatus: "Lolos Uji Tekanan Boiler & Standar Air RO Bebas Logam Berat",
      dokumenPendukung: [
        "Hasil Uji Laboratorium Kualitas Air RO Sucofindo",
        "Logbook Kalibrasi Manometer Tekanan Boiler",
        "SOP Perawatan Rutin Mesin Filtrasi Mandiri",
        "Log Pembersihan Berkala Ketel Uap Makanan",
      ],
      verification: "Food-Grade Stainless Steel 304 & Standar WHO Air Minum",
    },
  },
  {
    id: "dapur-02",
    categoryCode: "ALUR PRODUKSI",
    categoryLabel: "DAPUR INDUSTRI",
    title: "Lini Masak Stainless Steel 304 & One-Way Flow",
    shortDesc: "Fasilitas dapur mandiri berkapasitas 5.000+ porsi/hari dengan meja kerja stainless food-grade dan pemisahan alur bahan mentah vs matang.",
    image: "/images/profile-docs/galeri-dapur-industri.png",
    evidenceCount: "5.000+ Porsi / Hari Kapasitas Riil",
    itemsList: ["Alur Kerja Searah (One-Way)", "Full Meja Kerja Stainless 304", "Exhaust Hood Sentral", "Kru Masak Ber-APD Lengkap"],
    specs: {
      nama: "Lini Kerja Dapur Sentral Industri Stainless Steel 304 (One-Way Production Flow)",
      kategori: "Tata Kelola Ruang Produksi & Pencegahan Kontaminasi",
      lokasi: "Gedung Dapur Sentral Mandiri ZKS, Ciampel Karawang",
      tanggal: "Operasional Aktif 24 Jam 3 Shift",
      keterangan: "Desain tata ruang dapur menerapkan prinsip alur searah higienis (one-way flow) guna mencegah kontaminasi silang antara penerimaan bahan mentah dengan masakan matang siap saji.",
      auditStatus: "Sesuai Pedoman Sanitasi Jasaboga Kemenkes & ISO 22000",
      dokumenPendukung: [
        "Denah Alur Produksi Higienis (HACCP Floor Layout)",
        "Jadwal Pembersihan Sentral Harian (Sanitation Schedule)",
        "Sertifikat Food Handler Kepala Dapur & Koki Utama",
        "Pencatatan Suhu Inti Masak Probe Digital Harian",
      ],
      verification: "Audit Dinas Kesehatan & Tim HRGA Perusahaan Klien",
    },
  },
  {
    id: "gudang-01",
    categoryCode: "GUDANG & LOGISTIK",
    categoryLabel: "RANTAI DINGIN PROTEIN",
    title: "Cold Storage Freezer & Gudang Bahan FIFO",
    shortDesc: "Deretan deep freezer suhu -18°C untuk menjaga rantai dingin daging dan ayam, gudang beras skala tonase, serta rak bumbu bersistem FIFO.",
    image: "/images/profile-docs/galeri-gudang-freezer.png",
    evidenceCount: "3 Zona Penyimpanan Terisolasi",
    itemsList: ["Deep Freezer Beku -18°C", "Gudang Beras Skala Tonase", "Ruang Racik Bumbu Terpisah", "Manajemen Rotasi FIFO"],
    specs: {
      nama: "Fasilitas Rantai Dingin Deep Freezer & Gudang Bahan Kering Berstandar FIFO",
      kategori: "Manajemen Penyimpanan Bahan Baku & Rantai Dingin",
      lokasi: "Zona Gudang Logistik Terisolasi ZKS, Ciampel",
      tanggal: "Monitoring Digital Suhu 24 Jam Terus Menerus",
      keterangan: "Kapasitas penyimpanan bahan protein hewani dan bahan baku kering mampu menopang lonjakan permintaan katering lembur pabrik hingga ribuan porsi secara mendadak.",
      auditStatus: "Terjaga di Bawah -18°C untuk Daging & Suhu Sejuk untuk Kering",
      dokumenPendukung: [
        "Lembar Checklist Pemantauan Termometer Cold Room",
        "Kartu Kontrol Inventaris Rotasi Bahan FIFO",
        "Sertifikat Halal & Uji Rantai Dingin Pemasok Daging",
        "Surat Keterangan Bebas Pengawet Berbahaya",
      ],
      verification: "First-In First-Out (FIFO) Inventory Control Matrix",
    },
  },
  {
    id: "packing-01",
    categoryCode: "PACKING & ARMADA",
    categoryLabel: "DISTRIBUSI SHIFT",
    title: "Ruang Pemorsian Steril & Armada Van Tertutup",
    shortDesc: "Pemorsian bento di ruang ber-AC terisolasi, dilanjutkan loading ke armada tertutup Daihatsu Gran Max untuk pengantaran tepat waktu ke pabrik.",
    image: "/images/profile-docs/galeri-packing-armada.png",
    evidenceCount: "12+ Unit Armada Logistik Siaga",
    itemsList: ["Ruang Packing Ber-AC Terisolasi", "Pemorsian Bento Box Higienis", "Armada Van Tertutup ZKS", "Insulated Box Penjaga Panas"],
    specs: {
      nama: "Ruang Pengemasan Makanan Berpenyaring Udara & Dok Pengiriman Armada Logistik",
      kategori: "Pengemasan Higienis & Distribusi Rantai Panas",
      lokasi: "Zona Distribusi Akhir Dapur Ciampel Karawang",
      tanggal: "Jadwal Kirim 24 Jam (Shift Pagi, Siang, Malam, Lembur)",
      keterangan: "Armada van tertutup berpengatur suhu menjamin waktu transit rata-rata di bawah 35 menit menuju kawasan industri Karawang dengan kondisi makanan tetap segar dan hangat.",
      auditStatus: "Sanitasi Armada Harian & Waktu Tempuh Terukur GPS",
      dokumenPendukung: [
        "Daftar Registrasi Armada Operasional Daihatsu Gran Max",
        "Jadwal Rute & Manifest Distribusi Shift Manufaktur",
        "SOP Penggunaan APD (Hairnet, Masker, Sarung Tangan Nitril)",
        "Uji Kebersihan Wadah Makanan & Thermal Retention Test",
      ],
      verification: "Transit Time < 35 Menit ke Seluruh Kawasan Karawang",
    },
  },
  {
    id: "sdm-01",
    categoryCode: "KUALIFIKASI SDM",
    categoryLabel: "KESEHATAN & KOMPETENSI",
    title: "Medical Check Up Rutin & Sertifikasi Penjamah",
    shortDesc: "Hasil MCU berkala dari CHIO Medical Center untuk seluruh kru, didukung sertifikat kursus higiene penjamah makanan dari Dinas Kesehatan.",
    image: "/images/profile-docs/legalitas-sdm-mcu.png",
    evidenceCount: "100% Kru Bebas Penyakit Menular",
    itemsList: ["Hasil MCU CHIO Medical Center", "Sertifikat Penjamah Makanan", "Kursus Higiene Penanggung Jawab", "Vaksinasi & Bebas Tifus"],
    specs: {
      nama: "Dokumentasi Medical Check Up Kru Dapur & Sertifikat Kursus Higiene Sanitasi",
      kategori: "Kualifikasi Kesehatan Kerja & Higiene SDM",
      lokasi: "Faskes Mitra CHIO Medical Center & Arsip SDM ZKS",
      tanggal: "Pemeriksaan Berkala Semesteran 2025/2026",
      keterangan: "Seluruh koki, staf persiapan, pengemasan, dan pengemudi wajib menjalani uji laboratorium berkala guna memastikan tidak ada carrier penyakit menular pada rantai pasok makanan.",
      auditStatus: "100% Kru Dapur Lulus Skrining & Terverifikasi Sehat",
      dokumenPendukung: [
        "Hasil Laboratorium Darah & Usap Dubur (Rectal Swab)",
        "Sertifikat Pelatihan Keamanan Pangan Kemenkes RI",
        "Sertifikat Kursus Higiene Penanggung Jawab (Didiet Santoso)",
        "Buku Catatan Kesehatan Karyawan & Vaksinasi",
      ],
      verification: "Sertifikasi Resmi Dinas Kesehatan Kabupaten Karawang",
    },
  },
  {
    id: "fasilitas-01",
    categoryCode: "KANTOR PUSAT",
    categoryLabel: "FASILITAS MANDIRI",
    title: "Gedung Kantor Mandiri & Ruang Rapat Audit",
    shortDesc: "Gedung operasional mandiri di Griya Indah Ciampel Karawang dengan ruang rapat eksekutif untuk pembahasan kontrak dan audit vendor.",
    image: "/images/profile-docs/galeri-gedung-kantor.png",
    evidenceCount: "Gedung Kepemilikan Sendiri",
    itemsList: ["Gedung Kantor Mandiri Ciampel", "Ruang Rapat Eksekutif Ber-AC", "Ruang Admin & Keuangan", "Siap Disurvei Kapan Saja"],
    specs: {
      nama: "Gedung Fasilitas Operasional Mandiri & Kantor Manajemen PT. Zahdan Kamal Sentosa",
      kategori: "Infrastruktur Kantor & Tata Kelola Korporat",
      lokasi: "Griya Indah Ciampel Blok B No. 16, Karawang",
      tanggal: "Beroperasi Mandiri Sejak 2007",
      keterangan: "Pusat tata kelola administrasi legalitas, quality control, customer care, dan tempat penerimaan kunjungan audit pabrik dari tim Purchasing / HRGA klien korporat.",
      auditStatus: "Fasilitas Fisik Terdaftar di OSS NIB 241121002398",
      dokumenPendukung: [
        "Nomor Induk Berusaha (NIB KBLI Industri Jasaboga)",
        "Nomor Pokok Wajib Pajak (NPWP Resmi Perusahaan)",
        "Akta Notaris Pendirian & Perubahan PT ZKS",
        "Surat Keterangan Domisili Usaha & Denah Lokasi",
      ],
      verification: "Lokasi Riil Siap Dikunjungi / Diaudit Fisik",
    },
  },
];

export default function CompanyVerificationGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerItem, setViewerItem] = useState<EvidenceItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const carouselRef = useRef<HTMLDivElement>(null);
  const isWheelingRef = useRef(false);

  // Scroll to active card index
  const scrollToIndex = useCallback((index: number) => {
    if (!carouselRef.current) return;
    const items = carouselRef.current.children;
    if (items[index]) {
      const targetElement = items[index] as HTMLElement;
      targetElement.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
      setActiveIndex(index);
    }
  }, []);

  // Keyboard navigation for carousel & modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewerItem) {
        if (e.key === "Escape") {
          setViewerItem(null);
          setZoomLevel(1);
          setPanPosition({ x: 0, y: 0 });
        } else if (e.key === "ArrowLeft") {
          const currentIndex = EVIDENCE_ARCHIVE.findIndex((item) => item.id === viewerItem.id);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : EVIDENCE_ARCHIVE.length - 1;
          setViewerItem(EVIDENCE_ARCHIVE[prevIndex]);
          setZoomLevel(1);
          setPanPosition({ x: 0, y: 0 });
        } else if (e.key === "ArrowRight") {
          const currentIndex = EVIDENCE_ARCHIVE.findIndex((item) => item.id === viewerItem.id);
          const nextIndex = currentIndex < EVIDENCE_ARCHIVE.length - 1 ? currentIndex + 1 : 0;
          setViewerItem(EVIDENCE_ARCHIVE[nextIndex]);
          setZoomLevel(1);
          setPanPosition({ x: 0, y: 0 });
        }
        return;
      }

      // Main Carousel keys
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => {
          const next = prev > 0 ? prev - 1 : EVIDENCE_ARCHIVE.length - 1;
          scrollToIndex(next);
          return next;
        });
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => {
          const next = prev < EVIDENCE_ARCHIVE.length - 1 ? prev + 1 : 0;
          scrollToIndex(next);
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewerItem, scrollToIndex]);

  // Horizontal mouse wheel interaction over carousel
  const handleCarouselWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      carouselRef.current.scrollLeft += e.deltaY * 0.8;
      // Debounce active card calculation based on scroll offset
      if (!isWheelingRef.current) {
        isWheelingRef.current = true;
        setTimeout(() => {
          if (carouselRef.current) {
            const scrollLeft = carouselRef.current.scrollLeft;
            const cardWidth = 460;
            const newIndex = Math.round(scrollLeft / cardWidth);
            setActiveIndex(Math.min(Math.max(newIndex, 0), EVIDENCE_ARCHIVE.length - 1));
          }
          isWheelingRef.current = false;
        }, 150);
      }
    }
  };

  // Zoom handlers for fullscreen viewer
  const handleDoubleClickZoom = () => {
    if (zoomLevel > 1) {
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
    } else {
      setZoomLevel(2);
    }
  };

  const handleViewerWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.deltaY < 0) {
      setZoomLevel((prev) => Math.min(prev + 0.25, 3));
    } else {
      setZoomLevel((prev) => {
        const next = Math.max(prev - 0.25, 1);
        if (next === 1) setPanPosition({ x: 0, y: 0 });
        return next;
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <section id="galeri-legalitas" className="relative py-24 sm:py-28 lg:py-32 bg-[#FAF9F5] divider-hairline reveal-on-scroll overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10">
        {/* ==============================================================
            TOP AREA: EDITORIAL ARCHIVE HEADER & ZKS EMBLEM BADGE
            ============================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-[#141413]/10">
          <div className="space-y-4 max-w-2xl">
            {/* Official ZKS Branding Accent */}
            <div className="inline-flex items-center gap-3">
              <div className="relative h-9 w-9 rounded-lg overflow-hidden shrink-0 bg-[#0d2238] border border-[#141413]/15 shadow-xs">
                <Image
                  src="/images/zks-logo-official.png"
                  alt="PT. Zahdan Kamal Sentosa Official Emblem"
                  fill
                  className="object-cover object-left"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-mono tracking-wider uppercase text-[#C85A17] font-bold">
                  DOCUMENTASI OPERASIONAL
                </span>
                <span className="text-xs text-[#6B685F] font-medium">
                  PT Zahdan Kamal Sentosa · Griya Indah Ciampel Karawang
                </span>
              </div>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[42px] text-[#141414] tracking-[-0.03em] leading-[1.14] reveal-title">
              Semua dokumentasi berasal dari fasilitas asli PT Zahdan Kamal Sentosa.
            </h2>
          </div>

          {/* Right Navigation & Direct Archive Prompt */}
          <div className="flex items-center gap-4 lg:self-end">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const next = activeIndex > 0 ? activeIndex - 1 : EVIDENCE_ARCHIVE.length - 1;
                  scrollToIndex(next);
                }}
                aria-label="Dokumen Sebelumnya"
                className="w-10 h-10 rounded-full border border-[#141413]/15 bg-white text-[#141413] hover:bg-[#141413] hover:text-[#FAF9F5] flex items-center justify-center transition-colors duration-200 cursor-pointer shadow-xs active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = activeIndex < EVIDENCE_ARCHIVE.length - 1 ? activeIndex + 1 : 0;
                  scrollToIndex(next);
                }}
                aria-label="Dokumen Selanjutnya"
                className="w-10 h-10 rounded-full border border-[#141413]/15 bg-white text-[#141413] hover:bg-[#141413] hover:text-[#FAF9F5] flex items-center justify-center transition-colors duration-200 cursor-pointer shadow-xs active:scale-95"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setViewerItem(EVIDENCE_ARCHIVE[0]);
                setZoomLevel(1);
                setPanPosition({ x: 0, y: 0 });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#141414] hover:text-[#C85A17] transition-colors py-2 px-3 rounded-lg border border-[#141413]/10 hover:border-[#C85A17] bg-white cursor-pointer shadow-xs"
            >
              <span>Explore Archive</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </div>

        {/* ==============================================================
            A SINGLE HORIZONTAL CAROUSEL (ONE ROW ONLY, NO GRID)
            Desktop: 2.25 cards | Tablet: 1.5 cards | Mobile: 1.1 cards
            Card width: 440~480px | Height: 540~580px | Snap mandatory
            ============================================================== */}
        <div
          ref={carouselRef}
          onWheel={handleCarouselWheel}
          className="flex items-stretch gap-6 sm:gap-7 overflow-x-auto pb-6 pt-2 scroll-smooth scrollbar-none snap-x snap-mandatory -mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {EVIDENCE_ARCHIVE.map((card, idx) => {
            const isActive = idx === activeIndex;

            return (
              <div
                key={card.id}
                onClick={() => {
                  setViewerItem(card);
                  setZoomLevel(1);
                  setPanPosition({ x: 0, y: 0 });
                }}
                style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
                className={`shrink-0 w-[88vw] sm:w-[420px] lg:w-[460px] h-[540px] sm:h-[580px] rounded-[18px] bg-white border border-[#141413]/10 cursor-pointer overflow-hidden flex flex-col justify-between transition-all duration-500 ease-out group select-none ${
                  isActive
                    ? "scale-100 opacity-100 shadow-[0_8px_30px_rgba(20,20,19,0.06)] ring-1 ring-[#141413]/10"
                    : "scale-[0.98] opacity-80 hover:opacity-100 hover:scale-100 shadow-[0_2px_12px_rgba(20,20,19,0.03)]"
                }`}
              >
                {/* 1. Large Photography Layer (Occupies ~72-75% of Card) */}
                <div className="relative h-[72%] w-full bg-[#F5F4EE] overflow-hidden border-b border-[#141413]/[0.08]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-contain p-4 sm:p-5 transition-transform duration-600 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 90vw, 480px"
                    priority={idx === 0}
                  />

                  {/* Top Subtle Identification Bar */}
                  <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between text-[10px] font-mono pointer-events-none">
                    <span className="px-2 py-0.5 rounded bg-white/90 text-[#141414] font-semibold border border-[#141413]/10 shadow-xs">
                      {card.categoryCode}
                    </span>
                    <span className="text-[#6B685F] bg-white/90 px-1.5 py-0.5 rounded border border-[#141413]/10">
                      {String(idx + 1).padStart(2, "0")} / {String(EVIDENCE_ARCHIVE.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* 2. Text Area (Occupies ~25-28% of Card) */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-2 bg-white">
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono tracking-wider uppercase text-[#C85A17] font-semibold">
                      {card.categoryLabel}
                    </div>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-[#141414] tracking-tight leading-snug line-clamp-1 group-hover:text-[#C85A17] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#555555] line-clamp-2 leading-relaxed">
                      {card.shortDesc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#141413]/[0.07] flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-[#7A7A7A] truncate">
                      {card.evidenceCount}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#141414] group-hover:text-[#C85A17] transition-colors shrink-0">
                      <span>View Documentation</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Pagination dots & Indicator */}
        <div className="flex items-center justify-between pt-2 text-xs font-mono text-[#7A7A7A]">
          <span className="hidden sm:inline-block">
            Tekan tombol panah keyboard ← → atau geser horizontal untuk melihat bukti riil operasional
          </span>
          <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
            {EVIDENCE_ARCHIVE.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Buka slide bukti ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeIndex ? "w-6 bg-[#141414]" : "w-1.5 bg-[#141414]/20 hover:bg-[#141414]/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ==============================================================
          FULLSCREEN DOCUMENT VIEWER (Apple Photos / Lightroom Style)
          NOT modal, NOT popup. Full viewport takeover with interactive zoom.
          ============================================================== */}
      {viewerItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#FAF9F5] text-[#141414] flex flex-col overflow-hidden animate-in fade-in duration-300"
        >
          {/* Top Bar: Official Branding, Document Title, and Actions */}
          <div className="h-16 border-b border-[#141413]/10 px-4 sm:px-8 flex items-center justify-between bg-white/90 backdrop-blur-md shrink-0">
            {/* Left: Official ZKS Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 rounded-md overflow-hidden shrink-0 bg-[#0d2238] border border-[#141413]/10">
                <Image
                  src="/images/zks-logo-official.png"
                  alt="PT. Zahdan Kamal Sentosa Logo"
                  fill
                  className="object-cover object-left"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xs sm:text-sm text-[#141413] tracking-tight">
                  PT. Zahdan Kamal Sentosa
                </span>
                <span className="text-[10px] text-[#7A7A7A] font-mono uppercase tracking-wider">
                  Enterprise Evidence Archive
                </span>
              </div>
            </div>

            {/* Center: Title / Document Code */}
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#555555]">
              <span className="px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#141413]/10 font-bold text-[#141414]">
                {viewerItem.categoryCode}
              </span>
              <span>·</span>
              <span className="truncate max-w-sm">{viewerItem.title}</span>
            </div>

            {/* Right: Actions & Close (ESC) */}
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/6281295490067?text=Halo%20PT%20Zahdan%20Kamal%20Sentosa,%20kami%20dari%20perusahaan%20ingin%20meminta%20salinan%20dokumen%20resmi%20legalisir%20untuk%20${encodeURIComponent(
                  viewerItem.title
                )}.`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#141413]/15 bg-[#FAF9F5] hover:bg-white text-xs font-semibold text-[#141414] transition-colors shadow-xs"
              >
                <FileCheck className="w-3.5 h-3.5 text-[#C85A17]" />
                <span>Minta Salinan Legalisir (PDF)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setViewerItem(null);
                  setZoomLevel(1);
                  setPanPosition({ x: 0, y: 0 });
                }}
                aria-label="Tutup Penampil Dokumen"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] text-[#FAF9F5] text-xs font-semibold hover:bg-[#2C2C28] transition-colors cursor-pointer shadow-xs"
              >
                <span>Tutup</span>
                <span className="text-[10px] opacity-60 font-mono hidden sm:inline">(ESC)</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Middle Body: Split View (Document Viewer on Left, Technical Spec on Right) */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Column: Center-aligned Large Document View with Zoom & Pan */}
            <div
              onWheel={handleViewerWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDoubleClick={handleDoubleClickZoom}
              className={`flex-1 relative bg-[#F7F6F2] overflow-hidden flex items-center justify-center p-4 sm:p-8 select-none ${
                zoomLevel > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
              }`}
              title="Klik dua kali atau putar roda mouse untuk zoom; geser untuk menggeser"
            >
              <div
                style={{
                  transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                  transition: isDragging ? "none" : "transform 0.25s ease-out",
                }}
                className="relative max-w-3xl w-full h-full max-h-[80vh] flex items-center justify-center"
              >
                <Image
                  src={viewerItem.image}
                  alt={viewerItem.title}
                  fill
                  className="object-contain drop-shadow-md"
                  sizes="(max-width: 1024px) 100vw, 900px"
                  priority
                />
              </div>

              {/* Zoom Controls Overlay */}
              <div className="absolute bottom-6 left-6 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#141413]/10 shadow-sm text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 1))}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#141413]/10 font-bold"
                  title="Perkecil"
                >
                  -
                </button>
                <span className="px-1.5 min-w-[42px] text-center font-medium">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 3))}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#141413]/10 font-bold"
                  title="Perbesar"
                >
                  +
                </button>
                {zoomLevel > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setZoomLevel(1);
                      setPanPosition({ x: 0, y: 0 });
                    }}
                    className="ml-2 px-2 py-0.5 rounded text-[10px] bg-[#141413] text-white"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Editorial Technical Specification Panel */}
            <div className="w-full lg:w-[420px] xl:w-[460px] bg-white border-t lg:border-t-0 lg:border-l border-[#141413]/10 overflow-y-auto p-6 sm:p-8 space-y-6 shrink-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider uppercase text-[#C85A17] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{viewerItem.specs.kategori}</span>
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[#141414] leading-snug">
                  {viewerItem.specs.nama}
                </h3>
              </div>

              {/* Technical Spec Matrix */}
              <div className="space-y-3 pt-3 border-t border-[#141413]/10 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A7A7A] block">
                    Lokasi Fasilitas Riil
                  </span>
                  <span className="text-[#141414] font-medium block">
                    {viewerItem.specs.lokasi}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A7A7A] block">
                    Legalitas &amp; Masa Berlaku
                  </span>
                  <span className="text-[#141414] font-medium block">
                    {viewerItem.specs.tanggal}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A7A7A] block">
                    Keterangan Operasional
                  </span>
                  <p className="text-[#555555] leading-relaxed">
                    {viewerItem.specs.keterangan}
                  </p>
                </div>

                <div className="space-y-1 pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A7A7A] block">
                    Status Audit Kepatuhan
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{viewerItem.specs.auditStatus}</span>
                  </span>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#141413]/[0.08]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A7A7A] block font-semibold">
                    Dokumen Terkait / Bukti Pendukung
                  </span>
                  <div className="space-y-1.5">
                    {viewerItem.specs.dokumenPendukung.map((doc, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] text-[#444444]">
                        <span className="text-[#C85A17] font-mono font-bold">›</span>
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A7A7A] block">
                    Standar Verifikasi
                  </span>
                  <span className="text-[11px] font-mono text-[#C85A17] font-semibold mt-0.5 block">
                    {viewerItem.specs.verification}
                  </span>
                </div>
              </div>

              {/* Direct Request Action Button */}
              <div className="pt-4 border-t border-[#141413]/10">
                <a
                  href={`https://wa.me/6281295490067?text=Halo%20PT%20Zahdan%20Kamal%20Sentosa,%20kami%20dari%20perusahaan%20ingin%20meminta%20salinan%20dokumen%20resmi%20untuk%20${encodeURIComponent(
                    viewerItem.title
                  )}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#141414] text-[#FAF9F5] text-xs font-semibold hover:bg-[#2C2C28] transition-colors cursor-pointer shadow-xs min-h-[44px]"
                >
                  <FileCheck className="w-4 h-4 text-[#D96B27]" />
                  <span>Minta Salinan Legalisir (WhatsApp)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-75" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Filmstrip: Horizontal Thumbnails (Lightroom / Apple Photos Style) */}
          <div className="h-20 bg-white border-t border-[#141413]/10 px-4 sm:px-8 flex items-center gap-3 overflow-x-auto scrollbar-none shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A7A7A] shrink-0 hidden sm:inline-block">
              Arsip ({EVIDENCE_ARCHIVE.length})
            </span>

            <div className="flex items-center gap-2.5">
              {EVIDENCE_ARCHIVE.map((item, idx) => {
                const isSelected = item.id === viewerItem.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setViewerItem(item);
                      setZoomLevel(1);
                      setPanPosition({ x: 0, y: 0 });
                    }}
                    className={`relative h-14 w-20 rounded-md overflow-hidden shrink-0 border-2 transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "border-[#141414] ring-2 ring-[#C85A17]/40 scale-105"
                        : "border-[#141413]/15 opacity-60 hover:opacity-100 hover:border-[#141413]/40"
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-0.5 bg-[#FAF9F5]"
                      sizes="80px"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-[#141414]/80 text-[8px] font-mono text-white text-center truncate px-0.5">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
