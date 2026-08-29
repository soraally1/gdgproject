"use client";

import React from "react";
import { QuestionnaireData } from "@/types/questionnaire.types";
import { IconCheck, IconUser } from "../ui/Icons";

interface Props {
  data: QuestionnaireData;
  onChange: (updated: Partial<QuestionnaireData>) => void;
}

export function Step1Demographics({ data, onChange }: Props) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-emerald-950/40 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>Langkah 1 dari 4</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Profil Demografi & Kriteria Inklusi
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          PPOK pada non-perokok sering berkembang perlahan akibat paparan partikulat jangka panjang.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Usia */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-emerald-500/40 transition-colors">
          <label className="block text-sm font-semibold text-slate-200 mb-1">
            Usia Anda (Tahun)
          </label>
          <p className="text-xs text-slate-400 mb-3">
            PPOK non-perokok umumnya terdeteksi pada usia ≥ 35–40 tahun akibat akumulasi paparan.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={18}
              max={110}
              value={data.age}
              onChange={(e) => onChange({ age: Math.max(18, parseInt(e.target.value) || 18) })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-lg font-bold text-emerald-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            />
            <span className="text-sm font-medium text-slate-400">Tahun</span>
          </div>
          {data.age < 35 && (
            <p className="text-xs text-amber-400/90 mt-2">
              💡 Catatan: Usia &lt; 35 tahun jarang mengalami PPOK struktural, namun penapisan paparan tetap bermanfaat.
            </p>
          )}
        </div>

        {/* Jenis Kelamin */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-emerald-500/40 transition-colors">
          <label className="block text-sm font-semibold text-slate-200 mb-1">
            Jenis Kelamin
          </label>
          <p className="text-xs text-slate-400 mb-3">
            Wanita memiliki risiko relatif lebih tinggi terhadap paparan asap biomassa dapur tradisional.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onChange({ gender: "female" })}
              className={`p-3.5 rounded-lg border text-sm font-semibold flex items-center justify-between transition-all ${
                data.gender === "female"
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-sm shadow-emerald-950"
                  : "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              <span>Perempuan</span>
              {data.gender === "female" && <IconCheck className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              type="button"
              onClick={() => onChange({ gender: "male" })}
              className={`p-3.5 rounded-lg border text-sm font-semibold flex items-center justify-between transition-all ${
                data.gender === "male"
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-sm shadow-emerald-950"
                  : "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              <span>Laki-laki</span>
              {data.gender === "male" && <IconCheck className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Status Merokok Pribadi */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
        <label className="block text-sm font-semibold text-slate-200 mb-1">
          Riwayat Merokok Pribadi
        </label>
        <p className="text-xs text-slate-400 mb-4">
          Penapisan ini berfokus pada kelompok <strong className="text-emerald-300">Non-Perokok Aktif</strong> (korban asap biomassa, perokok pasif, polusi).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onChange({ smokingStatus: "never", formerPackYears: 0 })}
            className={`p-4 rounded-xl border text-left transition-all ${
              data.smokingStatus === "never"
                ? "bg-emerald-500/15 border-emerald-400 shadow-sm"
                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm text-white">Tidak Pernah Merokok</span>
              {data.smokingStatus === "never" && <IconCheck className="w-4 h-4 text-emerald-400" />}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              &lt; 100 batang seumur hidup (Populasi target utama penapisan biomassa).
            </p>
          </button>

          <button
            type="button"
            onClick={() => onChange({ smokingStatus: "former" })}
            className={`p-4 rounded-xl border text-left transition-all ${
              data.smokingStatus === "former"
                ? "bg-amber-500/15 border-amber-400 shadow-sm"
                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm text-white">Mantan Perokok</span>
              {data.smokingStatus === "former" && <IconCheck className="w-4 h-4 text-amber-400" />}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Telah berhenti merokok total &gt; 1 tahun yang lalu.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onChange({ smokingStatus: "active" })}
            className={`p-4 rounded-xl border text-left transition-all ${
              data.smokingStatus === "active"
                ? "bg-rose-500/15 border-rose-400 shadow-sm"
                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm text-white">Perokok Aktif</span>
              {data.smokingStatus === "active" && <IconCheck className="w-4 h-4 text-rose-400" />}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Masih merokok tembakau aktif secara rutin saat ini.
            </p>
          </button>
        </div>

        {data.smokingStatus === "active" && (
          <div className="mt-3 p-3 bg-rose-950/30 border border-rose-800/40 rounded-lg text-xs text-rose-300">
            ⚠️ <strong>Catatan:</strong> Sebagai perokok aktif, risiko obstruksi jalan napas Anda dipicu oleh kombinasi ganda tar rokok dan asap lingkungan.
          </div>
        )}
      </div>
    </div>
  );
}
