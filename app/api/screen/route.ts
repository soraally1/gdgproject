import { NextRequest } from "next/server";
import { QuestionnaireSchema } from "@/types/questionnaire.types";
import {
  UnifiedScreeningDossier,
  StreamTelemetryEvent,
} from "@/types/pipeline.types";
import {
  runAgent1ExposureIntake,
  runAgent2ClinicalDifferential,
  runAgent3RiskScoring,
  runAgent4ActionableDossier,
} from "@/lib/groqClient";
import { generateDeterministicScreeningDossier } from "@/lib/clinicalRuleEngine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const sendEvent = async (event: StreamTelemetryEvent) => {
    const payload = `data: ${JSON.stringify(event)}\n\n`;
    await writer.write(encoder.encode(payload));
  };

  (async () => {
    try {
      const body = await request.json();
      const validation = QuestionnaireSchema.safeParse(body);

      if (!validation.success) {
        await sendEvent({
          step: "error",
          agentName: "Validator",
          model: "Local Schema Validator",
          status: "failed",
          progressPercent: 0,
          message: "Data formulir tidak valid. Periksa kembali input Anda.",
          timestamp: Date.now(),
        });
        await writer.close();
        return;
      }

      const questionnaireData = validation.data;
      const screeningId = `PS-${Date.now().toString().slice(-6)}`;
      const hasGroqKey = !!process.env.GROQ_API_KEY;

      // -------------------------------------------------------------
      // STEP 1: Exposure Intake Agent
      // -------------------------------------------------------------
      await sendEvent({
        step: "intake",
        agentName: "Exposure Intake Agent",
        model: hasGroqKey ? "llama-3.1-8b-instant" : "Clinical Exposure Rule Engine",
        status: "running",
        progressPercent: 20,
        message: "Mengurai metrik paparan biomassa, rokok pasif, dan ventilasi...",
        timestamp: Date.now(),
      });

      let exposureOutput;
      let differentialOutput;
      let riskOutput;
      let actionableOutput;
      let isFallback = !hasGroqKey;

      if (hasGroqKey) {
        try {
          exposureOutput = await runAgent1ExposureIntake(questionnaireData);
        } catch (err) {
          console.warn("Agent 1 fallback triggered:", err);
          isFallback = true;
          const fallbackDossier = generateDeterministicScreeningDossier(
            questionnaireData,
            screeningId
          );
          exposureOutput = fallbackDossier.exposureMetrics;
        }
      } else {
        // Deterministic calculation
        const fallbackDossier = generateDeterministicScreeningDossier(
          questionnaireData,
          screeningId
        );
        exposureOutput = fallbackDossier.exposureMetrics;
      }

      await sendEvent({
        step: "intake",
        agentName: "Exposure Intake Agent",
        model: hasGroqKey && !isFallback ? "llama-3.1-8b-instant" : "Deterministic Rule Engine",
        status: "completed",
        progressPercent: 35,
        message: `Biomass Hour-Years: ${exposureOutput.adjustedBiomassHourYears} jam-tahun terhitung (${
          exposureOutput.isSignificantBiomassExposure ? "Risiko Signifikan" : "Dalam Batas Toleransi"
        }).`,
        timestamp: Date.now(),
        dataSnippet: `${exposureOutput.adjustedBiomassHourYears} h-y | SHS: ${exposureOutput.secondhandSmokeIndex}`,
      });

      // -------------------------------------------------------------
      // STEP 2 & 3: Parallel Execution (Differential Reasoner + Risk Scoring)
      // -------------------------------------------------------------
      await sendEvent({
        step: "differential",
        agentName: "Clinical Differential Reasoner & Risk Scorer",
        model: hasGroqKey && !isFallback ? "llama-3.3-70b-versatile (Parallel)" : "GOLD 2024 Rule Engine",
        status: "running",
        progressPercent: 55,
        message: "Menjalankan penalaran diferensial PPOK vs Asma dan komputasi skor risiko komposit...",
        timestamp: Date.now(),
      });

      if (hasGroqKey && !isFallback) {
        try {
          const [diffRes, riskRes] = await Promise.all([
            runAgent2ClinicalDifferential(questionnaireData, exposureOutput),
            runAgent3RiskScoring(questionnaireData, exposureOutput),
          ]);
          differentialOutput = diffRes;
          riskOutput = riskRes;
        } catch (err) {
          console.warn("Agents 2 & 3 fallback triggered:", err);
          isFallback = true;
          const fallbackDossier = generateDeterministicScreeningDossier(
            questionnaireData,
            screeningId
          );
          differentialOutput = fallbackDossier.differentialAnalysis;
          riskOutput = fallbackDossier.riskAssessment;
        }
      } else {
        const fallbackDossier = generateDeterministicScreeningDossier(
          questionnaireData,
          screeningId
        );
        differentialOutput = fallbackDossier.differentialAnalysis;
        riskOutput = fallbackDossier.riskAssessment;
      }

      await sendEvent({
        step: "scoring",
        agentName: "Quantitative Risk Scorer",
        model: hasGroqKey && !isFallback ? "llama-3.3-70b-versatile" : "PUMA & GOLD Engine",
        status: "completed",
        progressPercent: 75,
        message: `Skor Risiko Komposit: ${riskOutput.compositeRiskScore}/100 (${riskOutput.riskTier}) — ${differentialOutput.primarySuspect}.`,
        timestamp: Date.now(),
        dataSnippet: `Skor: ${riskOutput.compositeRiskScore} | ${riskOutput.goldRiskCategory}`,
      });

      // -------------------------------------------------------------
      // STEP 4: Actionable Dossier Synthesizer
      // -------------------------------------------------------------
      await sendEvent({
        step: "dossier",
        agentName: "Actionable Dossier Agent",
        model: hasGroqKey && !isFallback ? "llama-3.3-70b-versatile" : "Medical Protocol Engine",
        status: "running",
        progressPercent: 88,
        message: "Menyusun draf resume klinis Puskesmas dan rekomendasi spirometri pos-bronkodilator...",
        timestamp: Date.now(),
      });

      if (hasGroqKey && !isFallback) {
        try {
          actionableOutput = await runAgent4ActionableDossier(
            questionnaireData,
            exposureOutput,
            differentialOutput,
            riskOutput
          );
        } catch (err) {
          console.warn("Agent 4 fallback triggered:", err);
          isFallback = true;
          const fallbackDossier = generateDeterministicScreeningDossier(
            questionnaireData,
            screeningId
          );
          actionableOutput = fallbackDossier.actionableDossier;
        }
      } else {
        const fallbackDossier = generateDeterministicScreeningDossier(
          questionnaireData,
          screeningId
        );
        actionableOutput = fallbackDossier.actionableDossier;
      }

      // -------------------------------------------------------------
      // STEP 5: Final Unified Screening Dossier Payload
      // -------------------------------------------------------------
      const finalDossier: UnifiedScreeningDossier = {
        id: screeningId,
        createdAt: new Date().toISOString(),
        isFallbackEngine: isFallback,
        patientDemographics: {
          age: questionnaireData.age,
          gender: questionnaireData.gender,
          smokingStatus: questionnaireData.smokingStatus,
          formerPackYears: questionnaireData.formerPackYears,
        },
        exposureMetrics: exposureOutput,
        differentialAnalysis: differentialOutput,
        riskAssessment: riskOutput,
        actionableDossier: actionableOutput,
      };

      await sendEvent({
        step: "complete",
        agentName: "Multi-Agent Pipeline Coordinator",
        model: "Groq LPU Pipeline",
        status: "completed",
        progressPercent: 100,
        message: "Penapisan berhasil diselesaikan. Membuka Clinical Risk Dashboard...",
        timestamp: Date.now(),
        fullDossier: finalDossier,
      });
    } catch (error: any) {
      console.error("Screening Pipeline Failure:", error);
      await sendEvent({
        step: "error",
        agentName: "Pipeline Error Handler",
        model: "System",
        status: "failed",
        progressPercent: 0,
        message: `Terjadi kesalahan saat memproses data: ${error.message || "Gagal inferensi"}`,
        timestamp: Date.now(),
      });
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
