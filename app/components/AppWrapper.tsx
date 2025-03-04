"use client";

import { useState } from "react";
import Navbar from "./Navbar";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);

  const handleStart = () => {
    setIsActive(true);
    // You can add additional start logic here if needed
  };

  return (
    <>
      <Navbar isActive={isActive} timer={timer} onStart={handleStart} />
      {children}
    </>
  );
}
