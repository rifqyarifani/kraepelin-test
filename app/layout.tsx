// filepath: /Users/rifqyarifani/Public/Programming/Pauli/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootWrapper from "./components/RootWrapper";
import KeepAlive from "./components/keep-alive";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kraepelin Test Platform",
  description: "Challenge your mental arithmetic skills with Kraepelin Test",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootWrapper>
          {children}
          <KeepAlive />
        </RootWrapper>
      </body>
    </html>
  );
}
