"use client";

import { useEffect, useState } from "react";
import { SmoothScrollManager } from "@/core/scroll/SmoothScrollManager";
import type { ScrollTarget, ScrollToOptions } from "@/core/scroll/types";

/**
 * Hook to interface with the SmoothScrollManager instance.
 */
export function useSmoothScroll() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const manager = SmoothScrollManager.getInstance();

    const unsubscribe = manager.on("scroll", (lenis) => {
      setScrollProgress(lenis.progress);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const scrollTo = (target: ScrollTarget, options?: ScrollToOptions) => {
    SmoothScrollManager.getInstance().scrollTo(target, options);
  };

  const stop = () => {
    SmoothScrollManager.getInstance().stop();
  };

  const start = () => {
    SmoothScrollManager.getInstance().start();
  };

  return {
    manager: SmoothScrollManager.getInstance(),
    scrollProgress,
    scrollTo,
    stop,
    start,
  };
}
