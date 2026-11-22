export interface DeliveryStop {
  orderId: number;
  orderCode: string;
  dateKey: string;
  eventDate: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string | null;
  totalPcs: number;
  packages: string;
  status: string;
  totalAmount: number | null;
  paidAmount: number;
}
