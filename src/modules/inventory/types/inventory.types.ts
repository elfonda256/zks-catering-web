/**
 * Inventory Dashboard & General Metrics Types
 */

export interface WarehouseMetrics {
  id: string;
  name: string;
  capacityUtilization: number;
  totalSku: number;
  temperatureStatus: "NORMAL" | "WARNING" | "CRITICAL";
  currentTemp: string;
}

export interface InventoryAlert {
  id: string;
  sku: string;
  itemName: string;
  alertType: "CRITICAL_LOW" | "EXPIRY_WARNING" | "NEGATIVE_VARIANCE" | "TEMPERATURE_ANOMALY";
  message: string;
  createdAt: string;
  resolved: boolean;
}
