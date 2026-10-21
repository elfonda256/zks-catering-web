import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import AdminDashboardClient, {
  type AdminOrderData,
} from "./AdminDashboardClient";

export const metadata: Metadata = {
  title: "Konsol Operasional Dapur & Logistik | PT. Zahdan Kamal Sentosa",
  description: "Pusat verifikasi pesanan, penetapan ongkos kirim, dan inspeksi pembayaran katering.",
  robots: {
    index: false,
    follow: false,
  },
};

async function DashboardContent() {
  // Sinyal dynamic rendering untuk Next.js 16 cacheComponents
  await connection();

  // Pengecekan sesi langsung di komponen server (defense in depth)
  const admin = await requireAdmin();

  async function handleLogout() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  // Ambil seluruh pesanan beserta item menu dan pembayaran terkait
  const rawOrders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
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

  // Serialisasi data pesanan untuk komponen klien (konversi Date ke ISO string)
  const serializedOrders: AdminOrderData[] = rawOrders.map((o) => ({
    id: o.id,
    orderCode: o.orderCode,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    customerAddress: o.customerAddress,
    customerEmail: o.customerEmail,
    eventDate: o.eventDate.toISOString(),
    totalPcs: o.totalPcs,
    subtotal: o.subtotal,
    shippingFee: o.shippingFee,
    totalAmount: o.totalAmount,
    dpAmount: o.dpAmount,
    status: o.status,
    notes: o.notes,
    cancellationReason: o.cancellationReason,
    createdAt: o.createdAt.toISOString(),
    confirmedAt: o.confirmedAt ? o.confirmedAt.toISOString() : null,
    initialPaymentDueAt: o.initialPaymentDueAt
      ? o.initialPaymentDueAt.toISOString()
      : null,
    items: o.items.map((item) => ({
      id: item.id,
      menuItemName: item.menuItem.name,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      subtotal: item.subtotal,
      notes: item.notes,
    })),
    payments: o.payments.map((p) => ({
      id: p.id,
      paymentRef: p.paymentRef,
      paymentType: p.paymentType,
      amount: p.amount,
      status: p.status,
      paymentChannel: p.paymentChannel,
      paymentUrl: p.paymentUrl,
      createdAt: p.createdAt.toISOString(),
      settledAt: p.settledAt ? p.settledAt.toISOString() : null,
      maskedResponse: p.maskedResponse,
    })),
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* 1. Header Bar: Editorial Light Theme matching Main Homepage */}
      <header className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 border-b border-[#141413]/10 pb-8">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#C85A17] font-semibold block">
              PT. ZAHDAN KAMAL SENTOSA
            </span>
            <span className="text-[#8E8B81] text-xs">/</span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#141413] font-semibold block">
              OPERATIONS &amp; DISPATCH CONSOLE
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#141413] tracking-[-0.03em] leading-tight">
            Panel Kendali &amp; Logistik Pesanan.
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#626058] max-w-2xl leading-relaxed">
            Pusat verifikasi kapasitas dapur, penetapan rute armada Karawang, serta inspeksi pembayaran resmi katering industri.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-xs text-[#626058] hidden lg:inline">
            Operator: <strong className="text-[#141413]">{admin.name}</strong>
          </span>

          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#141413] border border-[#141413]/15 transition-all shadow-xs"
          >
            Website Utama ↗
          </Link>

          <form action={handleLogout}>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-transparent hover:bg-[#141413]/5 text-[#626058] hover:text-[#141413] border border-[#141413]/15 transition-all cursor-pointer"
            >
              Keluar
            </button>
          </form>
        </div>
      </header>

      {/* 2. Komponen Klien Operasional Pesanan */}
      <AdminDashboardClient orders={serializedOrders} />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F5] text-[#141413] p-6 sm:p-10 selection:bg-[#D96B27]/20 selection:text-[#141413]">
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto py-24 text-center text-xs font-mono uppercase tracking-widest text-[#8E8B81]">
            Memuat konsol kendali operasional ZKS...
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </main>
  );
}
