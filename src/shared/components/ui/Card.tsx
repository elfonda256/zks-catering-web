import React, { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "compact" | "default" | "spacious";
  hoverable?: boolean;
}

export function Card({
  className,
  padding = "default",
  hoverable = false,
  children,
  ...props
}: CardProps) {
  const paddingStyles = {
    none: "p-0",
    compact: "p-4", // 16px (8pt grid)
    default: "p-6", // 24px (8pt grid)
    spacious: "p-8", // 32px (8pt grid)
  };

  return (
    <div
      className={cn(
        "bg-white border border-slate-200/80 rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
        paddingStyles[padding],
        hoverable && "hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-out",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-start justify-between gap-4 pb-4 border-b border-slate-100 mb-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-[16px] leading-[24px] font-medium text-slate-900 tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-[12px] leading-[16px] text-slate-500 mt-0.5", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}
