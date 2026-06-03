import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tes Pauli — Latihan Konsentrasi & Kecepatan",
  description:
    "Latihan tes Pauli untuk meningkatkan konsentrasi, kecepatan, dan ketelitian. Berlatih secara rutin dan bersaing di papan peringkat.",
  openGraph: {
    title: "Tes Pauli",
    description: "Latihan konsentrasi, kecepatan, dan ketelitian.",
    locale: "id_ID",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
