export interface AdminOrderItem {
  id: number;
  menuItemName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  notes: string | null;
}

export interface AdminOrderPayment {
  id: number;
  paymentRef: string;
  paymentType: string;
  amount: number;
  status: string;
  paymentChannel: string | null;
  paymentUrl: string | null;
  createdAt: string;
  settledAt: string | null;
  maskedResponse: string | null;
}

export interface AdminOrderData {
  id: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerEmail: string | null;
  eventDate: string; // ISO string
  totalPcs: number;
  subtotal: number;
  shippingFee: number | null;
  totalAmount: number | null;
  dpAmount: number | null;
  status: string;
  notes: string | null;
  cancellationReason: string | null;
  createdAt: string; // ISO string
  confirmedAt: string | null;
  initialPaymentDueAt: string | null;
  items: AdminOrderItem[];
  payments: AdminOrderPayment[];
}
