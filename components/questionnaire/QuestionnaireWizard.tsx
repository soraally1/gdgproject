"use client";

import React, { useState, useEffect } from "react";
import {
  QuestionnaireData,
  INITIAL_QUESTIONNAIRE_DATA,
} from "@/types/questionnaire.types";
import {
  UnifiedScreeningDossier,
  StreamTelemetryEvent,
} from "@/types/pipeline.types";
import { Step1Demographics } from "./Step1Demographics";
import { Step2Environment } from "./Step2Environment";
import { Step3Symptoms } from "./Step3Symptoms";
import { Step4RedFlags } from "./Step4RedFlags";
import { LiveAgentTelemetry } from "./LiveAgentTelemetry";
import { IconArrowRight, IconArrowLeft, IconRefreshCw } from "../ui/Icons";

const STORAGE_KEY = "pulmoscreen_intake_draft_v1";

interface Props {
  onComplete: (dossier: UnifiedScreeningDossier) => void;
  onCancel?: () => void;
}

export function QuestionnaireWizard({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<QuestionnaireData>(INITIAL_QUESTIONNAIRE_DATA);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<StreamTelemetryEvent | null>(null);
  const [eventsLog, setEventsLog] = useState<StreamTelemetryEvent[]>([]);

  // Load auto-save draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.warn("Could not load draft:", e);
    }
  }, []);

  // Auto-save draft on change
  const handleChange = (updated: Partial<QuestionnaireData>) => {
    setFormData((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn("Could not save draft:", e);
      }
      return next;
    });
  };

  const handleReset = () => {
    if (confirm("Reset seluruh data formulir kuesioner ke nilai default?")) {
      setFormData(INITIAL_QUESTIONNAIRE_DATA);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      setStep(1);
    }
  };

  // Submit and stream from /api/screen
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setEventsLog([]);
    setCurrentEvent({
      step: "intake",
      agentName: "Orchestrator",
      model: "System",
      status: "running",
      progressPercent: 10,
      message: "Menginisialisasi pipeline Multi-Agent Groq...",
      timestamp: Date.now(),
    });

    try {
      const response = await fetch("/api/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            try {
              const event: StreamTelemetryEvent = JSON.parse(trimmed.replace("data: ", ""));
              setCurrentEvent(event);
              setEventsLog((prev) => [...prev, event]);

              if (event.step === "complete" && event.fullDossier) {
                // Short timeout for visual polish before transitioning to dashboard
                setTimeout(() => {
                  onComplete(event.fullDossier!);
                }, 1200);
              }
            } catch (err) {
              console.warn("Error parsing SSE event:", err);
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Submission stream error:", err);
      alert(`Terjadi gangguan komunikasi dengan server: ${err.message || "Gagal menghubungkan pipeline."}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* If submitting, show live telemetry view */}
      {isSubmitting ? (
        <div className="py-8">
          <LiveAgentTelemetry currentEvent={currentEvent} eventsLog={eventsLog} />
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Top Wizard Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
              <span>PROGRES SKRINING</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors text-xs"
                >
                  <IconRefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Form</span>
                </button>
                <span className="text-emerald-400 font-bold">Langkah {step} dari 4</span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { s: 1, label: "Demografi" },
                { s: 2, label: "Paparan" },
                { s: 3, label: "Gejala & mMRC" },
                { s: 4, label: "Red Flags" },
              ].map((item) => (
                <div key={item.s} className="space-y-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      step >= item.s
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/50"
                        : "bg-slate-800"
                    }`}
                  />
                  <span
                    className={`text-[10px] hidden sm:block truncate ${
                      step >= item.s ? "text-emerald-300 font-semibold" : "text-slate-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Step Body */}
          <div className="min-h-[380px]">
            {step === 1 && <Step1Demographics data={formData} onChange={handleChange} />}
            {step === 2 && <Step2Environment data={formData} onChange={handleChange} />}
            {step === 3 && <Step3Symptoms data={formData} onChange={handleChange} />}
            {step === 4 && (
              <Step4RedFlags
                data={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
              />
            )}
          </div>

          {/* Bottom Step Navigation Bar */}
          <div className="flex items-center justify-between border-t border-slate-800/80 pt-6 mt-8">
            <div>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-950/80 hover:bg-slate-800 text-sm font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <IconArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
              ) : onCancel ? (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Batal
                </button>
              ) : (
                <div />
              )}
            </div>

            <div>
              {step < 4 && (
                <button
                  type="button"
                  onClick={() => setStep((prev) => Math.min(4, prev + 1))}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Lanjutkan</span>
                  <IconArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
