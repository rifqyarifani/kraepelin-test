"use client";

import Navbar from "./Navbar";

interface AppWrapperProps {
  children: React.ReactNode;
  isActive: boolean;
  timer: number;
}

export default function AppWrapper({
  children,
  isActive,
  timer,
}: AppWrapperProps) {
  return (
    <>
      <Navbar isActive={isActive} timer={timer} />
      {children}
    </>
  );
}
