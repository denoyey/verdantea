"use client";

import React, { createContext, useContext, useEffect } from "react";
import { SmoothScrollManager } from "@/core/scroll/SmoothScrollManager";
import type { ScrollManagerOptions } from "@/core/scroll/types";
import "lenis/dist/lenis.css";

interface SmoothScrollContextValue {
  manager: SmoothScrollManager;
  isReady: boolean;
}

const managerInstance = SmoothScrollManager.getInstance();

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  manager: managerInstance,
  isReady: false,
});

export const useScrollContext = () => useContext(SmoothScrollContext);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
  options?: Partial<ScrollManagerOptions>;
}

export function SmoothScrollProvider({
  children,
  options,
}: SmoothScrollProviderProps) {
  useEffect(() => {
    managerInstance.init(options);

    return () => {
      managerInstance.destroy();
    };
  }, [options]);

  return (
    <SmoothScrollContext.Provider
      value={{ manager: managerInstance, isReady: managerInstance.isInitialized }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}
