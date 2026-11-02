"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScrollManager } from "@/core/scroll/SmoothScrollManager";
import {
  ShoppingCart,
  Star,
  Leaf,
  Sparkles,
  Award,
  ArrowRight,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RevealOnScroll } from "@/components/animated/RevealOnScroll";
import { MagneticWrapper } from "@/components/animated/MagneticWrapper";
import { LivingTeaChamber } from "@/components/animated/LivingTeaChamber";

interface Product {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  weight: string;
  emoji: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  tastingNotes: string[];
  desc: string;
  origin: string;
  elevation: string;
  caffeine: "Rendah" | "Sedang" | "Tinggi";
  brewing: {
    temp: string;
    ratio: string;
    time: string;
  };
  image: string;
}

const PRODUCTS_DATA: Product[] = [
  {
    id: "pure-green-tea",
    name: "Verdantea Signature Pure Green Tea",
    category: "single-origin",
    categoryLabel: "Single Origin",
    price: 15000,
    originalPrice: 22000,
    weight: "50g",
    emoji: "🍵",
    badge: "Terlaris",
    rating: 4.9,
    reviewsCount: 142,
    tastingNotes: ["Embun Fajar", "Rerumputan Segar", "Manis Gurih Umami"],
    desc: "Dipetik langsung dari petikan pucuk pertama (first flush) saat fajar di lereng Gunung Tilu, Jawa Barat pada ketinggian 1.450 mdpl. Daun teh utuh dikukus kilat untuk mempertahankan warna hijau zamrud murni, serta mengunci kandungan antioksidan polifenol & katekin EGCG tertinggi tanpa rasa sepat berlebih.",
    origin: "Gunung Tilu, Jawa Barat",
    elevation: "1.450 mdpl",
    caffeine: "Sedang",
    brewing: {
      temp: "75°C - 80°C",
      ratio: "3g / 150ml air",
      time: "90 detik",
    },
    image: "/foto-produk.jpeg",
  },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  qty: number;
  image: string;
  weight: string;
}

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const heroBgRef = useRef<HTMLDivElement | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Checkout form state
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerShipping, setBuyerShipping] = useState("JNE REG (2-3 hari)");
  const [buyerNote, setBuyerNote] = useState("");

  // Load cart from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      try {
        const saved = localStorage.getItem("verdantea_cart_v2");
        if (saved) {
          setCart(JSON.parse(saved));
        }
      } catch {
        // ignore
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Track scroll position to transition into Sticky Luxury Header
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolledPastHero(scrollY > 280);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Parallax depth effect on hero background (instant scrub without CSS transition delay)
  useEffect(() => {
    if (!heroBgRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(heroBgRef.current, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);



  // Save cart to localStorage
  const saveCart = useCallback((updated: CartItem[]) => {
    setCart(updated);
    try {
      localStorage.setItem("verdantea_cart_v2", JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  const formatRp = (num: number) => {
    return "Rp " + num.toLocaleString("id-ID");
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalCartAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const quickAddToCart = (product: Product) => {
    const existingIndex = cart.findIndex((i) => i.id === product.id);
    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cart];
      updated[existingIndex].qty += 1;
    } else {
      updated = [
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          emoji: product.emoji,
          qty: 1,
          image: product.image,
          weight: product.weight,
        },
      ];
    }
    saveCart(updated);
    showToast(`${product.emoji} ${product.name} ditambahkan!`);
  };

  const changeQty = (idx: number, delta: number) => {
    const updated = [...cart];
    updated[idx].qty += delta;
    if (updated[idx].qty <= 0) {
      updated.splice(idx, 1);
    }
    saveCart(updated);
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  // Freeze background scrolling across ALL devices (desktop, iOS, Android) when any modal is open
  const isAnyModalOpen = isCartOpen || isCheckoutOpen || isDetailOpen;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const manager = SmoothScrollManager.getInstance();

    if (isAnyModalOpen) {
      manager.stop();

      const scrollY = window.scrollY;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
        manager.start();
      };
    }
  }, [isAnyModalOpen]);

  const scrollToSection = (id: string) => {
    const targetId = id === "main" || id === "hero-down" ? "product-showcase" : id;
    if (targetId === "hero") {
      const manager = SmoothScrollManager.getInstance();
      if (manager && manager.isInitialized && manager.getLenis()) {
        manager.scrollTo(0, { duration: 1.1 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const el = document.getElementById(targetId);
    if (!el) return;

    const navOffset = 20;
    const targetY = Math.max(0, el.getBoundingClientRect().top + window.scrollY - navOffset);
    const manager = SmoothScrollManager.getInstance();

    if (manager && manager.isInitialized && manager.getLenis()) {
      manager.scrollTo(targetY, { duration: 1.1 });
    } else {
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerPhone.trim() || !buyerAddress.trim()) {
      showToast("⚠️ Mohon lengkapi nama, no. WA, dan alamat");
      return;
    }

    const items = cart
      .map((i) => `• ${i.emoji} ${i.name} (${i.weight}) ×${i.qty} = ${formatRp(i.price * i.qty)}`)
      .join("\n");

    const msg = `Halo Verdantea! 🍃\n\nSaya ingin memesan Verdantea Pure Green Tea:\n${items}\n\n💰 Total: ${formatRp(totalCartAmount)}\n\n👤 Nama: ${buyerName}\n📱 WhatsApp: ${buyerPhone}\n🏠 Alamat: ${buyerAddress}\n🚚 Ekspedisi: ${buyerShipping}${buyerNote ? `\n📝 Catatan: ${buyerNote}` : ""
      }\n\nMohon konfirmasi pesanan dan informasi rekening pembayaran. Terima kasih!`;

    const waNumber = "62895338558400";
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;

    window.open(waUrl, "_blank");

    saveCart([]);
    setIsCheckoutOpen(false);
    showToast("✅ Pesanan berhasil dikirim ke WhatsApp resmi!");
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="relative min-h-screen bg-[#e8e0d0] text-[#1a2218] font-sans selection:bg-[#6b8f5e] selection:text-white">
        {/* ==================== GLOBAL STICKY LUXURY HEADER (AESOP/APPLE STYLE) ==================== */}
        <header
          className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolledPastHero
            ? "bg-[#111a13] border-b border-white/10 shadow-lg py-2 min-[360px]:py-2.5 sm:py-3"
            : "bg-transparent border-b border-transparent py-2.5 min-[360px]:py-3.5 sm:py-4"
            } pt-[max(10px,env(safe-area-inset-top))] px-2.5 min-[360px]:px-4 sm:px-6 lg:px-8`}
        >
          <div className="mx-auto max-w-7xl flex items-center justify-between gap-1.5 min-[360px]:gap-3">
            {/* Left: Brand / Home Link */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("hero");
              }}
              className="flex items-center gap-1.5 min-[360px]:gap-2 text-white font-semibold text-base min-[360px]:text-lg tracking-tight no-underline group shrink-0"
            >
              <div className="flex h-7 w-7 min-[360px]:h-8 min-[360px]:w-8 items-center justify-center rounded-md bg-white/20 border border-white/30 text-emerald-200 transition-transform group-hover:scale-105 text-xs min-[360px]:text-sm">
                🍃
              </div>
              <span className="font-serif tracking-wide text-lg min-[360px]:text-xl">Verdantea</span>
            </a>

            {/* Center: Editorial Product Micro-Bar (Appears when scrolled past hero on tablet & desktop) */}
            <div
              className={`hidden md:flex items-center gap-2.5 rounded-md border border-white/10 bg-white/5 px-3.5 py-1 transition-all duration-300 ${isScrolledPastHero
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#a8c99a]" />
              <span className="text-[12px] font-semibold text-white/95 tracking-wide">
                Verdantea Pure Green
              </span>
              <span className="rounded bg-white/10 px-1.5 py-0.2 text-[9px] font-semibold text-[#a8c99a]">
                50g
              </span>
              <span className="text-white/30 text-xs">•</span>
              <span className="text-[11.5px] font-bold text-[#a8c99a]">
                {totalCartCount > 0 ? formatRp(totalCartAmount) : "Rp 15.000"}
              </span>
              <span className="text-white/30 text-xs">•</span>
              <span className="text-[11px] text-white/70">
                {totalCartCount > 0 ? `${totalCartCount} item di keranjang` : "Stok Siap Kirim"}
              </span>
            </div>

            {/* Right: Quick Buy/Checkout Action + Cart Button */}
            <div className="flex items-center gap-1.5 min-[360px]:gap-2.5 shrink-0">
              {/* Quick Action Button (Only visible when scrolled past hero) */}
              {isScrolledPastHero && (
                <>
                  {totalCartCount > 0 ? (
                    <button
                      onClick={() => setIsCheckoutOpen(true)}
                      className="flex items-center gap-1 min-[360px]:gap-1.5 rounded-md bg-[#25d366] hover:bg-[#20ba5a] text-[#0f2312] px-2 min-[340px]:px-2.5 min-[380px]:px-3.5 py-1.5 text-[11px] min-[360px]:text-[12px] font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                    >
                      <span>Checkout</span>
                      <span className="hidden min-[420px]:inline"> WhatsApp</span>
                      <ArrowRight className="h-3 w-3 min-[360px]:h-3.5 min-[360px]:w-3.5 text-[#0f2312]" />
                    </button>
                  ) : (
                    <button
                      onClick={() => quickAddToCart(PRODUCTS_DATA[0])}
                      className="flex items-center gap-1 min-[360px]:gap-1.5 rounded-md bg-[#6b8f5e] hover:bg-[#7ba36e] text-white px-2 min-[340px]:px-2.5 min-[380px]:px-3.5 py-1.5 text-[11px] min-[360px]:text-[12px] font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                    >
                      <ShoppingCart className="h-3 w-3 min-[360px]:h-3.5 min-[360px]:w-3.5 text-white" />
                      <span>+ Beli<span className="hidden min-[340px]:inline"> (15k)</span></span>
                    </button>
                  )}
                </>
              )}

              {/* Cart Drawer Trigger */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    aria-label="Keranjang Belanja"
                    className="relative flex h-8 w-8 min-[360px]:h-9 min-[360px]:w-9 sm:h-10 sm:w-10 items-center justify-center rounded-md border border-white/20 bg-black/40 text-white transition-all duration-200 hover:scale-105 hover:bg-black/60 active:scale-95 cursor-pointer"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 min-[360px]:h-4 min-[360px]:w-4" />
                    {totalCartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 min-[360px]:h-4.5 min-[360px]:w-4.5 items-center justify-center rounded-md bg-[#ff3b30] text-[9px] min-[360px]:text-[10px] font-bold text-white shadow-sm">
                        {totalCartCount}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {totalCartCount > 0 ? `Keranjang (${totalCartCount})` : "Keranjang Kosong"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </header>

        {/* ==================== HERO SECTION ==================== */}
        <section
          id="hero"
          className="relative flex h-svh min-h-130 min-[360px]:min-h-135 sm:min-h-175 flex-col items-center justify-center px-3 min-[360px]:px-4 sm:px-6 py-10 min-[360px]:py-12 sm:py-16 overflow-hidden"
        >
          {/* Parallax Container (controlled by GSAP ScrollTrigger, zero CSS transition interference for instant responsiveness) */}
          <div
            ref={heroBgRef}
            className="absolute -top-24 -bottom-24 -left-12 -right-12 pointer-events-none will-change-transform overflow-hidden"
          >
            {/* Continuous Living / Breathing Ken Burns animation */}
            <div className="relative w-full h-full animate-hero-live">
              <Image
                src="/hero-bg.jpeg"
                alt="Kebun Teh Alami Verdantea"
                fill
                priority
                quality={80}
                sizes="100vw"
                className="object-cover object-center"
              />
              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-linear-to-b from-[rgba(20,35,20,0.1)] via-[rgba(15,25,15,0.6)] to-[rgba(10,20,10,0.92)]" />
            </div>
          </div>

          {/* Noise overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 z-1"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Hero content - Centered Vertically with Spacious, Aesthetic Layout */}
          <div className="relative z-10 w-full max-w-230 px-1 min-[360px]:px-3 sm:px-8 text-center text-white my-auto pt-10 min-[360px]:pt-14 sm:pt-16 pb-8 sm:pb-8">
            <div
              className={`transition-all duration-700 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                } mb-3 min-[360px]:mb-4 sm:mb-6 inline-flex items-center gap-1.5 min-[360px]:gap-2 rounded-md border border-white/20 bg-black/40 px-2.5 min-[360px]:px-3.5 sm:px-5 py-1 sm:py-1.5 shadow-sm`}
            >
              <span className="text-xs">🍃</span>
              <span className="text-[9.5px] min-[360px]:text-[10.5px] sm:text-[12px] font-semibold uppercase tracking-[1.5px] min-[360px]:tracking-[2.5px] sm:tracking-[3px] text-white/90">
                Pure · Natural · Artisan
              </span>
            </div>

            <h1
              className={`transition-all duration-800 delay-150 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                } mb-3 min-[360px]:mb-4 sm:mb-6 text-[clamp(28px,8.5vw,76px)] font-bold leading-[1.08] tracking-[-1px] min-[360px]:tracking-[-1.5px] sm:tracking-[-2.5px] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)]`}
            >
              welcome to verdantea
            </h1>

            <p
              className={`transition-all duration-700 delay-300 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                } mx-auto max-w-185 sm:max-w-195 mb-5 min-[360px]:mb-7 sm:mb-10 text-[13px] min-[360px]:text-[14.5px] sm:text-[18px] font-normal leading-[1.6] sm:leading-[1.7] text-white/85 tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]`}
            >
              verdantea hadir sebagai bagian dari gaya hidup mindful
              <br className="hidden sm:inline" />
              {" "}setiap produk kami dirancang untuk membawa ketenangan, kehangatan, dan harmoni dalam hidupmu.
            </p>

            {/* Spacious, balanced and aesthetic CTA buttons */}
            <div
              className={`transition-all duration-700 delay-500 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                } flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 w-full max-w-xs sm:max-w-none mx-auto`}
            >
              <MagneticWrapper className="w-full sm:w-auto flex justify-center">
                <button
                  onClick={() => scrollToSection("product-showcase")}
                  className="h-11 sm:h-12 w-full sm:w-auto min-w-44 sm:min-w-52 cursor-pointer rounded-lg bg-white px-6 sm:px-8 text-[14px] sm:text-[15px] font-semibold text-[#1c2a1d] shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-white/95 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Lihat Produk</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
              </MagneticWrapper>

              <MagneticWrapper className="w-full sm:w-auto flex justify-center">
                <button
                  onClick={() => scrollToSection("ritual-seduh")}
                  className="h-11 sm:h-12 w-full sm:w-auto min-w-44 sm:min-w-52 cursor-pointer rounded-lg border border-white/35 bg-white/10 hover:bg-white/20 text-white px-6 sm:px-8 text-[14px] sm:text-[15px] font-semibold transition-all duration-300 hover:border-white/55 hover:-translate-y-0.5 active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex items-center justify-center whitespace-nowrap"
                >
                  <span>Ritual Seduh</span>
                </button>
              </MagneticWrapper>
            </div>
          </div>

          {/* Interactive Scroll Down Button */}
          <button
            type="button"
            onClick={() => scrollToSection("product-showcase")}
            aria-label="Scroll ke konten utama"
            className="group absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center justify-center gap-2 text-white/70 transition-all duration-300 hover:text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-md border border-white/25 bg-black/40 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:border-white/45 group-hover:bg-black/60">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-bounce"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </div>
          </button>
        </section>

        {/* ==================== MAIN ARTISANAL CONTENT ==================== */}
        <main id="main" className="relative bg-[#e8e0d0] min-h-screen">
          {/* ==================== EDITORIAL SHOWCASE (FIRST PART) ==================== */}
          <section id="product-showcase" className="mx-auto max-w-7xl px-2.5 min-[360px]:px-4 sm:px-6 lg:px-8 pt-8 min-[360px]:pt-10 pb-4">
            <RevealOnScroll y={20}>
              {/* Header strip: FIRST PART | ORGANIC GREEN TEA | SINGLE ORIGIN */}
              <div className="flex items-center justify-between border-b border-[#2d3d2e]/15 pb-2 min-[360px]:pb-2.5 sm:pb-3 mb-3.5 sm:mb-6 text-[#4a5a48] gap-1">
                <span className="text-[9px] min-[360px]:text-[10px] sm:text-[11px] font-bold tracking-wider min-[360px]:tracking-[0.2em] sm:tracking-[0.25em] text-[#2d3d2e]/80 uppercase shrink-0">
                  FIRST PART
                </span>
                <div className="rounded-md border border-[#2d3d2e]/40 px-2 min-[360px]:px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-[9px] min-[360px]:text-[10px] sm:text-[11px] font-bold tracking-wider min-[360px]:tracking-[0.15em] sm:tracking-[0.2em] text-[#2d3d2e] uppercase bg-[#f5f0e6] shadow-xs text-center truncate">
                  ORGANIC GREEN TEA
                </div>
                <span className="text-[9px] min-[360px]:text-[10px] sm:text-[11px] font-mono font-medium tracking-wide min-[360px]:tracking-[0.12em] sm:tracking-[0.15em] text-[#4a5a48] uppercase shrink-0">
                  SINGLE ORIGIN
                </span>
              </div>

              {/* TIER 1: POUCH SHOWCASE & 2x2 ARTISANAL CRAFT MATRIX (FULL & BALANCED) */}
              <div className="rounded-lg border border-black/8 bg-[#efe8dc] p-2.5 min-[360px]:p-3.5 sm:p-7 lg:p-8 mb-5 shadow-xs">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-stretch">
                  {/* Left: Product Showcase Card */}
                  <div className="lg:col-span-5 flex flex-col justify-between h-full w-full max-w-xl mx-auto lg:max-w-none">
                    <LivingTeaChamber
                      onQuickAdd={() => quickAddToCart(PRODUCTS_DATA[0])}
                      onOpenDetail={() => openProductDetail(PRODUCTS_DATA[0])}
                      priceFormatted={formatRp(PRODUCTS_DATA[0].price)}
                    />
                  </div>

                  {/* Right: 2x2 Artisanal Matrix (Full Height & Balanced) */}
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 min-[360px]:gap-3.5 sm:gap-5 h-full items-stretch w-full max-w-xl mx-auto lg:max-w-none">
                    {/* Cell 1: Origin Story (CIWIDEY HIGHLAND) */}
                    <div className="artisanal-matrix-cell flex flex-col justify-between rounded-md border border-black/8 bg-white/80 p-3.5 min-[380px]:p-5 sm:p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xs">
                      <div>
                        <div className="text-[11px] min-[360px]:text-[12px] font-bold uppercase tracking-wider min-[360px]:tracking-widest text-[#2d3d2e] mb-1.5 min-[360px]:mb-2 flex items-center gap-1.5">
                          <Leaf className="h-3.5 w-3.5 text-[#5f7a5b]" />
                          <span>CIWIDEY HIGHLAND</span>
                        </div>
                        <p className="text-[11.5px] min-[380px]:text-[12.5px] leading-relaxed text-[#4a5a48]">
                          Petikan pucuk peko dari lereng vulkanis 1.450 mdpl berselimut kabut alami. Diproses kukus kilat untuk mengunci klorofil murni, katekin, dan antioksidan EGCG tanpa kepahitan.
                        </p>
                      </div>
                      <div className="mt-3 min-[360px]:mt-4 pt-2.5 min-[360px]:pt-3 border-t border-black/6 text-[9.5px] min-[360px]:text-[10.5px] font-mono text-[#5f7a5b] uppercase tracking-wider font-semibold">
                        ELEVASI 1.450 MDPL • SINGLE ORIGIN
                      </div>
                    </div>

                    {/* Cell 2: Sage Green Badge Tile */}
                    <div className="artisanal-matrix-cell flex flex-col justify-between rounded-md bg-[#547350] text-white p-3.5 min-[380px]:p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
                      <div className="flex items-center justify-between mb-2.5 min-[360px]:mb-3">
                        <span className="text-[9px] min-[360px]:text-[10px] font-mono tracking-wider min-[360px]:tracking-widest uppercase text-white/80 bg-white/15 px-2 min-[360px]:px-2.5 py-0.5 min-[360px]:py-1 rounded-md">
                          PANEN PERDANA
                        </span>
                        <Sparkles className="h-3.5 w-3.5 min-[360px]:h-4 min-[360px]:w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-[15px] min-[360px]:text-[16px] sm:text-[18px] font-serif font-bold tracking-tight">
                          First Flush 2026
                        </div>
                        <p className="text-[11px] min-[360px]:text-[12px] text-white/85 leading-relaxed mt-1">
                          Hanya memetik 2 pucuk daun teratas saat embun fajar masih membasahi kebun, mengunci asam amino L-theanine manis alami.
                        </p>
                      </div>
                      <div className="mt-3 min-[360px]:mt-4 pt-2 text-[9.5px] min-[360px]:text-[10.5px] text-white/70 font-mono tracking-wide">
                        Petikan Embun Fajar Terpilih
                      </div>
                    </div>

                    {/* Cell 3: Forest Green Badge Tile */}
                    <div className="artisanal-matrix-cell flex flex-col justify-between rounded-md bg-[#1f2d20] text-white p-3.5 min-[380px]:p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
                      <div className="flex items-center justify-between mb-2.5 min-[360px]:mb-3">
                        <span className="text-[9px] min-[360px]:text-[10px] font-mono tracking-wider min-[360px]:tracking-widest uppercase text-[#a8c99a] bg-white/10 px-2 min-[360px]:px-2.5 py-0.5 min-[360px]:py-1 rounded-md">
                          GRADE 1 UTUH
                        </span>
                        <Award className="h-3.5 w-3.5 min-[360px]:h-4 min-[360px]:w-4 text-[#a8c99a]" />
                      </div>
                      <div>
                        <div className="text-[15px] min-[360px]:text-[16px] sm:text-[18px] font-serif font-bold tracking-tight text-[#a8c99a]">
                          100% Pucuk Murni
                        </div>
                        <p className="text-[11px] min-[360px]:text-[12px] text-white/80 leading-relaxed mt-1">
                          Bebas pestisida kimia sintetis & bahan perisa buatan. Daun teh disortir secara teliti agar ukuran dan kemurnian tetap prima.
                        </p>
                      </div>
                      <div className="mt-3 min-[360px]:mt-4 pt-2 text-[9.5px] min-[360px]:text-[10.5px] text-[#a8c99a]/80 font-mono tracking-wide">
                        Standar Mutu Artisan Teruji
                      </div>
                    </div>

                    {/* Cell 4: Botanical Line Art & Certification */}
                    <div className="artisanal-matrix-cell flex flex-col justify-between rounded-md border border-black/8 bg-white/80 p-3.5 min-[380px]:p-5 sm:p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 min-[360px]:mb-2">
                          <svg className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 text-[#2d3d2e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9A9 9 0 0 1 3 11C3 6.03 7.03 2 12 2z" />
                            <path d="M12 2c0 4.97 4.03 9 9 9" />
                            <path d="M12 11c0 4.97-4.03 9-9 9" />
                          </svg>
                          <div className="text-[11px] min-[360px]:text-[12px] font-bold uppercase tracking-wider text-[#2d3d2e]">
                            TANPA PENGAWET
                          </div>
                        </div>
                        <p className="text-[11.5px] min-[380px]:text-[12.5px] leading-relaxed text-[#4a5a48]">
                          Struktur sel daun peko utuh terjaga berkat metode kukus tradisional asamushi. Daun tidak hancur menjadi serbuk dan dapat diseduh ulang hingga 3 kali seduhan.
                        </p>
                      </div>
                      <div className="mt-3 min-[360px]:mt-4 pt-2.5 min-[360px]:pt-3 border-t border-black/6 text-[9.5px] min-[360px]:text-[10.5px] font-mono text-[#4a5a48] uppercase tracking-wider font-semibold">
                        DISEGEL NITROGEN • KESEGARAN PRIMA
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TIER 2: SPLIT 50/50 DUAL-PANEL (AUTHENTIC HUMAN EDITORIAL CRAFT) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 mb-5">
                {/* Left Panel: Whole Leaf Texture & Terroir Provenance */}
                <div className="tier2-panel relative rounded-lg overflow-hidden border border-black/8 min-h-72 min-[380px]:min-h-80 sm:min-h-90 flex flex-col justify-between p-3.5 min-[380px]:p-6 sm:p-7 bg-[#1c1a17] shadow-xs">
                  <Image
                    src="/jasmine.jpeg"
                    alt="Tekstur Daun Teh Giok Utuh"
                    fill
                    quality={80}
                    className="object-cover opacity-75"
                    sizes="(max-width: 768px) 100vw, 540px"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/35 pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-between gap-1">
                    <span className="rounded-md bg-black/65 border border-white/20 text-white/95 px-2 min-[360px]:px-3 py-1 text-[8.5px] min-[360px]:text-[10px] font-mono tracking-wider min-[360px]:tracking-widest uppercase truncate">
                      ANATOMI PUCUK PEKO
                    </span>
                    <span className="text-[8.5px] min-[360px]:text-[10.5px] text-white/70 font-mono shrink-0">
                      100% DAUN UTUH
                    </span>
                  </div>

                  <div className="relative z-10 mt-auto pt-10 min-[380px]:pt-16">
                    <div className="flex items-start gap-2 min-[360px]:gap-2.5 text-white">
                      <div className="flex h-6 w-6 min-[360px]:h-7 min-[360px]:w-7 shrink-0 items-center justify-center rounded-md bg-[#5f7a5b] text-white mt-0.5 shadow-2xs">
                        <Leaf className="h-3 w-3 min-[360px]:h-3.5 min-[360px]:w-3.5" />
                      </div>
                      <div>
                        <div className="text-[14px] min-[360px]:text-[15px] sm:text-[16px] font-serif font-bold text-white tracking-wide">
                          Pucuk Daun Utuh Berkualitas Prima
                        </div>
                        <p className="text-[11px] min-[360px]:text-[12px] text-white/80 leading-relaxed mt-1">
                          Metode kukus kilat 30 detik (asamushi) mempertahankan struktur sel daun tetap utuh sempurna tanpa remukan serbuk, menghasilkan seduhan jernih yang dapat diseduh ulang hingga 3 kali.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Pure Brewed Liquor - Authentic Tea Photography */}
                <div className="tier2-panel relative rounded-lg overflow-hidden border border-black/8 min-h-72 min-[380px]:min-h-80 sm:min-h-90 flex flex-col justify-between p-3.5 min-[380px]:p-6 sm:p-7 bg-[#7c5338] text-white shadow-xs">
                  <Image
                    src="/hojicha.jpeg"
                    alt="Seduhan Teh Hijau Alami pada Cangkir Tradisional"
                    fill
                    quality={80}
                    className="object-cover opacity-80"
                    sizes="(max-width: 768px) 100vw, 540px"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/30 pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-between gap-1">
                    <span className="rounded-md bg-black/65 border border-white/20 text-white/95 px-2 min-[360px]:px-3 py-1 text-[8.5px] min-[360px]:text-[10px] font-mono tracking-wider min-[360px]:tracking-widest uppercase truncate">
                      PURE BREWED LIQUOR
                    </span>
                    <span className="text-[8.5px] min-[360px]:text-[10.5px] text-white/75 font-mono shrink-0">
                      INFUSI 80°C • 90 DETIK
                    </span>
                  </div>

                  <div className="relative z-10 mt-auto pt-10 min-[380px]:pt-16">
                    <div className="font-serif text-[16px] min-[360px]:text-[18px] sm:text-[20px] font-bold text-white tracking-wide">
                      Kejernihan Aroma & Rasa Murni
                    </div>
                    <p className="text-[11px] min-[360px]:text-[12px] text-white/85 leading-relaxed mt-1">
                      Warna seduhan giok keemasan yang menenangkan jiwa. Menghadirkan keseimbangan rasa manis alami yang lembut dengan sentuhan umami segar dan astringensi yang sangat halus di langit-langit mulut.
                    </p>
                  </div>
                </div>
              </div>

              {/* TIER 3: SOMMELIER BREWING RITUAL (PURE HUMAN DESIGN) */}
              <div id="ritual-seduh" className="relative rounded-lg overflow-hidden border border-black/8 bg-[#efe8dc] p-3.5 min-[380px]:p-6 sm:p-9 shadow-xs">
                <div className="relative z-10 max-w-4xl mx-auto">
                  {/* Header */}
                  <div className="text-center mb-5 sm:mb-7">
                    <div className="inline-flex items-center gap-1.5 rounded-md bg-[#253927] border border-white/10 px-2.5 min-[360px]:px-3 py-1 text-[9.5px] min-[360px]:text-[10.5px] font-bold tracking-wider min-[360px]:tracking-widest text-[#a8c99a] uppercase shadow-xs mb-2.5 min-[360px]:mb-3">
                      <Leaf className="h-3 w-3 text-[#a8c99a]" />
                      <span>RITUAL SEDUH SOMMELIER</span>
                    </div>
                    <h3 className="font-serif text-[18px] min-[360px]:text-[22px] sm:text-[26px] font-bold text-[#1a2218] tracking-tight">
                      Harmoni Seduhan Pucuk Fajar Pertama
                    </h3>
                    <p className="text-[11.5px] min-[360px]:text-[13px] sm:text-[14px] text-[#4a5a48] leading-relaxed max-w-xl mx-auto mt-1.5 sm:mt-2">
                      Panduan seduh presisi dari kurator teh Verdantea untuk mengunci antioksidan katekin EGCG dan memunculkan cita rasa umami manis alami.
                    </p>
                  </div>

                  {/* 3 Human Sommelier Steps Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 min-[360px]:gap-4 mb-5 sm:mb-7">
                    {/* Step 1 */}
                    <div className="rounded-md border border-black/6 bg-white/80 p-3 min-[360px]:p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] min-[360px]:text-[11px] font-bold text-[#5f7a5b] tracking-wider uppercase">
                          LANGKAH 01
                        </span>
                        <span className="text-[10px] min-[360px]:text-[11px] font-bold text-[#2d3d2e] bg-[#e8e0d0] px-2 py-0.5 rounded-md">
                          75°C - 80°C
                        </span>
                      </div>
                      <div className="font-serif text-[14px] min-[360px]:text-[15px] font-bold text-[#1a2218] mb-1">
                        Suhu Air Ideal
                      </div>
                      <p className="text-[11px] min-[360px]:text-[12px] leading-relaxed text-[#4a5a48]">
                        Hindari menyeduh dengan air mendidih langsung. Diamkan air 2 menit agar senyawa L-theanine manis tidak rusak oleh suhu berlebih.
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="rounded-md border border-black/6 bg-white/80 p-3 min-[360px]:p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] min-[360px]:text-[11px] font-bold text-[#5f7a5b] tracking-wider uppercase">
                          LANGKAH 02
                        </span>
                        <span className="text-[10px] min-[360px]:text-[11px] font-bold text-[#2d3d2e] bg-[#e8e0d0] px-2 py-0.5 rounded-md">
                          3g / 150ml
                        </span>
                      </div>
                      <div className="font-serif text-[14px] min-[360px]:text-[15px] font-bold text-[#1a2218] mb-1">
                        Rasio Takaran Daun
                      </div>
                      <p className="text-[11px] min-[360px]:text-[12px] leading-relaxed text-[#4a5a48]">
                        Gunakan 1 sendok teh daun teh utuh untuk 150ml air mineral. Daun peko akan perlahan mekar melepaskan aroma fajar pegunungan.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="rounded-md border border-black/6 bg-white/80 p-3 min-[360px]:p-4.5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] min-[360px]:text-[11px] font-bold text-[#5f7a5b] tracking-wider uppercase">
                          LANGKAH 03
                        </span>
                        <span className="text-[10px] min-[360px]:text-[11px] font-bold text-[#2d3d2e] bg-[#e8e0d0] px-2 py-0.5 rounded-md">
                          90 Detik
                        </span>
                      </div>
                      <div className="font-serif text-[14px] min-[360px]:text-[15px] font-bold text-[#1a2218] mb-1">
                        Durasi Infusi
                      </div>
                      <p className="text-[11px] min-[360px]:text-[12px] leading-relaxed text-[#4a5a48]">
                        Tuang hingga tetes terakhir ke dalam cangkir keramik. Daun teh first flush utuh ini dapat diseduh kembali hingga 3 kali seduhan.
                      </p>
                    </div>
                  </div>

                  {/* Actions & Verified Sommelier Trust Strip */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4 pt-3.5 sm:pt-4 border-t border-[#2d3d2e]/12">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 min-[360px]:gap-2 text-[10.5px] min-[360px]:text-[12px] text-[#4a5a48] text-center sm:text-left">
                      <div className="flex items-center text-amber-600 font-bold">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 mr-1" />
                        <span className="text-[#1a2218]">4.9</span>
                      </div>
                      <span className="text-black/30">•</span>
                      <span>142 ulasan</span>
                      <span className="text-black/30">•</span>
                      <span className="text-[#2d3d2e] font-semibold">Petikan Pucuk Peko Pertama</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => quickAddToCart(PRODUCTS_DATA[0])}
                        className="flex-1 sm:flex-none h-10.5 sm:h-11 flex items-center justify-center gap-1.5 sm:gap-2 rounded-md bg-[#2d3d2e] hover:bg-[#1f2b20] text-white px-3 sm:px-5 text-xs min-[360px]:text-[12.5px] font-bold transition-all shadow-xs cursor-pointer active:scale-98 whitespace-nowrap"
                      >
                        <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#a8c99a]" />
                        <span className="inline min-[400px]:hidden">+ Beli (15k)</span>
                        <span className="hidden min-[400px]:inline">+ Beli ({formatRp(PRODUCTS_DATA[0].price)})</span>
                      </button>

                      <button
                        onClick={() => openProductDetail(PRODUCTS_DATA[0])}
                        className="flex-1 sm:flex-none h-10.5 sm:h-11 flex items-center justify-center gap-1.5 rounded-md border border-[#2d3d2e]/25 bg-white/90 hover:bg-white text-[#2d3d2e] px-3 sm:px-4 text-xs min-[360px]:text-[12.5px] font-semibold transition-all shadow-2xs cursor-pointer active:scale-98 whitespace-nowrap"
                      >
                        <span>Detail</span>
                        <span className="hidden min-[380px]:inline"> Spesifikasi</span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </section>


          {/* ==================== SIMPLE MONUMENTAL EDITORIAL FOOTER ==================== */}
          <footer className="mt-14 bg-[#111a13] text-white pt-10 sm:pt-12 pb-[max(24px,env(safe-area-inset-bottom))] border-t border-white/10 overflow-hidden">
            <div className="mx-auto max-w-7xl px-2.5 min-[360px]:px-4 sm:px-6 lg:px-8">
              {/* Top Row: Clean Navigation & Tea Spotlight */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 pb-8 sm:pb-10 border-b border-white/10">
                {/* Brand Philosophy & Product Photo Note */}
                <div className="flex items-start sm:items-center gap-3 min-[360px]:gap-4 max-w-lg">
                  <div className="relative h-16 w-14 min-[360px]:h-20 min-[360px]:w-16 sm:h-22 sm:w-18 shrink-0 rounded-md overflow-hidden border border-white/20 shadow-md">
                    <Image
                      src="/foto-produk.jpeg"
                      alt="Verdantea Pure Green Tea 50g"
                      fill
                      quality={80}
                      loading="lazy"
                      className="object-cover"
                      sizes="90px"
                    />
                    <div className="absolute bottom-1 right-1 rounded-md bg-[#2d3d2e] px-1 py-0.2 text-[8px] font-bold text-white">
                      50g
                    </div>
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-md bg-[#253927] border border-white/10 px-2 min-[360px]:px-2.5 py-0.5 min-[360px]:py-1 text-[9px] min-[360px]:text-[11px] font-bold tracking-wider min-[360px]:tracking-widest text-[#a8c99a] uppercase mb-1 shadow-xs">
                      <Leaf className="h-3 w-3 min-[360px]:h-3.5 min-[360px]:w-3.5 text-[#a8c99a]" />
                      <span>SINGLE ORIGIN PURE TEA</span>
                    </div>
                    <h3 className="font-serif text-[16px] min-[360px]:text-[18px] sm:text-[20px] font-bold text-white tracking-tight">
                      Verdantea Pure Green Tea
                    </h3>
                    <p className="text-[11.5px] min-[360px]:text-[12px] sm:text-[12.5px] text-white/65 leading-relaxed mt-0.5">
                      Petikan pucuk pertama fajar Gunung Tilu 1.450 mdpl. Steam kilat mengunci rasa umami murni tanpa sepat.
                    </p>
                  </div>
                </div>

                {/* Direct Action Links & Quick Buy - Clean 2x2 on mobile, row on desktop */}
                <div className="grid grid-cols-2 md:flex md:items-center gap-2 md:gap-3 w-full md:w-auto text-xs min-[360px]:text-[13px]">
                  <button
                    onClick={() => scrollToSection("product-showcase")}
                    className="h-10 px-3 min-[360px]:px-4 flex items-center justify-center rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-white/85 hover:text-white transition-all whitespace-nowrap cursor-pointer"
                  >
                    <span>Kisah Daun</span>
                  </button>
                  <button
                    onClick={() => scrollToSection("ritual-seduh")}
                    className="h-10 px-3 min-[360px]:px-4 flex items-center justify-center rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-white/85 hover:text-white transition-all whitespace-nowrap cursor-pointer"
                  >
                    <span>Ritual Seduh</span>
                  </button>
                  <button
                    onClick={() => quickAddToCart(PRODUCTS_DATA[0])}
                    className="h-10 px-3 min-[360px]:px-4 flex items-center justify-center gap-1.5 rounded-md bg-[#6b8f5e] hover:bg-[#7ba36e] text-white font-bold transition-all shadow-xs whitespace-nowrap cursor-pointer active:scale-98"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
                    <span>+ Beli (15k)</span>
                  </button>
                  <a
                    href="https://wa.me/62895338558400?text=Halo%20Verdantea!%20Saya%20ingin%20konsultasi%20mengenai%20produk%20teh."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-3 min-[360px]:px-4 flex items-center justify-center gap-1.5 rounded-md border border-[#25d366]/40 bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#a8c99a] font-medium transition-all whitespace-nowrap"
                  >
                    <span>WhatsApp</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                  </a>
                </div>
              </div>

              {/* MONUMENTAL OVERSIZED BRAND TYPOGRAPHY: TULISAN VERDANTEA GEDE BANGET */}
              <div className="py-6 sm:py-12 select-none overflow-hidden">
                <div className="font-serif font-black tracking-[-0.04em] leading-[0.88] text-[clamp(26px,12.5vw,196px)] text-white/10 hover:text-white/16 transition-colors duration-500 text-center uppercase whitespace-nowrap will-change-transform">
                  VERDANTEA
                </div>
              </div>

              {/* Bottom Trust & Legal Strip */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] min-[360px]:text-xs text-white/50 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 min-[360px]:gap-2">
                  <span className="text-white/40 uppercase tracking-wider text-[9.5px] min-[360px]:text-[10px] font-semibold w-full sm:w-auto">
                    Pembayaran & Ekspedisi:
                  </span>
                  <span className="rounded-md bg-white/10 px-1.5 min-[360px]:px-2 py-0.5 text-white/75">BCA</span>
                  <span className="rounded-md bg-white/10 px-1.5 min-[360px]:px-2 py-0.5 text-white/75">Mandiri</span>
                  <span className="rounded-md bg-white/10 px-1.5 min-[360px]:px-2 py-0.5 text-white/75">QRIS</span>
                  <span className="rounded-md bg-white/10 px-1.5 min-[360px]:px-2 py-0.5 text-white/75">JNE</span>
                  <span className="rounded-md bg-white/10 px-1.5 min-[360px]:px-2 py-0.5 text-white/75">J&T</span>
                  <span className="rounded-md bg-white/10 px-1.5 min-[360px]:px-2 py-0.5 text-white/75">SiCepat</span>
                </div>

                <div className="text-[10px] min-[360px]:text-[11px] text-white/45">
                  © 2026 Verdantea Indonesia. Daun Teh Hijau Alami Gunung Tilu.
                </div>
              </div>
            </div>
          </footer>
        </main>

        {/* ==================== RADIX UI CART DRAWER ==================== */}
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetContent side="float" className="max-w-120 p-0 border border-black/10">
            <SheetHeader className="border-b border-black/5 px-4 min-[360px]:px-6 py-3.5 min-[360px]:py-4">
              <SheetTitle className="text-[17px] min-[360px]:text-[20px] font-bold tracking-tight text-[#1a2218]">
                Keranjang Belanja 🛒
              </SheetTitle>
              <SheetDescription className="sr-only">
                Daftar barang belanjaan di keranjang Verdantea
              </SheetDescription>
            </SheetHeader>

            <div className="max-h-[50vh] overflow-y-auto px-4 min-[360px]:px-6 py-3 min-[360px]:py-4">
              {cart.length === 0 ? (
                <div className="py-8 min-[360px]:py-12 text-center text-[#4a5a48]">
                  <div className="text-4xl min-[360px]:text-5xl mb-2 min-[360px]:mb-3">🛒</div>
                  <p className="text-[14px] min-[360px]:text-[15px] font-medium">Keranjangmu masih kosong</p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      scrollToSection("product-showcase");
                    }}
                    className="mt-3 min-[360px]:mt-4 rounded-md bg-[#2d3d2e] px-4 min-[360px]:px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#3d533e] cursor-pointer"
                  >
                    Lihat Produk Signature
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-black/5">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 min-[360px]:gap-3.5 py-3 min-[360px]:py-3.5">
                      <div className="relative h-12 w-12 min-[360px]:h-14 min-[360px]:w-14 shrink-0 overflow-hidden rounded-md bg-black/5 shadow-xs">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="60px"
                        />
                      </div>
                      <div className="flex-1 min-w-0 pr-1">
                        <div className="text-[13px] min-[360px]:text-[14px] font-semibold tracking-tight text-[#1a2218] truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] min-[360px]:text-[12px] text-[#4a5a48]">
                          {formatRp(item.price)} · {item.weight}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 min-[360px]:gap-2 shrink-0">
                        <button
                          onClick={() => changeQty(idx, -1)}
                          className="flex h-6 w-6 min-[360px]:h-7 min-[360px]:w-7 cursor-pointer items-center justify-center rounded-md bg-black/5 text-sm min-[360px]:text-base font-medium transition-colors hover:bg-black/10"
                        >
                          −
                        </button>
                        <span className="min-w-4 text-center text-[13px] min-[360px]:text-[14px] font-semibold text-[#1a2218]">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => changeQty(idx, 1)}
                          className="flex h-6 w-6 min-[360px]:h-7 min-[360px]:w-7 cursor-pointer items-center justify-center rounded-md bg-black/5 text-sm min-[360px]:text-base font-medium transition-colors hover:bg-black/10"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-black/5 p-4 min-[360px]:p-6 pt-3 min-[360px]:pt-4 pb-[max(16px,env(safe-area-inset-bottom))]">
                <div className="mb-3 min-[360px]:mb-4 flex items-center justify-between">
                  <span className="text-[13px] min-[360px]:text-[14px] text-[#4a5a48]">Total Belanja</span>
                  <span className="text-[18px] min-[360px]:text-[22px] font-bold tracking-tight text-[#1a2218]">
                    {formatRp(totalCartAmount)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full cursor-pointer rounded-md bg-[#2d3d2e] py-2.5 min-[360px]:py-3 text-center text-[13.5px] min-[360px]:text-[15px] font-semibold text-white shadow-xs transition-all hover:bg-[#3d533e] active:scale-98"
                >
                  Lanjut ke Pemesanan WhatsApp →
                </button>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* ==================== RADIX UI ORDER CHECKOUT MODAL ==================== */}
        <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <DialogContent className="w-[calc(100%-1rem)] min-[360px]:w-[calc(100%-1.5rem)] sm:w-full max-w-160 max-h-[90svh] overflow-y-auto rounded-lg bg-[#f9f6f0] p-3.5 min-[380px]:p-6 sm:p-7 border border-black/10 shadow-2xl pb-[max(24px,env(safe-area-inset-bottom))]">
            <div className="mx-auto mb-2 h-1 w-9 rounded-md bg-black/15 sm:hidden" />
            <DialogHeader className="text-left pb-1">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-[#2d3d2e] text-[#a8c99a] text-[9.5px] min-[360px]:text-[10.5px] font-mono tracking-wider min-[360px]:tracking-widest uppercase px-2 min-[360px]:px-2.5 py-1 mb-1.5 w-fit shadow-xs">
                <Leaf className="h-3 w-3" />
                <span>PEMESANAN TEH LANGSUNG</span>
              </div>
              <DialogTitle className="font-serif text-[18px] min-[360px]:text-[22px] sm:text-[24px] font-bold tracking-tight text-[#1a2218]">
                Konfirmasi Pesanan
              </DialogTitle>
              <DialogDescription className="text-[12px] min-[360px]:text-[13px] sm:text-[13.5px] text-[#4a5a48] leading-relaxed">
                Pesanan Anda akan diteruskan secara instan ke WhatsApp resmi Verdantea untuk diproses oleh kurator teh kami.
              </DialogDescription>
            </DialogHeader>

            {/* Order Item Preview Card */}
            <div className="my-3 min-[360px]:my-4 rounded-md border border-black/8 bg-white p-3 min-[360px]:p-4 shadow-2xs">
              <div className="text-[10px] min-[360px]:text-[11px] font-bold tracking-wider uppercase text-[#4a5a48] mb-2">
                Rincian Belanja ({totalCartCount} item)
              </div>
              <div className="space-y-2">
                {cart.map((i, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[12px] min-[360px]:text-[13px]">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <div className="relative h-8 w-8 min-[360px]:h-9 min-[360px]:w-9 shrink-0 rounded-md overflow-hidden bg-black/5 border border-black/5">
                        <Image
                          src={i.image}
                          alt={i.name}
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      </div>
                      <div className="truncate">
                        <span className="font-medium text-[#1a2218]">{i.name}</span>
                        <span className="text-[#4a5a48] text-[11px] ml-1">({i.weight})</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-[#4a5a48] mr-1.5">×{i.qty}</span>
                      <span className="font-semibold text-[#1a2218]">{formatRp(i.price * i.qty)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-black/8 pt-2.5 text-[13px] min-[360px]:text-[14.5px]">
                <span className="font-medium text-[#4a5a48]">Total Pembayaran</span>
                <span className="font-serif text-[16px] min-[360px]:text-[18px] font-bold text-[#2d3d2e]">{formatRp(totalCartAmount)}</span>
              </div>
            </div>

            <form onSubmit={submitOrder} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-[11px] min-[360px]:text-[11.5px] font-bold uppercase tracking-wider text-[#4a5a48]">
                    Nama Pemesan
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Nama lengkap penerima"
                    className="w-full rounded-md border border-black/12 bg-white px-3 py-2 min-[360px]:px-3.5 min-[360px]:py-2.5 text-base sm:text-[13.5px] text-[#1a2218] placeholder:text-black/35 outline-none transition-colors focus:border-[#2d3d2e]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-[11px] min-[360px]:text-[11.5px] font-bold uppercase tracking-wider text-[#4a5a48]">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full rounded-md border border-black/12 bg-white px-3 py-2 min-[360px]:px-3.5 min-[360px]:py-2.5 text-base sm:text-[13.5px] text-[#1a2218] placeholder:text-black/35 outline-none transition-colors focus:border-[#2d3d2e]"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-[11px] min-[360px]:text-[11.5px] font-bold uppercase tracking-wider text-[#4a5a48]">
                  Alamat Lengkap Pengiriman
                </label>
                <input
                  type="text"
                  required
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota & kode pos"
                  className="w-full rounded-md border border-black/12 bg-white px-3 py-2 min-[360px]:px-3.5 min-[360px]:py-2.5 text-base sm:text-[13.5px] text-[#1a2218] placeholder:text-black/35 outline-none transition-colors focus:border-[#2d3d2e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-[11px] min-[360px]:text-[11.5px] font-bold uppercase tracking-wider text-[#4a5a48]">
                    Pilihan Ekspedisi
                  </label>
                  <select
                    value={buyerShipping}
                    onChange={(e) => setBuyerShipping(e.target.value)}
                    className="w-full cursor-pointer rounded-md border border-black/12 bg-white px-3 py-2 min-[360px]:px-3.5 min-[360px]:py-2.5 text-base sm:text-[13.5px] text-[#1a2218] outline-none transition-colors focus:border-[#2d3d2e]"
                  >
                    <option value="JNE Regular (2-3 hari)">JNE Regular (2-3 hari)</option>
                    <option value="JNE YES (1 hari besok sampai)">JNE YES (1 hari besok sampai)</option>
                    <option value="J&T Express (2-3 hari)">J&T Express (2-3 hari)</option>
                    <option value="SiCepat REG (2-3 hari)">SiCepat REG (2-3 hari)</option>
                    <option value="GoSend / Grab Instant">GoSend / Grab Instant</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-[11px] min-[360px]:text-[11.5px] font-bold uppercase tracking-wider text-[#4a5a48]">
                    Catatan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={buyerNote}
                    onChange={(e) => setBuyerNote(e.target.value)}
                    placeholder="Instruksi pengiriman..."
                    className="w-full rounded-md border border-black/12 bg-white px-3 py-2 min-[360px]:px-3.5 min-[360px]:py-2.5 text-base sm:text-[13.5px] text-[#1a2218] placeholder:text-black/35 outline-none transition-colors focus:border-[#2d3d2e]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#2d3d2e] hover:bg-[#1a241b] py-3 min-[360px]:py-3.5 px-4 min-[360px]:px-6 text-[13px] min-[360px]:text-[14px] font-bold text-white shadow-xs transition-all active:scale-98"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#a8c99a] shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span>Lanjutkan ke WhatsApp Official</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
                <div className="mt-2.5 text-center text-[10px] min-[360px]:text-[11px] text-[#4a5a48] flex items-center justify-center gap-1.5 flex-wrap">
                  <span>🔒 Data aman & terenkripsi</span>
                  <span>•</span>
                  <span>Dikonfirmasi kurator teh Verdantea</span>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* ==================== RADIX UI PRODUCT DETAIL MODAL ==================== */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          {selectedProduct && (
            <DialogContent className="w-[calc(100%-1rem)] min-[360px]:w-[calc(100%-1.5rem)] sm:w-full max-w-180 max-h-[92svh] overflow-y-auto rounded-lg bg-[#f7f4ee] p-3.5 min-[380px]:p-5 sm:p-6 pb-[max(24px,env(safe-area-inset-bottom))]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start">
                {/* Product Image Box */}
                <div>
                  <div className="relative h-48 min-[360px]:h-56 sm:h-80 w-full overflow-hidden rounded-md bg-black/5">
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      fill
                      quality={85}
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 400px"
                    />
                    {selectedProduct.badge && (
                      <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 rounded-md bg-[#2d3d2e] px-2 py-0.5 text-[9px] min-[360px]:text-[10px] font-semibold uppercase tracking-wider text-white">
                        {selectedProduct.badge}
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] sm:text-xs text-[#4a5a48] px-1">
                    <span>Asal: {selectedProduct.origin}</span>
                    <span>Elevasi: {selectedProduct.elevation}</span>
                  </div>
                </div>

                {/* Product Specs & Purchasing */}
                <div>
                  <DialogHeader>
                    <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#6b8f5e]">
                      {selectedProduct.categoryLabel} · {selectedProduct.weight}
                    </div>
                    <DialogTitle className="text-[18px] min-[360px]:text-[20px] sm:text-[24px] font-bold tracking-tight text-[#1a2218] leading-tight">
                      {selectedProduct.name}
                    </DialogTitle>
                    <div className="mt-1.5 flex items-baseline gap-2">
                      <span className="text-[20px] min-[360px]:text-[22px] font-extrabold text-[#2d3d2e]">
                        {formatRp(selectedProduct.price)}
                      </span>
                      {selectedProduct.originalPrice && (
                        <span className="text-[12px] min-[360px]:text-[13px] text-[#4a5a48]/60 line-through">
                          {formatRp(selectedProduct.originalPrice)}
                        </span>
                      )}
                    </div>
                  </DialogHeader>

                  <p className="mt-2.5 text-[12px] min-[360px]:text-[13px] leading-relaxed text-[#4a5a48]">
                    {selectedProduct.desc}
                  </p>

                  {/* Tasting notes */}
                  <div className="mt-3.5">
                    <div className="text-[10.5px] min-[360px]:text-[11px] font-bold uppercase tracking-wider text-[#1a2218] mb-1.5">
                      Catatan Rasa (Tasting Notes):
                    </div>
                    <div className="flex flex-wrap gap-1 min-[360px]:gap-1.5">
                      {selectedProduct.tastingNotes.map((note, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-[#6b8f5e]/15 px-2 py-0.5 min-[360px]:px-2.5 min-[360px]:py-1 text-[10px] min-[360px]:text-[11px] font-medium text-[#2d3d2e]"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Brewing Quick Info */}
                  <div className="mt-3.5 rounded-md bg-black/5 p-2.5 min-[360px]:p-3 text-xs">
                    <div className="font-semibold text-[#1a2218] mb-1 text-[11px] min-[360px]:text-xs">Rekomendasi Seduh:</div>
                    <div className="grid grid-cols-3 gap-1 min-[360px]:gap-2 text-center text-[#4a5a48]">
                      <div>
                        <div className="font-bold text-[#1a2218] text-xs min-[360px]:text-[13px]">{selectedProduct.brewing.temp}</div>
                        <div className="text-[9px] min-[360px]:text-[10px]">Suhu Air</div>
                      </div>
                      <div>
                        <div className="font-bold text-[#1a2218] text-xs min-[360px]:text-[13px]">{selectedProduct.brewing.ratio}</div>
                        <div className="text-[9px] min-[360px]:text-[10px]">Rasio Daun</div>
                      </div>
                      <div>
                        <div className="font-bold text-[#1a2218] text-xs min-[360px]:text-[13px]">{selectedProduct.brewing.time}</div>
                        <div className="text-[9px] min-[360px]:text-[10px]">Waktu Seduh</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      quickAddToCart(selectedProduct);
                      setIsDetailOpen(false);
                    }}
                    className="mt-4 sm:mt-5 w-full cursor-pointer rounded-md bg-[#2d3d2e] py-2.5 min-[360px]:py-3 text-[13px] min-[360px]:text-[14px] font-semibold text-white shadow-xs transition-all hover:bg-[#3d533e] active:scale-98 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>+ Tambah ke Keranjang</span>
                  </button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>

        {/* ==================== FLOATING TOAST (TOP-CENTER BELOW STICKY HEADER) ==================== */}
        <div
          className={`fixed z-50 top-[max(64px,calc(env(safe-area-inset-top)+54px))] left-1/2 -translate-x-1/2 max-w-[calc(100%-2rem)] rounded-md bg-[#182419] border border-white/20 px-3.5 sm:px-5 py-2 sm:py-2.5 text-[12px] sm:text-[13px] font-semibold text-white shadow-2xl transition-all duration-300 ease-out flex items-center gap-2 sm:gap-2.5 whitespace-nowrap ${toastMessage ? "translate-y-0 opacity-100 scale-100" : "-translate-y-10 opacity-0 scale-95 pointer-events-none"
            }`}
        >
          <span className="flex h-2 w-2 rounded-full bg-[#a8c99a] animate-pulse" />
          <span className="truncate">{toastMessage}</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
