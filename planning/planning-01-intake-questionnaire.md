# Feature Planning 01: Adaptive Intake & Clinical Questionnaire Engine

## 1. Executive Summary & Clinical Context

### 1.1 Latar Belakang Masalah
Penyakit Paru Obstruktif Kronis (PPOK / *COPD*) secara tradisional dikaitkan dengan riwayat merokok aktif tembakau. Namun, bukti epidemiologis global terbaru menunjukkan bahwa **25% – 45% pasien PPOK di negara berkembang adalah non-perokok**, dengan mayoritas korban adalah perempuan dan anak-anak yang terpapar:
1. **Asap Biomassa Dapur:** Kayu bakar, arang, briket, atau minyak tanah di dapur dengan ventilasi buruk.
2. **Perokok Pasif Kronis (*Secondhand Smoke*):** Paparan jangka panjang di lingkungan rumah tangga atau tempat kerja.
3. **Polusi Udara Partikulat (PM2.5) & Debu Okupasional:** Pekerja jalanan, pekerja pabrik tekstil/kayu, atau penduduk area urban padat lalu lintas.

Karena tidak memiliki riwayat merokok, kelompok ini kerap mengalami **keterlambatan diagnosis (underdiagnosis/misdiagnosis)** hingga mencapai stadium lanjut karena gejala awal (batuk kronis, sesak napas exertional) sering diabaikan atau disalahartikan sebagai asma biasa atau bronkitis ringan.

### 1.2 Tujuan Fitur
Membangun modul kuesioner interaktif multi-tahap yang adaptif, ramah seluler (*mobile-first*), cepat (selesai < 3 menit tanpa login), dan mampu mengekstraksi parameter paparan lingkungan non-tembakau terstandarisasi untuk diteruskan ke Pipeline Multi-Agent Groq.

---

## 2. Formulir & Struktur Logika Kuesioner Adaptif

Kuesioner dirancang dalam 4 langkah progresif (*step wizard*) dengan transisi visual halus:

```
[ Step 1: Profil Demografi ] ──► [ Step 2: Paparan Lingkungan Non-Tembakau ]
                                                    │
                                                    ▼
[ Step 4: Red Flags & Tinjauan ] ◄── [ Step 3: Gejala & Skala mMRC / PUMA ]
```

### 2.1 Step 1: Demografi & Status Merokok Dasar (Kriteria Eksklusi/Inklusi)
* **Usia:** Angka (PPOK non-perokok dominan muncul pada usia $\ge 35$ tahun akibat paparan kumulatif).
* **Jenis Kelamin:** Laki-laki / Perempuan.
* **Status Merokok Pribadi:**
  * *Tidak Pernah Merokok (< 100 batang seumur hidup)* ➔ **Inklusi Utama**.
  * *Mantan Perokok (Berhenti > 1 tahun lalu)* ➔ Hitung *Pack-Years* tambahan.
  * *Perokok Aktif* ➔ Skrining umum (disertai catatan risiko ganda).

### 2.2 Step 2: Identifikasi Paparan Lingkungan Non-Tembakau
* **Bagian A — Asap Biomassa Dapur:**
  * Jenis bahan bakar memasak utama: *Kayu Bakar / Arang / Minyak Tanah / Gas LPG / Listrik*.
  * Rata-rata durasi memasak per hari (Jam/Hari): `[0.5, 1, 2, 3, 4, >5]`.
  * Lama penggunaan bahan bakar tersebut (Tahun): `[Angka input]`.
  * Kondisi ventilasi dapur:
    * *Dapur terbuka / memiliki cerobong asap / blower*
    * *Dapur semi-terbuka dengan jendela*
    * *Dapur tertutup dalam ruangan tanpa ventilasi memadai (ventilasi buruk)*
* **Bagian B — Paparan Asap Rokok Pasif (*Secondhand Smoke*):**
  * Jumlah perokok aktif yang tinggal serumah: `[0, 1, 2, 3+]`.
  * Durasi tinggal bersama perokok (Tahun): `[Angka input]`.
  * Frekuensi terpapar asap rokok di dalam rumah: *Setiap hari / Beberapa kali seminggu / Jarang*.
* **Bagian C — Polusi Partikulat & Debu Okupasional:**
  * Penggunaan obat nyamuk bakar: *Hampir setiap malam / 1-3x seminggu / Tidak pernah*.
  * Lokasi tempat tinggal: *Pinggir jalan raya padat / Kawasan industri / Perumahan biasa / Pedesaan*.
  * Pekerjaan berisiko debu tinggi (tukang parkir/ojek online, pekerja tambang/bangunan, tekstil/penggilingan): *Ya / Tidak* (+ durasi tahun).

