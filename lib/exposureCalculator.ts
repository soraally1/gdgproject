import { QuestionnaireData, CalculatedExposureMetrics } from "@/types/questionnaire.types";

export function calculateExposureMetrics(data: QuestionnaireData): CalculatedExposureMetrics {
  // 1. Biomass Hour-Years
  let fuelWeight = 1.0;
  if (data.cookingFuel === "firewood") fuelWeight = 1.0;
  else if (data.cookingFuel === "charcoal") fuelWeight = 0.9;
  else if (data.cookingFuel === "kerosene") fuelWeight = 0.8;
  else if (data.cookingFuel === "lpg") fuelWeight = 0.15;
  else if (data.cookingFuel === "electric") fuelWeight = 0.0;

  const rawBiomassHourYears = data.cookingHoursPerDay * data.cookingYears * fuelWeight;

  let ventilationFactor = 1.0;
  if (data.kitchenVentilation === "good_open") ventilationFactor = 0.7;
  else if (data.kitchenVentilation === "moderate_window") ventilationFactor = 1.0;
  else if (data.kitchenVentilation === "poor_closed") ventilationFactor = 1.5;

  const adjustedBiomassHourYears = Math.round(rawBiomassHourYears * ventilationFactor * 10) / 10;

  // 2. Secondhand Smoke Cumulative Score
  let freqMultiplier = 0.2;
  if (data.secondhandFrequency === "daily") freqMultiplier = 1.0;
  else if (data.secondhandFrequency === "weekly") freqMultiplier = 0.5;

  const secondhandSmokeScore = Math.round(
    data.smokersInHouse * data.secondhandYears * freqMultiplier * 10
  ) / 10;

  // 3. Occupational & Environmental Dust Score (0 - 100)
  let occScore = 0;
  if (data.residenceLocation === "industrial") occScore += 35;
  else if (data.residenceLocation === "highway_busy") occScore += 25;
  else if (data.residenceLocation === "urban_standard") occScore += 10;

  if (data.mosquitoCoilUsage === "daily") occScore += 25;
  else if (data.mosquitoCoilUsage === "occasional") occScore += 10;

  if (data.occupationalDustExposure) {
    occScore += 30 + Math.min(10, data.occupationalYears);
  }

  const occupationalRiskScore = Math.min(100, occScore);

  // 4. Preliminary PUMA Score (Adapted for Non-Smokers)
  let puma = 0;
  if (data.gender === "female" && data.cookingYears >= 10 && fuelWeight >= 0.8) {
    puma += 2;
  }
  if (data.age >= 50) puma += 2;
  else if (data.age >= 40) puma += 1;

  if (data.chronicCoughMonths || data.morningPhlegm) puma += 1;
  if (data.mmrcGrade >= 2) puma += 2;
  else if (data.mmrcGrade === 1) puma += 1;

  if (data.wheezingFrequency !== "never" && !data.childhoodAsthmaHistory) {
    puma += 1;
  }

  // 5. Red Flags Count
  const activeRedFlagsCount = Object.values(data.redFlags).filter(Boolean).length;
  const hasRedFlags = activeRedFlagsCount > 0;
  const isHighBiomassRisk = adjustedBiomassHourYears >= 60;

  return {
    rawBiomassHourYears: Math.round(rawBiomassHourYears * 10) / 10,
    adjustedBiomassHourYears,
    secondhandSmokeScore,
    occupationalRiskScore,
    preliminaryPumaScore: puma,
    hasRedFlags,
    activeRedFlagsCount,
    isHighBiomassRisk,
  };
}

export function computeExposureContributionPercentages(metrics: CalculatedExposureMetrics) {
  const bioWeight = Math.max(metrics.adjustedBiomassHourYears * 1.2, 5);
  const shsWeight = Math.max(metrics.secondhandSmokeScore * 1.5, 2);
  const ambientWeight = Math.max(metrics.occupationalRiskScore * 0.4, 2);

  const total = bioWeight + shsWeight + ambientWeight;
  const biomassPercent = Math.round((bioWeight / total) * 100);
  const secondhandSmokePercent = Math.round((shsWeight / total) * 100);
  const ambientPollutionPercent = 100 - (biomassPercent + secondhandSmokePercent);

  return {
    biomassPercent,
    secondhandSmokePercent,
    ambientPollutionPercent: Math.max(0, ambientPollutionPercent),
  };
}
