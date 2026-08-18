'use client';

import { useState } from 'react';
import { formatIDR, calculateHPP, calculateOfflinePrice, calculateOnlinePrice, calculatePromoSim } from '@/lib/math';
import type { Product, AIAnalysisResult } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Bot, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

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

export default function AIAssistantModal({
  isOpen,
  onClose,
  prod,
  apiKey,
  model,
  onUpdateApiKey,
  onUpdateModel,
}: AIAssistantModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const hppData = calculateHPP(prod);
  const offlineData = calculateOfflinePrice(hppData.hppMurni, prod);
  const onlineData = calculateOnlinePrice(offlineData.effectiveOfflinePrice, prod);
  const promoData = calculatePromoSim(hppData.hppMurni, onlineData.effectiveOnlinePrice, offlineData.effectiveOfflinePrice, prod);

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
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-stone-200 bg-white">
        {/* Header */}
        <div className="p-6 bg-[#4A3427] text-white rounded-t-3xl space-y-1">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-[#F0E6D2]" />
            <DialogTitle className="text-lg font-black text-white">Juragan AI Advisor</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-[#EFE9DC] font-medium opacity-90">
            Analisis finansial presisi berstandar SAK EMKM & Industri FnB
          </DialogDescription>
        </div>

        <div className="p-6 space-y-5">
          {/* Summary Financial Cards */}
          <div className="grid grid-cols-3 gap-3 text-center bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
            <div>
              <span className="text-[10px] text-stone-500 font-bold block uppercase">HPP Murni</span>
              <span className="text-sm font-black font-mono text-stone-900">{formatIDR(hppData.hppMurni)}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-bold block uppercase">Harga Offline</span>
              <span className="text-sm font-black font-mono text-stone-900">{formatIDR(offlineData.effectiveOfflinePrice)}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-bold block uppercase">Status Promo</span>
              <Badge variant={promoData.isBoncos ? 'destructive' : 'success'} className="text-[10px] mt-0.5">
                {promoData.isBoncos ? '🔴 BONCOS' : '🟢 AMAN'}
              </Badge>
            </div>
          </div>

          {/* AI Settings */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">Pengaturan Gemini AI Engine</span>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-stone-600 font-medium">API Key Gemini (Opsional)</Label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => onUpdateApiKey(e.target.value)}
                placeholder="Biarkan kosong jika sudah ada GEMINI_API_KEY di server..."
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] text-stone-600 font-medium">Model AI</Label>
              <select
                value={model}
                onChange={(e) => onUpdateModel(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl text-xs font-bold px-3 py-2 focus:outline-none focus:border-[#4A3427] text-stone-900"
              >
                {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full h-11 bg-[#4A3427] hover:bg-[#34241B] rounded-xl text-xs font-bold shadow-xs"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                <span>Sedang Menganalisis...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2 text-[#F0E6D2]" />
                <span>Analisis Sekarang</span>
              </>
            )}
          </Button>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Analysis Results */}
          {result && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-[10px] text-stone-500 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Sumber: {result.source}
              </div>

              <div className="bg-[#4A3427] text-white rounded-2xl p-4 space-y-1">
                <p className="text-[10px] text-[#EFE9DC] font-extrabold uppercase tracking-wider">Ringkasan Eksekutif</p>
                <p className="text-xs font-medium leading-relaxed text-stone-100">{result.summary}</p>
              </div>

              {[
                { key: 'hppAnalysis', label: '🏭 Analisis HPP & Biaya SAK EMKM', cls: 'bg-stone-50 border-stone-200 text-stone-900' },
                { key: 'pricingStrategy', label: '💰 Strategi Harga & Margin FnB', cls: 'bg-stone-50 border-stone-200 text-stone-900' },
                { key: 'promoSafety', label: '🏷️ Keamanan Promo Online/Offline', cls: result.promoSafety.includes('BONCOS') || result.promoSafety.includes('RUGI') ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50/60 border-emerald-200 text-emerald-900' },
              ].map(({ key, label, cls }) => (
                <div key={key} className={`rounded-2xl p-4 border space-y-1 ${cls}`}>
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">{label}</p>
                  <p className="text-xs font-medium leading-relaxed">{result[key as keyof AIAnalysisResult] as string}</p>
                </div>
              ))}

              {result.actionItems?.length > 0 && (
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
                  <p className="text-[10px] font-bold text-stone-900 uppercase tracking-wider">✅ Langkah Aksi Taktis</p>
                  {result.actionItems.map((item, i) => (
                    <div key={i} className="flex gap-2 text-xs text-stone-800 font-medium">
                      <span className="text-[#8C7259] font-bold">{i + 1}.</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
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
    hppAnalysis = `Proporsi biaya Kemasan cukup tinggi (${hppData.packPct.toFixed(1)}%). Cari alternatif kemasan ekonomis tanpa mengurangi kualitas produk.`;
    actionItems.push(`Cari vendor kemasan polos dengan stiker brand custom untuk menekan biaya.`);
  } else {
    hppAnalysis = `Struktur biaya HPP Murni SAK EMKM seimbang: ${hppData.mainPct.toFixed(1)}% Bahan Utama, ${hppData.bopPct.toFixed(1)}% BOP, ${hppData.packPct.toFixed(1)}% Kemasan.`;
  }

  let pricingStrategy = '';
  if (offlineData.marginRatio < 25) {
    pricingStrategy = `PERINGATAN MARGIN RENDAH! Gross Margin offline hanya ${offlineData.marginRatio.toFixed(1)}% (${fmt(offlineData.netOfflineMargin)}/porsi). Untuk FnB, disarankan Gross Margin minimal 50-65% (Food Cost 35%).`;
    actionItems.push(`Sesuaikan harga toko ke ${fmt(offlineData.recommendedPrice)} agar Food Cost berada di target ideal.`);
  } else if (offlineData.marginRatio >= 50) {
    pricingStrategy = `Gross Margin offline sangat sehat (${offlineData.marginRatio.toFixed(1)}%, Food Cost ${offlineData.foodCostRatio.toFixed(1)}%). Keuntungan bersih ${fmt(offlineData.netOfflineMargin)} per porsi aman.`;
  } else {
    pricingStrategy = `Gross Margin offline cukup baik (${offlineData.marginRatio.toFixed(1)}%). Sisa laba bersih ${fmt(offlineData.netOfflineMargin)} per porsi.`;
  }

  let promoSafety = '';
  if (promoData.isBoncos) {
    promoSafety = `🚨 PROMO RUGI! Uang cair (${fmt(promoData.netPayout)}) lebih kecil dari total HPP (${fmt(promoData.totalHPPOrder)}). Gunakan rekomendasi Harga Kampanye ${fmt(promoData.recommendedCampaignPrice)} sebelum diskon.`;
    actionItems.push(`Gunakan Harga Kampanye ${fmt(promoData.recommendedCampaignPrice)} sebelum diskon di aplikasi.`);
  } else {
    promoSafety = `🟢 PROMO AMAN! Pada ${promoData.orderQty} porsi, laba bersih promo ${fmt(promoData.netProfit)}. HPP tertutup sempurna.`;
  }

  const statusText = promoData.isBoncos ? 'membutuhkan penyesuaian promo segera' : 'berada dalam kondisi finansial yang baik';
  return {
    source: 'Local Financial AI Engine (SAK EMKM)',
    summary: `Resep "${prod.name}" memiliki HPP Murni ${fmt(hppData.hppMurni)}/porsi dengan Gross Margin ${offlineData.marginRatio.toFixed(1)}% (Food Cost ${offlineData.foodCostRatio.toFixed(1)}%). Produk ${statusText}.`,
    hppAnalysis, pricingStrategy, promoSafety, actionItems,
  };
}
