import gsap from "gsap";
import type { MagneticOptions } from "./types";

/**
 * Object-Oriented Magnetic Interaction Controller.
 * Provides smooth magnetic attraction effect for interactive buttons,
 * icons, and cards on cursor hover.
 */
export class MagneticController {
  private element: HTMLElement;
  private strength: number;
  private duration: number;
  private ease: string;
  private onMouseMoveBound: (e: MouseEvent) => void;
  private onMouseLeaveBound: () => void;
  private tween: gsap.core.Tween | null = null;

  public constructor(element: HTMLElement, options: MagneticOptions = {}) {
    this.element = element;
    this.strength = options.strength ?? 0.35;
    this.duration = options.duration ?? 0.8;
    this.ease = options.ease ?? "power3.out";

    this.onMouseMoveBound = this.onMouseMove.bind(this);
    this.onMouseLeaveBound = this.onMouseLeave.bind(this);

    this.bindEvents();
  }

  private bindEvents(): void {
    this.element.addEventListener("mousemove", this.onMouseMoveBound);
    this.element.addEventListener("mouseleave", this.onMouseLeaveBound);
  }

  private onMouseMove(e: MouseEvent): void {
    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * this.strength;
    const deltaY = (e.clientY - centerY) * this.strength;

    this.tween?.kill();
    this.tween = gsap.to(this.element, {
      x: deltaX,
      y: deltaY,
      duration: this.duration,
      ease: this.ease,
    });
  }

  private onMouseLeave(): void {
    this.tween?.kill();
    this.tween = gsap.to(this.element, {
      x: 0,
      y: 0,
      duration: this.duration,
      ease: "elastic.out(1, 0.4)",
    });
  }

  /**
   * Destroys event listeners and kills active tweens.
   */
  public destroy(): void {
    this.element.removeEventListener("mousemove", this.onMouseMoveBound);
    this.element.removeEventListener("mouseleave", this.onMouseLeaveBound);
    this.tween?.kill();
  }
}
