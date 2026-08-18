'use client';

import { formatIDR, calculateHPP, calculateOfflinePrice, calculateOnlinePrice, calculatePromoSim } from '@/lib/math';
import type { Product } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, PieChart, Store, Smartphone, Receipt, ShieldCheck, ShieldAlert } from 'lucide-react';

interface RightSummaryProps {
  prod: Product;
  onOpenAI: () => void;
}

export default function RightSummary({ prod, onOpenAI }: RightSummaryProps) {
  const hppData = calculateHPP(prod);
  const offlineData = calculateOfflinePrice(hppData.hppMurni, prod);
  const onlineData = calculateOnlinePrice(offlineData.effectiveOfflinePrice, prod);
  const promoData = calculatePromoSim(hppData.hppMurni, onlineData.effectiveOnlinePrice, offlineData.effectiveOfflinePrice, prod);

  return (
    <div className="space-y-5 select-none">
      {/* HPP Summary Hero Card */}
      <Card className="bg-[#4A3427] text-white border-[#241710] shadow-sm relative overflow-hidden">
        <CardContent className="p-5 space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#EFE9DC] uppercase tracking-widest">HPP MURNI / PORSI</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAI}
              className="bg-white/15 hover:bg-white/25 text-white border-white/20 h-7 text-[10px] px-2.5 rounded-full"
            >
              <Sparkles className="h-3 w-3 mr-1 text-[#F0E6D2]" />
              <span>AI Advisor</span>
            </Button>
          </div>
          <div className="text-3xl font-black font-mono text-white tracking-tight">{formatIDR(hppData.hppMurni)}</div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/15 text-center">
            {[
              { label: 'Utama', val: hppData.totalMainMaterials },
              { label: 'BOP', val: hppData.totalBopMaterials },
              { label: 'Kemasan', val: hppData.totalPackagings },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/10 p-2 rounded-xl border border-white/10">
                <p className="text-[9px] text-[#EFE9DC] font-extrabold uppercase tracking-wider">{label}</p>
                <p className="text-xs font-bold font-mono text-white mt-0.5">{formatIDR(val)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Structure & Pie Chart Summary */}
      <Card className="border-stone-200 bg-white">
        <CardHeader className="p-4 pb-2 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <PieChart className="h-3.5 w-3.5 text-[#4A3427]" /> Proporsi HPP Murni
            </CardTitle>
            <Badge variant="outline" className="text-[9px] text-stone-600">SAK EMKM</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col items-center justify-center p-2 bg-stone-50 rounded-2xl border border-stone-200/80">
            <div
              className="w-32 h-32 rounded-full relative flex items-center justify-center shadow-xs transition transform hover:scale-105 my-1"
              style={{
                background: `conic-gradient(#4a3427 0% ${hppData.mainPct}%, #8c7259 ${hppData.mainPct}% ${hppData.mainPct + hppData.bopPct}%, #d4c8b5 ${hppData.mainPct + hppData.bopPct}% 100%)`
              }}
            >
              <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-inner text-center p-1">
                <span className="text-[8px] text-stone-500 font-extrabold uppercase">TOTAL HPP</span>
                <span className="text-[11px] font-black text-stone-900 font-mono">{formatIDR(hppData.hppMurni)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            {[
              { label: 'Bahan Utama', pct: hppData.mainPct, val: hppData.totalMainMaterials, color: 'bg-[#4A3427]' },
              { label: 'BOP Variabel', pct: hppData.bopPct, val: hppData.totalBopMaterials, color: 'bg-[#8C7259]' },
              { label: 'Kemasan', pct: hppData.packPct, val: hppData.totalPackagings, color: 'bg-[#D4C8B5]' },
            ].map(({ label, pct, val, color }) => (
              <div key={label} className="p-2 rounded-xl bg-stone-50 border border-stone-200/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="font-bold text-stone-800 text-[11px]">{label}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-stone-900 font-mono text-[11px]">{pct.toFixed(1)}%</span>
                  <span className="text-[9px] text-stone-500 font-mono block font-semibold">({formatIDR(val)})</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-stone-200 bg-white p-3.5 space-y-1.5">
          <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-stone-500">
            <Store className="h-3 w-3 text-stone-700" /> Harga Offline
          </div>
          <span className="text-base font-black font-mono text-stone-900 block">{formatIDR(offlineData.effectiveOfflinePrice)}</span>
          <Badge variant={offlineData.marginRatio >= 50 ? 'success' : 'warning'} className="text-[9px] px-2 py-0">
            Margin {offlineData.marginRatio.toFixed(0)}%
          </Badge>
        </Card>
        <Card className="border-stone-200 bg-white p-3.5 space-y-1.5">
          <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-stone-500">
            <Smartphone className="h-3 w-3 text-stone-700" /> Harga Online
          </div>
          <span className="text-base font-black font-mono text-stone-900 block">{formatIDR(onlineData.effectiveOnlinePrice)}</span>
          <Badge variant="outline" className="text-[9px] text-stone-600 px-2 py-0 bg-stone-50">
            Komisi {prod.commissionPercent}%
          </Badge>
        </Card>
      </div>

      {/* Promo Struk */}
      <Card className="border-stone-200 bg-white">
        <CardContent className="p-4 space-y-2.5 text-xs font-mono">
          <div className="flex justify-between items-center border-b border-stone-100 pb-2 font-sans">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
              <Receipt className="h-3 w-3" /> Struk Promo App
            </span>
            <Badge variant={promoData.isBoncos ? 'destructive' : 'success'} className="text-[9px] px-2 py-0">
              {promoData.isBoncos ? '🔴 RUGI PROMO' : '🟢 AMAN PROMO'}
            </Badge>
          </div>
          <div className="flex justify-between text-stone-600 font-semibold"><span>Pesanan ({promoData.orderQty} porsi):</span><span>{formatIDR(promoData.orderSubtotal)}</span></div>
          <div className="flex justify-between text-rose-600 font-bold"><span>Diskon Promo ({promoData.promoPercent}%):</span><span>- {formatIDR(promoData.effectiveDiscount)}</span></div>
          <div className="flex justify-between text-stone-900 font-bold"><span>Dibayar Konsumen:</span><span>{formatIDR(promoData.customerPays)}</span></div>
          <div className="flex justify-between text-rose-600 font-bold"><span>Potongan Komisi ({prod.commissionPercent}%):</span><span>- {formatIDR(promoData.appCommissionTotal)}</span></div>
          <div className="flex justify-between pt-1.5 border-t border-stone-200 font-bold text-stone-900 font-sans"><span>Net Payout Toko:</span><span className="font-mono text-sm font-black">{formatIDR(promoData.netPayout)}</span></div>
          <div className="flex justify-between pt-1 border-t border-stone-200 text-xs font-bold font-sans">
            <span>Laba Bersih Promo:</span>
            <span className={`font-mono text-sm font-black ${promoData.isBoncos ? 'text-rose-600' : 'text-emerald-700'}`}>
              {promoData.netProfit >= 0 ? '+' : ''}{formatIDR(promoData.netProfit)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#4A3427] text-white p-3 border-t border-[#241710] flex items-center justify-between px-4 lg:hidden shadow-2xl">
        <div>
          <span className="text-[10px] text-[#EFE9DC] font-bold uppercase block">HPP Murni per Porsi</span>
          <span className="text-lg font-black font-mono text-white">{formatIDR(hppData.hppMurni)}</span>
        </div>
        <Button
          onClick={onOpenAI}
          className="bg-[#8C7259] hover:bg-[#6B5541] text-white rounded-xl text-xs font-bold"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1" />
          <span>AI Advisor</span>
        </Button>
      </div>
    </div>
  );
}
