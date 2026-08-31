"use client";

import React from "react";
import { useQuestionnaireStore } from "@/store/useQuestionnaireStore";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { ExposureGaugeMini } from "@/components/ui/ExposureGaugeMini";
import {
  Flame,
  Wind,
  Users,
  Building2,
  HardHat,
  Sparkles,
  TreePine,
  Layers,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Step2Environment: React.FC = () => {
  const { formData, updateField, metrics } = useQuestionnaireStore();

  const isBiomassFuel =
    formData.cookingFuel === "firewood" ||
    formData.cookingFuel === "charcoal" ||
    formData.cookingFuel === "kerosene";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Langkah */}
      <div>
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Langkah 2 dari 4: Paparan Lingkungan</span>
        </div>
        <h3 className="text-xl font-bold text-slate-100">
          Paparan Asap Dapur, Perokok Pasif, & Polusi
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Inhalasi partikulat mikro (PM2.5) jangka panjang menyebabkan iritasi kronis dan inflamasi jalan napas kecil.
        </p>
      </div>

      {/* =========================================
          BAGIAN A: ASAP BIOMASSA DAPUR
          ========================================= */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-5">
        <div className="flex items-center gap-2.5 text-emerald-400 border-b border-slate-800 pb-3">
          <Flame className="w-5 h-5 text-emerald-400" />
          <h4 className="text-base font-bold text-slate-200">
            A. Riwayat Bahan Bakar Memasak Dapur
          </h4>
        </div>

        {/* Pilihan Bahan Bakar */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
            Bahan Bakar Utama yang Sering Digunakan
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <ChoiceCard
              title="Kayu Bakar"
              description="Emisi partikulat jelaga tinggi (PM2.5 > 1000 µg/m³ saat memasak)."
              icon={<TreePine className="w-4 h-4" />}
              badge="Biomassa Tinggi"
              variant="danger"
              isSelected={formData.cookingFuel === "firewood"}
              onClick={() => updateField("cookingFuel", "firewood")}
            />
            <ChoiceCard
              title="Arang / Briket"
              description="Emisi karbon monoksida (CO) dan partikel padat tinggi."
              icon={<Flame className="w-4 h-4" />}
              badge="Biomassa"
              variant="warning"
              isSelected={formData.cookingFuel === "charcoal"}
              onClick={() => updateField("cookingFuel", "charcoal")}
            />
            <ChoiceCard
              title="Minyak Tanah (Kerosene)"
              description="Senyawa hidrokarbon aerosol dan sulfur dioksida."
              icon={<Layers className="w-4 h-4" />}
              badge="Hidrokarbon"
              variant="warning"
              isSelected={formData.cookingFuel === "kerosene"}
              onClick={() => updateField("cookingFuel", "kerosene")}
            />
            <ChoiceCard
              title="Gas LPG"
              description="Bahan bakar transisi bersih dengan emisi partikulat rendah."
              icon={<Flame className="w-4 h-4 text-cyan-400" />}
              isSelected={formData.cookingFuel === "lpg"}
              onClick={() => updateField("cookingFuel", "lpg")}
            />
            <ChoiceCard
              title="Listrik / Kompor Induksi"
              description="Nol emisi gas buang dalam ruangan dapur."
              icon={<Zap className="w-4 h-4 text-emerald-400" />}
              badge="Bebas Polusi"
              className="sm:col-span-2"
              isSelected={formData.cookingFuel === "electric"}
              onClick={() => updateField("cookingFuel", "electric")}
            />
          </div>
        </div>

        {/* Durasi Jam dan Tahun (Hanya aktif relevan jika biomassa/lpg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-300">Durasi Memasak per Hari</span>
              <span className="font-bold text-emerald-400 text-sm">
                {formData.cookingHoursPerDay} Jam / Hari
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={8}
              step={0.5}
              value={formData.cookingHoursPerDay}
              onChange={(e) =>
                updateField("cookingHoursPerDay", parseFloat(e.target.value))
              }
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 jam</span>
              <span>4 jam</span>
              <span>8+ jam</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-300">Lama Penggunaan Bahan Bakar</span>
              <span className="font-bold text-emerald-400 text-sm">
                {formData.cookingYears} Tahun
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={formData.cookingYears}
              onChange={(e) => updateField("cookingYears", parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 thn</span>
              <span>25 thn</span>
              <span>50 thn</span>
            </div>
          </div>
        </div>

        {/* Kondisi Ventilasi Dapur */}
        <div className="space-y-2.5 pt-1">
          <label className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
            Kondisi Ventilasi Dapur
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <ChoiceCard
              title="Dapur Terbuka / Blower"
              description="Memiliki cerobong, blower, atau ruang terbuka luas."
              icon={<Wind className="w-4 h-4 text-emerald-400" />}
              isSelected={formData.kitchenVentilation === "good_open"}
              onClick={() => updateField("kitchenVentilation", "good_open")}
            />
            <ChoiceCard
              title="Semi-Terbuka (Jendela)"
              description="Memiliki jendela yang dibuka saat proses memasak."
              icon={<Wind className="w-4 h-4 text-amber-400" />}
              isSelected={formData.kitchenVentilation === "moderate_window"}
              onClick={() => updateField("kitchenVentilation", "moderate_window")}
            />
            <ChoiceCard
              title="Tertutup / Ventilasi Buruk"
              description="Dapur di dalam rumah tanpa sirkulasi keluar yang cukup."
              icon={<Wind className="w-4 h-4 text-rose-400" />}
              variant="danger"
              badge="Faktor 1.5x"
              isSelected={formData.kitchenVentilation === "poor_closed"}
              onClick={() => updateField("kitchenVentilation", "poor_closed")}
            />
          </div>
        </div>

        {/* Live Calculation Widget */}
        <ExposureGaugeMini
          rawHourYears={metrics.rawBiomassHourYears}
          adjustedHourYears={metrics.adjustedBiomassHourYears}
          severity={metrics.biomassSeverity}
          className="mt-4"
        />
      </div>

      {/* =========================================
          BAGIAN B: PEROKOK PASIF (SECONDHAND SMOKE)
          ========================================= */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5 text-amber-400 border-b border-slate-800 pb-3">
          <Users className="w-5 h-5 text-amber-400" />
          <h4 className="text-base font-bold text-slate-200">
            B. Paparan Asap Rokok Pasif (Secondhand Smoke)
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Jumlah Perokok Aktif yang Tinggal Serumah
            </label>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => updateField("smokersInHouse", count)}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-sm font-bold border transition-colors cursor-pointer",
                    formData.smokersInHouse === count
                      ? "bg-amber-500/20 border-amber-500 text-amber-300"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
                  )}
                >
                  {count === 4 ? "4+" : count}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Lama Tinggal Bersama Perokok (Tahun)
            </label>
            <input
              type="number"
              min={0}
              max={60}
              value={formData.secondhandYears}
              onChange={(e) =>
                updateField("secondhandYears", parseInt(e.target.value) || 0)
              }
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Contoh: 15"
            />
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <label className="text-xs font-semibold text-slate-300 block">
            Frekuensi Terpapar Asap Rokok di Rumah
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <ChoiceCard
              title="Setiap Hari"
              isSelected={formData.secondhandFrequency === "daily"}
              onClick={() => updateField("secondhandFrequency", "daily")}
              variant="danger"
            />
            <ChoiceCard
              title="1–3x Seminggu"
              isSelected={formData.secondhandFrequency === "weekly"}
              onClick={() => updateField("secondhandFrequency", "weekly")}
              variant="warning"
            />
            <ChoiceCard
              title="Jarang / Tidak Pernah"
              isSelected={formData.secondhandFrequency === "rarely"}
              onClick={() => updateField("secondhandFrequency", "rarely")}
            />
          </div>
        </div>
      </div>

      {/* =========================================
          BAGIAN C: POLUSI PARTIKULAT & OKUPASIONAL
          ========================================= */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5 text-cyan-400 border-b border-slate-800 pb-3">
          <Building2 className="w-5 h-5 text-cyan-400" />
          <h4 className="text-base font-bold text-slate-200">
            C. Polusi Lingkungan & Debu Okupasional
          </h4>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            Penggunaan Obat Nyamuk Bakar di Kamar / Rumah
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <ChoiceCard
              title="Hampir Setiap Malam"
              description="Emisi partikulat 1 keping setara ~75 batang rokok."
              isSelected={formData.mosquitoCoilUsage === "daily"}
              onClick={() => updateField("mosquitoCoilUsage", "daily")}
              variant="warning"
            />
            <ChoiceCard
              title="Kadang-kadang (1-3x/mg)"
              isSelected={formData.mosquitoCoilUsage === "occasional"}
              onClick={() => updateField("mosquitoCoilUsage", "occasional")}
            />
            <ChoiceCard
              title="Tidak Pernah / Elektrik"
              isSelected={formData.mosquitoCoilUsage === "never"}
              onClick={() => updateField("mosquitoCoilUsage", "never")}
            />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-slate-300 block">
            Lokasi Tempat Tinggal Saat Ini
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <ChoiceCard
              title="Pinggir Jalan Raya Padat"
              description="Paparan gas buang knalpot diesel dan partikulat ban."
              isSelected={formData.residenceLocation === "highway_busy"}
              onClick={() => updateField("residenceLocation", "highway_busy")}
              variant="warning"
            />
            <ChoiceCard
              title="Dekat Kawasan Industri / Pabrik"
              description="Paparan cerobong asap dan sulfur dioksida."
              isSelected={formData.residenceLocation === "industrial"}
              onClick={() => updateField("residenceLocation", "industrial")}
              variant="warning"
            />
            <ChoiceCard
              title="Perumahan Kota Biasa"
              isSelected={formData.residenceLocation === "urban_standard"}
              onClick={() => updateField("residenceLocation", "urban_standard")}
            />
            <ChoiceCard
              title="Pedesaan / Area Terbuka"
              isSelected={formData.residenceLocation === "rural"}
              onClick={() => updateField("residenceLocation", "rural")}
            />
          </div>
        </div>

        {/* Debu Okupasional */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardHat className="w-4 h-4 text-cyan-400" />
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                Pekerjaan Berisiko Debu Tinggi
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                updateField("occupationalDustExposure", !formData.occupationalDustExposure)
              }
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer",
                formData.occupationalDustExposure
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-800 text-slate-400"
              )}
            >
              {formData.occupationalDustExposure ? "YA" : "TIDAK"}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Contoh: Petugas parkir/ojek, pekerja konstruksi/batu bata, penggilingan padi/tepung, pekerja pabrik tekstil/kayu.
          </p>

          {formData.occupationalDustExposure && (
            <div className="pt-2">
              <label htmlFor="occupational-years" className="text-xs text-slate-300 font-medium block mb-1">
                Lama Menjalani Pekerjaan Tersebut (Tahun)
              </label>
              <input
                id="occupational-years"
                type="number"
                min={0}
                max={50}
                value={formData.occupationalYears || ""}
                onChange={(e) =>
                  updateField("occupationalYears", parseInt(e.target.value) || 0)
                }
                placeholder="Contoh: 8 tahun"
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
