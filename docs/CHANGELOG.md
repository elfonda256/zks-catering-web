# CHANGELOG

All notable changes to the Zahdan Kamal Sentosa Enterprise ERP project are documented in this file.

## [Sprint 02.1] - 2026-10-22
### Enterprise Navigation & Information Architecture
- **Sidebar Information Architecture Refactor**: Grouped modules into a clear enterprise hierarchy communicating true system architecture: Dashboard → Sales (Orders) → Procurement (PR, PO, Supplier) → Inventory (Command Center, Master Items, Receiving, Transfers, Stock Movement, Stock Opname) → Production → Kitchen → Delivery → Finance → Reports → Settings. Added crisp enterprise icons for every module.
- **Hierarchical Breadcrumb Navigation**: Upgraded `ErpBreadcrumb.tsx` to strictly generate `Home → Module → Sub-module → Detail` paths with clear parent linking and active state semantics.
- **Standardized Top-Right Action Area**: Refactored `ErpPageTemplate.tsx` to standardize action area positioning across all pages (Search → Export → Secondary Button → Primary Button), ensuring identical layout rhythm and eliminating ad-hoc button positioning.
- **Enhanced Enterprise Empty State**: Replaced bare empty pages with a structured 4-part `EmptyState` component explicitly conveying: Module Category & Identity (What), Purpose Statement (Why), 3-step getting started guide (How to start), and Primary/Secondary CTAs.
- **Dashboard Information Hierarchy Optimization**: Reorganized `AdminDashboardView.tsx` into a strict vertical sequence: Hero KPI (Bukti Bayar Masuk with executive dark dominance) → Operational Alerts Banner (direct action buttons to resolve urgent items) → Capacity & Fulfillment Charts → Today's Orders (Queue tabs with Slate-900 active state, Search, Cards/Table, and structured EmptyState) → Recent Activity Audit Timeline → Quick Actions Shortcuts Grid.
- **Standardized Vendor Classification**: Replaced confusing probationary labels with 6 enterprise vendor classifications: Preferred Partner, Approved Vendor, Pending Verification, Contract Renewal, Inactive, and Blacklisted across types, constants, directory tables, and badge helpers.
- **Global Action Button Consistency**: Converted all hardcoded primary action buttons across all admin views (`supplier`, `purchase-requests`, `purchase-orders`, `inventory`, `items`, `receiving`, `transfers`, `movements`, `opname`) to the unified executive `bg-slate-900 hover:bg-slate-800` design token.
- **Zero Business Logic & Schema Breakage**: 100% preservation of database schema, NextAuth configuration, and backend API routes.

