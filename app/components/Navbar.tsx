"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Format time as HH:MM:SS
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const navItems = [
  { name: "Home", path: "/" },
  { name: "Test", path: "/kraepelin" },
  { name: "Leaderboard", path: "/leaderboard" },
];

interface NavbarProps {
  isActive: boolean;
  timer: number;
  onStart: () => void;
}

export default function Navbar({ isActive, timer, onStart }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="bg-transparent border-b-2 border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left side - Logo */}
        <Link
          href="/"
          className="text-2xl font-semibold tracking-tight transition-colors hover:text-[#4096FF]"
        >
          <span className="text-[#4096FF]">Pauli</span>
          <span>Test</span>
        </Link>

        {/* Right side - Navigation */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-md transition-colors hover:text-[#4096FF] ${
                pathname === "/" ? "text-[#4096FF]" : "text-gray-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/kraepelin"
              className={`text-md transition-colors hover:text-[#4096FF] ${
                pathname === "/kraepelin" ? "text-[#4096FF]" : "text-gray-600"
              }`}
            >
              Test
            </Link>
            <Link
              href="/leaderboard"
              className={`text-md transition-colors hover:text-[#4096FF] ${
                pathname === "/leaderboard" ? "text-[#4096FF]" : "text-gray-600"
              }`}
            >
              Leaderboard
            </Link>
          </div>
          {/* Timer display */}
          {isActive && (
            <div className="text-lg font-semibold text-[#4096FF]">
              {formatTime(timer)}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
