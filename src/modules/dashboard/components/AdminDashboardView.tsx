"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import {
  approvePaymentAction,
  lockOrderTotalAction,
  regenerateOrderTokenAction,
  rejectOrderAction,
  rejectPaymentAction,
  updateOrderStatusAction,
  type AdminActionResult,
} from "@/app/admin/dashboard/actions";
import type { AdminOrderData, AdminOrderPayment } from "../types";
import { ORDER_STATUS_LABELS, ORDER_TABS, PAYMENT_TYPE_LABELS, type OrderStatusValue } from "../constants";
import { useDashboard } from "../hooks/useDashboard";
import { OrderCard, type OrderCardAction } from "./OrderCard";
import { Button } from "@/shared/components/ui/Button";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Input } from "@/shared/components/ui/Input";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { Modal } from "@/shared/components/ui/Modal";
import { ListToolbar } from "@/shared/components/ui/ListToolbar";
import { formatRupiah } from "@/shared/utils/formatters";

interface AdminDashboardViewProps {
  orders: AdminOrderData[];
}

type Dialog =
  | { type: "lock"; order: AdminOrderData }
  | { type: "reject"; order: AdminOrderData }
  | { type: "advance"; order: AdminOrderData; next: OrderStatusValue }
  | { type: "regenerateLink"; order: AdminOrderData }
  | { type: "viewProof"; order: AdminOrderData; payment: AdminOrderPayment }
  | { type: "approveProof"; order: AdminOrderData; payment: AdminOrderPayment }
  | { type: "rejectProof"; order: AdminOrderData; payment: AdminOrderPayment };

const TEXTAREA =
  "w-full rounded-[12px] border border-stone-200 bg-white p-3 text-[14px] text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-3 focus:ring-brand-500/15";

