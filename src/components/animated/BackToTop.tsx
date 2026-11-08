"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { SmoothScrollManager } from "@/core/scroll/SmoothScrollManager";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BackToTopProps {
  threshold?: number;
  hideWhenModalOpen?: boolean;
}

/**
 * BackToTop: Minimalist luxury editorial back-to-top button.
 * Harmonizes with Verdantea's artisanal aesthetic: deep forest tea green palette,
 * tactile rounded-md shape, smooth GSAP/Lenis scrolling, and full responsiveness
 * across all screen sizes and iPhone safe-areas.
 */
export function BackToTop({
  threshold = 360,
  hideWhenModalOpen = false,
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    const manager = SmoothScrollManager.getInstance();
    if (manager && manager.isInitialized && manager.getLenis()) {
      manager.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const shouldShow = isVisible && !hideWhenModalOpen;

  return (
    <div
      className={`fixed z-40 bottom-[max(20px,calc(env(safe-area-inset-bottom)+14px))] right-3.5 min-[360px]:right-4 sm:right-6 md:right-8 transition-all duration-300 ease-out ${
        shouldShow
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Kembali ke atas halaman"
              className="group relative flex h-10 w-10 min-[360px]:h-11 min-[360px]:w-11 sm:h-11 sm:w-11 items-center justify-center rounded-md border border-white/20 bg-[#1e2d1f]/95 hover:bg-[#162317] text-white shadow-[0_4px_18px_rgba(15,25,15,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(15,25,15,0.45)] active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a8c99a]"
            >
              <ArrowUp className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-[#a8c99a] transition-transform duration-200 group-hover:-translate-y-0.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs font-medium">
            Kembali ke Atas
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

