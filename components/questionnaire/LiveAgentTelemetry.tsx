"use client";

import React from "react";
import { StreamTelemetryEvent } from "@/types/pipeline.types";
import { IconSparkles, IconActivity, IconCheck, IconShieldAlert } from "../ui/Icons";

interface Props {
  currentEvent: StreamTelemetryEvent | null;
  eventsLog: StreamTelemetryEvent[];
}

export function LiveAgentTelemetry({ currentEvent, eventsLog }: Props) {
  const steps = [
    {
      id: "intake",
      title: "1. Exposure Intake Agent",
      model: "Groq Llama-3.1-8B",
      desc: "Kuantifikasi Biomass Hour-Years & Indeks Rokok Pasif",
    },
    {
      id: "differential",
      title: "2. Clinical Differential Agent",
      model: "Groq Llama-3.3-70B",
      desc: "Penalaran GOLD/GINA (PPOK vs Asma vs TB)",
    },
    {
      id: "scoring",
      title: "3. Quantitative Risk Scorer",
      model: "Groq Llama-3.3-70B",
      desc: "Kalkulasi Skor Komposit (0–100) & PUMA Protocol",
    },
    {
      id: "dossier",
      title: "4. Actionable Dossier Agent",
      model: "Groq Llama-3.3-70B",
      desc: "Sintesis SOAP Puskesmas & Justifikasi Spirometri",
    },
  ];

  const currentStepId = currentEvent?.step || "intake";
  const progressPercent = currentEvent?.progressPercent || 15;

  const getStepStatus = (stepId: string) => {
    const stepOrder = ["intake", "differential", "scoring", "dossier", "complete"];
    const currentIndex = stepOrder.indexOf(currentStepId);
    const targetIndex = stepOrder.indexOf(stepId);

    if (currentStepId === "complete") return "completed";
    if (currentIndex > targetIndex) return "completed";
    if (currentIndex === targetIndex) return "running";
    return "pending";
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl shadow-emerald-950/60 backdrop-blur-xl animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 animate-pulse">
            <IconSparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Groq Multi-Agent Reasoning Pipeline</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                LIVE INFERENCE
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Orkestrasi sekuensial &amp; paralel LPU Llama-3.1-8B dan Llama-3.3-70B
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono font-bold text-emerald-400">
            {progressPercent}% PROSES
          </div>
          <div className="w-32 h-2 bg-slate-950 rounded-full overflow-hidden mt-1 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Agent Stepper Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {steps.map((s) => {
          const status = getStepStatus(s.id);
          return (
            <div
              key={s.id}
              className={`p-3.5 rounded-xl border transition-all ${
                status === "running"
                  ? "bg-emerald-950/40 border-emerald-400 shadow-md shadow-emerald-950"
                  : status === "completed"
                  ? "bg-slate-950/80 border-emerald-500/30 text-slate-300"
                  : "bg-slate-950/40 border-slate-800/60 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  {status === "completed" && <IconCheck className="w-4 h-4 text-emerald-400" />}
                  {status === "running" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  )}
                  {status === "pending" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  )}
                  <span>{s.title}</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                  {s.model}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Terminal Live Stream Log */}
      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 max-h-48 overflow-y-auto">
        <div className="text-[11px] text-emerald-400 border-b border-slate-800/80 pb-1.5 flex items-center gap-2">
          <IconActivity className="w-3.5 h-3.5 text-emerald-400" />
          <span>[TELEMETRY LOG STREAM]</span>
        </div>

        {eventsLog.length === 0 ? (
          <div className="text-slate-500 italic py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Menginisialisasi pipeline telemetri...
          </div>
        ) : (
          eventsLog.map((ev, idx) => (
            <div key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-slate-500 text-[10px]">
                +{Math.round((ev.timestamp % 100000) / 100)}ms
              </span>
              <span className={ev.status === "completed" ? "text-emerald-400" : "text-cyan-300"}>
                [{ev.status === "completed" ? "✓" : "⚡"}]
              </span>
              <span className="text-slate-300 flex-1">
                <strong>{ev.agentName}:</strong> {ev.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
