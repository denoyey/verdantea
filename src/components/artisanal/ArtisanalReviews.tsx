"use client";

import React, { useState, useMemo } from "react";
import {
  Star,
  ThumbsUp,
  CheckCircle2,
  Leaf,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";

export interface ReviewItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  verifiedOrder: string;
  category: "hangat" | "coldbrew" | "catatan" | "repeat";
  categoryLabel: string;
  title: string;
  body: string;
  brewingDetail: string;
  helpfulCount: number;
}

const REVIEWS_DATA: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Clara S.",
    location: "Bandung Wetan, Jawa Barat",
    rating: 5,
    date: "28 Oktober 2026",
    verifiedOrder: "Pembelian Terverifikasi · 2 Pouch",
    category: "hangat",
    categoryLabel: "Seduhan Hangat 80°C",
    title: "Daunnya mekar sempurna, beda kelas dari teh hijau celup biasa",
    body: "Seduhan pertama langsung kecium wangi daun basah fajar yang segar. Daunnya bener-bener pucuk utuh mengembang di teko kaca, air seduhannya kuning kehijauan jernih tanpa residu ampas keruh. Rasa manis alaminya tahan lama di tenggorokan (aftertaste-nya manis lembut, bukan sepat pahit). Packaging ziplock-nya tebal jadi aromanya tetap terjaga.",
    brewingDetail: "Seduhan: Teko Kaca 150ml · Air 80°C · 90 Detik",
    helpfulCount: 24,
  },
  {
    id: "rev-2",
    name: "Bramantyo W.",
    location: "Jakarta Selatan",
    rating: 5,
    date: "2 November 2026",
    verifiedOrder: "Pembelian Terverifikasi · 1 Pouch",
    category: "coldbrew",
    categoryLabel: "Cold Brew Semalaman",
    title: "Metode cold brew-nya nagih buat teman kerja di meja kantor",
    body: "Saya coba rendam 4 gram di botol tumbler kaca isi 350ml air mineral dingin, simpan di kulkas semalaman (sekitar 8 jam). Paginya dibawa ke kantor—rasanya luar biasa smooth, manis alami, segar banget tanpa perlu gula sama sekali. Rasa sepatnya hampir nol tapi karakter umaminya tetap keluar. Pasti repeat order.",
    brewingDetail: "Seduhan: Tumbler Kaca · Chiller Kulkas 8 Jam",
    helpfulCount: 19,
  },
  {
    id: "rev-3",
    name: "dr. Maya Anggraini",
    location: "Sleman, D.I. Yogyakarta",
    rating: 5,
    date: "19 Oktober 2026",
    verifiedOrder: "Pembelian Terverifikasi · 3 Pouch",
    category: "catatan",
    categoryLabel: "Catatan Rasa & Aroma",
    title: "Karakter single origin Gunung Tilu terasa clean dan menenangkan",
    body: "Sebagai penikmat sencha dan teh hijau lokal, Verdantea ini salah satu yang petikan daun pucuknya paling rapi dan konsisten. Yang bikin takjub daunnya bisa diseduh sampai 3 kali—seduhan kedua malah aroma floral rerumputannya makin halus. Sangat mindful dinikmati sambil baca buku sore di teras rumah.",
    brewingDetail: "Seduhan: Cangkir Keramik Tradisional · 3x Infusi",
    helpfulCount: 31,
  },
  {
    id: "rev-4",
    name: "Hendra Kurnia",
    location: "Surabaya Barat",
    rating: 4.8,
    date: "12 Oktober 2026",
    verifiedOrder: "Pembelian Terverifikasi · 1 Pouch",
    category: "repeat",
    categoryLabel: "Repeat Order",
    title: "Kualitas daun istimewa, usul varian kaleng tin 100g",
    body: "Pengiriman ke Surabaya cepat, bubble wrap tebal dan daun teh nggak ada yang remuk sama sekali. Untuk harga 15 ribu ini kualitasnya sangat di atas ekspektasi. Satu masukan konstruktif untuk tim Verdantea: semoga nanti dibuatkan varian kaleng tin kedap udara isi 100g atau 200g sekalian, biar bisa stok banyak di pantry kantor.",
    brewingDetail: "Pengiriman: JNE REG · 2 Hari Sampai Rapi",
    helpfulCount: 14,
  },
  {
    id: "rev-5",
    name: "Aisyah Nurul",
    location: "Tangerang Selatan",
    rating: 5,
    date: "5 Oktober 2026",
    verifiedOrder: "Pembelian Terverifikasi · 1 Pouch",
    category: "hangat",
    categoryLabel: "Seduhan Hangat 80°C",
    title: "Ramah di lambung, aroma relaksasinya bikin rileks pikiran",
    body: "Punya riwayat lambung sensitif kalau minum teh hijau komersial yang terlalu pekat atau banyak serbuk kasarnya. Tapi Verdantea ini waktu diseduh air 75°C terasa sangat lembut, tidak mengiritasi lambung sama sekali walau diminum pagi hari sebelum sarapan berat. Wanginya harum menenangkan.",
    brewingDetail: "Seduhan: Teko Porselen · 75°C 90 Detik",
    helpfulCount: 18,
  },
  {
    id: "rev-6",
    name: "Rian Ardiansyah",
    location: "Semarang, Jawa Tengah",
    rating: 5,
    date: "24 September 2026",
    verifiedOrder: "Pembelian Terverifikasi · 2 Pouch",
    category: "coldbrew",
    categoryLabel: "Cold Brew Semalaman",
    title: "Daun mekar utuh, ampasnya bersih mudah dibilas",
    body: "Sesuai dengan foto produk aslinya, daun teh utuh bukan serbuk debu fannings. Waktu disaring ampas daunnya mekar rapi dan air seduhannya jernih kekuningan seperti giok. Rasa gurih manis alaminya bertahan di lidah cukup lama. Sudah order ulang 2 pouch buat persediaan di rumah.",
    brewingDetail: "Seduhan: Teko Infuser Stainless Steel",
    helpfulCount: 11,
  },
];

