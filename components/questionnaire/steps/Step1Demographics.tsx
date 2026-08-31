"use client";

import React from "react";
import { useQuestionnaireStore } from "@/store/useQuestionnaireStore";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { User, UserCheck, CigaretteOff, Cigarette, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Step1Demographics: React.FC = () => {
  const { formData, updateField, stepErrors } = useQuestionnaireStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Langkah */}
      <div>
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Langkah 1 dari 4: Profil Demografi</span>
        </div>
        <h3 className="text-xl font-bold text-slate-100">
          Demografi & Riwayat Merokok Dasar
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          PPOK non-perokok memiliki manifestasi unik akibat paparan lingkungan kumulatif.
        </p>
      </div>

      {/* 1. Usia Pasien */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="patient-age" className="text-sm font-semibold text-slate-200">
            Usia Anda Saat Ini
          </label>
          <span className="text-xs text-slate-400">Minimal 18 Tahun</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-48">
            <input
              id="patient-age"
              type="number"
              min={18}
              max={110}
              value={formData.age || ""}
              onChange={(e) => updateField("age", Number(e.target.value))}
              className={cn(
                "w-full bg-slate-950/80 border text-slate-100 rounded-xl px-4 py-3 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all",
                stepErrors.age ? "border-rose-500/80 bg-rose-950/20" : "border-slate-800"
              )}
              placeholder="Contoh: 48"
            />
            <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-medium pointer-events-none">
              Tahun
            </span>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[35, 45, 54, 60, 68].map((presetAge) => (
              <button
                key={presetAge}
                type="button"
                onClick={() => updateField("age", presetAge)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer",
                  formData.age === presetAge
                    ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300"
                    : "bg-slate-800/50 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                )}
              >
                {presetAge} th
              </button>
            ))}
          </div>
        </div>

        {stepErrors.age && (
          <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{stepErrors.age}</span>
          </p>
        )}
      </div>

      {/* 2. Jenis Kelamin */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-200 block">
          Jenis Kelamin
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ChoiceCard
            id="gender-female"
            title="Perempuan"
            description="Populasi dengan risiko tertinggi paparan asap biomassa dapur tradisional."
            icon={<UserCheck className="w-5 h-5" />}
            badge="Target Utama"
            isSelected={formData.gender === "female"}
            onClick={() => updateField("gender", "female")}
          />
          <ChoiceCard
            id="gender-male"
            title="Laki-laki"
            description="Kerap terpapar polusi kerja partikulat dan perokok pasif sekunder."
            icon={<User className="w-5 h-5" />}
            isSelected={formData.gender === "male"}
            onClick={() => updateField("gender", "male")}
          />
        </div>
      </div>

      {/* 3. Status Merokok Pribadi */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-200 block">
          Status Riwayat Merokok Pribadi
        </label>
        <div className="grid grid-cols-1 gap-2.5">
          <ChoiceCard
            id="smoking-never"
            title="Tidak Pernah Merokok (< 100 batang seumur hidup)"
            description="Populasi sasaran utama PulmoScreen AI: skrining risiko dari asap dapur, perokok pasif, atau polusi udara."
            icon={<CigaretteOff className="w-5 h-5 text-emerald-400" />}
            badge="Fokus Skrining"
            isSelected={formData.smokingStatus === "never"}
            onClick={() => {
              updateField("smokingStatus", "never");
              updateField("formerPackYears", 0);
            }}
          />

          <ChoiceCard
            id="smoking-former"
            title="Mantan Perokok (Telah Berhenti > 1 Tahun Lalu)"
            description="Pernah merokok di masa lalu namun telah berhenti total."
            icon={<Cigarette className="w-5 h-5 text-amber-400" />}
            isSelected={formData.smokingStatus === "former"}
            onClick={() => updateField("smokingStatus", "former")}
          />

          <ChoiceCard
            id="smoking-active"
            title="Perokok Aktif Saat Ini"
            description="Memiliki risiko ganda antara asap tembakau aktif dan paparan partikulat lingkungan."
            icon={<Cigarette className="w-5 h-5 text-rose-400" />}
            variant="warning"
            isSelected={formData.smokingStatus === "active"}
            onClick={() => updateField("smokingStatus", "active")}
          />
        </div>

        {/* Input Opsional Mantan Pack Years */}
        {formData.smokingStatus === "former" && (
          <div className="mt-3 p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
            <label htmlFor="pack-years" className="text-xs font-semibold text-slate-300">
              Estimasi Lama Merokok di Masa Lalu (Tahun)
            </label>
            <input
              id="pack-years"
              type="number"
              min={0}
              max={60}
              value={formData.formerPackYears || ""}
              onChange={(e) => updateField("formerPackYears", Number(e.target.value))}
              placeholder="Contoh: 5 tahun"
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};
