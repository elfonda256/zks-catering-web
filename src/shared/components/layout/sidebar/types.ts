export type ErpUserRole =
  | "SUPERADMIN"
  | "ADMIN"
  | "MANAGEMENT"
  | "PURCHASING"
  | "WAREHOUSE"
  | "KITCHEN"
  | "DELIVERY"
  | "FINANCE"
  | "AUDITOR"
  | string;

export interface ErpNavItem {
  id: string;
  label: string;
  href: string;
  exact?: boolean;
  badge?: string;
  badgeVariant?: "default" | "warning" | "danger" | "success" | "neutral";
  allowedRoles?: ErpUserRole[];
  icon?: string;
}

export interface ErpNavSection {
  id: string;
  title: string;
  items: ErpNavItem[];
  allowedRoles?: ErpUserRole[];
  defaultExpanded?: boolean;
}
