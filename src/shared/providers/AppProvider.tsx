"use client";

import React, { ReactNode } from "react";
import { ToastProvider } from "@/shared/components/ui/Toast";

export function AppProvider({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
