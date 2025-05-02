// filepath: /Users/rifqyarifani/Public/Programming/Pauli/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootWrapper from "./components/RootWrapper";
import KeepAlive from "./components/keep-alive";
import ScrollbarScript from "./components/ScrollbarScript";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tes Pauli",
  description: "Tes Pauli",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ScrollbarScript />
        <RootWrapper>
          {children}
          <KeepAlive />
        </RootWrapper>
      </body>
    </html>
  );
}
