"use client";

import React from "react";
import { SmoothScrollManager } from "@/core/scroll/SmoothScrollManager";
import { cn } from "@/lib/utils";

interface SmoothAnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId: string;
  offset?: number;
  duration?: number;
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable anchor link that uses SmoothScrollManager to navigate smoothly to target sections.
 */
export function SmoothAnchor({
  targetId,
  offset = -70,
  duration = 1.2,
  children,
  className,
  onClick,
  ...props
}: SmoothAnchorProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) onClick(e);

    const target = document.getElementById(targetId.replace(/^#/, ""));
    if (target) {
      SmoothScrollManager.getInstance().scrollTo(target, {
        offset,
        duration,
      });
    }
  };

  return (
    <a
      href={`#${targetId.replace(/^#/, "")}`}
      onClick={handleClick}
      className={cn("cursor-pointer transition-colors duration-200", className)}
      {...props}
    >
      {children}
    </a>
  );
}
