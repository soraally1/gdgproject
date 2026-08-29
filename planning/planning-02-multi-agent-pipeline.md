# Feature Planning 02: Multi-Agent Groq Reasoning Pipeline & Live Telemetry Stepper

## 1. Executive Summary & Architectural Overview

### 1.1 Latar Belakang & Filosofi Desain
Penapisan PPOK pada populasi non-perokok membutuhkan penalaran klinis yang jauh lebih rumit daripada populasi perokok konvensional. Pada perokok, riwayat *pack-years* menjadi prediktor langsung. Namun pada non-perokok, sistem harus:
1. Mengurai variabel paparan lingkungan multivariat yang heterogen (biomassa, perokok pasif, polusi kerja).
2. Melakukan diferensiasi diagnosis yang ketat antara PPOK biomassa vs asma kronis vs sekuele pasca-TB.
3. Mengkuantisasi risiko ke dalam metrik komposit terstandar (GOLD & PUMA score).
4. Menyintesis rencana aksi klinis dua arah (bahasa awam untuk pasien, terminologi standar medis untuk dokter faskes primer).

Untuk mencapai inferensi yang mendalam tanpa mengorbankan kecepatan pengguna (*latensi total target < 2.5 detik*), **PulmoScreen AI** mengadopsi arsitektur **Multi-Agent Pipeline** bertenaga **Groq Cloud SDK** dengan model LPU (*Language Processing Unit*) akselerasi tinggi:
* **`llama-3.1-8b-instant`**: Untuk normalisasi cepat & ekstraksi parameter lingkungan terstruktur.
* **`llama-3.3-70b-versatile`**: Untuk penalaran diferensial mendalam, kalkulasi risiko probabilistik, dan sintesis dossier klinis terstruktur.

---

## 2. Diagram Alur Multi-Agent Pipeline (Sequential + Parallel Execution)

```
                       [ Payload Input Kuesioner (Zod Validated) ]
                                            │
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │    Agent 1: Exposure Intake & Normalization   │ (Groq Llama-3.1-8b-instant)
                    │    - Hitung Biomass Hour-Years & SHS Index    │ Latensi: ~250-400ms
                    └───────────────────────┬───────────────────────┘
                                            │
                                            ├────────────────────────────────────────┐
                                            ▼ (Parallel Execution via Promise.all)   ▼
    ┌───────────────────────────────────────────────┐        ┌───────────────────────────────────────────────┐
    │  Agent 2: Clinical Differential Reasoner      │        │  Agent 3: Quantitative Risk Scoring Agent     │
    │  - Evaluasi PPOK vs Asma vs TB / Keganasan    │        │  - Kalkulasi Skor Komposit (0 - 100)          │
    │  - Analisis Red Flags & Gejala mMRC           │        │  - Stratifikasi Risiko GOLD & Kriteria PUMA   │
    │  (Groq Llama-3.3-70b-versatile)               │        │  (Groq Llama-3.3-70b-versatile)               │
    │  Latensi: ~900-1400ms                         │        │  Latensi: ~900-1400ms                         │
    └───────────────────────┬───────────────────────┘        └───────────────────────┬───────────────────────┘
                            │                                                        │
                            └────────────────────────┬───────────────────────────────┘
                                                     │
                                                     ▼
                    ┌───────────────────────────────────────────────┐
                    │  Agent 4: Actionable Dossier Synthesizer      │ (Groq Llama-3.3-70b-versatile)
                    │  - JSON Mode Output: Patient Plan + Physician  │ Latensi: ~800-1200ms
                    │    Referral Brief (SOAP + GOLD Spirometry)    │
                    └───────────────────────┬───────────────────────┘
                                            │
                                            ▼
                      [ Final Unified Screening Dossier JSON ]
                         (Disiarkan via SSE Stream ke UI)
```

---

## 3. Spesifikasi Detail Masing-Masing Agen

### 3.1 Agent 1: Exposure Intake & Parameter Normalization Agent
* **Model:** `llama-3.1-8b-instant`
* **Temperature:** `0.1` (Deterministik & presisi tinggi)
* **Response Format:** `json_object`
* **Peran:** Mengonversi data mentah kuesioner menjadi vektor paparan lingkungan standar, memvalidasi rasionalitas durasi jam-tahun, dan menghitung bobot kumulatif.

