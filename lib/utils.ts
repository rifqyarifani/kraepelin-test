import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    console.error("Invalid date string:", dateString);
    return "Tanggal tidak valid";
  }
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatPercent(value: number, fractionDigits = 2) {
  return `${value.toFixed(fractionDigits).replace(".", ",")}%`;
}
