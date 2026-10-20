import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { hashAccessToken } from "@/lib/order-logic";
import { COMPANY_PROFILE } from "@/data/catering-data";
import { ArrowUpRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Detail & Status Pesanan Katering | PT. Zahdan Kamal Sentosa",
  description: "Pantau rincian dan status pengajuan pesanan katering PT. Zahdan Kamal Sentosa.",
  referrer: "no-referrer",
};

interface OrderDetailPageProps {
  params: Promise<{ token: string }>;
}

async function OrderDetailContent({ params }: OrderDetailPageProps) {
  const { token } = await params;

  if (!token || token.length !== 64) {
    notFound();
  }

  const tokenHash = hashAccessToken(token);

  const order = await prisma.order.findUnique({
    where: {
      accessTokenHash: tokenHash,
    },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Format tanggal acara ke zona WIB
  const formattedEventDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(order.eventDate);

  const formattedEventTime = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(order.eventDate);

  // Status Badge Label & Color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WAITING_ADMIN_CONFIRMATION":
        return {
          label: "Menunggu Konfirmasi Admin",
          bg: "bg-[#D96B27]/10 text-[#C85A17] border-[#D96B27]/30",
          desc: "Admin dapur sedang memverifikasi ketersediaan slot kapasitas produksi dan rute pengantaran.",
        };
      case "CONFIRMED_AWAITING_PAYMENT":
        return {
          label: "Total Tagihan Dikunci (Menunggu Pembayaran)",
          bg: "bg-blue-50 text-blue-900 border-blue-200",
          desc: "Admin telah menetapkan ongkos kirim. Silakan lakukan pembayaran DP 20% atau Pelunasan.",
        };
      case "DP_PAID":
        return {
          label: "Uang Muka (DP) Terbayar",
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          desc: "DP telah terverifikasi. Pelunasan sisa tagihan paling lambat H-1 pukul 23:59 WIB.",
        };
      case "PAID_IN_FULL":
        return {
          label: "Lunas Penuh",
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          desc: "Pembayaran lunas terverifikasi. Dapur siap memproduksi pesanan Anda.",
        };
      case "IN_DELIVERY":
        return {
          label: "Dalam Pengantaran",
          bg: "bg-purple-50 text-purple-800 border-purple-200",
          desc: "Armada katering ZKS sedang menuju ke lokasi pengantaran Anda di Karawang.",
        };
      case "COMPLETED":
        return {
          label: "Pesanan Selesai",
          bg: "bg-[#F3F1E9] text-[#141413] border-[#141413]/10",
          desc: "Layanan katering telah selesai dilaksanakan dengan sukses.",
        };
      case "REJECTED_BY_ADMIN":
        return {
          label: "Ditolak oleh Admin",
          bg: "bg-red-50 text-red-800 border-red-200",
          desc: "Kapasitas dapur pada jadwal tersebut telah penuh atau di luar jangkauan layanan.",
        };
      default:
        return {
          label: status,
          bg: "bg-[#F3F1E9] text-[#626058] border-[#141413]/10",
          desc: "Status pesanan saat ini.",
        };
    }
  };

  const statusInfo = getStatusBadge(order.status);

  // Teks konfirmasi WhatsApp untuk pelanggan
  const waConfirmText = encodeURIComponent(
    `Halo PT. Zahdan Kamal Sentosa, saya telah mengajukan pesanan katering dengan Kode: ${order.orderCode} atas nama ${order.customerName} untuk tanggal ${formattedEventDate}. Mohon konfirmasi ketersediaan jadwalnya.`
  );

  return (
    <div className="space-y-10">
      {/* Header Status & Kode Pesanan */}
      <div className="p-8 rounded-2xl bg-[#F3F1E9] border border-[#141413]/[0.08] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#141413]/[0.08] pb-5">
          <div>
            <span className="text-[11px] font-mono text-[#8E8B81] uppercase tracking-wider block">
              Kode Akses Pesanan Anda:
            </span>
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-[#141413] tracking-tight">
              {order.orderCode}
            </span>
          </div>

          <div className="self-start sm:self-auto">
            <span
              className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full border ${statusInfo.bg}`}
            >
              {statusInfo.label}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#626058] leading-relaxed">
          {statusInfo.desc}
        </p>

        {/* Quick WhatsApp Confirmation Button */}
        {order.status === "WAITING_ADMIN_CONFIRMATION" && (
          <div className="pt-2">
            <a
              href={`https://wa.me/${COMPANY_PROFILE.mainWhatsApp}?text=${waConfirmText}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#141413] text-[#FAF9F5] font-semibold text-xs hover:bg-[#2C2C28] transition-all tracking-tight"
            >
              <span>Hubungi Admin via WhatsApp untuk Konfirmasi Cepat</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        )}
      </div>

      {/* Rincian Acara & Pengiriman */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-[#F3F1E9] border border-[#141413]/[0.06] space-y-3">
          <span className="text-xs font-semibold text-[#8E8B81] uppercase tracking-[0.1em] block">
            Jadwal Acara & Waktu
          </span>
          <div className="space-y-1.5 text-xs text-[#626058]">
            <p>
              <strong className="text-[#141413]">Hari & Tanggal:</strong> {formattedEventDate}
            </p>
            <p>
              <strong className="text-[#141413]">Jam Pengantaran:</strong> {formattedEventTime} WIB
            </p>
            <p>
              <strong className="text-[#141413]">Total Kuantitas:</strong> {order.totalPcs} porsi
            </p>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[#F3F1E9] border border-[#141413]/[0.06] space-y-3">
          <span className="text-xs font-semibold text-[#8E8B81] uppercase tracking-[0.1em] block">
            Data Pemesan & Tujuan
          </span>
          <div className="space-y-1.5 text-xs text-[#626058]">
            <p>
              <strong className="text-[#141413]">Nama:</strong> {order.customerName}
            </p>
            <p>
              <strong className="text-[#141413]">Nomor WhatsApp:</strong> {order.customerPhone}
            </p>
            <p className="leading-snug">
              <strong className="text-[#141413]">Alamat Kirim:</strong> {order.customerAddress}
            </p>
            {order.customerEmail && (
              <p>
                <strong className="text-[#141413]">Email:</strong> {order.customerEmail}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabel Rincian Menu & Tagihan */}
      <div className="p-8 rounded-2xl bg-[#F3F1E9] border border-[#141413]/[0.08] space-y-6">
        <h2 className="font-display font-bold text-lg text-[#141413]">
          Rincian Spesifikasi Sajian & Tagihan
        </h2>

        <div className="divide-y divide-[#141413]/[0.08] border-y border-[#141413]/[0.08]">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <p className="font-display font-bold text-[#141413] text-sm">{item.menuItem.name}</p>
                <p className="text-xs text-[#8E8B81]">
                  {item.quantity} porsi &times; Rp{item.unitPrice.toLocaleString("id-ID")}
                </p>
                {item.notes && (
                  <p className="text-xs text-[#C85A17] italic mt-0.5">{item.notes}</p>
                )}
              </div>
              <div className="font-display font-bold text-[#141413] text-sm sm:text-right">
                Rp{item.subtotal.toLocaleString("id-ID")}
              </div>
            </div>
          ))}
        </div>

        {/* Rekapitulasi Biaya */}
        <div className="space-y-2.5 pt-2 text-xs text-[#626058]">
          <div className="flex justify-between">
            <span>Subtotal Makanan:</span>
            <span className="font-semibold text-[#141413]">
              Rp{order.subtotal.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Ongkos Kirim Armada:</span>
            <span className="text-[#8E8B81]">
              {order.shippingFee !== null && order.shippingFee !== undefined
                ? `Rp${order.shippingFee.toLocaleString("id-ID")}`
                : "Menunggu penetapan admin"}
            </span>
          </div>

          <div className="flex justify-between text-sm font-display font-extrabold text-[#141413] pt-3 border-t border-[#141413]/[0.08]">
            <span>Total Tagihan Akhir:</span>
            <span className="text-[#C85A17]">
              {order.totalAmount !== null && order.totalAmount !== undefined
                ? `Rp${order.totalAmount.toLocaleString("id-ID")}`
                : "Menunggu konfirmasi ongkir"}
            </span>
          </div>

          {order.dpAmount && (
            <div className="flex justify-between text-[11px] text-[#8E8B81] pt-1">
              <span>Nominal Uang Muka (DP 20%):</span>
              <span className="font-semibold text-[#141413]">
                Rp{order.dpAmount.toLocaleString("id-ID")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Petunjuk Privasi & Akses Token */}
      <div className="p-6 rounded-xl bg-[#FAF9F5] border border-[#141413]/[0.08] text-xs text-[#626058] space-y-2">
        <p className="font-display font-bold text-[#141413] text-xs">
          Informasi Keamanan & Akses Tautan Privat
        </p>
        <p className="leading-relaxed">
          Halaman ini dilindungi oleh token kriptografis 64 karakter privat tanpa memerlukan pembuatan kata sandi akun. Anda dapat menyimpan atau menyalin tautan ini (*bookmark*) untuk memantau pembaruan status dan ongkir pesanan Anda secara berkala.
        </p>
        <p className="leading-relaxed">
          Jika terdapat penyesuaian jumlah porsi atau menu, hubungi layanan pelanggan resmi kami di nomor <strong>{COMPANY_PROFILE.contacts[0].phone}</strong> dengan menyebutkan kode pesanan <strong>{order.orderCode}</strong>.
        </p>
      </div>
    </div>
  );
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5] text-[#141413] selection:bg-[#D96B27]/20 selection:text-[#141413]">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <Suspense
            fallback={
              <div className="p-16 text-center text-[#8E8B81] text-xs font-mono animate-pulse">
                Memuat rincian dan status pesanan Anda...
              </div>
            }
          >
            <OrderDetailContent params={params} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
