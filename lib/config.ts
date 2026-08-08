import type { Product, MarginStatus } from './types';

export const UNITS = [
  'porsi', 'pcs', 'gram', 'kg', 'ml', 'liter', 'butir', 'sendok',
  'sdm', 'sdt', 'bungkus', 'buah', 'lembar', 'ikat', 'siung', 'batang'
] as const;

export const MARGIN_STATUS: Record<string, MarginStatus> = {
  HEALTHY: { min: 30, label: 'Sehat', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: '🟢' },
  MODERATE: { min: 15, label: 'Pas-pasan', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300', icon: '🟡' },
  CRITICAL: { min: 0, label: 'Kritis', badgeClass: 'bg-rose-100 text-rose-800 border-rose-300', icon: '🔴' },
};

export const DEFAULT_PRESETS: Product[] = [
  {
    id: 1,
    name: 'Nasi Ayam Marinasi Spesial',
    mainMaterials: [
      { id: 1, name: 'Ayam', totalPrice: 40000, portions: 8, unit: 'porsi' },
      { id: 2, name: 'Beras', totalPrice: 17500, portions: 10, unit: 'porsi' },
    ],
    bopMaterials: [
      { id: 1, name: 'Minyak Goreng', totalPrice: 43000, capacity: 2000, capUnit: 'ml', usage: 500, usageUnit: 'ml', portions: 8 },
      { id: 2, name: 'Gas LPG 3kg', totalPrice: 21000, capacity: 3000, capUnit: 'gram', usage: 250, usageUnit: 'gram', portions: 8 },
    ],
    packagings: [
      { id: 1, name: 'Box Makanan', totalPrice: 65000, itemsPerPack: 100, unit: 'pcs' },
      { id: 2, name: 'Kresek', totalPrice: 15000, itemsPerPack: 50, unit: 'pcs' },
    ],
    marginPercent: 40,
    customOfflinePrice: 13000,
    commissionPercent: 20,
    fixedFee: 1000,
    customOnlinePrice: 17500,
    simOrderQty: 3,
    promoEnabled: true,
    promoMinOrder: 40000,
    promoPercent: 40,
    promoMaxDiscount: 15000,
    commissionDeductionMode: 'before_discount',
  },
  {
    id: 2,
    name: 'Nasi Kulit Krispi',
    mainMaterials: [
      { id: 1, name: 'Kulit Ayam Fresh', totalPrice: 35000, portions: 10, unit: 'porsi' },
      { id: 2, name: 'Beras Pulen', totalPrice: 17500, portions: 10, unit: 'porsi' },
      { id: 3, name: 'Tepung Bumbu Crispy', totalPrice: 15000, portions: 10, unit: 'porsi' },
    ],
    bopMaterials: [
      { id: 1, name: 'Minyak Goreng', totalPrice: 20000, capacity: 1000, capUnit: 'ml', usage: 300, usageUnit: 'ml', portions: 10 },
    ],
    packagings: [
      { id: 1, name: 'Paper Rice Bowl', totalPrice: 15000, itemsPerPack: 50, unit: 'pcs' },
    ],
    marginPercent: 25,
    customOfflinePrice: 10000,
    commissionPercent: 20,
    fixedFee: 1000,
    customOnlinePrice: 14000,
    simOrderQty: 2,
    promoEnabled: false,
    promoMinOrder: 30000,
    promoPercent: 20,
    promoMaxDiscount: 10000,
    commissionDeductionMode: 'before_discount',
  },
  {
    id: 3,
    name: 'Es Teh Manis',
    mainMaterials: [
      { id: 1, name: 'Teh Tubruk Melati', totalPrice: 10000, portions: 20, unit: 'porsi' },
      { id: 2, name: 'Gula Pasir', totalPrice: 15000, portions: 30, unit: 'porsi' },
    ],
    bopMaterials: [
      { id: 1, name: 'Es Batu Kristal', totalPrice: 10000, capacity: 10, capUnit: 'kg', usage: 2, usageUnit: 'kg', portions: 20 },
    ],
    packagings: [
      { id: 1, name: 'Cup Plastik + Sedotan', totalPrice: 20000, itemsPerPack: 50, unit: 'pcs' },
    ],
    marginPercent: 10,
    customOfflinePrice: 3000,
    commissionPercent: 20,
    fixedFee: 1000,
    customOnlinePrice: 5000,
    simOrderQty: 5,
    promoEnabled: false,
    promoMinOrder: 20000,
    promoPercent: 15,
    promoMaxDiscount: 5000,
    commissionDeductionMode: 'before_discount',
  },
];
