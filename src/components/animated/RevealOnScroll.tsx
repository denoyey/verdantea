"use client";

import React, { useEffect, useRef } from "react";
import { AnimationController } from "@/core/animations/AnimationController";
import { cn } from "@/lib/utils";

interface RevealOnScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  start?: string;
}

/**
 * Reusable animated container that smoothly animates upward when scrolled into view
 * utilizing the OOP AnimationController.
 */
export function RevealOnScroll({
  children,
  delay = 0,
  duration = 0.9,
  y = 35,
  className,
  start = "top 85%",
  ...props
}: RevealOnScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const controller = new AnimationController(containerRef.current);

    controller.fadeUp(containerRef.current, {
      delay,
      duration,
      y,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start,
        toggleActions: "play none none none",
      },
    });

    return () => {
      controller.cleanup();
    };
  }, [delay, duration, y, start]);

  return (
    <div ref={containerRef} className={cn("will-change-transform", className)} {...props}>
      {children}
    </div>
  );
}
