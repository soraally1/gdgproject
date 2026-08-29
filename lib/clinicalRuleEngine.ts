import { QuestionnaireData } from "@/types/questionnaire.types";
import {
  UnifiedScreeningDossier,
  ExposureOutput,
  DifferentialOutput,
  RiskScoringOutput,
  ActionableDossier,
} from "@/types/pipeline.types";
import { calculateExposureMetrics, computeExposureContributionPercentages } from "./exposureCalculator";

export function generateDeterministicScreeningDossier(
  data: QuestionnaireData,
  screeningId?: string
): UnifiedScreeningDossier {
  const id = screeningId || `PS-${Date.now().toString().slice(-6)}`;
  const createdAt = new Date().toISOString();
  const metrics = calculateExposureMetrics(data);
  const contribution = computeExposureContributionPercentages(metrics);

  // 1. Exposure Metrics
  let primaryExposureSummary = "";
  if (metrics.adjustedBiomassHourYears >= 60) {
    primaryExposureSummary = `Paparan kumulatif asap biomassa dapur sangat tinggi (${metrics.adjustedBiomassHourYears} jam-tahun adjusted). Memenuhi ambang batas risiko struktural obstruktif paru.`;
  } else if (metrics.adjustedBiomassHourYears >= 30) {
    primaryExposureSummary = `Paparan asap biomassa dapur tingkat moderat (${metrics.adjustedBiomassHourYears} jam-tahun) diperparah oleh ventilasi dapur dan paparan sekunder.`;
  } else {
    primaryExposureSummary = `Paparan biomassa rendah (${metrics.adjustedBiomassHourYears} jam-tahun), dominasi paparan berasal dari asap rokok pasif dan partikulat lingkungan sekitar.`;
  }

  const exposureMetrics: ExposureOutput = {
    rawBiomassHourYears: metrics.rawBiomassHourYears,
    adjustedBiomassHourYears: metrics.adjustedBiomassHourYears,
    secondhandSmokeIndex: metrics.secondhandSmokeScore,
    occupationalRiskLevel:
      metrics.occupationalRiskScore > 50 ? "high" : metrics.occupationalRiskScore > 25 ? "medium" : "low",
    exposureContribution: contribution,
    primaryExposureSummary,
    isSignificantBiomassExposure: metrics.adjustedBiomassHourYears >= 60,
  };

  // 2. Risk Scoring (GOLD / PUMA Composite Formula)
  let biomassPoints = 0;
  if (metrics.adjustedBiomassHourYears >= 60) biomassPoints = 30;
  else if (metrics.adjustedBiomassHourYears >= 30) biomassPoints = 18;
  else if (metrics.adjustedBiomassHourYears >= 10) biomassPoints = 8;
  else biomassPoints = 3;

  let mmrcPoints = 0;
  if (data.mmrcGrade === 4) mmrcPoints = 25;
  else if (data.mmrcGrade === 3) mmrcPoints = 20;
  else if (data.mmrcGrade === 2) mmrcPoints = 15;
  else if (data.mmrcGrade === 1) mmrcPoints = 8;

  let coughPoints = 0;
  if (data.chronicCoughMonths && data.morningPhlegm) coughPoints = 15;
  else if (data.chronicCoughMonths || data.morningPhlegm) coughPoints = 9;

  let shsPoints = 0;
  if (metrics.secondhandSmokeScore >= 20) shsPoints = 10;
  else if (metrics.secondhandSmokeScore >= 8) shsPoints = 6;
  if (metrics.occupationalRiskScore >= 35) shsPoints += 5;

  let ageGenderPoints = 0;
  if (data.age >= 50) ageGenderPoints += 8;
  else if (data.age >= 40) ageGenderPoints += 4;
  if (data.gender === "female" && metrics.adjustedBiomassHourYears >= 30) ageGenderPoints += 2;

  let noAsthmaBonus = 0;
  if (!data.childhoodAsthmaHistory && (data.chronicCoughMonths || data.mmrcGrade >= 1)) {
    noAsthmaBonus = 5;
  }

  const rawScore =
    biomassPoints + mmrcPoints + coughPoints + shsPoints + ageGenderPoints + noAsthmaBonus;
  const compositeRiskScore = Math.min(100, Math.max(5, rawScore));

  let riskTier: "LOW" | "MODERATE" | "HIGH" = "LOW";
  let goldRiskCategory:
    | "LOW_RISK_EARLY"
    | "SUSPECTED_MODERATE_COPD"
    | "SUSPECTED_SEVERE_PULMONARY_OBSTRUCTION" = "LOW_RISK_EARLY";
  let spirometryUrgency: "ROUTINE" | "RECOMMENDED" | "URGENT" = "ROUTINE";

  if (compositeRiskScore >= 65) {
    riskTier = "HIGH";
    goldRiskCategory =
      data.mmrcGrade >= 3
        ? "SUSPECTED_SEVERE_PULMONARY_OBSTRUCTION"
        : "SUSPECTED_MODERATE_COPD";
    spirometryUrgency = "URGENT";
  } else if (compositeRiskScore >= 35) {
    riskTier = "MODERATE";
    goldRiskCategory = "SUSPECTED_MODERATE_COPD";
    spirometryUrgency = "RECOMMENDED";
  } else {
    riskTier = "LOW";
    goldRiskCategory = "LOW_RISK_EARLY";
    spirometryUrgency = "ROUTINE";
  }

  const riskAssessment: RiskScoringOutput = {
    compositeRiskScore,
    riskTier,
    goldRiskCategory,
    pumaScore: metrics.preliminaryPumaScore,
    spirometryUrgency,
    scoreBreakdown: {
      biomassComponent: biomassPoints,
      dyspneaMmrcComponent: mmrcPoints,
      chronicCoughComponent: coughPoints,
      secondhandSmokeComponent: shsPoints,
      ageGenderComponent: ageGenderPoints,
      noChildhoodAsthmaComponent: noAsthmaBonus,
    },
  };

  // 3. Clinical Differential Reasoning
  const supportsCOPD: string[] = [];
  const supportsAsthma: string[] = [];

  if (data.age >= 40) supportsCOPD.push(`Onset usia matang/dewasa (${data.age} thn), khas PPOK non-perokok`);
  if (metrics.adjustedBiomassHourYears >= 30) {
    supportsCOPD.push(
      `Riwayat paparan kumulatif biomassa tinggi (${metrics.adjustedBiomassHourYears} jam-tahun)`
    );
  }
  if (data.chronicCoughMonths && data.morningPhlegm) {
    supportsCOPD.push("Batuk berdahak tebal di pagi hari yang progresif (fenotipe bronkitis kronis)");
  }
  if (data.mmrcGrade >= 2) {
    supportsCOPD.push(`Sesak napas exertional nyata (mMRC Grade ${data.mmrcGrade}) saat beraktivitas fisik`);
  }
  if (!data.childhoodAsthmaHistory) {
    supportsCOPD.push("Ketiadaan riwayat atopi/asma masa kanak-kanak menyingkirkan asma alergi klasik");
  }

  if (data.wheezingFrequency === "frequent") {
    supportsAsthma.push("Gejala mengi sering muncul, perlu uji reversibilitas bronkodilator");
  }
  if (data.childhoodAsthmaHistory) {
    supportsAsthma.push("Ada riwayat asma masa kecil (kemungkinan Asthma-COPD Overlap / ACO)");
  }

  const redFlagsIdentified: string[] = [];
  if (data.redFlags.hemoptysis) redFlagsIdentified.push("Batuk bercampur darah (Hemoptisis)");
  if (data.redFlags.unexplainedWeightLoss) redFlagsIdentified.push("Penurunan berat badan drastis tanpa sebab jelas");
  if (data.redFlags.nightSweatsFever) redFlagsIdentified.push("Demam/keringat malam terus-menerus");
  if (data.redFlags.chestPain) redFlagsIdentified.push("Nyeri dada tajam saat menarik napas dalam");
  if (data.redFlags.legSwelling) redFlagsIdentified.push("Pembengkakan tungkai kaki (Curiga kor pulmonale/dekompensasi)");

  const primarySuspect =
    compositeRiskScore >= 55
      ? "Suspek PPOK Akibat Inhalasi Biomassa Dapur (Biomass-induced COPD)"
      : compositeRiskScore >= 35
      ? "Disfungsi Jalan Napas Kecil / Bronkitis Kronis Dini"
      : "Iritasi Saluran Napas Atas & Bronkial Reversibel";

  const differentialAnalysis: DifferentialOutput = {
    primarySuspect,
    icd10Suspect: compositeRiskScore >= 55 ? "J44.8" : compositeRiskScore >= 35 ? "J44.9" : "J40",
    primaryConfidenceScore: compositeRiskScore >= 65 ? 82 : compositeRiskScore >= 35 ? 68 : 55,
    differentialList: [
      {
        condition: "PPOK Inhalasi Biomassa (Biomass-induced COPD)",
        icdCode: "J44.8",
        probability: compositeRiskScore >= 65 ? 78 : compositeRiskScore >= 35 ? 55 : 20,
        clinicalRationale:
          "Didukung riwayat kumulatif memasak kayu bakar/minyak tanah menahun dan keluhan sesak progresif tanpa riwayat alergi anak.",
      },
      {
        condition: "Asma Onset Lambat / Late-onset Asthma",
        icdCode: "J45.9",
        probability: data.wheezingFrequency !== "never" ? 35 : 18,
        clinicalRationale:
          "Dapat dipertimbangkan jika terdapat hiperreaktivitas bronkus nokturnal, namun kurang didukung riwayat atopi masa kecil.",
      },
      {
        condition: "Bronkiektasis / Sekuele Pasca-Infeksi Paru",
        icdCode: "J47",
        probability: data.morningPhlegm && data.chronicCoughMonths ? 25 : 10,
        clinicalRationale:
          "Perlu disingkirkan bila volume sputum banyak dan purulen atau riwayat infeksi paru masa lalu.",
      },
    ],
    copdVsAsthmaFeatures: {
      supportsCOPD,
      supportsAsthma: supportsAsthma.length > 0 ? supportsAsthma : ["Tidak ditemukan tanda khas asma atopi"],
    },
    redFlagsIdentified,
    urgentMedicalAttentionRequired: metrics.hasRedFlags || compositeRiskScore >= 80,
  };

  // 4. Actionable Dossier
  const patientPlan = {
    summaryText:
      riskTier === "HIGH"
        ? "Hasil penapisan menunjukkan indikasi kuat risiko penurunan fungsi paru kronis akibat paparan asap dapur berkepanjangan. Segera bawa lembar rujukan ini ke dokter Puskesmas untuk pemeriksaan spirometri."
        : riskTier === "MODERATE"
        ? "Terdapat tanda iritasi dan beban paparan partikulat yang perlu diwaspadai. Dianjurkan konsultasi faskes primer serta perbaikan sirkulasi udara dapur."
        : "Risiko PPOK saat ini tergolong rendah. Pertahankan lingkungan rumah sehat dan hindari paparan asap pembakaran.",
    kitchenMitigationSteps: [
      "Pasang ventilasi silang (cross-ventilation) atau cerobong asap di atas tungku memasak.",
      "Gunakan penutup kepala dan masker saat memasak dengan kayu bakar/arang.",
      "Jika memungkinkan, beralih bertahap ke bahan bakar lebih bersih (kompor induksi/gas LPG berventilasi).",
      "Tetapkan aturan bebas asap rokok 100% di dalam area rumah.",
    ],
    breathingExerciseGuide:
      "Lakukan teknik Pursed-Lip Breathing 3-4 kali sehari (tarik napas 2 detik lewat hidung, hembuskan perlahan 4 detik lewat bibir terkatup seperti meniup lilin) untuk melegakan jalan napas.",
    doctorVisitChecklist: [
      "Bawa cetakan Lembar Rujukan PulmoScreen AI ke dokter pemeriksa di Puskesmas.",
      "Sampaikan lama tahun dan jam memasak dengan kayu bakar/minyak tanah.",
      "Minta evaluasi uji fungsi paru baku emas: Uji Spirometri Pos-Bronkodilator.",
    ],
    lifestyleRecommendations: [
      "Konsumsi makanan kaya antioksidan dan cukupi asupan cairan harian.",
      "Hindari penggunaan obat nyamuk bakar di dalam kamar tidur tertutup.",
      "Pertimbangkan vaksinasi influenza dan pneumokokus tahunan atas anjuran dokter.",
    ],
  };

  const physicianBrief = {
    clinicalSoapSummary: `[S] Pasien ${data.gender === "female" ? "Perempuan" : "Laki-laki"}, ${
      data.age
    } thn, non-perokok aktif, mengeluhkan sesak napas exertional mMRC grade ${
      data.mmrcGrade
    } disertai batuk berdahak kronis (>3 bln/thn). [O] Skor risiko komposit PulmoScreen: ${compositeRiskScore}/100 (${riskTier}). Indeks paparan biomassa adjusted: ${
      metrics.adjustedBiomassHourYears
    } jam-tahun. [A] Suspek PPOK Biomassa (ICD-10: J44.8) dd/ Late-onset Asthma (J45.9). [P] Rekomendasi Uji Spirometri Pos-Bronkodilator GOLD.`,
    biomassExposureHistoryText: `Riwayat memasak dengan bahan bakar ${data.cookingFuel} selama ${data.cookingYears} tahun (~${data.cookingHoursPerDay} jam/hari) dengan ventilasi dapur '${data.kitchenVentilation}'. Terhitung ${metrics.adjustedBiomassHourYears} Biomass Hour-Years (Ambang risiko tinggi >= 60). Paparan rokok pasif serumah indeks ${metrics.secondhandSmokeScore}.`,
    symptomProgressionText: `Gejala batuk berdahak di pagi hari bersifat persisten. Derajat sesak mMRC ${data.mmrcGrade} (berjalan lebih lambat di tanjakan/jalan datar). Riwayat asma anak: ${
      data.childhoodAsthmaHistory ? "Positif" : "Negatif (mendukung PPOK onset dewasa)"
    }.`,
    spirometryJustification:
      "Sesuai pedoman GOLD 2024, pasien non-perokok usia >= 40 thn dengan riwayat paparan partikulat biomassa kumulatif bermakna dan gejala sesak exertional kronis diindikasikan kuat menjalani Uji Spirometri Pos-Bronkodilator (400 mcg Salbutamol inhalasi). Rasio FEV1/FVC < 0.70 pasca-bronkodilator memastikan diagnosis konfirmasi PPOK.",
    recommendedDiagnosticOrders: [
      "1. Pemeriksaan Fisik Paru (Inspeksi diameter toraks, Auskultasi ekspirasi memanjang)",
      "2. Baku Emas: Uji Spirometri Pos-Bronkodilator (Evaluasi FEV1/FVC & % FEV1 prediktif)",
      "3. Foto Rontgen Toraks PA (Menyingkirkan TB Paru aktif, kardiomegali, atau massa)",
      "4. Pengukuran Saturasi Oksigen Perifer (SpO2 istirahat dan jalan 6 menit)",
    ],
    initialTherapeuticGuidance:
      "Edukasi eliminasi sumber polusi biomassa rumah tangga. Jika spirometri mengonfirmasi obstruksi menetap: inisiasi bronkodilator kerja panjang (LAMA/LABA) sesuai klasifikasi GOLD ABE.",
    icd10Codes: [
      compositeRiskScore >= 55 ? "J44.8 (PPOK Terkait Paparan Lain/Biomassa)" : "J44.9 (PPOK Tak Spesifik)",
      "J45.9 (Asma Tak Spesifik - Diferensial)",
      "R06.0 (Dispnea / Sesak Napas)",
      "R05 (Batuk Kronis)",
    ],
  };

  const actionableDossier: ActionableDossier = {
    patientPlan,
    physicianBrief,
  };

  return {
    id,
    createdAt,
    isFallbackEngine: true,
    patientDemographics: {
      age: data.age,
      gender: data.gender,
      smokingStatus: data.smokingStatus,
      formerPackYears: data.formerPackYears,
    },
    exposureMetrics,
    differentialAnalysis,
    riskAssessment,
    actionableDossier,
  };
}
