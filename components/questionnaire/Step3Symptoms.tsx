"use client";

import React from "react";
import { QuestionnaireData, WheezingFrequency } from "@/types/questionnaire.types";
import { IconActivity, IconCheck, IconStethoscope } from "../ui/Icons";

interface Props {
  data: QuestionnaireData;
  onChange: (updated: Partial<QuestionnaireData>) => void;
}

export function Step3Symptoms({ data, onChange }: Props) {
  const mmrcOptions = [
    {
      grade: 0,
      title: "Grade 0 — Normal",
      desc: "Hanya sesak saat berolahraga berat atau aktivitas fisik intens.",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      grade: 1,
      title: "Grade 1 — Ringan",
      desc: "Sesak napas saat berjalan tergesa-gesa di tempat datar atau saat jalan menanjak landai.",
      badgeColor: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      grade: 2,
      title: "Grade 2 — Moderat (Khas PPOK)",
      desc: "Berjalan lebih lambat dari orang seusia di jalan datar karena sesak, atau harus berhenti sejenak untuk bernapas saat berjalan dengan kecepatan sendiri.",
      badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      grade: 3,
      title: "Grade 3 — Berat",
      desc: "Harus berhenti untuk menarik napas setelah berjalan sekitar 100 meter atau setelah beberapa menit berjalan di tempat datar.",
      badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    },
    {
      grade: 4,
      title: "Grade 4 — Sangat Berat",
      desc: "Terlalu sesak bahkan untuk meninggalkan rumah, atau sesak napas saat berpakaian/melepas baju.",
      badgeColor: "text-rose-500 bg-rose-500/20 border-rose-500/40",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-emerald-950/40 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>Langkah 3 dari 4</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Gejala Klinis &amp; Skala Sesak mMRC
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Karakteristik pola batuk, dahak, dan derajat keterbatasan bernapas berdasarkan standar GOLD 2024.
        </p>
      </div>

      {/* Skala Sesak Napas mMRC */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-bold text-white">
            <IconActivity className="w-5 h-5 text-emerald-400" />
            <span>Skala Sesak Napas mMRC (Modified Medical Research Council)</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-md bg-slate-950 text-emerald-400 font-bold border border-slate-700">
            Terpilih: Grade {data.mmrcGrade}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Pilihlah satu pernyataan yang paling menggambarkan kondisi napas Anda sehari-hari:
        </p>

        <div className="space-y-2.5">
          {mmrcOptions.map((opt) => (
            <button
              key={opt.grade}
              type="button"
              onClick={() => onChange({ mmrcGrade: opt.grade })}
              className={`w-full p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-4 ${
                data.mmrcGrade === opt.grade
                  ? "bg-emerald-500/15 border-emerald-400 shadow-md shadow-emerald-950/50"
                  : "bg-slate-950/70 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded border ${opt.badgeColor}`}
                  >
                    {opt.title}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">{opt.desc}</p>
              </div>
              <div className="mt-1">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    data.mmrcGrade === opt.grade
                      ? "border-emerald-400 bg-emerald-500 text-slate-950"
                      : "border-slate-700 bg-slate-900"
                  }`}
                >
                  {data.mmrcGrade === opt.grade && <IconCheck className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Karakteristik Batuk & Dahak */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-white">
          <IconStethoscope className="w-5 h-5 text-cyan-400" />
          <span>Karakteristik Batuk, Dahak, &amp; Riwayat Alergi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Batuk > 3 bulan */}
          <label className="flex items-start gap-3 p-4 bg-slate-950/70 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={data.chronicCoughMonths}
              onChange={(e) => onChange({ chronicCoughMonths: e.target.checked })}
              className="mt-1 w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-0"
            />
            <div>
              <div className="text-xs font-bold text-white">
                Batuk Berulang &gt; 3 Bulan dalam Setahun
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Kriteria klinis bronkitis kronis dan hipersekresi mukus jalan napas.
              </div>
            </div>
          </label>

          {/* Dahak Pagi Hari */}
          <label className="flex items-start gap-3 p-4 bg-slate-950/70 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={data.morningPhlegm}
              onChange={(e) => onChange({ morningPhlegm: e.target.checked })}
              className="mt-1 w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-0"
            />
            <div>
              <div className="text-xs font-bold text-white">
                Batuk Berdahak Tebal Terutama di Pagi Hari
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Akumulasi sekret bronkus selama tidur khas pada paparan asap partikulat.
              </div>
            </div>
          </label>
        </div>

        {/* Mengi & Asma Anak */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Frekuensi Bunyi Mengi (Napas Bunyi &quot;Ngiik&quot;):
            </label>
            <select
              value={data.wheezingFrequency}
              onChange={(e) =>
                onChange({ wheezingFrequency: e.target.value as WheezingFrequency })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-400"
            >
              <option value="never">Tidak pernah terdengar mengi</option>
              <option value="occasional">Kadang-kadang saat sesak atau flu berat</option>
              <option value="frequent">Sering terdengar saat bernapas</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Riwayat Asma / Alergi Sejak Masa Kanak-kanak:
            </label>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => onChange({ childhoodAsthmaHistory: false })}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  !data.childhoodAsthmaHistory
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                {!data.childhoodAsthmaHistory && <IconCheck className="w-3.5 h-3.5" />}
                <span>Tidak Ada (Onset Dewasa)</span>
              </button>

              <button
                type="button"
                onClick={() => onChange({ childhoodAsthmaHistory: true })}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  data.childhoodAsthmaHistory
                    ? "bg-amber-500/20 border-amber-400 text-amber-200"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                {data.childhoodAsthmaHistory && <IconCheck className="w-3.5 h-3.5" />}
                <span>Ada Riwayat Sejak Kecil</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              *Ketiadaan riwayat asma anak sangat mendukung dugaan PPOK biomassa onset dewasa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
