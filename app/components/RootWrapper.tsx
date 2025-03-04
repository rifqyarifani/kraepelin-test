"use client";

import { createContext, useContext, useState } from "react";
import AppWrapper from "./AppWrapper";

interface TestContextType {
  isActive: boolean;
  timer: number;
  setIsActive: (active: boolean) => void;
  setTimer: (time: number) => void;
}

export const TestContext = createContext<TestContextType | null>(null);

export function useTest() {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error("useTest must be used within a TestProvider");
  }
  return context;
}

export default function RootWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);

  return (
    <TestContext.Provider value={{ isActive, timer, setIsActive, setTimer }}>
      <AppWrapper isActive={isActive} timer={timer}>
        {children}
      </AppWrapper>
    </TestContext.Provider>
  );
}
