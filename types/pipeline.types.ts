import { z } from "zod";

// Schema Output Agent 1: Exposure Intake & Parameter Normalization
export const ExposureOutputSchema = z.object({
  rawBiomassHourYears: z.number(),
  adjustedBiomassHourYears: z.number(),
  secondhandSmokeIndex: z.number(),
  occupationalRiskLevel: z.enum(["low", "medium", "high"]),
  exposureContribution: z.object({
    biomassPercent: z.number(),
    secondhandSmokePercent: z.number(),
    ambientPollutionPercent: z.number(),
  }),
  primaryExposureSummary: z.string(),
  isSignificantBiomassExposure: z.boolean(),
});

export type ExposureOutput = z.infer<typeof ExposureOutputSchema>;

// Schema Output Agent 2: Clinical Differential Reasoner
export const DifferentialOutputSchema = z.object({
  primarySuspect: z.string(),
  icd10Suspect: z.string(), // e.g. "J44.8"
  primaryConfidenceScore: z.number().min(0).max(100),
  differentialList: z.array(
    z.object({
      condition: z.string(),
      icdCode: z.string().optional(),
      probability: z.number().min(0).max(100),
      clinicalRationale: z.string(),
    })
  ),
  copdVsAsthmaFeatures: z.object({
    supportsCOPD: z.array(z.string()),
    supportsAsthma: z.array(z.string()),
  }),
  redFlagsIdentified: z.array(z.string()),
  urgentMedicalAttentionRequired: z.boolean(),
});

export type DifferentialOutput = z.infer<typeof DifferentialOutputSchema>;

// Schema Output Agent 3: Quantitative Risk Scoring
export const RiskScoringOutputSchema = z.object({
  compositeRiskScore: z.number().min(0).max(100),
  riskTier: z.enum(["LOW", "MODERATE", "HIGH"]),
  goldRiskCategory: z.enum([
    "LOW_RISK_EARLY",
    "SUSPECTED_MODERATE_COPD",
    "SUSPECTED_SEVERE_PULMONARY_OBSTRUCTION",
  ]),
  pumaScore: z.number(),
  spirometryUrgency: z.enum(["ROUTINE", "RECOMMENDED", "URGENT"]),
  scoreBreakdown: z.object({
    biomassComponent: z.number(),
    dyspneaMmrcComponent: z.number(),
    chronicCoughComponent: z.number(),
    secondhandSmokeComponent: z.number(),
    ageGenderComponent: z.number(),
    noChildhoodAsthmaComponent: z.number(),
  }),
});

export type RiskScoringOutput = z.infer<typeof RiskScoringOutputSchema>;

// Schema Output Agent 4: Actionable Dossier & Clinical Protocol
export const ActionableDossierSchema = z.object({
  patientPlan: z.object({
    summaryText: z.string(),
    kitchenMitigationSteps: z.array(z.string()),
    breathingExerciseGuide: z.string(),
    doctorVisitChecklist: z.array(z.string()),
    lifestyleRecommendations: z.array(z.string()),
  }),
  physicianBrief: z.object({
    clinicalSoapSummary: z.string(),
    biomassExposureHistoryText: z.string(),
    symptomProgressionText: z.string(),
    spirometryJustification: z.string(),
    recommendedDiagnosticOrders: z.array(z.string()),
    initialTherapeuticGuidance: z.string(),
    icd10Codes: z.array(z.string()),
  }),
});

export type ActionableDossier = z.infer<typeof ActionableDossierSchema>;

// Schema Unified Final Output (Complete Screening Dossier)
export const UnifiedScreeningDossierSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  isFallbackEngine: z.boolean().default(false),
  patientDemographics: z.object({
    age: z.number(),
    gender: z.enum(["male", "female"]),
    smokingStatus: z.string(),
    formerPackYears: z.number().optional().default(0),
  }),
  exposureMetrics: ExposureOutputSchema,
  differentialAnalysis: DifferentialOutputSchema,
  riskAssessment: RiskScoringOutputSchema,
  actionableDossier: ActionableDossierSchema,
});

export type UnifiedScreeningDossier = z.infer<typeof UnifiedScreeningDossierSchema>;

// Telemetry Streaming Event for Live UI Stepper
export interface StreamTelemetryEvent {
  step: "intake" | "differential" | "scoring" | "dossier" | "complete" | "error";
  agentName: string;
  model: string;
  status: "pending" | "running" | "completed" | "failed";
  progressPercent: number;
  message: string;
  timestamp: number;
  dataSnippet?: string;
  fullDossier?: UnifiedScreeningDossier;
}
