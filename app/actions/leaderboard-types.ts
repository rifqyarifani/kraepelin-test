export type LeaderboardTimeRange = "all" | "today" | "week" | "month";

export type LeaderboardEntryDTO = {
  id: string;
  name: string;
  score: number;
  accuracy: number;
  date: string;
};

export type GetLeaderboardResult =
  | { success: true; data: LeaderboardEntryDTO[] }
  | { success: false; error: string };

export type SaveResult =
  | { success: true; id: string }
  | { success: false; error: string };

export function getStartDateForRange(timeRange: LeaderboardTimeRange): Date | null {
  if (timeRange === "all") return null;
  const now = new Date();
  const start = new Date(now);
  switch (timeRange) {
    case "today":
      start.setHours(0, 0, 0, 0);
      return start;
    case "week":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "month":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}