## [Sprint 01] - 2026-10-22
### Enterprise UI Foundation (Design System Refactor — Public Website + ERP Admin)
- **Single Font Family Standard**: Standardized typography to SATU keluarga font (`Inter`) across both the Public Website and ERP Admin in `src/app/layout.tsx` and `src/app/globals.css`. Removed mixed font families (Manrope/Inter pairing) to achieve an Apple, Linear, Stripe, and Vercel-grade visual language.
- **Unified Typography Hierarchy**: Formulated consistent 8-tier typographic tokens in `edsTokens.typography`: Display (36px/44px), H1 (28px/36px), H2 (22px/28px), H3 (18px/24px), Body Large (16px/24px), Body (14px/20px), Caption (12px/16px), Label (11px/14px), and `tabularNumbers` (`font-mono tabular-nums`). Enforced tabular numbers for all metrics, SKU codes, and monetary figures.
- **Enterprise Color System**: Refactored palette to high-contrast Primary (Slate 900), Neutral ramp (Slate 50–900), and functional semantic colors (Emerald for Success, Amber for Warning, Rose for Danger, Sky for Info). Eliminated all purposeless decorative gradients and visual clutter.
- **8pt Grid Spacing Standard**: Enforced spacing tokens strictly to 4, 8, 12, 16, 24, 32, 40, 48, 64px across cards, inputs, navigation, and section pacing.
- **Standardized Border Radius**: Implemented single global radius rules: 8px (`rounded-lg`) for controls/buttons/inputs/badges, and 12px (`rounded-xl`) for cards/tables/modals/panels.
- **3-Level Elevation Shadow System**: Reduced elevation to Level 0 (None / Hairline border), Level 1 (Subtle `shadow-[0_1px_2px_rgba(0,0,0,0.04)]`), and Level 2 (Overlay `shadow-md`), establishing border hairlines as the primary visual divider.
- **Component Consistency Audit**: Audited and aligned all 11 core UI components: `Button`, `Card`, `Table`, `Badge`, `Input`, `Select`, `Modal`, `Tabs`, `Pagination`, `EmptyState`, and `LoadingState` to exact tokens.
- **Canonical Information Hierarchy**: Standardized all ERP views to follow the canonical sequence: Title → Description → Action → KPI → Chart → Filter → Table → Timeline.
- **Dummy Data Capped at ≤5 Items**: Verified and enforced strict item caps across all datasets: 5 Suppliers, 5 Inventory Items, 3 Purchase Requests, 3 Purchase Orders, 5 Stock Movements, 4 Receiving records, 5 Transfers, and 5 Notifications.
- **Zero Business Logic & Schema Changes**: 100% preservation of database schemas, Prisma models, NextAuth security, API routes, and operational business workflows.

## [Sprint 10.6A] - 2026-10-22
### Enterprise Premium UI/UX Foundation (Ergonomics & Anti-Slop Enforcement)
- **Enterprise Typography Tokens**: Refactored `edsTokens.typography` to define strict 8-level scale: Display XL (36px), Display L (28px), Page Title (24px), Section Title (20px), Card Title (16px), Body (14px), Caption (12px), Micro (10px). All metric and currency displays enforced to `font-mono tabular-nums`.
- **8pt Grid Spacing Standard**: Enforced spacing tokens strictly to 4, 8, 12, 16, 24, 32, 40, 48, 64px, eliminating all arbitrary paddings and margins.
- **95% Monochrome Palette**: Standardized canvas surfaces to white/slate-50 with Slate-200 hairline borders and 5% semantic accents only (Blue for Primary, Emerald for Success, Amber for Warning, Red for Danger).
- **Enterprise Chart Design System**: Built `EnterpriseChart.tsx` featuring `EnterpriseBarChart` (thin grid lines, thin axes, 4px rounded bar tops, interactive floating tooltips) and `EnterpriseProgressMetric` (capacity indicators with calm status transitions).
- **Motion Design System (150-250ms)**: Added micro-interactions across sidebar collapse/expand, card hover (`hover:border-slate-300`), table row hover (`bg-slate-50/70`), and button active scale.
- **Card System Refactor**: Enhanced `Card.tsx` with padding options (`compact` 16px, `default` 24px, `spacious` 32px), hairline border, and Level 1 border-first shadow.
- **Table Experience & Tabular Figures**: Enhanced `Pagination.tsx` and `Table.tsx` with `tabular-nums` alignment, sticky headers, and consistent sorting affordances.
- **Sidebar Refinement**: Added 18x18px uniform SVG icons with `strokeWidth 1.75` across all 10 module groups and items in `ErpSidebar.tsx`, with crisp active indicator and memory persistence.
- **Mock Data Cleanup**: Capped excessive dummy data across all views to maximum 5 items (Max 5 KPI, Max 5 Notifications, Max 5 Activities, Max 5 Suppliers, Max 5 POs, Max 5 PRs, Max 5 Inventory Items, Max 5 Stock Movements, Max 5 Transfers).
- **Business Terminology Matrix**: Authored comprehensive glossary in Chapter 12 recommending catering-domain status transitions (`Approved Vendor`, `Preferred Partner Tier-1`, `Trial Period`, `Under Audit`, `Suspended Safety Hold`, `QC Hold`, `Allocated Committed`).
- **Masterbook Chapter 12**: Created `12_ENTERPRISE_PREMIUM_DESIGN_LANGUAGE.md` as the definitive visual ergonomics and enterprise UI/UX specification.

