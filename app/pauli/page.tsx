import type { Metadata } from "next";
import PauliTest from "./components/PauliTest";

export const metadata: Metadata = {
  title: "Mulai Latihan Tes Pauli Online",
  description:
    "Mulai latihan Tes Pauli online dengan pilihan durasi 1, 5, 15, 30, atau 60 menit untuk melatih konsentrasi, kecepatan, dan ketelitian.",
  alternates: {
    canonical: "/pauli",
  },
};

export default function PauliPage() {
  return <PauliTest />;
}
