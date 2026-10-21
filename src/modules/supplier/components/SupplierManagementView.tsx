"use client";

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { SupplierExecutiveCards } from "./SupplierExecutiveCards";
import { SupplierDirectoryTable } from "./SupplierDirectoryTable";
import { SupplierProfileDossier } from "./SupplierProfileDossier";
import {
  NewSupplierModal,
  EditSupplierModal,
  DocumentPreviewModal,
  CreatePOModal,
  PrintProfileModal,
  ImportSupplierModal,
  ExportSupplierModal,
} from "./SupplierModals";
import { useSupplier } from "../hooks/useSupplier";
import type { Supplier, ComplianceDoc } from "../types";

export default function SupplierManagementView() {
  const {
    suppliers,
    filteredSuppliers,
    selectedSupplier,
    selectedSupplierId,
    executiveMetrics,
    filter,
    setFilter,
    handleSelectSupplier,
    handleUpdateStatus,
    handleAddSupplier,
    handleUpdateSupplier,
    handleAddCommunicationLog,
  } = useSupplier();

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [isPreviewDocOpen, setIsPreviewDocOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<ComplianceDoc | null>(null);

  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [poSupplier, setPOSupplier] = useState<Supplier | null>(null);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printSupplier, setPrintSupplier] = useState<Supplier | null>(null);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Handlers
  function onEditSupplier(sup: Supplier) {
    setEditingSupplier(sup);
    setIsEditModalOpen(true);
  }

  function onCreatePO(sup: Supplier) {
    setPOSupplier(sup);
    setIsPOModalOpen(true);
  }

  function onPrintProfile(sup: Supplier) {
    setPrintSupplier(sup);
    setIsPrintModalOpen(true);
  }

  function onPreviewDoc(docId: string, sup: Supplier) {
    const foundDoc = sup.documents.find((d) => d.id === docId) || null;
    setPreviewDoc(foundDoc);
    setIsPreviewDocOpen(true);
  }

  return (
    <div className="space-y-6 pb-16">
      {/* QUICK ACTIONS TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 rounded-[12px] border border-slate-200 shadow-xs">
        <div className="text-[14px] text-slate-600">
          Kelola direktori mitra supplier, audit sertifikasi Halal &amp; ISO, serta histori transaksi PO.
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
          >
            Import Excel
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
          >
            Export Laporan
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNewModalOpen(true)}
          >
            + Daftarkan Supplier Baru
          </Button>
        </div>
      </div>

      {/* SECTION 01: Executive Summary */}
      <section className="space-y-3">
        <div className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">
          01. Ringkasan Kemitraan &amp; Pengadaan
        </div>
        <SupplierExecutiveCards metrics={executiveMetrics} />
      </section>

      {/* SECTION 02: Supplier Directory */}
      <section className="space-y-3">
        <div className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">
          02. Direktori Rekanan &amp; Penilaian Kinerja
        </div>
        <SupplierDirectoryTable
          suppliers={filteredSuppliers}
          selectedSupplierId={selectedSupplierId}
          onSelectSupplier={handleSelectSupplier}
          filter={filter}
          onFilterChange={setFilter}
          onOpenNewSupplier={() => setIsNewModalOpen(true)}
        />
      </section>

      {/* SECTIONS 03 - 10: Selected Supplier Digital Dossier */}
      {selectedSupplier && (
        <section className="space-y-3 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="text-[16px] font-semibold text-slate-900 tracking-tight">
              Profil &amp; Digital Passport: {selectedSupplier.name} ({selectedSupplier.code})
            </div>
            <span className="text-[12px] text-slate-400 font-mono">
              Single Source of Truth SRM
            </span>
          </div>

          <SupplierProfileDossier
            supplier={selectedSupplier}
            onEditSupplier={onEditSupplier}
            onUpdateStatus={handleUpdateStatus}
            onCreatePO={onCreatePO}
            onPrintProfile={onPrintProfile}
            onPreviewDoc={onPreviewDoc}
            onAddCommLog={handleAddCommunicationLog}
          />
        </section>
      )}

      {/* MODALS */}
      <NewSupplierModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleAddSupplier}
      />

      <EditSupplierModal
        isOpen={isEditModalOpen}
        supplier={editingSupplier}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateSupplier}
      />

      <DocumentPreviewModal
        isOpen={isPreviewDocOpen}
        document={previewDoc}
        supplier={selectedSupplier}
        onClose={() => setIsPreviewDocOpen(false)}
      />

      <CreatePOModal
        isOpen={isPOModalOpen}
        supplier={poSupplier}
        onClose={() => setIsPOModalOpen(false)}
      />

      <PrintProfileModal
        isOpen={isPrintModalOpen}
        supplier={printSupplier}
        onClose={() => setIsPrintModalOpen(false)}
      />

      <ImportSupplierModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <ExportSupplierModal
        isOpen={isExportModalOpen}
        totalCount={suppliers.length}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