### 2.3 Step 3: Gejala Klinis, Skala Sesak mMRC, & Kriteria PUMA
* **Karakteristik Batuk & Dahak:**
  * Batuk berlangsung lebih dari 3 bulan dalam setahun: *Ya / Tidak*.
  * Batuk terutama berdahak tebal di pagi hari (Khas bronkitis kronis): *Ya / Tidak*.
  * Terdengar suara mengi (*wheezing*) saat bernapas: *Sering / Jarang / Tidak pernah*.
  * Riwayat asma/alergi sejak usia kanak-kanak: *Ya / Tidak* (Krusial untuk diferensiasi asma vs PPOK onset dewasa).
* **Skala Sesak Napas mMRC (*Modified Medical Research Council Dyspnea Scale*):**
  * **Grade 0:** Hanya sesak saat berolahraga berat.
  * **Grade 1:** Sesak napas saat berjalan cepat di tempat datar atau jalan sedikit menanjak.
  * **Grade 2:** Berjalan lebih lambat dari orang seusia di jalan datar karena sesak, atau harus berhenti untuk bernapas saat berjalan dengan kecepatan sendiri.
  * **Grade 3:** Berhenti untuk bernapas setelah berjalan sekitar 100 meter atau setelah beberapa menit di jalan datar.
  * **Grade 4:** Terlalu sesak untuk keluar rumah, atau sesak saat memakai/melepas pakaian.

### 2.4 Step 4: Pemeriksaan Tanda Bahaya (*Red Flags Screening*)
Pemeriksaan gejala alarm yang membutuhkan penanganan medis segera (TB Paru, Kanker Paru, Dekompensasi Kordis):
* [ ] Batuk bercampur darah (*Hemoptisis*).
* [ ] Penurunan berat badan drastis tanpa sebab yang jelas dalam 3 bulan terakhir.
* [ ] Demam/keringat malam terus-menerus.
* [ ] Nyeri dada tajam saat menarik napas dalam.
* [ ] Pembengkakan pada kedua tungkai kaki (*Edema perifer*).

---

## 3. Rumus & Komputasi Indeks Paparan di Sisi Klien

Sebelum dikirim ke backend, antarmuka menghitung indikator kuantitatif awal untuk validasi instan:

### 3.1 Biomass Hour-Years Index ($I_{\text{biomass}}$)
$$\text{Biomass Hour-Years} = \text{Rata-rata Jam Memasak per Hari} \times \text{Tahun Penggunaan Bahan Bakar}$$
*Faktor Pengali Ventilasi ($f_v$):*
* Ventilasi Baik / Terbuka: $f_v = 0.7$
* Ventilasi Sedang (Jendela): $f_v = 1.0$
* Ventilasi Buruk / Tertutup: $f_v = 1.5$

$$\text{Adjusted Biomass Index} = I_{\text{biomass}} \times f_v$$
* *Cut-off Klinis:* Nilai adjusted $> 60 \text{ hour-years}$ diasosiasikan dengan risiko signifikan obstruksi jalan napas menetap (GOLD Stage 1–2).

### 3.2 Secondhand Smoke Cumulative Index ($I_{\text{SHS}}$)
$$I_{\text{SHS}} = \text{Jumlah Perokok Serumah} \times \text{Tahun Tinggal Bersama} \times (\text{Faktor Frekuensi})$$
* *Frekuensi:* Setiap hari ($1.0$), 1-3x seminggu ($0.5$), Jarang ($0.2$).

### 3.3 Preliminary PUMA Score Calculator
Skor PUMA (*Predi-COPD in Unexplored Populations*) disesuaikan untuk non-perokok:
* Jenis Kelamin Perempuan + Paparan Biomassa $\ge 10$ tahun: $+2$ poin.
* Usia $\ge 50$ tahun: $+2$ poin.
* Batuk berdahak $> 3$ bulan: $+1$ poin.
* mMRC Score $\ge 2$: $+2$ poin.
* *Total PUMA $\ge 5$ mengindikasikan perlunya uji spirometri pos-bronkodilator.*

---

## 4. Desain UI/UX & Arsitektur Komponen

### 4.1 Prinsip Desain
* **Glassmorphism Medical Modern:** Dark slate & emerald teal accents (`#0f172a`, `#064e3b`, `#10b981`, `#06b6d4`).
* **Mobile-First & Touch-Optimized:** Pilihan radio berupa kartu interaktif dengan feedback visual instan (*tap target $\ge 48\text{px}$*).
* **Auto-Save & Resume:** State form otomatis tersimpan di `localStorage` (`pulmoscreen_intake_draft`) sehingga pengguna tidak kehilangan progres jika tidak sengaja menutup browser.
* **Progress Bar & Stepper:** Visualisasi persentase pengisian yang halus menggunakan Framer Motion.

