import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { hashAccessToken } from "@/lib/order-logic";
import { COMPANY_PROFILE } from "@/data/catering-data";
import { ArrowUpRight } from "@/components/icons";
import PaymentUploadClient from "./PaymentUploadClient";

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
      payments: {
        orderBy: {
          createdAt: "desc",
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
          color: "text-[#C85A17]",
          desc: "Admin operasional dapur sedang memverifikasi ketersediaan slot boiler uap dan menetapkan logistik rute.",
        };
      case "CONFIRMED_AWAITING_PAYMENT":
        return {
          label: "Total Tagihan Dikunci",
          color: "text-blue-900",
          desc: "Admin telah menetapkan ongkos kirim resmi. Silakan lakukan pembayaran DP 20% atau Pelunasan.",
        };
      case "DP_PAID":
        return {
          label: "Uang Muka (DP) Terbayar",
          color: "text-emerald-800",
          desc: "Uang muka terverifikasi. Pelunasan sisa tagihan paling lambat H-1 pukul 23:59 WIB.",
        };
      case "PAID_IN_FULL":
        return {
          label: "Lunas Penuh",
          color: "text-emerald-800",
          desc: "Pembayaran lunas terverifikasi. Dapur sentral siap memproduksi pesanan Anda.",
        };
      case "IN_DELIVERY":
        return {
          label: "Dalam Pengantaran Armada",
          color: "text-purple-800",
          desc: "Armada insulated box ZKS sedang menuju ke lokasi pengantaran pabrik Anda.",
        };
      case "COMPLETED":
        return {
          label: "Layanan Selesai",
          color: "text-[#141413]",
          desc: "Layanan katering industri telah selesai diserahkan di kantin pabrik.",
        };
      case "REJECTED_BY_ADMIN":
        return {
          label: "Ditolak oleh Admin",
          color: "text-red-800",
          desc: "Kapasitas produksi pada jadwal tersebut telah penuh atau di luar jangkauan armada.",
        };
      default:
        return {
          label: status,
          color: "text-[#626058]",
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
    <div className="space-y-12">
      {/* Header Status & Kode Pesanan (Architectural Ledger, No Floating Boxes) */}
      <div className="space-y-4 pb-8 border-b border-[#141413]/10">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div className="space-y-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#8E8B81] block">
              DOKUMEN PESANAN RESMI
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#141413] tracking-tight">
              {order.orderCode}
            </h1>
          </div>

          <div className="font-mono text-xs font-bold tracking-wider uppercase">
            <span className={statusInfo.color}>{statusInfo.label}</span>
          </div>
        </div>

        <p className="font-sans text-xs sm:text-sm text-[#626058] leading-relaxed max-w-2xl">
          {statusInfo.desc}
        </p>

        {order.status === "WAITING_ADMIN_CONFIRMATION" && (
          <div className="pt-2">
            <a
              href={`https://wa.me/${COMPANY_PROFILE.mainWhatsApp}?text=${waConfirmText}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#141413] text-[#FAF9F5] text-xs font-semibold hover:bg-[#141413]/90 transition-all tracking-tight active:scale-[0.98]"
            >
              <span>Konfirmasi Cepat via WhatsApp Manajemen</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        )}

        {/* 1. Alur Pembayaran Langsung via Website: CONFIRMED_AWAITING_PAYMENT */}
        {order.status === "CONFIRMED_AWAITING_PAYMENT" && (() => {
          const pendingPayment = order.payments.find((p) => p.status === "PENDING");

          if (pendingPayment) {
            return (
              <div className="p-6 bg-white border-2 border-[#141413] space-y-4 mt-6">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#141413]/10 pb-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#C85A17] font-semibold block">
                      BUKTI TRANSFER TERUNGGAH
                    </span>
                    <h3 className="text-base font-bold text-[#141413] tracking-tight mt-0.5">
                      Menunggu Verifikasi &amp; Pencocokan Mutasi Rekening oleh Admin ZKS
                    </h3>
                  </div>
                  <span className="font-mono text-[11px] bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded font-semibold uppercase">
                    Sedang Diverifikasi
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 text-xs text-[#626058] pt-1">
                  {pendingPayment.paymentUrl && (
                    <a
                      href={pendingPayment.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block border border-[#141413]/20 rounded overflow-hidden hover:opacity-90 transition-opacity bg-neutral-100 shrink-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pendingPayment.paymentUrl}
                        alt="Bukti Transfer"
                        className="w-28 h-28 object-cover"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] text-center font-mono py-0.5">
                        Lihat Struk ↗
                      </span>
                    </a>
                  )}

                  <div className="space-y-1.5 flex-1">
                    <p>
                      <strong className="text-[#141413]">Jenis Pembayaran:</strong>{" "}
                      <span className="font-mono font-semibold text-[#141413]">
                        {pendingPayment.paymentType === "DP" ? "Uang Muka (DP 20%)" : "Lunas Penuh (100%)"}
                      </span>
                    </p>
                    <p>
                      <strong className="text-[#141413]">Nominal Ditransfer:</strong>{" "}
                      <span className="font-mono font-bold text-[#C85A17]">
                        Rp{pendingPayment.amount.toLocaleString("id-ID")}
                      </span>
                    </p>
                    <p>
                      <strong className="text-[#141413]">Bank Pengirim:</strong>{" "}
                      <span className="font-mono">{pendingPayment.paymentChannel || "Transfer Bank"}</span>
                    </p>
                    <p className="text-[11px] text-[#8E8B81]">
                      Diunggah pada:{" "}
                      {new Intl.DateTimeFormat("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Jakarta",
                      }).format(pendingPayment.createdAt)}{" "}
                      WIB
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-[#626058] bg-[#FAF9F5] p-3 rounded border border-[#141413]/10 leading-relaxed">
                  Berkas bukti transfer Anda telah tersimpan di sistem ZKS. Operator operasional dapur sedang mencocokkan mutasi bank. Begitu disetujui, status pesanan akan langsung terkunci ke tahap produksi.
                </p>
              </div>
            );
          }

          return (
            <PaymentUploadClient
              rawToken={token}
              orderCode={order.orderCode}
              subtotal={order.subtotal}
              totalAmount={order.totalAmount}
              dpAmount={order.dpAmount}
              initialPaymentDueAt={
                order.initialPaymentDueAt
                  ? order.initialPaymentDueAt.toISOString()
                  : null
              }
            />
          );
        })()}

        {/* 2. Banner Status: DP_PAID */}
        {order.status === "DP_PAID" && (
          <div className="p-5 bg-emerald-50/80 border border-emerald-300 text-xs space-y-2 mt-4">
            <span className="font-mono font-bold text-emerald-900 uppercase block tracking-wider">
              ✓ Uang Muka (DP 20%) Terverifikasi Admin
            </span>
            <p className="text-emerald-950 leading-relaxed">
              Jadwal produksi dapur dan rute armada ZKS telah dikunci untuk pesanan Anda. Sisa pelunasan tagihan sebesar{" "}
              <strong className="font-mono font-bold">
                Rp{((order.totalAmount || 0) - (order.dpAmount || 0)).toLocaleString("id-ID")}
              </strong>{" "}
              dapat dibayarkan paling lambat H-1 pukul 23:59 WIB.
            </p>
          </div>
        )}

        {/* 3. Banner Status: FULLY_PAID */}
        {order.status === "FULLY_PAID" && (
          <div className="p-5 bg-emerald-50/80 border border-emerald-400 text-xs space-y-2 mt-4">
            <span className="font-mono font-bold text-emerald-950 uppercase block tracking-wider">
              ✓ Pembayaran Lunas 100% Terverifikasi
            </span>
            <p className="text-emerald-950 leading-relaxed">
              Seluruh kewajiban pembayaran telah selesai. Dapur industri ZKS siap memproses pesanan dan armada insulated box akan mengantarkannya tepat waktu sesuai jadwal acara.
            </p>
          </div>
        )}
      </div>

      {/* Rincian Acara & Data Pemesan (Two-Column Linear Ledger) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-3 border-l border-[#141413]/10 pl-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
            Jadwal Acara &amp; Kuantitas
          </span>
          <div className="space-y-2 text-xs text-[#626058]">
            <div>
              <span className="text-[#8E8B81] block font-mono text-[10px]">HARI &amp; TANGGAL</span>
              <strong className="text-[#141413] font-sans text-sm">{formattedEventDate}</strong>
            </div>
            <div>
              <span className="text-[#8E8B81] block font-mono text-[10px]">JAM PENGANTARAN</span>
              <span className="text-[#141413] font-mono font-semibold">{formattedEventTime} WIB</span>
            </div>
            <div>
              <span className="text-[#8E8B81] block font-mono text-[10px]">TOTAL VOLUME</span>
              <span className="text-[#141413] font-mono font-semibold">{order.totalPcs} Porsi</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 border-l border-[#141413]/10 pl-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
            Entitas Pemesan &amp; Tujuan
          </span>
          <div className="space-y-2 text-xs text-[#626058]">
            <div>
              <span className="text-[#8E8B81] block font-mono text-[10px]">NAMA PIC / PERUSAHAAN</span>
              <strong className="text-[#141413] font-sans text-sm">{order.customerName}</strong>
            </div>
            <div>
              <span className="text-[#8E8B81] block font-mono text-[10px]">WHATSAPP PIC</span>
              <span className="text-[#141413] font-mono">{order.customerPhone}</span>
            </div>
            <div>
              <span className="text-[#8E8B81] block font-mono text-[10px]">ALAMAT PABRIK</span>
              <span className="text-[#141413] leading-snug">{order.customerAddress}</span>
            </div>
            {order.customerEmail && (
              <div>
                <span className="text-[#8E8B81] block font-mono text-[10px]">EMAIL KANTOR</span>
                <span className="text-[#141413] font-mono">{order.customerEmail}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabel Rincian Menu & Rekapitulasi Tagihan (Clean Specification Ledger) */}
      <div className="pt-8 border-t border-[#141413]/10 space-y-6">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8E8B81] font-semibold block">
            Rincian Spesifikasi Menu &amp; Tagihan
          </span>
          <span className="font-mono text-[11px] text-[#8E8B81]">
            Mata Uang: IDR (Rupiah)
          </span>
        </div>

        <div className="divide-y divide-[#141413]/10 border-y border-[#141413]/10">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-4 flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-2">
              <div>
                <p className="font-display font-bold text-[#141413] text-sm">{item.menuItem.name}</p>
                <p className="font-mono text-xs text-[#8E8B81]">
                  {item.quantity} porsi &times; Rp{item.unitPrice.toLocaleString("id-ID")}
                </p>
                {item.notes && (
                  <p className="text-xs text-[#C85A17] italic mt-0.5">{item.notes}</p>
                )}
              </div>
              <div className="font-mono font-bold text-[#141413] text-sm sm:text-right">
                Rp{item.subtotal.toLocaleString("id-ID")}
              </div>
            </div>
          ))}
        </div>

        {/* Rekapitulasi Biaya */}
        <div className="space-y-2.5 pt-2 text-xs text-[#626058] max-w-md ml-auto">
          <div className="flex justify-between font-mono">
            <span>Subtotal Makanan:</span>
            <span className="font-semibold text-[#141413]">
              Rp{order.subtotal.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between font-mono">
            <span>Ongkos Kirim Armada:</span>
            <span className="text-[#8E8B81]">
              {order.shippingFee !== null && order.shippingFee !== undefined
                ? `Rp${order.shippingFee.toLocaleString("id-ID")}`
                : "Menunggu penetapan admin"}
            </span>
          </div>

          <div className="flex justify-between text-sm font-mono font-extrabold text-[#141413] pt-3 border-t border-[#141413]/10">
            <span>Total Tagihan Akhir:</span>
            <span className="text-[#C85A17]">
              {order.totalAmount !== null && order.totalAmount !== undefined
                ? `Rp${order.totalAmount.toLocaleString("id-ID")}`
                : "Menunggu konfirmasi ongkir"}
            </span>
          </div>

          {order.dpAmount && (
            <div className="flex justify-between text-[11px] font-mono text-[#8E8B81] pt-1">
              <span>Nominal Uang Muka (DP 20%):</span>
              <span className="font-semibold text-[#141413]">
                Rp{order.dpAmount.toLocaleString("id-ID")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Petunjuk Privasi & Akses Token (Clean Typographic Note) */}
      <div className="pt-8 border-t border-[#141413]/10 text-xs text-[#8E8B81] space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-wider text-[#141413] font-semibold">
          Informasi Keamanan &amp; Akses Token Privat
        </p>
        <p className="leading-relaxed">
          Halaman ini dilindungi token kriptografis 64-karakter privat tanpa mengharuskan pembuatan kata sandi akun publik. Anda dapat menyimpan atau menyalin tautan ini (*bookmark*) untuk memantau pembaruan status dan ongkir pesanan Anda secara berkala.
        </p>
        <p className="leading-relaxed">
          Penyesuaian jumlah porsi atau menu dapat diajukan kepada layanan pelanggan kami di nomor <strong>{COMPANY_PROFILE.contacts[0].phone}</strong> dengan menyebutkan kode pesanan <strong>{order.orderCode}</strong>.
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
              <div className="p-16 text-center text-[#8E8B81] text-xs font-mono">
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
