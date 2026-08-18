'use client';

import FlexibleInput from '@/components/FlexibleInput';
import { formatIDR, calculateHPP } from '@/lib/math';
import { UNITS } from '@/lib/config';
import type { Product, MainMaterial, BopMaterial, Packaging } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Box, Package, Flame, ArrowRight } from 'lucide-react';

interface TabHPPProps {
  prod: Product;
  onUpdateProduct: (field: string, value: unknown) => void;
  onNavigateTab: (tab: string) => void;
}

export default function TabHPP({ prod, onUpdateProduct, onNavigateTab }: TabHPPProps) {
  const hppData = calculateHPP(prod);

  const updateRow = <T extends { id: number }>(listKey: string, id: number, field: string, value: unknown) => {
    const currentList = ((prod[listKey as keyof Product] as unknown) as T[]) || [];
    const updated = currentList.map(item => item.id === id ? { ...item, [field]: value } : item);
    onUpdateProduct(listKey, updated);
  };

  const addRow = (listKey: string) => {
    const currentList = (prod[listKey as keyof Product] as { id: number }[]) || [];
    const nextId = currentList.reduce((max, item) => item.id > max ? item.id : max, 0) + 1;
    let newRow: MainMaterial | BopMaterial | Packaging;
    if (listKey === 'mainMaterials') newRow = { id: nextId, name: `Bahan Baru ${nextId}`, totalPrice: 10000, portions: 5, unit: 'porsi' };
    else if (listKey === 'bopMaterials') newRow = { id: nextId, name: `Overhead Baru ${nextId}`, totalPrice: 15000, capacity: 1000, capUnit: 'ml', usage: 100, usageUnit: 'ml', portions: 5 };
    else newRow = { id: nextId, name: `Kemasan Baru ${nextId}`, totalPrice: 20000, itemsPerPack: 50, unit: 'pcs' };
    onUpdateProduct(listKey, [...currentList, newRow]);
  };

  const removeRow = (listKey: string, id: number) => {
    const currentList = (prod[listKey as keyof Product] as { id: number }[]) || [];
    if (currentList.length <= 1) return;
    onUpdateProduct(listKey, currentList.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto pb-12">
      {/* Module Banner */}
      <Card className="bg-stone-50 border-stone-200 shadow-2xs">
        <CardHeader className="p-5 sm:p-6 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-stone-200 text-stone-900 border-stone-300 font-extrabold uppercase tracking-wider text-[10px]">
              Modul 1: HPP Murni
            </Badge>
            <span className="text-xs text-stone-500 font-semibold">• SAK EMKM 3 Pilar Manufaktur Kuliner</span>
          </div>
          <CardTitle className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <span>📦</span> Biaya Produksi & HPP Murni per Porsi
          </CardTitle>
          <CardDescription className="text-xs text-stone-600 font-medium">
            Kelola 3 pilar HPP murni (Bahan Utama, BOP Variabel/Utilitas, & Kemasan). HPP Murni adalah modal bersih 0% risiko.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Total HPP Summary Card */}
      <Card className="bg-[#4A3427] text-white border-[#241710] shadow-sm">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#EFE9DC]">TOTAL HPP MURNI PER PORSI</span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">{formatIDR(hppData.hppMurni)}</div>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5 text-center">
            {[
              { label: '1. Bahan Utama', val: hppData.totalMainMaterials, icon: Box },
              { label: '2. BOP Variabel', val: hppData.totalBopMaterials, icon: Flame },
              { label: '3. Kemasan', val: hppData.totalPackagings, icon: Package },
            ].map(({ label, val, icon: Icon }) => (
              <div key={label} className="bg-white/10 px-3.5 py-2 rounded-2xl border border-white/15 backdrop-blur-xs min-w-[110px]">
                <div className="flex items-center justify-center gap-1 text-[10px] text-[#EFE9DC] font-extrabold uppercase mb-0.5">
                  <Icon className="h-3 w-3" />
                  <span>{label}</span>
                </div>
                <span className="font-mono font-bold text-white text-xs block">{formatIDR(val)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* A. Bahan Baku Utama */}
      <Card className="border-stone-200 bg-white">
        <CardHeader className="p-5 sm:p-6 pb-3 border-b border-stone-100 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">🥩</div>
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-stone-900">A. BAHAN BAKU UTAMA (DIRECT MATERIAL)</CardTitle>
              <CardDescription className="text-[11px]">Bahan mentah utama yang membentuk produk kuliner</CardDescription>
            </div>
          </div>
          <Button onClick={() => addRow('mainMaterials')} size="sm" className="bg-[#4A3427] hover:bg-[#34241B]">
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Bahan</span>
          </Button>
        </CardHeader>
        <CardContent className="p-5 sm:p-6 space-y-3">
          <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2">
            <div className="col-span-4">Nama Bahan Utama</div>
            <div className="col-span-3">Total Harga Beli</div>
            <div className="col-span-3 text-center">Hasil Porsi & Satuan</div>
            <div className="col-span-2 text-right">HPP / Porsi</div>
          </div>
          <div className="space-y-2.5">
            {(hppData.mainList || []).map(m => (
              <div key={m.id} className="flex flex-col sm:grid sm:grid-cols-12 gap-2.5 items-center bg-stone-50/60 hover:bg-stone-50 p-3 rounded-2xl border border-stone-200/80 transition-colors">
                <div className="w-full sm:col-span-4">
                  <label className="sm:hidden text-[10px] font-semibold text-stone-500 block mb-1">Nama Bahan</label>
                  <input
                    type="text"
                    value={m.name}
                    onChange={e => updateRow('mainMaterials', m.id, 'name', e.target.value)}
                    placeholder="Misal: Daging Ayam / Beras..."
                    className="w-full bg-white border border-stone-200 rounded-xl text-xs px-3 py-2 font-bold text-stone-900 focus:outline-none focus:border-[#4A3427]"
                  />
                </div>
                <div className="w-full sm:col-span-3">
                  <label className="sm:hidden text-[10px] font-semibold text-stone-500 block mb-1">Total Harga Beli</label>
                  <FlexibleInput value={m.totalPrice} onChange={v => updateRow('mainMaterials', m.id, 'totalPrice', v)} prefix="Rp" />
                </div>
                <div className="w-full sm:col-span-3">
                  <label className="sm:hidden text-[10px] font-semibold text-stone-500 block mb-1">Hasil Porsi & Satuan</label>
                  <div className="flex items-center gap-1.5">
                    <div className="w-20 flex-shrink-0">
                      <FlexibleInput value={m.portions} onChange={v => updateRow('mainMaterials', m.id, 'portions', Math.max(1, v))} />
                    </div>
                    <select
                      value={m.unit || 'porsi'}
                      onChange={e => updateRow('mainMaterials', m.id, 'unit', e.target.value)}
                      className="flex-1 min-w-[70px] bg-white border border-stone-200 rounded-xl text-xs px-2 py-2 font-semibold text-stone-900 focus:outline-none"
                    >
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div className="w-full sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                  <div className="text-right">
                    <span className="sm:hidden text-[10px] text-stone-500 block">HPP/Porsi:</span>
                    <span className="font-mono font-bold text-stone-900 text-xs">{formatIDR(m.hppPerPortion)}</span>
                  </div>
                  {(prod.mainMaterials || []).length > 1 && (
                    <button
                      onClick={() => removeRow('mainMaterials', m.id)}
                      className="text-stone-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* B. BOP Variabel */}
      <Card className="border-stone-200 bg-white">
        <CardHeader className="p-5 sm:p-6 pb-3 border-b border-stone-100 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-orange-100 text-orange-900 flex items-center justify-center font-bold text-xs">🛢️</div>
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-stone-900">B. BAHAN HABIS PAKAI (INDIRECT MATERIAL & UTILITAS / BOP)</CardTitle>
              <CardDescription className="text-[11px]">Bumbu, minyak goreng, gas LPG, listrik resep yang tidak langsung menjadi porsi tunggal</CardDescription>
            </div>
          </div>
          <Button onClick={() => addRow('bopMaterials')} size="sm" className="bg-[#4A3427] hover:bg-[#34241B]">
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Overhead</span>
          </Button>
        </CardHeader>
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-700 text-xs flex items-start gap-2.5 leading-relaxed font-medium">
            <span className="text-base">💡</span>
            <div>
              <strong className="font-bold block text-stone-900 mb-0.5">Panduan Perhitungan BOP Presisi:</strong>
              Masukkan harga beli total (Rp 43.000), kapasitas (2000 ml), pemakaian resep (500 ml), dan porsi (8). Rumus: `(43.000 ÷ 2000 × 500) ÷ 8 = Rp 1.343,75/porsi`.
            </div>
          </div>
          <div className="space-y-3">
            {(hppData.bopList || []).map(b => (
              <div key={b.id} className="bg-stone-50/60 hover:bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 space-y-2.5 transition-colors">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                  <div className="sm:col-span-7">
                    <label className="text-[10px] font-bold text-stone-500 block mb-0.5 uppercase">Nama BOP / Utilitas:</label>
                    <input
                      type="text"
                      value={b.name}
                      onChange={e => updateRow('bopMaterials', b.id, 'name', e.target.value)}
                      placeholder="Misal: Minyak Goreng / Gas LPG 3kg..."
                      className="w-full bg-white border border-stone-200 rounded-xl text-xs px-3 py-2 font-bold text-stone-900 focus:outline-none focus:border-[#4A3427]"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="text-[10px] font-bold text-stone-500 block mb-0.5 uppercase">Harga Beli Kemasan:</label>
                    <FlexibleInput value={b.totalPrice} onChange={v => updateRow('bopMaterials', b.id, 'totalPrice', v)} prefix="Rp" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center pt-2.5 border-t border-stone-200/60">
                  <div className="sm:col-span-4">
                    <label className="text-[10px] font-bold text-stone-500 block mb-0.5">Kapasitas Total Pack:</label>
                    <div className="flex items-center gap-1">
                      <div className="w-20 flex-shrink-0">
                        <FlexibleInput value={b.capacity} onChange={v => updateRow('bopMaterials', b.id, 'capacity', v)} />
                      </div>
                      <select
                        value={b.capUnit || 'ml'}
                        onChange={e => updateRow('bopMaterials', b.id, 'capUnit', e.target.value)}
                        className="flex-1 min-w-[65px] bg-white border border-stone-200 rounded-xl text-[11px] px-1.5 py-2 font-semibold text-stone-900"
                      >
                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="sm:col-span-4">
                    <label className="text-[10px] font-bold text-stone-500 block mb-0.5">Pemakaian Resep:</label>
                    <div className="flex items-center gap-1">
                      <div className="w-20 flex-shrink-0">
                        <FlexibleInput value={b.usage} onChange={v => updateRow('bopMaterials', b.id, 'usage', v)} />
                      </div>
                      <select
                        value={b.usageUnit || 'ml'}
                        onChange={e => updateRow('bopMaterials', b.id, 'usageUnit', e.target.value)}
                        className="flex-1 min-w-[65px] bg-white border border-stone-200 rounded-xl text-[11px] px-1.5 py-2 font-semibold text-stone-900"
                      >
                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="sm:col-span-4 flex items-center justify-between gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 block mb-0.5">Hasil Porsi:</label>
                      <div className="w-16">
                        <FlexibleInput value={b.portions} onChange={v => updateRow('bopMaterials', b.id, 'portions', Math.max(1, v))} />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-stone-500 block font-semibold">Subtotal/Porsi:</span>
                      <span className="font-mono font-bold text-stone-900 text-xs">{formatIDR(b.hppPerPortion)}</span>
                    </div>
                    {(prod.bopMaterials || []).length > 1 && (
                      <button
                        onClick={() => removeRow('bopMaterials', b.id)}
                        className="text-stone-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* C. Kemasan */}
      <Card className="border-stone-200 bg-white">
        <CardHeader className="p-5 sm:p-6 pb-3 border-b border-stone-100 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">📦</div>
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-stone-900">C. KEMASAN & PACKAGING (DIRECT PACKAGING)</CardTitle>
              <CardDescription className="text-[11px]">Wadah, thinwall, box, sendok plastik, kantong kresek, stiker merek</CardDescription>
            </div>
          </div>
          <Button onClick={() => addRow('packagings')} size="sm" className="bg-[#4A3427] hover:bg-[#34241B]">
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Kemasan</span>
          </Button>
        </CardHeader>
        <CardContent className="p-5 sm:p-6 space-y-3">
          <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2">
            <div className="col-span-4">Nama Kemasan / Packaging</div>
            <div className="col-span-3">Total Harga Beli Pack</div>
            <div className="col-span-3">Isi per Kemasan</div>
            <div className="col-span-2 text-right">Biaya / Porsi</div>
          </div>
          <div className="space-y-2.5">
            {(hppData.packList || []).map(p => (
              <div key={p.id} className="flex flex-col sm:grid sm:grid-cols-12 gap-2.5 items-center bg-stone-50/60 hover:bg-stone-50 p-3 rounded-2xl border border-stone-200/80 transition-colors">
                <div className="w-full sm:col-span-4">
                  <label className="sm:hidden text-[10px] font-semibold text-stone-500 block mb-1">Nama Kemasan</label>
                  <input
                    type="text"
                    value={p.name}
                    onChange={e => updateRow('packagings', p.id, 'name', e.target.value)}
                    placeholder="Misal: Thinwall 750ml / Stiker..."
                    className="w-full bg-white border border-stone-200 rounded-xl text-xs px-3 py-2 font-bold text-stone-900 focus:outline-none focus:border-[#4A3427]"
                  />
                </div>
                <div className="w-full sm:col-span-3">
                  <label className="sm:hidden text-[10px] font-semibold text-stone-500 block mb-1">Total Harga Beli Pack</label>
                  <FlexibleInput value={p.totalPrice} onChange={v => updateRow('packagings', p.id, 'totalPrice', v)} prefix="Rp" />
                </div>
                <div className="w-full sm:col-span-3">
                  <label className="sm:hidden text-[10px] font-semibold text-stone-500 block mb-1">Isi per Kemasan</label>
                  <div className="flex items-center gap-1.5">
                    <div className="w-20 flex-shrink-0">
                      <FlexibleInput value={p.itemsPerPack} onChange={v => updateRow('packagings', p.id, 'itemsPerPack', Math.max(1, v))} />
                    </div>
                    <span className="text-xs text-stone-700 font-bold">{p.unit || 'pcs'}</span>
                  </div>
                </div>
                <div className="w-full sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                  <div className="text-right">
                    <span className="sm:hidden text-[10px] text-stone-500 block">HPP/Porsi:</span>
                    <span className="font-mono font-bold text-stone-900 text-xs">{formatIDR(p.hppPerPortion)}</span>
                  </div>
                  {(prod.packagings || []).length > 1 && (
                    <button
                      onClick={() => removeRow('packagings', p.id)}
                      className="text-stone-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-2">
        <Button onClick={() => onNavigateTab('offline')} className="bg-[#4A3427] hover:bg-[#34241B] rounded-xl px-6 py-3 text-xs font-bold shadow-xs">
          <span>Lanjut ke Harga Jual Toko (Offline)</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
