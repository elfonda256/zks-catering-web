import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "@/components/icons";

/**
 * Shared building blocks for the public site (homepage, menu catalogue).
 * Type scale, colours and spacing are defined here once; see DESIGN_MASTERBOOK.md.
 */

export const CANVAS = "bg-ink text-white";

/** Warm paper chapter: used once per page at most, where content reads like a document. */
export const PAPER = "bg-canvas text-ink";

/** Heading face: uppercase Saira Semi Condensed, tight leading, no orphans. */
export const HEADING = "font-heading font-extrabold uppercase leading-[1.02] text-balance";

export const TITLE_SIZE = {
  hero: "text-[clamp(3rem,7.6vw,7.5rem)]",
  /** Feature sections (split image + text). */
  large: "text-[2.75rem] sm:text-6xl lg:text-[4.375rem]",
  /** List sections (cards, documents). */
  medium: "text-[2.25rem] sm:text-5xl lg:text-[3.125rem]",
} as const;

export const CONTAINER = "mx-auto w-full max-w-[90rem] px-6 sm:px-10 lg:px-[6.25rem]";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`block font-text text-lg font-semibold uppercase leading-tight sm:text-[22px] ${className}`}>
      {children}
    </span>
  );
}

/** Eyebrow followed by a double rule that runs to the edge of the section. */
export function RuledEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-5">
      <span className="shrink-0 font-heading text-sm font-bold uppercase tracking-[0.02em] sm:text-base">
        {children}
      </span>
      <span className="flex flex-1 flex-col gap-[3px]" aria-hidden="true">
        <span className="h-[2px] bg-current" />
        <span className="h-[2px] bg-current" />
      </span>
    </div>
  );
}

const BUTTON_VARIANTS = {
  solid: "bg-brand-600 text-white hover:bg-brand-700",
  outline: "border-2 border-white/80 text-white hover:bg-white hover:text-ink",
  light: "bg-white text-ink hover:bg-white/85",
} as const;

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: keyof typeof BUTTON_VARIANTS;
  className?: string;
}

/** Pill call-to-action. Links starting with "http" open in a new tab. */
export function ButtonLink({ href, children, variant = "solid", className = "" }: ButtonLinkProps) {
  const classes = `inline-flex min-h-11 items-center justify-center rounded-full px-5 font-heading text-sm font-bold uppercase tracking-[0.02em] transition-colors duration-200 active:scale-[0.98] ${BUTTON_VARIANTS[variant]} ${className}`;
  return <SmartLink href={href} className={classes}>{children}</SmartLink>;
}

/** Small uppercase underlined link, used under feature copy. */
export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <SmartLink
      href={href}
      className="group inline-flex items-center gap-1.5 font-heading text-sm font-bold uppercase underline decoration-2 underline-offset-[6px] transition-colors hover:text-brand-300"
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5 btn-arrow" aria-hidden="true" />
    </SmartLink>
  );
}

function SmartLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
