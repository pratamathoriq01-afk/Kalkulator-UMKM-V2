'use client';

import FlexibleInput from '@/components/FlexibleInput';
import { formatIDR, calculateHPP, calculateOfflinePrice, calculateOnlinePrice } from '@/lib/math';
import type { Product } from '@/lib/types';

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
      <div className="bg-[#F0E6D2] rounded-3xl p-6 shadow-sm border border-[#D4C8B5] space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#241710] bg-[#D4C8B5] px-2.5 py-1 rounded-lg border border-[#BDB6A3]">Modul 3: Reverse-Margin Online</span>
          <span className="text-xs text-[#6B5541] font-bold">• GoFood / GrabFood / ShopeeFood</span>
        </div>
        <h2 className="text-xl font-black text-[#241710]">🛵 Harga Aplikasi Online (Reverse-Margin)</h2>
        <p className="text-xs text-[#6B5541] max-w-xl font-semibold">Hitung harga markup otomatis agar pendapatan bersih tetap sama persis dengan toko offline meski dipotong komisi.</p>
      </div>

      <div className="bg-[#F0E6D2] rounded-3xl p-6 md:p-8 shadow-sm border border-[#D4C8B5] space-y-6">
        {/* Platform Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-[#D4C8B5]">
          <div className="p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B5541] block">Target Cair Bersih (Offline):</span>
            <span className="text-xl font-black text-[#241710] font-mono block">{formatIDR(offlineData.effectiveOfflinePrice)}</span>
            <span className="text-[10px] text-[#6B5541] font-semibold">Dari Modul 2</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#241710] block">Komisi Platform App:</label>
            <FlexibleInput value={prod.commissionPercent} onChange={v => onUpdateProduct('commissionPercent', v)} suffix="%" />
            <span className="text-[10px] text-[#6B5541] font-semibold">Standar Grab/Gojek/Shopee ~20%</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-1">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#241710] block">Biaya Layanan Tetap:</label>
            <FlexibleInput value={prod.fixedFee} onChange={v => onUpdateProduct('fixedFee', v)} prefix="Rp" />
            <span className="text-[10px] text-[#6B5541] font-semibold">Biaya per transaksi (misal: Rp 1.000)</span>
          </div>
        </div>

        {/* Recommended Online Price */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B5541]">Formula Reverse-Margin:</span>
            <span className="text-xs text-[#6B5541] font-mono font-bold">(Harga Offline + Biaya Tetap) / (1 - Komisi)</span>
          </div>
          <div className="p-6 rounded-3xl bg-[#4A3427] text-white shadow-sm space-y-3 border border-[#241710]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-white block">REKOMENDASI HARGA JUAL ONLINE:</span>
                <span className="text-3xl font-black text-white font-mono tracking-tight block mt-0.5">{formatIDR(onlineData.effectiveOnlinePrice)}</span>
              </div>
              <div className="w-full sm:w-56 bg-white text-[#241710] rounded-xl p-1.5 shadow-inner">
                <label className="text-[10px] text-[#6B5541] font-bold uppercase block px-2">Override Manual:</label>
                <FlexibleInput value={onlineData.effectiveOnlinePrice} onChange={v => onUpdateProduct('customOnlinePrice', v)} prefix="Rp" />
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Proof */}
        <div className="p-5 rounded-2xl bg-white border border-[#D4C8B5] space-y-3 text-xs">
          <span className="font-extrabold uppercase tracking-wider text-[#241710] block border-b border-[#D4C8B5] pb-2">🧾 SIMULASI PENCAIRAN BERSIH (NET PAYOUT TOKO):</span>
          <div className="space-y-1.5 text-[#374151] font-semibold">
            <div className="flex justify-between"><span>• Harga Terdaftar di Aplikasi:</span><span className="font-mono font-black text-[#241710]">{formatIDR(onlineData.effectiveOnlinePrice)}</span></div>
            <div className="flex justify-between text-rose-600 font-extrabold"><span>• Potongan Komisi ({prod.commissionPercent}%):</span><span className="font-mono">- {formatIDR(onlineData.commissionAmount)}</span></div>
            <div className="flex justify-between text-rose-600 font-extrabold"><span>• Potongan Biaya Layanan Tetap:</span><span className="font-mono">- {formatIDR(prod.fixedFee)}</span></div>
            <div className="flex justify-between pt-2 border-t border-[#D4C8B5] text-sm font-black text-[#241710] bg-[#F7F3E9] p-2.5 rounded-xl">
              <span>✅ Uang Cair Bersih ke Penjual:</span>
              <span className="font-mono">{formatIDR(onlineData.simulatedPayout)} (Sama persis dengan toko offline!)</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={() => onNavigateTab('promo')} className="bg-[#4A3427] hover:bg-[#241710] text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer">
            Lanjut ke Modul 4: Pusat Simulasi Diskon & Promo ➔
          </button>
        </div>
      </div>
    </div>
  );
}
