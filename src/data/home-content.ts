/**
 * Static content for the public site (homepage and menu catalogue).
 * Section components read from here so copy and figures are defined once.
 */
import { COMPANY_PROFILE } from "./catering-data";

export function buildWhatsAppUrl(message: string, number = COMPANY_PROFILE.mainWhatsApp): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const WA_MESSAGES = {
  consultation:
    "Halo PT Zahdan Kamal Sentosa, kami dari perusahaan ingin mengajukan konsultasi pengadaan katering karyawan.",
  proposal:
    "Halo PT Zahdan Kamal Sentosa, kami dari perusahaan ingin meminta sampel makanan dan proposal katering.",
} as const;

export interface PartnerClient {
  name: string;
  src: string;
}

export const PARTNER_CLIENTS: PartnerClient[] = [
  { name: "PT FCC Indonesia", src: "/images/clients/fcc.png" },
  { name: "PT Indosafety Sentosa Industry", src: "/images/clients/indosafety.png" },
  { name: "PT Indo Plating Technology", src: "/images/clients/indo-plating.png" },
  { name: "PT Daesang Food Indonesia", src: "/images/clients/daesang.png" },
  { name: "PT AT Indonesia", src: "/images/clients/at-indonesia.png" },
  { name: "PT Asahimas Flat Glass Tbk", src: "/images/clients/asahimas.png" },
];

export interface Fact {
  value: string;
  label: string;
}

export const HERO_FACTS: Fact[] = [
  { value: "5.000+", label: "Porsi per hari" },
  { value: "ISO 22000", label: "Keamanan pangan" },
  { value: "Halal", label: "Tersertifikasi resmi" },
  { value: "24 Jam", label: "Distribusi lintas shift" },
];

