"use client";

import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import type { LeaderboardEntryDTO } from "@/app/actions/leaderboard-types";
import LeaderboardTable, { type LeaderboardRow } from "./leaderboard-table";

interface LeaderboardClientProps {
  initialData: LeaderboardEntryDTO[];
}

export default function LeaderboardClient({
  initialData,
}: LeaderboardClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const entries: LeaderboardRow[] = initialData.map((entry, index) => ({
    id: entry.id,
    name: entry.name,
    score: entry.score,
    accuracy: entry.accuracy,
    date: entry.date,
    rank: index + 1,
    medal: index < 3 ? (["🥇", "🥈", "🥉"] as const)[index] : null,
  }));

  const filteredData = entries.filter((entry) =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="relative mb-6 sm:mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="search"
            placeholder="Cari berdasarkan nama..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            value={searchQuery}
            onChange={handleSearch}
            aria-label="Cari pemain"
          />
        </div>

        <LeaderboardTable data={filteredData} />
      </div>
    </div>
  );
}
