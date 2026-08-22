import type {
  Product, HPPData, OfflineData, OfflinePromoData, OnlineData, PromoData, MarginStatus
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

/* ─── Modul 1: HPP Murni per Porsi (SAK EMKM 3 Pilar) ─── */
export function calculateHPP(prod: Product): HPPData {
  const validationErrors: string[] = [];

  let totalMainMaterials = 0;
  const mainList = (prod.mainMaterials || []).map(item => {
    const price = parseFloat(String(item.totalPrice)) || 0;
    const portions = parseFloat(String(item.portions)) || 0;
    if (portions <= 0) {
      validationErrors.push(`[Bahan Utama] "${item.name}": Hasil porsi harus > 0.`);
    }
    const safePortion = Math.max(1, portions);
    const hppPerPortion = price / safePortion;
    totalMainMaterials += hppPerPortion;
    return { ...item, hppPerPortion };
  });

  let totalBopMaterials = 0;
  const bopList = (prod.bopMaterials || []).map(item => {
    const mode = item.inputMode || 'detail';
    const portions = parseFloat(String(item.portions)) || 0;
    const safePortion = Math.max(1, portions);

    let recipeCost = 0;
    let hppPerPortion = 0;

    if (mode === 'simple') {
      // Mode simpel: user input langsung biaya resep
      const directCost = parseFloat(String(item.directCost)) || 0;
      recipeCost = directCost;
      hppPerPortion = recipeCost / safePortion;
    } else {
      // Mode detail: hitung dari kapasitas & pemakaian
      const price = parseFloat(String(item.totalPrice)) || 0;
      const capacity = parseFloat(String(item.capacity)) || 0;
      const usage = parseFloat(String(item.usage)) || 0;
      if (capacity <= 0) {
        validationErrors.push(`[BOP] "${item.name}": Kapasitas total beli harus > 0.`);
      }
      const safeCapacity = Math.max(0.001, capacity);
      // Rumus: (Pakai per resep / Kapasitas total beli) × Harga beli
      recipeCost = (usage / safeCapacity) * price;
      hppPerPortion = recipeCost / safePortion;
    }

    if (portions <= 0) {
      validationErrors.push(`[BOP] "${item.name}": Jumlah porsi per resep harus > 0.`);
    }

    totalBopMaterials += hppPerPortion;
    return { ...item, recipeCost, hppPerPortion };
  });

  let totalPackagings = 0;
  const packList = (prod.packagings || []).map(item => {
    const price = parseFloat(String(item.totalPrice)) || 0;
    const itemsPerPack = parseFloat(String(item.itemsPerPack)) || 0;
    if (itemsPerPack <= 0) {
      validationErrors.push(`[Kemasan] "${item.name}": Isi per kemasan harus > 0.`);
    }
    const safeItems = Math.max(1, itemsPerPack);
    const hppPerPortion = price / safeItems;
    totalPackagings += hppPerPortion;
    return { ...item, hppPerPortion };
  });

  const hppMurni = totalMainMaterials + totalBopMaterials + totalPackagings;
  const mainPct = hppMurni > 0 ? (totalMainMaterials / hppMurni) * 100 : 0;
  const bopPct = hppMurni > 0 ? (totalBopMaterials / hppMurni) * 100 : 0;
  const packPct = hppMurni > 0 ? (totalPackagings / hppMurni) * 100 : 0;

  return { mainList, bopList, packList, totalMainMaterials, totalBopMaterials, totalPackagings, hppMurni, mainPct, bopPct, packPct, validationErrors };
}

/* ─── Modul 2: Harga Jual Toko (Gross Margin Method) ─── */
export function calculateOfflinePrice(hppMurni: number, prod: Product): OfflineData {
  // Clamp target margin to [1, 99]%
  const targetMarginPercent = Math.min(99, Math.max(1, parseFloat(String(prod.targetMarginPercent ?? 60)) || 60));

  // Harga Jual = HPP ÷ (1 - Margin%)
  let recommendedPriceRaw = 0;
  if (hppMurni > 0) {
    recommendedPriceRaw = hppMurni / (1 - targetMarginPercent / 100);
  }

  // Bulatkan ke ratusan terdekat yang ≥ raw price
  const recommendedPrice = Math.ceil(recommendedPriceRaw / 100) * 100;

  // Harga efektif: custom jika diisi user, jika tidak pakai rekomendasi
  const effectiveOfflinePrice =
    prod.customOfflinePrice && prod.customOfflinePrice > 0
      ? parseFloat(String(prod.customOfflinePrice))
      : recommendedPrice;

  const netOfflineMargin = effectiveOfflinePrice - hppMurni;
  const marginRatio = effectiveOfflinePrice > 0 ? (netOfflineMargin / effectiveOfflinePrice) * 100 : 0;
  const foodCostRatio = effectiveOfflinePrice > 0 ? (hppMurni / effectiveOfflinePrice) * 100 : 0;

  let marginStatus: MarginStatus = MARGIN_STATUS.CRITICAL;
  if (marginRatio >= MARGIN_STATUS.HEALTHY.min) marginStatus = MARGIN_STATUS.HEALTHY;
  else if (marginRatio >= MARGIN_STATUS.MODERATE.min) marginStatus = MARGIN_STATUS.MODERATE;

  return {
    targetMarginPercent,
    recommendedPriceRaw,
    recommendedPrice,
    effectiveOfflinePrice,
    netOfflineMargin,
    marginRatio,
    foodCostRatio,
    marginStatus,
  };
}

/* ─── Modul 2B: Simulasi Promo Toko (Offline) ─── */
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

  /* Harga Coret: harga yang dipajang di menu SEBELUM dicoret */
  let hargaFinalCoret = basePrice;
  if (isOfflinePromoActive) {
    if (mode === 'percent') {
      const discFrac = discountPercent / 100;
      hargaFinalCoret = discFrac < 1
        ? Math.ceil((basePrice / (1 - discFrac)) / 100) * 100
        : basePrice;
    } else {
      hargaFinalCoret = basePrice + discountNominal;
    }
  }

  return {
    isOfflinePromoActive,
    mode,
    discountPercent,
    discountNominal,
    priceAfterDiscount,
    netMarginAfterDiscount,
    marginRatioAfterDiscount,
    isLosing,
    hargaFinalCoret,
  };
}

