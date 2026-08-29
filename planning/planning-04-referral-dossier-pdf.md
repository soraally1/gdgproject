# Feature Planning 04: Medical Referral Dossier Engine, Puskesmas Standards & PDF Vector Generator

## 1. Executive Summary & Clinical Rationale

### 1.1 Masalah "Bridge to Care" pada Faskes Primer (Puskesmas)
Banyak aplikasi penapisan kesehatan gagal memberikan dampak klinis nyata karena berhenti pada tampilan skor di layar HP pasien. Saat pasien non-perokok datang ke Puskesmas atau Klinik Pratama mengeluhkan batuk/sesak napas, mereka kerap:
1. Tidak mampu mengartikulasikan riwayat paparan masa lalunya (misal: memasak dengan kayu bakar 20 tahun lalu) secara terstruktur kepada dokter umum.
2. Didiagnosis keliru (*misdiagnosed*) sebagai asma kronis atau ISPA berulang karena ketiadaan riwayat merokok tembakau.
3. Tidak mendapatkan rujukan pemeriksaan baku emas (**Uji Spirometri Pos-Bronkodilator**).

### 1.2 Tujuan Fitur
Membangun modul **Medical Referral Dossier Generator** yang mengubah hasil analisis Multi-Agent Groq menjadi **Surat Rekomendasi Rujukan Klinis Resmi (Format Standar Puskesmas / Faskes Primer)** dalam format **PDF Vektor Berkualitas Cetak Tinggi (A4)** serta tampilan cetak ramah peramban (*Print Stylesheet*).

Surat rujukan ini memuat ringkasan anamnesis terstruktur, kalkulasi kuantitatif *Hour-Years*, justifikasi diagnosis banding berbasis pedoman GOLD 2024, kode klasifikasi penyakit ICD-10, serta QR Code verifikasi integritas digital.

---

## 2. Struktur Standar Dokumen Rujukan Klinis Puskesmas (A4 Layout)

