import type {
  Product, HPPData, OfflineData, OfflinePromoData, OnlineData, PromoData, MarginStatus, PricingMode
} from './types';
import { MARGIN_STATUS } from './config';

export function formatIDR(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(val)) return 'Rp 0';
  const num = Math.round(val);
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
}

export function formatDecimalIDR(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(val)) return 'Rp 0';
  const formatted = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(val);
  return 'Rp ' + formatted;
}

/* Modul 1: Biaya Produksi & HPP Murni per Porsi (SAK EMKM 3 Pilar) */
export function calculateHPP(prod: Product): HPPData {
  let totalMainMaterials = 0;
  const mainList = (prod.mainMaterials || []).map(item => {
    const price = parseFloat(String(item.totalPrice)) || 0;
    const portions = Math.max(1, parseFloat(String(item.portions)) || 1);
    const hppPerPortion = price / portions;
    totalMainMaterials += hppPerPortion;
    return { ...item, hppPerPortion };
  });

  let totalBopMaterials = 0;
  const bopList = (prod.bopMaterials || []).map(item => {
    const price = parseFloat(String(item.totalPrice)) || 0;
    const capacity = Math.max(0.001, parseFloat(String(item.capacity)) || 1);
    const usage = parseFloat(String(item.usage)) || 0;
    const portions = Math.max(1, parseFloat(String(item.portions)) || 1);
    const recipeCost = (price / capacity) * usage;
    const hppPerPortion = recipeCost / portions;
    totalBopMaterials += hppPerPortion;
    return { ...item, recipeCost, hppPerPortion };
  });

  let totalPackagings = 0;
  const packList = (prod.packagings || []).map(item => {
    const price = parseFloat(String(item.totalPrice)) || 0;
    const itemsPerPack = Math.max(1, parseFloat(String(item.itemsPerPack)) || 1);
    const hppPerPortion = price / itemsPerPack;
    totalPackagings += hppPerPortion;
    return { ...item, hppPerPortion };
  });

  const hppMurni = totalMainMaterials + totalBopMaterials + totalPackagings;
  const mainPct = hppMurni > 0 ? (totalMainMaterials / hppMurni) * 100 : 0;
  const bopPct = hppMurni > 0 ? (totalBopMaterials / hppMurni) * 100 : 0;
  const packPct = hppMurni > 0 ? (totalPackagings / hppMurni) * 100 : 0;

  return { mainList, bopList, packList, totalMainMaterials, totalBopMaterials, totalPackagings, hppMurni, mainPct, bopPct, packPct };
}

/* Modul 2: Harga Jual Toko (Offline) & Fleksibilitas Margin */
export function calculateOfflinePrice(hppMurni: number, prod: Product): OfflineData {
  const pricingMode: PricingMode = prod.pricingMode || 'food_cost';
  const targetFoodCostPercent = Math.min(99, Math.max(1, parseFloat(String(prod.targetFoodCostPercent ?? 35)) || 35));
  const targetMarginPercent = Math.min(99, Math.max(1, parseFloat(String(prod.targetMarginPercent ?? 65)) || 65));
  const marginPercent = parseFloat(String(prod.marginPercent)) || 50;

  let recommendedPriceRaw = 0;
  if (hppMurni > 0) {
    if (pricingMode === 'food_cost') {
      recommendedPriceRaw = hppMurni / (targetFoodCostPercent / 100);
    } else if (pricingMode === 'gross_margin') {
      recommendedPriceRaw = hppMurni / (1 - (targetMarginPercent / 100));
    } else {
      recommendedPriceRaw = hppMurni + (hppMurni * (marginPercent / 100));
    }
  }

  const recommendedPrice = Math.ceil(recommendedPriceRaw / 100) * 100;
  const effectiveOfflinePrice = prod.customOfflinePrice && prod.customOfflinePrice > 0
    ? parseFloat(String(prod.customOfflinePrice))
    : recommendedPrice;

  const netOfflineMargin = effectiveOfflinePrice - hppMurni;
  const marginRatio = effectiveOfflinePrice > 0 ? (netOfflineMargin / effectiveOfflinePrice) * 100 : 0; // Gross Margin % on Sales
  const foodCostRatio = effectiveOfflinePrice > 0 ? (hppMurni / effectiveOfflinePrice) * 100 : 0; // Food Cost % on Sales

  let marginStatus: MarginStatus = MARGIN_STATUS.CRITICAL;
  if (marginRatio >= MARGIN_STATUS.HEALTHY.min) marginStatus = MARGIN_STATUS.HEALTHY;
  else if (marginRatio >= MARGIN_STATUS.MODERATE.min) marginStatus = MARGIN_STATUS.MODERATE;

  return {
    pricingMode,
    targetFoodCostPercent,
    targetMarginPercent,
    marginPercent,
    recommendedPriceRaw,
    recommendedPrice,
    effectiveOfflinePrice,
    netOfflineMargin,
    marginRatio,
    foodCostRatio,
    marginStatus
  };
}

