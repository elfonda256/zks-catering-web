/**
 * Enterprise Design System (EDS) — Design Tokens v1.2
 * Anti AI Slop Edition | ZKS Catering ERP
 * Sprint 10.6A Enterprise Premium UI/UX Foundation
 * 
 * Strict specifications:
 * - Typography scale: Display XL (36px), Display L (28px), Page Title (24px), Section Title (20px), Card Title (16px), Body (14px), Caption (12px), Micro (10px)
 * - Tabular numbers for all numeric/metric/financial displays
 * - Spacing Grid: strictly 4, 8, 12, 16, 24, 32, 40, 48, 64px
 * - Color System: 95% Monochrome (White, Slate 50-900), 5% Semantic Accent (Primary, Success, Warning, Danger)
 * - Motion Tokens: 150ms-250ms smooth ease-out curves
 * - Single Uniform Border Radius: 12px
 * - Elevation: Border-first (Level 0 flat, Level 1 ultralight shadow, Level 2 dialog overlay)
 */

export const edsTokens = {
  typography: {
    // Sprint 01: Standardized Single Font Family Hierarchy
    display: "text-[36px] leading-[44px] font-bold tracking-tight text-slate-900 font-sans",
    h1: "text-[28px] leading-[36px] font-semibold tracking-tight text-slate-900 font-sans",
    h2: "text-[22px] leading-[28px] font-semibold tracking-tight text-slate-900 font-sans",
    h3: "text-[18px] leading-[24px] font-semibold tracking-tight text-slate-900 font-sans",
    bodyLarge: "text-[16px] leading-[24px] font-normal text-slate-800 font-sans",
    body: "text-[14px] leading-[20px] font-normal text-slate-700 font-sans",
    caption: "text-[12px] leading-[16px] font-normal text-slate-500 font-sans",
    label: "text-[11px] leading-[14px] font-semibold uppercase tracking-wider text-slate-500 font-sans",
    tabularNumbers: "font-mono tabular-nums",

    // Backward-compatible semantic aliases
    displayXl: "text-[36px] leading-[44px] font-bold tracking-tight text-slate-900 font-sans tabular-nums",
    displayL: "text-[28px] leading-[36px] font-bold tracking-tight text-slate-900 font-sans tabular-nums",
    pageTitle: "text-[24px] leading-[32px] font-semibold tracking-tight text-slate-900 font-sans",
    sectionTitle: "text-[20px] leading-[28px] font-semibold tracking-tight text-slate-900 font-sans",
    cardTitle: "text-[16px] leading-[24px] font-medium text-slate-900 font-sans",
    bodyMuted: "text-[14px] leading-[20px] font-normal text-slate-500 font-sans",
    bodyMedium: "text-[14px] leading-[20px] font-medium text-slate-800 font-sans",
    captionMono: "font-mono text-[12px] leading-[16px] tracking-wide text-slate-600 tabular-nums",
    micro: "text-[10px] leading-[14px] font-semibold uppercase tracking-wider text-slate-500 font-sans",
    tableHeader: "text-[11px] leading-[16px] font-semibold uppercase tracking-wider text-slate-500 font-sans",
  },
  spacing: {
    // 8pt Grid Values
    4: "4px",    // 0.5 unit (micro gaps, badge padding)
    8: "8px",    // 1 unit (compact buttons, inline items)
    12: "12px",  // 1.5 units (input padding, table cell vertical)
    16: "16px",  // 2 units (card internal padding, form fields)
    24: "24px",  // 3 units (component gaps, card-to-card)
    32: "32px",  // 4 units (section spacing, page headers)
    40: "40px",  // 5 units (intermediate section breaks)
    48: "48px",  // 6 units (major view pacing)
    64: "64px",  // 8 units (canvas outer margins)
  },
  radius: {
    // Standardized Global Radius
    global: "rounded-[8px]",    // 8px global element radius (Button, Input, Select, Badge)
    element: "rounded-[8px]",   // 8px controls
    container: "rounded-[12px]",// 12px containers (Card, Modal, Table)
    default: "rounded-[12px]",  // 12px uniform
    inner: "rounded-[8px]",     // 8px inside cards/buttons
    badge: "rounded-[6px]",     // 6px for compact status badges
    full: "rounded-full",
  },
  shadows: {
    // 3-Level Border-First Elevation
    level0: "border border-slate-200/80 shadow-none",
    level1: "border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
    level2: "border border-slate-200/90 shadow-md",
  },
  motion: {
    fast: "150ms cubic-bezier(0.16, 1, 0.3, 1)",
    base: "200ms cubic-bezier(0.16, 1, 0.3, 1)",
    slow: "250ms cubic-bezier(0.16, 1, 0.3, 1)",
    hoverTransition: "transition-colors duration-150 ease-out",
    cardTransition: "transition-all duration-200 ease-out",
    collapseTransition: "transition-[width,transform,opacity] duration-200 ease-in-out",
  },
  colors: {
    // Enterprise Color Palette: Primary (Slate 900), Neutral (Slate 50-900), Semantic
    primary: {
      DEFAULT: "#0F172A", // Slate 900
      hover: "#1E293B",   // Slate 800
      light: "#F8FAFC",   // Slate 50
      text: "#FFFFFF",
      border: "#334155",  // Slate 700
    },
    neutral: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
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
        bg: "#F0F9FF", // sky-50
        border: "#BAE6FD", // sky-200
        text: "#0369A1", // sky-700
        dot: "#0284C7",
      },
    },
  },
} as const;
