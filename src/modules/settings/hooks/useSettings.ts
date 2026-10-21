"use client";

import { useState } from "react";
import { SettingsService } from "../services/settings.service";
import type { SystemSettings } from "../types";

export function useSettings() {
  const [settings, setSettings] = useState<SystemSettings>(SettingsService.getSettings());
  return { settings, setSettings };
}
