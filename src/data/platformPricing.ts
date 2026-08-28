import { Product, PlatformDeal, ProductPlatformComparison, PlatformId, BankOffer } from '../types';

export const PLATFORM_INFO: Record<PlatformId, {
  name: string;
  shortName: string;
  brandColor: string;
  tagline: string;
  badge: string;
  iconType: string;
}> = {
  amazon: {
    name: 'Amazon India',
    shortName: 'Amazon',
    brandColor: '#FF9900',
    tagline: 'Prime 1-Day & Pay ICICI 5% Cashback',
    badge: 'Prime Verified',
    iconType: 'amazon'
  },
  flipkart: {
    name: 'Flipkart',
    shortName: 'Flipkart',
    brandColor: '#2874F0',
    tagline: 'F-Assured & Open Box Delivery',
    badge: 'F-Assured',
    iconType: 'flipkart'
  },
  reliance: {
    name: 'Reliance Digital',
    shortName: 'Reliance',
    brandColor: '#E42529',
    tagline: 'Instant 2-Hr Store Pickup & ResQ Care',
    badge: 'Store Pickup',
    iconType: 'reliance'
  },
  croma: {
    name: 'Croma (Tata Enterprise)',
    shortName: 'Croma',
    brandColor: '#00B5B8',
    tagline: 'Tata Neu 5% Coins & ZipCare Warranty',
    badge: 'Tata Authorized',
    iconType: 'croma'
  },
  vijaysales: {
    name: 'Vijay Sales',
    shortName: 'Vijay Sales',
    brandColor: '#D8232A',
    tagline: 'V-Points & No Cost Bajaj EMI',
    badge: 'Official Dealer',
    iconType: 'vijaysales'
  },
  brand_store: {
    name: 'Official Brand Store',
    shortName: 'Official Store',
    brandColor: '#111827',
    tagline: 'Direct Manufacturer Warranty & Student Benefits',
    badge: 'Direct OEM',
    iconType: 'brand'
  }
};

/**
 * Deterministic hash generator based on product ID to simulate realistic market price variance
 */
function getSeededRandom(str: string, offset: number = 0): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i) + offset;
    hash |= 0;
  }
  const x = Math.sin(hash++) * 10000;
  return x - Math.floor(x);
}

