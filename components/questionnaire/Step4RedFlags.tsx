"use client";

import React from "react";
import { QuestionnaireData } from "@/types/questionnaire.types";
import { calculateExposureMetrics } from "@/lib/exposureCalculator";
import { IconShieldAlert, IconAlertTriangle, IconFlame, IconCheck, IconActivity } from "../ui/Icons";

interface Props {
  data: QuestionnaireData;
  onChange: (updated: Partial<QuestionnaireData>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function Step4RedFlags({ data, onChange, onSubmit, isLoading }: Props) {
  const metrics = calculateExposureMetrics(data);

  const toggleRedFlag = (key: keyof QuestionnaireData["redFlags"]) => {
    onChange({
      redFlags: {
        ...data.redFlags,
        [key]: !data.redFlags[key],
      },
    });
  };

  const redFlagItems: Array<{
    key: keyof QuestionnaireData["redFlags"];
    title: string;
    desc: string;
    hazard: string;
  }> = [
    {
      key: "hemoptysis",
      title: "Batuk Bercampur Darah (Hemoptisis)",
      desc: "Dahak terdapat bercak atau gumpalan darah segar/kecokelatan.",
      hazard: "Kecurigaan TB Paru aktif, bronkiektasis akut, atau keganasan",
    },
    {
      key: "unexplainedWeightLoss",
      title: "Penurunan Berat Badan Drastis",
      desc: "Penurunan berat badan tanpa diet/olahraga dalam 3 bulan terakhir.",
      hazard: "Tanda hiperkatabolik penyakit kronis lanjut atau keganasan",
    },
    {
      key: "nightSweatsFever",
      title: "Demam & Keringat Dingin di Malam Hari",
      desc: "Berkeringat basah saat tidur malam disertai demam sumeng-sumeng.",
      hazard: "Khas gejala konstitusional Tuberkulosis (TB) Paru",
    },
    {
      key: "chestPain",
      title: "Nyeri Dada Tajam Saat Tarik Napas Dalam",
      desc: "Nyeri menusuk dinding dada saat bernapas (Nyeri Pleuritik).",
      hazard: "Iritasi pleura, efusi, atau keterlibatan kardiovaskular",
    },
    {
      key: "legSwelling",
      title: "Pembengkakan pada Kedua Tungkai / Kaki (Edema)",
      desc: "Kaki membengkak atau berbekas lekuk saat ditekan jari.",
      hazard: "Indikasi komplikasi jantung kanan / Kor Pulmonale dekompensata",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-emerald-950/40 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>Langkah 4 dari 4</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Pemeriksaan Tanda Bahaya (Red Flags) &amp; Tinjauan
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Identifikasi gejala darurat yang membutuhkan penanganan medis segera sebelum menjalankan analisis multi-agen.
        </p>
      </div>

      {/* Red Flags Checklist */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-white">
          <IconShieldAlert className="w-5 h-5 text-rose-400" />
          <span>Pemeriksaan Gejala Alarm Medis:</span>
        </div>
        <p className="text-xs text-slate-400">
          Centang jika Anda mengalami salah satu gejala di bawah ini dalam beberapa minggu/bulan terakhir:
        </p>

        <div className="space-y-2.5">
          {redFlagItems.map((item) => {
            const isChecked = data.redFlags[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleRedFlag(item.key)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                  isChecked
                    ? "bg-rose-950/30 border-rose-500/70 shadow-sm"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="space-y-0.5 flex-1">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className={isChecked ? "text-rose-300 font-bold" : "text-slate-200"}>
                      {item.title}
                    </span>
                    {isChecked && (
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30 font-semibold">
                        Perlu Perhatian Segera
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                  <p className="text-[10px] text-rose-400/80 font-mono">⚠️ {item.hazard}</p>
                </div>
                <div className="mt-1">
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center ${
                      isChecked
                        ? "border-rose-400 bg-rose-500 text-white"
                        : "border-slate-700 bg-slate-900"
                    }`}
                  >
                    {isChecked && <IconCheck className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {metrics.hasRedFlags && (
          <div className="p-4 bg-rose-950/40 border border-rose-500/60 rounded-xl flex items-start gap-3 text-xs text-rose-200">
            <IconAlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-rose-300 font-bold mb-0.5">
                Peringatan Tanda Bahaya Terdeteksi ({metrics.activeRedFlagsCount} Gejala)
              </strong>
              Gejala yang Anda centang memerlukan evaluasi diagnostik langsung oleh dokter (seperti Foto Rontgen Toraks atau Tes Dahak TB). Sistem akan menyertakan rekomendasi prioritas pada Lembar Rujukan.
            </div>
          </div>
        )}
      </div>

      {/* Ringkasan Pra-Kalkulasi Sebelum Eksekusi Agen */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <IconActivity className="w-4 h-4 text-emerald-400" />
          <span>Ringkasan Parameter Skrining Siap Analisis</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Biomass Hour-Years</div>
            <div className="text-base font-bold text-emerald-400">
              {metrics.adjustedBiomassHourYears} h-y
            </div>
            <div className="text-[10px] text-slate-500">{data.cookingFuel} ({data.cookingYears} thn)</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Rokok Pasif (SHS)</div>
            <div className="text-base font-bold text-cyan-400">
              {metrics.secondhandSmokeScore} Poin
            </div>
            <div className="text-[10px] text-slate-500">{data.smokersInHouse} perokok ({data.secondhandYears} thn)</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Skala Sesak mMRC</div>
            <div className="text-base font-bold text-amber-400">
              Grade {data.mmrcGrade}
            </div>
            <div className="text-[10px] text-slate-500">{data.mmrcGrade >= 2 ? "Exertional Dyspnea" : "Normal/Ringan"}</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Skor PUMA Awal</div>
            <div className="text-base font-bold text-emerald-300">
              {metrics.preliminaryPumaScore} / 7
            </div>
            <div className="text-[10px] text-slate-500">{metrics.preliminaryPumaScore >= 5 ? "Indikasi Spirometri" : "Evaluasi Awal"}</div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 pt-1">
          Data akan diproses secara sekuensial dan paralel oleh <strong className="text-emerald-300">4 Agen Penalaran Klinis Groq</strong> (Exposure Intake 8B, Differential Reasoner 70B, Risk Scorer 70B, &amp; Actionable Dossier Synthesizer 70B).
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-xl font-bold text-base bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-emerald-900/40 hover:shadow-emerald-700/60 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Menghubungkan Pipeline Multi-Agent Groq...</span>
            </>
          ) : (
            <>
              <IconFlame className="w-5 h-5 text-slate-950" />
              <span>Jalankan Analisis Multi-Agent PulmoScreen AI</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