export default function AdminDashboardView({ orders }: AdminDashboardViewProps) {
  const { counts, tab, setTab, query, setQuery, filteredOrders } = useDashboard(orders);
  const [isPending, startTransition] = useTransition();

  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [shippingFee, setShippingFee] = useState("");
  const [reason, setReason] = useState("");
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [trackingUrl, setTrackingUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function openDialog(order: AdminOrderData, action: OrderCardAction) {
    setDialogError(null);
    setReason("");
    setTrackingUrl(null);
    setCopied(false);
    if (action.type === "lock") setShippingFee(order.shippingFee?.toString() ?? "");
    setDialog({ ...action, order } as Dialog);
  }

  function closeDialog() {
    if (!isPending) setDialog(null);
  }

  /** Runs a server action; closes the dialog on success, shows the error inside it otherwise. */
  function run(action: () => Promise<AdminActionResult>, onSuccess?: (res: AdminActionResult) => void) {
    setDialogError(null);
    startTransition(async () => {
      const res = await action();
      if (res.error) {
        setDialogError(res.error);
        return;
      }
      if (onSuccess) onSuccess(res);
      else setDialog(null);
    });
  }

  function handleLock(e: React.FormEvent, order: AdminOrderData) {
    e.preventDefault();
    const fee = Number(shippingFee);
    if (shippingFee.trim() === "" || !Number.isInteger(fee) || fee < 0) {
      setDialogError("Isi ongkos kirim dengan angka rupiah tanpa titik, misalnya 150000.");
      return;
    }
    run(() => lockOrderTotalAction(order.id, fee));
  }

  function handleReason(e: React.FormEvent, submit: (text: string) => Promise<AdminActionResult>) {
    e.preventDefault();
    const text = reason.trim();
    if (text.length < 5) {
      setDialogError("Tulis alasan minimal 5 karakter.");
      return;
    }
    run(() => submit(text));
  }

  function renderDialogFooter(confirmLabel: string, options: { danger?: boolean; form?: string; onConfirm?: () => void }) {
    return (
      <>
        <Button type="button" variant="secondary" onClick={closeDialog} disabled={isPending}>
          Batal
        </Button>
        <Button
          type={options.form ? "submit" : "button"}
          form={options.form}
          variant={options.danger ? "danger" : "primary"}
          onClick={options.onConfirm}
          disabled={isPending}
        >
          {isPending ? "Memproses..." : confirmLabel}
        </Button>
      </>
    );
  }

  const dialogErrorNode = dialogError && (
    <p role="alert" className="text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
      {dialogError}
    </p>
  );

  return (
    <div className="space-y-6">
      <section aria-label="Ringkasan pesanan" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Bukti bayar" tone="warning" value={counts.proof} subtext="Menunggu verifikasi" />
        <KpiCard label="Perlu ongkir" tone="brand" value={counts.shipping} subtext="Menunggu konfirmasi admin" />
        <KpiCard label="Menunggu bayar" value={counts.payment} subtext="Tagihan sudah dikirim" />
        <KpiCard label="Berjalan" tone="success" value={counts.active} subtext="Dibayar, dimasak, atau dikirim" />
      </section>

      <section aria-label="Daftar pesanan" className="space-y-4">
        <ListToolbar
          tabs={ORDER_TABS.map((t) => ({ ...t, count: counts[t.id] }))}
          tab={tab}
          onTabChange={setTab}
          query={query}
          onQueryChange={setQuery}
          searchPlaceholder="Cari kode, nama, telepon, alamat"
        />

        {filteredOrders.length === 0 ? (
          <EmptyState
            title={query ? "Pesanan tidak ditemukan" : "Tidak ada pesanan di sini"}
            description={
              query
                ? `Tidak ada pesanan yang cocok dengan "${query}".`
                : "Belum ada pesanan dengan status ini."
            }
            action={
              tab !== "all" || query ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setTab("all");
                    setQuery("");
                  }}
                >
                  Lihat semua pesanan
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} disabled={isPending} onAction={openDialog} />
            ))}
          </div>
        )}
      </section>

      {dialog?.type === "lock" && (
        <Modal
          isOpen
          onClose={closeDialog}
          title="Tentukan ongkir"
          subtitle={dialog.order.orderCode}
          footer={renderDialogFooter("Kunci & kirim tagihan", { form: "lock-form" })}
        >
          <form id="lock-form" onSubmit={(e) => handleLock(e, dialog.order)} className="space-y-4">
            <Input
              label="Ongkos kirim (Rp)"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={shippingFee}
              onChange={(e) => setShippingFee(e.target.value)}
              required
              autoFocus
              helperText={`Makanan ${formatRupiah(dialog.order.subtotal)}. Setelah dikunci, total tagihan dikirim ke pelanggan.`}
            />
            {dialogErrorNode}
          </form>
        </Modal>
      )}

      {dialog?.type === "reject" && (
        <Modal
          isOpen
          onClose={closeDialog}
          title="Tolak pesanan"
          subtitle={dialog.order.orderCode}
          footer={renderDialogFooter("Tolak pesanan", { danger: true, form: "reject-form" })}
        >
          <form
            id="reject-form"
            onSubmit={(e) => handleReason(e, (text) => rejectOrderAction(dialog.order.id, text))}
            className="space-y-2"
          >
            <label htmlFor="reject-reason" className="block text-[14px] font-medium text-stone-700">
              Alasan penolakan
            </label>
            <textarea
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              autoFocus
              placeholder="Contoh: kapasitas dapur pada tanggal itu sudah penuh"
              className={TEXTAREA}
            />
            <p className="text-[12px] text-stone-500">Alasan ini dikirim ke pelanggan.</p>
            {dialogErrorNode}
          </form>
        </Modal>
      )}

      {dialog?.type === "advance" && (
        <Modal
          isOpen
          onClose={closeDialog}
          title="Ubah status pesanan"
          subtitle={dialog.order.orderCode}
          footer={renderDialogFooter("Ya, ubah status", {
            onConfirm: () => run(() => updateOrderStatusAction(dialog.order.id, dialog.next)),
          })}
        >
          <p className="text-[14px] text-stone-700">
            Status berubah dari{" "}
            <strong>{ORDER_STATUS_LABELS[dialog.order.status as OrderStatusValue]?.label ?? dialog.order.status}</strong>{" "}
            menjadi <strong>{ORDER_STATUS_LABELS[dialog.next].label}</strong>. Pelanggan menerima pemberitahuan
            WhatsApp.
          </p>
          {dialogErrorNode}
        </Modal>
      )}

      {dialog?.type === "approveProof" && (
        <Modal
          isOpen
          onClose={closeDialog}
          title="Setujui bukti bayar"
          subtitle={dialog.order.orderCode}
          footer={renderDialogFooter("Setujui pembayaran", {
            onConfirm: () => run(() => approvePaymentAction(dialog.payment.id, dialog.order.id)),
          })}
        >
          <p className="text-[14px] text-stone-700">
            {PAYMENT_TYPE_LABELS[dialog.payment.paymentType] ?? dialog.payment.paymentType} sebesar{" "}
            <strong className="tabular-nums">{formatRupiah(dialog.payment.amount)}</strong> dicatat sebagai
            diterima. Pastikan dana sudah masuk ke rekening.
          </p>
          {dialogErrorNode}
        </Modal>
      )}

      {dialog?.type === "rejectProof" && (
        <Modal
          isOpen
          onClose={closeDialog}
          title="Tolak bukti bayar"
          subtitle={dialog.order.orderCode}
          footer={renderDialogFooter("Tolak bukti", { danger: true, form: "reject-proof-form" })}
        >
          <form
            id="reject-proof-form"
            onSubmit={(e) =>
              handleReason(e, (text) => rejectPaymentAction(dialog.payment.id, dialog.order.id, text))
            }
            className="space-y-2"
          >
            <label htmlFor="reject-proof-reason" className="block text-[14px] font-medium text-stone-700">
              Alasan penolakan
            </label>
            <textarea
              id="reject-proof-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              autoFocus
              placeholder="Contoh: nominal tidak sesuai atau foto bukti tidak terbaca"
              className={TEXTAREA}
            />
            {dialogErrorNode}
          </form>
        </Modal>
      )}

      {dialog?.type === "regenerateLink" && (
        <Modal
          isOpen
          onClose={closeDialog}
          title="Tautan pelanggan baru"
          subtitle={dialog.order.orderCode}
          footer={
            trackingUrl ? (
              <Button type="button" variant="secondary" onClick={closeDialog}>
                Tutup
              </Button>
            ) : (
              renderDialogFooter("Buat tautan baru", {
                onConfirm: () =>
                  run(
                    () => regenerateOrderTokenAction(dialog.order.id),
                    (res) => setTrackingUrl(res.trackingUrl ?? null)
                  ),
              })
            )
          }
        >
          {trackingUrl ? (
            <div className="space-y-3">
              <p className="text-[14px] text-stone-700">Tautan baru sudah dikirim ke WhatsApp pelanggan.</p>
              <input
                type="text"
                readOnly
                value={trackingUrl}
                aria-label="Tautan pelanggan"
                onFocus={(e) => e.currentTarget.select()}
                className="w-full font-mono text-[12px] bg-stone-50 border border-stone-200 rounded-[8px] px-3 py-2 text-stone-800"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    navigator.clipboard.writeText(trackingUrl).then(
                      () => setCopied(true),
                      () => setDialogError("Tautan tidak bisa disalin otomatis. Salin dari kolom di atas.")
                    );
                  }}
                >
                  {copied ? "Tersalin" : "Salin tautan"}
                </Button>
                <a
                  href={trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center gap-2 rounded-[8px] border border-stone-200 bg-white px-3 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Buka tautan <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          ) : (
            <p className="text-[14px] text-stone-700">
              Tautan lama langsung tidak berlaku. Tautan baru dikirim otomatis ke WhatsApp pelanggan.
            </p>
          )}
          {dialogErrorNode}
        </Modal>
      )}

      {dialog?.type === "viewProof" && dialog.payment.paymentUrl && (
        <Modal
          isOpen
          onClose={closeDialog}
          title="Bukti bayar"
          subtitle={`${dialog.order.orderCode} · ${formatRupiah(dialog.payment.amount)}`}
          maxWidth="2xl"
        >
          <div className="relative aspect-[4/3] w-full bg-stone-100 rounded-[8px] overflow-hidden border border-stone-200">
            <Image
              src={dialog.payment.paymentUrl}
              alt={`Bukti bayar ${dialog.order.orderCode}`}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
          <a
            href={dialog.payment.paymentUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex text-[13px] font-medium text-stone-700 underline decoration-stone-300 underline-offset-4 hover:text-stone-900"
          >
            Buka ukuran asli <span aria-hidden="true">↗</span>
          </a>
        </Modal>
      )}
    </div>
  );
}
