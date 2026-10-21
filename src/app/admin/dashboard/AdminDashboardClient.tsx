"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  lockOrderTotalAction,
  rejectOrderAction,
  updateOrderStatusAction,
  regenerateOrderTokenAction,
  approvePaymentAction,
  rejectPaymentAction,
} from "./actions";
import type { OrderStatus } from "@/generated/prisma/enums";

export interface AdminOrderItem {
  id: number;
  menuItemName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  notes: string | null;
}

export interface AdminOrderPayment {
  id: number;
  paymentRef: string;
  paymentType: string;
  amount: number;
  status: string;
  paymentChannel: string | null;
  paymentUrl: string | null;
  createdAt: string;
  settledAt: string | null;
  maskedResponse: string | null;
}

export interface AdminOrderData {
  id: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerEmail: string | null;
  eventDate: string; // ISO string
  totalPcs: number;
  subtotal: number;
  shippingFee: number | null;
  totalAmount: number | null;
  dpAmount: number | null;
  status: string;
  notes: string | null;
  cancellationReason: string | null;
  createdAt: string; // ISO string
  confirmedAt: string | null;
  initialPaymentDueAt: string | null;
  items: AdminOrderItem[];
  payments: AdminOrderPayment[];
}

interface AdminDashboardClientProps {
  orders: AdminOrderData[];
}

type FilterTab = "all" | "proof_pending" | "waiting" | "production" | "archived";

