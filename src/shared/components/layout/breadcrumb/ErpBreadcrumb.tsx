"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface ErpBreadcrumbProps {
  customItems?: BreadcrumbItem[];
  className?: string;
}

const SEGMENT_LABELS: Record<string, { label: string; parentHref?: string }> = {
  admin: { label: "Dashboard", parentHref: "/admin/dashboard" },
  dashboard: { label: "Dashboard", parentHref: "/admin/dashboard" },
  inventory: { label: "Inventory", parentHref: "/admin/inventory" },
  items: { label: "Master Item", parentHref: "/admin/inventory/items" },
  receiving: { label: "Receiving", parentHref: "/admin/inventory/receiving" },
  movements: { label: "Stock Movement", parentHref: "/admin/inventory/movements" },
  transfers: { label: "Warehouse Transfer", parentHref: "/admin/inventory/transfers" },
  opname: { label: "Stock Opname", parentHref: "/admin/inventory/opname" },
  procurement: { label: "Procurement", parentHref: "/admin/purchase-requests" },
  "purchase-requests": { label: "Purchase Request", parentHref: "/admin/purchase-requests" },
  "purchase-orders": { label: "Purchase Order", parentHref: "/admin/purchase-orders" },
  supplier: { label: "Supplier", parentHref: "/admin/supplier" },
  production: { label: "Production", parentHref: "#" },
  kitchen: { label: "Kitchen", parentHref: "#" },
  distribution: { label: "Delivery", parentHref: "#" },
  finance: { label: "Finance", parentHref: "#" },
  reports: { label: "Reports", parentHref: "#" },
  settings: { label: "Settings", parentHref: "#" },
};

export function ErpBreadcrumb({ customItems, className }: ErpBreadcrumbProps) {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    if (customItems && customItems.length > 0) {
      return customItems;
    }

    // Auto-generate from pathname
    // E.g. /admin/inventory/receiving -> ["admin", "inventory", "receiving"]
    const rawSegments = pathname
      .split("/")
      .filter(Boolean)
      .filter((s) => s !== "admin"); // admin mapped to Dashboard root

    const items: BreadcrumbItem[] = [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
      },
    ];

    let accumulatedPath = "/admin";

    rawSegments.forEach((segment, idx) => {
      accumulatedPath += `/${segment}`;
      const isLast = idx === rawSegments.length - 1;
      const config = SEGMENT_LABELS[segment];

      // If segment is under procurement like purchase-requests, insert "Procurement" parent if not already there
      if (
        (segment === "purchase-requests" ||
          segment === "purchase-orders" ||
          segment === "supplier") &&
        !items.some((i) => i.label === "Procurement")
      ) {
        items.push({
          label: "Procurement",
          href: "/admin/purchase-requests",
        });
      }

      // If segment is under inventory but not the inventory page itself, ensure "Inventory" is in path
      if (
        (segment === "items" ||
          segment === "receiving" ||
          segment === "movements" ||
          segment === "transfers" ||
          segment === "opname") &&
        !items.some((i) => i.label === "Inventory")
      ) {
        items.push({
          label: "Inventory",
          href: "/admin/inventory",
        });
      }

      const label = config ? config.label : segment;

      // Avoid duplicate consecutive items
      if (items[items.length - 1]?.label !== label) {
        items.push({
          label,
          href: isLast ? undefined : accumulatedPath,
          isCurrent: isLast,
        });
      }
    });

    // Mark the last item as current
    if (items.length > 0) {
      items[items.length - 1].isCurrent = true;
      delete items[items.length - 1].href;
    }

    return items;
  }, [pathname, customItems]);

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-[12px] text-slate-500", className)}>
      <ol className="flex items-center flex-wrap gap-1.5 list-none m-0 p-0">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <span className="text-slate-300 font-normal select-none" aria-hidden="true">
                  ›
                </span>
              )}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-slate-500 hover:text-slate-900 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "truncate max-w-[200px] sm:max-w-none",
                    isLast ? "text-slate-900 font-semibold" : "text-slate-500"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
