# ADR-001: Enterprise Modular ERP Architecture

## Status
Accepted

## Date
2026-10-21

## Context
PT. Zahdan Kamal Sentosa's software platform is expanding from a catering showcase and order placement portal into an end-to-end industrial Enterprise Resource Planning (ERP) platform. The platform must scale to support 14+ operational domains including Warehouse, Procurement, Kitchen, Distribution, Finance, and AI Assistant.

A flat or ad-hoc directory structure where page components manage database queries, stateful logic, and UI elements causes high coupling, duplication, and makes root-cause analysis difficult during operational incidents.

## Decision
We adopt a **Domain-Driven Modular ERP Architecture**:
1. Route handlers and page entry points (`src/app/`) remain ultra-thin presentation/routing layers.
2. Business domains live in self-contained feature modules under `src/modules/<module-name>/`.
3. Cross-cutting concerns and reusable primitives live under `src/shared/`.
4. Communication between domains must occur exclusively via typed service contracts, never through direct internal imports or state mutations.

## Consequences
### Positive
- Strict separation of concerns facilitates rapid root cause analysis.
- Independent teams or agents can develop separate modules without merge conflicts or regressions.
- Testability is drastically improved as business logic and services are isolated from React rendering lifecycles.

### Negative / Trade-offs
- Requires deliberate adherence to directory structures and import standards.
