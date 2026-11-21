"use client";

import type { AdminOrderData, AdminOrderPayment } from "../types";
import {
  NEXT_OPERATIONAL_STATUS,
  NEXT_STATUS_ACTION_LABELS,
  ORDER_STATUS_LABELS,
  PAYMENT_TYPE_LABELS,
  type OrderStatusValue,
} from "../constants";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { formatDate, formatDateTime, formatRupiah } from "@/shared/utils/formatters";

export type OrderCardAction =
  | { type: "lock" }
  | { type: "reject" }
  | { type: "advance"; next: OrderStatusValue }
  | { type: "regenerateLink" }
  | { type: "viewProof"; payment: AdminOrderPayment }
  | { type: "approveProof"; payment: AdminOrderPayment }
  | { type: "rejectProof"; payment: AdminOrderPayment };

interface OrderCardProps {
  order: AdminOrderData;
  disabled: boolean;
  onAction: (order: AdminOrderData, action: OrderCardAction) => void;
}

const LABEL = "text-[11px] font-semibold uppercase tracking-wider text-slate-500";

function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
}

export function OrderCard({ order, disabled, onAction }: OrderCardProps) {
  const status = order.status as OrderStatusValue;
  const statusMeta = ORDER_STATUS_LABELS[status] ?? { label: order.status, variant: "neutral" as const };
  const pendingPayments = order.payments.filter((p) => p.status === "PENDING");
  const paidAmount = order.payments
    .filter((p) => p.status === "SETTLED")
    .reduce((sum, p) => sum + p.amount, 0);
  const remaining = order.totalAmount !== null ? Math.max(order.totalAmount - paidAmount, 0) : null;
  const nextStatus = NEXT_OPERATIONAL_STATUS[status];

  return (
    <article className="bg-white border border-slate-200 rounded-[12px]">
      <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-mono text-[16px] font-semibold text-slate-900 tabular-nums">{order.orderCode}</h3>
          <Badge variant={statusMeta.variant} dot>
            {statusMeta.label}
          </Badge>
          {pendingPayments.length > 0 && (
            <Badge variant="pending" dot>
              Bukti bayar masuk
            </Badge>
          )}
        </div>
        <p className="text-[12px] text-slate-500">Dipesan {formatDateTime(order.createdAt)}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-5 text-[14px]">
        <section className="space-y-2">
          <h4 className={LABEL}>Pemesan</h4>
          <p className="font-semibold text-slate-900">{order.customerName}</p>
          <a
            href={whatsappHref(order.customerPhone)}
            target="_blank"
            rel="noreferrer"
            className="text-[13px] font-mono text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
          >
            {order.customerPhone}
          </a>
          <p className="text-[13px] leading-relaxed text-slate-600">{order.customerAddress}</p>
        </section>

        <section className="space-y-2">
          <h4 className={LABEL}>Acara</h4>
          <p className="font-semibold text-slate-900">{formatDate(order.eventDate)}</p>
          <p className="text-[13px] text-slate-600">{order.totalPcs} porsi</p>
          <ul className="text-[13px] text-slate-600 space-y-1">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.menuItemName} × {item.quantity}
              </li>
            ))}
          </ul>
          {order.notes && (
            <p className="text-[13px] text-slate-700 bg-slate-50 border border-slate-200 rounded-[8px] px-3 py-2">
              {order.notes}
            </p>
          )}
        </section>

        <section className="space-y-2">
          <h4 className={LABEL}>Tagihan</h4>
          <dl className="space-y-1 text-[13px]">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-600">Makanan</dt>
              <dd className="font-mono tabular-nums text-slate-900">{formatRupiah(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-600">Ongkir</dt>
              <dd className="font-mono tabular-nums text-slate-900">
                {order.shippingFee !== null ? formatRupiah(order.shippingFee) : "Belum ditentukan"}
              </dd>
            </div>
            <div className="flex justify-between gap-4 pt-2 border-t border-slate-200">
              <dt className="font-semibold text-slate-900">Total</dt>
              <dd className="font-mono tabular-nums font-semibold text-slate-900">
                {order.totalAmount !== null ? formatRupiah(order.totalAmount) : "—"}
              </dd>
            </div>
            {paidAmount > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-slate-600">Sudah dibayar</dt>
                <dd className="font-mono tabular-nums text-slate-900">{formatRupiah(paidAmount)}</dd>
              </div>
            )}
            {paidAmount > 0 && remaining !== null && remaining > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="font-semibold text-amber-900">Sisa tagihan</dt>
                <dd className="font-mono tabular-nums font-semibold text-amber-900">{formatRupiah(remaining)}</dd>
              </div>
            )}
          </dl>
        </section>
      </div>

      {pendingPayments.length > 0 && (
        <section className="mx-6 mb-5 rounded-[12px] border border-amber-200 bg-amber-50/70 p-4 space-y-3">
          <h4 className="text-[13px] font-semibold text-amber-950">Bukti bayar menunggu verifikasi</h4>
          <p className="text-[12px] text-amber-900">Cocokkan nominal dengan mutasi rekening sebelum menyetujui.</p>
          {pendingPayments.map((payment) => (
            <div
              key={payment.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-amber-200 rounded-[8px] px-4 py-3"
            >
              <div className="text-[13px]">
                <p className="font-semibold text-slate-900">
                  {PAYMENT_TYPE_LABELS[payment.paymentType] ?? payment.paymentType} ·{" "}
                  <span className="font-mono tabular-nums">{formatRupiah(payment.amount)}</span>
                </p>
                <p className="text-[12px] text-slate-500">
                  {payment.paymentChannel || "Transfer bank"} · {formatDateTime(payment.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {payment.paymentUrl && (
                  <Button size="sm" variant="secondary" onClick={() => onAction(order, { type: "viewProof", payment })}>
                    Lihat bukti
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="danger"
                  disabled={disabled}
                  onClick={() => onAction(order, { type: "rejectProof", payment })}
                >
                  Tolak
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  disabled={disabled}
                  onClick={() => onAction(order, { type: "approveProof", payment })}
                >
                  Setujui
                </Button>
              </div>
            </div>
          ))}
        </section>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={whatsappHref(order.customerPhone)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            WhatsApp <span aria-hidden="true">↗</span>
          </a>
          <Button size="sm" variant="ghost" onClick={() => onAction(order, { type: "regenerateLink" })}>
            Buat tautan pelanggan baru
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {status === "WAITING_ADMIN_CONFIRMATION" && (
            <>
              <Button size="sm" variant="danger" disabled={disabled} onClick={() => onAction(order, { type: "reject" })}>
                Tolak pesanan
              </Button>
              <Button size="sm" variant="primary" disabled={disabled} onClick={() => onAction(order, { type: "lock" })}>
                Tentukan ongkir
              </Button>
            </>
          )}
          {nextStatus && (
            <Button
              size="sm"
              variant="primary"
              disabled={disabled}
              onClick={() => onAction(order, { type: "advance", next: nextStatus })}
            >
              {NEXT_STATUS_ACTION_LABELS[nextStatus]}
            </Button>
          )}
        </div>
      </footer>
    </article>
  );
}
