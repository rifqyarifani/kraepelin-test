"use client";

import { useState, useMemo, useCallback } from "react";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";

// Lazy load the LeaderboardTable component
const LeaderboardTable = dynamic(() => import("./leaderboard-table"), {
  loading: () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  ),
  ssr: true,
});

type DbLeaderboardEntry = {
  id: string;
  name: string;
  score: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  date: string;
};

type LeaderboardEntry = DbLeaderboardEntry & {
  rank: number;
  medal: string | null;
};

interface LeaderboardClientProps {
  initialData: DbLeaderboardEntry[];
}

export default function LeaderboardClient({
  initialData,
}: LeaderboardClientProps) {
  // Process data once when component mounts
  const entries = useMemo(() => {
    return initialData.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      medal: index < 3 ? ["🥇", "🥈", "🥉"][index] : null,
    }));
  }, [initialData]);

  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize filtered data to prevent unnecessary recalculations
  const filteredData = useMemo(() => {
    return entries.filter((entry) =>
      entry.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [entries, searchQuery]) as LeaderboardEntry[];

  // Memoize search handler
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Search input */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchQuery}
            onChange={handleSearch}
            disabled={loading}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Leaderboard table */}
        {!loading && !error && <LeaderboardTable data={filteredData} />}
      </div>
    </div>
  );
}
