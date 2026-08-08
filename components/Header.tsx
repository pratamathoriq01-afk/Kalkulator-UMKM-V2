'use client';

interface HeaderProps {
  productName: string;
  onUpdateProductName: (name: string) => void;
  onToggleDrawer: () => void;
  onAddProduct: () => void;
  onOpenAI: () => void;
}

export default function Header({ productName, onUpdateProductName, onToggleDrawer, onAddProduct, onOpenAI }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#EFE9DC] text-[#241710] shadow-sm border-b border-[#D4C8B5]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Drawer & Brand */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onToggleDrawer}
            title="Buka Daftar Resep"
            className="w-9 h-9 rounded-xl bg-[#F7F3E9] hover:bg-[#D4C8B5] text-[#241710] transition flex items-center justify-center font-bold text-base cursor-pointer border border-[#D4C8B5] shadow-sm"
          >
            ☰
          </button>
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <div className="hidden sm:flex w-9 h-9 rounded-xl bg-[#4A3427] text-white items-center justify-center font-black text-base shadow-sm">
              🍲
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={productName || ''}
                  onChange={(e) => onUpdateProductName(e.target.value)}
                  className="text-base sm:text-lg font-black text-[#241710] bg-transparent border-b-2 border-[#BDB6A3] hover:border-[#8C7259] focus:border-[#4A3427] focus:outline-none w-full max-w-xs pb-0.5 tracking-tight"
                  placeholder="Nama Resep / Produk..."
                />
                <span className="hidden md:inline-flex items-center gap-1.5 bg-[#F7F3E9] text-[#241710] font-extrabold border border-[#D4C8B5] px-2.5 py-0.5 rounded-full text-[10px] whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-[#8C7259] animate-pulse" />
                  SAK EMKM Standard
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAI}
            className="bg-[#8C7259] hover:bg-[#6B5541] px-4 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-sm transition"
          >
            <span>🤖</span>
            <span className="hidden sm:inline">Juragan AI Advisor</span>
          </button>
          <button
            onClick={onAddProduct}
            className="bg-[#8C7259] hover:bg-[#6B5541] px-4 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition"
          >
            <span>➕</span>
            <span className="hidden sm:inline">Resep Baru</span>
          </button>
        </div>
      </div>
    </header>
  );
}
