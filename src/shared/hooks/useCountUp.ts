"use client";

import { useState, useEffect } from "react";

/**
 * Enterprise Count-Up Hook
 * Strictly complies with Sprint 02.2 Animation Guidelines:
 * - 200–250ms total duration (default 220ms)
 * - Pure ease-out deceleration curve (no bounce, no elastic)
 * - Respects prefers-reduced-motion media query
 * - Safe numeric interpolation without hydration flash
 */
export function useCountUp(
  targetValue: number | string,
  durationMs: number = 220,
  enabled: boolean = true
): number | string {
  // Check if targetValue is numeric or can be parsed
  const numericTarget =
    typeof targetValue === "number"
      ? targetValue
      : parseFloat(String(targetValue).replace(/[^0-9.-]/g, ""));

  const isNumeric = !isNaN(numericTarget) && isFinite(numericTarget);

  const [displayValue, setDisplayValue] = useState<number>(() =>
    isNumeric ? (enabled ? 0 : numericTarget) : 0
  );

  useEffect(() => {
    if (!enabled || !isNumeric) return;

    let animFrameId: number;

    // Check for reduced motion preference
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      animFrameId = requestAnimationFrame(() => {
        setDisplayValue(numericTarget);
      });
      return () => cancelAnimationFrame(animFrameId);
    }

    let startTime: number | null = null;
    const startVal = 0;
    const endVal = numericTarget;
    const diff = endVal - startVal;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Standard cubic ease-out curve: 1 - (1 - progress)^3
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startVal + diff * easeOut;

      // Handle integer vs decimal targets
      const isInteger = Number.isInteger(numericTarget);
      setDisplayValue(isInteger ? Math.round(current) : parseFloat(current.toFixed(1)));

      if (progress < 1) {
        animFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(endVal);
      }
    };

    animFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [numericTarget, durationMs, isNumeric, enabled]);

  // If disabled or non-numeric, return original value as-is
  if (!enabled || !isNumeric) return targetValue;

  return displayValue;
}
