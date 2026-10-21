"use client";

import { useState } from "react";

export function useProduction() {
  const [activeStation, setActiveStation] = useState<string>("ALL");
  return { activeStation, setActiveStation };
}
