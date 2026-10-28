import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type {
  ISmoothScrollManager,
  ScrollCallback,
  ScrollManagerOptions,
  ScrollTarget,
  ScrollToOptions,
} from "./types";

/**
 * Object-Oriented Smooth Scroll Manager.
 * Encapsulates Lenis smooth scrolling lifecycle, event subscriptions,
 * and tight synchronization with GSAP's ScrollTrigger and Ticker.
 */
export class SmoothScrollManager implements ISmoothScrollManager {
  private static instance: SmoothScrollManager | null = null;
  private lenis: Lenis | null = null;
  private tickerCallback: ((time: number) => void) | null = null;
  private scrollSubscribers: Set<ScrollCallback> = new Set();
  private isDestroyed = false;

  private defaultOptions: ScrollManagerOptions = {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    infinite: false,
    autoRaf: false, // We control RAF via GSAP ticker
  };

  /**
   * Private constructor to enforce Singleton pattern or controlled instantiation.
   */
  private constructor() {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  /**
   * Retrieves the global singleton instance.
   */
  public static getInstance(): SmoothScrollManager {
    if (!SmoothScrollManager.instance) {
      SmoothScrollManager.instance = new SmoothScrollManager();
    }
    return SmoothScrollManager.instance;
  }

  /**
   * Initializes the Lenis engine and synchronizes with GSAP.
   */
  public init(options: Partial<ScrollManagerOptions> = {}): void {
    if (typeof window === "undefined" || this.lenis) {
      return;
    }

    const mergedOptions: ScrollManagerOptions = {
      ...this.defaultOptions,
      ...options,
    };

    this.lenis = new Lenis(mergedOptions);
    this.isDestroyed = false;

    // 1. Sync Lenis scroll events with GSAP ScrollTrigger
    this.lenis.on("scroll", this.handleLenisScroll);

    // 2. Drive Lenis updates through GSAP Ticker for smooth synchronized rendering
    this.tickerCallback = (time: number) => {
      this.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(this.tickerCallback);
    gsap.ticker.lagSmoothing(0);
  }

  /**
   * Internal scroll event dispatcher.
   */
  private handleLenisScroll = (e: Lenis): void => {
    ScrollTrigger.update();
    for (const callback of this.scrollSubscribers) {
      try {
        callback(e);
      } catch (err) {
        console.error("[SmoothScrollManager] Callback error:", err);
      }
    }
  };

  /**
   * Destroys the Lenis instance and cleans up ticker & scroll events.
   */
  public destroy(): void {
    if (this.tickerCallback) {
      gsap.ticker.remove(this.tickerCallback);
      this.tickerCallback = null;
    }

    if (this.lenis) {
      this.lenis.off("scroll", this.handleLenisScroll);
      this.lenis.destroy();
      this.lenis = null;
    }

    this.scrollSubscribers.clear();
    this.isDestroyed = true;
    SmoothScrollManager.instance = null;
  }

  /**
   * Starts or resumes the scroll loop.
   */
  public start(): void {
    this.lenis?.start();
  }

  /**
   * Stops/pauses the scroll loop.
   */
  public stop(): void {
    this.lenis?.stop();
  }

  /**
   * Smoothly animates to a target element, selector, or pixel position.
   */
  public scrollTo(target: ScrollTarget, options?: ScrollToOptions): void {
    if (!this.lenis) return;
    this.lenis.scrollTo(target, options);
  }

  /**
   * Subscribes a listener to scroll events.
   * Returns an unsubscribe function.
   */
  public on(event: "scroll", callback: ScrollCallback): () => void {
    this.scrollSubscribers.add(callback);
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribes a listener.
   */
  public off(event: "scroll", callback: ScrollCallback): void {
    this.scrollSubscribers.delete(callback);
  }

  /**
   * Get raw Lenis instance if direct access is needed.
   */
  public getLenis(): Lenis | null {
    return this.lenis;
  }

  /**
   * Alias for interface compatibility.
   */
  public getRawInstance(): Lenis | null {
    return this.lenis;
  }

  public get isInitialized(): boolean {
    return Boolean(this.lenis && !this.isDestroyed);
  }

  public get currentScroll(): number {
    return this.lenis?.scroll ?? 0;
  }

  public get scrollVelocity(): number {
    return this.lenis?.velocity ?? 0;
  }

  public get scrollProgress(): number {
    return this.lenis?.progress ?? 0;
  }
}

// Export a convenience accessor
export const scrollManager = SmoothScrollManager.getInstance();
