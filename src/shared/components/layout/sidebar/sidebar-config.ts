import { ErpNavSection } from "./types";

/**
 * Admin navigation. Only modules backed by real data are listed here.
 * The procurement, inventory, production, kitchen and ad-hoc pages still use sample data,
 * so they stay off the menu until their backends exist.
 */
export const erpNavSections: ErpNavSection[] = [
  {
    id: "operations",
    title: "OPERASIONAL",
    defaultExpanded: true,
    items: [
      {
        id: "sales-orders",
        label: "Pesanan",
        href: "/admin/dashboard",
        exact: true,
      },
    ],
  },
];
