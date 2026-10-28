"use client";

import React, { useEffect, useRef } from "react";
import { MagneticController } from "@/core/animations/ParallaxController";
import type { MagneticOptions } from "@/core/animations/types";
import { cn } from "@/lib/utils";

interface MagneticWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  options?: MagneticOptions;
  className?: string;
}

/**
 * Reusable wrapper that attaches magnetic cursor attraction
 * via the OOP MagneticController.
 */
export function MagneticWrapper({
  children,
  options,
  className,
  ...props
}: MagneticWrapperProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const controller = new MagneticController(elementRef.current, options);

    return () => {
      controller.destroy();
    };
  }, [options]);

  return (
    <div
      ref={elementRef}
      className={cn("inline-block will-change-transform", className)}
      {...props}
    >
      {children}
    </div>
  );
}
