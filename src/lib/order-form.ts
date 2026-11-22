/**
 * Customer order details shared by the public order form and admin-entered direct orders,
 * so both follow exactly the same business rules. Pure functions.
 */

import { MENU_PACKAGES } from "@/data/catering-data";
import { validateOrderLeadTime } from "@/lib/order-logic";
import { MIN_ORDER_PCS } from "@/lib/order-rules";

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export interface OrderDetails {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerEmail: string | null;
  /** Event date and time, from WIB input. */
  eventDate: Date;
  packagePrice: number;
  quantity: number;
  notes: string | null;
}

const PHONE = /^[0-9+-\s]{10,20}$/;

export function parseOrderDetails(formData: FormData, now: Date = new Date()): Result<OrderDetails> {
  const customerName = String(formData.get("customerName") || "").trim();
  const customerPhone = String(formData.get("customerPhone") || "").trim();
  const customerAddress = String(formData.get("customerAddress") || "").trim();
  const customerEmail = String(formData.get("customerEmail") || "").trim() || null;
  const eventDateStr = String(formData.get("eventDate") || "").trim();
  const eventTimeStr = String(formData.get("eventTime") || "").trim() || "11:00";
  const packagePrice = Number(formData.get("packagePrice") || 0);
  const quantity = Number(formData.get("quantity") || 0);
  const notes = String(formData.get("notes") || "").trim() || null;

  if (!customerName || customerName.length < 3) {
    return { ok: false, error: "Nama lengkap pemesan wajib diisi (minimal 3 karakter)." };
  }
  if (!customerPhone || !PHONE.test(customerPhone)) {
    return { ok: false, error: "Nomor telepon / WhatsApp tidak valid (minimal 10 digit angka)." };
  }
  if (!customerAddress || customerAddress.length < 10) {
    return { ok: false, error: "Alamat pengantaran di Karawang wajib diisi lengkap (minimal 10 karakter)." };
  }
  if (!MENU_PACKAGES[packagePrice]) {
    return { ok: false, error: "Paket katering yang dipilih tidak valid." };
  }
  if (!Number.isInteger(quantity) || quantity < MIN_ORDER_PCS) {
    return { ok: false, error: `Pemesanan katering minimal ${MIN_ORDER_PCS} porsi.` };
  }
  if (!eventDateStr) {
    return { ok: false, error: "Tanggal acara wajib dipilih." };
  }

  const [year, month, day] = eventDateStr.split("-").map(Number);
  const [hours, minutes] = eventTimeStr.split(":").map(Number);
  if (!year || !month || !day || isNaN(hours) || isNaN(minutes)) {
    return { ok: false, error: "Format tanggal atau waktu acara tidak valid." };
  }

  // WIB (UTC+7) to UTC
  const eventDate = new Date(Date.UTC(year, month - 1, day, hours - 7, minutes, 0));
  const leadTime = validateOrderLeadTime(eventDate, quantity, now);
  if (!leadTime.valid) {
    return { ok: false, error: leadTime.error || "Tanggal acara tidak memenuhi batas minimum pemesanan." };
  }

  return {
    ok: true,
    value: { customerName, customerPhone, customerAddress, customerEmail, eventDate, packagePrice, quantity, notes },
  };
}

/** WhatsApp message sent to the customer when a new order is recorded. */
export function newOrderWhatsAppText(order: {
  customerName: string;
  orderCode: string;
  packageName: string;
  quantity: number;
  subtotal: number;
  customerAddress: string;
  trackingUrl: string;
}): string {
  return (
    `*PT. ZAHDAN KAMAL SENTOSA*\n` +
    `_Konfirmasi Pengajuan Pesanan Katering_\n\n` +
    `Halo Bpk/Ibu *${order.customerName}*,\n` +
    `Terima kasih telah mengajukan pesanan katering industri di PT. Zahdan Kamal Sentosa.\n\n` +
    `📋 *Detail Pengajuan Pesanan:*\n` +
    `• Kode Pesanan : *${order.orderCode}*\n` +
    `• Paket Menu : ${order.packageName}\n` +
    `• Jumlah Porsi : ${order.quantity} Porsi\n` +
    `• Subtotal Makanan : Rp${order.subtotal.toLocaleString("id-ID")}\n` +
    `• Alamat Pabrik : ${order.customerAddress}\n\n` +
    `Tim operasional kami sedang meninjau pesanan Anda dan menghitung estimasi ongkos kirim resmi ke lokasi pabrik Anda.\n\n` +
    `🔗 *Tautan Pelacakan & Pembayaran:*\n` +
    `${order.trackingUrl}\n\n` +
    `_Simpan pesan dan tautan ini untuk memantau status pesanan dan melakukan pembayaran._`
  );
}
