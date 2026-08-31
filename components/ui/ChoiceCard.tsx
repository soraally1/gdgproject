"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface ChoiceCardProps {
  id?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
  variant?: "default" | "danger" | "warning";
}

export const ChoiceCard: React.FC<ChoiceCardProps> = ({
  id,
  title,
  description,
  icon,
  badge,
  isSelected,
  onClick,
  className,
  variant = "default",
}) => {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-start p-4 rounded-xl border transition-all duration-200 text-left w-full cursor-pointer select-none group min-h-[56px] focus:outline-none focus:ring-2 focus:ring-emerald-500/50",
        isSelected
          ? variant === "danger"
            ? "bg-rose-950/40 border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.2)]"
            : variant === "warning"
            ? "bg-amber-950/40 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            : "bg-emerald-950/40 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90",
        className
      )}
    >
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={cn(
                "p-2 rounded-lg transition-colors",
                isSelected
                  ? variant === "danger"
                    ? "bg-rose-500/20 text-rose-400"
                    : variant === "warning"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-emerald-500/20 text-emerald-400"
                  : "bg-slate-800/80 text-slate-400 group-hover:text-slate-200"
              )}
            >
              {icon}
            </div>
          )}
          <div>
            <h4
              className={cn(
                "text-sm font-semibold transition-colors",
                isSelected
                  ? variant === "danger"
                    ? "text-rose-200"
                    : variant === "warning"
                    ? "text-amber-200"
                    : "text-emerald-200"
                  : "text-slate-200 group-hover:text-white"
              )}
            >
              {title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {badge && (
            <span
              className={cn(
                "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border",
                isSelected
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              )}
            >
              {badge}
            </span>
          )}
          <div
            className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center border transition-all",
              isSelected
                ? variant === "danger"
                  ? "bg-rose-500 border-rose-500 text-white"
                  : variant === "warning"
                  ? "bg-amber-500 border-amber-500 text-white"
                  : "bg-emerald-500 border-emerald-500 text-white"
                : "border-slate-700 bg-slate-800/50 text-transparent"
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {description && (
        <p
          className={cn(
            "text-xs mt-2 leading-relaxed transition-colors",
            isSelected ? "text-slate-300" : "text-slate-400 group-hover:text-slate-300"
          )}
        >
          {description}
        </p>
      )}
    </button>
  );
};
