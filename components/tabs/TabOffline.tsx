'use client';

import FlexibleInput from '@/components/FlexibleInput';
import { formatIDR, calculateHPP, calculateOfflinePrice } from '@/lib/math';
import type { Product } from '@/lib/types';

interface TabOfflineProps {
  prod: Product;
  onUpdateProduct: (field: string, value: unknown) => void;
  onNavigateTab: (tab: string) => void;
}

export default function TabOffline({ prod, onUpdateProduct, onNavigateTab }: TabOfflineProps) {
  const hppData = calculateHPP(prod);
  const offlineData = calculateOfflinePrice(hppData.hppMurni, prod);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto pb-12">
      {/* Module Banner */}
      <div className="bg-[#F0E6D2] rounded-3xl p-6 shadow-sm border border-[#D4C8B5] space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#241710] bg-[#D4C8B5] px-2.5 py-1 rounded-lg border border-[#BDB6A3]">Modul 2: Pricing Offline</span>
          <span className="text-xs text-[#6B5541] font-bold">• Penjualan Toko / Dine-In / Takeaway</span>
        </div>
        <h2 className="text-xl font-black text-[#241710]">🏪 Penentuan Harga Jual Toko (Offline)</h2>
        <p className="text-xs text-[#6B5541] max-w-xl font-semibold">Tentukan target margin keuntungan bersih untuk pelanggan yang membeli langsung di toko Anda.</p>
      </div>

      <div className="bg-[#F0E6D2] rounded-3xl p-6 md:p-8 shadow-sm border border-[#D4C8B5] space-y-6">
        {/* Step 1: HPP Info & Target Margin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-[#D4C8B5]">
          <div className="p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B5541] block">HPP Murni per Porsi (Modul 1):</span>
            <span className="text-2xl font-black text-[#241710] font-mono">{formatIDR(hppData.hppMurni)}</span>
            <p className="text-[11px] text-[#6B5541] font-semibold">Modal bersih bahan & kemasan murni</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#241710] block">Target Margin Keuntungan Toko:</label>
            <div className="flex items-center gap-3">
              <div className="w-32">
                <FlexibleInput value={prod.marginPercent} onChange={v => onUpdateProduct('marginPercent', v)} suffix="%" />
              </div>
              <span className="text-xs text-[#241710] font-extrabold">+ {formatIDR(hppData.hppMurni * (prod.marginPercent / 100))} laba kotor</span>
            </div>
          </div>
        </div>

        {/* Step 2: Custom Price Box */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B5541]">Rekomendasi Harga Jual Offline:</span>
            <span className="text-sm font-black text-[#241710] font-mono">Kalkulasi Presisi: {formatIDR(offlineData.recommendedPriceRaw)}</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#4A3427] text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#241710]">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-white block">HARGA JUAL TOKO FIX (OFFLINE):</span>
              <p className="text-[11px] text-[#EFE9DC] opacity-90 font-semibold">Dapat dibulatkan manual sesuai nominal manis di toko</p>
            </div>
            <div className="w-full sm:w-56 bg-white text-[#241710] rounded-xl p-1.5 shadow-inner">
              <FlexibleInput value={offlineData.effectiveOfflinePrice} onChange={v => onUpdateProduct('customOfflinePrice', v)} prefix="Rp" />
            </div>
          </div>
        </div>

        {/* Step 3: Margin Health */}
        <div className="p-5 rounded-2xl bg-white border border-[#D4C8B5] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B5541]">ANALISIS KEUNTUNGAN BERSIH:</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${offlineData.marginStatus.badgeClass}`}>
              <span>{offlineData.marginStatus.icon}</span>
              <span>Status: {offlineData.marginStatus.label} ({offlineData.marginRatio.toFixed(1)}%)</span>
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#D4C8B5] text-sm font-extrabold text-[#241710]">
            <span>Laba Bersih Offline per Porsi:</span>
            <span className="font-mono text-base font-black">{formatIDR(offlineData.netOfflineMargin)}</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={() => onNavigateTab('online')} className="bg-[#4A3427] hover:bg-[#241710] text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer">
            Lanjut ke Modul 3: Harga Aplikasi Online ➔
          </button>
        </div>
      </div>
    </div>
  );
}
