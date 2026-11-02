"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ShoppingCart, Info, Leaf, Award } from "lucide-react";

interface LivingTeaChamberProps {
  onQuickAdd: () => void;
  onOpenDetail: () => void;
  priceFormatted: string;
}

/**
 * LivingTeaChamber: Authentic human-crafted artisanal studio showcase.
 * Displays the real Verdantea product photography (/foto-produk.jpeg) on an
 * editorial paper plinth with subtle tactile GSAP 3D perspective response,
 * genuine sommelier terroir metadata, and clean tactile purchase actions.
 * Zero AI slop, zero synthetic cartoon SVGs.
 */
export function LivingTeaChamber({
  onQuickAdd,
  onOpenDetail,
  priceFormatted,
}: LivingTeaChamberProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const imageBoxRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Subtle, tactile 3D perspective tilt on hover (grounded luxury physics, not cartoonish)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(cardRef.current, {
      rotateY: x * 0.025,
      rotateX: -y * 0.025,
      duration: 0.6,
      ease: "power2.out",
      transformPerspective: 900,
    });

    if (imageBoxRef.current) {
      gsap.to(imageBoxRef.current, {
        x: x * 0.015,
        y: y * 0.015,
        duration: 0.7,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.7,
      ease: "power2.out",
    });
    if (imageBoxRef.current) {
      gsap.to(imageBoxRef.current, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full justify-between">
      {/* Studio Showcase Plinth Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className={`relative w-full h-full rounded-lg border border-[#2d3d2e]/12 bg-[#f6f2ea] p-3.5 min-[380px]:p-5 sm:p-6 shadow-xs transition-shadow duration-400 flex flex-col justify-between ${isHovered ? "shadow-lg" : "shadow-xs"
          }`}
      >
        {/* Top Provenance & Terroir Header Strip */}
        <div className="flex items-center justify-between pb-2.5 min-[380px]:pb-3 border-b border-[#2d3d2e]/10 text-[#4a5a48] gap-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#5f7a5b]" />
            <span className="text-[9px] min-[360px]:text-[10px] sm:text-[10.5px] font-bold tracking-wider min-[360px]:tracking-[0.18em] uppercase text-[#2d3d2e] truncate">
              CIWIDEY • 1.450 MDPL
            </span>
          </div>
          <span className="text-[8.5px] min-[360px]:text-[9.5px] sm:text-[10px] font-mono tracking-wide min-[360px]:tracking-wider text-[#4a5a48]/80 uppercase shrink-0">
            FIRST FLUSH 2026
          </span>
        </div>

        {/* Studio Product Photograph Presentation (/foto-produk.jpeg) */}
        <div
          ref={imageBoxRef}
          className="relative my-3 min-[380px]:my-3.5 w-full aspect-[4/3.9] sm:aspect-4/4 rounded-md overflow-hidden bg-[#e9e3d5] border border-black/8 shadow-[0_10px_24px_rgba(30,45,30,0.08)] transition-transform duration-300"
        >
          <Image
            src="/foto-produk.jpeg"
            alt="Verdantea Pure Green Tea Pouch Asli"
            fill
            className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 480px"
            priority
            quality={85}
          />

          {/* Genuine Editorial Bottom Bar */}
          <div className="absolute bottom-2 left-2 right-2 min-[380px]:bottom-2.5 min-[380px]:left-2.5 min-[380px]:right-2.5 flex items-center justify-between rounded-md bg-black/65 px-2.5 min-[380px]:px-3 py-1 min-[380px]:py-1.5 text-white shadow-xs">
            <div className="flex items-center gap-1.5 text-[9px] min-[360px]:text-[10px] font-medium tracking-wide">
              <Leaf className="h-3 w-3 text-[#a8c99a]" />
              <span>100% Pucuk Peko Utuh</span>
            </div>
            <span className="font-mono text-[8.5px] min-[360px]:text-[9.5px] text-white/80">50g NET</span>
          </div>
        </div>

        {/* Product Identity & Sommelier Profile */}
        <div className="flex flex-col gap-1.5 min-[380px]:gap-2 mt-auto">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-serif text-[16px] min-[360px]:text-[18px] sm:text-[19px] font-bold tracking-tight text-[#1a2218] truncate">
                Verdantea Pure Green
              </h3>
              <p className="text-[10.5px] min-[360px]:text-[11.5px] text-[#556953] font-medium mt-0.5 truncate">
                Teh Hijau Murni Tanpa Fermentasi
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-serif text-[16px] min-[360px]:text-[18px] font-bold text-[#2d3d2e]">
                {priceFormatted}
              </div>
              <div className="text-[9.5px] min-[360px]:text-[10px] text-[#4a5a48]/60 line-through">
                Rp 22.000
              </div>
            </div>
          </div>

          {/* Sensory Terroir Chips */}
          <div className="flex flex-wrap gap-1 min-[360px]:gap-1.5 pt-1">
            <span className="rounded-md bg-[#e4ded0] px-2 min-[360px]:px-2.5 py-0.5 min-[360px]:py-1 text-[9px] min-[360px]:text-[10px] font-medium text-[#2d3d2e]">
              Embun Fajar
            </span>
            <span className="rounded-md bg-[#e4ded0] px-2 min-[360px]:px-2.5 py-0.5 min-[360px]:py-1 text-[9px] min-[360px]:text-[10px] font-medium text-[#2d3d2e]">
              Rasa Umami Alami
            </span>
            <span className="rounded-md bg-[#e4ded0] px-2 min-[360px]:px-2.5 py-0.5 min-[360px]:py-1 text-[9px] min-[360px]:text-[10px] font-medium text-[#2d3d2e]">
              Sepat Rendah
            </span>
          </div>
        </div>

        {/* Direct Action Buttons */}
        <div className="mt-3.5 min-[380px]:mt-4 flex items-center gap-2 min-[380px]:gap-2.5 pt-2.5 min-[380px]:pt-3 border-t border-[#2d3d2e]/10">
          <button
            onClick={onQuickAdd}
            className="flex-1 h-10 min-[380px]:h-10.5 flex items-center justify-center gap-1.5 rounded-md bg-[#2d3d2e] hover:bg-[#1f2b20] text-white px-2.5 min-[380px]:px-4 text-[11.5px] min-[360px]:text-[13px] font-bold transition-all shadow-xs active:scale-98 cursor-pointer whitespace-nowrap"
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0 text-[#a8c99a]" />
            <span>+ Beli (50g)</span>
          </button>

          <button
            onClick={onOpenDetail}
            className="h-10 min-[380px]:h-10.5 flex items-center justify-center gap-1.5 rounded-md border border-[#2d3d2e]/20 bg-white/90 hover:bg-white text-[#2d3d2e] px-3 min-[380px]:px-4 text-[11.5px] min-[360px]:text-[13px] font-semibold transition-all shadow-2xs cursor-pointer active:scale-98 shrink-0 whitespace-nowrap"
          >
            <Info className="h-3.5 w-3.5 shrink-0 text-[#4a5a48]" />
            <span>Detail</span>
          </button>
        </div>
      </div>

      {/* Sommelier Seal Caption */}
      <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#4a5a48] uppercase">
        <Award className="h-3 w-3 text-[#5f7a5b]" />
        <span>ARTISANAL SINGLE ORIGIN • INDONESIA</span>
      </div>
    </div>
  );
}
