# Feature Planning 03: Clinical Risk Dashboard, Environmental Exposure Breakdown & Interactive Action Hub

## 1. Executive Summary & UX Philosophy

### 1.1 Latar Belakang & Tantangan Desain
Setelah pengguna menyelesaikan kuesioner dan Pipeline Multi-Agent Groq selesai memproses data klinis, hasil skrining harus dikomunikasikan secara **jelas, tidak menakut-nakuti, berbasis bukti, dan langsung dapat ditindaklanjuti (*actionable*)**. 

Tantangan utama pada penapisan PPOK non-perokok adalah **bias persepsi**: pasien sering merasa tidak mungkin menderita penyakit paru kronis karena *"saya tidak pernah merokok"*. Oleh karena itu, dashboard harus secara visual membuktikan korelasi antara **paparan partikulat lingkungan tak kasat mata (asap biomassa dapur, perokok pasif, polusi urban)** dengan penurunan fungsi paru mereka.

### 1.2 Tujuan Fitur
Membangun antarmuka dashboard klinis yang responsif, modern (*medical glassmorphism aesthetic*), interaktif, dan terbagi ke dalam 4 zona fungsional utama:
1. **Hero Risk Gauge Meter (0–100):** Indikator visual tingkat keparahan risiko instan dengan status stratifikasi GOLD.
2. **Breakdown Kontribusi Paparan Lingkungan:** Visualisasi proporsi pemicu utama (Biomassa vs Rokok Pasif vs Polusi Urban).
3. **Komparator Diferensial Klinis (PPOK vs Asma):** Edukasi komparatif mengapa gejala pasien lebih condong ke PPOK biomassa dibanding asma biasa.
4. **Interactive Action Hub & Pursed-Lip Breathing Coach:** Alat bantu latihan napas interaktif dengan animasi ritmis untuk meredakan sesak secara mandiri.

---

## 2. Struktur Visual & Tata Letak Dashboard (Grid Layout)

```
┌────────────────────────────────────────────────────────────────────────┐
│  [ HEADER ]: ID Rekam Skrining #PS-88492 | Waktu | Badge Status       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────────────────┐ ┌───────────────────────────────┐ │
│  │     ZONA 1: HERO RISK GAUGE     │ │   ZONA 2: EXPOSURE ATTRIBUTION│ │
│  │   Radial Gauge SVG (0 - 100)    │ │   Donut / Bar Chart Breakdown │ │
│  │   Skor: 78/100 (TINGGI)         │ │   - 65% Asap Biomassa (72 h-y)│ │
│  │   Status: Indikasi Kuat PPOK    │ │   - 25% Perokok Pasif (20 thn)│ │
│  │   [!] Red Flag Banner (jika ada)│ │   - 10% Polusi Urban          │ │
│  └─────────────────────────────────┘ └───────────────────────────────┘ │
│                                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │     ZONA 3: CLINICAL INSIGHTS & DIFFERENTIAL COMPARISON           │ │
│  │   Tabs: [ Mengapa Curiga PPOK? ] vs [ Mengapa Bukan Asma Biasa? ] │ │
│  │   • Onset usia 54 tahun (PPOK) vs Onset masa kecil (-)            │ │
│  │   • Batuk berdahak pagi hari progresif vs Variabilitas malam hari │ │
│  │   • Skala Sesak mMRC Grade 2 (Berjalan lebih lambat di tanjakan)  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ┌─────────────────────────────────┐ ┌───────────────────────────────┐ │
│  │   ZONA 4A: BREATHING TRAINER    │ │   ZONA 4B: ACTION CHECKLIST   │ │
│  │   Pursed-Lip Breathing Coach    │ │   Mitigasi Dapur & Faskes     │ │
│  │   [ Animated Expanding Orb ]    │ │   [x] Pasang Cerobong Asap    │ │
│  │   Tarik Napas (2s) - Hembus (4s)│ │   [ ] Buka Ventilasi Silang   │ │
│  │   Mulai Latihan Mandiri (1 Menit│ │   [ ] Bawa PDF ke Puskesmas   │ │
│  └─────────────────────────────────┘ └───────────────────────────────┘ │
│                                                                        │
│  [ ACTION BAR ]: [ 📄 Unduh Surat Rujukan Puskesmas (PDF) ] [ Bagikan ]│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Spesifikasi Komponen Interaktif

### 3.1 Zona 1: Hero Radial Gauge Meter & Status Badge
* **Komponen:** `RiskGaugeMeter.tsx`
* **Mekanisme Visual:**
  * Render busur SVG 240-derajat dengan gradien warna dinamis:
    * **Hijau Zamrud (`#10b981`):** Skor $0 - 29$ (*Risiko Rendah / Iritasi Reversibel*)
    * **Kuning Amber (`#f59e0b`):** Skor $30 - 64$ (*Risiko Moderat / Disfungsi Jalan Napas*)
    * **Merah Mawar (`#f43f5e`):** Skor $65 - 100$ (*Risiko Tinggi / Indikasi Spirometri Segera*)
  * Jarum indikator atau lingkaran progresif teranimasi mulus (*Framer Motion spring physics*).
  * **Alert Banner Red Flags:** Jika `hasRedFlags === true`, tampilkan kotak peringatan berkedip lembut dengan ikon alarm medis yang menganjurkan pemeriksaan gawat darurat atau evaluasi TB/Keganasan.

