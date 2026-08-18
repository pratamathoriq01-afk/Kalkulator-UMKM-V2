'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, Plus, Sparkles, Utensils } from 'lucide-react';

interface HeaderProps {
  productName: string;
  onUpdateProductName: (name: string) => void;
  onToggleDrawer: () => void;
  onAddProduct: () => void;
  onOpenAI: () => void;
}

export default function Header({
  productName,
  onUpdateProductName,
  onToggleDrawer,
  onAddProduct,
  onOpenAI,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Drawer Toggle & Product Name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleDrawer}
            title="Buka Daftar Resep"
            className="rounded-xl border-stone-200 hover:bg-stone-100/80 shadow-2xs transition-transform active:scale-95"
          >
            <Menu className="h-4 w-4 text-stone-700" />
          </Button>

          <div className="flex items-center gap-3 flex-1 min-w-0 max-w-xl">
            <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-[#4A3427] text-white shadow-xs shrink-0">
              <Utensils className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={productName || ''}
                  onChange={(e) => onUpdateProductName(e.target.value)}
                  className="font-heading text-base font-bold text-stone-900 bg-transparent border-b-2 border-stone-200 hover:border-stone-400 focus:border-[#4A3427] focus:outline-none w-full max-w-xs pb-0.5 tracking-tight transition-colors"
                  placeholder="Nama Resep / Produk..."
                />
                <Badge variant="secondary" className="hidden md:inline-flex bg-stone-100/90 text-stone-700 border-stone-200 font-semibold text-[11px] gap-1.5 px-2.5 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8C7259] animate-pulse" />
                  SAK EMKM & FnB Standard
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={onOpenAI}
            className="rounded-xl font-bold bg-[#F0E6D2] hover:bg-[#E2D9C8] text-[#2C1E16] border border-[#D4C8B5] shadow-2xs text-xs px-3 py-2"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#8C7259] mr-1.5" />
            <span className="hidden sm:inline">AI Advisor</span>
          </Button>
          <Button
            onClick={onAddProduct}
            className="rounded-xl font-bold bg-[#4A3427] hover:bg-[#34241B] text-white shadow-xs text-xs px-3 py-2"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Resep Baru</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
