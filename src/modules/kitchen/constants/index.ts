import type {
  KitchenStationId,
  KitchenTicketStatus,
  KitchenTicket,
  HaccpLogEntry,
  KitchenSummaryKpi,
} from "../types";

export const KITCHEN_STANDARDS = {
  MIN_COOKING_TEMP_POULTRY: 75, // Celcius
  MIN_COOKING_TEMP_BEEF: 80,
  MIN_HOLDING_TEMP_BAIN_MARIE: 65,
  MAX_OIL_DEGRADATION_TPM: 24, // Polar compounds %
  CHILL_DOWN_TIME_MAX_HOURS: 2,
} as const;

export const KITCHEN_STATIONS_CONFIG: Record<
  KitchenStationId,
  { label: string; icon: string; desc: string }
> = {
  ALL: {
    label: "Semua Stasiun",
    icon: "🍳",
    desc: "Seluruh lini masak Dapur Sentral",
  },
  HOT_WOK: {
    label: "Hot Wok & Braising",
    icon: "🔥",
    desc: "Line penggorengan suhu tinggi & penumisan",
  },
  STEAMER: {
    label: "Steam Boiler & Nasi",
    icon: "💨",
    desc: "Line boiler uap kapasitas 850 porsi",
  },
  BUTCHER: {
    label: "Butcher & Cold Prep",
    icon: "🥩",
    desc: "Pemotongan karkas steril & marinasi 4°C",
  },
  COLD_PACKING: {
    label: "Packing & Sealing",
    icon: "📦",
    desc: "Assembly tray higienis & staging thermobox",
  },
  PASTRY: {
    label: "Pastry & Fresh Fruit",
    icon: "🍉",
    desc: "Potong buah segar & dessert dingin",
  },
};

export const TICKET_STATUS_CONFIG: Record<
  KitchenTicketStatus,
  { label: string; colorClass: string; badgeBg: string }
> = {
  QUEUED: {
    label: "Antrean Masak",
    colorClass: "text-slate-700 border-slate-300",
    badgeBg: "bg-slate-100 text-slate-800",
  },
  COOKING: {
    label: "Sedang Dimasak",
    colorClass: "text-amber-800 border-amber-300",
    badgeBg: "bg-amber-100 text-amber-800 animate-pulse",
  },
  HOLDING_HOT: {
    label: "Hot Holding >65°C",
    colorClass: "text-[#D97706] border-amber-400",
    badgeBg: "bg-amber-50 text-[#D97706]",
  },
  READY_PACK: {
    label: "Siap Packing",
    colorClass: "text-emerald-800 border-emerald-300",
    badgeBg: "bg-emerald-100 text-emerald-800",
  },
  COMPLETED: {
    label: "Selesai Dispatched",
    colorClass: "text-blue-800 border-blue-300",
    badgeBg: "bg-blue-100 text-blue-800",
  },
};

