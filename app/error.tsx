"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Terjadi Kesalahan</h1>
        <p className="text-gray-600 mb-8">
          Maaf, terjadi kesalahan tak terduga. Silakan coba lagi.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-400 mb-6">
            Kode kesalahan: {error.digest}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2 bg-ink text-white rounded-lg hover:bg-black/90 transition-colors"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="px-5 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
