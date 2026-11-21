"use client";

import { useState, useTransition, useActionState } from "react";
import { submitPaymentProofAction, type SubmitPaymentProofState } from "./actions";
import { HEADING } from "@/components/site/ui";
import { FIELD_HINT, FIELD_INPUT, FIELD_LABEL } from "@/components/site/form";
import { CopyButton } from "./CopyButton";
import type { AmountDue } from "./payment-due";
import { formatRupiahCompact as formatRupiah } from "@/shared/utils/formatters";

const SENDER_BANKS = [
  { value: "BCA", label: "BCA (Bank Central Asia)" },
  { value: "Mandiri", label: "Bank Mandiri" },
  { value: "BRI", label: "BRI (Bank Rakyat Indonesia)" },
  { value: "BNI", label: "BNI (Bank Negara Indonesia)" },
  { value: "CIMB Niaga", label: "CIMB Niaga" },
  { value: "Bank Permata", label: "Bank Permata" },
  { value: "BSI", label: "BSI (Bank Syariah Indonesia)" },
  { value: "Lainnya", label: "Bank lainnya / dompet digital" },
];

// TODO(owner): confirm these are the company's real accounts before go-live.
const COMPANY_ACCOUNTS = [
  { bank: "Bank Mandiri", number: "173-00-1122334-5" },
  { bank: "Bank BCA", number: "109-8877-665" },
];

