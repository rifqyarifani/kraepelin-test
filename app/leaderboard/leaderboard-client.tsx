"use client";

import { useState, useRef } from "react";
import { Search } from "lucide-react";
import { getLeaderboard } from "@/app/actions/leaderboard";
import { formatDate } from "@/lib/utils";

type TimeRange = "Today" | "This Week" | "This Month" | "All Time";

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
  const [entries, setEntries] = useState<LeaderboardEntry[]>(
    initialData.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      medal: index < 3 ? ["🥇", "🥈", "🥉"][index] : null,
    }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("All Time");
  const [searchQuery, setSearchQuery] = useState("");
  const cache = useRef<
    Record<string, { data: LeaderboardEntry[]; timestamp: number }>
  >({});

  const CACHE_DURATION = 60 * 1000; // 60 seconds

  const fetchData = async (timeRange: string) => {
    // Check cache first
    const now = Date.now();
    const cachedData = cache.current[timeRange];
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      setEntries(cachedData.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getLeaderboard(
        timeRange as "all" | "today" | "week" | "month"
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch leaderboard");
      }

      const entriesWithRankAndMedals = response.data.map((entry, index) => ({
        ...entry,
        rank: index + 1,
        medal: index < 3 ? ["🥇", "🥈", "🥉"][index] : null,
      }));

      // Update cache
      cache.current[timeRange] = {
        data: entriesWithRankAndMedals,
        timestamp: Date.now(),
      };

      setEntries(entriesWithRankAndMedals);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError("Failed to load leaderboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRangeChange = async (range: TimeRange) => {
    setTimeRange(range);
    const timeRange =
      range === "All Time"
        ? "all"
        : range === "This Week"
        ? "week"
        : range === "This Month"
        ? "month"
        : "today";

    await fetchData(timeRange);
  };

  const timeRanges: TimeRange[] = [
    "Today",
    "This Week",
    "This Month",
    "All Time",
  ];

  const filteredData = entries.filter((entry) =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Time range tabs */}
        <div className="bg-gray-50 p-1 rounded-lg inline-flex">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => handleRangeChange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-sm pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Leaderboard table */}
        <div className="bg-white rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 text-sm font-medium text-gray-600">
            <div>Rank</div>
            <div>User</div>
            <div>Score</div>
            <div>Accuracy</div>
            <div>Date</div>
          </div>

          {/* Table body */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="px-6 py-8 text-center text-gray-500">
                Loading...
              </div>
            ) : error ? (
              <div className="px-6 py-8 text-center text-red-500">
                {error}
                <button
                  onClick={() => handleRangeChange(timeRange)}
                  className="block mx-auto mt-2 text-sm text-blue-500 hover:text-blue-600"
                >
                  Try Again
                </button>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No entries found
              </div>
            ) : (
              filteredData.map((entry) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {entry.medal && (
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold ${
                          entry.medal === "🥇"
                            ? "bg-[#FEF9C3] text-[#854D0E]"
                            : entry.medal === "🥈"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-[#FEF3F2] text-[#B42318]"
                        }`}
                      >
                        {entry.rank}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{entry.name}</span>
                  </div>
                  <div className="text-[#2563EB] font-semibold">
                    {entry.score}
                  </div>
                  <div>{entry.accuracy.toFixed(1)}%</div>
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
