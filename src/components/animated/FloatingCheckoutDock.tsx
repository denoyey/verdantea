"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ShoppingCart, ArrowRight, Leaf } from "lucide-react";

interface FloatingCheckoutDockProps {
  cartCount: number;
  totalAmountFormatted: string;
  onOpenCart: () => void;
  onOpenCheckout: () => void;
  onQuickAdd: () => void;
}

/**
 * FloatingCheckoutDock: A sleek, persistent checkout dock that gracefully
 * follows the user while scrolling through the page. Provides instant
 * 1-click WhatsApp order confirmation and cart visibility.
 */
export function FloatingCheckoutDock({
  cartCount,
  totalAmountFormatted,
  onOpenCart,
  onOpenCheckout,
  onQuickAdd,
}: FloatingCheckoutDockProps) {
  const dockRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear when scrolled past hero section (~450px)
      const scrollY = window.scrollY;
      const shouldShow = scrollY > 380;
      setIsVisible(shouldShow);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!dockRef.current) return;

    if (isVisible) {
      gsap.to(dockRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        pointerEvents: "auto",
      });
    } else {
      gsap.to(dockRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        pointerEvents: "none",
      });
    }
  }, [isVisible]);

  return (
    <aside
      aria-label="Akses Cepat Belanja"
      ref={dockRef}
      className="fixed bottom-[max(14px,env(safe-area-inset-bottom))] sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.25rem)] sm:w-[calc(100%-2rem)] max-w-xl pointer-events-none opacity-0 translate-y-10 will-change-transform"
    >
      <div className="rounded-lg border border-black/15 bg-[#182319] p-2.5 sm:p-3 text-white shadow-2xl flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Product & Cart State Info */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-md bg-[#2d3d2e] text-white text-sm shadow-xs">
            <Leaf className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#a8c99a]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[12px] sm:text-[13px] font-bold text-white truncate">
                Verdantea Pure Green
              </span>
              <span className="rounded-md bg-[#2d3d2e] px-1.5 py-0.2 text-[8.5px] sm:text-[9px] font-semibold text-[#a8c99a]">
                50g
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-[11px] text-white/70">
              <span className="font-bold text-[#a8c99a]">
                {cartCount > 0 ? totalAmountFormatted : "Rp 15.000"}
              </span>
              <span>•</span>
              <span className="truncate">{cartCount > 0 ? `${cartCount} item` : "Stok Siap Kirim"}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {cartCount > 0 ? (
            <>
              <button
                onClick={onOpenCart}
                className="hidden min-[480px]:flex items-center gap-1.5 rounded-md border border-white/20 bg-white/10 hover:bg-white/15 px-2.5 sm:px-3 py-2 text-[12px] font-medium text-white transition-all cursor-pointer"
                title="Buka Keranjang"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>({cartCount})</span>
              </button>

              <button
                onClick={onOpenCheckout}
                className="flex items-center gap-1.5 rounded-md bg-[#25d366] hover:bg-[#20ba5a] text-[#0f2312] px-3 sm:px-4 py-2 text-[12px] sm:text-[12.5px] font-bold transition-all shadow-xs cursor-pointer active:scale-98"
              >
                <span>Checkout</span>
                <span className="hidden min-[380px]:inline"> WhatsApp</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#0f2312]" />
              </button>
            </>
          ) : (
            <button
              onClick={onQuickAdd}
              className="flex items-center gap-1.5 rounded-md bg-[#6b8f5e] hover:bg-[#7ba36e] text-white px-3 sm:px-4 py-2 text-[12px] sm:text-[12.5px] font-bold transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>+ Beli (Rp 15k)</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
