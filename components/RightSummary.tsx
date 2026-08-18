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
    <div className="space-y-4 select-none">
      {/* HPP Summary Hero Card (Stitch Dark Hero Style) */}
      <Card className="bg-[#131b2e] text-white border-[#191c1e] shadow-sm relative overflow-hidden rounded-xl">
        <CardContent className="p-5 space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#bec6e0] uppercase tracking-widest">TOTAL HPP MURNI / PORSI</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAI}
              className="bg-[#271901] hover:bg-[#3f465c] text-[#fcdeb5] border-none h-7 text-[10px] px-2.5 rounded-md font-semibold"
            >
              <Sparkles className="h-3 w-3 mr-1 text-[#fcdeb5]" />
              <span>AI Advisor</span>
            </Button>
          </div>
          <div className="font-heading text-3xl font-bold font-mono text-white tracking-tight">{formatIDR(hppData.hppMurni)}</div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
            {[
              { label: 'Utama', val: hppData.totalMainMaterials },
              { label: 'BOP', val: hppData.totalBopMaterials },
              { label: 'Kemasan', val: hppData.totalPackagings },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/5 p-2 rounded-lg border border-white/10">
                <p className="text-[9px] text-[#bec6e0] font-semibold uppercase tracking-wider">{label}</p>
                <p className="text-xs font-bold font-mono text-white mt-0.5">{formatIDR(val)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Structure & Pie Chart Summary */}
      <Card className="border-[#e0e3e5] bg-white rounded-xl">
        <CardHeader className="p-4 pb-2 border-b border-[#f2f4f6]">
          <div className="flex items-center justify-between">
            <CardTitle className="font-heading text-xs font-bold uppercase tracking-wider text-[#191c1e] flex items-center gap-1.5">
              <PieChart className="h-3.5 w-3.5 text-[#4648d4]" /> Proporsi HPP Murni
            </CardTitle>
            <Badge variant="outline" className="text-[9px] text-[#45464d] border-[#e0e3e5]">SAK EMKM</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col items-center justify-center p-2 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5]">
            <div
              className="w-28 h-28 rounded-full relative flex items-center justify-center shadow-xs transition transform hover:scale-105 my-1"
              style={{
                background: `conic-gradient(#131b2e 0% ${hppData.mainPct}%, #4648d4 ${hppData.mainPct}% ${hppData.mainPct + hppData.bopPct}%, #dec29a ${hppData.mainPct + hppData.bopPct}% 100%)`
              }}
            >
              <div className="w-18 h-18 bg-white rounded-full flex flex-col items-center justify-center shadow-inner text-center p-1">
                <span className="text-[8px] text-[#45464d] font-bold uppercase">TOTAL HPP</span>
                <span className="text-[10.5px] font-bold text-[#191c1e] font-mono">{formatIDR(hppData.hppMurni)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            {[
              { label: 'Bahan Utama', pct: hppData.mainPct, val: hppData.totalMainMaterials, color: 'bg-[#131b2e]' },
              { label: 'BOP Variabel', pct: hppData.bopPct, val: hppData.totalBopMaterials, color: 'bg-[#4648d4]' },
              { label: 'Kemasan', pct: hppData.packPct, val: hppData.totalPackagings, color: 'bg-[#dec29a]' },
            ].map(({ label, pct, val, color }) => (
              <div key={label} className="p-2 rounded-lg bg-[#f7f9fb] border border-[#e0e3e5] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="font-semibold text-[#191c1e] text-[11px]">{label}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#191c1e] font-mono text-[11px]">{pct.toFixed(1)}%</span>
                  <span className="text-[9px] text-[#45464d] font-mono block font-medium">({formatIDR(val)})</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-[#e0e3e5] bg-white p-3.5 space-y-1 rounded-xl">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-[#45464d]">
            <Store className="h-3 w-3 text-[#131b2e]" /> Harga Toko
          </div>
          <span className="text-base font-bold font-mono text-[#191c1e] block">{formatIDR(offlineData.effectiveOfflinePrice)}</span>
          <Badge variant={offlineData.marginRatio >= 50 ? 'success' : 'warning'} className="text-[9px] px-2 py-0 font-semibold">
            Margin {offlineData.marginRatio.toFixed(0)}%
          </Badge>
        </Card>
        <Card className="border-[#e0e3e5] bg-white p-3.5 space-y-1 rounded-xl">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-[#45464d]">
            <Smartphone className="h-3 w-3 text-[#131b2e]" /> Harga Online
          </div>
          <span className="text-base font-bold font-mono text-[#191c1e] block">{formatIDR(onlineData.effectiveOnlinePrice)}</span>
          <Badge variant="outline" className="text-[9px] text-[#45464d] border-[#e0e3e5] px-2 py-0 bg-[#f7f9fb]">
            Komisi {prod.commissionPercent}%
          </Badge>
        </Card>
      </div>

      {/* Promo Struk */}
      <Card className="border-[#e0e3e5] bg-white rounded-xl">
        <CardContent className="p-4 space-y-2 text-xs font-mono">
          <div className="flex justify-between items-center border-b border-[#f2f4f6] pb-2 font-sans">
            <span className="text-[10px] font-bold text-[#45464d] uppercase tracking-wider flex items-center gap-1">
              <Receipt className="h-3.5 w-3.5 text-[#131b2e]" /> Struk Simulasi App
            </span>
            <Badge variant={promoData.isBoncos ? 'destructive' : 'success'} className="text-[9px] px-2 py-0 font-semibold">
              {promoData.isBoncos ? '🔴 RUGI PROMO' : '🟢 AMAN PROMO'}
            </Badge>
          </div>
          <div className="flex justify-between text-[#45464d] font-medium"><span>Pesanan ({promoData.orderQty} porsi):</span><span className="text-[#191c1e] font-bold">{formatIDR(promoData.orderSubtotal)}</span></div>
          <div className="flex justify-between text-[#ba1a1a] font-semibold"><span>Diskon Promo ({promoData.promoPercent}%):</span><span>- {formatIDR(promoData.effectiveDiscount)}</span></div>
          <div className="flex justify-between text-[#191c1e] font-bold pt-1 border-t border-dashed border-[#e0e3e5]"><span>Dibayar Konsumen:</span><span className="font-bold">{formatIDR(promoData.customerPays)}</span></div>
          <div className="flex justify-between text-[#ba1a1a] font-semibold"><span>Komisi Platform ({prod.commissionPercent}%):</span><span>- {formatIDR(promoData.commissionOnlyAmount)}</span></div>
          <div className="flex justify-between text-[#ba1a1a] font-semibold"><span>Biaya Layanan Tetap:</span><span>- {formatIDR(prod.fixedFee)}</span></div>
          <div className="flex justify-between pt-2 border-t border-[#e0e3e5] font-bold text-[#191c1e] font-sans"><span>Net Payout Toko:</span><span className="font-mono text-sm font-bold text-[#131b2e]">{formatIDR(promoData.netPayout)}</span></div>
          <div className="flex justify-between pt-1 border-t border-[#e0e3e5] text-xs font-bold font-sans">
            <span>Laba Bersih Promo:</span>
            <span className={`font-mono text-sm font-bold ${promoData.isBoncos ? 'text-[#ba1a1a]' : 'text-[#006e1c]'}`}>
              {promoData.netProfit >= 0 ? '+' : ''}{formatIDR(promoData.netProfit)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#131b2e] text-white p-3 border-t border-[#191c1e] flex items-center justify-between px-4 lg:hidden shadow-2xl">
        <div>
          <span className="text-[10px] text-[#bec6e0] font-bold uppercase block">HPP Murni per Porsi</span>
          <span className="text-lg font-bold font-mono text-white">{formatIDR(hppData.hppMurni)}</span>
        </div>
        <Button
          onClick={onOpenAI}
          className="bg-[#4648d4] hover:bg-[#6063ee] text-white rounded-lg text-xs font-semibold"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1" />
          <span>AI Advisor</span>
        </Button>
      </div>
    </div>
  );
}
