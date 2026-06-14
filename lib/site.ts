export const siteConfig = {
  name: "Tes Pauli",
  title: "Tes Pauli Online - Latihan Tes Koran Gratis",
  description:
    "Latihan Tes Pauli online untuk mengasah konsentrasi, kecepatan berhitung, dan ketelitian sebelum menghadapi tes koran atau psikotes kerja.",
  locale: "id_ID",
  keywords: [
    "tes pauli",
    "latihan tes pauli",
    "tes pauli online",
    "tes koran",
    "latihan tes koran",
    "psikotes pauli",
    "kraepelin test",
    "latihan psikotes kerja",
  ],
};

export function getSiteUrl() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    "http://localhost:3000";

  return url.startsWith("http") ? url : `https://${url}`;
}
