import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { updateProduct, deleteProduct } from '@/lib/db';
import type { Product } from '@/lib/types';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('umkm_session')?.value;
    if (!session) return NextResponse.json({ error: 'Session tidak ditemukan' }, { status: 401 });

    const { id } = await params;
    const dbId = parseInt(id, 10);
    if (isNaN(dbId)) return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });

    const product: Product = await req.json();
    await updateProduct(dbId, session, product);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[PUT /api/products/:id]', error);
    return NextResponse.json({ error: 'Gagal update produk' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('umkm_session')?.value;
    if (!session) return NextResponse.json({ error: 'Session tidak ditemukan' }, { status: 401 });

    const { id } = await params;
    const dbId = parseInt(id, 10);
    if (isNaN(dbId)) return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });

    await deleteProduct(dbId, session);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[DELETE /api/products/:id]', error);
    return NextResponse.json({ error: 'Gagal hapus produk' }, { status: 500 });
  }
}
