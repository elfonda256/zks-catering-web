/**
 * Static content for the public homepage (src/app/page.tsx).
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

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export const MILESTONES: Milestone[] = [
  { year: "2007", title: "Perusahaan berdiri", description: "Melayani katering pabrik pertama di Karawang." },
  { year: "2012", title: "Ekspansi produksi", description: "Dapur sentral dengan boiler uap dan cold storage." },
  { year: "2018", title: "Divisi industri", description: "Skala 5.000+ porsi dan sertifikasi ISO 22000." },
  { year: "Kini", title: "Mitra tepercaya", description: "Katering perusahaan multinasional di Jawa Barat." },
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
