"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Format time as HH:MM:SS
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

interface NavbarProps {
  isActive: boolean;
  timer: number;
}

export default function Navbar({ isActive, timer }: NavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-transparent border-b-2 border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left side - Logo */}
        <Link
          href="/"
          className="text-2xl font-semibold tracking-tight transition-colors hover:text-[#4096FF]"
        >
          <span className="text-[#4096FF]">Tes</span>
          <span>Pauli</span>
        </Link>

        {/* Right side - Navigation */}
        <div className="flex items-center gap-4">
          {/* Timer display */}
          {isActive && (
            <div className="text-lg font-semibold text-[#4096FF] hidden sm:block">
              {formatTime(timer)}
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  d="M6 18L18 6M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M4 6H20M4 12H20M4 18H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              href="/"
              className={`text-md transition-colors hover:text-[#4096FF] ${
                pathname === "/" ? "text-[#4096FF]" : "text-gray-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/pauli"
              className={`text-md transition-colors hover:text-[#4096FF] ${
                pathname === "/pauli" ? "text-[#4096FF]" : "text-gray-600"
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
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/"
              className={`block py-2 px-4 rounded-lg transition-colors ${
                pathname === "/"
                  ? "bg-blue-50 text-[#4096FF]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/pauli"
              className={`block py-2 px-4 rounded-lg transition-colors ${
                pathname === "/pauli"
                  ? "bg-blue-50 text-[#4096FF]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Test
            </Link>
            <Link
              href="/leaderboard"
              className={`block py-2 px-4 rounded-lg transition-colors ${
                pathname === "/leaderboard"
                  ? "bg-blue-50 text-[#4096FF]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboard
            </Link>
            {isActive && (
              <div className="py-2 px-4 text-lg font-semibold text-[#4096FF] border-t border-gray-100">
                {formatTime(timer)}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