```
┌────────────────────────────────────────────────────────────────────────┐
│ [ KOP RESMI ]: PULMOSCREEN AI — CLINICAL REFERRAL BRIEF (PPOK NON-ROKOK)│
│ ID Dokumen: PS-REF-2026-88492 | Waktu: 29/08/2026 13:45 WIB            │
│ Target Faskes: Puskesmas / Dokter Pemeriksa Fasilitas Kesehatan Primer │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│ 1. IDENTITAS & ANAMNESIS SINGKAT PASIEN                                │
│ ────────────────────────────────────────────────────────────────────── │
│ • Nama / Inisial : Ny. S (Usia: 54 Tahun | Perempuan)                  │
│ • Status Merokok : Tidak Pernah Merokok Aktif (Never-Smoker Konfirmasi)│
│ • Keluhan Utama  : Sesak napas bertambah saat aktivitas (mMRC Grade 2) │
│ • Batuk & Dahak  : Batuk kronis berdahak pagi hari (> 3 bulan/tahun)   │
│                                                                        │
│ 2. KUANTIFIKASI PAPARAN LINGKUNGAN NON-TEMBAKAU TERHITUNG              │
│ ────────────────────────────────────────────────────────────────────── │
│ • Biomass Hour-Years     : 72.0 Jam-Tahun (Kayu Bakar 18 thn x 4 jam)  │
│ • Kondisi Ventilasi Dapur: Buruk / Tertutup dalam ruangan (Factor 1.5x)│
│ • Paparan Rokok Pasif    : Indeks 20.0 (Suami merokok aktif di rumah)  │
│ • Evaluasi Paparan       : MELEWATI AMBANG BATAS RISIKO TINGGI (>60 h-y│
│                                                                        │
│ 3. RESUME PENALARAN DIFERENSIAL KLINIS & DOKUMENTASI ICD-10            │
│ ────────────────────────────────────────────────────────────────────── │
│ • Dugaan Utama (Primary) : Suspek PPOK Akibat Inhalasi Biomassa Dapur │
│                            (ICD-10: J44.8 / J44.9)                     │
│ • Diagnosis Banding (DD) : - Asma Onset Dewasa (ICD-10: J45.9)         │
│                            - Bronkiektasis / Sindrom Pasca-TB          │
│ • Justifikasi Diferensial: Onset usia dewasa lanjut, progresif tanpa   │
│   riwayat atopi masa kecil, pola batuk pagi hari khas bronkitis.       │
│ • Red Flags Screening    : Negatif (Tidak ada hemoptisis / penurunan BB│
│                                                                        │
│ 4. REKOMENDASI PROTOKOL PEMERIKSAAN MEDIS (GOLD 2024 GUIDELINES)       │
│ ────────────────────────────────────────────────────────────────────── │
│ [ ] 1. Pemeriksaan Fisik Paru (Auskultasi: Ekspirasi memanjang, wheezing)
│ [ ] 2. BAKU EMAS: Uji Spirometri Pos-Bronkodilator (Salbutamol 400 mcg)│
│        Target Konfirmasi: FEV1/FVC < 0.70 pasca-bronkodilator          │
│ [ ] 3. Foto Rontgen Toraks PA (Menyingkirkan kardiomegali, TB, efusi)  │
│                                                                        │
│ 5. REKOMENDASI TERAPI AWAL & EDUKASI NON-FARMAKOLOGIS                  │
│ ────────────────────────────────────────────────────────────────────── │
│ • Edukasi modifikasi dapur: Segera perbaiki sirkulasi udara / cerobong │
│ • Edukasi fisioterapi mandiri: Teknik Pursed-Lip Breathing             │
│ • Pertimbangan vaksinasi influenza & pneumokokus                       │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ [ FOOTER ]: Dokumen dihasilkan oleh PulmoScreen AI Multi-Agent Engine. │
│ [ QR CODE ]: Verifikasi Digital Hasil | Tanda Tangan Dokter Pemeriksa: │
│                                                                        │
│ ___________________________            ( ____________________________ )│
│ Tanggal Pemeriksaan Faskes             dr. Pemeriksa / SIP Puskesmas   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Arsitektur Teknis Generator PDF (@react-pdf/renderer + Print CSS)

Untuk memastikan kompatibilitas penuh di berbagai perangkat seluler dan desktop tanpa ketergantungan server rendering yang lambat, sistem menggunakan **Dual-Engine Export Architecture**:

```
                              [ UnifiedScreeningDossier ]
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
       [ Engine 1: Client Vector PDF ]               [ Engine 2: Native Print CSS ]
           (@react-pdf/renderer)                           (@media print)
                    │                                             │
      - Menghasilkan file PDF biner murni            - Fallback cetak langsung browser
      - Font vektor tajam (Helvetica / Inter)        - CSS grid A4 1-page layout
      - Ukuran file sangat kecil (< 120 KB)          - Preview cetak instan di HP/PC
                    │                                             │
                    └──────────────────────┬──────────────────────┘
                                           │
                                           ▼
                      [ Modal Preview & 1-Click Download ]
                      - Tombol Unduh PDF (Blob URL)
                      - Tombol Cetak Dokumen (window.print())
                      - Tombol Bagikan ke WhatsApp (Web Share)
