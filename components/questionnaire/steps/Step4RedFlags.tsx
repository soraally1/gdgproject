"use client";

import React from "react";
import { useQuestionnaireStore } from "@/store/useQuestionnaireStore";
import {
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Flame,
  Activity,
  Users,
  Database,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Step4RedFlags: React.FC = () => {
  const { formData, updateRedFlag, metrics, submitError } =
    useQuestionnaireStore();

  const redFlagsList = [
    {
      key: "hemoptysis" as const,
      label: "Batuk Bercampur Darah (Hemoptisis)",
      desc: "Keluarnya bercak darah atau dahak kemerahan saat batuk.",
    },
    {
      key: "unexplainedWeightLoss" as const,
      label: "Penurunan Berat Badan Drastis",
      desc: "Turun lebih dari 3–5 kg dalam 3 bulan tanpa sedang diet.",
    },
    {
      key: "nightSweatsFever" as const,
      label: "Demam atau Keringat Malam Terus-Menerus",
      desc: "Bangun malam dengan baju basah keringat dingin / meriang berkepanjangan.",
    },
    {
      key: "chestPain" as const,
      label: "Nyeri Dada Tajam Saat Menarik Napas Dalam",
      desc: "Rasa tertusuk atau tertekan di salah satu sisi dinding dada.",
    },
    {
      key: "legSwelling" as const,
      label: "Pembengkakan pada Kedua Tungkai Kaki (Edema)",
      desc: "Kaki membengkak bila ditekan meninggalkan bekas lekukan (tanda cor pulmonale / jantung).",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Langkah */}
      <div>
        <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Langkah 4 dari 4: Tanda Bahaya & Tinjauan</span>
        </div>
        <h3 className="text-xl font-bold text-slate-100">
          Pemeriksaan Tanda Bahaya (Red Flags) & Ringkasan
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Menyingkirkan kondisi kegawatdaruratan atau kecurigaan penyakit lain (TB aktif, keganasan, komplikasi jantung).
        </p>
      </div>

      {/* =========================================
          1. CHECKLIST TANDA BAHAYA
          ========================================= */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-rose-400 border-b border-slate-800 pb-3">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <h4 className="text-base font-bold text-slate-200">
            Apakah Anda Mengalami Gejala Khusus Berikut?
          </h4>
        </div>

        <p className="text-xs text-slate-400">
          Beri tanda centang jika Anda mengalami gejala di bawah ini dalam beberapa minggu terakhir:
        </p>

        <div className="space-y-2.5">
          {redFlagsList.map((item) => {
            const isChecked = formData.redFlags?.[item.key] || false;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => updateRedFlag(item.key, !isChecked)}
                className={cn(
                  "w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer select-none",
                  isChecked
                    ? "bg-rose-950/40 border-rose-500/70 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                    : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-950 hover:border-slate-700"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 transition-colors shrink-0",
                    isChecked
                      ? "bg-rose-500 border-rose-500 text-white"
                      : "border-slate-700 bg-slate-900"
                  )}
                >
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <h5
                    className={cn(
                      "text-sm font-semibold transition-colors",
                      isChecked ? "text-rose-200" : "text-slate-200"
                    )}
                  >
                    {item.label}
                  </h5>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {metrics.hasRedFlags && (
          <div className="p-3.5 bg-rose-950/60 border border-rose-500/50 rounded-xl text-rose-200 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Peringatan Klinis:</span>
              Terdapat tanda bahaya yang memerlukan pemeriksaan fisik langsung dan foto Rontgen oleh dokter di fasilitas kesehatan primer terdekat.
            </div>
          </div>
        )}
      </div>

      {/* =========================================
          2. RINGKASAN PRA-SKRINING OTOMATIS
          ========================================= */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="text-base font-bold text-slate-200">
              Ringkasan Parameter Intake Terhitung
            </h4>
          </div>
          <span className="text-[11px] bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-400" /> Firebase Sync Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Biomass */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Biomass Hour-Years</span>
            </div>
            <div className="text-lg font-bold text-slate-100">
              {metrics.adjustedBiomassHourYears} <span className="text-xs text-slate-500 font-normal">h-y</span>
            </div>
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                metrics.biomassSeverity === "high"
                  ? "bg-rose-950 text-rose-400"
                  : metrics.biomassSeverity === "moderate"
                  ? "bg-amber-950 text-amber-400"
                  : "bg-emerald-950 text-emerald-400"
              )}
            >
              Kategori: {metrics.biomassSeverity}
            </span>
          </div>

          {/* Card 2: SHS */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Perokok Pasif</span>
            </div>
            <div className="text-lg font-bold text-slate-100">
              {metrics.secondhandSmokeScore} <span className="text-xs text-slate-500 font-normal">skor</span>
            </div>
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                metrics.secondhandSeverity === "high"
                  ? "bg-rose-950 text-rose-400"
                  : metrics.secondhandSeverity === "moderate"
                  ? "bg-amber-950 text-amber-400"
                  : "bg-emerald-950 text-emerald-400"
              )}
            >
              Kategori: {metrics.secondhandSeverity}
            </span>
          </div>

          {/* Card 3: mMRC & PUMA */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>mMRC & PUMA</span>
            </div>
            <div className="text-lg font-bold text-slate-100">
              mMRC {formData.mmrcGrade} <span className="text-xs text-slate-500 font-normal">/ PUMA {metrics.preliminaryPumaScore}</span>
            </div>
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                metrics.pumaIndication
                  ? "bg-rose-950 text-rose-400"
                  : "bg-emerald-950 text-emerald-400"
              )}
            >
              {metrics.pumaIndication ? "Indikasi Spirometri" : "Observasi Normal"}
            </span>
          </div>
        </div>

        {submitError && (
          <div className="p-3 bg-rose-950/80 border border-rose-500 rounded-xl text-rose-200 text-xs">
            {submitError}
          </div>
        )}
      </div>
    </div>
  );
};