export function generatePlatformComparison(product: Product): ProductPlatformComparison {
  const basePrice = product.price;
  const mrp = Math.round(basePrice * 1.15 / 100) * 100; // Realistic MRP ~15% higher

  // Seeded variations for realistic cross-platform competition
  const seed1 = getSeededRandom(product.id, 101);
  const seed2 = getSeededRandom(product.id, 202);
  const seed3 = getSeededRandom(product.id, 303);
  const seed4 = getSeededRandom(product.id, 404);
  const seed5 = getSeededRandom(product.id, 505);

  // Variations relative to basePrice
  const amzVar = -0.015 + (seed1 * 0.03); // -1.5% to +1.5%
  const flpVar = -0.02 + (seed2 * 0.035); // -2% to +1.5%
  const relVar = -0.01 + (seed3 * 0.025); // -1% to +1.5%
  const croVar = -0.012 + (seed4 * 0.03); // -1.2% to +1.8%
  const vijVar = 0.00 + (seed5 * 0.02); // 0% to +2%
  const oemVar = 0.01 + (seed1 * 0.02); // OEM usually list price or +1%

  // Bank offer configurations
  const hdfcDiscount = Math.min(6000, Math.max(1500, Math.round(basePrice * 0.075 / 100) * 100));
  const iciciDiscount = Math.min(5000, Math.max(1250, Math.round(basePrice * 0.065 / 100) * 100));
  const sbiDiscount = Math.min(4500, Math.max(1000, Math.round(basePrice * 0.055 / 100) * 100));
  const axisDiscount = Math.min(4000, Math.max(1000, Math.round(basePrice * 0.05 / 100) * 100));

  const amazonPrice = Math.max(999, Math.round((basePrice * (1 + amzVar)) / 10) * 10);
  const flipkartPrice = Math.max(999, Math.round((basePrice * (1 + flpVar)) / 10) * 10);
  const reliancePrice = Math.max(999, Math.round((basePrice * (1 + relVar)) / 10) * 10);
  const cromaPrice = Math.max(999, Math.round((basePrice * (1 + croVar)) / 10) * 10);
  const vijayPrice = Math.max(999, Math.round((basePrice * (1 + vijVar)) / 10) * 10);
  const oemPrice = Math.max(999, Math.round((basePrice * (1 + oemVar)) / 10) * 10);

  const platforms: PlatformDeal[] = [
    {
      platformId: 'amazon',
      platformName: 'Amazon India',
      brandColor: '#FF9900',
      badgeText: 'Prime Verified',
      basePrice: mrp,
      salePrice: amazonPrice,
      discountPercent: Math.round(((mrp - amazonPrice) / mrp) * 100),
      inStock: true,
      stockLevel: seed1 > 0.3 ? 'In Stock' : 'Only 3 left in stock',
      sellerName: 'Appario Retail / Cocoblu (Top Rated)',
      sellerRating: 4.9,
      isVerifiedSeller: true,
      deliveryTime: 'Tomorrow by 11:00 AM',
      deliveryFee: 0,
      estimatedDeliveryDate: 'Next Day Delivery',
      bankOffers: [
        {
          id: 'amz-hdfc',
          bank: 'HDFC Bank Cards',
          bankCode: 'HDFC',
          cardType: 'credit',
          discountAmount: hdfcDiscount,
          description: `Flat ₹${hdfcDiscount.toLocaleString('en-IN')} Instant Discount on HDFC Credit Card EMI & Non-EMI transactions`,
          minOrderValue: 15000,
          emiAvailable: true,
          noCostEmiMonths: 6
        },
        {
          id: 'amz-icici',
          bank: 'Amazon Pay ICICI Card',
          bankCode: 'AMAZONPAY',
          cardType: 'credit',
          discountAmount: Math.round(amazonPrice * 0.05),
          discountPercentage: 5,
          description: `5% Unlimited Cashback (₹${Math.round(amazonPrice * 0.05).toLocaleString('en-IN')}) for Prime Cardholders`,
          emiAvailable: true,
          noCostEmiMonths: 9
        }
      ],
      cashbackAmount: Math.round(amazonPrice * 0.05),
      cashbackText: '5% Cashback on Amazon Pay ICICI Credit Card',
      exchangeBonus: Math.min(25000, Math.round(basePrice * 0.22 / 500) * 500),
      returnPolicy: '7 Days Replacement Policy',
      warranty: '1 Year Manufacturer Warranty',
      extendedWarrantyPrice: Math.round(basePrice * 0.035),
      storePickupAvailable: false,
      productUrl: `https://www.amazon.in/s?k=${encodeURIComponent(product.name)}`,
      verifiedTimestamp: 'Verified 3 mins ago',
      customerRating: Number((product.rating + (seed1 * 0.2 - 0.1)).toFixed(1)),
      reviewCount: Math.round(1240 + seed1 * 4800),
      priceDropFromAverage: Math.max(0, Math.round(mrp - amazonPrice))
    },
    {
      platformId: 'flipkart',
      platformName: 'Flipkart',
      brandColor: '#2874F0',
      badgeText: 'F-Assured',
      basePrice: mrp,
      salePrice: flipkartPrice,
      discountPercent: Math.round(((mrp - flipkartPrice) / mrp) * 100),
      inStock: true,
      stockLevel: seed2 > 0.2 ? 'In Stock (F-Assured)' : 'Hurry, Only 2 left!',
      sellerName: 'SuperComNet (Flipkart Plus Seller)',
      sellerRating: 4.8,
      isVerifiedSeller: true,
      deliveryTime: '2 Days Delivery (Open Box)',
      deliveryFee: 0,
      estimatedDeliveryDate: '2 Days Express',
      bankOffers: [
        {
          id: 'flp-sbi',
          bank: 'SBI Credit Cards',
          bankCode: 'SBI',
          cardType: 'credit',
          discountAmount: sbiDiscount,
          description: `10% Instant Discount up to ₹${sbiDiscount.toLocaleString('en-IN')} on SBI Credit Card transactions`,
          minOrderValue: 12000,
          emiAvailable: true,
          noCostEmiMonths: 6
        },
        {
          id: 'flp-axis',
          bank: 'Flipkart Axis Bank Card',
          bankCode: 'AXIS',
          cardType: 'credit',
          discountAmount: Math.round(flipkartPrice * 0.05),
          discountPercentage: 5,
          description: `5% Unlimited Cashback (₹${Math.round(flipkartPrice * 0.05).toLocaleString('en-IN')}) directly in statement`,
          emiAvailable: true,
          noCostEmiMonths: 12
        }
      ],
      cashbackAmount: Math.round(flipkartPrice * 0.05),
      cashbackText: '5% Unlimited Cashback on Flipkart Axis Bank Card + SuperCoins',
      exchangeBonus: Math.min(26000, Math.round(basePrice * 0.24 / 500) * 500),
      returnPolicy: '7 Days Brand Service Center Replacement + Open Box Delivery',
      warranty: '1 Year Brand Domestic Warranty',
      extendedWarrantyPrice: Math.round(basePrice * 0.038),
      storePickupAvailable: false,
      productUrl: `https://www.flipkart.com/search?q=${encodeURIComponent(product.name)}`,
      verifiedTimestamp: 'Verified 5 mins ago',
      customerRating: Number((product.rating + (seed2 * 0.2 - 0.1)).toFixed(1)),
      reviewCount: Math.round(980 + seed2 * 3900),
      priceDropFromAverage: Math.max(0, Math.round(mrp - flipkartPrice))
    },
    {
      platformId: 'reliance',
      platformName: 'Reliance Digital',
      brandColor: '#E42529',
      badgeText: 'Instant Store Pickup',
      basePrice: mrp,
      salePrice: reliancePrice,
      discountPercent: Math.round(((mrp - reliancePrice) / mrp) * 100),
      inStock: true,
      stockLevel: 'In Stock at 14 Nearby Stores',
      sellerName: 'Reliance Retail Official Digital Store',
      sellerRating: 4.8,
      isVerifiedSeller: true,
      deliveryTime: '2-Hour Express In-Store Pickup or Tomorrow Delivery',
      deliveryFee: 0,
      estimatedDeliveryDate: 'Today (In-Store) / Tomorrow (Home)',
      bankOffers: [
        {
          id: 'rel-icici',
          bank: 'ICICI Bank Credit Cards',
          bankCode: 'ICICI',
          cardType: 'credit',
          discountAmount: iciciDiscount,
          description: `Flat ₹${iciciDiscount.toLocaleString('en-IN')} Instant Discount on ICICI Bank Credit Card Full Swipe & EMI`,
          minOrderValue: 20000,
          emiAvailable: true,
          noCostEmiMonths: 9
        },
        {
          id: 'rel-hdfc',
          bank: 'HDFC Bank EasyEMI',
          bankCode: 'HDFC',
          cardType: 'credit',
          discountAmount: hdfcDiscount - 500,
          description: `Up to ₹${(hdfcDiscount - 500).toLocaleString('en-IN')} Instant Cashback on HDFC Paperless EasyEMI`,
          emiAvailable: true,
          noCostEmiMonths: 12
        }
      ],
      cashbackAmount: Math.round(reliancePrice * 0.03),
      cashbackText: '3% JioMart Points Redeemable across Reliance Fresh & Smart Stores',
      exchangeBonus: Math.min(22000, Math.round(basePrice * 0.20 / 500) * 500),
      returnPolicy: '7 Days Return & Instant In-Store Demonstration',
      warranty: '1 Year Official Brand Warranty + Reliance ResQ Priority Service',
      extendedWarrantyPrice: Math.round(basePrice * 0.04),
      storePickupAvailable: true,
      nearestStoreDistance: '2.4 km away (Ready in 2 hours)',
      productUrl: `https://www.reliancedigital.in/search?q=${encodeURIComponent(product.name)}`,
      verifiedTimestamp: 'Verified 8 mins ago',
      customerRating: Number((product.rating + (seed3 * 0.15 - 0.05)).toFixed(1)),
      reviewCount: Math.round(450 + seed3 * 1600),
      priceDropFromAverage: Math.max(0, Math.round(mrp - reliancePrice))
    },
    {
      platformId: 'croma',
      platformName: 'Croma (Tata Enterprise)',
      brandColor: '#00B5B8',
      badgeText: 'Tata Neu 5% Coins',
      basePrice: mrp,
      salePrice: cromaPrice,
      discountPercent: Math.round(((mrp - cromaPrice) / mrp) * 100),
      inStock: true,
      stockLevel: 'Available for Home Delivery & Store Pickup',
      sellerName: 'Infiniti Retail (A Tata Enterprise)',
      sellerRating: 4.9,
      isVerifiedSeller: true,
      deliveryTime: '24-Hour Express or 3-Hr Store Pickup',
      deliveryFee: 0,
      estimatedDeliveryDate: 'Express 24 Hours',
      bankOffers: [
        {
          id: 'cro-hdfc',
          bank: 'HDFC Bank Cards',
          bankCode: 'HDFC',
          cardType: 'credit',
          discountAmount: hdfcDiscount,
          description: `Flat ₹${hdfcDiscount.toLocaleString('en-IN')} Instant Discount on HDFC Credit Card EMI & Swipe`,
          minOrderValue: 20000,
          emiAvailable: true,
          noCostEmiMonths: 6
        },
        {
          id: 'cro-tata',
          bank: 'Tata Neu Infinity HDFC Card',
          bankCode: 'TATANEU',
          cardType: 'credit',
          discountAmount: Math.round(cromaPrice * 0.05),
          discountPercentage: 5,
          description: `5% NeuCoins on Tata Neu Infinity Card (1 NeuCoin = ₹1)`,
          emiAvailable: true,
          noCostEmiMonths: 12
        }
      ],
      cashbackAmount: Math.round(cromaPrice * 0.05),
      cashbackText: '5% NeuCoins on Tata Neu App (Worth ₹' + Math.round(cromaPrice * 0.05).toLocaleString('en-IN') + ')',
      exchangeBonus: Math.min(23000, Math.round(basePrice * 0.21 / 500) * 500),
      returnPolicy: '7 Days Return / In-Store Brand Warranty Handover',
      warranty: '1 Year Brand Warranty + Optional Croma ZipCare Damage Plan',
      extendedWarrantyPrice: Math.round(basePrice * 0.036),
      storePickupAvailable: true,
      nearestStoreDistance: '3.1 km away (Ready in 3 hours)',
      productUrl: `https://www.croma.com/searchB?q=${encodeURIComponent(product.name)}`,
      verifiedTimestamp: 'Verified 4 mins ago',
      customerRating: Number((product.rating + (seed4 * 0.15 - 0.05)).toFixed(1)),
      reviewCount: Math.round(620 + seed4 * 2100),
      priceDropFromAverage: Math.max(0, Math.round(mrp - cromaPrice))
    },
    {
      platformId: 'vijaysales',
      platformName: 'Vijay Sales',
      brandColor: '#D8232A',
      badgeText: 'V-Points Loyalty',
      basePrice: mrp,
      salePrice: vijayPrice,
      discountPercent: Math.round(((mrp - vijayPrice) / mrp) * 100),
      inStock: true,
      stockLevel: 'In Stock across all Tier 1 & 2 Metro Stores',
      sellerName: 'Vijay Sales Electronics Retailer',
      sellerRating: 4.7,
      isVerifiedSeller: true,
      deliveryTime: '2-3 Business Days Delivery',
      deliveryFee: 0,
      estimatedDeliveryDate: 'Standard 2-3 Days',
      bankOffers: [
        {
          id: 'vij-kotak',
          bank: 'Kotak Mahindra Bank',
          bankCode: 'KOTAK',
          cardType: 'credit',
          discountAmount: Math.min(3500, Math.round(basePrice * 0.05 / 100) * 100),
          description: `Flat 7.5% up to ₹3,500 Instant Discount on Kotak Credit Cards`,
          emiAvailable: true,
          noCostEmiMonths: 6
        },
        {
          id: 'vij-bajaj',
          bank: 'Bajaj Finserv EMI',
          bankCode: 'ALL',
          cardType: 'debit',
          discountAmount: 1000,
          description: `Zero Down Payment & 0% Interest on Bajaj Finserv EMI Card`,
          emiAvailable: true,
          noCostEmiMonths: 12
        }
      ],
      cashbackAmount: Math.round(vijayPrice * 0.02),
      cashbackText: '2% V-Points Loyalty reward points on every transaction',
      exchangeBonus: Math.min(20000, Math.round(basePrice * 0.18 / 500) * 500),
      returnPolicy: '7 Days Replacement by Manufacturer',
      warranty: '1 Year Official Manufacturer Warranty',
      extendedWarrantyPrice: Math.round(basePrice * 0.042),
      storePickupAvailable: true,
      nearestStoreDistance: '4.8 km away',
      productUrl: `https://www.vijaysales.com/search/${encodeURIComponent(product.name)}`,
      verifiedTimestamp: 'Verified 12 mins ago',
      customerRating: Number((product.rating + (seed5 * 0.15 - 0.1)).toFixed(1)),
      reviewCount: Math.round(310 + seed5 * 950),
      priceDropFromAverage: Math.max(0, Math.round(mrp - vijayPrice))
    },
    {
      platformId: 'brand_store',
      platformName: `Official ${product.brand} Store`,
      brandColor: '#111827',
      badgeText: 'Direct Manufacturer',
      basePrice: mrp,
      salePrice: oemPrice,
      discountPercent: Math.round(((mrp - oemPrice) / mrp) * 100),
      inStock: true,
      stockLevel: 'Factory Fresh Stock Direct from OEM',
      sellerName: `Official ${product.brand} India Online`,
      sellerRating: 4.95,
      isVerifiedSeller: true,
      deliveryTime: '2-4 Days Insured Courier Dispatch',
      deliveryFee: 0,
      estimatedDeliveryDate: 'Direct Factory Dispatch',
      bankOffers: [
        {
          id: 'oem-hdfc',
          bank: 'HDFC & ICICI Bank',
          bankCode: 'HDFC',
          cardType: 'credit',
          discountAmount: hdfcDiscount,
          description: `Official Instant Cashback up to ₹${hdfcDiscount.toLocaleString('en-IN')} on HDFC & ICICI Cards`,
          emiAvailable: true,
          noCostEmiMonths: 12
        },
        {
          id: 'oem-student',
          bank: 'Education / Corporate Store',
          bankCode: 'ALL',
          cardType: 'all',
          discountAmount: Math.round(oemPrice * 0.08),
          discountPercentage: 8,
          description: `Special Student & Corporate discount up to 8% + Free Custom Engraving`,
          emiAvailable: true,
          noCostEmiMonths: 6
        }
      ],
      cashbackAmount: Math.round(oemPrice * 0.03),
      cashbackText: 'Official OEM Loyalty Reward Coins + Free Personalised Laser Engraving',
      exchangeBonus: Math.min(30000, Math.round(basePrice * 0.28 / 500) * 500),
      returnPolicy: '14 Days Official Brand Return Window',
      warranty: '1 Year Complete International OEM Warranty + Priority Care',
      extendedWarrantyPrice: Math.round(basePrice * 0.05),
      storePickupAvailable: true,
      nearestStoreDistance: 'Official Flagship Store (Select Metros)',
      productUrl: `https://www.google.com/search?q=${encodeURIComponent(product.brand + ' India official store ' + product.name)}`,
      verifiedTimestamp: 'Verified 1 min ago',
      customerRating: 4.9,
      reviewCount: Math.round(1500 + seed1 * 2000),
      priceDropFromAverage: Math.max(0, Math.round(mrp - oemPrice))
    }
  ];

  // Calculate lowest price platform
  let lowestPrice = Infinity;
  let lowestPricePlatform: PlatformId = 'amazon';
  let highestPrice = 0;

  platforms.forEach(p => {
    if (p.salePrice < lowestPrice) {
      lowestPrice = p.salePrice;
      lowestPricePlatform = p.platformId;
    }
    if (p.salePrice > highestPrice) {
      highestPrice = p.salePrice;
    }
  });

  // Calculate best effective price after bank offers
  let lowestEffectivePrice = Infinity;
  let bestOverallPlatform: PlatformId = 'amazon';

  platforms.forEach(p => {
    const maxBankDiscount = Math.max(0, ...p.bankOffers.map(b => b.discountAmount));
    const effectivePrice = p.salePrice - maxBankDiscount - (p.cashbackAmount * 0.5); // effective perceived price
    
    if (effectivePrice < lowestEffectivePrice) {
      lowestEffectivePrice = effectivePrice;
      bestOverallPlatform = p.platformId;
    }
  });

  // Assign tags
  platforms.forEach(p => {
    if (p.platformId === lowestPricePlatform) {
      p.isLowestPrice = true;
    }
    if (p.platformId === 'amazon') {
      p.isFastestDelivery = true;
    }
    if (p.platformId === bestOverallPlatform) {
      p.isBestOverallDeal = true;
    }
  });

  const priceSpread = highestPrice - lowestPrice;
  const maxSavings = mrp - lowestPrice + hdfcDiscount;

  // 30 days price history curve across 4 major platforms
  const priceHistory30Days = [];
  const today = new Date(2026, 7, 19);

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

    // Slight realistic variations in past 30 days
    const wave = Math.sin((i + 3) * 0.3) * 0.02;
    const wave2 = Math.cos((i + 5) * 0.25) * 0.025;

    priceHistory30Days.push({
      date: dateStr,
      amazon: i === 0 ? amazonPrice : Math.round(amazonPrice * (1 + wave)),
      flipkart: i === 0 ? flipkartPrice : Math.round(flipkartPrice * (1 + wave2)),
      croma: i === 0 ? cromaPrice : Math.round(cromaPrice * (1 + wave * 0.7)),
      reliance: i === 0 ? reliancePrice : Math.round(reliancePrice * (1 + wave2 * 0.8))
    });
  }

  // Smart AI Verdict
  const bestPlatName = PLATFORM_INFO[bestOverallPlatform].name;
  const lowestPlatName = PLATFORM_INFO[lowestPricePlatform].name;

  return {
    productId: product.id,
    productName: product.name,
    category: product.category,
    brand: product.brand,
    mrp,
    lowestPrice,
    highestPrice,
    priceSpread,
    lowestPricePlatform,
    fastestPlatform: 'amazon',
    bestOverallPlatform,
    platforms,
    aiVerdict: {
      summary: `Currently, **${bestPlatName}** offers the highest value package for ${product.name}, reaching an effective price of **₹${Math.round(lowestEffectivePrice).toLocaleString('en-IN')}** after card offers. **${lowestPlatName}** leads on raw listing price at **₹${lowestPrice.toLocaleString('en-IN')}**.`,
      bestValueChoice: `${bestPlatName} (Lowest effective cost with card discounts + cashback)`,
      bestSpeedChoice: `Amazon India (Guaranteed Prime Next-Day 11 AM Delivery)`,
      bestProtectionChoice: `Croma / Reliance Digital (Instant in-store pickup & direct authorized brand exchange)`,
      bestExchangeChoice: `Official ${product.brand} Store (Highest trade-in multiplier up to ₹${Math.min(30000, Math.round(basePrice * 0.28 / 500) * 500).toLocaleString('en-IN')})`,
      bestPaymentMethod: `HDFC or Amazon Pay / Tata Neu Credit Card for maximum instant deduction of ₹${hdfcDiscount.toLocaleString('en-IN')}`,
      maxPossibleSavings: maxSavings,
      priceVolatility: priceSpread > basePrice * 0.03 ? 'Moderate' : 'Low',
      priceDropConfidence: priceSpread > basePrice * 0.05 ? 'High' : 'Moderate',
      shouldBuyNow: true,
      buyNowReason: `Current price is within 2.1% of the 30-day all-time low. Excellent time to purchase before current festive bank quotas expire.`
    },
    priceHistory30Days
  };
}

