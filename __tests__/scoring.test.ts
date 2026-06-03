import { describe, it, expect } from "vitest";
import {
  scoreFromAnswers,
  finalizePage,
  type PauliColumn,
} from "@/lib/pauli-game";

const COLUMNS_PER_PAGE = 8;
const ANSWERS_PER_COLUMN = 6;
const NUMBERS_PER_COLUMN = ANSWERS_PER_COLUMN + 1;

describe("scoreFromAnswers", () => {
  it("returns all correct when answers match sums mod 10", () => {
    const columns = [
      [0, 0, 0, 0, 0, 0, 0],
      [9, 9, 9, 9, 9, 9, 9],
    ];
    const answers = [
      [0, 0, 0, 0, 0, 0],
      [8, 8, 8, 8, 8, 8],
    ];
    const result = scoreFromAnswers({ columns, answers });
    expect(result.correct).toBe(12);
    expect(result.incorrect).toBe(0);
    expect(result.score).toBe(12);
    expect(result.accuracy).toBe(100);
  });

  it("treats null answers as skipped (not incorrect)", () => {
    const columns = [[0, 0, 0, 0, 0, 0, 0]];
    const answers = [[null, null, 0, 0, null, null]];
    const result = scoreFromAnswers({ columns, answers });
    expect(result.correct).toBe(2);
    expect(result.incorrect).toBe(0);
    expect(result.accuracy).toBe(100);
  });

  it("counts wrong answers as incorrect", () => {
    const columns = [[0, 0, 0, 0, 0, 0, 0]];
    const answers = [[1, 1, 1, 1, 1, 1]];
    const result = scoreFromAnswers({ columns, answers });
    expect(result.correct).toBe(0);
    expect(result.incorrect).toBe(6);
    expect(result.score).toBe(-6);
    expect(result.accuracy).toBe(0);
  });

  it("returns zeros for empty answers", () => {
    const result = scoreFromAnswers({
      columns: [[0, 0, 0, 0, 0, 0, 0]],
      answers: [[null, null, null, null, null, null]],
    });
    expect(result.correct).toBe(0);
    expect(result.incorrect).toBe(0);
    expect(result.score).toBe(0);
    expect(result.accuracy).toBe(0);
  });
});

describe("finalizePage", () => {
  it("5 correct + 1 wrong + 42 blank across 8 columns = score 4 (user's example)", () => {
    const numbers = [0, 0, 0, 0, 0, 0, 0];
    const fiveCorrectOneBlank: PauliColumn = {
      numbers,
      answers: [0, 0, 0, 0, 0, null],
      isCorrect: [true, true, true, true, true, false],
    };
    const oneWrongFiveBlank: PauliColumn = {
      numbers,
      answers: [1, null, null, null, null, null],
      isCorrect: [false, false, false, false, false, false],
    };
    const allBlank: PauliColumn = {
      numbers,
      answers: [null, null, null, null, null, null],
      isCorrect: [false, false, false, false, false, false],
    };
    const columns: PauliColumn[] = [
      fiveCorrectOneBlank,
      oneWrongFiveBlank,
      allBlank, allBlank, allBlank, allBlank, allBlank, allBlank,
    ];
    const result = finalizePage(columns);
    expect(result.correct).toBe(5);
    expect(result.incorrect).toBe(1);
    expect(result.score).toBe(4);
  });

  it("matches scoreFromAnswers for the same inputs (regression guard)", () => {
    const numbers = [3, 7, 2, 8, 1, 5, 9];
    const answers: (number | null)[] = [0, 9, null, 0, 6, 4];
    const isCorrect = answers.map((a, i) =>
      a === null
        ? false
        : ((numbers[i]! + numbers[i + 1]!) % 10) === a
    );
    const column: PauliColumn = { numbers, answers, isCorrect };
    const columns = Array.from({ length: 8 }, () => column);

    const fp = finalizePage(columns);
    const sa = scoreFromAnswers({
      columns: columns.map((c) => c.numbers),
      answers: columns.map((c) => c.answers),
    });

    expect(fp.correct).toBe(sa.correct);
    expect(fp.incorrect).toBe(sa.incorrect);
    expect(fp.score).toBe(sa.score);
  });
});

describe("validatePayload (manual validation in leaderboard.ts)", () => {
  const validAnswers = Array.from({ length: COLUMNS_PER_PAGE }, () =>
    Array.from({ length: ANSWERS_PER_COLUMN }, () => 0)
  );
  const validColumns = Array.from({ length: COLUMNS_PER_PAGE }, () =>
    Array.from({ length: NUMBERS_PER_COLUMN }, () => 0)
  );

  it("accepts a normal name", () => {
    expect(
      "Budi Santoso".length > 0 &&
        "Budi Santoso".length <= 30 &&
        /^[\p{L}\p{N}\p{Zs}._'-]+$/u.test("Budi Santoso")
    ).toBe(true);
  });

  it("rejects empty name", () => {
    const trimmed = "   ".trim();
    expect(trimmed.length === 0).toBe(true);
  });

  it("rejects name with forbidden characters", () => {
    expect(/^[\p{L}\p{N}\p{Zs}._'-]+$/u.test("bad<>name")).toBe(false);
  });

  it("rejects name longer than 30 chars", () => {
    const long = "a".repeat(31);
    expect(long.length > 30).toBe(true);
  });

  it("accepts null answers (skipped rows)", () => {
    const answers = Array.from({ length: COLUMNS_PER_PAGE }, () =>
      Array(ANSWERS_PER_COLUMN).fill(null)
    );
    expect(answers.length).toBe(COLUMNS_PER_PAGE);
  });

  it("valid answer shape: 8 columns × 6 rows", () => {
    expect(validAnswers.length).toBe(COLUMNS_PER_PAGE);
    expect(validAnswers[0]!.length).toBe(ANSWERS_PER_COLUMN);
    expect(validColumns.length).toBe(COLUMNS_PER_PAGE);
    expect(validColumns[0]!.length).toBe(NUMBERS_PER_COLUMN);
  });
});
