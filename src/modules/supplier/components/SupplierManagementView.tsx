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
    <div className="space-y-8 pb-16">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#141413]/15 pb-6">
        <div className="space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#626058]">
            Enterprise SRM • PT. Zahdan Kamal Sentosa
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#141413] tracking-tight">
            Supplier Management
          </h1>
          <p className="text-xs text-[#626058] font-mono">
            Manage suppliers, evaluate performance, and maintain compliance.
          </p>
        </div>

        {/* Top Right Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
          >
            Import Supplier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
          >
            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNewModalOpen(true)}
          >
            + New Supplier
          </Button>
        </div>
      </div>

      {/* SECTION 01: Executive Summary */}
      <section className="space-y-2">
        <div className="text-xs font-mono uppercase tracking-wider text-[#626058] font-bold">
          01. Ringkasan Eksekutif Hubungan Pemasok (Executive Summary)
        </div>
        <SupplierExecutiveCards metrics={executiveMetrics} />
      </section>

      {/* SECTION 02: Supplier Directory */}
      <section className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-[#626058] font-bold">
          02. Direktori Rekanan &amp; Penilaian Kinerja (Supplier Directory)
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
        <section className="space-y-3 pt-4 border-t border-[#141413]/15">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-[#141413] font-bold">
              03 - 10. Digital Supplier Passport &amp; Kepatuhan: {selectedSupplier.name} ({selectedSupplier.code})
            </div>
            <span className="text-xs font-mono text-[#626058]">
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

      {/* Interactive Modals */}
      <NewSupplierModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleAddSupplier}
      />

      <EditSupplierModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        supplier={editingSupplier}
        onSave={handleUpdateSupplier}
      />

      <DocumentPreviewModal
        isOpen={isPreviewDocOpen}
        onClose={() => setIsPreviewDocOpen(false)}
        document={previewDoc}
        supplier={selectedSupplier}
      />

      <CreatePOModal
        isOpen={isPOModalOpen}
        onClose={() => setIsPOModalOpen(false)}
        supplier={poSupplier}
      />

      <PrintProfileModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        supplier={printSupplier}
      />

      <ImportSupplierModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <ExportSupplierModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        totalCount={suppliers.length}
      />
    </div>
  );
}
