export interface PaymentRow {
  id: number;
  orderCode: string;
  customerName: string;
  paymentType: string;
  amount: number;
  channel: string | null;
  createdAt: string;
  settledAt: string | null;
}

export interface ReceivableRow {
  orderCode: string;
  customerName: string;
  customerPhone: string;
  eventDate: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
}

export interface RefundRow {
  orderCode: string;
  customerName: string;
  status: string;
  refundAmount: number | null;
  cancelledAt: string | null;
}

export interface FinanceSummary {
  month: string;
  received: PaymentRow[];
  pending: PaymentRow[];
  receivables: ReceivableRow[];
  refunds: RefundRow[];
}
