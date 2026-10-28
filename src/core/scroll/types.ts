import type Lenis from "lenis";

export interface ScrollManagerOptions {
  duration?: number;
  easing?: (t: number) => number;
  orientation?: "vertical" | "horizontal";
  gestureOrientation?: "vertical" | "horizontal" | "both";
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  infinite?: boolean;
  autoRaf?: boolean;
}

export type ScrollTarget = number | string | HTMLElement;

export interface ScrollToOptions {
  offset?: number;
  immediate?: boolean;
  lock?: boolean;
  duration?: number;
  easing?: (t: number) => number;
  onComplete?: () => void;
}

export type ScrollCallback = (lenis: Lenis) => void;

export interface ISmoothScrollManager {
  init(options?: Partial<ScrollManagerOptions>): void;
  destroy(): void;
  start(): void;
  stop(): void;
  scrollTo(target: ScrollTarget, options?: ScrollToOptions): void;
  on(event: "scroll", callback: ScrollCallback): () => void;
  off(event: "scroll", callback: ScrollCallback): void;
  getLenis(): Lenis | null;
  getRawInstance(): Lenis | null;
  get isInitialized(): boolean;
  get currentScroll(): number;
  get scrollVelocity(): number;
  get scrollProgress(): number;
}
