import type { DirectOrderSource } from "./types";

export const DIRECT_ORDER_SOURCES: Record<DirectOrderSource, string> = {
  PHONE: "Telepon",
  WHATSAPP: "WhatsApp",
  WALK_IN: "Datang langsung",
};

export function isDirectOrderSource(value: string): value is DirectOrderSource {
  return value in DIRECT_ORDER_SOURCES;
}
