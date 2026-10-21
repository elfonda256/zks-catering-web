# ADR-003: State Management & Service Isolation

## Status
Accepted

## Date
2026-10-21

## Context
Enterprise ERP systems process high-frequency user actions (search filters, batch selections, modal forms, status transitions). Uncontrolled local state mixed with asynchronous mutations causes race conditions and UI synchronization errors.

## Decision
1. **Server vs. Client Boundary**:
   - Server components fetch initial data and validate permissions.
   - Client views receive data via props or use custom domain hooks (`useInventory`, `usePurchaseOrders`).
2. **Business Calculations in Pure Services**:
   - Total calculations, taxes, lead times, and status determinations are executed in pure functions inside `services/` and `utils/`, never inline in JSX render loops.
3. **Decoupled Cross-Module Communication**:
   - Domain modules must not share mutable global stores.
   - When one module needs data from another, it queries via the corresponding service layer or shared API client.

## Consequences
- UI components stay pure and easy to test.
- Calculations can be unit tested without mounting React components or simulating DOM events.
