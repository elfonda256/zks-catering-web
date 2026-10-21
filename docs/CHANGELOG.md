# CHANGELOG

All notable changes to the Zahdan Kamal Sentosa Enterprise ERP project are documented in this file.

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
