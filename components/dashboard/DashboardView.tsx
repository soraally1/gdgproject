"use client";

import React, { useState } from "react";
import { UnifiedScreeningDossier } from "@/types/pipeline.types";
import { RiskGaugeMeter } from "./RiskGaugeMeter";
import { ExposureBreakdown } from "./ExposureBreakdown";
import { ClinicalDifferentialCard } from "./ClinicalDifferentialCard";
import { PursedLipBreathingCoach } from "./PursedLipBreathingCoach";
import { MitigationActionChecklist } from "./MitigationActionChecklist";
import { ReferralDossierModal } from "../referral/ReferralDossierModal";
import {
  IconFileText,
  IconPrinter,
  IconShare2,
  IconRefreshCw,
  IconSparkles,
} from "../ui/Icons";
import { generateWhatsAppShareText } from "@/lib/whatsappShare";

interface Props {
  dossier: UnifiedScreeningDossier;
  onNewScreening: () => void;
}

export function DashboardView({ dossier, onNewScreening }: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleWhatsApp = () => {
    const text = generateWhatsAppShareText(dossier);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const patientGender = dossier.patientDemographics.gender === "female" ? "Perempuan" : "Laki-laki";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-8 animate-fadeIn">
      {/* Top Banner & Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ID REKAM: #{dossier.id}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(dossier.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            {dossier.isFallbackEngine && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Rule Engine Verified
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard Penapisan Klinis Paru
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Pasien: <strong className="text-slate-200">{patientGender}, {dossier.patientDemographics.age} Tahun</strong> | Status: <strong className="text-emerald-400">Non-Perokok Aktif</strong>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-md shadow-teal-950 flex items-center gap-2 transition-all cursor-pointer"
          >
            <IconFileText className="w-4 h-4 text-slate-950" />
            <span>Surat Rujukan Puskesmas</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsApp}
            className="px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border border-slate-700 bg-slate-950/80 hover:bg-slate-800 text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <IconShare2 className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={onNewScreening}
            className="px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border border-slate-700 bg-slate-950/80 hover:bg-slate-800 text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Mulai Penapisan Baru"
          >
            <IconRefreshCw className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Skrining Baru</span>
          </button>
        </div>
      </div>

      {/* Grid Zona 1 (Risk Gauge) & Zona 2 (Exposure Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskGaugeMeter risk={dossier.riskAssessment} differential={dossier.differentialAnalysis} />
        <ExposureBreakdown exposure={dossier.exposureMetrics} />
      </div>

      {/* Zona 3: Clinical Differential Insights */}
      <div>
        <ClinicalDifferentialCard differential={dossier.differentialAnalysis} />
      </div>

      {/* Grid Zona 4A (Breathing Coach) & Zona 4B (Mitigation Checklist) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PursedLipBreathingCoach />
        <MitigationActionChecklist dossier={dossier.actionableDossier} />
      </div>

      {/* Bottom Medical Summary & Physician Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-wider">
            <IconSparkles className="w-4 h-4" />
            <span>Langkah Selanjutnya untuk Pasien &amp; Faskes Primer</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Bawa Lembar Rekomendasi Rujukan ke Dokter Puskesmas
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {dossier.actionableDossier.physicianBrief.spirometryJustification}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3.5 rounded-xl font-extrabold text-sm bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-lg shadow-teal-950 transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer"
        >
          <IconFileText className="w-4 h-4 text-slate-950" />
          <span>Buka Lembar Rujukan Resmi (A4)</span>
        </button>
      </div>

      {/* Modal Preview */}
      <ReferralDossierModal
        dossier={dossier}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
