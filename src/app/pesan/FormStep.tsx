import type { ReactNode } from "react";
import { HEADING } from "@/components/site/ui";
import { FIELD_HINT } from "@/components/site/form";
import { STEP_NUMBER } from "./order-form-ui";

interface FormStepProps {
  number: number;
  title: string;
  hint?: string;
  children: ReactNode;
}

/** One numbered step of the order form, like a checkout section. */
export function FormStep({ number, title, hint, children }: FormStepProps) {
  const headingId = `step-${number}-title`;
  return (
    <section aria-labelledby={headingId} className="space-y-6 border-t border-white/15 pt-8 first:border-t-0 first:pt-0">
      <div className="flex items-start gap-4">
        <span className={STEP_NUMBER} aria-hidden="true">
          {number}
        </span>
        <div>
          <h2 id={headingId} className={`${HEADING} text-2xl sm:text-[1.75rem]`}>
            {title}
          </h2>
          {hint && <p className={`${FIELD_HINT} mt-1`}>{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}