### 4.2 Struktur Direktori & Komponen

```
components/questionnaire/
├── QuestionnaireContainer.tsx    # State controller & step orchestrator
├── StepNavigation.tsx            # Tombol kembali, lanjut, dan progress indicator
├── steps/
│   ├── Step1Demographics.tsx     # Usia, gender, status merokok
│   ├── Step2Environment.tsx      # Biomassa, perokok pasif, polusi, obat nyamuk
│   ├── Step3Symptoms.tsx         # Batuk, dahak, mengi, mMRC slider/cards
│   └── Step4RedFlags.tsx         # Tanda bahaya, konfirmasi submit
├── ui/
│   ├── ChoiceCard.tsx            # Kartu pilihan interaktif dengan ikon
│   ├── ExposureGaugeMini.tsx     # Kalkulasi real-time Hour-Years di card
│   └── MmrcCardSelector.tsx      # Visualisasi skala mMRC interaktif
└── types/
    └── questionnaire.types.ts    # Zod schemas & TypeScript definitions
```

---

## 5. Skema Data & Kontrak Tipe (TypeScript & Zod)

```typescript
// types/questionnaire.types.ts
import { z } from "zod";

export const QuestionnaireSchema = z.object({
  // Demografi
  age: z.number().min(18).max(110),
  gender: z.enum(["male", "female"]),
  smokingStatus: z.enum(["never", "former", "active"]),
  formerPackYears: z.number().optional().default(0),

  // Paparan Biomassa
  cookingFuel: z.enum(["firewood", "charcoal", "kerosene", "lpg", "electric"]),
  cookingHoursPerDay: z.number().min(0).max(24),
  cookingYears: z.number().min(0).max(80),
  kitchenVentilation: z.enum(["good_open", "moderate_window", "poor_closed"]),

  // Paparan Perokok Pasif
  smokersInHouse: z.number().min(0).max(10),
  secondhandYears: z.number().min(0).max(80),
  secondhandFrequency: z.enum(["daily", "weekly", "rarely"]),

  // Polusi & Debu
  mosquitoCoilUsage: z.enum(["daily", "occasional", "never"]),
  residenceLocation: z.enum(["highway_busy", "industrial", "urban_standard", "rural"]),
  occupationalDustExposure: z.boolean(),
  occupationalYears: z.number().optional().default(0),

  // Gejala Klinis
  chronicCoughMonths: z.boolean(),
  morningPhlegm: z.boolean(),
  wheezingFrequency: z.enum(["frequent", "occasional", "never"]),
  childhoodAsthmaHistory: z.boolean(),
  mmrcGrade: z.number().min(0).max(4),

  // Red Flags
  redFlags: z.object({
    hemoptysis: z.boolean(),
    unexplainedWeightLoss: z.boolean(),
    nightSweatsFever: z.boolean(),
    chestPain: z.boolean(),
    legSwelling: z.boolean(),
  }),
});

export type QuestionnaireData = z.infer<typeof QuestionnaireSchema>;

export interface CalculatedExposureMetrics {
  rawBiomassHourYears: number;
  adjustedBiomassHourYears: number;
  secondhandSmokeScore: number;
  preliminaryPumaScore: number;
  hasRedFlags: boolean;
}
```

---

## 6. Rencana Implementasi & Checklist Verifikasi

### Milestones
* [ ] **M1.1:** Setup struktur types dan validasi form menggunakan Zod Schema.
* [ ] **M1.2:** Pembuatan komponen atomik UI (`ChoiceCard`, `MmrcCardSelector`, `StepNavigation`).
* [ ] **M1.3:** Implementasi Step 1 hingga Step 4 lengkap dengan validasi error dan auto-save `localStorage`.
* [ ] **M1.4:** Integrasi fungsi kalkulasi metrik lokal (*Hour-Years*, *Secondhand Index*, *PUMA preliminary*).
* [ ] **M1.5:** Unit test kuesioner & verifikasi kompatibilitas responsive layout (iOS Safari, Android Chrome).

### Kriteria Keberhasilan (Definition of Done)
1. Pengguna dapat menyelesaikan seluruh kuesioner dalam waktu $< 3$ menit pada layar ponsel (375px width).
2. Perhitungan *Biomass Hour-Years* dan *Adjusted Index* berjalan akurat di sisi klien tanpa jeda.
3. Form menolak submit jika terdapat input tidak valid dan memberikan pesan koreksi yang jelas dalam Bahasa Indonesia.
4. Payload bersih siap diteruskan ke endpoint `/api/screen`.
