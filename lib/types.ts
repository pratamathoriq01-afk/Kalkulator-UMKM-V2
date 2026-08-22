export interface MainMaterial {
  id: number;
  name: string;
  totalPrice: number;
  portions: number;
  unit: string;
  hppPerPortion?: number;
}

export interface BopMaterial {
  id: number;
  name: string;
  /** 'simple' = input langsung biaya resep (Rp), 'detail' = input kapasitas & pemakaian */
  inputMode?: 'simple' | 'detail';
  // --- Mode Simple ---
  directCost?: number;    // Biaya langsung per resep (Rp)
  // --- Mode Detail ---
  totalPrice: number;     // Harga beli 1 pack/tabung/botol
  capacity: number;       // Kapasitas total yang dibeli (dalam satuan capUnit)
  capUnit: string;        // Satuan kapasitas (gram, ml, liter, kg, pcs, ...)
  usage: number;          // Pemakaian per resep (dalam satuan capUnit yang sama)
  usageUnit: string;      // Satuan pakai (auto-sync dengan capUnit)
  portions: number;       // Jumlah porsi yang dihasilkan 1 resep
  // --- Computed ---
  recipeCost?: number;    // Biaya total 1 resep
  hppPerPortion?: number; // Biaya per porsi
}

export interface Packaging {
  id: number;
  name: string;
  totalPrice: number;
  itemsPerPack: number;
  unit: string;
  hppPerPortion?: number;
}

export interface Product {
  id: number;
  dbId?: number;
  name: string;
  mainMaterials: MainMaterial[];
  bopMaterials: BopMaterial[];
  packagings: Packaging[];
  /** Target Gross Margin % — satu-satunya metode pricing (Harga Jual = HPP ÷ (1 - Margin%)) */
  targetMarginPercent: number;
  customOfflinePrice: number | null;
  offlinePromoEnabled?: boolean;
  offlineDiscountMode?: 'percent' | 'nominal';
  offlineDiscountPercent?: number;
  offlineDiscountNominal?: number;
  commissionPercent: number;
  fixedFee: number;
  /** true = user mengaktifkan override manual harga online */
  onlineManualOverrideEnabled?: boolean;
  customOnlinePrice: number | null;
  simOrderQty: number;
  promoEnabled: boolean;
  promoMinOrder: number;
  promoPercent: number;
  promoMaxDiscount: number;
  commissionDeductionMode: 'before_discount' | 'after_discount';
}

export interface HPPData {
  mainList: MainMaterial[];
  bopList: BopMaterial[];
  packList: Packaging[];
  totalMainMaterials: number;
  totalBopMaterials: number;
  totalPackagings: number;
  hppMurni: number;
  mainPct: number;
  bopPct: number;
  packPct: number;
  validationErrors: string[];
}

export interface MarginStatus {
  min: number;
  label: string;
  badgeClass: string;
  icon: string;
}

export interface OfflineData {
  targetMarginPercent: number;
  recommendedPriceRaw: number;
  recommendedPrice: number;
  effectiveOfflinePrice: number;
  netOfflineMargin: number;
  marginRatio: number;   // Gross Margin % on sales
  foodCostRatio: number; // Food Cost % on sales
  marginStatus: MarginStatus;
}

export interface OfflinePromoData {
  isOfflinePromoActive: boolean;
  mode: string;
  discountPercent: number;
  discountNominal: number;
  priceAfterDiscount: number;
  netMarginAfterDiscount: number;
  marginRatioAfterDiscount: number;
  isLosing: boolean;
  hargaFinalCoret: number;
}

export interface OnlineData {
  commPercent: number;
  commFrac: number;
  fixedFee: number;
  recommendedOnlineRaw: number;
  recommendedOnline: number;
  effectiveOnlinePrice: number;
  commissionAmount: number;
  simulatedPayout: number;
  isUnderPricingRisk: boolean;
}

export interface PromoData {
  isPromoActive: boolean;
  orderQty: number;
  orderSubtotal: number;
  minOrder: number;
  promoPercent: number;
  maxDiscountCap: number;
  isMinOrderMet: boolean;
  rawDiscount: number;
  isDiscountCapped: boolean;
  effectiveDiscount: number;
  customerPays: number;
  deductionMode: string;
  commissionBase: number;
  commissionOnlyAmount: number;
  appCommissionTotal: number;
  netPayout: number;
  totalHPPOrder: number;
  netProfit: number;
  isBoncos: boolean;
  saranKenaikanHarga: string;
  recommendedCampaignPrice: number;
  recommendedCampaignSubtotal: number;
}

export interface AIAnalysisResult {
  source: string;
  summary: string;
  hppAnalysis: string;
  pricingStrategy: string;
  promoSafety: string;
  actionItems: string[];
}

export interface ProductRow {
  id: number;
  user_session: string;
  name: string;
  data: Product;
  created_at: string;
  updated_at: string;
}
