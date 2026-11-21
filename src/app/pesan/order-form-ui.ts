/** Class names shared by the order form pieces on /pesan. */

export const SURFACE = "rounded-[10px] bg-[#232A2E]";

export const STEP_NUMBER =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C85A17] font-heading text-sm font-bold text-white";

export const PRIMARY_BUTTON =
  "inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#C85A17] px-8 font-heading text-base font-bold uppercase text-white transition-colors hover:bg-[#A4460E] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E07A35] disabled:cursor-not-allowed disabled:opacity-50";

export { formatRupiahCompact as formatRupiah } from "@/shared/utils/formatters";
