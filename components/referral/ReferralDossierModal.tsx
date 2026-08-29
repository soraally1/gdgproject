"use client";

import React, { useState } from "react";
import { UnifiedScreeningDossier } from "@/types/pipeline.types";
import { ReferralDocumentA4 } from "./ReferralDocumentA4";
import { downloadReferralHtmlDoc, printReferralDocument } from "@/lib/pdfExportHelper";
import { generateWhatsAppShareText } from "@/lib/whatsappShare";
import {
  IconDownload,
  IconPrinter,
  IconShare2,
  IconX,
  IconCheck,
  IconFileText,
} from "../ui/Icons";

interface Props {
  dossier: UnifiedScreeningDossier;
  isOpen: boolean;
  onClose: () => void;
}

export function ReferralDossierModal({ dossier, isOpen, onClose }: Props) {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    downloadReferralHtmlDoc(dossier);
  };

  const handlePrint = () => {
    printReferralDocument();
  };

  const handleWhatsApp = () => {
    const text = generateWhatsAppShareText(dossier);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleCopySummary = async () => {
    const text = decodeURIComponent(generateWhatsAppShareText(dossier));
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Clipboard failed:", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400">
              <IconFileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Surat Rekomendasi Rujukan Puskesmas
              </h3>
              <p className="text-xs text-slate-400">
                Format Standar Faskes Primer — Siap Cetak (A4) &amp; Digital Vector Export
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            ID Dokumen: <span className="font-mono text-teal-400 font-bold">#{dossier.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <IconPrinter className="w-4 h-4 text-slate-400" />
              <span>Cetak Dokumen</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <IconDownload className="w-4 h-4" />
              <span>Unduh Dokumen</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <IconShare2 className="w-4 h-4" />
              <span>Bagikan WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
              title="Salin Teks Ringkasan"
            >
              {copied ? (
                <IconCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <span className="text-[11px]">Salin</span>
              )}
            </button>
          </div>
        </div>

        {/* Modal Body / A4 Document Preview */}
        <div className="p-6 overflow-y-auto bg-slate-950/60 flex-1">
          <ReferralDocumentA4 dossier={dossier} />
        </div>
      </div>
    </div>
  );
}
