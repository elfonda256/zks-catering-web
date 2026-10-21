import React, { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "p-10 text-center bg-white border border-dashed border-[#141413]/20 flex flex-col items-center justify-center space-y-3",
        className
      )}
    >
      {icon && <div className="text-[#626058]">{icon}</div>}
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-[#141413] tracking-tight">{title}</h4>
        {description && <p className="text-xs text-[#626058] max-w-sm">{description}</p>}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
