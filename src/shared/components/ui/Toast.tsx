"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { cn } from "@/shared/utils/cn";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (title: string, options?: { description?: string; type?: ToastType; duration?: number }) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      title: string,
      options?: { description?: string; type?: ToastType; duration?: number }
    ) => {
      const id = Math.random().toString(36).substring(2, 9);
      const type = options?.type || "info";
      const duration = options?.duration || 4000;

      setToasts((prev) => [...prev, { id, title, description: options?.description, type }]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast viewport */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const typeBorder = {
            success: "border-emerald-600 bg-emerald-50 text-emerald-950",
            error: "border-rose-600 bg-rose-50 text-rose-950",
            warning: "border-amber-600 bg-amber-50 text-amber-950",
            info: "border-[#141413] bg-white text-[#141413]",
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={cn(
                "pointer-events-auto p-4 border shadow-xl flex items-start justify-between gap-3 animate-in slide-in-from-bottom-5 duration-200",
                typeBorder
              )}
            >
              <div className="space-y-1">
                <div className="text-xs font-bold font-mono uppercase tracking-wider">{toast.title}</div>
                {toast.description && (
                  <div className="text-xs text-[#626058]">{toast.description}</div>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-xs opacity-60 hover:opacity-100 font-mono"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Graceful fallback if not wrapped in provider
    return {
      showToast: (title: string) => console.log(`[Toast]: ${title}`),
      removeToast: () => {},
    };
  }
  return ctx;
}
