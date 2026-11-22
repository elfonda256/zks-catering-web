"use client";

import { useState } from "react";

interface CopyButtonProps {
  value: string;
  label: string;
}

/** Copies a value (account number, amount, order code) the customer has to type into their banking app. */
export function CopyButton({ value, label }: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    window.setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Salin ${label}`}
      className="inline-flex min-h-9 shrink-0 cursor-pointer items-center rounded-full border border-white/20 px-3 font-heading text-xs font-bold uppercase text-white/85 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
    >
      <span aria-live="polite">{status === "copied" ? "Tersalin" : status === "failed" ? "Gagal" : "Salin"}</span>
    </button>
  );
}
