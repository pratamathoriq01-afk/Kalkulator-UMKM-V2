'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, Plus, Sparkles, Calculator, Landmark } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#e0e3e5] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Drawer Toggle & Brand / Product Name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleDrawer}
            title="Daftar Resep"
            className="rounded-lg border-[#e0e3e5] hover:bg-[#f2f4f6] text-[#191c1e]"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3 flex-1 min-w-0 max-w-xl">
            <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg bg-[#131b2e] text-white shadow-xs shrink-0">
              <Landmark className="h-4 w-4 text-[#e1e0ff]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm font-bold text-[#131b2e] hidden md:inline shrink-0">Lumina Finance</span>
                <span className="text-[#c6c6cd] hidden md:inline">•</span>
                <input
                  type="text"
                  value={productName || ''}
                  onChange={(e) => onUpdateProductName(e.target.value)}
                  className="font-heading text-base font-bold text-[#191c1e] bg-transparent border-b border-[#e0e3e5] hover:border-[#76777d] focus:border-[#4648d4] focus:outline-none w-full max-w-xs pb-0.5 tracking-tight transition-colors"
                  placeholder="Nama Resep / Produk..."
                />
                <Badge variant="secondary" className="hidden lg:inline-flex bg-[#e1e0ff] text-[#07006c] font-semibold text-[10px] gap-1 px-2.5 py-0.5 rounded-md border-none">
                  SAK EMKM Engine
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
            className="rounded-lg font-semibold bg-[#e1e0ff] hover:bg-[#c0c1ff] text-[#07006c] border-none text-xs px-3.5 py-2"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#4648d4]" />
            <span className="hidden sm:inline">AI Advisor</span>
          </Button>
          <Button
            onClick={onAddProduct}
            className="rounded-lg font-semibold bg-[#131b2e] hover:bg-[#2d3133] text-white text-xs px-3.5 py-2 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline">Resep Baru</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
