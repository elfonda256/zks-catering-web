"use client";

import { useState, useTransition, useActionState, useRef } from "react";
import { submitPaymentProofAction, type SubmitPaymentProofState } from "./actions";

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
    <div className="p-6 bg-white border-2 border-[#141413] space-y-6 mt-6">
      {/* Header Instruksi */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#141413]/10 pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#C85A17] font-semibold block">
            PEMBAYARAN DIVERIFIKASI
          </span>
          <h3 className="text-base sm:text-lg font-bold text-[#141413] tracking-tight mt-0.5">
            Total Tagihan Resmi Telah Dikunci Admin
          </h3>
        </div>
        {formattedDueDate && (
          <span className="font-mono text-xs text-[#C85A17] font-semibold">
            Batas Bayar: {formattedDueDate} WIB
          </span>
        )}
      </div>

      {/* Pilihan Nominal Tagihan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dpAmount && (
          <label
            onClick={() => setSelectedType("DP")}
            className={`p-4 border rounded cursor-pointer transition-all ${
              selectedType === "DP"
                ? "bg-[#FAF9F5] border-[#141413] ring-1 ring-[#141413]"
                : "bg-white border-[#141413]/15 hover:border-[#141413]/40"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#626058]">
                Opsi A — Uang Muka (DP 20%)
              </span>
              <span
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  selectedType === "DP"
                    ? "border-[#141413] bg-[#141413]"
                    : "border-neutral-300"
                }`}
              >
                {selectedType === "DP" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
            </div>
            <p className="font-mono text-2xl font-extrabold text-[#141413]">
              Rp{dpAmount.toLocaleString("id-ID")}
            </p>
            <p className="text-[11px] text-[#626058] mt-1 leading-relaxed">
              Mengunci kuota boiler dapur & armada. Pelunasan sisa tagihan paling lambat H-1 pukul 23:59 WIB.
            </p>
          </label>
        )}

        <label
          onClick={() => setSelectedType("FULL")}
          className={`p-4 border rounded cursor-pointer transition-all ${
            selectedType === "FULL"
              ? "bg-[#FAF9F5] border-[#141413] ring-1 ring-[#141413]"
              : "bg-white border-[#141413]/15 hover:border-[#141413]/40"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#626058]">
              {dpAmount ? "Opsi B — Pelunasan Penuh (100%)" : "Pembayaran Lunas Penuh (100%)"}
            </span>
            <span
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                selectedType === "FULL"
                  ? "border-[#141413] bg-[#141413]"
                  : "border-neutral-300"
              }`}
            >
              {selectedType === "FULL" && (
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </span>
          </div>
          <p className="font-mono text-2xl font-extrabold text-[#C85A17]">
            Rp{totalAmount?.toLocaleString("id-ID")}
          </p>
          <p className="text-[11px] text-[#626058] mt-1 leading-relaxed">
            Mencakup seluruh subtotal porsi makanan dan ongkos kirim resmi armada Karawang.
          </p>
        </label>
      </div>

      {/* Rekening Bank Perusahaan */}
      <div className="space-y-3 pt-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#141413] font-semibold block">
          Tujuan Transfer Rekening Resmi Perusahaan (BCA &amp; Mandiri)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/10 space-y-0.5">
            <p className="font-mono font-bold text-[#141413]">BANK MANDIRI</p>
            <p className="font-mono text-base font-bold text-[#141413] tracking-wider">
              173-00-1122334-5
            </p>
            <p className="text-[11px] text-[#626058]">a.n. PT. Zahdan Kamal Sentosa</p>
          </div>
          <div className="p-3.5 bg-[#FAF9F5] border border-[#141413]/10 space-y-0.5">
            <p className="font-mono font-bold text-[#141413]">BANK BCA</p>
            <p className="font-mono text-base font-bold text-[#141413] tracking-wider">
              109-8877-665
            </p>
            <p className="text-[11px] text-[#626058]">a.n. PT. Zahdan Kamal Sentosa</p>
          </div>
        </div>
        <p className="text-[11px] text-[#626058] font-mono">
          *Cantumkan Berita Transfer: <strong>{orderCode}</strong>
        </p>
      </div>

      {/* Formulir Unggah Bukti Transfer */}
      <form
        action={(formData) => {
          if (processedFile) {
            formData.set("proofFile", processedFile);
          }
          startTransition(() => {
            formAction(formData);
          });
        }}
        className="space-y-4 pt-4 border-t border-[#141413]/10"
      >
        <input type="hidden" name="paymentType" value={selectedType} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141413] mb-1">
              Bank Pengirim Anda
            </label>
            <select
              required
              name="senderBank"
              className="w-full text-xs p-2.5 bg-[#FAF9F5] border border-[#141413]/20 rounded text-[#141413] focus:outline-none focus:border-[#141413]"
            >
              <option value="">-- Pilih Bank Pengirim --</option>
              <option value="BCA">BCA (Bank Central Asia)</option>
              <option value="Mandiri">Bank Mandiri</option>
              <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
              <option value="BNI">BNI (Bank Negara Indonesia)</option>
              <option value="CIMB Niaga">CIMB Niaga</option>
              <option value="Bank Permata">Bank Permata</option>
              <option value="BSI">BSI (Bank Syariah Indonesia)</option>
              <option value="Lainnya">Bank Lainnya / Dompet Digital</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141413] mb-1">
              Nama Pemilik Rekening Pengirim
            </label>
            <input
              type="text"
              required
              name="senderName"
              placeholder="Sesuai nama di buku tabungan / m-Banking"
              className="w-full text-xs p-2.5 bg-[#FAF9F5] border border-[#141413]/20 rounded text-[#141413] focus:outline-none focus:border-[#141413]"
            />
          </div>
        </div>

        {/* Upload File Input with Drag / Click Visual */}
        <div>
          <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141413] mb-1">
            Unggah Berkas Bukti Transfer (Foto / Tangkapan Layar)
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#141413]/20 hover:border-[#141413] p-5 text-center rounded bg-[#FAF9F5] cursor-pointer transition-colors"
          >
            <input
              ref={fileInputRef}
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
                  alt="Pratinjau Bukti Transfer"
                  className="max-h-48 mx-auto rounded border border-[#141413]/10 object-contain"
                />
                <p className="font-mono text-xs text-emerald-800 font-semibold">
                  ✓ {selectedFileName}
                </p>
                <p className="text-[10px] text-[#626058]">Klik untuk mengganti foto</p>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="font-mono text-xs text-[#141413] font-semibold block">
                  📁 Klik di sini untuk memilih foto bukti transfer
                </span>
                <p className="text-[11px] text-[#626058]">
                  Format berkas: JPG, PNG, atau WebP (Maksimal 5 MB)
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141413] mb-1">
            Catatan Tambahan (Opsional)
          </label>
          <input
            type="text"
            name="notes"
            placeholder="Contoh: Transfer via m-BCA jam 10:15 WIB"
            className="w-full text-xs p-2.5 bg-[#FAF9F5] border border-[#141413]/20 rounded text-[#141413] focus:outline-none focus:border-[#141413]"
          />
        </div>

        {/* Feedback State */}
        {state.error && (
          <div className="p-3 text-xs bg-red-50 text-red-800 border border-red-200 rounded font-mono">
            ⚠ {state.error}
          </div>
        )}

        {state.success && (
          <div className="p-3 text-xs bg-emerald-50 text-emerald-900 border border-emerald-300 rounded font-mono">
            ✓ {state.message}
          </div>
        )}

        {/* Tombol Kirim */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#141413] hover:bg-neutral-800 text-[#FAF9F5] text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            {isPending ? "Mengunggah Berkas..." : "Kirim Bukti Pembayaran ke Sistem ↗"}
          </button>
        </div>
      </form>
    </div>
  );
}
