import Link from "next/link";
import Image from "next/image";
import { COMPANY_PROFILE } from "@/data/catering-data";
import { ArrowUpRight, ShieldCheck, MapPin, Phone } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="bg-[#141413] text-[#FAF9F5] border-t border-[#FAF9F5]/[0.08] relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C85A17]/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-[#FAF9F5]/[0.08]">
          {/* Kolom 1: Profil Entitas Hukum (5 Kolom) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-[#0d2238] border border-white/10 shadow-xs">
                <Image
                  src="/images/zks-logo-official.png"
                  alt="PT. Zahdan Kamal Sentosa Logo"
                  fill
                  className="object-cover object-left"
                />
              </div>
              <span className="font-display font-bold text-lg text-[#FAF9F5] tracking-[-0.02em]">
                {COMPANY_PROFILE.name}
              </span>
            </div>

            <p className="text-sm text-[#A8A69E] leading-relaxed max-w-md">
              Penyedia jasa katering industri skala besar dan mitra strategis pemenuhan gizi pekerja pabrik manufaktur di koridor industri Karawang sejak 2007.
            </p>

            <div className="pt-2 space-y-2 text-xs text-[#A8A69E]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C85A17] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#FAF9F5]">Fasilitas Dapur Terpadu:</strong> {COMPANY_PROFILE.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>
                  <strong className="text-[#FAF9F5]">Zona Layanan Logistik:</strong> KIIC, Suryacipta City of Industry, Kawasan Industri Mitra (KIM), Karawang Barat & Timur.
                </span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Sertifikasi & Audit Standar (3 Kolom) */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs font-semibold text-[#A8A69E] uppercase tracking-[0.1em]">
              Kepatuhan & Sertifikasi
            </p>
            <ul className="text-xs text-[#A8A69E] space-y-3">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C85A17] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#FAF9F5]">ISO 22000:2009</strong>
                  <br />
                  Reg. ZKS 221076 0001 (Food Safety)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#FAF9F5]">Sertifikat Halal Resmi</strong>
                  <br />
                  ID32110006798080623 (LPPOM MUI)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C85A17] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#FAF9F5]">Laik Higiene Sanitasi</strong>
                  <br />
                  Jasa Boga Golongan B Dinas Kesehatan
                </span>
              </li>
              <li className="text-[11px] text-[#A8A69E] pt-1">
                NIB: 241121002398 · NPWP: 21.018.177.2-433.000
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak Manajemen & Layanan (2 Kolom) */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-xs font-semibold text-[#A8A69E] uppercase tracking-[0.1em]">
              Manajemen Kemitraan
            </p>
            <div className="space-y-3 text-xs">
              {COMPANY_PROFILE.contacts.map((c, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[#FAF9F5] font-medium">{c.name}</span>
                  <span className="text-[11px] text-[#A8A69E]">{c.role}</span>
                  <a
                    href={`https://wa.me/${c.waNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#C85A17] hover:text-[#D96B27] transition-colors mt-0.5 font-mono text-[11px] flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{c.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Kolom 4: Navigasi Internal (2 Kolom) */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-xs font-semibold text-[#A8A69E] uppercase tracking-[0.1em]">
              Spesifikasi Web
            </p>
            <ul className="text-xs text-[#A8A69E] space-y-2.5">
              <li>
                <Link href="/" className="hover:text-[#FAF9F5] transition-colors">
                  Profil Korporat
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-[#FAF9F5] transition-colors">
                  Katalog Paket Menu
                </Link>
              </li>
              <li>
                <Link href="/pesan" className="hover:text-[#FAF9F5] transition-colors flex items-center gap-1">
                  <span>Pesan Katering</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li className="pt-3 border-t border-[#FAF9F5]/[0.08]">
                <Link
                  href="/admin/login"
                  className="text-[#A8A69E] hover:text-[#FAF9F5] transition-colors text-[11px] flex items-center gap-1"
                >
                  <span>Portal Masuk Staf Admin</span>
                  <span>&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Baris Hak Cipta & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A8A69E] gap-4">
          <p>© 2026 PT. Zahdan Kamal Sentosa. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="text-[11px]">
            Dokumentasi Spesifikasi Industri & Mutu Makanan · Kawasan Industri Karawang
          </p>
        </div>
      </div>
    </footer>
  );
}
