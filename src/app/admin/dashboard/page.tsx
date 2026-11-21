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
  title: "Pesanan | Admin ZKS Catering",
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
        hideBreadcrumb
        title="Pesanan"
        description="Tentukan ongkir, verifikasi bukti bayar, dan perbarui status pesanan."
        actions={
          <Link
            href="/pesan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Form pemesanan <span aria-hidden="true">↗</span>
          </Link>
        }
      >
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
          <LoadingState label="Memuat pesanan..." rows={6} />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
