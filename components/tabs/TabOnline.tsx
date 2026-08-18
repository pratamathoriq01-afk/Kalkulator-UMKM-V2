'use client';

import FlexibleInput from '@/components/FlexibleInput';
import { formatIDR, calculateHPP, calculateOfflinePrice, calculateOnlinePrice } from '@/lib/math';
import type { Product } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Smartphone, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TabOnlineProps {
  prod: Product;
  onUpdateProduct: (field: string, value: unknown) => void;
  onNavigateTab: (tab: string) => void;
}

export default function TabOnline({ prod, onUpdateProduct, onNavigateTab }: TabOnlineProps) {
  const hppData = calculateHPP(prod);
  const offlineData = calculateOfflinePrice(hppData.hppMurni, prod);
  const onlineData = calculateOnlinePrice(offlineData.effectiveOfflinePrice, prod);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto pb-12">
      {/* Module Banner */}
      <Card className="bg-stone-50 border-stone-200 shadow-2xs">
        <CardHeader className="p-5 sm:p-6 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-stone-200 text-stone-900 border-stone-300 font-extrabold uppercase tracking-wider text-[10px]">
              Modul 3: Reverse-Margin Online
            </Badge>
            <span className="text-xs text-stone-500 font-semibold">• GoFood / GrabFood / ShopeeFood</span>
          </div>
          <CardTitle className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-[#4A3427]" /> Harga Aplikasi Online (Reverse-Margin)
          </CardTitle>
          <CardDescription className="text-xs text-stone-600 font-medium">
            Hitung harga markup presisi agar pendapatan bersih (*Net Payout*) tetap sama persis dengan toko offline meski dipotong komisi aplikasi.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-stone-200 bg-white">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Platform Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-stone-100">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 block">Target Cair Bersih (Offline):</span>
              <span className="text-xl font-black text-stone-900 font-mono block">{formatIDR(offlineData.effectiveOfflinePrice)}</span>
              <span className="text-[10px] text-stone-500 font-medium">Dari Modul 2</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-stone-900 block">Komisi Platform App:</label>
              <FlexibleInput value={prod.commissionPercent} onChange={v => onUpdateProduct('commissionPercent', v)} suffix="%" />
              <span className="text-[10px] text-stone-500 font-medium">Standar Grab/Gojek/Shopee ~20%</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-stone-900 block">Biaya Layanan Tetap:</label>
              <FlexibleInput value={prod.fixedFee} onChange={v => onUpdateProduct('fixedFee', v)} prefix="Rp" />
              <span className="text-[10px] text-stone-500 font-medium">Biaya per transaksi (misal: Rp 1.000)</span>
            </div>
          </div>

          {/* Educational Callout Box: Why Naive Markup is Wrong */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-1.5 font-medium leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>Peringatan Akuntansi FnB: Mengapa Rumus "Harga Offline × 1.20" Salah?</span>
            </div>
            <p>
              Komisi aplikasi 20% dipotong dari <strong>Harga Jual Online (Gross Revenue)</strong>, bukan dari harga offline. Jika harga offline Rp 40.000 dan dinaikkan 20% menjadi Rp 48.000, komisi 20% akan memotong Rp 9.600 sehingga sisa uang yang cair hanya <strong>Rp 38.400</strong> (Rugi Rp 1.600 dari harga offline!).
            </p>
          </div>

          {/* Recommended Online Price */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-stone-500">Formula Reverse-Margin Akuntansi:</span>
              <span className="text-xs text-stone-500 font-mono font-bold">(Harga Offline + Biaya Tetap) ÷ (1 - Komisi)</span>
            </div>
            <div className="p-6 rounded-3xl bg-[#4A3427] text-white shadow-xs space-y-3 border border-[#241710]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-white block">REKOMENDASI HARGA JUAL ONLINE:</span>
                  <span className="text-3xl font-black text-white font-mono tracking-tight block mt-0.5">{formatIDR(onlineData.effectiveOnlinePrice)}</span>
                </div>
                <div className="w-full sm:w-56 bg-white text-stone-900 rounded-xl p-1.5 shadow-inner">
                  <label className="text-[10px] text-stone-500 font-bold uppercase block px-2">Override Manual:</label>
                  <FlexibleInput value={onlineData.effectiveOnlinePrice} onChange={v => onUpdateProduct('customOnlinePrice', v)} prefix="Rp" />
                </div>
              </div>
            </div>
          </div>

          {/* Simulation Proof */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-extrabold uppercase tracking-wider text-stone-900 block">🧾 SIMULASI PENCAIRAN BERSIH (NET PAYOUT TOKO):</span>
              <Badge variant="success" className="text-[10px]">
                <CheckCircle2 className="h-3 w-3" /> Net Payout Matches Offline
              </Badge>
            </div>
            <div className="space-y-2 text-stone-700 font-semibold">
              <div className="flex justify-between"><span>• Harga Terdaftar di Aplikasi:</span><span className="font-mono font-bold text-stone-900">{formatIDR(onlineData.effectiveOnlinePrice)}</span></div>
              <div className="flex justify-between text-rose-600 font-bold"><span>• Potongan Komisi ({prod.commissionPercent}%):</span><span className="font-mono">- {formatIDR(onlineData.commissionAmount)}</span></div>
              <div className="flex justify-between text-rose-600 font-bold"><span>• Potongan Biaya Layanan Tetap:</span><span className="font-mono">- {formatIDR(prod.fixedFee)}</span></div>
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-black text-stone-900 bg-white p-3 rounded-xl border border-stone-200/80 shadow-2xs">
                <span>✅ Uang Cair Bersih ke Penjual:</span>
                <span className="font-mono text-emerald-700">{formatIDR(onlineData.simulatedPayout)} (Presisi Cocok dengan Offline!)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={() => onNavigateTab('promo')} className="bg-[#4A3427] hover:bg-[#34241B] rounded-xl px-6 py-3 text-xs font-bold">
              <span>Lanjut ke Modul 4: Pusat Simulasi Diskon & Promo</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
