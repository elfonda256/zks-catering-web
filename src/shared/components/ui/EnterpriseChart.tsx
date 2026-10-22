"use client";

import React, { useState } from "react";
import { cn } from "@/shared/utils/cn";

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  formattedValue?: string;
  subtext?: string;
  category?: string;
}

export interface EnterpriseBarChartProps {
  title?: string;
  subtitle?: string;
  data: ChartDataPoint[];
  height?: number;
  className?: string;
  valueFormatter?: (val: number) => string;
  accentColor?: string; // Default slate-800
  secondaryAccentColor?: string;
}

/**
 * Enterprise Bar Chart Component
 * Strictly complies with Sprint 02.2:
 * - Minimal, elegant, thin strokes, large whitespace, soft grid
 * - Smooth entrance animation (200ms ease-out)
 * - Professional floating tooltip with tabular figures
 * - Accessible contrast and dual cues for color-blind users
 */
export function EnterpriseBarChart({
  title,
  subtitle,
  data,
  height = 190,
  className,
  valueFormatter = (val) => val.toLocaleString("id-ID"),
  accentColor = "#0F172A", // Slate 900
}: EnterpriseBarChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => d.value), 10);
  const gridMax = Math.ceil(maxValue / 5) * 5;
  const gridSteps = [gridMax, Math.round(gridMax * 0.66), Math.round(gridMax * 0.33), 0];

  return (
    <div
      className={cn(
        "bg-white border border-slate-200/90 rounded-[12px] p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4 animate-in fade-in duration-200",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
          <div>
            {title && (
              <h4 className="text-[15px] font-semibold text-slate-900 tracking-tight">
                {title}
              </h4>
            )}
            {subtitle && (
              <p className="text-[12px] text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>

          {hoveredIdx !== null && data[hoveredIdx] && (
            <div className="text-left sm:text-right font-mono bg-slate-50 px-2.5 py-1 rounded-[6px] border border-slate-200/60 inline-flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[11px] text-slate-500 font-sans">
                {data[hoveredIdx].label}:
              </span>
              <span className="text-[13px] font-bold text-slate-900 tabular-nums">
                {data[hoveredIdx].formattedValue || valueFormatter(data[hoveredIdx].value)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Chart Canvas */}
      <div className="relative pt-3" style={{ height: `${height}px` }}>
        {/* Soft Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-2">
          {gridSteps.map((step, idx) => (
            <div key={idx} className="flex items-center w-full">
              <span className="text-[10px] font-mono text-slate-400 w-9 text-right pr-2.5 select-none tabular-nums">
                {step}
              </span>
              <div className="flex-1 border-b border-slate-100" />
            </div>
          ))}
        </div>

        {/* Bars Container with Generous Whitespace */}
        <div className="absolute inset-y-0 left-9 right-2 flex items-end justify-around gap-2 sm:gap-4 pb-0.5">
          {data.map((item, idx) => {
            const heightPercent = Math.max(5, Math.round((item.value / gridMax) * 100));
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
              >
                {/* Bar Element with Staggered Entrance */}
                <div
                  className="w-full max-w-[24px] sm:max-w-[32px] rounded-t-[4px] transition-all duration-200 ease-out animate-enterprise-chart-bar"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: isHovered ? accentColor : "#64748B", // Slate-500 -> Slate-900 on hover
                    opacity: hoveredIdx !== null && !isHovered ? 0.45 : 1,
                    animationDelay: `${idx * 35}ms`,
                  }}
                />

                {/* Professional Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 z-30 bg-slate-900 text-white text-[11px] py-1.5 px-3 rounded-[6px] shadow-lg border border-slate-800 pointer-events-none whitespace-nowrap font-mono tabular-nums animate-enterprise-dropdown">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="font-semibold text-slate-200 font-sans">{item.label}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-white font-bold">{item.formattedValue || valueFormatter(item.value)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-around pl-9 pr-2 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 font-medium select-none">
        {data.map((item, idx) => (
          <span
            key={idx}
            className={cn(
              "text-center truncate px-1 transition-colors duration-150 font-sans",
              hoveredIdx === idx ? "text-slate-900 font-semibold" : "text-slate-500"
            )}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export interface EnterpriseProgressMetricProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
  subtext?: string;
  status?: "normal" | "warning" | "critical";
  thresholdLabel?: string;
  className?: string;
}

/**
 * Enterprise Segmented Progress Visualization
 * Replaces generic single-color template progress bars.
 * Features:
 * - Segmented rail with target markers
 * - Accessible status cues (shapes and text alongside calm colors)
 * - Tabular numbers and clear runway explanation
 */
export function EnterpriseProgressMetric({
  label,
  current,
  target,
  unit = "",
  subtext,
  status = "normal",
  thresholdLabel,
  className,
}: EnterpriseProgressMetricProps) {
  const percent = Math.min(100, Math.round((current / (target || 1)) * 100));

  const statusConfig = {
    normal: {
      color: "bg-slate-900",
      pill: "bg-slate-100 text-slate-800 border-slate-200",
      shape: "✓",
      label: "Optimal",
    },
    warning: {
      color: "bg-amber-600",
      pill: "bg-amber-50 text-amber-900 border-amber-200",
      shape: "▲",
      label: "Mendekati Batas",
    },
    critical: {
      color: "bg-rose-700",
      pill: "bg-rose-50 text-rose-900 border-rose-200",
      shape: "●",
      label: "Perlu Tindakan",
    },
  };

  const currentConfig = statusConfig[status];

  return (
    <div className={cn("space-y-2 select-none", className)}>
      {/* Metric Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">{label}</span>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.2 rounded-[4px] text-[10px] font-medium border font-mono",
              currentConfig.pill
            )}
          >
            <span aria-hidden="true">{currentConfig.shape}</span>
            <span>{currentConfig.label}</span>
          </span>
        </div>

        <span className="font-mono text-slate-900 font-bold tabular-nums">
          {current.toLocaleString("id-ID")} / {target.toLocaleString("id-ID")} {unit}{" "}
          <span className="text-slate-500 font-medium">({percent}%)</span>
        </span>
      </div>

      {/* Enterprise Multi-Segmented Capacity Rail with Marker */}
      <div className="relative">
        <div className="h-2.5 w-full bg-slate-100 rounded-[4px] overflow-hidden border border-slate-200/80 p-0.5 flex">
          <div
            className={cn(
              "h-full rounded-[2px] transition-all duration-200 ease-out",
              currentConfig.color
            )}
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* 80% Buffer Line Marker (Operational Benchmark) */}
        <div
          className="absolute top-0 bottom-0 w-px bg-slate-400 pointer-events-none"
          style={{ left: "80%" }}
          title="Threshold Batas Aman (80%)"
        />
      </div>

      {/* Subtext and Benchmark Note */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>{subtext || "Kapasitas pemenuhan operasional dapur & logistik"}</span>
        <span className="text-slate-400">{thresholdLabel || "Ambang 80% Buffer"}</span>
      </div>
    </div>
  );
}

export default EnterpriseBarChart;
