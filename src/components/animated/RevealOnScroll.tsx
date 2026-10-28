"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface RevealOnScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  threshold?: number;
}

/**
 * High-performance, rock-solid scroll reveal component.
 * Uses native IntersectionObserver paired with GSAP easing.
 * Avoids React re-render cascades and clears inline styles once revealed.
 */
export function RevealOnScroll({
  children,
  delay = 0,
  duration = 0.8,
  y = 30,
  className,
  threshold = 0.1,
  ...props
}: RevealOnScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isRevealedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isRevealedRef.current) return;

    const revealElement = (immediate = false) => {
      if (isRevealedRef.current || !el) return;
      isRevealedRef.current = true;

      if (immediate) {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          clearProps: "opacity,transform",
        });
      } else {
        gsap.fromTo(
          el,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease: "power2.out",
            clearProps: "opacity,transform",
          }
        );
      }
    };

    // If IntersectionObserver is not supported in the browser, reveal immediately
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      revealElement(true);
      return;
    }

    // Safety timeout: If observer is blocked or desynced, guarantee reveal within 1 second
    const safetyTimer = setTimeout(() => {
      revealElement(true);
    }, 1000);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            clearTimeout(safetyTimer);
            revealElement(false);
            observer.unobserve(el);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);

    return () => {
      clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, [delay, duration, y, threshold]);

  return (
    <div
      ref={containerRef}
      className={cn("will-change-transform", className)}
      style={{
        opacity: 0,
        transform: `translateY(${y}px)`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
