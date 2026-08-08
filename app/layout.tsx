import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kalkulator Keuangan UMKM Pintar – Standar SAK EMKM',
  description:
    'Kalkulator HPP Murni, Pricing Toko Offline, Reverse-Margin Online, Proteksi Promo Boncos, dan Juragan AI Advisor. Standar SAK EMKM untuk UMKM kuliner Indonesia.',
  keywords: ['kalkulator HPP', 'UMKM', 'kuliner', 'SAK EMKM', 'harga pokok penjualan'],
  openGraph: {
    title: 'Kalkulator Keuangan UMKM Pintar',
    description: 'HPP Murni • Pricing Offline • Reverse-Margin Online • Proteksi Promo Boncos',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#f8f9ff] text-[#0d1c2e] min-h-screen antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
