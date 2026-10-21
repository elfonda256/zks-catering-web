import { DEFAULT_SETTINGS } from "../constants";
import type { SystemSettings } from "../types";

export class SettingsService {
  static getSettings(): SystemSettings {
    return { ...DEFAULT_SETTINGS };
  }
}