```

---

## 4. Desain & Skema Komponen PDF (`@react-pdf/renderer`)

```typescript
// components/pdf/ReferralDossierDocument.tsx
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { UnifiedScreeningDossier } from "@/types/pipeline.types";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1e293b",
    lineHeight: 1.4,
  },
  headerContainer: {
    borderBottomWidth: 2,
    borderBottomColor: "#0f766e",
    paddingBottom: 10,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#0f766e",
  },
  brandSubtitle: {
    fontSize: 8,
    color: "#64748b",
  },
  metaBadge: {
    backgroundColor: "#f1f5f9",
    padding: "4 8",
    borderRadius: 4,
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0f766e",
    backgroundColor: "#f0fdfa",
    padding: "3 6",
    marginTop: 8,
    marginBottom: 6,
    borderRadius: 2,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  labelCol: {
    width: "35%",
    fontFamily: "Helvetica-Bold",
    color: "#334155",
  },
  valueCol: {
    width: "65%",
    color: "#0f172a",
  },
  highlightBox: {
    backgroundColor: "#fffbeb",
    borderColor: "#f59e0b",
    borderWidth: 1,
    padding: 6,
    borderRadius: 4,
    marginTop: 4,
    marginBottom: 6,
  },
  checkboxItem: {
    flexDirection: "row",
    marginBottom: 3,
  },
  checkboxBox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "#0f766e",
    marginRight: 6,
  },
  footerContainer: {
    position: "absolute",
    bottom: 24,
    left: 32,
    right: 32,
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
});
```

---

## 5. Generator QR Code & Verifikasi Digital

Untuk menjamin integritas rekam medis rujukan bagi dokter Puskesmas:
1. Sistem menghasilkan **QR Code SVG / Data URL** menggunakan `qrcode` library.
2. QR Code menyematkan tautan verifikasi ringkas dengan token hash yang dapat dipindai oleh dokter menggunakan kamera ponsel untuk melihat ringkasan skrining terenkripsi.
3. QR Code otomatis disematkan pada sudut kanan bawah lembar PDF.

---

## 6. Alur Interaksi Pengguna & Tombol Aksi (Action Bar)

```
[ Dashboard Selesai ] ──► Klik [ "📄 Unduh Surat Rujukan Puskesmas" ]
                                  │
                                  ▼
                ┌───────────────────────────────────┐
                │   Modal Dialog Preview Rujukan    │
                │                                   │
                │   [ Visual Preview Dokumen A4 ]   │
                │                                   │
                │   [ 📥 Unduh PDF ]  [ 🖨️ Cetak ]  │
                │   [ 📲 Bagikan ke WhatsApp / WA ] │
                └───────────────────────────────────┘
```

* **Penamaan File Otomatis:** `Surat_Rujukan_PPOK_PulmoScreen_[ID_SINGKAT]_[TANGGAL].pdf`
* **Integrasi WhatsApp:** Teks ringkas berisi keluhan, skor risiko, dan tautan PDF untuk dikirimkan ke anggota keluarga atau kader posyandu/Puskesmas.

---

## 7. Rencana Implementasi & Checklist Verifikasi

### Milestones
* [ ] **M4.1:** Install dependency `@react-pdf/renderer` dan `qrcode`.
* [ ] **M4.2:** Pembuatan template komponen vektor `@react-pdf/renderer` (`ReferralDossierDocument.tsx`).
* [ ] **M4.3:** Implementasi stylesheet cetak browser `@media print` untuk fallback instan tanpa dependensi rendering.
* [ ] **M4.4:** Pembuatan generator QR Code verifikasi digital dan token payload hasher.
* [ ] **M4.5:** Pembuatan `ReferralPreviewModal.tsx` dengan integrasi download blob, print trigger, dan Web Share API.
* [ ] **M4.6:** Pengujian visual hasil cetak PDF di printer fisik / print to PDF (resolusi teks, tata letak 1 lembar pas tanpa overflow ke halaman 2).

### Kriteria Keberhasilan (Definition of Done)
1. Dokumen PDF ter-generate dalam waktu $< 1.2\text{ detik}$ di browser pengguna tanpa membebani server.
2. Seluruh data identitas, kalkulasi *Hour-Years*, skala mMRC, ICD-10, dan rekomendasi spirometri tercetak presisi dalam **1 lembar halaman A4 penuh**.
3. QR Code dapat dipindai dengan kamera HP dan memverifikasi keabsahan data skrining.
4. Fitur cetak berfungsi mulus baik di Google Chrome, Safari iOS, maupun browser Android.
