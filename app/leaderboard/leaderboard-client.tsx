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

    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
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
        break; // Success, exit the retry loop
      } catch (error) {
        console.error(`Attempt ${retryCount + 1} failed:`, error);

        if (retryCount === maxRetries - 1) {
          setError("Failed to load leaderboard. Please try again.");
          throw error;
        }

        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
      }
    }

    setLoading(false);
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
      <div className="max-w-5xl mx-auto">
        {/* Time range filters */}
        <div className="flex gap-4 mb-8 bg-gray-100 p-4 rounded-lg">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => handleRangeChange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
              disabled={loading}
            >
              {range}
            </button>
          ))}
        </div>

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
            onChange={(e) => setSearchQuery(e.target.value)}
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
                <button
                  onClick={() => handleRangeChange(timeRange)}
                  className="mt-2 text-sm text-red-600 hover:text-red-500"
                >
                  Try again
                </button>
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
        {!loading && !error && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-500 text-sm">
              <div>Rank</div>
              <div>Name</div>
              <div>Score</div>
              <div>Accuracy</div>
              <div>Date</div>
            </div>

            {filteredData.length === 0 ? (
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
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
