import type { Metadata } from "next";
import LeaderboardClient from "./leaderboard-client";
import { getLeaderboard } from "@/app/actions/leaderboard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Papan Peringkat — Tes Pauli",
  description: "Lihat skor tertinggi dari seluruh pemain Tes Pauli.",
};

export default async function LeaderboardPage() {
  const response = await getLeaderboard("all");

  if (!response.success) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center text-red-500 py-8">
            {response.error}
          </div>
        </div>
      </div>
    );
  }

  return <LeaderboardClient initialData={response.data} />;
}
