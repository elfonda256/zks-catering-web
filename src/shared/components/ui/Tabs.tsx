"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface TabsContextValue {
  value: string;
  setValue: (val: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (val: string) => void;
  className?: string;
  children: ReactNode;
}

export function Tabs({ defaultValue, value, onValueChange, className, children }: TabsProps) {
  const [internalVal, setInternalVal] = useState(defaultValue);
  const currentVal = value !== undefined ? value : internalVal;

  function handleValChange(val: string) {
    if (value === undefined) setInternalVal(val);
    onValueChange?.(val);
  }

  return (
    <TabsContext.Provider value={{ value: currentVal, setValue: handleValChange }}>
      <div className={cn("space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1 border-b border-[#141413]/15 pb-px",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: ReactNode;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used inside Tabs");

  const isActive = ctx.value === value;

  return (
    <button
      type="button"
      onClick={() => ctx.setValue(value)}
      className={cn(
        "px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all select-none border-b-2 font-medium",
        isActive
          ? "border-[#141413] text-[#141413] font-bold bg-white"
          : "border-transparent text-[#626058] hover:text-[#141413] hover:border-[#141413]/30",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: ReactNode;
}) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used inside Tabs");

  if (ctx.value !== value) return null;

  return <div className={cn("animate-in fade-in-50 duration-150", className)}>{children}</div>;
}
