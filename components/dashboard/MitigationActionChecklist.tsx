"use client";

import React, { useState } from "react";
import { ActionableDossier } from "@/types/pipeline.types";
import { IconShieldAlert, IconCheck, IconHospital } from "../ui/Icons";

interface Props {
  dossier: ActionableDossier;
}

export function MitigationActionChecklist({ dossier }: Props) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const { kitchenMitigationSteps, doctorVisitChecklist, lifestyleRecommendations } =
    dossier.patientPlan;

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-5">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <IconShieldAlert className="w-5 h-5 text-emerald-400" />
        <div>
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            Panduan Mitigasi Rumah &amp; Rencana Kunjungan Dokter
          </h3>
          <p className="text-xs text-slate-400">
            Langkah nyata untuk memutus paparan partikulat dan persiapan konsultasi medis.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Kolom 1: Mitigasi Dapur */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>🔥 Langkah Mitigasi Dapur &amp; Lingkungan:</span>
          </h4>
          <div className="space-y-2">
            {kitchenMitigationSteps.map((step, idx) => {
              const id = `kitchen-${idx}`;
              const isChecked = !!checkedItems[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleCheck(id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                    isChecked
                      ? "bg-emerald-950/20 border-emerald-500/40 text-slate-400 line-through"
                      : "bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <span className="text-xs leading-relaxed flex-1">{step}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 ${
                      isChecked
                        ? "border-emerald-400 bg-emerald-500 text-slate-950"
                        : "border-slate-700 bg-slate-900"
                    }`}
                  >
                    {isChecked && <IconCheck className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Kolom 2: Persiapan Dokter Puskesmas */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <IconHospital className="w-4 h-4 text-cyan-400" />
            <span>Checklist Konsultasi Dokter Puskesmas:</span>
          </h4>
          <div className="space-y-2">
            {doctorVisitChecklist.map((item, idx) => {
              const id = `doctor-${idx}`;
              const isChecked = !!checkedItems[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleCheck(id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                    isChecked
                      ? "bg-emerald-950/20 border-emerald-500/40 text-slate-400 line-through"
                      : "bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <span className="text-xs leading-relaxed flex-1">{item}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 ${
                      isChecked
                        ? "border-emerald-400 bg-emerald-500 text-slate-950"
                        : "border-slate-700 bg-slate-900"
                    }`}
                  >
                    {isChecked && <IconCheck className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
