"use client";

import { useEffect, useRef, useCallback } from "react";
import { AnimationController } from "@/core/animations/AnimationController";

/**
 * Hook to create a scoped AnimationController lifecycle.
 * Automatically cleans up tweens, timelines, and triggers on component unmount.
 */
export function useAnimationController(
  callback?: (controller: AnimationController) => void,
  dependencies: unknown[] = []
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<AnimationController | null>(null);

  useEffect(() => {
    const controller = new AnimationController(containerRef.current);
    controllerRef.current = controller;

    if (callback) {
      callback(controller);
    }

    return () => {
      controller.cleanup();
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const getController = useCallback(() => {
    return controllerRef.current;
  }, []);

  return {
    containerRef,
    getController,
  };
}
