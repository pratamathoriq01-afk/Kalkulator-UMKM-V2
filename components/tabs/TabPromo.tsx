'use client';

import { useState } from 'react';
import FlexibleInput from '@/components/FlexibleInput';
import {
  formatIDR,
  calculateHPP,
  calculateOfflinePrice,
  calculateOfflinePromo,
  calculateOnlinePrice,
  calculatePromoSim,
} from '@/lib/math';
import type { Product } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Tag, Store, Smartphone, AlertCircle, ShieldAlert, Sparkles,
  CheckCircle, TrendingDown, ArrowUpRight, AlertTriangle, ShieldCheck
} from 'lucide-react';

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
  const promoData = calculatePromoSim(hppData.hppMurni, onlineData.effectiveOnlinePrice, offlineData.effectiveOfflinePrice, prod);

  return (
    <div className="space-y-5 animate-in fade-in duration-300 max-w-4xl mx-auto pb-12">

      {/* ── Module Banner ── */}
      <Card className="bg-white border-[#e0e3e5] rounded-2xl shadow-sm">
        <CardHeader className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-[#e1e0ff] text-[#07006c] font-bold uppercase tracking-wider text-[10px]">
              Modul 4: Promo Simulator
            </Badge>
            <span className="text-xs text-[#45464d] font-medium">• Pemisah Diskon Toko &amp; Proteksi App</span>
          </div>
          <CardTitle className="font-heading text-xl font-bold text-[#191c1e] flex items-center gap-2">
            <Tag className="h-5 w-5 text-[#131b2e]" /> Pusat Simulasi Diskon &amp; Proteksi Promo
          </CardTitle>
          <CardDescription className="text-xs text-[#45464d] font-medium">
            Simulasikan promo toko (offline) dan promo aplikasi (online) secara terpisah — deteksi risiko boncos dan dapatkan rekomendasi Harga Kampanye yang aman.
          </CardDescription>

          {/* ── Quick Reference Pills ── */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#e0e3e5]">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f7f9fb] border border-[#e0e3e5] text-xs">
              <span className="text-[#76777d] font-medium">HPP Murni:</span>
              <span className="font-mono font-bold text-[#191c1e]">{formatIDR(hppData.hppMurni)}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e1e0ff] border border-[#c0c1ff] text-xs">
              <Store className="h-3 w-3 text-[#07006c]" />
              <span className="text-[#07006c] font-medium">Harga Toko:</span>
              <span className="font-mono font-bold text-[#07006c]">{formatIDR(offlineData.effectiveOfflinePrice)}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e8f5e9] border border-[#a5d6a7] text-xs">
              <Smartphone className="h-3 w-3 text-[#1b5e20]" />
              <span className="text-[#2e7d32] font-medium">Harga Online:</span>
              <span className="font-mono font-bold text-[#1b5e20]">{formatIDR(onlineData.effectiveOnlinePrice)}</span>
            </div>
          </div>

          {/* ── Sub-tab Switcher ── */}
          <div className="pt-1">
            <Tabs value={activeSubTab} onValueChange={v => setActiveSubTab(v as 'online' | 'offline')} className="w-full">
              <TabsList className="w-full grid grid-cols-2 bg-[#f2f4f6] p-1 rounded-xl">
                <TabsTrigger value="online" className="flex items-center gap-2 text-xs font-bold data-[state=active]:bg-[#131b2e] data-[state=active]:text-white rounded-lg">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Promo Aplikasi Online</span>
                </TabsTrigger>
                <TabsTrigger value="offline" className="flex items-center gap-2 text-xs font-bold data-[state=active]:bg-[#131b2e] data-[state=active]:text-white rounded-lg">
                  <Store className="h-3.5 w-3.5" />
                  <span>Promo Toko Fisik (Offline)</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
      </Card>

      {/* ════════════════════════════════
          SUB-TAB: PROMO ONLINE
          ════════════════════════════════ */}
      {activeSubTab === 'online' && (
        <div className="space-y-5">
          <Card className="border-[#e0e3e5] bg-white rounded-2xl">
            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Toggle */}
              <div className="flex items-center justify-between border-b border-[#f2f4f6] pb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#191c1e]">⚙️ Skenario Promo Aplikasi Online</h3>
                  <p className="text-xs text-[#45464d] font-medium mt-0.5">Simulasikan kondisi promo dari platform (GoFood, GrabFood, ShopeeFood)</p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="promo-online-switch" className="text-xs font-bold text-[#191c1e]">Aktifkan:</Label>
                  <Switch
                    id="promo-online-switch"
                    checked={!!prod.promoEnabled}
                    onCheckedChange={c => onUpdateProduct('promoEnabled', c)}
                  />
                </div>
              </div>

              {/* Input params */}
              <div className="space-y-4">
                {/* Qty */}
                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-3">
                  <span className="text-xs font-bold text-[#191c1e] block">1. Asumsi Pesanan dalam 1 Struk:</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Label className="text-xs text-[#45464d] font-medium flex-shrink-0">Jumlah Porsi:</Label>
                      <div className="w-28">
                        <FlexibleInput value={prod.simOrderQty || 2} onChange={v => onUpdateProduct('simOrderQty', Math.max(1, v))} min={1} />
                      </div>
                      <span className="text-xs font-semibold text-[#45464d]">porsi</span>
                    </div>
                    <div className="ml-auto text-right">
                      <span className="text-[10px] text-[#45464d] font-semibold block">Subtotal Awal:</span>
                      <span className="text-base font-bold text-[#191c1e] font-mono">{formatIDR(promoData.orderSubtotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Promo terms */}
                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-3">
                  <span className="text-xs font-bold text-[#191c1e] block">2. Syarat &amp; Ketentuan Promo:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-[11px] font-bold text-[#45464d] block mb-1.5">Minimal Belanja (Rp):</Label>
                      <FlexibleInput value={prod.promoMinOrder} onChange={v => onUpdateProduct('promoMinOrder', v)} prefix="Rp" />
                    </div>
                    <div>
                      <Label className="text-[11px] font-bold text-[#45464d] block mb-1.5">Diskon Promo (%):</Label>
                      <FlexibleInput value={prod.promoPercent} onChange={v => onUpdateProduct('promoPercent', Math.min(99, v))} suffix="%" max={99} />
                    </div>
                    <div>
                      <Label className="text-[11px] font-bold text-[#45464d] block mb-1.5">Maks. Diskon / Cap (Rp):</Label>
                      <FlexibleInput value={prod.promoMaxDiscount} onChange={v => onUpdateProduct('promoMaxDiscount', v)} prefix="Rp" />
                    </div>
                  </div>
                </div>

                {/* Deduction mode */}
                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-2">
                  <span className="text-xs font-bold text-[#191c1e] block">3. Kebijakan Potong Komisi:</span>
                  <RadioGroup
                    value={prod.commissionDeductionMode || 'before_discount'}
                    onValueChange={v => onUpdateProduct('commissionDeductionMode', v)}
                    className="flex flex-col sm:flex-row gap-4 pt-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="before_discount" id="before_discount" />
                      <Label htmlFor="before_discount" className="text-xs font-medium cursor-pointer">
                        Dari Harga Awal (Sebelum Diskon) — <span className="text-[#45464d]">umum</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="after_discount" id="after_discount" />
                      <Label htmlFor="after_discount" className="text-xs font-medium cursor-pointer">
                        Dari Harga Akhir (Setelah Diskon) — <span className="text-[#45464d]">beberapa platform</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Simulation Result Card ── */}
          <Card className="border-[#e0e3e5] bg-white rounded-2xl">
            <CardHeader className="p-5 sm:p-6 pb-3 border-b border-[#f2f4f6]">
              <CardTitle className="font-heading text-sm font-bold uppercase tracking-wider text-[#191c1e]">
                🧾 Simulasi Hasil Transaksi Online Real-Time
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Dual struk: Konsumen & Penjual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sisi Konsumen */}
                <div className="p-5 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#45464d] border-b border-[#e0e3e5] pb-2">
                    👤 Sisi Konsumen
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-[#45464d] font-semibold">
                      <span>Belanja {promoData.orderQty} porsi @ {formatIDR(onlineData.effectiveOnlinePrice)}:</span>
                      <span className="font-mono font-bold text-[#191c1e]">{formatIDR(promoData.orderSubtotal)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Syarat Min. Belanja ({formatIDR(promoData.minOrder)}):</span>
                      <span className={promoData.isMinOrderMet ? 'text-emerald-600' : 'text-red-600'}>
                        {promoData.isMinOrderMet ? '✅ Terpenuhi' : '❌ Belum'}
                      </span>
                    </div>
                    <div className="flex justify-between text-red-600 font-bold">
                      <span>Diskon {promoData.promoPercent}%{promoData.isDiscountCapped ? ` (max ${formatIDR(promoData.maxDiscountCap)})` : ''}:</span>
                      <span className="font-mono">− {formatIDR(promoData.effectiveDiscount)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#e0e3e5] font-bold text-sm text-[#191c1e]">
                      <span>Total Dibayar Konsumen:</span>
                      <span className="font-mono">{formatIDR(promoData.customerPays)}</span>
                    </div>
                  </div>
                </div>

                {/* Sisi Penjual */}
                <div className="p-5 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#45464d] border-b border-[#e0e3e5] pb-2">
                    🏪 Sisi Penjual
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-[#45464d] font-semibold">
                      <span>Dari konsumen:</span>
                      <span className="font-mono font-bold text-[#191c1e]">{formatIDR(promoData.customerPays)}</span>
                    </div>
                    <div className="flex justify-between text-red-600 font-bold">
                      <span>− Komisi platform ({prod.commissionPercent}%):</span>
                      <span className="font-mono">− {formatIDR(promoData.commissionOnlyAmount)}</span>
                    </div>
                    <div className="flex justify-between text-red-600 font-bold">
                      <span>− Biaya layanan tetap:</span>
                      <span className="font-mono">− {formatIDR(prod.fixedFee)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#e0e3e5] font-bold text-sm">
                      <span className="text-[#191c1e]">Uang Cair ke Penjual:</span>
                      <span className={`font-mono ${promoData.netPayout > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatIDR(promoData.netPayout)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BEP Safety Analysis */}
              <div className={`rounded-2xl p-5 border transition-colors ${
                promoData.isBoncos
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-current/10">
                  <div className="flex items-center gap-2">
                    {promoData.isBoncos
                      ? <ShieldAlert className="h-4 w-4 text-red-600" />
                      : <ShieldCheck className="h-4 w-4 text-emerald-600" />}
                    <h3 className="text-sm font-bold uppercase tracking-wider">Analisis Keamanan Promo Online</h3>
                  </div>
                  <Badge className={`text-xs py-1 px-3 font-bold border ${
                    promoData.isBoncos
                      ? 'bg-red-600 text-white border-red-700'
                      : 'bg-emerald-600 text-white border-emerald-700'
                  }`}>
                    {promoData.isBoncos ? '🔴 BONCOS' : '🟢 AMAN'}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span>Uang cair bersih ke penjual:</span>
                    <span className="font-mono font-bold">{formatIDR(promoData.netPayout)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total beban HPP ({promoData.orderQty} × {formatIDR(hppData.hppMurni)}):</span>
                    <span className="font-mono font-bold text-red-600">− {formatIDR(promoData.totalHPPOrder)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-current/10">
                    <span className="text-sm font-bold">Keuntungan Bersih Promo:</span>
                    <span className={`text-xl font-bold font-mono ${promoData.isBoncos ? 'text-red-700' : 'text-emerald-700'}`}>
                      {promoData.netProfit >= 0 ? '+' : ''}{formatIDR(promoData.netProfit)}
                    </span>
                  </div>
                </div>

                {promoData.isBoncos && (
                  <div className="mt-3 flex items-start gap-2 text-xs text-red-700 font-semibold">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{promoData.saranKenaikanHarga}</span>
                  </div>
                )}
              </div>

              {/* ── Auto-Markup Campaign Price ── */}
              <Card className="bg-[#131b2e] text-white border-[#191c1e] shadow-md rounded-2xl">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/15 pb-3">
                    <Sparkles className="h-4 w-4 text-[#e1e0ff]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#bec6e0]">
                      💡 Rekomendasi Harga Kampanye (Auto-Markup)
                    </h4>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div>
                      <span className="text-xs text-[#bec6e0] font-medium block mb-1">
                        Pasang harga ini di Aplikasi <em>sebelum</em> promo berjalan:
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-3xl font-bold font-mono text-white tracking-tight">
                          {formatIDR(promoData.recommendedCampaignPrice)}
                        </span>
                        <span className="text-sm font-semibold text-[#bec6e0]">/ porsi</span>
                      </div>
                      <span className="text-[11px] text-[#bec6e0] font-medium block mt-1">
                        (Subtotal {promoData.orderQty} porsi: {formatIDR(promoData.recommendedCampaignSubtotal)})
                      </span>
                    </div>
                    <div className="p-4 bg-white/10 rounded-xl border border-white/15 text-xs text-[#bec6e0] max-w-[220px] leading-relaxed font-medium">
                      <ArrowUpRight className="h-3.5 w-3.5 mb-1 text-[#c0c1ff]" />
                      Setelah didiskon <strong className="text-white">{promoData.promoPercent}%</strong> dan dipotong komisi app, uang yang cair ke rekening kamu <strong className="text-white">minimal tetap sama dengan harga toko</strong>!
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ════════════════════════════════
          SUB-TAB: PROMO OFFLINE
          ════════════════════════════════ */}
      {activeSubTab === 'offline' && (
        <div className="space-y-5">
          <Card className="border-[#e0e3e5] bg-white rounded-2xl">
            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Toggle */}
              <div className="flex items-center justify-between border-b border-[#f2f4f6] pb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#191c1e]">🏪 Diskon &amp; Promo Toko Fisik</h3>
                  <p className="text-xs text-[#45464d] font-medium mt-0.5">Simulasikan diskon toko untuk walk-in, dine-in, atau takeaway</p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="offline-promo-switch-tab" className="text-xs font-bold text-[#191c1e]">Aktifkan:</Label>
                  <Switch
                    id="offline-promo-switch-tab"
                    checked={!!prod.offlinePromoEnabled}
                    onCheckedChange={c => onUpdateProduct('offlinePromoEnabled', c)}
                  />
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-2">
                  <Label className="text-xs font-bold text-[#191c1e] block">Jenis Diskon:</Label>
                  <RadioGroup
                    value={prod.offlineDiscountMode || 'percent'}
                    onValueChange={v => onUpdateProduct('offlineDiscountMode', v)}
                    className="flex gap-4 pt-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="percent" id="disc_percent_tab" />
                      <Label htmlFor="disc_percent_tab" className="text-xs font-medium cursor-pointer">Persentase (%)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nominal" id="disc_nominal_tab" />
                      <Label htmlFor="disc_nominal_tab" className="text-xs font-medium cursor-pointer">Nominal (Rp)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-2">
                  <Label className="text-xs font-bold text-[#191c1e] block">
                    {(prod.offlineDiscountMode || 'percent') === 'percent' ? 'Besar Diskon (%):' : 'Nominal Potongan (Rp):'}
                  </Label>
                  {(prod.offlineDiscountMode || 'percent') === 'percent'
                    ? <FlexibleInput value={prod.offlineDiscountPercent || 0} onChange={v => onUpdateProduct('offlineDiscountPercent', Math.min(99, v))} suffix="%" max={99} />
                    : <FlexibleInput value={prod.offlineDiscountNominal || 0} onChange={v => onUpdateProduct('offlineDiscountNominal', v)} prefix="Rp" />}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Offline Promo Result ── */}
          <Card className="border-[#e0e3e5] bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-6 space-y-5">
              {/* Harga Coret Visual */}
              <div className={`p-5 rounded-2xl border transition-colors ${
                offlinePromo.isLosing
                  ? 'bg-red-50 border-red-200'
                  : 'bg-[#f7f9fb] border-[#e0e3e5]'
              }`}>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-current/10">
                  <h3 className="text-sm font-bold text-[#191c1e] uppercase tracking-wider">Hasil Simulasi Diskon Toko</h3>
                  <Badge className={`text-xs font-bold px-3 py-1 border ${
                    offlinePromo.isLosing
                      ? 'bg-red-600 text-white border-red-700'
                      : 'bg-emerald-600 text-white border-emerald-700'
                  }`}>
                    {offlinePromo.isLosing ? '🔴 RUGI HPP' : '🟢 MARGIN AMAN'}
                  </Badge>
                </div>

                {/* Price visualization */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="text-center">
                    <span className="text-[10px] text-[#76777d] font-semibold block mb-0.5">Harga Normal (Toko)</span>
                    <span className="font-mono font-bold text-lg text-[#191c1e]">{formatIDR(offlineData.effectiveOfflinePrice)}</span>
                  </div>
                  <div className="text-[#76777d] font-bold text-lg">→</div>
                  <div className="text-center">
                    <span className="text-[10px] text-red-500 font-semibold block mb-0.5">Diskon ({offlinePromo.discountPercent.toFixed(0)}%)</span>
                    <span className="font-mono font-bold text-red-600">− {formatIDR(offlinePromo.discountNominal)}</span>
                  </div>
                  <div className="text-[#76777d] font-bold text-lg">=</div>
                  <div className="text-center">
                    <span className="text-[10px] text-[#45464d] font-semibold block mb-0.5">Harga Setelah Diskon</span>
                    <span className="font-mono font-bold text-xl text-[#191c1e]">{formatIDR(offlinePromo.priceAfterDiscount)}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between text-[#45464d]">
                    <span>Modal HPP Murni:</span>
                    <span className="font-mono font-bold text-red-600">− {formatIDR(hppData.hppMurni)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-current/10">
                    <span className="text-sm font-bold text-[#191c1e]">Laba Bersih / Porsi:</span>
                    <span className={`text-xl font-bold font-mono ${offlinePromo.isLosing ? 'text-red-700' : 'text-emerald-700'}`}>
                      {offlinePromo.netMarginAfterDiscount >= 0 ? '+' : ''}{formatIDR(offlinePromo.netMarginAfterDiscount)}
                    </span>
                  </div>
                </div>

                {offlinePromo.isLosing && (
                  <div className="mt-3 flex items-start gap-2 text-xs text-red-700 font-semibold p-3 bg-red-100 rounded-xl border border-red-200">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>⚠️ Diskon ini mengakibatkan kerugian <strong>{formatIDR(Math.abs(offlinePromo.netMarginAfterDiscount))}/porsi</strong>! Kurangi persentase diskon.</span>
                  </div>
                )}
              </div>

              {/* Harga Coret Display */}
              {offlinePromo.isOfflinePromoActive && (
                <Card className="bg-[#131b2e] text-white border-[#191c1e] shadow-md rounded-2xl">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-2 border-b border-white/15 pb-2">
                      <span className="text-base">🏷️</span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#bec6e0]">
                        Harga Coret yang Harus Dipasang di Menu / Display Toko
                      </h4>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] text-[#bec6e0] font-medium block mb-1">
                          Pasang harga ini di papan (lalu coret), agar setelah diskon {offlinePromo.discountPercent.toFixed(0)}% konsumen membayar harga toko:
                        </span>
                        <div className="flex items-baseline gap-3">
                          <span className="text-3xl font-bold font-mono text-white/50 line-through decoration-red-400 decoration-2">
                            {formatIDR(offlinePromo.hargaFinalCoret)}
                          </span>
                          <span className="text-[#bec6e0] font-bold">→</span>
                          <span className="text-2xl font-bold font-mono text-[#e1e0ff]">
                            {formatIDR(offlineData.effectiveOfflinePrice)}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/10 rounded-xl border border-white/15 text-xs text-[#bec6e0] font-medium leading-relaxed">
                        Rumus: {formatIDR(offlineData.effectiveOfflinePrice)} ÷ (1 − {(offlinePromo.discountPercent / 100).toFixed(2)})
                        <br />= <strong className="text-white">{formatIDR(offlinePromo.hargaFinalCoret)}</strong>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
