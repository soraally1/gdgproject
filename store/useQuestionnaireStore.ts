import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  QuestionnaireData,
  Step1Schema,
  Step2Schema,
  Step3Schema,
  Step4Schema,
  QuestionnaireSchema,
  CalculatedExposureMetrics,
} from "@/types/questionnaire.types";
import { calculateComprehensiveExposureMetrics } from "@/lib/exposureCalculator";
import { saveScreeningSubmissionToFirestore } from "@/lib/firebase";

export const INITIAL_QUESTIONNAIRE_DATA: QuestionnaireData = {
  // Step 1: Demografi
  age: 45,
  gender: "female",
  smokingStatus: "never",
  formerPackYears: 0,

  // Step 2: Paparan Lingkungan
  cookingFuel: "firewood",
  cookingHoursPerDay: 3,
  cookingYears: 15,
  kitchenVentilation: "poor_closed",
  smokersInHouse: 1,
  secondhandYears: 15,
  secondhandFrequency: "daily",
  mosquitoCoilUsage: "occasional",
  residenceLocation: "rural",
  occupationalDustExposure: false,
  occupationalYears: 0,

  // Step 3: Gejala & mMRC
  chronicCoughMonths: true,
  morningPhlegm: true,
  wheezingFrequency: "occasional",
  childhoodAsthmaHistory: false,
  mmrcGrade: 2,

  // Step 4: Red Flags
  redFlags: {
    hemoptysis: false,
    unexplainedWeightLoss: false,
    nightSweatsFever: false,
    chestPain: false,
    legSwelling: false,
  },
};

interface QuestionnaireStore {
  // Navigation & UI States
  currentStep: number; // 1 to 4
  isSubmitting: boolean;
  submitError: string | null;
  lastSubmissionId: string | null;
  stepErrors: Record<string, string>;

  // Form Data
  formData: QuestionnaireData;

  // Realtime Computed Metrics
  metrics: CalculatedExposureMetrics;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => boolean;
  prevStep: () => void;
  updateField: <K extends keyof QuestionnaireData>(
    field: K,
    value: QuestionnaireData[K]
  ) => void;
  updateRedFlag: (
    key: keyof QuestionnaireData["redFlags"],
    value: boolean
  ) => void;
  validateStep: (stepNumber: number) => boolean;
  resetForm: () => void;
  submitQuestionnaire: () => Promise<{ success: boolean; id: string }>;
}

export const useQuestionnaireStore = create<QuestionnaireStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      isSubmitting: false,
      submitError: null,
      lastSubmissionId: null,
      stepErrors: {},
      formData: INITIAL_QUESTIONNAIRE_DATA,
      metrics: calculateComprehensiveExposureMetrics(INITIAL_QUESTIONNAIRE_DATA),

      setStep: (step) => {
        set({ currentStep: Math.min(Math.max(step, 1), 4), stepErrors: {} });
      },

      updateField: (field, value) => {
        set((state) => {
          const updatedFormData = {
            ...state.formData,
            [field]: value,
          };
          const updatedMetrics =
            calculateComprehensiveExposureMetrics(updatedFormData);

          // Hapus error field jika ada
          const newErrors = { ...state.stepErrors };
          delete newErrors[field as string];

          return {
            formData: updatedFormData,
            metrics: updatedMetrics,
            stepErrors: newErrors,
          };
        });
      },

      updateRedFlag: (key, value) => {
        set((state) => {
          const updatedRedFlags = {
            ...state.formData.redFlags,
            [key]: value,
          };
          const updatedFormData = {
            ...state.formData,
            redFlags: updatedRedFlags,
          };
          const updatedMetrics =
            calculateComprehensiveExposureMetrics(updatedFormData);

          return {
            formData: updatedFormData,
            metrics: updatedMetrics,
          };
        });
      },

      validateStep: (stepNumber) => {
        const { formData } = get();
        const errors: Record<string, string> = {};

        try {
          if (stepNumber === 1) {
            Step1Schema.parse(formData);
          } else if (stepNumber === 2) {
            Step2Schema.parse(formData);
          } else if (stepNumber === 3) {
            Step3Schema.parse(formData);
          } else if (stepNumber === 4) {
            Step4Schema.parse(formData);
          }
          set({ stepErrors: {} });
          return true;
        } catch (err: unknown) {
          if (err && typeof err === "object" && "issues" in err) {
            const zodIssues = (err as { issues: Array<{ path: string[]; message: string }> }).issues;
            zodIssues.forEach((issue) => {
              const fieldName = issue.path[0];
              if (fieldName) {
                errors[fieldName] = issue.message;
              }
            });
          }
          set({ stepErrors: errors });
          return false;
        }
      },

      nextStep: () => {
        const { currentStep, validateStep } = get();
        const isValid = validateStep(currentStep);

        if (isValid && currentStep < 4) {
          set({ currentStep: currentStep + 1, stepErrors: {} });
          return true;
        }
        return isValid;
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1, stepErrors: {} });
        }
      },

      resetForm: () => {
        set({
          currentStep: 1,
          formData: INITIAL_QUESTIONNAIRE_DATA,
          metrics: calculateComprehensiveExposureMetrics(INITIAL_QUESTIONNAIRE_DATA),
          stepErrors: {},
          submitError: null,
          lastSubmissionId: null,
        });
      },

      submitQuestionnaire: async () => {
        const { formData, metrics } = get();

        // Validasi menyeluruh
        try {
          QuestionnaireSchema.parse(formData);
        } catch (err: unknown) {
          set({
            submitError: "Mohon lengkapi data kuesioner dengan benar.",
          });
          return { success: false, id: "" };
        }

        set({ isSubmitting: true, submitError: null });

        try {
          const result = await saveScreeningSubmissionToFirestore(
            formData,
            metrics
          );

          if (result.success) {
            set({
              isSubmitting: false,
              lastSubmissionId: result.id,
            });
            return { success: true, id: result.id };
          } else {
            set({
              isSubmitting: false,
              submitError: result.error || "Gagal menyimpan data skrining",
            });
            return { success: false, id: "" };
          }
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : "Terjadi kesalahan sistem";
          set({
            isSubmitting: false,
            submitError: message,
          });
          return { success: false, id: "" };
        }
      },
    }),
    {
      name: "pulmoscreen_intake_draft",
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
      }),
    }
  )
);
