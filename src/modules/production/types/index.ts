export type WorkOrderStatus = "PLANNED" | "IN_PREPARATION" | "COOKING" | "COOLING" | "PACKED" | "DISPATCHED";

export interface WorkOrder {
  id: string;
  orderCode: string;
  menuItemName: string;
  targetPortions: number;
  scheduledDate: string;
  status: WorkOrderStatus;
  headChefName: string;
  station: "BUTCHER" | "HOT_KITCHEN" | "STEAMER" | "COLD_PREP" | "BAKERY";
}
