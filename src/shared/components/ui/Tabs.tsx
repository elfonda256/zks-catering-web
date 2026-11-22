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

/** Arrow keys, Home and End move between tabs, as in the WAI-ARIA tabs pattern. */
function handleArrowKeys(e: React.KeyboardEvent<HTMLDivElement>) {
  const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
  if (!keys.includes(e.key)) return;
  const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
  if (current === -1) return;
  e.preventDefault();
  const next =
    e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : (current + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].focus();
  tabs[next].click();
}

export function TabsList({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      role="tablist"
      onKeyDown={handleArrowKeys}
      className={cn(
        "flex items-center gap-1 border-b border-stone-200 pb-px bg-transparent",
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
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={() => ctx.setValue(value)}
      className={cn(
        "px-4 py-2.5 text-sm font-medium transition-all duration-150 ease-out select-none border-b-2 -mb-px rounded-t-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 cursor-pointer",
        isActive
          ? "border-brand-600 text-ink font-semibold"
          : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300",
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