## [Sprint 10.5] - 2026-10-22
### ERP Shell & Navigation Framework (Enterprise Workspace Architecture)
- **Permanent Application Shell**: Built `src/shared/components/layout/shell/ErpShell.tsx` and updated `EnterpriseShell.tsx` to provide a persistent, unified workspace across all modules without page reloads or layout jumping.
- **Persistent Collapsible Sidebar**: Implemented `src/shared/components/layout/sidebar/ErpSidebar.tsx` with `localStorage` memory via React 19 `useSyncExternalStore` (`usePersistentBoolean` & `usePersistentRecord`), collapsible section accordions, active route highlighting, and role-based access filtering.
- **Definitive Module Tree**: Authored `src/shared/components/layout/sidebar/sidebar-config.ts` mapping all 10 core sections (Dashboard, Inventory, Procurement, Production, Kitchen, Delivery, Finance, Reports, Administration, Settings).
- **Minimal Enterprise Header**: Implemented `src/shared/components/layout/header/ErpHeader.tsx` featuring `CompanyBranchSwitch` (PT. Zahdan Kamal Sentosa · Karawang HQ / Satellites), `UserProfileMenu` (user initials, role, branch, session logout), `DarkModeToggle` (prepared), and `⌘K` global search trigger.
- **Automatic Enterprise Breadcrumbs**: Implemented `src/shared/components/layout/breadcrumb/ErpBreadcrumb.tsx` automatically extracting and rendering route hierarchies (e.g. `Dashboard › Inventory › Receiving`).
- **Standardized Page Template**: Implemented `src/shared/components/layout/template/ErpPageTemplate.tsx` enforcing EDS visual hierarchy (Breadcrumbs → Header → Actions → Filters → Primary KPI → Content/Table → Side Panel).
- **Global Search ⌘K System**: Implemented `src/shared/components/layout/navigation/ErpGlobalSearch.tsx` modal with category filtering and keyboard arrow navigation across Master Items, Suppliers, POs, PRs, and Orders.
- **Operational Notification Center**: Implemented `src/shared/components/layout/navigation/ErpNotificationCenter.tsx` popover showing real-time industrial catering alerts (PO Approved, Low Stock, QC Failed, Delivery Delayed, Recipe Updated, System Maintenance).
- **Enterprise Status Bar**: Added `src/shared/components/layout/shell/ErpStatusBar.tsx` showing database health, branch connection, active role, and keyboard shortcut legends.
- **All 11 Admin Pages Migrated**: Converted `/admin/dashboard`, `/admin/inventory`, `/admin/inventory/items`, `/admin/inventory/items/[id]`, `/admin/inventory/movements`, `/admin/inventory/opname`, `/admin/inventory/transfers`, `/admin/inventory/receiving`, `/admin/purchase-requests`, `/admin/purchase-orders`, and `/admin/supplier` to use `ErpPageTemplate`.
- **Zero Breakage Guarantee**: 100% of routes, database schemas, actions, Supabase, and Fonnte integrations remain completely intact and unchanged.

