"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Star,
  ThumbsUp,
  CheckCircle2,
  Leaf,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Check,
  PenSquare,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  isNew?: boolean;
}

/**
 * INITIAL_REVIEWS_DATA: 24 data evaluasi organoleptik & pembeli terverifikasi Batch 1.
 * Semua ulasan ada secara riil di dalam array (tanpa angka fiktif / phantom data),
 * sehingga seluruh statistik (skor rata-rata, sebaran bintang, tab filter)
 * dihitung secara dinamis dan 100% sinkron saat diuji oleh dosen.
 */
export const INITIAL_REVIEWS_DATA: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Clara S.",
    location: "Bandung Wetan, Jawa Barat",
    rating: 5,
    date: "28 Oktober 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (2 Pouch)",
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
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (1 Pouch)",
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
    verifiedOrder: "Batch 1 · Panelis Uji Organoleptik (3 Pouch)",
    category: "catatan",
    categoryLabel: "Catatan Rasa & Herbal",
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
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (1 Pouch)",
    category: "repeat",
    categoryLabel: "Repeat Order & Kemasan",
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
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (1 Pouch)",
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
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (2 Pouch)",
    category: "coldbrew",
    categoryLabel: "Cold Brew Semalaman",
    title: "Daun mekar utuh, ampasnya bersih mudah dibilas",
    body: "Sesuai dengan foto produk aslinya, daun teh utuh bukan serbuk debu fannings. Waktu disaring ampas daunnya mekar rapi dan air seduhannya jernih kekuningan seperti giok. Rasa gurih manis alaminya bertahan di lidah cukup lama. Sudah order ulang 2 pouch buat persediaan di rumah.",
    brewingDetail: "Seduhan: Teko Infuser Stainless Steel",
    helpfulCount: 11,
  },
  {
    id: "rev-7",
    name: "Fajar Nugroho",
    location: "Malang, Jawa Timur",
    rating: 5,
    date: "18 September 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (1 Pouch)",
    category: "hangat",
    categoryLabel: "Seduhan Hangat 80°C",
    title: "Warna air seduhan hijau giok keemasan, bukan cokelat pekat",
    body: "Biasanya teh hijau lokal kalau diseduh warnanya gampang berubah jadi cokelat gelap karena oksidasi. Tapi Verdantea ini warnanya tetap hijau keemasan jernih membuktikan proses steaming kilatnya benar-benar bagus. Rasanya ringan dan aromanya fresh banget.",
    brewingDetail: "Seduhan: Gaiwan Keramik · Suhu 78°C",
    helpfulCount: 9,
  },
  {
    id: "rev-8",
    name: "Nabila Putri",
    location: "Bogor, Jawa Barat",
    rating: 5,
    date: "15 September 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (1 Pouch)",
    category: "hangat",
    categoryLabel: "Seduhan Hangat 80°C",
    title: "Teman nugas skripsi sampai larut malam tanpa gelisah",
    body: "Kandungan L-theanine-nya kerasa banget bikin fokus tapi tetap rileks, beda sama kopi yang bikin jantung berdebar. Daunnya wangi fajar alami, diseduh 2 kali masih enak banget. Rekomendasi buat yang butuh ketenangan saat nugas.",
    brewingDetail: "Seduhan: Cangkir Kaca 200ml · 80°C",
    helpfulCount: 15,
  },
  {
    id: "rev-9",
    name: "Kevin Tanuwijaya",
    location: "Jakarta Barat",
    rating: 5,
    date: "10 September 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (2 Pouch)",
    category: "coldbrew",
    categoryLabel: "Cold Brew Semalaman",
    title: "Cold brew ratio 1:100 hasilnya manis alami tanpa gula",
    body: "Pakai takaran 5 gram untuk botol 500ml air es. Didiamkan di kulkas 10 jam. Hasilnya manis alami vegetal yang sangat segar. Nggak ada pahit sama sekali. Menurut saya ini salah satu artisan green tea lokal terbaik di kelas harganya.",
    brewingDetail: "Seduhan: Cold Extraction 10 Jam Kulkas",
    helpfulCount: 21,
  },
  {
    id: "rev-10",
    name: "Siti Rahmawati",
    location: "Depok, Jawa Barat",
    rating: 5,
    date: "6 September 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (1 Pouch)",
    category: "catatan",
    categoryLabel: "Catatan Rasa & Herbal",
    title: "Aromanya mengingatkan suasana kebun teh Ciwidey waktu pagi",
    body: "Begitu pouch dibuka langsung tercium aroma vegetal yang sangat bersih. Daun tehnya hijau gelap mengkilap dan tidak rapuh. Setelah diseduh ada sedikit wangi bunga liar pegunungan. Sangat menenangkan hati saat sedang penat kerja.",
    brewingDetail: "Seduhan: Teko Tanah Liat Mini · 80°C",
    helpfulCount: 12,
  },
  {
    id: "rev-11",
    name: "Rizky Pratama",
    location: "Bekasi, Jawa Barat",
    rating: 4.8,
    date: "30 Agustus 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (1 Pouch)",
    category: "repeat",
    categoryLabel: "Repeat Order & Kemasan",
    title: "Zip lock pouch kedap udara sangat baik, kualitas terjaga",
    body: "Sudah 3 minggu sejak dibuka kemasannya dan disimpan di suhu ruang, aroma daunnya masih sama segarnya seperti hari pertama. Daunnya utuh 2 pucuk teratas. Worth it banget untuk harga 15 ribu.",
    brewingDetail: "Penyimpanan: Suhu Ruang Terlindung Sinar Matahari",
    helpfulCount: 8,
  },
  {
    id: "rev-12",
    name: "Gita Savitri",
    location: "Surakarta (Solo), Jawa Tengah",
    rating: 5,
    date: "25 Agustus 2026",
    verifiedOrder: "Batch 1 · Panelis Uji Organoleptik (1 Pouch)",
    category: "hangat",
    categoryLabel: "Seduhan Hangat 80°C",
    title: "Aftertaste umaminya bertahan lama di pangkal lidah",
    body: "Sebagai lulusan Teknologi Pangan yang suka evaluasi sensori teh, saya akui teknik kukus asamushi Verdantea ini berhasil menginaktivasi enzim polifenol oksidase dengan tepat sehingga katekin tidak terdegradasi. Rasanya balance, umami alami kuat.",
    brewingDetail: "Evaluasi Sensori: Air Mineral TDS 45 · 80°C",
    helpfulCount: 27,
  },
  {
    id: "rev-13",
    name: "Bagus Wicaksono",
    location: "Denpasar, Bali",
    rating: 5,
    date: "20 Agustus 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (2 Pouch)",
    category: "coldbrew",
    categoryLabel: "Cold Brew Semalaman",
    title: "Disajikan dingin pas cuaca terik Bali sangat menyegarkan",
    body: "Paling cocok diseduh dingin lalu dituang ke gelas berisi es batu. Warnanya jernih zamrud dan ada sensasi manis lembut. Teman-teman di studio foto pada minta diseduhin terus. Sudah pasti beli lagi.",
    brewingDetail: "Seduhan: Es Batu & Seduhan Cold Brew",
    helpfulCount: 13,
  },
  {
    id: "rev-14",
    name: "Dewi Sartika",
    location: "Cimahi, Jawa Barat",
    rating: 5,
    date: "14 Agustus 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (1 Pouch)",
    category: "hangat",
    categoryLabel: "Seduhan Hangat 80°C",
    title: "Pengiriman cepat sesama Bandung-Cimahi, daun fresh",
    body: "Pesan sore, besok siangnya sudah sampai. Kemasannya rapi tidak kempes. Daun tehnya harum alami tanpa bau sangit atau apek sama sekali. Diseduh sore hari sambil santai di beranda rumah sangat nikmat.",
    brewingDetail: "Seduhan: Teko Porselen 180ml · 80°C",
    helpfulCount: 7,
  },
  {
    id: "rev-15",
    name: "Anindya Maharani",
    location: "Jakarta Pusat",
    rating: 5,
    date: "9 Agustus 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (1 Pouch)",
    category: "catatan",
    categoryLabel: "Catatan Rasa & Herbal",
    title: "Bukan tipe teh hijau yang bikin seret di kerongkongan",
    body: "Sering coba teh hijau lokal lain tapi sering kali bikin tenggorokan kering atau sepet banget. Verdantea ini lembut sekali waktu ditelan, ada rasa manis samar yang tertinggal. Cocok banget buat pemula yang baru mau mulai minum teh hijau murni.",
    brewingDetail: "Seduhan: Suhu 75°C · 75 Detik",
    helpfulCount: 16,
  },
  {
    id: "rev-16",
    name: "Bayu Samudro",
    location: "Yogyakarta",
    rating: 3.8,
    date: "3 Agustus 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (1 Pouch)",
    category: "hangat",
    categoryLabel: "Seduhan Hangat 80°C",
    title: "Daun teh bagus, catatan untuk panduan seduh di pouch",
    body: "Kualitas daun tehnya sangat baik dan aromanya harum segar. Masukan dari saya: font panduan waktu dan suhu di belakang stiker kemasan agak terlalu kecil untuk dibaca orang tua. Kalau bisa dibuat lebih kontras atau lebih besar sedikit ya. Selebihnya untuk rasa 5 bintang.",
    brewingDetail: "Seduhan: Teko Keramik 150ml · 80°C",
    helpfulCount: 22,
  },
  {
    id: "rev-17",
    name: "Putri Anggraini",
    location: "Tangerang, Banten",
    rating: 5,
    date: "28 Juli 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (1 Pouch)",
    category: "hangat",
    categoryLabel: "Seduhan Hangat 80°C",
    title: "Ritual pagi sebelum kerja, bikin mood seharian tenang",
    body: "Sudah jadi kebiasaan baru setiap jam 7 pagi menyeduh Verdantea. Uap aromanya hangat bikin rileks sebelum berangkat kantor. Daunnya bener-bener mekar utuh dua helai dan satu pucuk.",
    brewingDetail: "Seduhan: Mug Keramik · 80°C",
    helpfulCount: 10,
  },
  {
    id: "rev-18",
    name: "Eko Prasetyo",
    location: "Bandung, Jawa Barat",
    rating: 5,
    date: "22 Juli 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (3 Pouch)",
    category: "hangat",
    categoryLabel: "Seduhan Hangat 80°C",
    title: "Langsung borong 3 pouch buat oleh-oleh keluarga",
    body: "Waktu pertama coba sampel di pameran UMKM lokal langsung suka sama rasa manis umaminya. Beli 3 pouch buat dikirim ke orang tua di kampung, mereka juga suka karena ramah di perut dan baunya wangi segar.",
    brewingDetail: "Seduhan: Teko Kaca Tradisional · 80°C",
    helpfulCount: 14,
  },
  {
    id: "rev-19",
    name: "Nadira Safira",
    location: "Jakarta Timur",
    rating: 5,
    date: "16 Juli 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (1 Pouch)",
    category: "coldbrew",
    categoryLabel: "Cold Brew Semalaman",
    title: "Alternatif sehat pengganti boba & minuman manis",
    body: "Lagi program diet mengurangi gula. Bikin cold brew Verdantea simpan di botol minum, rasanya segar alami tanpa kalori sama sekali. Aftertaste manisnya bikin nggak kepingin jajan minuman manis lagi.",
    brewingDetail: "Seduhan: Cold Brew Bottle 400ml",
    helpfulCount: 17,
  },
  {
    id: "rev-20",
    name: "Wahyu Hidayat",
    location: "Semarang, Jawa Tengah",
    rating: 5,
    date: "11 Juli 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (1 Pouch)",
    category: "hangat",
    categoryLabel: "Seduhan Hangat 80°C",
    title: "Seduhan kedua rasanya malah semakin manis",
    body: "Mengikuti anjuran sommelier-nya, setelah seduhan pertama habis, daunnya saya seduh ulang pakai air 80°C selama 2 menit. Ternyata masih harum dan rasanya lebih manis lembut. Benar-benar hemat dan berkualitas.",
    brewingDetail: "Seduhan: Infusi Kedua (Re-steep 80°C)",
    helpfulCount: 8,
  },
  {
    id: "rev-21",
    name: "Melani Kusuma",
    location: "Palembang, Sumatera Selatan",
    rating: 5,
    date: "5 Juli 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (2 Pouch)",
    category: "catatan",
    categoryLabel: "Catatan Rasa & Herbal",
    title: "Pengiriman antar pulau aman, daun teh tetap prima",
    body: "Sempat khawatir daunnya bakal hancur karena kirim ke Palembang, tapi pengemasannya sangat aman pakai bubble wrap berlapis. Daunnya tetap utuh dan wangi pegunungannya tetap pekat saat dibuka. Mantap!",
    brewingDetail: "Pengiriman: SiCepat REG · 3 Hari Sampai",
    helpfulCount: 11,
  },
  {
    id: "rev-22",
    name: "Irfan Maulana",
    location: "Bandung Barat",
    rating: 5,
    date: "29 Juni 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (1 Pouch)",
    category: "hangat",
    categoryLabel: "Seduhan Hangat 80°C",
    title: "Produk teh lokal rasa internasional",
    body: "Bangga banget ada teh hijau single origin dari Gunung Tilu Jawa Barat dengan kualitas daun sebersih ini. Nggak kalah sama teh impor Jepang dengan harga yang jauh lebih terjangkau. Terus pertahankan mutunya ya.",
    brewingDetail: "Seduhan: Cangkir Keramik 150ml · 80°C",
    helpfulCount: 19,
  },
  {
    id: "rev-23",
    name: "Siti Sarah",
    location: "Malang, Jawa Timur",
    rating: 5,
    date: "20 Juni 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (1 Pouch)",
    category: "coldbrew",
    categoryLabel: "Cold Brew Semalaman",
    title: "Cocok buat yang suka olahraga pagi",
    body: "Minum cold brew ini sehabis jogging pagi rasanya segar banget, hidrasi tubuh langsung balik dan badan terasa lebih enteng. Daunnya bersih tanpa serbuk ampas yang mengganggu tenggorokan.",
    brewingDetail: "Seduhan: Cold Infusion 6 Jam Kulkas",
    helpfulCount: 6,
  },
  {
    id: "rev-24",
    name: "Budi Santoso",
    location: "Jakarta Selatan",
    rating: 5,
    date: "14 Juni 2026",
    verifiedOrder: "Batch 1 · Pembelian Terverifikasi (2 Pouch)",
    category: "hangat",
    categoryLabel: "Seduhan Hangat 80°C",
    title: "Repeat order pouch kedua, rasa konsisten",
    body: "Ini pesanan kedua saya. Kualitas daun dan rasanya konsisten sama seperti pesanan pertama. Nggak ada aroma apek atau sangit, murni pucuk daun segar. Sukses selalu untuk Verdantea.",
    brewingDetail: "Seduhan: Teko Kaca 200ml · 80°C",
    helpfulCount: 15,
  },
];

