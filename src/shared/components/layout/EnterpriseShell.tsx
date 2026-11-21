"use client";

import React from "react";
import { ErpShell, ErpShellProps } from "./shell/ErpShell";

export type EnterpriseShellProps = ErpShellProps;

/**
 * EnterpriseShell
 * Admin layout: top header (logo, sidebar toggle, account menu) and the persistent sidebar.
 */
export function EnterpriseShell(props: EnterpriseShellProps) {
  return <ErpShell {...props} />;
}

export default EnterpriseShell;
