import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InteractiveMenuSection from "@/components/InteractiveMenuSection";
import CompanyVerificationGallery from "@/components/CompanyVerificationGallery";
import StatCounter from "@/components/StatCounter";
import ScrollObserver from "@/components/ScrollObserver";
import { COMPANY_PROFILE } from "@/data/catering-data";
import {
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Factory,
  Truck,
  Package,
  Flame,
  Droplets,
  Thermometer,
  CheckCircle2,
  Utensils,
} from "@/components/icons";

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
            SECTION 1: HERO (Sprint 06: Layered Background, Ambient Lighting, 6% Bg Photo)
            ============================================================== */}
        <section className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-20 bg-[#FAF9F5] divider-hairline">
          {/* Layer 2: Ambient Lighting (Warm Industrial Glow & Soft White Highlight) */}
          <div className="absolute inset-0 z-0 pointer-events-none ambient-glow-warm" />
          <div className="absolute inset-0 z-0 pointer-events-none ambient-glow-white opacity-70" />

          {/* Layer 3: Editorial Background Photography (Opacity 6% with Soft Mask Fade) */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.06] mask-fade-bottom hero-enter-bg">
            <Image
              src="/images/industrial-facility.jpg"
              alt="Fasilitas operasional industri PT Zahdan Kamal Sentosa Karawang"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Kolom Kiri: Typographic Headline & Narrative (7 Kolom) */}
              <div className="lg:col-span-7 space-y-8">
                <div className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#C85A17] hero-enter-badge">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C85A17]" />
                  <span>Operasional Dapur Sentral Industri · Kawasan Manufaktur Karawang</span>
                </div>

                <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[60px] text-[#141413] tracking-[-0.04em] leading-[1.06] hero-enter-headline">
                  Penyedia Katering Industri Skala Besar untuk Manufaktur Karawang.
                </h1>

                <p className="font-sans text-base sm:text-lg text-[#626058] leading-relaxed max-w-xl font-normal hero-enter-sub">
                  Mitra strategis operasional pabrik dalam pemenuhan nutrisi ribuan tenaga kerja lintas shift. Tersertifikasi standar internasional <strong>ISO 22000</strong> dan <strong>Halal Resmi</strong> dengan ketepatan distribusi waktu tanpa kompromi.
                </p>

                {/* Primary & Secondary Action CTAs (Sprint 05: 180ms ease-out, 4px arrow move, animated underline) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1 hero-enter-actions">
                  <a
                    href={`https://wa.me/${COMPANY_PROFILE.mainWhatsApp}?text=Halo%20PT%20Zahdan%20Kamal%20Sentosa,%20kami%20dari%20perusahaan%20ingin%20mengajukan%20konsultasi%20pengadaan%20katering%20karyawan.`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-interactive-primary gap-2 px-6 py-3.5 rounded-lg text-xs sm:text-sm font-semibold tracking-tight shadow-xs group"
                  >
                    <span>Ajukan Proposal &amp; Uji Cita Rasa</span>
                    <ArrowUpRight className="w-4 h-4 opacity-75 btn-arrow" />
                  </a>

                  <Link
                    href="/menu"
                    className="btn-interactive-secondary gap-1.5 px-6 py-3.5 rounded-lg border border-[#141413]/15 text-[#141413] text-xs sm:text-sm font-medium tracking-tight group"
                  >
                    <span className="btn-text-underline">Lihat Rotasi Menu Harian</span>
                    <ArrowUpRight className="w-3.5 h-3.5 btn-secondary-icon text-[#141413]" />
                  </Link>
                </div>

                {/* Key Assurance Indicators */}
                <div className="pt-8 border-t border-[#141413]/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-[#626058] hero-enter-assurances">
                  <div>
                    <StatCounter
                      value={5000}
                      suffix="+"
                      separator="."
                      duration={1500}
                      className="font-display font-bold text-xl text-[#141413] block"
                    />
                    <span className="text-[11px] text-[#68655C]">Porsi Harian</span>
                  </div>
                  <div>
                    <span className="font-display font-bold text-xl text-[#C85A17] block">ISO 22000</span>
                    <span className="text-[11px] text-[#68655C]">Food Safety Reg.</span>
                  </div>
                  <div>
                    <span className="font-display font-bold text-xl text-emerald-700 block">100% Halal</span>
                    <span className="text-[11px] text-[#68655C]">LPPOM MUI</span>
                  </div>
                  <div>
                    <span className="font-display font-bold text-xl text-[#141413] block">24 Jam</span>
                    <span className="text-[11px] text-[#68655C]">Armada Shift Pabrik</span>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Photography Layer (5 Kolom, No White Floating Card) */}
              <div className="lg:col-span-5 relative hero-enter-photo">
                <div className="relative rounded-2xl overflow-hidden border border-[#141413]/10 bg-[#141413] shadow-lg group">
                  {/* Real Editorial Culinary Photography Plate */}
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src="/images/hero-culinary.jpg"
                      alt="Head Chef PT Zahdan Kamal Sentosa mempersiapkan hidangan katering korporat"
                      fill
                      priority
                      loading="eager"
                      className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-102"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    {/* Apple-style Gradient Fade Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-[#141413]/25 to-transparent" />
                  </div>

                  {/* Refined Photographic Caption Overlay (Integrated, not a floating card) */}
                  <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7 space-y-2">
                    <div className="inline-flex items-center gap-2 text-[#FAF9F5] text-[11px] font-mono tracking-wider uppercase text-[#D96B27]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Fasilitas Dapur Sentral 5.000+ Porsi/Hari</span>
                    </div>
                    <p className="font-display font-bold text-base sm:text-lg text-white leading-snug">
                      Presisi Higiene, Skala Produksi Nyata, &amp; Suplai Tepat Waktu.
                    </p>
                    <p className="text-xs text-[#FAF9F5]/70 leading-relaxed">
                      Dapur terpusat ZKS di Griya Indah Ciampel Karawang beroperasi 24 jam mendukung stabilitas nutrisi ribuan pekerja manufaktur lintas shift.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 01: TRUSTED CLIENT (Sprint 06: Soft Cream Tone, Ambient Cream Glow & Subtle Fleet Photo)
            ============================================================== */}
        <section id="klien-industri" className="py-24 sm:py-28 lg:py-32 bg-[#F8F6F0] divider-hairline relative reveal-on-scroll overflow-hidden">
          {/* Layer 2: Ambient Lighting (Gentle Cream Glow) */}
          <div className="absolute inset-0 z-0 pointer-events-none ambient-glow-cream" />

          {/* Layer 3: Editorial Fleet Photography Layer (Opacity 4%, Mask Corner Fade) */}
          <div className="absolute right-0 bottom-0 w-96 h-80 opacity-[0.04] photo-mask-corner pointer-events-none">
            <Image
              src="/images/armada-real.png"
              alt="Armada distribusi industri ZKS"
              fill
              className="object-contain object-right-bottom"
              sizes="384px"
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C85A17] block">
                Mitra Industri yang Telah Dilayani
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-[#141413] tracking-[-0.03em] reveal-title">
                Dipercaya oleh Pemimpin Industri Manufaktur
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#626058] font-normal leading-relaxed reveal-paragraph">
                Solusi katering industri terpercaya untuk ribuan pekerja pabrik manufaktur di koridor industri Karawang dan Jawa Barat.
              </p>
            </div>

            {/* Enterprise Logo Marquee (Slow Smooth Continuous Horizontal Motion) */}
            <div className="overflow-hidden mt-12 sm:mt-16 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
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

            <div className="mt-14 pt-8 border-t border-[#141413]/[0.06] text-center reveal-fade stagger-6">
              <p className="text-xs text-[#68655C]">
                Mendukung kesinambungan operasional harian ribuan pekerja di Kawasan Industri KIIC, Surya Cipta, KIM, dan BIC.
              </p>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 02: COMPANY STATISTICS (Sprint 06: Warm White Tone, Ambient Warm Glow & Authentic Chef Cooking Layer)
            ============================================================== */}
        <section className="relative py-24 sm:py-28 lg:py-32 bg-[#FAF9F5] divider-hairline overflow-hidden reveal-on-scroll">
          {/* Layer 2: Ambient Lighting (Gentle Warm Glow) */}
          <div className="absolute inset-0 z-0 pointer-events-none ambient-glow-warm" />

          {/* Layer 3: Editorial Chef Cooking Layer (Opacity 4.5%, Mask Center Fade) */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.045] photo-mask-center">
            <Image
              src="/images/chef-real-cooking.png"
              alt="Aktivitas dapur industri bervolume tinggi ZKS Karawang"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            {/* Minimal Metrics Grid with Hairline Dividers (No Cards, Pure Whitespace, Smooth 1.5s StatCounter) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 lg:divide-x lg:divide-[#141413]/[0.08] border-y border-[#141413]/[0.08] py-12 sm:py-16">
              {/* Metric 1 */}
              <div className="lg:px-8 first:lg:pl-0 space-y-2 reveal-fade-up stagger-1">
                <StatCounter
                  value={17}
                  suffix="+"
                  duration={1500}
                  className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-[#141413] tracking-[-0.04em] leading-none block"
                />
                <span className="text-sm sm:text-base font-semibold text-[#141413] tracking-tight block">
                  Years Experience
                </span>
                <p className="text-xs text-[#626058] leading-relaxed max-w-xs font-normal">
                  Berpengalaman sejak 2007 melayani katering skala pabrik manufaktur dan penanaman modal asing di Karawang.
                </p>
              </div>

              {/* Metric 2 */}
              <div className="lg:px-8 space-y-2 reveal-fade-up stagger-2">
                <StatCounter
                  value={5000}
                  suffix="+"
                  duration={1500}
                  className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-[#141413] tracking-[-0.04em] leading-none block"
                />
                <span className="text-sm sm:text-base font-semibold text-[#141413] tracking-tight block">
                  Meals Per Day
                </span>
                <p className="text-xs text-[#626058] leading-relaxed max-w-xs font-normal">
                  Kapasitas produksi harian dapur terpadu dengan mesin steamer uap dan kontrol porsi higienis terstandarisasi.
                </p>
              </div>

              {/* Metric 3 */}
              <div className="lg:px-8 space-y-2 reveal-fade-up stagger-3">
                <StatCounter
                  value={99}
                  suffix="%"
                  duration={1500}
                  className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-[#141413] tracking-[-0.04em] leading-none block"
                />
                <span className="text-sm sm:text-base font-semibold text-[#141413] tracking-tight block">
                  On-Time Delivery
                </span>
                <p className="text-xs text-[#626058] leading-relaxed max-w-xs font-normal">
                  Armada insulated box 24 jam menjamin suplai tiba tepat waktu untuk seluruh shift pagi, siang, dan malam pabrik.
                </p>
              </div>

              {/* Metric 4 */}
              <div className="lg:px-8 last:lg:pr-0 space-y-2 reveal-fade-up stagger-4">
                <StatCounter
                  value={100}
                  suffix="%"
                  duration={1500}
                  className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-[#141413] tracking-[-0.04em] leading-none block"
                />
                <span className="text-sm sm:text-base font-semibold text-[#141413] tracking-tight block">
                  Halal Commitment
                </span>
                <p className="text-xs text-[#626058] leading-relaxed max-w-xs font-normal">
                  Tersertifikasi resmi Halal LPPOM MUI dan sistem manajemen mutu ISO 22000 tanpa kompromi bahan baku.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 03: ABOUT COMPANY (Sprint 06: Soft Cream Tone, Ambient Cream Lighting)
            ============================================================== */}
        <section id="tentang" className="py-24 sm:py-28 lg:py-32 bg-[#F6F4ED] divider-hairline relative overflow-hidden reveal-on-scroll">
          {/* Layer 2: Ambient Lighting (Gentle Cream Glow & Soft White Highlight) */}
          <div className="absolute inset-0 z-0 pointer-events-none ambient-glow-cream" />
          <div className="absolute inset-0 z-0 pointer-events-none ambient-glow-white opacity-60" />

          <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10">
            <div className="space-y-4 max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C85A17] block">
                Sejarah &amp; Dedikasi Operasional
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#141413] tracking-[-0.03em] leading-[1.12] reveal-title">
                Membangun Fondasi Nutrisi Industri yang Konsisten dan Terpercaya.
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-[#626058] leading-relaxed font-normal reveal-paragraph max-w-4xl">
              <p>
                Didirikan pada tahun 2007 di Karawang, <strong>PT. Zahdan Kamal Sentosa (ZKS Catering)</strong> bertransformasi dari penyedia boga korporat menjadi mitra strategis utama bagi industri manufaktur berskala besar. Kami memahami bahwa makanan tenaga kerja pabrik bukan sekadar hidangan, melainkan energi utama yang menggerakkan produktivitas lini operasional.
              </p>
              <p>
                Dengan fasilitas dapur mandiri terintegrasi di Griya Indah Ciampel, kami menerapkan standar ketat manajemen keamanan pangan <strong>ISO 22000</strong>, jaminan <strong>Halal MUI</strong>, dan sanitasi berkala <strong>Dinas Kesehatan</strong> untuk melayani ribuan porsi harian tanpa cacat mutu.
              </p>
            </div>

            {/* Legal & Accreditation Credentials Strip */}
            <div className="pt-6 border-t border-[#141413]/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs reveal-fade-up stagger-2">
              <div>
                <span className="font-mono text-[11px] font-bold text-[#141413] block">ISO 22000:2009</span>
                <span className="text-[11px] text-[#68655C]">Reg. ZKS 221076 0001</span>
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-emerald-800 block">Halal LPPOM MUI</span>
                <span className="text-[11px] text-[#68655C]">ID32110006798080623</span>
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-[#141413] block">NIB Resmi KBLI</span>
                <span className="text-[11px] text-[#68655C]">241121002398</span>
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-[#141413] block">Dinkes Karawang</span>
                <span className="text-[11px] text-[#68655C]">Laik Higiene Gol. B</span>
              </div>
            </div>

            {/* Milestone Timeline Section Underneath (Sprint 05: Growing Line + Interactive Progressive Stepper) */}
            <div className="pt-8 border-t border-[#141413]/[0.08] space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#68655C] block">
                  Perjalanan &amp; Milestone Perusahaan
                </span>
                <span className="text-[11px] font-mono text-[#68655C] hidden sm:block">
                  2007 — 2026
                </span>
              </div>

              <div className="relative pt-2">
                {/* Connecting Progress Line (grows on viewport enter) */}
                <div className="absolute top-[21px] left-3 right-6 h-px bg-[#141413]/10 hidden sm:block overflow-hidden pointer-events-none">
                  <div className="h-full bg-gradient-to-r from-[#141413] via-[#C85A17] to-emerald-600 timeline-progress-line" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
                  {/* Step 1: 2007 */}
                  <div className="group/step relative p-3.5 -m-3.5 rounded-xl transition-all duration-[180ms] ease-out hover:bg-white/90 hover:shadow-xs border border-transparent hover:border-[#141413]/[0.08] cursor-pointer reveal-fade-up stagger-1 active:scale-[0.98]">
                    <div className="flex items-center gap-2">
                      <span className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#141413] transition-all duration-[180ms] ease-out group-hover/step:scale-125 group-hover/step:ring-4 group-hover/step:ring-[#141413]/15" />
                      <span className="font-display font-extrabold text-sm sm:text-base text-[#141413] tracking-tight transition-colors duration-[180ms] group-hover/step:text-[#C85A17]">
                        2007
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#141413] block mt-1.5 transition-transform duration-[180ms] group-hover/step:translate-x-0.5">
                      Company Founded
                    </span>
                    <p className="text-[11px] text-[#626058] group-hover/step:text-[#141413] leading-relaxed transition-colors duration-[180ms] mt-1">
                      Awal berdirinya ZKS di Karawang melayani katering pabrik pertama.
                    </p>
                  </div>

                  {/* Step 2: 2012 */}
                  <div className="group/step relative p-3.5 -m-3.5 rounded-xl transition-all duration-[180ms] ease-out hover:bg-white/90 hover:shadow-xs border border-transparent hover:border-[#141413]/[0.08] cursor-pointer reveal-fade-up stagger-2 active:scale-[0.98]">
                    <div className="flex items-center gap-2">
                      <span className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#141413] transition-all duration-[180ms] ease-out group-hover/step:scale-125 group-hover/step:ring-4 group-hover/step:ring-[#141413]/15" />
                      <span className="font-display font-extrabold text-sm sm:text-base text-[#141413] tracking-tight transition-colors duration-[180ms] group-hover/step:text-[#C85A17]">
                        2012
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#141413] block mt-1.5 transition-transform duration-[180ms] group-hover/step:translate-x-0.5">
                      Expanded Production
                    </span>
                    <p className="text-[11px] text-[#626058] group-hover/step:text-[#141413] leading-relaxed transition-colors duration-[180ms] mt-1">
                      Modernisasi dapur sentral dengan instalasi boiler uap &amp; cold storage.
                    </p>
                  </div>

                  {/* Step 3: 2018 */}
                  <div className="group/step relative p-3.5 -m-3.5 rounded-xl transition-all duration-[180ms] ease-out hover:bg-white/90 hover:shadow-xs border border-transparent hover:border-[#141413]/[0.08] cursor-pointer reveal-fade-up stagger-3 active:scale-[0.98]">
                    <div className="flex items-center gap-2">
                      <span className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#C85A17] transition-all duration-[180ms] ease-out group-hover/step:scale-125 group-hover/step:ring-4 group-hover/step:ring-[#C85A17]/25" />
                      <span className="font-display font-extrabold text-sm sm:text-base text-[#C85A17] tracking-tight transition-colors duration-[180ms] group-hover/step:text-[#A4460E]">
                        2018
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#141413] block mt-1.5 transition-transform duration-[180ms] group-hover/step:translate-x-0.5">
                      Industrial Division
                    </span>
                    <p className="text-[11px] text-[#626058] group-hover/step:text-[#141413] leading-relaxed transition-colors duration-[180ms] mt-1">
                      Divisi katering industri skala 5.000+ porsi &amp; sertifikasi ISO 22000.
                    </p>
                  </div>

                  {/* Step 4: Today */}
                  <div className="group/step relative p-3.5 -m-3.5 rounded-xl transition-all duration-[180ms] ease-out hover:bg-white/90 hover:shadow-xs border border-transparent hover:border-[#141413]/[0.08] cursor-pointer reveal-fade-up stagger-4 active:scale-[0.98]">
                    <div className="flex items-center gap-2">
                      <span className="relative z-10 w-2.5 h-2.5 rounded-full bg-emerald-600 transition-all duration-[180ms] ease-out group-hover/step:scale-125 group-hover/step:ring-4 group-hover/step:ring-emerald-600/25" />
                      <span className="font-display font-extrabold text-sm sm:text-base text-emerald-800 tracking-tight transition-colors duration-[180ms] group-hover/step:text-emerald-700">
                        Today
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#141413] block mt-1.5 transition-transform duration-[180ms] group-hover/step:translate-x-0.5">
                      Trusted Partner
                    </span>
                    <p className="text-[11px] text-[#626058] group-hover/step:text-[#141413] leading-relaxed transition-colors duration-[180ms] mt-1">
                      Mitra katering tepercaya perusahaan multinasional di Jawa Barat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 04: MICRO CTA (Sprint 06: Warm White Tone, Ambient Radial Warmth & Hairline Divider)
            ============================================================== */}
        <section className="relative py-20 sm:py-24 lg:py-28 bg-[#FAF9F5] divider-hairline text-center reveal-on-scroll overflow-hidden">
          {/* Layer 2: Ambient Lighting (Gentle Centered Warm Glow) */}
          <div className="absolute inset-0 z-0 pointer-events-none ambient-glow-warm opacity-80" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C85A17] block">
              Konsultasi Pengadaan Pabrik
            </span>

            <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-[#141413] tracking-[-0.03em] leading-snug reveal-title">
              Looking for a Reliable Catering Partner? Request a Free Consultation with Our Team.
            </h3>

            <p className="font-sans text-sm sm:text-base text-[#626058] max-w-xl mx-auto font-normal leading-relaxed reveal-paragraph">
              Diskusikan kebutuhan konsumsi multi-shift karyawan pabrik Anda, jadwalkan pengiriman sampel uji rasa gratis, atau survei audit langsung ke dapur produksi kami.
            </p>

            {/* Minimal Action Buttons with Sprint 05 180ms hover, 4px arrow motion, and secondary underline animation */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 reveal-fade-up stagger-2">
              <Link
                href="/pesan"
                className="w-full sm:w-auto btn-interactive-primary gap-2 px-7 py-3.5 rounded-lg text-xs sm:text-sm font-semibold tracking-tight shadow-xs group"
              >
                <span>Request Quotation</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-75 btn-arrow" />
              </Link>

              <a
                href={`https://wa.me/${COMPANY_PROFILE.mainWhatsApp}?text=Halo%20PT%20Zahdan%20Kamal%20Sentosa,%20kami%20ingin%20berkonsultasi%20mengenai%20katering%20industri%20pabrik.`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto btn-interactive-secondary gap-1.5 px-7 py-3.5 rounded-lg border border-[#141413]/15 text-[#141413] text-xs sm:text-sm font-medium tracking-tight group"
              >
                <span className="btn-text-underline">WhatsApp Sales</span>
                <ArrowUpRight className="w-3.5 h-3.5 btn-secondary-icon text-[#141413]" />
              </a>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 01 (Sprint 03 / Sprint 06): WHY CHOOSE US (Soft Neutral Tone, Ambient Lighting)
            ============================================================== */}
        <section id="keunggulan" className="py-24 sm:py-28 lg:py-32 bg-[#F7F5EE] divider-hairline relative reveal-on-scroll overflow-hidden">
          {/* Layer 2: Ambient Lighting (Gentle Warm Neutral Glow) */}
          <div className="absolute inset-0 z-0 pointer-events-none ambient-glow-cream" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Kolom Kiri: Narrative Value Proposition (5 Kolom) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C85A17] block">
                    Strategic Value Proposition
                  </span>
                  <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#141413] tracking-[-0.03em] leading-[1.12] reveal-title">
                    Why Leading Manufacturers Choose ZKS
                  </h2>
                </div>

                <p className="font-sans text-sm sm:text-base text-[#626058] leading-relaxed font-normal reveal-paragraph">
                  Di kawasan industri Karawang dengan ribuan tenaga kerja, keterlambatan konsumsi atau insiden mutu makanan adalah risiko fatal yang dapat melumpuhkan lini produksi pabrik. PT. Zahdan Kamal Sentosa hadir bukan sekadar sebagai katering biasa, melainkan sistem operasional boga industri yang dirancang khusus untuk stabilitas manufaktur Anda.
                </p>

                {/* Assurance Metrics Bar */}
                <div className="p-6 rounded-xl bg-[#F3F1E9] border border-[#141413]/[0.08] space-y-3 reveal-fade-up stagger-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#141413]">
                    <ShieldCheck className="w-4 h-4 text-[#C85A17]" />
                    <span>Garansi Keandalan Kontrak Korporat</span>
                  </div>
                  <p className="text-xs text-[#626058] leading-relaxed">
                    Sistem operasional kami teruji menghadapi audit ketat perusahaan PMA Jepang, Korea, dan multinasional dengan kepatuhan SLA 99% tepat waktu.
                  </p>
                </div>
              </div>

              {/* Kolom Kanan: 4 Premium Value Blocks (7 Kolom, Hairline Separators, Staggered Reveals) */}
              <div className="lg:col-span-7">
                <div className="divide-y divide-[#141413]/[0.08] border-y border-[#141413]/[0.08]">
                  {/* Item 1: Operational Reliability */}
                  <div className="py-7 sm:py-8 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start group reveal-fade-up stagger-1">
                    <div className="sm:col-span-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#141413] text-[#FAF9F5] flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="font-display font-bold text-base sm:text-lg text-[#141413] tracking-tight">
                        Operational Reliability
                      </span>
                    </div>
                    <div className="sm:col-span-8 text-xs sm:text-sm text-[#626058] leading-relaxed">
                      Sistem produksi dan pengiriman terstruktur 3 shift tanpa jeda sepanjang tahun, memastikan ribuan pekerja shift pagi, siang, lembur, dan malam menerima asupan nutrisi tepat waktu.
                    </div>
                  </div>

                  {/* Item 2: Food Safety Standard */}
                  <div className="py-7 sm:py-8 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start group reveal-fade-up stagger-2">
                    <div className="sm:col-span-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#C85A17] text-[#FAF9F5] flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="font-display font-bold text-base sm:text-lg text-[#141413] tracking-tight">
                        Food Safety Standard
                      </span>
                    </div>
                    <div className="sm:col-span-8 text-xs sm:text-sm text-[#626058] leading-relaxed">
                      Penerapan protokol HACCP menyeluruh dari inspeksi bahan baku, filtrasi air Reverse Osmosis, hingga retensi arsip sampel makanan H-0 selama 3x24 jam untuk pencegahan risiko kontaminasi secara mutlak.
                    </div>
                  </div>

                  {/* Item 3: Scalable Production */}
                  <div className="py-7 sm:py-8 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start group reveal-fade-up stagger-3">
                    <div className="sm:col-span-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#141413] text-[#FAF9F5] flex items-center justify-center shrink-0">
                        <Factory className="w-4 h-4" />
                      </div>
                      <span className="font-display font-bold text-base sm:text-lg text-[#141413] tracking-tight">
                        Scalable Production
                      </span>
                    </div>
                    <div className="sm:col-span-8 text-xs sm:text-sm text-[#626058] leading-relaxed">
                      Dapur sentral industri berkapasitas 5.000+ porsi harian dengan mesin steamer uap boiler bertekanan tinggi yang siap meningkatkan kapasitas saat lonjakan lembur atau shift kerja mendadak.
                    </div>
                  </div>

                  {/* Item 4: On-Time Delivery */}
                  <div className="py-7 sm:py-8 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start group reveal-fade-up stagger-4">
                    <div className="sm:col-span-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#141413] text-[#FAF9F5] flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="font-display font-bold text-base sm:text-lg text-[#141413] tracking-tight">
                        On-Time Delivery
                      </span>
                    </div>
                    <div className="sm:col-span-8 text-xs sm:text-sm text-[#626058] leading-relaxed">
                      Armada insulated box berpengatur suhu tertutup dengan akses cepat gerbang tol Karawang menjamin waktu transit rata-rata di bawah 35 menit menuju KIIC, Surya Cipta, KIM, dan BIC.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 02 (Sprint 03 / Sprint 06): PRODUCTION CAPACITY (Ambient Dark Warmth & Steam Boiler Layer)
            ============================================================== */}
        <section id="operasional" className="py-24 sm:py-28 lg:py-32 bg-[#141413] text-[#FAF9F5] relative overflow-hidden divider-hairline-dark reveal-on-scroll">
          {/* Layer 2: Ambient Lighting (Gentle Warm Industrial Glow in Charcoal Canvas) */}
          <div className="absolute inset-0 z-0 pointer-events-none ambient-dark-warmth" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D96B27] block">
                Skala Operasional Nyata
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#FAF9F5] tracking-[-0.03em] leading-tight reveal-title">
                Infrastruktur Produksi Mandiri yang Dirancang untuk Skala Besar.
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#A8A69E] leading-relaxed reveal-paragraph">
                Bukan sekadar klaim pemasaran. Fasilitas terpusat kami di Griya Indah Ciampel dibangun khusus dengan mesin boiler uap berkapasitas ratusan kilogram dan cold room independen untuk menjaga kesinambungan operasional pabrik tanpa kompromi.
              </p>
            </div>

            {/* Horizontal Desktop Metrics Layout with Smooth 1.5s StatCounters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[#FAF9F5]/[0.1] border-y border-[#FAF9F5]/[0.1] py-12 sm:py-16">
              <div className="lg:px-8 first:lg:pl-0 space-y-2 reveal-fade-up stagger-1">
                <StatCounter
                  value={5000}
                  suffix="+"
                  separator=","
                  duration={1500}
                  className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#FAF9F5] tracking-[-0.04em] leading-none block"
                />
                <span className="text-sm font-semibold text-[#D96B27] tracking-tight block">
                  Meals Produced Daily
                </span>
                <p className="text-xs text-[#A8A69E] leading-relaxed">
                  Porsi harian terdistribusi ke berbagai korporasi manufaktur lintas shift operasional.
                </p>
              </div>

              <div className="lg:px-8 space-y-2 reveal-fade-up stagger-2">
                <StatCounter
                  value={1}
                  duration={1500}
                  className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#FAF9F5] tracking-[-0.04em] leading-none block"
                />
                <span className="text-sm font-semibold text-[#D96B27] tracking-tight block">
                  Central Kitchen Facility
                </span>
                <p className="text-xs text-[#A8A69E] leading-relaxed">
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
                <span className="text-sm font-semibold text-[#D96B27] tracking-tight block">
                  Delivery Fleet Units
                </span>
                <p className="text-xs text-[#A8A69E] leading-relaxed">
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
                <span className="text-sm font-semibold text-[#D96B27] tracking-tight block">
                  Years Experience
                </span>
                <p className="text-xs text-[#A8A69E] leading-relaxed">
                  Pengalaman operasional melayani penanaman modal asing (PMA) di Karawang sejak 2007.
                </p>
              </div>
            </div>

            {/* Industrial Corridor Coverage Badge */}
            <div className="p-6 rounded-xl bg-[#FAF9F5]/[0.03] border border-[#FAF9F5]/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs text-[#A8A69E] reveal-fade-up stagger-5">
              <div className="space-y-1">
                <span className="font-semibold text-[#FAF9F5] block">
                  Akses Strategis Kawasan Industri Karawang &amp; Sekitarnya:
                </span>
                <p>
                  Terhubung cepat via gerbang tol Karawang Barat &amp; Timur menuju Kawasan Industri KIIC, Suryacipta City of Industry, Kawasan Industri Mitra (KIM), dan Bukit Indah City (BIC).
                </p>
              </div>
              <div className="shrink-0 font-mono text-[11px] text-[#D96B27] font-semibold">
                Transit Time Rata-rata: &lt; 35 Menit
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 03 (Sprint 03 / Sprint 06): FOOD PRODUCTION WORKFLOW (Warm White Tone, Ambient Glow & Packaging Line Layer)
            ============================================================== */}
        <section id="alur-produksi" className="py-24 sm:py-28 lg:py-32 bg-[#FAF9F5] divider-hairline relative reveal-on-scroll overflow-hidden">
          {/* Layer 2: Ambient Lighting (Gentle Warm Glow & Soft White Highlight) */}
          <div className="absolute inset-0 z-0 pointer-events-none ambient-glow-warm opacity-70" />
          <div className="absolute inset-0 z-0 pointer-events-none ambient-glow-white opacity-60" />

          {/* Layer 3: Editorial Packaging Line Photography (Opacity 4%, Mask Corner Fade) */}
          <div className="absolute right-0 bottom-0 w-[450px] h-[350px] opacity-[0.04] photo-mask-corner pointer-events-none">
            <Image
              src="/images/profile-docs/galeri-packing-armada.png"
              alt="Ruang pemorsian bento dan penyiapan armada higienis ZKS"
              fill
              className="object-cover object-right-bottom"
              sizes="450px"
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C85A17] block">
                Alur Produksi Terstandarisasi
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#141413] tracking-[-0.03em] leading-tight reveal-title">
                7 Tahapan Alur Kerja Dapur Skala Industri
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#626058] font-normal leading-relaxed reveal-paragraph">
                Setiap porsi makanan melewati alur kerja higienis satu arah (*one-way production flow*) untuk memastikan presisi nutrisi, konsistensi rasa, dan kepatuhan standar sanitasi mutlak.
              </p>
            </div>

            {/* Premium Horizontal Timeline on Desktop with Progressive Line Growth & Sequential Stages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 lg:gap-4 relative pt-6">
              {/* Stage 1: Ingredient Selection */}
              <div className="group/stage relative p-3.5 -m-3.5 rounded-xl transition-all duration-[180ms] ease-out hover:bg-white hover:shadow-xs border border-transparent hover:border-[#141413]/[0.08] cursor-pointer space-y-3 reveal-fade-up stagger-1 active:scale-[0.98]">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#141413] text-[#FAF9F5] flex items-center justify-center font-display font-bold text-xs shrink-0 transition-all duration-[180ms] ease-out group-hover/stage:bg-[#C85A17] group-hover/stage:text-white group-hover/stage:scale-105 group-hover/stage:shadow-xs">
                    01
                  </span>
                  <span className="h-px flex-1 bg-[#141413]/10 hidden lg:block timeline-progress-line" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C85A17] transition-transform duration-[180ms] ease-out group-hover/stage:scale-125" />
                    <h3 className="font-display font-bold text-sm text-[#141413] transition-colors duration-[180ms] group-hover/stage:text-[#C85A17]">
                      Ingredient Selection
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#626058] group-hover/stage:text-[#141413] leading-relaxed transition-colors duration-[180ms]">
                    Inspeksi harian mutu sayur segar &amp; rantai dingin protein hewani dari vendor terverifikasi.
                  </p>
                </div>
              </div>

              {/* Stage 2: Preparation */}
              <div className="group/stage relative p-3.5 -m-3.5 rounded-xl transition-all duration-[180ms] ease-out hover:bg-white hover:shadow-xs border border-transparent hover:border-[#141413]/[0.08] cursor-pointer space-y-3 reveal-fade-up stagger-2 active:scale-[0.98]">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#141413] text-[#FAF9F5] flex items-center justify-center font-display font-bold text-xs shrink-0 transition-all duration-[180ms] ease-out group-hover/stage:bg-[#C85A17] group-hover/stage:text-white group-hover/stage:scale-105 group-hover/stage:shadow-xs">
                    02
                  </span>
                  <span className="h-px flex-1 bg-[#141413]/10 hidden lg:block timeline-progress-line" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-[#C85A17] transition-transform duration-[180ms] ease-out group-hover/stage:scale-125" />
                    <h3 className="font-display font-bold text-sm text-[#141413] transition-colors duration-[180ms] group-hover/stage:text-[#C85A17]">
                      Water RO &amp; Prep
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#626058] group-hover/stage:text-[#141413] leading-relaxed transition-colors duration-[180ms]">
                    Pencucian bahan dengan air terfiltrasi Reverse Osmosis di ruang persiapan steril.
                  </p>
                </div>
              </div>

              {/* Stage 3: Cooking */}
              <div className="group/stage relative p-3.5 -m-3.5 rounded-xl transition-all duration-[180ms] ease-out hover:bg-white hover:shadow-xs border border-transparent hover:border-[#141413]/[0.08] cursor-pointer space-y-3 reveal-fade-up stagger-3 active:scale-[0.98]">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#141413] text-[#FAF9F5] flex items-center justify-center font-display font-bold text-xs shrink-0 transition-all duration-[180ms] ease-out group-hover/stage:bg-[#C85A17] group-hover/stage:text-white group-hover/stage:scale-105 group-hover/stage:shadow-xs">
                    03
                  </span>
                  <span className="h-px flex-1 bg-[#141413]/10 hidden lg:block timeline-progress-line" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#C85A17] transition-transform duration-[180ms] ease-out group-hover/stage:scale-125" />
                    <h3 className="font-display font-bold text-sm text-[#141413] transition-colors duration-[180ms] group-hover/stage:text-[#C85A17]">
                      Controlled Cooking
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#626058] group-hover/stage:text-[#141413] leading-relaxed transition-colors duration-[180ms]">
                    Pemasakan volume tinggi dengan ketel uap; suhu inti hidangan dipastikan &gt; 75°C.
                  </p>
                </div>
              </div>

              {/* Stage 4: Quality Inspection */}
              <div className="group/stage relative p-3.5 -m-3.5 rounded-xl transition-all duration-[180ms] ease-out hover:bg-white hover:shadow-xs border border-transparent hover:border-[#141413]/[0.08] cursor-pointer space-y-3 reveal-fade-up stagger-4 active:scale-[0.98]">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#C85A17] text-[#FAF9F5] flex items-center justify-center font-display font-bold text-xs shrink-0 transition-all duration-[180ms] ease-out group-hover/stage:bg-[#A4460E] group-hover/stage:text-white group-hover/stage:scale-105 group-hover/stage:shadow-xs">
                    04
                  </span>
                  <span className="h-px flex-1 bg-[#141413]/10 hidden lg:block timeline-progress-line" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-[#C85A17] transition-transform duration-[180ms] ease-out group-hover/stage:scale-125" />
                    <h3 className="font-display font-bold text-sm text-[#141413] transition-colors duration-[180ms] group-hover/stage:text-[#C85A17]">
                      Quality Inspection
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#626058] group-hover/stage:text-[#141413] leading-relaxed transition-colors duration-[180ms]">
                    Uji organoleptik rasa &amp; tekstur, serta pengarsipan retensi sampel makanan H-0 selama 3x24 jam.
                  </p>
                </div>
              </div>

              {/* Stage 5: Packaging */}
              <div className="group/stage relative p-3.5 -m-3.5 rounded-xl transition-all duration-[180ms] ease-out hover:bg-white hover:shadow-xs border border-transparent hover:border-[#141413]/[0.08] cursor-pointer space-y-3 reveal-fade-up stagger-5 active:scale-[0.98]">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#141413] text-[#FAF9F5] flex items-center justify-center font-display font-bold text-xs shrink-0 transition-all duration-[180ms] ease-out group-hover/stage:bg-[#C85A17] group-hover/stage:text-white group-hover/stage:scale-105 group-hover/stage:shadow-xs">
                    05
                  </span>
                  <span className="h-px flex-1 bg-[#141413]/10 hidden lg:block timeline-progress-line" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-[#C85A17] transition-transform duration-[180ms] ease-out group-hover/stage:scale-125" />
                    <h3 className="font-display font-bold text-sm text-[#141413] transition-colors duration-[180ms] group-hover/stage:text-[#C85A17]">
                      Sterile Packaging
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#626058] group-hover/stage:text-[#141413] leading-relaxed transition-colors duration-[180ms]">
                    Pemorsian bento di ruangan steril ber-AC dengan staf menggunakan APD dan sarung tangan nitril.
                  </p>
                </div>
              </div>

              {/* Stage 6: Delivery */}
              <div className="group/stage relative p-3.5 -m-3.5 rounded-xl transition-all duration-[180ms] ease-out hover:bg-white hover:shadow-xs border border-transparent hover:border-[#141413]/[0.08] cursor-pointer space-y-3 reveal-fade-up stagger-6 active:scale-[0.98]">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#141413] text-[#FAF9F5] flex items-center justify-center font-display font-bold text-xs shrink-0 transition-all duration-[180ms] ease-out group-hover/stage:bg-[#C85A17] group-hover/stage:text-white group-hover/stage:scale-105 group-hover/stage:shadow-xs">
                    06
                  </span>
                  <span className="h-px flex-1 bg-[#141413]/10 hidden lg:block timeline-progress-line" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#C85A17] transition-transform duration-[180ms] ease-out group-hover/stage:scale-125" />
                    <h3 className="font-display font-bold text-sm text-[#141413] transition-colors duration-[180ms] group-hover/stage:text-[#C85A17]">
                      Thermal Dispatch
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#626058] group-hover/stage:text-[#141413] leading-relaxed transition-colors duration-[180ms]">
                    Distribusi armada insulated box tertutup dengan jadwal presisi pergantian shift kerja.
                  </p>
                </div>
              </div>

              {/* Stage 7: Serving */}
              <div className="group/stage relative p-3.5 -m-3.5 rounded-xl transition-all duration-[180ms] ease-out hover:bg-white hover:shadow-xs border border-transparent hover:border-[#141413]/[0.08] cursor-pointer space-y-3 reveal-fade-up stagger-7 active:scale-[0.98]">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-700 text-[#FAF9F5] flex items-center justify-center font-display font-bold text-xs shrink-0 transition-all duration-[180ms] ease-out group-hover/stage:bg-emerald-800 group-hover/stage:scale-105 group-hover/stage:shadow-xs">
                    07
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-emerald-700 transition-transform duration-[180ms] ease-out group-hover/stage:scale-125" />
                    <h3 className="font-display font-bold text-sm text-[#141413] transition-colors duration-[180ms] group-hover/stage:text-emerald-800">
                      On-Site Serving
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#626058] group-hover/stage:text-[#141413] leading-relaxed transition-colors duration-[180ms]">
                    Serah terima tepat waktu di kantin pabrik, siap dikonsumsi hangat oleh seluruh pekerja.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 04 (Sprint 03 / Sprint 06): FOOD SAFETY & QA (Editorial Muted Beige, Ambient Cream Lighting & Lab QA Layer)
            ============================================================== */}
        <section id="keamanan-pangan" className="py-24 sm:py-28 lg:py-32 bg-[#F3F1E9] divider-hairline relative overflow-hidden reveal-on-scroll">
          {/* Layer 2: Ambient Lighting (Gentle Cream Glow & Soft White Highlight) */}
          <div className="absolute inset-0 z-0 pointer-events-none ambient-glow-cream" />

          {/* Layer 3: Editorial QA & Lab Testing Photography Layer (Opacity 5%, Mask Corner Fade) */}
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-[0.05] photo-mask-corner pointer-events-none">
            <Image
              src="/images/food-safety-audit.jpg"
              alt="Uji laboratorium mikrobiologi dan jaminan mutu pangan ZKS"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Kolom Kiri: Operational Quality Protocols (7 Kolom) */}
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C85A17] block">
                    Standarisasi &amp; Kepatuhan Audit
                  </span>
                  <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#141413] tracking-[-0.03em] leading-tight reveal-title">
                    Protokol Keamanan Pangan Tanpa Kompromi untuk Ribuan Tenaga Kerja.
                  </h2>
                </div>

                <p className="font-sans text-sm sm:text-base text-[#626058] leading-relaxed font-normal reveal-paragraph">
                  Bagi industri manufaktur modern dengan ribuan pekerja, insiden keracunan makanan dapat menghentikan lini perakitan pabrik dan menimbulkan kerugian operasional yang masif. PT. Zahdan Kamal Sentosa menerapkan sistem kendali mutu berbasis HACCP dan ISO 22000 yang siap diaudit kapan pun oleh tim safety &amp; HRGA perusahaan Anda.
                </p>

                {/* 6 Structured Operational Quality Protocols */}
                <div className="divide-y divide-[#141413]/[0.08] border-y border-[#141413]/[0.08] text-xs">
                  <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline reveal-fade-up stagger-1">
                    <div className="sm:col-span-4 font-semibold text-[#141413] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C85A17]" />
                      <span>Ingredient Inspection</span>
                    </div>
                    <div className="sm:col-span-8 text-[#626058] leading-relaxed">
                      Pemeriksaan ketat kesegaran organoleptik dan verifikasi suhu rantai dingin daging beku saat serah terima dari supplier terverifikasi.
                    </div>
                  </div>

                  <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline reveal-fade-up stagger-2">
                    <div className="sm:col-span-4 font-semibold text-[#141413] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C85A17]" />
                      <span>Daily Hygiene Standard</span>
                    </div>
                    <div className="sm:col-span-8 text-[#626058] leading-relaxed">
                      Staf dapur wajib mengenakan APD lengkap (hairnet, masker medis, dan sarung tangan nitril *food-grade*) dengan sanitasi berkala.
                    </div>
                  </div>

                  <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline reveal-fade-up stagger-2">
                    <div className="sm:col-span-4 font-semibold text-[#141413] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C85A17]" />
                      <span>Temperature Monitoring</span>
                    </div>
                    <div className="sm:col-span-8 text-[#626058] leading-relaxed">
                      Pengukuran berkala suhu inti masakan &gt; 75°C menggunakan termometer probe digital guna memastikan eliminasi patogen sempurna.
                    </div>
                  </div>

                  <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline reveal-fade-up stagger-3">
                    <div className="sm:col-span-4 font-semibold text-[#141413] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C85A17]" />
                      <span>Packaging Procedure</span>
                    </div>
                    <div className="sm:col-span-8 text-[#626058] leading-relaxed">
                      Ruang pengemasan terisolasi dengan sirkulasi udara berpenyaring dan alur kerja satu arah guna mencegah kontaminasi silang.
                    </div>
                  </div>

                  <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline reveal-fade-up stagger-3">
                    <div className="sm:col-span-4 font-semibold text-[#141413] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C85A17]" />
                      <span>Sanitation &amp; Water RO</span>
                    </div>
                    <div className="sm:col-span-8 text-[#626058] leading-relaxed">
                      Penggunaan air Reverse Osmosis (RO) untuk memasak dan pencucian bahan, serta disinfeksi rutin peralatan menggunakan deterjen ramah pangan.
                    </div>
                  </div>

                  <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline reveal-fade-up stagger-4">
                    <div className="sm:col-span-4 font-semibold text-[#141413] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>Retensi Sampel H-0</span>
                    </div>
                    <div className="sm:col-span-8 text-[#626058] leading-relaxed">
                      Penyimpanan arsip sampel makanan setiap menu selama 3 x 24 jam dalam lemari pendingin tertutup untuk keperluan uji laboratorium independen.
                    </div>
                  </div>
                </div>

                {/* Elegantly Displayed Trust Indicators */}
                <div className="pt-6 border-t border-[#141413]/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs reveal-fade-up stagger-4">
                  <div>
                    <strong className="text-[#141413] block">ISO 22000:2009</strong>
                    <span className="font-mono text-[11px] text-[#626058]">ZKS 221076 0001</span>
                  </div>
                  <div>
                    <strong className="text-emerald-800 block">Sertifikat Halal Resmi</strong>
                    <span className="font-mono text-[11px] text-[#626058]">ID32110006798080623</span>
                  </div>
                  <div>
                    <strong className="text-[#141413] block">NIB Usaha KBLI</strong>
                    <span className="font-mono text-[11px] text-[#626058]">241121002398</span>
                  </div>
                  <div>
                    <strong className="text-[#141413] block">Dinkes Karawang</strong>
                    <span className="font-mono text-[11px] text-[#626058]">Laik Higiene Gol. B</span>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Large Quality Inspection Photography (5 Kolom, Slow Mask Image Reveal) */}
              <div className="lg:col-span-5 relative mt-8 lg:mt-0">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] reveal-image">
                  <Image
                    src="/images/food-safety-audit.jpg"
                    alt="Inspeksi kualitas makanan dan higienis dapur ZKS Karawang"
                    fill
                    className="object-cover opacity-90 transition-transform duration-700 hover:scale-102"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F3F1E9] via-transparent to-transparent opacity-80" />
                </div>

                <div className="mt-4 px-2 text-center lg:text-left space-y-1 reveal-fade stagger-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#C85A17] block">
                    Laboratorium &amp; Quality Control
                  </span>
                  <p className="text-xs text-[#68655C]">
                    Pemeriksaan mikrobiologis berkala bekerja sama dengan laboratorium penguji terakreditasi di Karawang.
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
            SECTION 6 (Sprint 06): INTERACTIVE MENU EXPERIENCE (Warm White Tone, Ambient Warmth & Culinary Layer)
            ============================================================== */}
        <section id="menu-katering" className="relative py-24 sm:py-28 lg:py-32 bg-[#FAF9F5] divider-hairline reveal-on-scroll overflow-hidden">
          {/* Layer 2: Ambient Lighting (Gentle Warm Glow & Soft White Highlight) */}
          <div className="absolute inset-0 z-0 pointer-events-none ambient-glow-warm opacity-80" />
          <div className="absolute inset-0 z-0 pointer-events-none ambient-glow-white opacity-60" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#C85A17]">
                Katalog Menu Interaktif
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#141413] tracking-[-0.03em] leading-tight reveal-title">
                Variasi Menu Bergizi Seimbang dengan Rotasi Harian.
              </h2>
              <p className="text-sm text-[#626058] leading-relaxed reveal-paragraph">
                Karyawan tidak akan merasa jenuh berkat rotasi menu Senin s.d. Sabtu. Setiap paket dirancang dengan kalkulasi gramasi karbohidrat, protein hewani, dan serat yang proporsional.
              </p>
            </div>

            {/* Interactive React Client Catalog */}
            <InteractiveMenuSection />
          </div>
        </section>

        {/* ==============================================================
            SECTION 7 (Sprint 06): LARGE EDITORIAL CTA (Ambient Dark Warmth & Facility Layer)
            ============================================================== */}
        <section id="kontak-korporat" className="py-24 sm:py-28 lg:py-32 bg-[#141413] text-[#FAF9F5] relative overflow-hidden divider-hairline-dark reveal-on-scroll">
          {/* Layer 2: Ambient Lighting (Natural Warm Amber Glow in Dark Canvas) */}
          <div className="absolute inset-0 z-0 pointer-events-none ambient-dark-warmth" />

          {/* Layer 3: Editorial Facility Headquarters Photography Layer (Opacity 6.5%, Center Mask) */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.065] photo-mask-center">
            <Image
              src="/images/profile-docs/galeri-fasilitas-operasional.png"
              alt="Fasilitas gedung dapur mandiri PT Zahdan Kamal Sentosa Ciampel Karawang"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-10">
            <div className="space-y-4 max-w-3xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D96B27]">
                Pengadaan Katering Korporat & Pabrik
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#FAF9F5] tracking-[-0.03em] leading-tight reveal-title">
                Mulai Pembahasan Kebutuhan Katering Karyawan Anda Hari Ini.
              </h2>
              <p className="text-sm sm:text-base text-[#A8A69E] leading-relaxed reveal-paragraph">
                Hubungi manajemen PT. Zahdan Kamal Sentosa untuk menjadwalkan presentasi, survei kapasitas dapur bersama tim HRGA/Purchasing, atau pengiriman paket sampel rasa ke pabrik Anda.
              </p>
            </div>

            {/* Action Buttons with Sprint 05 180ms hover, 4px arrow motion, and secondary underline animation */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal-fade-up stagger-2">
              <a
                href={`https://wa.me/${COMPANY_PROFILE.mainWhatsApp}?text=Halo%20PT%20Zahdan%20Kamal%20Sentosa,%20kami%20dari%20perusahaan%20ingin%20meminta%20sampel%20makanan%20dan%20proposal%20katering.`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto btn-interactive-accent gap-2 px-8 py-4 rounded-lg text-white text-xs sm:text-sm font-semibold tracking-tight shadow-md group"
              >
                <span>WhatsApp Langsung Manajemen: {COMPANY_PROFILE.contacts[0].phone}</span>
                <ArrowUpRight className="w-4 h-4 btn-arrow" />
              </a>

              <Link
                href="/pesan"
                className="w-full sm:w-auto btn-interactive-secondary gap-1.5 px-8 py-4 rounded-lg border border-[#FAF9F5]/20 text-[#FAF9F5] text-xs sm:text-sm font-medium tracking-tight group hover:bg-[#FAF9F5]/[0.08]"
              >
                <span className="btn-text-underline">Formulir Pemesanan Tamu Online</span>
                <ArrowUpRight className="w-4 h-4 btn-secondary-icon text-[#FAF9F5]" />
              </Link>
            </div>

            {/* Direct Executive Contacts Footer */}
            <div className="pt-12 border-t border-[#FAF9F5]/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#A8A69E]">
              <div>
                <strong className="text-[#FAF9F5] block">Didiet Santoso</strong>
                <span>Komisaris Perusahaan</span>
              </div>
              <div>
                <strong className="text-[#FAF9F5] block">Nur Anisah</strong>
                <span>Direktur Utama</span>
              </div>
              <div>
                <strong className="text-[#FAF9F5] block">Angellia</strong>
                <span>Layanan Pelanggan & Kemitraan</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
