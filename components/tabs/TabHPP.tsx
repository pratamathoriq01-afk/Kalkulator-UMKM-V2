'use client';

import FlexibleInput from '@/components/FlexibleInput';
import { formatIDR, calculateHPP } from '@/lib/math';
import { UNITS } from '@/lib/config';
import type { Product } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus, Trash2, Box, Package, Flame, ArrowRight, Info, AlertTriangle, TrendingUp
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TabHPPProps {
  prod: Product;
  onUpdateProduct: (field: string, value: unknown) => void;
  onNavigateTab: (tab: string) => void;
}

export default function TabHPP({ prod, onUpdateProduct, onNavigateTab }: TabHPPProps) {
  // ─── COMPUTED DATA (sumber kebenaran untuk modal/porsi) ───
  const hppData = calculateHPP(prod);

  // ─── Helpers ───
  const updateMainRow = (id: number, field: string, value: unknown) => {
    const updated = (prod.mainMaterials || []).map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onUpdateProduct('mainMaterials', updated);
  };

  const updateBopRow = (id: number, field: string, value: unknown) => {
    const updated = (prod.bopMaterials || []).map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onUpdateProduct('bopMaterials', updated);
  };

  const updatePackRow = (id: number, field: string, value: unknown) => {
    const updated = (prod.packagings || []).map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onUpdateProduct('packagings', updated);
  };

  const addMain = () => {
    const list = prod.mainMaterials || [];
    const nextId = list.reduce((max, i) => i.id > max ? i.id : max, 0) + 1;
    onUpdateProduct('mainMaterials', [...list, { id: nextId, name: `Bahan ${nextId}`, totalPrice: 0, portions: 8, unit: 'porsi' }]);
  };

  const addBop = () => {
    const list = prod.bopMaterials || [];
    const nextId = list.reduce((max, i) => i.id > max ? i.id : max, 0) + 1;
    onUpdateProduct('bopMaterials', [...list, { id: nextId, name: `Overhead ${nextId}`, totalPrice: 0, capacity: 1000, capUnit: 'ml', usage: 100, usageUnit: 'ml', portions: 8 }]);
  };

  const addPack = () => {
    const list = prod.packagings || [];
    const nextId = list.reduce((max, i) => i.id > max ? i.id : max, 0) + 1;
    onUpdateProduct('packagings', [...list, { id: nextId, name: `Kemasan ${nextId}`, totalPrice: 0, itemsPerPack: 50, unit: 'pcs' }]);
  };

  const removeMain = (id: number) => {
    if ((prod.mainMaterials || []).length <= 1) return;
    onUpdateProduct('mainMaterials', (prod.mainMaterials || []).filter(i => i.id !== id));
  };

  const removeBop = (id: number) => {
    if ((prod.bopMaterials || []).length <= 1) return;
    onUpdateProduct('bopMaterials', (prod.bopMaterials || []).filter(i => i.id !== id));
  };

  const removePack = (id: number) => {
    if ((prod.packagings || []).length <= 1) return;
    onUpdateProduct('packagings', (prod.packagings || []).filter(i => i.id !== id));
  };

  const inputCls = "w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-[#e0e3e5] bg-white focus:border-[#4648d4] focus:ring-1 focus:ring-[#4648d4]/20 focus:outline-none transition-colors";

  return (
    <TooltipProvider>
      <div className="space-y-5 animate-in fade-in duration-300 max-w-5xl mx-auto pb-12">

        {/* ── Module Banner ── */}
        <Card className="bg-white border-[#e0e3e5] rounded-2xl shadow-sm">
          <CardHeader className="p-5 sm:p-6 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-[#e1e0ff] text-[#07006c] font-bold uppercase tracking-wider text-[10px]">
                Modul 1: HPP Murni
              </Badge>
              <span className="text-xs text-[#45464d] font-medium">• SAK EMKM 3 Pilar Manufaktur Kuliner</span>
            </div>
            <CardTitle className="font-heading text-xl font-bold text-[#191c1e] flex items-center gap-2">
              <span>📦</span> Biaya Produksi &amp; HPP Murni per Porsi
            </CardTitle>
            <CardDescription className="text-xs text-[#45464d] font-medium">
              Kelola 3 pilar HPP murni: Bahan Baku Utama, BOP Variabel (Utilitas), dan Kemasan. HPP Murni = modal 0% risiko.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* ── HPP Summary Hero ── */}
        <Card className="bg-[#131b2e] text-white border-[#191c1e] shadow-md rounded-2xl">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#bec6e0]">TOTAL HPP MURNI PER PORSI</span>
              <div className="font-heading text-4xl font-bold font-mono text-white tracking-tight">
                {formatIDR(hppData.hppMurni)}
              </div>
              <p className="text-xs text-[#bec6e0]">Modal bersih sebelum margin & keuntungan</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: '1. Bahan Utama', val: hppData.totalMainMaterials, pct: hppData.mainPct, icon: Box, color: 'bg-blue-500/20 border-blue-400/30' },
                { label: '2. BOP Variabel', val: hppData.totalBopMaterials, pct: hppData.bopPct, icon: Flame, color: 'bg-orange-500/20 border-orange-400/30' },
                { label: '3. Kemasan', val: hppData.totalPackagings, pct: hppData.packPct, icon: Package, color: 'bg-emerald-500/20 border-emerald-400/30' },
              ].map(({ label, val, pct, icon: Icon, color }) => (
                <div key={label} className={`${color} px-4 py-3 rounded-xl border min-w-[130px] text-center`}>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-[#bec6e0] font-semibold uppercase mb-1">
                    <Icon className="h-3 w-3" />
                    <span>{label}</span>
                  </div>
                  <span className="font-mono font-bold text-white text-sm block">{formatIDR(val)}</span>
                  <span className="text-[10px] text-[#bec6e0] font-medium">{pct.toFixed(1)}% dari HPP</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Validation Errors ── */}
        {hppData.validationErrors.length > 0 && (
          <div className="p-4 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/30 space-y-1.5 text-[#93000a]">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4 text-[#ba1a1a]" />
              <span>Peringatan Validasi — Nilai Harus &gt; 0</span>
            </div>
            <ul className="space-y-1">
              {hppData.validationErrors.map((err, i) => (
                <li key={i} className="text-xs font-semibold flex items-start gap-1.5">
                  <span className="mt-0.5 shrink-0">•</span>
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ════════════════════════════════
            SECTION A: BAHAN BAKU UTAMA
            ════════════════════════════════ */}
        <Card className="border-[#e0e3e5] bg-white rounded-2xl overflow-hidden">
          <CardHeader className="p-5 sm:p-6 pb-3 border-b border-[#f2f4f6] flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base">🥩</div>
              <div>
                <CardTitle className="font-heading text-sm font-bold uppercase tracking-wider text-[#191c1e] flex items-center gap-1.5">
                  A. Bahan Baku Utama (Direct Material)
                  <Tooltip>
                    <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#4648d4]" /></TooltipTrigger>
                    <TooltipContent className="text-xs max-w-xs">Isi total harga beli bahan & berapa porsi yang dihasilkan dari pembelian tersebut.</TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription className="text-[11px] text-[#45464d]">Bahan mentah utama produk kuliner (Daging, Beras, Bumbu, dll)</CardDescription>
              </div>
            </div>
            <Button onClick={addMain} size="sm" className="bg-[#131b2e] hover:bg-[#2d3133] text-white rounded-xl text-xs font-semibold gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Bahan</span>
            </Button>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 space-y-3">
            {/* Table Header */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-3 text-[10px] font-bold text-[#45464d] uppercase pb-2 border-b border-[#e0e3e5]">
              <div className="col-span-4">Nama Bahan</div>
              <div className="col-span-3">Total Harga Beli (Rp)</div>
              <div className="col-span-3">Jumlah Porsi Dihasilkan</div>
              <div className="col-span-2 text-right">Modal / Porsi</div>
            </div>

            <div className="space-y-2">
              {/* ─── BUG FIX: Render dari hppData.mainList, bukan prod.mainMaterials ─── */}
              {hppData.mainList.map(m => (
                <div key={m.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 sm:p-2 rounded-xl bg-[#f7f9fb] sm:bg-transparent border border-[#e0e3e5] sm:border-none">
                  <div className="w-full sm:col-span-4">
                    <label className="sm:hidden text-[10px] font-bold text-[#45464d] block mb-1">Nama Bahan</label>
                    <input
                      type="text"
                      value={m.name}
                      onChange={e => updateMainRow(m.id, 'name', e.target.value)}
                      className={inputCls}
                      placeholder="Nama Bahan (misal: Daging Sapi)"
                    />
                  </div>
                  <div className="w-full sm:col-span-3">
                    <label className="sm:hidden text-[10px] font-bold text-[#45464d] block mb-1">Total Harga Beli</label>
                    <FlexibleInput value={m.totalPrice} onChange={v => updateMainRow(m.id, 'totalPrice', v)} prefix="Rp" />
                  </div>
                  <div className="w-full sm:col-span-3">
                    <label className="sm:hidden text-[10px] font-bold text-[#45464d] block mb-1">Porsi Dihasilkan</label>
                    <div className="flex items-center gap-1.5">
                      <div className="w-24 flex-shrink-0">
                        <FlexibleInput value={m.portions} onChange={v => updateMainRow(m.id, 'portions', Math.max(1, v))} min={1} />
                      </div>
                      <span className="text-xs text-[#45464d] font-semibold flex-shrink-0">{m.unit || 'porsi'}</span>
                    </div>
                  </div>
                  <div className="w-full sm:col-span-2 flex items-center justify-between sm:justify-end gap-2">
                    {/* ✅ FIXED: m.hppPerPortion dari hppData.mainList (sudah terkalkulasi) */}
                    <div className="px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100 text-center min-w-[80px]">
                      <span className="text-[9px] text-blue-500 font-semibold block uppercase">Per Porsi</span>
                      <span className="font-mono font-bold text-blue-700 text-xs">{formatIDR(m.hppPerPortion)}</span>
                    </div>
                    {(prod.mainMaterials || []).length > 1 && (
                      <button
                        onClick={() => removeMain(m.id)}
                        className="text-[#76777d] hover:text-[#ba1a1a] p-1.5 hover:bg-[#ffdad6] rounded-lg transition-colors cursor-pointer"
                        title="Hapus Bahan"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Sub-total Bahan Utama */}
            <div className="flex justify-between items-center pt-3 border-t border-[#e0e3e5]">
              <span className="text-xs font-semibold text-[#45464d] flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
                Sub-total Bahan Utama / Porsi:
              </span>
              <span className="font-mono font-bold text-[#191c1e] text-sm">{formatIDR(hppData.totalMainMaterials)}</span>
            </div>
          </CardContent>
        </Card>

        {/* ════════════════════════════════
            SECTION B: BOP VARIABEL
            ════════════════════════════════ */}
        <Card className="border-[#e0e3e5] bg-white rounded-2xl overflow-hidden">
          <CardHeader className="p-5 sm:p-6 pb-3 border-b border-[#f2f4f6] flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-base">🔥</div>
              <div>
                <CardTitle className="font-heading text-sm font-bold uppercase tracking-wider text-[#191c1e] flex items-center gap-1.5">
                  B. Biaya Operasional Produksi (BOP Variabel)
                  <Tooltip>
                    <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#4648d4]" /></TooltipTrigger>
                    <TooltipContent className="text-xs max-w-xs">
                      Gas, Listrik, Minyak Goreng — bahan habis pakai saat memasak.
                      Gunakan Mode Simpel jika sudah tahu estimasi biayanya, atau Mode Detail untuk menghitung dari kapasitas & pemakaian.
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription className="text-[11px] text-[#45464d]">Gas LPG, Listrik, Minyak Goreng, Air, Bumbu Pelengkap</CardDescription>
              </div>
            </div>
            <Button onClick={addBop} size="sm" className="bg-[#131b2e] hover:bg-[#2d3133] text-white rounded-xl text-xs font-semibold gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Overhead</span>
            </Button>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 space-y-4">

            {/* Mode explanation banner */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100 text-[11px] text-orange-800">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-orange-500" />
              <div className="space-y-0.5 font-medium">
                <p><strong>Mode Simpel:</strong> Langsung isi estimasi biaya bahan per resep (misal: gas terpakai ≈ Rp 3.000 per masak).</p>
                <p><strong>Mode Detail:</strong> Isi harga beli, kapasitas total, dan berapa yang terpakai per resep — sistem otomatis hitung biayanya.</p>
              </div>
            </div>

            <div className="space-y-3">
              {hppData.bopList.map(b => {
                const mode = b.inputMode || 'detail';
                const isSimple = mode === 'simple';
                return (
                  <div key={b.id} className="rounded-2xl border border-[#e0e3e5] bg-[#fafbfc] overflow-hidden">
                    {/* Row header: nama + mode toggle + delete */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-[#f0f2f4]">
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={b.name}
                          onChange={e => updateBopRow(b.id, 'name', e.target.value)}
                          className={`${inputCls} font-bold`}
                          placeholder="Nama Biaya BOP (Gas LPG, Listrik, Minyak...)"
                        />
                      </div>

                      {/* Mode toggle pill */}
                      <div className="flex-shrink-0 flex items-center gap-0.5 bg-[#f2f4f6] rounded-xl p-1">
                        <button
                          onClick={() => updateBopRow(b.id, 'inputMode', 'simple')}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                            isSimple
                              ? 'bg-[#131b2e] text-white shadow-sm'
                              : 'text-[#45464d] hover:text-[#191c1e]'
                          }`}
                        >
                          ⚡ Simpel
                        </button>
                        <button
                          onClick={() => updateBopRow(b.id, 'inputMode', 'detail')}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                            !isSimple
                              ? 'bg-[#131b2e] text-white shadow-sm'
                              : 'text-[#45464d] hover:text-[#191c1e]'
                          }`}
                        >
                          🔬 Detail
                        </button>
                      </div>

                      {/* Per porsi badge */}
                      <div className="flex-shrink-0 px-3 py-1.5 bg-orange-50 rounded-xl border border-orange-100 text-center min-w-[80px]">
                        <span className="text-[9px] text-orange-500 font-semibold block uppercase">Per Porsi</span>
                        <span className="font-mono font-bold text-orange-700 text-xs">{formatIDR(b.hppPerPortion)}</span>
                      </div>

                      {(prod.bopMaterials || []).length > 1 && (
                        <button
                          onClick={() => removeBop(b.id)}
                          className="flex-shrink-0 text-[#76777d] hover:text-[#ba1a1a] p-1.5 hover:bg-[#ffdad6] rounded-lg transition-colors cursor-pointer"
                          title="Hapus BOP"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Row body: input fields */}
                    <div className="p-4">
                      {isSimple ? (
                        /* ─── MODE SIMPEL ─── */
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-[#45464d] block">
                              Biaya per Resep (Rp):
                            </label>
                            <FlexibleInput
                              value={b.directCost ?? 0}
                              onChange={v => updateBopRow(b.id, 'directCost', v)}
                              prefix="Rp"
                            />
                            <p className="text-[10px] text-[#76777d]">
                              Estimasi biaya bahan ini untuk 1 kali masak/resep.
                              Contoh: Gas terpakai ≈ Rp 3.000
                            </p>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-[#45464d] block">
                              Porsi yang Dihasilkan per Resep:
                            </label>
                            <div className="flex items-center gap-2">
                              <FlexibleInput
                                value={b.portions}
                                onChange={v => updateBopRow(b.id, 'portions', Math.max(1, v))}
                                min={1}
                              />
                              <span className="text-xs font-bold text-[#45464d] flex-shrink-0">porsi</span>
                            </div>
                            <p className="text-[10px] text-[#76777d]">
                              Berapa porsi yang dimasak sekaligus dalam 1 resep?
                            </p>
                          </div>
                          {/* Formula preview for simple mode */}
                          <div className="sm:col-span-2 p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-[11px] text-orange-800 font-mono">
                            <span className="font-sans font-bold text-[10px] uppercase tracking-wider text-orange-500 block mb-1">Preview Kalkulasi:</span>
                            {formatIDR(b.directCost ?? 0)} ÷ {b.portions} porsi = <strong>{formatIDR(b.hppPerPortion)}/porsi</strong>
                          </div>
                        </div>
                      ) : (
                        /* ─── MODE DETAIL ─── */
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-[#45464d] block">
                                Harga Beli Total (Rp):
                              </label>
                              <FlexibleInput value={b.totalPrice} onChange={v => updateBopRow(b.id, 'totalPrice', v)} prefix="Rp" />
                              <p className="text-[10px] text-[#76777d]">Harga beli 1 pack/tabung/botol/galon penuh</p>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-[#45464d] block">
                                Kapasitas Total Beli:
                              </label>
                              <div className="flex items-center gap-1.5">
                                <FlexibleInput value={b.capacity} onChange={v => updateBopRow(b.id, 'capacity', Math.max(1, v))} min={1} />
                                <select
                                  value={b.capUnit}
                                  onChange={e => updateBopRow(b.id, 'capUnit', e.target.value)}
                                  className="text-[11px] font-bold border border-[#e0e3e5] rounded-lg px-2 py-2.5 bg-white text-[#191c1e] focus:outline-none focus:border-[#4648d4]"
                                >
                                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                              </div>
                              <p className="text-[10px] text-[#76777d]">
                                Total isi yang kamu beli. <strong>Satuan harus sama</strong> dengan Pakai/Resep di bawah.
                                <br />Contoh: 2 Liter = isi 2000 ml → pilih &quot;ml&quot;, isi 2000
                              </p>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold text-[#45464d] block">
                                Pakai per Resep (dalam {b.capUnit || 'satuan'}):
                              </label>
                              <div className="flex items-center gap-2">
                                <FlexibleInput value={b.usage} onChange={v => updateBopRow(b.id, 'usage', Math.max(0, v))} />
                                <span className="text-xs font-bold text-[#45464d] flex-shrink-0 bg-orange-50 px-2 py-2 rounded-lg border border-orange-100">
                                  {b.capUnit || 'satuan'}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#76777d]">
                                Berapa {b.capUnit || 'satuan'} yang terpakai untuk memasak 1 resep?
                              </p>
                            </div>
                          </div>
                          <div className="sm:w-48">
                            <label className="text-[11px] font-bold text-[#45464d] block mb-1.5">
                              Porsi per Resep:
                            </label>
                            <div className="flex items-center gap-2">
                              <FlexibleInput value={b.portions} onChange={v => updateBopRow(b.id, 'portions', Math.max(1, v))} min={1} />
                              <span className="text-xs font-bold text-[#45464d] flex-shrink-0">porsi</span>
                            </div>
                          </div>
                          {/* Formula preview for detail mode */}
                          <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-[11px] text-orange-800 font-mono">
                            <span className="font-sans font-bold text-[10px] uppercase tracking-wider text-orange-500 block mb-1">Preview Kalkulasi:</span>
                            ({b.usage} {b.capUnit} ÷ {b.capacity} {b.capUnit}) × {formatIDR(b.totalPrice)} ÷ {b.portions} porsi
                            {' '}= <strong>{formatIDR(b.hppPerPortion)}/porsi</strong>
                            <br />
                            <span className="font-sans text-orange-600 text-[10px]">
                              = Biaya resep {formatIDR(b.recipeCost ?? 0)} ÷ {b.portions} porsi
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sub-total BOP */}
            <div className="flex justify-between items-center pt-3 border-t border-[#e0e3e5]">
              <span className="text-xs font-semibold text-[#45464d] flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
                Sub-total BOP Variabel / Porsi:
              </span>
              <span className="font-mono font-bold text-[#191c1e] text-sm">{formatIDR(hppData.totalBopMaterials)}</span>
            </div>
          </CardContent>
        </Card>

        {/* ════════════════════════════════
            SECTION C: KEMASAN
            ════════════════════════════════ */}
        <Card className="border-[#e0e3e5] bg-white rounded-2xl overflow-hidden">
          <CardHeader className="p-5 sm:p-6 pb-3 border-b border-[#f2f4f6] flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base">📦</div>
              <div>
                <CardTitle className="font-heading text-sm font-bold uppercase tracking-wider text-[#191c1e] flex items-center gap-1.5">
                  C. Kemasan Produksi (Packaging)
                  <Tooltip>
                    <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#4648d4]" /></TooltipTrigger>
                    <TooltipContent className="text-xs max-w-xs">Box, Mangkok, Stiker, Paperbag yang melekat langsung ke tiap porsi. Isi harga 1 pack & isi per pack.</TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription className="text-[11px] text-[#45464d]">Wadah dan kemasan yang melekat pada setiap porsi yang dijual</CardDescription>
              </div>
            </div>
            <Button onClick={addPack} size="sm" className="bg-[#131b2e] hover:bg-[#2d3133] text-white rounded-xl text-xs font-semibold gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Kemasan</span>
            </Button>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 space-y-3">
            {/* Table Header */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-3 text-[10px] font-bold text-[#45464d] uppercase pb-2 border-b border-[#e0e3e5]">
              <div className="col-span-4">Nama Kemasan</div>
              <div className="col-span-3">Total Harga Beli (Rp)</div>
              <div className="col-span-3">Jumlah Isi Per Pack</div>
              <div className="col-span-2 text-right">Modal / Porsi</div>
            </div>

            <div className="space-y-2">
              {/* ─── BUG FIX: Render dari hppData.packList ─── */}
              {hppData.packList.map(p => (
                <div key={p.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 sm:p-2 rounded-xl bg-[#f7f9fb] sm:bg-transparent border border-[#e0e3e5] sm:border-none">
                  <div className="w-full sm:col-span-4">
                    <label className="sm:hidden text-[10px] font-bold text-[#45464d] block mb-1">Nama Kemasan</label>
                    <input
                      type="text"
                      value={p.name}
                      onChange={e => updatePackRow(p.id, 'name', e.target.value)}
                      className={inputCls}
                      placeholder="Paper Bowl + Lid"
                    />
                  </div>
                  <div className="w-full sm:col-span-3">
                    <label className="sm:hidden text-[10px] font-bold text-[#45464d] block mb-1">Total Harga Beli</label>
                    <FlexibleInput value={p.totalPrice} onChange={v => updatePackRow(p.id, 'totalPrice', v)} prefix="Rp" />
                  </div>
                  <div className="w-full sm:col-span-3">
                    <label className="sm:hidden text-[10px] font-bold text-[#45464d] block mb-1">Jumlah Isi Per Pack</label>
                    <div className="flex items-center gap-1.5">
                      <div className="w-24 flex-shrink-0">
                        <FlexibleInput value={p.itemsPerPack} onChange={v => updatePackRow(p.id, 'itemsPerPack', Math.max(1, v))} min={1} />
                      </div>
                      <span className="text-xs text-[#45464d] font-semibold flex-shrink-0">{p.unit || 'pcs'}</span>
                    </div>
                  </div>
                  <div className="w-full sm:col-span-2 flex items-center justify-between sm:justify-end gap-2">
                    {/* ✅ FIXED: p.hppPerPortion dari hppData.packList */}
                    <div className="px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100 text-center min-w-[80px]">
                      <span className="text-[9px] text-emerald-600 font-semibold block uppercase">Per Porsi</span>
                      <span className="font-mono font-bold text-emerald-700 text-xs">{formatIDR(p.hppPerPortion)}</span>
                    </div>
                    {(prod.packagings || []).length > 1 && (
                      <button
                        onClick={() => removePack(p.id)}
                        className="text-[#76777d] hover:text-[#ba1a1a] p-1.5 hover:bg-[#ffdad6] rounded-lg transition-colors cursor-pointer"
                        title="Hapus Kemasan"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Sub-total Kemasan */}
            <div className="flex justify-between items-center pt-3 border-t border-[#e0e3e5]">
              <span className="text-xs font-semibold text-[#45464d] flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                Sub-total Kemasan / Porsi:
              </span>
              <span className="font-mono font-bold text-[#191c1e] text-sm">{formatIDR(hppData.totalPackagings)}</span>
            </div>
          </CardContent>
        </Card>

        {/* ── Navigate CTA ── */}
        <div className="flex justify-end pt-2">
          <Button onClick={() => onNavigateTab('offline')} className="bg-[#131b2e] hover:bg-[#2d3133] text-white rounded-xl px-6 py-2.5 text-xs font-semibold shadow-sm">
            <span>Lanjut ke Modul 2: Harga Toko (Offline)</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
