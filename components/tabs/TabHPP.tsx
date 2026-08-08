'use client';

import FlexibleInput from '@/components/FlexibleInput';
import { formatIDR, calculateHPP } from '@/lib/math';
import { UNITS } from '@/lib/config';
import type { Product, MainMaterial, BopMaterial, Packaging } from '@/lib/types';

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
      <div className="bg-[#F0E6D2] rounded-3xl p-6 shadow-sm border border-[#E2D9C8] space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#2C1E16] bg-[#E2D9C8] px-2.5 py-1 rounded-lg border border-[#BDB6A3]">Modul 1: HPP Murni</span>
          <span className="text-xs text-[#786452] font-bold">• Standar Manufaktur Kuliner Presisi</span>
        </div>
        <h2 className="text-xl font-black text-[#2C1E16]">📦 Biaya Produksi & HPP Murni per Porsi</h2>
        <p className="text-xs text-[#786452] max-w-2xl font-semibold">Kelola 3 pilar HPP murni (Bahan Utama, BOP Variabel, & Kemasan). HPP Murni adalah modal bersih 0% risiko.</p>
      </div>

      {/* Total HPP Summary Banner */}
      <div className="bg-[#3D2B1F] text-white p-6 rounded-3xl shadow-sm border border-[#2C1E16] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E2D9C8]">TOTAL HPP MURNI PER PORSI</span>
          <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">{formatIDR(hppData.hppMurni)}</div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-center text-xs font-bold">
          {[
            { label: 'Bahan Utama', val: hppData.totalMainMaterials },
            { label: 'BOP Variabel', val: hppData.totalBopMaterials },
            { label: 'Kemasan', val: hppData.totalPackagings },
          ].map(({ label, val }) => (
            <div key={label} className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-[#E2D9C8] block font-extrabold">{label}</span>
              <span className="font-mono font-black text-white">{formatIDR(val)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* A. Bahan Baku Utama */}
      <div className="bg-[#F0E6D2] rounded-3xl p-5 sm:p-6 shadow-sm border border-[#E2D9C8] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🥩</span>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#2C1E16]">A. BAHAN BAKU UTAMA</h3>
          </div>
          <button onClick={() => addRow('mainMaterials')} className="bg-[#8C7259] hover:bg-[#6B5541] px-3 py-1.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-sm transition">
            ➕ Tambah Bahan
          </button>
        </div>
        <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-[10px] font-extrabold uppercase tracking-wider text-[#786452] px-3">
          <div className="col-span-4">Nama Bahan Utama</div>
          <div className="col-span-3">Total Harga Beli</div>
          <div className="col-span-3 text-center">Hasil Porsi & Satuan</div>
          <div className="col-span-2 text-right">HPP / Porsi</div>
        </div>
        <div className="space-y-2.5">
          {(hppData.mainList || []).map(m => (
            <div key={m.id} className="flex flex-col sm:grid sm:grid-cols-12 gap-2 items-center bg-white p-3 rounded-2xl border border-[#E2D9C8]">
              <div className="w-full sm:col-span-4">
                <label className="sm:hidden text-[10px] font-bold text-[#786452] block mb-1">Nama Bahan</label>
                <input type="text" value={m.name} onChange={e => updateRow('mainMaterials', m.id, 'name', e.target.value)} placeholder="Misal: Ayam / Beras..." className="w-full bg-white border border-[#E2D9C8] rounded-xl text-xs px-3 py-2 font-bold text-[#2C1E16] focus:outline-none focus:border-[#3D2B1F]" />
              </div>
              <div className="w-full sm:col-span-3">
                <label className="sm:hidden text-[10px] font-bold text-[#786452] block mb-1">Total Harga Beli</label>
                <FlexibleInput value={m.totalPrice} onChange={v => updateRow('mainMaterials', m.id, 'totalPrice', v)} prefix="Rp" />
              </div>
              <div className="w-full sm:col-span-3">
                <label className="sm:hidden text-[10px] font-bold text-[#786452] block mb-1">Hasil Porsi & Satuan</label>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 flex-shrink-0"><FlexibleInput value={m.portions} onChange={v => updateRow('mainMaterials', m.id, 'portions', Math.max(1, v))} /></div>
                  <select value={m.unit || 'porsi'} onChange={e => updateRow('mainMaterials', m.id, 'unit', e.target.value)} className="flex-1 min-w-[70px] bg-white border border-[#E2D9C8] rounded-xl text-xs px-2 py-2 font-semibold text-[#2C1E16] focus:outline-none">
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="w-full sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                <div className="text-right"><span className="sm:hidden text-[10px] text-[#786452] block">HPP/Porsi:</span><span className="font-mono font-extrabold text-[#2C1E16] text-xs">{formatIDR(m.hppPerPortion)}</span></div>
                {(prod.mainMaterials || []).length > 1 && <button onClick={() => removeRow('mainMaterials', m.id)} className="text-xs text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition cursor-pointer" title="Hapus">🗑️</button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* B. BOP Variabel */}
      <div className="bg-[#F0E6D2] rounded-3xl p-5 sm:p-6 shadow-sm border border-[#E2D9C8] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛢️</span>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#2C1E16]">B. BAHAN HABIS PAKAI (BOP VARIABEL)</h3>
          </div>
          <button onClick={() => addRow('bopMaterials')} className="bg-[#8C7259] hover:bg-[#6B5541] px-3 py-1.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-sm transition">
            ➕ Tambah Overhead
          </button>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E2D9C8] text-[#2C1E16] text-xs flex items-start gap-2.5 leading-relaxed font-semibold">
          <span className="text-base">💡</span>
          <div><strong className="font-extrabold block mb-0.5">Panduan:</strong>Masukkan harga beli (Rp 43.000), kapasitas total (2000 ml), pemakaian resep (500 ml), dan hasil porsi (8). Rumus: (43.000 ÷ 2000 × 500) ÷ 8 = Rp 1.343,75/porsi.</div>
        </div>
        <div className="space-y-3">
          {(hppData.bopList || []).map(b => (
            <div key={b.id} className="bg-white p-3.5 rounded-2xl border border-[#E2D9C8] space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                <div className="sm:col-span-7">
                  <label className="text-[10px] font-bold text-[#786452] block mb-0.5 uppercase">Nama Bahan Habis Pakai:</label>
                  <input type="text" value={b.name} onChange={e => updateRow('bopMaterials', b.id, 'name', e.target.value)} placeholder="Misal: Minyak Goreng / Gas LPG..." className="w-full bg-white border border-[#E2D9C8] rounded-xl text-xs px-3 py-2 font-bold text-[#2C1E16] focus:outline-none focus:border-[#3D2B1F]" />
                </div>
                <div className="sm:col-span-5">
                  <label className="text-[10px] font-bold text-[#786452] block mb-0.5 uppercase">Harga Beli Kemasan:</label>
                  <FlexibleInput value={b.totalPrice} onChange={v => updateRow('bopMaterials', b.id, 'totalPrice', v)} prefix="Rp" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center pt-2 border-t border-[#E2D9C8]">
                <div className="sm:col-span-4">
                  <label className="text-[10px] font-bold text-[#786452] block mb-0.5">Kapasitas Total:</label>
                  <div className="flex items-center gap-1">
                    <div className="w-20 flex-shrink-0"><FlexibleInput value={b.capacity} onChange={v => updateRow('bopMaterials', b.id, 'capacity', v)} /></div>
                    <select value={b.capUnit || 'ml'} onChange={e => updateRow('bopMaterials', b.id, 'capUnit', e.target.value)} className="flex-1 min-w-[65px] bg-white border border-[#E2D9C8] rounded-xl text-[11px] px-1.5 py-2 font-semibold text-[#2C1E16]">{UNITS.map(u => <option key={u} value={u}>{u}</option>)}</select>
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label className="text-[10px] font-bold text-[#786452] block mb-0.5">Pemakaian Resep:</label>
                  <div className="flex items-center gap-1">
                    <div className="w-20 flex-shrink-0"><FlexibleInput value={b.usage} onChange={v => updateRow('bopMaterials', b.id, 'usage', v)} /></div>
                    <select value={b.usageUnit || 'ml'} onChange={e => updateRow('bopMaterials', b.id, 'usageUnit', e.target.value)} className="flex-1 min-w-[65px] bg-white border border-[#E2D9C8] rounded-xl text-[11px] px-1.5 py-2 font-semibold text-[#2C1E16]">{UNITS.map(u => <option key={u} value={u}>{u}</option>)}</select>
                  </div>
                </div>
                <div className="sm:col-span-4 flex items-center justify-between gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-[#786452] block mb-0.5">Hasil Porsi:</label>
                    <div className="w-16"><FlexibleInput value={b.portions} onChange={v => updateRow('bopMaterials', b.id, 'portions', Math.max(1, v))} /></div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#786452] block font-bold">Subtotal/Porsi:</span>
                    <span className="font-mono font-extrabold text-[#2C1E16] text-xs">{formatIDR(b.hppPerPortion)}</span>
                  </div>
                  {(prod.bopMaterials || []).length > 1 && <button onClick={() => removeRow('bopMaterials', b.id)} className="text-xs text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition cursor-pointer" title="Hapus">🗑️</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* C. Kemasan */}
      <div className="bg-[#F0E6D2] rounded-3xl p-5 sm:p-6 shadow-sm border border-[#E2D9C8] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📦</span>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#2C1E16]">C. KEMASAN & PACKAGING</h3>
          </div>
          <button onClick={() => addRow('packagings')} className="bg-[#8C7259] hover:bg-[#6B5541] px-3 py-1.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-sm transition">
            ➕ Tambah Kemasan
          </button>
        </div>
        <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-[10px] font-extrabold uppercase tracking-wider text-[#786452] px-3">
          <div className="col-span-4">Nama Kemasan / Packaging</div>
          <div className="col-span-3">Total Harga Beli Pack</div>
          <div className="col-span-3">Isi per Kemasan</div>
          <div className="col-span-2 text-right">Biaya / Porsi</div>
        </div>
        <div className="space-y-2.5">
          {(hppData.packList || []).map(p => (
            <div key={p.id} className="flex flex-col sm:grid sm:grid-cols-12 gap-2 items-center bg-white p-3 rounded-2xl border border-[#E2D9C8]">
              <div className="w-full sm:col-span-4">
                <label className="sm:hidden text-[10px] font-bold text-[#786452] block mb-1">Nama Kemasan</label>
                <input type="text" value={p.name} onChange={e => updateRow('packagings', p.id, 'name', e.target.value)} placeholder="Misal: Box Makanan / Kantong..." className="w-full bg-white border border-[#E2D9C8] rounded-xl text-xs px-3 py-2 font-bold text-[#2C1E16] focus:outline-none focus:border-[#3D2B1F]" />
              </div>
              <div className="w-full sm:col-span-3">
                <label className="sm:hidden text-[10px] font-bold text-[#786452] block mb-1">Total Harga Beli Pack</label>
                <FlexibleInput value={p.totalPrice} onChange={v => updateRow('packagings', p.id, 'totalPrice', v)} prefix="Rp" />
              </div>
              <div className="w-full sm:col-span-3">
                <label className="sm:hidden text-[10px] font-bold text-[#786452] block mb-1">Isi per Kemasan</label>
                <div className="flex items-center gap-1.5">
                  <div className="w-20 flex-shrink-0"><FlexibleInput value={p.itemsPerPack} onChange={v => updateRow('packagings', p.id, 'itemsPerPack', Math.max(1, v))} /></div>
                  <span className="text-xs text-[#2C1E16] font-extrabold">{p.unit || 'pcs'}</span>
                </div>
              </div>
              <div className="w-full sm:col-span-2 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                <div className="text-right"><span className="sm:hidden text-[10px] text-[#786452] block">HPP/Porsi:</span><span className="font-mono font-extrabold text-[#2C1E16] text-xs">{formatIDR(p.hppPerPortion)}</span></div>
                {(prod.packagings || []).length > 1 && <button onClick={() => removeRow('packagings', p.id)} className="text-xs text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition cursor-pointer" title="Hapus">🗑️</button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button onClick={() => onNavigateTab('offline')} className="bg-[#4A3427] hover:bg-[#241710] text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer">
          Lanjut ke Harga Jual Toko (Offline) ➔
        </button>
      </div>
    </div>
  );
}
