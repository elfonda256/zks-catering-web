/**
 * Enterprise Design System (EDS) — Design Tokens
 * Anti AI Slop Edition | ZKS Catering ERP
 * 
 * Strict specifications:
 * - 8pt Spacing Grid (8, 16, 24, 32, 48, 64)
 * - Typography scale (Display 32px, Page Title 24px, Section Title 20px, Card Title 16px, Body 14px, Caption 12px)
 * - Single Border Radius (12px)
 * - Subtle Elevation (Level 0 and Level 1 border-first)
 * - Color System (White, Light Gray, Dark Gray, Primary Blue, Semantic Green/Orange/Red)
 */

export const edsTokens = {
  typography: {
    display: "text-[32px] leading-[40px] font-bold tracking-tight text-slate-900",
    pageTitle: "text-[24px] leading-[32px] font-semibold tracking-tight text-slate-900",
    sectionTitle: "text-[20px] leading-[28px] font-semibold tracking-tight text-slate-900",
    cardTitle: "text-[16px] leading-[24px] font-medium text-slate-900",
    body: "text-[14px] leading-[22px] font-normal text-slate-700",
    bodyMuted: "text-[14px] leading-[22px] font-normal text-slate-500",
    caption: "text-[12px] leading-[18px] font-normal text-slate-500",
    captionMono: "font-mono text-[12px] leading-[18px] tracking-wide text-slate-600",
    tableHeader: "text-[12px] leading-[16px] font-semibold uppercase tracking-wider text-slate-600",
  },
  spacing: {
    xs: "8px",   // 1 unit
    sm: "16px",  // 2 units
    md: "24px",  // 3 units
    lg: "32px",  // 4 units
    xl: "48px",  // 6 units
    xxl: "64px", // 8 units
  },
  radius: {
    default: "rounded-[12px]", // 12px single border radius
    inner: "rounded-[8px]",
    badge: "rounded-[6px]",
    full: "rounded-full",
  },
  shadows: {
    level0: "border border-slate-200",
    level1: "border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
    level2: "border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
  },
  colors: {
    background: "#FFFFFF",
    secondaryBg: "#F8FAFC", // slate-50
    surface: "#FFFFFF",
    textPrimary: "#0F172A", // slate-900
    textSecondary: "#475569", // slate-600
    textMuted: "#64748B", // slate-500
    border: "#E2E8F0", // slate-200
    borderSubtle: "#F1F5F9", // slate-100
    primary: {
      DEFAULT: "#2563EB", // blue-600
      hover: "#1D4ED8", // blue-700
      light: "#EFF6FF", // blue-50
      text: "#1D4ED8",
    },
    semantic: {
      success: {
        bg: "#F0FDF4", // emerald-50
        border: "#BBF7D0", // emerald-200
        text: "#15803D", // emerald-700
        dot: "#16A34A",
      },
      warning: {
        bg: "#FFFBEB", // amber-50
        border: "#FDE68A", // amber-200
        text: "#B45309", // amber-700
        dot: "#D97706",
      },
      danger: {
        bg: "#FEF2F2", // red-50
        border: "#FECACA", // red-200
        text: "#B91C1C", // red-700
        dot: "#DC2626",
      },
      neutral: {
        bg: "#F1F5F9", // slate-100
        border: "#E2E8F0", // slate-200
        text: "#475569", // slate-600
        dot: "#64748B",
      },
      info: {
        bg: "#EFF6FF", // blue-50
        border: "#BFDBFE", // blue-200
        text: "#1D4ED8", // blue-700
        dot: "#2563EB",
      },
    },
  },
} as const;
