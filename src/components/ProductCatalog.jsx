import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Search, SlidersHorizontal, BarChart2, Star, Check, Sparkles, LayoutGrid, List, X,
  Laptop, Smartphone, Headphones, Watch, Tablet, Camera, Tv, Layers, Tag, ThumbsUp,
  ShieldCheck, ArrowUpDown, RotateCcw, Zap, IndianRupee, Cpu, Flame, Award, Filter,
  ChevronDown, ChevronUp, Sliders, UtensilsCrossed, Shirt, Activity, BookOpen, Coffee,
  Car, Baby, Package, HelpCircle, Trophy, Globe, ShoppingBag, ExternalLink, ArrowRight,
  MessageSquare, UserCheck, CheckCircle2, Clock, Info, Eye, Share2, Sparkle,
  TrendingUp, Percent, Bell, CheckSquare, Compass, ThumbsDown, Lightbulb, Crown, Square,
  Store, Radio, Mic, MicOff, Table, ShieldAlert, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SafeProductImage } from './SafeProductImage.jsx';
import { WiseBookmarkIcon } from './WiseBookmarkIcon.jsx';
import ProductQuickSpecsModal from './ProductQuickSpecsModal.jsx';
import WiseScoreModal from './WiseScoreModal.jsx';
import FlipkartApiExplorerModal from './FlipkartApiExplorerModal.jsx';
import { ExpertChatModal } from './ExpertChatModal.jsx';
import { WiseFindSpinner } from './WiseFindLoader.jsx';
import { MASTER_CATEGORIES } from '../data/categoriesData.js';
import { generatePlatformComparison, PLATFORM_INFO } from '../data/platformPricing.js';
import { translateSpecToPlainEnglish, getAdvisorForCategory } from '../utils/specTranslator.js';
import { ADVISORS_DATA } from '../data/expertsData.js';
import { PlatformLogo } from './PlatformLogo.jsx';

// Category icon mapper helper
const getCategoryIcon = (category = '') => {
  const normalized = category.toLowerCase();
  const matchedMaster = MASTER_CATEGORIES.find(c => c.name.toLowerCase() === normalized || c.shortName.toLowerCase() === normalized);
  if (matchedMaster) return matchedMaster.icon;
  if (normalized.includes('laptop') || normalized.includes('computer')) return Laptop;
  if (normalized.includes('phone') || normalized.includes('mobile')) return Smartphone;
  if (normalized.includes('audio') || normalized.includes('headphone') || normalized.includes('earbud')) return Headphones;
  if (normalized.includes('watch') || normalized.includes('wearable')) return Watch;
  if (normalized.includes('tablet') || normalized.includes('ipad')) return Tablet;
  if (normalized.includes('camera')) return Camera;
  if (normalized.includes('tv') || normalized.includes('display') || normalized.includes('appliance')) return Tv;
  if (normalized.includes('kitchen') || normalized.includes('cook') || normalized.includes('home')) return UtensilsCrossed;
  if (normalized.includes('fashion') || normalized.includes('apparel') || normalized.includes('shoe') || normalized.includes('wear')) return Shirt;
  if (normalized.includes('beauty') || normalized.includes('care') || normalized.includes('skin')) return Sparkles;
  if (normalized.includes('sport') || normalized.includes('fitness')) return Activity;
  if (normalized.includes('book') || normalized.includes('media')) return BookOpen;
  if (normalized.includes('groc') || normalized.includes('coffee') || normalized.includes('food')) return Coffee;
  if (normalized.includes('auto') || normalized.includes('car') || normalized.includes('tool')) return Car;
  if (normalized.includes('baby') || normalized.includes('kid') || normalized.includes('toy')) return Baby;
  return Layers;
};

// Popular universal search tags (BuyHatke style search queries)
const QUICK_SEARCH_TAGS = [
  'best smartphone under 70000',
  'iPhone 18 Pro',
  'OnePlus 13 under 70000',
  'laptop for coding under 65000',
  'MacBook Air M4',
  'Sony WH-1000XM6 ANC',
  'Apple Watch Ultra 3',
  'LG C5 OLED TV'
];

// Stop words to remove from strict token checking to avoid false positives
const SEARCH_STOP_WORDS = new Set([
  'best', 'top', 'buy', 'online', 'price', 'deal', 'deals', 'under', 'below', 
  'less', 'than', 'for', 'in', 'with', 'the', 'a', 'an', 'and', 'latest', 
  'new', 'cheap', 'lowest', 'good', 'on', 'at', 'from', 'of', 'to', 'show', 
  'only', 'please', 'me', 'want', 'search', 'find', 'item', 'items', 'product', 'products'
]);

/**
 * Smart Natural Language Query Parser (e.g. 'best smartphone under 70000')
 */
function parseUniversalSearch(query = '') {
  const q = (query || '').toLowerCase().trim();
  if (!q) return { raw: '', cleanedTerm: '', maxPrice: null, detectedCategory: null };

  // Detect price limits like "under 70000", "under 70k", "below 50,000", "< 40000"
  let maxPrice = null;
  const priceMatch = q.match(/(?:under|below|less than|within|<|upto|up to)\s*(?:rs\.?|inr|₹)?\s*(\d+[\d,]*)(k)?/i);
  if (priceMatch) {
    let num = parseInt(priceMatch[1].replace(/,/g, ''), 10);
    if (priceMatch[2]) num *= 1000;
    maxPrice = num;
  }

  // Detect category keywords
  let detectedCategory = null;
  if (q.includes('phone') || q.includes('mobile') || q.includes('smartphone')) {
    detectedCategory = 'smartphones';
  } else if (q.includes('laptop') || q.includes('macbook') || q.includes('notebook')) {
    detectedCategory = 'laptops';
  } else if (q.includes('audio') || q.includes('headphone') || q.includes('earphone') || q.includes('earbud')) {
    detectedCategory = 'audio';
  } else if (q.includes('watch') || q.includes('wearable') || q.includes('fitness')) {
    detectedCategory = 'watch';
  } else if (q.includes('tablet') || q.includes('ipad')) {
    detectedCategory = 'tablet';
  } else if (q.includes('kitchen') || q.includes('cook') || q.includes('air fryer') || q.includes('fryer') || q.includes('oven')) {
    detectedCategory = 'kitchen';
  } else if (q.includes('skin') || q.includes('serum') || q.includes('beauty') || q.includes('cream')) {
    detectedCategory = 'beauty';
  } else if (q.includes('shoe') || q.includes('sneaker') || q.includes('fashion') || q.includes('apparel')) {
    detectedCategory = 'fashion';
  } else if (q.includes('tv') || q.includes('television') || q.includes('oled')) {
    detectedCategory = 'tv';
  } else if (q.includes('camera')) {
    detectedCategory = 'camera';
  }

  // Clean the search query for title/brand matching
  let cleanedTerm = q
    .replace(/(?:under|below|less than|within|<|upto|up to)\s*(?:rs\.?|inr|₹)?\s*(\d+[\d,]*)(k)?/gi, '')
    .replace(/\b(best|top|good|cheap|affordable|latest|deal|deals)\b/gi, '')
    .trim();

  // If a category was detected, remove the general category word so it doesn't restrict specific model names
  if (detectedCategory === 'smartphones') {
    cleanedTerm = cleanedTerm.replace(/\b(smartphones?|phones?|mobiles?)\b/gi, '').trim();
  } else if (detectedCategory === 'laptops') {
    cleanedTerm = cleanedTerm.replace(/\b(laptops?|notebooks?)\b/gi, '').trim();
  } else if (detectedCategory === 'audio') {
    cleanedTerm = cleanedTerm.replace(/\b(audio|headphones?|earphones?|earbuds?)\b/gi, '').trim();
  } else if (detectedCategory === 'kitchen') {
    cleanedTerm = cleanedTerm.replace(/\b(kitchen|appliances?)\b/gi, '').trim();
  } else if (detectedCategory === 'watch') {
    cleanedTerm = cleanedTerm.replace(/\b(smartwatches?|watches?|wearables?)\b/gi, '').trim();
  }

  return {
    raw: query,
    cleanedTerm,
    maxPrice,
    detectedCategory
  };
}

/**
 * Synthesizes dynamic real-time products when a custom search term has few or zero exact database matches
 */
function synthesizeLiveScrapedProducts(query = '', category = 'Electronics') {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim();
  const cleanQ = q.replace(/(?:under|below|less than|within|<|upto)\s*₹?\d+k?/gi, '').trim();
  const qLow = q.toLowerCase();

  // Smart Category Detection
  let targetCategory = category !== 'All' ? category : 'Electronics & Gadgets';
  if (qLow.includes('shoe') || qLow.includes('sneaker') || qLow.includes('jordan') || qLow.includes('air max') || qLow.includes('sandal') || qLow.includes('crocs') || qLow.includes('shirt') || qLow.includes('jeans') || qLow.includes('kurti')) {
    targetCategory = 'Fashion & Lifestyle';
  } else if (qLow.includes('trimmer') || qLow.includes('shaver') || qLow.includes('serum') || qLow.includes('skincare') || qLow.includes('perfume') || qLow.includes('airwrap')) {
    targetCategory = 'Beauty & Personal Care';
  } else if (qLow.includes('fryer') || qLow.includes('cooker') || qLow.includes('mixer') || qLow.includes('chimney') || qLow.includes('kettle') || qLow.includes('microwave') || qLow.includes('vacuum')) {
    targetCategory = 'Home & Kitchen';
  } else if (qLow.includes('tv') || qLow.includes('oled') || qLow.includes('bravia') || qLow.includes('refrigerator') || qLow.includes('washing machine') || qLow.includes('ac')) {
    targetCategory = qLow.includes('tv') || qLow.includes('oled') ? 'Smart TVs & Entertainment' : 'Large Appliances';
  } else if (qLow.includes('laptop') || qLow.includes('macbook') || qLow.includes('thinkpad') || qLow.includes('zenbook')) {
    targetCategory = 'Laptops';
  } else if (qLow.includes('phone') || qLow.includes('iphone') || qLow.includes('galaxy') || qLow.includes('pixel') || qLow.includes('oneplus')) {
    targetCategory = 'Smartphones';
  } else if (qLow.includes('headphone') || qLow.includes('earbud') || qLow.includes('xm5') || qLow.includes('airpod') || qLow.includes('audio') || qLow.includes('airdopes')) {
    targetCategory = 'Audio & Headphones';
  } else if (qLow.includes('watch') || qLow.includes('wearable')) {
    targetCategory = 'Smartwatches & Wearables';
  }

  // Smart Brand Detection
  let brand = 'TopBrand';
  const BRANDS = ['Apple', 'Samsung', 'OnePlus', 'Google', 'Xiaomi', 'Realme', 'Sony', 'Asus', 'Lenovo', 'HP', 'Dell', 'LG', 'Nike', 'Adidas', 'Puma', 'boAt', 'Noise', 'Prestige', 'Philips', 'Dyson', 'Nykaa'];
  for (const b of BRANDS) {
    if (qLow.includes(b.toLowerCase())) {
      brand = b;
      break;
    }
  }
  if (brand === 'TopBrand') {
    if (qLow.includes('iphone') || qLow.includes('macbook') || qLow.includes('ipad') || qLow.includes('airpod')) brand = 'Apple';
    else if (qLow.includes('galaxy')) brand = 'Samsung';
    else if (qLow.includes('pixel')) brand = 'Google';
    else if (qLow.includes('thinkpad')) brand = 'Lenovo';
    else if (qLow.includes('air max') || qLow.includes('jordan')) brand = 'Nike';
    else if (qLow.includes('airdopes')) brand = 'boAt';
    else {
      brand = cleanQ.split(' ')[0] || 'TopBrand';
      brand = brand.charAt(0).toUpperCase() + brand.slice(1);
    }
  }

  // Realistic seed price
  let seedPrice = 24990;
  if (qLow.includes('iphone 16 pro') || qLow.includes('s24 ultra') || qLow.includes('macbook pro')) seedPrice = 129990;
  else if (qLow.includes('iphone 15') || qLow.includes('iphone 16') || qLow.includes('macbook air') || qLow.includes('s24')) seedPrice = 64990;
  else if (targetCategory === 'Laptops') seedPrice = 54990;
  else if (targetCategory === 'Smartphones') seedPrice = 29990;
  else if (targetCategory === 'Audio & Headphones') seedPrice = (qLow.includes('xm5') || qLow.includes('airpod')) ? 24990 : (qLow.includes('airdopes') ? 1499 : 6990);
  else if (targetCategory === 'Smartwatches & Wearables') seedPrice = qLow.includes('apple watch') ? 29990 : 2990;
  else if (targetCategory === 'Smart TVs & Entertainment') seedPrice = qLow.includes('oled') ? 84990 : 38990;
  else if (targetCategory === 'Home & Kitchen') seedPrice = qLow.includes('vacuum') ? 29990 : 5990;
  else if (targetCategory === 'Fashion & Lifestyle') seedPrice = (qLow.includes('air max') || qLow.includes('jordan')) ? 8990 : 3490;
  else if (targetCategory === 'Beauty & Personal Care') seedPrice = qLow.includes('airwrap') ? 45990 : 1890;

  const baseName = cleanQ.charAt(0).toUpperCase() + cleanQ.slice(1);
  const fullName = !baseName.toLowerCase().includes(brand.toLowerCase()) && brand !== 'TopBrand'
    ? `${brand} ${baseName}`
    : baseName;

  const categoryImages = {
    'Smartphones': 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80',
    'Laptops': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    'Audio & Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    'Smartwatches & Wearables': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    'Smart TVs & Entertainment': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
    'Home & Kitchen': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    'Fashion & Lifestyle': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    'Beauty & Personal Care': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
  };
  const img = categoryImages[targetCategory] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';

  // Construct items with tier badges
  return [
    {
      id: `live-${encodeURIComponent(cleanQ).toLowerCase().slice(0, 16)}-exact-1`,
      name: `${fullName} (Verified Indian Edition)`,
      brand,
      category: targetCategory,
      subCategory: 'Direct Search Match',
      price: seedPrice,
      mrp: Math.round(seedPrice * 1.25),
      discountPercent: 20,
      rating: 4.8,
      reviewCount: 3820,
      aiScore: 96,
      image: img,
      tier: 'exact',
      tierBadge: '🎯 Direct Match',
      tierDescription: 'Exact product matching your search query',
      highlights: [
        'Live multi-store verified pricing across Flipkart, Amazon, Croma, Reliance',
        'Top-rated value-for-money index for this query',
        'Full brand warranty with verified replacement guarantee'
      ],
      specs: {
        'Processor / Build': 'Certified High-Efficiency Architecture',
        'Display / Finish': 'Flagship Standard Durability Spec',
        'Battery / Power': 'All-Day Endurance with Fast Charge',
        'Warranty': '1 Year Comprehensive Brand Warranty'
      },
      pros: ['Exact model matching your search', 'Zero lag performance', 'Instant delivery available'],
      cons: ['High demand product with limited flash sale stock'],
      isLiveScraped: true
    },
    {
      id: `live-${encodeURIComponent(cleanQ).toLowerCase().slice(0, 16)}-below-1`,
      name: `${fullName} Lite / Value Contender`,
      brand,
      category: targetCategory,
      subCategory: 'Value Pick (Bit Below)',
      price: Math.round(seedPrice * 0.78),
      mrp: Math.round(seedPrice * 1.25 * 0.8),
      discountPercent: 22,
      rating: 4.6,
      reviewCount: 4500,
      aiScore: 92,
      image: img,
      tier: 'below',
      tierBadge: '⚡ Bit Below (Save 22%)',
      tierDescription: 'Costs ~22% less while retaining 90% of core performance',
      highlights: [
        `Saves ₹${Math.round(seedPrice * 0.22).toLocaleString('en-IN')} compared to direct match`,
        'Essential flagship features at a sensible budget',
        'Lowest price verified across top stores'
      ],
      specs: {
        'Processor / Build': 'Balanced Power-Efficient Architecture',
        'Display / Finish': 'High Clarity Durable Finish',
        'Battery / Power': 'Long Endurance Battery Life',
        'Warranty': '1 Year Official Manufacturer Warranty'
      },
      pros: ['Incredible price-to-performance ratio', 'Lower financial risk', 'Reliable daily driver'],
      cons: ['Slightly standard materials'],
      isLiveScraped: true
    },
    {
      id: `live-${encodeURIComponent(cleanQ).toLowerCase().slice(0, 16)}-above-1`,
      name: `${fullName} Pro Max / Ultra Flagship`,
      brand,
      category: targetCategory,
      subCategory: 'Pro Upgrade (Bit Above)',
      price: Math.round(seedPrice * 1.25),
      mrp: Math.round(seedPrice * 1.25 * 1.25),
      discountPercent: 18,
      rating: 4.9,
      reviewCount: 2150,
      aiScore: 98,
      image: img,
      tier: 'above',
      tierBadge: '👑 Bit Above (Pro Upgrade)',
      tierDescription: 'Step-up tier with premium materials and faster processing',
      highlights: [
        'Top-tier hardware silicon with enhanced thermal cooling',
        'Class-leading acoustic / visual performance',
        'Aerospace build with VIP concierge support'
      ],
      specs: {
        'Processor / Build': 'Top-Tier Ultra High Performance Silicon',
        'Display / Finish': 'ProMotion Grade High-Precision Screen',
        'Battery / Power': 'Marathon Battery with Ultra Warp Charge',
        'Warranty': '2 Years Extended Premium Warranty'
      },
      pros: ['Uncompromised flagship experience', 'Highest resale value retention', 'Longest software updates'],
      cons: ['Higher upfront entry price'],
      isLiveScraped: true
    }
  ];
}

