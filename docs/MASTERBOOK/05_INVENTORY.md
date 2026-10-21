# CHAPTER 05 — INVENTORY MANAGEMENT SPECIFICATION

## Domain Overview
The Inventory module provides complete real-time tracking, evaluation, and batch traceability of raw materials, semi-finished preparations, packaging, and non-perishable catering supplies.

## Core Sub-features

1. **Inventory Command Center (`/admin/inventory`)**:
   - High-level KPIs: Total SKU count, stock valuation (FIFO), critical low-stock count, expiring batches.
   - Warehouse capacity utilization breakdown.
   - Real-time stock alerts ledger.
2. **Master Items Catalog (`/admin/inventory/items`)**:
   - Searchable, filterable directory across Raw Material, Packaging, Seasoning, Semi-Finished.
   - Par stock thresholds, reorder points, standard lead times.
3. **Item Digital Passport (`/admin/inventory/items/[id]`)**:
   - Exhaustive item specification (nutritional profiles, storage temperatures, allergens).
   - Multi-location stock allocation breakdown.
   - Complete batch ledger and supplier audit history.
4. **Stock Movement Ledger (`/admin/inventory/movements`)**:
   - Immutable audit trail of every stock IN, OUT, TRANSFER, and ADJUSTMENT.
   - Exact timestamps, operator IDs, reference PO/SO numbers, and reasons.
5. **Stock Opname & Audit Reconciliation (`/admin/inventory/opname`)**:
   - Physical count sheets, variance calculation (System vs. Physical).
   - Approval workflows for variance reconciliation.

## Domain Boundary & Contracts
- **Exports**:
  - `ItemService.getItemById(id)`
  - `InventoryService.getStockLevels(itemIds)`
  - `MovementService.recordStockMovement(entry)`
- **Dependencies**:
  - Does not directly import Procurement or Production internals.
  - Consumes incoming shipment updates via shared Warehouse and Receiving contracts.
