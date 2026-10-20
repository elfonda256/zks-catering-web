"use client";

import { useEffect, useRef } from "react";

interface StatCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  separator?: "." | "," | "";
  className?: string;
}

/**
 * StatCounter: High-performance direct DOM counting animation
 * - Zero React re-renders during 60fps/120fps animation loop
 * - Perfect SSR/SEO: renders full final number initially
 * - Natural Apple/Linear-style cubic ease-out curve
 * - Exactly 1.5s duration by default
 * - Plays once when entering viewport
 * - Respects prefers-reduced-motion
 */
export default function StatCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1500,
  separator = "",
  className = "",
}: StatCounterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || animatedRef.current) return;

    const formatValue = (num: number) => {
      const formattedNum =
        separator && num >= 1000
          ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
          : num.toString();
      return `${prefix}${formattedNum}${suffix}`;
    };

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      el.textContent = formatValue(value);
      animatedRef.current = true;
      return;
    }

    // Set initial 0 before viewport entrance
    el.textContent = formatValue(0);

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          observer.disconnect();

          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Natural Apple/Linear-style cubic ease-out: 1 - (1 - progress)^3
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.round(easeOutProgress * value);

            if (el) {
              el.textContent = formatValue(currentCount);
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else if (el) {
              el.textContent = formatValue(value);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [value, prefix, suffix, duration, separator]);

  // Initial SSR render output for fast paint and SEO indexing
  const initialFormatted =
    separator && value >= 1000
      ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
      : value.toString();

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {initialFormatted}
      {suffix}
    </span>
  );
}