## [Sprint 10.4] - 2026-10-22
### Enterprise Design System (EDS) — Anti AI Slop Edition
- **Core Design System**: Authored Chapter 10 `10_ENTERPRISE_DESIGN_SYSTEM.md` and design tokens `src/shared/styles/eds-tokens.ts`.
- **Permanent Enterprise Shell**: Created `@/shared/components/layout/EnterpriseShell.tsx` featuring permanent collapsible sidebar, grouped modules (Overview, Inventory, Procurement, Operations Roadmap, System), and minimal header with global quick search (`⌘K`), company switcher, and user session menu.
- **Strict 8pt Grid & 12px Radius**: Enforced uniform 8, 16, 24, 32, 48, 64 spacing rhythm and single 12px border radius across all cards, modals, tables, and inputs.
- **Anti AI Slop Foundation**: Removed generic identical card arrays in favor of hierarchical KPI cards (1 Primary KPI + 3-4 Secondary KPIs).
- **Canonical UI Primitives Refactor**: Upgraded `Button`, `Card`, `Badge`, `Table`, `Input`, `Select`, `Pagination`, `Tabs`, `EmptyState`, `LoadingState` (with Skeletons), and `KpiCard` to EDS specifications.
- **Admin Pages Refactored**: Refactored `/admin/dashboard`, `/admin/inventory`, `/admin/inventory/items`, `/admin/inventory/items/[id]`, `/admin/inventory/movements`, `/admin/inventory/opname`, `/admin/inventory/transfers`, `/admin/inventory/receiving`, `/admin/purchase-requests`, `/admin/purchase-orders`, and `/admin/supplier` to render seamlessly inside the new Enterprise Design System.
- **Zero Breakage Guarantee**: Kept 100% of all database schemas, routes, actions, Supabase integration, and Fonnte integration completely unchanged.

## [Phase 00.5] - 2026-10-21
### Business Flow Masterbook (Enterprise ERP Business Architecture)
- **SSOT Foundation**: Authored Chapter 09 `09_BUSINESS_FLOW_MASTERBOOK.md` as the definitive enterprise business architecture and operational Single Source of Truth for ZKS catering ERP.
- **Part 01 - User Roles**: Formulated 16 distinct operational user roles across Executive, Commercial, Operations, Kitchen, Quality, Logistics, and Governance with responsibilities, allowed/restricted modules, daily activities, and measurable KPIs.
- **Part 02 - Role Permissions Matrix**: Built comprehensive RBAC matrix spanning 16 roles × 12 modules × 6 permission verbs (`View`, `Create`, `Edit`, `Approve`, `Delete`, `Export`).
- **Part 03 - End-to-End Business Flow**: Mapped complete 19-stage industrial catering workflow from Customer Order to Sales Validation, Production Planning, Recipe/BOM Explosion, Inventory Check, PR/PO, Supplier Receiving & QC, Kitchen Production, Packaging, Distribution, Delivery, Invoicing, and Auditing.
- **Part 04 - Approval Chains & Thresholds**: Defined multi-tier threshold approval chains for PR, PO, Stock Adjustments, Stock Opname, Transfers, Work Orders, and Credit Limits.
- **Part 05 - Finite State Machines**: Documented complete status lifecycles and transition rules for PR, PO, Inventory stock states, Receiving/QC, Work Orders, Delivery runs, and Sales Orders.
- **Part 06 - Module Dependencies & DAG**: Established modular contract interfaces and dependency rules with strict circular-dependency prevention.
- **Part 07 - Immutable Business Invariants**: Enforced 12 enterprise invariants including zero negative stock, strict FEFO allocation, CCP cold-chain compliance, three-way invoice matching, and tamper-evident logging.
- **Part 08 - AI Co-Pilot Opportunities**: Specified 8 high-ROI AI automation opportunities across demand forecasting, dynamic yield/scrap optimization, smart SRM, food waste reduction, and route logistics.
- **Part 09 - Root Cause Traceability (5W1H)**: Established 60-second backward lot traceability framework and universal tamper-evident audit log schema.

