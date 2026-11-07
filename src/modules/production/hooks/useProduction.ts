"use client";

import { useState, useMemo, useCallback } from "react";
import { ProductionService } from "../services/production.service";
import type { WorkOrder, WorkOrderStatus } from "../types";

export function useProduction(initialTab: "WORK_ORDERS" | "BOM_CALCULATOR" | "STATIONS" = "WORK_ORDERS") {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() =>
    ProductionService.getWorkOrders()
  );
  const [activeTab, setActiveTab] = useState<"WORK_ORDERS" | "BOM_CALCULATOR" | "STATIONS">(
    initialTab
  );
  const [selectedStation, setSelectedStation] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // BOM Scaling Calculator States
  const [selectedRecipeCode, setSelectedRecipeCode] = useState<string>("RCP-AYM-LKG");
  const [scalingPax, setScalingPax] = useState<number>(350);

  // Modal / Detail States
  const [inspectingWorkOrder, setInspectingWorkOrder] = useState<WorkOrder | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState<boolean>(false);

  // Filtered Work Orders
  const filteredWorkOrders = useMemo(() => {
    return ProductionService.filterWorkOrders(workOrders, {
      station: selectedStation,
      status: selectedStatus,
      searchQuery,
    });
  }, [workOrders, selectedStation, selectedStatus, searchQuery]);

  // Scaled Ingredients Breakdown
  const scaledRequirements = useMemo(() => {
    return ProductionService.scaleRecipeBOM(selectedRecipeCode, scalingPax);
  }, [selectedRecipeCode, scalingPax]);

  // Selected Recipe details
  const currentRecipe = useMemo(() => {
    return ProductionService.getRecipeByCode(selectedRecipeCode);
  }, [selectedRecipeCode]);

  // KPI Summary
  const kpis = useMemo(() => {
    return ProductionService.getProductionKpiSummary(workOrders);
  }, [workOrders]);

  // Action: Update Work Order status (FSM Transition)
  const handleUpdateStatus = useCallback(
    (id: string, newStatus: WorkOrderStatus, recordedTemp?: number) => {
      const updated = ProductionService.updateWorkOrderStatus(id, newStatus, recordedTemp);
      if (updated) {
        setWorkOrders((prev) =>
          prev.map((wo) => (wo.id === id ? updated : wo))
        );
        if (inspectingWorkOrder && inspectingWorkOrder.id === id) {
          setInspectingWorkOrder(updated);
        }
      }
    },
    [inspectingWorkOrder]
  );

  return {
    workOrders,
    filteredWorkOrders,
    activeTab,
    setActiveTab,
    selectedStation,
    setSelectedStation,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    selectedRecipeCode,
    setSelectedRecipeCode,
    scalingPax,
    setScalingPax,
    currentRecipe,
    scaledRequirements,
    kpis,
    inspectingWorkOrder,
    setInspectingWorkOrder,
    isNewOrderModalOpen,
    setIsNewOrderModalOpen,
    handleUpdateStatus,
  };
}