export interface CapacityStat {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export const CAPACITY_STATS: CapacityStat[] = [
  {
    value: 5000,
    suffix: "+",
    label: "Porsi per hari",
    description: "Diproduksi di dapur sentral Ciampel dengan steamer boiler uap dan kontrol porsi terstandar.",
  },
  {
    value: 12,
    suffix: "+",
    label: "Unit armada",
    description: "Kendaraan insulated box tertutup yang siaga 24 jam untuk shift pagi, siang, dan malam.",
  },
  {
    value: 99,
    suffix: "%",
    label: "Tepat waktu",
    description: "Kepatuhan SLA pengiriman yang teruji audit perusahaan PMA Jepang, Korea, dan multinasional.",
  },
  {
    value: 17,
    suffix: "+",
    label: "Tahun pengalaman",
    description: "Melayani katering skala pabrik dan perusahaan penanaman modal asing di Karawang sejak 2007.",
  },
];

export interface CorridorRoute {
  area: string;
  minutes: number;
}

export const CORRIDOR_ROUTES: CorridorRoute[] = [
  { area: "KIIC Karawang", minutes: 18 },
  { area: "Surya Cipta", minutes: 22 },
  { area: "KIM Karawang", minutes: 25 },
  { area: "BIC Purwakarta", minutes: 32 },
];

export interface Credential {
  title: string;
  reference: string;
}

export const CREDENTIALS: Credential[] = [
  { title: "ISO 22000:2009", reference: "Reg. ZKS 221076 0001" },
  { title: "Halal LPPOM MUI", reference: "ID32110006798080623" },
  { title: "NIB KBLI", reference: "241121002398" },
  { title: "Dinkes Karawang", reference: "Laik Higiene Gol. B" },
];

export interface ProcessStep {
  title: string;
  description: string;
}

export const WORKFLOW_STAGES: ProcessStep[] = [
  { title: "Raw intake QC", description: "Inspeksi organoleptik bahan segar dan verifikasi suhu rantai dingin dari pemasok teraudit." },
  { title: "RO prep & wash", description: "Pencucian sayur dan beras dengan air filtrasi Reverse Osmosis di ruang persiapan." },
  { title: "Steam thermal", description: "Pemasakan volume tinggi dengan boiler uap; suhu inti terverifikasi di atas 75°C." },
  { title: "QC & archive", description: "Uji organoleptik, kalibrasi rasa, dan retensi sampel H-0 selama 3×24 jam." },
  { title: "Cleanroom pack", description: "Pemorsian di ruang bertekanan positif oleh personel ber-APD lengkap." },
  { title: "Insulated transit", description: "Distribusi tertutup dengan armada insulated box menuju gerbang pabrik mitra." },
  { title: "On-site handover", description: "Serah terima bersama tim HRGA di kantin, tepat jadwal pergantian shift." },
];

export const QA_PROTOCOLS: ProcessStep[] = [
  { title: "Raw material intake", description: "Cek kesegaran dan suhu rantai dingin saat serah terima dari pemasok terverifikasi." },
  { title: "Daily hygiene standard", description: "Hairnet, masker medis, dan sarung tangan nitril food-grade dengan sanitasi berkala." },
  { title: "Thermal probe log", description: "Suhu inti masakan di atas 75°C diukur dengan termometer probe digital." },
  { title: "Cleanroom packaging", description: "Ruang kemas terisolasi dengan udara tersaring dan alur kerja satu arah." },
  { title: "Sanitation & water RO", description: "Air Reverse Osmosis untuk memasak dan mencuci, disinfeksi rutin peralatan." },
  { title: "Retention archive H-0", description: "Sampel setiap menu disimpan 3×24 jam untuk uji laboratorium independen." },
];

export interface SiteImage {
  src: string;
  alt: string;
}

/** Card photo for each menu package, keyed by price. */
export const PACKAGE_IMAGES: Record<number, SiteImage> = {
  17000: { src: "/images/industrial-facility.jpg", alt: "Lini produksi dapur sentral ZKS menyiapkan ribuan porsi" },
  20000: { src: "/images/chef-real-cooking.png", alt: "Juru masak ZKS memasak di dapur Ciampel" },
  25000: { src: "/images/hero-culinary.jpg", alt: "Hidangan premium ditata oleh juru masak" },
};

export interface FacilityDocument {
  category: string;
  title: string;
  subtitle: string;
  image: string;
}

export const FACILITY_DOCUMENTS: FacilityDocument[] = [
  {
    category: "Legalitas",
    title: "Laik Higiene Sanitasi & Halal BPJPH",
    subtitle: "Izin operasional jasaboga Gol. B dan sertifikat halal.",
    image: "/images/profile-docs/legalitas-resmi-1.png",
  },
  {
    category: "Dapur",
    title: "Boiler uap & filtrasi air RO",
    subtitle: "Instalasi air murni dan steam cooking volume besar.",
    image: "/images/profile-docs/galeri-teknologi-ro-steamer.png",
  },
  {
    category: "Cold storage",
    title: "Deep freezer rantai dingin",
    subtitle: "Penyimpanan daging, ayam, dan ikan pada suhu rendah.",
    image: "/images/profile-docs/galeri-gudang-freezer.png",
  },
  {
    category: "Produksi",
    title: "Lini masak satu arah",
    subtitle: "Tata ruang produksi searah berstandar higiene.",
    image: "/images/profile-docs/galeri-dapur-industri.png",
  },
  {
    category: "Armada",
    title: "Packing & armada tertutup",
    subtitle: "Pengantaran tepat waktu antar shift pabrik.",
    image: "/images/profile-docs/galeri-packing-armada.png",
  },
  {
    category: "Gudang",
    title: "Gudang bahan kering FIFO",
    subtitle: "Bahan baku pokok tersimpan di atas palet.",
    image: "/images/profile-docs/galeri-fasilitas-operasional.png",
  },
  {
    category: "Kantor",
    title: "Kantor manajemen & ruang audit",
    subtitle: "Pusat administrasi dan penerimaan auditor.",
    image: "/images/profile-docs/galeri-gedung-kantor.png",
  },
  {
    category: "SDM",
    title: "Legalitas SDM & medical check-up",
    subtitle: "Pemeriksaan kesehatan berkala tenaga dapur.",
    image: "/images/profile-docs/legalitas-sdm-mcu.png",
  },
];

/** Portion weights shared by every package, shown on the menu catalogue. */
export const PORTION_SPEC: { label: string; value: string }[] = [
  { label: "Karbohidrat (nasi pulen)", value: "±250 g" },
  { label: "Lauk hewani utama", value: "±100 g" },
  { label: "Sayur & serat", value: "±80 g" },
  { label: "Lauk nabati / pendamping", value: "±40 g" },
  { label: "Pelengkap & buah segar", value: "Termasuk" },
];

export const ORDER_TERMS: ProcessStep[] = [
  {
    title: "Lead time pemesanan",
    description: "Di bawah 500 porsi minimal H-1 sebelum acara. Mulai 500 porsi minimal H-3, demi kepastian bahan baku segar.",
  },
  {
    title: "Uang muka 20%",
    description: "Tersedia DP 20% untuk pesanan yang dikonfirmasi admin paling lambat H-2. Pelunasan H-1 pukul 23.59 WIB.",
  },
  {
    title: "Pengiriman ke kawasan industri",
    description: "Langsung ke kantin pabrik di KIIC, Suryacipta, KIM, dan Karawang Barat/Timur dengan armada berinsulasi.",
  },
];
