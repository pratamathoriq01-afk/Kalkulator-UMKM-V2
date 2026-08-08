'use client';

import { formatIDR, calculateHPP } from '@/lib/math';
import type { Product } from '@/lib/types';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  activeId: number;
  onSelectProduct: (id: number) => void;
  onAddProduct: () => void;
  onDeleteProduct: (id: number) => void;
  onUpdateProductCommission: (val: number) => void;
  onUpdateProductFixedFee: (val: number) => void;
  commissionPercent: number;
  fixedFee: number;
  onResetToDefaults: () => void;
}

export default function Drawer({
  isOpen, onClose, products, activeId,
  onSelectProduct, onAddProduct, onDeleteProduct,
  onUpdateProductCommission, onUpdateProductFixedFee,
  commissionPercent, fixedFee, onResetToDefaults
}: DrawerProps) {
  if (!isOpen) return null;

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `backup_resep_umkm_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-80 bg-[#F7F3E9] text-[#241710] flex flex-col shadow-2xl border-r border-[#D4C8B5] animate-in slide-in-from-left duration-200">
          
          {/* Header */}
          <div className="p-5 bg-[#4A3427] text-white flex items-center justify-between border-b border-[#241710]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center font-bold border border-white/20">☰</div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Manajemen Produk</h3>
                <p className="text-[10px] text-[#EFE9DC] font-bold">Kalkulator Keuangan UMKM</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-white hover:bg-white/20 transition cursor-pointer font-bold">✕</button>
          </div>

          {/* Product List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-extrabold tracking-widest text-[#6B5541] px-1 mb-2">
              <span>DAFTAR PRODUK</span>
              <span className="bg-[#EFE9DC] text-[#241710] border border-[#D4C8B5] px-2 py-0.5 rounded font-extrabold">{products.length}</span>
            </div>

            {products.map(p => {
              const isActive = p.id === activeId;
              const hppData = calculateHPP(p);
              return (
                <div
                  key={p.id}
                  onClick={() => { onSelectProduct(p.id); onClose(); }}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all border flex flex-col gap-1 shadow-sm ${
                    isActive ? 'bg-[#4A3427] border-[#241710] text-white' : 'bg-white border-[#D4C8B5] hover:border-[#8C7259] hover:bg-[#F0E6D2] text-[#241710]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-extrabold truncate ${isActive ? 'text-white' : 'text-[#241710]'}`}>{p.name}</span>
                    {products.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteProduct(p.id); }}
                        className={`p-1 rounded hover:bg-rose-600 hover:text-white transition ${isActive ? 'text-white' : 'text-[#6B5541]'}`}
                        title="Hapus Produk"
                      >🗑️</button>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-[11px] mt-1">
                    <span className={isActive ? 'text-[#EFE9DC] font-semibold' : 'text-[#6B5541] font-bold'}>HPP/Porsi:</span>
                    <span className={`font-extrabold font-mono ${isActive ? 'text-white' : 'text-[#241710]'}`}>{formatIDR(hppData.hppMurni)}</span>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => { onAddProduct(); onClose(); }}
              className="w-full mt-3 py-3 border-2 border-dashed border-[#D4C8B5] hover:border-[#4A3427] hover:text-[#241710] rounded-xl text-sm font-extrabold text-[#6B5541] flex items-center justify-center gap-2 transition bg-white cursor-pointer"
            >
              <span>➕</span> <span>Tambah Produk Baru</span>
            </button>
          </div>

          {/* Footer: Commission Settings */}
          <div className="p-4 border-t border-[#D4C8B5] bg-[#EFE9DC] text-xs space-y-3">
            <span className="text-[10px] font-extrabold tracking-widest text-[#241710] block uppercase">Pengaturan Komisi Platform Online</span>

            <div>
              <label className="text-[10px] font-extrabold text-[#241710] block mb-1">Komisi Platform (%)</label>
              <div className="relative">
                <input
                  type="number" min="0" max="99" value={commissionPercent}
                  onChange={(e) => onUpdateProductCommission(Math.min(99, Math.max(0, parseFloat(e.target.value) || 0)))}
                  className="w-full bg-white border border-[#D4C8B5] text-[#241710] rounded-lg text-xs font-bold px-3 py-1.5 focus:outline-none focus:border-[#4A3427]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-[#6B5541]">%</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-[#241710] block mb-1">Biaya Tetap per Transaksi</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-[#6B5541]">Rp</span>
                <input
                  type="number" min="0" value={fixedFee}
                  onChange={(e) => onUpdateProductFixedFee(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-white border border-[#D4C8B5] text-[#241710] rounded-lg text-xs font-bold pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#4A3427]"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#D4C8B5] flex flex-col gap-2">
              <button onClick={handleExport} className="w-full py-2 bg-[#4A3427] hover:bg-[#241710] text-white rounded-lg text-[11px] font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                📥 Export / Backup Data JSON
              </button>
              <button
                onClick={() => { if (confirm('Reset seluruh resep ke preset awal? Data saat ini akan diganti.')) onResetToDefaults(); }}
                className="w-full py-2 bg-[#7F1D1D] hover:bg-[#991B1B] text-white rounded-lg text-[10px] font-extrabold transition flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              >
                🔄 Reset Ke Preset Default
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
