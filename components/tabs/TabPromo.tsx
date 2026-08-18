'use client';

import { useState } from 'react';
import FlexibleInput from '@/components/FlexibleInput';
import { formatIDR, calculateHPP, calculateOfflinePrice, calculateOfflinePromo, calculateOnlinePrice, calculatePromoSim } from '@/lib/math';
import type { Product } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tag, Store, Smartphone, AlertCircle, ShieldAlert, Sparkles, CheckCircle, ArrowUpRight } from 'lucide-react';

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
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto pb-12">
      {/* Module Banner */}
      <Card className="bg-stone-50 border-stone-200 shadow-2xs">
        <CardHeader className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-stone-200 text-stone-900 border-stone-300 font-extrabold uppercase tracking-wider text-[10px]">
              Modul 4: Promo Simulator
            </Badge>
            <span className="text-xs text-stone-500 font-semibold">• Pemisah Diskon Toko & Proteksi App</span>
          </div>
          <CardTitle className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Tag className="h-5 w-5 text-[#4A3427]" /> Pusat Simulasi Diskon & Proteksi Promo
          </CardTitle>
          <CardDescription className="text-xs text-stone-600 font-medium">
            Simulasikan promo diskon toko (offline) dan promo aplikasi (online) secara terpisah untuk mendeteksi risiko boncos dan mendapatkan rekomendasi Harga Coret Kampanye.
          </CardDescription>

          <div className="pt-2 border-t border-stone-200">
            <Tabs value={activeSubTab} onValueChange={v => setActiveSubTab(v as 'online' | 'offline')} className="w-full">
              <TabsList className="w-full grid grid-cols-2 bg-stone-200/70 p-1">
                <TabsTrigger value="online" className="flex items-center gap-2 text-xs font-bold">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Promo Aplikasi Online</span>
                </TabsTrigger>
                <TabsTrigger value="offline" className="flex items-center gap-2 text-xs font-bold">
                  <Store className="h-3.5 w-3.5" />
                  <span>Promo Toko Fisik (Offline)</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
      </Card>

      {/* Sub-Tab Online */}
      {activeSubTab === 'online' && (
        <div className="space-y-6">
          <Card className="border-stone-200 bg-white">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">⚙️ INPUT SKENARIO PROMO APLIKASI ONLINE</h3>
                <div className="flex items-center gap-2">
                  <Label htmlFor="promo-switch" className="text-xs font-bold text-stone-800">Aktifkan Promo App:</Label>
                  <Switch
                    id="promo-switch"
                    checked={!!prod.promoEnabled}
                    onCheckedChange={c => onUpdateProduct('promoEnabled', c)}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <span className="text-xs font-bold text-stone-900 block">1. Asumsi Pesanan Pelanggan dalam 1 Struk:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <Label className="text-xs text-stone-600 font-medium">Jumlah Porsi:</Label>
                    <div className="w-32">
                      <FlexibleInput value={prod.simOrderQty || 2} onChange={v => onUpdateProduct('simOrderQty', Math.max(1, v))} suffix="porsi" />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-500 font-semibold block">Total Subtotal Awal:</span>
                    <span className="text-lg font-black text-stone-900 font-mono">{formatIDR(promoData.orderSubtotal)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <span className="text-xs font-bold text-stone-900 block">2. Syarat & Ketentuan Promo Aplikasi:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-[11px] font-bold text-stone-800 block mb-1">Minimal Belanja:</Label>
                    <FlexibleInput value={prod.promoMinOrder} onChange={v => onUpdateProduct('promoMinOrder', v)} prefix="Rp" />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold text-stone-800 block mb-1">Persentase Diskon:</Label>
                    <FlexibleInput value={prod.promoPercent} onChange={v => onUpdateProduct('promoPercent', v)} suffix="%" />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold text-stone-800 block mb-1">Maksimal Diskon (Cap):</Label>
                    <FlexibleInput value={prod.promoMaxDiscount} onChange={v => onUpdateProduct('promoMaxDiscount', v)} prefix="Rp" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-900 block">3. Kebijakan Potongan Komisi Aplikasi:</span>
                <RadioGroup
                  value={prod.commissionDeductionMode || 'before_discount'}
                  onValueChange={v => onUpdateProduct('commissionDeductionMode', v)}
                  className="flex flex-col sm:flex-row gap-4 pt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="before_discount" id="before_discount" />
                    <Label htmlFor="before_discount" className="text-xs font-medium cursor-pointer">
                      Potong dari Harga Awal (Sebelum Diskon)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="after_discount" id="after_discount" />
                    <Label htmlFor="after_discount" className="text-xs font-medium cursor-pointer">
                      Potong dari Harga Akhir (Setelah Diskon)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Simulation Result */}
          <Card className="border-stone-200 bg-white">
            <CardHeader className="p-5 sm:p-6 pb-2 border-b border-stone-100">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-900">
                🧾 SIMULASI HASIL TRANSAKSI ONLINE REAL-TIME
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                  <h4 className="font-bold uppercase text-stone-900 border-b border-stone-200 pb-2">A. SISI KONSUMEN</h4>
                  <div className="space-y-2 text-stone-700 font-semibold">
                    <div className="flex justify-between"><span>Total Belanja ({promoData.orderQty} porsi):</span><span className="font-mono font-bold text-stone-900">{formatIDR(promoData.orderSubtotal)}</span></div>
                    <div className="flex justify-between"><span>Status Syarat Promo:</span><span className={`font-bold ${promoData.isMinOrderMet ? 'text-stone-900' : 'text-rose-600'}`}>{promoData.isMinOrderMet ? '✅ Terpenuhi' : '❌ Min. Belum Terpenuhi'}</span></div>
                    <div className="flex justify-between text-rose-600 font-bold"><span>Diskon ({promoData.promoPercent}%):</span><span className="font-mono">- {formatIDR(promoData.effectiveDiscount)}</span></div>
                    <div className="flex justify-between pt-2 border-t border-stone-200 font-black text-sm text-stone-900"><span>Total Dibayar Konsumen:</span><span className="font-mono">{formatIDR(promoData.customerPays)}</span></div>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                  <h4 className="font-bold uppercase text-stone-900 border-b border-stone-200 pb-2">B. SISI PENJUAL</h4>
                  <div className="space-y-2 text-stone-700 font-semibold">
                    <div className="flex justify-between"><span>Total dari Konsumen:</span><span className="font-mono font-bold text-stone-900">{formatIDR(promoData.customerPays)}</span></div>
                    <div className="flex justify-between text-rose-600 font-bold"><span>Potongan Komisi App ({prod.commissionPercent}%):</span><span className="font-mono">- {formatIDR(promoData.appCommissionTotal)}</span></div>
                    <div className="flex justify-between pt-2 border-t border-stone-200 font-black text-sm text-stone-900 bg-white p-2.5 rounded-xl border border-stone-200"><span>Uang Cair ke Penjual:</span><span className="font-mono text-emerald-700">{formatIDR(promoData.netPayout)}</span></div>
                  </div>
                </div>
              </div>

              {/* BEP & Profit Safety Analysis */}
              <div className={`rounded-2xl p-5 border transition-colors ${promoData.isBoncos ? 'bg-rose-50 border-rose-200 text-rose-950' : 'bg-stone-50 border-stone-200 text-stone-900'}`}>
                <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider">🚨 ANALISIS KEAMANAN MARGIN ONLINE (BEP)</h3>
                    <p className="text-xs opacity-75 font-medium">Pencocokan Uang Cair vs Beban HPP Keseluruhan Order</p>
                  </div>
                  <Badge variant={promoData.isBoncos ? 'destructive' : 'success'} className="text-xs py-1 px-3">
                    {promoData.isBoncos ? '🔴 BONCOS / RUGI PROMO' : '🟢 PROFIT / AMAN PROMO'}
                  </Badge>
                </div>
                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between"><span>• Uang Cair ke Penjual:</span><span className="font-mono font-bold">{formatIDR(promoData.netPayout)}</span></div>
                  <div className="flex justify-between"><span>• Total Beban HPP ({promoData.orderQty} x {formatIDR(hppData.hppMurni)}):</span><span className="font-mono font-bold text-rose-700">- {formatIDR(promoData.totalHPPOrder)}</span></div>
                  <div className={`p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 border ${promoData.isBoncos ? 'bg-white border-rose-200' : 'bg-white border-stone-200'}`}>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 block">KEUNTUNGAN BERSIH PROMO ONLINE:</span>
                      <span className={`text-2xl font-black font-mono tracking-tight ${promoData.isBoncos ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {promoData.netProfit >= 0 ? '+' : ''}{formatIDR(promoData.netProfit)}
                      </span>
                    </div>
                    <p className="text-xs text-right max-w-xs leading-relaxed font-medium text-stone-600">
                      {promoData.isBoncos ? '🔴 HPP TIDAK TERTUTUP! Naikkan syarat minimal belanja atau gunakan rekomendasi Harga Kampanye (Harga Coret).' : '🟢 HPP murni tertutup sempurna dengan sisa laba bersih aman.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Auto-Markup Campaign Price (Harga Coret Ideal) Feature Card */}
              <Card className="bg-[#4A3427] text-white border-[#241710] shadow-sm">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 border-b border-white/15 pb-2">
                    <Sparkles className="h-4 w-4 text-[#F0E6D2]" />
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#F0E6D2]">
                      💡 AUTO-MARKUP REKOMENDASI HARGA KAMPANYE (HARGA CORET)
                    </h4>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-[#EFE9DC] font-medium block">
                        Pasang Harga Promo Awal ini di Aplikasi (Sebelum Diskon):
                      </span>
                      <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight block mt-0.5">
                        {formatIDR(promoData.recommendedCampaignPrice)} / porsi
                      </span>
                      <span className="text-[11px] text-[#EFE9DC] opacity-80 block font-medium mt-0.5">
                        (Subtotal Struk {promoData.orderQty} porsi: {formatIDR(promoData.recommendedCampaignSubtotal)})
                      </span>
                    </div>
                    <div className="p-3 bg-white/10 rounded-2xl border border-white/15 text-xs text-[#EFE9DC] max-w-xs leading-relaxed font-medium">
                      Dengan memasang harga kampanye di atas, setelah didiskon {promoData.promoPercent}% dan dipotong komisi app, uang cair ke rekening Anda <strong>minimal TETAP sama dengan omset toko offline</strong>!
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sub-Tab Offline */}
      {activeSubTab === 'offline' && (
        <div className="space-y-6">
          <Card className="border-stone-200 bg-white">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">🏪 INPUT DISKON & PROMO TOKO FISIK (OFFLINE)</h3>
                <div className="flex items-center gap-2">
                  <Label htmlFor="offline-promo-switch" className="text-xs font-bold text-stone-800">Aktifkan Diskon Toko:</Label>
                  <Switch
                    id="offline-promo-switch"
                    checked={!!prod.offlinePromoEnabled}
                    onCheckedChange={c => onUpdateProduct('offlinePromoEnabled', c)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <Label className="text-xs font-bold text-stone-800 block">Skema Potongan Diskon Toko:</Label>
                  <RadioGroup
                    value={prod.offlineDiscountMode || 'percent'}
                    onValueChange={v => onUpdateProduct('offlineDiscountMode', v)}
                    className="flex gap-4 pt-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="percent" id="disc_percent" />
                      <Label htmlFor="disc_percent" className="text-xs font-medium cursor-pointer">Persentase (%)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nominal" id="disc_nominal" />
                      <Label htmlFor="disc_nominal" className="text-xs font-medium cursor-pointer">Nominal (Rp)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <Label className="text-xs font-bold text-stone-800 block">
                    {(prod.offlineDiscountMode || 'percent') === 'percent' ? 'Persentase Diskon (%)' : 'Nominal Potongan (Rp)'}:
                  </Label>
                  {(prod.offlineDiscountMode || 'percent') === 'percent'
                    ? <FlexibleInput value={prod.offlineDiscountPercent || 0} onChange={v => onUpdateProduct('offlineDiscountPercent', v)} suffix="%" />
                    : <FlexibleInput value={prod.offlineDiscountNominal || 0} onChange={v => onUpdateProduct('offlineDiscountNominal', v)} prefix="Rp" />
                  }
                </div>
              </div>

              {/* Offline Promo Result */}
              <div className={`rounded-2xl p-5 border transition-colors ${offlinePromo.isLosing ? 'bg-rose-50 border-rose-200 text-rose-950' : 'bg-stone-50 border-stone-200 text-stone-900'}`}>
                <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider">📊 HASIL SIMULASI DISKON TOKO OFFLINE</h3>
                    <p className="text-xs opacity-75 font-medium">Perhitungan harga jual toko setelah diskon & margin bersih</p>
                  </div>
                  <Badge variant={offlinePromo.isLosing ? 'destructive' : 'success'} className="text-xs py-1 px-3">
                    {offlinePromo.isLosing ? '🔴 DISKON RUGI HPP' : '🟢 MARGIN TOKO AMAN'}
                  </Badge>
                </div>
                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between"><span>• Harga Toko Dasar:</span><span className="font-mono font-bold">{formatIDR(offlineData.effectiveOfflinePrice)}</span></div>
                  <div className="flex justify-between text-rose-600"><span>• Potongan Diskon ({offlinePromo.discountPercent.toFixed(0)}%):</span><span className="font-mono font-bold">- {formatIDR(offlinePromo.discountNominal)}</span></div>
                  <div className="flex justify-between font-black text-sm pt-2 border-t border-stone-200"><span>• Harga Jual Setelah Diskon:</span><span className="font-mono">{formatIDR(offlinePromo.priceAfterDiscount)}</span></div>
                  <div className="flex justify-between"><span>• Modal HPP Murni:</span><span className="font-mono font-bold text-rose-700">- {formatIDR(hppData.hppMurni)}</span></div>
                  <div className={`p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 border ${offlinePromo.isLosing ? 'bg-white border-rose-200' : 'bg-white border-stone-200'}`}>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 block">LABA BERSIH DISKON TOKO PER PORSI:</span>
                      <span className={`text-2xl font-black font-mono tracking-tight ${offlinePromo.isLosing ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {offlinePromo.netMarginAfterDiscount >= 0 ? '+' : ''}{formatIDR(offlinePromo.netMarginAfterDiscount)}
                      </span>
                    </div>
                    <p className="text-xs text-right max-w-xs leading-relaxed font-medium text-stone-600">
                      {offlinePromo.isLosing ? '🔴 POTONGAN DISKON MERUGIKAN HPP! Turunkan persentase diskon.' : '🟢 Diskon toko aman dan memberikan sisa keuntungan bersih.'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
