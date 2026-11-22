"use server";

import { revalidatePath } from "next/cache";
import { MENU_PACKAGES } from "@/data/catering-data";
import { calculateSubtotal, generateOrderAccessToken, generateOrderCode } from "@/lib/order-logic";
import { newOrderWhatsAppText, parseOrderDetails } from "@/lib/order-form";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { getAppBaseUrl, sendWhatsAppMessage } from "@/lib/whatsapp";
import { ensurePackageMenuItem } from "@/modules/menu/package-menu-item";
import { isDirectOrderSource } from "@/modules/sales/sources";

export interface DirectOrderResult {
  error?: string;
  success?: boolean;
  orderCode?: string;
  /** Private tracking link for the customer; shown once so the admin can share it. */
  trackingUrl?: string;
  whatsAppSent?: boolean;
}

/**
 * Records an order taken by phone, WhatsApp, or in person. It follows the same rules as the
 * online form and starts at the same status, so the dashboard flow (shipping fee, payment,
 * production) is identical.
 */
export async function createDirectOrderAction(form: FormData): Promise<DirectOrderResult> {
  try {
    const admin = await requireAdmin();
    const source = String(form.get("source") ?? "");
    if (!isDirectOrderSource(source)) return { error: "Pilih dari mana pesanan diterima." };
    const details = parseOrderDetails(form);
    if (!details.ok) return { error: details.error };
    const order = details.value;

    const subtotal = calculateSubtotal(order.packagePrice, order.quantity);
    const orderCode = generateOrderCode(order.eventDate);
    const { rawToken, accessTokenHash } = generateOrderAccessToken();

    await prisma.$transaction(async (tx) => {
      const menuItem = await ensurePackageMenuItem(tx, order.packagePrice);
      await tx.order.create({
        data: {
          orderCode,
          accessTokenHash,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerAddress: order.customerAddress,
          customerEmail: order.customerEmail,
          eventDate: order.eventDate,
          totalPcs: order.quantity,
          subtotal,
          notes: order.notes,
          status: "WAITING_ADMIN_CONFIRMATION",
          source,
          createdById: Number(admin.id) || null,
          items: {
            create: [{ menuItemId: menuItem.id, quantity: order.quantity, unitPrice: order.packagePrice, subtotal, notes: order.notes }],
          },
        },
      });
    });

    const trackingUrl = `${getAppBaseUrl()}/pesanan/${rawToken}`;
    let whatsAppSent = false;
    if (form.get("notifyCustomer") === "on") {
      try {
        whatsAppSent = await sendWhatsAppMessage({
          targetPhone: order.customerPhone,
          message: newOrderWhatsAppText({
            customerName: order.customerName,
            orderCode,
            packageName: MENU_PACKAGES[order.packagePrice].name,
            quantity: order.quantity,
            subtotal,
            customerAddress: order.customerAddress,
            trackingUrl,
          }),
        });
      } catch (waErr) {
        console.warn("Gagal mengirim WA pesanan langsung:", waErr);
      }
    }

    revalidatePath("/admin/order-adhoc");
    revalidatePath("/admin/dashboard");
    return { success: true, orderCode, trackingUrl, whatsAppSent };
  } catch (err) {
    console.error("Gagal mencatat pesanan langsung:", err);
    return { error: "Pesanan belum tersimpan karena kendala sistem. Silakan coba lagi." };
  }
}
