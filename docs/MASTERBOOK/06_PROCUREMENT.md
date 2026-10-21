# CHAPTER 06 — PROCUREMENT SPECIFICATION

## Domain Overview
The Procurement module orchestrates purchase requests, supplier negotiations, and official purchase orders to maintain uninterrupted central kitchen production while minimizing food waste.

## Core Sub-features

1. **Purchase Request (PR) Workspace (`/admin/purchase-requests`)**:
   - Automated PR generation triggered by low-stock par levels or scheduled large event reservations.
   - Multi-department requests (Kitchen, Warehouse, Logistics).
   - Multi-tier approval routing (Supervisor → Operational Manager → General Manager).
2. **Purchase Order (PO) Management (`/admin/purchase-orders`)**:
   - Conversion from approved PRs to formal supplier POs.
   - Lifecycle tracking: Draft → Waiting Approval → Issued / Sent → In Delivery → Received → Completed / Cancelled.
   - Payment terms, tax computation (PPN 11%), line items with unit prices and specs.
   - Direct supplier PDF dispatch and status acknowledgement.

## Domain Boundary & Contracts
- **Exports**:
  - `PurchaseOrderService.getOpenOrdersBySupplier(supplierId)`
  - `PurchaseRequestService.getPendingRequests()`
- **Dependencies**:
  - Consumes inventory levels from Inventory Service for low-stock triggers.
  - Feeds expected deliveries into Warehouse Goods Receiving contracts.
