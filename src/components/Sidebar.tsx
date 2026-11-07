"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarProps {
  className?: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ className = "", isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      group: "OPERASIONAL & PESANAN",
      items: [
        {
          name: "Dashboard Operasional",
          href: "/admin/dashboard",
          badge: "Live",
          icon: (
            <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
        },
        {
          name: "Input Lembur Ad-Hoc",
          href: "/admin/order-adhoc",
          badge: "B2B Dispatch",
          isHighlight: true,
          icon: (
            <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ),
        },
        {
          name: "Jadwal Masak & BOM",
          href: "/admin/production",
          icon: (
            <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          ),
        },
        {
          name: "Display Dapur (KDS)",
          href: "/admin/kitchen",
          icon: (
            <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          name: "Pesanan Masuk & Tagihan",
          href: "/admin/dashboard#orders",
          icon: (
            <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
      ],
    },
    {
      group: "PENGADAAN & LOGISTIK",
      items: [
        {
          name: "Purchase Request (PR)",
          href: "/admin/purchase-requests",
          icon: (
            <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
        },
        {
          name: "Purchase Order (PO)",
          href: "/admin/purchase-orders",
          icon: (
            <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
        },
        {
          name: "Command Center Stok",
          href: "/admin/inventory",
          icon: (
            <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ),
        },
        {
          name: "Mitra Supplier (SRM)",
          href: "/admin/supplier",
          icon: (
            <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
        },
      ],
    },
    {
      group: "PORTAL & INTEGRASI",
      items: [
        {
          name: "Portal Publik ZKS",
          href: "/",
          badge: "Web Utama",
          icon: (
            <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Sidebar Component */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 shrink-0 bg-[#1B4332] text-[#F6FBF5] border-r border-[#2D5A3E] flex flex-col justify-between transition-transform duration-200 ease-in-out select-none ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${className}`}
      >
        {/* Top Section: Header & Identity */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Identity Header */}
          <div className="p-5 border-b border-[#2D5A3E] bg-[#16382a]/70">
            <div className="flex items-center gap-3">
              {/* Monogram Emblem */}
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 shadow-inner">
                <span className="font-sans font-black text-base text-[#D4AF37] tracking-wider">ZKS</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-sans font-bold text-[13px] leading-tight tracking-tight text-white uppercase truncate">
                  PT. Zahdan Kamal Sentosa
                </span>
                <span className="text-[10px] text-[#D4AF37] font-medium tracking-wide leading-none mt-1 truncate">
                  The Professional Catering Service
                </span>
                <span className="text-[9px] text-[#D7DBD6]/75 mt-0.5 truncate">
                  Dapur Sentral Ciampel Karawang
                </span>
              </div>
            </div>

            {/* Legalitas Kepatuhan & Sertifikasi Badges (Clean Apple-Style Flat Rows) */}
            <div className="mt-4 pt-3 border-t border-[#2D5A3E]/60 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px] text-[#D7DBD6]/90 px-1 py-0.5">
                <span className="font-medium text-white">ISO 22000:2009</span>
                <span className="font-mono text-[9px] text-[#D4AF37]">ZKS 221076 0001</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#D7DBD6]/90 px-1 py-0.5">
                <span className="font-medium text-white">Halal BPJPH</span>
                <span className="font-mono text-[9px] text-[#D4AF37]">ID32110006798080623</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#D7DBD6]/90 px-1 py-0.5">
                <span className="font-medium text-white">Laik Higiene</span>
                <span className="font-mono text-[9px] text-emerald-300">Dinkes Gol. B</span>
              </div>
            </div>
          </div>

          {/* Navigasi Operasional */}
          <nav className="p-3.5 space-y-5 flex-1">
            {navigationItems.map((group) => (
              <div key={group.group} className="space-y-1">
                <h3 className="px-2 text-[10px] font-semibold text-[#D7DBD6]/60 tracking-wider uppercase">
                  {group.group}
                </h3>
                <div className="space-y-0.5 mt-1.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={onCloseMobile}
                        className={`group flex items-center justify-between px-2.5 py-2 rounded-md text-[13px] font-medium transition-all ${
                          isActive
                            ? "bg-[#2D5A3E] text-white shadow-xs border-l-3 border-[#D4AF37]"
                            : "text-[#D7DBD6] hover:bg-[#2D5A3E]/60 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`transition-colors ${
                              isActive ? "text-[#D4AF37]" : "text-[#D7DBD6]/70 group-hover:text-white"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded tracking-wide shrink-0 ${
                              item.isHighlight
                                ? "bg-[#D4AF37] text-[#191C19]"
                                : isActive
                                ? "bg-white/20 text-white"
                                : "bg-[#2D5A3E] text-[#D7DBD6]"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section: Telemetri IoT & Food Safety Live Monitor */}
        <div className="p-3.5 border-t border-[#2D5A3E] bg-[#16382a]/90 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-wider text-[#D4AF37] uppercase">
              Telemetri IoT Dapur
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            {/* Cold Chain Sensor */}
            <div className="bg-[#16382a]/80 p-2 rounded-md flex flex-col">
              <span className="text-[9px] text-[#D7DBD6]/70 uppercase">Cold Chain</span>
              <span className="text-[#0284C7] font-semibold">2.4°C Chilled</span>
            </div>
            {/* Bain Marie Holding */}
            <div className="bg-[#16382a]/80 p-2 rounded-md flex flex-col">
              <span className="text-[9px] text-[#D7DBD6]/70 uppercase">Bain-Marie</span>
              <span className="text-[#D97706] font-semibold">68.2°C Hot</span>
            </div>
          </div>

          {/* Central Buffer Status */}
          <div className="bg-[#16382a]/80 p-2 rounded-md flex items-center justify-between text-[11px]">
            <div className="flex flex-col">
              <span className="text-[9px] text-[#D7DBD6]/70">Buffer Boiler Aktif</span>
              <span className="text-[#16A34A] font-semibold font-mono">850 Porsi Ready</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-[#D7DBD6]/70">Lead Time</span>
              <span className="text-white font-mono font-medium block">45 Menit</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

