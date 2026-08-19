'use client';

import { useState } from 'react';
import FlexibleInput from '@/components/FlexibleInput';
import { formatIDR, calculateHPP, calculateOfflinePrice, calculateOfflinePromo } from '@/lib/math';
import type { Product } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  ArrowRight, Store, ChevronDown, ChevronUp,
  TrendingUp, ShieldCheck, AlertTriangle, Target, Tag,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TabOfflineProps {
  prod: Product;
  onUpdateProduct: (field: string, value: unknown) => void;
  onNavigateTab: (tab: string) => void;
}

const MARGIN_PRESETS = [
  { label: '40%', value: 40, desc: 'Minimal' },
  { label: '50%', value: 50, desc: 'Standar' },
  { label: '60%', value: 60, desc: 'FnB Ideal' },
  { label: '70%', value: 70, desc: 'Premium' },
];

export default function TabOffline({ prod, onUpdateProduct, onNavigateTab }: TabOfflineProps) {
  const [showPromo, setShowPromo] = useState(false);

  const hppData = calculateHPP(prod);
  const offlineData = calculateOfflinePrice(hppData.hppMurni, prod);
  const offlinePromo = calculateOfflinePromo(offlineData.effectiveOfflinePrice, hppData.hppMurni, prod);

  const targetMargin = prod.targetMarginPercent ?? 60;

  // Margin health color
  const marginColor =
    offlineData.marginRatio >= 50 ? 'text-emerald-600' :
    offlineData.marginRatio >= 30 ? 'text-amber-600' :
    'text-red-600';

  const marginBg =
    offlineData.marginRatio >= 50 ? 'bg-emerald-50 border-emerald-200' :
    offlineData.marginRatio >= 30 ? 'bg-amber-50 border-amber-200' :
    'bg-red-50 border-red-200';

  return (
    <TooltipProvider>
      <div className="space-y-5 animate-in fade-in duration-300 max-w-4xl mx-auto pb-12">

        {/* ── Module Banner ── */}
        <Card className="bg-white border-[#e0e3e5] rounded-2xl shadow-sm">
          <CardHeader className="p-5 sm:p-6 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-[#e1e0ff] text-[#07006c] font-bold uppercase tracking-wider text-[10px]">
                Modul 2: Pricing Offline
              </Badge>
              <span className="text-xs text-[#45464d] font-medium">• Penjualan Toko / Dine-In / Takeaway</span>
            </div>
            <CardTitle className="font-heading text-xl font-bold text-[#191c1e] flex items-center gap-2">
              <Store className="h-5 w-5 text-[#131b2e]" /> Penentuan Harga Jual Toko (Offline)
            </CardTitle>
            <CardDescription className="text-xs text-[#45464d] font-medium">
              Tentukan target margin keuntungan — sistem akan otomatis menghitung harga jual yang tepat.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* ── Main Pricing Card ── */}
        <Card className="border-[#e0e3e5] bg-white rounded-2xl">
          <CardContent className="p-6 sm:p-8 space-y-7">

            {/* ── Step 1: HPP Reference ── */}
            <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#45464d] block mb-0.5">Modal HPP Murni / Porsi (dari Modul 1)</span>
                <span className="text-2xl font-bold text-[#191c1e] font-mono">{formatIDR(hppData.hppMurni)}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#45464d] block mb-0.5">Formula Aktif</span>
                <span className="text-xs font-semibold text-[#4648d4] font-mono">HPP ÷ (1 - Margin%)</span>
              </div>
            </div>

            {/* ── Step 2: Target Margin Input ── */}
            <div className="space-y-4 pb-6 border-b border-[#f2f4f6]">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold text-[#191c1e] flex items-center gap-2">
                  <Target className="h-4 w-4 text-[#4648d4]" />
                  Target Margin Keuntungan
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="text-[10px] border-[#4648d4] text-[#4648d4] font-semibold">
                      Gross Margin on Sales
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs max-w-xs">
                    Margin dihitung dari Harga Jual (bukan dari HPP). Rumus: Margin% = ((Harga Jual - HPP) ÷ Harga Jual) × 100%
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Preset Chips */}
              <div className="flex flex-wrap gap-2">
                {MARGIN_PRESETS.map(preset => (
                  <button
                    key={preset.value}
                    onClick={() => {
                      onUpdateProduct('targetMarginPercent', preset.value);
                      onUpdateProduct('customOfflinePrice', null);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      targetMargin === preset.value
                        ? 'bg-[#131b2e] text-white border-[#131b2e] shadow-sm'
                        : 'bg-white text-[#45464d] border-[#e0e3e5] hover:border-[#4648d4] hover:text-[#4648d4]'
                    }`}
                  >
                    {preset.label} <span className={`font-normal ${targetMargin === preset.value ? 'text-[#bec6e0]' : 'text-[#76777d]'}`}>• {preset.desc}</span>
                  </button>
                ))}
              </div>

              {/* Slider + Number input */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={10}
                    max={90}
                    step={1}
                    value={targetMargin}
                    onChange={e => {
                      onUpdateProduct('targetMarginPercent', parseInt(e.target.value));
                      onUpdateProduct('customOfflinePrice', null);
                    }}
                    className="flex-1 h-2 rounded-full accent-[#4648d4] cursor-pointer"
                  />
                  <div className="w-24 flex-shrink-0">
                    <FlexibleInput
                      value={targetMargin}
                      onChange={v => {
                        onUpdateProduct('targetMarginPercent', Math.min(90, Math.max(10, v)));
                        onUpdateProduct('customOfflinePrice', null);
                      }}
                      suffix="%"
                      min={10}
                      max={90}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-[#76777d] font-medium px-0.5">
                  <span>10% (minimal)</span>
                  <span>55-65% (FnB ideal)</span>
                  <span>90% (premium)</span>
                </div>
              </div>
            </div>

            {/* ── Step 3: Recommended Price (Harga Jual Rekomendasi) ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-[#45464d]">Kalkulasi Harga Jual Presisi:</span>
                <span className="font-mono font-bold text-[#191c1e]">{formatIDR(offlineData.recommendedPriceRaw)}</span>
              </div>

              {/* Big price card */}
              <div className="p-5 rounded-2xl bg-[#131b2e] text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#191c1e]">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#bec6e0] block">HARGA JUAL TOKO (OFFLINE)</span>
                  <div className="font-heading text-3xl font-bold font-mono tracking-tight">
                    {formatIDR(offlineData.effectiveOfflinePrice)}
                  </div>
                  <p className="text-[11px] text-[#bec6e0]">
                    {prod.customOfflinePrice && prod.customOfflinePrice > 0
                      ? '✏️ Harga custom (override manual aktif)'
                      : `🔒 Auto-hitung: ${formatIDR(hppData.hppMurni)} ÷ (1 - ${targetMargin}%)`}
                  </p>
                </div>
                <div className="w-full sm:w-56">
                  <Label className="text-[10px] text-[#bec6e0] font-bold uppercase block mb-1.5 px-1">
                    Sesuaikan Manual (opsional):
                  </Label>
                  <div className="bg-white rounded-xl p-1">
                    <FlexibleInput
                      value={offlineData.effectiveOfflinePrice}
                      onChange={v => onUpdateProduct('customOfflinePrice', v > 0 ? v : null)}
                      prefix="Rp"
                    />
                  </div>
                  {prod.customOfflinePrice && prod.customOfflinePrice > 0 && (
                    <button
                      onClick={() => onUpdateProduct('customOfflinePrice', null)}
                      className="mt-1.5 text-[10px] text-[#bec6e0] hover:text-white underline cursor-pointer w-full text-center"
                    >
                      ↩ Reset ke harga otomatis
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Step 4: Health Dashboard ── */}
            <div className={`p-5 rounded-2xl border space-y-4 ${marginBg}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#191c1e]">Analisis Keuntungan & Kesehatan Harga:</span>
                <Badge
                  className={`text-xs py-1 px-3 font-semibold ${
                    offlineData.marginRatio >= 50 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    offlineData.marginRatio >= 30 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  {offlineData.marginStatus.icon} Status: {offlineData.marginStatus.label}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-[#e0e3e5] text-center">
                  <span className="text-[10px] text-[#45464d] font-bold uppercase block mb-1">Gross Margin %</span>
                  <span className={`font-mono font-bold text-xl ${marginColor}`}>{offlineData.marginRatio.toFixed(1)}%</span>
                  <p className="text-[10px] text-[#76777d] mt-0.5">Target: {targetMargin}%</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#e0e3e5] text-center">
                  <span className="text-[10px] text-[#45464d] font-bold uppercase block mb-1">Food Cost %</span>
                  <span className="font-mono font-bold text-xl text-[#191c1e]">{offlineData.foodCostRatio.toFixed(1)}%</span>
                  <p className="text-[10px] text-[#76777d] mt-0.5">Standar FnB: 30–40%</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#e0e3e5] text-center">
                  <span className="text-[10px] text-[#45464d] font-bold uppercase block mb-1">Laba Bersih / Porsi</span>
                  <span className="font-mono font-bold text-xl text-[#191c1e]">{formatIDR(offlineData.netOfflineMargin)}</span>
                  <p className="text-[10px] text-[#76777d] mt-0.5">per transaksi toko</p>
                </div>
              </div>

              {offlineData.marginRatio < 30 && (
                <div className="flex items-start gap-2 text-xs text-red-700 font-medium">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>Margin di bawah 30% sangat berisiko — naikkan target margin atau evaluasi ulang biaya bahan baku.</span>
                </div>
              )}

              {offlineData.marginRatio >= 50 && (
                <div className="flex items-start gap-2 text-xs text-emerald-700 font-medium">
                  <ShieldCheck className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>Margin sehat! Harga jual sudah mengcover HPP dengan buffer keuntungan yang solid.</span>
                </div>
              )}
            </div>

            {/* ── Step 5: Promo Toko (Collapsible) ── */}
            <div className="border border-[#e0e3e5] rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowPromo(!showPromo)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#f7f9fb] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#4648d4]" />
                  <span className="text-sm font-bold text-[#191c1e]">Simulasi Promo Toko (Offline)</span>
                  {prod.offlinePromoEnabled && (
                    <Badge className="bg-[#e1e0ff] text-[#07006c] text-[10px] font-bold">Aktif</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#45464d]">
                  <span>{showPromo ? 'Tutup' : 'Buka'}</span>
                  {showPromo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {showPromo && (
                <div className="p-5 border-t border-[#e0e3e5] space-y-5 bg-[#fafbfc]">
                  {/* Toggle */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="offline-promo-toggle" className="text-xs font-bold text-[#191c1e]">
                      Aktifkan Simulasi Promo Toko:
                    </Label>
                    <Switch
                      id="offline-promo-toggle"
                      checked={!!prod.offlinePromoEnabled}
                      onCheckedChange={c => onUpdateProduct('offlinePromoEnabled', c)}
                    />
                  </div>

                  {prod.offlinePromoEnabled && (
                    <>
                      {/* Jenis diskon */}
                      <div className="space-y-3">
                        <Label className="text-xs font-bold text-[#45464d] uppercase tracking-wider">Jenis Diskon:</Label>
                        <RadioGroup
                          value={prod.offlineDiscountMode || 'percent'}
                          onValueChange={v => onUpdateProduct('offlineDiscountMode', v)}
                          className="flex gap-4"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="percent" id="disc-pct" />
                            <Label htmlFor="disc-pct" className="text-xs font-semibold cursor-pointer">Persentase (%)</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="nominal" id="disc-nom" />
                            <Label htmlFor="disc-nom" className="text-xs font-semibold cursor-pointer">Nominal (Rp)</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Input diskon */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-[#45464d]">
                            {prod.offlineDiscountMode === 'nominal' ? 'Nominal Diskon (Rp):' : 'Diskon (%):'}
                          </Label>
                          {prod.offlineDiscountMode === 'nominal' ? (
                            <FlexibleInput
                              value={prod.offlineDiscountNominal ?? 0}
                              onChange={v => onUpdateProduct('offlineDiscountNominal', v)}
                              prefix="Rp"
                            />
                          ) : (
                            <FlexibleInput
                              value={prod.offlineDiscountPercent ?? 0}
                              onChange={v => onUpdateProduct('offlineDiscountPercent', Math.min(99, v))}
                              suffix="%"
                              max={99}
                            />
                          )}
                        </div>
                      </div>

                      {/* Hasil Simulasi Promo */}
                      <div className="p-4 rounded-xl bg-white border border-[#e0e3e5] space-y-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#45464d] flex items-center gap-1.5">
                          <TrendingUp className="h-3.5 w-3.5" />
                          Hasil Simulasi Promo:
                        </div>

                        {/* Harga coret visual */}
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <span className="text-[10px] text-[#76777d] block">Harga Coret (Menu)</span>
                            <span className="font-mono font-bold text-sm text-[#76777d] line-through">
                              {formatIDR(offlinePromo.hargaFinalCoret)}
                            </span>
                          </div>
                          <span className="text-[#4648d4] font-bold">→</span>
                          <div className="text-center">
                            <span className="text-[10px] text-[#45464d] block">Harga Setelah Diskon</span>
                            <span className="font-mono font-bold text-lg text-[#191c1e]">
                              {formatIDR(offlinePromo.priceAfterDiscount)}
                            </span>
                          </div>
                          <div className="ml-auto text-center">
                            <span className="text-[10px] text-[#45464d] block">Margin Setelah Promo</span>
                            <span className={`font-mono font-bold text-sm ${offlinePromo.isLosing ? 'text-red-600' : 'text-emerald-600'}`}>
                              {offlinePromo.marginRatioAfterDiscount.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        {offlinePromo.isLosing && (
                          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-semibold">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                            <span>⚠️ Harga setelah promo di bawah HPP! Transaksi ini merugi {formatIDR(Math.abs(offlinePromo.netMarginAfterDiscount))}/porsi.</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ── Navigate CTA ── */}
            <div className="flex justify-end pt-2">
              <Button onClick={() => onNavigateTab('online')} className="bg-[#131b2e] hover:bg-[#2d3133] text-white rounded-xl px-6 py-2.5 text-xs font-semibold shadow-sm">
                <span>Lanjut ke Modul 3: Harga Aplikasi Online</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>

          </CardContent>
        </Card>

      </div>
    </TooltipProvider>
  );
}
