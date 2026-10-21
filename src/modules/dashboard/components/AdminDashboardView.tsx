"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import {
  lockOrderTotalAction,
  rejectOrderAction,
  updateOrderStatusAction,
  regenerateOrderTokenAction,
  approvePaymentAction,
  rejectPaymentAction,
} from "@/app/admin/dashboard/actions";
import type { OrderStatus } from "@/generated/prisma/enums";
import type { AdminOrderData } from "../types";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { Modal } from "@/shared/components/ui/Modal";
import { Input } from "@/shared/components/ui/Input";
import { RecentActivityTimeline, TimelineActivityItem } from "@/shared/components/ui/RecentActivityTimeline";

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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Metrics Calculation
  const totalCount = orders.length;
  const proofPendingCount = orders.filter((o) =>
    o.payments?.some((p) => p.status === "PENDING")
  ).length;
  const waitingOngkirCount = orders.filter(
    (o) => o.status === "WAITING_ADMIN_CONFIRMATION"
  ).length;
  const productionCount = orders.filter((o) =>
    ["DP_PAID", "FULLY_PAID", "IN_PREPARATION", "IN_DELIVERY"].includes(o.status)
  ).length;
  const completedCount = orders.filter((o) => o.status === "COMPLETED").length;

  // Filter Orders
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

  const getStatusBadgeProps = (status: string, hasPendingProof: boolean) => {
    if (hasPendingProof) {
      return {
        variant: "pending" as const,
        label: "Bukti Transfer Masuk",
        dot: true,
      };
    }
    switch (status) {
      case "WAITING_ADMIN_CONFIRMATION":
        return { variant: "warning" as const, label: "Perlu Ongkir", dot: true };
      case "CONFIRMED_AWAITING_PAYMENT":
        return { variant: "info" as const, label: "Menunggu Pembayaran", dot: true };
      case "DP_PAID":
        return { variant: "approved" as const, label: "DP 20% Terverifikasi", dot: true };
      case "FULLY_PAID":
        return { variant: "completed" as const, label: "Lunas Penuh (100%)", dot: true };
      case "IN_PREPARATION":
        return { variant: "pending" as const, label: "Sedang Dimasak", dot: true };
      case "IN_DELIVERY":
        return { variant: "info" as const, label: "Dalam Pengiriman Armada", dot: true };
      case "COMPLETED":
        return { variant: "completed" as const, label: "Layanan Selesai", dot: true };
      case "REJECTED_BY_ADMIN":
      case "CANCELLED_BY_CUSTOMER":
      case "CANCELLED_BY_ADMIN_REFUND_REQ":
      case "CANCELLED_DP_FORFEITED":
      case "CANCELLED_FULL_REFUND_PENDING":
      case "REFUNDED":
      case "EXPIRED_UNCONFIRMED_BY_ADMIN":
      case "EXPIRED_PAYMENT_TIMEOUT":
        return { variant: "cancelled" as const, label: "Dibatalkan / Kadaluarsa", dot: false };
      default:
        return { variant: "neutral" as const, label: status, dot: false };
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

  const handleRegenerateToken = (order: AdminOrderData) => {
    setTokenModalOrder(order);
    setGeneratedTrackingUrl(null);
    setCopyFeedback(false);

    startTransition(async () => {
      const res = await regenerateOrderTokenAction(order.id);
      if (res.error) {
        alert(res.error);
      } else if (res.trackingUrl) {
        setGeneratedTrackingUrl(res.trackingUrl);
      }
    });
  };

  const recentActivities: TimelineActivityItem[] = orders.slice(0, 5).map((o) => {
    const hasProof = o.payments?.some((p) => p.status === "PENDING");
    return {
      id: `act-${o.id}`,
      title: `${o.orderCode} — ${o.customerName}`,
      description: hasProof
        ? `Bukti transfer baru diunggah senilai ${formatRupiah(o.payments?.find((p) => p.status === "PENDING")?.amount)}. Menunggu verifikasi audit admin.`
        : `Pesanan status ${o.status.replace(/_/g, " ")}. Total ${o.totalPcs} porsi katering (${formatRupiah(o.totalAmount)}).`,
      timestamp: new Date(o.createdAt).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      user: "Admin Operasional",
      type: hasProof ? ("qc" as const) : ("order" as const),
      badge: o.status,
    };
  });

  return (
    <div className="space-y-6">
      {/* 1. HIERARCHICAL KPI SECTION (Anti AI Slop: 1 Primary + 3 Secondary) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Primary KPI Card: Bukti Bayar & Perlu Aksi Cepat */}
        <div className="md:col-span-5 lg:col-span-4">
          <KpiCard
            isPrimary={true}
            label="Bukti Bayar Masuk"
            value={proofPendingCount}
            subtext={
              proofPendingCount > 0
                ? "Menunggu verifikasi pembayaran struk transfer pelanggan"
                : "Tidak ada bukti pembayaran tertunda saat ini"
            }
            trend={{
              value: proofPendingCount > 0 ? "Perlu Tindakan" : "Antrean Bersih",
              isPositive: proofPendingCount === 0,
              label: "status operasional",
            }}
          />
        </div>

        {/* Secondary KPI Cards */}
        <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard
            label="Verifikasi Ongkir"
            value={waitingOngkirCount}
            subtext="Perlu penetapan rute armada"
            trend={{
              value: waitingOngkirCount > 0 ? "Pending" : "Lengkap",
              isPositive: waitingOngkirCount === 0,
            }}
          />

          <KpiCard
            label="Produksi & Armada"
            value={productionCount}
            subtext="Pesanan aktif berjalan"
            trend={{
              value: `${completedCount} selesai`,
              isPositive: true,
              label: "arsip",
            }}
          />

          <KpiCard
            label="Total Pesanan"
            value={totalCount}
            subtext="Seluruh riwayat pesanan masuk"
          />
        </div>
      </div>

      {/* 2. OPERATIONAL ANALYTICS (Purposeful Progress & Capacity Tracking) */}
      <div className="bg-white border border-slate-200 rounded-[12px] p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-[16px] font-semibold text-slate-900 tracking-tight">
              Kapasitas &amp; Alur Pemenuhan Dapur Sentral
            </h3>
            <p className="text-[12px] text-slate-500">
              Analisis beban kerja stasiun masak, armada Karawang, dan status penyelesaian pesanan hari ini.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-[6px] border border-emerald-200 font-medium self-start sm:self-auto">
            Status: Kapasitas Optimal
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Progress Chart 1: Beban Produksi Dapur */}
          <div className="space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-600 font-medium">Beban Produksi &amp; Logistik</span>
              <span className="font-mono font-semibold text-slate-900">
                {productionCount} / {Math.max(totalCount, 1)} Pesanan ({Math.round((productionCount / Math.max(totalCount, 1)) * 100)}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${Math.min(Math.round((productionCount / Math.max(totalCount, 1)) * 100), 100)}%` }}
                title="Produksi & Armada"
              />
              <div
                className="bg-amber-400 h-full transition-all duration-300"
                style={{ width: `${Math.min(Math.round((waitingOngkirCount / Math.max(totalCount, 1)) * 100), 100)}%` }}
                title="Perlu Ongkir"
              />
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-0.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Dimasak / Dikirim ({productionCount})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Menunggu Ongkir ({waitingOngkirCount})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-200" />
                Lainnya ({Math.max(totalCount - productionCount - waitingOngkirCount, 0)})
              </span>
            </div>
          </div>

          {/* Progress Chart 2: Verifikasi Pembayaran */}
          <div className="space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-600 font-medium">Tingkat Penyelesaian Tagihan</span>
              <span className="font-mono font-semibold text-slate-900">
                {completedCount + productionCount} Terverifikasi ({Math.round(((completedCount + productionCount) / Math.max(totalCount, 1)) * 100)}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${Math.min(Math.round((completedCount / Math.max(totalCount, 1)) * 100), 100)}%` }}
                title="Lunas & Selesai"
              />
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(Math.round((productionCount / Math.max(totalCount, 1)) * 100), 100)}%` }}
                title="DP Terverifikasi"
              />
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-0.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Lunas Penuh ({completedCount})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                DP Aktif ({productionCount})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Bukti Tertunda ({proofPendingCount})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FILTER TABS & QUICK SEARCH TOOLBAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3 rounded-[12px] border border-slate-200 shadow-xs">
        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterTab("proof_pending")}
            className={`px-3.5 py-1.5 text-[13px] font-medium rounded-[8px] transition-colors whitespace-nowrap flex items-center gap-2 ${
              filterTab === "proof_pending"
                ? "bg-blue-600 text-white font-semibold shadow-xs"
                : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>Bukti Bayar ({proofPendingCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("waiting")}
            className={`px-3.5 py-1.5 text-[13px] font-medium rounded-[8px] transition-colors whitespace-nowrap ${
              filterTab === "waiting"
                ? "bg-blue-600 text-white font-semibold shadow-xs"
                : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Perlu Ongkir ({waitingOngkirCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("production")}
            className={`px-3.5 py-1.5 text-[13px] font-medium rounded-[8px] transition-colors whitespace-nowrap ${
              filterTab === "production"
                ? "bg-blue-600 text-white font-semibold shadow-xs"
                : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Produksi &amp; Armada ({productionCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`px-3.5 py-1.5 text-[13px] font-medium rounded-[8px] transition-colors whitespace-nowrap ${
              filterTab === "all"
                ? "bg-blue-600 text-white font-semibold shadow-xs"
                : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Semua ({totalCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("archived")}
            className={`px-3.5 py-1.5 text-[13px] font-medium rounded-[8px] transition-colors whitespace-nowrap ${
              filterTab === "archived"
                ? "bg-blue-600 text-white font-semibold shadow-xs"
                : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
            className="w-full text-[13px] bg-slate-50 border border-slate-200 rounded-[8px] px-3.5 py-1.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. OPERATIONAL ORDERS LIST (EDS Card/Table Standard) */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-[12px] p-8 space-y-2">
          <p className="text-[16px] font-semibold text-slate-800">
            Tidak ada pesanan pada filter ini
          </p>
          <p className="text-[13px] text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `Tidak ditemukan hasil yang cocok dengan kata kunci "${searchQuery}".`
              : "Semua antrean pesanan pada kategori ini sudah diproses."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const hasPendingProof =
              order.payments?.some((p) => p.status === "PENDING") ?? false;
            const badgeProps = getStatusBadgeProps(order.status, hasPendingProof);

            return (
              <div
                key={order.id}
                className="bg-white border border-slate-200 rounded-[12px] p-6 shadow-xs transition-colors hover:border-slate-300 space-y-5"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[16px] font-bold text-slate-900 tracking-tight">
                      {order.orderCode}
                    </span>
                    <Badge variant={badgeProps.variant} dot={badgeProps.dot}>
                      {badgeProps.label}
                    </Badge>
                  </div>
                  <div className="text-[12px] text-slate-500 font-normal">
                    Diajukan: {new Date(order.createdAt).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {/* 3-Column Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[14px]">
                  {/* Col 1: PIC & Lokasi */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      PIC &amp; ALAMAT PABRIK
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 block">{order.customerName}</span>
                      <a
                        href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[13px] text-blue-600 hover:text-blue-700 font-mono inline-flex items-center gap-1"
                      >
                        {order.customerPhone} ↗
                      </a>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                      {order.customerAddress}
                    </p>
                  </div>

                  {/* Col 2: Jadwal & Menu */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      JADWAL PENGANTARAN &amp; MENU
                    </div>
                    <div className="text-slate-900 font-medium">
                      {formatDate(order.eventDate)}
                    </div>
                    <div className="text-[13px] text-slate-600">
                      Total Porsi: <strong className="text-slate-900">{order.totalPcs} Porsi</strong>
                    </div>
                    <div className="text-[12px] text-slate-500 space-y-0.5">
                      {order.items.map((item) => (
                        <div key={item.id}>
                          • {item.menuItemName} ({item.quantity} pax)
                        </div>
                      ))}
                    </div>
                    {order.notes && (
                      <div className="p-2.5 rounded-[8px] bg-amber-50 border border-amber-200 text-[12px] text-amber-800">
                        Catatan: {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Col 3: Rekap Finansial */}
                  <div className="space-y-2 bg-slate-50 p-4 rounded-[10px] border border-slate-200">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      REKAPITULASI FINANSIAL
                    </div>
                    <div className="space-y-1 text-[13px]">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Subtotal Makanan:</span>
                        <span className="font-mono font-medium text-slate-900">{formatRupiah(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Ongkir Resmi:</span>
                        <span className="font-mono font-medium text-slate-900">
                          {order.shippingFee !== null ? formatRupiah(order.shippingFee) : "Belum ditentukan"}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                        <span className="font-semibold text-slate-900">Total Tagihan:</span>
                        <span className="font-mono font-bold text-slate-900 text-[16px]">
                          {formatRupiah(order.totalAmount)}
                        </span>
                      </div>
                      {order.dpAmount !== null && (
                        <div className="flex justify-between text-[12px] text-slate-500">
                          <span>Opsi DP (20%):</span>
                          <span className="font-mono">{formatRupiah(order.dpAmount)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Struk Bukti Bayar Masuk (Jika Ada) */}
                {order.payments && order.payments.some((p) => p.status === "PENDING") && (
                  <div className="p-4 rounded-[10px] bg-amber-50 border border-amber-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-amber-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
                        Bukti Pembayaran Masuk Menunggu Verifikasi
                      </span>
                      <span className="text-[11px] text-amber-800">
                        Pastikan nominal pada mutasi bank cocok sebelum konfirmasi
                      </span>
                    </div>

                    <div className="space-y-2">
                      {order.payments
                        .filter((p) => p.status === "PENDING")
                        .map((payment) => (
                          <div
                            key={payment.id}
                            className="bg-white p-3 rounded-[8px] border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px]"
                          >
                            <div className="space-y-0.5">
                              <div className="font-semibold text-slate-900">
                                {payment.paymentType === "DP" ? "Uang Muka (DP 20%)" : "Pelunasan Penuh (100%)"}:{" "}
                                <span className="text-blue-600 font-mono">{formatRupiah(payment.amount)}</span>
                              </div>
                              <div className="text-[12px] text-slate-500 font-mono">
                                Ref: {payment.paymentRef} · Channel: {payment.paymentChannel || "Transfer Bank"}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {payment.paymentUrl && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setReceiptPreviewUrl({
                                      url: payment.paymentUrl!,
                                      orderCode: order.orderCode,
                                      amount: payment.amount,
                                    })
                                  }
                                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-[8px] hover:bg-slate-50 transition-colors"
                                >
                                  Lihat Struk ↗
                                </button>
                              )}

                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleApproveProof(payment.id, order.id)}
                                disabled={isPending}
                              >
                                Setujui Bukti
                              </Button>

                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleRejectProof(payment.id, order.id)}
                                disabled={isPending}
                              >
                                Tolak Struk
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Halo ${order.customerName}, kami dari PT Zahdan Kamal Sentosa mengonfirmasi pesanan ${order.orderCode}.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-[8px] hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>💬 Hubungi via WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleRegenerateToken(order)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-[8px] hover:bg-slate-50 transition-colors"
                    >
                      🔗 Tautan Pelanggan
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === "WAITING_ADMIN_CONFIRMATION" && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setLockModalOrder(order);
                          setShippingFeeInput(order.shippingFee?.toString() || "0");
                        }}
                      >
                        Tentukan Ongkir &amp; Kunci
                      </Button>
                    )}

                    {!["COMPLETED", "REJECTED_BY_ADMIN"].includes(order.status) && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setStatusModalOrder(order);
                          setTargetStatus(order.status as OrderStatus);
                        }}
                      >
                        Ubah Status Operasional
                      </Button>
                    )}

                    {order.status === "WAITING_ADMIN_CONFIRMATION" && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setRejectModalOrder(order)}
                      >
                        Tolak Pesanan
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. ACTIVITY & AUDIT TIMELINE (EDS Page Hierarchy: Content -> Timeline -> Modals) */}
      <RecentActivityTimeline
        title="Jejak Audit &amp; Aktivitas Pesanan Terkini"
        subtitle="Log audit transaksi verifikasi pesanan, pembayaran, dan dispatch katering"
        items={recentActivities}
      />

      {/* 5. MODALS (EDS Standard: 12px Radius, Slate Overlay, Clear Typography) */}
      {/* Modal Kunci Ongkir */}
      <Modal
        isOpen={!!lockModalOrder}
        onClose={() => setLockModalOrder(null)}
        title="Tentukan Ongkir &amp; Kunci Pesanan"
        subtitle={`Pesanan ${lockModalOrder?.orderCode}`}
      >
        <form onSubmit={handleLockSubmit} className="space-y-4">
          <Input
            label="Nominal Ongkos Kirim Resmi (Rp)"
            type="number"
            value={shippingFeeInput}
            onChange={(e) => setShippingFeeInput(e.target.value)}
            required
            helperText="Masukkan ongkos kirim sesuai armada logistik. Tagihan total akan dikunci."
          />
          {lockError && <p className="text-[12px] text-red-600">{lockError}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setLockModalOrder(null)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Mengunci..." : "Kunci &amp; Terbitkan Tagihan"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Ubah Status */}
      <Modal
        isOpen={!!statusModalOrder}
        onClose={() => setStatusModalOrder(null)}
        title="Ubah Status Operasional Pesanan"
        subtitle={`Kode Pesanan: ${statusModalOrder?.orderCode}`}
      >
        <form onSubmit={handleStatusSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[14px] font-medium text-slate-700">
              Pilih Status Operasional Baru
            </label>
            <select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value as OrderStatus)}
              className="h-10 w-full rounded-[12px] border border-slate-200 bg-white px-3.5 py-2 text-[14px] text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="WAITING_ADMIN_CONFIRMATION">WAITING_ADMIN_CONFIRMATION (Perlu Ongkir)</option>
              <option value="CONFIRMED_AWAITING_PAYMENT">CONFIRMED_AWAITING_PAYMENT (Menunggu Bayar)</option>
              <option value="DP_PAID">DP_PAID (DP 20% Diterima)</option>
              <option value="FULLY_PAID">FULLY_PAID (Lunas 100%)</option>
              <option value="IN_PREPARATION">IN_PREPARATION (Dapur Sentral Memasak)</option>
              <option value="IN_DELIVERY">IN_DELIVERY (Armada Sedang Mengantar)</option>
              <option value="COMPLETED">COMPLETED (Selesai Diterima Klien)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStatusModalOrder(null)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Perbarui Status"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Tolak Pesanan */}
      <Modal
        isOpen={!!rejectModalOrder}
        onClose={() => setRejectModalOrder(null)}
        title="Tolak Pesanan Katering"
        subtitle={`Kode Pesanan: ${rejectModalOrder?.orderCode}`}
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[14px] font-medium text-slate-700">
              Alasan Penolakan
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
              rows={3}
              placeholder="Contoh: Kapasitas dapur sentral shift pagi sudah penuh, rute di luar jangkauan armada, dsb."
              className="w-full rounded-[12px] border border-slate-200 bg-white p-3 text-[14px] text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          {rejectError && <p className="text-[12px] text-red-600">{rejectError}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setRejectModalOrder(null)}
            >
              Batal
            </Button>
            <Button type="submit" variant="danger" disabled={isPending}>
              {isPending ? "Memproses..." : "Tolak Pesanan Resmi"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Tautan Pelanggan */}
      <Modal
        isOpen={!!tokenModalOrder}
        onClose={() => setTokenModalOrder(null)}
        title="Tautan Akses Pelanggan"
        subtitle={`Kode Pesanan: ${tokenModalOrder?.orderCode}`}
      >
        <div className="space-y-4">
          <p className="text-[13px] text-slate-600">
            Tautan ini digunakan oleh pelanggan untuk melihat status pesanan, rincian tagihan resmi, dan mengunggah bukti transfer:
          </p>
          {generatedTrackingUrl ? (
            <div className="space-y-2">
              <input
                type="text"
                readOnly
                value={generatedTrackingUrl}
                className="w-full text-[12px] font-mono bg-slate-50 border border-slate-200 rounded-[8px] p-2.5 text-slate-800"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(generatedTrackingUrl);
                  setCopyFeedback(true);
                  setTimeout(() => setCopyFeedback(false), 2000);
                }}
              >
                {copyFeedback ? "✓ Berhasil Disalin!" : "Salin Tautan"}
              </Button>
            </div>
          ) : (
            <p className="text-[12px] text-slate-400 font-mono">
              Menghasilkan tautan pelacakan unik...
            </p>
          )}
        </div>
      </Modal>

      {/* Modal Pratinjau Struk */}
      <Modal
        isOpen={!!receiptPreviewUrl}
        onClose={() => setReceiptPreviewUrl(null)}
        title="Pratinjau Bukti Transfer Pembayaran"
        subtitle={`Pesanan ${receiptPreviewUrl?.orderCode}`}
        maxWidth="2xl"
      >
        {receiptPreviewUrl && (
          <div className="space-y-4">
            <div className="relative aspect-[4/3] w-full bg-slate-100 rounded-[8px] overflow-hidden border border-slate-200 flex items-center justify-center">
              <Image
                src={receiptPreviewUrl.url}
                alt={`Struk ${receiptPreviewUrl.orderCode}`}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-[13px] text-slate-600 bg-slate-50 p-3 rounded-[8px]">
              <span>Nominal Klaim: <strong className="text-slate-900 font-mono">{formatRupiah(receiptPreviewUrl.amount)}</strong></span>
              <a
                href={receiptPreviewUrl.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
              >
                Buka Ukuran Asli ↗
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
