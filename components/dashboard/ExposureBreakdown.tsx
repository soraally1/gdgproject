"use client";

import React from "react";
import { ExposureOutput } from "@/types/pipeline.types";
import { IconFlame, IconWind, IconShieldAlert } from "../ui/Icons";

interface Props {
  exposure: ExposureOutput;
}

export function ExposureBreakdown({ exposure }: Props) {
  const { biomassPercent, secondhandSmokePercent, ambientPollutionPercent } =
    exposure.exposureContribution;

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <IconFlame className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Dekomposisi Beban Paparan Lingkungan
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">100% Attribution</span>
        </div>

        {/* Multi-Segmented Progress Bar */}
        <div className="space-y-1.5 mb-6">
          <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800 p-0.5">
            <div
              style={{ width: `${biomassPercent}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-l-full transition-all duration-700"
              title={`Asap Dapur Biomassa: ${biomassPercent}%`}
            />
            <div
              style={{ width: `${secondhandSmokePercent}%` }}
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
              title={`Asap Rokok Pasif: ${secondhandSmokePercent}%`}
            />
            <div
              style={{ width: `${ambientPollutionPercent}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-r-full transition-all duration-700"
              title={`Polusi Urban / Debu: ${ambientPollutionPercent}%`}
            />
          </div>

          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-amber-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              Biomassa: {biomassPercent}%
            </span>
            <span className="text-cyan-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" />
              Rokok Pasif: {secondhandSmokePercent}%
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Polusi Urban: {ambientPollutionPercent}%
            </span>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase">Asap Biomassa</span>
              <IconFlame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-white">
              {exposure.adjustedBiomassHourYears}{" "}
              <span className="text-xs font-normal text-slate-400">h-y</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              {exposure.isSignificantBiomassExposure ? "⚠️ Di atas ambang bahaya (≥60)" : "Terkalkulasi terbobot"}
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-400 uppercase">Rokok Pasif</span>
              <IconWind className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-white">
              {exposure.secondhandSmokeIndex}{" "}
              <span className="text-xs font-normal text-slate-400">Poin</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Indeks tinggal serumah dengan perokok aktif
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400 uppercase">Debu / Polusi</span>
              <IconShieldAlert className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-white capitalize">
              {exposure.occupationalRiskLevel}
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Paparan lingkungan &amp; aktivitas harian
            </p>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="mt-4 p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-300">
        <strong className="text-slate-200">Keterangan Sumber Utama:</strong>{" "}
        {exposure.primaryExposureSummary}
      </div>
    </div>
  );
}
