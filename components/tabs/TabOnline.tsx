'use client';

import { useState } from 'react';
import FlexibleInput from '@/components/FlexibleInput';
import { formatIDR, calculateHPP, calculateOfflinePrice, calculateOnlinePrice } from '@/lib/math';
import type { Product } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  ArrowRight, Smartphone, AlertTriangle, ShieldCheck,
  CheckCircle2, ChevronDown, ChevronUp, Zap
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TabOnlineProps {
  prod: Product;
  onUpdateProduct: (field: string, value: unknown) => void;
  onNavigateTab: (tab: string) => void;
}

const PLATFORM_PRESETS = [
  { label: 'GoFood', comm: 20, fee: 1000 },
  { label: 'GrabFood', comm: 20, fee: 1000 },
  { label: 'ShopeeFood', comm: 15, fee: 1000 },
  { label: 'Custom', comm: 0, fee: 0 },
];

export default function TabOnline({ prod, onUpdateProduct, onNavigateTab }: TabOnlineProps) {
  const [showManualOverride, setShowManualOverride] = useState(false);

  const hppData = calculateHPP(prod);
  const offlineData = calculateOfflinePrice(hppData.hppMurni, prod);
  const onlineData = calculateOnlinePrice(offlineData.effectiveOfflinePrice, prod);

  const commPercent = prod.commissionPercent ?? 20;
  const fixedFee = prod.fixedFee ?? 1000;

  const payoutMatchesOffline =
    Math.abs(onlineData.simulatedPayout - offlineData.effectiveOfflinePrice) < 2;

  return (
    <TooltipProvider>
      <div className="space-y-5 animate-in fade-in duration-300 max-w-4xl mx-auto pb-12">

        {/* ── Module Banner ── */}
        <Card className="bg-white border-[#e0e3e5] rounded-2xl shadow-sm">
          <CardHeader className="p-5 sm:p-6 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-[#e1e0ff] text-[#07006c] font-bold uppercase tracking-wider text-[10px]">
                Modul 3: Harga Online
              </Badge>
              <span className="text-xs text-[#45464d] font-medium">• GoFood / GrabFood / ShopeeFood</span>
            </div>
            <CardTitle className="font-heading text-xl font-bold text-[#191c1e] flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-[#131b2e]" /> Harga Aplikasi Online (Reverse-Margin)
            </CardTitle>
            <CardDescription className="text-xs text-[#45464d] font-medium">
              Input biaya komisi &amp; admin aplikasi — harga jual online dihitung otomatis agar uang bersih yang cair sama persis dengan harga toko.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-[#e0e3e5] bg-white rounded-2xl">
          <CardContent className="p-6 sm:p-8 space-y-7">

            {/* ── Step 1: Reference (from Modul 2) ── */}
            <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#45464d] block mb-0.5">
                  Target Cair Bersih (Harga Toko Offline)
                </span>
                <span className="text-2xl font-bold text-[#191c1e] font-mono">{formatIDR(offlineData.effectiveOfflinePrice)}</span>
                <p className="text-[10px] text-[#45464d] font-medium mt-0.5">Dari Modul 2 — uang yang harus cair ke rekening setelah semua potongan</p>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#45464d] block mb-0.5">Formula Aktif</span>
                <span className="text-xs font-mono font-semibold text-[#4648d4]">(Offline + Fee) ÷ (1 - Komisi%)</span>
              </div>
            </div>

            {/* ── Step 2: Platform Selector ── */}
            <div className="space-y-3 pb-6 border-b border-[#f2f4f6]">
              <Label className="text-sm font-bold text-[#191c1e]">Pilih Platform / Atur Manual:</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PLATFORM_PRESETS.map(p => {
                  const isActive = p.label !== 'Custom' && commPercent === p.comm && fixedFee === p.fee;
                  return (
                    <button
                      key={p.label}
                      onClick={() => {
                        if (p.label !== 'Custom') {
                          onUpdateProduct('commissionPercent', p.comm);
                          onUpdateProduct('fixedFee', p.fee);
                        }
                      }}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                        isActive
                          ? 'bg-[#131b2e] text-white border-[#131b2e]'
                          : 'bg-[#f7f9fb] text-[#191c1e] border-[#e0e3e5] hover:border-[#4648d4]'
                      }`}
                    >
                      <span className="block">{p.label}</span>
                      {p.label !== 'Custom' && (
                        <span className={`font-normal text-[10px] ${isActive ? 'text-[#bec6e0]' : 'text-[#76777d]'}`}>
                          Komisi {p.comm}% + Rp {p.fee.toLocaleString('id-ID')}
                        </span>
                      )}
                      {p.label === 'Custom' && (
                        <span className="font-normal text-[10px] text-[#76777d]">Atur sendiri di bawah</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Step 3: The 2 Inputs ── */}
            <div className="space-y-4 pb-6 border-b border-[#f2f4f6]">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#4648d4]" />
                <Label className="text-sm font-bold text-[#191c1e]">Biaya Platform (2 Input Saja):</Label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#191c1e] block">
                    Komisi Platform (%):
                  </label>
                  <FlexibleInput
                    value={commPercent}
                    onChange={v => onUpdateProduct('commissionPercent', Math.min(99, v))}
                    suffix="%"
                    max={99}
                  />
                  <p className="text-[10px] text-[#45464d]">GoFood/GrabFood ~20%, ShopeeFood ~15%</p>
                </div>
                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#191c1e] block">
                    Biaya Admin / Layanan Tetap (Rp):
                  </label>
                  <FlexibleInput
                    value={fixedFee}
                    onChange={v => onUpdateProduct('fixedFee', v)}
                    prefix="Rp"
                  />
                  <p className="text-[10px] text-[#45464d]">Biaya per transaksi (misal: Rp 1.000)</p>
                </div>
              </div>
            </div>

            {/* ── Step 4: Auto Result ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-[#45464d]">Harga Online Optimal (Auto-Hitung):</span>
                <span className="font-mono text-[#45464d]">{formatIDR(onlineData.recommendedOnlineRaw)} → dibulatkan ke Rp 500</span>
              </div>

              {/* Big price hero */}
              <div className="p-6 rounded-2xl bg-[#131b2e] text-white shadow-md border border-[#191c1e] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#bec6e0] block">HARGA TERDAFTAR DI APLIKASI</span>
                <div className="font-heading text-4xl font-bold font-mono tracking-tight">
                  {formatIDR(onlineData.effectiveOnlinePrice)}
                </div>
                <p className="text-[11px] text-[#bec6e0]">
                  {prod.onlineManualOverrideEnabled && prod.customOnlinePrice && prod.customOnlinePrice > 0
                    ? '✏️ Harga custom (override aktif)'
                    : `🔒 Auto: (${formatIDR(offlineData.effectiveOfflinePrice)} + ${formatIDR(fixedFee)}) ÷ (1 - ${commPercent}%)`}
                </p>
              </div>

              {/* Under-pricing risk warning */}
              {onlineData.isUnderPricingRisk && (
                <div className="p-4 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/40 flex items-start gap-3 text-[#93000a]">
                  <AlertTriangle className="h-5 w-5 text-[#ba1a1a] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider">⚠️ Harga Override Di Bawah Batas Aman!</p>
                    <p className="text-xs font-semibold leading-relaxed">
                      Harga manual {formatIDR(onlineData.effectiveOnlinePrice)} lebih rendah dari rekomendasi {formatIDR(onlineData.recommendedOnline)}.
                      Potensi kekurangan <strong>{formatIDR(onlineData.recommendedOnline - onlineData.effectiveOnlinePrice)}/porsi</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Step 5: Net Payout Proof (Struk Digital) ── */}
            <div className="p-5 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#e0e3e5]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#191c1e]">🧾 Simulasi Struk Pencairan:</span>
                <Badge variant="secondary" className="bg-[#e1e0ff] text-[#07006c] font-bold text-[10px]">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Net Payout Presisi
                </Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#45464d] font-medium">
                  <span>Harga terdaftar di aplikasi:</span>
                  <span className="font-mono font-bold text-[#191c1e]">{formatIDR(onlineData.effectiveOnlinePrice)}</span>
                </div>
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>− Komisi platform ({commPercent}%):</span>
                  <span className="font-mono">− {formatIDR(onlineData.commissionAmount)}</span>
                </div>
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>− Biaya admin/layanan tetap:</span>
                  <span className="font-mono">− {formatIDR(fixedFee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#e0e3e5]">
                  <div className="flex items-center gap-1.5">
                    {payoutMatchesOffline
                      ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      : <AlertTriangle className="h-4 w-4 text-amber-500" />}
                    <span className="font-bold text-[#191c1e] text-sm">Uang Cair Bersih ke Penjual:</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-extrabold text-base ${payoutMatchesOffline ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {formatIDR(onlineData.simulatedPayout)}
                    </span>
                    {payoutMatchesOffline && (
                      <p className="text-[10px] text-emerald-600 font-semibold">✅ Sama dengan harga toko!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payout vs offline comparison bar */}
              <div className="mt-2 p-3 rounded-xl bg-white border border-[#e0e3e5] text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#4648d4]" />
                  <span className="font-semibold text-[#45464d]">Verifikasi: Net Payout vs. Harga Toko</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#191c1e]">{formatIDR(onlineData.simulatedPayout)}</span>
                  <span className="text-[#76777d]">vs.</span>
                  <span className="font-mono font-bold text-[#191c1e]">{formatIDR(offlineData.effectiveOfflinePrice)}</span>
                  <Badge
                    className={`text-[10px] font-bold px-2 py-0.5 ${
                      payoutMatchesOffline
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : 'bg-amber-100 text-amber-700 border border-amber-300'
                    }`}
                  >
                    {payoutMatchesOffline ? '✓ Cocok' : '⚠ Selisih'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* ── Manual Override (Hidden by default) ── */}
            <div className="border border-[#e0e3e5] rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowManualOverride(!showManualOverride)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#f7f9fb] transition-colors"
              >
                <span className="text-xs font-bold text-[#45464d]">⚙️ Override Manual Harga Online (Opsional)</span>
                {showManualOverride ? <ChevronUp className="h-4 w-4 text-[#45464d]" /> : <ChevronDown className="h-4 w-4 text-[#45464d]" />}
              </button>
              {showManualOverride && (
                <div className="p-5 border-t border-[#e0e3e5] space-y-3 bg-[#fafbfc]">
                  <p className="text-xs text-[#45464d] font-medium">
                    Aktifkan hanya jika kamu sudah memiliki harga online yang sudah live di aplikasi.
                    Sistem akan menampilkan peringatan jika harga di bawah batas aman.
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="manual-override-toggle"
                      checked={!!prod.onlineManualOverrideEnabled}
                      onChange={e => onUpdateProduct('onlineManualOverrideEnabled', e.target.checked)}
                      className="h-4 w-4 rounded accent-[#4648d4]"
                    />
                    <label htmlFor="manual-override-toggle" className="text-xs font-semibold cursor-pointer text-[#191c1e]">
                      Aktifkan Override Manual
                    </label>
                  </div>
                  {prod.onlineManualOverrideEnabled && (
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[#45464d]">Harga Online Manual (Rp):</Label>
                      <FlexibleInput
                        value={prod.customOnlinePrice ?? onlineData.recommendedOnline}
                        onChange={v => onUpdateProduct('customOnlinePrice', v > 0 ? v : null)}
                        prefix="Rp"
                      />
                      {prod.customOnlinePrice && prod.customOnlinePrice > 0 && (
                        <button
                          onClick={() => {
                            onUpdateProduct('customOnlinePrice', null);
                            onUpdateProduct('onlineManualOverrideEnabled', false);
                          }}
                          className="text-[10px] text-[#4648d4] hover:underline cursor-pointer"
                        >
                          ↩ Reset ke harga otomatis
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Navigate CTA ── */}
            <div className="flex justify-end pt-2">
              <Button onClick={() => onNavigateTab('promo')} className="bg-[#131b2e] hover:bg-[#2d3133] text-white rounded-xl px-6 py-2.5 text-xs font-semibold shadow-sm">
                <span>Lanjut ke Modul 4: Simulasi Promo</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
