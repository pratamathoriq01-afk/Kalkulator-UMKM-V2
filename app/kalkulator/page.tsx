import KalkulatorClient from '@/components/KalkulatorClient';
import { getProductsBySession, initDB } from '@/lib/db';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import type { Product } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Kalkulator HPP UMKM Pintar | Standar SAK EMKM',
  description: 'Kalkulator HPP Murni, Pricing Offline, Reverse-Margin Online & Proteksi Promo Boncos untuk UMKM kuliner Indonesia.',
};

export default async function KalkulatorPage() {
  let initialProducts: Product[] = [];

  try {
    await initDB();
    const cookieStore = await cookies();
    const session = cookieStore.get('umkm_session')?.value;
    if (session) {
      initialProducts = await getProductsBySession(session);
    }
  } catch (e) {
    // DB not ready yet, will load from client
    console.warn('[KalkulatorPage] DB not ready:', e);
  }

  return <KalkulatorClient initialProducts={initialProducts} />;
}
