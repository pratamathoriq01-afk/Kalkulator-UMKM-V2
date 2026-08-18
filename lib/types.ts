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
  totalPrice: number;
  capacity: number;
  capUnit: string;
  usage: number;
  usageUnit: string;
  portions: number;
  recipeCost?: number;
  hppPerPortion?: number;
}

export interface Packaging {
  id: number;
  name: string;
  totalPrice: number;
  itemsPerPack: number;
  unit: string;
  hppPerPortion?: number;
}

export type PricingMode = 'food_cost' | 'gross_margin' | 'markup';

export interface Product {
  id: number;
  dbId?: number;
  name: string;
  mainMaterials: MainMaterial[];
  bopMaterials: BopMaterial[];
  packagings: Packaging[];
  pricingMode?: PricingMode;
  targetFoodCostPercent?: number;
  targetMarginPercent?: number;
  marginPercent: number; // legacy markup % or fallback
  customOfflinePrice: number | null;
  offlinePromoEnabled?: boolean;
  offlineDiscountMode?: 'percent' | 'nominal';
  offlineDiscountPercent?: number;
  offlineDiscountNominal?: number;
  commissionPercent: number;
  fixedFee: number;
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
  validationErrors: string[]; // Pesan validasi input (misal: kapasitas = 0)
}

export interface MarginStatus {
  min: number;
  label: string;
  badgeClass: string;
  icon: string;
}

export interface OfflineData {
  pricingMode: PricingMode;
  targetFoodCostPercent: number;
  targetMarginPercent: number;
  marginPercent: number;
  recommendedPriceRaw: number;
  recommendedPrice: number;
  effectiveOfflinePrice: number;
  netOfflineMargin: number;
  marginRatio: number; // Gross Margin % on sales
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
  hargaFinalCoret: number; // Harga coret yang harus dipasang di menu (reverse dari diskon)
}

export interface OnlineData {
  commPercent: number;
  commFrac: number;
  fixedFee: number;
  recommendedOnlineRaw: number;
  recommendedOnline: number;
  naiveOnlinePrice: number;
  naivePayoutLoss: number;
  effectiveOnlinePrice: number;
  commissionAmount: number;
  simulatedPayout: number;
  isUnderPricingRisk: boolean; // True jika user override < rekomendasi reverse-margin
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
  commissionOnlyAmount: number; // Komisi platform saja (tanpa fixedFee) — untuk display baris terpisah di struk
  appCommissionTotal: number;
  netPayout: number;
  totalHPPOrder: number;
  netProfit: number;
  isBoncos: boolean;
  saranKenaikanHarga: string; // Pesan saran nominal kenaikan harga minimum saat isBoncos
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
