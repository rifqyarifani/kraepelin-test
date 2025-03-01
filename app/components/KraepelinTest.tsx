"use client";

import React, { useState, useEffect, useRef } from "react";

interface KraepelinColumn {
  numbers: number[];
  answers: (number | null)[];
  isCorrect: boolean[];
}

const KraepelinTest: React.FC = () => {
  const [columns, setColumns] = useState<KraepelinColumn[]>([]);
  const [timer, setTimer] = useState<number>(60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
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

  // Check if all inputs in current page are filled
  const checkAllInputsFilled = () => {
    return columns.every((column) =>
      column.answers.every((answer) => answer !== null)
    );
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
    setCurrentPage((prev) => prev + 1);

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
    setTimer(60);
    setIsActive(false);
    setStartTime(null);
    setCurrentPage(1);
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
          const remainingTime = Math.max(60 - elapsedSeconds, 0);
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
    if (isTransitioning) return;

    const numValue = value === "" ? null : parseInt(value.slice(-1));

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
    <div className="min-h-screen w-full flex flex-col">
      <div className="p-4 flex justify-between items-center bg-gray-800 text-white">
        <h1 className="text-2xl font-bold">Kraepelin Test</h1>
        <div className="flex gap-4 items-center">
          <div className="text-xl font-mono">{formatTime(timer)}</div>
          <button
            onClick={handleStart}
            disabled={isActive}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 hover:bg-blue-600 transition-colors"
          >
            Start
          </button>
        </div>
      </div>

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Time's Up!</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-100 rounded">
                <span className="font-medium text-green-800">
                  Total Correct:
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {totalCorrect}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-100 rounded">
                <span className="font-medium text-red-800">
                  Total Incorrect:
                </span>
                <span className="text-2xl font-bold text-red-600">
                  {totalIncorrect}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-100 rounded">
                <span className="font-medium text-blue-800">Accuracy:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {totalCorrect + totalIncorrect > 0
                    ? Math.round(
                        (totalCorrect / (totalCorrect + totalIncorrect)) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
            <button
              onClick={handleStart}
              className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex justify-center items-center bg-gray-100">
        <div className="flex bg-white p-8 rounded-lg shadow-lg">
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
                        className={`w-8 h-8 text-center text-xl font-semibold bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 text-blue-600`}
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
