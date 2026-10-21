# MASTERBOOK 11: ERP SHELL & NAVIGATION FRAMEWORK
## Enterprise Workspace Architecture — ZKS Catering ERP
**Sprint Reference**: Sprint 10.5  
**Version**: 2.5 (Enterprise Workspace Edition)  
**Status**: Implemented & Verified (Zero TS Errors, Zero ESLint Warnings)

---

### 1. Vision & Core Philosophy

The ZKS Catering ERP is transformed from isolated admin views into a single, permanent, unified enterprise application workspace. The operator stays immersed in one responsive, distraction-free environment designed for 8–10 hours of daily industrial catering management.

Key Operational Tenets:
- **Permanent Application Shell**: Every route automatically inherits the unified layout without page flashing or disconnected interfaces.
- **Root-Cause Friendly & Modular**: Strict separation of layout concerns into `sidebar/`, `header/`, `navigation/`, `breadcrumb/`, `template/`, and `shell/`.
- **Zero AI Slop**: Strict adherence to the 8pt grid, 12px uniform border radius, Level 1 border-first elevation, slate/blue enterprise color palette, and zero gratuitous gradients.
- **Safe State Persistence**: Uses React 19 `useSyncExternalStore` for SSR-safe `localStorage` synchronization without cascading renders or hydration flicker.

---

### 2. Architecture & Folder Organization

```text
src/shared/components/layout/
├── sidebar/
│   ├── types.ts                # TypeScript interfaces: ErpNavItem, ErpNavSection, ErpUserRole
│   ├── sidebar-config.ts       # Definitive module tree and role-based permissions
│   ├── ErpSidebar.tsx          # Collapsible, persistent sidebar with section accordions
│   └── index.ts
├── header/
│   ├── CompanyBranchSwitch.tsx # Multi-branch selection (Karawang HQ, KIIC Satellite, Surya Cipta)
│   ├── UserProfileMenu.tsx     # Current user info, role badge, public web link, logout
│   ├── DarkModeToggle.tsx      # Prepared theme toggle
│   ├── ErpHeader.tsx           # Minimal header: Search, Notifs, Company, Branch, User, Menu
│   └── index.ts
├── navigation/
│   ├── ErpGlobalSearch.tsx     # ⌘K global modal across Items, Suppliers, PO, PR, Orders
│   ├── ErpNotificationCenter.tsx # Operational alerts (PO Approved, Low Stock, QC Failed, etc.)
│   └── index.ts
├── breadcrumb/
│   ├── ErpBreadcrumb.tsx       # Automatic route-based breadcrumb (Dashboard > Inventory > Receiving)
│   └── index.ts
├── template/
│   ├── ErpPageTemplate.tsx     # Standardized layout: Breadcrumb → Header → Actions → Filters → KPI → Table
│   └── index.ts
├── shell/
│   ├── ErpShell.tsx            # Canonical persistent shell orchestrating layout & global shortcuts
│   ├── ErpStatusBar.tsx        # Bottom status bar: system health, DB status, keyboard hints
│   └── index.ts
├── EnterpriseShell.tsx         # Backward-compatible wrapper delegating to ErpShell
└── index.ts                    # Public re-export barrel
```

---

### 3. Module Navigation Tree (`sidebar-config.ts`)

| Section ID | Module Name | Route / Path | Allowed Roles | Default State |
| :--- | :--- | :--- | :--- | :--- |
| `dashboard` | Dashboard Pesanan | `/admin/dashboard` | All | Expanded |
| `inventory` | **Inventaris & Gudang** | | Warehouse, Purchasing, Admin | Expanded |
| | — Command Center Stok | `/admin/inventory` | | |
| | — Katalog Master Item | `/admin/inventory/items` | | |
| | — Penerimaan & QC (Receiving) | `/admin/inventory/receiving` | | |
| | — Ledger Mutasi Stok | `/admin/inventory/movements` | | |
| | — Transfer Antar Gudang | `/admin/inventory/transfers` | | |
| | — Stock Opname Fisik | `/admin/inventory/opname` | | |
| `procurement` | **Pengadaan & SRM** | | Purchasing, Finance, Admin | Expanded |
| | — Purchase Request (PR) | `/admin/purchase-requests` | | |
| | — Purchase Order (PO) | `/admin/purchase-orders` | | |
| | — Manajemen Supplier (SRM) | `/admin/supplier` | | |
| `production` | **Produksi Dapur (Roadmap)** | `#` | Kitchen, Admin | Collapsed |
| `kitchen` | **Dapur Sentral (Roadmap)** | `#` | Kitchen, Admin | Collapsed |
| `delivery` | **Distribusi & Armada (Roadmap)** | `#` | Delivery, Admin | Collapsed |
| `finance` | **Keuangan & Faktur (Roadmap)** | `#` | Finance, Admin | Collapsed |
| `reports` | **Laporan & Audit (Roadmap)** | `#` | Management, Auditor, Admin | Collapsed |
| `administration` | **Administrasi & Pengguna** | `#` | Admin, Superadmin | Collapsed |
| `settings` | **Pengaturan Perusahaan & Cabang** | `#` | Admin, Superadmin | Collapsed |