// Capped at 5 tickets per project standard
export const MOCK_KITCHEN_TICKETS: KitchenTicket[] = [
  {
    id: "kds-01",
    ticketCode: "KDS-FCC-01",
    clientName: "PT FCC Indonesia",
    menuItemName: "Tier 20k — Ayam Bakar Bumbu Rujak & Capcay",
    portions: 350,
    shift: "Shift 2 (Lembur Sore)",
    targetDispatchTime: "16:45 WIB",
    station: "COLD_PACKING",
    status: "READY_PACK",
    currentTemp: 78.5,
    targetTemp: 75,
    isAdhoc: true,
    dietaryAlerts: ["Bebas Seafood / Udang", "25 Pax Non-Pedas"],
    headChefName: "Chef Ahmad Fauzi",
  },
  {
    id: "kds-02",
    ticketCode: "KDS-IND-02",
    clientName: "PT Indosafety Sentosa",
    menuItemName: "Tier 17k — Ayam Lengkuas & Orek Tempe Manis",
    portions: 250,
    shift: "Shift 2 (Lembur Sore)",
    targetDispatchTime: "17:00 WIB",
    station: "HOT_WOK",
    status: "COOKING",
    currentTemp: 76.2,
    targetTemp: 75,
    isAdhoc: false,
    dietaryAlerts: ["Microwave-safe Bento Box"],
    headChefName: "Chef Supardi",
  },
  {
    id: "kds-03",
    ticketCode: "KDS-IPT-03",
    clientName: "PT Indo Plating Tech",
    menuItemName: "Tier 25k — Daging Sapi Lada Hitam Executive",
    portions: 120,
    shift: "Shift 2 (Lembur Sore)",
    targetDispatchTime: "17:15 WIB",
    station: "BUTCHER",
    status: "COOKING",
    currentTemp: 82.0,
    targetTemp: 80,
    isAdhoc: true,
    dietaryAlerts: ["Daging Sapi Halal Bersertifikat"],
    headChefName: "Chef Ahmad Fauzi",
  },
  {
    id: "kds-04",
    ticketCode: "KDS-ASA-04",
    clientName: "PT Asahimas Flat Glass Tbk",
    menuItemName: "Tier 20k — Semur Daging & Tumis Buncis Jagung",
    portions: 400,
    shift: "Shift 3 (Lembur Malam)",
    targetDispatchTime: "20:30 WIB",
    station: "STEAMER",
    status: "QUEUED",
    targetTemp: 75,
    isAdhoc: false,
    dietaryAlerts: ["Pengantaran Gate 3 Jam 20:30"],
    headChefName: "Chef Supardi",
  },
  {
    id: "kds-05",
    ticketCode: "KDS-BUF-05",
    clientName: "Buffer Dapur Sentral",
    menuItemName: "Emergency Buffer — Nasi Ramos & Opor Ayam",
    portions: 200,
    shift: "Standby Shift 2",
    targetDispatchTime: "17:30 WIB",
    station: "STEAMER",
    status: "HOLDING_HOT",
    currentTemp: 68.4,
    targetTemp: 65,
    isAdhoc: true,
    dietaryAlerts: ["Holding di Bain-Marie Termal 68°C"],
    headChefName: "Chef Herman",
  },
];

// Capped at 4 CCP log entries
export const MOCK_HACCP_LOGS: HaccpLogEntry[] = [
  {
    id: "ccp-log-01",
    ccpCode: "CCP-01",
    checkpointName: "Suhu Inti Daging Ayam (Core Probe)",
    itemTested: "Batch Ayam Bakar PT FCC (350 Pax)",
    recordedValue: 78.5,
    unit: "°C",
    standardThreshold: "Min. 75.0°C",
    status: "PASS",
    inspectorName: "QC Irfan Maulana",
    recordedTime: "15:40 WIB",
  },
  {
    id: "ccp-log-02",
    ccpCode: "CCP-02",
    checkpointName: "Uji Degradasi Minyak Goreng (TPM)",
    itemTested: "Deep Fryer Line Wok 02",
    recordedValue: 14.5,
    unit: "% TPM",
    standardThreshold: "Maks. 24.0% TPM",
    status: "PASS",
    inspectorName: "QC Irfan Maulana",
    recordedTime: "14:15 WIB",
  },
  {
    id: "ccp-log-03",
    ccpCode: "CCP-03",
    checkpointName: "Holding Cabinet Bain-Marie",
    itemTested: "Chafing Unit Dapur Buffer 01",
    recordedValue: 68.4,
    unit: "°C",
    standardThreshold: "Min. 65.0°C",
    status: "PASS",
    inspectorName: "Chef Ahmad Fauzi",
    recordedTime: "16:10 WIB",
  },
  {
    id: "ccp-log-04",
    ccpCode: "CCP-04",
    checkpointName: "Rapid Chilling Curve",
    itemTested: "Blast Chiller Sambal Bajak",
    recordedValue: 6.2,
    unit: "°C",
    standardThreshold: "Maks. 10.0°C dalam 2 Jam",
    status: "PASS",
    inspectorName: "QC Irfan Maulana",
    recordedTime: "13:20 WIB",
  },
];

export const MOCK_KITCHEN_SUMMARY_KPI: KitchenSummaryKpi = {
  activeTicketsCount: 5,
  totalPortionsInKitchen: 1320,
  haccpPassRate: 100,
  bainMarieAvgTemp: 68.4,
  activeBoilersOnline: 4,
};
