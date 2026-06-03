"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import {
  scoreFromAnswers,
  COLUMNS_PER_PAGE,
  ANSWERS_PER_COLUMN,
  NUMBERS_PER_COLUMN,
} from "@/lib/pauli-game";
import {
  getStartDateForRange,
  type GetLeaderboardResult,
  type LeaderboardEntryDTO,
  type LeaderboardTimeRange,
  type SaveResult,
} from "./leaderboard-types";

const TABLE = "leaderboard_entries";
const SELECT = "id, name, score, accuracy, created_at";

const MAX_NAME = 30;
const NAME_REGEX = /^[\p{L}\p{N}\p{Zs}._'-]+$/u;

type ValidatedPayload = {
  name: string;
  columns: number[][];
  answers: (number | null)[][];
};

function isDigit(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= 9;
}

function validatePayload(
  data: unknown
):
  | { ok: true; value: ValidatedPayload }
  | { ok: false; error: string } {
  if (!data || typeof data !== "object") {
    return { ok: false, error: "Input tidak valid." };
  }
  const d = data as Record<string, unknown>;

  const name = typeof d.name === "string" ? d.name.trim() : "";
  if (!name || name.length > MAX_NAME || !NAME_REGEX.test(name)) {
    return { ok: false, error: "Nama tidak valid." };
  }

  if (!Array.isArray(d.columns) || d.columns.length !== COLUMNS_PER_PAGE) {
    return { ok: false, error: "Data kolom tidak valid." };
  }
  for (const col of d.columns) {
    if (!Array.isArray(col) || col.length !== NUMBERS_PER_COLUMN) {
      return { ok: false, error: "Data kolom tidak valid." };
    }
    for (const n of col) {
      if (!isDigit(n)) return { ok: false, error: "Data kolom tidak valid." };
    }
  }

  if (!Array.isArray(d.answers) || d.answers.length !== COLUMNS_PER_PAGE) {
    return { ok: false, error: "Data jawaban tidak valid." };
  }
  for (const row of d.answers) {
    if (!Array.isArray(row) || row.length !== ANSWERS_PER_COLUMN) {
      return { ok: false, error: "Data jawaban tidak valid." };
    }
    for (const a of row) {
      if (a !== null && !isDigit(a)) {
        return { ok: false, error: "Data jawaban tidak valid." };
      }
    }
  }

  return {
    ok: true,
    value: {
      name,
      columns: d.columns as number[][],
      answers: d.answers as (number | null)[][],
    },
  };
}

export async function saveLeaderboardEntry(
  data: unknown
): Promise<SaveResult> {
  const v = validatePayload(data);
  if (!v.ok) return { success: false, error: v.error };

  const { correct, incorrect, score, accuracy } = scoreFromAnswers({
    columns: v.value.columns,
    answers: v.value.answers,
  });

  const maxScore = COLUMNS_PER_PAGE * ANSWERS_PER_COLUMN;
  if (Math.abs(score) > maxScore) {
    return { success: false, error: "Skor di luar batas." };
  }

  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from(TABLE)
    .insert({
      name: v.value.name,
      score,
      correct,
      incorrect,
      accuracy,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error saving leaderboard entry:", error);
    return { success: false, error: "Gagal menyimpan skor." };
  }

  revalidatePath("/leaderboard");
  return { success: true, id: row.id as string };
}

export const getLeaderboard = cache(
  async (
    timeRange: LeaderboardTimeRange,
    limit: number = 100
  ): Promise<GetLeaderboardResult> => {
    const supabase = await createClient();
    let query = supabase.from(TABLE).select(SELECT);
    if (timeRange !== "all") {
      const startDate = getStartDateForRange(timeRange);
      if (startDate) query = query.gte("created_at", startDate.toISOString());
    }
    const { data, error } = await query
      .order("score", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching leaderboard:", error);
      return { success: false, error: "Gagal memuat papan peringkat." };
    }

    const rows: LeaderboardEntryDTO[] = (data ?? []).map(
      (entry: {
        id: string;
        name: string;
        score: number;
        accuracy: number;
        created_at: string;
      }) => ({
        id: entry.id,
        name: entry.name,
        score: entry.score,
        accuracy: entry.accuracy,
        date: entry.created_at,
      })
    );

    return { success: true, data: rows };
  }
);
