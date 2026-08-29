import { z } from "zod";

export const SmokingStatusEnum = z.enum(["never", "former", "active"]);
export type SmokingStatus = z.infer<typeof SmokingStatusEnum>;

export const CookingFuelEnum = z.enum(["firewood", "charcoal", "kerosene", "lpg", "electric"]);
export type CookingFuel = z.infer<typeof CookingFuelEnum>;

export const KitchenVentilationEnum = z.enum(["good_open", "moderate_window", "poor_closed"]);
export type KitchenVentilation = z.infer<typeof KitchenVentilationEnum>;

export const SecondhandFrequencyEnum = z.enum(["daily", "weekly", "rarely"]);
export type SecondhandFrequency = z.infer<typeof SecondhandFrequencyEnum>;

export const MosquitoCoilEnum = z.enum(["daily", "occasional", "never"]);
export type MosquitoCoil = z.infer<typeof MosquitoCoilEnum>;

export const ResidenceLocationEnum = z.enum(["highway_busy", "industrial", "urban_standard", "rural"]);
export type ResidenceLocation = z.infer<typeof ResidenceLocationEnum>;

export const WheezingFrequencyEnum = z.enum(["frequent", "occasional", "never"]);
export type WheezingFrequency = z.infer<typeof WheezingFrequencyEnum>;

export const QuestionnaireSchema = z.object({
  // Demografi
  age: z.number().min(18, "Usia minimal 18 tahun").max(110, "Usia tidak valid"),
  gender: z.enum(["male", "female"]),
  smokingStatus: SmokingStatusEnum,
  formerPackYears: z.number().min(0).default(0),

  // Paparan Biomassa Dapur
  cookingFuel: CookingFuelEnum,
  cookingHoursPerDay: z.number().min(0).max(24, "Maksimal 24 jam"),
  cookingYears: z.number().min(0).max(80, "Maksimal 80 tahun"),
  kitchenVentilation: KitchenVentilationEnum,

  // Paparan Perokok Pasif (SHS)
  smokersInHouse: z.number().min(0).max(20),
  secondhandYears: z.number().min(0).max(80),
  secondhandFrequency: SecondhandFrequencyEnum,

  // Polusi & Debu Lingkungan
  mosquitoCoilUsage: MosquitoCoilEnum,
  residenceLocation: ResidenceLocationEnum,
  occupationalDustExposure: z.boolean(),
  occupationalYears: z.number().min(0).max(80).default(0),

  // Gejala Klinis & Skala mMRC
  chronicCoughMonths: z.boolean(),
  morningPhlegm: z.boolean(),
  wheezingFrequency: WheezingFrequencyEnum,
  childhoodAsthmaHistory: z.boolean(),
  mmrcGrade: z.number().min(0).max(4),

  // Red Flags / Tanda Bahaya
  redFlags: z.object({
    hemoptysis: z.boolean(),
    unexplainedWeightLoss: z.boolean(),
    nightSweatsFever: z.boolean(),
    chestPain: z.boolean(),
    legSwelling: z.boolean(),
  }),
});

export type QuestionnaireData = z.infer<typeof QuestionnaireSchema>;

export interface CalculatedExposureMetrics {
  rawBiomassHourYears: number;
  adjustedBiomassHourYears: number;
  secondhandSmokeScore: number;
  occupationalRiskScore: number;
  preliminaryPumaScore: number;
  hasRedFlags: boolean;
  activeRedFlagsCount: number;
  isHighBiomassRisk: boolean;
}

export const INITIAL_QUESTIONNAIRE_DATA: QuestionnaireData = {
  age: 48,
  gender: "female",
  smokingStatus: "never",
  formerPackYears: 0,

  cookingFuel: "firewood",
  cookingHoursPerDay: 3,
  cookingYears: 18,
  kitchenVentilation: "poor_closed",

  smokersInHouse: 1,
  secondhandYears: 15,
  secondhandFrequency: "daily",

  mosquitoCoilUsage: "daily",
  residenceLocation: "highway_busy",
  occupationalDustExposure: false,
  occupationalYears: 0,

  chronicCoughMonths: true,
  morningPhlegm: true,
  wheezingFrequency: "occasional",
  childhoodAsthmaHistory: false,
  mmrcGrade: 2,

  redFlags: {
    hemoptysis: false,
    unexplainedWeightLoss: false,
    nightSweatsFever: false,
    chestPain: false,
    legSwelling: false,
  },
};
