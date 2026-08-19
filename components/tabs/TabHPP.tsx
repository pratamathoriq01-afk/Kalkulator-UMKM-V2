'use client';

import FlexibleInput from '@/components/FlexibleInput';
import { formatIDR, calculateHPP } from '@/lib/math';
import { UNITS } from '@/lib/config';
import type { Product, MainMaterial, BopMaterial, Packaging } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Box, Package, Flame, ArrowRight, HelpCircle, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    <TooltipProvider>
      <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto pb-12">
        {/* Module Banner */}
        <Card className="bg-white border-[#e0e3e5] rounded-xl shadow-2xs">
          <CardHeader className="p-5 sm:p-6 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-[#e1e0ff] text-[#07006c] font-bold uppercase tracking-wider text-[10px]">
                Modul 1: HPP Murni
              </Badge>
              <span className="text-xs text-[#45464d] font-medium">• SAK EMKM 3 Pilar Manufaktur Kuliner</span>
            </div>
            <CardTitle className="font-heading text-xl font-bold text-[#191c1e] flex items-center gap-2">
              <span>📦</span> Biaya Produksi & HPP Murni per Porsi
            </CardTitle>
            <CardDescription className="text-xs text-[#45464d] font-medium">
              Kelola 3 pilar HPP murni (Bahan Utama, BOP Variabel/Utilitas, & Kemasan). HPP Murni adalah modal bersih 0% risiko.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Total HPP Summary Hero Card (Stitch Dark Navy Hero) */}
        <Card className="bg-[#131b2e] text-white border-[#191c1e] shadow-sm rounded-xl">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#bec6e0]">TOTAL HPP MURNI PER PORSI</span>
              <div className="font-heading text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight">{formatIDR(hppData.hppMurni)}</div>
            </div>
            <div className="flex flex-wrap justify-center gap-2.5 text-center">
              {[
                { label: '1. Bahan Utama', val: hppData.totalMainMaterials, icon: Box },
                { label: '2. BOP Variabel', val: hppData.totalBopMaterials, icon: Flame },
                { label: '3. Kemasan', val: hppData.totalPackagings, icon: Package },
              ].map(({ label, val, icon: Icon }) => (
                <div key={label} className="bg-white/5 px-3.5 py-2 rounded-lg border border-white/10 min-w-[110px]">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-[#bec6e0] font-semibold uppercase mb-0.5">
                    <Icon className="h-3 w-3" />
                    <span>{label}</span>
                  </div>
                  <span className="font-mono font-bold text-white text-xs block">{formatIDR(val)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Validation Error Banner */}
        {hppData.validationErrors.length > 0 && (
          <div className="p-4 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/30 space-y-1.5 text-[#93000a]">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4 text-[#ba1a1a]" />
              <span>Peringatan Validasi Input HPP — Nilai Harus &gt; 0</span>
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

        {/* Section A: Bahan Baku Utama */}
        <Card className="border-[#e0e3e5] bg-white rounded-xl">
          <CardHeader className="p-5 sm:p-6 pb-3 border-b border-[#f2f4f6] flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#e1e0ff] text-[#07006c] flex items-center justify-center font-bold text-xs">🥩</div>
              <div>
                <CardTitle className="font-heading text-sm font-bold uppercase tracking-wider text-[#191c1e] flex items-center gap-1.5">
                  <span>A. BAHAN BAKU UTAMA (DIRECT MATERIAL)</span>
                  <Tooltip>
                    <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#4648d4]" /></TooltipTrigger>
                    <TooltipContent className="text-xs max-w-xs">Isi total harga beli bahan mentah & berapa porsi makanan yang dihasilkan dari beli bahan tersebut.</TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription className="text-[11px] text-[#45464d]">Bahan mentah utama yang membentuk produk kuliner (Daging, Beras, Bumbu, dll)</CardDescription>
              </div>
            </div>
            <Button onClick={() => addRow('mainMaterials')} size="sm" className="bg-[#131b2e] hover:bg-[#2d3133] text-white rounded-lg text-xs font-semibold">
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Tambah Bahan</span>
            </Button>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 space-y-3">
            <div className="hidden sm:grid sm:grid-cols-12 gap-3 text-[10px] font-bold text-[#45464d] uppercase pb-2 border-b border-[#e0e3e5]">
              <div className="col-span-4">Nama Bahan Utama</div>
              <div className="col-span-3">Total Harga Beli (Rp)</div>
              <div className="col-span-3">Jumlah Porsi Dihasilkan</div>
              <div className="col-span-2 text-right">Modal/Porsi</div>
            </div>

            <div className="space-y-3 sm:space-y-2">
              {(prod.mainMaterials || []).map(m => (
                <div key={m.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 sm:p-2 rounded-lg bg-[#f7f9fb] sm:bg-transparent border sm:border-none border-[#e0e3e5]">
                  <div className="w-full sm:col-span-4">
                    <label className="sm:hidden text-[10px] font-bold text-[#45464d] block mb-1">Nama Bahan</label>
                    <input
                      type="text"
                      value={m.name}
                      onChange={e => updateRow('mainMaterials', m.id, 'name', e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-[#e0e3e5] bg-white focus:border-[#4648d4] focus:outline-none"
                      placeholder="Nama Bahan (misal: Daging Sapi)"
                    />
                  </div>
                  <div className="w-full sm:col-span-3">
                    <label className="sm:hidden text-[10px] font-bold text-[#45464d] block mb-1">Total Harga Beli</label>
                    <FlexibleInput value={m.totalPrice} onChange={v => updateRow('mainMaterials', m.id, 'totalPrice', v)} prefix="Rp" />
                  </div>
                  <div className="w-full sm:col-span-3">
                    <label className="sm:hidden text-[10px] font-bold text-[#45464d] block mb-1">Porsi Dihasilkan</label>
                    <div className="flex items-center gap-1.5">
                      <div className="w-20 flex-shrink-0">
                        <FlexibleInput value={m.portions} onChange={v => updateRow('mainMaterials', m.id, 'portions', Math.max(1, v))} />
                      </div>
                      <span className="text-xs text-[#45464d] font-semibold">{m.unit || 'porsi'}</span>
                    </div>
                  </div>
                  <div className="w-full sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                    <div className="text-right">
                      <span className="sm:hidden text-[10px] text-[#45464d] block">HPP/Porsi:</span>
                      <span className="font-mono font-bold text-[#191c1e] text-xs">{formatIDR(m.hppPerPortion)}</span>
                    </div>
                    {(prod.mainMaterials || []).length > 1 && (
                      <button
                        onClick={() => removeRow('mainMaterials', m.id)}
                        className="text-[#76777d] hover:text-[#ba1a1a] p-1.5 hover:bg-[#ffdad6] rounded-md transition-colors cursor-pointer"
                        title="Hapus Bahan"
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

        {/* Section B: BOP Variabel */}
        <Card className="border-[#e0e3e5] bg-white rounded-xl">
          <CardHeader className="p-5 sm:p-6 pb-3 border-b border-[#f2f4f6] flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#e1e0ff] text-[#07006c] flex items-center justify-center font-bold text-xs">🔥</div>
              <div>
                <CardTitle className="font-heading text-sm font-bold uppercase tracking-wider text-[#191c1e] flex items-center gap-1.5">
                  <span>B. BIAYA OPERASIONAL PRODUKSI (BOP VARIABEL)</span>
                  <Tooltip>
                    <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#4648d4]" /></TooltipTrigger>
                    <TooltipContent className="text-xs max-w-xs">Biaya Gas, Listrik, Minyak Goreng, Air yang dipakai untuk sekali memasak per resep.</TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription className="text-[11px] text-[#45464d]">Overhead pabrik/dapur (Gas LPG, Listrik, Minyak Goreng, Bumbu Pelengkap)</CardDescription>
              </div>
            </div>
            <Button onClick={() => addRow('bopMaterials')} size="sm" className="bg-[#131b2e] hover:bg-[#2d3133] text-white rounded-lg text-xs font-semibold">
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Tambah Overhead</span>
            </Button>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 space-y-3">
            <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-[10px] font-bold text-[#45464d] uppercase pb-2 border-b border-[#e0e3e5]">
              <div className="col-span-3">Nama Biaya BOP</div>
              <div className="col-span-2">Harga Beli Beli</div>
              <div className="col-span-2">Kapasitas Beli</div>
              <div className="col-span-2">Pakai/Resep</div>
              <div className="col-span-1">Porsi Resep</div>
              <div className="col-span-2 text-right">Modal/Porsi</div>
            </div>

            <div className="space-y-3 sm:space-y-2">
              {(prod.bopMaterials || []).map(b => (
                <div key={b.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center p-3 sm:p-2 rounded-lg bg-[#f7f9fb] sm:bg-transparent border sm:border-none border-[#e0e3e5]">
                  <div className="w-full sm:col-span-3">
                    <label className="sm:hidden text-[10px] font-bold text-[#45464d] block mb-1">Nama Overhead</label>
                    <input
                      type="text"
                      value={b.name}
                      onChange={e => updateRow('bopMaterials', b.id, 'name', e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-[#e0e3e5] bg-white focus:border-[#4648d4] focus:outline-none"
                      placeholder="misal: Gas LPG"
                    />
                  </div>
                  <div className="w-full sm:col-span-2">
                    <label className="sm:hidden text-[10px] font-bold text-[#45464d] block mb-1">Total Harga Beli</label>
                    <FlexibleInput value={b.totalPrice} onChange={v => updateRow('bopMaterials', b.id, 'totalPrice', v)} prefix="Rp" />
                  </div>
                  <div className="w-full sm:col-span-2">
                    <label className="sm:hidden text-[10px] font-bold text-[#45464d] block mb-1">Kapasitas Beli Total</label>
                    <div className="flex items-center gap-1">
                      <FlexibleInput value={b.capacity} onChange={v => updateRow('bopMaterials', b.id, 'capacity', Math.max(1, v))} />
                      <select
                        value={b.capUnit}
                        onChange={e => updateRow('bopMaterials', b.id, 'capUnit', e.target.value)}
                        className="text-[11px] font-semibold border border-[#e0e3e5] rounded-md px-1 py-2 bg-white"
                      >
                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="w-full sm:col-span-2">
                    <label className="sm:hidden text-[10px] font-bold text-[#45464d] block mb-1">Pemakaian Per Resep</label>
                    <div className="flex items-center gap-1">
                      <FlexibleInput value={b.usage} onChange={v => updateRow('bopMaterials', b.id, 'usage', Math.max(0, v))} />
                      <span className="text-[11px] text-[#45464d] font-bold">{b.usageUnit || b.capUnit}</span>
                    </div>
                  </div>
                  <div className="w-full sm:col-span-1">
                    <label className="sm:hidden text-[10px] font-bold text-[#45464d] block mb-1">Porsi Resep</label>
                    <FlexibleInput value={b.portions} onChange={v => updateRow('bopMaterials', b.id, 'portions', Math.max(1, v))} />
                  </div>
                  <div className="w-full sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                    <div className="text-right">
                      <span className="sm:hidden text-[10px] text-[#45464d] block">BOP/Porsi:</span>
                      <span className="font-mono font-bold text-[#191c1e] text-xs">{formatIDR(b.hppPerPortion)}</span>
                    </div>
                    {(prod.bopMaterials || []).length > 1 && (
                      <button
                        onClick={() => removeRow('bopMaterials', b.id)}
                        className="text-[#76777d] hover:text-[#ba1a1a] p-1.5 hover:bg-[#ffdad6] rounded-md transition-colors cursor-pointer"
                        title="Hapus BOP"
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

        {/* Section C: Kemasan */}
        <Card className="border-[#e0e3e5] bg-white rounded-xl">
          <CardHeader className="p-5 sm:p-6 pb-3 border-b border-[#f2f4f6] flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#e1e0ff] text-[#07006c] flex items-center justify-center font-bold text-xs">📦</div>
              <div>
                <CardTitle className="font-heading text-sm font-bold uppercase tracking-wider text-[#191c1e] flex items-center gap-1.5">
                  <span>C. KEMASAN PRODUKSI (PACKAGING)</span>
                  <Tooltip>
                    <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#4648d4]" /></TooltipTrigger>
                    <TooltipContent className="text-xs max-w-xs">Box, Mangkok, Stiker, Paperbag, Sendok Plastik yang melekat langsung ke tiap porsi.</TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription className="text-[11px] text-[#45464d]">Wadah dan kemasan yang melekat pada setiap porsi yang dijual</CardDescription>
              </div>
            </div>
            <Button onClick={() => addRow('packagings')} size="sm" className="bg-[#131b2e] hover:bg-[#2d3133] text-white rounded-lg text-xs font-semibold">
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Tambah Kemasan</span>
            </Button>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 space-y-3">
            <div className="hidden sm:grid sm:grid-cols-12 gap-3 text-[10px] font-bold text-[#45464d] uppercase pb-2 border-b border-[#e0e3e5]">
              <div className="col-span-4">Nama Kemasan</div>
              <div className="col-span-3">Total Harga Beli (Rp)</div>
              <div className="col-span-3">Jumlah Isi Per Pack</div>
              <div className="col-span-2 text-right">Modal/Porsi</div>
            </div>

            <div className="space-y-3 sm:space-y-2">
              {(prod.packagings || []).map(p => (
                <div key={p.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 sm:p-2 rounded-lg bg-[#f7f9fb] sm:bg-transparent border sm:border-none border-[#e0e3e5]">
                  <div className="w-full sm:col-span-4">
                    <label className="sm:hidden text-[10px] font-bold text-[#45464d] block mb-1">Nama Kemasan</label>
                    <input
                      type="text"
                      value={p.name}
                      onChange={e => updateRow('packagings', p.id, 'name', e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-[#e0e3e5] bg-white focus:border-[#4648d4] focus:outline-none"
                      placeholder="misal: Paper Bowl + Lid"
                    />
                  </div>
                  <div className="w-full sm:col-span-3">
                    <label className="sm:hidden text-[10px] font-bold text-[#45464d] block mb-1">Total Harga Beli</label>
                    <FlexibleInput value={p.totalPrice} onChange={v => updateRow('packagings', p.id, 'totalPrice', v)} prefix="Rp" />
                  </div>
                  <div className="w-full sm:col-span-3">
                    <label className="sm:hidden text-[10px] font-bold text-[#45464d] block mb-1">Jumlah Isi Per Pack</label>
                    <div className="flex items-center gap-1.5">
                      <div className="w-20 flex-shrink-0">
                        <FlexibleInput value={p.itemsPerPack} onChange={v => updateRow('packagings', p.id, 'itemsPerPack', Math.max(1, v))} />
                      </div>
                      <span className="text-xs text-[#45464d] font-semibold">{p.unit || 'pcs'}</span>
                    </div>
                  </div>
                  <div className="w-full sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                    <div className="text-right">
                      <span className="sm:hidden text-[10px] text-[#45464d] block">HPP/Porsi:</span>
                      <span className="font-mono font-bold text-[#191c1e] text-xs">{formatIDR(p.hppPerPortion)}</span>
                    </div>
                    {(prod.packagings || []).length > 1 && (
                      <button
                        onClick={() => removeRow('packagings', p.id)}
                        className="text-[#76777d] hover:text-[#ba1a1a] p-1.5 hover:bg-[#ffdad6] rounded-md transition-colors cursor-pointer"
                        title="Hapus Kemasan"
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

        {/* Bottom Flow Action */}
        <div className="flex justify-end pt-2">
          <Button onClick={() => onNavigateTab('offline')} className="bg-[#131b2e] hover:bg-[#2d3133] text-white rounded-lg px-6 py-2.5 text-xs font-semibold shadow-xs">
            <span>Lanjut ke Modul 2: Harga Toko (Offline)</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
