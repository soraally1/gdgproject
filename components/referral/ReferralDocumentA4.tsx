"use client";

import React from "react";
import { UnifiedScreeningDossier } from "@/types/pipeline.types";
import { generateQRCodeSvg } from "@/lib/qrCodeGenerator";

interface Props {
  dossier: UnifiedScreeningDossier;
}

export function ReferralDocumentA4({ dossier }: Props) {
  const patientGender = dossier.patientDemographics.gender === "female" ? "Perempuan" : "Laki-laki";
  const dateStr = new Date(dossier.createdAt).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const qrSvg = generateQRCodeSvg(
    `PULMOSCREEN:${dossier.id}:${dossier.riskAssessment.compositeRiskScore}:${dossier.riskAssessment.riskTier}`,
    90
  );

  return (
    <div className="a4-document bg-white text-slate-900 font-sans p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-300 max-w-3xl mx-auto text-xs leading-normal print:p-0 print:border-none print:shadow-none print:max-w-none">
      {/* Kop Surat Faskes Primer */}
      <div className="border-b-2 border-teal-800 pb-3 mb-3 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🫁</span>
            <h1 className="text-base font-extrabold text-teal-900 tracking-tight">
              PULMOSCREEN AI — CLINICAL REFERRAL DOSSIER
            </h1>
          </div>
          <p className="text-[10px] text-slate-600 font-medium">
            Sistem Penapisan Dini PPOK Tersembunyi pada Populasi Non-Perokok
          </p>
          <p className="text-[9px] text-teal-800 font-semibold mt-0.5">
            Pedoman Standar: GOLD 2024 / PUMA Screening Protocol (Faskes Tingkat Pertama)
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-300 rounded p-2 text-right text-[9px] text-slate-600">
          <div>
            <strong>ID Rekam:</strong> #{dossier.id}
          </div>
          <div>
            <strong>Waktu:</strong> {dateStr}
          </div>
          <div>
            <strong>Tujuan:</strong> Dokter Pemeriksa Puskesmas
          </div>
        </div>
      </div>

      {/* 1. Identitas & Anamnesis Pasien */}
      <div className="mb-3">
        <h2 className="text-[10px] font-bold text-teal-900 bg-teal-50 px-2 py-0.5 border-l-4 border-teal-700 uppercase tracking-wider mb-1.5">
          1. Identitas &amp; Anamnesis Ringkas Pasien
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
          <div>
            <span className="font-semibold text-slate-600">Profil Pasien:</span>{" "}
            <strong>
              {patientGender}, {dossier.patientDemographics.age} Tahun
            </strong>
          </div>
          <div>
            <span className="font-semibold text-slate-600">Status Merokok:</span>{" "}
            <strong className="text-teal-950">
              {dossier.patientDemographics.smokingStatus === "never"
                ? "Tidak Pernah Merokok Aktif (Never-Smoker)"
                : dossier.patientDemographics.smokingStatus === "former"
                ? "Mantan Perokok"
                : "Perokok Aktif"}
            </strong>
          </div>
          <div>
            <span className="font-semibold text-slate-600">Keluhan Batuk &amp; Dahak:</span>{" "}
            <span>Batuk kronis berdahak tebal di pagi hari (&gt; 3 bulan)</span>
          </div>
          <div>
            <span className="font-semibold text-slate-600">Derajat Sesak (mMRC):</span>{" "}
            <strong>
              Skala mMRC {dossier.riskAssessment.scoreBreakdown.dyspneaMmrcComponent > 0 ? "Grade 1–3" : "Grade 0"} (Exertional Dyspnea)
            </strong>
          </div>
        </div>
      </div>

      {/* 2. Kuantifikasi Paparan Lingkungan Non-Tembakau */}
      <div className="mb-3">
        <h2 className="text-[10px] font-bold text-teal-900 bg-teal-50 px-2 py-0.5 border-l-4 border-teal-700 uppercase tracking-wider mb-1.5">
          2. Kuantifikasi Paparan Lingkungan Terhitung
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
          <div>
            <span className="font-semibold text-slate-600">Biomass Hour-Years:</span>{" "}
            <strong className="text-teal-950">
              {dossier.exposureMetrics.adjustedBiomassHourYears} Jam-Tahun (Adjusted)
            </strong>{" "}
            {dossier.exposureMetrics.isSignificantBiomassExposure && (
              <span className="text-rose-700 font-bold">[Ambang Risiko &ge;60]</span>
            )}
          </div>
          <div>
            <span className="font-semibold text-slate-600">Indeks Rokok Pasif (SHS):</span>{" "}
            <span>Skor {dossier.exposureMetrics.secondhandSmokeIndex} (Paparan serumah)</span>
          </div>
          <div className="col-span-2 text-[9.5px] text-slate-700">
            <span className="font-semibold text-slate-600">Beban Paparan Dominan:</span>{" "}
            {dossier.exposureMetrics.primaryExposureSummary}
          </div>
        </div>
      </div>

      {/* 3. Resume Penalaran Diferensial & ICD-10 */}
      <div className="mb-3">
        <h2 className="text-[10px] font-bold text-teal-900 bg-teal-50 px-2 py-0.5 border-l-4 border-teal-700 uppercase tracking-wider mb-1.5">
          3. Resume Diferensial Diagnosis &amp; Kode ICD-10
        </h2>
        <div className="p-2 bg-amber-50/80 border border-amber-300 rounded mb-1.5 text-[9.5px]">
          <div className="flex justify-between items-start">
            <div>
              <strong className="text-slate-900">Dugaan Utama:</strong>{" "}
              <span className="font-bold text-teal-950">
                {dossier.differentialAnalysis.primarySuspect}
              </span>
            </div>
            <span className="font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
              Skor Risiko: {dossier.riskAssessment.compositeRiskScore}/100 [{dossier.riskAssessment.riskTier}]
            </span>
          </div>
          <div className="text-slate-700 mt-0.5">
            <strong>Kode ICD-10 Terkait:</strong>{" "}
            <span className="font-mono text-slate-900">
              {dossier.actionableDossier.physicianBrief.icd10Codes.join(" | ")}
            </span>
          </div>
        </div>
        <div className="text-[9.5px] space-y-0.5 text-slate-700">
          <div>
            <span className="font-semibold text-slate-600">Justifikasi Diferensial:</span> Onset dewasa matang, tanpa riwayat atopi anak, diperparah paparan partikulat dapur menahun.
          </div>
          <div>
            <span className="font-semibold text-slate-600">Pemeriksaan Red Flags:</span>{" "}
            {dossier.differentialAnalysis.redFlagsIdentified.length > 0 ? (
              <strong className="text-rose-700">
                {dossier.differentialAnalysis.redFlagsIdentified.join(", ")}
              </strong>
            ) : (
              <span className="text-teal-900">Negatif (Tidak ditemukan tanda alarm akut)</span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Rekomendasi Protokol Medis GOLD 2024 */}
      <div className="mb-3">
        <h2 className="text-[10px] font-bold text-teal-900 bg-teal-50 px-2 py-0.5 border-l-4 border-teal-700 uppercase tracking-wider mb-1.5">
          4. Rekomendasi Protokol Pemeriksaan Medis (GOLD 2024)
        </h2>
        <div className="p-2 bg-emerald-50/80 border border-emerald-300 rounded space-y-1 text-[9.5px]">
          <div className="font-semibold text-emerald-950">
            Tindakan yang Direkomendasikan bagi Dokter Pemeriksa:
          </div>
          <div className="grid grid-cols-1 gap-0.5 text-slate-800">
            {dossier.actionableDossier.physicianBrief.recommendedDiagnosticOrders.map((ord, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 border border-teal-700 inline-block bg-white rounded-xs" />
                <span>{ord}</span>
              </div>
            ))}
          </div>
          <div className="text-[9px] text-slate-600 pt-1 border-t border-emerald-200">
            <strong>Justifikasi Baku Emas:</strong> {dossier.actionableDossier.physicianBrief.spirometryJustification}
          </div>
        </div>
      </div>

      {/* 5. Rekomendasi Terapi Non-Farmakologis Pasien */}
      <div className="mb-4 text-[9.5px]">
        <h2 className="text-[10px] font-bold text-teal-900 bg-teal-50 px-2 py-0.5 border-l-4 border-teal-700 uppercase tracking-wider mb-1">
          5. Edukasi Non-Farmakologis Pasien
        </h2>
        <div className="text-slate-700">
          • <strong>Fisioterapi Paru:</strong> {dossier.actionableDossier.patientPlan.breathingExerciseGuide}
        </div>
        <div className="text-slate-700">
          • <strong>Mitigasi Dapur:</strong> {dossier.actionableDossier.patientPlan.kitchenMitigationSteps.slice(0, 2).join("; ")}.
        </div>
      </div>

      {/* Footer & Tanda Tangan */}
      <div className="border-t border-slate-300 pt-3 flex justify-between items-end text-[9px] text-slate-500">
        <div>
          <div>Dihasilkan secara otomatis oleh <strong>PulmoScreen AI Multi-Agent Engine</strong>.</div>
          <div>Dokumen ini merupakan instrumen skrining klinis faskes primer.</div>
          <div
            className="mt-1.5 inline-block"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
        </div>
        <div className="text-center">
          <div className="text-slate-700 font-semibold mb-6">
            Dokter Pemeriksa Faskes Primer:
          </div>
          <div className="w-44 border-t border-slate-400 mx-auto pt-0.5 text-slate-600">
            ( dr. _________________________ )<br />
            SIP: __________________________
          </div>
        </div>
      </div>
    </div>
  );
}
