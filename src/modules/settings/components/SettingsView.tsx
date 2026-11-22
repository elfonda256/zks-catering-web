"use client";

import { useState, useTransition } from "react";
import { saveBankAccountsAction } from "@/app/admin/settings/actions";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { MAX_BANK_ACCOUNTS, type BankAccount } from "../bank-accounts";

export function SettingsView({ accounts }: { accounts: BankAccount[] }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setMessage(null);
    startTransition(async () => {
      const result = await saveBankAccountsAction(form);
      setMessage(result.error ? { ok: false, text: result.error } : { ok: true, text: "Rekening tersimpan dan langsung tampil di halaman pembayaran." });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section aria-labelledby="bank-title" className="rounded-[12px] border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
        <div className="space-y-1">
          <h2 id="bank-title" className="text-[15px] font-semibold text-slate-900">
            Rekening pembayaran
          </h2>
          <p className="text-[13px] text-slate-600">
            Tampil di halaman pembayaran pelanggan dan di pesan WhatsApp tagihan. Kosongkan satu baris untuk menghapusnya.
          </p>
        </div>

        {accounts.length === 0 && (
          <p className="rounded-[8px] border border-amber-200 bg-amber-50/70 px-3 py-2 text-[13px] text-amber-950">
            Belum ada rekening. Selama kosong, pelanggan diminta menunggu nomor rekening dari admin lewat WhatsApp.
          </p>
        )}

        {Array.from({ length: MAX_BANK_ACCOUNTS }, (_, i) => {
          const account = accounts[i];
          return (
            <fieldset key={i} className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 first-of-type:border-t-0 first-of-type:pt-0 sm:grid-cols-3">
              <legend className="sr-only">Rekening {i + 1}</legend>
              <Input id={`bank-${i}`} name={`bank-${i}`} label={`Bank ${i + 1}`} defaultValue={account?.bank} placeholder="BCA" />
              <Input id={`number-${i}`} name={`number-${i}`} label="Nomor rekening" inputMode="numeric" defaultValue={account?.number} />
              <Input id={`holder-${i}`} name={`holder-${i}`} label="Atas nama" defaultValue={account?.holder} placeholder="PT Zahdan Kamal Sentosa" />
            </fieldset>
          );
        })}
      </section>

      {message && (
        <p
          role={message.ok ? "status" : "alert"}
          className={`rounded-[12px] border px-4 py-3 text-[13px] ${
            message.ok ? "border-emerald-200 bg-emerald-50/70 text-emerald-950" : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : "Simpan pengaturan"}
        </Button>
      </div>
    </form>
  );
}
