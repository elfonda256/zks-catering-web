"use client";

import React from "react";
import { ErpShell, ErpShellProps } from "./shell/ErpShell";

export type EnterpriseShellProps = ErpShellProps;

/**
 * EnterpriseShell
 * Canonical ERP Layout Shell providing Top Header, Persistent Sidebar,
 * Global Search (⌘K), Notification Center, Breadcrumb support, and Status Bar.
 * Fully compliant with Sprint 10.4 EDS and Sprint 10.5 Navigation Framework.
 */
export function EnterpriseShell(props: EnterpriseShellProps) {
  return <ErpShell {...props} />;
}

export default EnterpriseShell;
