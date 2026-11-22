import type { CategoryId } from "@/modules/sample-data";

/** Simple line drawings, one per ingredient category, drawn on a 24×24 grid. */
const PATHS: Record<CategoryId, React.ReactNode> = {
  // Rice bowl
  karbohidrat: (
    <>
      <path d="M3 11h18a9 9 0 0 1-18 0Z" />
      <path d="M7 11c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />
      <path d="M9 20h6" />
    </>
  ),
  // Drumstick
  daging: (
    <>
      <path d="M15.5 3.5a5 5 0 0 1 5 5c0 3.5-3.5 6-7 6l-2.5 2.5" />
      <path d="M15.5 3.5c-3.5 0-6 3.5-6 7L7 13" />
      <path d="m7 13 4 4" />
      <path d="M7 13a2 2 0 1 0-2.5 2.5A2 2 0 1 0 7 18a2 2 0 1 0 2.5-2.5" />
    </>
  ),
  // Fish
  seafood: (
    <>
      <path d="M3 12c3-5 9-6 14-2l4-3v10l-4-3c-5 4-11 3-14-2Z" />
      <circle cx="8" cy="11" r="0.8" fill="currentColor" />
    </>
  ),
  // Egg
  "protein-nabati": <path d="M12 3c3.5 0 6.5 6 6.5 10.5a6.5 6.5 0 0 1-13 0C5.5 9 8.5 3 12 3Z" />,
  // Leaf
  sayur: (
    <>
      <path d="M5 19C5 10 10 5 20 4c-1 10-6 15-15 15Z" />
      <path d="M5 19 13 11" />
    </>
  ),
  // Chili
  bumbu: (
    <>
      <path d="M17 7c-2 0-3 2-4 5s-4 7-9 8c6 1 12-2 14-7 .7-2 .3-4-1-6Z" />
      <path d="M17 7c0-2 1-3 3-3" />
    </>
  ),
  // Oil bottle
  kering: (
    <>
      <path d="M10 3h4v3l2 3v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9l2-3Z" />
      <path d="M8 13h8" />
    </>
  ),
  // Citrus
  buah: (
    <>
      <circle cx="12" cy="13" r="7" />
      <path d="M12 6V3" />
      <path d="M12 6c1.5-2 3.5-2.5 5-2" />
    </>
  ),
};

interface CategoryIconProps {
  category: CategoryId;
  className?: string;
}

/** Decorative category mark; the category name is always shown next to it. */
export function CategoryIcon({ category, className = "" }: CategoryIconProps) {
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-slate-100 text-slate-700 ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        {PATHS[category]}
      </svg>
    </span>
  );
}
