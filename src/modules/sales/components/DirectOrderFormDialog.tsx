"use client";

import { useState, useTransition } from "react";
import { createDirectOrderAction, type DirectOrderResult } from "@/app/admin/order-adhoc/actions";
import { MENU_PACKAGES } from "@/data/catering-data";
import { MIN_ORDER_PCS, earliestEventDateWib } from "@/lib/order-rules";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Modal } from "@/shared/components/ui/Modal";
import { SelectField } from "@/shared/components/ui/SelectField";
import { DIRECT_ORDER_SOURCES } from "../sources";
import type { DirectOrderSource } from "../types";

const PACKAGES = Object.values(MENU_PACKAGES).sort((a, b) => a.price - b.price);

export function DirectOrderFormDialog({ onClose }: { onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<DirectOrderResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [quantity, setQuantity] = useState("");
  const earliest = earliestEventDateWib(Math.max(Number(quantity) || 0, MIN_ORDER_PCS));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await createDirectOrderAction(form);
      if (result.error) setError(result.error);
      else setSaved(result);
    });
  }

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (saved?.trackingUrl) {
    return (
      <Modal
        isOpen
        onClose={onClose}
        title={`Pesanan ${saved.orderCode} tercatat`}
        subtitle="Lanjutkan di Dasbor: tetapkan ongkir lalu kunci total tagihan."
        maxWidth="2xl"
        footer={<Button onClick={onClose}>Selesai</Button>}
      >
        <p className="text-[13px] text-stone-700">
          {saved.whatsAppSent
            ? "Tautan pelacakan sudah dikirim ke WhatsApp pemesan."
            : "Tautan pelacakan belum terkirim lewat WhatsApp. Salin dan kirimkan ke pemesan:"}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <code className="flex-1 break-all rounded-[8px] border border-stone-200 bg-stone-50 px-3 py-2 text-[12px] text-stone-800">{saved.trackingUrl}</code>
          <Button variant="secondary" onClick={() => copyLink(saved.trackingUrl!)}>
            {copied ? "Tersalin" : "Salin tautan"}
          </Button>
        </div>
        <p className="text-[12px] text-stone-500">Tautan ini hanya ditampilkan sekali. Jika hilang, buat ulang dari kartu pesanan di Dasbor.</p>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen
      onClose={() => !isPending && onClose()}
      title="Catat pesanan langsung"
      subtitle="Aturan sama dengan form online: minimal porsi, jeda H-1 / H-3, dan harga paket dari server."
      maxWidth="2xl"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="direct-order-form" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan pesanan"}
          </Button>
        </>
      }
    >
      <form id="direct-order-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField name="source" label="Diterima lewat" required defaultValue="">
          <option value="" disabled>
            Pilih
          </option>
          {(Object.keys(DIRECT_ORDER_SOURCES) as DirectOrderSource[]).map((source) => (
            <option key={source} value={source}>
              {DIRECT_ORDER_SOURCES[source]}
            </option>
          ))}
        </SelectField>
        <Input id="do-name" name="customerName" label="Nama pemesan / perusahaan" required minLength={3} placeholder="PT Contoh Industri (Pak Yusuf, HRD)" />
        <Input id="do-phone" name="customerPhone" label="Telepon / WhatsApp" required inputMode="tel" placeholder="0812-3456-7890" />
        <Input id="do-email" name="customerEmail" type="email" label="Email" placeholder="Opsional" />
        <div className="sm:col-span-2">
          <Input id="do-address" name="customerAddress" label="Alamat pengantaran" required minLength={10} placeholder="Kawasan KIIC Jl. Permata Raya Lot ..., Karawang" />
        </div>
        <SelectField name="packagePrice" label="Paket" required defaultValue="">
          <option value="" disabled>
            Pilih paket
          </option>
          {PACKAGES.map((pkg) => (
            <option key={pkg.price} value={pkg.price}>
              {pkg.name} · Rp{pkg.price.toLocaleString("id-ID")}
            </option>
          ))}
        </SelectField>
        <Input
          id="do-qty"
          name="quantity"
          label="Porsi"
          required
          inputMode="numeric"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          helperText={`Minimal ${MIN_ORDER_PCS} porsi.`}
        />
        <Input id="do-date" name="eventDate" type="date" label="Tanggal acara" required min={earliest} helperText={`Paling cepat ${earliest}.`} />
        <Input id="do-time" name="eventTime" type="time" label="Jam acara (WIB)" required defaultValue="11:00" />
        <div className="sm:col-span-2">
          <Input id="do-notes" name="notes" label="Catatan" maxLength={300} placeholder="Opsional, misalnya diantar ke pos satpam gerbang 2" />
        </div>
        <label className="sm:col-span-2 flex cursor-pointer items-center gap-3 text-[14px] text-stone-700">
          <input type="checkbox" name="notifyCustomer" defaultChecked className="h-4 w-4 cursor-pointer accent-brand-500" />
          Kirim tautan pelacakan ke WhatsApp pemesan
        </label>
        {error && (
          <p role="alert" className="sm:col-span-2 text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
