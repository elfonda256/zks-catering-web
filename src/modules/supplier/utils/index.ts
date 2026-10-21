import {
  formatRupiah,
  formatNumber,
  formatPercent,
  formatDate,
  formatDateTime,
} from "@/shared/utils/formatters";
import type { SupplierStatus, SupplierTier } from "../types";

export { formatRupiah, formatNumber, formatPercent, formatDate, formatDateTime };

export function getSupplierStatusBadge(status: SupplierStatus): {
  label: string;
  variant: "success" | "warning" | "danger" | "neutral" | "info" | "accent";
} {
  switch (status) {
    case "PREFERRED":
      return { label: "Preferred (Prioritas)", variant: "success" };
    case "ACTIVE":
      return { label: "Active", variant: "info" };
    case "REVIEW":
      return { label: "Under Review", variant: "warning" };
    case "PROBATION":
      return { label: "Probation", variant: "warning" };
    case "SUSPENDED":
      return { label: "Suspended", variant: "danger" };
    case "INACTIVE":
      return { label: "Inactive", variant: "neutral" };
  }
}

export function getTierBadge(tier: SupplierTier): {
  label: string;
  className: string;
} {
  switch (tier) {
    case "GOLD":
      return {
        label: "Gold Tier (Strategic)",
        className: "bg-amber-100 text-amber-900 border-amber-300 font-bold",
      };
    case "SILVER":
      return {
        label: "Silver Tier (Qualified)",
        className: "bg-slate-100 text-slate-800 border-slate-300 font-bold",
      };
    case "BRONZE":
      return {
        label: "Bronze Tier (Conditional)",
        className: "bg-amber-50 text-amber-800 border-amber-200 font-bold",
      };
  }
}
