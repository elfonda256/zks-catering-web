import {
  MOCK_WORK_ORDERS,
  MOCK_RECIPE_BOMS,
  MOCK_PRODUCTION_KPI,
} from "../constants";
import type {
  WorkOrder,
  WorkOrderStatus,
  RecipeBOM,
  ScaledIngredientRequirement,
  ProductionKpiSummary,
} from "../types";

export class ProductionService {
  private static workOrdersState: WorkOrder[] = [...MOCK_WORK_ORDERS];

  /**
   * Mengambil seluruh daftar Work Orders produksi
   */
  static getWorkOrders(): WorkOrder[] {
    return [...this.workOrdersState];
  }

  /**
   * Mengambil Work Order berdasarkan ID
   */
  static getWorkOrderById(id: string): WorkOrder | undefined {
    return this.workOrdersState.find((wo) => wo.id === id);
  }

  /**
   * Memperbarui status siklus kerja Work Order (FSM Transition)
   */
  static updateWorkOrderStatus(
    id: string,
    newStatus: WorkOrderStatus,
    recordedTemp?: number
  ): WorkOrder | null {
    const target = this.workOrdersState.find((wo) => wo.id === id);
    if (!target) return null;

    target.status = newStatus;
    if (recordedTemp !== undefined) {
      target.currentCoreTemp = recordedTemp;
      target.haccpPassed = recordedTemp >= target.coreTempTarget;
    }

    if (newStatus === "PACKED") {
      target.actualProduced = target.targetPortions;
    }

    return { ...target };
  }

  /**
   * Filter Work Orders berdasarkan stasiun dan status
   */
  static filterWorkOrders(
    orders: WorkOrder[],
    filters: { station?: string; status?: string; searchQuery?: string }
  ): WorkOrder[] {
    return orders.filter((order) => {
      if (filters.station && filters.station !== "ALL" && order.station !== filters.station) {
        return false;
      }
      if (filters.status && filters.status !== "ALL" && order.status !== filters.status) {
        return false;
      }
      if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
        const query = filters.searchQuery.toLowerCase();
        const matchesCode = order.workOrderCode.toLowerCase().includes(query);
        const matchesClient = order.clientName.toLowerCase().includes(query);
        const matchesMenu = order.menuItemName.toLowerCase().includes(query);
        const matchesChef = order.headChefName.toLowerCase().includes(query);
        return matchesCode || matchesClient || matchesMenu || matchesChef;
      }
      return true;
    });
  }

  /**
   * Mengambil katalog seluruh Recipe BOM
   */
  static getRecipeBOMs(): RecipeBOM[] {
    return [...MOCK_RECIPE_BOMS];
  }

  /**
   * Mengambil Recipe BOM berdasarkan kode resep
   */
  static getRecipeByCode(recipeCode: string): RecipeBOM | undefined {
    return MOCK_RECIPE_BOMS.find((r) => r.recipeCode === recipeCode);
  }

  /**
   * Melakukan scaling bahan baku BOM secara real-time berdasarkan porsi target
   */
  static scaleRecipeBOM(
    recipeCode: string,
    targetPortions: number
  ): ScaledIngredientRequirement[] {
    const recipe = this.getRecipeByCode(recipeCode);
    if (!recipe || targetPortions <= 0) return [];

    // Perhitungan gramatur: total kg/liter = (gram per porsi * target porsi) / 1000 (jika kg/liter)
    return recipe.ingredients.map((ing) => {
      const rawCalculated = (ing.grammagePerPortion * targetPortions) / 1000;
      // Tambahkan faktor susut pemanasan
      const adjustedForLoss = rawCalculated * (1 + recipe.lossFactorPercent / 100);
      const totalRequired = Math.round(adjustedForLoss * 100) / 100;

      const isSufficient = ing.stockAvailable >= totalRequired;
      const shortageAmount = isSufficient
        ? 0
        : Math.round((totalRequired - ing.stockAvailable) * 100) / 100;

      return {
        sku: ing.sku,
        name: ing.name,
        category: ing.category,
        totalRequired,
        unit: ing.unit,
        stockAvailable: ing.stockAvailable,
        isSufficient,
        shortageAmount,
      };
    });
  }

  /**
   * Menghitung rangkuman KPI operasional produksi hari ini
   */
  static getProductionKpiSummary(orders: WorkOrder[] = this.workOrdersState): ProductionKpiSummary {
    const totalScheduled = orders.reduce((acc, curr) => acc + curr.targetPortions, 0);
    const totalPacked = orders
      .filter((o) => o.status === "PACKED" || o.status === "DISPATCHED")
      .reduce((acc, curr) => acc + curr.actualProduced, 0);

    const haccpTested = orders.filter((o) => o.currentCoreTemp !== undefined);
    const haccpPassed = haccpTested.filter((o) => o.haccpPassed).length;
    const complianceRate =
      haccpTested.length > 0
        ? Math.round((haccpPassed / haccpTested.length) * 100)
        : 100;

    return {
      totalWorkOrdersToday: orders.length,
      totalPortionsScheduled: totalScheduled,
      totalPortionsPacked: totalPacked,
      averageYieldRate: MOCK_PRODUCTION_KPI.averageYieldRate,
      haccpComplianceRate: complianceRate,
      activeBoilers: MOCK_PRODUCTION_KPI.activeBoilers,
    };
  }
}
