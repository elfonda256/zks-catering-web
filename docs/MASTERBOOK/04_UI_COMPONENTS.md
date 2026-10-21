# CHAPTER 04 — UI COMPONENT SYSTEM

## Shared UI Architecture (`@/shared/components/ui`)

To uphold the ZKS Enterprise ERP design language (industrial precision, editorial clarity, zero decorative clutter), all base UI primitives are centralized:

### 1. Button (`Button.tsx`)
- **Variants**: `primary` (industrial dark `#141413`), `secondary` (`#ECEBE4`), `outline` (border-based), `ghost`, `danger` (`#DC2626`).
- **Features**: Disabled state, loading spinner, tactile click states, monospace option.

### 2. Badge (`Badge.tsx`)
- **Variants**: `success` (green), `warning` (amber), `danger` (red), `neutral` (stone), `info` (blue), `accent` (emerald).
- **Features**: Semantic status representation with high-contrast text and border styling conforming to Rule 03 (no decorative pills; strictly operational status indicators).

### 3. Card (`Card.tsx`)
- **Components**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- **Styling**: Sharp borders (`rounded-none` or subtle `rounded-sm`), flat editorial surfaces, consistent padding tokens.

### 4. Input & Select (`Input.tsx`, `Select.tsx`)
- **Styling**: Monospace tabular numbers, crisp border `#141413]/20`, focus states with `#141413` ring, prefix/suffix support.

### 5. Dialog & Modal (`Modal.tsx`, `Dialog.tsx`)
- **Features**: Keyboard Escape dismiss, backdrop backdrop-blur, accessible dialog headers, body, and action footer.

### 6. Table (`Table.tsx`)
- **Components**: `Table`, `TableHeader`, `TableBody`, `TableHead`, `TableRow`, `TableCell`.
- **Styling**: High-density enterprise layout, sticky headers, subtle alternating zebra rows, monospace numeric cells.

### 7. Pagination (`Pagination.tsx`)
- **Features**: Current page indicator, total records count, previous/next controls, page size selector.

### 8. Tabs (`Tabs.tsx`)
- **Features**: Accessible tab list, active state underline or tactile tab pill, smooth content switching.

### 9. Toast (`Toast.tsx`)
- **Features**: Lightweight notifications for save, approval, rejection, and network status.

### 10. Empty & Loading States (`EmptyState.tsx`, `LoadingState.tsx`)
- **EmptyState**: Clear operational guidance when tables or filters yield zero results.
- **LoadingState**: Industrial skeleton pulse matching table and card structures.