/* Modul 2B: Simulasi Promo Toko (Offline) */
export function calculateOfflinePromo(basePrice: number, hppMurni: number, prod: Product): OfflinePromoData {
  const isOfflinePromoActive = !!prod.offlinePromoEnabled;
  const mode = prod.offlineDiscountMode || 'percent';
  let discountPercent = parseFloat(String(prod.offlineDiscountPercent)) || 0;
  let discountNominal = parseFloat(String(prod.offlineDiscountNominal)) || 0;

  if (isOfflinePromoActive) {
    if (mode === 'percent') {
      discountNominal = basePrice * (discountPercent / 100);
    } else {
      discountPercent = basePrice > 0 ? (discountNominal / basePrice) * 100 : 0;
    }
  } else {
    discountNominal = 0;
    discountPercent = 0;
  }

  const priceAfterDiscount = Math.max(0, basePrice - discountNominal);
  const netMarginAfterDiscount = priceAfterDiscount - hppMurni;
  const marginRatioAfterDiscount = priceAfterDiscount > 0 ? (netMarginAfterDiscount / priceAfterDiscount) * 100 : 0;
  const isLosing = isOfflinePromoActive && (netMarginAfterDiscount < 0);

  return {
    isOfflinePromoActive,
    mode,
    discountPercent,
    discountNominal,
    priceAfterDiscount,
    netMarginAfterDiscount,
    marginRatioAfterDiscount,
    isLosing
  };
}

/* Modul 3: Harga Aplikasi Online (Reverse-Margin) */
export function calculateOnlinePrice(offlinePrice: number, prod: Product): OnlineData {
  const commPercent = parseFloat(String(prod.commissionPercent)) || 0;
  const commFrac = commPercent / 100;
  const fixedFee = parseFloat(String(prod.fixedFee)) || 0;

  let recommendedOnlineRaw = 0;
  if (commFrac < 1) {
    recommendedOnlineRaw = (offlinePrice + fixedFee) / (1 - commFrac);
  }
  const recommendedOnline = Math.ceil(recommendedOnlineRaw / 500) * 500;

  const naiveOnlinePrice = (offlinePrice * (1 + commFrac)) + fixedFee;
  const naiveNetPayout = naiveOnlinePrice - (naiveOnlinePrice * commFrac) - fixedFee;
  const naivePayoutLoss = Math.max(0, offlinePrice - naiveNetPayout);

  const effectiveOnlinePrice = prod.customOnlinePrice && prod.customOnlinePrice > 0
    ? parseFloat(String(prod.customOnlinePrice))
    : recommendedOnline;

  const commissionAmount = effectiveOnlinePrice * commFrac;
  const simulatedPayout = effectiveOnlinePrice - commissionAmount - fixedFee;

  return {
    commPercent,
    commFrac,
    fixedFee,
    recommendedOnlineRaw,
    recommendedOnline,
    naiveOnlinePrice,
    naivePayoutLoss,
    effectiveOnlinePrice,
    commissionAmount,
    simulatedPayout
  };
}

