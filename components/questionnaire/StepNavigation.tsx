"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps?: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  canGoNext?: boolean;
  className?: string;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps = 4,
  onPrev,
  onNext,
  onSubmit,
  isSubmitting = false,
  canGoNext = true,
  className,
}) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-800/80",
        className
      )}
    >
      {/* Tombol Kembali */}
      <button
        type="button"
        onClick={onPrev}
        disabled={currentStep === 1 || isSubmitting}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-600 cursor-pointer select-none",
          currentStep === 1 || isSubmitting
            ? "opacity-30 cursor-not-allowed text-slate-500 bg-transparent"
            : "text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white"
        )}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali</span>
      </button>

      {/* Indikator Langkah */}
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
        <span>Langkah {currentStep} dari {totalSteps}</span>
      </div>

      {/* Tombol Lanjut / Submit */}
      {isLastStep ? (
        <button
          type="button"
          onClick={onSubmit || onNext}
          disabled={isSubmitting || !canGoNext}
          className={cn(
            "flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 select-none",
            isSubmitting || !canGoNext
              ? "opacity-60 cursor-not-allowed bg-emerald-700 text-slate-200"
              : "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/20 hover:shadow-emerald-500/30 cursor-pointer active:scale-[0.98]"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses Skrining...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Kirim Data Skrining</span>
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 select-none",
            !canGoNext
              ? "opacity-40 cursor-not-allowed bg-slate-800 text-slate-500"
              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950 hover:shadow-emerald-900/40 cursor-pointer active:scale-[0.98]"
          )}
        >
          <span>Lanjutkan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