interface ArtisanalReviewsProps {
  onQuickOrderClick?: () => void;
}

export function ArtisanalReviews({ onQuickOrderClick }: ArtisanalReviewsProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState(false);

  const filterTabs = [
    { id: "all", label: "Semua Ulasan", count: 142 },
    { id: "hangat", label: "Seduhan Hangat 80°C", count: 86 },
    { id: "coldbrew", label: "Cold Brew", count: 34 },
    { id: "catatan", label: "Catatan Rasa & Aroma", count: 14 },
    { id: "repeat", label: "Repeat Order", count: 8 },
  ];

  const filteredReviews = useMemo(() => {
    if (activeFilter === "all") return REVIEWS_DATA;
    return REVIEWS_DATA.filter((r) => r.category === activeFilter);
  }, [activeFilter]);

  const displayedReviews = showAll ? filteredReviews : filteredReviews.slice(0, 4);

  const handleHelpfulClick = (id: string, initialCount: number) => {
    if (hasVoted[id]) return;
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialCount) + 1,
    }));
    setHasVoted((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  return (
    <section id="ulasan" className="relative scroll-mt-20 py-8 sm:py-12">
      {/* Section Header */}
      <div className="mb-6 sm:mb-8 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-[#253927] border border-white/10 px-2.5 min-[360px]:px-3 py-1 text-[9.5px] min-[360px]:text-[10.5px] font-bold tracking-wider min-[360px]:tracking-widest text-[#a8c99a] uppercase shadow-xs mb-2.5">
          <Leaf className="h-3 w-3 text-[#a8c99a]" />
          <span>ULASAN PENIKMAT TEH VERDANTEA</span>
        </div>
        <h2 className="font-serif text-[22px] min-[360px]:text-[26px] sm:text-[32px] font-bold text-[#1a2218] tracking-tight">
          Pengalaman Nyata Menyeduh Daun Peko Murni
        </h2>
        <p className="text-[12px] min-[360px]:text-[13.5px] sm:text-[14.5px] text-[#4a5a48] leading-relaxed max-w-2xl mx-auto mt-1.5 sm:mt-2 px-2">
          Kumpulan impresi aroma, kejernihan seduhan, dan sensasi umami manis alami dari kurasi 142 pesanan pembeli asli Verdantea Signature Pure Green Tea.
        </p>
      </div>

      {/* Sommelier Rating & Sensory Metrics Dashboard */}
      <div className="rounded-lg border border-black/8 bg-[#efe8dc] p-3.5 min-[380px]:p-5 sm:p-7 shadow-xs mb-6 sm:mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
          {/* Column 1: Overall Score Badge (Kinfolk / Editorial Style) */}
          <div className="lg:col-span-4 flex flex-col justify-center items-center text-center p-4 sm:p-5 rounded-md border border-black/6 bg-white/80 shadow-2xs">
            <span className="text-[10px] min-[360px]:text-[11px] font-mono uppercase tracking-widest text-[#5f7a5b] font-bold mb-1">
              SKOR KEPUASAN RASA
            </span>
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="font-serif text-5xl sm:text-6xl font-bold text-[#1a2218] tracking-tight">
                4.9
              </span>
              <span className="text-lg sm:text-xl text-[#4a5a48] font-serif font-medium">
                / 5.0
              </span>
            </div>

            {/* Stars row */}
            <div className="flex items-center gap-1 my-1.5 text-[#b8934a]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 sm:h-4.5 sm:w-4.5 fill-[#b8934a]"
                />
              ))}
            </div>

            <p className="text-[11.5px] sm:text-[12.5px] text-[#2d3d2e] font-semibold mt-1">
              142 Ulasan Terverifikasi
            </p>
            <p className="text-[10.5px] sm:text-[11px] text-[#4a5a48] mt-0.5 leading-tight">
              98% pembeli merekomendasikan untuk seduhan harian
            </p>

            <div className="mt-3 pt-3 border-t border-black/6 w-full flex items-center justify-center gap-1.5 text-[10px] min-[360px]:text-[10.5px] text-[#5f7a5b] font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-[#5f7a5b] shrink-0" />
              <span>Diverifikasi dari Pemesanan WhatsApp Resmi</span>
            </div>
          </div>

          {/* Column 2: Sommelier Sensory Parameter Index */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-2.5 sm:space-y-3 p-4 sm:p-5 rounded-md border border-black/6 bg-white/80 shadow-2xs">
            <div className="text-[10.5px] min-[360px]:text-[11.5px] font-mono uppercase tracking-wider text-[#2d3d2e] font-bold flex items-center justify-between pb-1 border-b border-black/6">
              <span>PARAMETER MUTU SEDUHAN</span>
              <span className="text-[#5f7a5b]">HASIL KURASI</span>
            </div>

            {/* Metric 1 */}
            <div>
              <div className="flex justify-between text-[11px] min-[360px]:text-[12px] font-medium text-[#1a2218] mb-1">
                <span>Aroma Segar Daun Basah Fajar</span>
                <span className="font-semibold text-[#2d3d2e]">4.9 · 98%</span>
              </div>
              <div className="h-1.5 w-full bg-[#e8e0d0] rounded-full overflow-hidden">
                <div className="h-full bg-[#5f7a5b] rounded-full w-[98%]" />
              </div>
            </div>

            {/* Metric 2 */}
            <div>
              <div className="flex justify-between text-[11px] min-[360px]:text-[12px] font-medium text-[#1a2218] mb-1">
                <span>Keseimbangan Umami & Manis Alami</span>
                <span className="font-semibold text-[#2d3d2e]">4.8 · 96%</span>
              </div>
              <div className="h-1.5 w-full bg-[#e8e0d0] rounded-full overflow-hidden">
                <div className="h-full bg-[#5f7a5b] rounded-full w-[96%]" />
              </div>
            </div>

            {/* Metric 3 */}
            <div>
              <div className="flex justify-between text-[11px] min-[360px]:text-[12px] font-medium text-[#1a2218] mb-1">
                <span>Keutuhan Daun Peko (Bukan Serbuk)</span>
                <span className="font-semibold text-[#2d3d2e]">5.0 · 100%</span>
              </div>
              <div className="h-1.5 w-full bg-[#e8e0d0] rounded-full overflow-hidden">
                <div className="h-full bg-[#2d3d2e] rounded-full w-full" />
              </div>
            </div>

            {/* Metric 4 */}
            <div>
              <div className="flex justify-between text-[11px] min-[360px]:text-[12px] font-medium text-[#1a2218] mb-1">
                <span>Ketahanan Seduh Ulang (Hingga 3x)</span>
                <span className="font-semibold text-[#2d3d2e]">4.9 · 98%</span>
              </div>
              <div className="h-1.5 w-full bg-[#e8e0d0] rounded-full overflow-hidden">
                <div className="h-full bg-[#5f7a5b] rounded-full w-[98%]" />
              </div>
            </div>
          </div>

          {/* Column 3: Star Breakdown Bars */}
          <div className="lg:col-span-3 flex flex-col justify-center space-y-1.5 p-4 sm:p-5 rounded-md border border-black/6 bg-white/80 shadow-2xs">
            <span className="text-[10px] min-[360px]:text-[11px] font-mono uppercase tracking-wider text-[#4a5a48] font-bold mb-1">
              DISTRIBUSI BINTANG
            </span>

            {[
              { stars: 5, count: 131, pct: "92%" },
              { stars: 4, count: 10, pct: "7%" },
              { stars: 3, count: 1, pct: "1%" },
              { stars: 2, count: 0, pct: "0%" },
              { stars: 1, count: 0, pct: "0%" },
            ].map((row) => (
              <div key={row.stars} className="flex items-center gap-2 text-[11px] text-[#4a5a48]">
                <span className="w-4 font-mono font-bold text-[#1a2218]">{row.stars}★</span>
                <div className="flex-1 h-1.5 bg-[#e8e0d0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#b8934a] rounded-full transition-all duration-500"
                    style={{ width: row.pct }}
                  />
                </div>
                <span className="w-7 text-right font-mono text-[10px] text-[#4a5a48]/80">
                  {row.count}
                </span>
              </div>
            ))}

            <div className="pt-2 text-[10px] text-[#4a5a48] leading-tight">
              Tercatat dari formulir evaluasi pemesan 2026.
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs Strip */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-5 sm:mb-6 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveFilter(tab.id);
                setShowAll(false);
              }}
              className={`px-3 py-1.5 rounded-md text-[11px] min-[360px]:text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${isActive
                  ? "bg-[#2d3d2e] text-white border-[#2d3d2e] shadow-xs"
                  : "bg-white/70 hover:bg-white text-[#4a5a48] border-black/8 hover:text-[#1a2218]"
                }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-md ${isActive ? "bg-white/20 text-white" : "bg-black/5 text-[#4a5a48]"
                  }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Customer Reviews Cards Grid (2 Columns on Tablet/Desktop, 1 Column on Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4.5 mb-6 sm:mb-8">
        {displayedReviews.map((rev) => {
          const currentHelpful = helpfulVotes[rev.id] ?? rev.helpfulCount;
          const isVoted = hasVoted[rev.id] ?? false;

          return (
            <div
              key={rev.id}
              className="flex flex-col justify-between rounded-md border border-black/8 bg-white/85 p-4 sm:p-5 shadow-2xs transition-all duration-300 hover:shadow-xs hover:border-black/15"
            >
              <div>
                {/* Reviewer Header: Name, Location, Date & Verified Tag */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-[15px] sm:text-[16px] font-bold text-[#1a2218]">
                        {rev.name}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-[#eaf2e8] text-[#2d522a] border border-[#a8c99a]/40 px-1.5 py-0.2 text-[9.5px] font-semibold">
                        <CheckCircle2 className="h-3 w-3 text-[#2d522a]" />
                        <span>Terverifikasi</span>
                      </span>
                    </div>
                    <div className="text-[10.5px] text-[#4a5a48] font-mono mt-0.5">
                      {rev.location} · {rev.date}
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-[#b8934a] shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < Math.floor(rev.rating)
                            ? "fill-[#b8934a] text-[#b8934a]"
                            : rev.rating % 1 !== 0 && i === Math.floor(rev.rating)
                              ? "fill-[#b8934a]/60 text-[#b8934a]"
                              : "text-black/20"
                          }`}
                      />
                    ))}
                    <span className="ml-1 text-[11px] font-mono font-bold text-[#1a2218]">
                      {rev.rating.toFixed(rev.rating % 1 === 0 ? 0 : 1)}
                    </span>
                  </div>
                </div>

                {/* Subtag / Category & Verified Purchase Pill */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  <span className="text-[9.5px] font-mono uppercase tracking-wider text-[#5f7a5b] bg-[#eef4ec] px-2 py-0.5 rounded-md font-semibold">
                    {rev.categoryLabel}
                  </span>
                  <span className="text-[9.5px] text-[#4a5a48] bg-black/4 px-2 py-0.5 rounded-md font-mono">
                    {rev.verifiedOrder}
                  </span>
                </div>

                {/* Review Title */}
                <h3 className="font-serif text-[14px] sm:text-[15px] font-bold text-[#1a2218] leading-snug mb-1.5">
                  &ldquo;{rev.title}&rdquo;
                </h3>

                {/* Review Body */}
                <p className="text-[12px] sm:text-[12.5px] text-[#334232] leading-relaxed">
                  {rev.body}
                </p>
              </div>

              {/* Bottom Meta & Helpful Button */}
              <div className="mt-3.5 pt-3 border-t border-black/6 flex items-center justify-between text-[11px] text-[#4a5a48] gap-2">
                <span className="text-[10px] sm:text-[10.5px] text-[#5f7a5b] font-mono truncate">
                  {rev.brewingDetail}
                </span>

                <button
                  type="button"
                  onClick={() => handleHelpfulClick(rev.id, rev.helpfulCount)}
                  disabled={isVoted}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-medium transition-all cursor-pointer ${isVoted
                      ? "bg-[#eaf2e8] text-[#2d522a] border border-[#a8c99a]/50"
                      : "bg-black/4 hover:bg-black/8 text-[#4a5a48] hover:text-[#1a2218] active:scale-95"
                    }`}
                  aria-label="Tandai ulasan membantu"
                >
                  {isVoted ? (
                    <>
                      <Check className="h-3 w-3 text-[#2d522a]" />
                      <span>Membantu ({currentHelpful})</span>
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="h-3 w-3" />
                      <span>Membantu ({currentHelpful})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand More / Show Less Button */}
      {filteredReviews.length > 4 && (
        <div className="text-center mb-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="h-10 px-5 inline-flex items-center justify-center gap-1.5 rounded-md border border-[#2d3d2e]/25 bg-white/90 hover:bg-white text-[#2d3d2e] text-xs sm:text-[13px] font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-98 cursor-pointer"
          >
            <span>{showAll ? "Tampilkan Lebih Sedikit" : `Lihat Semua ${filteredReviews.length} Ulasan`}</span>
            <ArrowRight
              className={`h-3.5 w-3.5 transition-transform duration-200 ${showAll ? "-rotate-90" : "rotate-90"
                }`}
            />
          </button>
        </div>
      )}

      {/* Human Callout: Bagikan Pengalaman Seduh Anda (WhatsApp Curator Direct) */}
      <div className="rounded-lg border border-[#2d3d2e]/20 bg-[#f4eee2] p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-3 text-center sm:text-left">
          <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#2d3d2e] text-[#a8c99a]">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="font-serif text-[15px] sm:text-[17px] font-bold text-[#1a2218]">
              Sudah Pernah Menyeduh Verdantea?
            </div>
            <p className="text-[11.5px] sm:text-[12.5px] text-[#4a5a48] leading-relaxed mt-0.5">
              Bagikan catatan aroma seduhan Anda atau konsultasikan rasio seduh langsung dengan kurator teh kami di WhatsApp Resmi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
          <a
            href="https://wa.me/6281234567890?text=Halo%20Verdantea,%20saya%20ingin%20berbagi%20ulasan%20dan%20catatan%20seduhan%20Verdantea%20Pure%20Green%20Tea."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none h-10.5 px-4 rounded-md border border-[#2d3d2e]/25 bg-white hover:bg-white/90 text-[#2d3d2e] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-98"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Kirim Ulasan Rasa</span>
          </a>

          {onQuickOrderClick && (
            <button
              onClick={onQuickOrderClick}
              className="flex-1 sm:flex-none h-10.5 px-4.5 rounded-md bg-[#2d3d2e] hover:bg-[#1a241b] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <span>Pesan Sekarang (15k)</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#a8c99a]" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

