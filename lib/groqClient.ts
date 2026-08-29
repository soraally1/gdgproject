import { QuestionnaireData } from "@/types/questionnaire.types";
import {
  ExposureOutput,
  DifferentialOutput,
  RiskScoringOutput,
  ActionableDossier,
  ExposureOutputSchema,
  DifferentialOutputSchema,
  RiskScoringOutputSchema,
  ActionableDossierSchema,
} from "@/types/pipeline.types";
import { calculateExposureMetrics } from "./exposureCalculator";

const GROQ_API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

async function callGroqChat(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  temperature: number = 0.2
): Promise<any> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY_MISSING");
  }

  const response = await fetch(GROQ_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error("Empty response from Groq API");
  }

  return JSON.parse(rawContent);
}

// -------------------------------------------------------------
// AGENT 1: Exposure Intake & Parameter Normalization Agent (8B)
// -------------------------------------------------------------
export async function runAgent1ExposureIntake(data: QuestionnaireData): Promise<ExposureOutput> {
  const precalc = calculateExposureMetrics(data);

  const systemPrompt = `You are the Exposure Intake Agent for PulmoScreen AI.
You parse, normalize, and quantify environmental non-tobacco pulmonary exposure data from a patient screening questionnaire.
Return a strictly valid JSON object matching this schema:
{
  "rawBiomassHourYears": number,
  "adjustedBiomassHourYears": number,
  "secondhandSmokeIndex": number,
  "occupationalRiskLevel": "low" | "medium" | "high",
  "exposureContribution": {
    "biomassPercent": number,
    "secondhandSmokePercent": number,
    "ambientPollutionPercent": number
  },
  "primaryExposureSummary": string (in Indonesian),
  "isSignificantBiomassExposure": boolean
}
Rules:
- Raw Hour-Years = cookingHoursPerDay * cookingYears (weighted by fuel type).
- Adjusted Hour-Years accounts for ventilation multiplier (good_open=0.7, moderate_window=1.0, poor_closed=1.5).
- Threshold for significant exposure is >= 60 adjusted hour-years.
- Percentages must sum to 100.`;

  const userPrompt = `Patient Questionnaire Exposure Data:
${JSON.stringify(
  {
    age: data.age,
    gender: data.gender,
    smokingStatus: data.smokingStatus,
    cookingFuel: data.cookingFuel,
    cookingHoursPerDay: data.cookingHoursPerDay,
    cookingYears: data.cookingYears,
    kitchenVentilation: data.kitchenVentilation,
    smokersInHouse: data.smokersInHouse,
    secondhandYears: data.secondhandYears,
    secondhandFrequency: data.secondhandFrequency,
    mosquitoCoilUsage: data.mosquitoCoilUsage,
    residenceLocation: data.residenceLocation,
    occupationalDustExposure: data.occupationalDustExposure,
    occupationalYears: data.occupationalYears,
    precalculatedHints: precalc,
  },
  null,
  2
)}`;

  const parsed = await callGroqChat("llama-3.1-8b-instant", systemPrompt, userPrompt, 0.1);
  return ExposureOutputSchema.parse(parsed);
}

// -------------------------------------------------------------
// AGENT 2: Clinical Differential Reasoner Agent (70B)
// -------------------------------------------------------------
export async function runAgent2ClinicalDifferential(
  data: QuestionnaireData,
  exposure: ExposureOutput
): Promise<DifferentialOutput> {
  const systemPrompt = `You are the Clinical Differential Reasoner Agent for PulmoScreen AI, following GOLD 2024 and GINA guidelines.
Analyze the patient's respiratory symptoms in the context of non-tobacco environmental exposures (biomass cooking smoke, secondhand smoke).
Distinguish between:
1. Biomass-induced COPD (ICD-10: J44.8 / J44.9)
2. Late-onset Asthma (ICD-10: J45.9)
3. Post-TB Bronchiectasis / Sequelae (ICD-10: J47)
4. Other non-specific airway disorders.

Return a strictly valid JSON object matching this schema:
{
  "primarySuspect": string,
  "icd10Suspect": string,
  "primaryConfidenceScore": number (0-100),
  "differentialList": [
    {
      "condition": string,
      "icdCode": string,
      "probability": number (0-100),
      "clinicalRationale": string (in Indonesian)
    }
  ],
  "copdVsAsthmaFeatures": {
    "supportsCOPD": [string in Indonesian],
    "supportsAsthma": [string in Indonesian]
  },
  "redFlagsIdentified": [string in Indonesian],
  "urgentMedicalAttentionRequired": boolean
}`;

  const userPrompt = `Patient Clinical Profile:
Demographics: Age ${data.age}, Gender ${data.gender}, Smoker: ${data.smokingStatus}
Symptoms:
- Chronic cough >3 months: ${data.chronicCoughMonths}
- Morning phlegm (productive): ${data.morningPhlegm}
- Wheezing frequency: ${data.wheezingFrequency}
- Childhood asthma history: ${data.childhoodAsthmaHistory}
- mMRC Dyspnea Grade: ${data.mmrcGrade}
Red Flags:
- Hemoptysis (batuk darah): ${data.redFlags.hemoptysis}
- Unexplained weight loss: ${data.redFlags.unexplainedWeightLoss}
- Night sweats/fever: ${data.redFlags.nightSweatsFever}
- Pleuritic chest pain: ${data.redFlags.chestPain}
- Leg swelling: ${data.redFlags.legSwelling}
Exposure Profile:
- Adjusted Biomass Hour-Years: ${exposure.adjustedBiomassHourYears}
- Secondhand Smoke Index: ${exposure.secondhandSmokeIndex}
- Primary summary: ${exposure.primaryExposureSummary}`;

  const parsed = await callGroqChat("llama-3.3-70b-versatile", systemPrompt, userPrompt, 0.2);
  return DifferentialOutputSchema.parse(parsed);
}

