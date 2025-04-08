import { NextResponse } from "next/server";
import { keepDatabaseAlive } from "@/app/actions/keep-alive";

// This route can be called by an external service (like UptimeRobot)
// to keep the database active and prevent it from being paused
export async function GET() {
  try {
    const result = await keepDatabaseAlive();
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to keep database alive" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Database keep-alive successful",
      count: result.count
    });
  } catch (error) {
    console.error("Error in keep-alive API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 