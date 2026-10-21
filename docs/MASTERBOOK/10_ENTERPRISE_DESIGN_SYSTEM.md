# CHAPTER 10 — ENTERPRISE DESIGN SYSTEM (EDS)
## Anti AI Slop Edition | ZKS Catering ERP

**Company**: PT. Zahdan Kamal Sentosa  
**Document Class**: Enterprise Design System Specification & Token Standards  
**Scope**: All Admin, Operations, Inventory, Procurement, and Executive Modules  

---

## 1. EXECUTIVE DESIGN PHILOSOPHY

This ERP is an enterprise operational platform designed for teams working **8–10 hours daily**. It is built on strict utility and clarity:
* **Less decoration. More information.**
* **Less cards. More hierarchy.**
* **Less colors. More clarity.**
* **Less effects. More usability.**

### Inspired by World-Class Enterprise Engineering:
- **Apple-quality spacing**: Predictable, mathematical layout rhythm.
- **Linear hierarchy**: Primary focal points dominate; secondary elements recede.
- **Stripe analytics**: Ultra-crisp data visualization and clear tabular metrics.
- **SAP Fiori workflow**: Surgical status lifecycles and approval triggers.
- **Microsoft 365 Admin**: Clean, non-distracting neutral surfaces.
- **Odoo Enterprise navigation**: Permanent, grouped, collapsible module sidebar.

### Anti AI Slop Rules (Permanent Invariants):
1. **Never create dashboards full of identical cards**: Every metric block must reflect its relative importance. 1 Primary KPI with strong visual weight + 3–4 Secondary KPIs.
2. **Never overuse gradients**: Clean, solid backgrounds only.
3. **Never overuse shadows**: Maximum 2 subtle elevation levels; border-first definition.
4. **Never overuse decorative icons**: Icons are reserved for functional visual affordances.
5. **Never use giant illustrations**: Professional empty states with concise operational guidance.
6. **Never waste vertical space**: Tables are first-class citizens with sticky headers.
7. **Never create decorative charts**: Every chart must answer an immediate business question.

---

## 2. TYPOGRAPHY SYSTEM

One standardized scale across all screens and components:

| Level | Size | Weight | Line Height | Usage |
| :--- | :---: | :---: | :---: | :--- |
| **Display** | `32px` | `700` (Bold) | `40px` | Primary KPI Hero Metrics |
| **Page Title** | `24px` | `600` (SemiBold) | `32px` | Screen Headings (`h1`) |
| **Section Title** | `20px` | `600` (SemiBold) | `28px` | Group / Stage Titles (`h2`) |
| **Card Title** | `16px` | `500` (Medium) | `24px` | Table / Box Titles (`h3`) |
| **Body** | `14px` | `400` / `500` | `22px` | Data Rows, Descriptions, Inputs |
| **Caption** | `12px` | `400` / `500` | `18px` | Subtitles, Metadata, Table Headers |

---

## 3. SPACING SYSTEM (8pt Grid)

All layout paddings, gaps, and margins strictly adhere to multiples of 8:
* `8px` (`gap-2`, `p-2`, `space-y-2`) — Compact element spacing
* `16px` (`gap-4`, `p-4`, `space-y-4`) — Card inner padding, form fields
* `24px` (`gap-6`, `p-6`, `space-y-6`) — Card-to-card gaps, major sections
* `32px` (`gap-8`, `p-8`, `space-y-8`) — Section dividers
* `48px` (`gap-12`, `p-12`) — Page section pacing
* `64px` (`gap-16`, `p-16`) — Canvas outer margins

---

## 4. BORDER RADIUS & ELEVATION

* **One Radius Only**: `12px` (`rounded-[12px]`) across all cards, modals, tables, inputs, and buttons.
* **Subtle Elevation Levels**:
  * **Level 0 (Flat)**: `border border-slate-200`
  * **Level 1 (Cards & Tables)**: `border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]`
  * **Level 2 (Modals & Menus)**: `border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)]`

---

## 5. STANDARDIZED COLOR SYSTEM

* **Canvas Background**: White (`#FFFFFF`)
* **Secondary Background**: Slate 50 (`#F8FAFC`)
* **Text Primary**: Slate 900 (`#0F172A`)
* **Text Secondary**: Slate 600 (`#475569`)
* **Borders**: Slate 200 (`#E2E8F0`)
* **Primary Brand**: Blue 600 (`#2563EB`) — hover `#1D4ED8`
* **Semantic Colors**:
  * **Success**: Green / Emerald (`#16A34A` / bg `#F0FDF4`, border `#BBF7D0`)
  * **Warning**: Orange / Amber (`#D97706` / bg `#FFFBEB`, border `#FDE68A`)
  * **Danger**: Red (`#DC2626` / bg `#FEF2F2`, border `#FECACA`)
  * **Info**: Blue (`#2563EB` / bg `#EFF6FF`, border `#BFDBFE`)

