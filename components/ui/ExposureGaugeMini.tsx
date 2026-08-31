"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Flame, AlertTriangle, ShieldCheck, Info } from "lucide-react";

interface ExposureGaugeMiniProps {
  rawHourYears: number;
  adjustedHourYears: number;
  severity: "none" | "low" | "moderate" | "high";
  className?: string;
}

export const ExposureGaugeMini: React.FC<ExposureGaugeMiniProps> = ({
  rawHourYears,
  adjustedHourYears,
  severity,
  className,
}) => {
  // Hitung persentase terhadap ambang batas 60 jam-tahun (max 100% untuk visual bar)
  const percentage = Math.min(Math.round((adjustedHourYears / 60) * 100), 100);

  const getSeverityConfig = () => {
    switch (severity) {
      case "high":
        return {
          color: "text-rose-400",
          bgColor: "bg-rose-500",
          borderColor: "border-rose-500/40",
          bgBox: "bg-rose-950/40",
          icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
          label: "Risiko Tinggi Obstruksi Saluran Napas",
          note: "Melewati ambang batas risiko klinis ≥ 60 Jam-Tahun.",
        };
      case "moderate":
        return {
          color: "text-amber-400",
          bgColor: "bg-amber-500",
          borderColor: "border-amber-500/40",
          bgBox: "bg-amber-950/40",
          icon: <Flame className="w-4 h-4 text-amber-400" />,
          label: "Risiko Moderat Akumulasi Partikulat",
          note: "Akumulasi signifikan yang dapat memicu bronkitis kronis.",
        };
      case "low":
        return {
          color: "text-emerald-400",
          bgColor: "bg-emerald-500",
          borderColor: "border-emerald-500/40",
          bgBox: "bg-emerald-950/40",
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          label: "Risiko Rendah Terkendali",
          note: "Paparan partikulat berada dalam batas aman awal.",
        };
      default:
        return {
          color: "text-slate-400",
          bgColor: "bg-slate-600",
          borderColor: "border-slate-800",
          bgBox: "bg-slate-900/60",
          icon: <Info className="w-4 h-4 text-slate-400" />,
          label: "Tidak Terpapar Biomassa",
          note: "Menggunakan bahan bakar bersih (LPG / Listrik).",
        };
    }
  };

  const config = getSeverityConfig();

  return (
    <div
      className={cn(
        "p-4 rounded-xl border transition-all duration-300",
        config.bgBox,
        config.borderColor,
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {config.icon}
          <span className="text-xs font-semibold text-slate-300">
            Kalkulator Paparan Biomassa Terhitung
          </span>
        </div>
        <span
          className={cn(
            "text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border",
            config.color,
            config.borderColor
          )}
        >
          {severity.toUpperCase()}
        </span>
      </div>

      <div className="flex items-baseline gap-2 my-2">
        <span className={cn("text-2xl font-extrabold tracking-tight", config.color)}>
          {adjustedHourYears}
        </span>
        <span className="text-xs text-slate-400">
          Adjusted Hour-Years ({rawHourYears} Jam-Tahun mentah)
        </span>
      </div>

      {/* Progress Bar Visual */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden my-2 border border-slate-700/50">
        <div
          className={cn("h-full transition-all duration-500 rounded-full", config.bgColor)}
          style={{ width: `${Math.max(percentage, 4)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
        <span>0</span>
        <span className="text-slate-500 font-medium">Ambang Klinis: 60 Jam-Tahun</span>
        <span>60+</span>
      </div>

      <p className="text-xs text-slate-300/90 mt-2.5 leading-relaxed bg-black/20 p-2 rounded-lg border border-white/5">
        <span className="font-semibold text-slate-200">{config.label}:</span> {config.note}
      </p>
    </div>
  );
};
