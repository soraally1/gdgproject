# PulmoScreen AI — Master Architecture & Feature Planning Index

Sistem Penapisan Dini Penyakit Paru Obstruktif Kronis (PPOK) Tersembunyi pada Populasi Non-Perokok (Korban Asap Biomassa Dapur, Perokok Pasif, dan Polusi Partikulat Urban).

---

## 🗺️ Roadmap & Dokumentasi Fitur

Dokumen perencanaan arsitektur dan teknis PulmoScreen AI dibagi menjadi 4 spesifikasi modular:

| No | Modul / Fitur | File Dokumen | Deskripsi Inti |
|---|---|---|---|
| **01** | **Adaptive Intake & Questionnaire** | [`planning-01-intake-questionnaire.md`](./planning-01-intake-questionnaire.md) | Form adaptif klinis, kalkulator paparan biomassa (*Hour-Years*), indeks perokok pasif, skor mMRC, dan kriteria PUMA. |
| **02** | **Multi-Agent Groq Pipeline** | [`planning-02-multi-agent-pipeline.md`](./planning-02-multi-agent-pipeline.md) | Orkestrasi 4 agen LLM (Groq 8B & 70B), streaming live terminal stepper, JSON mode schema enforcement, dan resilience handling. |
| **03** | **Clinical Risk Dashboard & Action Hub** | [`planning-03-risk-dashboard.md`](./planning-03-risk-dashboard.md) | Visualisasi Gauge Meter risiko (0–100), breakdown faktor paparan lingkungan, simulator latihan *pursed-lip breathing*, dan checklist ventilasi. |
| **04** | **Medical Referral Dossier & PDF Engine** | [`planning-04-referral-dossier-pdf.md`](./planning-04-referral-dossier-pdf.md) | Generator surat rujukan standar Puskesmas/Faskes Primer format PDF resmi, justifikasi spirometri GOLD, dan format rekam medis ringkas. |

---

## 🏗️ Diagram Alur Sistem End-to-End

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER BROWSER / PWA                             │
│                                                                        │
│  [ Landing Page ] ──> [ Adaptive Questionnaire ] (Feature 01)          │
│                              │                                         │
│                              ▼                                         │
│                 [ Pre-calculated Indices ]                             │
│             (Biomass Hour-Years, SHS Index, mMRC)                      │
└──────────────────────────────┬─────────────────────────────────────────┘
                               │ POST /api/screen (SSE Stream)
                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   NEXT.JS BACKEND RUNTIME (API)                        │
│                                                                        │
│  Orkestrasi Multi-Agent via Groq SDK (Feature 02)                      │
│                                                                        │
│  1. Exposure Intake Agent (Llama-3.1-8b-instant)                      │
│     └─► Parsing entitas & kuantifikasi metrik                          │
│                                                                        │
│  2. Clinical Differential Agent (Llama-3.3-70b-versatile)              │
│     ├─► Evaluasi PPOK Non-Perokok vs Asma vs TB / Keganasan            │
│     └─► Parallel execution dengan Agent 3                              │
│                                                                        │
│  3. Quantitative Risk Scoring Agent (Llama-3.3-70b-versatile)          │
│     ├─► Algoritma Skor Komposit (0 - 100) & GOLD/PUMA Stratification   │
│     └─► Parallel execution dengan Agent 2                              │
│                                                                        │
│  4. Actionable Dossier Agent (Llama-3.3-70b-versatile)                 │
│     └─► JSON Mode Structured Output (Physician Brief + Patient Plan)   │
└──────────────────────────────┬─────────────────────────────────────────┘
                               │ Real-time Telemetry & JSON Response
                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        USER DASHBOARD & OUTPUT                         │
│                                                                        │
│  [ Live Terminal Stepper ] ──► [ Interactive Dashboard ] (Feature 03)  │
│                                ├─► Risk Gauge (0-100)                  │
│                                ├─► Exposure Breakdown                  │
│                                ├─► Pursed-Lip Breathing Guide          │
│                                └─► [ Download PDF Dossier ] (Feature 04)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Ringkasan Tech Stack

* **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
* **Styling & UI:** Tailwind CSS v4, Lucide React, Framer Motion
* **LLM Engine:** Groq Cloud SDK (`groq-sdk`)
  * `llama-3.1-8b-instant` (High throughput entity extraction)
  * `llama-3.3-70b-versatile` (Deep clinical reasoning & structured output)
* **Validation:** Zod v3
* **PDF Export:** `@react-pdf/renderer` & jsPDF Vector Engine
* **State Management:** Zustand / React Context dengan LocalStorage persistence
