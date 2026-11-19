"use client";

import { useState, useTransition, useActionState, useRef } from "react";
import { submitPaymentProofAction, type SubmitPaymentProofState } from "./actions";
import { HEADING } from "@/components/site/ui";
import { FIELD_HINT, FIELD_INPUT, FIELD_LABEL } from "@/components/site/form";

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
  selected,
  onSelect,
  title,
  amount,
  description,
  accent = false,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  amount: number | null;
  description: string;
  accent?: boolean;
}) {
  return (
    <label
      onClick={onSelect}
      className={`block cursor-pointer rounded-[10px] border-2 p-5 transition-colors ${
        selected ? "border-[#C85A17] bg-[#C85A17]/15" : "border-white/15 bg-[#1A1F22] hover:border-white/40"
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="font-heading text-sm font-bold uppercase text-white/80">{title}</span>
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
            selected ? "border-[#C85A17] bg-[#C85A17]" : "border-white/40"
          }`}
          aria-hidden="true"
        >
          {selected && <span className="h-2 w-2 rounded-full bg-white" />}
        </span>
      </span>
      <span className={`${HEADING} mt-2 block text-3xl ${accent ? "text-[#E07A35]" : ""}`}>
        Rp{amount?.toLocaleString("id-ID")}
      </span>
      <span className={`${FIELD_HINT} mt-2 block leading-relaxed`}>{description}</span>
    </label>
  );
}

interface PaymentUploadClientProps {
  rawToken: string;
  orderCode: string;
  subtotal: number;
  totalAmount: number | null;
  dpAmount: number | null;
  initialPaymentDueAt: string | null;
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

export default function PaymentUploadClient({
  rawToken,
  orderCode,
  totalAmount,
  dpAmount,
  initialPaymentDueAt,
}: PaymentUploadClientProps) {
  const [selectedType, setSelectedType] = useState<"DP" | "FULL">(
    dpAmount ? "DP" : "FULL"
  );
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [processedFile, setProcessedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const formattedDueDate = initialPaymentDueAt
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Jakarta",
      }).format(new Date(initialPaymentDueAt))
    : null;

  return (
    <div className="mt-8 space-y-8 rounded-[10px] bg-[#232A2E] p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-2 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
        <div>
          <span className="font-heading text-sm font-bold uppercase text-[#E07A35]">Pembayaran</span>
          <h2 className={`${HEADING} mt-1 text-[1.75rem]`}>Total tagihan sudah dikunci admin</h2>
        </div>
        {formattedDueDate && (
          <span className="font-heading text-sm font-bold uppercase text-[#E07A35]">
            Batas bayar: {formattedDueDate} WIB
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {dpAmount && (
          <OptionCard
            selected={selectedType === "DP"}
            onSelect={() => setSelectedType("DP")}
            title="Opsi A · Uang muka (DP 20%)"
            amount={dpAmount}
            description="Mengunci kuota dapur dan armada. Pelunasan paling lambat H-1 pukul 23.59 WIB."
          />
        )}
        <OptionCard
          selected={selectedType === "FULL"}
          onSelect={() => setSelectedType("FULL")}
          title={dpAmount ? "Opsi B · Lunas penuh (100%)" : "Lunas penuh (100%)"}
          amount={totalAmount}
          description="Mencakup seluruh subtotal makanan dan ongkos kirim resmi armada."
          accent
        />
      </div>

      <div className="space-y-3">
        <span className={FIELD_LABEL}>Rekening tujuan transfer</span>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {COMPANY_ACCOUNTS.map((account) => (
            <div key={account.bank} className="rounded-[10px] border border-white/10 bg-[#1A1F22] p-4">
              <p className="font-heading text-sm font-bold uppercase text-white/80">{account.bank}</p>
              <p className="mt-1 font-mono text-lg font-bold tracking-wider text-white">{account.number}</p>
              <p className={FIELD_HINT}>a.n. PT. Zahdan Kamal Sentosa</p>
            </div>
          ))}
        </div>
        <p className={FIELD_HINT}>
          Cantumkan berita transfer: <strong className="font-mono text-white">{orderCode}</strong>
        </p>
      </div>

      <form
        action={(formData) => {
          if (processedFile) {
            formData.set("proofFile", processedFile);
          }
          startTransition(() => {
            formAction(formData);
          });
        }}
        className="space-y-5 border-t border-white/10 pt-6"
      >
        <input type="hidden" name="paymentType" value={selectedType} />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="senderBank" className={FIELD_LABEL}>
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
            <label htmlFor="senderName" className={FIELD_LABEL}>
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
          <label htmlFor="proofFile" className={FIELD_LABEL}>
            Bukti transfer (foto atau tangkapan layar)
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-[10px] border-2 border-dashed border-white/25 bg-[#1A1F22] p-6 text-center transition-colors hover:border-[#E07A35]"
          >
            <input
              ref={fileInputRef}
              id="proofFile"
              type="file"
              required
              name="proofFile"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />

            {filePreview ? (
              <div className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={filePreview}
                  alt="Pratinjau bukti transfer"
                  className="mx-auto max-h-48 rounded-[10px] object-contain"
                />
                <p className="text-sm font-semibold text-emerald-300">✓ {selectedFileName}</p>
                <p className={FIELD_HINT}>Klik untuk mengganti foto</p>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="block font-heading text-base font-bold uppercase">Klik untuk memilih foto</span>
                <p className={FIELD_HINT}>JPG, PNG, atau WebP, maksimal 5 MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="paymentNotes" className={FIELD_LABEL}>
            Catatan tambahan (opsional)
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
            ✓ {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-[#C85A17] px-8 font-heading text-base font-bold uppercase text-white transition-colors hover:bg-[#A4460E] disabled:opacity-50 sm:w-auto"
        >
          {isPending ? "Mengunggah berkas…" : "Kirim bukti pembayaran"}
        </button>
      </form>
    </div>
  );
}
