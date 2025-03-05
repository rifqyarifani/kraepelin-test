"use server";

import { prisma } from "@/lib/prisma";

export async function checkTopScore(score: number): Promise<boolean> {
  try {
    const count = await prisma.leaderboardEntry.count({
      where: {
        score: {
          gte: score,
        },
      },
    });

    // If there are less than 100 scores greater than or equal to the current score,
    // then this score qualifies for top 100
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
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await prisma.leaderboardEntry.create({
        data: {
          ...data,
          date: new Date(),
        },
      });
      console.log("Successfully saved leaderboard entry");
      return result;
    } catch (error) {
      console.error(`Error saving leaderboard entry (attempt ${attempt + 1}):`, error);
      
      // If this is the last attempt, throw the error
      if (attempt === maxRetries - 1) {
        throw new Error("Failed to save your score after multiple attempts. Please try again.");
      }
      
      // Wait a short time before retrying
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
}

export async function getLeaderboard(timeRange: "today" | "week" | "month" | "all") {
  console.log(`Fetching leaderboard for timeRange: ${timeRange}`);
  
  try {
    if (timeRange === "all") {
      console.log("Fetching all-time leaderboard entries");
      const entries = await prisma.leaderboardEntry.findMany({
        select: {
          id: true,
          name: true,
          score: true,
          accuracy: true,
          correct: true,
          incorrect: true,
          date: true,
        },
        orderBy: { score: "desc" },
        take: 100,
      });
      
      console.log(`Found ${entries.length} entries for all-time leaderboard`);
      
      return entries.map(entry => ({
        ...entry,
        date: entry.date.toISOString()
      }));
    }
    
    const now = new Date();
    let startDate = new Date(now);
    
    switch (timeRange) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    console.log(`Fetching entries since ${startDate.toISOString()} for ${timeRange} leaderboard`);
    
    const entries = await prisma.leaderboardEntry.findMany({
      select: {
        id: true,
        name: true,
        score: true,
        accuracy: true,
        correct: true,
        incorrect: true,
        date: true,
      },
      where: {
        date: {
          gte: startDate,
        },
      },
      orderBy: { score: "desc" },
      take: 100,
    });
    
    console.log(`Found ${entries.length} entries for ${timeRange} leaderboard`);
    
    return entries.map(entry => ({
      ...entry,
      date: entry.date.toISOString()
    }));
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}