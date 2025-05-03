"use client";

import { memo, useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";
import { useRef } from "react";

type LeaderboardEntry = {
  id: string;
  name: string;
  score: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  date: string;
  rank: number;
  medal: string | null;
};

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
}

function LeaderboardTable({ data }: LeaderboardTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState(data);

  // Smoothly update entries when data changes
  useEffect(() => {
    setEntries(data);
  }, [data]);

  const rowVirtualizer = useVirtualizer({
    count: entries.length || 1, // Always have at least 1 item to show "No entries found"
    getScrollElement: () => parentRef.current,
    estimateSize: () => 65, // approximate row height
    overscan: 5,
  });

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-500 text-sm">
        <div>Rank</div>
        <div>Name</div>
        <div>Score</div>
        <div>Accuracy</div>
        <div>Date</div>
      </div>

      {entries.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-500">
          No entries found
        </div>
      ) : (
        <div
          ref={parentRef}
          className="overflow-auto"
          style={{ height: "calc(100vh - 300px)", maxHeight: "600px" }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow: VirtualItem) => {
              const entry = entries[virtualRow.index];

              // Make sure we have entries to display
              if (!entry) return null;

              return (
                <div
                  key={entry.id}
                  className="grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors absolute w-full animate-fadeIn"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                        entry.medal
                          ? entry.medal === "🥇"
                            ? "bg-[#FEF9C3] text-[#854D0E]"
                            : entry.medal === "🥈"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-[#FEF3F2] text-[#B42318]"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {entry.rank}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{entry.name}</span>
                  </div>
                  <div className="text-[#2563EB] font-semibold">
                    {entry.score}
                  </div>
                  <div>{entry.accuracy.toFixed(2)}%</div>
                  <div className="text-gray-500 flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 5.33333V8L9.33333 9.33333M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
                        stroke="#6B7280"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {formatDate(entry.date)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(LeaderboardTable);
