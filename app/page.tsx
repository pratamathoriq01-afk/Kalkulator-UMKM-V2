import KalkulatorClient from '@/components/KalkulatorClient';
import { getProductsBySession, initDB } from '@/lib/db';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import type { Product } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Kalkulator Keuangan UMKM Pintar – Standar SAK EMKM',
  description: 'Kalkulator HPP Murni, Pricing Toko Offline, Reverse-Margin Online, Proteksi Promo Boncos, dan Juragan AI Advisor. Standar SAK EMKM untuk UMKM kuliner Indonesia.',
};

export default async function Home() {
  let initialProducts: Product[] = [];

  try {
    await initDB();
    const cookieStore = await cookies();
    const session = cookieStore.get('umkm_session')?.value;
    if (session) {
      initialProducts = await getProductsBySession(session);
    }
  } catch (e) {
    console.warn('[Home] DB not ready:', e);
  }

  return <KalkulatorClient initialProducts={initialProducts} />;
}

