'use client';

import { useState, useEffect } from 'react';
import { formatIDR, calculateHPP, calculateOfflinePrice, calculateOnlinePrice, calculatePromoSim } from '@/lib/math';
import type { Product } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, FileText, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

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
  const promoData = calculatePromoSim(hppData.hppMurni, onlineData.effectiveOnlinePrice, offlineData.effectiveOfflinePrice, prod);

  const handleRunQuickAI = () => {
    setLoadingAI(true);
    setTimeout(() => {
      setAiAnalysis({
        timestamp: new Date().toLocaleTimeString('id-ID'),
        summary: `Berdasarkan kalkulasi terpadu SAK EMKM, produk "${prod.name || 'Produk UMKM'}" memiliki HPP Murni ${formatIDR(hppData.hppMurni)}/porsi. Gross Margin harga toko offline sebesar ${offlineData.marginRatio.toFixed(1)}% (Food Cost ${offlineData.foodCostRatio.toFixed(1)}%) tergolong ${offlineData.marginRatio >= 50 ? 'SANGAT SEHAT' : 'CUKUP SEHAT'}. Pada kanal online, Reverse Margin menjaga pencairan bersih Anda tepat sebesar ${formatIDR(onlineData.simulatedPayout)}.`,
        recommendation: promoData.isBoncos
          ? '⚠️ PERINGATAN PROMO: Skenario promo online saat ini menyebabkan kerugian! Gunakan rekomendasi Harga Kampanye (Harga Coret) atau tingkatkan minimal belanja.'
          : '🟢 MARGIN AMAN: Skenario promo online memberikan laba bersih positif per transaksi. Anda dapat menjalankan promo dengan aman.',
      });
      setLoadingAI(false);
    }, 500);
  };

  useEffect(() => {
    handleRunQuickAI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prod.id]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto pb-12">
      {/* Executive Summary Header */}
      <Card className="bg-[#4A3427] text-white border-[#241710] shadow-sm">
        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/15 text-[#EFE9DC] border-white/20 text-[10px] font-extrabold uppercase tracking-widest">
                  📊 SUMMARIZE & AI CENTER
                </Badge>
                <span className="text-xs text-[#EFE9DC] font-medium">• Resep: {prod.name || 'Produk UMKM'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Rangkuman Keuangan & Analisis AI Integritas</h2>
              <p className="text-xs text-[#EFE9DC] max-w-xl font-medium opacity-90">
                Rangkuman eksekutif keseluruhan finansial produk (HPP SAK EMKM, Toko Offline, Reverse Margin Online, & Diskon Promo) terintegrasi langsung dengan Juragan AI Advisor.
              </p>
            </div>
            <Button
              onClick={handleRunQuickAI}
              disabled={loadingAI}
              className="bg-[#8C7259] hover:bg-[#6B5541] text-white border border-[#6B5541] rounded-xl text-xs font-bold self-start md:self-auto"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loadingAI ? 'animate-spin' : ''}`} />
              <span>{loadingAI ? 'Memproses AI...' : 'Analisis Ulang AI'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4-Card Financial Grid */}
      <Card className="border-stone-200 bg-white">
        <CardHeader className="p-5 sm:p-6 pb-2 border-b border-stone-100 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#4A3427]" /> RINGKASAN MODUL FINANSIAL UTAMA
          </CardTitle>
          <span className="text-xs text-stone-500 font-medium">Asumsi {prod.simOrderQty || 2} Porsi Order</span>
        </CardHeader>
        <CardContent className="p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Modul 1: HPP Murni',
                value: formatIDR(hppData.hppMurni),
                sub: 'Base cost 3 pilar / porsi',
                cls: 'bg-stone-50 border-stone-200',
                txtCls: 'text-stone-900'
              },
              {
                label: 'Modul 2: Harga Toko',
                value: formatIDR(offlineData.effectiveOfflinePrice),
                sub: `Gross Margin ${offlineData.marginRatio.toFixed(1)}%`,
                cls: 'bg-stone-50 border-stone-200',
                txtCls: 'text-stone-900'
              },
              {
                label: 'Modul 3: Harga Online',
                value: formatIDR(onlineData.effectiveOnlinePrice),
                sub: `Cair Bersih ${formatIDR(onlineData.simulatedPayout)}`,
                cls: 'bg-stone-50 border-stone-200',
                txtCls: 'text-stone-900'
              },
              {
                label: 'Modul 4: Net Laba Promo',
                value: `${promoData.netProfit >= 0 ? '+' : ''}${formatIDR(promoData.netProfit)}`,
                sub: promoData.isBoncos ? '🔴 BONCOS PROMO' : '🟢 MARGIN AMAN',
                cls: promoData.isBoncos ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50/60 border-emerald-200',
                txtCls: promoData.isBoncos ? 'text-rose-700' : 'text-emerald-800'
              },
            ].map(({ label, value, sub, cls, txtCls }) => (
              <div key={label} className={`p-4 rounded-2xl border space-y-1 shadow-2xs ${cls}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">{label}</span>
                <span className={`text-lg font-black font-mono block ${txtCls}`}>{value}</span>
                <span className={`text-[10.5px] font-semibold block ${txtCls}`}>{sub}</span>
              </div>
            ))}
          </div>

          {/* AI Executive Briefing */}
          {aiAnalysis && (
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                <Sparkles className="h-4 w-4 text-[#8C7259]" />
                <h4 className="text-xs font-bold uppercase text-stone-900">EXECUTIVE BRIEFING JURAGAN AI ADVISOR</h4>
                <span className="text-[10px] text-stone-400 font-mono ml-auto">Generated: {aiAnalysis.timestamp}</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed font-medium">{aiAnalysis.summary}</p>
              <div className={`p-3.5 rounded-xl text-xs font-bold border ${promoData.isBoncos ? 'bg-rose-50 text-rose-900 border-rose-200' : 'bg-white text-stone-900 border-stone-200'}`}>
                {aiAnalysis.recommendation}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              onClick={onOpenAI}
              className="bg-[#4A3427] hover:bg-[#34241B] rounded-xl px-6 py-3 text-xs font-bold"
            >
              <Sparkles className="h-4 w-4 mr-1.5 text-[#F0E6D2]" />
              <span>Buka Deep Consultation Juragan AI Advisor</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
