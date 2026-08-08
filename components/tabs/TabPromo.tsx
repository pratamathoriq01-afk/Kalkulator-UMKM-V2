'use client';

import { useState } from 'react';
import FlexibleInput from '@/components/FlexibleInput';
import { formatIDR, calculateHPP, calculateOfflinePrice, calculateOfflinePromo, calculateOnlinePrice, calculatePromoSim } from '@/lib/math';
import type { Product } from '@/lib/types';

interface TabPromoProps {
  prod: Product;
  onUpdateProduct: (field: string, value: unknown) => void;
}

export default function TabPromo({ prod, onUpdateProduct }: TabPromoProps) {
  const [activeSubTab, setActiveSubTab] = useState<'online' | 'offline'>('online');

  const hppData = calculateHPP(prod);
  const offlineData = calculateOfflinePrice(hppData.hppMurni, prod);
  const offlinePromo = calculateOfflinePromo(offlineData.effectiveOfflinePrice, hppData.hppMurni, prod);
  const onlineData = calculateOnlinePrice(offlineData.effectiveOfflinePrice, prod);
  const promoData = calculatePromoSim(hppData.hppMurni, onlineData.effectiveOnlinePrice, prod);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto pb-12">
      {/* Module Banner */}
      <div className="bg-[#F0E6D2] rounded-3xl p-6 shadow-sm border border-[#D4C8B5] space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#241710] bg-[#D4C8B5] px-2.5 py-1 rounded-lg border border-[#BDB6A3]">Modul 4: Promo Simulator</span>
          <span className="text-xs text-[#6B5541] font-bold">• Pemisah Input Promo Toko & Online</span>
        </div>
        <h2 className="text-xl font-black text-[#241710]">🏷️ Pusat Simulasi Diskon & Proteksi Promo</h2>
        <p className="text-xs text-[#6B5541] max-w-xl font-semibold">Simulasikan promo diskon toko (offline) dan promo aplikasi (online) secara terpisah untuk mendeteksi risiko boncos.</p>
        <div className="flex gap-2 pt-2 border-t border-[#D4C8B5]">
          {(['online', 'offline'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 border ${activeSubTab === tab ? 'bg-[#4A3427] text-white border-[#241710] shadow-sm' : 'bg-[#F7F3E9] text-[#241710] border-[#D4C8B5] hover:bg-[#D4C8B5]'}`}
            >
              {tab === 'online' ? '🛵 Promo Aplikasi Online' : '🏪 Promo Toko Fisik (Offline)'}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Tab Online */}
      {activeSubTab === 'online' && (
        <div className="space-y-6">
          <div className="bg-[#F0E6D2] rounded-3xl p-6 md:p-8 shadow-sm border border-[#D4C8B5] space-y-6">
            <div className="flex items-center justify-between border-b border-[#D4C8B5] pb-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#241710]">⚙️ INPUT SKENARIO PROMO APLIKASI ONLINE</h3>
              <div className="flex items-center gap-2">
                <label className="text-xs font-extrabold text-[#241710]">Aktifkan Promo App:</label>
                <input type="checkbox" checked={!!prod.promoEnabled} onChange={e => onUpdateProduct('promoEnabled', e.target.checked)} className="w-4 h-4 rounded cursor-pointer" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-3">
              <span className="text-xs font-extrabold text-[#241710] block">1. Asumsi Pesanan Pelanggan dalam 1 Struk:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="flex items-center gap-3">
                  <label className="text-xs text-[#6B5541] font-bold">Jumlah Porsi:</label>
                  <div className="w-32"><FlexibleInput value={prod.simOrderQty || 2} onChange={v => onUpdateProduct('simOrderQty', Math.max(1, v))} suffix="porsi" /></div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#6B5541] font-bold block">Total Subtotal Awal:</span>
                  <span className="text-lg font-black text-[#241710] font-mono">{formatIDR(promoData.orderSubtotal)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-3">
              <span className="text-xs font-extrabold text-[#241710] block">2. Syarat & Ketentuan Promo Aplikasi:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold text-[#241710] block mb-1">Minimal Belanja:</label>
                  <FlexibleInput value={prod.promoMinOrder} onChange={v => onUpdateProduct('promoMinOrder', v)} prefix="Rp" />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-[#241710] block mb-1">Persentase Diskon:</label>
                  <FlexibleInput value={prod.promoPercent} onChange={v => onUpdateProduct('promoPercent', v)} suffix="%" />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-[#241710] block mb-1">Maksimal Diskon (Cap):</label>
                  <FlexibleInput value={prod.promoMaxDiscount} onChange={v => onUpdateProduct('promoMaxDiscount', v)} prefix="Rp" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-2">
              <span className="text-xs font-extrabold text-[#241710] block">3. Kebijakan Potongan Komisi Aplikasi:</span>
              <div className="flex flex-col sm:flex-row gap-4 text-xs font-bold text-[#241710]">
                {[
                  { val: 'before_discount', label: '🔘 Potong dari Harga Awal (Sebelum Diskon)' },
                  { val: 'after_discount', label: '⚪ Potong dari Harga Akhir (Setelah Diskon)' },
                ].map(({ val, label }) => (
                  <label key={val} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="deductionMode" checked={prod.commissionDeductionMode === val} onChange={() => onUpdateProduct('commissionDeductionMode', val)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Simulation Result */}
          <div className="bg-[#F0E6D2] rounded-3xl p-6 md:p-8 shadow-sm border border-[#D4C8B5] space-y-6">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#241710] border-b border-[#D4C8B5] pb-3">🧾 SIMULASI HASIL TRANSAKSI ONLINE REAL-TIME</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-white border border-[#D4C8B5] space-y-3 text-xs">
                <h4 className="font-extrabold uppercase text-[#241710] border-b border-[#D4C8B5] pb-2">A. SISI KONSUMEN</h4>
                <div className="space-y-2 text-[#374151] font-semibold">
                  <div className="flex justify-between"><span>Total Belanja ({promoData.orderQty} porsi):</span><span className="font-mono font-black text-[#241710]">{formatIDR(promoData.orderSubtotal)}</span></div>
                  <div className="flex justify-between"><span>Status Syarat Promo:</span><span className={`font-bold ${promoData.isMinOrderMet ? 'text-[#241710]' : 'text-rose-600'}`}>{promoData.isMinOrderMet ? '✅ Terpenuhi' : '❌ Min. Belum Terpenuhi'}</span></div>
                  <div className="flex justify-between text-rose-600 font-extrabold"><span>Diskon ({promoData.promoPercent}%):</span><span className="font-mono">- {formatIDR(promoData.effectiveDiscount)}</span></div>
                  <div className="flex justify-between pt-2 border-t border-[#D4C8B5] font-black text-sm text-[#241710]"><span>Total Dibayar Konsumen:</span><span className="font-mono">{formatIDR(promoData.customerPays)}</span></div>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-[#D4C8B5] space-y-3 text-xs">
                <h4 className="font-extrabold uppercase text-[#241710] border-b border-[#D4C8B5] pb-2">B. SISI PENJUAL</h4>
                <div className="space-y-2 text-[#374151] font-semibold">
                  <div className="flex justify-between"><span>Total dari Konsumen:</span><span className="font-mono font-black text-[#241710]">{formatIDR(promoData.customerPays)}</span></div>
                  <div className="flex justify-between text-rose-600 font-extrabold"><span>Potongan Komisi App ({prod.commissionPercent}%):</span><span className="font-mono">- {formatIDR(promoData.appCommissionTotal)}</span></div>
                  <div className="flex justify-between pt-2 border-t border-[#D4C8B5] font-black text-sm text-[#241710] bg-[#F7F3E9] p-2 rounded-xl"><span>Uang Cair ke Penjual:</span><span className="font-mono">{formatIDR(promoData.netPayout)}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* BEP Analysis */}
          <div className={`rounded-3xl p-6 md:p-8 shadow-sm border transition ${promoData.isBoncos ? 'bg-rose-50 border-rose-300 text-rose-950' : 'bg-[#EFE9DC] border-[#D4C8B5] text-[#241710]'}`}>
            <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-4">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider">🚨 ANALISIS KEAMANAN MARGIN ONLINE (BEP)</h3>
                <p className="text-xs opacity-80 font-bold">Pencocokan Uang Cair vs Beban HPP Keseluruhan</p>
              </div>
              <span className={`text-xs font-black px-4 py-2 rounded-full border shadow-sm ${promoData.isBoncos ? 'bg-rose-600 text-white border-rose-700' : 'bg-[#4A3427] text-white border-[#241710]'}`}>
                {promoData.isBoncos ? '🔴 BONCOS / RUGI' : '⚫ PROFIT / AMAN'}
              </span>
            </div>
            <div className="space-y-3 text-xs font-semibold">
              <div className="flex justify-between"><span>• Uang Cair ke Penjual:</span><span className="font-mono font-bold">{formatIDR(promoData.netPayout)}</span></div>
              <div className="flex justify-between"><span>• Total Beban HPP ({promoData.orderQty} x {formatIDR(hppData.hppMurni)}):</span><span className="font-mono font-bold text-rose-700">- {formatIDR(promoData.totalHPPOrder)}</span></div>
              <div className={`p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border ${promoData.isBoncos ? 'bg-rose-100/80 border-rose-300' : 'bg-white border-[#D4C8B5]'}`}>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider block">KEUNTUNGAN BERSIH PROMO ONLINE:</span>
                  <span className={`text-3xl font-black font-mono tracking-tight ${promoData.isBoncos ? 'text-rose-700' : 'text-[#241710]'}`}>
                    {promoData.netProfit >= 0 ? '+' : ''}{formatIDR(promoData.netProfit)}
                  </span>
                </div>
                <div className="text-xs text-right max-w-xs leading-relaxed font-bold">
                  {promoData.isBoncos ? '🔴 HPP TIDAK TERTUTUP! Kurangi batas maksimal diskon (cap) atau tingkatkan minimal belanja.' : '⚫ HPP murni tertutup sempurna dengan sisa laba bersih aman.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab Offline */}
      {activeSubTab === 'offline' && (
        <div className="space-y-6">
          <div className="bg-[#F0E6D2] rounded-3xl p-6 md:p-8 shadow-sm border border-[#D4C8B5] space-y-6">
            <div className="flex items-center justify-between border-b border-[#D4C8B5] pb-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#241710]">🏪 INPUT DISKON & PROMO TOKO FISIK (OFFLINE)</h3>
              <div className="flex items-center gap-2">
                <label className="text-xs font-extrabold text-[#241710]">Aktifkan Diskon Toko:</label>
                <input type="checkbox" checked={!!prod.offlinePromoEnabled} onChange={e => onUpdateProduct('offlinePromoEnabled', e.target.checked)} className="w-4 h-4 rounded cursor-pointer" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-2">
                <label className="text-xs font-bold text-[#241710] block">Skema Potongan Diskon Toko:</label>
                <div className="flex gap-3 text-xs font-bold text-[#241710]">
                  {[
                    { val: 'percent', label: 'Persentase (%)' },
                    { val: 'nominal', label: 'Nominal (Rp)' },
                  ].map(({ val, label }) => (
                    <label key={val} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="offlineDiscMode" checked={(prod.offlineDiscountMode || 'percent') === val} onChange={() => onUpdateProduct('offlineDiscountMode', val)} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#D4C8B5] space-y-2">
                <label className="text-xs font-bold text-[#241710] block">{(prod.offlineDiscountMode || 'percent') === 'percent' ? 'Persentase Diskon (%)' : 'Nominal Potongan (Rp)'}:</label>
                {(prod.offlineDiscountMode || 'percent') === 'percent'
                  ? <FlexibleInput value={prod.offlineDiscountPercent || 0} onChange={v => onUpdateProduct('offlineDiscountPercent', v)} suffix="%" />
                  : <FlexibleInput value={prod.offlineDiscountNominal || 0} onChange={v => onUpdateProduct('offlineDiscountNominal', v)} prefix="Rp" />
                }
              </div>
            </div>
          </div>

          {/* Offline Promo Result */}
          <div className={`rounded-3xl p-6 md:p-8 shadow-sm border transition ${offlinePromo.isLosing ? 'bg-rose-50 border-rose-300 text-rose-950' : 'bg-[#EFE9DC] border-[#D4C8B5] text-[#241710]'}`}>
            <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-4">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider">📊 HASIL SIMULASI DISKON TOKO OFFLINE</h3>
                <p className="text-xs opacity-80 font-bold">Perhitungan harga jual toko setelah diskon & margin bersih</p>
              </div>
              <span className={`text-xs font-black px-4 py-2 rounded-full border shadow-sm ${offlinePromo.isLosing ? 'bg-rose-600 text-white border-rose-700' : 'bg-[#4A3427] text-white border-[#241710]'}`}>
                {offlinePromo.isLosing ? '🔴 DISKON RUGI' : '⚫ MARGIN AMAN'}
              </span>
            </div>
            <div className="space-y-3 text-xs font-semibold">
              <div className="flex justify-between"><span>• Harga Toko Dasar:</span><span className="font-mono font-bold">{formatIDR(offlineData.effectiveOfflinePrice)}</span></div>
              <div className="flex justify-between text-rose-600"><span>• Potongan Diskon ({offlinePromo.discountPercent.toFixed(0)}%):</span><span className="font-mono font-bold">- {formatIDR(offlinePromo.discountNominal)}</span></div>
              <div className="flex justify-between font-extrabold text-sm pt-2 border-t border-black/10"><span>• Harga Jual Setelah Diskon:</span><span className="font-mono">{formatIDR(offlinePromo.priceAfterDiscount)}</span></div>
              <div className="flex justify-between"><span>• Modal HPP Murni:</span><span className="font-mono font-bold text-rose-700">- {formatIDR(hppData.hppMurni)}</span></div>
              <div className={`p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border ${offlinePromo.isLosing ? 'bg-rose-100/80 border-rose-300' : 'bg-white border-[#D4C8B5]'}`}>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider block">LABA BERSIH DISKON TOKO PER PORSI:</span>
                  <span className={`text-3xl font-black font-mono tracking-tight ${offlinePromo.isLosing ? 'text-rose-700' : 'text-[#241710]'}`}>
                    {offlinePromo.netMarginAfterDiscount >= 0 ? '+' : ''}{formatIDR(offlinePromo.netMarginAfterDiscount)}
                  </span>
                </div>
                <div className="text-xs text-right max-w-xs leading-relaxed font-bold">
                  {offlinePromo.isLosing ? '🔴 POTONGAN DISKON MERUGIKAN HPP! Turunkan persentase diskon.' : '⚫ Diskon toko aman dan memberikan sisa keuntungan bersih.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
