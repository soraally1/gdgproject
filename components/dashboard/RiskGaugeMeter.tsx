"use client";

import React from "react";
import { RiskScoringOutput, DifferentialOutput } from "@/types/pipeline.types";
import { IconShieldAlert, IconAlertTriangle, IconActivity } from "../ui/Icons";

interface Props {
  risk: RiskScoringOutput;
  differential: DifferentialOutput;
}

export function RiskGaugeMeter({ risk, differential }: Props) {
  const score = risk.compositeRiskScore;

  // Arc math for 220 degree SVG gauge
  // Center (120, 120), radius 85, start angle -200 deg, end angle 20 deg (total span 220 deg)
  const radius = 85;
  const strokeWidth = 14;
  const startAngle = -200;
  const totalAngle = 220;
  const currentAngle = startAngle + (score / 100) * totalAngle;

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, startA: number, endA: number) => {
    const start = polarToCartesian(x, y, r, endA);
    const end = polarToCartesian(x, y, r, startA);
    const largeArcFlag = endA - startA <= 180 ? "0" : "1";
    return ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y].join(" ");
  };

  const backgroundArc = describeArc(120, 120, radius, startAngle, startAngle + totalAngle);
  const valueArc = describeArc(120, 120, radius, startAngle, currentAngle);

  // Color selection based on score
  let scoreColor = "#10b981"; // Emerald
  let tierLabel = "RISIKO RENDAH";
  let tierBadgeBg = "bg-emerald-500/15 border-emerald-500/30 text-emerald-300";
  let interpretation = "Gejala iritasi bronkus ringan, fungsi jalan napas kemungkinan besar reversibel.";

  if (score >= 65) {
    scoreColor = "#f43f5e"; // Rose
    tierLabel = "RISIKO TINGGI (INDIKASI KUAT PPOK)";
    tierBadgeBg = "bg-rose-500/20 border-rose-500/40 text-rose-300";
    interpretation =
      "Indikasi kuat penurunan fungsi paru menetap akibat paparan partikulat jangka panjang. Uji Spirometri Pos-Bronkodilator sangat dianjurkan.";
  } else if (score >= 35) {
    scoreColor = "#f59e0b"; // Amber
    tierLabel = "RISIKO MODERAT (WASPADA)";
    tierBadgeBg = "bg-amber-500/20 border-amber-500/40 text-amber-300";
    interpretation =
      "Kecurigaan bronkitis kronis / disfungsi jalan napas kecil. Perlu evaluasi dokter faskes primer.";
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <IconActivity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Indikator Risiko Komposit PPOK
            </h3>
          </div>
          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${tierBadgeBg}`}>
            {tierLabel}
          </span>
        </div>

        {/* SVG Radial Gauge */}
        <div className="relative flex flex-col items-center justify-center my-2">
          <svg width="240" height="170" viewBox="0 0 240 180" className="overflow-visible">
            {/* Background Arc */}
            <path
              d={backgroundArc}
              fill="none"
              stroke="#1e293b"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Value Arc */}
            <path
              d={valueArc}
              fill="none"
              stroke={scoreColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${scoreColor}80)`,
              }}
            />
          </svg>

          {/* Centered Score Number */}
          <div className="absolute top-16 flex flex-col items-center">
            <span className="text-5xl font-extrabold tracking-tight" style={{ color: scoreColor }}>
              {score}
            </span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
              Skala 0 – 100
            </span>
          </div>

          <div className="flex justify-between w-56 text-[10px] text-slate-500 font-semibold px-2">
            <span>0 (Rendah)</span>
            <span>50 (Moderat)</span>
            <span>100 (Tinggi)</span>
          </div>
        </div>

        {/* Interpretation Text */}
        <div className="mt-4 p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
          <strong className="text-white block mb-1">Evaluasi Klinis:</strong>
          {interpretation}
        </div>
      </div>

      {/* Red Flags Alert if present */}
      {differential.redFlagsIdentified.length > 0 && (
        <div className="mt-4 p-3.5 bg-rose-950/40 border border-rose-500/50 rounded-xl flex items-start gap-3 text-xs text-rose-200">
          <IconAlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block text-rose-300 font-bold mb-0.5">
              Tanda Bahaya Medis Terdeteksi ({differential.redFlagsIdentified.length} Gejala):
            </strong>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-rose-300/90">
              {differential.redFlagsIdentified.map((rf, idx) => (
                <li key={idx}>{rf}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
