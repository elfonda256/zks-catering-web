import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InteractiveMenuSection from "@/components/InteractiveMenuSection";
import CompanyVerificationGallery from "@/components/CompanyVerificationGallery";
import StatCounter from "@/components/StatCounter";
import ScrollObserver from "@/components/ScrollObserver";
import { COMPANY_PROFILE } from "@/data/catering-data";
import { ArrowUpRight } from "@/components/icons";

const PARTNER_CLIENTS = [
  {
    name: "PT FCC Indonesia",
    tag: "PT FCC Indonesia",
    src: "/images/clients/fcc.png",
    width: "w-28 sm:w-32",
  },
  {
    name: "PT Indosafety Sentosa Industry",
    tag: "PT Indosafety Sentosa",
    src: "/images/clients/indosafety.png",
    width: "w-32 sm:w-36",
  },
  {
    name: "PT Indo Plating Technology",
    tag: "Indo Plating Tech",
    src: "/images/clients/indo-plating.png",
    width: "w-32 sm:w-36",
  },
  {
    name: "PT Daesang Food Indonesia",
    tag: "Food Indonesia",
    src: "/images/clients/daesang.png",
    width: "w-28 sm:w-32",
  },
  {
    name: "PT AT Indonesia",
    tag: "Automotive Parts",
    src: "/images/clients/at-indonesia.png",
    width: "w-28 sm:w-32",
  },
  {
    name: "PT Asahimas Flat Glass Tbk",
    tag: "Flat Glass Tbk",
    src: "/images/clients/asahimas.png",
    width: "w-32 sm:w-36",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5] text-[#141413] selection:bg-[#D96B27]/20 selection:text-[#141413]">
      <Navbar />

      <main id="main-content" className="flex-1">
        <ScrollObserver />

        {/* ==============================================================
            SECTION 1: HERO (Sprint 09: Architectural Industrial Masterpiece)
            ============================================================== */}
        <section className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-24 bg-[#FAF9F5]">
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Kolom Kiri: Typographic Narrative & Architectural Credentials (7 Kolom) */}
              <div className="lg:col-span-7 space-y-8">
                <div className="inline-flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[#8E8B81] hero-enter-badge">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C85A17]" />
                  <span>PT Zahdan Kamal Sentosa · Dapur Sentral Industri Karawang</span>
                </div>

                <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[56px] xl:text-[60px] text-[#141413] tracking-[-0.035em] leading-[1.08] hero-enter-headline">
                  Dapur Sentral &amp; Katering Industri untuk Manufaktur Karawang.
                </h1>

                <p className="font-sans text-base sm:text-lg text-[#626058] leading-relaxed max-w-xl font-normal hero-enter-sub">
                  Fasilitas produksi mandiri 5.000+ porsi per hari di Karawang. Menjamin presisi suplai nutrisi ribuan tenaga kerja pabrik multinasional lintas shift, tersertifikasi penuh ISO 22000 dan Halal resmi.
                </p>

                {/* Primary & Secondary Action CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 hero-enter-actions">
                  <a
                    href={`https://wa.me/${COMPANY_PROFILE.mainWhatsApp}?text=Halo%20PT%20Zahdan%20Kamal%20Sentosa,%20kami%20dari%20perusahaan%20ingin%20mengajukan%20konsultasi%20pengadaan%20katering%20karyawan.`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-interactive-primary gap-2.5 px-7 py-4 rounded-lg text-xs sm:text-sm font-semibold tracking-tight shadow-xs group"
                  >
                    <span>Konsultasi Pengadaan &amp; Uji Rasa</span>
                    <ArrowUpRight className="w-4 h-4 opacity-75 btn-arrow" />
                  </a>

                  <Link
                    href="/menu"
                    className="btn-interactive-secondary gap-2 px-6 py-4 rounded-lg border border-[#141413]/15 text-[#141413] text-xs sm:text-sm font-medium tracking-tight group"
                  >
                    <span className="btn-text-underline">Lihat Rotasi Menu Pabrik</span>
                    <ArrowUpRight className="w-3.5 h-3.5 btn-secondary-icon text-[#141413]" />
                  </Link>
                </div>

                {/* Operational Credentials (Architectural Spec Ledger) */}
                <div className="pt-10 border-t border-[#141413]/10 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-4 lg:gap-8 hero-enter-assurances">
                  <div className="space-y-1.5">
                    <div className="font-display font-extrabold text-2xl lg:text-[28px] text-[#141413] tracking-tight leading-none">
                      5.000<span className="text-[#C85A17] font-semibold">+</span>
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#8E8B81]">
                      Porsi / Hari
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:border-l sm:border-[#141413]/10 sm:pl-6 lg:pl-8">
                    <div className="font-display font-extrabold text-2xl lg:text-[28px] text-[#141413] tracking-tight leading-none">
                      ISO 22000
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#8E8B81]">
                      Certified
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:border-l sm:border-[#141413]/10 sm:pl-6 lg:pl-8">
                    <div className="font-display font-extrabold text-2xl lg:text-[28px] text-[#141413] tracking-tight leading-none">
                      Halal
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#8E8B81]">
                      BPJPH
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:border-l sm:border-[#141413]/10 sm:pl-6 lg:pl-8">
                    <div className="font-display font-extrabold text-2xl lg:text-[28px] text-[#141413] tracking-tight leading-none">
                      24 Jam
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#8E8B81]">
                      Distribusi Shift
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Living Industrial Visual (Exclusive Masterpiece - Visual Only) */}
              <div className="lg:col-span-5 relative hero-enter-photo">
                <div className="relative w-full rounded-2xl overflow-hidden border border-[#141413]/12 bg-[#141413] shadow-[0_24px_48px_-12px_rgba(20,20,19,0.14)] hero-visual-container group">
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src="/images/hero-industrial-kitchen.jpg"
                      alt="Fasilitas Dapur Sentral Industri PT Zahdan Kamal Sentosa Karawang - Skala 5.000+ Porsi Harian"
                      fill
                      priority
                      loading="eager"
                      className="object-cover object-center transform scale-[1.01] transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 42vw"
                    />

                    {/* Edge shadow vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/80 via-transparent to-black/15 pointer-events-none" />

                    {/* Atmospheric Culinary Steam Layer (Micro-Motion) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden hero-steam-layer" aria-hidden="true">
                      <div className="hero-steam-wisp hero-steam-1" />
                      <div className="hero-steam-wisp hero-steam-2" />
                      <div className="hero-steam-wisp hero-steam-3" />
                    </div>

                    {/* Stainless Steel Sheen Sweep (Micro-Motion) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden hero-steel-reflection" aria-hidden="true">
                      <div className="hero-sheen-line" />
                    </div>

                    {/* Architectural Operational Tag (Crisp Baseline Monograph) */}
                    <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 bg-gradient-to-t from-[#141413]/95 via-[#141413]/70 to-transparent">
                      <div className="flex items-center justify-between text-[#FAF9F5] text-[11px] font-mono tracking-wider uppercase border-t border-white/15 pt-3">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-white/90">Dapur Sentral Ciampel</span>
                        </div>
                        <span className="text-white/60">Shift Operasional 24 Jam</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
        {/* ==============================================================
            SECTION 01: TRUSTED CLIENTS (Sprint 09: Quiet Monograph Rhythm)
            ============================================================== */}
        <section id="klien-industri" className="py-16 sm:py-20 bg-[#FAF9F5] relative reveal-on-scroll overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#8E8B81] block">
                Mitra Industri yang Telah Dilayani
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#141413] tracking-[-0.03em] reveal-title">
                Dipercaya oleh Pemimpin Industri Manufaktur
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#626058] font-normal leading-relaxed reveal-paragraph max-w-xl mx-auto">
                Solusi katering industri terpercaya untuk ribuan pekerja pabrik manufaktur di koridor industri Karawang dan Jawa Barat.
              </p>
            </div>

            {/* Enterprise Logo Marquee (Slow Smooth Continuous Horizontal Motion) */}
            <div className="overflow-hidden mt-10 sm:mt-12 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes marqueeSlowContinuous {
                  0% { transform: translate3d(0, 0, 0); }
                  100% { transform: translate3d(-33.333333%, 0, 0); }
                }
                .logo-marquee-track {
                  display: flex !important;
                  width: max-content !important;
                  animation: marqueeSlowContinuous 32s linear infinite !important;
                  will-change: transform;
                }
                .logo-marquee-track:hover {
                  animation-play-state: paused !important;
                }
                @media (prefers-reduced-motion: reduce) {
                  .logo-marquee-track {
                    animation: none !important;
                  }
                }
              ` }} />
              <div className="logo-marquee-track flex items-center gap-12 sm:gap-16 lg:gap-20 py-4">
                {[...PARTNER_CLIENTS, ...PARTNER_CLIENTS, ...PARTNER_CLIENTS].map((client, idx) => (
                  <div
                    key={`${client.name}-${idx}`}
                    className="flex flex-col items-center justify-center text-center group cursor-default shrink-0 px-3 sm:px-5"
                  >
                    <div className={`relative h-12 sm:h-14 ${client.width} flex items-center justify-center transition-all duration-300 group-hover:scale-105`}>
                      <Image
                        src={client.src}
                        alt={`${client.name} Logo`}
                        fill
                        className="object-contain"
                        sizes="160px"
                      />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#68655C] group-hover:text-[#141413] transition-colors mt-2">
                      {client.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#141413]/[0.06] text-center reveal-fade stagger-6">
              <p className="text-xs text-[#8E8B81]">
                Mendukung kesinambungan operasional harian ribuan pekerja di Kawasan Industri KIIC, Surya Cipta, KIM, dan BIC.
              </p>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 02: CAPACITY METRICS (Sprint 09: Data Driven Metric Ledger)
            ============================================================== */}
        <section className="pt-4 pb-20 sm:pb-28 bg-[#FAF9F5] overflow-hidden reveal-on-scroll">
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            {/* Minimal Metrics Grid (No Cards, Pure Whitespace, Architectural Type Hierarchy) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pt-10 border-t border-[#141413]/10">
              {/* Metric 1 */}
              <div className="space-y-1.5 reveal-fade-up stagger-1">
                <StatCounter
                  value={17}
                  suffix="+"
                  duration={1500}
                  className="font-display font-extrabold text-5xl sm:text-6xl text-[#141413] tracking-[-0.04em] leading-none block"
                />
                <span className="text-xs font-mono uppercase tracking-[0.14em] text-[#C85A17] font-semibold block pt-1">
                  Years Experience
                </span>
                <p className="text-xs text-[#626058] leading-relaxed font-normal pt-1">
                  Berpengalaman sejak 2007 melayani katering skala pabrik manufaktur dan penanaman modal asing di Karawang.
                </p>
              </div>

              {/* Metric 2 */}
              <div className="space-y-1.5 sm:border-l sm:border-[#141413]/10 sm:pl-8 reveal-fade-up stagger-2">
                <StatCounter
                  value={5000}
                  suffix="+"
                  duration={1500}
                  className="font-display font-extrabold text-5xl sm:text-6xl text-[#141413] tracking-[-0.04em] leading-none block"
                />
                <span className="text-xs font-mono uppercase tracking-[0.14em] text-[#C85A17] font-semibold block pt-1">
                  Meals Per Day
                </span>
                <p className="text-xs text-[#626058] leading-relaxed font-normal pt-1">
                  Kapasitas produksi harian dapur terpadu dengan mesin steamer uap dan kontrol porsi higienis terstandarisasi.
                </p>
              </div>

              {/* Metric 3 */}
              <div className="space-y-1.5 lg:border-l lg:border-[#141413]/10 lg:pl-8 reveal-fade-up stagger-3">
                <StatCounter
                  value={99}
                  suffix="%"
                  duration={1500}
                  className="font-display font-extrabold text-5xl sm:text-6xl text-[#141413] tracking-[-0.04em] leading-none block"
                />
                <span className="text-xs font-mono uppercase tracking-[0.14em] text-[#C85A17] font-semibold block pt-1">
                  On-Time Delivery
                </span>
                <p className="text-xs text-[#626058] leading-relaxed font-normal pt-1">
                  Armada insulated box 24 jam menjamin suplai tiba tepat waktu untuk seluruh shift pagi, siang, dan malam pabrik.
                </p>
              </div>

              {/* Metric 4 */}
              <div className="space-y-1.5 sm:border-l sm:border-[#141413]/10 sm:pl-8 reveal-fade-up stagger-4">
                <StatCounter
                  value={100}
                  suffix="%"
                  duration={1500}
                  className="font-display font-extrabold text-5xl sm:text-6xl text-[#141413] tracking-[-0.04em] leading-none block"
                />
                <span className="text-xs font-mono uppercase tracking-[0.14em] text-emerald-800 font-semibold block pt-1">
                  Halal Commitment
                </span>
                <p className="text-xs text-[#626058] leading-relaxed font-normal pt-1">
                  Tersertifikasi resmi Halal LPPOM MUI dan sistem manajemen mutu ISO 22000 tanpa kompromi bahan baku.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 03: ABOUT COMPANY (Sprint 09: Editorial Monograph)
            ============================================================== */}
        <section id="tentang" className="py-28 sm:py-36 bg-[#FAF9F5] relative overflow-hidden reveal-on-scroll">
          <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
            <div className="space-y-4 max-w-3xl">
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#8E8B81] block">
                Sejarah &amp; Dedikasi Operasional
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#141413] tracking-[-0.03em] leading-[1.12] reveal-title">
                Membangun Fondasi Nutrisi Industri yang Konsisten dan Terpercaya.
              </h2>
            </div>

            <div className="space-y-5 text-sm sm:text-base text-[#626058] leading-relaxed font-normal reveal-paragraph max-w-4xl">
              <p>
                Didirikan pada tahun 2007 di Karawang, <strong>PT. Zahdan Kamal Sentosa (ZKS Catering)</strong> bertransformasi dari penyedia boga korporat menjadi mitra strategis utama bagi industri manufaktur berskala besar. Kami memahami bahwa makanan tenaga kerja pabrik bukan sekadar hidangan, melainkan energi utama yang menggerakkan produktivitas lini operasional.
              </p>
              <p>
                Dengan fasilitas dapur mandiri terintegrasi di Griya Indah Ciampel, kami menerapkan standar ketat manajemen keamanan pangan <strong>ISO 22000</strong>, jaminan <strong>Halal MUI</strong>, dan sanitasi berkala <strong>Dinas Kesehatan</strong> untuk melayani ribuan porsi harian tanpa cacat mutu.
              </p>
            </div>

            {/* Legal & Accreditation Credentials Strip */}
            <div className="pt-8 border-t border-[#141413]/10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs reveal-fade-up stagger-2">
              <div>
                <span className="font-mono text-[11px] font-bold text-[#141413] block">ISO 22000:2009</span>
                <span className="text-[11px] font-mono text-[#8E8B81]">Reg. ZKS 221076 0001</span>
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-emerald-800 block">Halal LPPOM MUI</span>
                <span className="text-[11px] font-mono text-[#8E8B81]">ID32110006798080623</span>
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-[#141413] block">NIB Resmi KBLI</span>
                <span className="text-[11px] font-mono text-[#8E8B81]">241121002398</span>
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-[#141413] block">Dinkes Karawang</span>
                <span className="text-[11px] font-mono text-[#8E8B81]">Laik Higiene Gol. B</span>
              </div>
            </div>

            {/* Milestone Timeline: Editorial Clean Linear Rhythm (No Card Hover Boxes) */}
            <div className="pt-10 border-t border-[#141413]/10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#8E8B81] block">
                  Perjalanan &amp; Milestone Perusahaan
                </span>
                <span className="text-[11px] font-mono text-[#8E8B81] hidden sm:block">
                  2007 — 2026
                </span>
              </div>

              <div className="relative pt-2">
                {/* Connecting Progress Line */}
                <div className="absolute top-[18px] left-2 right-4 h-px bg-[#141413]/10 hidden sm:block overflow-hidden pointer-events-none">
                  <div className="h-full bg-gradient-to-r from-[#141413] via-[#C85A17] to-emerald-600 timeline-progress-line" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 relative">
                  {/* Step 1: 2007 */}
                  <div className="space-y-1.5 reveal-fade-up stagger-1">
                    <div className="flex items-center gap-2">
                      <span className="relative z-10 w-2 h-2 rounded-full bg-[#141413]" />
                      <span className="font-display font-extrabold text-sm sm:text-base text-[#141413] tracking-tight">
                        2007
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#141413] block pt-1">
                      Company Founded
                    </span>
                    <p className="text-[11px] text-[#626058] leading-relaxed">
                      Awal berdirinya ZKS di Karawang melayani katering pabrik pertama.
                    </p>
                  </div>

                  {/* Step 2: 2012 */}
                  <div className="space-y-1.5 reveal-fade-up stagger-2">
                    <div className="flex items-center gap-2">
                      <span className="relative z-10 w-2 h-2 rounded-full bg-[#141413]" />
                      <span className="font-display font-extrabold text-sm sm:text-base text-[#141413] tracking-tight">
                        2012
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#141413] block pt-1">
                      Expanded Production
                    </span>
                    <p className="text-[11px] text-[#626058] leading-relaxed">
                      Modernisasi dapur sentral dengan instalasi boiler uap &amp; cold storage.
                    </p>
                  </div>

                  {/* Step 3: 2018 */}
                  <div className="space-y-1.5 reveal-fade-up stagger-3">
                    <div className="flex items-center gap-2">
                      <span className="relative z-10 w-2 h-2 rounded-full bg-[#C85A17]" />
                      <span className="font-display font-extrabold text-sm sm:text-base text-[#C85A17] tracking-tight">
                        2018
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#141413] block pt-1">
                      Industrial Division
                    </span>
                    <p className="text-[11px] text-[#626058] leading-relaxed">
                      Divisi katering industri skala 5.000+ porsi &amp; sertifikasi ISO 22000.
                    </p>
                  </div>

                  {/* Step 4: Today */}
                  <div className="space-y-1.5 reveal-fade-up stagger-4">
                    <div className="flex items-center gap-2">
                      <span className="relative z-10 w-2 h-2 rounded-full bg-emerald-600" />
                      <span className="font-display font-extrabold text-sm sm:text-base text-emerald-800 tracking-tight">
                        Today
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#141413] block pt-1">
                      Trusted Partner
                    </span>
                    <p className="text-[11px] text-[#626058] leading-relaxed">
                      Mitra katering tepercaya perusahaan multinasional di Jawa Barat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 04: EDITORIAL INTERLUDE (Sprint 09: Minimal Typographic Transition)
            ============================================================== */}
        <section className="py-14 sm:py-16 bg-[#FAF9F5] text-center reveal-on-scroll">
          <div className="max-w-2xl mx-auto px-6 space-y-3.5">
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#141413] tracking-[-0.02em] leading-snug">
              Diskusikan Kebutuhan Konsumsi Multi-Shift Pabrik Anda.
            </h3>
            <p className="text-xs sm:text-sm text-[#626058] max-w-lg mx-auto leading-relaxed">
              Konsultasi langsung bersama manajemen ZKS untuk pengadaan katering, uji sampel rasa, atau jadwal survei audit fasilitas dapur.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold">
              <Link
                href="/pesan"
                className="inline-flex items-center gap-1.5 text-[#141413] hover:text-[#C85A17] transition-colors underline underline-offset-4 decoration-[#141413]/25 hover:decoration-[#C85A17]"
              >
                <span>Ajukan Permintaan Proposal</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href={`https://wa.me/${COMPANY_PROFILE.mainWhatsApp}?text=Halo%20PT%20Zahdan%20Kamal%20Sentosa,%20kami%20ingin%20berkonsultasi%20mengenai%20katering%20industri%20pabrik.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#8E8B81] hover:text-[#141413] transition-colors"
              >
                <span>WhatsApp Manajemen</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 05: STRATEGIC VALUE (Sprint 09: Editorial Value Ledger)
            ============================================================== */}
        <section id="keunggulan" className="py-28 sm:py-32 lg:py-36 bg-[#FAF9F5] relative reveal-on-scroll overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Kolom Kiri: Narrative Value Proposition (5 Kolom) */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#C85A17] font-semibold block">
                    Strategic Value Proposition
                  </span>
                  <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#141413] tracking-[-0.03em] leading-[1.12] reveal-title">
                    Why Leading Manufacturers Choose ZKS
                  </h2>
                </div>

                <p className="font-sans text-sm sm:text-base text-[#626058] leading-relaxed font-normal reveal-paragraph">
                  Di kawasan industri Karawang dengan ribuan tenaga kerja, keterlambatan konsumsi atau insiden mutu makanan adalah risiko fatal yang dapat melumpuhkan lini produksi pabrik. PT. Zahdan Kamal Sentosa hadir bukan sekadar sebagai katering biasa, melainkan sistem operasional boga industri yang dirancang khusus untuk stabilitas manufaktur Anda.
                </p>

                {/* Assurance Ledger (Clean Typography, No Nested Card Box) */}
                <div className="pt-6 border-t border-[#141413]/10 space-y-2 reveal-fade-up stagger-2">
                  <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#C85A17] font-semibold block">
                    Garansi Keandalan Kontrak Korporat
                  </span>
                  <p className="text-xs text-[#626058] leading-relaxed">
                    Sistem operasional kami teruji menghadapi audit ketat perusahaan PMA Jepang, Korea, dan multinasional dengan kepatuhan SLA 99% tepat waktu.
                  </p>
                </div>
              </div>

              {/* Kolom Kanan: 4 Monograph Value Ledgers (7 Kolom, Pure Whitespace & Monospace Indices) */}
              <div className="lg:col-span-7">
                <div className="divide-y divide-[#141413]/10 border-y border-[#141413]/10">
                  {/* Item 1: Operational Reliability */}
                  <div className="py-7 sm:py-8 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline group reveal-fade-up stagger-1">
                    <div className="sm:col-span-5 flex items-baseline gap-3">
                      <span className="font-mono text-xs font-semibold text-[#8E8B81] group-hover:text-[#141413] transition-colors">
                        01
                      </span>
                      <h3 className="font-display font-bold text-base sm:text-lg text-[#141413] tracking-tight">
                        Operational Reliability
                      </h3>
                    </div>
                    <div className="sm:col-span-7 text-xs sm:text-sm text-[#626058] leading-relaxed">
                      Sistem produksi dan pengiriman terstruktur 3 shift tanpa jeda sepanjang tahun, memastikan ribuan pekerja shift pagi, siang, lembur, dan malam menerima asupan nutrisi tepat waktu.
                    </div>
                  </div>

                  {/* Item 2: Food Safety Standard */}
                  <div className="py-7 sm:py-8 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline group reveal-fade-up stagger-2">
                    <div className="sm:col-span-5 flex items-baseline gap-3">
                      <span className="font-mono text-xs font-semibold text-[#C85A17]">
                        02
                      </span>
                      <h3 className="font-display font-bold text-base sm:text-lg text-[#141413] tracking-tight">
                        Food Safety Standard
                      </h3>
                    </div>
                    <div className="sm:col-span-7 text-xs sm:text-sm text-[#626058] leading-relaxed">
                      Penerapan protokol HACCP menyeluruh dari inspeksi bahan baku, filtrasi air Reverse Osmosis, hingga retensi arsip sampel makanan H-0 selama 3x24 jam untuk pencegahan risiko kontaminasi secara mutlak.
                    </div>
                  </div>

                  {/* Item 3: Scalable Production */}
                  <div className="py-7 sm:py-8 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline group reveal-fade-up stagger-3">
                    <div className="sm:col-span-5 flex items-baseline gap-3">
                      <span className="font-mono text-xs font-semibold text-[#8E8B81] group-hover:text-[#141413] transition-colors">
                        03
                      </span>
                      <h3 className="font-display font-bold text-base sm:text-lg text-[#141413] tracking-tight">
                        Scalable Production
                      </h3>
                    </div>
                    <div className="sm:col-span-7 text-xs sm:text-sm text-[#626058] leading-relaxed">
                      Dapur sentral industri berkapasitas 5.000+ porsi harian dengan mesin steamer uap boiler bertekanan tinggi yang siap meningkatkan kapasitas saat lonjakan lembur atau shift kerja mendadak.
                    </div>
                  </div>

                  {/* Item 4: On-Time Delivery */}
                  <div className="py-7 sm:py-8 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline group reveal-fade-up stagger-4">
                    <div className="sm:col-span-5 flex items-baseline gap-3">
                      <span className="font-mono text-xs font-semibold text-[#8E8B81] group-hover:text-[#141413] transition-colors">
                        04
                      </span>
                      <h3 className="font-display font-bold text-base sm:text-lg text-[#141413] tracking-tight">
                        On-Time Delivery
                      </h3>
                    </div>
                    <div className="sm:col-span-7 text-xs sm:text-sm text-[#626058] leading-relaxed">
                      Armada insulated box berpengatur suhu tertutup dengan akses cepat gerbang tol Karawang menjamin waktu transit rata-rata di bawah 35 menit menuju KIIC, Surya Cipta, KIM, dan BIC.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 06: PRODUCTION CAPACITY (Sprint 09: Pure Data-Driven Matrix)
            ============================================================== */}
        <section id="operasional" className="py-32 sm:py-36 lg:py-40 bg-[#141413] text-[#FAF9F5] relative overflow-hidden reveal-on-scroll">
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
            <div className="max-w-3xl space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#D96B27] font-semibold block">
                Skala Operasional Nyata
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#FAF9F5] tracking-[-0.03em] leading-tight reveal-title">
                Infrastruktur Produksi Mandiri yang Dirancang untuk Skala Besar.
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#A8A69E] leading-relaxed reveal-paragraph">
                Bukan sekadar klaim pemasaran. Fasilitas terpusat kami di Griya Indah Ciampel dibangun khusus dengan mesin boiler uap berkapasitas ratusan kilogram dan cold room independen untuk menjaga kesinambungan operasional pabrik tanpa kompromi.
              </p>
            </div>

            {/* Industrial Metrics Matrix (Architectural Monospace Ledger) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[#FAF9F5]/10 border-y border-[#FAF9F5]/10 py-12 sm:py-16">
              <div className="lg:px-8 first:lg:pl-0 space-y-2 reveal-fade-up stagger-1">
                <StatCounter
                  value={5000}
                  suffix="+"
                  separator=","
                  duration={1500}
                  className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#FAF9F5] tracking-[-0.04em] leading-none block"
                />
                <span className="text-xs font-mono uppercase tracking-[0.14em] text-[#D96B27] font-semibold block pt-1">
                  Meals Produced Daily
                </span>
                <p className="text-xs text-[#8E8B81] leading-relaxed">
                  Porsi harian terdistribusi ke berbagai korporasi manufaktur lintas shift operasional.
                </p>
              </div>

              <div className="lg:px-8 space-y-2 reveal-fade-up stagger-2">
                <StatCounter
                  value={1}
                  duration={1500}
                  className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#FAF9F5] tracking-[-0.04em] leading-none block"
                />
                <span className="text-xs font-mono uppercase tracking-[0.14em] text-[#D96B27] font-semibold block pt-1">
                  Central Kitchen Facility
                </span>
                <p className="text-xs text-[#8E8B81] leading-relaxed">
                  Dapur produksi terpadu mandiri di Ciampel dengan alur kerja satu arah (one-way flow) higienis.
                </p>
              </div>

              <div className="lg:px-8 space-y-2 reveal-fade-up stagger-3">
                <StatCounter
                  value={12}
                  suffix="+"
                  duration={1500}
                  className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#FAF9F5] tracking-[-0.04em] leading-none block"
                />
                <span className="text-xs font-mono uppercase tracking-[0.14em] text-[#D96B27] font-semibold block pt-1">
                  Delivery Fleet Units
                </span>
                <p className="text-xs text-[#8E8B81] leading-relaxed">
                  Armada operasional insulated box berpengatur suhu tertutup siap siaga 24 jam sehari.
                </p>
              </div>

              <div className="lg:px-8 last:lg:pr-0 space-y-2 reveal-fade-up stagger-4">
                <StatCounter
                  value={17}
                  suffix="+"
                  duration={1500}
                  className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#FAF9F5] tracking-[-0.04em] leading-none block"
                />
                <span className="text-xs font-mono uppercase tracking-[0.14em] text-[#D96B27] font-semibold block pt-1">
                  Years Experience
                </span>
                <p className="text-xs text-[#8E8B81] leading-relaxed">
                  Pengalaman operasional melayani penanaman modal asing (PMA) di Karawang sejak 2007.
                </p>
              </div>
            </div>

            {/* Industrial Corridor Latency Ledger (Pure Data Matrix, No Card-in-Panel) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline text-xs text-[#8E8B81] reveal-fade-up stagger-5">
              <div className="md:col-span-4 space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#D96B27] font-semibold block">
                  Akses Koridor Kawasan Industri
                </span>
                <p className="text-xs text-[#A8A69E]">
                  Akses langsung via Gerbang Tol Karawang Barat &amp; Timur (Transit rata-rata &lt; 35 menit):
                </p>
              </div>
              <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                <div className="border-l border-[#FAF9F5]/10 pl-4 space-y-0.5">
                  <span className="font-mono text-xs text-[#FAF9F5] font-semibold block">KIIC Karawang</span>
                  <span className="font-mono text-[11px] text-[#D96B27]">~18 Menit</span>
                </div>
                <div className="border-l border-[#FAF9F5]/10 pl-4 space-y-0.5">
                  <span className="font-mono text-xs text-[#FAF9F5] font-semibold block">Surya Cipta</span>
                  <span className="font-mono text-[11px] text-[#D96B27]">~22 Menit</span>
                </div>
                <div className="border-l border-[#FAF9F5]/10 pl-4 space-y-0.5">
                  <span className="font-mono text-xs text-[#FAF9F5] font-semibold block">KIM Karawang</span>
                  <span className="font-mono text-[11px] text-[#D96B27]">~25 Menit</span>
                </div>
                <div className="border-l border-[#FAF9F5]/10 pl-4 space-y-0.5">
                  <span className="font-mono text-xs text-[#FAF9F5] font-semibold block">BIC Purwakarta</span>
                  <span className="font-mono text-[11px] text-[#D96B27]">~32 Menit</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 07: FOOD PRODUCTION WORKFLOW (Sprint 09: Blueprint Schematic)
            ============================================================== */}
        <section id="alur-produksi" className="py-20 sm:py-24 bg-[#FAF9F5] relative reveal-on-scroll overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-14">
            <div className="max-w-3xl space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#C85A17] font-semibold block">
                Alur Rekayasa Produksi Higienis
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#141413] tracking-[-0.03em] leading-tight reveal-title">
                7 Tahapan Alur Kerja Dapur Skala Industri
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#626058] font-normal leading-relaxed reveal-paragraph">
                Setiap porsi makanan melewati alur kerja higienis satu arah (*one-way production flow*) untuk memastikan presisi nutrisi, konsistensi rasa, dan kepatuhan standar sanitasi mutlak.
              </p>
            </div>

            {/* Blueprint Schematic Flow (Continuous Architectural Line, Monospace Spec Codes, Pure Typography) */}
            <div className="relative pt-4">
              {/* Continuous Engineering Datum Line */}
              <div className="hidden lg:block absolute top-[13px] left-0 right-0 h-px bg-[#141413]/15 pointer-events-none" />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 lg:gap-5">
                {/* Stage 01 */}
                <div className="space-y-3 relative reveal-fade-up stagger-1">
                  <div className="flex items-center gap-2">
                    <span className="relative z-10 font-mono text-[11px] font-bold tracking-wider px-2 py-0.5 bg-[#141413] text-[#FAF9F5]">
                      STAGE 01
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm text-[#141413] tracking-tight">
                      Raw Intake QC
                    </h3>
                    <p className="text-xs text-[#626058] leading-relaxed">
                      Inspeksi organoleptik bahan segar &amp; verifikasi suhu rantai dingin daging beku dari pemasok teraudit.
                    </p>
                  </div>
                </div>

                {/* Stage 02 */}
                <div className="space-y-3 relative reveal-fade-up stagger-2">
                  <div className="flex items-center gap-2">
                    <span className="relative z-10 font-mono text-[11px] font-bold tracking-wider px-2 py-0.5 bg-[#141413] text-[#FAF9F5]">
                      STAGE 02
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm text-[#141413] tracking-tight">
                      RO Prep &amp; Wash
                    </h3>
                    <p className="text-xs text-[#626058] leading-relaxed">
                      Pencucian bahan sayur dan beras menggunakan air murni filtrasi Reverse Osmosis di ruang persiapan steril.
                    </p>
                  </div>
                </div>

                {/* Stage 03 */}
                <div className="space-y-3 relative reveal-fade-up stagger-3">
                  <div className="flex items-center gap-2">
                    <span className="relative z-10 font-mono text-[11px] font-bold tracking-wider px-2 py-0.5 bg-[#141413] text-[#FAF9F5]">
                      STAGE 03
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm text-[#141413] tracking-tight">
                      Steam Thermal
                    </h3>
                    <p className="text-xs text-[#626058] leading-relaxed">
                      Pemasakan volume tinggi via ketel boiler uap bertekanan; verifikasi suhu inti hidangan konsisten &gt; 75°C.
                    </p>
                  </div>
                </div>

                {/* Stage 04 */}
                <div className="space-y-3 relative reveal-fade-up stagger-4">
                  <div className="flex items-center gap-2">
                    <span className="relative z-10 font-mono text-[11px] font-bold tracking-wider px-2 py-0.5 bg-[#C85A17] text-[#FAF9F5]">
                      STAGE 04
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm text-[#141413] tracking-tight">
                      QC &amp; Archive
                    </h3>
                    <p className="text-xs text-[#626058] leading-relaxed">
                      Uji organoleptik berkala, kalibrasi rasa, dan retensi arsip sampel makanan H-0 selama 3x24 jam.
                    </p>
                  </div>
                </div>

                {/* Stage 05 */}
                <div className="space-y-3 relative reveal-fade-up stagger-5">
                  <div className="flex items-center gap-2">
                    <span className="relative z-10 font-mono text-[11px] font-bold tracking-wider px-2 py-0.5 bg-[#141413] text-[#FAF9F5]">
                      STAGE 05
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm text-[#141413] tracking-tight">
                      Cleanroom Pack
                    </h3>
                    <p className="text-xs text-[#626058] leading-relaxed">
                      Pemorsian bento di ruang bertekanan positif dengan personil berpakaian APD lengkap dan sarung tangan nitril.
                    </p>
                  </div>
                </div>

                {/* Stage 06 */}
                <div className="space-y-3 relative reveal-fade-up stagger-6">
                  <div className="flex items-center gap-2">
                    <span className="relative z-10 font-mono text-[11px] font-bold tracking-wider px-2 py-0.5 bg-[#141413] text-[#FAF9F5]">
                      STAGE 06
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm text-[#141413] tracking-tight">
                      Insulated Transit
                    </h3>
                    <p className="text-xs text-[#626058] leading-relaxed">
                      Distribusi tertutup dengan armada insulated box pengatur suhu terkalibrasi menuju seluruh gerbang pabrik mitra.
                    </p>
                  </div>
                </div>

                {/* Stage 07 */}
                <div className="space-y-3 relative reveal-fade-up stagger-7">
                  <div className="flex items-center gap-2">
                    <span className="relative z-10 font-mono text-[11px] font-bold tracking-wider px-2 py-0.5 bg-emerald-800 text-[#FAF9F5]">
                      STAGE 07
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm text-[#141413] tracking-tight">
                      On-Site Handover
                    </h3>
                    <p className="text-xs text-[#626058] leading-relaxed">
                      Serah terima presisi bersama tim HRGA di kantin industri, siap disajikan hangat sesuai jadwal pergantian shift.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 08: FOOD SAFETY & QA (Sprint 09: Clinical Scientific Protocol)
            ============================================================== */}
        <section id="keamanan-pangan" className="py-32 sm:py-36 lg:py-40 bg-[#FAF9F5] relative overflow-hidden reveal-on-scroll">
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Kolom Kiri: Operational Quality Protocols (7 Kolom) */}
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#C85A17] font-semibold block">
                    Kepatuhan Audit &amp; Keamanan Pangan
                  </span>
                  <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#141413] tracking-[-0.03em] leading-tight reveal-title">
                    Protokol Keamanan Pangan Tanpa Kompromi untuk Ribuan Tenaga Kerja.
                  </h2>
                </div>

                <p className="font-sans text-sm sm:text-base text-[#626058] leading-relaxed font-normal reveal-paragraph">
                  Bagi industri manufaktur modern dengan ribuan pekerja, insiden keracunan makanan dapat menghentikan lini perakitan pabrik dan menimbulkan kerugian operasional yang masif. PT. Zahdan Kamal Sentosa menerapkan sistem kendali mutu berbasis HACCP dan ISO 22000 yang siap diaudit kapan pun oleh tim safety &amp; HRGA perusahaan Anda.
                </p>

                {/* 6 Clinical HACCP / ISO Protocols Ledger (Pure Typography, Monospace QA Codes) */}
                <div className="divide-y divide-[#141413]/10 border-y border-[#141413]/10 text-xs">
                  <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline reveal-fade-up stagger-1">
                    <div className="sm:col-span-4 font-mono font-semibold text-[#141413] flex items-baseline gap-2">
                      <span className="text-[10px] text-[#8E8B81]">QA-01</span>
                      <span className="font-sans text-xs font-semibold text-[#141413]">Raw Material Intake</span>
                    </div>
                    <div className="sm:col-span-8 text-[#626058] leading-relaxed">
                      Pemeriksaan ketat kesegaran organoleptik dan verifikasi suhu rantai dingin daging beku saat serah terima dari supplier terverifikasi.
                    </div>
                  </div>

                  <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline reveal-fade-up stagger-2">
                    <div className="sm:col-span-4 font-mono font-semibold text-[#141413] flex items-baseline gap-2">
                      <span className="text-[10px] text-[#8E8B81]">QA-02</span>
                      <span className="font-sans text-xs font-semibold text-[#141413]">Daily Hygiene Standard</span>
                    </div>
                    <div className="sm:col-span-8 text-[#626058] leading-relaxed">
                      Staf dapur wajib mengenakan APD lengkap (hairnet, masker medis, dan sarung tangan nitril *food-grade*) dengan sanitasi berkala.
                    </div>
                  </div>

                  <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline reveal-fade-up stagger-2">
                    <div className="sm:col-span-4 font-mono font-semibold text-[#141413] flex items-baseline gap-2">
                      <span className="text-[10px] text-[#C85A17]">QA-03</span>
                      <span className="font-sans text-xs font-semibold text-[#141413]">Thermal Probe Log</span>
                    </div>
                    <div className="sm:col-span-8 text-[#626058] leading-relaxed">
                      Pengukuran berkala suhu inti masakan &gt; 75°C menggunakan termometer probe digital guna memastikan eliminasi patogen sempurna.
                    </div>
                  </div>

                  <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline reveal-fade-up stagger-3">
                    <div className="sm:col-span-4 font-mono font-semibold text-[#141413] flex items-baseline gap-2">
                      <span className="text-[10px] text-[#8E8B81]">QA-04</span>
                      <span className="font-sans text-xs font-semibold text-[#141413]">Cleanroom Packaging</span>
                    </div>
                    <div className="sm:col-span-8 text-[#626058] leading-relaxed">
                      Ruang pengemasan terisolasi dengan sirkulasi udara berpenyaring dan alur kerja satu arah guna mencegah kontaminasi silang.
                    </div>
                  </div>

                  <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline reveal-fade-up stagger-3">
                    <div className="sm:col-span-4 font-mono font-semibold text-[#141413] flex items-baseline gap-2">
                      <span className="text-[10px] text-[#8E8B81]">QA-05</span>
                      <span className="font-sans text-xs font-semibold text-[#141413]">Sanitation &amp; Water RO</span>
                    </div>
                    <div className="sm:col-span-8 text-[#626058] leading-relaxed">
                      Penggunaan air Reverse Osmosis (RO) untuk memasak dan pencucian bahan, serta disinfeksi rutin peralatan menggunakan deterjen ramah pangan.
                    </div>
                  </div>

                  <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline reveal-fade-up stagger-4">
                    <div className="sm:col-span-4 font-mono font-semibold text-emerald-800 flex items-baseline gap-2">
                      <span className="text-[10px] text-emerald-700">QA-06</span>
                      <span className="font-sans text-xs font-semibold text-[#141413]">Retention Archive H-0</span>
                    </div>
                    <div className="sm:col-span-8 text-[#626058] leading-relaxed">
                      Penyimpanan arsip sampel makanan setiap menu selama 3 x 24 jam dalam lemari pendingin tertutup untuk keperluan uji laboratorium independen.
                    </div>
                  </div>
                </div>

                {/* Direct Accreditation Ledger */}
                <div className="pt-6 border-t border-[#141413]/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs reveal-fade-up stagger-4">
                  <div>
                    <strong className="text-[#141413] block">ISO 22000:2009</strong>
                    <span className="font-mono text-[11px] text-[#8E8B81]">ZKS 221076 0001</span>
                  </div>
                  <div>
                    <strong className="text-emerald-800 block">Sertifikat Halal Resmi</strong>
                    <span className="font-mono text-[11px] text-[#8E8B81]">ID32110006798080623</span>
                  </div>
                  <div>
                    <strong className="text-[#141413] block">NIB Usaha KBLI</strong>
                    <span className="font-mono text-[11px] text-[#8E8B81]">241121002398</span>
                  </div>
                  <div>
                    <strong className="text-[#141413] block">Dinkes Karawang</strong>
                    <span className="font-mono text-[11px] text-[#8E8B81]">Laik Higiene Gol. B</span>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Clean Clinical Photography (No Decorative Masks or Glows) */}
              <div className="lg:col-span-5 relative mt-8 lg:mt-0">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#141413]/5 border border-[#141413]/10 reveal-image">
                  <Image
                    src="/images/food-safety-audit.jpg"
                    alt="Inspeksi kualitas makanan dan higienis dapur ZKS Karawang"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>

                <div className="mt-4 space-y-1 reveal-fade stagger-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#C85A17] font-semibold block">
                    Laboratorium Pengujian Mutu
                  </span>
                  <p className="text-xs text-[#8E8B81]">
                    Pemeriksaan mikrobiologis dan kimia berkala bekerja sama dengan laboratorium independen terakreditasi di Karawang.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            AUTHENTIC DOCUMENTATION: VERIFIED FACILITY & LEGAL ACCREDITATION GALLERY
            ============================================================== */}
        <CompanyVerificationGallery />

        {/* ==============================================================
            SECTION 10: INTERACTIVE MENU CATALOG (Sprint 09: Nutritional Specification)
            ============================================================== */}
        <section id="menu-katering" className="relative py-28 sm:py-32 lg:py-36 bg-[#FAF9F5] reveal-on-scroll overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
            <div className="max-w-2xl space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#C85A17] font-semibold block">
                Katalog Spesifikasi Menu
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#141413] tracking-[-0.03em] leading-tight reveal-title">
                Variasi Menu Bergizi Seimbang dengan Rotasi Harian.
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#626058] leading-relaxed reveal-paragraph">
                Karyawan tidak akan merasa jenuh berkat rotasi menu Senin s.d. Sabtu. Setiap paket dirancang dengan kalkulasi gramasi karbohidrat, protein hewani, dan serat yang proporsional.
              </p>
            </div>

            {/* Interactive React Client Catalog */}
            <InteractiveMenuSection />
          </div>
        </section>

        {/* ==============================================================
            SECTION 11: CORPORATE CTA (Sprint 09: Quiet Minimalist Confidence)
            ============================================================== */}
        <section id="kontak-korporat" className="py-32 sm:py-36 lg:py-40 bg-[#141413] text-[#FAF9F5] relative overflow-hidden reveal-on-scroll">
          <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-12">
            <div className="space-y-4 max-w-3xl mx-auto">
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#D96B27] font-semibold block">
                Pengadaan Katering Korporat &amp; Pabrik
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#FAF9F5] tracking-[-0.03em] leading-tight reveal-title">
                Mulai Pembahasan Kebutuhan Katering Karyawan Anda Hari Ini.
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#A8A69E] leading-relaxed reveal-paragraph">
                Hubungi manajemen PT. Zahdan Kamal Sentosa untuk menjadwalkan presentasi, survei kapasitas dapur bersama tim HRGA/Purchasing, atau pengiriman paket sampel rasa ke pabrik Anda.
              </p>
            </div>

            {/* Quiet, Confident Action Buttons (Supporting Content, Not Shouting) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal-fade-up stagger-2">
              <a
                href={`https://wa.me/${COMPANY_PROFILE.mainWhatsApp}?text=Halo%20PT%20Zahdan%20Kamal%20Sentosa,%20kami%20dari%20perusahaan%20ingin%20meminta%20sampel%20makanan%20dan%20proposal%20katering.`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FAF9F5] text-[#141413] hover:bg-[#FAF9F5]/90 transition-all text-xs font-semibold tracking-tight active:scale-[0.98]"
              >
                <span>WhatsApp Langsung Manajemen: {COMPANY_PROFILE.contacts[0].phone}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <Link
                href="/pesan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-8 py-3.5 border border-[#FAF9F5]/25 text-[#FAF9F5] hover:border-[#FAF9F5]/60 hover:bg-[#FAF9F5]/[0.05] transition-all text-xs font-medium tracking-tight active:scale-[0.98]"
              >
                <span>Formulir Pemesanan Tamu Online</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </Link>
            </div>

            {/* Direct Executive Contacts Footer Ledger */}
            <div className="pt-12 border-t border-[#FAF9F5]/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#8E8B81]">
              <div className="space-y-0.5">
                <strong className="text-[#FAF9F5] block font-sans">Didiet Santoso</strong>
                <span className="font-mono text-[11px]">Komisaris Perusahaan</span>
              </div>
              <div className="space-y-0.5">
                <strong className="text-[#FAF9F5] block font-sans">Nur Anisah</strong>
                <span className="font-mono text-[11px]">Direktur Utama</span>
              </div>
              <div className="space-y-0.5">
                <strong className="text-[#FAF9F5] block font-sans">Angellia</strong>
                <span className="font-mono text-[11px]">Layanan Pelanggan &amp; Kemitraan</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
