import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EnterpriseShell, ErpPageTemplate } from "@/shared/components/layout";
import { LoadingState } from "@/shared/components/ui/LoadingState";
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
    <EnterpriseShell
      user={{ name: admin.name, role: admin.role }}
      onLogout={handleLogout}
    >
      <ErpPageTemplate
        category="OPERATIONS & DISPATCH CONSOLE"
        title="Panel Kendali & Logistik Pesanan"
        description="Pusat verifikasi kapasitas dapur, penetapan rute armada Karawang, serta inspeksi pembayaran resmi katering industri."
        actions={
          <Link
            href="/admin/dashboard"
            className="text-[12px] font-medium text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-[8px] transition-colors shadow-2xs inline-flex items-center gap-1.5"
          >
            <span>↻ Segarkan Antrean</span>
          </Link>
        }
        secondaryActions={
          <Link
            href="/pesan"
            target="_blank"
            className="text-[12px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-[8px] transition-colors inline-flex items-center gap-1"
          >
            <span>Form Pemesanan</span>
            <span className="text-slate-400">↗</span>
          </Link>
        }
      >
        {/* Komponen Klien Operasional Pesanan */}
        <AdminDashboardClient orders={serializedOrders} />
      </ErpPageTemplate>
    </EnterpriseShell>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <LoadingState label="Memuat konsol kendali operasional ZKS..." rows={6} />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
