import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type {
  FadeUpOptions,
  IAnimationController,
  ParallaxOptions,
  StaggerRevealOptions,
} from "./types";

/**
 * Object-Oriented GSAP Animation Controller.
 * Manages GSAP animations, timelines, and ScrollTrigger instances
 * with robust memory management and scoped lifecycle cleanup.
 */
export class AnimationController implements IAnimationController {
  private static isPluginRegistered = false;
  private timelines: gsap.core.Timeline[] = [];
  private tweens: gsap.core.Tween[] = [];
  private scrollTriggers: ScrollTrigger[] = [];
  private scopeElement: Element | null = null;
  private ctx: gsap.Context | null = null;

  public constructor(scope?: Element | null) {
    this.ensurePlugins();
    if (scope && typeof window !== "undefined") {
      this.scopeElement = scope;
      this.ctx = gsap.context(() => { }, scope);
    }
  }

  /**
   * Safe registration of GSAP plugins.
   */
  private ensurePlugins(): void {
    if (typeof window !== "undefined" && !AnimationController.isPluginRegistered) {
      gsap.registerPlugin(ScrollTrigger);
      AnimationController.isPluginRegistered = true;
    }
  }

  /**
   * Creates a managed GSAP Timeline.
   */
  public createTimeline(vars?: gsap.TimelineVars): gsap.core.Timeline {
    const tl = gsap.timeline(vars);
    this.timelines.push(tl);
    return tl;
  }

  /**
   * Reusable fade-up entrance animation with optional ScrollTrigger.
   */
  public fadeUp(targets: gsap.DOMTarget, options: FadeUpOptions = {}): gsap.core.Tween {
    const {
      duration = 0.9,
      delay = 0,
      y = 30,
      stagger = 0.08,
      ease = "power3.out",
      scrollTrigger,
    } = options;

    let triggerConfig: ScrollTrigger.Vars | undefined = undefined;

    if (scrollTrigger === true) {
      triggerConfig = {
        trigger: targets as Element,
        start: "top 85%",
        toggleActions: "play none none none",
      };
    } else if (typeof scrollTrigger === "object") {
      triggerConfig = scrollTrigger;
    }

    const tween = gsap.from(targets, {
      opacity: 0,
      y,
      duration,
      delay,
      stagger,
      ease,
      scrollTrigger: triggerConfig,
    });

    this.tweens.push(tween);
    return tween;
  }

  /**
   * Reusable staggered reveal for headings, cards, and lists.
   */
  public staggerReveal(
    targets: gsap.DOMTarget,
    options: StaggerRevealOptions = {}
  ): gsap.core.Tween {
    const {
      duration = 0.8,
      stagger = 0.12,
      y = 40,
      ease = "power3.out",
      start = "top 80%",
    } = options;

    const tween = gsap.from(targets, {
      y,
      opacity: 0,
      duration,
      stagger,
      ease,
      scrollTrigger: {
        trigger: targets as Element,
        start,
        toggleActions: "play none none none",
      },
    });

    this.tweens.push(tween);
    return tween;
  }

  /**
   * Creates and registers a custom ScrollTrigger instance.
   */
  public createScrollTrigger(options: ScrollTrigger.Vars): ScrollTrigger {
    const trigger = ScrollTrigger.create(options);
    this.scrollTriggers.push(trigger);
    return trigger;
  }

  /**
   * Reusable parallax effect bound to scroll position.
   */
  public parallax(target: gsap.DOMTarget, options: ParallaxOptions = {}): ScrollTrigger {
    const {
      speed = 30,
      direction = "vertical",
      start = "top bottom",
      end = "bottom top",
      scrub = 1,
    } = options;

    const movement = direction === "vertical" ? { yPercent: speed } : { xPercent: speed };

    const tween = gsap.to(target, {
      ...movement,
      ease: "none",
      scrollTrigger: {
        trigger: target as Element,
        start,
        end,
        scrub,
      },
    });

    this.tweens.push(tween);
    const trigger = tween.scrollTrigger as ScrollTrigger;
    if (trigger) {
      this.scrollTriggers.push(trigger);
    }
    return trigger;
  }

  /**
   * Refreshes all active ScrollTriggers to recalculate offsets.
   */
  public refresh(): void {
    if (typeof window !== "undefined") {
      ScrollTrigger.refresh();
    }
  }

  /**
   * Cleans up all managed timelines, tweens, and triggers.
   * Eliminates memory leaks and orphaned scroll listeners.
   */
  public cleanup(): void {
    if (this.ctx) {
      this.ctx.revert();
      this.ctx = null;
    }

    this.timelines.forEach((tl) => tl.kill());
    this.timelines = [];

    this.tweens.forEach((tw) => tw.kill());
    this.tweens = [];

    this.scrollTriggers.forEach((st) => st.kill());
    this.scrollTriggers = [];
  }
}
