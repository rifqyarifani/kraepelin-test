"use server";

import { prisma } from "@/lib/prisma";

/**
 * This function is designed to keep the Supabase database active
 * by making a simple query to the database. It should be called
 * periodically (e.g., via a cron job or scheduled task).
 */
export async function keepDatabaseAlive() {
  try {
    // Ensure clean connection state
    await prisma.$connect();
    
    // Make a simple query to keep the database active
    // This query is lightweight and just counts entries
    const count = await prisma.leaderboardEntry.count();
    
    console.log(`Database keep-alive successful. Current entry count: ${count}`);
    
    return { success: true, count };
  } catch (error) {
    console.error("Error in keep-alive function:", error);
    return { success: false, error: "Failed to keep database alive" };
  } finally {
    // Always disconnect to ensure clean state for next request
    await prisma.$disconnect();
  }
} 