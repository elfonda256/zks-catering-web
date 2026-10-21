"use client";

import { useState, useMemo, useCallback } from "react";
import type {
  Supplier,
  SupplierDirectoryFilter,
  CommunicationLogEntry,
  CommunicationType,
  SupplierStatus,
} from "../types";
import { INITIAL_SUPPLIERS } from "../constants";
import { SupplierService } from "../services/supplier.service";

export function useSupplier(initialData: Supplier[] = INITIAL_SUPPLIERS) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialData);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(
    initialData[0]?.id || ""
  );

  const [filter, setFilter] = useState<SupplierDirectoryFilter>({
    searchQuery: "",
    category: "ALL",
    status: "ALL",
    tier: "ALL",
  });

  const [activeDossierTab, setActiveDossierTab] = useState<
    "overview" | "documents" | "performance" | "orders" | "communications" | "scorecard" | "risk"
  >("overview");

  // Filtered supplier list
  const filteredSuppliers = useMemo(() => {
    return SupplierService.filterSuppliers(suppliers, filter);
  }, [suppliers, filter]);

  // Active selected supplier
  const selectedSupplier = useMemo(() => {
    return (
      suppliers.find((s) => s.id === selectedSupplierId) ||
      filteredSuppliers[0] ||
      suppliers[0]
    );
  }, [suppliers, selectedSupplierId, filteredSuppliers]);

  // Executive summary
  const executiveMetrics = useMemo(() => {
    return SupplierService.calculateExecutiveSummary(suppliers);
  }, [suppliers]);

  // Actions
  const handleSelectSupplier = useCallback((id: string) => {
    setSelectedSupplierId(id);
  }, []);

  const handleUpdateStatus = useCallback((id: string, newStatus: SupplierStatus) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  }, []);

  const handleAddSupplier = useCallback((newSupplier: Supplier) => {
    setSuppliers((prev) => [newSupplier, ...prev]);
    setSelectedSupplierId(newSupplier.id);
  }, []);

  const handleUpdateSupplier = useCallback((updated: Supplier) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  }, []);

  const handleAddCommunicationLog = useCallback(
    (
      supplierId: string,
      logInput: {
        type: CommunicationType;
        subject: string;
        notes: string;
        initiator: string;
        followUpDate?: string;
      }
    ) => {
      const fullLog: CommunicationLogEntry = {
        id: "log-" + Date.now(),
        timestamp:
          new Date().toLocaleDateString("id-ID") +
          " " +
          new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) +
          " WIB",
        ...logInput,
      };
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === supplierId
            ? {
                ...s,
                communicationLogs: [fullLog, ...s.communicationLogs],
              }
            : s
        )
      );
    },
    []
  );

  return {
    suppliers,
    filteredSuppliers,
    selectedSupplier,
    selectedSupplierId,
    executiveMetrics,
    filter,
    setFilter,
    activeDossierTab,
    setActiveDossierTab,
    handleSelectSupplier,
    handleUpdateStatus,
    handleAddSupplier,
    handleUpdateSupplier,
    handleAddCommunicationLog,
  };
}
