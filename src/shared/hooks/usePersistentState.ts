"use client";

import { useSyncExternalStore, useCallback, useMemo } from "react";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

/**
 * Hook for boolean state backed by localStorage with zero SSR hydration mismatch
 * and compliant with React 19 external store synchronization.
 */
export function usePersistentBoolean(
  key: string,
  defaultValue: boolean
): [boolean, (valOrFn: boolean | ((prev: boolean) => boolean)) => void] {
  const getSnapshot = useCallback(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item === "true" : defaultValue;
    } catch {
      return defaultValue;
    }
  }, [key, defaultValue]);

  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (valOrFn: boolean | ((prev: boolean) => boolean)) => {
      try {
        const current = getSnapshot();
        const nextValue =
          typeof valOrFn === "function" ? valOrFn(current) : valOrFn;
        localStorage.setItem(key, String(nextValue));
        window.dispatchEvent(new Event("storage"));
      } catch {
        // Ignore in restricted environments
      }
    },
    [key, getSnapshot]
  );

  return [value, setValue];
}

/**
 * Hook for object map state backed by localStorage with string snapshot synchronization
 */
export function usePersistentRecord(
  key: string,
  defaultValue: Record<string, boolean>
): [Record<string, boolean>, (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void] {
  const getSnapshot = useCallback(() => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);

  const getServerSnapshot = useCallback(() => null, []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo(() => {
    if (!raw) return defaultValue;
    try {
      return { ...defaultValue, ...JSON.parse(raw) };
    } catch {
      return defaultValue;
    }
  }, [raw, defaultValue]);

  const setValue = useCallback(
    (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => {
      try {
        const currentRaw = getSnapshot();
        const current = currentRaw ? { ...defaultValue, ...JSON.parse(currentRaw) } : defaultValue;
        const nextValue = updater(current);
        localStorage.setItem(key, JSON.stringify(nextValue));
        window.dispatchEvent(new Event("storage"));
      } catch {
        // Ignore
      }
    },
    [key, defaultValue, getSnapshot]
  );

  return [value, setValue];
}
