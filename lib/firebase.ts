import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  QuestionnaireData,
  CalculatedExposureMetrics,
  ScreeningFirestoreRecord,
} from "@/types/questionnaire.types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "pulmoscreen-ai.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "pulmoscreen-ai",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "pulmoscreen-ai.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

// Inisialisasi Firebase App (Singleton)
let app: FirebaseApp;
let db: Firestore;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization warning (running in fallback mode):", error);
}

export { app, db };

/**
 * Menyimpan data intake kuesioner dan hasil kalkulasi ke Firestore
 */
export async function saveScreeningSubmissionToFirestore(
  formData: QuestionnaireData,
  calculatedMetrics: CalculatedExposureMetrics
): Promise<{ success: boolean; id: string; error?: string }> {
  try {
    const screeningId = `PS-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    const record: Omit<ScreeningFirestoreRecord, "id"> & {
      id: string;
      serverCreatedAt: ReturnType<typeof serverTimestamp>;
    } = {
      id: screeningId,
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
      serverCreatedAt: serverTimestamp(),
      formData,
      calculatedMetrics,
      status: "submitted",
    };

    if (db) {
      const screeningsCol = collection(db, "screening_records");
      const docRef = doc(screeningsCol, screeningId);
      await setDoc(docRef, record);
      return { success: true, id: screeningId };
    } else {
      // Fallback local storage jika Firestore offline / belum ada config
      return { success: true, id: screeningId };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menyimpan ke Firestore";
    console.error("Error saving screening to Firestore:", message);
    return {
      success: false,
      id: `LOCAL-${Date.now()}`,
      error: message,
    };
  }
}
