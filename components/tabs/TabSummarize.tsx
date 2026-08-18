'use client';

import { useState } from 'react';
import { formatIDR, calculateHPP, calculateOfflinePrice, calculateOnlinePrice, calculatePromoSim } from '@/lib/math';
import type { Product } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Wallet, Package, Lightbulb, Download, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TabSummarizeProps {
  prod: Product;
  onOpenAI: () => void;
}

export default function TabSummarize({ prod, onOpenAI }: TabSummarizeProps) {
  const hppData = calculateHPP(prod);
  const offlineData = calculateOfflinePrice(hppData.hppMurni, prod);
  const onlineData = calculateOnlinePrice(offlineData.effectiveOfflinePrice, prod);
  const promoData = calculatePromoSim(hppData.hppMurni, onlineData.effectiveOnlinePrice, offlineData.effectiveOfflinePrice, prod);

  const orderQty = prod.simOrderQty || 10;
  const totalProjRevenue = offlineData.effectiveOfflinePrice * orderQty;

  // Margin percentages for channel chart
  const offlineMarginPct = Math.min(100, Math.max(0, Math.round(offlineData.marginRatio)));
  const onlineMarginPct = Math.min(100, Math.max(0, Math.round(((onlineData.effectiveOnlinePrice - hppData.hppMurni) / (onlineData.effectiveOnlinePrice || 1)) * 100)));
  const promoMarginPct = Math.min(100, Math.max(0, Math.round((promoData.netProfit / (promoData.customerPays || 1)) * 100)));

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto pb-12">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e0e3e5] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="bg-[#e1e0ff] text-[#07006c] font-bold text-[10px] uppercase">
              Modul 5: Summary & Dashboard
            </Badge>
            <span className="text-xs text-[#45464d] font-medium">• Lumina Finance SME Engine</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#191c1e]">
            Summary & Dashboard Final
          </h2>
          <p className="font-body-md text-xs text-[#45464d] mt-1">
            Ringkasan akhir kesehatan finansial produk dan analisis profitabilitas per saluran penjualan.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onOpenAI}
            className="bg-[#131b2e] hover:bg-[#2d3133] text-white rounded-lg text-xs font-semibold px-4 py-2 flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4 text-[#e1e0ff]" />
            <span>AI Advisor</span>
          </Button>
        </div>
      </div>

      {/* KPI 3 Cards Grid (Exact Stitch b7da Screen) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <Card className="bg-white border-[#e0e3e5] rounded-xl p-5 flex flex-col justify-between space-y-2">
          <div className="flex justify-between items-start">
            <span className="font-label-sm text-[11px] font-bold text-[#45464d] uppercase tracking-wider">Projected Revenue ({orderQty} Porsi)</span>
            <TrendingUp className="h-4 w-4 text-[#4648d4]" />
          </div>
          <div className="font-heading text-2xl font-bold text-[#191c1e] font-mono">
            {formatIDR(totalProjRevenue)}
          </div>
          <div className="text-[11px] font-semibold text-[#006e1c] flex items-center gap-1">
            <span>+ Baseline Toko Offline</span>
          </div>
        </Card>

        {/* KPI 2 */}
        <Card className="bg-white border-[#e0e3e5] rounded-xl p-5 flex flex-col justify-between space-y-2">
          <div className="flex justify-between items-start">
            <span className="font-label-sm text-[11px] font-bold text-[#45464d] uppercase tracking-wider">Avg Profit Margin (Offline)</span>
            <Wallet className="h-4 w-4 text-[#4648d4]" />
          </div>
          <div className="font-heading text-2xl font-bold text-[#191c1e]">
            {offlineData.marginRatio.toFixed(1)}%
          </div>
          <div className="text-[11px] font-medium text-[#45464d]">
            Target Food Cost: {offlineData.foodCostRatio.toFixed(1)}%
          </div>
        </Card>

        {/* KPI 3 */}
        <Card className="bg-white border-[#e0e3e5] rounded-xl p-5 flex flex-col justify-between space-y-2">
          <div className="flex justify-between items-start">
            <span className="font-label-sm text-[11px] font-bold text-[#45464d] uppercase tracking-wider">Total HPP Murni / Porsi</span>
            <Package className="h-4 w-4 text-[#4648d4]" />
          </div>
          <div className="font-heading text-2xl font-bold text-[#191c1e] font-mono">
            {formatIDR(hppData.hppMurni)}
          </div>
          <div className="text-[11px] font-medium text-[#45464d]">
            3 Pilar Manufaktur SAK EMKM
          </div>
        </Card>
      </div>

      {/* Grid: Bar Chart + AI Advisor Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area (2 Cols) */}
        <Card className="lg:col-span-2 bg-white border-[#e0e3e5] rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-sm font-bold text-[#191c1e]">Profit Margin by Channel</h3>
            <Badge variant="outline" className="text-[10px] text-[#45464d] border-[#e0e3e5]">Comparison</Badge>
          </div>

          <div className="min-h-[220px] w-full bg-[#f7f9fb] flex items-end justify-around p-6 rounded-lg border border-[#e0e3e5] relative">
            {/* Offline Bar */}
            <div className="w-20 bg-[#131b2e] rounded-t-md relative group flex flex-col justify-end items-center" style={{ height: `${Math.max(25, offlineMarginPct)}%` }}>
              <span className="font-mono text-xs font-bold text-white mb-2">{offlineMarginPct}%</span>
              <span className="absolute -bottom-7 w-full text-center text-xs font-bold text-[#45464d]">Offline</span>
            </div>

            {/* Online Bar */}
            <div className="w-20 bg-[#4648d4] rounded-t-md relative group flex flex-col justify-end items-center" style={{ height: `${Math.max(20, onlineMarginPct)}%` }}>
              <span className="font-mono text-xs font-bold text-white mb-2">{onlineMarginPct}%</span>
              <span className="absolute -bottom-7 w-full text-center text-xs font-bold text-[#45464d]">Online App</span>
            </div>

            {/* Promo Bar */}
            <div className={`w-20 rounded-t-md relative group flex flex-col justify-end items-center ${promoData.isBoncos ? 'bg-[#ba1a1a]' : 'bg-[#006e1c]'}`} style={{ height: `${Math.max(15, Math.abs(promoMarginPct))}%` }}>
              <span className="font-mono text-xs font-bold text-white mb-2">{promoMarginPct}%</span>
              <span className="absolute -bottom-7 w-full text-center text-xs font-bold text-[#45464d]">Promo</span>
            </div>
          </div>
        </Card>

        {/* AI Advisor Insights Sidebar (1 Col) */}
        <Card className="bg-white border-[#e0e3e5] rounded-xl p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#f2f4f6]">
            <Lightbulb className="h-4 w-4 text-[#4648d4]" />
            <h3 className="font-heading text-sm font-bold text-[#191c1e]">AI Advisor Insights</h3>
          </div>

          <div className="space-y-3 flex-1 text-xs">
            <div className="p-3 bg-[#f7f9fb] rounded-lg border border-[#e0e3e5] space-y-1">
              <strong className="text-[#191c1e] font-bold block">Pricing Alert</strong>
              <p className="text-[#45464d] leading-relaxed">
                {promoData.isBoncos
                  ? `Skenario promo online berisiko RUGI PROMO. Laba bersih minus ${formatIDR(Math.abs(promoData.netProfit))}.`
                  : `Margin promo online tercapai (${promoMarginPct}%). Laba bersih aman.`}
              </p>
            </div>

            <div className="p-3 bg-[#f7f9fb] rounded-lg border border-[#e0e3e5] space-y-1">
              <strong className="text-[#191c1e] font-bold block">Optimization Opportunity</strong>
              <p className="text-[#45464d] leading-relaxed">
                Penjualan offline memberikan margin kotor {offlineData.marginRatio.toFixed(1)}%. Pertahankan volume order toko fisik sebagai fondasi cash flow.
              </p>
            </div>

            <div className="p-3 bg-[#f7f9fb] rounded-lg border border-[#e0e3e5] space-y-1">
              <strong className="text-[#191c1e] font-bold block">HPP Structure</strong>
              <p className="text-[#45464d] leading-relaxed">
                Proporsi Bahan Utama mengambil {hppData.mainPct.toFixed(1)}% dari total HPP Murni {formatIDR(hppData.hppMurni)}.
              </p>
            </div>
          </div>

          <Button
            onClick={onOpenAI}
            className="mt-4 w-full bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#191c1e] border border-[#e0e3e5] rounded-lg text-xs font-semibold py-2"
          >
            Konsultasi AI Lengkap
          </Button>
        </Card>
      </div>

      {/* Full Width HPP Breakdown Table */}
      <Card className="bg-white border-[#e0e3e5] rounded-xl overflow-hidden">
        <CardHeader className="p-4 bg-[#f2f4f6] border-b border-[#e0e3e5]">
          <CardTitle className="font-heading text-sm font-bold text-[#191c1e]">
            Rincian Komponen HPP Murni (SAK EMKM)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#e0e3e5] bg-[#f7f9fb] text-[#45464d] font-bold uppercase text-[10px]">
                  <th className="p-3.5">Komponen Biaya</th>
                  <th className="p-3.5 text-right">Nilai (Rp)</th>
                  <th className="p-3.5 text-right">% dari Total HPP</th>
                  <th className="p-3.5 text-center">Status SAK EMKM</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[#191c1e]">
                <tr className="border-b border-[#f2f4f6] hover:bg-[#f7f9fb] transition-colors">
                  <td className="p-3.5 font-sans font-medium">Bahan Baku Utama (Direct Materials)</td>
                  <td className="p-3.5 text-right font-bold">{formatIDR(hppData.totalMainMaterials)}</td>
                  <td className="p-3.5 text-right font-bold">{hppData.mainPct.toFixed(1)}%</td>
                  <td className="p-3.5 text-center font-sans">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#131b2e]" title="Bahan Utama" />
                  </td>
                </tr>
                <tr className="border-b border-[#f2f4f6] hover:bg-[#f7f9fb] transition-colors">
                  <td className="p-3.5 font-sans font-medium">Overhead / Utilitas Produksi (BOP)</td>
                  <td className="p-3.5 text-right font-bold">{formatIDR(hppData.totalBopMaterials)}</td>
                  <td className="p-3.5 text-right font-bold">{hppData.bopPct.toFixed(1)}%</td>
                  <td className="p-3.5 text-center font-sans">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#4648d4]" title="BOP Variabel" />
                  </td>
                </tr>
                <tr className="border-b border-[#f2f4f6] hover:bg-[#f7f9fb] transition-colors">
                  <td className="p-3.5 font-sans font-medium">Kemasan Produksi (Packaging)</td>
                  <td className="p-3.5 text-right font-bold">{formatIDR(hppData.totalPackagings)}</td>
                  <td className="p-3.5 text-right font-bold">{hppData.packPct.toFixed(1)}%</td>
                  <td className="p-3.5 text-center font-sans">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#dec29a]" title="Packaging" />
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-[#f2f4f6] border-t border-[#e0e3e5] font-bold font-sans">
                <tr>
                  <td className="p-3.5">Total HPP Murni per Porsi</td>
                  <td className="p-3.5 text-right font-mono text-sm font-extrabold text-[#131b2e]">{formatIDR(hppData.hppMurni)}</td>
                  <td className="p-3.5 text-right font-mono text-sm font-extrabold text-[#131b2e]">100%</td>
                  <td className="p-3.5 text-center text-[#006e1c] font-bold text-[11px]">VALID (0% Risiko)</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
