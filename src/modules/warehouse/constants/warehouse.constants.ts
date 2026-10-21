export const WAREHOUSE_ZONES = [
  { id: "ZONE-A", name: "Zona A - Cold Storage Freezer (-20°C)", allowedTypes: ["Unggas", "Daging", "Ikan"] },
  { id: "ZONE-B", name: "Zona B - Chiller Sayur & Olahan (+2°C)", allowedTypes: ["Sayuran", "Olahan", "Telur"] },
  { id: "ZONE-C", name: "Zona C - Gudang Kering Sembako", allowedTypes: ["Beras", "Minyak", "Tepung", "Bumbu Kering"] },
  { id: "ZONE-D", name: "Zona D - Non-Food & Kemasan", allowedTypes: ["Bento Box", "Paperbag", "Alat Makan"] },
] as const;

export const STANDARD_RECEIVING_SLA_HOURS = 2;
