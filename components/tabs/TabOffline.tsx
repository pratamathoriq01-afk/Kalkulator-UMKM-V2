'use client';

import FlexibleInput from '@/components/FlexibleInput';
import { formatIDR, calculateHPP, calculateOfflinePrice } from '@/lib/math';
import type { Product, PricingMode } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowRight, Store, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TabOfflineProps {
  prod: Product;
  onUpdateProduct: (field: string, value: unknown) => void;
  onNavigateTab: (tab: string) => void;
}

export default function TabOffline({ prod, onUpdateProduct, onNavigateTab }: TabOfflineProps) {
  const hppData = calculateHPP(prod);
  const offlineData = calculateOfflinePrice(hppData.hppMurni, prod);

  const activeMode: PricingMode = prod.pricingMode || 'food_cost';

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto pb-12">
      {/* Module Banner */}
      <Card className="bg-stone-50 border-stone-200 shadow-2xs">
        <CardHeader className="p-5 sm:p-6 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-stone-200 text-stone-900 border-stone-300 font-extrabold uppercase tracking-wider text-[10px]">
              Modul 2: Pricing Offline
            </Badge>
            <span className="text-xs text-stone-500 font-semibold">• Penjualan Toko / Dine-In / Takeaway</span>
          </div>
          <CardTitle className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Store className="h-5 w-5 text-[#4A3427]" /> Penentuan Harga Jual Toko (Offline)
          </CardTitle>
          <CardDescription className="text-xs text-stone-600 font-medium">
            Tentukan target margin & keuntungan bersih untuk pelanggan yang membeli langsung di toko Anda.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-stone-200 bg-white">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Step 1: Pricing Method Selector */}
          <div className="space-y-3 pb-6 border-b border-stone-100">
            <Label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              PILIH METODE PENETAPAN HARGA JUAL TOKO:
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'food_cost',
                  label: 'Target Food Cost %',
                  desc: 'Standar Industri FnB (misal Target 35%)',
                  badge: 'Standard FnB'
                },
                {
                  id: 'gross_margin',
                  label: 'Target Gross Margin %',
                  desc: 'Margin Kotor dari Omset (misal 65%)',
                  badge: 'Akuntansi Sales'
                },
                {
                  id: 'markup',
                  label: 'Cost-Plus Markup %',
                  desc: 'Kelipatan dari Modal HPP',
                  badge: 'Traditional'
                },
              ].map(({ id, label, desc, badge }) => (
                <div
                  key={id}
                  onClick={() => onUpdateProduct('pricingMode', id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    activeMode === id
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-stone-50 text-stone-800 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{label}</span>
                    <Badge variant={activeMode === id ? 'secondary' : 'outline'} className="text-[9px] px-2 py-0">
                      {badge}
                    </Badge>
                  </div>
                  <p className={`text-[10.5px] leading-snug font-medium ${activeMode === id ? 'text-stone-300' : 'text-stone-500'}`}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Input Target based on Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-stone-100">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-stone-500 block">HPP Murni per Porsi (Modul 1):</span>
              <span className="text-2xl font-black text-stone-900 font-mono">{formatIDR(hppData.hppMurni)}</span>
              <p className="text-[11px] text-stone-500 font-medium">Modal bersih 3 pilar SAK EMKM murni</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              {activeMode === 'food_cost' && (
                <>
                  <Label className="text-xs font-extrabold uppercase tracking-wider text-stone-800 block">
                    Target Food Cost %:
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="w-32">
                      <FlexibleInput
                        value={prod.targetFoodCostPercent ?? 35}
                        onChange={v => onUpdateProduct('targetFoodCostPercent', v)}
                        suffix="%"
                      />
                    </div>
                    <span className="text-xs text-stone-600 font-bold">
                      Rumus: HPP ÷ Food Cost % (Rekomendasi FnB: 30% - 40%)
                    </span>
                  </div>
                </>
              )}

              {activeMode === 'gross_margin' && (
                <>
                  <Label className="text-xs font-extrabold uppercase tracking-wider text-stone-800 block">
                    Target Gross Margin %:
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="w-32">
                      <FlexibleInput
                        value={prod.targetMarginPercent ?? 65}
                        onChange={v => onUpdateProduct('targetMarginPercent', v)}
                        suffix="%"
                      />
                    </div>
                    <span className="text-xs text-stone-600 font-bold">
                      Rumus: HPP ÷ (1 - Margin %)
                    </span>
                  </div>
                </>
              )}

              {activeMode === 'markup' && (
                <>
                  <Label className="text-xs font-extrabold uppercase tracking-wider text-stone-800 block">
                    Target Cost-Plus Markup %:
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="w-32">
                      <FlexibleInput
                        value={prod.marginPercent}
                        onChange={v => onUpdateProduct('marginPercent', v)}
                        suffix="%"
                      />
                    </div>
                    <span className="text-xs text-stone-600 font-bold">
                      + {formatIDR(hppData.hppMurni * (prod.marginPercent / 100))} dari HPP
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Step 3: Custom Price Box */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
                Kalkulasi Rekomendasi Presisi:
              </span>
              <span className="text-sm font-black text-stone-900 font-mono">
                {formatIDR(offlineData.recommendedPriceRaw)}
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-[#4A3427] text-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#241710]">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-white block">
                  HARGA JUAL TOKO FIX (OFFLINE):
                </span>
                <p className="text-[11px] text-stone-200 font-medium opacity-90">
                  Dapat dibulatkan manual sesuai nominal manis di menu toko
                </p>
              </div>
              <div className="w-full sm:w-56 bg-white text-stone-900 rounded-xl p-1 shadow-inner">
                <FlexibleInput
                  value={offlineData.effectiveOfflinePrice}
                  onChange={v => onUpdateProduct('customOfflinePrice', v)}
                  prefix="Rp"
                />
              </div>
            </div>
          </div>

          {/* Step 4: Margin & Food Cost Health Analysis */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
                ANALISIS KEUNTUNGAN & RASIO HARGA JUAL:
              </span>
              <Badge variant={offlineData.marginRatio >= 50 ? 'success' : offlineData.marginRatio >= 30 ? 'warning' : 'destructive'} className="text-xs py-1 px-3">
                {offlineData.marginStatus.icon} Status: {offlineData.marginStatus.label}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200 text-xs">
              <div className="p-3 bg-white rounded-xl border border-stone-200/80 flex justify-between items-center">
                <span className="font-bold text-stone-600">📊 Gross Margin (Laba Kotor):</span>
                <span className="font-mono font-black text-stone-900 text-sm">{offlineData.marginRatio.toFixed(1)}%</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-200/80 flex justify-between items-center">
                <span className="font-bold text-stone-600">🍲 Real Food Cost %:</span>
                <span className="font-mono font-black text-stone-900 text-sm">{offlineData.foodCostRatio.toFixed(1)}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-sm font-extrabold text-stone-900">
              <span>Laba Bersih Offline per Porsi:</span>
              <span className="font-mono text-base font-black">{formatIDR(offlineData.netOfflineMargin)}</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={() => onNavigateTab('online')} className="bg-[#4A3427] hover:bg-[#34241B] rounded-xl px-6 py-3 text-xs font-bold">
              <span>Lanjut ke Modul 3: Harga Aplikasi Online</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
