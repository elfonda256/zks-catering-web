import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { hashAccessToken } from "@/lib/order-logic";
import { COMPANY_PROFILE } from "@/data/catering-data";
import { ArrowUpRight } from "@/components/icons";
import { CONTAINER, HEADING } from "@/components/site/ui";
import PaymentUploadClient from "./PaymentUploadClient";

type StatusTone = "pending" | "action" | "success" | "danger" | "neutral";

const TONE_CLASS: Record<StatusTone, string> = {
  pending: "bg-[#C85A17] text-white",
  action: "bg-sky-500/20 text-sky-200",
  success: "bg-emerald-500/20 text-emerald-200",
  danger: "bg-red-500/20 text-red-200",
  neutral: "bg-white/10 text-white",
};

/** Customer-facing label for every OrderStatus value in prisma/schema.prisma. */
const ORDER_STATUS_INFO: Record<string, { label: string; tone: StatusTone; desc: string }> = {
  WAITING_ADMIN_CONFIRMATION: {
    label: "Menunggu konfirmasi admin",
    tone: "pending",
    desc: "Tim dapur sedang memverifikasi kapasitas produksi dan menetapkan rute serta ongkos kirim.",
  },
  CONFIRMED_AWAITING_PAYMENT: {
    label: "Menunggu pembayaran",
    tone: "action",
    desc: "Ongkos kirim resmi sudah ditetapkan. Silakan bayar DP 20% atau lunas penuh.",
  },
  DP_PAID: {
    label: "DP terbayar",
    tone: "success",
    desc: "Uang muka terverifikasi. Pelunasan sisa tagihan paling lambat H-1 pukul 23.59 WIB.",
  },
  FULLY_PAID: {
    label: "Lunas",
    tone: "success",
    desc: "Pembayaran lunas terverifikasi. Dapur sentral siap memproduksi pesanan Anda.",
  },
  IN_PREPARATION: {
    label: "Sedang dimasak",
    tone: "success",
    desc: "Pesanan Anda sedang diproduksi di dapur sentral Ciampel.",
  },
  IN_DELIVERY: {
    label: "Dalam pengantaran",
    tone: "success",
    desc: "Armada insulated box ZKS sedang menuju lokasi pengantaran Anda.",
  },
  COMPLETED: {
    label: "Selesai",
    tone: "neutral",
    desc: "Pesanan sudah diserahkan di lokasi. Terima kasih telah memesan di ZKS.",
  },
  EXPIRED_UNCONFIRMED_BY_ADMIN: {
    label: "Kedaluwarsa",
    tone: "danger",
    desc: "Pesanan tidak dapat dikonfirmasi tepat waktu. Silakan hubungi kami atau ajukan pesanan baru.",
  },
  EXPIRED_PAYMENT_TIMEOUT: {
    label: "Batas bayar terlewat",
    tone: "danger",
    desc: "Pembayaran tidak diterima sebelum batas waktu. Silakan hubungi kami untuk menjadwalkan ulang.",
  },
  REJECTED_BY_ADMIN: {
    label: "Ditolak",
    tone: "danger",
    desc: "Kapasitas produksi pada jadwal tersebut sudah penuh atau lokasi di luar jangkauan armada.",
  },
  CANCELLED_BY_ADMIN_REFUND_REQ: {
    label: "Dibatalkan, refund diproses",
    tone: "danger",
    desc: "Pesanan dibatalkan karena kendala operasional kami. Dana Anda akan dikembalikan penuh.",
  },
  CANCELLED_BY_CUSTOMER: {
    label: "Dibatalkan",
    tone: "danger",
    desc: "Pesanan ini telah dibatalkan atas permintaan pemesan.",
  },
  CANCELLED_DP_FORFEITED: {
    label: "Dibatalkan, DP hangus",
    tone: "danger",
    desc: "Pesanan dibatalkan setelah batas waktu sehingga uang muka tidak dapat dikembalikan.",
  },
  CANCELLED_FULL_REFUND_PENDING: {
    label: "Dibatalkan, refund diproses",
    tone: "danger",
    desc: "Pesanan dibatalkan dan pengembalian dana penuh sedang diproses.",
  },
  REFUNDED: {
    label: "Dana dikembalikan",
    tone: "neutral",
    desc: "Pengembalian dana untuk pesanan ini telah selesai.",
  },
};

const LABEL = "block font-heading text-sm font-bold uppercase text-white/60";
const formatRupiah = (value: number) => `Rp${value.toLocaleString("id-ID")}`;

