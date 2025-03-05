"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveLeaderboardEntry(data: {
  name: string;
  score: number;
  correct: number;
  incorrect: number;
  accuracy: number;
}) {
  try {
    // Ensure clean connection state
    await prisma.$connect();

    // Use a simple create without transaction for better reliability
    const result = await prisma.leaderboardEntry.create({
      data: {
        ...data,
        date: new Date(),
      },
    });

    // Force revalidation of the leaderboard page
    revalidatePath('/leaderboard');
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Error saving leaderboard entry:", error);
    return { success: false, error: "Failed to save score" };
  } finally {
    // Always disconnect to ensure clean state for next request
    await prisma.$disconnect();
  }
}

export async function getLeaderboard(timeRange: "today" | "week" | "month" | "all") {
  try {
    // Ensure clean connection state
    await prisma.$connect();
    
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
      
      return { 
        success: true, 
        data: entries.map(entry => ({
          ...entry,
          date: entry.date.toISOString()
        }))
      };
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
    
    return { 
      success: true, 
      data: entries.map(entry => ({
        ...entry,
        date: entry.date.toISOString()
      }))
    };
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return { success: false, error: "Failed to fetch leaderboard" };
  } finally {
    // Always disconnect to ensure clean state for next request
    await prisma.$disconnect();
  }
}