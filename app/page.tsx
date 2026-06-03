import Link from "next/link";
import { Play } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-white overflow-hidden flex flex-col items-center justify-center px-4">
      <div className="max-w-6xl w-full text-center">
        <div className="inline-block bg-gray-100 rounded-full px-4 py-2 mb-8">
          <span className="text-gray-800 font-medium">
            Latihan Membuat Sempurna
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Kuasai Tes <span className="text-brand">Pauli</span>
        </h1>

        <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          Tingkatkan konsentrasi, kecepatan, dan ketelitianmu dengan platform
          latihan interaktif. Berlatih secara rutin dan lacak progresmu.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/pauli"
            className="inline-flex items-center justify-center px-6 py-4 bg-ink text-white rounded-xl hover:bg-black/90 transition-colors text-lg font-medium gap-2.5 min-w-[180px]"
          >
            <Play
              size={18}
              className="text-white"
              fill="currentColor"
              strokeWidth={0}
            />
            Mulai Tes
          </Link>
          <Link
            href="/leaderboard"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-black border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium"
          >
            Lihat Papan Peringkat
          </Link>
        </div>
      </div>
    </main>
  );
}