/* Modul 4: Pusat Simulasi Diskon & Proteksi Promo Online */
export function calculatePromoSim(hppMurni: number, onlinePrice: number, offlinePrice: number, prod: Product): PromoData {
  const orderQty = Math.max(1, parseInt(String(prod.simOrderQty), 10) || 1);
  const orderSubtotal = orderQty * onlinePrice;
  const minOrder = parseFloat(String(prod.promoMinOrder)) || 0;
  const promoPercent = parseFloat(String(prod.promoPercent)) || 0;
  const maxDiscountCap = parseFloat(String(prod.promoMaxDiscount)) || 0;
  const isPromoActive = !!prod.promoEnabled;
  const deductionMode = prod.commissionDeductionMode || 'before_discount';

  const isMinOrderMet = isPromoActive && (orderSubtotal >= minOrder);
  const rawDiscount = isPromoActive ? orderSubtotal * (promoPercent / 100) : 0;
  const isDiscountCapped = isMinOrderMet && (rawDiscount > maxDiscountCap) && (maxDiscountCap > 0);
  const effectiveDiscount = isMinOrderMet ? (maxDiscountCap > 0 ? Math.min(rawDiscount, maxDiscountCap) : rawDiscount) : 0;
  const customerPays = Math.max(0, orderSubtotal - effectiveDiscount);

  const commPercent = parseFloat(String(prod.commissionPercent)) || 0;
  const commFrac = commPercent / 100;
  const fixedFee = parseFloat(String(prod.fixedFee)) || 0;

  const commissionBase = deductionMode === 'after_discount' ? customerPays : orderSubtotal;
  const appCommissionTotal = (commissionBase * commFrac) + fixedFee;
  const netPayout = Math.max(0, customerPays - appCommissionTotal);
  const totalHPPOrder = orderQty * hppMurni;
  const netProfit = netPayout - totalHPPOrder;
  const isBoncos = netProfit < 0;

  /* Auto-Markup Campaign Recommended Price Calculation */
  const targetPayout = orderQty * (offlinePrice > 0 ? offlinePrice : hppMurni * 1.5);
  let subtotalReq = 0;

  if (deductionMode === 'after_discount') {
    const custPayReq = (targetPayout + fixedFee) / Math.max(0.01, 1 - commFrac);
    if (maxDiscountCap > 0) {
      subtotalReq = custPayReq + maxDiscountCap;
    } else {
      const discFrac = promoPercent / 100;
      subtotalReq = custPayReq / Math.max(0.01, 1 - discFrac);
    }
  } else {
    // before_discount
    if (maxDiscountCap > 0) {
      subtotalReq = (targetPayout + fixedFee + maxDiscountCap) / Math.max(0.01, 1 - commFrac);
    } else {
      const discFrac = promoPercent / 100;
      const denom = 1 - commFrac - discFrac;
      if (denom > 0) {
        subtotalReq = (targetPayout + fixedFee) / denom;
      } else {
        subtotalReq = targetPayout * 2.5;
      }
    }
  }

  const recommendedCampaignSubtotal = Math.ceil(subtotalReq / 500) * 500;
  const recommendedCampaignPrice = Math.ceil((recommendedCampaignSubtotal / orderQty) / 500) * 500;

  return {
    isPromoActive,
    orderQty,
    orderSubtotal,
    minOrder,
    promoPercent,
    maxDiscountCap,
    isMinOrderMet,
    rawDiscount,
    isDiscountCapped,
    effectiveDiscount,
    customerPays,
    deductionMode,
    commissionBase,
    appCommissionTotal,
    netPayout,
    totalHPPOrder,
    netProfit,
    isBoncos,
    recommendedCampaignPrice,
    recommendedCampaignSubtotal
  };
}
