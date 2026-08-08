'use client';

import { useState } from 'react';
import { formatIDR, calculateHPP, calculateOfflinePrice, calculateOnlinePrice, calculatePromoSim } from '@/lib/math';
import type { Product, AIAnalysisResult } from '@/lib/types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  prod: Product;
  apiKey: string;
  model: string;
  onUpdateApiKey: (key: string) => void;
  onUpdateModel: (model: string) => void;
}

const MODELS = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-flash'];

export default function AIAssistantModal({ isOpen, onClose, prod, apiKey, model, onUpdateApiKey, onUpdateModel }: AIAssistantModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const hppData = calculateHPP(prod);
  const offlineData = calculateOfflinePrice(hppData.hppMurni, prod);
  const onlineData = calculateOnlinePrice(offlineData.effectiveOfflinePrice, prod);
  const promoData = calculatePromoSim(hppData.hppMurni, onlineData.effectiveOnlinePrice, prod);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prod, hppData, offlineData, onlineData, promoData, apiKey, model }),
      });

      if (!res.ok) {
        // fallback to local heuristic
        const localResult = generateLocalHeuristic(prod, hppData, offlineData, promoData);
        setResult(localResult);
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch {
      const localResult = generateLocalHeuristic(prod, hppData, offlineData, promoData);
      setResult(localResult);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#F7F3E9] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#D4C8B5] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 bg-[#4A3427] text-white rounded-t-3xl flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white">🤖 Juragan AI Advisor</h2>
            <p className="text-xs text-[#EFE9DC] font-semibold">Analisis keuangan UMKM berstandar SAK EMKM</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30 transition cursor-pointer font-bold flex items-center justify-center">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Product Summary */}
          <div className="bg-white rounded-2xl p-4 border border-[#D4C8B5] grid grid-cols-3 gap-3 text-center">
            <div><span className="text-[10px] text-[#6B5541] font-bold block">HPP Murni</span><span className="text-sm font-black font-mono text-[#241710]">{formatIDR(hppData.hppMurni)}</span></div>
            <div><span className="text-[10px] text-[#6B5541] font-bold block">Harga Offline</span><span className="text-sm font-black font-mono text-[#241710]">{formatIDR(offlineData.effectiveOfflinePrice)}</span></div>
            <div><span className="text-[10px] text-[#6B5541] font-bold block">Status Promo</span><span className={`text-sm font-black ${promoData.isBoncos ? 'text-rose-600' : 'text-emerald-600'}`}>{promoData.isBoncos ? '🔴 BONCOS' : '🟢 AMAN'}</span></div>
          </div>

          {/* API Key Settings */}
          <div className="bg-white rounded-2xl p-4 border border-[#D4C8B5] space-y-3">
            <p className="text-xs font-extrabold text-[#241710] uppercase tracking-wider">Pengaturan Gemini AI (Opsional)</p>
            <div>
              <label className="text-[10px] font-bold text-[#6B5541] block mb-1">Gemini API Key (opsional - bisa diisi di sini atau diset di server)</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => onUpdateApiKey(e.target.value)}
                placeholder="Biarkan kosong jika sudah ada GEMINI_API_KEY di server..."
                className="w-full bg-[#F7F3E9] border border-[#D4C8B5] rounded-xl text-xs font-bold px-3 py-2 focus:outline-none focus:border-[#4A3427] text-[#241710]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#6B5541] block mb-1">Model AI</label>
              <select
                value={model}
                onChange={(e) => onUpdateModel(e.target.value)}
                className="w-full bg-[#F7F3E9] border border-[#D4C8B5] rounded-xl text-xs font-bold px-3 py-2 focus:outline-none focus:border-[#4A3427] text-[#241710]"
              >
                {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full py-3.5 bg-[#4A3427] hover:bg-[#241710] text-white rounded-2xl font-extrabold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <><span className="animate-spin">⟳</span> Sedang Menganalisis...</>
            ) : (
              <><span>🤖</span> Analisis Sekarang</>
            )}
          </button>

          {error && <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700 font-semibold">{error}</div>}

          {/* Result */}
          {result && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-[10px] text-[#6B5541] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Sumber: {result.source}
              </div>

              <div className="bg-[#4A3427] text-white rounded-2xl p-4 space-y-1">
                <p className="text-[10px] text-[#EFE9DC] font-extrabold uppercase tracking-wider">Ringkasan Eksekutif</p>
                <p className="text-sm font-semibold leading-relaxed">{result.summary}</p>
              </div>

              {[
                { key: 'hppAnalysis', label: '🏭 Analisis HPP & Biaya', color: 'bg-amber-50 border-amber-200 text-amber-900' },
                { key: 'pricingStrategy', label: '💰 Strategi Harga', color: 'bg-blue-50 border-blue-200 text-blue-900' },
                { key: 'promoSafety', label: '🏷️ Keamanan Promo', color: 'bg-rose-50 border-rose-200 text-rose-900' },
              ].map(({ key, label, color }) => (
                <div key={key} className={`rounded-2xl p-4 border space-y-1 ${color}`}>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-semibold leading-relaxed">{result[key as keyof AIAnalysisResult] as string}</p>
                </div>
              ))}

              {result.actionItems?.length > 0 && (
                <div className="bg-white rounded-2xl p-4 border border-[#D4C8B5] space-y-2">
                  <p className="text-[10px] font-extrabold text-[#241710] uppercase tracking-wider">✅ Langkah Aksi Taktis</p>
                  {result.actionItems.map((item, i) => (
                    <div key={i} className="flex gap-2 text-sm text-[#241710] font-semibold">
                      <span className="text-[#8C7259] font-black">{i + 1}.</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function generateLocalHeuristic(
  prod: Product,
  hppData: ReturnType<typeof calculateHPP>,
  offlineData: ReturnType<typeof calculateOfflinePrice>,
  promoData: ReturnType<typeof calculatePromoSim>
): AIAnalysisResult {
  const fmt = formatIDR;
  const actionItems: string[] = [];

  let hppAnalysis = '';
  if (hppData.mainPct > 70) {
    hppAnalysis = `Porsi biaya Bahan Baku Utama Anda sangat dominan (${hppData.mainPct.toFixed(1)}%). Pertimbangkan pembelian bulk untuk mendapat potongan harga grosir.`;
    actionItems.push(`Negosiasikan harga beli bahan utama dengan supplier untuk pembelian volume besar.`);
  } else if (hppData.packPct > 15) {
    hppAnalysis = `Proporsi biaya Kemasan cukup tinggi (${hppData.packPct.toFixed(1)}%). Cari alternatif kemasan ekonomis tanpa mengurangi tampilan produk.`;
    actionItems.push(`Cari vendor kemasan polos dengan stiker brand custom untuk menekan biaya.`);
  } else {
    hppAnalysis = `Struktur biaya HPP Murni seimbang: ${hppData.mainPct.toFixed(1)}% Bahan Utama, ${hppData.bopPct.toFixed(1)}% BOP, ${hppData.packPct.toFixed(1)}% Kemasan.`;
  }

  let pricingStrategy = '';
  if (offlineData.marginRatio < 15) {
    pricingStrategy = `PERINGATAN MARGIN KRITIS! Margin offline hanya ${offlineData.marginRatio.toFixed(1)}% (${fmt(offlineData.netOfflineMargin)}/porsi). Naikkan harga ke minimal ${fmt(offlineData.recommendedPrice)}.`;
    actionItems.push(`Naikkan harga toko offline ke ${fmt(offlineData.recommendedPrice)} untuk margin sehat minimal 30%.`);
  } else if (offlineData.marginRatio >= 30) {
    pricingStrategy = `Margin offline sangat sehat (${offlineData.marginRatio.toFixed(1)}%). Keuntungan bersih ${fmt(offlineData.netOfflineMargin)} per porsi sudah aman.`;
  } else {
    pricingStrategy = `Margin offline pas-pasan (${offlineData.marginRatio.toFixed(1)}%). Pertimbangkan kenaikan harga bertahap untuk buffer biaya operasional.`;
  }

  let promoSafety = '';
  if (promoData.isBoncos) {
    promoSafety = `🚨 PROMO RUGI! Pada ${promoData.orderQty} porsi, uang cair (${fmt(promoData.netPayout)}) lebih kecil dari HPP (${fmt(promoData.totalHPPOrder)}). Rugi ${fmt(Math.abs(promoData.netProfit))}.`;
    actionItems.push(`Turunkan batas maksimal diskon atau naikkan minimal pembelian promo.`);
  } else {
    promoSafety = `🟢 PROMO AMAN! Pada ${promoData.orderQty} porsi, laba bersih promo ${fmt(promoData.netProfit)}. HPP tertutup sempurna.`;
  }

  const statusText = promoData.isBoncos ? 'membutuhkan penyesuaian promo segera' : 'berada dalam kondisi finansial yang baik';
  return {
    source: 'Local Smart Financial AI Engine',
    summary: `Resep "${prod.name}" memiliki HPP Murni ${fmt(hppData.hppMurni)}/porsi dengan margin ${offlineData.marginStatus.label} (${offlineData.marginRatio.toFixed(1)}%). Produk ${statusText}.`,
    hppAnalysis, pricingStrategy, promoSafety, actionItems,
  };
}
