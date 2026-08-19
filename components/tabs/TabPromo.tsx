'use client';

import { useState } from 'react';
import FlexibleInput from '@/components/FlexibleInput';
import { formatIDR, calculateHPP, calculateOfflinePrice, calculateOfflinePromo, calculateOnlinePrice, calculatePromoSim } from '@/lib/math';
import type { Product } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      <Card className="bg-white border-[#e0e3e5] rounded-xl shadow-2xs">
        <CardHeader className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-[#e1e0ff] text-[#07006c] font-bold uppercase tracking-wider text-[10px]">
              Modul 4: Promo Simulator
            </Badge>
            <span className="text-xs text-[#45464d] font-medium">• Pemisah Diskon Toko & Proteksi App</span>
          </div>
          <CardTitle className="font-heading text-xl font-bold text-[#191c1e] flex items-center gap-2">
            <Tag className="h-5 w-5 text-[#131b2e]" /> Pusat Simulasi Diskon & Proteksi Promo
          </CardTitle>
          <CardDescription className="text-xs text-[#45464d] font-medium">
            Simulasikan promo diskon toko (offline) dan promo aplikasi (online) secara terpisah untuk mendeteksi risiko boncos dan mendapatkan rekomendasi Harga Coret Kampanye.
          </CardDescription>

          <div className="pt-2 border-t border-[#e0e3e5]">
            <Tabs value={activeSubTab} onValueChange={v => setActiveSubTab(v as 'online' | 'offline')} className="w-full">
              <TabsList className="w-full grid grid-cols-2 bg-[#f2f4f6] p-1 rounded-lg">
                <TabsTrigger value="online" className="flex items-center gap-2 text-xs font-bold data-[state=active]:bg-[#131b2e] data-[state=active]:text-white rounded-md">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Promo Aplikasi Online</span>
                </TabsTrigger>
                <TabsTrigger value="offline" className="flex items-center gap-2 text-xs font-bold data-[state=active]:bg-[#131b2e] data-[state=active]:text-white rounded-md">
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
          <Card className="border-[#e0e3e5] bg-white rounded-xl">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#f2f4f6] pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#191c1e]">⚙️ INPUT SKENARIO PROMO APLIKASI ONLINE</h3>
                <div className="flex items-center gap-2">
                  <Label htmlFor="promo-switch" className="text-xs font-bold text-[#191c1e]">Aktifkan Promo App:</Label>
                  <Switch
                    id="promo-switch"
                    checked={!!prod.promoEnabled}
                    onCheckedChange={c => onUpdateProduct('promoEnabled', c)}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-3">
                <span className="text-xs font-bold text-[#191c1e] block">1. Asumsi Pesanan Pelanggan dalam 1 Struk:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <Label className="text-xs text-[#45464d] font-medium">Jumlah Porsi:</Label>
                    <div className="w-32">
                      <FlexibleInput value={prod.simOrderQty || 2} onChange={v => onUpdateProduct('simOrderQty', Math.max(1, v))} suffix="porsi" />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#45464d] font-semibold block">Total Subtotal Awal:</span>
                    <span className="text-lg font-bold text-[#191c1e] font-mono">{formatIDR(promoData.orderSubtotal)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-3">
                <span className="text-xs font-bold text-[#191c1e] block">2. Syarat & Ketentuan Promo Aplikasi:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-[11px] font-bold text-[#191c1e] block mb-1">Minimal Belanja:</Label>
                    <FlexibleInput value={prod.promoMinOrder} onChange={v => onUpdateProduct('promoMinOrder', v)} prefix="Rp" />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold text-[#191c1e] block mb-1">Persentase Diskon:</Label>
                    <FlexibleInput value={prod.promoPercent} onChange={v => onUpdateProduct('promoPercent', v)} suffix="%" />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold text-[#191c1e] block mb-1">Maksimal Diskon (Cap):</Label>
                    <FlexibleInput value={prod.promoMaxDiscount} onChange={v => onUpdateProduct('promoMaxDiscount', v)} prefix="Rp" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-2">
                <span className="text-xs font-bold text-[#191c1e] block">3. Kebijakan Potongan Komisi Aplikasi:</span>
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
          <Card className="border-[#e0e3e5] bg-white rounded-xl">
            <CardHeader className="p-5 sm:p-6 pb-2 border-b border-[#f2f4f6]">
              <CardTitle className="font-heading text-xs font-bold uppercase tracking-wider text-[#191c1e]">
                🧾 SIMULASI HASIL TRANSAKSI ONLINE REAL-TIME
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-3 text-xs">
                  <h4 className="font-bold uppercase text-[#191c1e] border-b border-[#e0e3e5] pb-2">A. SISI KONSUMEN</h4>
                  <div className="space-y-2 text-[#45464d] font-semibold">
                    <div className="flex justify-between"><span>Total Belanja ({promoData.orderQty} porsi):</span><span className="font-mono font-bold text-[#191c1e]">{formatIDR(promoData.orderSubtotal)}</span></div>
                    <div className="flex justify-between"><span>Status Syarat Promo:</span><span className={`font-bold ${promoData.isMinOrderMet ? 'text-[#006e1c]' : 'text-[#ba1a1a]'}`}>{promoData.isMinOrderMet ? '✅ Terpenuhi' : '❌ Min. Belum Terpenuhi'}</span></div>
                    <div className="flex justify-between text-[#ba1a1a] font-bold"><span>Diskon ({promoData.promoPercent}%):</span><span className="font-mono">- {formatIDR(promoData.effectiveDiscount)}</span></div>
                    <div className="flex justify-between pt-2 border-t border-[#e0e3e5] font-bold text-sm text-[#191c1e]"><span>Total Dibayar Konsumen:</span><span className="font-mono">{formatIDR(promoData.customerPays)}</span></div>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-3 text-xs">
                  <h4 className="font-bold uppercase text-[#191c1e] border-b border-[#e0e3e5] pb-2">B. SISI PENJUAL</h4>
                  <div className="space-y-2 text-[#45464d] font-semibold">
                    <div className="flex justify-between"><span>Total dari Konsumen:</span><span className="font-mono font-bold text-[#191c1e]">{formatIDR(promoData.customerPays)}</span></div>
                    <div className="flex justify-between text-[#ba1a1a] font-bold"><span>Potongan Komisi Platform ({prod.commissionPercent}%):</span><span className="font-mono">- {formatIDR(promoData.commissionOnlyAmount)}</span></div>
                    <div className="flex justify-between text-[#ba1a1a] font-bold"><span>Potongan Biaya Layanan Tetap:</span><span className="font-mono">- {formatIDR(prod.fixedFee)}</span></div>
                    <div className="flex justify-between pt-2 border-t border-[#e0e3e5] font-bold text-sm text-[#191c1e] bg-white p-2.5 rounded-lg border border-[#e0e3e5]"><span>Uang Cair ke Penjual:</span><span className="font-mono text-[#006e1c] font-extrabold">{formatIDR(promoData.netPayout)}</span></div>
                  </div>
                </div>
              </div>

              {/* BEP & Profit Safety Analysis */}
              <div className={`rounded-xl p-5 border transition-colors ${promoData.isBoncos ? 'bg-[#ffdad6] border-[#ba1a1a]/30 text-[#93000a]' : 'bg-[#f7f9fb] border-[#e0e3e5] text-[#191c1e]'}`}>
                <div className="flex items-center justify-between border-b border-[#e0e3e5] pb-3 mb-3">
                  <div>
                    <h3 className="font-heading text-sm font-bold uppercase tracking-wider">🚨 ANALISIS KEAMANAN MARGIN ONLINE (BEP)</h3>
                    <p className="text-xs opacity-80 font-medium">Pencocokan Uang Cair vs Beban HPP Keseluruhan Order</p>
                  </div>
                  <Badge variant={promoData.isBoncos ? 'destructive' : 'secondary'} className={`text-xs py-1 px-3 font-bold ${promoData.isBoncos ? 'bg-[#ba1a1a] text-white' : 'bg-[#e1e0ff] text-[#07006c]'}`}>
                    {promoData.isBoncos ? '🔴 BONCOS / RUGI PROMO' : '🟢 PROFIT / AMAN PROMO'}
                  </Badge>
                </div>
                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between"><span>• Uang Cair ke Penjual:</span><span className="font-mono font-bold">{formatIDR(promoData.netPayout)}</span></div>
                  <div className="flex justify-between"><span>• Total Beban HPP ({promoData.orderQty} x {formatIDR(hppData.hppMurni)}):</span><span className="font-mono font-bold text-[#ba1a1a]">- {formatIDR(promoData.totalHPPOrder)}</span></div>
                  <div className="p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 border bg-white border-[#e0e3e5]">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#45464d] block">KEUNTUNGAN BERSIH PROMO ONLINE:</span>
                      <span className={`text-2xl font-bold font-mono tracking-tight ${promoData.isBoncos ? 'text-[#ba1a1a]' : 'text-[#006e1c]'}`}>
                        {promoData.netProfit >= 0 ? '+' : ''}{formatIDR(promoData.netProfit)}
                      </span>
                    </div>
                    <p className="text-xs text-right max-w-xs leading-relaxed font-medium text-[#45464d]">
                      {promoData.saranKenaikanHarga}
                    </p>
                  </div>
                </div>
              </div>

              {/* Auto-Markup Campaign Price (Harga Coret Ideal) Feature Card */}
              <Card className="bg-[#131b2e] text-white border-[#191c1e] shadow-sm rounded-xl">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 border-b border-white/15 pb-2">
                    <Sparkles className="h-4 w-4 text-[#e1e0ff]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#bec6e0]">
                      💡 AUTO-MARKUP REKOMENDASI HARGA KAMPANYE (HARGA CORET)
                    </h4>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-[#bec6e0] font-medium block">
                        Pasang Harga Promo Awal ini di Aplikasi (Sebelum Diskon):
                      </span>
                      <span className="font-heading text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight block mt-0.5">
                        {formatIDR(promoData.recommendedCampaignPrice)} / porsi
                      </span>
                      <span className="text-[11px] text-[#bec6e0] block font-medium mt-0.5">
                        (Subtotal Struk {promoData.orderQty} porsi: {formatIDR(promoData.recommendedCampaignSubtotal)})
                      </span>
                    </div>
                    <div className="p-3 bg-white/10 rounded-lg border border-white/15 text-xs text-[#bec6e0] max-w-xs leading-relaxed font-medium">
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
          <Card className="border-[#e0e3e5] bg-white rounded-xl">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#f2f4f6] pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#191c1e]">🏪 INPUT DISKON & PROMO TOKO FISIK (OFFLINE)</h3>
                <div className="flex items-center gap-2">
                  <Label htmlFor="offline-promo-switch" className="text-xs font-bold text-[#191c1e]">Aktifkan Diskon Toko:</Label>
                  <Switch
                    id="offline-promo-switch"
                    checked={!!prod.offlinePromoEnabled}
                    onCheckedChange={c => onUpdateProduct('offlinePromoEnabled', c)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-2">
                  <Label className="text-xs font-bold text-[#191c1e] block">Skema Potongan Diskon Toko:</Label>
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

                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-2">
                  <Label className="text-xs font-bold text-[#191c1e] block">
                    {(prod.offlineDiscountMode || 'percent') === 'percent' ? 'Persentase Diskon (%)' : 'Nominal Potongan (Rp)'}:
                  </Label>
                  {(prod.offlineDiscountMode || 'percent') === 'percent'
                    ? <FlexibleInput value={prod.offlineDiscountPercent || 0} onChange={v => onUpdateProduct('offlineDiscountPercent', v)} suffix="%" />
                    : <FlexibleInput value={prod.offlineDiscountNominal || 0} onChange={v => onUpdateProduct('offlineDiscountNominal', v)} prefix="Rp" />
                  }
                </div>
              </div>

              {/* Offline Promo Result */}
              <div className={`rounded-xl p-5 border transition-colors ${offlinePromo.isLosing ? 'bg-[#ffdad6] border-[#ba1a1a]/30 text-[#93000a]' : 'bg-[#f7f9fb] border-[#e0e3e5] text-[#191c1e]'}`}>
                <div className="flex items-center justify-between border-b border-[#e0e3e5] pb-3 mb-3">
                  <div>
                    <h3 className="font-heading text-sm font-bold uppercase tracking-wider">📊 HASIL SIMULASI DISKON TOKO OFFLINE</h3>
                    <p className="text-xs opacity-80 font-medium">Perhitungan harga jual toko setelah diskon & margin bersih</p>
                  </div>
                  <Badge variant={offlinePromo.isLosing ? 'destructive' : 'secondary'} className={`text-xs py-1 px-3 font-bold ${offlinePromo.isLosing ? 'bg-[#ba1a1a] text-white' : 'bg-[#e1e0ff] text-[#07006c]'}`}>
                    {offlinePromo.isLosing ? '🔴 DISKON RUGI HPP' : '🟢 MARGIN TOKO AMAN'}
                  </Badge>
                </div>
                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between"><span>• Harga Toko Dasar:</span><span className="font-mono font-bold">{formatIDR(offlineData.effectiveOfflinePrice)}</span></div>
                  <div className="flex justify-between text-[#ba1a1a]"><span>• Potongan Diskon ({offlinePromo.discountPercent.toFixed(0)}%):</span><span className="font-mono font-bold">- {formatIDR(offlinePromo.discountNominal)}</span></div>
                  <div className="flex justify-between font-bold text-sm pt-2 border-t border-[#e0e3e5]"><span>• Harga Jual Setelah Diskon:</span><span className="font-mono">{formatIDR(offlinePromo.priceAfterDiscount)}</span></div>
                  <div className="flex justify-between"><span>• Modal HPP Murni:</span><span className="font-mono font-bold text-[#ba1a1a]">- {formatIDR(hppData.hppMurni)}</span></div>
                  <div className="p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 border bg-white border-[#e0e3e5]">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#45464d] block">LABA BERSIH DISKON TOKO PER PORSI:</span>
                      <span className={`text-2xl font-bold font-mono tracking-tight ${offlinePromo.isLosing ? 'text-[#ba1a1a]' : 'text-[#006e1c]'}`}>
                        {offlinePromo.netMarginAfterDiscount >= 0 ? '+' : ''}{formatIDR(offlinePromo.netMarginAfterDiscount)}
                      </span>
                    </div>
                    <p className="text-xs text-right max-w-xs leading-relaxed font-medium text-[#45464d]">
                      {offlinePromo.isLosing ? '🔴 POTONGAN DISKON MERUGIKAN HPP! Turunkan persentase diskon.' : '🟢 Diskon toko aman dan memberikan sisa keuntungan bersih.'}
                    </p>
                  </div>
                </div>

                {/* Harga Coret Card — hanya tampil jika promo aktif */}
                {offlinePromo.isOfflinePromoActive && (
                  <div className="mt-4 p-5 rounded-xl bg-[#131b2e] text-white border border-[#191c1e] space-y-2">
                    <div className="flex items-center gap-2 border-b border-white/15 pb-2">
                      <span className="text-base">🏷️</span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#bec6e0]">
                        HARGA CORET YANG HARUS DIPASANG DI MENU / DISPLAY TOKO
                      </h4>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] text-[#bec6e0] font-medium block">
                          Pasang harga ini di papan (coret), agar setelah diskon {offlinePromo.discountPercent.toFixed(0)}% konsumen membayar tepat harga dasar:
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-3xl font-bold font-mono text-white line-through opacity-60 decoration-[#ba1a1a] decoration-2">{formatIDR(offlinePromo.hargaFinalCoret)}</span>
                          <span className="text-base font-bold text-[#bec6e0]">→ setelah diskon →</span>
                          <span className="text-xl font-bold font-mono text-[#e1e0ff]">{formatIDR(offlineData.effectiveOfflinePrice)}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/10 rounded-lg border border-white/15 text-xs text-[#bec6e0] max-w-[200px] leading-relaxed font-medium">
                        Rumus: Harga Dasar ÷ (1 - Diskon%)
                        <br />
                        = {formatIDR(offlineData.effectiveOfflinePrice)} ÷ (1 - {(offlinePromo.discountPercent/100).toFixed(2)})
                        <br />
                        = <strong className="text-white">{formatIDR(offlinePromo.hargaFinalCoret)}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
