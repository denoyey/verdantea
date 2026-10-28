import type { ScrollTrigger } from "gsap/ScrollTrigger";

export interface FadeUpOptions {
  duration?: number;
  delay?: number;
  y?: number;
  stagger?: number;
  ease?: string;
  scrollTrigger?: boolean | ScrollTrigger.Vars;
}

export interface StaggerRevealOptions {
  duration?: number;
  stagger?: number;
  y?: number;
  ease?: string;
  start?: string;
}

export interface ParallaxOptions {
  speed?: number; // E.g. -50 to 50
  direction?: "vertical" | "horizontal";
  start?: string;
  end?: string;
  scrub?: boolean | number;
}

export interface MagneticOptions {
  strength?: number;
  ease?: string;
  duration?: number;
}

export interface IAnimationController {
  createTimeline(vars?: gsap.TimelineVars): gsap.core.Timeline;
  fadeUp(targets: gsap.DOMTarget, options?: FadeUpOptions): gsap.core.Tween;
  staggerReveal(targets: gsap.DOMTarget, options?: StaggerRevealOptions): gsap.core.Tween;
  createScrollTrigger(options: ScrollTrigger.Vars): ScrollTrigger;
  parallax(target: gsap.DOMTarget, options?: ParallaxOptions): ScrollTrigger;
  refresh(): void;
  cleanup(): void;
}
