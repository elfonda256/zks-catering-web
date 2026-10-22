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
      return { label: "Preferred Partner", variant: "success" };
    case "APPROVED":
    case "ACTIVE":
      return { label: "Approved Vendor", variant: "info" };
    case "PENDING_VERIFICATION":
    case "REVIEW":
      return { label: "Pending Verification", variant: "warning" };
    case "CONTRACT_RENEWAL":
    case "PROBATION":
      return { label: "Contract Renewal", variant: "warning" };
    case "INACTIVE":
      return { label: "Inactive", variant: "neutral" };
    case "BLACKLISTED":
    case "SUSPENDED":
      return { label: "Blacklisted", variant: "danger" };
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
