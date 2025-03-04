"use server";

import { prisma } from "@/lib/prisma";

export async function checkTopScore(score: number): Promise<boolean> {
  try {
    const count = await prisma.leaderboardEntry.count({
      where: {
        score: {
          gt: score,
        },
      },
    });

    return count < 100;
  } catch (error) {
    console.error("Error checking top score:", error);
    return false;
  }
}

export async function saveLeaderboardEntry(data: {
  name: string;
  score: number;
  correct: number;
  incorrect: number;
  accuracy: number;
}) {
  try {
    return await prisma.leaderboardEntry.create({
      data: {
        ...data,
        date: new Date(),
      },
    });
  } catch (error) {
    console.error("Error saving leaderboard entry:", error);
    throw new Error("Failed to save your score. Please try again.");
  }
}

export async function getLeaderboard(timeRange: "today" | "week" | "month" | "all") {
  try {
    const startDate = new Date();

    switch (timeRange) {
      case "today":
        // Start from 00:00:00 today
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        // Start from previous Monday 00:00:00
        const day = startDate.getDay();
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
        startDate.setDate(diff);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "month":
        // Start from 1st of current month 00:00:00
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "all":
        return await prisma.leaderboardEntry.findMany({
          orderBy: { score: "desc" },
          take: 100,
        });
    }

    return await prisma.leaderboardEntry.findMany({
      where: {
        date: {
          gte: startDate,
        },
      },
      orderBy: { score: "desc" },
      take: 100,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw new Error("Failed to load leaderboard. Please try again.");
  }
} 