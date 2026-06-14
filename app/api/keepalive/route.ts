import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("leaderboard_entries")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Supabase keepalive failed:", error);
    return NextResponse.json(
      { ok: false, error: "Keepalive failed" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { ok: true, checkedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
