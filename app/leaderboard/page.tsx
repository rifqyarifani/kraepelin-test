import { getLeaderboard } from "@/app/actions/leaderboard";
import LeaderboardClient from "./leaderboard-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LeaderboardPage() {
  // Pre-fetch the initial data on the server
  const initialData = await getLeaderboard("all");

  return <LeaderboardClient initialData={initialData} />;
}
