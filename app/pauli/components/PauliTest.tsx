"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Timer, ChevronDown } from "lucide-react";
import {
  COLUMNS_PER_PAGE,
  ANSWERS_PER_COLUMN,
  DEFAULT_TIME_OPTIONS,
  DEFAULT_TIME_MINUTES,
  generatePage,
  type PauliColumn,
  type PauliTimeOption,
  checkAnswer,
  formatTime,
} from "@/lib/pauli-game";
import ResultsDisplay from "./ResultsDisplay";

const TICK_MS = 1000;

export default function PauliTest() {
  const [columns, setColumns] = useState<PauliColumn[]>(() => generatePage());
  const [timer, setTimer] = useState<number>(DEFAULT_TIME_MINUTES * 60);
  const [selectedTime, setSelectedTime] =
    useState<PauliTimeOption>(DEFAULT_TIME_MINUTES);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [finalColumns, setFinalColumns] = useState<PauliColumn[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    Array.from({ length: COLUMNS_PER_PAGE }, () =>
      Array(ANSWERS_PER_COLUMN).fill(null)
    )
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const focusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current)
        clearTimeout(transitionTimeoutRef.current);
      if (focusTimeoutRef.current) clearTimeout(focusTimeoutRef.current);
    };
  }, []);

  const goToNextPage = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setColumns((prev) => {
      const next = prev.map((c) => ({
        ...c,
        numbers: Array.from({ length: c.numbers.length }, () =>
          Math.floor(Math.random() * 10)
        ),
        answers: Array(ANSWERS_PER_COLUMN).fill(null),
        isCorrect: Array(ANSWERS_PER_COLUMN).fill(false),
      }));
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        focusTimeoutRef.current = setTimeout(() => {
          inputRefs.current[0]?.[0]?.focus();
        }, 0);
      }, 100);
      return next;
    });
  }, [isTransitioning]);

  const handleStart = useCallback(() => {
    setColumns(generatePage());
    setTimer(selectedTime * 60);
    setShowResults(false);
    setFinalColumns([]);
    setIsActive(true);
    startTimeRef.current = Date.now();
    focusTimeoutRef.current = setTimeout(() => {
      inputRefs.current[0]?.[0]?.focus();
    }, 100);
  }, [selectedTime]);

  useEffect(() => {
    if (!isActive) return;
    startTimeRef.current = Date.now();
    const id = setInterval(() => {
      const start = startTimeRef.current ?? Date.now();
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = Math.max(selectedTime * 60 - elapsed, 0);
      setTimer(remaining);
      if (remaining === 0) {
        setColumns((latest) => {
          setFinalColumns(latest);
          return latest;
        });
        setShowResults(true);
        setIsActive(false);
        startTimeRef.current = null;
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [isActive, selectedTime]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAnswerChange = (
    columnIndex: number,
    answerIndex: number,
    value: string
  ) => {
    if (isTransitioning || !isActive) return;
    if (value !== "" && !/^[0-9]$/.test(value)) return;

    const numValue = value === "" ? null : parseInt(value, 10);
    if (numValue === null || (numValue >= 0 && numValue <= 9)) {
      const isLastInput =
        columnIndex === COLUMNS_PER_PAGE - 1 &&
        answerIndex === ANSWERS_PER_COLUMN - 1;

      setColumns((prev) => {
        const newColumns = [...prev];
        const current = newColumns[columnIndex];
        newColumns[columnIndex] = {
          ...current,
          answers: current.answers.map((ans, idx) =>
            idx === answerIndex ? numValue : ans
          ),
          isCorrect: current.isCorrect.map((correct, idx) =>
            idx === answerIndex
              ? numValue !== null
                ? checkAnswer(current, answerIndex, numValue)
                : false
              : correct
          ),
        };
        return newColumns;
      });

      if (numValue !== null) {
        if (answerIndex < ANSWERS_PER_COLUMN - 1) {
          inputRefs.current[columnIndex][answerIndex + 1]?.focus();
        } else if (columnIndex < COLUMNS_PER_PAGE - 1) {
          inputRefs.current[columnIndex + 1][0]?.focus();
        } else if (isLastInput) {
          setTimeout(goToNextPage, 0);
        }
      }
    }
  };

  return (
    <div className="max-h-screen w-full flex flex-col">
      {showResults && (
        <ResultsDisplay columns={finalColumns} onTryAgain={handleStart} />
      )}

      <div className="flex-1 flex flex-col justify-center items-center bg-white gap-4 py-8">
        <div className="flex gap-4 items-center justify-center w-full max-w-5xl mx-auto px-4">
          {!isActive && !showResults && (
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-between gap-2 py-2 px-4 bg-white border border-gray-300 rounded-xl text-gray-800 text-lg font-medium min-w-[120px]"
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                >
                  {selectedTime} mnt
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 w-full"
                    role="listbox"
                  >
                    {DEFAULT_TIME_OPTIONS.map((time) => (
                      <div
                        key={time}
                        className={`px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors ${
                          time === selectedTime ? "bg-gray-100 font-medium" : ""
                        }`}
                        onClick={() => {
                          setSelectedTime(time);
                          setTimer(time * 60);
                          setDropdownOpen(false);
                        }}
                        role="option"
                        aria-selected={time === selectedTime}
                      >
                        {time} mnt
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleStart}
                className="flex items-center justify-center py-2 px-5 bg-ink text-white rounded-xl hover:bg-black/90 transition-colors text-lg font-medium gap-1.5 min-w-[125px]"
              >
                <Play
                  size={18}
                  className="text-white"
                  fill="currentColor"
                  strokeWidth={0}
                />
                Mulai Tes
              </button>
            </div>
          )}
          {isActive && (
            <div className="w-full flex flex-col items-center gap-2 py-[9px]">
              <div className="w-full max-w-[600px] flex items-center gap-3">
                <div
                  className="flex-1 h-2.5 bg-border-soft rounded-full relative overflow-hidden"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={selectedTime * 60}
                  aria-valuenow={timer}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-brand transition-all duration-1000 ease-linear"
                    style={{
                      width: `${(timer / (selectedTime * 60)) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Timer size={20} className="text-ink" />
                  <span
                    className="font-mono text-lg"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {formatTime(timer)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex bg-gray-50 p-8 rounded-lg shadow-lg gap-2">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex gap-1">
              <div>
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
              <div className="py-7">
                {column.answers.map((answer, answerIndex) => (
                  <div
                    key={answerIndex}
                    className="h-14 w-14 flex justify-start items-center"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg shadow-sm">
                      <input
                        ref={(el) => {
                          inputRefs.current[colIndex][answerIndex] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        autoComplete="off"
                        data-form-type="other"
                        id={`answer-${colIndex}-${answerIndex}`}
                        name={`answer-${colIndex}-${answerIndex}`}
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
                        aria-label={`Jawaban kolom ${colIndex + 1} baris ${
                          answerIndex + 1
                        }`}
                        className={`w-8 h-8 text-center text-xl font-semibold bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-brand`}
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
}
