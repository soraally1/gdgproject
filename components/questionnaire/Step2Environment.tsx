"use client";

import React from "react";
import {
  QuestionnaireData,
  CookingFuel,
  KitchenVentilation,
  SecondhandFrequency,
  MosquitoCoil,
  ResidenceLocation,
} from "@/types/questionnaire.types";
import { calculateExposureMetrics } from "@/lib/exposureCalculator";
import { IconFlame, IconWind, IconCheck, IconShieldAlert } from "../ui/Icons";

interface Props {
  data: QuestionnaireData;
  onChange: (updated: Partial<QuestionnaireData>) => void;
}

export function Step2Environment({ data, onChange }: Props) {
  const metrics = calculateExposureMetrics(data);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-emerald-950/40 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>Langkah 2 dari 4</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Paparan Lingkungan Non-Tembakau
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Identifikasi sumber partikulat inhalasi mikro dari dapur, asap rokok pasif, dan lingkungan harian.
        </p>
      </div>

      {/* Real-time calculated Hour-Years Badge */}
      <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900/80 border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <IconFlame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Kalkulasi Biomass Hour-Years
            </div>
            <div className="text-lg font-bold text-emerald-300">
              {metrics.adjustedBiomassHourYears} Jam-Tahun (Adjusted)
            </div>
          </div>
        </div>
        <div className="text-xs px-3 py-1.5 rounded-full border bg-slate-950/80">
          {metrics.isHighBiomassRisk ? (
            <span className="text-rose-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              ⚠️ Melewati Ambang Risiko Tinggi (&ge;60)
            </span>
          ) : (
            <span className="text-emerald-400 font-semibold">
              ✓ Terhitung: {data.cookingHoursPerDay} jam/hari &times; {data.cookingYears} tahun
            </span>
          )}
        </div>
      </div>

      {/* Bagian A: Asap Biomassa Dapur */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-5">
        <div className="flex items-center gap-2 text-base font-bold text-white">
          <IconFlame className="w-5 h-5 text-amber-400" />
          <span>Bagian A — Aktivitas Memasak &amp; Bahan Bakar Dapur</span>
        </div>

        {/* Jenis Bahan Bakar */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Bahan Bakar Utama yang Paling Sering/Lama Digunakan:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { id: "firewood", label: "Kayu Bakar", desc: "Emisi partikulat tertinggi", icon: "🪵" },
              { id: "charcoal", label: "Arang / Briket", desc: "Emisi CO & debu tinggi", icon: "⬛" },
              { id: "kerosene", label: "Minyak Tanah", desc: "Jelaga & hidrokarbon", icon: "🛢️" },
              { id: "lpg", label: "Gas LPG", desc: "Emisi partikulat rendah", icon: "🔥" },
              { id: "electric", label: "Listrik / Induksi", desc: "Bebas partikulat asap", icon: "⚡" },
            ].map((fuel) => (
              <button
                key={fuel.id}
                type="button"
                onClick={() => onChange({ cookingFuel: fuel.id as CookingFuel })}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  data.cookingFuel === fuel.id
                    ? "bg-emerald-500/20 border-emerald-400 text-white shadow-sm"
                    : "bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="text-xl mb-1">{fuel.icon}</div>
                <div className="text-xs font-bold text-white">{fuel.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{fuel.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Durasi & Tahun Memasak */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1">
              <span>Rata-rata Memasak per Hari:</span>
              <span className="text-emerald-400 font-bold">{data.cookingHoursPerDay} Jam / Hari</span>
            </div>
            <input
              type="range"
              min={0}
              max={8}
              step={0.5}
              value={data.cookingHoursPerDay}
              onChange={(e) => onChange({ cookingHoursPerDay: parseFloat(e.target.value) || 0 })}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0 jam</span>
              <span>2 jam</span>
              <span>4 jam</span>
              <span>8+ jam</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1">
              <span>Lama Menggunakan Bahan Bakar Ini:</span>
              <span className="text-emerald-400 font-bold">{data.cookingYears} Tahun</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={70}
                value={data.cookingYears}
                onChange={(e) => onChange({ cookingYears: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-400 focus:outline-none focus:border-emerald-400"
              />
              <span className="text-xs text-slate-400">Tahun</span>
            </div>
          </div>
        </div>

        {/* Ventilasi Dapur */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Kondisi Ventilasi &amp; Sirkulasi Udara Dapur:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "good_open",
                title: "Dapur Terbuka / Cerobong",
                desc: "Ada exhaust fan, cerobong aktif, atau terbuka ke pekarangan (Faktor pengali: 0.7x)",
              },
              {
                id: "moderate_window",
                title: "Semi-Terbuka / Ada Jendela",
                desc: "Memiliki 1-2 jendela yang rutin dibuka saat memasak (Faktor pengali: 1.0x)",
              },
              {
                id: "poor_closed",
                title: "Tertutup / Ventilasi Buruk",
                desc: "Dapur di dalam rumah tanpa jendela memadai / asap terperangkap (Faktor: 1.5x)",
              },
            ].map((vent) => (
              <button
                key={vent.id}
                type="button"
                onClick={() => onChange({ kitchenVentilation: vent.id as KitchenVentilation })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  data.kitchenVentilation === vent.id
                    ? "bg-emerald-500/20 border-emerald-400 shadow-sm"
                    : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{vent.title}</span>
                  {data.kitchenVentilation === vent.id && (
                    <IconCheck className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{vent.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bagian B: Paparan Perokok Pasif (Secondhand Smoke) */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-white">
          <IconWind className="w-5 h-5 text-cyan-400" />
          <span>Bagian B — Paparan Asap Rokok Pasif di Rumah (Secondhand Smoke)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Jumlah Perokok Aktif Serumah:
            </label>
            <select
              value={data.smokersInHouse}
              onChange={(e) => onChange({ smokersInHouse: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-400"
            >
              <option value={0}>Tidak ada (0 orang)</option>
              <option value={1}>1 orang (misal: pasangan/orang tua)</option>
              <option value={2}>2 orang</option>
              <option value={3}>3 orang atau lebih</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Lama Tinggal Bersama Perokok:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={70}
                value={data.secondhandYears}
                onChange={(e) => onChange({ secondhandYears: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-cyan-400 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-xs text-slate-400">Tahun</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Frekuensi Terpapar Asap Rokok:
            </label>
            <select
              value={data.secondhandFrequency}
              onChange={(e) =>
                onChange({ secondhandFrequency: e.target.value as SecondhandFrequency })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-400"
            >
              <option value="daily">Setiap hari di dalam rumah</option>
              <option value="weekly">1-3 kali seminggu</option>
              <option value="rarely">Jarang / Hanya sesekali</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bagian C: Polusi Partikulat Lingkungan & Kerja */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-white">
          <IconShieldAlert className="w-5 h-5 text-emerald-400" />
          <span>Bagian C — Polusi Partikulat &amp; Paparan Tambahan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Penggunaan Obat Nyamuk Bakar di Kamar/Rumah:
            </label>
            <select
              value={data.mosquitoCoilUsage}
              onChange={(e) => onChange({ mosquitoCoilUsage: e.target.value as MosquitoCoil })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-400"
            >
              <option value="daily">Hampir setiap malam (Emisi debu tinggi)</option>
              <option value="occasional">1-3 kali seminggu</option>
              <option value="never">Tidak pernah / Menggunakan elektrik/lotion</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Lokasi Tempat Tinggal Utama:
            </label>
            <select
              value={data.residenceLocation}
              onChange={(e) => onChange({ residenceLocation: e.target.value as ResidenceLocation })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-400"
            >
              <option value="highway_busy">Pinggir jalan raya padat lalu lintas (PM2.5 tinggi)</option>
              <option value="industrial">Dekat kawasan pabrik / industri / pertambangan</option>
              <option value="urban_standard">Perumahan kota standar</option>
              <option value="rural">Pedesaan / Area terbuka hijau</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-3 p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={data.occupationalDustExposure}
              onChange={(e) => onChange({ occupationalDustExposure: e.target.checked })}
              className="mt-1 w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-0"
            />
            <div>
              <div className="text-xs font-bold text-white">
                Pernah/Sedang Bekerja di Lingkungan Berdebu Tinggi
              </div>
              <div className="text-[11px] text-slate-400">
                Pekerja penggilingan padi, tukang parkir/ojek online, pabrik tekstil/kayu, pekerja bangunan/semen.
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
