import { UnifiedScreeningDossier } from "@/types/pipeline.types";

export function generateWhatsAppShareText(dossier: UnifiedScreeningDossier): string {
  const gender = dossier.patientDemographics.gender === "female" ? "Perempuan" : "Laki-laki";
  const lines = [
    `🫁 *HASIL PENAPISAN KESEHATAN PARU — PULMOSCREEN AI*`,
    `ID Rekam: #${dossier.id} | Tanggal: ${new Date(dossier.createdAt).toLocaleDateString("id-ID")}`,
    `----------------------------------------`,
    `👤 *Profil Pasien:* ${gender}, ${dossier.patientDemographics.age} Tahun (Non-Perokok Aktif)`,
    `🔥 *Indeks Asap Biomassa Dapur:* ${dossier.exposureMetrics.adjustedBiomassHourYears} Jam-Tahun (${
      dossier.exposureMetrics.isSignificantBiomassExposure ? "Risiko Tinggi" : "Sedang"
    })`,
    `📊 *Tingkat Risiko Paru:* ${dossier.riskAssessment.compositeRiskScore}/100 [${dossier.riskAssessment.riskTier}]`,
    `🩺 *Dugaan Klinis:* ${dossier.differentialAnalysis.primarySuspect}`,
    `📋 *Rekomendasi Medis Puskesmas:* ${dossier.differentialAnalysis.urgentMedicalAttentionRequired ? "⚠️ Segera Periksa ke Faskes Primer" : "Dianjurkan Evaluasi Spirometri Pos-Bronkodilator"}`,
    `----------------------------------------`,
    `*Catatan:* Lembar rujukan resmi format standar Puskesmas siap diunduh dan dibawa ke dokter pemeriksa.`,
    `🌐 _Dihasilkan oleh PulmoScreen AI Multi-Agent Engine_`,
  ];

  return encodeURIComponent(lines.join("\n"));
}
