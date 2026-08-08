'use client';

import { formatIDR, calculateHPP, calculateOfflinePrice, calculateOnlinePrice, calculatePromoSim } from '@/lib/math';
import type { Product } from '@/lib/types';

interface RightSummaryProps {
  prod: Product;
  onOpenAI: () => void;
}

export default function RightSummary({ prod, onOpenAI }: RightSummaryProps) {
  const hppData = calculateHPP(prod);
  const offlineData = calculateOfflinePrice(hppData.hppMurni, prod);
  const onlineData = calculateOnlinePrice(offlineData.effectiveOfflinePrice, prod);
  const promoData = calculatePromoSim(hppData.hppMurni, onlineData.effectiveOnlinePrice, prod);

  return (
    <div className="space-y-5 select-none">
      {/* HPP Summary Hero Card */}
      <div className="bg-[#4A3427] text-white rounded-3xl p-6 shadow-md relative overflow-hidden border border-[#241710]">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#EFE9DC] uppercase tracking-widest">HPP / PORSI</span>
            <button
              onClick={onOpenAI}
              className="bg-white/20 hover:bg-white/30 text-white font-extrabold text-[10px] px-3 py-1 rounded-full border border-white/25 flex items-center gap-1 cursor-pointer transition shadow-sm"
            >
              🤖 AI Advisor
            </button>
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">{formatIDR(hppData.hppMurni)}</div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/20 relative z-10 text-center">
          {[
            { label: 'Utama', val: hppData.totalMainMaterials },
            { label: 'BOP', val: hppData.totalBopMaterials },
            { label: 'Kemasan', val: hppData.totalPackagings },
          ].map(({ label, val }) => (
            <div key={label} className="bg-white/15 p-2 rounded-xl border border-white/15">
              <p className="text-[9px] text-[#EFE9DC] font-extrabold uppercase tracking-wider">{label}</p>
              <p className="text-xs font-black font-mono text-white mt-0.5">{formatIDR(val)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pie Chart Summary */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#D4C8B5] space-y-4">
        <div className="border-b border-[#D4C8B5] pb-2.5">
          <h3 className="text-xs font-black text-[#241710] uppercase tracking-wider">📊 PANEL RINGKASAN & ANALISIS BIAYA</h3>
          <p className="text-[11px] text-[#6B5541] font-bold">Visualisasi proporsi biaya manufaktur murni per porsi</p>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-[#EFE9DC] rounded-2xl border border-[#D4C8B5]">
          <div
            className="w-36 h-36 rounded-full relative flex items-center justify-center shadow-sm transition transform hover:scale-105 my-1"
            style={{
              background: `conic-gradient(#4a3427 0% ${hppData.mainPct}%, #8c7259 ${hppData.mainPct}% ${hppData.mainPct + hppData.bopPct}%, #d4c8b5 ${hppData.mainPct + hppData.bopPct}% 100%)`
            }}
          >
            <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-inner text-center p-1">
              <span className="text-[9px] text-[#6B5541] font-extrabold uppercase">TOTAL HPP</span>
              <span className="text-xs font-black text-[#241710] font-mono">{formatIDR(hppData.hppMurni)}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Bahan Baku Utama', pct: hppData.mainPct, val: hppData.totalMainMaterials, color: 'bg-[#4A3427]' },
            { label: 'BOP Variabel', pct: hppData.bopPct, val: hppData.totalBopMaterials, color: 'bg-[#8C7259]' },
            { label: 'Kemasan Packaging', pct: hppData.packPct, val: hppData.totalPackagings, color: 'bg-[#D4C8B5]' },
          ].map(({ label, pct, val, color }) => (
            <div key={label} className="p-2.5 rounded-xl bg-[#EFE9DC] border border-[#D4C8B5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-xs font-black text-[#241710]">{label}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-[#241710] font-mono">{pct.toFixed(1)}%</span>
                <span className="text-[10px] text-[#6B5541] font-mono block font-bold">({formatIDR(val)})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-[#D4C8B5] shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B5541] block">Harga Toko Offline</span>
          <span className="text-lg font-black font-mono text-[#241710] block">{formatIDR(offlineData.effectiveOfflinePrice)}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block border ${offlineData.marginStatus.badgeClass}`}>
            {offlineData.marginStatus.icon} {offlineData.marginRatio.toFixed(0)}% Margin
          </span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#D4C8B5] shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B5541] block">Harga Online App</span>
          <span className="text-lg font-black font-mono text-[#241710] block">{formatIDR(onlineData.effectiveOnlinePrice)}</span>
          <span className="text-[10px] font-extrabold text-[#241710] bg-[#F7F3E9] px-2 py-0.5 rounded-full inline-block border border-[#D4C8B5]">
            Komisi {prod.commissionPercent}%
          </span>
        </div>
      </div>

      {/* Promo Struk */}
      <div className="bg-white rounded-2xl border border-[#D4C8B5] p-4 text-xs space-y-2.5 font-mono shadow-sm">
        <div className="flex justify-between items-center border-b border-[#D4C8B5] pb-2 font-sans">
          <span className="text-[10px] font-extrabold text-[#6B5541] uppercase tracking-widest">🏷️ Struk Promo Online</span>
          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${promoData.isBoncos ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-[#F7F3E9] text-[#241710] border-[#D4C8B5]'}`}>
            {promoData.isBoncos ? '🔴 RUGI PROMO' : '⚫ AMAN PROMO'}
          </span>
        </div>
        <div className="flex justify-between text-[#6B5541] font-bold"><span>Pesanan ({promoData.orderQty} porsi):</span><span>{formatIDR(promoData.orderSubtotal)}</span></div>
        <div className="flex justify-between text-rose-600 font-extrabold"><span>Diskon Promo ({promoData.promoPercent}%):</span><span>- {formatIDR(promoData.effectiveDiscount)}</span></div>
        <div className="flex justify-between text-[#241710] font-black"><span>Dibayar Konsumen:</span><span>{formatIDR(promoData.customerPays)}</span></div>
        <div className="flex justify-between text-rose-600 font-extrabold"><span>Potongan Komisi ({prod.commissionPercent}%):</span><span>- {formatIDR(promoData.appCommissionTotal)}</span></div>
        <div className="flex justify-between pt-1 border-t border-[#D4C8B5] font-black text-[#241710] font-sans"><span>Uang Cair (Net Payout):</span><span className="font-mono text-sm">{formatIDR(promoData.netPayout)}</span></div>
        <div className="flex justify-between pt-1 border-t border-[#D4C8B5] text-xs font-bold font-sans">
          <span>Laba Bersih Promo:</span>
          <span className={`font-mono text-sm font-black ${promoData.isBoncos ? 'text-rose-600' : 'text-[#241710]'}`}>
            {promoData.netProfit >= 0 ? '+' : ''}{formatIDR(promoData.netProfit)}
          </span>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#4A3427] text-white p-3 border-t border-[#241710] flex items-center justify-between px-4 lg:hidden shadow-2xl">
        <div>
          <span className="text-[10px] text-[#EFE9DC] font-bold uppercase block">HPP per Porsi</span>
          <span className="text-lg font-black font-mono text-white">{formatIDR(hppData.hppMurni)}</span>
        </div>
        <button
          onClick={onOpenAI}
          className="bg-[#8C7259] text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1"
        >
          🤖 AI Advisor
        </button>
      </div>
    </div>
  );
}