#### System Prompt:
```text
You are the Exposure Intake Agent for PulmoScreen AI.
Your task is to parse, normalize, and quantify environmental non-tobacco pulmonary exposure data from a patient screening questionnaire.
Calculate:
1. Biomass Exposure Metric:
   - Raw Hour-Years = cooking_hours_per_day * cooking_years
   - Ventilation Multiplier: good_open = 0.7, moderate_window = 1.0, poor_closed = 1.5
   - Adjusted Biomass Hour-Years = Raw * Multiplier
   - Significant exposure threshold is >= 60 adjusted hour-years.
2. Secondhand Smoke (SHS) Metric:
   - Cumulative Score = smokers_in_house * secondhand_years * (daily=1.0, weekly=0.5, rarely=0.2)
3. Particulate & Occupational Risk Factor (0.0 to 1.0 scale).
4. Relative Exposure Contribution Breakdown (percentages summing to 100%).

Return ONLY a valid JSON object matching the required ExposureProfile schema.
```

---

### 3.2 Agent 2: Clinical Differential Reasoner Agent
* **Model:** `llama-3.3-70b-versatile`
* **Temperature:** `0.2`
* **Response Format:** `json_object`
* **Peran:** Menerapkan pedoman klinis GOLD (*Global Initiative for Chronic Obstructive Lung Disease*) dan GINA (*Global Initiative for Asthma*) untuk menganalisis fenotipe PPOK non-perokok vs asma onset lambat vs bronkiektasis pasca-infeksi.

#### Kriteria Penalaran Klinis:
1. **PPOK Akibat Biomassa (*Biomass-induced COPD*):**
   - Karakteristik: Onset perlahan pada usia $>40$ tahun, batuk kronis berdahak tebal di pagi hari, sesak napas exertional progresif (mMRC $\ge 2$), tidak ada riwayat atopi/asma anak-anak, riwayat biomassa dapur $>10-20$ tahun.
2. **Diferensiasi Asma Onset Dewasa:**
   - Karakteristik: Variabilitas diurnal nokturnal (sesak/batuk memburuk tengah malam/dini hari), riwayat alergi/rinitis/eksim, respon cepat terhadap bronkodilator, mengi episodik tanpa riwayat paparan partikulat masif.
3. **Penyakit Paru Pasca-TB (*Post-TB Lung Disease / Bronchiectasis*):**
   - Karakteristik: Riwayat pengobatan OAT 6 bulan di masa lalu, dahak purulen banyak, hemoptisis intermiten, gambaran rontgen fibrokavitasi.
4. **Tanda Bahaya (*Red Flags*):**
   - Hemoptisis, penurunan BB drastis, demam malam hari (indikasi kuat evaluasi keganasan paru atau TB aktif).

---

### 3.3 Agent 3: Quantitative Risk & GOLD Stratification Scoring Agent
* **Model:** `llama-3.3-70b-versatile`
* **Temperature:** `0.1`
* **Response Format:** `json_object`
* **Peran:** Menghitung skor probabilitas komposit PPOK ($0 - 100$) berdasarkan sintesis matematis kriteria PUMA non-perokok, skala sesak mMRC, indeks paparan lingkungan, dan usia.

#### Matriks Pembobotan Risiko Komposit ($S_{\text{composite}}$):
| Komponen Klinis | Parameter | Bobot Maksimal |
|---|---|---|
| **Paparan Biomassa Dapur** | Adjusted Hour-Years $\ge 60$ ($+30$), $30-59$ ($+18$), $<30$ ($+8$) | 30 poin |
| **Derajat Sesak mMRC** | Grade 4 ($+25$), Grade 3 ($+20$), Grade 2 ($+15$), Grade 1 ($+8$), Grade 0 ($0$) | 25 poin |
| **Karakteristik Batuk Kronis** | Batuk berdahak $>3$ bulan berulang di pagi hari | 15 poin |
| **Paparan Sekunder (SHS + Polusi)** | SHS Score $>20$ ($+10$), Polusi/Debu Okupasional ($+5$) | 15 poin |
| **Faktor Usia & Gender** | Usia $\ge 50$ tahun ($+10$), Usia $40-49$ tahun ($+5$) | 10 poin |
| **Ketiadaan Riwayat Asma Anak** | Tidak ada asma masa kecil ($+5$ mendukung PPOK) | 5 poin |

