export type UserRole = 'user' | 'expert' | 'admin';

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number; // in INR
  rating: number; // out of 5
  image: string;
  specs: Record<string, string>;
  description: string;
  highlights: string[];
  pros: string[];
  cons: string[];
  aiScore: number; // Buying intelligence score
  aiRecommendation: string;
  isTrending?: boolean;
  isEditorChoice?: boolean;
  isBestBudget?: boolean;
  isBestPremium?: boolean;
  isPopular?: boolean;
}

export interface ComparisonItem {
  productId: string;
  name: string;
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  price: number;
  aiScore: number;
  rating: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
}

export interface BuyingGuide {
  id: string;
  category: string;
  title: string;
  description: string;
  keyFactors: { title: string; desc: string }[];
  budgetRanges: { range: string; advice: string }[];
  jargonBuster: { term: string; explanation: string }[];
  editorsAdvice: string;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  consultationsCount: number;
  verifiedBadge: string; // e.g. "Verified Tech Journalist", "Senior Hardware Engineer", "Audio Engineer"
  specialties: string[]; // e.g. ["Coding Laptops", "MacBook vs PC", "Thermal Management"]
  bio: string;
  experienceYears: number;
  responseRate: string;
  hourlyRateINR: number;
  chatRateINR: number;
  isOnline: boolean;
  languages: string[];
  featuredGear: string[];
  availableSlots: string[];
}

export interface ExpertChatMessage {
  id: string;
  sender: 'user' | 'expert';
  text: string;
  timestamp: string;
  attachments?: {
    productName?: string;
    productPrice?: number;
    productImage?: string;
    productCategory?: string;
    specSummary?: string;
  }[];
}

export interface ExpertSession {
  id: string;
  expertId: string;
  expertName: string;
  expertAvatar: string;
  expertTitle: string;
  type: 'video' | 'audio' | 'chat' | 'audit';
  status: 'upcoming' | 'completed' | 'cancelled';
  date: string;
  timeSlot: string;
  topic: string;
  notes?: string;
  ratingGiven?: number;
  meetingUrl?: string;
}

export interface RecommendationResult {
  extractedRequirements: {
    budget?: string;
    purpose?: string;
    brandPreference?: string;
    preferredFeatures?: string[];
    usageScenario?: string;
  };
  recommendations: {
    productName: string;
    brand: string;
    priceEstimate: string;
    aiMatchScore: number;
    matchReason: string;
    specsHighlight: Record<string, string>;
    strengths: string[];
    weaknesses: string[];
    buyingAdvice: string;
    alternatives: string[];
  }[];
  overallBuyingVerdict: string;
}

export type PlatformId = 'amazon' | 'flipkart' | 'reliance' | 'croma' | 'vijaysales' | 'brand_store';

export interface BankOffer {
  id: string;
  bank: string;
  bankCode: 'HDFC' | 'ICICI' | 'SBI' | 'AXIS' | 'KOTAK' | 'TATANEU' | 'AMAZONPAY' | 'ONECARD' | 'ALL';
  cardType: 'credit' | 'debit' | 'all';
  discountAmount: number;
  discountPercentage?: number;
  description: string;
  minOrderValue?: number;
  emiAvailable?: boolean;
  noCostEmiMonths?: number;
}

export interface PlatformDeal {
  platformId: PlatformId;
  platformName: string;
  brandColor: string;
  badgeText?: string;
  basePrice: number; // MRP
  salePrice: number; // Live listing price
  discountPercent: number;
  inStock: boolean;
  stockLevel: string; // e.g. "In Stock (Fast Moving)", "Only 2 units left"
  sellerName: string;
  sellerRating: number;
  isVerifiedSeller: boolean;
  deliveryTime: string; // e.g. "Tomorrow by 10 AM (Prime)", "Same-day 2-Hr Store Pickup"
  deliveryFee: number;
  estimatedDeliveryDate: string;
  bankOffers: BankOffer[];
  cashbackAmount: number;
  cashbackText: string;
  exchangeBonus: number;
  returnPolicy: string;
  warranty: string;
  extendedWarrantyPrice?: number;
  storePickupAvailable: boolean;
  nearestStoreDistance?: string;
  productUrl: string;
  verifiedTimestamp: string;
  customerRating: number;
  reviewCount: number;
  priceDropFromAverage?: number;
  isLowestPrice?: boolean;
  isFastestDelivery?: boolean;
  isBestOverallDeal?: boolean;
}

export interface ProductPlatformComparison {
  productId: string;
  productName: string;
  category: string;
  brand: string;
  mrp: number;
  lowestPrice: number;
  highestPrice: number;
  priceSpread: number;
  lowestPricePlatform: PlatformId;
  fastestPlatform: PlatformId;
  bestOverallPlatform: PlatformId;
  platforms: PlatformDeal[];
  aiVerdict: {
    summary: string;
    bestValueChoice: string;
    bestSpeedChoice: string;
    bestProtectionChoice: string;
    bestExchangeChoice: string;
    bestPaymentMethod: string;
    maxPossibleSavings: number;
    priceVolatility: 'High' | 'Moderate' | 'Low';
    priceDropConfidence: 'High' | 'Moderate' | 'Low';
    shouldBuyNow: boolean;
    buyNowReason: string;
  };
  priceHistory30Days: {
    date: string;
    amazon: number;
    flipkart: number;
    croma: number;
    reliance: number;
  }[];
}