/* ─── Modul 3: Harga Aplikasi Online (Auto Reverse-Margin) ─── */
export function calculateOnlinePrice(offlinePrice: number, prod: Product): OnlineData {
  const commPercent = parseFloat(String(prod.commissionPercent)) || 0;
  const commFrac = commPercent / 100;
  const fixedFee = parseFloat(String(prod.fixedFee)) || 0;

  // Formula Reverse-Margin: (Harga Offline + Biaya Tetap) ÷ (1 - Komisi%)
  let recommendedOnlineRaw = 0;
  if (commFrac < 1) {
    recommendedOnlineRaw = (offlinePrice + fixedFee) / (1 - commFrac);
  }
  // Bulatkan ke 500 terdekat yang ≥ raw price
  const recommendedOnline = Math.ceil(recommendedOnlineRaw / 500) * 500;

  // Apakah user mengaktifkan override manual?
  const isManualOverride = !!(prod.onlineManualOverrideEnabled && prod.customOnlinePrice && prod.customOnlinePrice > 0);
  const effectiveOnlinePrice = isManualOverride
    ? parseFloat(String(prod.customOnlinePrice))
    : recommendedOnline;

  const isUnderPricingRisk = isManualOverride && effectiveOnlinePrice < recommendedOnline;

  const commissionAmount = effectiveOnlinePrice * commFrac;
  const simulatedPayout = effectiveOnlinePrice - commissionAmount - fixedFee;

  return {
    commPercent,
    commFrac,
    fixedFee,
    recommendedOnlineRaw,
    recommendedOnline,
    effectiveOnlinePrice,
    commissionAmount,
    simulatedPayout,
    isUnderPricingRisk,
  };
}

/* ─── Modul 4: Simulasi Diskon & Proteksi Promo Online ─── */
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
  const effectiveDiscount = isMinOrderMet
    ? (maxDiscountCap > 0 ? Math.min(rawDiscount, maxDiscountCap) : rawDiscount)
    : 0;
  const customerPays = Math.max(0, orderSubtotal - effectiveDiscount);

  const commPercent = parseFloat(String(prod.commissionPercent)) || 0;
  const commFrac = commPercent / 100;
  const fixedFee = parseFloat(String(prod.fixedFee)) || 0;

  const commissionBase = deductionMode === 'after_discount' ? customerPays : orderSubtotal;
  const commissionOnlyAmount = commissionBase * commFrac;
  const appCommissionTotal = commissionOnlyAmount + fixedFee;
  const netPayout = Math.max(0, customerPays - appCommissionTotal);
  const totalHPPOrder = orderQty * hppMurni;
  const netProfit = netPayout - totalHPPOrder;
  const isBoncos = netProfit < 0;

  /* Auto-Markup Campaign Price: harga minimum agar Net Payout ≥ target */
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

  const saranKenaikanHarga = isBoncos
    ? `🚨 PERINGATAN: Harga online saat ini menyebabkan kerugian! Naikkan ke Harga Kampanye ${formatIDR(recommendedCampaignPrice)}/porsi agar tidak boncos.`
    : 'Harga jual sudah aman dan menguntungkan.';

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
    commissionOnlyAmount,
    appCommissionTotal,
    netPayout,
    totalHPPOrder,
    netProfit,
    isBoncos,
    saranKenaikanHarga,
    recommendedCampaignPrice,
    recommendedCampaignSubtotal,
  };
}