#### Stratifikasi Risiko:
* **$0 - 29$ (LOW / RENDAH):** Iritasi saluran napas atas reversibel, risiko PPOK rendah.
* **$30 - 64$ (MODERATE / WASPADA):** Kecurigaan bronkitis kronis / disfungsi jalan napas kecil. Dianjurkan evaluasi faskes primer.
* **$65 - 100$ (HIGH / TINGGI):** Indikasi kuat PPOK stabil non-perokok. **Wajib Spirometri Pos-Bronkodilator segera**.

---

### 3.4 Agent 4: Actionable Dossier & Clinical Protocol Synthesizer Agent
* **Model:** `llama-3.3-70b-versatile`
* **Temperature:** `0.2`
* **Response Format:** `json_object`
* **Peran:** Mengintegrasikan seluruh temuan agen sebelumnya menjadi dua draf output terpisah:
1. **Panduan Pasien (Patient Action Plan):** Bahasa Indonesia komunikatif, langkah mitigasi dapur, latihan pernapasan bibir terkatup (*pursed-lip breathing*).
2. **Surat Rujukan Dokter (Physician Medical Brief):** Format SOAP (*Subjective, Objective, Assessment, Plan*) formal, dugaan ICD-10 (J44.9 PPOK non-spesifik / J44.8 PPOK biomassa), dan protokol konfirmasi spirometri GOLD ($FEV_1/FVC < 0.70$ pos-400mcg Salbutamol).

---

## 4. Arsitektur API Endpoint & Live Telemetry Streaming (SSE)

Untuk memberikan transparansi inferensi bagi pengguna, API menggunakan **Server-Sent Events (SSE)** via Next.js Route Handler (`app/api/screen/route.ts`).

### 4.1 Siklus Event Telemetri

```
Client (EventSource / fetch stream) ──► POST /api/screen
                                          │
    [Event 1: agent_start]  ◄────────────┤ (Agent 1: Exposure Parsing...)
    [Event 2: agent_step]   ◄────────────┤ (Hour-Years: 72 calculated)
    [Event 3: agent_start]  ◄────────────┤ (Parallel: Agent 2 & Agent 3 running...)
    [Event 4: agent_step]   ◄────────────┤ (Differential: Biomass COPD 78% vs Asthma 15%)
    [Event 5: agent_step]   ◄────────────┤ (Risk Score: 78/100 - HIGH)
    [Event 6: agent_start]  ◄────────────┤ (Agent 4: Generating Clinical Dossier...)
    [Event 7: complete]     ◄────────────┤ (Full Structured Dossier JSON payload)
```

### 4.2 Struktur Payload Event SSE
```typescript
export interface StreamTelemetryEvent {
  step: "intake" | "differential" | "scoring" | "dossier" | "complete" | "error";
  agentName: string;
  status: "pending" | "running" | "completed" | "failed";
  progressPercent: number;
  message: string;
  timestamp: number;
  partialData?: Record<string, unknown>;
}
```

---

## 5. Skema Data & Kontrak Zod Pipeline

