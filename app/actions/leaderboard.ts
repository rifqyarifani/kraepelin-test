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
  console.log(`Fetching leaderboard for timeRange: ${timeRange}`);
  
  try {
    if (timeRange === "all") {
      console.log("Fetching all-time leaderboard entries");
      const entries = await prisma.leaderboardEntry.findMany({
        orderBy: { score: "desc" },
        take: 100,
      });
      
      console.log(`Found ${entries.length} entries for all-time leaderboard`);
      
      // Convert Date objects to ISO strings for serialization
      return entries.map(entry => ({
        ...entry,
        date: entry.date.toISOString()
      }));
    }
    
    const now = new Date();
    let startDate = new Date(now);
    
    switch (timeRange) {
      case "today":
        // Start from 00:00:00 today
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        // Go back 7 days
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        // Go back 30 days
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    console.log(`Fetching entries since ${startDate.toISOString()} for ${timeRange} leaderboard`);
    
    const entries = await prisma.leaderboardEntry.findMany({
      where: {
        date: {
          gte: startDate,
        },
      },
      orderBy: { score: "desc" },
      take: 100,
    });
    
    console.log(`Found ${entries.length} entries for ${timeRange} leaderboard`);
    
    // Convert Date objects to ISO strings for serialization
    return entries.map(entry => ({
      ...entry,
      date: entry.date.toISOString()
    }));
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    // Return empty array instead of throwing to prevent server errors
    return [];
  }
}