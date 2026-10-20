"use client";

import { useEffect } from "react";

/**
 * ScrollObserver: Lightweight Intersection Observer controller
 * - Progressively reveals sections with smooth Apple/Linear style easing
 * - Staggers child items
 * - Plays each entrance once and disconnects
 * - Respects prefers-reduced-motion preferences
 */
export default function ScrollObserver() {
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targets = document.querySelectorAll<HTMLElement>(
      ".reveal-on-scroll, [data-reveal]"
    );

    if (prefersReducedMotion) {
      targets.forEach((el) => {
        el.classList.add("is-revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    targets.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
