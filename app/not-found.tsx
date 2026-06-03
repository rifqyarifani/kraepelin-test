import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-brand mb-2">404</p>
        <h1 className="text-2xl font-bold mb-4">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-600 mb-8">
          Halaman yang kamu cari tidak ada atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2 bg-ink text-white rounded-lg hover:bg-black/90 transition-colors"
        >
          Ke Beranda
        </Link>
      </div>
    </main>
  );
}
