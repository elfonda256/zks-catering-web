"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/components/ui/Table";
import { formatRupiah } from "@/shared/utils/formatters";
import { getSupplierStatusBadge, getTierBadge } from "../utils";
import type { Supplier, CommunicationType, SupplierStatus } from "../types";

export interface SupplierProfileDossierProps {
  supplier: Supplier;
  onEditSupplier: (supplier: Supplier) => void;
  onUpdateStatus: (id: string, status: SupplierStatus) => void;
  onCreatePO: (supplier: Supplier) => void;
  onPrintProfile: (supplier: Supplier) => void;
  onPreviewDoc: (docId: string, supplier: Supplier) => void;
  onAddCommLog: (supplierId: string, log: { type: CommunicationType; subject: string; notes: string; initiator: string }) => void;
}

export function SupplierProfileDossier({
  supplier,
  onEditSupplier,
  onUpdateStatus,
  onCreatePO,
  onPrintProfile,
  onPreviewDoc,
  onAddCommLog,
}: SupplierProfileDossierProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "documents" | "performance" | "scorecard" | "orders" | "communications" | "risk"
  >("overview");

  // New communication log state
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [newLogType, setNewLogType] = useState<CommunicationType>("CALL");
  const [newLogSubject, setNewLogSubject] = useState("");
  const [newLogNotes, setNewLogNotes] = useState("");
  const [newLogInitiator, setNewLogInitiator] = useState("Budi Santoso (Procurement Lead)");

  const statusBadge = getSupplierStatusBadge(supplier.status);
  const tierInfo = getTierBadge(supplier.scorecard.tier);

  function handleSaveLog(e: React.FormEvent) {
    e.preventDefault();
    if (!newLogSubject.trim() || !newLogNotes.trim()) return;

    onAddCommLog(supplier.id, {
      type: newLogType,
      subject: newLogSubject.trim(),
      notes: newLogNotes.trim(),
      initiator: newLogInitiator.trim(),
    });

    setNewLogSubject("");
    setNewLogNotes("");
    setIsAddingLog(false);
  }

  return (
    <div className="space-y-6">
      {/* Dossier Header & Quick Controls */}
      <div className="bg-white border border-[#141413]/15 p-5 md:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#141413]/10 pb-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#141413] bg-[#ECEBE4] px-2 py-0.5 border border-[#141413]/15">
                {supplier.code}
              </span>
              <Badge variant={statusBadge.variant} size="sm">
                {statusBadge.label}
              </Badge>
              <span className={`px-2 py-0.5 text-xs font-mono uppercase tracking-wider border ${tierInfo.className}`}>
                {tierInfo.label}
              </span>
              <span className="text-xs font-mono text-[#626058] px-2 py-0.5 bg-[#141413]/5 border border-[#141413]/10">
                {supplier.category}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#141413] tracking-tight">
              {supplier.name}
            </h2>
            <p className="text-xs text-[#626058] font-mono">
              Domisili: {supplier.city} • Kontak PIC: {supplier.picName} ({supplier.phone}) • NPWP: {supplier.npwp}
            </p>
          </div>

          {/* SECTION 10: Actions Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditSupplier(supplier)}
            >
              ✎ Edit Supplier
            </Button>

            {supplier.status === "SUSPENDED" ? (
              <Button
                variant="outline"
                size="sm"
                className="text-emerald-700 hover:text-emerald-800"
                onClick={() => onUpdateStatus(supplier.id, "ACTIVE")}
              >
                ✓ Aktifkan Kembali
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="text-rose-700 hover:text-rose-800"
                onClick={() => onUpdateStatus(supplier.id, "SUSPENDED")}
              >
                ⚠ Suspend Rekanan
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPrintProfile(supplier)}
            >
              ⎙ Print Dossier
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => onCreatePO(supplier)}
            >
              + Buat PO Baru
            </Button>
          </div>
        </div>

        {/* Tab Navigation across all sections */}
        <div className="flex flex-wrap items-center gap-1 pt-4 border-b border-[#141413]/10 text-xs font-mono">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-2 border-b-2 font-bold uppercase tracking-wider transition-all ${
              activeTab === "overview"
                ? "border-[#141413] text-[#141413] bg-[#141413]/5"
                : "border-transparent text-[#626058] hover:text-[#141413]"
            }`}
          >
            Profil Perusahaan
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-3 py-2 border-b-2 font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "documents"
                ? "border-[#141413] text-[#141413] bg-[#141413]/5"
                : "border-transparent text-[#626058] hover:text-[#141413]"
            }`}
          >
            <span>Dokumen Kepatuhan</span>
            <span className="w-4 h-4 rounded-full bg-[#141413]/10 text-[10px] flex items-center justify-center font-bold">
              {supplier.documents.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`px-3 py-2 border-b-2 font-bold uppercase tracking-wider transition-all ${
              activeTab === "performance"
                ? "border-[#141413] text-[#141413] bg-[#141413]/5"
                : "border-transparent text-[#626058] hover:text-[#141413]"
            }`}
          >
            Kinerja &amp; Tren
          </button>
          <button
            onClick={() => setActiveTab("scorecard")}
            className={`px-3 py-2 border-b-2 font-bold uppercase tracking-wider transition-all ${
              activeTab === "scorecard"
                ? "border-[#141413] text-[#141413] bg-[#141413]/5"
                : "border-transparent text-[#626058] hover:text-[#141413]"
            }`}
          >
            Scorecard ({supplier.scorecard.overallScore})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3 py-2 border-b-2 font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "orders"
                ? "border-[#141413] text-[#141413] bg-[#141413]/5"
                : "border-transparent text-[#626058] hover:text-[#141413]"
            }`}
          >
            <span>Riwayat PO</span>
            <span className="w-4 h-4 rounded-full bg-[#141413]/10 text-[10px] flex items-center justify-center font-bold">
              {supplier.purchaseHistory.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("communications")}
            className={`px-3 py-2 border-b-2 font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "communications"
                ? "border-[#141413] text-[#141413] bg-[#141413]/5"
                : "border-transparent text-[#626058] hover:text-[#141413]"
            }`}
          >
            <span>Log Komunikasi</span>
            <span className="w-4 h-4 rounded-full bg-[#141413]/10 text-[10px] flex items-center justify-center font-bold">
              {supplier.communicationLogs.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("risk")}
            className={`px-3 py-2 border-b-2 font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === "risk"
                ? "border-[#141413] text-[#141413] bg-[#141413]/5"
                : "border-transparent text-[#626058] hover:text-[#141413]"
            }`}
          >
            <span>Analisis Risiko</span>
            {supplier.risk.riskLevel === "HIGH" && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* SECTION 03: Supplier Profile Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Identity & Legalities */}
          <Card className="p-6 bg-white border border-[#141413]/15 shadow-2xs space-y-4">
            <CardHeader className="p-0 pb-3 border-b border-[#141413]/10">
              <CardTitle className="text-base font-bold text-[#141413]">
                Legalitas &amp; Identitas Entitas
              </CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-[#626058] block">Kode Supplier</span>
                <span className="font-bold text-[#141413]">{supplier.code}</span>
              </div>
              <div>
                <span className="text-[#626058] block">Kategori Komoditas</span>
                <span className="font-bold text-[#141413]">{supplier.category}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#626058] block">Nama Resmi Perusahaan</span>
                <span className="font-bold text-[#141413]">{supplier.name}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#626058] block">Alamat Kantor &amp; Gudang</span>
                <span className="text-[#141413]">{supplier.address}, {supplier.city}</span>
              </div>
              <div>
                <span className="text-[#626058] block">Nomor NPWP</span>
                <span className="font-bold text-[#141413]">{supplier.npwp}</span>
              </div>
              <div>
                <span className="text-[#626058] block">Nomor Induk Berusaha (NIB)</span>
                <span className="font-bold text-[#141413]">{supplier.nib}</span>
              </div>
              <div>
                <span className="text-[#626058] block">Status Perpajakan</span>
                <span className="font-bold text-[#141413]">{supplier.taxStatus} (Faktur Pajak 11%)</span>
              </div>
              <div>
                <span className="text-[#626058] block">Situs Web Resmi</span>
                <a
                  href={supplier.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline truncate block"
                >
                  {supplier.website}
                </a>
              </div>
            </div>
          </Card>

          {/* Commercial & Logistics Parameters */}
          <Card className="p-6 bg-white border border-[#141413]/15 shadow-2xs space-y-4">
            <CardHeader className="p-0 pb-3 border-b border-[#141413]/10">
              <CardTitle className="text-base font-bold text-[#141413]">
                Parameter Komersial &amp; Logistik
              </CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-[#626058] block">PIC Perusahaan</span>
                <span className="font-bold text-[#141413]">{supplier.picName}</span>
                <span className="text-[11px] text-[#626058] block">{supplier.picRole}</span>
              </div>
              <div>
                <span className="text-[#626058] block">Kontak Telepon / WhatsApp</span>
                <span className="font-bold text-[#141413]">{supplier.phone}</span>
                <span className="text-[11px] text-[#626058] block">{supplier.email}</span>
              </div>
              <div className="col-span-2 p-3 bg-[#FAF9F5] border border-[#141413]/10">
                <span className="text-[#626058] block text-[11px]">Rekening Bank Pembayaran Resmi</span>
                <span className="font-bold text-[#141413] text-sm">{supplier.bankAccount.bankName}</span>
                <div className="text-xs text-[#141413] mt-0.5">
                  No. Rek: <strong className="font-mono">{supplier.bankAccount.accountNumber}</strong> a.n. {supplier.bankAccount.accountHolder}
                </div>
              </div>
              <div>
                <span className="text-[#626058] block">Ketentuan Pembayaran</span>
                <span className="font-bold text-[#141413]">{supplier.paymentTerms}</span>
              </div>
              <div>
                <span className="text-[#626058] block">Lead Time Pemesanan</span>
                <span className="font-bold text-[#141413]">{supplier.leadTime}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#626058] block">Jadwal Pengiriman Resmi</span>
                <span className="font-bold text-[#141413]">{supplier.deliverySchedule}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* SECTION 04: Compliance Documents */}
      {activeTab === "documents" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-[#141413]">
              Dokumen Kepatuhan &amp; Sertifikasi Higiene ({supplier.documents.length})
            </h3>
            <span className="text-xs text-[#626058] font-mono">
              Audit Kepatuhan ISO 22000 &amp; Regulasi Halal BPJPH
            </span>
          </div>

          {supplier.documents.length === 0 ? (
            <Card className="p-8 text-center text-xs font-mono text-[#626058]">
              Belum ada dokumen kepatuhan yang diunggah untuk rekanan ini.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supplier.documents.map((doc) => {
                const isExpired = doc.status === "EXPIRED";
                const isExpiring = doc.status === "EXPIRING_SOON";

                return (
                  <Card
                    key={doc.id}
                    className={`p-5 bg-white border transition-all ${
                      isExpired
                        ? "border-rose-400 bg-rose-50/20"
                        : isExpiring
                        ? "border-amber-400 bg-amber-50/20"
                        : "border-[#141413]/15"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider bg-[#ECEBE4] px-1.5 py-0.5 border border-[#141413]/10 font-bold">
                          {doc.docType.replace(/_/g, " ")}
                        </span>
                        <h4 className="text-sm font-bold text-[#141413] tracking-tight">
                          {doc.title}
                        </h4>
                        <div className="text-xs font-mono text-[#626058]">
                          No. Dokumen: <strong>{doc.docNumber}</strong>
                        </div>
                        <div className="text-[11px] text-[#626058]">
                          Penerbit: {doc.issuer} • Ukuran: {doc.fileSize}
                        </div>
                      </div>

                      <Badge
                        variant={isExpired ? "danger" : isExpiring ? "warning" : "success"}
                        size="sm"
                      >
                        {isExpired
                          ? "EXPIRED"
                          : isExpiring
                          ? "EXPIRING SOON"
                          : "VALID"}
                      </Badge>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#141413]/10 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-[#626058]">Berlaku Hingga: </span>
                        <strong className={isExpired ? "text-rose-700" : "text-[#141413]"}>
                          {doc.expiryDate}
                        </strong>
                        <span className="text-[10px] text-[#626058] ml-1.5">
                          ({doc.reminderDays > 0 ? `${doc.reminderDays} hari lagi` : "Kedaluwarsa"})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onPreviewDoc(doc.id, supplier)}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => alert(`Mengunduh berkas resmi ${doc.title}...`)}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 05: Performance Dashboard */}
      {activeTab === "performance" && (
        <div className="space-y-6">
          {/* KPI Matrix Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <Card className="p-3 bg-white border border-[#141413]/15 text-center">
              <span className="text-[10px] font-mono uppercase text-[#626058] block">On-Time Delivery</span>
              <span className="text-lg font-bold font-mono text-emerald-700 mt-1 block">
                {supplier.performance.onTimeDeliveryPct}%
              </span>
              <span className="text-[9px] font-mono text-[#626058]">Target ≥ 95%</span>
            </Card>

            <Card className="p-3 bg-white border border-[#141413]/15 text-center">
              <span className="text-[10px] font-mono uppercase text-[#626058] block">Fulfillment Rate</span>
              <span className="text-lg font-bold font-mono text-emerald-700 mt-1 block">
                {supplier.performance.orderFulfillmentPct}%
              </span>
              <span className="text-[9px] font-mono text-[#626058]">Target ≥ 98%</span>
            </Card>

            <Card className="p-3 bg-white border border-[#141413]/15 text-center">
              <span className="text-[10px] font-mono uppercase text-[#626058] block">Avg Lead Time</span>
              <span className="text-lg font-bold font-mono text-[#141413] mt-1 block">
                {supplier.performance.avgLeadTimeDays} <span className="text-xs font-normal">hari</span>
              </span>
              <span className="text-[9px] font-mono text-[#626058]">SLA terverifikasi</span>
            </Card>

            <Card className="p-3 bg-white border border-[#141413]/15 text-center">
              <span className="text-[10px] font-mono uppercase text-[#626058] block">Rating Kualitas</span>
              <span className="text-lg font-bold font-mono text-[#141413] mt-1 block">
                {supplier.performance.qualityRating} <span className="text-xs font-normal">/ 5.0</span>
              </span>
              <span className="text-[9px] font-mono text-[#626058]">Inspeksi QC Dock</span>
            </Card>

            <Card className="p-3 bg-white border border-[#141413]/15 text-center">
              <span className="text-[10px] font-mono uppercase text-[#626058] block">Complaint Rate</span>
              <span className="text-lg font-bold font-mono text-amber-700 mt-1 block">
                {supplier.performance.complaintRatePct}%
              </span>
              <span className="text-[9px] font-mono text-[#626058]">Maks 1.5%</span>
            </Card>

            <Card className="p-3 bg-white border border-[#141413]/15 text-center">
              <span className="text-[10px] font-mono uppercase text-[#626058] block">Waktu Respon</span>
              <span className="text-lg font-bold font-mono text-[#141413] mt-1 block">
                {supplier.performance.avgResponseTimeHours} <span className="text-xs font-normal">jam</span>
              </span>
              <span className="text-[9px] font-mono text-[#626058]">SLA Komunikasi</span>
            </Card>

            <Card className="p-3 bg-white border border-[#141413]/15 text-center">
              <span className="text-[10px] font-mono uppercase text-[#626058] block">Stabilitas Harga</span>
              <span className="text-lg font-bold font-mono text-[#141413] mt-1 block">
                {supplier.performance.priceStabilityScore} <span className="text-xs font-normal">/ 100</span>
              </span>
              <span className="text-[9px] font-mono text-[#626058]">Index Volatilitas</span>
            </Card>
          </div>

          {/* Historical Trend Bar Charts */}
          <Card className="p-6 bg-white border border-[#141413]/15 shadow-2xs space-y-4">
            <CardHeader className="p-0 pb-3 border-b border-[#141413]/10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-[#141413]">
                  Tren Kinerja Pengiriman Bulanan (6 Bulan Terakhir)
                </CardTitle>
                <p className="text-xs text-[#626058] font-mono mt-0.5">
                  Tingkat ketepatan waktu pengiriman (On-Time Delivery %) dan pemenuhan kuota (Fulfillment %)
                </p>
              </div>
            </CardHeader>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-2">
              {supplier.performance.monthlyTrends.map((trend) => (
                <div
                  key={trend.month}
                  className="p-3 bg-[#FAF9F5] border border-[#141413]/10 flex flex-col justify-between space-y-3"
                >
                  <div className="font-mono text-xs font-bold text-[#141413] border-b border-[#141413]/10 pb-1">
                    {trend.month}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-[#626058]">
                        <span>On-Time:</span>
                        <strong className="text-emerald-700">{trend.onTimePct}%</strong>
                      </div>
                      <div className="w-full bg-[#141413]/10 h-1.5 mt-1 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full"
                          style={{ width: `${trend.onTimePct}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-[#626058]">
                        <span>Pemenuhan:</span>
                        <strong className="text-blue-700">{trend.fulfillmentPct}%</strong>
                      </div>
                      <div className="w-full bg-[#141413]/10 h-1.5 mt-1 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full"
                          style={{ width: `${trend.fulfillmentPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* SECTION 08: Supplier Scorecard */}
      {activeTab === "scorecard" && (
        <Card className="p-6 bg-white border border-[#141413]/15 shadow-2xs space-y-6">
          <CardHeader className="p-0 pb-3 border-b border-[#141413]/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-[#141413]">
                Weighted Supplier Scorecard (Evaluasi Bobot Penilaian)
              </CardTitle>
              <p className="text-xs text-[#626058] font-mono mt-0.5">
                Kriteria standar audit pengadaan katering industri ZKS berdasarkan ISO 9001 &amp; ISO 22000
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] font-mono text-[#626058] block">Overall Score</span>
                <span className="text-2xl font-bold font-mono text-[#141413]">
                  {supplier.scorecard.overallScore} <span className="text-xs text-[#626058]">/ 100</span>
                </span>
              </div>
              <span className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border ${tierInfo.className}`}>
                {tierInfo.label}
              </span>
            </div>
          </CardHeader>

          <div className="space-y-4">
            {/* Quality Score */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>
                  <strong>1. Kualitas Bahan Baku &amp; Higiene</strong> (Bobot 30%)
                </span>
                <strong className="font-bold text-[#141413]">
                  {supplier.scorecard.qualityScore} / 100
                </strong>
              </div>
              <div className="w-full bg-[#141413]/10 h-2">
                <div
                  className="bg-[#141413] h-full"
                  style={{ width: `${supplier.scorecard.qualityScore}%` }}
                />
              </div>
            </div>

            {/* Delivery Score */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>
                  <strong>2. Ketepatan Waktu Pengiriman &amp; Suhu Cold Chain</strong> (Bobot 25%)
                </span>
                <strong className="font-bold text-[#141413]">
                  {supplier.scorecard.deliveryScore} / 100
                </strong>
              </div>
              <div className="w-full bg-[#141413]/10 h-2">
                <div
                  className="bg-[#141413] h-full"
                  style={{ width: `${supplier.scorecard.deliveryScore}%` }}
                />
              </div>
            </div>

            {/* Price Score */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>
                  <strong>3. Daya Saing Harga &amp; Stabilitas Penawaran</strong> (Bobot 20%)
                </span>
                <strong className="font-bold text-[#141413]">
                  {supplier.scorecard.priceScore} / 100
                </strong>
              </div>
              <div className="w-full bg-[#141413]/10 h-2">
                <div
                  className="bg-[#141413] h-full"
                  style={{ width: `${supplier.scorecard.priceScore}%` }}
                />
              </div>
            </div>

            {/* Service Score */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>
                  <strong>4. Kecepatan Layanan &amp; Penanganan Komplain</strong> (Bobot 15%)
                </span>
                <strong className="font-bold text-[#141413]">
                  {supplier.scorecard.serviceScore} / 100
                </strong>
              </div>
              <div className="w-full bg-[#141413]/10 h-2">
                <div
                  className="bg-[#141413] h-full"
                  style={{ width: `${supplier.scorecard.serviceScore}%` }}
                />
              </div>
            </div>

            {/* Compliance Score */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>
                  <strong>5. Kelengkapan Kepatuhan Regulasi &amp; Sertifikat Halal</strong> (Bobot 10%)
                </span>
                <strong className="font-bold text-[#141413]">
                  {supplier.scorecard.complianceScore} / 100
                </strong>
              </div>
              <div className="w-full bg-[#141413]/10 h-2">
                <div
                  className="bg-[#141413] h-full"
                  style={{ width: `${supplier.scorecard.complianceScore}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* SECTION 06: Purchase History */}
      {activeTab === "orders" && (
        <Card className="p-6 bg-white border border-[#141413]/15 shadow-2xs space-y-4">
          <CardHeader className="p-0 pb-3 border-b border-[#141413]/10 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-[#141413]">
                Riwayat Transaksi Purchase Order ({supplier.purchaseHistory.length})
              </CardTitle>
              <p className="text-xs text-[#626058] font-mono mt-0.5">
                Semua pesanan pengadaan yang pernah dirilis ke {supplier.name}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreatePO(supplier)}
            >
              + Rilis PO Baru
            </Button>
          </CardHeader>

          {supplier.purchaseHistory.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-[#626058]">
              Belum ada riwayat Purchase Order untuk rekanan ini.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. PO</TableHead>
                  <TableHead>Tgl Pesan</TableHead>
                  <TableHead>Tgl Terima</TableHead>
                  <TableHead>Rincian Barang</TableHead>
                  <TableHead className="text-right">Nilai Tagihan (IDR)</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplier.purchaseHistory.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-mono font-bold text-xs text-[#141413]">
                      {po.poNumber}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-[#626058]">
                      {po.orderDate}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-[#626058]">
                      {po.deliveryDate}
                    </TableCell>
                    <TableCell className="text-xs text-[#141413]">
                      <span className="font-semibold block">{po.itemsCount} Macam Bahan Baku:</span>
                      <span className="text-[11px] text-[#626058]">{po.itemsSummary}</span>
                    </TableCell>
                    <TableCell className="font-mono font-bold text-xs text-[#141413] text-right">
                      {formatRupiah(po.totalValue)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success" size="sm">
                        {po.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      )}

      {/* SECTION 07: Communication Log */}
      {activeTab === "communications" && (
        <Card className="p-6 bg-white border border-[#141413]/15 shadow-2xs space-y-6">
          <CardHeader className="p-0 pb-3 border-b border-[#141413]/10 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-[#141413]">
                Buku Log Komunikasi &amp; Audit Interaksi ({supplier.communicationLogs.length})
              </CardTitle>
              <p className="text-xs text-[#626058] font-mono mt-0.5">
                Rekaman panggilan, rapat tender, investigasi komplain, dan surat tindakan korektif (CAPA)
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingLog(!isAddingLog)}
            >
              {isAddingLog ? "Batal Tambah" : "+ Catat Interaksi Baru"}
            </Button>
          </CardHeader>

          {/* New log entry form */}
          {isAddingLog && (
            <form onSubmit={handleSaveLog} className="p-4 bg-[#FAF9F5] border border-[#141413]/15 space-y-3 text-xs font-mono">
              <div className="font-bold text-[#141413] uppercase tracking-wider">
                Catat Interaksi Baru dengan Rekanan
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[#626058] block mb-1">Tipe Interaksi</label>
                  <select
                    value={newLogType}
                    onChange={(e) => setNewLogType(e.target.value as CommunicationType)}
                    className="w-full bg-white border border-[#141413]/20 p-2 text-xs"
                  >
                    <option value="CALL">Panggilan Telepon (Call)</option>
                    <option value="EMAIL">Surat Elektronik (Email)</option>
                    <option value="MEETING">Rapat Resmi / Kunjungan Pabrik (Meeting)</option>
                    <option value="COMPLAINT">Keluhan Mutu / Keterlambatan (Complaint)</option>
                    <option value="CORRECTIVE_ACTION">Tindakan Korektif (CAPA)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[#626058] block mb-1">Subjek / Agenda Pembahasan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pembahasan Fluktuasi Harga Telur Q4..."
                    value={newLogSubject}
                    onChange={(e) => setNewLogSubject(e.target.value)}
                    className="w-full bg-white border border-[#141413]/20 p-2 text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#626058] block mb-1">Catatan Hasil &amp; Kesepakatan</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Rincian hasil komunikasi, komitmen waktu, atau tindak lanjut teknis..."
                  value={newLogNotes}
                  onChange={(e) => setNewLogNotes(e.target.value)}
                  className="w-full bg-white border border-[#141413]/20 p-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[#626058] block mb-1">Petugas Pencatat (Inisiator ZKS)</label>
                <input
                  type="text"
                  value={newLogInitiator}
                  onChange={(e) => setNewLogInitiator(e.target.value)}
                  className="w-full bg-white border border-[#141413]/20 p-2 text-xs font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddingLog(false)}>
                  Batal
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Simpan ke Log Audit
                </Button>
              </div>
            </form>
          )}

          {/* Timeline list */}
          {supplier.communicationLogs.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-[#626058]">
              Belum ada riwayat komunikasi yang dicatat untuk rekanan ini.
            </div>
          ) : (
            <div className="space-y-4 border-l-2 border-[#141413]/15 pl-4 ml-2">
              {supplier.communicationLogs.map((log) => {
                const typeColor = {
                  CALL: "bg-blue-100 text-blue-900 border-blue-300",
                  EMAIL: "bg-purple-100 text-purple-900 border-purple-300",
                  MEETING: "bg-emerald-100 text-emerald-900 border-emerald-300",
                  COMPLAINT: "bg-rose-100 text-rose-900 border-rose-300",
                  CORRECTIVE_ACTION: "bg-amber-100 text-amber-900 border-amber-300",
                }[log.type];

                return (
                  <div key={log.id} className="relative space-y-1.5">
                    {/* Dot on timeline */}
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#141413] border-2 border-white" />

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border font-bold ${typeColor}`}>
                        {log.type.replace(/_/g, " ")}
                      </span>
                      <span className="font-mono text-xs text-[#626058]">
                        {log.timestamp}
                      </span>
                      <span className="text-xs text-[#626058]">oleh</span>
                      <strong className="text-xs font-mono text-[#141413]">
                        {log.initiator}
                      </strong>
                    </div>

                    <h4 className="text-sm font-bold text-[#141413]">
                      {log.subject}
                    </h4>

                    <p className="text-xs text-[#626058] bg-[#FAF9F5] p-3 border border-[#141413]/10 leading-relaxed font-mono">
                      {log.notes}
                    </p>

                    {log.followUpDate && (
                      <div className="text-[11px] font-mono text-amber-800">
                        Target Tindak Lanjut: <strong>{log.followUpDate}</strong>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* SECTION 09: Risk Assessment */}
      {activeTab === "risk" && (
        <Card className="p-6 bg-white border border-[#141413]/15 shadow-2xs space-y-6">
          <CardHeader className="p-0 pb-3 border-b border-[#141413]/10 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-[#141413]">
                Matriks Penilaian Risiko Rantai Pasok (Supply Chain Risk Matrix)
              </CardTitle>
              <p className="text-xs text-[#626058] font-mono mt-0.5">
                Deteksi otomatis kerentanan pasokan, keabsahan dokumen hukum, dan konsentrasi vendor
              </p>
            </div>
            <Badge
              variant={
                supplier.risk.riskLevel === "HIGH"
                  ? "danger"
                  : supplier.risk.riskLevel === "MEDIUM"
                  ? "warning"
                  : "success"
              }
              size="md"
            >
              RISIKO {supplier.risk.riskLevel}
            </Badge>
          </CardHeader>

          {/* 6 Core Risk Factor Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* 1. Expired Documents */}
            <div className={`p-4 border ${supplier.risk.expiredDocuments ? "border-rose-400 bg-rose-50" : "border-[#141413]/15 bg-white"}`}>
              <div className="text-xs font-mono font-bold text-[#141413] flex items-center justify-between">
                <span>Dokumen Kedaluwarsa</span>
                <span>{supplier.risk.expiredDocuments ? "⚠ PERINGATAN" : "✓ VALID"}</span>
              </div>
              <p className="text-[11px] text-[#626058] mt-1">
                {supplier.risk.expiredDocuments
                  ? "Terdapat sertifikat uji mutu atau izin edar yang telah lewat masa berlaku."
                  : "Semua izin usaha dan sertifikat halal dalam masa aktif sah."}
              </p>
            </div>

            {/* 2. Late Deliveries */}
            <div className={`p-4 border ${supplier.risk.lateDeliveries ? "border-amber-400 bg-amber-50" : "border-[#141413]/15 bg-white"}`}>
              <div className="text-xs font-mono font-bold text-[#141413] flex items-center justify-between">
                <span>Keterlambatan Armada</span>
                <span>{supplier.risk.lateDeliveries ? "⚠ ANOMALI" : "✓ ON-TIME"}</span>
              </div>
              <p className="text-[11px] text-[#626058] mt-1">
                {supplier.risk.lateDeliveries
                  ? "Frekuensi keterlambatan > 10% mengganggu jadwal marinasi dapur."
                  : "Pengiriman konsisten sesuai jendela waktu penerimaan gudang."}
              </p>
            </div>

            {/* 3. High Complaint Rate */}
            <div className={`p-4 border ${supplier.risk.highComplaintRate ? "border-rose-400 bg-rose-50" : "border-[#141413]/15 bg-white"}`}>
              <div className="text-xs font-mono font-bold text-[#141413] flex items-center justify-between">
                <span>Tingkat Komplain QC</span>
                <span>{supplier.risk.highComplaintRate ? "⚠ TINGGI" : "✓ RENDAH"}</span>
              </div>
              <p className="text-[11px] text-[#626058] mt-1">
                {supplier.risk.highComplaintRate
                  ? "Tingkat penolakan barang di loading dock melebihi batas toleransi 2%."
                  : "Mutu organoleptik dan spesifikasi kemasan memenuhi standar ZKS."}
              </p>
            </div>

            {/* 4. Price Increase Risk */}
            <div className={`p-4 border ${supplier.risk.priceIncreaseRisk ? "border-amber-400 bg-amber-50" : "border-[#141413]/15 bg-white"}`}>
              <div className="text-xs font-mono font-bold text-[#141413] flex items-center justify-between">
                <span>Kenaikan Harga Komoditas</span>
                <span>{supplier.risk.priceIncreaseRisk ? "⚠ FLUKTUASI" : "✓ STABIL"}</span>
              </div>
              <p className="text-[11px] text-[#626058] mt-1">
                {supplier.risk.priceIncreaseRisk
                  ? "Komoditas terdampak kurs impor atau musim panen. Butuh kunci kontrak."
                  : "Harga terikat perjanjian tarif tetap (fixed price SLA) hingga akhir kuartal."}
              </p>
            </div>

            {/* 5. Inactive Supplier */}
            <div className={`p-4 border ${supplier.risk.inactiveSupplier ? "border-slate-400 bg-slate-50" : "border-[#141413]/15 bg-white"}`}>
              <div className="text-xs font-mono font-bold text-[#141413] flex items-center justify-between">
                <span>Status Keaktifan Transaksi</span>
                <span>{supplier.risk.inactiveSupplier ? "⚠ NON-AKTIF" : "✓ AKTIF"}</span>
              </div>
              <p className="text-[11px] text-[#626058] mt-1">
                {supplier.risk.inactiveSupplier
                  ? "Tidak ada transaksi dalam 90 hari terakhir. Perlu verifikasi ulang kontak."
                  : "Rekanan aktif bertransaksi secara rutin setiap siklus mingguan."}
              </p>
            </div>

            {/* 6. Single Source Risk */}
            <div className={`p-4 border ${supplier.risk.singleSourceRisk ? "border-amber-400 bg-amber-50" : "border-[#141413]/15 bg-white"}`}>
              <div className="text-xs font-mono font-bold text-[#141413] flex items-center justify-between">
                <span>Risiko Pemasok Tunggal</span>
                <span>{supplier.risk.singleSourceRisk ? "⚠ SINGLE SOURCE" : "✓ MULTI SOURCE"}</span>
              </div>
              <p className="text-[11px] text-[#626058] mt-1">
                {supplier.risk.singleSourceRisk
                  ? "Barang spesifik ini belum memiliki vendor cadangan terverifikasi."
                  : "Terdapat minimal 2 pemasok alternatif yang telah disetujui (AVL)."}
              </p>
            </div>
          </div>

          {/* Operational Mitigation Advisories */}
          <div className="p-4 bg-[#FAF9F5] border border-[#141413]/15 space-y-2">
            <div className="text-xs font-bold font-mono uppercase tracking-wider text-[#141413]">
              Rekomendasi Mitigasi Departemen Pengadaan &amp; Audit Mutu:
            </div>
            <ul className="text-xs font-mono text-[#626058] space-y-1.5 list-disc pl-4">
              {supplier.risk.advisories.map((advisory, idx) => (
                <li key={idx}>{advisory}</li>
              ))}
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
}
