"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";

export interface ErpNotification {
  id: string;
  type:
    | "po_approved"
    | "low_stock"
    | "qc_failed"
    | "delivery_delayed"
    | "recipe_updated"
    | "system_maintenance";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  href: string;
}

const INITIAL_NOTIFICATIONS: ErpNotification[] = [
  {
    id: "notif-1",
    type: "po_approved",
    title: "PO Disetujui (PO-2026-002)",
    description: "PO Bahan Basah Dapur Sentral telah disetujui Manajemen untuk dieksekusi pengiriman.",
    timestamp: "8 menit lalu",
    read: false,
    href: "/admin/purchase-orders",
  },
  {
    id: "notif-2",
    type: "low_stock",
    title: "Stok Kritis: Minyak Goreng Sawit 18L",
    description: "Sisa persediaan 4 jerigen (di bawah minimum threshold 10 jerigen). Segera rilis PR.",
    timestamp: "25 menit lalu",
    read: false,
    href: "/admin/inventory",
  },
  {
    id: "notif-3",
    type: "qc_failed",
    title: "Inspeksi QC Ditolak: Batch Daging Sapi #883",
    description: "Suhu penerimaan terukur 9°C (melebihi ambang batas maksimal 4°C). Retur ke vendor.",
    timestamp: "1 jam lalu",
    read: false,
    href: "/admin/inventory/receiving",
  },
  {
    id: "notif-4",
    type: "delivery_delayed",
    title: "Armada Tertunda: Catering Shift Pagi KIIC",
    description: "Truk Pengantar ZKS-02 terhambat kemacetan pintu tol Karawang Barat (estimasi +15 mnt).",
    timestamp: "2 jam lalu",
    read: false,
    href: "/admin/dashboard",
  },
  {
    id: "notif-5",
    type: "recipe_updated",
    title: "Resep Diperbarui: Ayam Bakar Taliwang 500 Porsi",
    description: "Chef Eksekutif memperbarui rasio rempah cabai merah & gula aren di Dapur Sentral.",
    timestamp: "5 jam lalu",
    read: true,
    href: "/admin/dashboard",
  },
];

export function ErpNotificationCenter() {
  const [notifications, setNotifications] = useState<ErpNotification[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const displayedNotifications = notifications.filter((n) =>
    filter === "all" ? true : !n.read
  );

  const getIcon = (type: ErpNotification["type"]) => {
    switch (type) {
      case "po_approved":
        return <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />;
      case "low_stock":
        return <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />;
      case "qc_failed":
        return <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />;
      case "delivery_delayed":
        return <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />;
      case "recipe_updated":
        return <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />;
      case "system_maintenance":
        return <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 rounded-[8px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Pusat Notifikasi"
        title="Pusat Notifikasi Operasional"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600" />
          </span>
        )}
      </button>

      {/* Notification Popover Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-[12px] border border-slate-200 shadow-xl z-50 flex flex-col overflow-hidden animate-enterprise-dropdown origin-top-right">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-slate-900">Notifikasi Operasional</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-[4px] bg-rose-100 text-rose-700 text-[10px] font-semibold">
                  {unreadCount} Baru
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                Tandai dibaca
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 px-4 py-1.5 border-b border-slate-100 bg-white text-[11px]">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                "px-2 py-0.5 rounded-[4px] font-medium transition-colors cursor-pointer",
                filter === "all" ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-800"
              )}
            >
              Semua ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={cn(
                "px-2 py-0.5 rounded-[4px] font-medium transition-colors cursor-pointer",
                filter === "unread" ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-800"
              )}
            >
              Belum Dibaca ({unreadCount})
            </button>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {displayedNotifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-[12px]">
                Tidak ada notifikasi aktif.
              </div>
            ) : (
              displayedNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={cn(
                    "p-3 hover:bg-slate-50 transition-colors flex items-start gap-2.5",
                    !n.read && "bg-blue-50/30"
                  )}
                >
                  <div className="mt-1.5">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[12px] font-medium text-slate-900 leading-tight">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      {n.description}
                    </p>
                    {n.href !== "#" && (
                      <Link
                        href={n.href}
                        onClick={() => {
                          markAsRead(n.id);
                          setIsOpen(false);
                        }}
                        className="inline-block text-[11px] font-medium text-blue-600 hover:text-blue-800 mt-1"
                      >
                        Lihat Modul →
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/80 text-[11px] text-slate-400 text-center font-mono">
            Sistem Peringatan Dapur Karawang v2.5
          </div>
        </div>
      )}
    </div>
  );
}
