"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { checkTopScore, saveLeaderboardEntry } from "@/app/actions/leaderboard";

interface KraepelinColumn {
  numbers: number[];
  answers: (number | null)[];
  isCorrect: boolean[];
}

const NameInputModal = ({
  onSubmit,
  onClose,
  error,
}: {
  onSubmit: (name: string) => void;
  onClose: () => void;
  error: string | null;
}) => {
  const [name, setName] = useState("");

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[60] backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Congratulations! 🎉</h2>
        <p className="text-gray-600 mb-6">
          You've made it to the top 100! Enter your name to be added to the
          leaderboard.
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-100"
          maxLength={50}
        />
        {error && <p className="text-red-500 mb-6">{error}</p>}
        <div className="flex gap-4">
          <button
            onClick={() => onClose()}
            className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={() => name.trim() && onSubmit(name.trim())}
            disabled={!name.trim()}
            className="flex-1 py-2 bg-[#121212] text-white rounded-lg hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const ResultsDisplay = ({
  totalCorrect,
  totalIncorrect,
  onTryAgain,
}: {
  totalCorrect: number;
  totalIncorrect: number;
  onTryAgain: () => void;
}) => {
  const router = useRouter();
  const [showNameInput, setShowNameInput] = useState(false);
  const [checkedScore, setCheckedScore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accuracy =
    totalCorrect + totalIncorrect > 0
      ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
      : 0;

  const score = totalCorrect * 10 - totalIncorrect * 5;

  useEffect(() => {
    if (!checkedScore) {
      checkTopScore(score)
        .then((isTop100) => {
          if (isTop100) {
            setShowNameInput(true);
          }
          setCheckedScore(true);
        })
        .catch((err) => {
          console.error("Error checking score:", err);
          setCheckedScore(true);
        });
    }
  }, [score, checkedScore]);

  const handleNameSubmit = async (name: string) => {
    try {
      setError(null);
      await saveLeaderboardEntry({
        name,
        score,
        correct: totalCorrect,
        incorrect: totalIncorrect,
        accuracy,
      });
      setShowNameInput(false);
      router.push("/leaderboard");
    } catch (err) {
      console.error("Error saving score:", err);
      setError("Failed to save your score. Please try again.");
    }
  };

  return (
    <>
      {showNameInput && (
        <NameInputModal
          onSubmit={handleNameSubmit}
          onClose={() => setShowNameInput(false)}
          error={error}
        />
      )}
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-[2px]">
        <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Time's Up!</h1>

          <div className="space-y-4 mb-8">
            {/* Total Correct */}
            <div className="bg-[#F0FDF4] rounded-xl p-4 flex justify-between items-center">
              <span className="text-[#166534] text-lg">Total Correct:</span>
              <span className="text-[#166534] text-4xl font-bold">
                {totalCorrect}
              </span>
            </div>

            {/* Total Incorrect */}
            <div className="bg-[#FEF2F2] rounded-xl p-4 flex justify-between items-center">
              <span className="text-[#991B1B] text-lg">Total Incorrect:</span>
              <span className="text-[#991B1B] text-4xl font-bold">
                {totalIncorrect}
              </span>
            </div>

            {/* Accuracy */}
            <div className="bg-[#EFF6FF] rounded-xl p-4 flex justify-between items-center">
              <span className="text-[#1E40AF] text-lg">Accuracy:</span>
              <span className="text-[#1E40AF] text-4xl font-bold">
                {accuracy} %
              </span>
            </div>

            {/* Score */}
            <div className="bg-[#F5F3FF] rounded-xl p-4 flex justify-between items-center">
              <span className="text-[#5B21B6] text-lg">Score:</span>
              <span className="text-[#5B21B6] text-4xl font-bold">{score}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onTryAgain}
              className="flex items-center justify-center gap-2 py-4 bg-white hover:bg-gray-50 text-[#121212] text-lg font-medium rounded-xl transition-colors border-2 border-[#E5E7EB]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.33334 3.33331V8.33331H8.33334M16.6667 16.6666V11.6666H11.6667M16.9917 7.49998C16.6197 6.3186 15.9274 5.25146 14.9883 4.40222C14.0492 3.55297 12.8989 2.94974 11.6599 2.65091C10.4209 2.35208 9.13362 2.36851 7.90455 2.69868C6.67548 3.02885 5.54285 3.66347 4.62501 4.54165M3.00834 12.5C3.38034 13.6813 4.07265 14.7485 5.01171 15.5977C5.95077 16.447 7.10111 17.0502 8.34012 17.349C9.57913 17.6479 10.8664 17.6314 12.0955 17.3013C13.3246 16.9711 14.4572 16.3365 15.375 15.4583"
                  stroke="#121212"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Try Again
            </button>
            <button
              onClick={() => router.push("/leaderboard")}
              className="flex items-center justify-center gap-2 py-4 bg-[#121212] hover:bg-black/90 text-white text-lg font-medium rounded-xl transition-colors"
            >
              View Leaderboard
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 16.6667L12.5 3.33334M14.1667 15.8333L16.6667 13.3333L14.1667 10.8333M5.83333 9.16668L3.33333 6.66668L5.83333 4.16668"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const KraepelinTest: React.FC = () => {
  const [columns, setColumns] = useState<KraepelinColumn[]>([]);
  const [timer, setTimer] = useState<number>(120);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [totalCorrect, setTotalCorrect] = useState<number>(0);
  const [totalIncorrect, setTotalIncorrect] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  // Generate random numbers for a column
  const generateColumn = (): KraepelinColumn => {
    const numbers = Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * 10)
    );
    const answers = Array(6).fill(null);
    const isCorrect = Array(6).fill(false);
    return { numbers, answers, isCorrect };
  };

  // Handle next page transition
  const goToNextPage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Calculate current page totals
    const currentPageCorrect = columns.reduce(
      (sum, col) => sum + col.isCorrect.filter((correct) => correct).length,
      0
    );
    const currentPageTotal = columns.reduce(
      (sum, col) => sum + col.answers.filter((ans) => ans !== null).length,
      0
    );
    const currentPageIncorrect = currentPageTotal - currentPageCorrect;

    // Update totals
    setTotalCorrect((prev) => prev + currentPageCorrect);
    setTotalIncorrect((prev) => prev + currentPageIncorrect);

    // Generate new columns first
    const newColumns = Array.from({ length: 8 }, () => generateColumn());

    // Update all states at once
    setColumns(newColumns);

    // Reset transition flag and focus after a short delay
    setTimeout(() => {
      setIsTransitioning(false);
      if (inputRefs.current[0] && inputRefs.current[0][0]) {
        inputRefs.current[0][0]?.focus();
      }
    }, 100);
  };

  // Reset game state
  const resetGame = () => {
    setTimer(120);
    setIsActive(false);
    setStartTime(null);
    setTotalCorrect(0);
    setTotalIncorrect(0);
    setShowResults(false);
    const initialColumns = Array.from({ length: 8 }, () => generateColumn());
    setColumns(initialColumns);
  };

  // Initialize the test with 8 columns
  useEffect(() => {
    const initialColumns = Array.from({ length: 8 }, () => generateColumn());
    setColumns(initialColumns);
    // Initialize input refs
    inputRefs.current = Array(8)
      .fill(null)
      .map(() => Array(6).fill(null));
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timer > 0) {
      // Set the start time when timer becomes active
      if (!startTime) {
        setStartTime(Date.now());
      }

      interval = setInterval(() => {
        if (startTime) {
          const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
          const remainingTime = Math.max(120 - elapsedSeconds, 0);
          setTimer(remainingTime);

          if (remainingTime === 0) {
            // When timer reaches 0
            const currentPageCorrect = columns.reduce(
              (sum, col) =>
                sum + col.isCorrect.filter((correct) => correct).length,
              0
            );
            const currentPageTotal = columns.reduce(
              (sum, col) =>
                sum + col.answers.filter((ans) => ans !== null).length,
              0
            );
            const currentPageIncorrect = currentPageTotal - currentPageCorrect;

            setTotalCorrect((prev) => prev + currentPageCorrect);
            setTotalIncorrect((prev) => prev + currentPageIncorrect);
            setShowResults(true);
            setIsActive(false);
            setStartTime(null);
          }
        }
      }, 100); // Update more frequently for smoother display
    }
    return () => clearInterval(interval);
  }, [isActive, timer, startTime, columns]);

  // Handle start button click
  const handleStart = () => {
    resetGame();
    setIsActive(true);
    setStartTime(Date.now());
    setTimeout(() => {
      if (inputRefs.current[0] && inputRefs.current[0][0]) {
        inputRefs.current[0][0]?.focus();
      }
    }, 100);
  };

  // Check if answer is correct
  const checkAnswer = (
    columnIndex: number,
    answerIndex: number,
    answer: number
  ) => {
    const column = columns[columnIndex];
    const sum =
      (column.numbers[answerIndex] + column.numbers[answerIndex + 1]) % 10;
    return sum === answer;
  };

  // Handle answer input
  const handleAnswerChange = (
    columnIndex: number,
    answerIndex: number,
    value: string
  ) => {
    if (isTransitioning || !isActive) return;

    // Only allow numbers and empty string
    if (value !== "" && !/^[0-9]$/.test(value)) return;

    const numValue = value === "" ? null : parseInt(value);

    if (numValue === null || (numValue >= 0 && numValue <= 9)) {
      const isLastInput = columnIndex === 7 && answerIndex === 5;

      setColumns((prev) => {
        const newColumns = [...prev];
        newColumns[columnIndex] = {
          ...newColumns[columnIndex],
          answers: newColumns[columnIndex].answers.map((ans, idx) =>
            idx === answerIndex ? numValue : ans
          ),
          isCorrect: newColumns[columnIndex].isCorrect.map((correct, idx) =>
            idx === answerIndex
              ? numValue !== null
                ? checkAnswer(columnIndex, answerIndex, numValue)
                : false
              : correct
          ),
        };

        if (isLastInput && numValue !== null) {
          const allPreviousFilled = newColumns.every((col, cIndex) =>
            col.answers.every((ans, aIndex) =>
              cIndex < columnIndex ||
              (cIndex === columnIndex && aIndex < answerIndex)
                ? ans !== null
                : true
            )
          );

          if (allPreviousFilled) {
            setTimeout(goToNextPage, 0);
          }
        }

        return newColumns;
      });

      if (numValue !== null && !isTransitioning) {
        if (answerIndex < 5) {
          inputRefs.current[columnIndex][answerIndex + 1]?.focus();
        } else if (columnIndex < 7) {
          inputRefs.current[columnIndex + 1][0]?.focus();
        }
      }
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="max-h-screen w-full flex flex-col">
      {showResults && (
        <ResultsDisplay
          totalCorrect={totalCorrect}
          totalIncorrect={totalIncorrect}
          onTryAgain={handleStart}
        />
      )}

      <div className="flex-1 flex flex-col justify-center items-center bg-white gap-4 py-8">
        <div className="flex gap-4 items-center justify-center w-full max-w-4xl px-4">
          {!isActive && !showResults && (
            <button
              onClick={handleStart}
              className="flex items-center justify-center py-1 bg-[#121212] text-white rounded-xl hover:bg-black/90 transition-colors text-lg font-medium gap-1 min-w-[125px]"
            >
              <Play
                size={18}
                className="text-white"
                fill="currentColor"
                strokeWidth={0}
              />
              Start Test
            </button>
          )}
          {isActive && (
            <div className="w-full flex flex-col items-center gap-2 py-1">
              <div className="w-full max-w-[600px] flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-[#E5E7EB] rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#4096FF] transition-all duration-100"
                    style={{
                      width: `${(timer / 120) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Timer size={20} className="text-[#121212]" />
                  <span className="font-mono text-lg">{formatTime(timer)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex bg-gray-50 p-8 rounded-lg shadow-lg gap-2">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex gap-1">
              {/* Numbers column */}
              <div className="">
                {column.numbers.map((number, numIndex) => (
                  <div
                    key={numIndex}
                    className="h-14 w-14 flex items-center justify-end"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg shadow-sm">
                      <div className="w-8 h-8 flex items-center justify-center text-xl font-medium bg-white border-2 border-gray-300 rounded-md">
                        {number}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Answers column */}
              <div className="py-7">
                {column.answers.map((answer, answerIndex) => (
                  <div
                    key={answerIndex}
                    className="h-14 w-14 flex justify-start items-center"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg shadow-sm">
                      <input
                        ref={(el) => {
                          if (inputRefs.current[colIndex]) {
                            inputRefs.current[colIndex][answerIndex] = el;
                          }
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        autoComplete="off"
                        data-form-type="other"
                        value={answer ?? ""}
                        onChange={(e) =>
                          handleAnswerChange(
                            colIndex,
                            answerIndex,
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {
                          if (/^[0-9]$/.test(e.key)) {
                            e.preventDefault();
                            handleAnswerChange(colIndex, answerIndex, e.key);
                          }
                        }}
                        className={`w-8 h-8 text-center text-xl font-semibold bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4096FF] text-[#4096FF]`}
                        disabled={!isActive}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KraepelinTest;
