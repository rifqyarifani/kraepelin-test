import type { Metadata } from "next";
import Link from "next/link";
import { Play } from "lucide-react";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Tes Pauli Online",
    alternateName: ["Latihan Tes Pauli", "Latihan Tes Koran"],
    url: siteUrl,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    inLanguage: "id-ID",
    description: siteConfig.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IDR",
    },
  };

  return (
    <main className="bg-white overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4">
        <div className="max-w-6xl w-full text-center">
        <div className="inline-block bg-gray-100 rounded-full px-4 py-2 mb-8">
          <span className="text-gray-800 font-medium">
            Latihan Tes Pauli Online
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Tes Pauli Online untuk Latihan <span className="text-brand">Tes Koran</span>
        </h1>

        <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          Berlatih menjumlahkan angka seperti format Tes Pauli atau tes koran
          untuk mengasah konsentrasi, kecepatan berhitung, dan ketelitian.
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
      </section>

      <section className="border-t border-gray-200 px-4 py-16">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
          <article>
            <h2 className="text-2xl font-bold mb-3">Apa itu Tes Pauli?</h2>
            <p className="text-gray-600 leading-7">
              Tes Pauli adalah latihan psikotes berupa penjumlahan angka
              berurutan dalam banyak kolom. Tes ini sering digunakan untuk
              melihat ketahanan kerja, fokus, tempo, dan akurasi.
            </p>
          </article>
          <article>
            <h2 className="text-2xl font-bold mb-3">Latihan Tes Koran</h2>
            <p className="text-gray-600 leading-7">
              Format latihan dibuat untuk membantu membiasakan ritme
              mengerjakan tes koran: cepat, konsisten, dan tetap teliti saat
              berpindah dari satu baris ke baris berikutnya.
            </p>
          </article>
          <article>
            <h2 className="text-2xl font-bold mb-3">Skor dan Akurasi</h2>
            <p className="text-gray-600 leading-7">
              Setelah latihan selesai, hasil dihitung dari jawaban benar,
              jawaban salah, skor total, dan persentase akurasi agar progres
              latihan bisa dibandingkan dari waktu ke waktu.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