### 3.2 Zona 2: Visualisasi Breakdown Kontribusi Paparan
* **Komponen:** `ExposureBreakdownChart.tsx`
* **Mekanisme Visual:**
  * Diagram batang tersegmen (*segmented progress bar*) atau *donut ring chart* interaktif.
  * Kartu detail metrik dengan angka terhitung nyata:
    * **Biomass Hour-Years:** Contoh `72.0 Jam-Tahun` ($>60$ = Melewati ambang batas risiko tinggi).
    * **Secondhand Smoke Index:** Contoh `24.0 Poin` ($2$ perokok $\times 12$ tahun tinggal bersama).
    * **Urban PM2.5 / Debu:** Kategori paparan kerja harian.
  * Efek *hover tooltip* yang memberikan penjelasan kontekstual dalam bahasa awam.

### 3.3 Zona 3: Kartu Komparator Diferensial Klinis
* **Komponen:** `ClinicalDifferentialCard.tsx`
* **Mekanisme Visual:**
  * Tampilan kartu komparasi berdampingan (*side-by-side comparative grid*) atau *tabbed view* di mobile:
    * **Kolom Kiri (Temuan Pasien Mendukung PPOK Non-Perokok):** Indikator bercentang hijau medis (Usia onset $\ge 40$ thn, batuk pagi hari $>3$ bulan, riwayat kayu bakar $>15$ thn, sesak saat beraktivitas).
    * **Kolom Kanan (Temuan yang Menyingkirkan Asma Murni):** Riwayat atopi negatif, ketiadaan mengi episodik masa kanak-kanak, pola batuk yang tidak bervariasi musiman.

### 3.4 Zona 4A: Interactive Pursed-Lip Breathing (PLB) Simulator
* **Komponen:** `PursedLipBreathingCoach.tsx`
* **Konteks Klinis:** *Pursed-Lip Breathing* (PLB) adalah teknik fisioterapi paru standar GOLD untuk meningkatkan tekanan positif di jalan napas (*PEEP ekstrinsik*), mencegah kolaps bronkiolus saat ekspirasi, dan meredakan sesak napas akut.
* **Mekanisme Interaktif:**
  1. Tombol **"Mulai Latihan Napas (1 Menit)"**.
  2. Lingkaran visual bernapas (*Pulsing Breathing Orb*):
     * **Fase 1 (Tarik Napas melalui Hidung):** Lingkaran membesar selama $2.0\text{ detik}$ (Warna Teal terang).
     * **Fase 2 (Tahan Sejenak):** Diam selama $1.0\text{ detik}$.
     * **Fase 3 (Hembuskan melalui Bibir Terkatup / Seperti Meniup Lilin):** Lingkaran mengecil perlahan selama $4.0\text{ detik}$ (Warna Indigo lembut).
  3. Audio chime lembut / visual haptik (Web Vibration API pada mobile) yang menandai pergantian siklus.
  4. Penghitung siklus latihan ($1$ sesi $= 8$ siklus).

### 3.5 Zona 4B: Mitigasi Lingkungan & Checklist Konsultasi Dokter
* **Komponen:** `MitigationChecklist.tsx`
* **Item Checklist Interaktif:**
  * [ ] **Modifikasi Ventilasi Dapur:** Buka jendela ganda berlawanan arah saat memasak atau gunakan kipas exhaust/cerobong asap.
  * [ ] **Zona Bebas Asap Rokok Rumah Tangga:** Larang merokok di dalam seluruh area tertutup rumah.
  * [ ] **Persiapan Kunjungan Puskesmas:**
    * Catat riwayat lama memasak kayu bakar/minyak tanah untuk disampaikan ke dokter.
    * Minta dokter melakukan pemeriksaan stetoskop paru dan merekomendasikan **Uji Spirometri Pos-Bronkodilator**.

---

## 4. Arsitektur State Management & Persistence

Untuk menjamin performa tinggi dan transisi instan dari kuesioner ke dashboard:

