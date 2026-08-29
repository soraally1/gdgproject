"use client";

import React, { useState, useEffect, useRef } from "react";
import { IconWind, IconActivity, IconRefreshCw } from "../ui/Icons";

export function PursedLipBreathingCoach() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<"ready" | "inhale" | "hold" | "exhale">("ready");
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [cycleCount, setCycleCount] = useState<number>(0);

  // Web Audio Synth Chime for phase cues
  const playTone = (frequency: number = 440, duration: number = 0.15) => {
    try {
      if (typeof window === "undefined") return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  useEffect(() => {
    let interval: any;
    if (!isActive) {
      setPhase("ready");
      setTimerSeconds(0);
      return;
    }

    // Breathing sequence: Inhale (2s) -> Hold (1s) -> Exhale (4s) = 7s cycle
    let stepInCycle = 0;

    const tick = () => {
      if (stepInCycle === 0) {
        setPhase("inhale");
        playTone(523.25, 0.2); // C5
      } else if (stepInCycle === 2) {
        setPhase("hold");
        playTone(659.25, 0.1); // E5
      } else if (stepInCycle === 3) {
        setPhase("exhale");
        playTone(392.0, 0.25); // G4
      }

      setTimerSeconds(stepInCycle);
      stepInCycle = (stepInCycle + 1) % 7;

      if (stepInCycle === 0) {
        setCycleCount((c) => c + 1);
      }
    };

    tick();
    interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleToggle = () => {
    if (!isActive) {
      setCycleCount(0);
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const getPhaseInstruction = () => {
    if (phase === "inhale") {
      return {
        title: "Tarik Napas melalui Hidung (2 Detik)",
        sub: "Rasakan rongga dada mengembang santai tanpa terburu-buru.",
        scaleClass: "scale-125 border-emerald-400 bg-emerald-500/30 text-emerald-300 shadow-emerald-500/50 shadow-2xl",
      };
    }
    if (phase === "hold") {
      return {
        title: "Tahan Sejenak (1 Detik)",
        sub: "Biarkan udara mengisi alveolus secara merata.",
        scaleClass: "scale-125 border-cyan-400 bg-cyan-500/30 text-cyan-300 shadow-cyan-500/50 shadow-2xl",
      };
    }
    if (phase === "exhale") {
      return {
        title: "Hembuskan Lewat Bibir Terkatup (4 Detik)",
        sub: "Kuncupkan bibir seperti meniup lilin pelan-pelan. Menjaga bronkus tetap terbuka.",
        scaleClass: "scale-90 border-indigo-400 bg-indigo-500/20 text-indigo-300 shadow-indigo-500/30",
      };
    }
    return {
      title: "Siap Memulai Latihan Pursed-Lip Breathing",
      sub: "Teknik fisioterapi paru standar GOLD untuk meredakan sesak napas dan perangkap udara (air-trapping).",
      scaleClass: "scale-100 border-slate-700 bg-slate-900 text-slate-400",
    };
  };

  const instruction = getPhaseInstruction();

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <IconWind className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Pelatih Pernapasan Pursed-Lip
            </h3>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-teal-300">
            Siklus Selesai: {cycleCount}
          </span>
        </div>

        {/* Dynamic Pulsing Breathing Orb */}
        <div className="flex flex-col items-center justify-center my-6 min-h-[190px]">
          <div
            className={`w-36 h-36 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out cursor-pointer select-none ${instruction.scaleClass}`}
            onClick={handleToggle}
          >
            <IconWind className="w-8 h-8 mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {phase === "ready" ? "Mulai" : phase}
            </span>
          </div>

          <div className="text-center mt-6 space-y-1 max-w-sm">
            <h4 className="text-sm font-bold text-white transition-all duration-300">
              {instruction.title}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {instruction.sub}
            </p>
          </div>
        </div>
      </div>

      {/* Controller Buttons */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleToggle}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isActive
              ? "bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30"
              : "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-md shadow-teal-950"
          }`}
        >
          <IconWind className="w-4 h-4" />
          <span>{isActive ? "Hentikan Latihan" : "Mulai Latihan (1 Menit)"}</span>
        </button>

        {isActive && (
          <button
            type="button"
            onClick={() => setCycleCount(0)}
            className="p-3 rounded-xl border border-slate-700 bg-slate-950 text-slate-400 hover:text-white"
            title="Reset Siklus"
          >
            <IconRefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