export function calculateCustomCheckoutPrice(
  deal: PlatformDeal,
  selectedBankCode: string,
  includeExchange: boolean,
  exchangeValueINR: number = 0,
  includeExtendedWarranty: boolean = false
): {
  listingPrice: number;
  bankDiscount: number;
  cashbackValue: number;
  exchangeDiscount: number;
  extendedWarrantyCost: number;
  deliveryFee: number;
  finalPayableAmount: number;
  netEffectiveCost: number;
  appliedBankOfferName: string;
} {
  const listingPrice = deal.salePrice;
  
  // Find applicable bank offer
  let bankDiscount = 0;
  let appliedBankOfferName = 'No card offer applied';

  if (selectedBankCode && selectedBankCode !== 'NONE') {
    const offer = deal.bankOffers.find(b => b.bankCode === selectedBankCode || b.bankCode === 'ALL');
    if (offer) {
      bankDiscount = offer.discountAmount;
      appliedBankOfferName = offer.description;
    } else {
      // General fallback if card doesn't match
      appliedBankOfferName = 'Selected card has no special cashback on this store';
    }
  }

  const exchangeDiscount = includeExchange ? Math.min(listingPrice * 0.5, exchangeValueINR + (deal.exchangeBonus || 0)) : 0;
  const extendedWarrantyCost = includeExtendedWarranty && deal.extendedWarrantyPrice ? deal.extendedWarrantyPrice : 0;
  const deliveryFee = deal.deliveryFee || 0;

  const finalPayableAmount = Math.max(0, listingPrice - bankDiscount - exchangeDiscount + extendedWarrantyCost + deliveryFee);
  const cashbackValue = selectedBankCode === 'AMAZONPAY' || selectedBankCode === 'TATANEU' || selectedBankCode === 'AXIS' ? deal.cashbackAmount : Math.round(deal.cashbackAmount * 0.3);
  const netEffectiveCost = Math.max(0, finalPayableAmount - cashbackValue);

  return {
    listingPrice,
    bankDiscount,
    cashbackValue,
    exchangeDiscount,
    extendedWarrantyCost,
    deliveryFee,
    finalPayableAmount,
    netEffectiveCost,
    appliedBankOfferName
  };
}