function OptionCard({
  value,
  selected,
  onSelect,
  title,
  amount,
  description,
}: {
  value: "DP" | "FULL";
  selected: boolean;
  onSelect: () => void;
  title: string;
  amount: number;
  description: string;
}) {
  return (
    <label
      className={`block cursor-pointer rounded-[10px] border-2 p-5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#E07A35] ${
        selected ? "border-[#C85A17] bg-[#C85A17]/15" : "border-white/15 bg-[#1A1F22] hover:border-white/40"
      }`}
    >
      <input
        type="radio"
        name="paymentChoice"
        value={value}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <span className="flex items-center justify-between gap-3">
        <span className="font-heading text-sm font-bold uppercase text-white/85">{title}</span>
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
            selected ? "border-[#C85A17] bg-[#C85A17]" : "border-white/40"
          }`}
          aria-hidden="true"
        >
          {selected && <span className="h-2 w-2 rounded-full bg-white" />}
        </span>
      </span>
      <span className={`${HEADING} mt-2 block text-3xl tabular-nums`}>{formatRupiah(amount)}</span>
      <span className={`${FIELD_HINT} mt-2 block leading-relaxed`}>{description}</span>
    </label>
  );
}

interface PaymentUploadClientProps {
  rawToken: string;
  orderCode: string;
  due: AmountDue;
  /** ISO time of the payment deadline, or null when it has passed. */
  dueAt: string | null;
}

function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const maxDim = 1200;
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
            type: "image/jpeg",
          });
          resolve(compressed);
        },
        "image/jpeg",
        0.8
      );
    };
    img.onerror = () => resolve(file);
    img.src = url;
  });
}

export default function PaymentUploadClient({ rawToken, orderCode, due, dueAt }: PaymentUploadClientProps) {
  const dpAmount = due.kind === "initial" ? due.dpAmount : null;
  const [selectedType, setSelectedType] = useState<"DP" | "FULL">(dpAmount ? "DP" : "FULL");
  const amountToPay =
    due.kind === "settlement" ? due.remaining : selectedType === "DP" && dpAmount ? dpAmount : due.totalAmount;
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [processedFile, setProcessedFile] = useState<File | null>(null);
  const [, startTransition] = useTransition();

  const boundAction = submitPaymentProofAction.bind(null, rawToken);
  const initialState: SubmitPaymentProofState = {};
  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      let fileToUpload = file;
      if (file.type.startsWith("image/")) {
        try {
          fileToUpload = await compressImage(file);
        } catch {
          fileToUpload = file;
        }
      }

      setProcessedFile(fileToUpload);
      setSelectedFileName(`${file.name} (${Math.round(fileToUpload.size / 1024)} KB)`);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(fileToUpload);
    } else {
      setFilePreview(null);
      setSelectedFileName(null);
      setProcessedFile(null);
    }
  };

  const formattedDueDate = dueAt
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Jakarta",
      }).format(new Date(dueAt))
    : null;

  return (
    <section aria-labelledby="payment-title" className="space-y-8 rounded-[10px] bg-[#232A2E] p-6 sm:p-8">
      <div className="space-y-1">
        <span className="font-heading text-sm font-bold uppercase text-[#E07A35]">Langkah berikutnya</span>
        <h2 id="payment-title" className={`${HEADING} text-[1.75rem]`}>
          {due.kind === "settlement" ? "Lunasi sisa tagihan" : "Bayar pesanan"}
        </h2>
        <p className={FIELD_HINT}>
          {formattedDueDate ? `Bayar sebelum ${formattedDueDate} WIB.` : "Mohon segera lakukan pembayaran."}
        </p>
      </div>

      {due.kind === "initial" && (
        <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <legend className="sr-only">Pilih jenis pembayaran</legend>
          {dpAmount !== null && dpAmount > 0 && (
            <OptionCard
              value="DP"
              selected={selectedType === "DP"}
              onSelect={() => setSelectedType("DP")}
              title="DP 20%"
              amount={dpAmount}
              description="Kunci jadwal dapur sekarang, lunasi sisanya paling lambat H-1 pukul 23.59 WIB."
            />
          )}
          <OptionCard
            value="FULL"
            selected={selectedType === "FULL"}
            onSelect={() => setSelectedType("FULL")}
            title="Lunas"
            amount={due.totalAmount}
            description="Makanan dan ongkos kirim dibayar sekaligus."
          />
        </fieldset>
      )}

      <div className="space-y-3">
        <h3 className={FIELD_LABEL}>1. Transfer ke salah satu rekening</h3>
        <ul className="divide-y divide-white/10 rounded-[10px] border border-white/10 bg-[#1A1F22]">
          <li className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm text-white/60">Nominal transfer</p>
              <p className="font-heading text-2xl font-extrabold tabular-nums text-[#E07A35]">{formatRupiah(amountToPay)}</p>
            </div>
            <CopyButton value={String(amountToPay)} label="nominal transfer" />
          </li>
          {COMPANY_ACCOUNTS.map((account) => (
            <li key={account.bank} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm text-white/60">{account.bank} · a.n. PT. Zahdan Kamal Sentosa</p>
                <p className="font-mono text-lg font-bold tracking-wider text-white">{account.number}</p>
              </div>
              <CopyButton value={account.number.replace(/[^0-9]/g, "")} label={`nomor rekening ${account.bank}`} />
            </li>
          ))}
          <li className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm text-white/60">Berita transfer</p>
              <p className="font-mono text-lg font-bold text-white">{orderCode}</p>
            </div>
            <CopyButton value={orderCode} label="kode pesanan" />
          </li>
        </ul>
      </div>

      <form
        onSubmit={(e) => {
          // Submit manually so a server error does not reset the fields React would clear after an action.
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          if (processedFile) {
            formData.set("proofFile", processedFile);
          }
          startTransition(() => {
            formAction(formData);
          });
        }}
        className="space-y-5"
      >
        <h3 className={FIELD_LABEL}>2. Kirim bukti transfer</h3>
        <input type="hidden" name="paymentType" value={due.kind === "settlement" ? "SETTLEMENT" : selectedType} />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="senderBank" className="block text-sm font-medium text-white/85">
              Bank pengirim
            </label>
            <select id="senderBank" required name="senderBank" className={FIELD_INPUT} defaultValue="">
              <option value="">Pilih bank pengirim</option>
              {SENDER_BANKS.map((bank) => (
                <option key={bank.value} value={bank.value}>
                  {bank.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="senderName" className="block text-sm font-medium text-white/85">
              Nama pemilik rekening
            </label>
            <input
              id="senderName"
              type="text"
              required
              name="senderName"
              placeholder="Sesuai nama di buku tabungan / m-Banking"
              className={FIELD_INPUT}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="proofFile" className="block text-sm font-medium text-white/85">
            Foto atau tangkapan layar bukti transfer
          </label>
          <div className="relative rounded-[10px] border-2 border-dashed border-white/25 bg-[#1A1F22] p-6 text-center transition-colors hover:border-[#E07A35] has-[:focus-visible]:border-[#E07A35]">
            <input
              id="proofFile"
              type="file"
              required
              name="proofFile"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleFileChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />

            {filePreview ? (
              <div className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={filePreview}
                  alt="Pratinjau bukti transfer"
                  className="mx-auto max-h-48 rounded-[10px] object-contain"
                />
                <p className="text-sm font-semibold text-emerald-300">{selectedFileName}</p>
                <p className={FIELD_HINT}>Ketuk untuk mengganti foto</p>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="block font-heading text-base font-bold uppercase">Pilih foto bukti</span>
                <p className={FIELD_HINT}>JPG, PNG, atau WebP, maksimal 5 MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="paymentNotes" className="block text-sm font-medium text-white/85">
            Catatan (opsional)
          </label>
          <input
            id="paymentNotes"
            type="text"
            name="notes"
            placeholder="Contoh: transfer via m-BCA pukul 10.15 WIB"
            className={FIELD_INPUT}
          />
        </div>

        {state.error && (
          <div role="alert" className="rounded-[10px] border-l-4 border-red-500 bg-red-500/10 p-4 text-[15px] text-red-100">
            {state.error}
          </div>
        )}

        {state.success && (
          <div role="status" className="rounded-[10px] border-l-4 border-emerald-500 bg-emerald-500/10 p-4 text-[15px] text-emerald-100">
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-[#C85A17] px-8 font-heading text-base font-bold uppercase text-white transition-colors hover:bg-[#A4460E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E07A35] disabled:opacity-50 sm:w-auto"
        >
          {isPending ? "Mengirim bukti…" : `Kirim bukti ${formatRupiah(amountToPay)}`}
        </button>
      </form>
    </section>
  );
}