```typescript
// types/pipeline.types.ts
import { z } from "zod";

// Schema Output Agent 1
export const ExposureOutputSchema = z.object({
  rawBiomassHourYears: z.number(),
  adjustedBiomassHourYears: z.number(),
  secondhandSmokeIndex: z.number(),
  occupationalRiskLevel: z.enum(["low", "medium", "high"]),
  exposureContribution: z.object({
    biomassPercent: z.number(),
    secondhandSmokePercent: z.number(),
    ambientPollutionPercent: z.number(),
  }),
  primaryExposureSummary: z.string(),
});

// Schema Output Agent 2
export const DifferentialOutputSchema = z.object({
  primarySuspect: z.string(),
  icd10Suspect: z.string(), // e.g. "J44.9"
  differentialList: z.array(
    z.object({
      condition: z.string(),
      probability: z.number().min(0).max(100),
      clinicalRationale: z.string(),
    })
  ),
  copdVsAsthmaFeatures: z.object({
    supportsCOPD: z.array(z.string()),
    supportsAsthma: z.array(z.string()),
  }),
  redFlagsIdentified: z.array(z.string()),
  urgentMedicalAttentionRequired: z.boolean(),
});

// Schema Output Agent 3
export const RiskScoringOutputSchema = z.object({
  compositeRiskScore: z.number().min(0).max(100),
  riskTier: z.enum(["LOW", "MODERATE", "HIGH"]),
  goldRiskCategory: z.enum(["LOW_RISK_EARLY", "SUSPECTED_MODERATE_COPD", "SUSPECTED_SEVERE_PULMONARY_OBSTRUCTION"]),
  pumaScore: z.number(),
  spirometryUrgency: z.enum(["ROUTINE", "RECOMMENDED", "URGENT"]),
});

// Schema Unified Final Output (Agent 4 + Combined)
export const UnifiedScreeningDossierSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  patientDemographics: z.object({
    age: z.number(),
    gender: z.enum(["male", "female"]),
    smokingStatus: z.string(),
  }),
  exposureMetrics: ExposureOutputSchema,
  differentialAnalysis: DifferentialOutputSchema,
  riskAssessment: RiskScoringOutputSchema,
  actionableDossier: z.object({
    patientPlan: z.object({
      summaryText: z.string(),
      kitchenMitigationSteps: z.array(z.string()),
      breathingExerciseGuide: z.string(),
      doctorVisitChecklist: z.array(z.string()),
    }),
    physicianBrief: z.object({
      clinicalSoapSummary: z.string(),
      biomassExposureHistoryText: z.string(),
      symptomProgressionText: z.string(),
      spirometryJustification: z.string(),
      recommendedDiagnosticOrders: z.array(z.string()),
      icd10Codes: z.array(z.string()),
    }),
  }),
});

export type UnifiedScreeningDossier = z.infer<typeof UnifiedScreeningDossierSchema>;
```

---

## 6. Strategi Ketahanan, Error Handling, & Fallback Rule Engine

Untuk memastikan sistem tidak pernah *crash* di lapangan (misal saat terjadi kendala kuota API Groq atau timeout jaringan):

1. **Groq SDK Automatic Retries:**
   - Inisialisasi client Groq dengan `maxRetries: 3` dan exponential backoff.
2. **Fallback Deterministic Rule Engine:**
   - Jika inferensi Groq gagal setelah retry, backend secara transparan menjalankan **Deterministic Clinical Rule Engine** berbasis aturan algoritma baku (rumus GOLD/PUMA) untuk menghasilkan skor risiko dan rekomendasi dasar tanpa memblokir pengguna.
3. **Structured JSON Validation & Auto-Repair:**
   - Validasi response menggunakan Zod. Jika LLM menghasilkan format JSON minor yang cacat, parser regex cadangan akan mengekstrak blok JSON sebelum melempar error.

---

## 7. Rencana Implementasi & Checklist Verifikasi

### Milestones
* [ ] **M2.1:** Setup `groq-sdk` client instance di Next.js backend dengan environment variable `GROQ_API_KEY`.
* [ ] **M2.2:** Pembuatan prompt templates & fungsi pemanggil terpisah untuk Agent 1, Agent 2, Agent 3, dan Agent 4.
* [ ] **M2.3:** Implementasi pipeline paralel (`Promise.all`) untuk eksekusi Agent 2 & Agent 3 bersamaan.
* [ ] **M2.4:** Pembuatan endpoint SSE `/api/screen` dengan streaming telemetry stepper ke frontend.
* [ ] **M2.5:** Implementasi Fallback Deterministic Rule Engine untuk skenario offline/API error.
* [ ] **M2.6:** Benchmark latensi total siklus pipeline (< 2.5 detik) dan pengujian validitas JSON mode.

### Kriteria Keberhasilan (Definition of Done)
1. Seluruh 4 agen berhasil mengeksekusi pipeline dan menghasilkan payload yang 100% lolos validasi `UnifiedScreeningDossierSchema`.
2. Antarmuka menerima sinyal telemetri bertahap dan menampilkan animasi progres agen tanpa stuttering.
3. Waktu respon rata-rata end-to-end tidak melebihi 2.5 detik pada koneksi internet normal.
4. Mode fallback bekerja mulus saat API key tidak aktif atau jaringan terputus.
