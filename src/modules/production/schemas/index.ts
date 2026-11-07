export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateWorkOrder(data: {
  workOrderCode?: string;
  clientName?: string;
  targetPortions?: number;
  scheduledDate?: string;
  station?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.clientName || data.clientName.trim().length === 0) {
    errors.clientName = "Nama pabrik klien wajib diisi.";
  }

  if (!data.targetPortions || isNaN(data.targetPortions) || data.targetPortions <= 0) {
    errors.targetPortions = "Jumlah target porsi wajib lebih dari 0.";
  } else if (data.targetPortions > 5000) {
    errors.targetPortions = "Maksimum kapasitas batching per Work Order adalah 5.000 porsi.";
  }

  if (!data.station) {
    errors.station = "Stasiun kerja dapur wajib dipilih.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateScalingPortions(portions: number): { isValid: boolean; error?: string } {
  if (isNaN(portions) || portions < 1) {
    return { isValid: false, error: "Jumlah porsi scaling minimal 1 porsi." };
  }
  if (portions > 10000) {
    return { isValid: false, error: "Kapasitas scaling maksimal 10.000 porsi per simulasi." };
  }
  return { isValid: true };
}

export function validateHaccpCoreTemp(station: string, tempCelsius: number): {
  isSafe: boolean;
  standardTemp: number;
  feedback: string;
} {
  const isPoultryOrMeat = station === "HOT_KITCHEN" || station === "BUTCHER";
  const standardTemp = isPoultryOrMeat ? 75 : 70;
  const isSafe = tempCelsius >= standardTemp;

  return {
    isSafe,
    standardTemp,
    feedback: isSafe
      ? `Suhu inti ${tempCelsius}°C memenuhi standar HACCP (Min. ${standardTemp}°C). Lolos sterilisasi bakteri patogen.`
      : `PERINGATAN: Suhu inti ${tempCelsius}°C berada di bawah batas kritis ${standardTemp}°C. Teruskan proses termal!`,
  };
}
