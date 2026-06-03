"use client";

import { memo, useRef } from "react";
import { Clock } from "lucide-react";
import { formatDate, formatPercent } from "@/lib/utils";
import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";

export type LeaderboardRow = {
  id: string;
  name: string;
  score: number;
  accuracy: number;
  date: string;
  rank: number;
  medal: string | null;
};

interface LeaderboardTableProps {
  data: LeaderboardRow[];
}

function LeaderboardTable({ data }: LeaderboardTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 65,
    overscan: 5,
  });

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="hidden sm:grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-500 text-sm">
        <div>Peringkat</div>
        <div>Nama</div>
        <div>Skor</div>
        <div>Ketelitian</div>
        <div>Tanggal</div>
      </div>

      <div className="sm:hidden px-4 py-3 bg-gray-50 border-b border-gray-200 font-medium text-gray-500 text-sm">
        Papan Peringkat
      </div>

      {data.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-500">
          Belum ada data
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
              const entry = data[virtualRow.index];
              if (!entry) return null;

              return (
                <div
                  key={entry.id}
                  className="absolute w-full"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="hidden sm:grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                          entry.medal
                            ? entry.medal === "🥇"
                              ? "bg-gold-bg text-gold-fg"
                              : entry.medal === "🥈"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-bronze-bg text-bronze-fg"
                            : "bg-gray-50 text-gray-600"
                        }`}
                      >
                        {entry.rank}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.name}</span>
                    </div>
                    <div className="text-score font-semibold">
                      {entry.score}
                    </div>
                    <div>{formatPercent(entry.accuracy)}</div>
                    <div className="text-gray-500 flex items-center gap-2">
                      <Clock size={16} aria-hidden="true" className="text-gray-500" />
                      {formatDate(entry.date)}
                    </div>
                  </div>

                  <div className="sm:hidden px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                            entry.medal
                              ? entry.medal === "🥇"
                                ? "bg-gold-bg text-gold-fg"
                                : entry.medal === "🥈"
                                ? "bg-gray-100 text-gray-600"
                                : "bg-bronze-bg text-bronze-fg"
                              : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {entry.rank}
                        </div>
                        <span className="font-medium">{entry.name}</span>
                      </div>
                        <div className="text-score font-semibold">
                          {entry.score}
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div>{formatPercent(entry.accuracy)} ketelitian</div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} aria-hidden="true" className="text-gray-500" />
                        {formatDate(entry.date)}
                      </div>
                    </div>
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
