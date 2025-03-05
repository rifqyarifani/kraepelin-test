"use server";

import { prisma } from "@/lib/prisma";

export async function saveLeaderboardEntry(data: {
  name: string;
  score: number;
  correct: number;
  incorrect: number;
  accuracy: number;
}) {
  try {
    // Add index hint for better performance
    const result = await prisma.$transaction(async (tx) => {
      const entry = await tx.leaderboardEntry.create({
        data: {
          ...data,
          date: new Date(),
        },
      });
      return entry;
    }, {
      timeout: 10000, // 10 second timeout
      isolationLevel: 'ReadCommitted', // Use a less strict isolation level for better performance
    });
    
    console.log("Successfully saved leaderboard entry:", result.id);
    return result;
  } catch (error) {
    console.error("Error saving leaderboard entry:", error);
    throw new Error("Failed to save your score. Please try again.");
  }
}

export async function getLeaderboard(timeRange: "today" | "week" | "month" | "all") {
  console.log(`Fetching leaderboard for timeRange: ${timeRange}`);
  
  try {
    if (timeRange === "all") {
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
    
    return entries.map(entry => ({
      ...entry,
      date: entry.date.toISOString()
    }));
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw new Error("Failed to fetch leaderboard. Please try again.");
  }
}