---

## 6. STANDARDIZED STATUS BADGES

All modules use the canonical `Badge` component with 13 standard operational states:
1. `draft`: Gray (`bg-slate-100 text-slate-700 border-slate-200`)
2. `pending`: Amber (`bg-amber-50 text-amber-800 border-amber-200`)
3. `approved`: Blue (`bg-blue-50 text-blue-800 border-blue-200`)
4. `rejected`: Red (`bg-red-50 text-red-800 border-red-200`)
5. `completed`: Emerald (`bg-emerald-50 text-emerald-800 border-emerald-200`)
6. `cancelled`: Red (`bg-red-50 text-red-800 border-red-200`)
7. `processing`: Sky (`bg-sky-50 text-sky-800 border-sky-200`)
8. `low_stock`: Amber (`bg-amber-50 text-amber-800 border-amber-200`)
9. `critical`: Red (`bg-red-50 text-red-800 border-red-200`)
10. `expired`: Rose (`bg-rose-50 text-rose-800 border-rose-200`)
11. `reserved`: Indigo (`bg-indigo-50 text-indigo-800 border-indigo-200`)
12. `consumed`: Slate (`bg-slate-100 text-slate-600 border-slate-200`)
13. `delivered`: Teal (`bg-teal-50 text-teal-800 border-teal-200`)

---

## 7. BUTTON & FORM SYSTEM

### Button System:
- **Variants**: `Primary` (Blue-600), `Secondary` (White/Slate-200), `Ghost` (Transparent hover), `Danger` (Red-50), `Icon Button` (Square).
- **Sizes**: `sm` (32px), `md` (36px), `lg` (44px).
- **Behavior**: Cursor pointer, focus-visible ring, disabled opacity, loading indicator with inline spin.

### Form System:
- **Always Visible Labels**: With required asterisks (`*`) in red.
- **Grouped Sections**: Clear informational grouping with section subtitles.
- **Grid Layout**: 2-column on desktop (`md:grid-cols-2`), 1-column on mobile.
- **Validation**: Readable red helper errors (`text-[12px] text-red-600`) and subtle gray helper captions.

---

## 8. SEARCH & FILTER BAR

### Reusable Search (`SearchInput`):
- Standalone search field with search icon prefix, clear button (`✕`), and keyboard shortcut indicator (`/` or `⌘K`).
- 12px uniform radius, focus ring, zero gradients.

### Filter Bar (`FilterBar`):
- Canonical ordering: `Search` → `Date` → `Status` → `Category` → `Reset`.
- Clean reset button visible only when active filters exist.

---

## 9. PURPOSEFUL OPERATIONAL CHARTS

Every chart must answer an immediate business question:
- **Preferred**: Line Chart, Area Chart, Bar Chart, Stacked Bar, Progress / Capacity Chart.
- **Forbidden**: 3D Charts, decorative non-actionable charts, unlabelled pie charts.
- **Example in Production**:
  - Daily Order Fulfillment Rate (Capacity vs Consumed)
  - Stock Velocity & Movement Rhythm

---

## 10. LOADING, EMPTY & ERROR STATES

- **Loading State**: Skeleton loading screens (`Skeleton`, `TableLoadingRow`), avoiding unconstrained spinners.
- **Empty State**: Three mandatory items:
  1. What this module does (`moduleExplanation`)
  2. How to start (`description`)
  3. Primary CTA button (`action`)
- **Error State**: Actionable, calm error messaging with retry trigger.

---

## 7. ENTERPRISE SHELL ARCHITECTURE

Every admin module renders inside `@/shared/components/layout/EnterpriseShell`:
* **Permanent Collapsible Sidebar**:
  * Group 1: **Ikhtisar** (Dashboard Pesanan `/admin/dashboard`)
  * Group 2: **Inventaris & Gudang** (Command Center, Master Items, Ledger, Opname, Transfers, Receiving & QC)
  * Group 3: **Pengadaan & SRM** (Purchase Requests, Purchase Orders, Supplier Management)
  * Group 4: **Operasional Roadmap** (Produksi Dapur, Distribusi & Armada, Keuangan)
* **Minimal Header**:
  * Company Switcher with live connection status
  * Global Search Input with `⌘K` keyboard shortcut
  * Operator profile badge & Role indication
  * Quick logout action

---

## 8. CODEBASE COMPLIANCE CHECKLIST

Before deploying any future module:
- [x] Does the page use `EnterpriseShell`?
- [x] Are headings strictly `24px` for Page Title and `20px` for Sections?
- [x] Are all radiuses strictly `12px` (`rounded-[12px]`)?
- [x] Does the KPI section feature 1 Primary KPI and no more than 4 Secondary KPIs?
- [x] Do all tables feature sticky headers, clean row hovers, and tabular numbers?
- [x] Are status badges using the canonical semantic variants?
- [x] Zero random colors, gradients, or floating drop-shadows.