export const metadata: Metadata = {
  title: "Status Pesanan Katering",
  description: "Pantau rincian dan status pengajuan pesanan katering PT. Zahdan Kamal Sentosa.",
  referrer: "no-referrer",
  robots: { index: false, follow: false },
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

  const statusInfo = ORDER_STATUS_INFO[order.status] ?? { label: order.status, tone: "neutral", desc: "Status pesanan saat ini." };

  // Teks konfirmasi WhatsApp untuk pelanggan
  const waConfirmText = encodeURIComponent(
    `Halo PT. Zahdan Kamal Sentosa, saya telah mengajukan pesanan katering dengan Kode: ${order.orderCode} atas nama ${order.customerName} untuk tanggal ${formattedEventDate}. Mohon konfirmasi ketersediaan jadwalnya.`
  );

  const pendingPayment = order.payments.find((p) => p.status === "PENDING");

  return (
    <div className="space-y-14">
      <header className="space-y-5 border-b border-white/15 pb-10">
        <span className="font-heading text-sm font-bold uppercase text-[#E07A35]">Kode pesanan</span>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h1 className={`${HEADING} text-5xl sm:text-6xl`}>{order.orderCode}</h1>
          <span
            className={`inline-flex w-fit items-center rounded-full px-4 py-2 font-heading text-sm font-bold uppercase ${
              TONE_CLASS[statusInfo.tone]
            }`}
          >
            {statusInfo.label}
          </span>
        </div>
        <p className="max-w-2xl text-[17px] leading-[1.7] text-white/85">{statusInfo.desc}</p>

        {order.status === "WAITING_ADMIN_CONFIRMATION" && (
          <a
            href={`https://wa.me/${COMPANY_PROFILE.mainWhatsApp}?text=${waConfirmText}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#C85A17] px-6 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-[#A4460E]"
          >
            Konfirmasi cepat via WhatsApp
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        )}

        {order.status === "CONFIRMED_AWAITING_PAYMENT" &&
          (pendingPayment ? (
            <div className="mt-8 space-y-5 rounded-[10px] bg-[#232A2E] p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end">
                <div>
                  <span className="font-heading text-sm font-bold uppercase text-[#E07A35]">Bukti transfer terkirim</span>
                  <h2 className={`${HEADING} mt-1 text-[1.75rem]`}>Menunggu verifikasi admin</h2>
                </div>
                <span className="w-fit rounded-full bg-amber-500/20 px-3 py-1 font-heading text-xs font-bold uppercase text-amber-200">
                  Sedang diverifikasi
                </span>
              </div>

              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                {pendingPayment.paymentUrl && (
                  <a
                    href={pendingPayment.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block shrink-0 overflow-hidden rounded-[10px] bg-white/5 transition-opacity hover:opacity-90"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pendingPayment.paymentUrl} alt="Bukti transfer" className="h-28 w-28 object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/70 py-0.5 text-center text-[11px] text-white">
                      Lihat struk ↗
                    </span>
                  </a>
                )}

                <dl className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <dt className={LABEL}>Jenis pembayaran</dt>
                    <dd className="mt-1 text-white">
                      {pendingPayment.paymentType === "DP" ? "Uang muka (DP 20%)" : "Lunas penuh (100%)"}
                    </dd>
                  </div>
                  <div>
                    <dt className={LABEL}>Nominal</dt>
                    <dd className="mt-1 font-heading text-xl font-extrabold text-[#E07A35]">
                      {formatRupiah(pendingPayment.amount)}
                    </dd>
                  </div>
                  <div>
                    <dt className={LABEL}>Bank pengirim</dt>
                    <dd className="mt-1 text-white">{pendingPayment.paymentChannel || "Transfer bank"}</dd>
                  </div>
                </dl>
              </div>

              <p className="text-sm text-white/65">
                Diunggah{" "}
                {new Intl.DateTimeFormat("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Jakarta",
                }).format(pendingPayment.createdAt)}{" "}
                WIB. Begitu admin mencocokkan mutasi bank, status pesanan langsung berpindah ke tahap produksi.
              </p>
            </div>
          ) : (
            <PaymentUploadClient
              rawToken={token}
              orderCode={order.orderCode}
              subtotal={order.subtotal}
              totalAmount={order.totalAmount}
              dpAmount={order.dpAmount}
              initialPaymentDueAt={order.initialPaymentDueAt ? order.initialPaymentDueAt.toISOString() : null}
            />
          ))}

        {order.status === "DP_PAID" && (
          <p className="rounded-[10px] border-l-4 border-emerald-500 bg-emerald-500/10 p-5 text-[15px] leading-relaxed text-emerald-100">
            Jadwal produksi dan armada sudah dikunci. Sisa pelunasan{" "}
            <strong className="font-heading text-lg">
              {formatRupiah((order.totalAmount || 0) - (order.dpAmount || 0))}
            </strong>{" "}
            dibayar paling lambat H-1 pukul 23.59 WIB.
          </p>
        )}
      </header>

      <section className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="border-t-4 border-[#C85A17] pt-5">
          <h2 className="font-heading text-xl font-extrabold uppercase">Jadwal &amp; jumlah</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className={LABEL}>Hari &amp; tanggal</dt>
              <dd className="mt-1 text-[17px] text-white">{formattedEventDate}</dd>
            </div>
            <div>
              <dt className={LABEL}>Jam pengantaran</dt>
              <dd className="mt-1 text-[17px] text-white">{formattedEventTime} WIB</dd>
            </div>
            <div>
              <dt className={LABEL}>Total porsi</dt>
              <dd className="mt-1 text-[17px] text-white">{order.totalPcs} porsi</dd>
            </div>
          </dl>
        </div>

        <div className="border-t-4 border-[#C85A17] pt-5">
          <h2 className="font-heading text-xl font-extrabold uppercase">Pemesan &amp; tujuan</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className={LABEL}>Nama PIC / perusahaan</dt>
              <dd className="mt-1 text-[17px] text-white">{order.customerName}</dd>
            </div>
            <div>
              <dt className={LABEL}>WhatsApp PIC</dt>
              <dd className="mt-1 text-[17px] text-white">{order.customerPhone}</dd>
            </div>
            <div>
              <dt className={LABEL}>Alamat pengantaran</dt>
              <dd className="mt-1 text-[17px] leading-snug text-white">{order.customerAddress}</dd>
            </div>
            {order.customerEmail && (
              <div>
                <dt className={LABEL}>Email kantor</dt>
                <dd className="mt-1 text-[17px] text-white">{order.customerEmail}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className={`${HEADING} text-[2rem]`}>Rincian menu &amp; tagihan</h2>

        <ul className="divide-y divide-white/10 rounded-[10px] bg-[#232A2E] px-6">
          {order.items.map((item) => (
            <li key={item.id} className="flex flex-col justify-between gap-2 py-5 sm:flex-row sm:items-baseline">
              <div>
                <p className="font-heading text-lg font-extrabold uppercase">{item.menuItem.name}</p>
                <p className="text-sm text-white/65">
                  {item.quantity} porsi × {formatRupiah(item.unitPrice)}
                </p>
                {item.notes && <p className="mt-1 text-sm italic text-[#E07A35]">{item.notes}</p>}
              </div>
              <span className="font-heading text-lg font-bold sm:text-right">{formatRupiah(item.subtotal)}</span>
            </li>
          ))}
        </ul>

        <dl className="ml-auto max-w-md space-y-3 text-[15px]">
          <div className="flex justify-between">
            <dt className="text-white/70">Subtotal makanan</dt>
            <dd className="font-semibold">{formatRupiah(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/70">Ongkos kirim</dt>
            <dd className="text-white/85">
              {order.shippingFee !== null && order.shippingFee !== undefined
                ? formatRupiah(order.shippingFee)
                : "Menunggu penetapan admin"}
            </dd>
          </div>
          <div className="flex justify-between border-t border-white/15 pt-3">
            <dt className="font-heading text-lg font-extrabold uppercase">Total tagihan</dt>
            <dd className="font-heading text-2xl font-extrabold text-[#E07A35]">
              {order.totalAmount !== null && order.totalAmount !== undefined
                ? formatRupiah(order.totalAmount)
                : "Menunggu ongkir"}
            </dd>
          </div>
          {order.dpAmount && (
            <div className="flex justify-between text-sm">
              <dt className="text-white/70">Uang muka (DP 20%)</dt>
              <dd className="font-semibold">{formatRupiah(order.dpAmount)}</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="space-y-2 border-t border-white/15 pt-8 text-[15px] leading-relaxed text-white/70">
        <h2 className="font-heading text-base font-bold uppercase text-white">Simpan tautan ini</h2>
        <p>
          Halaman ini dilindungi token privat, jadi Anda tidak perlu membuat akun. Simpan atau bookmark tautan ini
          untuk memantau status dan ongkos kirim pesanan Anda.
        </p>
        <p>
          Perubahan jumlah porsi atau menu dapat diajukan ke{" "}
          <strong className="text-white">{COMPANY_PROFILE.contacts[0].phone}</strong> dengan menyebutkan kode pesanan{" "}
          <strong className="text-white">{order.orderCode}</strong>.
        </p>
      </section>
    </div>
  );
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#1A1F22] font-text text-white">
      <Navbar />

      <main id="main-content" className="flex-1 pb-24 pt-16 lg:pb-32 lg:pt-24">
        <div className={`${CONTAINER} max-w-5xl`}>
          <Suspense fallback={<p className="py-16 text-center text-white/60">Memuat rincian pesanan…</p>}>
            <OrderDetailContent params={params} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