// -------------------------------------------------------------
// AGENT 3: Quantitative Risk Scoring Agent (70B)
// -------------------------------------------------------------
export async function runAgent3RiskScoring(
  data: QuestionnaireData,
  exposure: ExposureOutput
): Promise<RiskScoringOutput> {
  const systemPrompt = `You are the Quantitative Risk Scoring Agent for PulmoScreen AI.
Synthesize the PUMA screening score adapted for non-smokers, mMRC dyspnea grade, age, and biomass hour-years into a unified composite risk score (0-100) and GOLD risk category.
Return a strictly valid JSON object matching this schema:
{
  "compositeRiskScore": number (0-100),
  "riskTier": "LOW" | "MODERATE" | "HIGH",
  "goldRiskCategory": "LOW_RISK_EARLY" | "SUSPECTED_MODERATE_COPD" | "SUSPECTED_SEVERE_PULMONARY_OBSTRUCTION",
  "pumaScore": number,
  "spirometryUrgency": "ROUTINE" | "RECOMMENDED" | "URGENT",
  "scoreBreakdown": {
    "biomassComponent": number (0-30),
    "dyspneaMmrcComponent": number (0-25),
    "chronicCoughComponent": number (0-15),
    "secondhandSmokeComponent": number (0-15),
    "ageGenderComponent": number (0-10),
    "noChildhoodAsthmaComponent": number (0-5)
  }
}
Risk Tiers:
- LOW: 0 - 29 (Upper airway / reversible)
- MODERATE: 30 - 64 (Suspected small airway disease / early COPD)
- HIGH: 65 - 100 (Strong indication of established COPD needing prompt spirometry)`;

  const userPrompt = `Patient Scoring Metrics:
Age: ${data.age}, Gender: ${data.gender}
Adjusted Biomass Hour-Years: ${exposure.adjustedBiomassHourYears}
Secondhand Smoke Index: ${exposure.secondhandSmokeIndex}
Occupational Risk: ${exposure.occupationalRiskLevel}
mMRC Grade: ${data.mmrcGrade}
Chronic Cough / Morning Phlegm: ${data.chronicCoughMonths} / ${data.morningPhlegm}
Childhood Asthma: ${data.childhoodAsthmaHistory}`;

  const parsed = await callGroqChat("llama-3.3-70b-versatile", systemPrompt, userPrompt, 0.1);
  return RiskScoringOutputSchema.parse(parsed);
}

// -------------------------------------------------------------
// AGENT 4: Actionable Dossier & Clinical Protocol Synthesizer (70B)
// -------------------------------------------------------------
export async function runAgent4ActionableDossier(
  data: QuestionnaireData,
  exposure: ExposureOutput,
  differential: DifferentialOutput,
  risk: RiskScoringOutput
): Promise<ActionableDossier> {
  const systemPrompt = `You are the Actionable Dossier Synthesizer Agent for PulmoScreen AI.
Synthesize two distinct documents based on the screening outputs:
1. Patient Action Plan: In empathetic, accessible Indonesian, covering kitchen ventilation mitigation, pursed-lip breathing technique, and preparing for doctor visit.
2. Physician Medical Brief: In formal medical Indonesian/English following standard Puskesmas SOAP format, justifying gold-standard post-bronchodilator spirometry (GOLD 2024), ICD-10 codes, and diagnostic orders.

Return a strictly valid JSON object matching this schema:
{
  "patientPlan": {
    "summaryText": string,
    "kitchenMitigationSteps": [string],
    "breathingExerciseGuide": string,
    "doctorVisitChecklist": [string],
    "lifestyleRecommendations": [string]
  },
  "physicianBrief": {
    "clinicalSoapSummary": string,
    "biomassExposureHistoryText": string,
    "symptomProgressionText": string,
    "spirometryJustification": string,
    "recommendedDiagnosticOrders": [string],
    "initialTherapeuticGuidance": string,
    "icd10Codes": [string]
  }
}`;

  const userPrompt = `Patient Details:
Demographics: ${data.gender === "female" ? "Perempuan" : "Laki-laki"}, ${data.age} tahun, Status Rokok: ${
    data.smokingStatus
  }
Exposure: ${exposure.adjustedBiomassHourYears} Hour-Years (${exposure.primaryExposureSummary})
Risk: Composite Score ${risk.compositeRiskScore}/100 (${risk.riskTier}), Category: ${risk.goldRiskCategory}
Differential: Primary Suspect ${differential.primarySuspect} (${differential.icd10Suspect})
mMRC Grade: ${data.mmrcGrade}, Cough: ${data.chronicCoughMonths}, Sputum: ${data.morningPhlegm}
Red Flags: ${differential.redFlagsIdentified.join(", ") || "None"}`;

  const parsed = await callGroqChat("llama-3.3-70b-versatile", systemPrompt, userPrompt, 0.2);
  return ActionableDossierSchema.parse(parsed);
}
