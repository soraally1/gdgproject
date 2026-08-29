import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PulmoScreen AI — Penapisan Dini PPOK Tersembunyi pada Non-Perokok",
  description:
    "Sistem penapisan klinis cerdas berbasis Multi-Agent Groq LLM untuk mendeteksi risiko PPOK akibat paparan asap biomassa dapur, perokok pasif, dan polusi partikulat urban.",
  keywords: [
    "PPOK",
    "COPD",
    "Non-Perokok",
    "Asap Biomassa",
    "Kayu Bakar",
    "Perokok Pasif",
    "Spirometri",
    "GOLD 2024",
    "Puskesmas",
    "Groq AI",
  ],
  authors: [{ name: "PulmoScreen AI Clinical Team" }],
};

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="antialiased bg-[#090d16] text-slate-100 min-h-screen flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
