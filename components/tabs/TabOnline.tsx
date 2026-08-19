'use client';

import FlexibleInput from '@/components/FlexibleInput';
import { formatIDR, calculateHPP, calculateOfflinePrice, calculateOnlinePrice } from '@/lib/math';
import type { Product } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Smartphone, AlertTriangle, ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    <TooltipProvider>
      <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto pb-12">
        {/* Module Banner */}
        <Card className="bg-white border-[#e0e3e5] rounded-xl shadow-2xs">
          <CardHeader className="p-5 sm:p-6 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-[#e1e0ff] text-[#07006c] font-bold uppercase tracking-wider text-[10px]">
                Modul 3: Reverse-Margin Online
              </Badge>
              <span className="text-xs text-[#45464d] font-medium">• GoFood / GrabFood / ShopeeFood</span>
            </div>
            <CardTitle className="font-heading text-xl font-bold text-[#191c1e] flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-[#131b2e]" /> Harga Aplikasi Online (Reverse-Margin)
            </CardTitle>
            <CardDescription className="text-xs text-[#45464d] font-medium">
              Hitung harga markup presisi agar pendapatan bersih (*Net Payout*) tetap sama persis dengan toko offline meski dipotong komisi aplikasi.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-[#e0e3e5] bg-white rounded-xl">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Platform Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-[#f2f4f6]">
              <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#45464d] block">Target Cair Bersih (Offline):</span>
                <span className="text-xl font-bold text-[#191c1e] font-mono block">{formatIDR(offlineData.effectiveOfflinePrice)}</span>
                <span className="text-[10px] text-[#45464d] font-medium">Dari Modul 2</span>
              </div>
              <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#191c1e] block">Komisi Platform App:</label>
                <FlexibleInput value={prod.commissionPercent} onChange={v => onUpdateProduct('commissionPercent', v)} suffix="%" />
                <span className="text-[10px] text-[#45464d] font-medium">Standar Grab/Gojek/Shopee ~20%</span>
              </div>
              <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#191c1e] block">Biaya Layanan Tetap:</label>
                <FlexibleInput value={prod.fixedFee} onChange={v => onUpdateProduct('fixedFee', v)} prefix="Rp" />
                <span className="text-[10px] text-[#45464d] font-medium">Biaya per transaksi (misal: Rp 1.000)</span>
              </div>
            </div>

            {/* Educational Callout Box: Why Naive Markup is Wrong */}
            <div className="p-4 rounded-xl bg-[#e1e0ff]/50 border border-[#c0c1ff] text-[#07006c] text-xs space-y-1.5 font-medium leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="h-4 w-4 text-[#4648d4]" />
                <span>Peringatan Akuntansi FnB: Mengapa Rumus "Harga Offline × 1.20" Salah?</span>
              </div>
              <p>
                Komisi aplikasi 20% dipotong dari <strong>Harga Jual Online (Gross Revenue)</strong>, bukan dari harga offline. Jika harga offline Rp 40.000 dan dinaikkan 20% menjadi Rp 48.000, komisi 20% akan memotong Rp 9.600 sehingga sisa uang yang cair hanya <strong>Rp 38.400</strong> (Rugi Rp 1.600 dari harga offline!).
              </p>
            </div>

            {/* Recommended Online Price */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#45464d]">Formula Reverse-Margin Akuntansi:</span>
                <span className="text-xs text-[#45464d] font-mono font-semibold">(Harga Offline + Biaya Tetap) ÷ (1 - Komisi)</span>
              </div>
              <div className="p-6 rounded-xl bg-[#131b2e] text-white shadow-xs space-y-3 border border-[#191c1e]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#bec6e0] block">REKOMENDASI HARGA JUAL ONLINE:</span>
                    <span className="font-heading text-3xl font-bold text-white font-mono tracking-tight block mt-0.5">{formatIDR(onlineData.effectiveOnlinePrice)}</span>
                  </div>
                  <div className="w-full sm:w-56 bg-white text-[#191c1e] rounded-lg p-1.5 shadow-inner">
                    <label className="text-[10px] text-[#45464d] font-bold uppercase block px-2">Override Manual:</label>
                    <FlexibleInput value={onlineData.effectiveOnlinePrice} onChange={v => onUpdateProduct('customOnlinePrice', v)} prefix="Rp" />
                  </div>
                </div>
              </div>

              {/* Guard Clause: isUnderPricingRisk Warning */}
              {onlineData.isUnderPricingRisk && (
                <div className="p-4 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/40 flex items-start gap-3 text-[#93000a]">
                  <AlertTriangle className="h-5 w-5 text-[#ba1a1a] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider">Peringatan: Harga Override Di Bawah Ambang Aman!</p>
                    <p className="text-xs font-semibold leading-relaxed">
                      Harga {formatIDR(onlineData.effectiveOnlinePrice)} lebih rendah dari rekomendasi sistem {formatIDR(onlineData.recommendedOnline)}.
                      Potensi kerugian bersih <span className="font-bold">{formatIDR(onlineData.recommendedOnline - onlineData.effectiveOnlinePrice)}/porsi</span>.
                      Sistem mendeteksi <span className="font-bold">status_potensi_boncos = TRUE</span> — transaksi online berpotensi tidak menutup HPP!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Simulation Proof */}
            <div className="p-5 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-[#e0e3e5] pb-2">
                <span className="font-bold uppercase tracking-wider text-[#191c1e] block">🧾 SIMULASI PENCAIRAN BERSIH (NET PAYOUT TOKO):</span>
                <Badge variant="secondary" className="bg-[#e1e0ff] text-[#07006c] font-bold text-[10px]">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Net Payout Presisi
                </Badge>
              </div>
              <div className="space-y-2 text-[#45464d] font-medium">
                <div className="flex justify-between"><span>• Harga Terdaftar di Aplikasi:</span><span className="font-mono font-bold text-[#191c1e]">{formatIDR(onlineData.effectiveOnlinePrice)}</span></div>
                <div className="flex justify-between text-[#ba1a1a] font-bold"><span>• Potongan Komisi ({prod.commissionPercent}%):</span><span className="font-mono">- {formatIDR(onlineData.commissionAmount)}</span></div>
                <div className="flex justify-between text-[#ba1a1a] font-bold"><span>• Potongan Biaya Layanan Tetap:</span><span className="font-mono">- {formatIDR(prod.fixedFee)}</span></div>
                <div className="flex justify-between pt-2 border-t border-[#e0e3e5] text-sm font-bold text-[#191c1e] bg-white p-3 rounded-lg border border-[#e0e3e5]">
                  <span>✅ Uang Cair Bersih ke Penjual:</span>
                  <span className="font-mono text-[#006e1c] font-extrabold">{formatIDR(onlineData.simulatedPayout)} (Cocok Presisi!)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => onNavigateTab('promo')} className="bg-[#131b2e] hover:bg-[#2d3133] text-white rounded-lg px-6 py-2.5 text-xs font-semibold shadow-xs">
                <span>Lanjut ke Modul 4: Pusat Simulasi Diskon & Promo</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
