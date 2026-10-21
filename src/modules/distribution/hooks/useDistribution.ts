"use client";

import { useState } from "react";

export function useDistribution() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  return { statusFilter, setStatusFilter };
}
