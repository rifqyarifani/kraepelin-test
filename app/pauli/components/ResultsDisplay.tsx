"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, ArrowRight } from "lucide-react";
import { formatPercent } from "@/lib/utils";
import { finalizePage, type PauliColumn } from "@/lib/pauli-game";
import { saveLeaderboardEntry } from "@/app/actions/leaderboard";
import NameInputModal from "./NameInputModal";

interface ResultsDisplayProps {
  columns: PauliColumn[];
  onTryAgain: () => void;
}

export default function ResultsDisplay({
  columns,
  onTryAgain,
}: ResultsDisplayProps) {
  const router = useRouter();
  const [showNameInput, setShowNameInput] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { correct: totalCorrect, incorrect: totalIncorrect } =
    finalizePage(columns);
  const accuracy =
    totalCorrect + totalIncorrect > 0
      ? (totalCorrect / (totalCorrect + totalIncorrect)) * 100
      : 0;
  const score = totalCorrect - totalIncorrect;

  const handleNameSubmit = async (name: string) => {
    setError(null);
    const response = await saveLeaderboardEntry({
      name,
      columns: columns.map((c) => c.numbers),
      answers: columns.map((c) => c.answers),
    });

    if (!response.success) {
      setError(response.error);
      return;
    }
    setShowNameInput(false);
  };

  return (
    <>
      {showNameInput && (
        <NameInputModal
          onSubmit={handleNameSubmit}
          onClose={() => {
            setShowNameInput(false);
            router.push("/leaderboard");
          }}
          error={error}
        />
      )}
      <div
        className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-[2px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="results-title"
      >
        <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
          <h1 id="results-title" className="text-3xl font-bold mb-8 text-center">
            Waktu Habis!
          </h1>

          <div className="space-y-4 mb-8">
            <div className="bg-success-bg rounded-xl p-4 flex justify-between items-center">
              <span className="text-success-fg text-lg">Benar</span>
              <span className="text-success-fg text-4xl font-bold">
                {totalCorrect}
              </span>
            </div>
            <div className="bg-danger-bg rounded-xl p-4 flex justify-between items-center">
              <span className="text-danger-fg text-lg">Salah</span>
              <span className="text-danger-fg text-4xl font-bold">
                {totalIncorrect}
              </span>
            </div>
            <div className="bg-info-bg rounded-xl p-4 flex justify-between items-center">
              <span className="text-info-fg text-lg">Ketelitian</span>
              <span className="text-info-fg text-4xl font-bold">
                {formatPercent(accuracy)}
              </span>
            </div>
            <div className="bg-violet-bg rounded-xl p-4 flex justify-between items-center">
              <span className="text-violet-fg text-lg">Skor</span>
              <span className="text-violet-fg text-4xl font-bold">{score}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onTryAgain}
              className="flex items-center justify-center gap-2 py-4 bg-white hover:bg-gray-50 text-ink text-lg font-medium rounded-xl transition-colors border-2 border-border-soft"
            >
              <RotateCcw size={20} aria-hidden="true" />
              Coba Lagi
            </button>
            <button
              onClick={() => router.push("/leaderboard")}
              className="flex items-center justify-center gap-2 py-4 bg-ink hover:bg-black/90 text-white text-lg font-medium rounded-xl transition-colors"
            >
              Lihat Papan Peringkat
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
