import LeaderboardClient from "./leaderboard-client";
import { getLeaderboard } from "@/app/actions/leaderboard";

// Change from force-dynamic to static with revalidation
export const revalidate = 60; // Revalidate every 60 seconds

export default async function LeaderboardPage() {
  const timeRange = "all";
  const response = await getLeaderboard(timeRange);

  if (!response.success || !response.data) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center text-red-500 py-8">
            Failed to load leaderboard. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return <LeaderboardClient initialData={response.data} />;
}
