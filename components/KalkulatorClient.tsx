'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Drawer from '@/components/Drawer';
import RightSummary from '@/components/RightSummary';
import AIAssistantModal from '@/components/AIAssistantModal';
import TabHPP from '@/components/tabs/TabHPP';
import TabOffline from '@/components/tabs/TabOffline';
import TabOnline from '@/components/tabs/TabOnline';
import TabPromo from '@/components/tabs/TabPromo';
import TabSummarize from '@/components/tabs/TabSummarize';
import type { Product } from '@/lib/types';
import { DEFAULT_PRESETS } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Box, Store, Smartphone, Tag, FileText, Sparkles, Save } from 'lucide-react';

type TabId = 'hpp' | 'offline' | 'online' | 'promo' | 'summarize';

const TABS: { id: TabId; icon: typeof Box; label: string }[] = [
  { id: 'hpp', icon: Box, label: '1. HPP Murni' },
  { id: 'offline', icon: Store, label: '2. Harga Toko' },
  { id: 'online', icon: Smartphone, label: '3. Harga Online' },
  { id: 'promo', icon: Tag, label: '4. Promo' },
  { id: 'summarize', icon: FileText, label: '5. Summarize' },
];

interface KalkulatorClientProps {
  initialProducts: Product[];
}

export default function KalkulatorClient({ initialProducts }: KalkulatorClientProps) {
  const [products, setProducts] = useState<Product[]>(
    initialProducts.length > 0 ? initialProducts : DEFAULT_PRESETS
  );
  const [activeId, setActiveId] = useState<number>(products[0]?.id ?? 1);
  const [activeTab, setActiveTab] = useState<TabId>('hpp');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiApiKey, setAiApiKey] = useState('');
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');
  const [isSaving, setIsSaving] = useState(false);

  const activeProd = products.find(p => p.id === activeId) ?? products[0];

  /* ─── DB Sync Helpers ─── */
  const syncToDb = useCallback(async (product: Product, action: 'create' | 'update' | 'delete') => {
    try {
      if (action === 'create') {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });
        if (res.ok) {
          const { dbId } = await res.json();
          return dbId as number;
        }
      } else if (action === 'update' && product.dbId) {
        await fetch(`/api/products/${product.dbId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });
      } else if (action === 'delete' && product.dbId) {
        await fetch(`/api/products/${product.dbId}`, { method: 'DELETE' });
      }
    } catch (err) {
      console.warn('[DB Sync]', err);
    }
    return null;
  }, []);

  /* ─── Product Update (auto-save to DB with debounce) ─── */
  const handleUpdateProduct = useCallback((field: string, value: unknown) => {
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id !== activeId) return p;
        const newProd = { ...p, [field]: value };
        // Debounced DB sync
        if (!isSaving) {
          setIsSaving(true);
          setTimeout(() => {
            syncToDb(newProd, 'update').finally(() => setIsSaving(false));
          }, 1000);
        }
        return newProd;
      });
      return updated;
    });
  }, [activeId, isSaving, syncToDb]);

  const handleUpdateProductName = useCallback((name: string) => {
    handleUpdateProduct('name', name);
  }, [handleUpdateProduct]);

  /* ─── Add Product ─── */
  const handleAddProduct = useCallback(async () => {
    const nextId = products.reduce((max, p) => p.id > max ? p.id : max, 0) + 1;
    const newProd: Product = {
      ...DEFAULT_PRESETS[0],
      id: nextId,
      name: `Resep Baru ${nextId}`,
      pricingMode: 'food_cost',
      targetFoodCostPercent: 35,
      targetMarginPercent: 65,
      mainMaterials: [{ id: 1, name: 'Bahan Utama', totalPrice: 0, portions: 8, unit: 'porsi' }],
      bopMaterials: [{ id: 1, name: 'Overhead', totalPrice: 0, capacity: 1000, capUnit: 'ml', usage: 250, usageUnit: 'ml', portions: 8 }],
      packagings: [{ id: 1, name: 'Kemasan', totalPrice: 0, itemsPerPack: 50, unit: 'pcs' }],
    };
    const dbId = await syncToDb(newProd, 'create');
    const prodWithDbId = { ...newProd, dbId: dbId ?? undefined };
    setProducts(prev => [...prev, prodWithDbId]);
    setActiveId(nextId);
    setActiveTab('hpp');
  }, [products, syncToDb]);

  /* ─── Delete Product ─── */
  const handleDeleteProduct = useCallback(async (id: number) => {
    const prod = products.find(p => p.id === id);
    if (!prod || products.length <= 1) return;
    await syncToDb(prod, 'delete');
    const remaining = products.filter(p => p.id !== id);
    setProducts(remaining);
    if (activeId === id) setActiveId(remaining[0].id);
  }, [products, activeId, syncToDb]);

  /* ─── Commission & Fixed Fee (global per product) ─── */
  const handleUpdateCommission = useCallback((val: number) => {
    handleUpdateProduct('commissionPercent', val);
  }, [handleUpdateProduct]);

  const handleUpdateFixedFee = useCallback((val: number) => {
    handleUpdateProduct('fixedFee', val);
  }, [handleUpdateProduct]);

  /* ─── Reset to Defaults ─── */
  const handleResetToDefaults = useCallback(async () => {
    for (const p of products) await syncToDb(p, 'delete');
    const newProducts: Product[] = [];
    for (const preset of DEFAULT_PRESETS) {
      const dbId = await syncToDb(preset, 'create');
      newProducts.push({ ...preset, dbId: dbId ?? undefined });
    }
    setProducts(newProducts);
    setActiveId(newProducts[0].id);
  }, [products, syncToDb]);

  if (!activeProd) return null;

  return (
    <div className="min-h-screen bg-stone-50/70 text-stone-900 font-sans antialiased selection:bg-[#F0E6D2] selection:text-[#2C1E16]">
      <Header
        productName={activeProd.name}
        onUpdateProductName={handleUpdateProductName}
        onToggleDrawer={() => setIsDrawerOpen(true)}
        onAddProduct={handleAddProduct}
        onOpenAI={() => setIsAIOpen(true)}
      />

      {/* Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        products={products}
        activeId={activeId}
        onSelectProduct={setActiveId}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateProductCommission={handleUpdateCommission}
        onUpdateProductFixedFee={handleUpdateFixedFee}
        commissionPercent={activeProd.commissionPercent}
        fixedFee={activeProd.fixedFee}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* AI Modal */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        prod={activeProd}
        apiKey={aiApiKey}
        model={aiModel}
        onUpdateApiKey={setAiApiKey}
        onUpdateModel={setAiModel}
      />

      {/* Main Layout Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Kalkulator Keuangan UMKM Pintar
            </h1>
            <p className="text-xs text-stone-500 font-medium mt-1 flex items-center gap-2">
              <span>Modul kalkulasi HPP SAK EMKM, Food Cost Method, & Proteksi Promo Online.</span>
              {isSaving && (
                <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full text-[10px] border border-amber-200">
                  <Save className="h-3 w-3 animate-pulse" /> Menyimpan...
                </span>
              )}
            </p>
          </div>
          <Button
            onClick={() => setIsAIOpen(true)}
            variant="secondary"
            className="bg-[#F0E6D2] hover:bg-[#E2D9C8] text-[#2C1E16] border border-[#D4C8B5] rounded-xl font-bold text-xs shadow-2xs self-start md:self-auto"
          >
            <Sparkles className="h-4 w-4 mr-1.5 text-[#8C7259]" />
            <span>Juragan AI Advisor</span>
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="w-full overflow-x-auto pb-1 scrollbar-none">
          <Tabs value={activeTab} onValueChange={v => setActiveTab(v as TabId)} className="w-full">
            <TabsList className="bg-white border border-stone-200 shadow-2xs p-1 h-12 inline-flex min-w-max gap-1">
              {TABS.map(t => {
                const Icon = t.icon;
                return (
                  <TabsTrigger
                    key={t.id}
                    value={t.id}
                    className="rounded-xl px-4 py-2 text-xs font-bold transition-all data-[state=active]:bg-[#4A3427] data-[state=active]:text-white data-[state=active]:shadow-xs flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{t.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Active Tab Content */}
          <div className="lg:col-span-2">
            {activeTab === 'hpp' && <TabHPP prod={activeProd} onUpdateProduct={handleUpdateProduct} onNavigateTab={(tab) => setActiveTab(tab as TabId)} />}
            {activeTab === 'offline' && <TabOffline prod={activeProd} onUpdateProduct={handleUpdateProduct} onNavigateTab={(tab) => setActiveTab(tab as TabId)} />}
            {activeTab === 'online' && <TabOnline prod={activeProd} onUpdateProduct={handleUpdateProduct} onNavigateTab={(tab) => setActiveTab(tab as TabId)} />}
            {activeTab === 'promo' && <TabPromo prod={activeProd} onUpdateProduct={handleUpdateProduct} />}
            {activeTab === 'summarize' && <TabSummarize prod={activeProd} onOpenAI={() => setIsAIOpen(true)} />}
          </div>

          {/* Right: Sticky Summary Panel */}
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <RightSummary prod={activeProd} onOpenAI={() => setIsAIOpen(true)} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
