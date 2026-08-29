import { UnifiedScreeningDossier } from "@/types/pipeline.types";
import { generateQRCodeSvg } from "./qrCodeGenerator";

export function printReferralDocument() {
  if (typeof window !== "undefined") {
    window.print();
  }
}

export function downloadReferralHtmlDoc(dossier: UnifiedScreeningDossier) {
  const qrSvg = generateQRCodeSvg(`PULMOSCREEN:${dossier.id}:${dossier.riskAssessment.compositeRiskScore}`, 90);
  const patientGender = dossier.patientDemographics.gender === "female" ? "Perempuan" : "Laki-laki";
  const dateStr = new Date(dossier.createdAt).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Surat_Rujukan_PPOK_PulmoScreen_${dossier.id}.html</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.35; font-size: 11pt; margin: 0; padding: 20px; background: #fff; }
    .header { border-bottom: 2px solid #0f766e; padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand-title { font-size: 16pt; font-weight: bold; color: #0f766e; margin: 0; }
    .brand-sub { font-size: 9pt; color: #475569; margin: 2px 0 0 0; }
    .meta-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 4px 8px; border-radius: 4px; font-size: 8.5pt; text-align: right; }
    .section-title { font-size: 10.5pt; font-weight: bold; color: #0f766e; background: #f0fdfa; padding: 3px 8px; border-left: 4px solid #0f766e; margin: 10px 0 6px 0; }
    .row { display: flex; margin-bottom: 3px; }
    .label { width: 32%; font-weight: 600; color: #334155; }
    .value { width: 68%; color: #0f172a; }
    .highlight-box { background: #fffbeb; border: 1px solid #f59e0b; padding: 6px 10px; border-radius: 4px; margin: 6px 0; font-size: 9.5pt; }
    .gold-box { background: #ecfdf5; border: 1px solid #10b981; padding: 6px 10px; border-radius: 4px; margin: 6px 0; font-size: 9.5pt; }
    .check-list { list-style: none; padding-left: 0; margin: 4px 0; }
    .check-list li { margin-bottom: 3px; font-size: 9.5pt; }
    .footer { margin-top: 18px; border-top: 1px solid #cbd5e1; padding-top: 8px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 8.5pt; color: #475569; }
    .sig-line { width: 180px; border-top: 1px dashed #64748b; margin-top: 40px; text-align: center; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="brand-title">PULMOSCREEN AI — CLINICAL REFERRAL BRIEF</h1>
      <p class="brand-sub">Sistem Penapisan Dini PPOK Tersembunyi pada Populasi Non-Perokok</p>
      <p style="font-size: 8pt; color: #0f766e; margin: 2px 0 0 0;">Pedoman Klinis: GOLD 2024 / PUMA Screening Protocol</p>
    </div>
    <div class="meta-box">
      <strong>ID Dokumen:</strong> #${dossier.id}<br>
      <strong>Waktu Skrining:</strong> ${dateStr}<br>
      <strong>Target:</strong> Dokter Faskes Primer / Puskesmas
    </div>
  </div>

  <div class="section-title">1. IDENTITAS & ANAMNESIS SINGKAT PASIEN</div>
  <div class="row"><div class="label">Profil Pasien:</div><div class="value"><strong>${patientGender}, Usia ${dossier.patientDemographics.age} Tahun</strong></div></div>
  <div class="row"><div class="label">Status Merokok Aktif:</div><div class="value"><strong>Non-Perokok (Never-Smoker Konfirmasi)</strong></div></div>
  <div class="row"><div class="label">Keluhan Batuk & Dahak:</div><div class="value">Batuk kronis berdahak tebal di pagi hari (&gt; 3 bulan berulang)</div></div>
  <div class="row"><div class="label">Derajat Sesak (mMRC):</div><div class="value"><strong>Skala ${dossier.riskAssessment.scoreBreakdown.dyspneaMmrcComponent > 0 ? "Grade 1–3 (Exertional Dyspnea)" : "Grade 0"}</strong></div></div>

  <div class="section-title">2. KUANTIFIKASI PAPARAN LINGKUNGAN NON-TEMBAKAU TERHITUNG</div>
  <div class="row"><div class="label">Biomass Hour-Years:</div><div class="value"><strong>${dossier.exposureMetrics.adjustedBiomassHourYears} Jam-Tahun (Adjusted)</strong> ${dossier.exposureMetrics.isSignificantBiomassExposure ? '<span style="color:#b91c1c; font-weight:bold;">[MELEWATI AMBANG BATAS RISIKO >= 60]</span>' : ''}</div></div>
  <div class="row"><div class="label">Indeks Rokok Pasif (SHS):</div><div class="value">Skor Kumulatif ${dossier.exposureMetrics.secondhandSmokeIndex} (Paparan asap rokok dalam rumah tangga)</div></div>
  <div class="row"><div class="label">Ringkasan Beban Paparan:</div><div class="value">${dossier.exposureMetrics.primaryExposureSummary}</div></div>

  <div class="section-title">3. RESUME PENALARAN DIFERENSIAL KLINIS & DOKUMENTASI ICD-10</div>
  <div class="highlight-box">
    <strong>Dugaan Utama (Primary Suspect):</strong> ${dossier.differentialAnalysis.primarySuspect}<br>
    <strong>Kode ICD-10 Rekomendasi:</strong> ${dossier.actionableDossier.physicianBrief.icd10Codes.join(" | ")}<br>
    <strong>Tingkat Risiko Komposit:</strong> ${dossier.riskAssessment.compositeRiskScore}/100 (Kategori: ${dossier.riskAssessment.riskTier})
  </div>
  <div class="row"><div class="label">Justifikasi Diferensial:</div><div class="value">Onset usia dewasa matang, keluhan batuk berdahak pagi hari tanpa riwayat atopi masa kecil, diperkuat akumulasi partikulat biomassa dapur menahun.</div></div>
  <div class="row"><div class="label">Pemeriksaan Red Flags:</div><div class="value">${dossier.differentialAnalysis.redFlagsIdentified.length > 0 ? '<strong style="color:#dc2626;">' + dossier.differentialAnalysis.redFlagsIdentified.join(", ") + '</strong>' : 'Negatif (Tidak ditemukan tanda bahaya keganasan/TB akut)'}</div></div>

  <div class="section-title">4. REKOMENDASI PROTOKOL PEMERIKSAAN MEDIS (GOLD 2024 GUIDELINES)</div>
  <div class="gold-box">
    <strong>Rekomendasi Tindakan Pemeriksa:</strong>
    <ul class="check-list">
      ${dossier.actionableDossier.physicianBrief.recommendedDiagnosticOrders.map((ord) => `<li>[ ] ${ord}</li>`).join("")}
    </ul>
    <strong>Justifikasi Baku Emas:</strong> ${dossier.actionableDossier.physicianBrief.spirometryJustification}
  </div>

  <div class="section-title">5. EDUKASI NON-FARMAKOLOGIS PASIEN</div>
  <div class="row"><div class="label">Fisioterapi Mandiri:</div><div class="value">${dossier.actionableDossier.patientPlan.breathingExerciseGuide}</div></div>
  <div class="row"><div class="label">Mitigasi Dapur:</div><div class="value">${dossier.actionableDossier.patientPlan.kitchenMitigationSteps.join("; ")}</div></div>

  <div class="footer">
    <div>
      <div>Dihasilkan secara otomatis oleh <strong>PulmoScreen AI Multi-Agent Engine</strong>.</div>
      <div>Dokumen ini merupakan instrumen penapisan klinis faskes primer.</div>
      <div style="margin-top: 6px;">${qrSvg}</div>
    </div>
    <div style="text-align: center;">
      <div>Verifikasi Dokter Pemeriksa / Faskes Primer:</div>
      <div class="sig-line">
        ( dr. ________________________ )<br>
        SIP: _________________________
      </div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Surat_Rujukan_PPOK_PulmoScreen_${dossier.id}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
