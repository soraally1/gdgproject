"use client";

import React, { useState } from "react";
import { UnifiedScreeningDossier } from "@/types/pipeline.types";
import { QuestionnaireWizard } from "@/components/questionnaire/QuestionnaireWizard";
import { DashboardView } from "@/components/dashboard/DashboardView";
import {
  IconLungs,
  IconFlame,
  IconWind,
  IconStethoscope,
  IconSparkles,
  IconArrowRight,
  IconShieldAlert,
  IconCheckCircle,
  IconFileText,
} from "@/components/ui/Icons";

export default function Home() {
  const [viewState, setViewState] = useState<"hero" | "questionnaire" | "dashboard">("hero");
  const [activeDossier, setActiveDossier] = useState<UnifiedScreeningDossier | null>(null);

  const handleStartScreening = () => {
    setViewState("questionnaire");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScreeningComplete = (dossier: UnifiedScreeningDossier) => {
    setActiveDossier(dossier);
    setViewState("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewScreening = () => {
    setViewState("questionnaire");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 no-print">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            onClick={() => setViewState("hero")}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-950">
              <IconLungs className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                PulmoScreen <span className="text-emerald-400 font-mono text-xs px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Penapisan Dini PPOK Non-Perokok
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Pipeline: Groq LPU (Llama 8B &amp; 70B)</span>
            </div>

            {viewState === "hero" ? (
              <button
                type="button"
                onClick={handleStartScreening}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Mulai Skrining</span>
                <IconArrowRight className="w-4 h-4" />
              </button>
            ) : viewState === "dashboard" ? (
              <button
                type="button"
                onClick={handleNewScreening}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 transition-colors"
              >
                Skrining Ulang
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main View Router */}
      <main className="flex-1">
        {viewState === "hero" && (
          <div className="space-y-16 pb-16">
            {/* Hero Section */}
            <section className="relative pt-12 pb-16 px-4 overflow-hidden">
              {/* Background Ambient Glows */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />

              <div className="max-w-4xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                  <IconSparkles className="w-4 h-4 text-emerald-400" />
                  <span>Sistem Penapisan Klinis Berbasis Pedoman GOLD 2024</span>
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-none">
                  Cek Kesehatan Paru bagi <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Non-Perokok</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Deteksi dini risiko tersembunyi <strong className="text-white">Penyakit Paru Obstruktif Kronis (PPOK)</strong> akibat paparan asap biomassa dapur, perokok pasif, dan polusi partikulat perkotaan.
                </p>

                {/* Primary CTA */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleStartScreening}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-extrabold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-xl shadow-emerald-950/80 transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <IconLungs className="w-5 h-5 text-slate-950" />
                    <span>Mulai Skrining Paru (Gratis / 3 Menit)</span>
                    <IconArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Micro Evidence Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-left max-w-3xl mx-auto">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <div className="text-2xl font-black text-emerald-400 mb-1">25% – 45%</div>
                    <div className="text-xs font-semibold text-white">PPOK pada Non-Perokok</div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Data global di negara berkembang: sebagian besar korban adalah wanita pemakai tungku dapur.
                    </p>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <div className="text-2xl font-black text-amber-400 mb-1">&ge; 60 Jam-Thn</div>
                    <div className="text-xs font-semibold text-white">Ambang Kritis Biomassa</div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Jam memasak &times; tahun penggunaan kayu bakar memicu obstruksi saluran napas menetap.
                    </p>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <div className="text-2xl font-black text-cyan-400 mb-1">&lt; 1.5 Detik</div>
                    <div className="text-xs font-semibold text-white">Inferensi Multi-Agent Groq</div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Penalaran diferensial simultan (PPOK vs Asma) dan resume rujukan standar Puskesmas.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="max-w-5xl mx-auto px-4 space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Arsitektur Penapisan Multi-Agent Terintegrasi
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                  Memadukan algoritma kuantitatif lingkungan dengan pedoman klinis baku emas GOLD 2024.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-white">Exposure Intake Agent</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Menghitung <strong className="text-slate-200">Biomass Hour-Years</strong>, faktor pengali ventilasi dapur, dan indeks kumulatif paparan rokok pasif serumah.
                  </p>
                  <div className="text-[10px] font-mono text-amber-400">Groq Llama-3.1-8B</div>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-white">Clinical Reasoner</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Membedakan batuk berdahak pagi khas PPOK vs variabilitas malam asma dan mendeteksi <strong className="text-slate-200">Red Flags</strong> TB/keganasan.
                  </p>
                  <div className="text-[10px] font-mono text-cyan-400">Groq Llama-3.3-70B</div>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                    3
                  </div>
                  <h3 className="text-sm font-bold text-white">Quantitative Risk Scorer</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Mengalkulasi skor komposit (0–100), skala sesak <strong className="text-slate-200">mMRC</strong>, dan stratifikasi urgensi uji fungsi paru.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-400">Groq Llama-3.3-70B</div>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold">
                    4
                  </div>
                  <h3 className="text-sm font-bold text-white">Actionable Dossier</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Menerbitkan <strong className="text-slate-200">Surat Rujukan Puskesmas A4 (PDF)</strong> berstandar SOAP + kode ICD-10 dan panduan latihan napas mandiri.
                  </p>
                  <div className="text-[10px] font-mono text-teal-400">Groq Llama-3.3-70B</div>
                </div>
              </div>
            </section>

            {/* Direct Start Banner */}
            <section className="max-w-4xl mx-auto px-4">
              <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-4 shadow-xl">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Kenali Gejala Paru Anda Sebelum Bertambah Berat
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                  Kuesioner adaptif dapat diselesaikan dalam waktu kurang dari 3 menit tanpa perlu registrasi atau login.
                </p>
                <button
                  type="button"
                  onClick={handleStartScreening}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Mulai Kuesioner Sekarang</span>
                  <IconArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          </div>
        )}

        {viewState === "questionnaire" && (
          <QuestionnaireWizard
            onComplete={handleScreeningComplete}
            onCancel={() => setViewState("hero")}
          />
        )}

        {viewState === "dashboard" && activeDossier && (
          <DashboardView
            dossier={activeDossier}
            onNewScreening={handleNewScreening}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500 no-print space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-400 font-semibold">
          <IconLungs className="w-4 h-4 text-emerald-400" />
          <span>PulmoScreen AI — Platform Penapisan PPOK Non-Perokok</span>
        </div>
        <p className="max-w-xl mx-auto text-[11px] text-slate-600">
          Disclaimer Medis: PulmoScreen AI dirancang sebagai instrumen penapisan risiko awal faskes primer berbasis pedoman GOLD 2024 dan tidak menggantikan diagnosis definitif dokter spesialis paru / uji spirometri pos-bronkodilator.
        </p>
        <p className="text-[10px] text-slate-600">
          Orkestrasi Multi-Agent bertenaga Groq Cloud LPU SDK &bull; Hak Cipta &copy; 2026 PulmoScreen AI
        </p>
      </footer>
    </div>
  );
}