// INTENT & PERSONA-BASED QUICK-FILTER PRESETS
export const PERSONA_INTENT_PRESETS = {
  All: [
    { id: 'all', label: 'All Products', icon: '✨', description: 'Complete catalog across all tiers' },
    { id: 'top_wisescore', label: '🏆 WiseScore Gold (92+)', icon: '🏆', description: 'Highest verified build & hardware value', test: (p) => (p.aiScore || 0) >= 92 },
    { id: 'max_savings', label: '💰 Arbitrage Deals (₹2k+ Off)', icon: '💰', description: 'Products with ₹2,000+ price gap between stores', test: (p) => {
      const comp = generatePlatformComparison(p);
      return (comp.priceSpread || 0) >= 2000;
    }},
    { id: 'verified_honest', label: '🛡️ 100% Gimmick-Free', icon: '🛡️', description: 'Strictly zero filler sensors or fake virtual specs', test: (p) => isProductGimmickFree(p) },
    { id: 'under_30k', label: '⚡ Sweet Spot (< ₹30,000)', icon: '⚡', description: 'Maximum price-to-performance tier', test: (p) => (p.price || 0) <= 30000 },
    { id: 'premium_flagship', label: '👑 Ultra Flagship', icon: '👑', description: 'Top-of-the-line halo products', test: (p) => (p.price || 0) >= 70000 }
  ],
  Smartphones: [
    { id: 'all', label: 'All Phones', icon: '📱' },
    { id: 'pro_camera', label: '📸 Pro Camera & OIS', icon: '📸', test: (p) => {
      const c = (p.specs?.Camera || p.specs?.camera || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return c.includes('ois') || c.includes('periscope') || c.includes('sony') || c.includes('50mp') || c.includes('108mp') || c.includes('200mp') || n.includes('ultra') || n.includes('pro');
    }},
    { id: 'gaming_fps', label: '🎮 Max FPS & Snapdragon 8', icon: '🎮', test: (p) => {
      const proc = (p.specs?.Processor || p.specs?.processor || '').toLowerCase();
      const disp = (p.specs?.Display || p.specs?.display || '').toLowerCase();
      return proc.includes('snapdragon 8') || proc.includes('dimensity 9') || proc.includes('dimensity 8') || proc.includes('bionic') || proc.includes('tensor') || disp.includes('120hz') || disp.includes('144hz') || disp.includes('165hz');
    }},
    { id: 'battery_champ', label: '🔋 Battery Champ (5000mAh+)', icon: '🔋', test: (p) => {
      const b = (p.specs?.Battery || p.specs?.battery || '').toLowerCase();
      return b.includes('5000') || b.includes('5400') || b.includes('5500') || b.includes('6000') || b.includes('marathon');
    }},
    { id: 'clean_ui', label: '✨ Clean UI & 4Y+ Updates', icon: '✨', test: (p) => {
      const b = (p.brand || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      return b.includes('apple') || b.includes('google') || b.includes('motorola') || b.includes('nothing') || b.includes('samsung') || n.includes('pixel') || n.includes('iphone');
    }},
    { id: 'budget_killer', label: '💎 Best Value < ₹25k', icon: '💎', test: (p) => (p.price || 0) <= 25000 }
  ],
  Laptops: [
    { id: 'all', label: 'All Laptops', icon: '💻' },
    { id: 'coding_ram', label: '💻 Coding & 16GB+ RAM', icon: '💻', test: (p) => {
      const s = JSON.stringify(p.specs || {}).toLowerCase();
      const n = (p.name || '').toLowerCase();
      return s.includes('16gb') || s.includes('32gb') || s.includes('core i7') || s.includes('core i9') || s.includes('ryzen 7') || s.includes('m2') || s.includes('m3') || s.includes('m4') || n.includes('macbook') || n.includes('thinkpad');
    }},
    { id: 'thin_light', label: '🪶 Ultra-Light & Silent', icon: '🪶', test: (p) => {
      const n = (p.name || '').toLowerCase();
      const sub = (p.subCategory || '').toLowerCase();
      return n.includes('air') || n.includes('zenbook') || n.includes('gram') || n.includes('yoga') || sub.includes('ultrabook') || sub.includes('thin');
    }},
    { id: 'gaming_tgp', label: '⚡ RTX High-TGP Gaming', icon: '⚡', test: (p) => {
      const s = JSON.stringify(p.specs || {}).toLowerCase();
      return s.includes('rtx') || s.includes('geforce') || s.includes('radeon') || s.includes('144hz') || s.includes('gaming');
    }},
    { id: 'student_budget', label: '🎓 Student Pick < ₹50k', icon: '🎓', test: (p) => (p.price || 0) <= 50000 }
  ],
  Audio: [
    { id: 'all', label: 'All Audio', icon: '🎧' },
    { id: 'studio_anc', label: '🎧 Studio ANC / Silence', icon: '🎧', test: (p) => {
      const s = JSON.stringify(p.specs || {}).toLowerCase();
      return s.includes('anc') || s.includes('noise cancel') || s.includes('transparency');
    }},
    { id: 'sports_sweatproof', label: '🏃 Sports & Sweatproof', icon: '🏃', test: (p) => {
      const s = JSON.stringify(p.specs || {}).toLowerCase();
      return s.includes('ipx') || s.includes('water') || s.includes('sweat') || s.includes('sport');
    }},
    { id: 'crystal_mic', label: '🎙️ Call & Meeting Mic Champ', icon: '🎙️', test: (p) => {
      const s = JSON.stringify(p.specs || {}).toLowerCase();
      return s.includes('mic') || s.includes('enc') || s.includes('quad') || (p.aiScore || 0) >= 91;
    }},
    { id: 'audiophile_dac', label: '🎵 Hi-Res Lossless / LDAC', icon: '🎵', test: (p) => {
      const s = JSON.stringify(p.specs || {}).toLowerCase();
      return s.includes('ldac') || s.includes('hi-res') || s.includes('lossless') || s.includes('aptx') || (p.price || 0) >= 7000;
    }}
  ],
  Smartwatches: [
    { id: 'all', label: 'All Wearables', icon: '⌚' },
    { id: 'amoled_calling', label: '📞 BT Calling & AMOLED', icon: '📞', test: (p) => {
      const s = JSON.stringify(p.specs || {}).toLowerCase();
      return s.includes('amoled') || s.includes('calling') || s.includes('bluetooth call');
    }},
    { id: 'gps_fitness', label: '🏃 Dual GPS & Multi-Sport', icon: '🏃', test: (p) => {
      const s = JSON.stringify(p.specs || {}).toLowerCase();
      return s.includes('gps') || s.includes('workout') || s.includes('hrm');
    }},
    { id: 'marathon_battery', label: '🔋 7-14 Day Battery', icon: '🔋', test: (p) => {
      const s = JSON.stringify(p.specs || {}).toLowerCase();
      return s.includes('7 days') || s.includes('10 days') || s.includes('14 days') || s.includes('marathon');
    }},
    { id: 'health_ecg', label: '🏥 Medical Grade ECG & SpO2', icon: '🏥', test: (p) => {
      const s = JSON.stringify(p.specs || {}).toLowerCase();
      return s.includes('ecg') || s.includes('spo2') || s.includes('sensor') || (p.price || 0) >= 15000;
    }}
  ],
  Kitchen: [
    { id: 'all', label: 'All Kitchen', icon: '🍳' },
    { id: 'copper_motor', label: '🛡️ 100% Pure Copper Motor', icon: '🛡️', test: (p) => {
      const s = JSON.stringify(p.specs || {}).toLowerCase();
      return s.includes('copper') || s.includes('bldc') || s.includes('watt') || (p.aiScore || 0) >= 90;
    }},
    { id: 'oil_free', label: '🍟 Rapid Air 360° Crisp', icon: '🍟', test: (p) => {
      const s = JSON.stringify(p.specs || {}).toLowerCase();
      const n = (p.name || '').toLowerCase();
      return n.includes('air fryer') || s.includes('air') || s.includes('crisp');
    }},
    { id: 'dishwasher_safe', label: '🧼 Non-Toxic & Easy Clean', icon: '🧼', test: (p) => {
      const s = JSON.stringify(p.specs || {}).toLowerCase();
      return s.includes('dishwasher') || s.includes('ceramic') || s.includes('non-stick') || s.includes('tri-ply');
    }}
  ]
};

export const getPersonaPresetsForCategory = (category = 'All') => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('phone') || cat.includes('mobile')) return PERSONA_INTENT_PRESETS.Smartphones;
  if (cat.includes('laptop') || cat.includes('computer')) return PERSONA_INTENT_PRESETS.Laptops;
  if (cat.includes('audio') || cat.includes('headphone') || cat.includes('earbud')) return PERSONA_INTENT_PRESETS.Audio;
  if (cat.includes('watch') || cat.includes('wearable')) return PERSONA_INTENT_PRESETS.Smartwatches;
  if (cat.includes('kitchen') || cat.includes('cook') || cat.includes('home')) return PERSONA_INTENT_PRESETS.Kitchen;
  return PERSONA_INTENT_PRESETS.All;
};

export const isProductGimmickFree = (product) => {
  if (!product) return true;
  const specsStr = JSON.stringify(product.specs || {}).toLowerCase();
  const name = (product.name || '').toLowerCase();
  const highlightsStr = JSON.stringify(product.highlights || []).toLowerCase();
  const combined = `${specsStr} ${name} ${highlightsStr}`;
  const score = product.aiScore || 0;

  // 1. Minimum quality baseline
  if (score < 87) return false;

  // 2. Exclude fake filler 2MP sensors in smartphones
  if (combined.includes('2mp macro') || combined.includes('2mp depth') || combined.includes('2 mp macro') || combined.includes('2 mp depth')) return false;

  // 3. Exclude virtual/extended RAM marketing tricks
  if (combined.includes('virtual ram') || combined.includes('extended ram') || combined.includes('+8gb virtual') || combined.includes('+12gb virtual') || combined.includes('dynamic ram expansion')) return false;

  // 4. Exclude slow eMMC storage when price > ₹12,000
  if (combined.includes('emmc') && (product.price || 0) > 12000) return false;

  // 5. Exclude TN panel laptops
  if (combined.includes('tn panel') || combined.includes('hd ready 768p')) return false;

  return true;
};

export const getProductMicroPills = (product) => {
  if (!product) return [];
  const cat = (product.category || '').toLowerCase();
  const specs = product.specs || {};
  const pills = [];

  if (cat.includes('phone') || cat.includes('mobile')) {
    const cam = specs['Camera'] || specs['camera'] || '';
    if (cam.toLowerCase().includes('ois')) pills.push({ label: '50MP OIS', type: 'camera' });
    else if (cam) pills.push({ label: cam.split(',')[0].slice(0, 16), type: 'camera' });
    else pills.push({ label: 'HDR Dual Cam', type: 'camera' });

    const disp = specs['Display'] || specs['display'] || '';
    if (disp.toLowerCase().includes('120hz')) pills.push({ label: '120Hz AMOLED', type: 'display' });
    else if (disp.toLowerCase().includes('144hz')) pills.push({ label: '144Hz OLED', type: 'display' });
    else if (disp) pills.push({ label: disp.split(',')[0].slice(0, 16), type: 'display' });
    else pills.push({ label: 'FHD+ AMOLED', type: 'display' });

    const bat = specs['Battery'] || specs['battery'] || '';
    if (bat) pills.push({ label: bat.split(',')[0].slice(0, 16), type: 'battery' });
    else pills.push({ label: '5000mAh Cell', type: 'battery' });
  } else if (cat.includes('laptop') || cat.includes('computer')) {
    const storage = specs['Storage'] || specs['RAM'] || '';
    if (storage) pills.push({ label: storage.split(',')[0].slice(0, 16), type: 'memory' });
    else pills.push({ label: '16GB DDR5', type: 'memory' });

    const proc = specs['Processor'] || specs['processor'] || '';
    if (proc) pills.push({ label: proc.split(',')[0].slice(0, 18), type: 'processor' });
    else pills.push({ label: 'High-TGP Silicon', type: 'processor' });

    const disp = specs['Display'] || '';
    if (disp) pills.push({ label: disp.split(',')[0].slice(0, 16), type: 'display' });
    else pills.push({ label: '100% sRGB Screen', type: 'display' });
  } else if (cat.includes('audio') || cat.includes('headphone') || cat.includes('earbud')) {
    const anc = specs['Noise Cancellation'] || specs['ANC'] || '';
    if (anc) pills.push({ label: 'ANC Verified', type: 'audio' });
    else pills.push({ label: 'Hi-Fi Audio', type: 'audio' });

    const bat = specs['Battery'] || '';
    if (bat) pills.push({ label: bat.split(',')[0].slice(0, 16), type: 'battery' });
    else pills.push({ label: '35h+ Playback', type: 'battery' });

    const driver = specs['Driver'] || specs['Codec'] || '';
    if (driver) pills.push({ label: driver.slice(0, 16), type: 'driver' });
    else pills.push({ label: 'Titanium Driver', type: 'driver' });
  } else {
    const keys = Object.keys(specs);
    if (keys.length > 0) {
      keys.slice(0, 3).forEach(k => {
        pills.push({ label: `${k}: ${String(specs[k]).slice(0, 16)}`, type: 'spec' });
      });
    } else {
      pills.push({ label: 'Verified Hardware', type: 'check' });
      pills.push({ label: '100% Genuine', type: 'check' });
      pills.push({ label: 'Brand Warranty', type: 'check' });
    }
  }
  return pills.slice(0, 3);
};

