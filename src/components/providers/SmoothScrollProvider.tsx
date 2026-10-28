"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";
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

// Subscribe to initialization status
function subscribe(callback: () => void) {
  const unsubscribe = managerInstance.on("scroll", () => callback());
  return () => {
    unsubscribe();
  };
}

function getSnapshot() {
  return managerInstance.isInitialized;
}

function getServerSnapshot() {
  return false;
}

export function SmoothScrollProvider({
  children,
  options,
}: SmoothScrollProviderProps) {
  const isReady = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    managerInstance.init(options);

    return () => {
      managerInstance.destroy();
    };
  }, [options]);

  return (
    <SmoothScrollContext.Provider value={{ manager: managerInstance, isReady }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
