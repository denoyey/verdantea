import type { Metadata } from "next";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verdantea — Pure Green Tea",
  description:
    "Pure · Natural · Artisan. Teh hijau alami tanpa campuran, langsung dari kebun pilihan ke tanganmu.",
  keywords: [
    "Verdantea",
    "pure green tea",
    "artisan green tea",
    "teh hijau organik",
    "wellness lifestyle",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen bg-[#e8e0d0] text-[#1a2218] antialiased">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