---

### 4. Interactive Components & Features

#### 4.1 Global Search (`ErpGlobalSearch.tsx`)
- **Activation**: Keyboard shortcut `⌘K` or `Ctrl+K` from any screen, or clicking search in the header.
- **Features**: Category filter chips (`Semua`, `Item`, `Supplier`, `PO`, `PR`, `Customer`, `Navigation`), keyboard `↑`/`↓` navigation, `Enter` to navigate directly, and `ESC` to close.
- **Pre-indexed Entities**: Master raw materials, certified suppliers, active POs, requisition requests, and catering booking events.

#### 4.2 Operational Notification Center (`ErpNotificationCenter.tsx`)
- **Activation**: Bell icon with dynamic pulse badge in the top header.
- **Alert Categories**:
  - `po_approved`: Purchase order approval confirmations.
  - `low_stock`: Materials below safety stock threshold requiring PR issuance.
  - `qc_failed`: Dock receiving rejections (temperature or visual quality deviations).
  - `delivery_delayed`: Traffic or dispatch logistics alerts for catering shifts.
  - `recipe_updated`: Master kitchen recipe formula revisions.
  - `system_maintenance`: Database synchronization and scheduled backups.
- **Controls**: "Tandai Semua Dibaca", "Semua" vs "Belum Dibaca" tabs, and direct module navigation links.

#### 4.3 Route-Based Enterprise Breadcrumbs (`ErpBreadcrumb.tsx`)
- Automatically analyzes `usePathname()` to generate hierarchical, clickable breadcrumbs conforming to enterprise standards:
  - Example: `Dashboard › Inventory › Receiving`
  - Example: `Dashboard › Procurement › Supplier`
- Leaf item styled in bold slate-900 with `aria-current="page"`. Ancestors are clickable links with smooth hover states.

#### 4.4 Standardized Page Template (`ErpPageTemplate.tsx`)
Enforces uniform hierarchy across all current and future modules:
1. `ErpBreadcrumb` (Automatic or custom)
2. `Page Header` (Category pill, 24px title, 14px description, top-right Primary Action button)
3. `Filters Slot` (Search inputs, status selectors, date ranges)
4. `Primary KPI Slot` (Hierarchical EDS cards)
5. `Charts Slot` (Actionable operational graphs)
6. `Main Table / Content Slot` (First-class enterprise table)
7. `Side Panel Slot` (Optional slide-over inspection drawer)

---

### 5. Migration Matrix of Admin Pages

All existing administrative modules have been refactored to use `ErpPageTemplate` inside `EnterpriseShell`:
1. [Admin Orders & Dispatch Console](file:///Users/mymac/Developer/zks-catering-web/src/app/admin/dashboard/page.tsx)
2. [Inventory Command Center](file:///Users/mymac/Developer/zks-catering-web/src/app/admin/inventory/page.tsx)
3. [Master Items Catalog](file:///Users/mymac/Developer/zks-catering-web/src/app/admin/inventory/items/page.tsx)
4. [Digital Passport Item & Batch](file:///Users/mymac/Developer/zks-catering-web/src/app/admin/inventory/items/%5Bid%5D/page.tsx)
5. [Stock Movements Ledger](file:///Users/mymac/Developer/zks-catering-web/src/app/admin/inventory/movements/page.tsx)
6. [Physical Stock Opname](file:///Users/mymac/Developer/zks-catering-web/src/app/admin/inventory/opname/page.tsx)
7. [Warehouse Transfers](file:///Users/mymac/Developer/zks-catering-web/src/app/admin/inventory/transfers/page.tsx)
8. [Goods Receiving & QC Dock](file:///Users/mymac/Developer/zks-catering-web/src/app/admin/inventory/receiving/page.tsx)
9. [Purchase Requests (PR)](file:///Users/mymac/Developer/zks-catering-web/src/app/admin/purchase-requests/page.tsx)
10. [Purchase Orders (PO)](file:///Users/mymac/Developer/zks-catering-web/src/app/admin/purchase-orders/page.tsx)
11. [Supplier Relationship Management (SRM)](file:///Users/mymac/Developer/zks-catering-web/src/app/admin/supplier/page.tsx)

---

### 6. Verification Status

- `tsc --noEmit`: **Exit code 0** (Zero type errors)
- `eslint .`: **Exit code 0** (Zero lint errors, zero warnings)
- **Supabase Integration**: Untouched & intact
- **Fonnte WA Integration**: Untouched & intact
- **Database Schema**: Zero changes
- **Existing Routes**: All existing URLs preserved 100%