## [Sprint 10] - 2026-10-21
### Supplier Management (Enterprise SRM)
- **Domain Subsystem**: Built enterprise Supplier Relationship Management module (`src/modules/supplier/`).
- **Section 01 - Executive Summary**: 6 executive KPI cards (Total Suppliers, Active, Preferred, Under Review, Average Rating, Monthly Procurement Value).
- **Section 02 - Supplier Directory**: Searchable enterprise directory table with multi-parameter filtering (Company, Code, NPWP, PIC, Category, Status, Tier).
- **Section 03 - Supplier Profile**: Comprehensive digital entity dossier (legal credentials, tax status, bank accounts, delivery schedules, lead times).
- **Section 04 - Compliance Documents**: Certificate and document explorer (Halal BPJPH, ISO 22000, Business License, Food Safety, Contracts) with expiry alerts and interactive preview/download.
- **Section 05 - Performance Dashboard**: Key operational metrics (On-Time Delivery %, Order Fulfillment %, Quality Rating, Complaint Rate, Lead Time, Price Stability) with historical 6-month visual trend bars.
- **Section 06 - Purchase History**: Comprehensive table of historical POs issued to the supplier.
- **Section 07 - Communication Log**: Interactive audit trail and logging of calls, emails, factory inspection meetings, complaints, and CAPA actions.
- **Section 08 - Supplier Scorecard**: Weighted evaluation (Quality 30%, Delivery 25%, Price 20%, Service 15%, Compliance 10%) with tier badges (Gold, Silver, Bronze).
- **Section 09 - Risk Assessment**: 6-factor automated vulnerability matrix (Expired Docs, Late Deliveries, High Complaint Rate, Price Increase Risk, Inactivity, Single Source Risk) with operational mitigation advisories.
- **Section 10 - Actions & Modals**: Registrasi New Supplier, Edit Profile, Status toggle (Suspend / Approve), Create PO pre-filling vendor, and Print Dossier.
- **Routing**: Implemented `/admin/supplier` and `/admin/suppliers` with defense-in-depth admin session authentication.

## [Sprint 00] - 2026-10-21
### Foundation & Enterprise Architecture Refactor
- **Architecture**: Refactored project into domain-driven modular structure (`src/modules/*` and `src/shared/*`).
- **Documentation**: Renamed `DESIGN_BIBLE.md` to `DESIGN_MASTERBOOK.md` and added Chapter Engineering Rules.
- **Masterbook Suite**: Created `docs/MASTERBOOK/` chapters 00 through 08 and Architecture Decision Records (ADR-001 through ADR-003).
- **Shared UI Primitives**: Established canonical UI component system in `@/shared/components/ui/` (Button, Card, Table, Modal, Input, Select, Badge, Pagination, Tabs, Toast, EmptyState, LoadingState).
- **Engineering Governance**: Updated `AGENTS.md` with strict pre-creation checklists, module isolation doctrines, and post-implementation reporting rules.
- **Module Subsystems**: Established structured directories for `inventory`, `warehouse`, `procurement`, `supplier`, `production`, `kitchen`, `distribution`, `dashboard`, `reports`, and `settings`.
- **Zero Breakage**: Preserved 100% of existing application routing, layout integrity, and business logic without schema or visual regressions.

## [Sprint 09] - 2026-10-21
- Added Enterprise Purchase Order (PO) Management module (`/admin/purchase-orders`).

## [Sprint 08] - 2026-10-21
- Added Purchase Request (PR) & Smart Recommendation workspace (`/admin/purchase-requests`).

## [Sprint 07] - 2026-10-21
- Added Warehouse Transfer & Cold Chain Transit module (`/admin/inventory/transfers`).

## [Sprint 06] - 2026-10-21
- Added Physical Stock Opname & Variance Reconciliation module (`/admin/inventory/opname`).

## [Sprint 05] - 2026-10-21
- Added Stock Movement Ledger & Transaction Audit Trail (`/admin/inventory/movements`).

## [Sprint 04] - 2026-10-21
- Added Goods Receiving & Quality Inspection module (`/admin/inventory/receiving`).

## [Sprint 03] - 2026-10-21
- Added Enterprise Inventory Item Detail "Digital Passport" (`/admin/inventory/items/[id]`).

## [Sprint 02] - 2026-10-21
- Added Master Items Catalog & Par Stock Tracking (`/admin/inventory/items`).

## [Sprint 01] - 2026-10-21
- Added Inventory Command Center & Warehouse Utilization Dashboard (`/admin/inventory`).
