import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getProductsBySession, createProduct, initDB } from '@/lib/db';
import { DEFAULT_PRESETS } from '@/lib/config';
import type { Product } from '@/lib/types';

function getOrCreateSession(cookieStore: Awaited<ReturnType<typeof cookies>>): string {
  let session = cookieStore.get('umkm_session')?.value;
  if (!session) {
    session = crypto.randomUUID();
  }
  return session;
}

export async function GET() {
  try {
    await initDB();
    const cookieStore = await cookies();
    const session = getOrCreateSession(cookieStore);

    let products = await getProductsBySession(session);

    // If no products exist, seed with defaults
    if (products.length === 0) {
      for (const preset of DEFAULT_PRESETS) {
        await createProduct(session, preset);
      }
      products = await getProductsBySession(session);
    }

    const response = NextResponse.json({ products });
    response.cookies.set('umkm_session', session, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('[GET /api/products]', error);
    return NextResponse.json({ error: 'Gagal memuat produk' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDB();
    const cookieStore = await cookies();
    const session = getOrCreateSession(cookieStore);
    const product: Product = await req.json();

    const dbId = await createProduct(session, product);
    const response = NextResponse.json({ dbId }, { status: 201 });
    response.cookies.set('umkm_session', session, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('[POST /api/products]', error);
    return NextResponse.json({ error: 'Gagal membuat produk' }, { status: 500 });
  }
}
