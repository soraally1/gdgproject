"use client";

import React, { useState } from "react";
import { useQuestionnaireStore } from "@/store/useQuestionnaireStore";
import { Step1Demographics } from "./steps/Step1Demographics";
import { Step2Environment } from "./steps/Step2Environment";
import { Step3Symptoms } from "./steps/Step3Symptoms";
import { Step4RedFlags } from "./steps/Step4RedFlags";
import { StepNavigation } from "./StepNavigation";
import {
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  Activity,
  Flame,
  User,
  HeartPulse,
  Database,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionnaireContainerProps {
  onComplete?: (submissionId: string) => void;
  onCancel?: () => void;
}

export const QuestionnaireContainer: React.FC<QuestionnaireContainerProps> = ({
  onComplete,
  onCancel,
}) => {
  const {
    currentStep,
    setStep,
    nextStep,
    prevStep,
    resetForm,
    submitQuestionnaire,
    isSubmitting,
    lastSubmissionId,
    metrics,
  } = useQuestionnaireStore();

  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  const stepsMeta = [
    { number: 1, label: "Demografi", icon: <User className="w-3.5 h-3.5" /> },
    { number: 2, label: "Paparan", icon: <Flame className="w-3.5 h-3.5" /> },
    { number: 3, label: "Gejala", icon: <Activity className="w-3.5 h-3.5" /> },
    { number: 4, label: "Tanda Bahaya", icon: <HeartPulse className="w-3.5 h-3.5" /> },
  ];

  const handleSubmit = async () => {
    const result = await submitQuestionnaire();
    if (result.success) {
      setSubmittedSuccessfully(true);
      if (onComplete) {
        onComplete(result.id);
      }
    }
  };

  if (submittedSuccessfully) {
    return (
      <div className="bg-slate-900/90 border border-emerald-500/40 backdrop-blur-xl rounded-3xl p-6 sm:p-10 text-center max-w-2xl mx-auto shadow-[0_0_50px_rgba(16,185,129,0.15)] animate-in fade-in zoom-in-95 duration-400">
        <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-slate-800 text-emerald-300 border border-emerald-500/30 mb-3">
          <Database className="w-3 h-3 text-emerald-400" />
          ID Rekam: {lastSubmissionId}
        </div>
        <h3 className="text-2xl font-extrabold text-slate-100 mb-2">
          Data Penapisan Berhasil Disimpan!
        </h3>
        <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
          Parameter paparan dan gejala klinis telah diverifikasi dan siap diteruskan ke Pipeline Multi-Agent Groq.
        </p>

        {/* Ringkasan Singkat */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-left max-w-md mx-auto mb-6 space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400">Biomass Hour-Years</span>
            <span className="font-bold text-emerald-400">
              {metrics.adjustedBiomassHourYears} Jam-Tahun ({metrics.biomassSeverity.toUpperCase()})
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400">Skala Sesak mMRC</span>
            <span className="font-bold text-amber-400">Grade {metrics.preliminaryPumaScore}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Evaluasi Awal</span>
            <span className="font-bold text-rose-400">{metrics.riskSummaryBadge.label}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSubmittedSuccessfully(false);
              resetForm();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            Mulai Skrining Baru
          </button>
          <button
            type="button"
            onClick={() => {
              if (onComplete && lastSubmissionId) onComplete(lastSubmissionId);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <span>Buka Dashboard Hasil (Feature 02/03)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-5 sm:p-8 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
      {/* Top Header & Reset */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              Kuesioner Klinis PulmoScreen AI
            </h2>
            <p className="text-xs text-slate-400">
              Formulir adaptif penapisan PPOK pada populasi non-perokok
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetForm}
            title="Reset Form"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800"
            >
              Tutup
            </button>
          )}
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="py-6 border-b border-slate-800/60 mb-6">
        <div className="grid grid-cols-4 gap-2 mb-3">
          {stepsMeta.map((step) => {
            const isDone = currentStep > step.number;
            const isCurrent = currentStep === step.number;

            return (
              <button
                key={step.number}
                type="button"
                onClick={() => {
                  if (currentStep > step.number) {
                    setStep(step.number);
                  }
                }}
                disabled={currentStep < step.number}
                className={cn(
                  "flex items-center gap-1.5 text-left transition-all select-none",
                  isDone
                    ? "cursor-pointer text-emerald-400"
                    : isCurrent
                    ? "text-slate-100 font-bold"
                    : "text-slate-600 cursor-not-allowed"
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all shrink-0",
                    isDone
                      ? "bg-emerald-500 text-slate-950"
                      : isCurrent
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/60"
                      : "bg-slate-800 text-slate-500"
                  )}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.number}
                </div>
                <span className="hidden sm:inline text-xs truncate">
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Continuous Fill Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Dynamic Step Content */}
      <div className="min-h-[380px]">
        {currentStep === 1 && <Step1Demographics />}
        {currentStep === 2 && <Step2Environment />}
        {currentStep === 3 && <Step3Symptoms />}
        {currentStep === 4 && <Step4RedFlags />}
      </div>

      {/* Navigation Footer */}
      <StepNavigation
        currentStep={currentStep}
        totalSteps={4}
        onPrev={prevStep}
        onNext={nextStep}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
