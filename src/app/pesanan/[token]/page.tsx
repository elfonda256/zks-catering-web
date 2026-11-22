import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { getHMinus1DeadlineWib, hashAccessToken } from "@/lib/order-logic";
import { COMPANY_PROFILE } from "@/data/catering-data";
import { ArrowUpRight } from "@/components/icons";
import { CONTAINER, HEADING } from "@/components/site/ui";
import { formatRupiahCompact as formatRupiah } from "@/shared/utils/formatters";
import PaymentUploadClient from "./PaymentUploadClient";
import { CopyButton } from "./CopyButton";
import { OrderProgress, hasProgress } from "./OrderProgress";
import { getAmountDue, getPaidAmount, getPaymentDueAt } from "./payment-due";
import { getBankAccounts } from "@/modules/settings/services/settings.repository";
import { expireOverdueOrdersOnAccess } from "@/modules/dashboard/services/order-expiry.repository";

type StatusTone = "pending" | "action" | "success" | "danger" | "neutral";


/** Customer-facing label for every OrderStatus value in prisma/schema.prisma. */
const ORDER_STATUS_INFO: Record<string, { label: string; tone: StatusTone; desc: string }> = {
  WAITING_ADMIN_CONFIRMATION: {
    label: "Pesanan diterima",
    tone: "pending",
    desc: "Tim kami sedang memeriksa kapasitas dapur dan menghitung ongkos kirim. Anda dikabari lewat WhatsApp.",
  },
  CONFIRMED_AWAITING_PAYMENT: {
    label: "Menunggu pembayaran",
    tone: "action",
    desc: "Ongkos kirim sudah ditetapkan. Pilih bayar DP 20% atau lunas, lalu kirim bukti transfer di bawah.",
  },
  DP_PAID: {
    label: "DP terbayar",
    tone: "success",
    desc: "Uang muka sudah kami terima dan jadwal dapur terkunci. Lunasi sisa tagihan paling lambat H-1 pukul 23.59 WIB.",
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
  // Payment deadlines are compared with the current time, so this page renders per request.
  await connection();

  if (!token || token.length !== 64) {
    notFound();
  }

  const tokenHash = hashAccessToken(token);
  // Expire on access so a missed deadline shows at once, not only after the daily sweep.
  await expireOverdueOrdersOnAccess({ accessTokenHash: tokenHash });

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

  const chipDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Jakarta",
  }).format(order.eventDate);

  const statusInfo = ORDER_STATUS_INFO[order.status] ?? { label: order.status, tone: "neutral", desc: "Status pesanan saat ini." };
  const pendingPayment = order.payments.find((p) => p.status === "PENDING");
  const amountDue = getAmountDue(order);
  const bankAccounts = amountDue ? await getBankAccounts() : [];
  const paidAmount = getPaidAmount(order);
  const remaining = order.totalAmount !== null ? Math.max(order.totalAmount - paidAmount, 0) : null;

  const dueAt = getPaymentDueAt(amountDue, {
    initial: order.initialPaymentDueAt,
    settlement: getHMinus1DeadlineWib(order.eventDate),
  });

  const waConfirmText = encodeURIComponent(
    `Halo PT. Zahdan Kamal Sentosa, saya sudah memesan katering dengan kode ${order.orderCode} atas nama ${order.customerName} untuk ${formattedEventDate}.`
  );

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
      <div className="space-y-10">
        <header className="space-y-5">
          <p className="flex flex-wrap items-center gap-3">
            <span className="font-heading text-sm font-bold uppercase text-white/60">Pesanan</span>
            <span className="font-mono text-base font-bold text-white">{order.orderCode}</span>
            <CopyButton value={order.orderCode} label="kode pesanan" />
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className={`${HEADING} text-4xl sm:text-5xl`}>{statusInfo.label}</h1>
            <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-4 py-2 font-heading text-xs font-bold uppercase text-white">
              {chipDate}, {formattedEventTime} WIB
            </span>
          </div>
          <p
            className={`max-w-2xl text-[17px] leading-[1.7] ${
              statusInfo.tone === "danger"
                ? "rounded-[10px] border-l-4 border-red-500 bg-red-500/10 p-4 text-red-100"
                : "text-white/85"
            }`}
          >
            {statusInfo.desc}
          </p>
          {hasProgress(order.status) && <OrderProgress status={order.status} />}
        </header>

        {pendingPayment ? (
          <section aria-labelledby="verify-title" className="space-y-5 rounded-[10px] bg-ink-soft p-6 sm:p-8">
            <div className="space-y-1">
              <span className="font-heading text-sm font-bold uppercase text-brand-300">Bukti bayar terkirim</span>
              <h2 id="verify-title" className={`${HEADING} text-[1.75rem]`}>
                Sedang diverifikasi
              </h2>
            </div>
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              {pendingPayment.paymentUrl && (
                /* eslint-disable-next-line @next/next/no-img-element -- proof is a data URL or local upload */
                <img
                  src={pendingPayment.paymentUrl}
                  alt="Bukti transfer yang Anda kirim"
                  className="h-24 w-24 shrink-0 rounded-[10px] bg-white/5 object-cover"
                />
              )}
              <dl className="grid flex-1 grid-cols-2 gap-4">
                <div>
                  <dt className={LABEL}>Nominal</dt>
                  <dd className="mt-1 font-heading text-xl font-extrabold tabular-nums text-brand-300">
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
              Admin mencocokkan mutasi rekening, biasanya pada jam kerja. Status di halaman ini berubah setelah
              pembayaran diterima, dan Anda juga dikabari lewat WhatsApp.
            </p>
          </section>
        ) : amountDue ? (
          <PaymentUploadClient rawToken={token} orderCode={order.orderCode} due={amountDue} dueAt={dueAt} accounts={bankAccounts} />
        ) : order.status === "WAITING_ADMIN_CONFIRMATION" ? (
          <section className="flex flex-col gap-5 rounded-[10px] bg-ink-soft p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <p className="max-w-md text-[15px] leading-relaxed text-white/80">
              Belum perlu membayar. Total tagihan dan pilihan pembayaran muncul di halaman ini setelah ongkir ditetapkan.
            </p>
            <a
              href={`https://wa.me/${COMPANY_PROFILE.mainWhatsApp}?text=${waConfirmText}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 border-white/80 px-5 font-heading text-sm font-bold uppercase text-white transition-colors hover:bg-white hover:text-ink"
            >
              Tanya via WhatsApp
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </section>
        ) : null}

        <section aria-labelledby="delivery-title" className="space-y-4">
          <h2 id="delivery-title" className="font-heading text-xl font-extrabold uppercase">
            Pengantaran
          </h2>
          <dl className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
            <div>
              <dt className={LABEL}>Jadwal tiba</dt>
              <dd className="mt-1 text-[17px] text-white">
                {formattedEventDate}, {formattedEventTime} WIB
              </dd>
            </div>
            <div>
              <dt className={LABEL}>Pemesan</dt>
              <dd className="mt-1 text-[17px] text-white">
                {order.customerName}
                <span className="block text-[15px] text-white/70">{order.customerPhone}</span>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className={LABEL}>Alamat</dt>
              <dd className="mt-1 text-[17px] leading-snug text-white">{order.customerAddress}</dd>
            </div>
          </dl>
        </section>
      </div>

      <aside aria-labelledby="bill-title" className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div className="space-y-5 rounded-[10px] bg-ink-soft p-6 sm:p-8">
          <h2 id="bill-title" className="font-heading text-xl font-extrabold uppercase">
            Rincian tagihan
          </h2>
          <ul className="space-y-4">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4">
                <div>
                  <p className="font-heading text-base font-bold uppercase leading-tight">{item.menuItem.name}</p>
                  <p className="text-sm text-white/65">
                    {item.quantity} porsi × {formatRupiah(item.unitPrice)}
                  </p>
                  {item.notes && <p className="mt-1 text-sm text-brand-300">{item.notes}</p>}
                </div>
                <span className="font-semibold tabular-nums">{formatRupiah(item.subtotal)}</span>
              </li>
            ))}
          </ul>

          <dl className="space-y-3 border-t border-white/10 pt-5 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-white/70">Subtotal makanan</dt>
              <dd className="tabular-nums">{formatRupiah(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/70">Ongkos kirim</dt>
              <dd className="tabular-nums">
                {order.shippingFee !== null ? formatRupiah(order.shippingFee) : "Dihitung admin"}
              </dd>
            </div>
            <div className="flex items-end justify-between gap-4 border-t border-white/10 pt-4">
              <dt className="font-heading text-base font-extrabold uppercase">Total</dt>
              <dd className="font-heading text-2xl font-extrabold tabular-nums">
                {order.totalAmount !== null ? formatRupiah(order.totalAmount) : "Menunggu ongkir"}
              </dd>
            </div>
            {paidAmount > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/70">Sudah dibayar</dt>
                <dd className="tabular-nums text-emerald-300">{formatRupiah(paidAmount)}</dd>
              </div>
            )}
            {paidAmount > 0 && remaining !== null && remaining > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="font-semibold text-white">Sisa tagihan</dt>
                <dd className="font-semibold tabular-nums text-brand-300">{formatRupiah(remaining)}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="space-y-2 px-1 text-sm leading-relaxed text-white/65">
          <p>
            <strong className="text-white">Simpan tautan ini.</strong> Halaman ini privat dan tidak perlu akun.
          </p>
          <p>
            Ingin mengubah porsi atau menu? Hubungi {COMPANY_PROFILE.contacts[0].phone} dan sebutkan kode{" "}
            <span className="font-mono text-white">{order.orderCode}</span>.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-ink font-text text-white">
      <Navbar />

      <main id="main-content" className="flex-1 pb-24 pt-16 lg:pb-32 lg:pt-24">
        <div className={`${CONTAINER} max-w-7xl`}>
          <Suspense fallback={<p className="py-16 text-center text-white/60">Memuat rincian pesanan…</p>}>
            <OrderDetailContent params={params} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
