export type DeliveryStatus = "ASSIGNED" | "DISPATCHED" | "IN_TRANSIT" | "ARRIVED" | "COMPLETED" | "DELAYED";

export interface DeliveryRun {
  id: string;
  runCode: string;
  driverName: string;
  vehiclePlate: string;
  destinationName: string;
  deliveryAddress: string;
  scheduledDeparture: string;
  status: DeliveryStatus;
  totalThermalBoxes: number;
}
