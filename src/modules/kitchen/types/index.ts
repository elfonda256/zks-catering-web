export type KitchenStationId =
  | "ALL"
  | "HOT_WOK"
  | "STEAMER"
  | "BUTCHER"
  | "COLD_PACKING"
  | "PASTRY";

export type KitchenTicketStatus =
  | "QUEUED"
  | "COOKING"
  | "HOLDING_HOT"
  | "READY_PACK"
  | "COMPLETED";

export interface KitchenTicket {
  id: string;
  ticketCode: string;
  clientName: string;
  menuItemName: string;
  portions: number;
  shift: string;
  targetDispatchTime: string;
  station: KitchenStationId;
  status: KitchenTicketStatus;
  currentTemp?: number;
  targetTemp: number;
  isAdhoc?: boolean;
  dietaryAlerts?: string[];
  headChefName: string;
}

export interface HaccpLogEntry {
  id: string;
  ccpCode: string; // e.g. CCP-01, CCP-02
  checkpointName: string;
  itemTested: string;
  recordedValue: number;
  unit: string;
  standardThreshold: string;
  status: "PASS" | "WARNING" | "FAIL";
  inspectorName: string;
  recordedTime: string;
}

export interface KitchenSummaryKpi {
  activeTicketsCount: number;
  totalPortionsInKitchen: number;
  haccpPassRate: number;
  bainMarieAvgTemp: number;
  activeBoilersOnline: number;
}