```typescript
// store/useScreeningStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UnifiedScreeningDossier } from "@/types/pipeline.types";
import { QuestionnaireData } from "@/types/questionnaire.types";

interface ScreeningStore {
  // State Input
  draftQuestionnaire: Partial<QuestionnaireData> | null;
  setDraftQuestionnaire: (data: Partial<QuestionnaireData>) => void;
  clearDraft: () => void;

  // State Hasil Skrining Terakhir
  activeDossier: UnifiedScreeningDossier | null;
  setActiveDossier: (dossier: UnifiedScreeningDossier) => void;

  // Riwayat Skrining (Tersimpan Lokal)
  history: UnifiedScreeningDossier[];
  saveToHistory: (dossier: UnifiedScreeningDossier) => void;
  clearHistory: () => void;

  // UI States
  isBreathingCoachActive: boolean;
  setIsBreathingCoachActive: (active: boolean) => void;
}

export const useScreeningStore = create<ScreeningStore>()(
  persist(
    (set) => ({
      draftQuestionnaire: null,
      setDraftQuestionnaire: (data) => set({ draftQuestionnaire: data }),
      clearDraft: () => set({ draftQuestionnaire: null }),

      activeDossier: null,
      setActiveDossier: (dossier) => set({ activeDossier: dossier }),

      history: [],
      saveToHistory: (dossier) =>
        set((state) => ({
          history: [dossier, ...state.history.filter((item) => item.id !== dossier.id)].slice(0, 10),
        })),
      clearHistory: () => set({ history: [] }),

      isBreathingCoachActive: false,
      setIsBreathingCoachActive: (active) => set({ isBreathingCoachActive: active }),
    }),
    {
      name: "pulmoscreen_storage_v1",
    }
  )
);
```

---

## 5. Struktur Direktori & Komponen Dashboard

```
components/dashboard/
├── DashboardContainer.tsx         # Root container & data hydration
├── sections/
│   ├── RiskGaugeSection.tsx       # Radial Gauge, skor angka, badge keparahan
│   ├── ExposureBreakdownCard.tsx  # Diagram batang/donut kontribusi paparan
│   ├── ClinicalInsightsCard.tsx   # Komparasi PPOK vs Asma & Red Flags
│   └── ActionHubSection.tsx       # Pursed-Lip Breathing + Mitigation Checklist
├── breathing/
│   ├── BreathingOrbAnimation.tsx  # Framer Motion pulsing circle (2s in, 4s out)
│   └── BreathingAudioChime.ts     # Web Audio API sintetis (tanpa aset mp3 berat)
├── ui/
│   ├── MedicalBadge.tsx           # Badge kategori risiko klinis
│   ├── RadialProgressSvg.tsx      # Komponen SVG math busur gauge
│   └── MetricStatCard.tsx         # Kartu ringkasan angka eksposur
└── hooks/
    ├── useBreathingCycle.ts       # Hook pengatur interval waktu pernapasan
    └── useScreeningShare.ts       # Web Share API & clipboard copy helper
```

---

## 6. Rencana Implementasi & Checklist Verifikasi

### Milestones
* [ ] **M3.1:** Pembuatan visualisasi `RadialProgressSvg` & `RiskGaugeMeter` dengan animasi spring Framer Motion.
* [ ] **M3.2:** Implementasi `ExposureBreakdownCard` dengan perhitungan proporsi biomassa, perokok pasif, dan polusi.
* [ ] **M3.3:** Pembuatan `ClinicalInsightsCard` interaktif dengan tampilan komparasi diferensial diagnosis.
* [ ] **M3.4:** Pembuatan `PursedLipBreathingCoach` lengkap dengan ritme $2\text{s} : 4\text{s}$, visual ripple, dan Web Audio chime sintetis.
* [ ] **M3.5:** Integrasi Zustand store dengan auto-save `localStorage` dan riwayat skrining.
* [ ] **M3.6:** Uji responsivitas pada layar ponsel Android & iPhone (Dark theme contrast accessibility WCAG AA).

### Kriteria Keberhasilan (Definition of Done)
1. Dashboard merender data dari `UnifiedScreeningDossier` dalam waktu $< 100\text{ms}$ setelah proses stream selesai.
2. Animasi radial gauge berputar presisi ke nilai skor ($0 - 100$) tanpa lag (60 FPS).
3. Pelatih pernapasan (*Breathing Coach*) berjalan dengan interval tepat $2\text{s}$ inhalasi dan $4\text{s}$ ekshalasi dengan transisi visual yang menenangkan.
4. Tampilan rapi, kontras tajam, dan mudah dibaca oleh pengguna lanjut usia.
