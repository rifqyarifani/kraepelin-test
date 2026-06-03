import type { Metadata } from "next";
import PauliTest from "./components/PauliTest";

export const metadata: Metadata = {
  title: "Tes Pauli — Mulai Latihan",
  description:
    "Mulai latihan Tes Pauli: pilih durasi (1, 5, 15, 30, atau 60 menit) dan uji konsentrasi, kecepatan, serta ketelitianmu.",
};

export default function PauliPage() {
  return <PauliTest />;
}