export default function AdminDashboardClient({ orders }: AdminDashboardClientProps) {
  const [filterTab, setFilterTab] = useState<FilterTab>("proof_pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Modals State
  const [lockModalOrder, setLockModalOrder] = useState<AdminOrderData | null>(null);
  const [shippingFeeInput, setShippingFeeInput] = useState<string>("0");
  const [lockError, setLockError] = useState<string | null>(null);

  const [rejectModalOrder, setRejectModalOrder] = useState<AdminOrderData | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [rejectError, setRejectError] = useState<string | null>(null);

  const [statusModalOrder, setStatusModalOrder] = useState<AdminOrderData | null>(null);
  const [targetStatus, setTargetStatus] = useState<OrderStatus>("IN_PREPARATION");

  const [tokenModalOrder, setTokenModalOrder] = useState<AdminOrderData | null>(null);
  const [generatedTrackingUrl, setGeneratedTrackingUrl] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  // Modal Pratinjau Foto Bukti Struk Penuh
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<{
    url: string;
    orderCode: string;
    amount: number;
    senderName?: string;
  } | null>(null);

  // Formatter Helpers
  const formatRupiah = (val: number | null | undefined) => {
    if (val === null || val === undefined) return "—";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDateTimeWib = (isoString: string) => {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }).format(d);
  };

  const formatDateWib = (isoString: string) => {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(d);
  };

  const parsePaymentMetadata = (jsonStr: string | null) => {
    if (!jsonStr) return {};
    try {
      return JSON.parse(jsonStr) as {
        senderBank?: string;
        senderName?: string;
        customerNotes?: string;
        uploadedAt?: string;
      };
    } catch {
      return {};
    }
  };

  // Metrics
  const totalCount = orders.length;
  const proofPendingOrders = orders.filter((o) =>
    o.payments?.some((p) => p.status === "PENDING")
  );
  const proofPendingCount = proofPendingOrders.length;
  const waitingOngkirCount = orders.filter(
    (o) => o.status === "WAITING_ADMIN_CONFIRMATION"
  ).length;
  const productionCount = orders.filter((o) =>
    ["DP_PAID", "FULLY_PAID", "IN_PREPARATION", "IN_DELIVERY"].includes(o.status)
  ).length;
  const completedCount = orders.filter((o) => o.status === "COMPLETED").length;

  // Filter & Search Logic
  const filteredOrders = orders.filter((order) => {
    let matchesTab = true;

    if (filterTab === "proof_pending") {
      matchesTab = order.payments?.some((p) => p.status === "PENDING") ?? false;
    } else if (filterTab === "waiting") {
      matchesTab = order.status === "WAITING_ADMIN_CONFIRMATION";
    } else if (filterTab === "production") {
      matchesTab = ["DP_PAID", "FULLY_PAID", "IN_PREPARATION", "IN_DELIVERY"].includes(
        order.status
      );
    } else if (filterTab === "archived") {
      matchesTab = [
        "COMPLETED",
        "REJECTED_BY_ADMIN",
        "CANCELLED_BY_CUSTOMER",
        "CANCELLED_BY_ADMIN_REFUND_REQ",
        "CANCELLED_DP_FORFEITED",
        "CANCELLED_FULL_REFUND_PENDING",
        "REFUNDED",
        "EXPIRED_UNCONFIRMED_BY_ADMIN",
        "EXPIRED_PAYMENT_TIMEOUT",
      ].includes(order.status);
    }

    if (!matchesTab) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchCode = order.orderCode.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.toLowerCase().includes(q);
      const matchAddress = order.customerAddress.toLowerCase().includes(q);
      return matchName || matchCode || matchPhone || matchAddress;
    }

    return true;
  });

  const getStatusBadge = (status: string, hasPendingProof: boolean) => {
    if (hasPendingProof) {
      return {
        label: "Bukti Transfer Masuk",
        className: "bg-[#C85A17] text-white border border-[#C85A17] font-bold animate-pulse",
      };
    }
    switch (status) {
      case "WAITING_ADMIN_CONFIRMATION":
        return {
          label: "Perlu Verifikasi Ongkir",
          className: "bg-amber-100 text-amber-900 border border-amber-300 font-medium",
        };
      case "CONFIRMED_AWAITING_PAYMENT":
        return {
          label: "Menunggu Transfer Pelanggan",
          className: "bg-blue-50 text-blue-900 border border-blue-200 font-medium",
        };
      case "DP_PAID":
        return {
          label: "DP 20% Terverifikasi",
          className: "bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold",
        };
      case "FULLY_PAID":
        return {
          label: "Lunas Penuh (100%)",
          className: "bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold",
        };
      case "IN_PREPARATION":
        return {
          label: "Dapur Sentral Memproduksi",
          className: "bg-amber-50 text-amber-900 border border-amber-400 font-semibold",
        };
      case "IN_DELIVERY":
        return {
          label: "Dalam Pengantaran Armada",
          className: "bg-purple-50 text-purple-900 border border-purple-200 font-semibold",
        };
      case "COMPLETED":
        return {
          label: "Layanan Selesai",
          className: "bg-neutral-100 text-neutral-700 border border-neutral-300",
        };
      case "REJECTED_BY_ADMIN":
        return {
          label: "Ditolak Admin",
          className: "bg-red-50 text-red-900 border border-red-200",
        };
      default:
        return {
          label: status,
          className: "bg-neutral-100 text-neutral-700 border border-neutral-200",
        };
    }
  };

  // Action Handlers
  const handleLockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lockModalOrder) return;
    setLockError(null);

    const fee = Number(shippingFeeInput.replace(/[^0-9]/g, ""));
    if (isNaN(fee) || fee < 0) {
      setLockError("Nominal ongkos kirim tidak valid.");
      return;
    }

    startTransition(async () => {
      const res = await lockOrderTotalAction(lockModalOrder.id, fee);
      if (res.error) {
        setLockError(res.error);
      } else {
        setLockModalOrder(null);
      }
    });
  };

  const handleApproveProof = (paymentId: number, orderId: number) => {
    if (!confirm("Konfirmasi dan setujui bukti transfer ini sebagai pembayaran valid?")) {
      return;
    }
    startTransition(async () => {
      const res = await approvePaymentAction(paymentId, orderId);
      if (res.error) {
        alert(res.error);
      }
    });
  };

  const handleRejectProof = (paymentId: number, orderId: number) => {
    const reason = prompt("Masukkan alasan penolakan bukti transfer (misal: nominal tidak cocok atau struk buram):");
    if (!reason || !reason.trim()) return;

    startTransition(async () => {
      const res = await rejectPaymentAction(paymentId, orderId, reason.trim());
      if (res.error) {
        alert(res.error);
      }
    });
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalOrder) return;
    setRejectError(null);

    if (!rejectReason.trim()) {
      setRejectError("Alasan penolakan pesanan wajib diisi.");
      return;
    }

    startTransition(async () => {
      const res = await rejectOrderAction(rejectModalOrder.id, rejectReason);
      if (res.error) {
        setRejectError(res.error);
      } else {
        setRejectModalOrder(null);
        setRejectReason("");
      }
    });
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalOrder) return;

    startTransition(async () => {
      const res = await updateOrderStatusAction(statusModalOrder.id, targetStatus);
      if (res.error) {
        alert(res.error);
      } else {
        setStatusModalOrder(null);
      }
    });
  };

  const handleRegenerateToken = (orderId: number) => {
    startTransition(async () => {
      const res = await regenerateOrderTokenAction(orderId);
      if (res.error) {
        alert(res.error);
      } else if (res.trackingUrl) {
        setGeneratedTrackingUrl(res.trackingUrl);
      }
    });
  };

  const formatWaPhone = (phone: string) => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.substring(1);
    }
    return clean;
  };

  return (
    <div className="space-y-10">
      {/* 1. Live Operational Statistics Ribbon (Exact Same Architectural Grid as Main Landing Page) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#141413]/10 border-y border-[#141413]/10 overflow-hidden bg-[#FAF9F5]">
        <div className="p-6 sm:p-8 bg-[#FAF9F5] space-y-2">
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#C85A17] font-semibold block">
            01 / TOTAL ORDERS
          </span>
          <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#141413] tracking-tight block">
            {totalCount}
          </span>
          <span className="font-sans text-xs text-[#626058] block">Seluruh riwayat pesanan masuk</span>
        </div>

        <div
          className={`p-6 sm:p-8 space-y-2 transition-colors ${
            proofPendingCount > 0 ? "bg-amber-50/80 ring-1 ring-[#C85A17]" : "bg-[#FAF9F5]"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {proofPendingCount > 0 && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C85A17] opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  proofPendingCount > 0 ? "bg-[#C85A17]" : "bg-neutral-400"
                }`}
              />
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#C85A17] font-bold block">
              02 / BUKTI BAYAR MASUK
            </span>
          </div>
          <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#C85A17] tracking-tight block">
            {proofPendingCount}
          </span>
          <span className="font-sans text-xs text-[#626058] block">Menunggu persetujuan struk</span>
        </div>

        <div className="p-6 sm:p-8 bg-[#FAF9F5] space-y-2">
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#626058] font-semibold block">
            03 / VERIFIKASI ONGKIR
          </span>
          <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#141413] tracking-tight block">
            {waitingOngkirCount}
          </span>
          <span className="font-sans text-xs text-[#626058] block">Perlu penetapan rute armada</span>
        </div>

        <div className="p-6 sm:p-8 bg-[#FAF9F5] space-y-2">
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#626058] font-semibold block">
            04 / PRODUKSI &amp; SELESAI
          </span>
          <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#141413] tracking-tight block">
            {productionCount + completedCount}
          </span>
          <span className="font-sans text-xs text-[#626058] block">
            {productionCount} aktif, {completedCount} selesai
          </span>
        </div>
      </div>

      {/* 2. Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#141413]/10 pb-5">
        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterTab("proof_pending")}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              filterTab === "proof_pending"
                ? "bg-[#C85A17] text-white font-bold shadow-xs"
                : "bg-white text-[#626058] hover:text-[#141413] hover:bg-neutral-100 border border-[#141413]/10"
            }`}
          >
            <span>● Bukti Bayar Masuk ({proofPendingCount})</span>
          </button>

          <button
            onClick={() => setFilterTab("waiting")}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              filterTab === "waiting"
                ? "bg-[#141413] text-[#FAF9F5] font-bold shadow-xs"
                : "bg-white text-[#626058] hover:text-[#141413] hover:bg-neutral-100 border border-[#141413]/10"
            }`}
          >
            Perlu Ongkir ({waitingOngkirCount})
          </button>

          <button
            onClick={() => setFilterTab("production")}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              filterTab === "production"
                ? "bg-[#141413] text-[#FAF9F5] font-bold shadow-xs"
                : "bg-white text-[#626058] hover:text-[#141413] hover:bg-neutral-100 border border-[#141413]/10"
            }`}
          >
            Produksi &amp; Armada ({productionCount})
          </button>

          <button
            onClick={() => setFilterTab("all")}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              filterTab === "all"
                ? "bg-[#141413] text-[#FAF9F5] font-bold shadow-xs"
                : "bg-white text-[#626058] hover:text-[#141413] hover:bg-neutral-100 border border-[#141413]/10"
            }`}
          >
            Semua ({totalCount})
          </button>

          <button
            onClick={() => setFilterTab("archived")}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              filterTab === "archived"
                ? "bg-[#141413] text-[#FAF9F5] font-bold shadow-xs"
                : "bg-white text-[#626058] hover:text-[#141413] hover:bg-neutral-100 border border-[#141413]/10"
            }`}
          >
            Arsip / Selesai
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[280px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode, nama PIC, telepon..."
            className="w-full text-xs font-mono bg-white border border-[#141413]/15 px-3.5 py-2 text-[#141413] placeholder-[#8E8B81] focus:outline-none focus:border-[#141413] shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8E8B81] hover:text-[#141413]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. Operational Orders Ledger (Light Clean Design) */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[#141413]/15 bg-white/60 space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#8E8B81]">
            Tidak ada pesanan pada kategori ini
          </p>
          <p className="font-sans text-xs text-[#8E8B81]">
            {searchQuery
              ? "Coba gunakan kata kunci pencarian yang lain."
              : "Semua pengajuan pesanan pada tab ini telah selesai diproses."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const pendingPayment = order.payments?.find((p) => p.status === "PENDING");
            const badge = getStatusBadge(order.status, !!pendingPayment);
            const waNumber = formatWaPhone(order.customerPhone);
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
              `Halo Bpk/Ibu ${order.customerName}, kami dari operasional PT. Zahdan Kamal Sentosa mengonfirmasi pesanan katering Anda (Kode: ${order.orderCode}).`
            )}`;

            return (
              <div
                key={order.id}
                className="bg-white border border-[#141413]/10 hover:border-[#141413]/30 transition-all p-6 sm:p-8 space-y-6 shadow-[0_1px_4px_rgba(20,20,19,0.03)]"
              >
                {/* Header Baris Pesanan */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#141413]/10 pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-display font-extrabold text-base sm:text-lg text-[#141413] tracking-tight">
                      {order.orderCode}
                    </span>
                    <span
                      className={`inline-block text-[11px] font-mono px-3 py-1 uppercase tracking-wider rounded-xs ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs text-[#8E8B81] block">
                      Diajukan: {formatDateTimeWib(order.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Grid Informasi Inti (3 Kolom Typography Before Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
                  {/* Kolom 1: PIC Pelanggan & Alamat */}
                  <div className="space-y-2 border-l border-[#141413]/10 pl-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
                      PIC &amp; Alamat Pabrik
                    </span>
                    <p className="font-display font-bold text-sm text-[#141413]">
                      {order.customerName}
                    </p>
                    <p className="text-[#626058] font-mono">
                      Telepon / WA:{" "}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#141413] underline hover:text-[#C85A17] font-semibold"
                      >
                        {order.customerPhone} ↗
                      </a>
                    </p>
                    <p className="font-sans text-[#626058] leading-relaxed">
                      {order.customerAddress}
                    </p>
                  </div>

                  {/* Kolom 2: Spesifikasi Acara & Menu */}
                  <div className="space-y-2 border-l border-[#141413]/10 pl-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
                      Jadwal Pengantaran &amp; Menu
                    </span>
                    <p className="font-display font-bold text-[#141413]">
                      {formatDateWib(order.eventDate)}
                    </p>
                    <p className="text-[#626058]">
                      Total Porsi:{" "}
                      <strong className="text-[#141413] font-mono">{order.totalPcs} Porsi</strong>
                    </p>
                    <div className="space-y-0.5">
                      {order.items.map((item) => (
                        <p key={item.id} className="text-[#141413]">
                          • {item.menuItemName} ({formatRupiah(item.unitPrice)} / porsi)
                        </p>
                      ))}
                    </div>
                    {order.notes && (
                      <p className="text-amber-900 bg-amber-50 p-2 border border-amber-200 text-[11px] mt-1 font-sans">
                        Catatan: {order.notes}
                      </p>
                    )}
                  </div>

                  {/* Kolom 3: Financial Ledger */}
                  <div className="space-y-2 bg-[#FAF9F5] p-4 border border-[#141413]/10">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
                      Rekapitulasi Finansial
                    </span>
                    <div className="flex justify-between text-[#626058] font-mono">
                      <span>Subtotal Makanan:</span>
                      <span className="text-[#141413] font-semibold">{formatRupiah(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[#626058] font-mono">
                      <span>Ongkir Resmi:</span>
                      <span className="text-[#141413]">
                        {order.shippingFee !== null ? formatRupiah(order.shippingFee) : "Belum diisi"}
                      </span>
                    </div>
                    <div className="border-t border-[#141413]/10 pt-2 flex justify-between font-bold text-[#141413] font-mono">
                      <span>Total Tagihan:</span>
                      <span className="text-[#C85A17] text-sm">
                        {order.totalAmount !== null ? formatRupiah(order.totalAmount) : "Menunggu Admin"}
                      </span>
                    </div>
                    {order.dpAmount && (
                      <div className="flex justify-between text-emerald-800 text-[11px] font-mono pt-1">
                        <span>Opsi DP (20%):</span>
                        <span>{formatRupiah(order.dpAmount)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. INLINE PAYMENT PROOF VIEWER & APPROVAL (IF CUSTOMER UPLOADED PROOF ON WEB) */}
                {pendingPayment && (() => {
                  const meta = parsePaymentMetadata(pendingPayment.maskedResponse);

                  return (
                    <div className="p-5 bg-amber-50/70 border-2 border-[#C85A17] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#C85A17] animate-ping" />
                          <span className="font-mono text-xs font-bold text-[#C85A17] uppercase tracking-wider">
                            BUKTI TRANSFER TERUNGGAH DARI WEB PELANGGAN
                          </span>
                        </div>
                        <span className="font-mono text-xs text-[#626058]">
                          Diunggah: {formatDateTimeWib(pendingPayment.createdAt)}
                        </span>
                      </div>

                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Thumbnail Bukti Transfer */}
                        {pendingPayment.paymentUrl && (
                          <div
                            onClick={() =>
                              setReceiptPreviewUrl({
                                url: pendingPayment.paymentUrl || "",
                                orderCode: order.orderCode,
                                amount: pendingPayment.amount,
                                senderName: meta.senderName,
                              })
                            }
                            className="relative w-32 h-32 bg-white border border-[#141413]/20 overflow-hidden cursor-pointer group shrink-0 shadow-xs"
                          >
                            <Image
                              src={pendingPayment.paymentUrl}
                              alt="Bukti Struk"
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-mono text-center p-1">
                              🔍 Perbesar Struk
                            </div>
                          </div>
                        )}

                        {/* Rincian Pembayaran yang Diklaim */}
                        <div className="space-y-1.5 flex-1 text-xs text-[#626058]">
                          <p>
                            <span>Jenis Pembayaran:</span>{" "}
                            <strong className="text-[#141413] font-mono">
                              {pendingPayment.paymentType === "DP"
                                ? "Uang Muka (DP 20%)"
                                : "Pelunasan Penuh (100%)"}
                            </strong>
                          </p>
                          <p>
                            <span>Nominal Ditransfer:</span>{" "}
                            <strong className="text-xl font-display font-extrabold text-[#C85A17] font-mono">
                              {formatRupiah(pendingPayment.amount)}
                            </strong>
                          </p>
                          <p>
                            <span>Bank Pengirim:</span>{" "}
                            <strong className="text-[#141413] font-mono">
                              {pendingPayment.paymentChannel || meta.senderBank || "—"}
                            </strong>
                          </p>
                          <p>
                            <span>Nama Pemilik Rekening:</span>{" "}
                            <strong className="text-[#141413]">
                              {meta.senderName || "—"}
                            </strong>
                          </p>
                          {meta.customerNotes && (
                            <p className="text-[11px] text-[#626058] italic font-sans">
                              Catatan Pengirim: &quot;{meta.customerNotes}&quot;
                            </p>
                          )}
                        </div>

                        {/* Tombol Aksi Persetujuan Bukti Pembayaran */}
                        <div className="flex flex-col gap-2.5 w-full md:w-auto shrink-0">
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleApproveProof(pendingPayment.id, order.id)}
                            className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer disabled:opacity-50 text-center shadow-xs"
                          >
                            {isPending ? "Memverifikasi..." : "✓ Setujui Pembayaran & Kunci Jadwal"}
                          </button>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setReceiptPreviewUrl({
                                  url: pendingPayment.paymentUrl || "",
                                  orderCode: order.orderCode,
                                  amount: pendingPayment.amount,
                                  senderName: meta.senderName,
                                })
                              }
                              className="flex-1 px-3 py-2 bg-white hover:bg-neutral-50 text-[#141413] font-mono text-[11px] uppercase tracking-wider border border-[#141413]/15 transition-all cursor-pointer text-center"
                            >
                              Lihat Foto Penuh ↗
                            </button>

                            <button
                              type="button"
                              disabled={isPending}
                              onClick={() => handleRejectProof(pendingPayment.id, order.id)}
                              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-800 font-mono text-[11px] uppercase tracking-wider border border-red-200 transition-all cursor-pointer disabled:opacity-50"
                            >
                              Tolak Bukti
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Footer Baris: Tombol Tindakan Operasional */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#141413]/10">
                  <div className="flex items-center gap-3">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#626058] hover:text-[#141413] border border-[#141413]/15 transition-all shadow-2xs"
                    >
                      <span>💬 Hubungi via WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setTokenModalOrder(order);
                        setGeneratedTrackingUrl(null);
                        setCopyFeedback(false);
                      }}
                      className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#626058] hover:text-[#141413] border border-[#141413]/15 transition-all cursor-pointer shadow-2xs"
                    >
                      🔗 Tautan Pelanggan
                    </button>
                  </div>

                  {/* Tombol Perubahan Tahapan Produksi & Ongkir */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {order.status === "WAITING_ADMIN_CONFIRMATION" && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setRejectModalOrder(order);
                            setRejectReason("");
                            setRejectError(null);
                          }}
                          className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-red-700 hover:text-red-800 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                        >
                          Tolak Pesanan
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setLockModalOrder(order);
                            setShippingFeeInput("0");
                            setLockError(null);
                          }}
                          className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-[#141413] hover:bg-[#141413]/90 text-[#FAF9F5] font-bold transition-all cursor-pointer shadow-xs"
                        >
                          Tetapkan Ongkir &amp; Kunci Total ↗
                        </button>
                      </>
                    )}

                    {["DP_PAID", "FULLY_PAID"].includes(order.status) && (
                      <button
                        type="button"
                        onClick={() => {
                          setStatusModalOrder(order);
                          setTargetStatus("IN_PREPARATION");
                        }}
                        className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Mulai Masak Dapur (IN_PREPARATION) ↗
                      </button>
                    )}

                    {order.status === "IN_PREPARATION" && (
                      <button
                        type="button"
                        onClick={() => {
                          setStatusModalOrder(order);
                          setTargetStatus("IN_DELIVERY");
                        }}
                        className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-purple-700 hover:bg-purple-800 text-white font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Kirim Armada Insulated Box (IN_DELIVERY) ↗
                      </button>
                    )}

                    {order.status === "IN_DELIVERY" && (
                      <button
                        type="button"
                        onClick={() => {
                          setStatusModalOrder(order);
                          setTargetStatus("COMPLETED");
                        }}
                        className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Tandai Selesai (COMPLETED) ✓
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. MODAL: Tetapkan Ongkir & Kunci Total (Warm Light Editorial) */}
      {lockModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#FAF9F5] border border-[#141413]/20 max-w-lg w-full p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#C85A17] font-semibold block">
                  Otorisasi Penguncian Tagihan
                </span>
                <h3 className="text-lg font-display font-bold text-[#141413] mt-0.5">
                  Tetapkan Ongkir — {lockModalOrder.orderCode}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLockModalOrder(null)}
                className="text-[#626058] hover:text-[#141413] text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-1.5 bg-white p-4 border border-[#141413]/10 text-[#626058]">
              <p>
                <strong className="text-[#141413]">Pemesan:</strong> {lockModalOrder.customerName} (
                {lockModalOrder.customerPhone})
              </p>
              <p>
                <strong className="text-[#141413]">Alamat Pabrik:</strong> {lockModalOrder.customerAddress}
              </p>
              <p>
                <strong className="text-[#141413]">Jadwal Acara:</strong> {formatDateWib(lockModalOrder.eventDate)} ({lockModalOrder.totalPcs} Porsi)
              </p>
              <p>
                <strong className="text-[#141413]">Subtotal Makanan:</strong> {formatRupiah(lockModalOrder.subtotal)}
              </p>
            </div>

            <form onSubmit={handleLockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#141413] mb-1.5">
                  Nominal Ongkos Kirim Karawang (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#626058]">
                    Rp
                  </span>
                  <input
                    type="text"
                    required
                    value={shippingFeeInput}
                    onChange={(e) => {
                      const numeric = e.target.value.replace(/[^0-9]/g, "");
                      setShippingFeeInput(numeric);
                    }}
                    placeholder="0"
                    className="w-full pl-11 pr-4 py-2.5 text-sm font-mono bg-white border border-[#141413]/20 text-[#141413] focus:outline-none focus:border-[#141413]"
                  />
                </div>
                <p className="text-[11px] text-[#626058] mt-1.5 font-mono">
                  Isi 0 jika bebas ongkir atau radius pabrik terdekat.
                </p>
              </div>

              {/* Kalkulasi Live */}
              {(() => {
                const fee = Number(shippingFeeInput || 0);
                const total = lockModalOrder.subtotal + fee;
                const dp = Math.ceil(lockModalOrder.subtotal * 0.2);
                return (
                  <div className="p-4 bg-white border border-[#141413]/10 text-xs font-mono space-y-1.5">
                    <div className="flex justify-between text-[#626058]">
                      <span>Subtotal Makanan:</span>
                      <span className="text-[#141413]">{formatRupiah(lockModalOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[#626058]">
                      <span>Ongkos Kirim Resmi:</span>
                      <span className="text-[#141413]">{formatRupiah(fee)}</span>
                    </div>
                    <div className="border-t border-[#141413]/10 pt-2 flex justify-between font-bold text-[#141413]">
                      <span>Total Tagihan Pelanggan:</span>
                      <span className="text-[#C85A17]">{formatRupiah(total)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-800 text-[11px] pt-1">
                      <span>Uang Muka (DP 20%):</span>
                      <span>{formatRupiah(dp)}</span>
                    </div>
                  </div>
                );
              })()}

              {lockError && (
                <p className="text-xs text-red-800 bg-red-50 p-3 border border-red-200 font-mono">
                  {lockError}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setLockModalOrder(null)}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#626058] hover:text-[#141413] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 text-xs font-mono uppercase tracking-wider bg-[#141413] hover:bg-[#141413]/90 text-[#FAF9F5] font-bold cursor-pointer disabled:opacity-50"
                >
                  {isPending ? "Mengunci..." : "Kunci & Konfirmasi Pesanan ↗"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: Preview Full Receipt (Pratinjau Foto Struk Penuh) */}
      {receiptPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#FAF9F5] border border-[#141413]/20 max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  INSPEKTUR BUKTI TRANSFER
                </span>
                <h3 className="text-base font-bold text-[#141413]">
                  Bukti Pembayaran — {receiptPreviewUrl.orderCode}
                </h3>
                <p className="text-xs text-[#626058]">
                  Nominal: {formatRupiah(receiptPreviewUrl.amount)} {receiptPreviewUrl.senderName && `(Pengirim: ${receiptPreviewUrl.senderName})`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReceiptPreviewUrl(null)}
                className="text-[#626058] hover:text-[#141413] text-base font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative w-full h-[60vh] bg-black/5 border border-[#141413]/10 overflow-hidden">
              <Image
                src={receiptPreviewUrl.url}
                alt="Foto Struk Penuh"
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <a
                href={receiptPreviewUrl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-[#C85A17] hover:underline"
              >
                Buka Berkas di Tab Baru ↗
              </a>
              <button
                type="button"
                onClick={() => setReceiptPreviewUrl(null)}
                className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-[#141413] text-[#FAF9F5] font-bold cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: Tolak Pesanan */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#FAF9F5] border border-[#141413]/20 max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-red-700 font-semibold block">
                  Operasional Dapur
                </span>
                <h3 className="text-base font-bold text-[#141413]">
                  Tolak Pengajuan — {rejectModalOrder.orderCode}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRejectModalOrder(null)}
                className="text-[#626058] hover:text-[#141413] text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#141413] mb-1.5">
                  Alasan Penolakan
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Contoh: Kuota boiler uap untuk tanggal tersebut telah terisi penuh oleh kontrak pabrik..."
                  className="w-full text-xs p-3 bg-white border border-[#141413]/20 text-[#141413] focus:outline-none focus:border-red-600"
                />
              </div>

              {rejectError && (
                <p className="text-xs text-red-800 bg-red-50 p-2.5 border border-red-200 font-mono">
                  {rejectError}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setRejectModalOrder(null)}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#626058] hover:text-[#141413] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-red-700 hover:bg-red-800 text-white font-bold cursor-pointer disabled:opacity-50"
                >
                  {isPending ? "Memproses..." : "Konfirmasi Tolak Pesanan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL: Pembaruan Status Manual */}
      {statusModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#FAF9F5] border border-[#141413]/20 max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Kendali Alur Operasional
                </span>
                <h3 className="text-base font-bold text-[#141413]">
                  Ubah Status — {statusModalOrder.orderCode}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStatusModalOrder(null)}
                className="text-[#626058] hover:text-[#141413] text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#141413] mb-1.5">
                  Pilih Status Baru
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as OrderStatus)}
                  className="w-full text-xs p-3 bg-white border border-[#141413]/20 text-[#141413] focus:outline-none focus:border-[#141413]"
                >
                  <option value="IN_PREPARATION">IN_PREPARATION — Dapur Sentral Sedang Memasak</option>
                  <option value="IN_DELIVERY">IN_DELIVERY — Armada Insulated Box Menuju Lokasi</option>
                  <option value="COMPLETED">COMPLETED — Serah Terima Kantin Pabrik Selesai</option>
                  <option value="CANCELLED_BY_ADMIN_REFUND_REQ">
                    CANCELLED_BY_ADMIN_REFUND_REQ — Batal Operasional (Perlu Refund Pelanggan)
                  </option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setStatusModalOrder(null)}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#626058] hover:text-[#141413] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 text-xs font-mono uppercase tracking-wider bg-[#141413] hover:bg-[#141413]/90 text-[#FAF9F5] font-bold cursor-pointer disabled:opacity-50"
                >
                  {isPending ? "Menyimpan..." : "Simpan Status ↗"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. MODAL: Tautan Tracking Pelanggan */}
      {tokenModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-[#FAF9F5] border border-[#141413]/20 max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#141413]/10 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#C85A17] font-semibold block">
                  Keamanan Akses Privat
                </span>
                <h3 className="text-base font-bold text-[#141413]">
                  Tautan Tracking — {tokenModalOrder.orderCode}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTokenModalOrder(null)}
                className="text-[#626058] hover:text-[#141413] text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-[#626058] space-y-2 leading-relaxed">
              <p>
                Sesuai arsitektur keamanan ZKS, tautan pelanggan dienkripsi dengan token acak 64-hex dan hanya hash satu arah (SHA-256) yang tersimpan di basis data.
              </p>
              <p>
                Jika pelanggan kehilangan tautan pelacakannya, Anda dapat membuatkan token baru di bawah ini. Tautan lama otomatis tidak berlaku seketika.
              </p>
            </div>

            {generatedTrackingUrl ? (
              <div className="space-y-3 bg-white p-4 border border-emerald-600/40">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-emerald-800 font-bold">
                  ✓ Tautan Baru Berhasil Dibuat
                </span>
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}${generatedTrackingUrl}`}
                  className="w-full text-xs font-mono p-2.5 bg-neutral-50 border border-neutral-300 text-[#141413]"
                />
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}${generatedTrackingUrl}`
                      );
                      setCopyFeedback(true);
                      setTimeout(() => setCopyFeedback(false), 2000);
                    }}
                    className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-neutral-200 hover:bg-neutral-300 text-[#141413] cursor-pointer"
                  >
                    {copyFeedback ? "✓ Tersalin!" : "Salin Tautan"}
                  </button>

                  <a
                    href={`https://wa.me/${formatWaPhone(tokenModalOrder.customerPhone)}?text=${encodeURIComponent(
                      `Halo Bpk/Ibu ${tokenModalOrder.customerName}, berikut tautan resmi pemantauan pesanan katering ZKS Anda: ${window.location.origin}${generatedTrackingUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
                  >
                    Kirim via WhatsApp ↗
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white border border-[#141413]/10 text-xs text-[#141413] space-y-3">
                <p className="text-[#626058]">
                  Klik tombol di bawah untuk membuat token acak baru dan menghasilkan URL tracking pelanggan.
                </p>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleRegenerateToken(tokenModalOrder.id)}
                  className="px-5 py-2.5 text-xs font-mono uppercase tracking-wider bg-[#141413] hover:bg-[#141413]/90 text-[#FAF9F5] font-bold cursor-pointer disabled:opacity-50"
                >
                  {isPending ? "Membuat..." : "Buat Tautan Akses Pelanggan ↗"}
                </button>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setTokenModalOrder(null)}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#626058] hover:text-[#141413] cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
