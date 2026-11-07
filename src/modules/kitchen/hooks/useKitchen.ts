"use client";

import { useState, useMemo, useCallback } from "react";
import { KitchenService } from "../services/kitchen.service";
import type {
  KitchenTicket,
  KitchenTicketStatus,
  KitchenStationId,
  HaccpLogEntry,
} from "../types";

export function useKitchen() {
  const [tickets, setTickets] = useState<KitchenTicket[]>(() =>
    KitchenService.getTickets()
  );
  const [haccpLogs, setHaccpLogs] = useState<HaccpLogEntry[]>(() =>
    KitchenService.getHaccpLogs()
  );
  const [activeStation, setActiveStation] = useState<KitchenStationId>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTicket, setSelectedTicket] = useState<KitchenTicket | null>(null);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState<boolean>(false);

  const filteredTickets = useMemo(() => {
    return KitchenService.filterTickets(tickets, activeStation, searchQuery);
  }, [tickets, activeStation, searchQuery]);

  const kpis = useMemo(() => {
    return KitchenService.getKitchenKpis(tickets, haccpLogs);
  }, [tickets, haccpLogs]);

  const handleUpdateStatus = useCallback(
    (id: string, newStatus: KitchenTicketStatus, temp?: number) => {
      const updated = KitchenService.updateTicketStatus(id, newStatus, temp);
      if (updated) {
        setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
        if (selectedTicket && selectedTicket.id === id) {
          setSelectedTicket(updated);
        }
      }
    },
    [selectedTicket]
  );

  const handleAddHaccpEntry = useCallback(
    (entry: Omit<HaccpLogEntry, "id" | "recordedTime">) => {
      const added = KitchenService.addHaccpLog(entry);
      setHaccpLogs((prev) => [added, ...prev]);
    },
    []
  );

  return {
    tickets,
    filteredTickets,
    haccpLogs,
    activeStation,
    setActiveStation,
    searchQuery,
    setSearchQuery,
    selectedTicket,
    setSelectedTicket,
    isInspectionModalOpen,
    setIsInspectionModalOpen,
    kpis,
    handleUpdateStatus,
    handleAddHaccpEntry,
  };
}
