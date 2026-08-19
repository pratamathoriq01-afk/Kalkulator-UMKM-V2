import { NextResponse } from 'next/server';
import type { Product } from '@/lib/types';
import type { HPPData, OfflineData, OnlineData, PromoData } from '@/lib/types';

interface AIRequestBody {
  prod: Product;
  hppData: HPPData;
  offlineData: OfflineData;
  onlineData: OnlineData;
  promoData: PromoData;
  apiKey?: string;
  model?: string;
}

export async function POST(req: Request) {
  try {
    const body: AIRequestBody = await req.json();
    const { prod, hppData, offlineData, onlineData, promoData, model } = body;

    // Use server-side API key (never expose to client)
    const apiKey = process.env.GEMINI_API_KEY || body.apiKey || '';

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key tidak tersedia' }, { status: 400 });
    }

    const modelName = model || 'gemini-2.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const fmt = (val: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(val));

    const promptText = `
Anda adalah Juragan AI Advisor, konsultan keuangan UMKM kuliner profesional tingkat atas berstandar SAK EMKM.
Berikan analisa taktis & mendalam dalam format JSON murni untuk resep berikut:

Nama Resep: ${prod.name}
- HPP Murni per Porsi: ${fmt(hppData.hppMurni)}
  * Proporsi Bahan Baku Utama: ${hppData.mainPct.toFixed(1)}% (${fmt(hppData.totalMainMaterials)})
  * Proporsi BOP Variabel: ${hppData.bopPct.toFixed(1)}% (${fmt(hppData.totalBopMaterials)})
  * Proporsi Kemasan: ${hppData.packPct.toFixed(1)}% (${fmt(hppData.totalPackagings)})

- Strategi Harga Toko (Offline):
  * Target Margin: ${prod.targetMarginPercent ?? 60}%
  * Harga Jual Offline: ${fmt(offlineData.effectiveOfflinePrice)} (Laba: ${fmt(offlineData.netOfflineMargin)} / porsi)
  * Status Margin: ${offlineData.marginStatus.label} (${offlineData.marginRatio.toFixed(1)}%)

- Strategi Harga Online (Reverse-Margin):
  * Komisi App: ${prod.commissionPercent}% + Fixed Fee: ${fmt(prod.fixedFee)}
  * Rekomendasi Harga Online: ${fmt(onlineData.effectiveOnlinePrice)}

- Simulasi Diskon Promo Online (${promoData.orderQty} porsi):
  * Diskon: ${promoData.promoPercent}% (Max Cap: ${fmt(promoData.maxDiscountCap)})
  * Uang Cair ke Penjual: ${fmt(promoData.netPayout)}
  * Total HPP Order: ${fmt(promoData.totalHPPOrder)}
  * Laba Bersih Promo: ${fmt(promoData.netProfit)}
  * Status Promo: ${promoData.isBoncos ? 'BONCOS / RUGI 🔴' : 'PROFIT / AMAN 🟢'}

HANYA Kembalikan respons dalam format JSON valid tanpa markdown tambahan dengan struktur key persis:
{
  "summary": "Ringkasan ringkas kesehatan bisnis produk ini dalam 2 kalimat.",
  "hppAnalysis": "Analisis efisiensi biaya bahan baku vs BOP vs kemasan dan potensi efisiensi.",
  "pricingStrategy": "Saran optimasi harga offline & online agar tidak boncos.",
  "promoSafety": "Evaluasi promo online dan peringatan risiko kebocoran diskon.",
  "actionItems": ["Langkah taktis 1", "Langkah taktis 2", "Langkah taktis 3"]
}
`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini');

    const parsed = JSON.parse(text);
    return NextResponse.json({
      source: `Gemini AI (${modelName})`,
      ...parsed,
    });
  } catch (error) {
    console.error('[POST /api/ai]', error);
    return NextResponse.json({ error: 'Gagal memanggil AI' }, { status: 500 });
  }
}
