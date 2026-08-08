'use client';

import { useState, useEffect } from 'react';
import { formatIDR, calculateHPP, calculateOfflinePrice, calculateOnlinePrice, calculatePromoSim } from '@/lib/math';
import type { Product } from '@/lib/types';

interface TabSummarizeProps {
  prod: Product;
  onOpenAI: () => void;
}

interface QuickAnalysis {
  timestamp: string;
  summary: string;
  recommendation: string;
}

export default function TabSummarize({ prod, onOpenAI }: TabSummarizeProps) {
  const [aiAnalysis, setAiAnalysis] = useState<QuickAnalysis | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const hppData = calculateHPP(prod);
  const offlineData = calculateOfflinePrice(hppData.hppMurni, prod);
  const onlineData = calculateOnlinePrice(offlineData.effectiveOfflinePrice, prod);
  const promoData = calculatePromoSim(hppData.hppMurni, onlineData.effectiveOnlinePrice, prod);

  const handleRunQuickAI = () => {
    setLoadingAI(true);
    setTimeout(() => {
      setAiAnalysis({
        timestamp: new Date().toLocaleTimeString('id-ID'),
        summary: `Berdasarkan kalkulasi terpadu, produk "${prod.name}" memiliki struktur HPP Murni ${formatIDR(hppData.hppMurni)}. Margin harga toko fisik sebesar ${offlineData.marginRatio.toFixed(0)}% tergolong ${offlineData.marginRatio >= 30 ? 'SANGAT SEHAT' : 'PERLU DIPERTIMBANGKAN'}. Pada kanal online, pencairan bersih Anda tetap terjaga pada ${formatIDR(onlineData.simulatedPayout)}.`,
        recommendation: promoData.isBoncos
          ? '⚠️ PERINGATAN PROMO: Skenario promo online saat ini menyebabkan kerugian! Naikkan syarat minimal belanja atau turunkan batas diskon maksimal.'
          : '✅ MARGIN AMAN: Skenario promo online memberikan laba bersih positif per transaksi. Anda dapat menjalankan promo dengan aman.',
      });
      setLoadingAI(false);
    }, 600);
  };

  useEffect(() => {
    handleRunQuickAI();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prod.id]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto pb-12">
      {/* Executive Summary Header */}
      <div className="bg-[#4A3427] text-white rounded-3xl p-6 md:p-8 shadow-md border border-[#241710] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#EFE9DC] bg-white/15 px-3 py-1 rounded-full border border-white/20">📊 SUMMARIZE & AI CENTER</span>
              <span className="text-xs text-[#EFE9DC] font-bold">• Resep: {prod.name || 'Produk UMKM'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Rangkuman Keuangan & Analisis AI Integritas</h2>
            <p className="text-xs text-[#EFE9DC] max-w-xl font-bold">Rangkuman eksekutif keseluruhan finansial produk (HPP, Toko, Online, & Diskon Promo) terintegrasi langsung dengan Juragan AI Advisor.</p>
          </div>
          <button
            onClick={handleRunQuickAI}
            disabled={loadingAI}
            className="bg-[#8C7259] hover:bg-[#6B5541] px-5 py-3 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer border border-[#6B5541] self-start md:self-auto text-xs font-extrabold text-white disabled:opacity-60"
          >
            {loadingAI ? '🤖 Memproses AI...' : '✨ Analisis Ulang AI Advisor'}
          </button>
        </div>
      </div>

      {/* 4-Card Financial Grid */}
      <div className="bg-[#F0E6D2] rounded-3xl p-6 md:p-8 shadow-sm border border-[#D4C8B5] space-y-6">
        <div className="flex items-center justify-between border-b border-[#D4C8B5] pb-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#241710]">📑 SIMULASI HASIL TRANSAKSI REAL-TIME</h3>
          <span className="text-xs text-[#6B5541] font-bold">Asumsi {prod.simOrderQty || 2} Porsi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Modul 1: HPP Murni', value: formatIDR(hppData.hppMurni), sub: 'Modal bersih / porsi', cls: 'bg-white border-[#D4C8B5]', txtCls: 'text-[#241710]' },
            { label: 'Modul 2: Harga Toko', value: formatIDR(offlineData.effectiveOfflinePrice), sub: `Margin ${offlineData.marginRatio.toFixed(0)}%`, cls: 'bg-white border-[#D4C8B5]', txtCls: 'text-[#241710]' },
            { label: 'Modul 3: Harga Online', value: formatIDR(onlineData.effectiveOnlinePrice), sub: `Cair Bersih ${formatIDR(onlineData.simulatedPayout)}`, cls: 'bg-white border-[#D4C8B5]', txtCls: 'text-[#241710]' },
            { label: 'Modul 4: Net Laba Promo', value: `${promoData.netProfit >= 0 ? '+' : ''}${formatIDR(promoData.netProfit)}`, sub: promoData.isBoncos ? '🔴 BONCOS PROMO' : '🟢 MARGIN AMAN', cls: promoData.isBoncos ? 'bg-rose-50 border-rose-300' : 'bg-white border-[#D4C8B5]', txtCls: promoData.isBoncos ? 'text-rose-700' : 'text-[#241710]' },
          ].map(({ label, value, sub, cls, txtCls }) => (
            <div key={label} className={`p-4 rounded-2xl border space-y-1 shadow-sm ${cls}`}>
              <span className="text-[10px] font-extrabold uppercase text-[#6B5541] block">{label}</span>
              <span className={`text-lg font-black font-mono block ${txtCls}`}>{value}</span>
              <span className={`text-[10px] font-bold block ${txtCls}`}>{sub}</span>
            </div>
          ))}
        </div>

        {/* AI Executive Briefing */}
        {aiAnalysis && (
          <div className="p-5 rounded-2xl bg-white border border-[#D4C8B5] space-y-3">
            <div className="flex items-center gap-2 border-b border-[#D4C8B5] pb-2">
              <span>🤖</span>
              <h4 className="text-xs font-black uppercase text-[#241710]">EXECUTIVE BRIEFING JURAGAN AI ADVISOR</h4>
              <span className="text-[10px] text-[#6B5541] font-mono ml-auto">Generated: {aiAnalysis.timestamp}</span>
            </div>
            <p className="text-xs text-[#241710] leading-relaxed font-medium">{aiAnalysis.summary}</p>
            <div className={`p-3.5 rounded-xl text-xs font-extrabold border ${promoData.isBoncos ? 'bg-rose-50 text-rose-900 border-rose-200' : 'bg-[#F7F3E9] text-[#241710] border-[#D4C8B5]'}`}>
              {aiAnalysis.recommendation}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onOpenAI}
            className="bg-[#4A3427] hover:bg-[#241710] text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            🤖 Buka Deep Consultation Juragan AI Advisor ➔
          </button>
        </div>
      </div>
    </div>
  );
}
