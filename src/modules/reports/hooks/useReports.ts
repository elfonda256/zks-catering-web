"use client";

import { useState } from "react";

export function useReports() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("BULANAN");
  return { selectedPeriod, setSelectedPeriod };
}
