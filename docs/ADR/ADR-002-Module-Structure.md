# ADR-002: Module Subsystem Structure & Boundaries

## Status
Accepted

## Date
2026-10-21

## Context
As modules grow in depth (e.g., Inventory containing Items, Receiving, Transfers, Opname, and Movements), we need a predictable, uniform internal layout across all modules to eliminate guesswork for developers and AI agents.

## Decision
Every feature module within `src/modules/<module-name>/` must enforce the following sub-structure:
```
src/modules/<module-name>/
├── components/   # Module-specific presentation and container components
├── hooks/        # Module-specific stateful React hooks
├── services/     # Domain data access, calculation, and API services
├── types/        # TypeScript interfaces, types, and DTO definitions
├── schemas/      # Runtime validation schemas (Zod or functional)
├── utils/        # Pure transformation helpers specific to the module
├── constants/    # Fixed options, dictionaries, and domain constants
└── index.ts      # Public API exports of the module
```

## Guidelines
1. Private helpers remain inside the module.
2. Only entities exported via `index.ts` are considered public contract.
3. Modules must not import from another module's internal directories (e.g. `@/modules/inventory/components/internal/...` is forbidden; use `@/modules/inventory` public contracts).

## Consequences
- Predictable mental model for code navigation.
- Safe refactoring within modules without unintended blast radius.
