# CHAPTER 03 — ENGINEERING RULES & CODING STANDARDS

## Core Engineering Principles

1. **No Duplicate Components**:
   Every reusable UI primitive (Button, Card, Badge, Modal, Input, Table, etc.) must reside in `@/shared/components/ui/`. Domain-specific components belong exclusively inside their respective module (`@/modules/<module>/components/`).
2. **No Duplicate Hooks**:
   Stateful patterns (debouncing, pagination, disclosure, async fetching) must be abstracted into `@/shared/hooks/` or module-level hooks.
3. **No Duplicate Services**:
   Data access, HTTP client calls, calculation logic, and external system integrations must be encapsulated into `@/shared/services/` or domain-specific service classes in `@/modules/<module>/services/`.
4. **No Duplicate API Calls**:
   Network and database queries must never be triggered ad-hoc inside UI elements. All communication flows through central services.
5. **No Duplicate Constants**:
   Statuses, codes, system limits, thresholds, and business labels must have a single source of truth defined in `constants/`.
6. **No Duplicate Types**:
   Data models, request payloads, and view models must be strictly typed in `types/` without duplicating TypeScript interfaces across files.

---

## Mandatory Feature Structure

Every business feature and module must contain the following five pillars:
1. **Types (`types/`)**: Exhaustive TypeScript definitions without `any`.
2. **Validation (`schemas/`)**: Runtime data validation (Zod schemas or robust assertion functions).
3. **Services (`services/`)**: Business logic, data transformations, API calls, and mock registries.
4. **Constants (`constants/`)**: Fixed values, options, lookup dictionaries, and configuration limits.
5. **Documentation (`README.md` or JSDoc)**: Clear explanation of operational purpose and dependency contracts.

---

## Architectural Rules

- **Strict Isolation of Business Logic**:
  Next.js page components (`page.tsx`) must remain strictly routing, authentication guards, and layout wrappers. Business calculations, state mutations, and workflows must live inside module services, hooks, and client views.
- **Root Cause Friendly Decoupling**:
  Modules must never tightly couple across domain boundaries. For example:
  - Inventory must not directly import or mutate Procurement internal states.
  - Procurement must not directly modify Production internal states.
  - Cross-module communication occurs exclusively via shared service contracts and interfaces.
- **Zero Orphaned Files**:
  Never leave temporary test files, duplicate mock datasets, or unused experimental files in the repository.
- **Consistent Directory Architecture**:
  Every module under `src/modules/<module_name>` must follow the canonical structure:
  ```
  components/
  hooks/
  services/
  types/
  schemas/
  utils/
  constants/
  index.ts
  ```
- **Import Aliases**:
  Always use `@/modules/*` and `@/shared/*`. Deep relative imports like `../../../../` are prohibited.
