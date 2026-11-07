import {
  MOCK_KITCHEN_TICKETS,
  MOCK_HACCP_LOGS,
  MOCK_KITCHEN_SUMMARY_KPI,
} from "../constants";
import type {
  KitchenTicket,
  KitchenTicketStatus,
  HaccpLogEntry,
  KitchenSummaryKpi,
  KitchenStationId,
} from "../types";

export class KitchenService {
  private static ticketsState: KitchenTicket[] = [...MOCK_KITCHEN_TICKETS];
  private static haccpLogsState: HaccpLogEntry[] = [...MOCK_HACCP_LOGS];

  static getTickets(): KitchenTicket[] {
    return [...this.ticketsState];
  }

  static filterTickets(
    tickets: KitchenTicket[],
    station: KitchenStationId,
    search: string
  ): KitchenTicket[] {
    return tickets.filter((t) => {
      if (station !== "ALL" && t.station !== station) {
        return false;
      }
      if (search.trim().length > 0) {
        const q = search.toLowerCase();
        return (
          t.ticketCode.toLowerCase().includes(q) ||
          t.clientName.toLowerCase().includes(q) ||
          t.menuItemName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }

  static updateTicketStatus(
    id: string,
    newStatus: KitchenTicketStatus,
    recordedTemp?: number
  ): KitchenTicket | null {
    const ticket = this.ticketsState.find((t) => t.id === id);
    if (!ticket) return null;

    ticket.status = newStatus;
    if (recordedTemp !== undefined) {
      ticket.currentTemp = recordedTemp;
    }
    return { ...ticket };
  }

  static getHaccpLogs(): HaccpLogEntry[] {
    return [...this.haccpLogsState];
  }

  static addHaccpLog(
    entry: Omit<HaccpLogEntry, "id" | "recordedTime">
  ): HaccpLogEntry {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")} WIB`;

    const newLog: HaccpLogEntry = {
      ...entry,
      id: `ccp-log-${Date.now()}`,
      recordedTime: timeStr,
    };
    this.haccpLogsState.unshift(newLog);
    return newLog;
  }

  static getKitchenKpis(
    tickets: KitchenTicket[] = this.ticketsState,
    logs: HaccpLogEntry[] = this.haccpLogsState
  ): KitchenSummaryKpi {
    const active = tickets.filter((t) => t.status !== "COMPLETED");
    const totalPortions = active.reduce((acc, t) => acc + t.portions, 0);

    const passed = logs.filter((l) => l.status === "PASS").length;
    const passRate = logs.length > 0 ? Math.round((passed / logs.length) * 100) : 100;

    return {
      activeTicketsCount: active.length,
      totalPortionsInKitchen: totalPortions,
      haccpPassRate: passRate,
      bainMarieAvgTemp: MOCK_KITCHEN_SUMMARY_KPI.bainMarieAvgTemp,
      activeBoilersOnline: MOCK_KITCHEN_SUMMARY_KPI.activeBoilersOnline,
    };
  }
}
