// filepath: /Users/rifqyarifani/Public/Programming/Pauli/pages/index.tsx
import Link from "next/link";
import { Play } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-68px)] bg-white overflow-hidden flex flex-col items-center justify-center px-4">
      <div className="max-w-6xl w-full text-center">
        {/* Badge */}
        <div className="inline-block bg-gray-100 rounded-full px-4 py-2 mb-8">
          <span className="text-gray-800 font-medium">
            Practice Makes Perfect
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Master the <span className="text-[#4096FF]">Pauli-Kraepelin</span>
          <br />
          Test
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          Enhance your concentration, speed, and accuracy with our interactive
          test platform. Practice regularly and track your progress.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/kraepelin"
            className="inline-flex items-center justify-center px-6 py-4 bg-[#121212] text-white rounded-xl hover:bg-black/90 transition-colors text-lg font-medium gap-2.5 min-w-[180px]"
          >
            <Play
              size={18}
              className="text-white"
              fill="currentColor"
              strokeWidth={0}
            />
            Start Test
          </Link>
          <Link
            href="/leaderboard"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-black border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium"
          >
            View Leaderboard
          </Link>
        </div>
      </div>
    </main>
  );
}