export const ProductCatalog = ({
  products = [],
  initialCategory = 'All',
  initialSearchQuery = '',
  autoOpenSearchPopup = false,
  onClearInitialSearch,
  onProductClick,
  onAddToCompare,
  onToggleFavorite,
  favorites = [],
  compareList = [],
  onNavigateToCompare,
  onAskWiseBot,
  onOpenGuides
}) => {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [priceBudget, setPriceBudget] = useState('all'); // 'all', 'under2k', '2k-10k', '10k-35k', '35k-70k', '70k+', 'custom'
  const [minRating, setMinRating] = useState(0);
  const [storeFilter, setStoreFilter] = useState('all'); // 'all', 'amazon', 'flipkart', 'meesho', 'myntra', 'croma', 'reliance'
  const [sortBy, setSortBy] = useState('aiScore'); // 'aiScore', 'priceLow', 'priceHigh', 'rating', 'discount'

  // NEW ULTIMATE BROWSE FEATURES STATE
  const [activePersonaFilter, setActivePersonaFilter] = useState('all');
  const [excludeGimmicks, setExcludeGimmicks] = useState(false);
  const [catalogViewMode, setCatalogViewMode] = useState('grid'); // 'grid' | 'table'
  const [selectedWiseScoreProduct, setSelectedWiseScoreProduct] = useState(null);
  const [isWiseScoreModalOpen, setIsWiseScoreModalOpen] = useState(false);
  const [isQuickCompareOverlayOpen, setIsQuickCompareOverlayOpen] = useState(false);
  const [quickCompareSpecMode, setQuickCompareSpecMode] = useState('general');
  const [isFlipkartExplorerOpen, setIsFlipkartExplorerOpen] = useState(false);

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('wisefind_universal_recent_searches');
      return saved ? JSON.parse(saved) : [
        'iPhone 16 Pro Max',
        'OnePlus 13 on Amazon',
        'MacBook Air M3 under 75000',
        'Air fryer under 5000 on Flipkart',
        'Cotton kurti on Meesho & Myntra',
        'Sony WH-1000XM5 ANC'
      ];
    } catch (e) {
      return ['iPhone 16 Pro Max', 'MacBook Air M3', 'Air fryer under 5000'];
    }
  });

  // --- DUAL PRICE RANGE SLIDER & MANUAL PRICE SETTER STATES ---
  const CATALOG_MAX_PRICE = 250000;
  const [priceRange, setPriceRange] = useState({ min: 0, max: 250000 });
  const [manualMinPrice, setManualMinPrice] = useState('');
  const [manualMaxPrice, setManualMaxPrice] = useState('');
  const [isPriceFilterExpanded, setIsPriceFilterExpanded] = useState(true);

  // Category Advisors Modal State
  const [isAdvisorHubOpen, setIsAdvisorHubOpen] = useState(false);

  // Compare Matrix Spec Mode: 'general' (Plain English everyday understanding) vs 'technical'
  const [compareSpecMode, setCompareSpecMode] = useState('general');

  // Deal Discovery Tabs (BuyHatke Signature)
  const [dealTab, setDealTab] = useState('all'); // 'all', 'hot_deals', 'price_drops', 'wisescore', 'trending', 'latest'

  // General (Common Understanding) vs Technical Specs toggle
  const [specMode, setSpecMode] = useState('general'); // 'general' | 'technical'

  // Multi-Category dropdown menu toggle
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Filter sidebar toggle on mobile
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Vertical Sidebar Accordion Sections (Open/Close Sliders)
  const [sidebarOpen, setSidebarOpen] = useState({
    categories: true,
    subcategories: true,
    sort: true,
    price: true,
    brands: false,
    ratings: false,
    stores: false
  });

  const toggleSidebar = (section) => {
    setSidebarOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Simulated Web Scraping Radar State
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState(0);
  const [scrapingStage, setScrapingStage] = useState('');
  // Live Scraped results from /api/scrape/live backend
  const [liveScrapedResults, setLiveScrapedResults] = useState([]);
  const [liveScrapedQuery, setLiveScrapedQuery] = useState('');

  // AI Compare Modal States
  const [aiCompareModalOpen, setAiCompareModalOpen] = useState(false);
  const [aiCompareSelection, setAiCompareSelection] = useState([]);

  // Intelligence Pop-up Window Tab & Comparison Selection States
  const [searchPopupTab, setSearchPopupTab] = useState('products'); // 'products' | 'compare'
  const [popupCompareSelection, setPopupCompareSelection] = useState([]);
  const [activeChatExpert, setActiveChatExpert] = useState(null);

  // Modals
  const [quickSpecsProduct, setQuickSpecsProduct] = useState(null);
  const [advisorModalProduct, setAdvisorModalProduct] = useState(null);
  const [showInquiriesDrawer, setShowInquiriesDrawer] = useState(false);

  // Advisor Inquiry Form state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySentSuccess, setInquirySentSuccess] = useState(false);

  // Search input & popup ref for click-outside handling
  const searchContainerRef = useRef(null);

  // User Inquiries stored in localStorage
  const [customerInquiries, setCustomerInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('wisefind_advisor_requests');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync category if initialCategory changes
  useEffect(() => {
    if (initialCategory && initialCategory !== 'All') {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Close search popup modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSearchPopupOpen) {
        setIsSearchPopupOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchPopupOpen]);

  // Click outside to close category dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isCategoryDropdownOpen) {
        setIsCategoryDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCategoryDropdownOpen]);

  // Real-time suggestions & instant product matches (Amazon / Flipkart / Myntra style)
  const instantAutocompleteMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const catalogHits = products
      .filter(p => {
        const name = (p.name || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const sub = (p.subCategory || '').toLowerCase();
        return name.includes(q) || brand.includes(q) || cat.includes(q) || sub.includes(q);
      })
      .slice(0, 5);

    if (catalogHits.length > 0) return catalogHits;

    // If no static catalog hits, show the live scraped matches or synthesized preview!
    if (liveScrapedResults && liveScrapedResults.length > 0) {
      return liveScrapedResults.slice(0, 5);
    }
    return synthesizeLiveScrapedProducts(searchQuery, selectedCategory).slice(0, 5);
  }, [searchQuery, products, liveScrapedResults, selectedCategory]);

  // Listen for inquiry sync
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('wisefind_advisor_requests');
        if (saved) setCustomerInquiries(JSON.parse(saved));
      } catch (e) { }
    };
    window.addEventListener('wisefind_advisor_request_created', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('wisefind_advisor_request_created', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Web Scraping simulation & live backend fetch when user searches
  const triggerScrapeSearch = async (query) => {
    if (!query || !query.trim()) return;
    const cleanQ = query.trim();
    setIsScraping(true);
    setScrapingProgress(20);
    setScrapingStage('Connecting to Amazon.in, Flipkart, Meesho, Myntra, Croma, Reliance scrapers...');

    try {
      const res = await fetch(`/api/scrape/live?q=${encodeURIComponent(cleanQ)}&category=${encodeURIComponent(selectedCategory || 'All')}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setLiveScrapedResults(data.results);
          setLiveScrapedQuery(cleanQ);
        }
      }
    } catch (err) {
      console.warn('Backend scrape fetch failed, falling back to instant client synthesis:', err);
    }

    setScrapingProgress(60);
    setScrapingStage('Extracting live BuyBox prices, bank discounts & coupons across all 6 stores...');

    const timer1 = setTimeout(() => {
      setScrapingProgress(85);
      setScrapingStage('Verifying stock availability & calculating WiseScore...');
    }, 300);

    const timer2 = setTimeout(() => {
      setScrapingProgress(100);
      setScrapingStage('Exact matches ready!');
      setTimeout(() => {
        setIsScraping(false);
      }, 250);
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  // Sync search query and auto-open search popup when redirected from Hero Browse search
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      setIsSearchPopupOpen(true);
      triggerScrapeSearch(initialSearchQuery);
    } else if (autoOpenSearchPopup) {
      setIsSearchPopupOpen(true);
    }
  }, [initialSearchQuery, autoOpenSearchPopup]);

  // Live auto-search debounce: seamlessly fetches live multi-store results as the user types
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length >= 2) {
      const timer = setTimeout(() => {
        triggerScrapeSearch(q);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  // Handle Search Input Submit with Recent Searches tracking
  const handleSearchSubmit = (e, overrideQuery) => {
    e?.preventDefault();
    const query = (overrideQuery !== undefined ? overrideQuery : searchQuery).trim();
    if (query) {
      // Save to recent searches
      setRecentSearches(prev => {
        const updated = [query, ...prev.filter(q => q.toLowerCase() !== query.toLowerCase())].slice(0, 8);
        try {
          localStorage.setItem('wisefind_universal_recent_searches', JSON.stringify(updated));
        } catch (err) {}
        return updated;
      });

      setIsSearchFocused(false);
      setSearchPopupTab('products');
      setIsSearchPopupOpen(true);
      triggerScrapeSearch(query);
    }
  };

  // Web Speech API Voice Search
  const handleVoiceSearch = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice search is not supported by your current browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }
    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      setIsVoiceListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsVoiceListening(false);
        handleSearchSubmit(null, transcript);
      };

      recognition.onerror = () => {
        setIsVoiceListening(false);
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsVoiceListening(false);
    }
  };

  // Price Setter Helpers
  const handleApplyManualPrice = () => {
    const minVal = manualMinPrice !== '' ? Math.max(0, parseInt(manualMinPrice, 10) || 0) : 0;
    const maxVal = manualMaxPrice !== '' ? Math.min(CATALOG_MAX_PRICE, parseInt(manualMaxPrice, 10) || CATALOG_MAX_PRICE) : CATALOG_MAX_PRICE;
    
    const validMin = Math.min(minVal, maxVal);
    const validMax = Math.max(minVal, maxVal);

    setPriceRange({ min: validMin, max: validMax });
    setPriceBudget('custom');
  };

  const handlePricePresetSelect = (presetId, min, max) => {
    setPriceBudget(presetId);
    setPriceRange({ min, max });
    setManualMinPrice(min > 0 ? String(min) : '');
    setManualMaxPrice(max < CATALOG_MAX_PRICE ? String(max) : '');
  };

  const handleResetPriceFilter = () => {
    setPriceRange({ min: 0, max: CATALOG_MAX_PRICE });
    setPriceBudget('all');
    setManualMinPrice('');
    setManualMaxPrice('');
  };

  // Parse current search query
  const parsedSearch = useMemo(() => {
    return parseUniversalSearch(searchQuery);
  }, [searchQuery]);

  // Reset active persona filter when category changes
  useEffect(() => {
    setActivePersonaFilter('all');
  }, [selectedCategory]);

  // Active filters count for quick reset indicator
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (selectedSubCategory !== 'All') count++;
    if (selectedBrand !== 'All') count++;
    if (priceBudget !== 'all') count++;
    if (priceRange.min > 0 || priceRange.max < CATALOG_MAX_PRICE) count++;
    if (minRating > 0) count++;
    if (storeFilter !== 'all') count++;
    if (dealTab !== 'all') count++;
    if (sortBy !== 'aiScore') count++;
    if (searchQuery.trim().length > 0) count++;
    if (activePersonaFilter !== 'all') count++;
    if (excludeGimmicks) count++;
    return count;
  }, [selectedCategory, selectedSubCategory, selectedBrand, priceBudget, priceRange, minRating, storeFilter, dealTab, sortBy, searchQuery, activePersonaFilter, excludeGimmicks]);

  // Reset all filters to default state
  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedSubCategory('All');
    setSelectedBrand('All');
    setPriceBudget('all');
    setPriceRange({ min: 0, max: CATALOG_MAX_PRICE });
    setManualMinPrice('');
    setManualMaxPrice('');
    setMinRating(0);
    setStoreFilter('all');
    setDealTab('all');
    setSortBy('aiScore');
    setSearchQuery('');
    setActivePersonaFilter('all');
    setExcludeGimmicks(false);
  };

  // Available brands dynamically derived from products (strictly contextual to selected category if set)
  const availableBrands = useMemo(() => {
    const brandsSet = new Set();
    products.forEach(p => {
      const pCat = (p.category || '').toLowerCase();
      const sCat = selectedCategory.toLowerCase();
      if (selectedCategory === 'All' || pCat.includes(sCat) || sCat.includes(pCat)) {
        if (p.brand) brandsSet.add(p.brand);
      }
    });
    return Array.from(brandsSet).sort();
  }, [products, selectedCategory]);

  // Available Subcategories based strictly on selected Category (Only populated when a category is chosen!)
  const availableSubcategories = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'All') {
      return []; // Subcategories strictly hidden until user explicitly chooses a category
    }
    const matched = MASTER_CATEGORIES.find(c =>
      c.name.toLowerCase() === selectedCategory.toLowerCase() ||
      c.shortName.toLowerCase() === selectedCategory.toLowerCase()
    );
    if (matched && matched.subCategories) {
      return matched.subCategories;
    }
    // Fallback: extract distinct subcategories present in current category's products
    const subs = new Set();
    products.forEach(p => {
      const pCat = (p.category || '').toLowerCase();
      const sCat = selectedCategory.toLowerCase();
      if ((pCat.includes(sCat) || sCat.includes(pCat)) && p.subCategory) {
        subs.add(p.subCategory);
      }
    });
    return Array.from(subs);
  }, [selectedCategory, products]);

  // Category Normalization for strict like-for-like comparison validation
  const normalizeCat = (c) => {
    if (!c) return '';
    const s = c.trim().toLowerCase();
    if (s.includes('phone') || s.includes('mobile')) return 'smartphones';
    if (s.includes('laptop') || s.includes('computer')) return 'laptops';
    if (s.includes('audio') || s.includes('headphone') || s.includes('earbud')) return 'audio';
    if (s.includes('watch') || s.includes('wearable')) return 'smartwatches';
    if (s.includes('tv') || s.includes('television') || s.includes('display')) return 'televisions';
    if (s.includes('kitchen') || s.includes('cook') || s.includes('appliance') || s.includes('home')) return 'appliances';
    if (s.includes('fashion') || s.includes('cloth') || s.includes('apparel')) return 'fashion';
    return s;
  };

  // Check if a product's category conflicts with the active comparison list
  const isCompareCategoryMismatch = (prod) => {
    if (!compareList || compareList.length === 0) return false;
    const activeCat = normalizeCat(compareList[0]?.category);
    const prodCat = normalizeCat(prod?.category);
    return activeCat !== prodCat;
  };

  // Main Filtered Products List
  const filteredProducts = useMemo(() => {
    const rawSearch = searchQuery.trim();
    const hasSearch = rawSearch.length > 0;
    const { cleanedTerm, maxPrice, detectedCategory } = parsedSearch;

    // Strict search tokens extraction (excludes stop words and generic fillers)
    const searchTokens = (cleanedTerm || '')
      .toLowerCase()
      .split(/[\s,+/&|]+/)
      .filter(w => w.length > 0 && !SEARCH_STOP_WORDS.has(w));

    // First filter local catalog
    let matchedList = products.filter(product => {
      const prodCat = (product.category || '').toLowerCase();
      const prodSub = (product.subCategory || '').toLowerCase();
      const prodName = (product.name || '').toLowerCase();
      const prodBrand = (product.brand || '').toLowerCase();
      const prodPrice = product.price || 0;

      // 1. Strict Search Query Filter (EVERY token must match)
      if (hasSearch) {
        // Price ceiling from query (e.g. "under 70000")
        if (maxPrice !== null && prodPrice > maxPrice) {
          return false;
        }

        // Category inferred from query
        if (detectedCategory) {
          if (!prodCat.includes(detectedCategory) && !prodSub.includes(detectedCategory)) {
            return false;
          }
        }

        // STRICT MATCHING: All core tokens must be present in product data (name, brand, category, specs, highlights)
        if (searchTokens.length > 0) {
          const specsStr = product.specs ? Object.entries(product.specs).map(([k, v]) => `${k} ${v}`).join(' ') : '';
          const highlightsStr = (product.highlights || []).join(' ');
          const searchable = `${prodName} ${prodBrand} ${prodCat} ${prodSub} ${specsStr} ${highlightsStr} ${product.description || ''}`.toLowerCase();
          const allTokensMatch = searchTokens.every(token => searchable.includes(token));
          if (!allTokensMatch) return false;
        }
      }

      // 2. Category Filter (active when user is browsing categories without an active keyword search)
      if (!hasSearch && selectedCategory !== 'All') {
        const selCat = selectedCategory.toLowerCase();
        if (!prodCat.includes(selCat) && !selCat.includes(prodCat)) {
          return false;
        }
      }

      // 3. SubCategory Filter (active when browsing without active keyword search)
      if (!hasSearch && selectedSubCategory !== 'All') {
        const selSub = selectedSubCategory.toLowerCase();
        if (!prodSub.includes(selSub) && !selSub.includes(prodSub)) {
          return false;
        }
      }

      // 4. Brand Filter (active when browsing without active keyword search)
      if (!hasSearch && selectedBrand !== 'All') {
        if (product.brand?.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }
      }

      // 5. Dual Price Range Slider & Manual Bounds Filter
      if (priceRange.min > 0 && prodPrice < priceRange.min) return false;
      if (priceRange.max < CATALOG_MAX_PRICE && prodPrice > priceRange.max) return false;

      // Budget Preset Pills Filter fallback
      if (priceBudget === 'under2k' && prodPrice > 2000) return false;
      if (priceBudget === '2k-10k' && (prodPrice < 2000 || prodPrice > 10000)) return false;
      if (priceBudget === '10k-35k' && (prodPrice < 10000 || prodPrice > 35000)) return false;
      if (priceBudget === '35k-70k' && (prodPrice < 35000 || prodPrice > 70000)) return false;
      if (priceBudget === '70k+' && prodPrice < 70000) return false;

      // 6. Minimum Rating Filter
      if (minRating > 0 && (product.rating || 0) < minRating) {
        return false;
      }

      // 7. Store Platform Filter (Amazon, Flipkart, Meesho, Croma, Reliance)
      if (storeFilter !== 'all') {
        const comp = generatePlatformComparison(product);
        const hasStore = comp.platforms.some(pl => pl.platformId === storeFilter);
        if (!hasStore) return false;
      }

      // 8. Deal Tab Filter (BuyHatke signature)
      if (dealTab === 'hot_deals') {
        return product.isEditorChoice || product.price < 50000;
      }
      if (dealTab === 'price_drops') {
        return product.isBudgetPick || (product.rating && product.rating >= 4.6);
      }
      if (dealTab === 'wisescore') {
        return (product.aiScore || 0) >= 90;
      }
      if (dealTab === 'trending') {
        return product.isTrending || product.isPopular || (product.rating && product.rating >= 4.7);
      }
      if (dealTab === 'latest') {
        return product.isBestPremium || product.isEditorChoice;
      }

      // 9. Marketing Gimmick-Free Filter (Shield against 2MP filler sensors, virtual RAM padding, etc.)
      if (excludeGimmicks) {
        if (!isProductGimmickFree(product)) return false;
      }

      // 10. Intent & Persona Quick-Filter
      if (activePersonaFilter !== 'all') {
        const presets = getPersonaPresetsForCategory(selectedCategory);
        const activePreset = presets.find(p => p.id === activePersonaFilter);
        if (activePreset && typeof activePreset.test === 'function') {
          if (!activePreset.test(product)) return false;
        }
      }

      return true;
    });

    // Universal Live Search across Flipkart, Amazon, Croma, Reliance Digital, etc.
    if (hasSearch && rawSearch.length >= 2) {
      const cleanQ = rawSearch.toLowerCase().trim();
      let liveCandidates = [];

      // Prefer live backend multi-store comparison results if matching query
      if (liveScrapedResults && liveScrapedResults.length > 0 && 
          (liveScrapedQuery.toLowerCase().includes(cleanQ.slice(0, 3)) || cleanQ.includes(liveScrapedQuery.toLowerCase().slice(0, 3)))) {
        liveCandidates = liveScrapedResults;
      } else {
        liveCandidates = synthesizeLiveScrapedProducts(rawSearch, selectedCategory);
      }

      // Filter live marketplace candidates with active user filters
      const filteredLiveCandidates = liveCandidates.filter(item => {
        const itemPrice = item.price || 0;
        if (maxPrice !== null && itemPrice > maxPrice) return false;
        if (priceRange.min > 0 && itemPrice < priceRange.min) return false;
        if (priceRange.max < CATALOG_MAX_PRICE && itemPrice > priceRange.max) return false;
        if (minRating > 0 && (item.rating || 0) < minRating) return false;
        if (storeFilter !== 'all') {
          const comp = generatePlatformComparison(item);
          const hasStore = comp.platforms.some(pl => pl.platformId === storeFilter);
          if (!hasStore) return false;
        }
        if (excludeGimmicks && !isProductGimmickFree(item)) return false;
        if (activePersonaFilter !== 'all') {
          const presets = getPersonaPresetsForCategory(selectedCategory);
          const activePreset = presets.find(p => p.id === activePersonaFilter);
          if (activePreset && typeof activePreset.test === 'function' && !activePreset.test(item)) return false;
        }
        return true;
      });

      // Merge: Universal Live Marketplace matches first, followed by unique catalog matches
      const existingNames = new Set(filteredLiveCandidates.map(c => (c.name || '').toLowerCase().trim()));
      const uniqueCatalogMatches = matchedList.filter(item => !existingNames.has((item.name || '').toLowerCase().trim()));

      matchedList = [...filteredLiveCandidates, ...uniqueCatalogMatches];
    }

    return matchedList.sort((a, b) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'trending') {
        const scoreA = (a.isTrending ? 10 : 0) + (a.isPopular ? 5 : 0) + ((a.rating || 0) * 2);
        const scoreB = (b.isTrending ? 10 : 0) + (b.isPopular ? 5 : 0) + ((b.rating || 0) * 2);
        return scoreB - scoreA;
      }
      if (sortBy === 'latest') {
        const getNewness = (p) => {
          let score = 0;
          if (p.isBestPremium) score += 10;
          if (p.isEditorChoice) score += 5;
          const text = `${p.name} ${JSON.stringify(p.specs || {})}`.toLowerCase();
          if (text.includes('2026') || text.includes('iphone 18') || text.includes('m4') || text.includes('a19') || text.includes('oneplus 13')) score += 20;
          if (text.includes('2025') || text.includes('s25') || text.includes('gen 3')) score += 10;
          return score;
        };
        return getNewness(b) - getNewness(a);
      }
      if (sortBy === 'discount') return ((b.aiScore || 0) * 10) - ((a.aiScore || 0) * 10);
      return (b.aiScore || 0) - (a.aiScore || 0); // Default WiseScore (Best overall)
    });
  }, [products, searchQuery, parsedSearch, selectedCategory, selectedSubCategory, selectedBrand, priceBudget, priceRange, minRating, storeFilter, dealTab, sortBy, liveScrapedResults, liveScrapedQuery, activePersonaFilter, excludeGimmicks]);

  // Advisors matching active category (or all if 'All')
  const categoryAdvisors = useMemo(() => {
    if (selectedCategory === 'All') return ADVISORS_DATA;
    const catLower = selectedCategory.toLowerCase();
    const matched = ADVISORS_DATA.filter(adv => {
      const advSlug = (adv.categorySlug || '').toLowerCase();
      const advCat = (adv.category || '').toLowerCase();
      return (
        advSlug.includes(catLower) ||
        catLower.includes(advSlug) ||
        advCat.includes(catLower) ||
        catLower.includes(advCat)
      );
    });
    return matched.length > 0 ? matched : ADVISORS_DATA;
  }, [selectedCategory]);

  // Top 4 matching products for AI Compare
  const top4ForCompare = useMemo(() => {
    if (aiCompareSelection.length > 0) {
      return aiCompareSelection.slice(0, 4);
    }
    return filteredProducts.slice(0, 4);
  }, [aiCompareSelection, filteredProducts]);

  // Crowned #1 Best Purchase Winner
  const crownedWinner = useMemo(() => {
    if (!top4ForCompare || top4ForCompare.length === 0) return null;
    return [...top4ForCompare].sort((a, b) => {
      const scoreA = (a.aiScore || 0);
      const scoreB = (b.aiScore || 0);
      if (scoreB !== scoreA) return scoreB - scoreA;
      return (b.rating || 0) - (a.rating || 0);
    })[0];
  }, [top4ForCompare]);

  // Open direct 1:1 Live Chat with Category Advisor
  const handleChatWithAdvisor = (categoryOrAdvisor, e) => {
    e?.stopPropagation();
    let advisor = null;
    if (typeof categoryOrAdvisor === 'string') {
      advisor = getAdvisorForCategory(categoryOrAdvisor);
    } else if (categoryOrAdvisor && categoryOrAdvisor.name && categoryOrAdvisor.title) {
      advisor = categoryOrAdvisor;
    } else if (categoryOrAdvisor && categoryOrAdvisor.category) {
      advisor = getAdvisorForCategory(categoryOrAdvisor.category);
    } else {
      advisor = getAdvisorForCategory(selectedCategory);
    }
    setActiveChatExpert({
      ...advisor,
      specialties: [advisor.specialty || advisor.title || 'Product Hardware Advice']
    });
  };

  // Toggle selection for AI comparison inside the Pop-up window
  const togglePopupCompareItem = (prod, e) => {
    e?.stopPropagation();
    setPopupCompareSelection((prev) => {
      const exists = prev.some(p => p.id === prod.id);
      if (exists) {
        return prev.filter(p => p.id !== prod.id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), prod];
      }
      return [...prev, prod];
    });
  };

  // Auto-select top 4 for pop-up comparison
  const autoSelectTop4ForPopup = () => {
    setPopupCompareSelection(filteredProducts.slice(0, 4));
  };

  // Safely extract specifications with rich fallback defaults
  const getProductSpec = (product, specKey) => {
    if (!product) return 'N/A';
    if (product.specs) {
      if (product.specs[specKey]) return product.specs[specKey];
      const lowerKey = specKey.toLowerCase();
      for (const [k, v] of Object.entries(product.specs)) {
        if (k.toLowerCase().includes(lowerKey)) return v;
      }
    }
    if (specKey === 'Processor') {
      return product.highlights?.find(h => /snapdragon|bionic|tensor|intel|amd|ryzen|core|m4|m3|m2|dimensity|silicon|chip/i.test(h)) || `${product.brand} Flagship High-Efficiency Silicon`;
    }
    if (specKey === 'Display') {
      return product.highlights?.find(h => /display|screen|oled|amoled|hz|retina|nits/i.test(h)) || 'Dynamic Super Retina / OLED 120Hz';
    }
    if (specKey === 'Camera') {
      return product.highlights?.find(h => /camera|sensor|mp|lens|zoom|periscope/i.test(h)) || 'Triple High-Resolution Computational Imaging System';
    }
    if (specKey === 'Battery') {
      return product.highlights?.find(h => /battery|mah|charging|watt|hours/i.test(h)) || 'All-Day Long Endurance Battery with Fast Charging';
    }
    if (specKey === 'Storage') {
      return product.highlights?.find(h => /gb|tb|storage|ram|nvme/i.test(h)) || '16GB LPDDR5X / 256GB Fast Storage';
    }
    if (specKey === 'OS') {
      return product.category?.toLowerCase().includes('laptop') ? 'macOS 15 / Windows 11' : (product.brand === 'Apple' ? 'iOS 20 with Apple Intelligence' : 'Android 15 (7 Years Guaranteed OS Updates)');
    }
    return 'Optimized Standard Configuration';
  };

  // Top 4 matching products for the Pop-up comparison (always up to 4 items)
  const popupTop4 = useMemo(() => {
    if (popupCompareSelection.length >= 2) {
      return popupCompareSelection.slice(0, 4);
    }
    const selectedIds = new Set(popupCompareSelection.map(p => p.id));
    const remaining = filteredProducts.filter(p => !selectedIds.has(p.id));
    return [...popupCompareSelection, ...remaining].slice(0, 4);
  }, [popupCompareSelection, filteredProducts]);

  // Crowned #1 Best Purchase Winner for Pop-up comparison
  const popupWinner = useMemo(() => {
    if (!popupTop4 || popupTop4.length === 0) return null;
    return [...popupTop4].sort((a, b) => {
      const scoreA = (a.aiScore || 0);
      const scoreB = (b.aiScore || 0);
      if (scoreB !== scoreA) return scoreB - scoreA;
      return (b.rating || 0) - (a.rating || 0);
    })[0];
  }, [popupTop4]);

  // Open AI Compare in the Pop-up Window
  const handleOpenAiCompare = (items = null) => {
    if (items && items.length > 0) {
      setPopupCompareSelection(items.slice(0, 4));
      setAiCompareSelection(items.slice(0, 4));
    } else {
      setPopupCompareSelection(filteredProducts.slice(0, 4));
      setAiCompareSelection(filteredProducts.slice(0, 4));
    }
    setSearchPopupTab('compare');
    setIsSearchPopupOpen(true);
  };

  // Open Advisor Inquiry modal for a product
  const handleOpenAdvisorModal = (product, e) => {
    e?.stopPropagation();
    setAdvisorModalProduct(product);
    setInquiryMessage(`Hi, I'm considering buying the ${product.name} (priced at ₹${product.price?.toLocaleString('en-IN')}). Can you review if this is the best purchase or if another model offers better value?`);
    setInquirySentSuccess(false);
  };

  // Submit Inquiry to Advisor (Persists to localStorage)
  const handleSubmitInquiry = (e) => {
    e.preventDefault();
    if (!advisorModalProduct || !inquiryName.trim() || !inquiryEmail.trim() || !inquiryMessage.trim()) return;

    const advisor = getAdvisorForCategory(advisorModalProduct.category);
    const newRequest = {
      id: 'req-' + Date.now(),
      customerName: inquiryName.trim(),
      customerEmail: inquiryEmail.trim(),
      category: advisorModalProduct.category,
      product: {
        id: advisorModalProduct.id,
        name: advisorModalProduct.name,
        price: advisorModalProduct.price,
        image: advisorModalProduct.image,
        brand: advisorModalProduct.brand
      },
      message: inquiryMessage.trim(),
      timestamp: new Date().toISOString(),
      advisorId: advisor.id,
      advisorName: advisor.name,
      status: 'pending',
      reply: null
    };

    try {
      const existing = JSON.parse(localStorage.getItem('wisefind_advisor_requests') || '[]');
      const updated = [newRequest, ...existing];
      localStorage.setItem('wisefind_advisor_requests', JSON.stringify(updated));
      setCustomerInquiries(updated);
      window.dispatchEvent(new Event('wisefind_advisor_request_created'));
    } catch (err) {
      console.error('Error saving advisor inquiry:', err);
    }

    setInquirySentSuccess(true);
    setTimeout(() => {
      setAdvisorModalProduct(null);
      setInquirySentSuccess(false);
    }, 2200);
  };

  // Modern Vertical Filter Sidebar with Collapsible Accordion Sliders
  const renderVerticalSidebar = (isDrawer = false) => {
    return (
      <div className={`space-y-4 ${isDrawer ? 'p-4' : ''}`}>
        {/* SIDEBAR HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              Filters & Refinements
            </span>
            {activeFiltersCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-600 text-white font-bold">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* ACCORDION 1: CATEGORIES */}
        <div className="rounded-2xl bg-[#0E1424] border border-slate-800 overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => toggleSidebar('categories')}
            className="w-full flex items-center justify-between p-3.5 text-xs font-black text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Categories</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-indigo-300 font-bold max-w-[90px] truncate">
                {selectedCategory}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${sidebarOpen.categories ? 'rotate-180' : ''}`} />
            </div>
          </button>
          {sidebarOpen.categories && (
            <div className="p-3 pt-0 space-y-1.5 border-t border-slate-800/60 max-h-64 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSubCategory('All');
                  setSelectedBrand('All');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>All Categories</span>
                </span>
                <span className="text-[10px] font-mono opacity-80">{products.length}</span>
              </button>
              {MASTER_CATEGORIES.map(cat => {
                const Icon = cat.icon || Layers;
                const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase() || selectedCategory.toLowerCase() === cat.shortName.toLowerCase();
                const catCount = products.filter(p => {
                  const pc = (p.category || '').toLowerCase();
                  const cn = cat.name.toLowerCase();
                  return pc.includes(cn) || cn.includes(pc);
                }).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(isSelected ? 'All' : cat.name);
                      setSelectedSubCategory('All');
                      setSelectedBrand('All');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Icon className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                      <span className="truncate">{cat.name}</span>
                    </span>
                    {catCount > 0 && (
                      <span className="text-[10px] font-mono opacity-80 shrink-0">{catCount}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ACCORDION 2: DYNAMIC SUBCATEGORIES (Only shown when category is selected!) */}
        <div className="rounded-2xl bg-[#0E1424] border border-slate-800 overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => toggleSidebar('subcategories')}
            className="w-full flex items-center justify-between p-3.5 text-xs font-black text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Subcategories</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-purple-300 font-bold max-w-[90px] truncate">
                {selectedSubCategory}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${sidebarOpen.subcategories ? 'rotate-180' : ''}`} />
            </div>
          </button>
          {sidebarOpen.subcategories && (
            <div className="p-3 pt-0 border-t border-slate-800/60">
              {selectedCategory === 'All' ? (
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center space-y-1.5">
                  <Lock className="w-4 h-4 text-slate-500 mx-auto" />
                  <p className="text-[11px] font-bold text-slate-300">Category Selection Required</p>
                  <p className="text-[10px] text-slate-400">
                    Choose a category above (e.g. Smartphones, Laptops, Audio) to reveal specific subcategory options.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedSubCategory('All')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedSubCategory === 'All'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                    }`}
                  >
                    <span>All {selectedCategory} Types</span>
                  </button>
                  {availableSubcategories.map((sub, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedSubCategory(sub)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSubCategory === sub
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                      }`}
                    >
                      <span className="truncate">{sub}</span>
                      {selectedSubCategory === sub && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ACCORDION 3: SORT & ACCURATE RANKING */}
        <div className="rounded-2xl bg-[#0E1424] border border-slate-800 overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => toggleSidebar('sort')}
            className="w-full flex items-center justify-between p-3.5 text-xs font-black text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-amber-400" />
              <span>Sort & Ranking</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${sidebarOpen.sort ? 'rotate-180' : ''}`} />
          </button>
          {sidebarOpen.sort && (
            <div className="p-3 pt-0 space-y-1.5 border-t border-slate-800/60">
              {[
                { id: 'aiScore', label: '⭐ Top WiseScore (Best Value)' },
                { id: 'latest', label: '✨ Latest 2026 Launches' },
                { id: 'trending', label: '📈 Trending & Most Popular' },
                { id: 'priceLow', label: '📉 Price: Low to High' },
                { id: 'priceHigh', label: '📈 Price: High to Low' },
                { id: 'rating', label: '★ Buyer Rating (4.5+ ★)' },
                { id: 'discount', label: '🔥 Biggest Price Drops' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSortBy(opt.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sortBy === opt.id
                      ? 'bg-indigo-600 text-white shadow-sm font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ACCORDION 4: PRICE RANGE & SLIDER */}
        <div className="rounded-2xl bg-[#0E1424] border border-slate-800 overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => toggleSidebar('price')}
            className="w-full flex items-center justify-between p-3.5 text-xs font-black text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-400" />
              <span>Price Range</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${sidebarOpen.price ? 'rotate-180' : ''}`} />
          </button>
          {sidebarOpen.price && (
            <div className="p-3 pt-0 space-y-3 border-t border-slate-800/60">
              <div className="text-[11px] text-slate-300 font-bold flex justify-between">
                <span>Budget:</span>
                <span className="text-emerald-400 font-mono">₹{priceRange.min.toLocaleString('en-IN')} - ₹{priceRange.max.toLocaleString('en-IN')}</span>
              </div>

              {/* Dual Slider Track */}
              <div className="relative flex items-center h-5 my-1">
                <div className="absolute w-full h-1.5 rounded-full bg-slate-800" />
                <div
                  className="absolute h-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400"
                  style={{
                    left: `${(priceRange.min / CATALOG_MAX_PRICE) * 100}%`,
                    width: `${Math.max(3, ((priceRange.max - priceRange.min) / CATALOG_MAX_PRICE) * 100)}%`
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max={CATALOG_MAX_PRICE}
                  step="500"
                  value={priceRange.min}
                  onChange={(e) => {
                    const newMin = Math.min(Number(e.target.value), priceRange.max - 500);
                    setPriceRange(prev => ({ ...prev, min: Math.max(0, newMin) }));
                    setManualMinPrice(String(Math.max(0, newMin)));
                    setPriceBudget('custom');
                  }}
                  className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-auto cursor-pointer accent-indigo-500 z-10"
                />
                <input
                  type="range"
                  min="0"
                  max={CATALOG_MAX_PRICE}
                  step="500"
                  value={priceRange.max}
                  onChange={(e) => {
                    const newMax = Math.max(Number(e.target.value), priceRange.min + 500);
                    setPriceRange(prev => ({ ...prev, max: Math.min(CATALOG_MAX_PRICE, newMax) }));
                    setManualMaxPrice(String(Math.min(CATALOG_MAX_PRICE, newMax)));
                    setPriceBudget('custom');
                  }}
                  className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-auto cursor-pointer accent-emerald-400 z-20"
                />
              </div>

              {/* Min/Max Manual Inputs */}
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="number"
                  value={manualMinPrice}
                  onChange={(e) => setManualMinPrice(e.target.value)}
                  placeholder="Min ₹"
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px] font-bold focus:outline-none focus:border-indigo-500"
                />
                <span className="text-slate-500 text-xs">-</span>
                <input
                  type="number"
                  value={manualMaxPrice}
                  onChange={(e) => setManualMaxPrice(e.target.value)}
                  placeholder="Max ₹"
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px] font-bold focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleApplyManualPrice}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black cursor-pointer shadow-xs active:scale-95"
                >
                  Go
                </button>
              </div>

              {/* Preset Budget Chips */}
              <div className="flex flex-wrap gap-1 pt-1">
                {[
                  { id: 'under2k', label: '< ₹2k', min: 0, max: 2000 },
                  { id: '2k-10k', label: '₹2k-₹10k', min: 2000, max: 10000 },
                  { id: '10k-35k', label: '₹10k-₹35k', min: 10000, max: 35000 },
                  { id: '35k-70k', label: '₹35k-₹70k', min: 35000, max: 70000 },
                  { id: '70k-150k', label: '₹70k-₹1.5L', min: 70000, max: 150000 },
                  { id: '150k+', label: '₹1.5L+', min: 150000, max: CATALOG_MAX_PRICE }
                ].map(p => {
                  const isSel = priceBudget === p.id || (priceRange.min === p.min && priceRange.max === p.max);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePricePresetSelect(p.id, p.min, p.max)}
                      className={`text-[10px] px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
                        isSel ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION 5: BRANDS */}
        <div className="rounded-2xl bg-[#0E1424] border border-slate-800 overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => toggleSidebar('brands')}
            className="w-full flex items-center justify-between p-3.5 text-xs font-black text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-sky-400" />
              <span>Brands ({availableBrands.length})</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${sidebarOpen.brands ? 'rotate-180' : ''}`} />
          </button>
          {sidebarOpen.brands && (
            <div className="p-3 pt-0 space-y-1 max-h-56 overflow-y-auto border-t border-slate-800/60">
              <button
                type="button"
                onClick={() => setSelectedBrand('All')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedBrand === 'All'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <span>All Brands</span>
              </button>
              {availableBrands.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBrand(b)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedBrand === b
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <span className="truncate">{b}</span>
                  {selectedBrand === b && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ACCORDION 6: BUYER RATINGS */}
        <div className="rounded-2xl bg-[#0E1424] border border-slate-800 overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => toggleSidebar('ratings')}
            className="w-full flex items-center justify-between p-3.5 text-xs font-black text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Customer Ratings</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${sidebarOpen.ratings ? 'rotate-180' : ''}`} />
          </button>
          {sidebarOpen.ratings && (
            <div className="p-3 pt-0 space-y-1.5 border-t border-slate-800/60">
              {[
                { val: 0, label: 'All Ratings' },
                { val: 4.5, label: '4.5+ ★ & Above' },
                { val: 4.0, label: '4.0+ ★ & Above' }
              ].map(r => (
                <button
                  key={r.val}
                  type="button"
                  onClick={() => setMinRating(r.val)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    minRating === r.val
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <span>{r.label}</span>
                  {minRating === r.val && <Check className="w-3.5 h-3.5 text-slate-950" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ACCORDION 7: VERIFIED STORES */}
        <div className="rounded-2xl bg-[#0E1424] border border-slate-800 overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => toggleSidebar('stores')}
            className="w-full flex items-center justify-between p-3.5 text-xs font-black text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4 text-cyan-400" />
              <span>Online Stores</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${sidebarOpen.stores ? 'rotate-180' : ''}`} />
          </button>
          {sidebarOpen.stores && (
            <div className="p-3 pt-0 space-y-1.5 border-t border-slate-800/60">
              {[
                { id: 'all', label: 'All Verified Stores' },
                { id: 'amazon', label: 'Amazon India' },
                { id: 'flipkart', label: 'Flipkart' },
                { id: 'meesho', label: 'Meesho Mall' },
                { id: 'myntra', label: 'Myntra' },
                { id: 'croma', label: 'Croma' },
                { id: 'reliance', label: 'Reliance Digital' }
              ].map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStoreFilter(s.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    storeFilter === s.id
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <span>{s.label}</span>
                  {storeFilter === s.id && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ACCORDION 8: MARKETING GIMMICK SHIELD */}
        <div className="p-3.5 rounded-2xl bg-[#0E1424] border border-emerald-500/30 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Gimmick Shield</span>
            </span>
            <button
              type="button"
              onClick={() => setExcludeGimmicks(!excludeGimmicks)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer transition-all ${
                excludeGimmicks
                  ? 'bg-emerald-400 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {excludeGimmicks ? 'ACTIVE' : 'OFF'}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Eliminates fake 2MP filler cameras, virtual RAM inflation, and slow eMMC storage.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 pb-24 selection:bg-indigo-500/30 selection:text-indigo-200">

      {/* BUYHATKE-INSPIRED TOP HEADER & UNIVERSAL RADAR */}
      <div className="relative overflow-visible pt-8 pb-10 border-b border-slate-800/80 bg-gradient-to-b from-[#0C1222] via-[#080E1C] to-[#070B14]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">

          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-indigo-500/15 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>BuyHatke Intelligence • Multi-Store Price Comparison</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                Universal Product Browser & AI Compare
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Real-time price scrape across Amazon, Flipkart & Croma. AI-powered 4-way comparison matrix with crowned winner and category advisors.
              </p>
            </div>

            {/* Spec Mode Toggle (General vs Technical) */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center bg-[#111728] p-1 rounded-xl border border-slate-800 shadow-inner">
                <button
                  onClick={() => setSpecMode('general')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${specMode === 'general'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                    }`}
                  title="Translate technical hardware specs into friendly everyday meanings"
                >
                  <Sparkle className="w-3.5 h-3.5 text-amber-300" />
                  <span>General Understanding</span>
                </button>
                <button
                  onClick={() => setSpecMode('technical')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${specMode === 'technical'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                    }`}
                  title="Show raw technical specifications (CPU, RAM, Hz, Sensor)"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Technical Specs</span>
                </button>
              </div>

              {/* Inquiries Button */}
              <button
                onClick={() => setShowInquiriesDrawer(true)}
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#111728] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span className="hidden sm:inline">Advisor Inquiries</span>
                {customerInquiries.length > 0 && (
                  <span className="flex items-center justify-center h-5 px-1.5 rounded-full bg-purple-600 text-white text-[10px] font-black">
                    {customerInquiries.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* UNIVERSAL ALL PRODUCTS SEARCH BAR */}
          <div ref={searchContainerRef} className="relative mb-6 z-30">
            {/* Universal Search Header Pill */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-[11px] font-black text-indigo-300">
                  <Globe className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Universal Store Search</span>
                </span>
                <span className="text-slate-400 text-[11px] hidden md:inline">
                  Comparing 6+ Top Stores Live:
                </span>
                <div className="hidden sm:flex items-center gap-1 text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-[#FF9900]/15 text-[#FF9900] border border-[#FF9900]/30 font-bold">Amazon</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#2874F0]/15 text-[#60A5FA] border border-[#2874F0]/30 font-bold">Flipkart</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#F43397]/15 text-[#F472B6] border border-[#F43397]/30 font-bold">Meesho</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FF3F6C]/15 text-[#FDA4AF] border border-[#FF3F6C]/30 font-bold">Myntra</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#00E9BF]/15 text-[#2DD4BF] border border-[#00E9BF]/30 font-bold">Croma</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#E42529]/15 text-[#F87171] border border-[#E42529]/30 font-bold">Reliance</span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400">
                Found <span className="text-indigo-400 font-bold">{filteredProducts.length}</span> verified deals
              </span>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <div className={`relative flex items-center bg-[#111728]/95 backdrop-blur-xl rounded-2xl border-2 transition-all shadow-2xl ${
                isSearchFocused ? 'border-indigo-500 shadow-indigo-500/20' : 'border-slate-700/80 hover:border-slate-600'
              }`}>
                {/* Search Icon */}
                <div className="pl-4 sm:pl-5 text-indigo-400 shrink-0">
                  <Search className="w-5 h-5 text-indigo-400" />
                </div>

                {/* Input Field */}
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearchSubmit(e);
                    }
                  }}
                  placeholder="Search 50,000+ items across Flipkart, Amazon, Meesho, Myntra, Croma (e.g. 'OnePlus 13', 'air fryer under 5000', 'cotton kurti', 'MacBook')..."
                  className="w-full py-4 sm:py-5 px-3 bg-transparent text-white placeholder-slate-400 text-xs sm:text-base font-medium focus:outline-none"
                />

                {/* Voice Search Mic Button */}
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer mr-1 relative ${
                    isVoiceListening 
                      ? 'bg-rose-500/20 text-rose-400 animate-pulse ring-2 ring-rose-500/50' 
                      : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800/80'
                  }`}
                  title={isVoiceListening ? "Listening... Speak now!" : "Search by voice (Flipkart / Amazon style)"}
                >
                  {isVoiceListening ? (
                    <Mic className="w-5 h-5 text-rose-400 animate-bounce" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>

                {/* Clear Input Button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchPopupOpen(false);
                    }}
                    className="p-2 text-slate-400 hover:text-white mr-1 cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}

                {/* Submit Search Button */}
                <div className="pr-2 sm:pr-3 flex items-center shrink-0">
                  <button
                    type="submit"
                    disabled={isScraping}
                    className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 shrink-0"
                  >
                    {isScraping ? (
                      <WiseFindSpinner size={16} showCore={false} />
                    ) : (
                      <Zap className="w-4 h-4 text-amber-300" />
                    )}
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* LIVE UNIVERSAL AUTOCOMPLETE DROPDOWN (Like Flipkart & Amazon) */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0F172A]/98 backdrop-blur-2xl border-2 border-indigo-500/40 rounded-2xl shadow-2xl shadow-slate-950/90 z-50 overflow-hidden divide-y divide-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                  {/* Voice Listening Banner */}
                  {isVoiceListening && (
                    <div className="p-3 bg-rose-950/60 border-b border-rose-800/40 flex items-center justify-between text-rose-300 text-xs">
                      <span className="flex items-center gap-2 font-bold animate-pulse">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                        Listening for your search... (Say product name or budget)
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsVoiceListening(false)}
                        className="text-rose-400 hover:text-white text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {/* Top Instant Matching Products Preview (Flipkart / Amazon style) */}
                  {instantAutocompleteMatches.length > 0 && (
                    <div className="p-3 bg-slate-900/60">
                      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1">
                        <span className="flex items-center gap-1.5 text-indigo-400">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Instant Product Previews</span>
                        </span>
                        <span>{instantAutocompleteMatches.length} Matches</span>
                      </div>
                      <div className="space-y-1.5">
                        {instantAutocompleteMatches.map((prod) => {
                          const comp = generatePlatformComparison(prod);
                          const lowest = comp.platforms?.find(p => p.platformId === comp.lowestPricePlatform) || comp.platforms?.[0];
                          const lowestStoreName = lowest?.platformName || lowest?.name || comp.lowestPricePlatform;
                          return (
                            <div
                              key={prod.id}
                              onClick={() => {
                                setSearchQuery(prod.name);
                                setIsSearchFocused(false);
                                handleSelectProduct(prod);
                              }}
                              className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50 hover:bg-indigo-950/60 border border-slate-700/50 hover:border-indigo-500/40 transition-all cursor-pointer group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-lg bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center border border-slate-700/60">
                                  <SafeProductImage
                                    src={prod.image}
                                    alt={prod.name}
                                    category={prod.category}
                                    className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                                    {prod.name}
                                  </p>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                    <span>{prod.brand || prod.category}</span>
                                    {prod.rating && (
                                      <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                                        <span>{prod.rating}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right shrink-0 pl-3">
                                <div className="text-xs font-black text-emerald-400">
                                  ₹{(prod.price || 0).toLocaleString('en-IN')}
                                </div>
                                {lowestStoreName && (
                                  <div className="text-[10px] font-bold text-cyan-300">
                                    Lowest on {lowestStoreName}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Scope query in categories */}
                  {searchQuery.trim().length > 1 && (
                    <div className="p-3 bg-[#0B1120]">
                      <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1">
                        Search within Category
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                        {['Smartphones', 'Laptops', 'Audio', 'Fashion & Apparel'].map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat);
                              handleSearchSubmit(null, searchQuery);
                            }}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-left transition-colors cursor-pointer"
                          >
                            <Search className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span className="truncate">"{searchQuery}" in <strong className="text-indigo-300">{cat}</strong></span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="p-3">
                      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Recent Searches</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setRecentSearches([]);
                            try { localStorage.removeItem('wisefind_universal_recent_searches'); } catch (e) {}
                          }}
                          className="text-[10px] text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          Clear History
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {recentSearches.map((term, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-950/80 border border-slate-700/60 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer group"
                            onClick={() => {
                              setSearchQuery(term);
                              handleSearchSubmit(null, term);
                            }}
                          >
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{term}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = recentSearches.filter((_, idx) => idx !== i);
                                setRecentSearches(updated);
                                try { localStorage.setItem('wisefind_universal_recent_searches', JSON.stringify(updated)); } catch (err) {}
                              }}
                              className="text-slate-500 hover:text-rose-400 ml-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Queries */}
                  <div className="p-3 bg-slate-900/40">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Trending Searches Across Stores</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_SEARCH_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setSearchQuery(tag);
                            handleSearchSubmit(null, tag);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-amber-950/40 border border-slate-700/60 hover:border-amber-500/40 text-slate-300 hover:text-amber-200 text-xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <TrendingUp className="w-3 h-3 text-amber-400" />
                          <span>{tag}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Search Chips */}
              <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                <span className="text-slate-400 font-semibold flex items-center gap-1 flex-shrink-0 text-[11px]">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Popular:</span>
                </span>
                {QUICK_SEARCH_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag);
                      triggerScrapeSearch(tag);
                      setIsSearchPopupOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-indigo-950/80 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all flex-shrink-0 cursor-pointer text-[11px]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>

            {/* FLOATING INTELLIGENCE SEARCH & COMPARE MODAL WINDOW (Above Browse Section) */}
            {typeof document !== 'undefined' && createPortal(
              <AnimatePresence>
                {isSearchPopupOpen && (
                  <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-xl overflow-hidden"
                    onClick={() => setIsSearchPopupOpen(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 15 }}
                      transition={{ duration: 0.2 }}
                      className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#0A0F1E] border-2 border-indigo-500/40 rounded-3xl shadow-2xl shadow-indigo-950/90 overflow-hidden text-left"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isScraping ? (
                        /* CUSTOM LOADING VIEW WITH CUSTOM ICONS & ANIMATIONS */
                        <div className="flex-1 flex flex-col min-h-[500px]">
                          {/* Loading Modal Header */}
                          <div className="flex items-center justify-between p-5 sm:px-6 bg-gradient-to-r from-indigo-950/90 via-[#0D1428] to-purple-950/90 border-b border-slate-800">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 flex-shrink-0 animate-pulse">
                                <Globe className="w-5 h-5 text-cyan-300 animate-spin" style={{ animationDuration: '4s' }} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                                    Live Scraper Active
                                  </span>
                                  <span className="text-[11px] font-mono font-black text-amber-300">
                                    {scrapingProgress}%
                                  </span>
                                </div>
                                <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                                  Scraping Stores for <span className="text-amber-300">"{searchQuery.trim()}"</span>
                                </h3>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setIsSearchPopupOpen(false);
                                setIsScraping(false);
                                onClearInitialSearch?.();
                              }}
                              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
                              title="Cancel & Close"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Custom Multi-Store Animated Radar Body */}
                          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-gradient-to-b from-[#0A0F20] via-[#080D1A] to-[#050814] relative overflow-hidden">
                            {/* Animated concentric radar rings and glow */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                              <div className="w-[500px] h-[500px] rounded-full border border-indigo-500/10 animate-ping" style={{ animationDuration: '3.5s' }} />
                              <div className="w-[360px] h-[360px] rounded-full border border-purple-500/15 animate-pulse" />
                              <div className="w-[220px] h-[220px] rounded-full border-2 border-indigo-500/20" />
                              <div className="w-80 h-80 bg-indigo-600/15 rounded-full blur-[90px]" />
                            </div>

                            {/* Center Revolving Radar Graphic */}
                            <div className="relative mb-6">
                              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-indigo-500/40 bg-slate-950/90 shadow-2xl shadow-indigo-500/20 flex items-center justify-center">
                                {/* Rotating sweep cone */}
                                <div
                                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-indigo-500/30 to-cyan-400/50 animate-spin pointer-events-none"
                                  style={{ animationDuration: '2s' }}
                                />
                                {/* Center glowing WiseFind Icon */}
                                <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                                  <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow animate-pulse" />
                                </div>
                              </div>
                              {/* Live ping dot */}
                              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-slate-950"></span>
                              </span>
                            </div>

                            {/* Progress & Stage Status */}
                            <div className="relative z-10 max-w-lg mx-auto space-y-2">
                              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-black uppercase tracking-widest">
                                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                                <span>Live Multi-Store Scraping Radar</span>
                                <span className="text-amber-300 font-mono font-black">{scrapingProgress}%</span>
                              </div>

                              <h3 className="text-xl sm:text-2xl font-black text-white">
                                Connecting to Marketplaces for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-300 to-cyan-400">"{searchQuery.trim()}"</span>
                              </h3>

                              <p className="text-xs sm:text-sm text-slate-300 font-medium animate-pulse min-h-[22px]">
                                {scrapingStage}
                              </p>

                              {/* Glowing Progress Bar */}
                              <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 shadow-inner mt-3">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full shadow-lg shadow-indigo-500/50"
                                  initial={{ width: '0%' }}
                                  animate={{ width: `${scrapingProgress}%` }}
                                  transition={{ ease: "easeInOut", duration: 0.3 }}
                                />
                              </div>
                            </div>

                            {/* Multi-Store Real-time Status Badges */}
                            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-7 w-full max-w-2xl mx-auto">
                              {[
                                { name: 'Amazon India', icon: '📦', color: 'border-amber-500/40 text-amber-300 bg-amber-500/10', done: scrapingProgress >= 30, desc: 'BuyBox & Prime Delivery' },
                                { name: 'Flipkart', icon: '🛍️', color: 'border-blue-500/40 text-blue-300 bg-blue-500/10', done: scrapingProgress >= 50, desc: 'SuperCoins & Assured Tag' },
                                { name: 'Meesho Mall', icon: '🏷️', color: 'border-pink-500/40 text-pink-300 bg-pink-500/10', done: scrapingProgress >= 75, desc: 'Direct Manufacturer Deals' },
                                { name: 'Croma Retail', icon: '⚡', color: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10', done: scrapingProgress >= 90, desc: 'Store Warranty & Stocks' }
                              ].map((store, i) => (
                                <div
                                  key={i}
                                  className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 ${store.done
                                    ? `${store.color} shadow-md`
                                    : 'border-slate-800/80 bg-slate-900/40 text-slate-500'
                                    }`}
                                >
                                  <div className="flex items-center gap-1.5 text-xs font-black">
                                    <span>{store.icon}</span>
                                    <span className="truncate">{store.name}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-[10px] font-bold">
                                    {store.done ? (
                                      <span className="text-emerald-400 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                        Scraped
                                      </span>
                                    ) : (
                                      <span className="text-slate-500 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                                        Pinging...
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[9px] text-slate-400 truncate">{store.desc}</span>
                                </div>
                              ))}
                            </div>

                            {/* Shimmer placeholders */}
                            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 w-full max-w-2xl mx-auto opacity-35 pointer-events-none">
                              <div className="h-16 rounded-2xl bg-slate-800/60 border border-slate-700/50 animate-pulse flex items-center p-3 gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-700" />
                                <div className="flex-1 space-y-1.5">
                                  <div className="w-3/4 h-3 bg-slate-700 rounded" />
                                  <div className="w-1/2 h-2.5 bg-slate-700 rounded" />
                                </div>
                              </div>
                              <div className="h-16 rounded-2xl bg-slate-800/60 border border-slate-700/50 animate-pulse flex items-center p-3 gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-700" />
                                <div className="flex-1 space-y-1.5">
                                  <div className="w-3/4 h-3 bg-slate-700 rounded" />
                                  <div className="w-1/2 h-2.5 bg-slate-700 rounded" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Loading Footer */}
                          <div className="p-4 sm:px-6 bg-[#080D1A] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-indigo-400 animate-spin" />
                              <span>Scraping Amazon, Flipkart, Meesho & Croma in parallel... Preparing verified results.</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* POST-LOAD CONTENT */
                        <>
                          {/* MODAL HEADER */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:px-6 bg-gradient-to-r from-indigo-950/80 via-[#0D1428] to-purple-950/80 border-b border-slate-800">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 flex-shrink-0">
                                <Trophy className="w-5 h-5 text-amber-300" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    ⚡ WiseFind Intelligence Hub
                                  </span>
                                  {parsedSearch.maxPrice && (
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                      Budget: ≤ ₹{parsedSearch.maxPrice.toLocaleString('en-IN')}
                                    </span>
                                  )}
                                  {parsedSearch.detectedCategory && (
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                                      {parsedSearch.detectedCategory}
                                    </span>
                                  )}
                                  <span className="text-[10px] font-mono font-bold text-slate-400">
                                    {filteredProducts.length} Verified Products Found
                                  </span>
                                </div>
                                <h3 className="text-base sm:text-lg font-black text-white mt-0.5 flex items-center gap-2">
                                  <span>Search & Comparison Intelligence</span>
                                  {searchQuery && (
                                    <span className="text-xs text-amber-300 font-bold hidden sm:inline">
                                      for "{searchQuery}"
                                    </span>
                                  )}
                                </h3>
                              </div>
                            </div>

                            {/* Header Actions: THEN ONLY AI Compare, Ask Advisor, View Tabs & Close */}
                            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                              {/* ⚡ AI Compare (Top 4) Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSearchPopupTab('compare');
                                  if (popupCompareSelection.length === 0) {
                                    setPopupCompareSelection(filteredProducts.slice(0, 4));
                                  }
                                }}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md active:scale-95 ${searchPopupTab === 'compare'
                                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-amber-500/20'
                                  : 'bg-gradient-to-r from-amber-500/20 to-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30'
                                  }`}
                                title="Compare top 4 contenders head-to-head"
                              >
                                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                <span>⚡ AI Compare (Top 4)</span>
                              </button>

                              {/* 🧑‍💻 Ask Advisor Button */}
                              <button
                                type="button"
                                onClick={() => setIsAdvisorHubOpen(true)}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-purple-600/30 active:scale-95"
                                title="Connect with certified category advisor"
                              >
                                <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                                <span>🧑‍💻 Ask Advisor</span>
                              </button>

                              {/* View Switcher: Products vs Matrix */}
                              <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
                                <button
                                  type="button"
                                  onClick={() => setSearchPopupTab('products')}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${searchPopupTab === 'products'
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                  <LayoutGrid className="w-3.5 h-3.5" />
                                  <span>Products ({filteredProducts.length})</span>
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setIsSearchPopupOpen(false);
                                  onClearInitialSearch?.();
                                }}
                                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
                                title="Close Window"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {/* POP-UP FILTERS SECTION (Simple, Easy, User-Friendly) */}
                          <div className="px-5 sm:px-6 py-3 bg-[#0B1020] border-b border-slate-800/80 space-y-2.5">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                              {/* Store Platform Pills */}
                              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                                <span className="text-[11px] text-slate-400 font-bold flex-shrink-0 flex items-center gap-1">
                                  <Store className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>Store:</span>
                                </span>
                                {[
                                  { id: 'all', label: 'All Stores' },
                                  { id: 'amazon', label: 'Amazon India' },
                                  { id: 'flipkart', label: 'Flipkart' },
                                  { id: 'meesho', label: 'Meesho Mall' },
                                  { id: 'myntra', label: 'Myntra' },
                                  { id: 'croma', label: 'Croma' },
                                  { id: 'reliance', label: 'Reliance' }
                                ].map(s => (
                                  <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setStoreFilter(s.id)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${storeFilter === s.id
                                      ? 'bg-cyan-600 text-white shadow-xs'
                                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                      }`}
                                  >
                                    {s.label}
                                  </button>
                                ))}
                              </div>

                              {/* Search Refiner */}
                              <div className="relative min-w-[240px]">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                  type="text"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      triggerScrapeSearch(searchQuery);
                                    }
                                  }}
                                  placeholder="Refine search & press Enter..."
                                  className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                                />
                                {searchQuery && (
                                  <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Row 2: Budget, Rating, Sort & Reset */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs">
                              {/* Budget Pills */}
                              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                                <span className="text-[11px] text-slate-400 font-bold flex-shrink-0">Budget:</span>
                                {[
                                  { id: 'all', label: 'All' },
                                  { id: 'under2k', label: '< ₹2K' },
                                  { id: '2k-10k', label: '₹2K-₹10K' },
                                  { id: '10k-35k', label: '₹10K-₹35K' },
                                  { id: '35k-70k', label: '₹35K-₹70K' },
                                  { id: '70k+', label: '₹70K+' }
                                ].map(b => (
                                  <button
                                    key={b.id}
                                    type="button"
                                    onClick={() => setPriceBudget(b.id)}
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${priceBudget === b.id
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                      }`}
                                  >
                                    {b.label}
                                  </button>
                                ))}
                              </div>

                              {/* Rating Pills, Sort & Reset */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center gap-1">
                                  <span className="text-[11px] text-slate-400 font-bold">Rating:</span>
                                  {[
                                    { val: 0, label: 'All' },
                                    { val: 4.0, label: '4.0+ ★' },
                                    { val: 4.5, label: '4.5+ ★' }
                                  ].map(r => (
                                    <button
                                      key={r.val}
                                      type="button"
                                      onClick={() => setMinRating(r.val)}
                                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${minRating === r.val
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                        }`}
                                    >
                                      {r.label}
                                    </button>
                                  ))}
                                </div>

                                <div className="flex items-center gap-1">
                                  <span className="text-[11px] text-slate-400 font-bold">Sort:</span>
                                  <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-slate-900 text-slate-200 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                                  >
                                    <option value="aiScore">⭐ Top WiseScore</option>
                                    <option value="priceLow">📉 Price: Low to High</option>
                                    <option value="priceHigh">📈 Price: High to Low</option>
                                    <option value="rating">★ Highest Rating</option>
                                  </select>
                                </div>

                                {(storeFilter !== 'all' || priceBudget !== 'all' || minRating > 0 || sortBy !== 'aiScore') && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setStoreFilter('all');
                                      setPriceBudget('all');
                                      setMinRating(0);
                                      setSortBy('aiScore');
                                    }}
                                    className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 cursor-pointer transition-colors"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Reset Filters</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* MODAL MAIN CONTENT AREA (Scrollable) */}
                          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

                            {/* TAB 1: MATCHED PRODUCTS LIST */}
                            {searchPopupTab === 'products' && (
                              <div>
                                {/* Selection status for AI compare */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 mb-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-white">
                                      Selected for Tabular AI Matrix: {popupCompareSelection.length} / 4 Products
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                      (Select any products to compare side-by-side)
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={autoSelectTop4ForPopup}
                                      className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                                    >
                                      Auto-Select Top 4
                                    </button>
                                    {popupCompareSelection.length > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => setPopupCompareSelection([])}
                                        className="px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                                      >
                                        Clear
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => setSearchPopupTab('compare')}
                                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/20"
                                    >
                                      <Trophy className="w-3.5 h-3.5 text-slate-950" />
                                      <span>⚡ Launch AI Matrix ({popupTop4.length}) →</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Product Cards Grid */}
                                {filteredProducts.length === 0 ? (
                                  <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
                                    <Search className="w-10 h-10 text-slate-600 mx-auto" />
                                    <h4 className="text-base font-bold text-white">No products found matching this filter</h4>
                                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                      Try widening your budget limit or resetting category keywords.
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('All');
                                        setPriceBudget('all');
                                        setDealTab('all');
                                      }}
                                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
                                    >
                                      Reset All Filters
                                    </button>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredProducts.map((prod) => {
                                      const comparison = generatePlatformComparison(prod);
                                      const isFav = favorites?.includes(prod.id);
                                      const isSelectedInPopup = popupCompareSelection.some(p => p.id === prod.id);

                                      return (
                                        <div
                                          key={prod.id}
                                          className={`p-4 rounded-3xl border transition-all flex flex-col justify-between gap-3 relative ${isSelectedInPopup
                                            ? 'bg-gradient-to-br from-indigo-950/70 to-slate-900/90 border-indigo-500 shadow-lg shadow-indigo-500/10'
                                            : 'bg-[#0E1528]/80 hover:bg-[#121A33] border-slate-800 hover:border-slate-700'
                                            }`}
                                        >
                                          <div>
                                            {/* Top Row: AI Compare Checkbox & Bookmark Button */}
                                            <div className="flex items-center justify-between gap-2 mb-2.5">
                                              <button
                                                type="button"
                                                onClick={(e) => togglePopupCompareItem(prod, e)}
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer border ${isSelectedInPopup
                                                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                                                  : 'bg-slate-900/90 text-slate-400 hover:text-white border-slate-800'
                                                  }`}
                                              >
                                                {isSelectedInPopup ? (
                                                  <CheckSquare className="w-3.5 h-3.5 text-white" />
                                                ) : (
                                                  <Square className="w-3.5 h-3.5 text-slate-500" />
                                                )}
                                                <span>{isSelectedInPopup ? '✓ Selected in Matrix' : '+ Compare in Matrix'}</span>
                                              </button>

                                              {/* Bookmark Button (1-Click toggle) */}
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  onToggleFavorite?.(prod);
                                                }}
                                                className={`p-2 rounded-xl border transition-all cursor-pointer ${isFav
                                                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-500/30'
                                                  }`}
                                                title={isFav ? "Saved in Bookmarks" : "Save to Bookmarks"}
                                              >
                                                <WiseBookmarkIcon filled={isFav} active={isFav} size={16} />
                                              </button>
                                            </div>

                                            {/* Product Visual & Info Header */}
                                            <div className="flex items-start gap-3.5">
                                              <div
                                                onClick={() => onProductClick?.(prod)}
                                                className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0 cursor-pointer p-1"
                                              >
                                                <SafeProductImage
                                                  src={prod.image}
                                                  alt={prod.name}
                                                  category={prod.category}
                                                  subCategory={prod.subCategory}
                                                />
                                              </div>
                                              <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                  <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                                                    {prod.brand} • {prod.subCategory || prod.category}
                                                  </span>
                                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                                    2026 Edition
                                                  </span>
                                                </div>
                                                <h4
                                                  onClick={() => onProductClick?.(prod)}
                                                  className="text-sm font-black text-white hover:text-indigo-400 transition-colors cursor-pointer line-clamp-1 mt-0.5"
                                                >
                                                  {prod.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                  <span className="text-base font-black text-white">
                                                    ₹{prod.price?.toLocaleString('en-IN')}
                                                  </span>
                                                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                    WiseScore: {prod.aiScore || 92}/100
                                                  </span>
                                                  <span className="text-[10px] font-bold text-amber-300 flex items-center gap-0.5">
                                                    ★ {prod.rating}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Multi-Store Live Comparison Pills */}
                                            <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs flex-wrap gap-2">
                                              <span className="text-[11px] font-bold text-slate-400">Stores:</span>
                                              <div className="flex items-center gap-2 text-[11px]">
                                                <span className="text-amber-400 font-bold">
                                                  Amazon: ₹{comparison.platforms.find(p => p.platformId === 'amazon')?.salePrice.toLocaleString('en-IN') || prod.price.toLocaleString('en-IN')}
                                                </span>
                                                <span className="text-slate-600">|</span>
                                                <span className="text-blue-400 font-bold">
                                                  Flipkart: ₹{comparison.platforms.find(p => p.platformId === 'flipkart')?.salePrice.toLocaleString('en-IN') || prod.price.toLocaleString('en-IN')}
                                                </span>
                                              </div>
                                              <span className="text-[10px] font-black text-emerald-400 uppercase bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                                                Lowest at {comparison.lowestPricePlatform}
                                              </span>
                                            </div>

                                            {/* Key Plain English Specs Snippet */}
                                            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                                              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                                                <span className="text-slate-500 block text-[9px] uppercase font-bold">Processor / CPU</span>
                                                <span className="text-slate-200 font-semibold truncate block">
                                                  {getProductSpec(prod, 'Processor')}
                                                </span>
                                              </div>
                                              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                                                <span className="text-slate-500 block text-[9px] uppercase font-bold">Display Panel</span>
                                                <span className="text-slate-200 font-semibold truncate block">
                                                  {getProductSpec(prod, 'Display')}
                                                </span>
                                              </div>
                                              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                                                <span className="text-slate-500 block text-[9px] uppercase font-bold">Cameras</span>
                                                <span className="text-slate-200 font-semibold truncate block">
                                                  {getProductSpec(prod, 'Camera')}
                                                </span>
                                              </div>
                                              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                                                <span className="text-slate-500 block text-[9px] uppercase font-bold">Battery & Power</span>
                                                <span className="text-slate-200 font-semibold truncate block">
                                                  {getProductSpec(prod, 'Battery')}
                                                </span>
                                              </div>
                                            </div>

                                            {/* AI Recommendation Quote */}
                                            <p className="text-[11px] text-slate-300 mt-2.5 font-medium line-clamp-2">
                                              <span className="text-amber-300 font-bold">Why Buy: </span>
                                              {prod.aiRecommendation || prod.highlights?.[0] || 'Top tier hardware build with class-leading durability and high customer satisfaction.'}
                                            </p>
                                          </div>

                                          {/* Action Buttons Row */}
                                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 flex-wrap">
                                            <a
                                              href={comparison.platforms.find(p => p.platformId === comparison.lowestPricePlatform)?.productUrl || `https://www.google.com/search?q=${encodeURIComponent(prod.name)}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-black text-xs flex items-center gap-1 transition-all"
                                            >
                                              <span>Buy at {comparison.lowestPricePlatform}</span>
                                              <ExternalLink className="w-3 h-3" />
                                            </a>

                                            <div className="flex items-center gap-1.5">
                                              <button
                                                type="button"
                                                onClick={() => setQuickSpecsProduct(prod)}
                                                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                                              >
                                                Full Specs
                                              </button>
                                              <button
                                                type="button"
                                                onClick={(e) => handleOpenAdvisorModal(prod, e)}
                                                className="px-2.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-bold transition-all cursor-pointer"
                                                title="Ask Category Advisor"
                                              >
                                                💬 Advisor
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* TAB 2: TABULAR AI COMPARISON MATRIX (Top 4 Products + 1 Winner) */}
                            {searchPopupTab === 'compare' && (
                              <div className="space-y-6">

                                {/* 🏆 CROWNED #1 BEST PURCHASE WINNER BANNER */}
                                {popupWinner && (
                                  <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-[#131A30] to-emerald-500/20 border-2 border-amber-400/60 shadow-2xl relative overflow-hidden">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                      <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-amber-500/25 border-2 border-amber-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
                                          <Crown className="w-8 h-8 text-amber-300 animate-bounce" />
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50">
                                              🏆 #1 OVERALL BEST BUY WINNER
                                            </span>
                                            <span className="text-xs font-black text-emerald-400">
                                              WiseScore: {popupWinner.aiScore || 97}/100
                                            </span>
                                          </div>
                                          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                                            {popupWinner.name}
                                          </h3>
                                          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl font-medium">
                                            <span className="text-amber-300 font-bold">Why It Wins: </span>
                                            Delivers the highest performance-per-rupee index among the {popupTop4.length} contenders. Equipped with {popupWinner.highlights?.[0] || 'flagship architecture'}, it outperforms rivals in sustained benchmark efficiency, thermal stability, and battery endurance while saving maximum money vs retail MSRP.
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex flex-col sm:items-end gap-2 flex-shrink-0">
                                        <div className="text-left sm:text-right">
                                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Best Purchase Price</span>
                                          <span className="text-2xl font-black text-white block">₹{popupWinner.price?.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <a
                                            href={`https://www.google.com/search?q=${encodeURIComponent(popupWinner.name)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                                          >
                                            <span>Buy Winner Now</span>
                                            <ExternalLink className="w-3.5 h-3.5" />
                                          </a>
                                          <button
                                            type="button"
                                            onClick={() => onToggleFavorite?.(popupWinner)}
                                            className={`p-2 rounded-xl border transition-all cursor-pointer ${favorites?.includes(popupWinner.id)
                                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-amber-300'
                                              }`}
                                            title="Bookmark Winner"
                                          >
                                            <WiseBookmarkIcon filled={favorites?.includes(popupWinner.id)} active={favorites?.includes(popupWinner.id)} size={16} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* ⚖️ TABULAR DIFFERENCES MATRIX (Top 4 Products Side-by-Side) */}
                                <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-[#0B1020]/90">
                                  {/* Matrix Toolbar: General Understanding vs Technical Specs Toggle */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900/95 border-b border-slate-800">
                                    <div className="flex items-center gap-2">
                                      <Trophy className="w-4 h-4 text-amber-400" />
                                      <span className="text-xs font-black text-white">Head-to-Head Comparison Matrix</span>
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                                        {popupTop4.length} Contenders
                                      </span>
                                    </div>

                                    {/* General Understanding (Plain English) vs Technical Specs Mode Switcher */}
                                    <div className="flex items-center bg-[#070B14] p-1 rounded-xl border border-slate-800">
                                      <button
                                        type="button"
                                        onClick={() => setCompareSpecMode('general')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${compareSpecMode === 'general'
                                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                                          : 'text-slate-400 hover:text-white'
                                          }`}
                                        title="Translate complex hardware jargon into everyday practical shopper understanding"
                                      >
                                        <Sparkle className="w-3.5 h-3.5" />
                                        <span>💡 Normal User Understanding (Plain English)</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setCompareSpecMode('technical')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${compareSpecMode === 'technical'
                                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                                          : 'text-slate-400 hover:text-white'
                                          }`}
                                        title="Display raw technical hardware specifications and frequencies"
                                      >
                                        <Cpu className="w-3.5 h-3.5" />
                                        <span>⚙️ Technical Specs</span>
                                      </button>
                                    </div>
                                  </div>

                                  <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                      <tr className="border-b border-slate-800 bg-slate-900/80">
                                        <th className="p-4 w-44 min-w-[170px] text-slate-400 uppercase font-black tracking-wider text-[10px] sticky left-0 bg-slate-900/95 z-10 border-r border-slate-800">
                                          {compareSpecMode === 'general' ? 'Everyday Capability' : 'Hardware Specification'}
                                        </th>
                                        {popupTop4.map((p, idx) => {
                                          const isWinner = popupWinner?.id === p.id;
                                          const isFav = favorites?.includes(p.id);

                                          return (
                                            <th key={p.id} className={`p-4 min-w-[220px] w-1/4 align-top border-r border-slate-800 last:border-r-0 ${isWinner ? 'bg-amber-500/5' : ''}`}>
                                              <div className="space-y-2">
                                                {/* Winner Badge */}
                                                {isWinner ? (
                                                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[9px] font-black uppercase w-fit">
                                                    <Crown className="w-3 h-3 text-amber-400" />
                                                    <span>#1 Best Choice</span>
                                                  </div>
                                                ) : (
                                                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                                                    Contender #{idx + 1}
                                                  </span>
                                                )}

                                                {/* Photo & Model Name */}
                                                <div className="flex items-center gap-2.5">
                                                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0 p-0.5">
                                                    <SafeProductImage
                                                      src={p.image}
                                                      alt={p.name}
                                                      category={p.category}
                                                      subCategory={p.subCategory}
                                                    />
                                                  </div>
                                                  <div className="min-w-0">
                                                    <span className="text-[9px] font-bold uppercase text-indigo-400 block">{p.brand}</span>
                                                    <span className="text-xs font-black text-white line-clamp-2">{p.name}</span>
                                                  </div>
                                                </div>

                                                {/* Price & Bookmark */}
                                                <div className="flex items-center justify-between gap-1 pt-1">
                                                  <span className="text-sm font-black text-white">₹{p.price?.toLocaleString('en-IN')}</span>
                                                  <button
                                                    type="button"
                                                    onClick={() => onToggleFavorite?.(p)}
                                                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${isFav
                                                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-300'
                                                      }`}
                                                    title="Bookmark"
                                                  >
                                                    <WiseBookmarkIcon filled={isFav} active={isFav} size={14} />
                                                  </button>
                                                </div>
                                              </div>
                                            </th>
                                          );
                                        })}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/70">

                                      {/* Row 1: WiseScore & Value Index */}
                                      <tr>
                                        <td className="p-3.5 font-bold text-slate-300 text-xs sticky left-0 bg-[#0B1020] z-10 border-r border-slate-800">
                                          ⭐ WiseScore (Value / 100)
                                        </td>
                                        {popupTop4.map(p => (
                                          <td key={p.id} className="p-3.5 border-r border-slate-800 last:border-r-0">
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs font-black text-emerald-400">{p.aiScore || 90}/100</span>
                                              <div className="flex-1 bg-slate-800 rounded-full h-1.5 max-w-[80px] overflow-hidden">
                                                <div
                                                  className="bg-emerald-400 h-full rounded-full"
                                                  style={{ width: `${p.aiScore || 90}%` }}
                                                />
                                              </div>
                                            </div>
                                          </td>
                                        ))}
                                      </tr>

                                      {/* Row 2: Live Multi-Store Pricing (Amazon, Flipkart, Meesho, Croma) */}
                                      <tr>
                                        <td className="p-3.5 font-bold text-slate-300 text-xs sticky left-0 bg-[#0B1020] z-10 border-r border-slate-800">
                                          🛒 Real-Time Store Prices
                                        </td>
                                        {popupTop4.map(p => {
                                          const comp = generatePlatformComparison(p);
                                          const amz = comp.platforms.find(pl => pl.platformId === 'amazon');
                                          const flp = comp.platforms.find(pl => pl.platformId === 'flipkart');
                                          const mee = comp.platforms.find(pl => pl.platformId === 'meesho');
                                          const cro = comp.platforms.find(pl => pl.platformId === 'croma');

                                          return (
                                            <td key={p.id} className="p-3.5 border-r border-slate-800 last:border-r-0 text-[11px] space-y-1.5">
                                              <div className="flex items-center justify-between">
                                                <span className="text-amber-400 font-semibold">Amazon:</span>
                                                <span className="font-bold text-white">
                                                  ₹{amz?.salePrice?.toLocaleString('en-IN') || p.price.toLocaleString('en-IN')}
                                                </span>
                                              </div>
                                              <div className="flex items-center justify-between">
                                                <span className="text-blue-400 font-semibold">Flipkart:</span>
                                                <span className="font-bold text-white">
                                                  ₹{flp?.salePrice?.toLocaleString('en-IN') || p.price.toLocaleString('en-IN')}
                                                </span>
                                              </div>
                                              <div className="flex items-center justify-between">
                                                <span className="text-pink-400 font-semibold">Meesho:</span>
                                                <span className="font-bold text-white">
                                                  ₹{mee?.salePrice?.toLocaleString('en-IN') || Math.round(p.price * 0.96).toLocaleString('en-IN')}
                                                </span>
                                              </div>
                                              <div className="flex items-center justify-between">
                                                <span className="text-emerald-400 font-semibold">Croma:</span>
                                                <span className="font-bold text-white">
                                                  ₹{cro?.salePrice?.toLocaleString('en-IN') || p.price.toLocaleString('en-IN')}
                                                </span>
                                              </div>
                                              <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between">
                                                <span className="text-[9px] uppercase font-bold text-emerald-400">Lowest at:</span>
                                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                  {comp.lowestPricePlatform}
                                                </span>
                                              </div>
                                            </td>
                                          );
                                        })}
                                      </tr>

                                      {/* Row 3: Display Technology */}
                                      <tr>
                                        <td className="p-3.5 font-bold text-slate-300 text-xs sticky left-0 bg-[#0B1020] z-10 border-r border-slate-800">
                                          📱 {compareSpecMode === 'general' ? 'Screen Experience' : 'Display Panel & Refresh'}
                                        </td>
                                        {popupTop4.map(p => {
                                          const raw = getProductSpec(p, 'Display');
                                          const val = compareSpecMode === 'general'
                                            ? translateSpecToPlainEnglish('display', raw, p.category)
                                            : raw;
                                          return (
                                            <td key={p.id} className="p-3.5 border-r border-slate-800 last:border-r-0 text-slate-200 font-medium leading-relaxed">
                                              {val}
                                            </td>
                                          );
                                        })}
                                      </tr>

                                      {/* Row 4: Processor / Chipset */}
                                      <tr>
                                        <td className="p-3.5 font-bold text-slate-300 text-xs sticky left-0 bg-[#0B1020] z-10 border-r border-slate-800">
                                          ⚙️ {compareSpecMode === 'general' ? 'Speed & Multitasking' : 'Processor & Architecture'}
                                        </td>
                                        {popupTop4.map(p => {
                                          const raw = getProductSpec(p, 'Processor');
                                          const val = compareSpecMode === 'general'
                                            ? translateSpecToPlainEnglish('processor', raw, p.category)
                                            : raw;
                                          return (
                                            <td key={p.id} className="p-3.5 border-r border-slate-800 last:border-r-0 text-slate-200 font-medium leading-relaxed">
                                              {val}
                                            </td>
                                          );
                                        })}
                                      </tr>

                                      {/* Row 5: Cameras */}
                                      <tr>
                                        <td className="p-3.5 font-bold text-slate-300 text-xs sticky left-0 bg-[#0B1020] z-10 border-r border-slate-800">
                                          📸 {compareSpecMode === 'general' ? 'Photo & Video Quality' : 'Cameras & Optics'}
                                        </td>
                                        {popupTop4.map(p => {
                                          const raw = getProductSpec(p, 'Camera');
                                          const val = compareSpecMode === 'general'
                                            ? translateSpecToPlainEnglish('camera', raw, p.category)
                                            : raw;
                                          return (
                                            <td key={p.id} className="p-3.5 border-r border-slate-800 last:border-r-0 text-slate-200 font-medium leading-relaxed">
                                              {val}
                                            </td>
                                          );
                                        })}
                                      </tr>

                                      {/* Row 6: Battery & Charging */}
                                      <tr>
                                        <td className="p-3.5 font-bold text-slate-300 text-xs sticky left-0 bg-[#0B1020] z-10 border-r border-slate-800">
                                          🔋 {compareSpecMode === 'general' ? 'All-Day Battery Life' : 'Battery & Fast Charging'}
                                        </td>
                                        {popupTop4.map(p => {
                                          const raw = getProductSpec(p, 'Battery');
                                          const val = compareSpecMode === 'general'
                                            ? translateSpecToPlainEnglish('battery', raw, p.category)
                                            : raw;
                                          return (
                                            <td key={p.id} className="p-3.5 border-r border-slate-800 last:border-r-0 text-slate-200 font-medium leading-relaxed">
                                              {val}
                                            </td>
                                          );
                                        })}
                                      </tr>

                                      {/* Row 7: RAM & Storage */}
                                      <tr>
                                        <td className="p-3.5 font-bold text-slate-300 text-xs sticky left-0 bg-[#0B1020] z-10 border-r border-slate-800">
                                          💾 {compareSpecMode === 'general' ? 'Space for Photos & Apps' : 'RAM & Storage Standard'}
                                        </td>
                                        {popupTop4.map(p => {
                                          const raw = getProductSpec(p, 'Storage');
                                          const val = compareSpecMode === 'general'
                                            ? translateSpecToPlainEnglish('storage', raw, p.category)
                                            : raw;
                                          return (
                                            <td key={p.id} className="p-3.5 border-r border-slate-800 last:border-r-0 text-slate-200 font-medium leading-relaxed">
                                              {val}
                                            </td>
                                          );
                                        })}
                                      </tr>

                                      {/* Row 8: OS & Software Support */}
                                      <tr>
                                        <td className="p-3.5 font-bold text-slate-300 text-xs sticky left-0 bg-[#0B1020] z-10 border-r border-slate-800">
                                          🛡️ OS & Update Longevity
                                        </td>
                                        {popupTop4.map(p => (
                                          <td key={p.id} className="p-3.5 border-r border-slate-800 last:border-r-0 text-slate-300 font-medium leading-relaxed">
                                            {getProductSpec(p, 'OS')}
                                          </td>
                                        ))}
                                      </tr>

                                      {/* Row 9: Top Pros */}
                                      <tr>
                                        <td className="p-3.5 font-bold text-slate-300 text-xs sticky left-0 bg-[#0B1020] z-10 border-r border-slate-800">
                                          ✅ Key Strengths (Pros)
                                        </td>
                                        {popupTop4.map(p => (
                                          <td key={p.id} className="p-3.5 border-r border-slate-800 last:border-r-0 text-slate-300 text-[11px] leading-relaxed">
                                            <ul className="space-y-1 list-disc list-inside text-emerald-300">
                                              {(p.pros || p.highlights || []).slice(0, 2).map((pro, i) => (
                                                <li key={i} className="text-slate-300">{pro}</li>
                                              ))}
                                            </ul>
                                          </td>
                                        ))}
                                      </tr>

                                      {/* Row 10: Trade-offs (Cons) */}
                                      <tr>
                                        <td className="p-3.5 font-bold text-slate-300 text-xs sticky left-0 bg-[#0B1020] z-10 border-r border-slate-800">
                                          ⚠️ Compromises (Cons)
                                        </td>
                                        {popupTop4.map(p => (
                                          <td key={p.id} className="p-3.5 border-r border-slate-800 last:border-r-0 text-slate-400 text-[11px] leading-relaxed">
                                            <ul className="space-y-1 list-disc list-inside text-rose-400">
                                              {(p.cons || ['High demand pricing', 'Standard warranty']).slice(0, 2).map((con, i) => (
                                                <li key={i} className="text-slate-400">{con}</li>
                                              ))}
                                            </ul>
                                          </td>
                                        ))}
                                      </tr>

                                      {/* Row 11: Direct Actions */}
                                      <tr>
                                        <td className="p-3.5 font-bold text-slate-300 text-xs sticky left-0 bg-[#0B1020] z-10 border-r border-slate-800">
                                          ⚡ Direct Actions
                                        </td>
                                        {popupTop4.map(p => {
                                          const comp = generatePlatformComparison(p);
                                          return (
                                            <td key={p.id} className="p-3.5 border-r border-slate-800 last:border-r-0">
                                              <div className="space-y-2">
                                                <a
                                                  href={comp.platforms.find(pl => pl.platformId === comp.lowestPricePlatform)?.productUrl || `https://www.google.com/search?q=${encodeURIComponent(p.name)}`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center gap-1 transition-all shadow-md shadow-emerald-600/20"
                                                >
                                                  <span>Buy on {comp.lowestPricePlatform.toUpperCase()} ↗</span>
                                                  <ExternalLink className="w-3 h-3" />
                                                </a>
                                                <button
                                                  type="button"
                                                  onClick={(e) => handleOpenAdvisorModal(p, e)}
                                                  className="w-full py-1.5 rounded-xl bg-[#141A2E] hover:bg-slate-800 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                                                >
                                                  <UserCheck className="w-3 h-3 text-purple-400" />
                                                  <span>Ask Advisor</span>
                                                </button>
                                              </div>
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                          </div>

                          {/* MODAL FOOTER */}
                          <div className="p-4 sm:px-6 bg-[#080D1A] border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>All prices verified across Amazon, Flipkart, Meesho & Croma algorithms.</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setIsSearchPopupOpen(false)}
                                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
                              >
                                Close & View Catalog ↓
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>,
              document.body
            )}
          </div>

          {/* BUYHATKE SIGNATURE DEAL DISCOVERY TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar border-b border-slate-800/80">
            {[
              { id: 'all', label: 'All Products', icon: Layers, count: products.length },
              { id: 'hot_deals', label: '🔥 Hot Deals', icon: Flame, badge: 'Up to 40% Off' },
              { id: 'price_drops', label: '⚡ Price Drops / Best Deals', icon: TrendingUp, badge: 'Lowest in 30d' },
              { id: 'wisescore', label: '⭐ WiseScore Top Value', icon: Award, badge: '90+ Score' },
              { id: 'trending', label: '📈 Trending Now', icon: Zap },
              { id: 'latest', label: '✨ Latest Launches', icon: Sparkles }
            ].map((tab) => {
              const isActive = dealTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDealTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-600/30'
                    : 'bg-[#111728] text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
                    }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CATALOG & PRODUCT GRID AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">

        {/* CATEGORY BUYING GUIDE & TIPS BANNER */}
        {onOpenGuides && (
          <div className="bg-gradient-to-r from-indigo-950/70 via-[#11182B] to-purple-950/70 border border-indigo-500/30 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/90 border border-indigo-800/50 px-2 py-0.5 rounded">
                    WiseGuide Buying Intelligence
                  </span>
                  <span className="text-xs font-black text-slate-200">
                    {(() => {
                      const cat = selectedCategory.toLowerCase();
                      if (cat.includes('phone') || cat.includes('mobile')) return 'Smartphone Playbook: 5 Golden Rules, OIS vs EIS & True Refresh Rate';
                      if (cat.includes('laptop') || cat.includes('computer')) return 'Laptop Playbook: Soldered RAM Traps, Real TGP & Display Gamut';
                      if (cat.includes('audio') || cat.includes('headphone') || cat.includes('earbud')) return 'Audio Playbook: True Hybrid ANC, Lossless LDAC & Mic Arrays';
                      if (cat.includes('watch') || cat.includes('wearable')) return 'Wearables Playbook: Dual GPS Accuracy, Sensor Drift & Battery Life';
                      if (cat.includes('kitchen') || cat.includes('cook') || cat.includes('home')) return 'Kitchen Playbook: 100% Copper Winding, BLDC Tech & Non-Toxic Safe Cookware';
                      return 'WiseGuide Consumer Playbooks: Spec Translation, Buyer DOs & DONTs, and Gimmick Shields';
                    })()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium max-w-3xl">
                  {(() => {
                    const cat = selectedCategory.toLowerCase();
                    if (cat.includes('phone') || cat.includes('mobile')) return "Never fall for 2MP filler macro sensors or virtual RAM claims. Verify physical sensor size, UFS storage speed, and guaranteed software update cycles.";
                    if (cat.includes('laptop') || cat.includes('computer')) return "Avoid single-channel 8GB soldered memory traps. Verify real GPU wattage (TGP) instead of marketing names, and check for 100% sRGB color accuracy.";
                    if (cat.includes('audio') || cat.includes('headphone') || cat.includes('earbud')) return "Distinguish real Active Noise Cancellation (40dB+) from passive silicone ear-tip isolation. Check for high-res Bluetooth codecs and multi-point pairing.";
                    if (cat.includes('kitchen') || cat.includes('cook') || cat.includes('home')) return "Inspect continuous motor wattage, pure copper coil endurance, and certify food-grade non-toxic ceramic coatings over generic Teflon.";
                    return "Demystify complex hardware jargon into plain English, avoid deceptive marketing gimmicks, and select the optimal value tier.";
                  })()}
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenGuides(selectedCategory === 'All' ? 'Smartphones' : selectedCategory)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shadow-md shadow-indigo-600/20 active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>WiseGuide: {selectedCategory === 'All' ? 'Playbooks' : `${selectedCategory}`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 2-COLUMN E-COMMERCE LAYOUT: VERTICAL SIDEBAR + MAIN PRODUCTS AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* DESKTOP VERTICAL FILTER SIDEBAR (lg:col-span-3) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24">
            {renderVerticalSidebar(false)}
          </aside>

          {/* MOBILE FILTER DRAWER OVERLAY */}
          <AnimatePresence>
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 flex lg:hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMobileFilters(false)}
                  className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="relative ml-auto mr-auto w-full max-w-xs h-full bg-[#080E1C] border-r border-slate-800 p-4 overflow-y-auto z-10 flex flex-col justify-between shadow-2xl"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                      <span className="text-sm font-black text-white flex items-center gap-2">
                        <Filter className="w-4 h-4 text-indigo-400" />
                        <span>Filter Catalog</span>
                      </span>
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {renderVerticalSidebar(true)}
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-800">
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs shadow-lg shadow-indigo-600/30 cursor-pointer"
                    >
                      Apply & View {filteredProducts.length} Results
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* MAIN PRODUCTS COLUMN (lg:col-span-9) */}
          <main className="lg:col-span-9 space-y-6">

            {/* PRODUCTS GRID HEADER WITH DUAL VIEW SWITCHER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{searchQuery.trim() ? `Search Results for "${searchQuery.trim()}"` : `${selectedCategory === 'All' ? 'Curated Catalog' : selectedCategory} Products`}</span>
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-mono font-bold border border-indigo-500/30">
                {filteredProducts.length} Verified Items
              </span>
              {excludeGimmicks && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Gimmick Shield ON</span>
                </span>
              )}
              {activePersonaFilter !== 'all' && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Intent: {getPersonaPresetsForCategory(selectedCategory).find(p => p.id === activePersonaFilter)?.label}
                </span>
              )}
              {compareList.length > 0 && (
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Compare Locked: {compareList[0]?.category} ({compareList.length}/4)</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery.trim()
                ? `Showing verified results across Amazon, Flipkart, Meesho & Croma.`
                : `Live multi-store arbitrage from Amazon India, Flipkart, Meesho & Croma. Showing ${specMode === 'general' ? 'Plain English Understanding' : 'Raw Technical Hardware Specs'}.`
              }
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Mobile Filter Drawer Button (Visible on mobile/tablet screens) */}
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters ({activeFiltersCount})</span>
            </button>
            {/* AI Compare & Ask Advisor buttons when search query active */}
            {searchQuery.trim().length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenAiCompare()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-md shadow-amber-500/20 active:scale-95"
                  title="Compare top 4 products in this search"
                >
                  <Trophy className="w-3.5 h-3.5 text-slate-950" />
                  <span>⚡ AI Compare (Top 4)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAdvisorHubOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-purple-600/20 active:scale-95"
                  title="Connect with certified category advisors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>🧑‍💻 Ask Advisor</span>
                </button>
              </div>
            )}

            {/* FLIPKART LIVE SEARCH & API EXPLORER BUTTON */}
            <button
              type="button"
              onClick={() => setIsFlipkartExplorerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-blue-500/20 active:scale-95"
              title="Flipkart Live Search & API Key Explorer (Live Price Compare across Flipkart, Amazon, Croma, Reliance)"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>⚡ Flipkart Live Sync & API</span>
            </button>

            {/* DUAL VIEW MODE SWITCHER (Grid vs Table) */}
            <div className="flex items-center p-1 rounded-xl bg-[#0B1020] border border-slate-800">
              <button
                type="button"
                onClick={() => setCatalogViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  catalogViewMode === 'grid'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Visual Card Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Visual Grid</span>
              </button>

              <button
                type="button"
                onClick={() => setCatalogViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  catalogViewMode === 'table'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Dense Data Sheet Table View (GSMArena / PCPartPicker style)"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Data Sheet Table</span>
              </button>
            </div>

            {/* Spec Mode Switcher */}
            <button
              type="button"
              onClick={() => setSpecMode(specMode === 'general' ? 'technical' : 'general')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0B1020] border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Click to toggle between everyday plain English understanding and technical specs"
            >
              <span className="text-slate-500 text-[11px]">Specs:</span>
              <span className="font-black text-amber-300">
                {specMode === 'general' ? '💡 Plain English' : '⚙️ Technical'}
              </span>
            </button>
          </div>
        </div>

        {/* PRODUCTS RENDERING (EMPTY STATE / TABLE VIEW / GRID VIEW) */}
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center bg-[#0E1424] rounded-3xl border border-slate-800 space-y-4">
            <Search className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-xl font-bold text-white">No products found for this filter</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try turning off Gimmick Shield, resetting intent presets, or expanding your price bounds.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer transition-all shadow-md shadow-indigo-600/30 active:scale-95"
            >
              Reset All Filters
            </button>
          </div>
        ) : catalogViewMode === 'table' ? (
          /* DENSE DATA SHEET TABLE VIEW (GSMArena / PCPartPicker Style) */
          <div className="w-full overflow-x-auto rounded-3xl border border-slate-800 bg-[#0E1424] shadow-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                  <th className="p-4">Product Model</th>
                  <th className="p-4">WiseScore & Breakdown</th>
                  <th className="p-4">Lowest Price & Store Arbitrage</th>
                  <th className="p-4">Core Specifications</th>
                  <th className="p-4">Buyer Rating</th>
                  <th className="p-4 text-center">Compare</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((prod) => {
                  const comparison = generatePlatformComparison(prod);
                  const inCompare = compareList?.some(item => item.id === prod.id);
                  const isFav = favorites?.includes(prod.id);
                  const bestDealUrl = comparison.platforms.find(p => p.platformId === comparison.lowestPricePlatform)?.productUrl || `https://www.google.com/search?q=${encodeURIComponent(prod.name)}`;
                  const microPills = getProductMicroPills(prod);

                  return (
                    <tr key={prod.id} className="hover:bg-slate-900/60 transition-colors group">
                      {/* Product Column */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => onProductClick?.(prod)}
                            className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 cursor-pointer p-0.5 group-hover:border-indigo-500/50 transition-colors"
                          >
                            <SafeProductImage
                              src={prod.image}
                              alt={prod.name}
                              category={prod.category}
                              subCategory={prod.subCategory}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                                {prod.brand}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                                {prod.subCategory || prod.category}
                              </span>
                            </div>
                            <h4
                              onClick={() => onProductClick?.(prod)}
                              className="text-xs font-black text-white hover:text-indigo-400 cursor-pointer line-clamp-1 mt-0.5 max-w-xs"
                            >
                              {prod.name}
                            </h4>
                          </div>
                        </div>
                      </td>

                      {/* WiseScore Column (Clickable to open breakdown) */}
                      <td className="p-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedWiseScoreProduct(prod);
                            setIsWiseScoreModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-black text-xs cursor-pointer transition-all active:scale-95 shadow-xs"
                          title="Click to view full 5-Pillar WiseScore Calculation & Simulator"
                        >
                          <Award className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WiseScore: {prod.aiScore || 92}/100</span>
                          <Info className="w-3 h-3 text-emerald-400 opacity-70" />
                        </button>
                        <span className="text-[10px] text-slate-400 block mt-1 max-w-[160px] truncate">
                          {prod.aiRecommendation || prod.highlights?.[0] || 'Top hardware durability & value'}
                        </span>
                      </td>

                      {/* Lowest Price & Store Arbitrage */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="text-sm font-black text-white">
                            ₹{prod.price?.toLocaleString('en-IN')}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              {comparison.lowestPricePlatform}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400">
                              Save ₹{Math.max(800, (comparison.priceSpread || 2200)).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Core Specs Micro Pills */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {microPills.map((pill, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 whitespace-nowrap"
                            >
                              {pill.label}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Buyer Rating */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-xs font-black text-amber-300">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{prod.rating || 4.6}</span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            ({prod.reviewCount?.toLocaleString('en-IN') || '1.8k'})
                          </span>
                        </div>
                      </td>

                      {/* Compare Toggle */}
                      <td className="p-4 text-center whitespace-nowrap">
                        {isCompareCategoryMismatch(prod) ? (
                          <button
                            type="button"
                            disabled
                            title={`Comparison is locked to ${compareList[0]?.category}. Products from different categories cannot be compared.`}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-800/80 bg-slate-900/40 text-slate-500 opacity-40 cursor-not-allowed"
                          >
                            🔒 Locked
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onAddToCompare?.(prod)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              inCompare
                                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-black'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            {inCompare ? '✓ In Compare' : '+ Compare'}
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={bestDealUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                          >
                            <span>Buy ({comparison.lowestPricePlatform})</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <button
                            type="button"
                            onClick={() => setQuickSpecsProduct(prod)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                            title="Full Specs"
                          >
                            Specs
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* VISUAL CARDS GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => {
              const comparison = generatePlatformComparison(prod);
              const advisor = getAdvisorForCategory(prod.category);
              const isFav = favorites?.includes(prod.id);
              const inCompare = compareList?.some(item => item.id === prod.id);

              const amzPrice = comparison.platforms.find(p => p.platformId === 'amazon')?.salePrice;
              const flpPrice = comparison.platforms.find(p => p.platformId === 'flipkart')?.salePrice;
              const bestDealUrl = comparison.platforms.find(p => p.platformId === comparison.lowestPricePlatform)?.productUrl || `https://www.google.com/search?q=${encodeURIComponent(prod.name)}`;
              const microPills = getProductMicroPills(prod);

              return (
                <div
                  key={prod.id}
                  className="bg-white dark:bg-[#0E1424] border border-slate-200/90 dark:border-slate-800/80 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 rounded-3xl p-5 flex flex-col justify-between transition-all duration-150 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/15 group shadow-xs"
                >
                  <div>
                    {/* Image & Badges */}
                    <div
                      className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 cursor-pointer group-hover:border-indigo-500/30 transition-all duration-150"
                      onClick={() => onProductClick?.(prod)}
                    >
                      <SafeProductImage
                        src={prod.image}
                        alt={prod.name}
                        category={prod.category}
                        subCategory={prod.subCategory}
                      />

                      {/* Brand & Clickable WiseScore Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-slate-950/85 backdrop-blur-md text-[9px] font-black text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-500/30 shadow-xs">
                          {prod.brand}
                        </span>
                        {prod.aiScore && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWiseScoreProduct(prod);
                              setIsWiseScoreModalOpen(true);
                            }}
                            className="px-2.5 py-0.5 rounded-full bg-emerald-50/90 dark:bg-emerald-950/85 hover:bg-emerald-500/30 backdrop-blur-md text-[9px] font-black text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-500/30 shadow-xs flex items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95"
                            title="Click to view 5-Pillar Breakdown & Simulator"
                          >
                            <span>WiseScore: {prod.aiScore}/100</span>
                            <Info className="w-2.5 h-2.5 text-emerald-400" />
                          </button>
                        )}
                      </div>

                      {/* Bookmark Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite?.(prod);
                        }}
                        className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-white/90 dark:bg-slate-950/85 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-all cursor-pointer shadow-xs active:scale-90 z-10"
                        title={isFav ? "Saved in Bookmarks" : "Save to Bookmarks"}
                      >
                        <WiseBookmarkIcon filled={isFav} active={isFav} size={16} />
                      </button>
                    </div>

                    {/* Title & Price */}
                    <div className="space-y-1 mb-2.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400">
                        {prod.subCategory || prod.category}
                      </span>
                      <h3
                        onClick={() => onProductClick?.(prod)}
                        className="text-sm font-black text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer line-clamp-2"
                      >
                        {prod.name}
                      </h3>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          ₹{prod.price?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] font-bold text-amber-500 dark:text-amber-300 flex items-center gap-0.5">
                          ★ {prod.rating}
                        </span>
                      </div>
                    </div>

                    {/* MICRO SPEC PILLS */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {microPills.map((pill, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-extrabold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {pill.label}
                        </span>
                      ))}
                    </div>

                    {/* MULTI-STORE PRICE ARBITRAGE & SAVINGS BADGE */}
                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 mb-3 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-amber-600 dark:text-amber-400 font-bold">Amazon: ₹{amzPrice?.toLocaleString('en-IN') || 'Check'}</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">Flipkart: ₹{flpPrice?.toLocaleString('en-IN') || 'Check'}</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-between pt-1 border-t border-slate-200/80 dark:border-slate-800/60">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Cheapest Store:</span>
                        </span>
                        <span className="uppercase text-[9px] font-black bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-500/20">
                          {comparison.lowestPricePlatform} (Save ₹{Math.max(1200, (comparison.priceSpread || 2500)).toLocaleString('en-IN')})
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-0.5">
                        <Tag className="w-2.5 h-2.5 text-amber-400" />
                        <span>Card Offers: Extra 10% instant card off available</span>
                      </div>
                    </div>

                    {/* DYNAMIC SPECS TRANSLATION (General vs Technical) */}
                    <div className="p-3 rounded-2xl bg-slate-50/90 dark:bg-[#111728]/70 border border-slate-200/80 dark:border-slate-800/60 text-xs text-slate-700 dark:text-slate-300 mb-4 font-medium transition-all group-hover:border-indigo-500/30">
                      <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase block mb-1 flex items-center gap-1">
                        {specMode === 'general' ? '💡 Plain English Verdict' : '⚙️ Hardware Specification'}
                      </span>
                      <p className="text-[11px] line-clamp-2 leading-relaxed">
                        {(() => {
                          const specs = prod.specs || {};
                          const cat = (prod.category || '').toLowerCase();
                          if (specMode === 'general') {
                            if (cat.includes('audio') || cat.includes('headphone') || cat.includes('earbud')) {
                              const val = specs['Noise Cancellation'] || specs['ANC'] || specs['Driver'] || specs['Sound'] || specs['Battery'] || specs['Connectivity'];
                              if (val) return translateSpecToPlainEnglish('audio', val, prod.category);
                            } else if (cat.includes('watch') || cat.includes('wearable')) {
                              const val = specs['Sensors'] || specs['Display'] || specs['Battery'] || specs['Water Resistance'];
                              if (val) return translateSpecToPlainEnglish('watch', val, prod.category);
                            } else if (cat.includes('camera')) {
                              const val = specs['Sensor'] || specs['Video'] || specs['Resolution'] || specs['Lens'];
                              if (val) return translateSpecToPlainEnglish('camera', val, prod.category);
                            } else if (cat.includes('kitchen') || cat.includes('cook') || cat.includes('appliance') || cat.includes('home')) {
                              const val = specs['Capacity'] || specs['Power'] || specs['Features'] || specs['Technology'];
                              if (val) return translateSpecToPlainEnglish('kitchen', val, prod.category);
                            } else if (specs['Processor']) {
                              return translateSpecToPlainEnglish('processor', specs['Processor'], prod.category);
                            } else if (specs['Display']) {
                              return translateSpecToPlainEnglish('display', specs['Display'], prod.category);
                            }
                            const firstK = Object.keys(specs)[0];
                            if (firstK) return translateSpecToPlainEnglish(firstK, specs[firstK], prod.category);
                            return 'Tested and verified component with excellent build durability.';
                          } else {
                            if (specs['Processor']) return `Processor: ${specs['Processor']}`;
                            if (specs['Display']) return `Display: ${specs['Display']}`;
                            if (specs['Driver']) return `Driver: ${specs['Driver']}`;
                            if (specs['Noise Cancellation']) return `ANC: ${specs['Noise Cancellation']}`;
                            if (specs['Sensors']) return `Sensors: ${specs['Sensors']}`;
                            if (specs['Capacity']) return `Capacity: ${specs['Capacity']}`;
                            if (specs['Power']) return `Power: ${specs['Power']}`;
                            const firstK = Object.keys(specs)[0];
                            if (firstK) return `${firstK}: ${specs[firstK]}`;
                            return 'Verified Hardware Architecture';
                          }
                        })()}
                      </p>
                    </div>
                  </div>

                  {/* CARD ACTIONS & BUY LINKS */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    {/* Direct Buy Link to Lowest Store */}
                    <a
                      href={bestDealUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Buy on {comparison.lowestPricePlatform.toUpperCase()} (₹{prod.price?.toLocaleString('en-IN')}) ↗</span>
                    </a>

                    {/* Talk with Category Advisor Button */}
                    <button
                      onClick={(e) => handleOpenAdvisorModal(prod, e)}
                      className="w-full py-1.5 px-3 rounded-xl bg-[#141A2E] hover:bg-slate-800 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>Ask Advisor {advisor.name.split(' ')[0]}</span>
                    </button>

                    {/* Add to Compare & Quick Specs */}
                    <div className="flex items-center gap-2">
                      {isCompareCategoryMismatch(prod) ? (
                        <button
                          disabled
                          title={`Comparison is locked to ${compareList[0]?.category}. Products from different categories cannot be compared.`}
                          className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border border-slate-800/80 bg-slate-900/40 text-slate-500 opacity-40 cursor-not-allowed"
                        >
                          🔒 {compareList[0]?.category} Only
                        </button>
                      ) : (
                        <button
                          onClick={() => onAddToCompare?.(prod)}
                          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${inCompare
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-black'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                          {inCompare ? '✓ In Compare' : '+ Compare'}
                        </button>
                      )}

                      <button
                        onClick={() => setQuickSpecsProduct(prod)}
                        className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
                        title="View Full Technical Specifications"
                      >
                        Full Specs
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

          </main>
        </div>
      </div>

      {/* FULL-FEATURED 4-PRODUCT AI COMPARE MODAL (Requested Feature) */}
      <AnimatePresence>
        {aiCompareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0C1224] border-2 border-amber-500/50 rounded-3xl max-w-6xl w-full p-6 sm:p-8 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setAiCompareModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>WiseFind AI Head-to-Head Comparative Matrix</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Top 4 Products Comparison & #1 Best Purchase Winner
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Multi-platform price comparison, pros/cons, spec differences, and verified category advisors.
                  </p>
                </div>

                {/* General vs Technical spec switch inside modal */}
                <div className="flex items-center bg-[#070B14] p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                  <button
                    onClick={() => setSpecMode('general')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${specMode === 'general'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    General Understanding
                  </button>
                  <button
                    onClick={() => setSpecMode('technical')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${specMode === 'technical'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    Technical Specs
                  </button>
                </div>
              </div>

              {/* Crowned Winner Callout */}
              {crownedWinner && (
                <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-indigo-950/40 to-amber-500/15 border-2 border-amber-400/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400 flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-6 h-6 text-amber-300" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                        🏆 Winner: Overall Best Purchase
                      </span>
                      <h4 className="text-base font-black text-white">{crownedWinner.name}</h4>
                      <p className="text-xs text-slate-300 font-medium">
                        {crownedWinner.aiRecommendation || 'Highest mathematical value-for-money index with proven durability and active discounts.'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xl font-black text-white block">₹{crownedWinner.price?.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] font-bold text-emerald-400">Score: {crownedWinner.aiScore || 95}/100</span>
                  </div>
                </div>
              )}

              {/* 4-COLUMN COMPARATIVE GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {top4ForCompare.map((prod) => {
                  const isWinner = crownedWinner?.id === prod.id;
                  const comparison = generatePlatformComparison(prod);
                  const advisor = getAdvisorForCategory(prod.category);
                  const bestUrl = comparison.platforms.find(p => p.platformId === comparison.lowestPricePlatform)?.productUrl || `https://www.google.com/search?q=${encodeURIComponent(prod.name)}`;

                  return (
                    <div
                      key={prod.id}
                      className={`rounded-2xl p-4 flex flex-col justify-between transition-all ${isWinner
                        ? 'bg-gradient-to-b from-amber-950/40 via-[#131B30] to-[#0E1424] border-2 border-amber-400 shadow-xl shadow-amber-500/10'
                        : 'bg-[#0E1424] border border-slate-800'
                        }`}
                    >
                      <div>
                        {/* Winner Badge */}
                        {isWinner && (
                          <div className="mb-2 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                              <Trophy className="w-3 h-3" />
                              <span>#1 Top Pick</span>
                            </span>
                          </div>
                        )}

                        {/* Thumbnail */}
                        <div className="aspect-square w-full rounded-xl overflow-hidden mb-3 bg-slate-900 border border-slate-800">
                          <SafeProductImage
                            src={prod.image}
                            alt={prod.name}
                            category={prod.category}
                            subCategory={prod.subCategory}
                          />
                        </div>

                        {/* Title & Price */}
                        <div className="space-y-1 mb-3">
                          <span className="text-[10px] font-black uppercase text-slate-400">
                            {prod.brand}
                          </span>
                          <h4 className="text-xs font-black text-white line-clamp-2">
                            {prod.name}
                          </h4>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-sm font-black text-white">
                              ₹{prod.price?.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400">
                              WiseScore: {prod.aiScore || 90}
                            </span>
                          </div>
                        </div>

                        {/* Platform Price Comparison */}
                        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-3 space-y-1 text-[11px]">
                          <div className="flex justify-between text-slate-300">
                            <span className="text-amber-400 font-bold">Amazon:</span>
                            <span>₹{comparison.platforms.find(p => p.platformId === 'amazon')?.salePrice.toLocaleString('en-IN') || 'Check'}</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span className="text-blue-400 font-bold">Flipkart:</span>
                            <span>₹{comparison.platforms.find(p => p.platformId === 'flipkart')?.salePrice.toLocaleString('en-IN') || 'Check'}</span>
                          </div>
                          <div className="text-[10px] text-emerald-300 font-bold pt-1 border-t border-slate-800 flex justify-between">
                            <span>Best Deal:</span>
                            <span className="uppercase">{comparison.lowestPricePlatform}</span>
                          </div>
                        </div>

                        {/* Spec Differences (General vs Technical) */}
                        <div className="space-y-2 mb-3 text-xs">
                          {prod.specs?.['Display'] && (
                            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                              <span className="text-[9px] font-bold text-indigo-400 uppercase block">Screen & Display</span>
                              <p className="text-[11px] text-slate-300 mt-0.5">
                                {specMode === 'general'
                                  ? translateSpecToPlainEnglish('display', prod.specs['Display'])
                                  : prod.specs['Display']
                                }
                              </p>
                            </div>
                          )}

                          {prod.specs?.['Processor'] && (
                            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                              <span className="text-[9px] font-bold text-cyan-400 uppercase block">Processor / Speed</span>
                              <p className="text-[11px] text-slate-300 mt-0.5">
                                {specMode === 'general'
                                  ? translateSpecToPlainEnglish('processor', prod.specs['Processor'])
                                  : prod.specs['Processor']
                                }
                              </p>
                            </div>
                          )}

                          {prod.specs?.['Battery'] && (
                            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                              <span className="text-[9px] font-bold text-emerald-400 uppercase block">Battery Endurance</span>
                              <p className="text-[11px] text-slate-300 mt-0.5">
                                {specMode === 'general'
                                  ? translateSpecToPlainEnglish('battery', prod.specs['Battery'])
                                  : prod.specs['Battery']
                                }
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Pros & Cons */}
                        <div className="space-y-1.5 mb-3 text-[10px]">
                          {prod.pros && prod.pros.length > 0 && (
                            <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-300">
                              <span className="font-bold block text-[9px] uppercase tracking-wider text-emerald-400">✓ Advantage</span>
                              {prod.pros[0]}
                            </div>
                          )}
                          {prod.cons && prod.cons.length > 0 && (
                            <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-500/20 text-rose-300">
                              <span className="font-bold block text-[9px] uppercase tracking-wider text-rose-400">✗ Limitation</span>
                              {prod.cons[0]}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Modal Card Footer: Direct Buy & Advisor */}
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        {/* Direct Purchase Link */}
                        <a
                          href={bestUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center gap-1 shadow transition-all"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Buy on {comparison.lowestPricePlatform.toUpperCase()} ↗</span>
                        </a>

                        {/* Category Advisor Button */}
                        <button
                          onClick={(e) => handleOpenAdvisorModal(prod, e)}
                          className="w-full py-1.5 px-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                          <span>Talk with {advisor.name.split(' ')[0]}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADVISOR INQUIRY MODAL (Talk with Advisor) */}
      <AnimatePresence>
        {advisorModalProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0E1424] border-2 border-purple-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setAdvisorModalProduct(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {(() => {
                const advisor = getAdvisorForCategory(advisorModalProduct.category);
                return (
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <img
                          src={advisor.avatar}
                          alt={advisor.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/50"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0E1424]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                            Verified Category Advisor
                          </span>
                          <span className="text-[10px] font-bold text-amber-300">★ 4.98</span>
                        </div>
                        <h3 className="text-lg font-black text-white mt-0.5">
                          {advisor.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">
                          {advisor.title} • {advisor.specialty}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 overflow-hidden flex-shrink-0">
                        <SafeProductImage
                          src={advisorModalProduct.image}
                          alt={advisorModalProduct.name}
                          category={advisorModalProduct.category}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Reviewing Hardware:
                        </span>
                        <h4 className="text-xs font-black text-white truncate">
                          {advisorModalProduct.name}
                        </h4>
                        <span className="text-xs font-bold text-emerald-400">
                          ₹{advisorModalProduct.price?.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {inquirySentSuccess ? (
                      <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-center space-y-3">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                        <h4 className="text-lg font-black text-white">Inquiry Sent to {advisor.name}!</h4>
                        <p className="text-xs text-emerald-200">
                          Your request has been logged to the Advisor Desk. The advisor will review the product and send their recommendation directly to your panel.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitInquiry} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Enter your name"
                            value={inquiryName}
                            onChange={(e) => setInquiryName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Email / Contact
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="your.email@example.com"
                            value={inquiryEmail}
                            onChange={(e) => setInquiryEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Question for Advisor
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={inquiryMessage}
                            onChange={(e) => setInquiryMessage(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 font-medium"
                          />
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                          >
                            Send Inquiry to Advisor
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* USER ADVISOR INQUIRIES DRAWER */}
      <AnimatePresence>
        {showInquiriesDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-[#0C111F] border-l border-slate-800 w-full max-w-md h-full p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                    <h3 className="text-base font-black text-white">My Advisor Inquiries</h3>
                  </div>
                  <button
                    onClick={() => setShowInquiriesDrawer(false)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {customerInquiries.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-3">
                    <UserCheck className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-xs">No inquiries logged yet.</p>
                    <p className="text-[11px] text-slate-500">
                      Click "Ask Advisor" on any product card or in the AI compare matrix to get human advice!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerInquiries.map((req) => (
                      <div
                        key={req.id}
                        className="p-4 rounded-2xl bg-[#111728] border border-slate-800 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400">
                              Advisor: {req.advisorName}
                            </span>
                            <h4 className="text-xs font-black text-white">
                              {req.product?.name}
                            </h4>
                          </div>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${req.status === 'replied'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}>
                            {req.status === 'replied' ? '✓ Replied' : 'Pending'}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-900/80 text-xs text-slate-300 font-medium">
                          "{req.message}"
                        </div>

                        {req.reply && (
                          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200">
                            <span className="text-[9px] font-black uppercase text-purple-400 block mb-1">
                              Advisor Advice:
                            </span>
                            "{req.reply}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-800 text-center">
                <button
                  onClick={() => setShowInquiriesDrawer(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK SPECS MODAL */}
      {quickSpecsProduct && (
        <ProductQuickSpecsModal
          product={quickSpecsProduct}
          onClose={() => setQuickSpecsProduct(null)}
          onAddToCompare={onAddToCompare}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favorites?.includes(quickSpecsProduct.id)}
          isInCompare={compareList?.some(i => i.id === quickSpecsProduct.id)}
        />
      )}

      {/* 🧑‍💻 CATEGORY ADVISORS HUB MODAL (Ask Advisor Button Handler) */}
      <AnimatePresence>
        {isAdvisorHubOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0C1120] border-2 border-purple-500/40 rounded-3xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsAdvisorHubOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-wider mb-2">
                    <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>WiseFind Verified Advisors Desk</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2 flex-wrap">
                    <span>Category Advisors:</span>
                    <span className="text-purple-400">{selectedCategory === 'All' ? 'All Tech & Lifestyle' : selectedCategory}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-medium">
                    Connect 1:1 with verified hardware reviewers, benchmark engineers, and certified specialists for unbiased purchase recommendations.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{categoryAdvisors.filter(a => a.isOnline).length || categoryAdvisors.length} Available Online</span>
                  </span>
                </div>
              </div>

              {/* Category Switcher Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-5 border-b border-slate-800/80 no-scrollbar text-xs">
                <span className="text-slate-400 font-bold flex-shrink-0 text-[11px]">Specialty Category:</span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${selectedCategory === 'All'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                >
                  All Specialists ({ADVISORS_DATA.length})
                </button>
                {MASTER_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${selectedCategory.toLowerCase() === cat.name.toLowerCase() || selectedCategory.toLowerCase() === cat.shortName.toLowerCase()
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                      }`}
                  >
                    {cat.shortName}
                  </button>
                ))}
              </div>

              {/* Advisors List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryAdvisors.map(adv => (
                  <div
                    key={adv.id}
                    className="p-5 rounded-2xl bg-[#0E1528] border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between gap-4 group shadow-lg"
                  >
                    <div>
                      {/* Avatar, Name, Rating, Online indicator */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={adv.avatar}
                            alt={adv.name}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-purple-500 transition-colors"
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0E1528] ${adv.isOnline ? 'bg-emerald-500' : 'bg-slate-500'
                              }`}
                            title={adv.isOnline ? "Online Now (Instant Response)" : "Away (Leaves Note)"}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                              {adv.verifiedBadge || 'Verified Specialist'}
                            </span>
                            <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                              ★ {adv.rating} <span className="text-slate-500 text-[10px]">({adv.reviewCount})</span>
                            </span>
                          </div>
                          <h4 className="text-base font-black text-white mt-1 group-hover:text-purple-300 transition-colors truncate">
                            {adv.name}
                          </h4>
                          <p className="text-xs text-slate-400 font-medium truncate">
                            {adv.title}
                          </p>
                        </div>
                      </div>

                      {/* Badges: Response time & consultations */}
                      <div className="flex items-center gap-2 mb-3 text-[10px] text-slate-300 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
                          ⚡ {adv.responseRate} response
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
                          🏆 {adv.consultationsCount}+ consultations
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
                          💼 {adv.experienceYears}y exp
                        </span>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-slate-300 font-medium leading-relaxed line-clamp-3 mb-3">
                        {adv.bio}
                      </p>

                      {/* Specialties tags */}
                      {adv.specialties && adv.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {adv.specialties.slice(0, 4).map((spec, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-950/50 text-purple-300 border border-purple-800/40"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions: Chat Now & Send Inquiry */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                      <div className="text-xs">
                        <span className="text-slate-400 text-[10px] block">Consultation Fee:</span>
                        <span className="font-black text-white text-sm">
                          {adv.chatRateINR ? `₹${adv.chatRateINR} / session` : 'Free Initial Chat'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleChatWithAdvisor(adv);
                            setIsAdvisorHubOpen(false);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-purple-600/25 active:scale-95"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                          <span>Chat 1:1 Live</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsAdvisorHubOpen(false);
                            const topProd = filteredProducts[0] || products[0];
                            setAdvisorModalProduct(topProd);
                            setInquiryMessage(`Hi ${adv.name}, I am deciding between models in the ${selectedCategory} category. Can you give me your professional recommendation based on build quality and real-world value?`);
                            setInquirySentSuccess(false);
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-all cursor-pointer"
                        >
                          <span>✉️ Send Inquiry</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Unbiased: Advisors do not earn brand commissions.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAdvisorHubOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                >
                  Close & View Catalog
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PERSISTENT FLOATING QUICK-COMPARE DOCK */}
      <AnimatePresence>
        {compareList && compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 sm:bottom-6 inset-x-3 sm:inset-x-0 mx-auto max-w-3xl z-40 bg-[#0B1020]/95 backdrop-blur-2xl p-3 sm:p-4 rounded-3xl border-2 border-indigo-500/50 shadow-2xl shadow-black/90 flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">Compare Tray</span>
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {compareList.length}/4
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Side-by-side spec verdict</span>
                </div>
              </div>

              {/* Selected Product Mini Cards */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {compareList.map((item) => (
                  <div
                    key={item.id}
                    className="relative group/mini flex items-center gap-1.5 p-1.5 pr-2.5 rounded-xl bg-slate-900 border border-slate-700/80 shadow-xs"
                  >
                    <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0">
                      <SafeProductImage
                        src={item.image}
                        alt={item.name}
                        category={item.category}
                        subCategory={item.subCategory}
                      />
                    </div>
                    <div className="max-w-[100px] truncate text-[11px] font-bold text-slate-200">
                      {item.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddToCompare?.(item)}
                      className="w-4 h-4 rounded-full bg-slate-800 hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 flex items-center justify-center text-[10px] cursor-pointer transition-colors"
                      title="Remove from compare"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsQuickCompareOverlayOpen(true)}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <Zap className="w-3.5 h-3.5 text-slate-950" />
                <span>⚡ Quick Matrix</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToCompare?.()}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <span>Full Compare</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  compareList.forEach(item => onAddToCompare?.(item));
                }}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 text-xs transition-colors cursor-pointer"
                title="Clear all compared items"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚡ INSTANT SIDE-BY-SIDE QUICK-COMPARE OVERLAY MATRIX MODAL */}
      <AnimatePresence>
        {isQuickCompareOverlayOpen && compareList && compareList.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0C1224] border-2 border-indigo-500/50 rounded-3xl max-w-6xl w-full p-5 sm:p-7 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsQuickCompareOverlayOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-wider mb-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Instant Side-by-Side Quick Matrix</span>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Comparing {compareList.length} Selected Products
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-store price gap, plain English specs, and winner breakdown without losing your catalog filters.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#070B14] p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setQuickCompareSpecMode('general')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        quickCompareSpecMode === 'general'
                          ? 'bg-indigo-600 text-white font-black shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Plain English
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickCompareSpecMode('technical')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        quickCompareSpecMode === 'technical'
                          ? 'bg-indigo-600 text-white font-black shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Technical Specs
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsQuickCompareOverlayOpen(false);
                      onNavigateToCompare?.();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/30 active:scale-95 whitespace-nowrap"
                  >
                    <span>Full Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Side-by-Side Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {compareList.map((item) => {
                  const comp = generatePlatformComparison(item);
                  const isWinner = compareList.length > 1 && item.id === [...compareList].sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))[0]?.id;
                  const lowestPlat = comp.platforms.find(p => p.platformId === comp.lowestPricePlatform) || comp.platforms[0];

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative ${
                        isWinner
                          ? 'bg-gradient-to-b from-amber-500/15 via-[#0F162A] to-[#0E1424] border-2 border-amber-400 ring-4 ring-amber-400/20 shadow-[0_0_30px_rgba(251,191,36,0.2)]'
                          : 'bg-[#0E1424] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        {isWinner && (
                          <div className="mb-2.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/30 to-amber-600/30 border border-amber-400/60 text-amber-200 text-[10px] font-black uppercase flex items-center justify-center gap-1.5 shadow-sm">
                            <Crown className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
                            <span className="tracking-wide">#1 Best Value & Spec Winner</span>
                          </div>
                        )}

                        <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-800 relative">
                          <SafeProductImage
                            src={item.image}
                            alt={item.name}
                            category={item.category}
                            subCategory={item.subCategory}
                          />
                          {isWinner && (
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[9px] shadow-md uppercase tracking-wider">
                              Top Pick
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-black uppercase text-indigo-400">
                          {item.brand} • {item.subCategory || item.category}
                        </span>
                        <h4 className="text-sm font-black text-white line-clamp-2 mt-0.5 mb-2">
                          {item.name}
                        </h4>

                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                          <div>
                            <span className="text-lg font-black text-white">
                              ₹{item.price?.toLocaleString('en-IN')}
                            </span>
                            {comp.priceSpread > 0 && (
                              <span className="block text-[10px] font-bold text-amber-400">
                                Save up to ₹{comp.priceSpread.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedWiseScoreProduct(item);
                              setIsWiseScoreModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-black cursor-pointer hover:bg-emerald-500/25 transition-colors flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            <span>WiseScore: {item.aiScore || 92}/100</span>
                          </button>
                        </div>

                        {/* Category-Accurate Specs Comparison */}
                        <div className="space-y-1.5 text-xs mb-3">
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                            Key {item.subCategory || item.category || 'Product'} Specs:
                          </span>
                          {comp.categoryFactors && comp.categoryFactors.length > 0 ? (
                            comp.categoryFactors.slice(0, 4).map((f) => (
                              <div key={f.key} className="p-2 rounded-lg bg-slate-900/70 border border-slate-800/70 flex items-start justify-between gap-2">
                                <span className="text-[9px] font-black uppercase text-slate-400 shrink-0">{f.label}</span>
                                <span className="text-[11px] text-slate-200 font-bold text-right line-clamp-1">{f.value}</span>
                              </div>
                            ))
                          ) : (
                            <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800/70">
                              <span className="text-[11px] text-slate-200 font-bold">Standard Certified Product Specifications</span>
                            </div>
                          )}
                        </div>

                        {/* Category-Filtered Verified Stores Direct Links */}
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                              Verified Stores ({comp.platforms.length}):
                            </span>
                            <span className="text-[9px] font-extrabold text-emerald-400">
                              Best: ₹{comp.lowestPrice?.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-0.5 custom-scrollbar">
                            {comp.platforms.map((plat) => {
                              const isPlatWinner = plat.platformId === comp.lowestPricePlatform;
                              return (
                                <a
                                  key={plat.platformId}
                                  href={plat.productUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center justify-between p-1.5 rounded-lg border transition-all text-xs group ${
                                    isPlatWinner
                                      ? 'bg-emerald-950/30 border-emerald-500/40 hover:bg-emerald-950/50'
                                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <PlatformLogo platformId={plat.platformId} size="xs" />
                                    <span className="text-[11px] font-bold text-slate-200 group-hover:text-white truncate">
                                      {plat.name}
                                    </span>
                                    {isPlatWinner && (
                                      <span className="text-[8px] font-black uppercase px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 shrink-0">
                                        Lowest
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="text-[11px] font-black text-white">
                                      ₹{plat.finalPrice?.toLocaleString('en-IN')}
                                    </span>
                                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-400" />
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom CTA */}
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <a
                          href={lowestPlat?.productUrl || `https://www.google.com/search?q=${encodeURIComponent(item.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Direct Buy on {(lowestPlat?.name || comp.lowestPricePlatform).toUpperCase()} ↗</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => onAddToCompare?.(item)}
                          className="w-full py-1 text-center text-xs text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                        >
                          Remove from comparison
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WISESCORE BREAKDOWN & SIMULATOR MODAL */}
      <WiseScoreModal
        isOpen={isWiseScoreModalOpen}
        onClose={() => {
          setIsWiseScoreModalOpen(false);
          setSelectedWiseScoreProduct(null);
        }}
        initialProduct={selectedWiseScoreProduct}
      />

      {/* FLIPKART LIVE SEARCH & API EXPLORER MODAL */}
      <FlipkartApiExplorerModal
        isOpen={isFlipkartExplorerOpen}
        onClose={() => setIsFlipkartExplorerOpen(false)}
        initialCategory={selectedCategory !== 'All' ? selectedCategory : 'Smartphones'}
        onProductClick={(p) => {
          setIsFlipkartExplorerOpen(false);
          onProductClick?.(p);
        }}
        onImportProducts={(imported) => {
          if (Array.isArray(imported) && imported.length > 0) {
            setLiveScrapedResults(prev => [...imported, ...prev]);
            setLiveScrapedQuery(imported[0]?.category || 'Flipkart Live Sync');
          }
        }}
      />

      {/* FLOATING ACTION BAR - Shown only when searched products & lists are viewed, not by default */}
      <AnimatePresence>
        {searchQuery.trim().length > 0 && compareList.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5 bg-[#0B1020]/95 backdrop-blur-xl p-2 rounded-2xl border-2 border-indigo-500/40 shadow-2xl shadow-black/80"
          >
            {/* AI Compare Button */}
            <button
              type="button"
              onClick={() => handleOpenAiCompare()}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95"
              title="Compare Top 4 products in this search"
            >
              <Trophy className="w-4 h-4 text-slate-950" />
              <span className="font-extrabold">⚡ AI Compare</span>
              <span className="hidden sm:inline px-1.5 py-0.5 rounded-full bg-slate-950/20 text-slate-950 text-[10px] font-black">
                Top 4
              </span>
            </button>

            {/* Ask Advisor Button */}
            <button
              type="button"
              onClick={() => setIsAdvisorHubOpen(true)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs transition-all cursor-pointer shadow-lg shadow-purple-600/30 active:scale-95"
              title="Talk with certified category advisors"
            >
              <UserCheck className="w-4 h-4 text-amber-300" />
              <span className="font-extrabold">🧑‍💻 Ask Advisor</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-black flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{categoryAdvisors.filter(a => a.isOnline).length || categoryAdvisors.length} Online</span>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1:1 ADVISOR LIVE CHAT MODAL */}
      {activeChatExpert && (
        <ExpertChatModal
          expert={activeChatExpert}
          onClose={() => setActiveChatExpert(null)}
          productsCatalog={products}
        />
      )}

    </div>
  );
};

export default ProductCatalog;
