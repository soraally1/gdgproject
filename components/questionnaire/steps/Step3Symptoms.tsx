"use client";

import React from "react";
import { useQuestionnaireStore } from "@/store/useQuestionnaireStore";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import {
  Activity,
  Stethoscope,
  Sparkles,
  Volume2,
  HeartPulse,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Step3Symptoms: React.FC = () => {
  const { formData, updateField } = useQuestionnaireStore();

  const mmrcOptions = [
    {
      grade: 0,
      title: "Grade 0: Hanya saat Olahraga Berat",
      desc: "Saya hanya merasa sesak napas saat berolahraga sangat berat atau berlari cepat.",
      badge: "Normal",
      variant: "default" as const,
    },
    {
      grade: 1,
      title: "Grade 1: Jalan Cepat / Tanjakan",
      desc: "Saya merasa sesak napas saat berjalan tergesa-gesa di jalan datar atau saat menaiki tanjakan landai.",
      badge: "Ringan",
      variant: "default" as const,
    },
    {
      grade: 2,
      title: "Grade 2: Berjalan Lebih Lambat dari Sebaya",
      desc: "Saya berjalan lebih lambat dari orang seusia di jalan datar karena sesak, atau harus berhenti untuk bernapas saat berjalan dengan tempo sendiri.",
      badge: "Moderat (Cut-off GOLD)",
      variant: "warning" as const,
    },
    {
      grade: 3,
      title: "Grade 3: Berhenti Setiap ~100 Meter",
      desc: "Saya harus berhenti untuk mengambil napas setelah berjalan sekitar 100 meter atau beberapa menit di jalan datar.",
      badge: "Signifikan",
      variant: "danger" as const,
    },
    {
      grade: 4,
      title: "Grade 4: Sesak Saat Diam / Pakai Baju",
      desc: "Saya terlalu sesak untuk keluar rumah, atau merasa sesak bahkan saat mengenakan atau melepas pakaian.",
      badge: "Sangat Berat",
      variant: "danger" as const,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Langkah */}
      <div>
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Langkah 3 dari 4: Gejala & Skala Sesak</span>
        </div>
        <h3 className="text-xl font-bold text-slate-100">
          Karakteristik Gejala & Skala Sesak mMRC
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Pola batuk pagi hari dan keterbatasan aktivitas fisik adalah indikator kunci obstruksi jalan napas.
        </p>
      </div>

      {/* =========================================
          1. KARAKTERISTIK BATUK & DAHAK
          ========================================= */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-400 border-b border-slate-800 pb-3">
          <Stethoscope className="w-5 h-5 text-emerald-400" />
          <h4 className="text-base font-bold text-slate-200">
            Karakteristik Batuk & Produksi Dahak
          </h4>
        </div>

        {/* Batuk Kronis > 3 Bulan */}
        <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-200">
              Batuk kronis berulang lebih dari 3 bulan dalam setahun?
            </span>
            <button
              type="button"
              onClick={() =>
                updateField("chronicCoughMonths", !formData.chronicCoughMonths)
              }
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer",
                formData.chronicCoughMonths
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              )}
            >
              {formData.chronicCoughMonths ? "YA" : "TIDAK"}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Kriteria epidemiologis standar untuk kecurigaan bronkitis kronis.
          </p>
        </div>

        {/* Dahak Pagi Hari */}
        <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-200">
              Batuk terutama berdahak kental saat bangun di pagi hari?
            </span>
            <button
              type="button"
              onClick={() =>
                updateField("morningPhlegm", !formData.morningPhlegm)
              }
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer",
                formData.morningPhlegm
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              )}
            >
              {formData.morningPhlegm ? "YA" : "TIDAK"}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Akumulasi sekret bronkial semalaman akibat hipersekresi mukus mukosa paru.
          </p>
        </div>

        {/* Suara Mengi */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
            Frekuensi Terdengarnya Suara Mengi (Napas Bunyi &quot;Ngik-ngik&quot;)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <ChoiceCard
              title="Sering Terdengar"
              icon={<Volume2 className="w-4 h-4 text-rose-400" />}
              isSelected={formData.wheezingFrequency === "frequent"}
              onClick={() => updateField("wheezingFrequency", "frequent")}
              variant="danger"
            />
            <ChoiceCard
              title="Kadang-kadang (Saat Capek)"
              icon={<Volume2 className="w-4 h-4 text-amber-400" />}
              isSelected={formData.wheezingFrequency === "occasional"}
              onClick={() => updateField("wheezingFrequency", "occasional")}
              variant="warning"
            />
            <ChoiceCard
              title="Tidak Pernah"
              isSelected={formData.wheezingFrequency === "never"}
              onClick={() => updateField("wheezingFrequency", "never")}
            />
          </div>
        </div>

        {/* Riwayat Asma Anak-anak (Diferensiasi) */}
        <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-slate-200">
                Punya riwayat asma / alergi sejak usia kanak-kanak?
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                updateField("childhoodAsthmaHistory", !formData.childhoodAsthmaHistory)
              }
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer",
                formData.childhoodAsthmaHistory
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-800 text-slate-400"
              )}
            >
              {formData.childhoodAsthmaHistory ? "YA" : "TIDAK"}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            PPOK akibat biomassa biasanya muncul pada usia dewasa tanpa riwayat asma masa kecil (*late-onset airway disease*).
          </p>
        </div>
      </div>

      {/* =========================================
          2. SKALA SESAK NAPAS mMRC
          ========================================= */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 border-b border-slate-800 pb-3">
          <Activity className="w-5 h-5 text-cyan-400" />
          <div>
            <h4 className="text-base font-bold text-slate-200">
              Skala Derajat Sesak Napas mMRC
            </h4>
            <p className="text-[11px] text-slate-400">
              Modified Medical Research Council Dyspnea Scale — Standar Pedoman GOLD 2024
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {mmrcOptions.map((opt) => (
            <ChoiceCard
              key={opt.grade}
              id={`mmrc-grade-${opt.grade}`}
              title={opt.title}
              description={opt.desc}
              badge={opt.badge}
              variant={opt.variant}
              isSelected={formData.mmrcGrade === opt.grade}
              onClick={() => updateField("mmrcGrade", opt.grade)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
