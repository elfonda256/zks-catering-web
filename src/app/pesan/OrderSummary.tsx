import Image from "next/image";
import type { MenuPackage } from "@/data/catering-data";
import { PACKAGE_IMAGES } from "@/data/home-content";
import { ArrowUpRight } from "@/components/icons";
import { PRIMARY_BUTTON, SURFACE, formatRupiah } from "./order-form-ui";

/** DP is 20% of the food subtotal, delivery fee excluded (business rule; the server recomputes it). */
const DP_RATE = 0.2;

interface OrderSummaryProps {
  pkg: MenuPackage;
  quantity: number;
  scheduleLabel: string | null;
  error?: string;
  isPending: boolean;
}

export function OrderSummary({ pkg, quantity, scheduleLabel, error, isPending }: OrderSummaryProps) {
  const subtotal = pkg.price * (quantity || 0);
  const image = PACKAGE_IMAGES[pkg.price];

  return (
    <aside aria-labelledby="summary-title" className={`${SURFACE} space-y-6 p-6 sm:p-8`}>
      <h2 id="summary-title" className="font-heading text-xl font-extrabold uppercase">
        Ringkasan pesanan
      </h2>

      <div className="flex items-center gap-4">
        {image && (
          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[10px] bg-ink">
            <Image src={image.src} alt="" fill sizes="4rem" className="object-cover" />
          </span>
        )}
        <div className="min-w-0">
          <p className="font-heading text-base font-bold uppercase leading-tight">{pkg.name}</p>
          <p className="mt-1 text-sm text-white/70">
            {quantity || 0} porsi × {formatRupiah(pkg.price)}
          </p>
        </div>
      </div>

      <dl className="space-y-3 border-t border-white/10 pt-5 text-[15px]">
        <div className="flex justify-between gap-4">
          <dt className="text-white/70">Subtotal makanan</dt>
          <dd className="font-semibold tabular-nums">{formatRupiah(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-white/70">Ongkos kirim</dt>
          <dd className="text-white/85">Dihitung admin</dd>
        </div>
        {scheduleLabel && (
          <div className="flex justify-between gap-4">
            <dt className="text-white/70">Jadwal tiba</dt>
            <dd className="text-right text-white/85">{scheduleLabel}</dd>
          </div>
        )}
        <div className="flex items-end justify-between gap-4 border-t border-white/10 pt-4">
          <dt className="font-heading text-base font-extrabold uppercase">Estimasi</dt>
          <dd className="text-right">
            <span className="block font-heading text-3xl font-extrabold tabular-nums">{formatRupiah(subtotal)}</span>
            <span className="text-sm text-white/60">+ ongkos kirim</span>
          </dd>
        </div>
      </dl>

      <p className="rounded-[10px] bg-ink px-4 py-3 text-sm leading-relaxed text-white/75">
        Bisa bayar DP 20% dulu, sekitar{" "}
        <strong className="text-white">{formatRupiah(Math.round(subtotal * DP_RATE))}</strong>.
      </p>

      {error && (
        <div role="alert" className="rounded-[10px] border-l-4 border-red-500 bg-red-500/10 p-4 text-[15px] text-red-100">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="acceptTerms"
            required
            disabled={isPending}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-brand-500"
          />
          <span className="text-sm leading-relaxed text-white/85">Saya menyetujui ketentuan pemesanan.</span>
        </label>
        <details className="group text-sm text-white/70">
          <summary className="cursor-pointer font-medium text-white/85 underline decoration-white/30 underline-offset-4 hover:text-white">
            Lihat ketentuan
          </summary>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed">
            <li>Ongkos kirim ditetapkan admin setelah pesanan diperiksa.</li>
            <li>Bayar lunas, atau DP 20% dari subtotal makanan lalu lunasi paling lambat H-1.</li>
            <li>Pembatalan setelah DP: DP hangus. Setelah lunas: 20% hangus, sisanya dikembalikan.</li>
            <li>Pesanan yang tidak dibayar sampai batas waktu dianggap batal.</li>
          </ul>
        </details>
      </div>

      <button type="submit" disabled={isPending} className={`${PRIMARY_BUTTON} w-full`}>
        <span>{isPending ? "Mengirim pesanan…" : "Pesan sekarang"}</span>
        {!isPending && <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
      </button>

      <p className="text-center text-sm text-white/60">
        Belum ada pembayaran sekarang. Total tagihan dikirim lewat WhatsApp setelah admin menetapkan ongkir.
      </p>
    </aside>
  );
}
