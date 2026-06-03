export const COLUMNS_PER_PAGE = 8;
export const ANSWERS_PER_COLUMN = 6;
export const NUMBERS_PER_COLUMN = ANSWERS_PER_COLUMN + 1;

export type PauliColumn = {
  numbers: number[];
  answers: (number | null)[];
  isCorrect: boolean[];
};

export function generateColumn(): PauliColumn {
  return {
    numbers: Array.from({ length: NUMBERS_PER_COLUMN }, () =>
      Math.floor(Math.random() * 10)
    ),
    answers: Array(ANSWERS_PER_COLUMN).fill(null),
    isCorrect: Array(ANSWERS_PER_COLUMN).fill(false),
  };
}

export function generatePage(): PauliColumn[] {
  return Array.from({ length: COLUMNS_PER_PAGE }, () => generateColumn());
}

export function checkAnswer(
  column: PauliColumn,
  answerIndex: number,
  answer: number
): boolean {
  return (column.numbers[answerIndex] + column.numbers[answerIndex + 1]) % 10 === answer;
}

export function finalizePage(columns: PauliColumn[]): {
  correct: number;
  incorrect: number;
  score: number;
} {
  let correct = 0;
  let totalAnswered = 0;
  for (const col of columns) {
    for (let i = 0; i < ANSWERS_PER_COLUMN; i++) {
      const ans = col.answers[i];
      if (ans === null || ans === undefined) continue;
      totalAnswered++;
      if (col.isCorrect[i]) correct++;
    }
  }
  const incorrect = totalAnswered - correct;
  return { correct, incorrect, score: correct - incorrect };
}

export type ScoreFromAnswersInput = {
  columns: number[][];
  answers: (number | null)[][];
};

export function scoreFromAnswers({
  columns,
  answers,
}: ScoreFromAnswersInput): {
  correct: number;
  incorrect: number;
  score: number;
  accuracy: number;
} {
  let correct = 0;
  let totalAnswered = 0;
  for (let colIndex = 0; colIndex < columns.length; colIndex++) {
    const column = columns[colIndex];
    const columnAnswers = answers[colIndex] ?? [];
    for (let i = 0; i < ANSWERS_PER_COLUMN; i++) {
      const ans = columnAnswers[i];
      if (ans === null || ans === undefined) continue;
      totalAnswered++;
      if (checkAnswer({ numbers: column, answers: [], isCorrect: [] }, i, ans)) {
        correct++;
      }
    }
  }
  const incorrect = totalAnswered - correct;
  const accuracy = totalAnswered > 0 ? (correct / totalAnswered) * 100 : 0;
  const score = correct - incorrect;
  return { correct, incorrect, score, accuracy };
}

export type PauliTimeOption = 1 | 5 | 15 | 30 | 60;
export const DEFAULT_TIME_OPTIONS: readonly PauliTimeOption[] = [
  1, 5, 15, 30, 60,
] as const;
export const DEFAULT_TIME_MINUTES: PauliTimeOption = 60;

export function formatTime(seconds: number, opts: { padHours?: boolean } = {}): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (opts.padHours || hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}
