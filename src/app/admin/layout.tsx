import type { ReactNode } from "react";

/** Every admin route, the login page included, uses the admin typefaces. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="admin-theme contents">{children}</div>;
}
