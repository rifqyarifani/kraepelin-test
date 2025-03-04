import { prisma } from './prisma';

interface Answer {
  isCorrect: boolean;
  timestamp: number; // milliseconds since test start
}

export class TestTracker {
  private answers: Answer[] = [];
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  addAnswer(isCorrect: boolean) {
    this.answers.push({
      isCorrect,
      timestamp: Date.now() - this.startTime,
    });
  }

  private getTimeSegments() {
    const segments: { correctCount: number; mistakeCount: number }[] = [];
    const segmentDuration = 30 * 1000; // 30 seconds in milliseconds

    for (let i = 0; i < Math.ceil(this.getDuration() / 30); i++) {
      const segmentStart = i * segmentDuration;
      const segmentEnd = (i + 1) * segmentDuration;

      const segmentAnswers = this.answers.filter(
        (answer) => answer.timestamp >= segmentStart && answer.timestamp < segmentEnd
      );

      segments.push({
        correctCount: segmentAnswers.filter((a) => a.isCorrect).length,
        mistakeCount: segmentAnswers.filter((a) => !a.isCorrect).length,
      });
    }

    return segments;
  }

  getDuration() {
    return Math.floor((Date.now() - this.startTime) / 1000); // duration in seconds
  }

  async saveResults(name: string) {
    const segments = this.getTimeSegments();
    const totalCorrect = segments.reduce((sum, seg) => sum + seg.correctCount, 0);
    const totalIncorrect = segments.reduce((sum, seg) => sum + seg.mistakeCount, 0);
    const accuracy = totalCorrect + totalIncorrect > 0 ? (totalCorrect / (totalCorrect + totalIncorrect)) * 100 : 0;
    const score = totalCorrect * 10 - totalIncorrect * 5;

    return prisma.leaderboardEntry.create({
      data: {
        name,
        score,
        correct: totalCorrect,
        incorrect: totalIncorrect,
        accuracy,
      },
    });
  }
} 