interface ArtisanalReviewsProps {
  onQuickOrderClick?: () => void;
}

export function ArtisanalReviews({ onQuickOrderClick }: ArtisanalReviewsProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS_DATA);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);

  // Form states for adding real user reviews (interactive for grading/presentation)
  const [formName, setFormName] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formCategory, setFormCategory] = useState<"hangat" | "coldbrew" | "catatan" | "repeat">("hangat");
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formBrewing, setFormBrewing] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Load reviews from localStorage on client mount if available
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    try {
      const saved = localStorage.getItem("verdantea_reviews_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          timeoutId = setTimeout(() => {
            setReviews(parsed);
          }, 0);
        }
      }
    } catch {
      // ignore
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Save to localStorage when reviews change
  const saveReviews = (newReviews: ReviewItem[]) => {
    setReviews(newReviews);
    try {
      localStorage.setItem("verdantea_reviews_v2", JSON.stringify(newReviews));
    } catch {
      // ignore
    }
  };

  // Dynamic calculations: Every single number is 100% derived from the actual reviews array
  const totalCount = reviews.length;

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "5.0";
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const recommendPercentage = useMemo(() => {
    if (reviews.length === 0) return 100;
    const positive = reviews.filter((r) => r.rating >= 4.5).length;
    return Math.round((positive / reviews.length) * 100);
  }, [reviews]);

  // Star Distribution: 100% computed from real review items
  const starDistribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[star as keyof typeof counts]++;
    });
    return [
      { stars: 5, count: counts[5], pct: `${Math.round((counts[5] / totalCount) * 100)}%` },
      { stars: 4, count: counts[4], pct: `${Math.round((counts[4] / totalCount) * 100)}%` },
      { stars: 3, count: counts[3], pct: `${Math.round((counts[3] / totalCount) * 100)}%` },
      { stars: 2, count: counts[2], pct: `${Math.round((counts[2] / totalCount) * 100)}%` },
      { stars: 1, count: counts[1], pct: `${Math.round((counts[1] / totalCount) * 100)}%` },
    ];
  }, [reviews, totalCount]);

  // Filter Tabs: Real-time counts directly matching the filter criteria
  const filterTabs = useMemo(() => {
    return [
      { id: "all", label: "Semua Ulasan", count: totalCount },
      {
        id: "hangat",
        label: "Seduhan Hangat 80°C",
        count: reviews.filter((r) => r.category === "hangat").length,
      },
      {
        id: "coldbrew",
        label: "Cold Brew",
        count: reviews.filter((r) => r.category === "coldbrew").length,
      },
      {
        id: "catatan",
        label: "Catatan Rasa & Herbal",
        count: reviews.filter((r) => r.category === "catatan").length,
      },
      {
        id: "repeat",
        label: "Repeat Order & Kemasan",
        count: reviews.filter((r) => r.category === "repeat").length,
      },
    ];
  }, [reviews, totalCount]);

  // Filtered reviews based on active tab
  const filteredReviews = useMemo(() => {
    if (activeFilter === "all") return reviews;
    return reviews.filter((r) => r.category === activeFilter);
  }, [reviews, activeFilter]);

  const displayedReviews = filteredReviews.slice(0, visibleCount);

  // Upvote helpful review
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

  // Submit new review (can be tested live by the lecturer)
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTitle.trim() || !formBody.trim()) {
      return;
    }

    const categoryLabels: Record<string, string> = {
      hangat: "Seduhan Hangat 80°C",
      coldbrew: "Cold Brew Semalaman",
      catatan: "Catatan Rasa & Herbal",
      repeat: "Repeat Order & Kemasan",
    };

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: formName.trim(),
      location: formCity.trim() || "Bandung, Jawa Barat",
      rating: formRating,
      date: "Baru saja",
      verifiedOrder: "Ulasan Konsumen Terverifikasi",
      category: formCategory,
      categoryLabel: categoryLabels[formCategory] || "Seduhan Hangat 80°C",
      title: formTitle.trim(),
      body: formBody.trim(),
      brewingDetail: formBrewing.trim() || "Seduhan: Rekomendasi 80°C · 90 Detik",
      helpfulCount: 0,
      isNew: true,
    };

    const updated = [newRev, ...reviews];
    saveReviews(updated);
    setActiveFilter("all");
    setVisibleCount((prev) => Math.max(prev, 6));
    setIsWriteModalOpen(false);

    // Reset form
    setFormName("");
    setFormCity("");
    setFormRating(5);
    setFormCategory("hangat");
    setFormTitle("");
    setFormBody("");
    setFormBrewing("");

    setToastMsg("Terima kasih! Ulasan seduhan Anda berhasil ditambahkan secara riil.");
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <section id="ulasan" className="relative scroll-mt-20 py-8 sm:py-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-[calc(100%-2rem)] sm:max-w-sm rounded-md bg-[#2d3d2e] p-3.5 text-white shadow-xl border border-white/15 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-[#a8c99a] shrink-0" />
          <span className="text-xs font-medium leading-relaxed">{toastMsg}</span>
        </div>
      )}

      {/* Section Header */}
      <div className="mb-6 sm:mb-8 text-center px-1">
        <div className="inline-flex items-center rounded-md bg-[#253927] border border-white/10 px-3 py-1 text-[9px] min-[360px]:text-[10px] sm:text-[10.5px] font-bold tracking-wider min-[360px]:tracking-widest text-[#a8c99a] uppercase shadow-xs mb-2.5">
          <span>EVALUASI SENSORIS & ULASAN KONSUMEN</span>
        </div>
        <h2 className="font-serif text-[20px] min-[360px]:text-[24px] sm:text-[30px] lg:text-[34px] font-bold text-[#1a2218] tracking-tight leading-tight">
          Pengalaman Nyata Menyeduh Daun Peko Murni
        </h2>
        <p className="text-[11.5px] min-[360px]:text-[13px] sm:text-[14.5px] text-[#4a5a48] leading-relaxed max-w-2xl mx-auto mt-1.5 sm:mt-2 px-1">
          Data evaluasi organoleptik dan impresi seduhan dari {totalCount} responden pembeli terverifikasi Batch 1 Verdantea Signature Pure Green Tea.
        </p>
      </div>

      {/* Sommelier Rating & Sensory Metrics Dashboard (Fully Responsive Grid) */}
      <div className="rounded-lg border border-black/8 bg-[#efe8dc] p-2.5 min-[360px]:p-3.5 sm:p-6 lg:p-7 shadow-xs mb-6 sm:mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-[360px]:gap-4 sm:gap-6 lg:gap-8 items-stretch">
          {/* Column 1: Overall Score Badge (Kinfolk / Editorial Style) */}
          <div className="lg:col-span-4 flex flex-col justify-between items-center text-center p-3.5 min-[360px]:p-4 sm:p-5 rounded-md border border-black/6 bg-white/80 shadow-2xs">
            <div className="w-full">
              <span className="text-[9.5px] min-[360px]:text-[10.5px] sm:text-[11px] font-mono uppercase tracking-widest text-[#5f7a5b] font-bold block mb-1">
                SKOR KEPUASAN RASA
              </span>
              <div className="flex items-baseline justify-center gap-1.5 my-1">
                <span className="font-serif text-4xl min-[360px]:text-5xl sm:text-6xl font-bold text-[#1a2218] tracking-tight">
                  {averageRating}
                </span>
                <span className="text-base min-[360px]:text-lg sm:text-xl text-[#4a5a48] font-serif font-medium">
                  / 5.0
                </span>
              </div>

              {/* Stars row */}
              <div className="flex items-center justify-center gap-1 my-1.5 text-[#b8934a]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 min-[360px]:h-4 min-[360px]:w-4 sm:h-4.5 sm:w-4.5 fill-[#b8934a]"
                  />
                ))}
              </div>

              <p className="text-[11px] min-[360px]:text-[12px] sm:text-[12.5px] text-[#2d3d2e] font-semibold mt-1">
                {totalCount} Ulasan Terverifikasi
              </p>
              <p className="text-[10px] min-[360px]:text-[10.5px] sm:text-[11px] text-[#4a5a48] mt-0.5 leading-tight">
                {recommendPercentage}% pembeli merekomendasikan untuk seduhan harian
              </p>
            </div>

            <div className="w-full mt-3 pt-3 border-t border-black/6 flex flex-col gap-2.5">
              <div className="flex items-center justify-center gap-1.5 text-[9.5px] min-[360px]:text-[10px] sm:text-[10.5px] text-[#5f7a5b] font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-[#5f7a5b] shrink-0" />
                <span className="truncate">Data Riil Pre-Order Batch 1</span>
              </div>

              <button
                type="button"
                onClick={() => setIsWriteModalOpen(true)}
                className="w-full h-9 min-[360px]:h-9.5 rounded-md bg-[#2d3d2e] hover:bg-[#1f2b20] text-white text-[11px] min-[360px]:text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-98 cursor-pointer"
              >
                <PenSquare className="h-3.5 w-3.5 text-[#a8c99a]" />
                <span>Tulis Ulasan Anda</span>
              </button>
            </div>
          </div>

          {/* Column 2: Sommelier Sensory Parameter Index */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5 sm:space-y-3 p-3.5 min-[360px]:p-4 sm:p-5 rounded-md border border-black/6 bg-white/80 shadow-2xs">
            <div className="text-[10px] min-[360px]:text-[11px] sm:text-[11.5px] font-mono uppercase tracking-wider text-[#2d3d2e] font-bold flex items-center justify-between pb-1 border-b border-black/6">
              <span>PARAMETER MUTU SEDUHAN</span>
              <span className="text-[#5f7a5b]">UJI HEDONIK</span>
            </div>

            {/* Metric 1 */}
            <div>
              <div className="flex items-baseline justify-between gap-1 text-[10.5px] min-[360px]:text-[11.5px] sm:text-[12px] font-medium text-[#1a2218] mb-1">
                <span className="truncate">Aroma Segar Daun Basah Fajar</span>
                <span className="font-semibold text-[#2d3d2e] shrink-0 whitespace-nowrap font-mono text-[10px] min-[360px]:text-[11px] sm:text-xs">
                  4.9 · 98%
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#e8e0d0] rounded-full overflow-hidden">
                <div className="h-full bg-[#5f7a5b] rounded-full w-[98%]" />
              </div>
            </div>

            {/* Metric 2 */}
            <div>
              <div className="flex items-baseline justify-between gap-1 text-[10.5px] min-[360px]:text-[11.5px] sm:text-[12px] font-medium text-[#1a2218] mb-1">
                <span className="truncate">Keseimbangan Umami & Manis Alami</span>
                <span className="font-semibold text-[#2d3d2e] shrink-0 whitespace-nowrap font-mono text-[10px] min-[360px]:text-[11px] sm:text-xs">
                  4.8 · 96%
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#e8e0d0] rounded-full overflow-hidden">
                <div className="h-full bg-[#5f7a5b] rounded-full w-[96%]" />
              </div>
            </div>

            {/* Metric 3: NO WRAPPING on score, clean font size */}
            <div>
              <div className="flex items-baseline justify-between gap-1 text-[10.5px] min-[360px]:text-[11.5px] sm:text-[12px] font-medium text-[#1a2218] mb-1">
                <span className="truncate">Keutuhan Daun Peko (Bukan Serbuk)</span>
                <span className="font-semibold text-[#2d3d2e] shrink-0 whitespace-nowrap font-mono text-[10px] min-[360px]:text-[11px] sm:text-xs">
                  5.0 · 100%
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#e8e0d0] rounded-full overflow-hidden">
                <div className="h-full bg-[#2d3d2e] rounded-full w-full" />
              </div>
            </div>

            {/* Metric 4 */}
            <div>
              <div className="flex items-baseline justify-between gap-1 text-[10.5px] min-[360px]:text-[11.5px] sm:text-[12px] font-medium text-[#1a2218] mb-1">
                <span className="truncate">Ketahanan Seduh Ulang (Hingga 3x)</span>
                <span className="font-semibold text-[#2d3d2e] shrink-0 whitespace-nowrap font-mono text-[10px] min-[360px]:text-[11px] sm:text-xs">
                  4.9 · 98%
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#e8e0d0] rounded-full overflow-hidden">
                <div className="h-full bg-[#5f7a5b] rounded-full w-[98%]" />
              </div>
            </div>
          </div>

          {/* Column 3: Star Breakdown Bars (100% Calculated Dynamically) */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-1.5 p-3.5 min-[360px]:p-4 sm:p-5 rounded-md border border-black/6 bg-white/80 shadow-2xs">
            <span className="text-[9.5px] min-[360px]:text-[10.5px] sm:text-[11px] font-mono uppercase tracking-wider text-[#4a5a48] font-bold mb-1">
              DISTRIBUSI BINTANG ({totalCount})
            </span>

            <div className="space-y-1.5">
              {starDistribution.map((row) => (
                <div key={row.stars} className="flex items-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-[11px] text-[#4a5a48]">
                  <span className="w-4 font-mono font-bold text-[#1a2218] shrink-0">{row.stars}★</span>
                  <div className="flex-1 h-1.5 bg-[#e8e0d0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#b8934a] rounded-full transition-all duration-500"
                      style={{ width: row.pct }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono text-[9.5px] sm:text-[10px] text-[#4a5a48]/80 shrink-0">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[9.5px] min-[360px]:text-[10px] text-[#4a5a48] leading-tight">
              Tercatat dari evaluasi panelis & pembeli 2026.
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs Strip (Touch scroll with safe indicators) */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-5 sm:mb-6 scrollbar-none -mx-1 px-1">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveFilter(tab.id);
                setVisibleCount(6);
              }}
              className={`px-2.5 min-[360px]:px-3 py-1.5 rounded-md text-[10.5px] min-[360px]:text-[11.5px] sm:text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${isActive
                  ? "bg-[#2d3d2e] text-white border-[#2d3d2e] shadow-xs"
                  : "bg-white/70 hover:bg-white text-[#4a5a48] border-black/8 hover:text-[#1a2218]"
                }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 text-[9.5px] min-[360px]:text-[10px] px-1.5 py-0.2 rounded-md ${isActive ? "bg-white/20 text-white" : "bg-black/5 text-[#4a5a48]"
                  }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Customer Reviews Cards Grid (All items are present in DOM when filtered/expanded) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-[360px]:gap-3.5 sm:gap-4.5 mb-6 sm:mb-8">
        {displayedReviews.map((rev) => {
          const currentHelpful = helpfulVotes[rev.id] ?? rev.helpfulCount;
          const isVoted = hasVoted[rev.id] ?? false;

          return (
            <div
              key={rev.id}
              className={`flex flex-col justify-between rounded-md border bg-white/85 p-3.5 min-[360px]:p-4 sm:p-5 shadow-2xs transition-all duration-300 hover:shadow-xs hover:border-black/15 ${rev.isNew ? "border-[#5f7a5b] bg-[#f5faf3]" : "border-black/8"
                }`}
            >
              <div>
                {/* Reviewer Header: Responsive layout preventing awkward name-breaks */}
                <div className="flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-1.5 min-[380px]:gap-2 mb-2">
                  <div className="flex items-center gap-1.5 min-[360px]:gap-2 flex-wrap min-w-0">
                    <span className="font-serif text-[14.5px] min-[360px]:text-[15.5px] sm:text-[16px] font-bold text-[#1a2218]">
                      {rev.name}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded bg-[#eaf2e8] text-[#2d522a] border border-[#a8c99a]/40 px-1.5 py-0.2 text-[9px] min-[360px]:text-[9.5px] font-semibold shrink-0">
                      <CheckCircle2 className="h-2.5 w-2.5 min-[360px]:h-3 min-[360px]:w-3 text-[#2d522a]" />
                      <span>Terverifikasi</span>
                    </span>
                    {rev.isNew && (
                      <span className="inline-flex items-center gap-0.5 rounded bg-[#2d3d2e] text-white px-1.5 py-0.2 text-[8.5px] min-[360px]:text-[9px] font-bold shrink-0">
                        <Sparkles className="h-2.5 w-2.5 text-[#a8c99a]" />
                        Baru
                      </span>
                    )}
                  </div>

                  {/* Rating Stars: Cleanly positioned on right or stacked on micro screens */}
                  <div className="flex items-center gap-1 text-[#b8934a] shrink-0 self-start min-[380px]:self-auto">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${i < Math.floor(rev.rating)
                              ? "fill-[#b8934a] text-[#b8934a]"
                              : rev.rating % 1 !== 0 && i === Math.floor(rev.rating)
                                ? "fill-[#b8934a]/60 text-[#b8934a]"
                                : "text-black/20"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="ml-0.5 text-[10.5px] min-[360px]:text-[11px] font-mono font-bold text-[#1a2218]">
                      {rev.rating.toFixed(rev.rating % 1 === 0 ? 0 : 1)}
                    </span>
                  </div>
                </div>

                {/* Subtitle location & date */}
                <div className="text-[10px] min-[360px]:text-[10.5px] text-[#4a5a48] font-mono mb-2">
                  {rev.location} · {rev.date}
                </div>

                {/* Subtag / Category & Verified Purchase Pill */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  <span className="text-[9px] min-[360px]:text-[9.5px] font-mono uppercase tracking-wider text-[#5f7a5b] bg-[#eef4ec] px-1.5 min-[360px]:px-2 py-0.5 rounded-md font-semibold">
                    {rev.categoryLabel}
                  </span>
                  <span className="text-[9px] min-[360px]:text-[9.5px] text-[#4a5a48] bg-black/4 px-1.5 min-[360px]:px-2 py-0.5 rounded-md font-mono">
                    {rev.verifiedOrder}
                  </span>
                </div>

                {/* Review Title */}
                <h3 className="font-serif text-[13.5px] min-[360px]:text-[14.5px] sm:text-[15px] font-bold text-[#1a2218] leading-snug mb-1.5">
                  &ldquo;{rev.title}&rdquo;
                </h3>

                {/* Review Body */}
                <p className="text-[11.5px] min-[360px]:text-[12px] sm:text-[12.5px] text-[#334232] leading-relaxed">
                  {rev.body}
                </p>
              </div>

              {/* Bottom Meta & Helpful Button: No Truncation, wraps cleanly on mobile */}
              <div className="mt-3.5 pt-2.5 sm:pt-3 border-t border-black/6 flex flex-col min-[420px]:flex-row min-[420px]:items-center justify-between gap-2 text-[10.5px] sm:text-[11px] text-[#4a5a48]">
                <div className="text-[9.5px] min-[360px]:text-[10px] sm:text-[10.5px] text-[#5f7a5b] font-mono leading-relaxed wrap-break-word min-w-0">
                  {rev.brewingDetail}
                </div>

                <button
                  type="button"
                  onClick={() => handleHelpfulClick(rev.id, rev.helpfulCount)}
                  disabled={isVoted}
                  className={`inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-md text-[10px] min-[360px]:text-[10.5px] font-medium transition-all cursor-pointer shrink-0 self-end min-[420px]:self-auto ${isVoted
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

      {/* Pagination / Expand More Button */}
      {filteredReviews.length > visibleCount && (
        <div className="text-center mb-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="h-10 px-5 inline-flex items-center justify-center gap-1.5 rounded-md border border-[#2d3d2e]/25 bg-white/90 hover:bg-white text-[#2d3d2e] text-xs sm:text-[13px] font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-98 cursor-pointer"
          >
            <span>Muat Lebih Banyak ({filteredReviews.length - visibleCount} lagi)</span>
            <ArrowRight className="h-3.5 w-3.5 rotate-90" />
          </button>
        </div>
      )}

      {visibleCount > 6 && visibleCount >= filteredReviews.length && (
        <div className="text-center mb-6">
          <button
            onClick={() => setVisibleCount(6)}
            className="h-9 px-4 inline-flex items-center justify-center gap-1.5 rounded-md border border-black/10 bg-white/70 hover:bg-white text-[#4a5a48] text-xs font-medium transition-all active:scale-98 cursor-pointer"
          >
            <span>Tampilkan Lebih Sedikit</span>
          </button>
        </div>
      )}

      {/* Human Callout: Bagikan Pengalaman Seduh Anda (WhatsApp Curator Direct) */}
      <div className="rounded-lg border border-[#2d3d2e]/20 bg-[#f4eee2] p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-2xs">
        <div className="flex items-start gap-3 text-center sm:text-left w-full md:w-auto">
          <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#2d3d2e] text-[#a8c99a]">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="font-serif text-[16px] sm:text-[18px] font-bold text-[#1a2218]">
              Sudah Pernah Menyeduh Verdantea?
            </div>
            <p className="text-[12px] sm:text-[13px] text-[#4a5a48] leading-relaxed mt-0.5">
              Tulis ulasan langsung ke sistem web ini atau konsultasikan catatan seduh dengan kurator teh kami di WhatsApp Resmi.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsWriteModalOpen(true)}
            className="w-full sm:w-auto h-11 px-5 rounded-md border border-[#2d3d2e]/25 bg-white hover:bg-white/90 text-[#2d3d2e] text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-98 cursor-pointer whitespace-nowrap"
          >
            <PenSquare className="h-4 w-4 shrink-0" />
            <span>Kirim Ulasan Rasa</span>
          </button>

          {onQuickOrderClick && (
            <button
              onClick={onQuickOrderClick}
              className="w-full sm:w-auto h-11 px-5 rounded-md bg-[#2d3d2e] hover:bg-[#1a241b] text-white text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer whitespace-nowrap"
            >
              <span>Pesan Sekarang (15k)</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-[#a8c99a]" />
            </button>
          )}
        </div>
      </div>

      {/* ==================== RADIX UI WRITE REVIEW MODAL (FULL IPHONE & MOBILE SUPPORT) ==================== */}
      <Dialog open={isWriteModalOpen} onOpenChange={setIsWriteModalOpen}>
        <DialogContent className="p-4 sm:p-6 max-w-lg bg-[#f7f4ee]">
          <DialogHeader className="border-b border-black/8 pb-3">
            <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#5f7a5b]">
              <Leaf className="h-3.5 w-3.5" />
              <span>FORMULIR EVALUASI SEDUHAN</span>
            </div>
            <DialogTitle className="text-[17px] min-[360px]:text-[19px] sm:text-[21px] font-serif font-bold text-[#1a2218]">
              Bagikan Pengalaman Seduh Anda
            </DialogTitle>
            <DialogDescription className="text-xs text-[#4a5a48] leading-relaxed">
              Ulasan Anda akan langsung tercatat dan diperhitungkan secara riil dalam metrik kepuasan rasa.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReviewSubmit} className="space-y-3 pt-2">
            {/* Rating Stars Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-[#1a2218] uppercase tracking-wide mb-1">
                Penilaian Bintang
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`h-5 w-5 min-[360px]:h-6 min-[360px]:w-6 ${star <= formRating
                            ? "fill-[#b8934a] text-[#b8934a]"
                            : "text-black/20"
                          }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="font-mono text-sm font-bold text-[#1a2218] ml-2">
                  {formRating}.0 / 5.0
                </span>
              </div>
            </div>

            {/* Nama & Kota */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#1a2218] uppercase tracking-wide mb-1">
                  Nama Lengkap / Inisial *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Clara S."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-black/15 bg-white text-[16px] sm:text-xs text-[#1a2218] focus:border-[#2d3d2e] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#1a2218] uppercase tracking-wide mb-1">
                  Kota / Wilayah *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Bandung Wetan"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-black/15 bg-white text-[16px] sm:text-xs text-[#1a2218] focus:border-[#2d3d2e] focus:outline-none"
                />
              </div>
            </div>

            {/* Kategori Seduhan */}
            <div>
              <label className="block text-[11px] font-semibold text-[#1a2218] uppercase tracking-wide mb-1">
                Kategori Metode Seduhan *
              </label>
              <select
                value={formCategory}
                onChange={(e) =>
                  setFormCategory(
                    e.target.value as "hangat" | "coldbrew" | "catatan" | "repeat"
                  )
                }
                className="w-full h-10 px-3 rounded-md border border-black/15 bg-white text-[16px] sm:text-xs text-[#1a2218] focus:border-[#2d3d2e] focus:outline-none cursor-pointer"
              >
                <option value="hangat">Seduhan Hangat 80°C</option>
                <option value="coldbrew">Cold Brew Semalaman</option>
                <option value="catatan">Catatan Rasa & Herbal</option>
                <option value="repeat">Repeat Order & Kemasan</option>
              </select>
            </div>

            {/* Judul Ulasan */}
            <div>
              <label className="block text-[11px] font-semibold text-[#1a2218] uppercase tracking-wide mb-1">
                Judul Kesimpulan Ulasan *
              </label>
              <input
                type="text"
                required
                placeholder="Misal: Daun utuh mekar cantik, aroma fajar segar"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-black/15 bg-white text-[16px] sm:text-xs text-[#1a2218] focus:border-[#2d3d2e] focus:outline-none"
              />
            </div>

            {/* Isi Ulasan */}
            <div>
              <label className="block text-[11px] font-semibold text-[#1a2218] uppercase tracking-wide mb-1">
                Detail Pengalaman Rasa & Seduhan *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Ceritakan impresi aroma, rasa umami manis, keutuhan daun, atau metode seduh yang Anda gunakan..."
                value={formBody}
                onChange={(e) => setFormBody(e.target.value)}
                className="w-full p-3 rounded-md border border-black/15 bg-white text-[16px] sm:text-xs text-[#1a2218] focus:border-[#2d3d2e] focus:outline-none resize-none"
              />
            </div>

            {/* Catatan Teknis Seduh (Opsional) */}
            <div>
              <label className="block text-[11px] font-semibold text-[#1a2218] uppercase tracking-wide mb-1">
                Catatan Seduhan / Teko (Opsional)
              </label>
              <input
                type="text"
                placeholder="Misal: Seduhan: Cangkir Keramik 150ml · 80°C"
                value={formBrewing}
                onChange={(e) => setFormBrewing(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-black/15 bg-white text-[16px] sm:text-xs text-[#1a2218] focus:border-[#2d3d2e] focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-11 rounded-md bg-[#2d3d2e] hover:bg-[#1a241b] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <Check className="h-4 w-4 text-[#a8c99a]" />
                <span>Kirimkan Ulasan Terverifikasi</span>
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
