import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "@/components/icons";

/** Condensed uppercase display type shared by homepage headings. */
export const DISPLAY = "font-condensed font-extrabold uppercase leading-[0.95] tracking-[-0.005em] text-balance";

/** The one size every section title uses, so headings line up across the page. */
export const SECTION_TITLE_SIZE = "text-[2.75rem] sm:text-6xl xl:text-7xl";

/** Small uppercase label used for list titles and stat captions. */
export const LABEL = "font-condensed text-lg font-bold uppercase leading-tight tracking-[0.04em]";

export type SectionTheme = "dark" | "light" | "brand";

/** Eyebrow colours chosen for contrast on each background. */
const EYEBROW_COLOR: Record<SectionTheme, string> = {
  dark: "text-[#E07A35]",
  light: "text-[#A4460E]",
  brand: "text-white/80",
};

export function Eyebrow({ children, theme = "dark" }: { children: ReactNode; theme?: SectionTheme }) {
  return (
    <span className={`block font-condensed text-sm font-bold uppercase tracking-[0.14em] ${EYEBROW_COLOR[theme]}`}>
      {children}
    </span>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  lead?: string;
  theme?: SectionTheme;
}

/** Eyebrow, title and lead with fixed spacing, so every section starts the same way. */
export function SectionHeading({ eyebrow, title, lead, theme = "dark" }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl reveal-title">
      <Eyebrow theme={theme}>{eyebrow}</Eyebrow>
      <h2 className={`${DISPLAY} ${SECTION_TITLE_SIZE} mt-4`}>{title}</h2>
      {lead && <p className="mt-6 max-w-2xl text-base leading-relaxed text-pretty opacity-80 sm:text-lg">{lead}</p>}
    </div>
  );
}

const PILL_VARIANTS = {
  solid: "bg-[#C85A17] text-white hover:bg-[#A4460E]",
  outline: "border border-current/40 hover:border-current hover:bg-current/[0.06]",
  dark: "bg-[#141413] text-[#FAF9F5] hover:bg-[#2C2C28]",
} as const;

interface PillLinkProps {
  href: string;
  children: ReactNode;
  variant?: keyof typeof PILL_VARIANTS;
}

/** Rounded call-to-action. Links starting with "http" open in a new tab. */
export function PillLink({ href, children, variant = "solid" }: PillLinkProps) {
  const className = `group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-7 font-condensed text-base font-bold uppercase tracking-[0.08em] transition-colors duration-200 active:scale-[0.98] ${PILL_VARIANTS[variant]}`;
  const content = (
    <>
      <span>{children}</span>
      <ArrowUpRight className="h-4 w-4 btn-arrow" aria-hidden="true" />
    </>
  );

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
