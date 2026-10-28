"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScrollManager } from "@/core/scroll/SmoothScrollManager";
import { X, ShoppingCart } from "lucide-react";

interface CartItem {
  name: string;
  price: number;
  emoji: string;
  qty: number;
}

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [navOpacity, setNavOpacity] = useState(1);
  const heroBgRef = useRef<HTMLDivElement | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    name: string;
    price: number;
    emoji: string;
    desc: string;
    image: string;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Checkout form state
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerShipping, setBuyerShipping] = useState("JNE REG");
  const [buyerNote, setBuyerNote] = useState("");

  // Load cart from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      try {
        const saved = localStorage.getItem("verdantea_cart");
        if (saved) {
          setCart(JSON.parse(saved));
        }
      } catch {
        // ignore
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Fade out hero nav on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        setNavOpacity(Math.max(0, 1 - (scrollY - 50) / 100));
      } else {
        setNavOpacity(1);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Parallax depth effect on hero background
  useEffect(() => {
    if (!heroBgRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(heroBgRef.current, {
        yPercent: 18,
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
      localStorage.setItem("verdantea_cart", JSON.stringify(updated));
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

  const quickAddToCart = (name: string, price: number, emoji: string) => {
    const existingIndex = cart.findIndex((i) => i.name === name);
    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cart];
      updated[existingIndex].qty += 1;
    } else {
      updated = [...cart, { name, price, emoji, qty: 1 }];
    }
    saveCart(updated);
    showToast(`${emoji} ${name} ditambahkan!`);
  };

  const changeQty = (idx: number, delta: number) => {
    const updated = [...cart];
    updated[idx].qty += delta;
    if (updated[idx].qty <= 0) {
      updated.splice(idx, 1);
    }
    saveCart(updated);
  };

  const openProductDetail = (name: string, price: number, emoji: string, desc: string, image: string) => {
    setSelectedProduct({ name, price, emoji, desc, image });
    setIsDetailOpen(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      SmoothScrollManager.getInstance().scrollTo(el, { offset: -20, duration: 1.2 });
    }
  };

  const notifyMe = (productName: string) => {
    const waMsg = `Halo Verdantea! 🍃\n\nSaya tertarik dengan produk *${productName}* yang akan segera rilis. Tolong beritahu saya saat sudah tersedia! 🙏`;
    const waNumber = "62895338558400";
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`, "_blank");
  };

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerPhone.trim() || !buyerAddress.trim()) {
      showToast("⚠️ Mohon lengkapi nama, no. WA, dan alamat");
      return;
    }

    const items = cart
      .map((i) => `• ${i.emoji} ${i.name} ×${i.qty} = ${formatRp(i.price * i.qty)}`)
      .join("\n");

    const msg = `Halo Verdantea! 🍃\n\nSaya ingin memesan:\n${items}\n\n💰 Total: ${formatRp(totalCartAmount)}\n\n👤 Nama: ${buyerName}\n📱 WA: ${buyerPhone}\n🏠 Alamat: ${buyerAddress}\n🚚 Ekspedisi: ${buyerShipping}${buyerNote ? `\n📝 Catatan: ${buyerNote}` : ""
      }\n\nMohon konfirmasinya, terima kasih!`;

    const waNumber = "62895338558400";
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;

    window.open(waUrl, "_blank");

    saveCart([]);
    setIsCheckoutOpen(false);
    showToast("✅ Pesanan dikirim ke WhatsApp!");
  };

  return (
    <div className="relative min-h-screen bg-[#e8e0d0] text-[#1a2218] font-sans selection:bg-[#6b8f5e] selection:text-white">
      {/* ==================== HERO SECTION ==================== */}
      <section
        id="hero"
        className="relative flex h-svh min-h-175 flex-col items-center justify-center px-6 overflow-hidden"
      >
        {/* Background image & gradient overlay with Ken Burns scale effect */}
        <div
          ref={heroBgRef}
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-8000 ease-out will-change-transform ${isLoaded ? "scale-100" : "scale-108"
            }`}
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(20,35,20,0.1) 0%, rgba(20,35,20,0.0) 25%, rgba(15,25,15,0.65) 70%, rgba(10,20,10,0.92) 100%), url('/hero-bg.jpeg')`,
          }}
        />

        {/* Noise overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 z-1"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Navigation */}
        <nav
          style={{ opacity: navOpacity }}
          className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 pt-[max(16px,env(safe-area-inset-top))] transition-opacity duration-300"
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("hero");
            }}
            className="flex items-center gap-2 text-white font-semibold text-lg tracking-tight no-underline"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 3C9 3 6 6 6 10C6 13.5 8 16.5 12 18C16 16.5 18 13.5 18 10C18 6 15 3 12 3Z"
                fill="rgba(255,255,255,0.9)"
              />
              <path
                d="M12 18V22"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M9 21H15"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Verdantea
          </a>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Keranjang"
              className="relative flex h-10.5 w-10.5 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-xl saturate-180 transition-all duration-200 hover:scale-105 hover:bg-white/25 active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#ff3b30] text-[10px] font-bold text-white shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* Hero content - Centered Vertically on Screen */}
        <div className="relative z-10 w-full max-w-135 px-4 text-center text-white my-auto pt-10">
          <div
            className={`transition-all duration-700 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              } mb-4 text-[11px] font-semibold uppercase tracking-[3px] text-white/70`}
          >
            Pure · Natural · Artisan
          </div>
          <h1
            className={`transition-all duration-800 delay-150 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              } mb-4 text-[clamp(42px,8vw,68px)] font-bold leading-[1.05] tracking-[-2px]`}
          >
            welcome to verdantea
          </h1>
          <p
            className={`transition-all duration-700 delay-300 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              } mx-auto max-w-120 mb-9 text-[15px] font-normal leading-[1.6] text-white/75`}
          >
            verdantea hadir sebagai bagian dari gaya hidup mindful
            <br />
            setiap produk kami dirancang untuk membawa ketenangan, kehangatan, dan harmoni dalam hidupmu.
          </p>
          <div
            className={`transition-all duration-700 delay-500 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              } flex flex-wrap justify-center gap-3`}
          >
            <button
              onClick={() => scrollToSection("shop")}
              className="cursor-pointer rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold tracking-[-0.2px] text-[#2d3d2e] shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] active:scale-95"
            >
              Shop Now
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="cursor-pointer rounded-full border border-white/30 bg-white/15 px-7 py-3.5 text-[15px] font-medium text-white backdrop-blur-xl transition-all duration-200 hover:bg-white/25 active:scale-95"
            >
              Our Story
            </button>
          </div>
        </div>

        {/* Scroll indicator - Bottom Center */}
        <div
          onClick={() => scrollToSection("shop")}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex cursor-pointer items-center justify-center text-white/50 transition-colors duration-200 hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 animate-bounce"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ==================== MAIN CONTENT (iOS Widget Style) ==================== */}
      <main id="main" className="relative bg-[#e8e0d0] min-h-screen pb-25">
        {/* iOS Dynamic Island Style Topbar */}
        <div className="sticky top-0 z-30 px-5 pt-4 pb-3 bg-linear-to-b from-[#e8e0d0]/95 to-transparent backdrop-blur-xs">
          <div className="mx-auto flex max-w-150 items-center justify-between rounded-full border border-white/15 bg-[#1e2d1c]/80 px-4 py-2.5 text-white backdrop-blur-xl saturate-180 shadow-lg shadow-black/5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-[#6b8f5e] to-[#2d3d2e] text-sm">
                🍃
              </div>
              <div>
                <div className="text-[14px] font-semibold text-white/95 leading-tight">
                  Verdantea Store
                </div>
                <div className="text-[11px] text-white/50 leading-tight">Green Tea Collection</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#a8c99a] animate-pulse-dot" />
              <span className="text-[12px] text-white/60">Online</span>
            </div>
          </div>
        </div>

        {/* Welcome Widget */}
        <div className="mx-auto max-w-170 px-4 py-2">
          <div className="rounded-[28px] border border-white/70 bg-white/55 p-6 backdrop-blur-xl saturate-180 shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] transition-transform duration-200">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#6b8f5e] to-[#2d3d2e] text-white shadow-md">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3C9 3 6 6 6 10C6 13.5 8 16.5 12 18C16 16.5 18 13.5 18 10C18 6 15 3 12 3Z"
                    fill="white"
                  />
                  <path
                    d="M12 18V22"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-[18px] font-bold tracking-tight text-[#1a2218]">
                  selamat datang di verdantea
                </h2>
                <p className="mt-1 text-[13px] leading-relaxed text-[#4a5a48]">
                  Teh hijau alami tanpa campuran, langsung dari kebun pilihan ke tanganmu.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mx-auto max-w-170 px-4 py-4" id="shop">
          <div className="mb-3.5 px-1 text-[20px] font-bold tracking-tight text-[#1a2218]">
            Produk Kami
          </div>

          <div className="overflow-visible">
            <div className="flex gap-3.5 overflow-x-auto scroll-smooth pb-4 px-1 -mx-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
              {/* Product 1: Green Tea 50gr */}
              <div
                onClick={() =>
                  openProductDetail(
                    "Green Tea 50gr",
                    15000,
                    "🍵",
                    "pure green tea leaves, full of natural goodness. dipetik pagi hari untuk aroma terbaik.",
                    "/foto-produk.jpeg"
                  )
                }
                className="group relative h-100 w-75 shrink-0 cursor-pointer overflow-hidden rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02]"
              >
                {/* Product Image */}
                <div className="absolute inset-0">
                  <Image
                    src="/foto-produk.jpeg"
                    alt="Green Tea"
                    fill
                    className="object-cover object-top"
                    sizes="300px"
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                {/* Indicator dots */}
                <div className="absolute top-[52%] left-1/2 -translate-x-1/2 flex gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
                </div>

                {/* Card body */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="flex items-baseline justify-between">
                    <div className="text-[22px] font-bold">green tea</div>
                    <div className="text-[14px] font-semibold text-white/90">Rp 15.000</div>
                  </div>
                  <div className="mt-1.5 text-[13px] leading-snug text-white/70 line-clamp-2">
                    pure green tea leaves, full of natural goodness. dipetik pagi hari untuk aroma terbaik.
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[#6b8f5e]/80 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-medium">
                      🌿 Organik
                    </span>
                    <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[11px]">
                      50g
                    </span>
                    <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[11px]">
                      top rated
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      quickAddToCart("green tea", 15000, "🍵");
                    }}
                    className="mt-3.5 w-full cursor-pointer rounded-full border border-white/20 bg-white/20 py-2.5 text-center text-[13px] font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/30"
                  >
                    + Tambah ke Keranjang
                  </button>
                </div>
              </div>

              {/* Coming Soon 1 */}
              <div className="relative flex h-100 w-75 shrink-0 flex-col justify-end overflow-hidden rounded-[28px] bg-linear-to-b from-white/10 to-black/60 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] before:absolute before:inset-0 before:bg-linear-to-t before:from-black/70 before:to-transparent before:content-['']">
                <div className="relative z-10">
                  <div className="text-3xl mb-2">🌸</div>
                  <div className="text-[11px] opacity-70">Coming Soon</div>
                  <div className="text-[20px] font-bold">???</div>
                  <div className="my-2 text-[13px] opacity-70">rilis eksklusif musim depan.</div>
                  <button
                    onClick={() => notifyMe("Edisi Spesial Musim")}
                    className="w-full cursor-pointer rounded-full border border-white/20 bg-white/10 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    🔔 Beritahu Aku
                  </button>
                </div>
              </div>

              {/* Coming Soon 2 */}
              <div className="relative flex h-100 w-75 shrink-0 flex-col justify-end overflow-hidden rounded-[28px] bg-linear-to-b from-white/10 to-black/60 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] before:absolute before:inset-0 before:bg-linear-to-t before:from-black/70 before:to-transparent before:content-['']">
                <div className="relative z-10">
                  <div className="text-3xl mb-2">🍋</div>
                  <div className="text-[11px] opacity-70">Coming Soon</div>
                  <div className="text-[20px] font-bold">???</div>
                  <div className="my-2 text-[13px] opacity-70">sempurna untuk relaksasi sore hari.</div>
                  <button
                    onClick={() => notifyMe("Varian Relaksasi Sore")}
                    className="w-full cursor-pointer rounded-full border border-white/20 bg-white/10 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    🔔 Beritahu Aku
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Widgets */}
        <div className="mx-auto max-w-170 px-4 py-4" id="contact">
          <div className="mb-3.5 px-1 text-[20px] font-bold tracking-tight text-[#1a2218]">
            Hubungi Kami
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* WhatsApp Widget */}
            <a
              href="https://wa.me/62895338558400?text=Halo%20Verdantea!%20Saya%20ingin%20memesan%20teh."
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-35 flex-col justify-between rounded-[28px] border border-[#25d366]/25 bg-[#25d366]/12 p-4.5 no-underline backdrop-blur-xl shadow-sm transition-transform duration-200 hover:-translate-y-1 active:scale-95"
            >
              <div>
                <div className="text-[28px] mb-2">💬</div>
                <div className="text-[16px] font-bold tracking-tight text-[#1a2218]">WhatsApp</div>
                <div className="text-[12px] text-[#4a5a48] mt-1">Chat langsung dengan kami</div>
              </div>
              <div className="self-start rounded-full bg-[#2d3d2e] px-2.5 py-1 text-[11px] font-semibold text-white mt-2">
                Buka Sekarang
              </div>
            </a>

            {/* Instagram Widget */}
            <a
              href="https://instagram.com/verandtea"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-35 flex-col justify-between rounded-[28px] border border-[#e1306c]/20 bg-[#e1306c]/10 p-4.5 no-underline backdrop-blur-xl shadow-sm transition-transform duration-200 hover:-translate-y-1 active:scale-95"
            >
              <div>
                <div className="text-[28px] mb-2">📸</div>
                <div className="text-[16px] font-bold tracking-tight text-[#1a2218]">Instagram</div>
                <div className="text-[12px] text-[#4a5a48] mt-1">Follow @verdantea</div>
              </div>
              <div className="self-start rounded-full bg-linear-to-br from-[#e1306c] to-[#833ab4] px-2.5 py-1 text-[11px] font-semibold text-white mt-2">
                Follow
              </div>
            </a>
          </div>
        </div>

        {/* About Widget */}
        <div className="mx-auto max-w-170 px-4 py-4" id="about">
          <div className="mb-3.5 px-1 text-[20px] font-bold tracking-tight text-[#1a2218]">
            Tentang Brand
          </div>

          <div className="rounded-[28px] border border-white/10 bg-linear-to-br from-[#2d3d2e]/90 to-[#1e2a1c]/95 p-6 text-white backdrop-blur-xl shadow-xl">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[2.5px] text-[#a8c99a]">
              Our Story
            </div>
            <div className="mb-3 text-[24px] font-bold tracking-tight">
              kemurnian alam, ruang untuk bernapas
            </div>
            <div className="text-[14px] leading-[1.7] text-white/65 space-y-3">
              <p>
                verdantea lahir dari keinginan untuk menghadirkan ketenangan di tengah ritme hidup yang cepat. kami percaya bahwa wellness hadir dalam hal-hal sederhana melalui suasana, ritual, dan pilihan kecil setiap hari.
              </p>
              <p>
                lebih dari sekadar produk, verdantea adalah tentang menciptakan pengalaman yang seimbang, estetis, dan mindful dalam setiap momen.
              </p>
            </div>

            <div className="my-5 h-px bg-white/10" />

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-[28px] font-extrabold tracking-tight text-white">100%</div>
                <div className="text-[11px] text-white/50 mt-0.5">Organik</div>
              </div>
              <div className="text-center">
                <div className="text-[28px] font-extrabold tracking-tight text-white">0</div>
                <div className="text-[11px] text-white/50 mt-0.5">Tambahan Kimia</div>
              </div>
              <div className="text-center">
                <div className="text-[28px] font-extrabold tracking-tight text-white">∞</div>
                <div className="text-[11px] text-white/50 mt-0.5">Manfaat</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mx-auto max-w-170 px-4 pt-6 pb-4 text-center">
          <div className="text-[18px] font-bold tracking-tight text-[#4a5a48]">
            🍃 Verdantea
          </div>
          <div className="mt-1.5 text-[12px] text-[#8a9e88] leading-relaxed">
            © 2025 Verdantea. Crafted with care.
            <br />
            Semua harga belum termasuk ongkir.
          </div>
        </div>
      </main>

      {/* ==================== CART DRAWER ==================== */}
      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      <div
        className={`fixed z-50 bottom-5 left-1/2 -translate-x-1/2 w-85 max-w-[calc(100%-32px)] rounded-3xl border border-white/45 bg-[#f5f0e8]/80 backdrop-blur-[30px] saturate-180 shadow-[0_16px_48px_rgba(0,0,0,0.22)] transition-all duration-400 ease-out sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:w-120 ${isCartOpen
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-[120%] opacity-0 pointer-events-none"
          }`}
      >
        <div className="mx-auto mt-3 h-1 w-9 rounded-full bg-black/15" />
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
          <div className="text-[20px] font-bold tracking-tight text-[#1a2218]">
            Keranjang 🛒
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/5 text-sm transition-colors hover:bg-black/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-[#4a5a48]">
              <div className="text-5xl mb-3">🛒</div>
              <p className="text-[15px]">Keranjangmu masih kosong</p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3.5 py-3.5">
                  <div className="flex h-12.5 w-12.5 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#6b8f5e] to-[#2d3d2e] text-2xl text-white">
                    {item.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-[15px] font-semibold tracking-tight text-[#1a2218]">
                      {item.name}
                    </div>
                    <div className="text-[13px] text-[#4a5a48]">{formatRp(item.price)}</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => changeQty(idx, -1)}
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/5 text-base font-medium transition-colors hover:bg-black/10"
                    >
                      −
                    </button>
                    <span className="min-w-5 text-center text-[15px] font-semibold text-[#1a2218]">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => changeQty(idx, 1)}
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/5 text-base font-medium transition-colors hover:bg-black/10"
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
          <div className="border-t border-black/5 p-6 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[15px] text-[#4a5a48]">Total</span>
              <span className="text-[22px] font-bold tracking-tight text-[#1a2218]">
                {formatRp(totalCartAmount)}
              </span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full cursor-pointer rounded-2xl bg-[#2d3d2e] py-3.5 text-center text-[16px] font-semibold text-white shadow-md transition-all hover:bg-[#4a6741] active:scale-98"
            >
              Lanjut Pesan →
            </button>
          </div>
        )}
      </div>

      {/* ==================== ORDER MODAL ==================== */}
      {isCheckoutOpen && (
        <div
          onClick={() => setIsCheckoutOpen(false)}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-170 max-h-[90svh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] bg-[#f5f0e8] p-6 pb-[max(32px,env(safe-area-inset-bottom))] shadow-2xl animate-in slide-in-from-bottom duration-300"
          >
            <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-black/15 sm:hidden" />
            <div className="flex items-center justify-between">
              <div className="text-[22px] font-bold tracking-tight text-[#1a2218]">
                Detail Pesanan 📦
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-1 mb-5 text-[14px] text-[#4a5a48]">
              Isi form berikut, pesanan akan dikonfirmasi via WhatsApp.
            </div>

            {/* Order Summary Box */}
            <div className="mb-5 rounded-xl bg-black/5 p-4 text-sm text-[#1a2218]">
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[#4a5a48]">
                Ringkasan Pesanan
              </div>
              {cart.map((i, idx) => (
                <div key={idx} className="flex justify-between py-1 text-[14px]">
                  <span>
                    {i.emoji} {i.name} ×{i.qty}
                  </span>
                  <span>{formatRp(i.price * i.qty)}</span>
                </div>
              ))}
              <div className="mt-2.5 flex justify-between border-t border-black/10 pt-2 text-[16px] font-bold">
                <span>Total Produk</span>
                <span>{formatRp(totalCartAmount)}</span>
              </div>
            </div>

            <form onSubmit={submitOrder} className="space-y-4">
              <div>
                <label className="block mb-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#4a5a48]">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Nama kamu"
                  className="w-full rounded-xl border border-transparent bg-black/5 px-4 py-3 text-[15px] text-[#1a2218] outline-none transition-colors focus:border-[#6b8f5e] focus:bg-white"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#4a5a48]">
                  No. WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-xl border border-transparent bg-black/5 px-4 py-3 text-[15px] text-[#1a2218] outline-none transition-colors focus:border-[#6b8f5e] focus:bg-white"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#4a5a48]">
                  Alamat Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  placeholder="Jalan, No. Rumah, Kota"
                  className="w-full rounded-xl border border-transparent bg-black/5 px-4 py-3 text-[15px] text-[#1a2218] outline-none transition-colors focus:border-[#6b8f5e] focus:bg-white"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#4a5a48]">
                  Ekspedisi
                </label>
                <select
                  value={buyerShipping}
                  onChange={(e) => setBuyerShipping(e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-transparent bg-black/5 px-4 py-3 text-[15px] text-[#1a2218] outline-none transition-colors focus:border-[#6b8f5e] focus:bg-white"
                >
                  <option value="JNE REG">JNE REG (2-3 hari)</option>
                  <option value="JNE YES">JNE YES (1 hari)</option>
                  <option value="J&T Express">J&T Express (2-3 hari)</option>
                  <option value="SiCepat REG">SiCepat REG (2-3 hari)</option>
                  <option value="Gosend Same Day">Gosend Same Day</option>
                </select>
              </div>

              <div>
                <label className="block mb-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#4a5a48]">
                  Catatan (opsional)
                </label>
                <input
                  type="text"
                  value={buyerNote}
                  onChange={(e) => setBuyerNote(e.target.value)}
                  placeholder="Warna, ukuran, atau pesan lainnya..."
                  className="w-full rounded-xl border border-transparent bg-black/5 px-4 py-3 text-[15px] text-[#1a2218] outline-none transition-colors focus:border-[#6b8f5e] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#25d366] py-4 text-[16px] font-semibold text-white shadow-md transition-all hover:bg-[#20ba5a] active:scale-98"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Pesan via WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== PRODUCT DETAIL MODAL ==================== */}
      {isDetailOpen && selectedProduct && (
        <div
          onClick={() => setIsDetailOpen(false)}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-120 rounded-t-[28px] sm:rounded-[28px] bg-[#f5f0e8] p-6 pb-[max(32px,env(safe-area-inset-bottom))] shadow-2xl animate-in slide-in-from-bottom duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[22px] font-bold tracking-tight text-[#1a2218]">
                  {selectedProduct.name}
                </h2>
                <p className="mt-1 text-[16px] font-semibold text-[#4a6741]">
                  {formatRp(selectedProduct.price)}
                </p>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/5 hover:bg-black/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative mt-4 h-52 w-full overflow-hidden rounded-2xl">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                className="object-cover"
                sizes="480px"
              />
            </div>

            <p className="mt-4 text-[14px] leading-relaxed text-[#4a5a48]">
              {selectedProduct.desc}
            </p>

            <button
              onClick={() => {
                quickAddToCart(selectedProduct.name, selectedProduct.price, selectedProduct.emoji);
                setIsDetailOpen(false);
              }}
              className="mt-6 w-full cursor-pointer rounded-2xl bg-[#2d3d2e] py-3.5 text-[15px] font-semibold text-white shadow-md transition-all hover:bg-[#4a6741] active:scale-98"
            >
              + Tambah ke Keranjang
            </button>
          </div>
        </div>
      )}

      {/* ==================== FLOATING TOAST ==================== */}
      <div
        className={`fixed z-50 bottom-[max(24px,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 rounded-full bg-[#2d3d2e] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-400 ease-out whitespace-nowrap ${toastMessage ? "translate-y-0 opacity-100" : "translate-y-25 opacity-0"
          }`}
      >
        {toastMessage}
      </div>
    </div>
  );
}
