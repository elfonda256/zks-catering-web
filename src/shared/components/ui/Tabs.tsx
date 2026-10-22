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
        "flex flex-wrap items-center gap-1 border-b border-slate-200 pb-px bg-transparent",
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
        "px-4 py-2.5 text-sm font-medium transition-all duration-150 ease-out select-none border-b-2 -mb-px rounded-t-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 cursor-pointer",
        isActive
          ? "border-slate-900 text-slate-900 font-semibold bg-slate-50/70"
          : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300",
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

  return <div className={cn("animate-in fade-in-50 duration-150 pt-2", className)}>{children}</div>;
}
