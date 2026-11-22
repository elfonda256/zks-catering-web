const STEPS = ["Diterima", "Ongkir", "Bayar", "Dimasak", "Dikirim", "Selesai"];

/**
 * Steps done, and whether the next step is in progress. Paid orders wait for the kitchen,
 * so "Dimasak" is only marked in progress once the admin starts it.
 */
const PROGRESS: Record<string, { done: number; active: boolean }> = {
  WAITING_ADMIN_CONFIRMATION: { done: 1, active: true },
  CONFIRMED_AWAITING_PAYMENT: { done: 2, active: true },
  DP_PAID: { done: 3, active: false },
  FULLY_PAID: { done: 3, active: false },
  IN_PREPARATION: { done: 3, active: true },
  IN_DELIVERY: { done: 4, active: true },
  COMPLETED: { done: STEPS.length, active: false },
};

export function hasProgress(status: string): boolean {
  return status in PROGRESS;
}

/** Order tracker in the style of food-delivery apps: where the order is, and what comes next. */
export function OrderProgress({ status }: { status: string }) {
  const progress = PROGRESS[status];
  if (!progress) return null;

  return (
    <ol aria-label="Tahap pesanan" className="grid grid-cols-6 gap-2">
      {STEPS.map((step, index) => {
        const done = index < progress.done;
        const active = progress.active && index === progress.done;
        return (
          <li key={step} aria-current={active ? "step" : undefined} className="min-w-0">
            <span
              className={`block h-1.5 rounded-full ${done ? "bg-brand-500" : active ? "bg-brand-300/50" : "bg-white/15"}`}
              aria-hidden="true"
            />
            <span
              className={`mt-2 block truncate font-heading text-xs font-bold uppercase sm:text-sm ${
                active ? "text-brand-300" : done ? "text-white" : "text-white/45"
              }`}
            >
              {step}
            </span>
            <span className="sr-only">{done ? " — selesai" : active ? " — sedang berjalan" : " — belum"}</span>
          </li>
        );
      })}
    </ol>
  );
}
