"use client";

import React, { useState } from "react";
import { DifferentialOutput } from "@/types/pipeline.types";
import { IconStethoscope, IconCheck, IconX } from "../ui/Icons";

interface Props {
  differential: DifferentialOutput;
}

export function ClinicalDifferentialCard({ differential }: Props) {
  const [activeTab, setActiveTab] = useState<"differential" | "copd_vs_asthma">("differential");

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <IconStethoscope className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Penalaran Diferensial Diagnosis (GOLD &amp; GINA)
            </h3>
            <p className="text-xs text-slate-400">
              Dugaan Utama: <strong className="text-emerald-300">{differential.primarySuspect}</strong> ({differential.icd10Suspect})
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("differential")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "differential"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Probabilitas Diagnosis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("copd_vs_asthma")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "copd_vs_asthma"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            PPOK vs Asma
          </button>
        </div>
      </div>

      {/* Tab 1: Differential List */}
      {activeTab === "differential" && (
        <div className="space-y-3">
          {differential.differentialList.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                idx === 0
                  ? "bg-emerald-950/30 border-emerald-500/40 shadow-sm shadow-emerald-950"
                  : "bg-slate-950/60 border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-sm font-bold text-white">{item.condition}</span>
                  {item.icdCode && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                      ICD-10: {item.icdCode}
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {item.probability}% Probabilitas
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                {item.clinicalRationale}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: COPD vs Asthma Comparator */}
      {activeTab === "copd_vs_asthma" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider border-b border-emerald-900/60 pb-2">
              <IconCheck className="w-4 h-4 text-emerald-400" />
              <span>Temuan Pasien Mendukung PPOK Non-Perokok</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {differential.copdVsAsthmaFeatures.supportsCOPD.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider border-b border-slate-800 pb-2">
              <IconX className="w-4 h-4 text-amber-400" />
              <span>Temuan Karakteristik Asma / ACO</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {differential.copdVsAsthmaFeatures.supportsAsthma.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
