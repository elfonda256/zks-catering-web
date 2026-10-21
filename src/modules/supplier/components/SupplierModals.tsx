"use client";

import React, { useState } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { Badge } from "@/shared/components/ui/Badge";
import { SUPPLIER_CATEGORIES } from "../constants";
import { formatRupiah } from "@/shared/utils/formatters";
import type { Supplier, ComplianceDoc } from "../types";

/* -------------------------------------------------------------
 * 1. New Supplier Modal
 * ----------------------------------------------------------- */
export interface NewSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (supplier: Supplier) => void;
}

export function NewSupplierModal({ isOpen, onClose, onSubmit }: NewSupplierModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(SUPPLIER_CATEGORIES[0]);
  const [city, setCity] = useState("Jakarta");
  const [address, setAddress] = useState("");
  const [picName, setPicName] = useState("");
  const [picRole, setPicRole] = useState("Sales Manager");
  const [phone, setPhone] = useState("+62 8");
  const [email, setEmail] = useState("");
  const [npwp, setNpwp] = useState("");
  const [nib, setNib] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [bankName, setBankName] = useState("Bank Central Asia (BCA)");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const randomId = "sup-" + Math.random().toString(36).substring(2, 7);
    const code = "SUP-" + Math.floor(100 + Math.random() * 900);

    const newSupplier: Supplier = {
      id: randomId,
      code,
      name: name.trim(),
      category,
      city: city.trim(),
      address: address.trim() || `Kawasan Industri Pangan, ${city}`,
      picName: picName.trim(),
      picRole: picRole.trim(),
      phone: phone.trim(),
      email: email.trim(),
      website: `https://${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.co.id`,
      npwp: npwp.trim() || "01.000.000.0-000.000",
      nib: nib.trim() || "9120000000000",
      taxStatus: "PKP",
      bankAccount: {
        bankName,
        accountNumber: accountNumber.trim() || "001-000-0000",
        accountHolder: accountHolder.trim() || name.trim(),
      },
      paymentTerms,
      leadTime: "2 Hari Kerja",
      deliverySchedule: "Senin s/d Jumat, 08:00 - 15:00 WIB",
      status: "ACTIVE",
      performance: {
        onTimeDeliveryPct: 95.0,
        orderFulfillmentPct: 98.0,
        avgLeadTimeDays: 2.0,
        qualityRating: 4.8,
        complaintRatePct: 0.5,
        avgResponseTimeHours: 2.0,
        priceStabilityScore: 90,
        monthlyTrends: [
          { month: "Agt 26", onTimePct: 94.0, qualityScore: 4.7, fulfillmentPct: 97.0 },
          { month: "Sep 26", onTimePct: 95.0, qualityScore: 4.8, fulfillmentPct: 98.0 },
          { month: "Okt 26", onTimePct: 95.0, qualityScore: 4.8, fulfillmentPct: 98.0 },
        ],
      },
      scorecard: {
        qualityScore: 92,
        deliveryScore: 92,
        priceScore: 90,
        serviceScore: 88,
        complianceScore: 95,
        overallScore: 91.6,
        tier: "SILVER",
      },
      risk: {
        expiredDocuments: false,
        lateDeliveries: false,
        highComplaintRate: false,
        priceIncreaseRisk: false,
        inactiveSupplier: false,
        singleSourceRisk: false,
        riskLevel: "LOW",
        advisories: ["Rekanan baru terdaftar. Lakukan evaluasi berkala setelah 3 kali pengiriman perdana."],
      },
      documents: [],
      purchaseHistory: [],
      communicationLogs: [
        {
          id: "log-init-" + Date.now(),
          type: "MEETING",
          timestamp: new Date().toLocaleDateString("id-ID") + " 10:00 WIB",
          subject: "Pendaftaran & Verifikasi Awal Rekanan Baru",
          notes: "Vendor didaftarkan ke portal SRM ZKS dan berkas legalitas awal telah diterima oleh tim pengadaan.",
          initiator: "Tim Procurement ZKS",
        },
      ],
    };

    onSubmit(newSupplier);
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrasi Rekanan Baru (New Supplier)"
      subtitle="Pendaftaran profil vendor, data legalitas perpajakan, dan kontak PIC"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="md:col-span-2">
            <label className="text-[#626058] font-mono block mb-1">
              Nama Resmi Perusahaan (PT/CV/Koperasi) *
            </label>
            <Input
              required
              placeholder="Contoh: PT Sumber Pangan Makmur"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Kategori Komoditas</label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {SUPPLIER_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Kota Domisili *</label>
            <Input
              required
              placeholder="Contoh: Jakarta Timur"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-[#626058] font-mono block mb-1">Alamat Kantor &amp; Pergudangan</label>
            <Input
              placeholder="Jl. Raya Industri Pangan No. 45"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Nama PIC Resmi *</label>
            <Input
              required
              placeholder="Contoh: Bpk. Arif Rahman"
              value={picName}
              onChange={(e) => setPicName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Jabatan PIC</label>
            <Input
              placeholder="Contoh: Key Account Executive"
              value={picRole}
              onChange={(e) => setPicRole(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">No. Telepon / WhatsApp *</label>
            <Input
              required
              placeholder="+62 812-3456-7890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Email Resmi *</label>
            <Input
              required
              type="email"
              placeholder="sales@panganmakmur.co.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Nomor Pokok Wajib Pajak (NPWP)</label>
            <Input
              placeholder="01.234.567.8-000.000"
              value={npwp}
              onChange={(e) => setNpwp(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Nomor Induk Berusaha (NIB)</label>
            <Input
              placeholder="9120001234567"
              value={nib}
              onChange={(e) => setNib(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Ketentuan Pembayaran</label>
            <Select
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
            >
              <option value="Net 30">Net 30 Hari</option>
              <option value="Net 14">Net 14 Hari</option>
              <option value="Net 7">Net 7 Hari</option>
              <option value="COD">Cash On Delivery (COD)</option>
              <option value="CBD">Cash Before Delivery (CBD)</option>
            </Select>
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Nama Bank Pembayaran</label>
            <Input
              placeholder="BCA / Mandiri / BNI / BRI"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Nomor Rekening Bank</label>
            <Input
              placeholder="Contoh: 123-456-7890"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Atas Nama Rekening</label>
            <Input
              placeholder="Contoh: PT Sumber Pangan Makmur"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-[#141413]/10 flex justify-end gap-2">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Daftarkan Supplier
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* -------------------------------------------------------------
 * 2. Edit Supplier Modal
 * ----------------------------------------------------------- */
export interface EditSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  onSave: (supplier: Supplier) => void;
}

export function EditSupplierModal({ isOpen, onClose, supplier, onSave }: EditSupplierModalProps) {
  if (!supplier) return null;

  return <EditSupplierForm supplier={supplier} onClose={onClose} onSave={onSave} isOpen={isOpen} />;
}

function EditSupplierForm({
  supplier,
  onClose,
  onSave,
  isOpen,
}: {
  supplier: Supplier;
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
  isOpen: boolean;
}) {
  const [name, setName] = useState(supplier.name);
  const [category, setCategory] = useState(supplier.category);
  const [city, setCity] = useState(supplier.city);
  const [address, setAddress] = useState(supplier.address);
  const [picName, setPicName] = useState(supplier.picName);
  const [picRole, setPicRole] = useState(supplier.picRole);
  const [phone, setPhone] = useState(supplier.phone);
  const [email, setEmail] = useState(supplier.email);
  const [paymentTerms, setPaymentTerms] = useState(supplier.paymentTerms);
  const [leadTime, setLeadTime] = useState(supplier.leadTime);
  const [deliverySchedule, setDeliverySchedule] = useState(supplier.deliverySchedule);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      ...supplier,
      name,
      category,
      city,
      address,
      picName,
      picRole,
      phone,
      email,
      paymentTerms,
      leadTime,
      deliverySchedule,
    });
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Profil: ${supplier.name} (${supplier.code})`}
      subtitle="Perbarui data kontak PIC, alamat kantor, jadwal pengiriman, dan ketentuan pembayaran"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="md:col-span-2">
            <label className="text-[#626058] font-mono block mb-1">Nama Perusahaan</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Kategori</label>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {SUPPLIER_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Kota Domisili</label>
            <Input required value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <label className="text-[#626058] font-mono block mb-1">Alamat Kantor &amp; Pergudangan</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">PIC Resmi</label>
            <Input required value={picName} onChange={(e) => setPicName(e.target.value)} />
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Jabatan PIC</label>
            <Input value={picRole} onChange={(e) => setPicRole(e.target.value)} />
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Telepon / WA</label>
            <Input required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Email</label>
            <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Ketentuan Pembayaran</label>
            <Select value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
              <option value="Net 30">Net 30 Hari</option>
              <option value="Net 14">Net 14 Hari</option>
              <option value="Net 7">Net 7 Hari</option>
              <option value="COD">COD</option>
              <option value="CBD">CBD</option>
            </Select>
          </div>

          <div>
            <label className="text-[#626058] font-mono block mb-1">Lead Time</label>
            <Input value={leadTime} onChange={(e) => setLeadTime(e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <label className="text-[#626058] font-mono block mb-1">Jadwal Pengiriman Resmi</label>
            <Input value={deliverySchedule} onChange={(e) => setDeliverySchedule(e.target.value)} />
          </div>
        </div>

        <div className="pt-3 border-t border-[#141413]/10 flex justify-end gap-2">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* -------------------------------------------------------------
 * 3. Document Preview Modal
 * ----------------------------------------------------------- */
export interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: ComplianceDoc | null;
  supplier: Supplier | null;
}

export function DocumentPreviewModal({ isOpen, onClose, document: doc, supplier }: DocumentPreviewModalProps) {
  if (!doc || !supplier) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Verifikasi Dokumen: ${doc.title}`}
      subtitle={`No: ${doc.docNumber} • ${supplier.name}`}
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs font-mono">
        <div className="p-4 bg-white border border-[#141413]/15 space-y-2">
          <div className="flex justify-between items-center border-b border-[#141413]/10 pb-2">
            <span className="font-bold text-[#141413]">Jenis Sertifikasi</span>
            <span className="bg-[#ECEBE4] px-2 py-0.5 border border-[#141413]/10">
              {doc.docType.replace(/_/g, " ")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#626058]">Nomor Register:</span>
            <strong className="text-[#141413]">{doc.docNumber}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#626058]">Badan Penerbit Resmi:</span>
            <span className="text-[#141413]">{doc.issuer}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#626058]">Masa Berlaku Hingga:</span>
            <strong className="text-[#141413]">{doc.expiryDate}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#626058]">Status Audit:</span>
            <Badge variant={doc.status === "VALID" ? "success" : "danger"} size="sm">
              {doc.status}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#626058]">Ukuran Berkas:</span>
            <span>{doc.fileSize} (PDF Terverifikasi Digital)</span>
          </div>
        </div>

        {/* Mock visual document preview certificate box */}
        <div className="p-8 bg-[#FAF9F5] border-2 border-dashed border-[#141413]/20 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#141413]/5 flex items-center justify-center text-lg">
            📜
          </div>
          <div className="font-bold text-sm text-[#141413]">{doc.title}</div>
          <div className="text-[11px] text-[#626058] max-w-sm mx-auto">
            Sertifikat ini telah ditinjau dan divalidasi oleh Auditor Mutu ZKS sesuai standar HACCP / ISO 22000.
          </div>
          <div className="pt-2">
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-1">
              ✓ Digital Signature Verified (SHA-256 Valid)
            </span>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Tutup
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => alert(`Mengunduh salinan berkas resmi ${doc.title}...`)}
          >
            Download Dokumen Resmi (PDF)
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* -------------------------------------------------------------
 * 4. Create Purchase Order Modal
 * ----------------------------------------------------------- */
export interface CreatePOModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

export function CreatePOModal({ isOpen, onClose, supplier }: CreatePOModalProps) {
  const [draftPONumber] = useState("PO-202610-8812");
  const [deliveryDate, setDeliveryDate] = useState("2026-10-25");

  if (!supplier) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Buat Purchase Order (PO): ${supplier.name}`}
      subtitle={`Penerbitan PO Resmi • Kode Vendor: ${supplier.code} • Termin: ${supplier.paymentTerms}`}
      maxWidth="xl"
    >
      <div className="space-y-4 text-xs font-mono">
        <div className="p-4 bg-white border border-[#141413]/15 space-y-2">
          <div className="flex justify-between">
            <span className="text-[#626058]">Nomor Draft PO:</span>
            <strong className="text-[#141413]">
              {draftPONumber}
            </strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#626058]">Rekanan Dituju:</span>
            <strong className="text-[#141413]">{supplier.name}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#626058]">Lead Time Pengiriman:</span>
            <span>{supplier.leadTime} ({supplier.deliverySchedule})</span>
          </div>
        </div>

        <div>
          <label className="text-[#626058] block mb-1">Rincian Komoditas / Bahan Baku yang Dipesan</label>
          <textarea
            rows={3}
            className="w-full bg-white border border-[#141413]/20 p-2 text-xs font-mono"
            placeholder="Contoh: 500 kg Fillet Dada Ayam @ Rp 48.000, 200 kg Paha Bawah @ Rp 38.000..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[#626058] block mb-1">Estimasi Tanggal Pengiriman</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full bg-white border border-[#141413]/20 p-2 text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-[#626058] block mb-1">Gudang Tujuan Penerimaan</label>
            <select className="w-full bg-white border border-[#141413]/20 p-2 text-xs font-mono">
              <option>Cold Storage Utama (Freezer Walk-in)</option>
              <option>Chiller Dapur Sentral</option>
              <option>Gudang Kering &amp; Sembako</option>
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-[#141413]/10 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              alert(`Purchase Order resmi berhasil diterbitkan dan dikirimkan ke email ${supplier.email}!`);
              onClose();
            }}
          >
            Rilis PO ke Supplier →
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* -------------------------------------------------------------
 * 5. Print Profile Modal
 * ----------------------------------------------------------- */
export interface PrintProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

export function PrintProfileModal({ isOpen, onClose, supplier }: PrintProfileModalProps) {
  if (!supplier) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pratinjau Cetak: ${supplier.name}`}
      subtitle="Digital Supplier Dossier Format Resmi PT. Zahdan Kamal Sentosa"
      maxWidth="xl"
    >
      <div className="space-y-4 text-xs font-mono p-4 bg-white border border-[#141413]/20">
        <div className="border-b-2 border-[#141413] pb-3 flex justify-between items-start">
          <div>
            <h2 className="text-base font-bold text-[#141413]">PT. ZAHDAN KAMAL SENTOSA</h2>
            <p className="text-[10px] text-[#626058]">
              SUPPLIER RELATIONSHIP MANAGEMENT (SRM) AUDIT DOSSIER
            </p>
          </div>
          <div className="text-right">
            <span className="font-bold text-[#141413]">{supplier.code}</span>
            <div className="text-[10px] text-[#626058]">{new Date().toLocaleDateString("id-ID")}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <strong className="text-[#626058]">Nama Vendor:</strong> {supplier.name}
          </div>
          <div>
            <strong className="text-[#626058]">Kategori:</strong> {supplier.category}
          </div>
          <div>
            <strong className="text-[#626058]">NPWP:</strong> {supplier.npwp}
          </div>
          <div>
            <strong className="text-[#626058]">PIC:</strong> {supplier.picName} ({supplier.phone})
          </div>
          <div>
            <strong className="text-[#626058]">Termin:</strong> {supplier.paymentTerms}
          </div>
          <div>
            <strong className="text-[#626058]">Overall Score:</strong> {supplier.scorecard.overallScore} / 100 ({supplier.scorecard.tier})
          </div>
        </div>

        <div className="border-t border-[#141413]/10 pt-3">
          <strong className="text-[#141413] block mb-1">Riwayat Transaksi Terakhir:</strong>
          {supplier.purchaseHistory.slice(0, 2).map((po) => (
            <div key={po.id} className="flex justify-between text-[10px] border-b border-[#141413]/5 py-1">
              <span>{po.poNumber} ({po.orderDate}) - {po.itemsSummary}</span>
              <strong>{formatRupiah(po.totalValue)}</strong>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              window.print();
            }}
          >
            Cetak Dokumen (Ctrl+P)
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* -------------------------------------------------------------
 * 6. Import Supplier Dialog
 * ----------------------------------------------------------- */
export function ImportSupplierModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Master Data Rekanan (CSV / Excel)"
      subtitle="Unggah berkas spreadsheet daftar pemasok sesuai template resmi SRM"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs font-mono">
        <div className="p-6 border-2 border-dashed border-[#141413]/20 text-center space-y-2 bg-[#FAF9F5]">
          <div className="text-xl">📁</div>
          <div className="font-bold text-[#141413]">Pilih berkas CSV atau XLSX</div>
          <div className="text-[11px] text-[#626058]">Maksimal ukuran berkas 10 MB</div>
          <input type="file" accept=".csv,.xlsx" className="block w-full text-xs mx-auto pt-2" />
        </div>

        <div className="p-3 bg-white border border-[#141413]/10 text-[11px] text-[#626058]">
          Format kolom yang didukung: <code>Kode, Nama, Kategori, PIC, Telepon, Email, Kota, NPWP, Bank, NoRek, Termin</code>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              alert("Proses import selesai. 0 data duplikat ditemukan.");
              onClose();
            }}
          >
            Mulai Impor Data
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* -------------------------------------------------------------
 * 7. Export Supplier Dialog
 * ----------------------------------------------------------- */
export function ExportSupplierModal({
  isOpen,
  onClose,
  totalCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  totalCount: number;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Direktori Rekanan &amp; Laporan Kinerja"
      subtitle={`Ekspor data ${totalCount} rekanan terdaftar ke format analisis operasional`}
      maxWidth="md"
    >
      <div className="space-y-4 text-xs font-mono">
        <div className="space-y-2">
          <label className="text-[#626058] block">Pilih Format Berkas</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-white border border-[#141413]/20 cursor-pointer hover:border-[#141413]">
              <strong className="block text-[#141413]">Excel Spreadsheet (.xlsx)</strong>
              <span className="text-[11px] text-[#626058]">Lengkap dengan metrik scorecard</span>
            </div>
            <div className="p-3 bg-white border border-[#141413]/20 cursor-pointer hover:border-[#141413]">
              <strong className="block text-[#141413]">Adobe PDF Report (.pdf)</strong>
              <span className="text-[11px] text-[#626058]">Format siap cetak untuk audit</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              alert("Berkas laporan rekanan berhasil diunduh.");
              onClose();
            }}
          >
            Unduh Berkas Ekspor
          </Button>
        </div>
      </div>
    </Modal>
  );
}
