/**
 * System-wide enterprise constants.
 */

export const COMPANY_NAME = "PT. Zahdan Kamal Sentosa";
export const COMPANY_SHORT = "ZKS";
export const SYSTEM_NAME = "ZKS Enterprise ERP";

export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/admin/login",
  DASHBOARD: "/admin/dashboard",
  INVENTORY: "/admin/inventory",
  ITEMS: "/admin/inventory/items",
  RECEIVING: "/admin/inventory/receiving",
  MOVEMENTS: "/admin/inventory/movements",
  OPNAME: "/admin/inventory/opname",
  TRANSFERS: "/admin/inventory/transfers",
  PURCHASE_REQUESTS: "/admin/purchase-requests",
  PURCHASE_ORDERS: "/admin/purchase-orders",
} as const;

export const DEFAULT_PAGE_SIZE = 25;
export const TAX_RATE_PPN = 0.11; // 11% PPN Indonesia
