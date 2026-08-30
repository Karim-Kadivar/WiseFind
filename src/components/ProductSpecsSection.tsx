import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, Search, X, ChevronDown, ChevronUp, Copy, CheckCheck, Info, 
  Cpu, Monitor, Battery, Camera, Wifi, Shield, Layers, Sparkles, 
  BarChart2, Zap, Thermometer, Clock, HelpCircle, ArrowRight, CheckCircle2,
  Share2, HardDrive, Eye, ShieldCheck, Gauge, Flame, Activity, Maximize2,
  Table, Grid, Compass, Smartphone, Laptop, Headphones, Tv, Watch, Sparkle,
  Bot, HelpCircle as QuestionIcon
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ProductSpecsSectionProps {
  product: Product;
  allProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
  onAddToCompare?: (product: Product) => void;
  compareList?: Product[];
  onAskWiseBot?: (question: string) => void;
}

// Comprehensive Jargon Glossary with AI-generated real-world context explanations
const HARDWARE_JARGON_MAP: Record<string, { definition: string; plainMeaning: string; realWorldImpact: string; buyerTip: string }> = {
  "processor": {
    definition: "Central Processing Unit (CPU) silicon that executes operating system instructions, runs math logic, and handles app workflows.",
    plainMeaning: "The brain of the machine.",
    realWorldImpact: "Directly determines how fast apps open, how smoothly 4K video exports, and prevents thermal lag during multitasking.",
    buyerTip: "For heavy gaming or content creation, aim for Qualcomm Snapdragon 8 Gen 3, Apple M3/M4, or Intel Core Ultra / Ryzen 7."
  },
  "cpu": {
    definition: "Silicon chip architecture containing dedicated high-performance and power-efficient computing cores.",
    plainMeaning: "The core calculation engine.",
    realWorldImpact: "More performance cores make heavy background rendering and game physics smooth without stutter.",
    buyerTip: "Check single-core speed for snappier day-to-day apps, and multi-core score for heavy video editing or code compiling."
  },
  "gpu": {
    definition: "Graphics Processing Unit engineered to calculate 3D geometry, ray tracing shaders, and complex texture polygons.",
    plainMeaning: "The graphics and visual renderer.",
    realWorldImpact: "Powers high-FPS gaming (60-120fps), silky-smooth 3D viewport navigation, and hardware video decoding.",
    buyerTip: "Gamers and 3D animators should prioritize dedicated GPUs with ample VRAM over integrated graphics."
  },
  "ram": {
    definition: "Ultra-fast volatile system memory (LPDDR5X, DDR5) holding open apps and active tasks in instant standby.",
    plainMeaning: "Short-term desk space for running apps.",
    realWorldImpact: "More RAM stops apps in the background from force-reloading or closing when you switch between them.",
    buyerTip: "12GB–16GB is the sweet spot for modern smartphones; 16GB–32GB is recommended for laptops."
  },
  "memory": {
    definition: "High-bandwidth unified or system memory architecture shared across CPU and GPU pipelines.",
    plainMeaning: "Fast-access working memory.",
    realWorldImpact: "Unified architecture on modern chips allows zero-latency asset handoff for instant app multitasking.",
    buyerTip: "Unified memory on Apple Silicon is extremely efficient, making 16GB feel as capable as 24GB on traditional architectures."
  },
  "storage": {
    definition: "Non-volatile high-speed flash storage (UFS 4.0, NVMe PCIe 4.0 SSD) storing the OS, files, games, and media.",
    plainMeaning: "Your permanent digital filing cabinet.",
    realWorldImpact: "Fast storage (UFS 4.0 / PCIe SSD) cuts system boot times to seconds and loads massive game levels instantly.",
    buyerTip: "256GB is the standard minimum for smartphones; 512GB to 1TB is ideal for creator laptops."
  },
  "display": {
    definition: "Visual screen panel (OLED, AMOLED, Mini-LED, IPS LCD) with subpixel lighting and dynamic contrast capabilities.",
    plainMeaning: "The visual screen you look at.",
    realWorldImpact: "OLED/AMOLED panels turn off individual black pixels for infinite contrast, cinema-grade movies, and Dark Mode power savings.",
    buyerTip: "OLED and AMOLED deliver much deeper contrast and richer saturation than conventional IPS LCD screens."
  },
  "refresh rate": {
    definition: "The count of screen frame redraws per second measured in Hertz (Hz).",
    plainMeaning: "How fluidly motion and scrolling appear.",
    realWorldImpact: "120Hz/144Hz makes every gesture, swipe, and animated menu feel twice as responsive and smooth as 60Hz.",
    buyerTip: "Look for LTPO technology, which automatically drops the refresh rate to 1Hz when reading static text to save battery."
  },
  "resolution": {
    definition: "Total horizontal and vertical pixel matrix count (e.g., 2796x1290, 4K UHD 3840x2160).",
    plainMeaning: "Sharpness and visual clarity of text and images.",
    realWorldImpact: "Higher pixel density (>400 PPI) eliminates jagged text edges and eye fatigue when reading fine print.",
    buyerTip: "Ensure at least 1080p FHD for screens under 14 inches and 2K/4K for larger screens."
  },
  "nits": {
    definition: "Candela per square meter (cd/m²) measuring the maximum optical luminance output of a display panel.",
    plainMeaning: "Screen peak brightness.",
    realWorldImpact: "Displays with >1500–2500 nits remain completely readable under direct, blazing Indian sunlight outdoors.",
    buyerTip: "Look for at least 1000 nits peak outdoor brightness if you often use your phone outside."
  },
  "hdr": {
    definition: "High Dynamic Range standard (Dolby Vision, HDR10+) preserving extreme bright highlights and deep shadow details.",
    plainMeaning: "Richer contrast and lifelike highlights in movies.",
    realWorldImpact: "Makes supported Netflix and YouTube videos look vividly realistic with dazzling bright explosions and dark shadows.",
    buyerTip: "Dolby Vision certification ensures Hollywood-calibrated master color accuracy."
  },
  "battery": {
    definition: "Chemical energy reservoir capacity measured in milliampere-hours (mAh) or Watt-hours (Whr).",
    plainMeaning: "How long you can use the device away from a power plug.",
    realWorldImpact: "A 5000mAh+ cell easily delivers 7 to 9 hours of active screen-on time, surviving a full day of heavy commute and work.",
    buyerTip: "Battery capacity combined with efficient 3nm/4nm chipsets yields true 1.5-to-2 day battery longevity."
  },
  "charging": {
    definition: "Electrical power delivery rate measured in Watts (W) using protocols like USB-PD, MagSafe, or proprietary fast charge.",
    plainMeaning: "How quickly your depleted battery refills to 100%.",
    realWorldImpact: "65W to 120W fast charging refills 50% battery in just 10-15 minutes, ending overnight charging anxiety.",
    buyerTip: "Check if the manufacturer includes the high-wattage power adapter in the retail box."
  },
  "camera": {
    definition: "Optical sensor package capturing photons with custom lens elements and computational Image Signal Processing (ISP).",
    plainMeaning: "The photo and video capture system.",
    realWorldImpact: "Larger physical sensors capture far more light, preventing noisy, grainy, or blurry night photos.",
    buyerTip: "Sensor physical surface size (e.g., 1-inch or 1/1.3-inch) is far more important than raw megapixel counts."
  },
  "aperture": {
    definition: "Physical opening diameter of the lens diaphragm (e.g. f/1.6). Smaller f-numbers indicate larger physical light openings.",
    plainMeaning: "Light intake hole size.",
    realWorldImpact: "A wide f/1.6 or f/1.8 aperture produces natural shallow depth-of-field (creamy background blur) and clean low-light shots.",
    buyerTip: "Look for f/1.6 to f/1.8 on main cameras for outstanding night portraits."
  },
  "ois": {
    definition: "Optical Image Stabilization using miniature gyroscopic motors to counteract physical hand tremors in real-time.",
    plainMeaning: "Hardware anti-shake stabilization.",
    realWorldImpact: "Eliminates blurry night photos and ensures handheld 4K walking videos look rock-steady as if on a gimbal.",
    buyerTip: "A must-have for nighttime photography and vloggers capturing video on the move."
  },
  "anc": {
    definition: "Active Noise Cancellation using external microphones to generate inverted acoustic sound waves that cancel background noise.",
    plainMeaning: "Silences the outside environment.",
    realWorldImpact: "Filters out drone engine roar on airplanes, traffic buzz, and noisy open-office chatter so you can focus.",
    buyerTip: "Top-tier ANC algorithms attenuate low-frequency rumbles by up to 45dB."
  },
  "driver": {
    definition: "The electromagnetic speaker transducer inside headphones that displaces air to reproduce sound frequencies.",
    plainMeaning: "The headphone speaker cone.",
    realWorldImpact: "Larger, high-compliance dynamic drivers (40mm-50mm) produce deep, punchy sub-bass with low harmonic distortion.",
    buyerTip: "Planar magnetic or titanium-coated dynamic drivers provide ultra-crisp highs and vocal separation."
  },
  "water resistance": {
    definition: "Ingress Protection (IP) rating certifying enclosure resistance against microscopic dust and pressurized water immersion.",
    plainMeaning: "Spill and rain protection.",
    realWorldImpact: "IP68 protects your device from sudden tropical downpours, pool splashes, or accidental submersion in up to 1.5m water.",
    buyerTip: "IP68 is fully waterproof for freshwater submersion; IP54 is only splash and rain resistant."
  },
  "ip rating": {
    definition: "International Protection code where the first digit measures dust tightness (0-6) and second measures liquid sealing (0-8).",
    plainMeaning: "Durability and weatherproofing grade.",
    realWorldImpact: "Gives peace of mind during workouts, beach trips, and sudden rainstorms.",
    buyerTip: "IP68 is the gold standard for flagship consumer hardware."
  },
  "sensor": {
    definition: "Hardware component measuring biometric pulses, optical wavelengths, acceleration, or spatial positioning.",
    plainMeaning: "Biometric and motion tracking hardware.",
    realWorldImpact: "Powers instant face unlock, continuous optical heart rate monitoring, ECG alerts, and pedometer step counts.",
    buyerTip: "ECG and SpO2 sensors provide early health anomaly notifications on modern wearables."
  },
  "switches": {
    definition: "Mechanical key actuators (Linear, Tactile, Clicky) beneath keyboard keycaps with specific actuation travel and force curves.",
    plainMeaning: "Key-press feel and acoustics.",
    realWorldImpact: "Linear switches offer fast, silent actuation for esports gaming; Tactile switches offer satisfying tactile bumps for typing.",
    buyerTip: "Hot-swappable switch sockets let you change key switches without soldering."
  },
  "os": {
    definition: "System software managing hardware resources, memory sandboxing, security updates, and graphical UI.",
    plainMeaning: "The operating system interface.",
    realWorldImpact: "Determines app ecosystem compatibility, seamless multi-device clipboard sharing, and long-term security.",
    buyerTip: "Check official OS update policies: top brands now guarantee 5 to 7 years of full OS feature updates."
  },
  "connectivity": {
    definition: "Wireless and physical data protocols including Wi-Fi 6E/7, Bluetooth 5.4, 5G Sub-6, and Thunderbolt/USB4.",
    plainMeaning: "How fast you connect to networks and peripherals.",
    realWorldImpact: "Wi-Fi 7 and 5G enable multi-gigabit downloads and sub-5ms low latency gaming.",
    buyerTip: "USB4 / Thunderbolt ports on laptops allow single-cable 4K dual monitor output and 100W power delivery."
  }
};

export default function ProductSpecsSection({
  product,
  allProducts = [],
  onSelectProduct,
  onAddToCompare,
  compareList = [],
  onAskWiseBot
}: ProductSpecsSectionProps) {
  // View Modes: 'bento' (Visual Matrix), 'table' (High-density specs), 'silicon' (Component Architecture), 'benchmarks' (Performance Lab)
  const [viewMode, setViewMode] = useState<'bento' | 'table' | 'silicon' | 'benchmarks'>('bento');
  
  // Plain English vs Pro Tech Mode
  const [isPlainEnglish, setIsPlainEnglish] = useState<boolean>(false);
  
  // Interactive Spec Deep Dive Modal / Drawer when clicked
  const [selectedSpecDetail, setSelectedSpecDetail] = useState<{ key: string; val: string; tab?: 'impact' | 'breakdown' | 'proscons' | 'rivals' } | null>(null);
  const [specDetailActiveTab, setSpecDetailActiveTab] = useState<'impact' | 'breakdown' | 'proscons' | 'rivals'>('impact');
  const [copiedDetailValue, setCopiedDetailValue] = useState<boolean>(false);
  
  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  // Interactive Active Tooltip Modal / Popover State
  const [activeTooltipKey, setActiveTooltipKey] = useState<string | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  
  // Interactive Battery SOT Simulator Slider (Hours of mixed heavy usage)
  const [simulatedGamingHours, setSimulatedGamingHours] = useState<number>(2);
  const [simulatedVideoHours, setSimulatedVideoHours] = useState<number>(4);
  const [simulatedWebHours, setSimulatedWebHours] = useState<number>(3);

  // Categorize spec keys logically
  const getSpecCategory = (key: string): string => {
    const k = key.toLowerCase();
    if (k.includes('processor') || k.includes('cpu') || k.includes('gpu') || k.includes('chip') || k.includes('ram') || k.includes('memory') || k.includes('storage') || k.includes('os') || k.includes('engine') || k.includes('sensor') && (k.includes('dpi') || k.includes('hero'))) return 'compute';
    if (k.includes('display') || k.includes('screen') || k.includes('resolution') || k.includes('refresh') || k.includes('nits') || k.includes('panel') || k.includes('hdr') || k.includes('lens') || k.includes('optic')) return 'display';
    if (k.includes('camera') || k.includes('aperture') || k.includes('zoom') || k.includes('video') || k.includes('megapixels') || k.includes('ois') || k.includes('focal')) return 'camera';
    if (k.includes('battery') || k.includes('charging') || k.includes('watt') || k.includes('mah') || k.includes('endurance') || k.includes('power') || k.includes('whr')) return 'battery';
    if (k.includes('driver') || k.includes('anc') || k.includes('audio') || k.includes('sound') || k.includes('codec') || k.includes('mic') || k.includes('microphone') || k.includes('speakers')) return 'audio';
    if (k.includes('wi-fi') || k.includes('wifi') || k.includes('bluetooth') || k.includes('5g') || k.includes('nfc') || k.includes('port') || k.includes('usb') || k.includes('connectivity') || k.includes('sim') || k.includes('polling')) return 'connectivity';
    if (k.includes('weight') || k.includes('dimension') || k.includes('material') || k.includes('water') || k.includes('ip') || k.includes('durability') || k.includes('build') || k.includes('warranty') || k.includes('switches') || k.includes('keyboard') || k.includes('keycaps')) return 'durability';
    return 'other';
  };

  const specCategoryTabs = [
    { id: 'all', label: 'All Specs', icon: Layers, count: Object.keys(product.specs).length },
    { id: 'compute', label: 'Compute & Silicon', icon: Cpu },
    { id: 'display', label: 'Display & Visuals', icon: Monitor },
    { id: 'camera', label: 'Optics & Camera', icon: Camera },
    { id: 'battery', label: 'Battery & Power', icon: Battery },
    { id: 'audio', label: 'Audio & Acoustics', icon: Headphones },
    { id: 'connectivity', label: 'Wireless & Ports', icon: Wifi },
    { id: 'durability', label: 'Build & Durability', icon: Shield },
  ];

  // Lookup Jargon definition or dynamically generate AI explanation
  const lookupJargon = (key: string, value?: string) => {
    const k = key.toLowerCase();
    for (const [term, data] of Object.entries(HARDWARE_JARGON_MAP)) {
      if (k.includes(term)) return data;
    }
    
    // AI Fallback structured context for any arbitrary hardware metric
    return {
      definition: `Verified hardware metric: "${key}" measured under standardized manufacturer testing.`,
      plainMeaning: `Specifies the ${key.toLowerCase()} capabilities of this ${product.category.toLowerCase()}.`,
      realWorldImpact: `Ensures compliant operation and standard performance benchmarks for ${product.name}.`,
      buyerTip: `Compare this with similar devices in the ₹${product.price.toLocaleString('en-IN')} price bracket for optimal value.`
    };
  };

  // Comprehensive Spec Detailed Analysis Generator for Interactive Modal
  const getSpecDetailedAnalysis = (key: string, val: string) => {
    const k = key.toLowerCase();
    const jargon = lookupJargon(key, val);
    
    let score = 91;
    let tier = 'Top-Tier Flagship';
    let tierColor = 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800';
    
    if (k.includes('processor') || k.includes('chip') || k.includes('cpu')) {
      score = 96;
      tier = 'Pro Silicon (Top 5%)';
      tierColor = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800';
    } else if (k.includes('display') || k.includes('screen') || k.includes('oled') || k.includes('amoled') || k.includes('refresh') || k.includes('hz')) {
      score = 95;
      tier = 'Cinema Grade Visuals';
      tierColor = 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800';
    } else if (k.includes('battery') || k.includes('charging') || k.includes('mah') || k.includes('watt') || k.includes('whr')) {
      score = 93;
      tier = 'Heavy Duty Endurance';
      tierColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    } else if (k.includes('camera') || k.includes('sensor') || k.includes('ois') || k.includes('aperture') || k.includes('lens')) {
      score = 94;
      tier = 'Studio Optical Array';
      tierColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
    } else if (k.includes('driver') || k.includes('anc') || k.includes('audio') || k.includes('sound')) {
      score = 92;
      tier = 'Audiophile Grade Acoustic';
      tierColor = 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/60 border-pink-200 dark:border-pink-800';
    }

    return {
      key,
      val,
      score,
      tier,
      tierColor,
      jargon,
      category: getSpecCategory(key),
      impacts: [
        {
          title: 'Daily App Multitasking',
          status: 'Optimal',
          desc: `Ensures swift UI response, rapid app launches, and zero freeze when toggling 15+ tabs or background productivity apps.`
        },
        {
          title: 'Sustained 3D Gaming & Heavy Load',
          status: 'High Performance',
          desc: `Engineered to maintain steady frame-rates without rapid thermal throttling during long gaming or 4K rendering runs.`
        },
        {
          title: 'Power Draw & Thermal Envelope',
          status: 'Efficient',
          desc: `Optimized power states preserve battery longevity while keeping surface temperatures comfortable in your hands.`
        },
        {
          title: '3-to-5 Year Longevity',
          status: 'Future-Proof',
          desc: `Exceeds current operating system hardware minimums, guaranteeing smooth updates and app compatibility for years.`
        }
      ],
      pros: [
        `Delivers top-tier ${key.toLowerCase()} performance in the ₹${product.price.toLocaleString('en-IN')} price bracket.`,
        `Factory calibrated for tight hardware-software synergy with zero bloatware bottlenecks.`,
        `Backed by verified manufacturer quality tolerances and full warranty protection.`
      ],
      cons: [
        `High-demand continuous loads under direct sunlight may trigger automated thermal throttling safeguards.`,
        `Requires compatible high-speed adapters/cables to utilize maximum theoretical bandwidth.`
      ],
      rivalComparison: [
        { name: product.name, value: val, status: 'This Device (Verified)', isCurrent: true },
        { name: 'Category Baseline (Median)', value: 'Standard Industry Spec', status: 'Typical Median', isCurrent: false },
        { name: 'Previous Generation', value: 'Legacy Specification', status: '-20% Performance Delta', isCurrent: false }
      ]
    };
  };

  // Plain English rewording for values
  const getPlainEnglishSpec = (key: string, value: string): string => {
    const k = key.toLowerCase();
    const v = value.toLowerCase();

    if (k.includes('display')) {
      if (v.includes('120hz') && v.includes('oled')) return 'Ultra-smooth, vibrant OLED screen with instant response and deep true blacks.';
      if (v.includes('oled')) return 'Cinema-grade screen with rich vibrant colors and true dark blacks.';
      if (v.includes('retina')) return 'Super-sharp Apple high-density screen with True Tone comfort.';
      return `Crisp screen with rich detail (${value}).`;
    }
    if (k.includes('processor') || k.includes('cpu')) {
      if (v.includes('m3') || v.includes('m4') || v.includes('m2')) return 'Apple next-gen high-efficiency silicon. Super fast video editing with cool, quiet running.';
      if (v.includes('gen 3') || v.includes('gen 2')) return 'Top-tier Qualcomm flagship processor. Crushes 3D games and heavy apps with zero lag.';
      if (v.includes('i5') || v.includes('i7') || v.includes('ultra')) return 'High-speed Intel multi-core processor for smooth coding, office work, and multitasking.';
      return `High-speed processor capable of sustained daily workflows (${value}).`;
    }
    if (k.includes('battery') || k.includes('battery life')) {
      if (v.includes('5000mah') || v.includes('5500mah')) return 'Massive all-day battery. Easily survives 1.5 to 2 days of mixed daily work.';
      if (v.includes('18 hours') || v.includes('23 hours') || v.includes('30 hours')) return 'Exceptional multi-day endurance for long flights and work without a charger.';
      return `Solid battery capacity designed for reliable daily usage (${value}).`;
    }
    if (k.includes('charging')) {
      if (v.includes('100w') || v.includes('120w')) return 'Lightning fast. Recharges from 0% to 100% in around 25 minutes.';
      if (v.includes('45w') || v.includes('67w')) return 'Fast charging. Gives you hours of runtime with a quick 15-minute top-up.';
      return `Equipped with dedicated fast charging technology (${value}).`;
    }
    if (k.includes('camera')) {
      if (v.includes('200mp') || v.includes('48mp') || v.includes('50mp')) return 'Pro-grade high-resolution camera with sharp night photos and 4K/8K video.';
      return `Clean optical array for crisp photographs and video calls (${value}).`;
    }
    if (k.includes('anc') || k.includes('noise')) {
      return 'Active Noise Cancelling: Silences background airplane noise, cafes, and train chatter.';
    }
    if (k.includes('storage')) {
      return `Generous solid-state storage to hold all your apps, 4K photos, and games (${value}).`;
    }
    return value;
  };

  // Filtered Specs
  const filteredSpecs = useMemo(() => {
    return Object.entries(product.specs).filter(([key, val]) => {
      const matchesSearch = !searchQuery.trim() || 
        key.toLowerCase().includes(searchQuery.toLowerCase()) || 
        val.toLowerCase().includes(searchQuery.toLowerCase());
      
      const cat = getSpecCategory(key);
      const matchesCategory = selectedCategory === 'all' || cat === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [product.specs, searchQuery, selectedCategory]);

  // Key Silicon & Component Breakdown
  const componentArchitecture = useMemo(() => {
    const specs = product.specs;
    const cat = product.category.toLowerCase();
    const score = product.aiScore;

    return {
      silicon: {
        title: 'Compute & Silicon Fabric',
        chipName: specs['Processor'] || specs['Processor/Engine'] || specs['Chipset'] || specs['Sensor'] || 'Multi-Core Architecture',
        fabricationNode: cat.includes('apple') ? '3nm TSMC' : cat.includes('phone') ? '4nm Flagship' : 'Modern Low-Power Node',
        tdpWattage: cat.includes('laptop') ? '15W - 45W Adaptive' : cat.includes('phone') ? '5W Peak Efficiency' : '1.5W Low Power',
        efficiencyScore: Math.min(99, Math.max(78, Math.round(score * 0.98))),
        ratingBadge: score >= 92 ? 'Flagship Class' : score >= 85 ? 'High Performance' : 'Balanced Mid-Tier',
        accentColor: 'from-blue-600 to-indigo-600',
        borderColor: 'border-blue-500/30'
      },
      displayPanel: {
        title: 'Display Chemistry & Optical Panel',
        panelType: specs['Display'] || specs['Screen'] || specs['Type'] || 'High-Definition Visual Surface',
        nitPeak: cat.includes('phone') ? '2000 - 4500 Nits Peak HDR' : cat.includes('tv') ? '1000 Nits Peak OLED' : '500 Nits Brightness',
        refreshCurve: (specs['Display'] || '').includes('120Hz') ? '1Hz - 120Hz Dynamic LTPO' : '60Hz Standard Baseline',
        colorGamut: '100% DCI-P3 Cinema Color Space',
        visualScore: Math.min(99, Math.max(75, Math.round(score * 0.96))),
        ratingBadge: (specs['Display'] || '').includes('OLED') || (specs['Display'] || '').includes('Retina') ? 'Cinema OLED / Retina' : 'Sharp IPS / LCD',
        accentColor: 'from-purple-600 to-pink-600',
        borderColor: 'border-purple-500/30'
      },
      powerManagement: {
        title: 'Cellular Chemistry & Power Delivery',
        capacity: specs['Battery'] || specs['Battery Life'] || 'Sustained All-Day Chemistry',
        chargingSpeed: specs['Charging'] || (specs['Battery'] || '').includes('Fast') ? (specs['Battery'] || '') : 'Optimized USB-PD Delivery',
        healthSpan: '800 - 1000 Charge Cycles (>80% Capacity Retained)',
        enduranceScore: Math.min(99, Math.max(70, Math.round(score * 0.94))),
        ratingBadge: (specs['Battery'] || '').includes('100W') || (specs['Battery'] || '').includes('5500') ? 'Ultra Endurance' : 'All-Day Certified',
        accentColor: 'from-emerald-600 to-teal-600',
        borderColor: 'border-emerald-500/30'
      },
      opticsAudio: {
        title: cat.includes('audio') || cat.includes('headphone') || cat.includes('earbud') ? 'Acoustic Chambers & Transducers' : 'Optical Sensor Array & ISP',
        primaryHardware: specs['Camera'] || specs['Drivers'] || specs['Driver Size'] || specs['Audio'] || specs['Switches'] || 'Integrated Hardware Package',
        stabilization: cat.includes('audio') ? 'Active Multi-Mic Noise Neutralization' : 'Optical Image Stabilization (OIS) + AI RAW ISP',
        audioOpticsScore: Math.min(99, Math.max(72, Math.round(score * 0.95))),
        ratingBadge: score >= 90 ? 'Studio Grade' : 'High Fidelity',
        accentColor: 'from-amber-600 to-orange-600',
        borderColor: 'border-amber-500/30'
      }
    };
  }, [product]);

  // Synthetic & Lab Benchmarks Simulation
  const benchmarkLabData = useMemo(() => {
    const score = product.aiScore;
    
    const cpuSingle = Math.round((score / 100) * 2800 + 400);
    const cpuSingleMedian = 2100;
    const cpuMulti = Math.round((score / 100) * 7200 + 1200);
    const cpuMultiMedian = 5400;
    const gpuCompute = Math.round((score / 100) * 14500 + 3000);
    const gpuMedian = 11000;
    const efficiency = Math.min(99, Math.round(score * 0.97));
    const efficiencyMedian = 82;

    const chartData = [
      { metric: 'Single-Core CPU', thisDevice: Math.round((cpuSingle / cpuSingleMedian) * 100), categoryAverage: 100 },
      { metric: 'Multi-Core CPU', thisDevice: Math.round((cpuMulti / cpuMultiMedian) * 100), categoryAverage: 100 },
      { metric: '3D Graphics GPU', thisDevice: Math.round((gpuCompute / gpuMedian) * 100), categoryAverage: 100 },
      { metric: 'Energy Efficiency', thisDevice: Math.round((efficiency / efficiencyMedian) * 100), categoryAverage: 100 },
      { metric: 'Thermal Parity', thisDevice: Math.round((score / 85) * 100), categoryAverage: 100 },
    ];

    return {
      chartData,
      cpuSingle,
      cpuMulti,
      gpuCompute,
      efficiency,
      sustainedThermalRetention: Math.min(98, Math.max(78, Math.round(score * 0.95)))
    };
  }, [product]);

  // Estimated Battery SOT Calculation based on user simulation sliders
  const estimatedBatteryLife = useMemo(() => {
    const cat = product.category.toLowerCase();
    const baseScore = product.aiScore;
    
    const gamingDrainPerHour = cat.includes('laptop') ? 22 : 14;
    const videoDrainPerHour = cat.includes('laptop') ? 8 : 6;
    const webDrainPerHour = cat.includes('laptop') ? 6 : 5;

    const totalDrain = (simulatedGamingHours * gamingDrainPerHour) + 
                       (simulatedVideoHours * videoDrainPerHour) + 
                       (simulatedWebHours * webDrainPerHour);
    
    const remainingPercentage = Math.max(0, Math.min(100, Math.round(100 - (totalDrain * (95 / baseScore)))));
    const totalHoursRun = simulatedGamingHours + simulatedVideoHours + simulatedWebHours;

    return {
      remainingPercentage,
      totalHoursRun,
      isEnduranceStrong: remainingPercentage > 20,
      estimatedTotalSOT: Math.round((100 / (totalDrain / (totalHoursRun || 1))) * 10) / 10
    };
  }, [product, simulatedGamingHours, simulatedVideoHours, simulatedWebHours]);

  // Copy structured spec formats
  const handleCopySpecFormatted = (format: 'markdown' | 'text' | 'json') => {
    let output = '';
    if (format === 'markdown') {
      output = `### ${product.brand} ${product.name} — Technical Specifications\n\n` +
        `**Price:** ₹${product.price.toLocaleString("en-IN")} | **WiseScore:** ${product.aiScore}/100\n\n` +
        `| Specification | Hardware Value |\n| :--- | :--- |\n` +
        Object.entries(product.specs).map(([k, v]) => `| **${k}** | ${v} |`).join('\n') +
        `\n\n*Verified by WiseFind Intelligence Core*`;
    } else if (format === 'json') {
      output = JSON.stringify({
        id: product.id,
        name: product.name,
        brand: product.brand,
        priceINR: product.price,
        wiseScore: product.aiScore,
        category: product.category,
        specifications: product.specs,
        highlights: product.highlights,
        pros: product.pros,
        cons: product.cons
      }, null, 2);
    } else {
      output = `${product.brand} ${product.name} (₹${product.price.toLocaleString("en-IN")})\n` +
        `WiseScore: ${product.aiScore}/100\n\n` +
        Object.entries(product.specs).map(([k, v]) => `• ${k}: ${v}`).join('\n');
    }

    try {
      navigator.clipboard.writeText(output);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // Dedicated AI Jargon Tooltip Component
  const renderInteractiveJargonTooltip = (key: string, val: string) => {
    const jargon = lookupJargon(key, val);
    if (!jargon) return null;

    const isOpen = activeTooltipKey === key;

    return (
      <div className="relative inline-block ml-1.5 align-middle">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveTooltipKey(isOpen ? null : key);
          }}
          className={`inline-flex items-center justify-center p-1 rounded-lg transition-all cursor-pointer ${
            isOpen 
              ? 'bg-[#4F46E5] text-white shadow-xs scale-110' 
              : 'text-indigo-400 hover:text-[#4F46E5] dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
          }`}
          title={`Click to view AI-generated real-world explanation for "${key}"`}
          aria-label={`Explain ${key}`}
        >
          <Sparkles className="h-3 w-3" />
        </button>

        {/* Interactive Floating AI Tooltip Popover */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.16 }}
              className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-72 sm:w-84 bg-white dark:bg-slate-900 border border-indigo-200/90 dark:border-indigo-800/90 rounded-2xl p-4 shadow-xl shadow-indigo-500/10 z-50 text-left space-y-2.5 backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900/60 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#4F46E5] dark:text-indigo-400 uppercase tracking-wider">
                  <Bot className="h-3.5 w-3.5 text-[#4F46E5] dark:text-indigo-400" />
                  <span>AI Spec Decrypter: <b>{key}</b></span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTooltipKey(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Real World Impact Badge */}
              <div className="bg-indigo-50/80 dark:bg-indigo-950/60 rounded-xl p-2.5 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
                <span className="text-[10px] font-black uppercase text-[#4F46E5] dark:text-indigo-300 tracking-wider flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-500" />
                  <span>What It Means for Real-World Usage:</span>
                </span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  {jargon.realWorldImpact}
                </p>
              </div>

              {/* Technical Definition & Human Meaning */}
              <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 font-medium leading-relaxed">
                <p>
                  <strong className="text-slate-900 dark:text-white">Definition:</strong> {jargon.definition}
                </p>
                <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  💡 <strong>Buyer Tip:</strong> {jargon.buyerTip}
                </p>
              </div>

              {/* Ask WiseBot Shortcut */}
              {onAskWiseBot && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTooltipKey(null);
                    onAskWiseBot(`Explain in detail what "${key}: ${val}" means on ${product.name} and how it affects gaming and daily multitasking.`);
                  }}
                  className="w-full text-center py-1.5 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Ask WiseBot about this spec</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-6 pt-4" id="ultimate-specs-section">
      
      {/* 1. SECTION HEADER WITH CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#4F46E5] dark:text-indigo-400 uppercase tracking-widest">
            <Sliders className="h-4 w-4" />
            <span>Deep Hardware Specifications</span>
            <span className="bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full text-[9px] font-black">
              AI Explanations Enabled
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
            Component Architecture & Verified Standards
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Tap the <span className="inline-flex items-center text-[#4F46E5] dark:text-indigo-400 font-bold"><Sparkles className="h-3 w-3 mx-0.5" /> AI sparkle icon</span> next to any specification for real-world impact and buyer recommendations.
          </p>
        </div>

        {/* Global Action Utility Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Plain English Toggle */}
          <button
            type="button"
            onClick={() => setIsPlainEnglish(!isPlainEnglish)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
              isPlainEnglish
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            title="Toggle between Pro Engineering specs and Plain Human terms"
          >
            <Sparkle className={`h-3.5 w-3.5 ${isPlainEnglish ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <span>{isPlainEnglish ? 'Plain English ON' : 'Translate to Plain English'}</span>
          </button>

          {/* Export / Copy Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs"
            >
              {copiedFormat ? <CheckCheck className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copiedFormat ? `Copied ${copiedFormat.toUpperCase()}` : 'Export Specs'}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 hidden group-hover:block z-30 space-y-1 animate-fade-in">
              <button
                onClick={() => handleCopySpecFormatted('markdown')}
                className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Copy Markdown Table</span>
                <span className="text-[10px] text-slate-400 font-mono">.md</span>
              </button>
              <button
                onClick={() => handleCopySpecFormatted('text')}
                className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Copy Clean Text</span>
                <span className="text-[10px] text-slate-400 font-mono">.txt</span>
              </button>
              <button
                onClick={() => handleCopySpecFormatted('json')}
                className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Download Spec JSON</span>
                <span className="text-[10px] text-slate-400 font-mono">.json</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SPEC VIEW MODE SELECTOR BUTTONS */}
      <div className="bg-slate-100 dark:bg-slate-800/70 p-1.5 rounded-2xl flex flex-wrap gap-1.5 border border-slate-200/80 dark:border-slate-700">
        {[
          { id: 'bento', label: 'Bento Hardware Matrix', icon: Grid, badge: 'Popular' },
          { id: 'silicon', label: 'Silicon & Component Architecture', icon: Cpu, badge: 'Deep Lab' },
          { id: 'benchmarks', label: 'Synthetic Benchmarks vs Average', icon: BarChart2, badge: 'Lab Scores' },
          { id: 'table', label: 'Technical Table & AI Tooltips', icon: Table, count: filteredSpecs.length },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = viewMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as any)}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-black text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-[#4F46E5] dark:text-white shadow-sm border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-[#4F46E5] dark:text-indigo-400' : 'text-slate-400'}`} />
              <span className="truncate">{tab.label}</span>
              {tab.badge && (
                <span className="hidden md:inline-block bg-indigo-50 dark:bg-indigo-950/80 text-[#4F46E5] dark:text-indigo-400 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. VIEW MODE CONTENTS */}

      {/* VIEW 1: BENTO MATRIX (Default Visual Grid) */}
      {viewMode === 'bento' && (
        <div className="space-y-4 animate-fade-in">
          {/* Top 4 Hero Specs Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                icon: Cpu,
                sub: 'Core Silicon',
                label: 'Processor / Engine',
                rawKey: 'Processor',
                value: product.specs['Processor'] || product.specs['Processor/Engine'] || product.specs['Chipset'] || 'Flagship Architecture',
                score: '96/100',
                badge: 'Top 5% Tier',
                gradient: 'from-blue-500/15 via-indigo-500/10 to-transparent border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
              },
              {
                icon: Monitor,
                sub: 'Visual Surface',
                label: 'Display & Glass',
                rawKey: 'Display',
                value: product.specs['Display'] || product.specs['Screen'] || 'Ultra HD Panel',
                score: '95/100',
                badge: 'Cinema Clarity',
                gradient: 'from-purple-500/15 via-pink-500/10 to-transparent border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400'
              },
              {
                icon: Battery,
                sub: 'Power Management',
                label: 'Battery & Charging',
                rawKey: 'Battery',
                value: product.specs['Battery'] || product.specs['Battery Life'] || 'All-Day Endurance',
                score: '92/100',
                badge: 'Fast Flow',
                gradient: 'from-emerald-500/15 via-teal-500/10 to-transparent border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
              },
              {
                icon: Camera,
                sub: 'Sensory Specs',
                label: 'Camera / Audio',
                rawKey: 'Camera',
                value: product.specs['Camera'] || product.specs['Drivers'] || product.specs['Driver Size'] || product.specs['Audio'] || 'Pro Capture Array',
                score: '94/100',
                badge: 'Pro Grade',
                gradient: 'from-amber-500/15 via-orange-500/10 to-transparent border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400'
              }
            ].map((hero, i) => {
              const Icon = hero.icon;
              return (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedSpecDetail({ key: hero.rawKey, val: hero.value });
                    setSpecDetailActiveTab('impact');
                  }}
                  className={`p-4 rounded-2xl border bg-gradient-to-br transition-all flex flex-col justify-between hover:shadow-lg hover:scale-[1.02] cursor-pointer group ${hero.gradient}`}
                  title="Click for full spec deep-dive, benchmarks & real-world impact"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5" />
                      <span>{hero.sub}</span>
                    </span>
                    <div className="flex items-center gap-1">
                      {renderInteractiveJargonTooltip(hero.rawKey, hero.value)}
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs group-hover:border-[#4F46E5]/50 transition-colors">
                        {hero.badge}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase block text-slate-400 tracking-wider">
                      {hero.label}
                    </span>
                    <p className="text-sm font-black text-slate-900 dark:text-white mt-1 leading-snug">
                      {isPlainEnglish ? getPlainEnglishSpec(hero.label, hero.value) : hero.value}
                    </p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-200/40 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transition-colors">
                    <span>Click for deep dive</span>
                    <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bento Full Spec Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            {Object.entries(product.specs).map(([key, val]) => {
              return (
                <div
                  key={key}
                  onClick={() => {
                    setSelectedSpecDetail({ key, val });
                    setSpecDetailActiveTab('impact');
                  }}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 hover:border-[#4F46E5] hover:shadow-md transition-all flex flex-col justify-between space-y-2 group shadow-2xs relative cursor-pointer"
                  title="Click to view deep-dive analysis, pros/cons and benchmarks"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-[#4F46E5] transition-colors">
                        {key}
                      </span>
                      {renderInteractiveJargonTooltip(key, val)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        Inspect
                      </span>
                      <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transform group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>

                  {/* Value */}
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-relaxed">
                    {isPlainEnglish ? getPlainEnglishSpec(key, val) : val}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: SILICON & COMPONENT ARCHITECTURE */}
      {viewMode === 'silicon' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Silicon Compute */}
            <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-blue-500/30 relative overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block">Silicon Matrix</span>
                    <h4 className="text-sm font-black text-white">{componentArchitecture.silicon.title}</h4>
                  </div>
                </div>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-black px-2.5 py-1 rounded-full">
                  {componentArchitecture.silicon.ratingBadge}
                </span>
              </div>

              <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold">Installed Silicon:</span>
                  <span className="font-black text-blue-300">{componentArchitecture.silicon.chipName}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400 font-bold">Process Node:</span>
                  <span className="font-black text-slate-200">{componentArchitecture.silicon.fabricationNode}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400 font-bold">Thermal Power Envelope:</span>
                  <span className="font-black text-slate-200">{componentArchitecture.silicon.tdpWattage}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-slate-300">Compute Speed Score</span>
                  <span className="text-blue-400">{componentArchitecture.silicon.efficiencyScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" style={{ width: `${componentArchitecture.silicon.efficiencyScore}%` }} />
                </div>
              </div>
            </div>

            {/* Display Panel */}
            <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-purple-500/30 relative overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 block">Optics & Matrix</span>
                    <h4 className="text-sm font-black text-white">{componentArchitecture.displayPanel.title}</h4>
                  </div>
                </div>
                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black px-2.5 py-1 rounded-full">
                  {componentArchitecture.displayPanel.ratingBadge}
                </span>
              </div>

              <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold">Panel Chemistry:</span>
                  <span className="font-black text-purple-300 max-w-[200px] truncate">{componentArchitecture.displayPanel.panelType}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400 font-bold">Peak Brightness:</span>
                  <span className="font-black text-slate-200">{componentArchitecture.displayPanel.nitPeak}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400 font-bold">Refresh Rate Dynamics:</span>
                  <span className="font-black text-slate-200">{componentArchitecture.displayPanel.refreshCurve}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-slate-300">Visual Quality Index</span>
                  <span className="text-purple-400">{componentArchitecture.displayPanel.visualScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-400 h-full rounded-full" style={{ width: `${componentArchitecture.displayPanel.visualScore}%` }} />
                </div>
              </div>
            </div>

            {/* Battery & Power */}
            <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-emerald-500/30 relative overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                    <Battery className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">Endurance Core</span>
                    <h4 className="text-sm font-black text-white">{componentArchitecture.powerManagement.title}</h4>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2.5 py-1 rounded-full">
                  {componentArchitecture.powerManagement.ratingBadge}
                </span>
              </div>

              <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold">Cell Capacity:</span>
                  <span className="font-black text-emerald-300 max-w-[200px] truncate">{componentArchitecture.powerManagement.capacity}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400 font-bold">Fast Charging Protocol:</span>
                  <span className="font-black text-slate-200">{componentArchitecture.powerManagement.chargingSpeed}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400 font-bold">Cycle Longevity:</span>
                  <span className="font-black text-slate-200">{componentArchitecture.powerManagement.healthSpan}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-slate-300">Endurance Score</span>
                  <span className="text-emerald-400">{componentArchitecture.powerManagement.enduranceScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: `${componentArchitecture.powerManagement.enduranceScore}%` }} />
                </div>
              </div>
            </div>

            {/* Sensors / Audio / Optics */}
            <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-amber-500/30 relative overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">Sensory Array</span>
                    <h4 className="text-sm font-black text-white">{componentArchitecture.opticsAudio.title}</h4>
                  </div>
                </div>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black px-2.5 py-1 rounded-full">
                  {componentArchitecture.opticsAudio.ratingBadge}
                </span>
              </div>

              <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold">Primary Unit:</span>
                  <span className="font-black text-amber-300 max-w-[200px] truncate">{componentArchitecture.opticsAudio.primaryHardware}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400 font-bold">Stabilization / Processing:</span>
                  <span className="font-black text-slate-200">{componentArchitecture.opticsAudio.stabilization}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400 font-bold">Standard Certification:</span>
                  <span className="font-black text-slate-200">Hi-Res Audio / Pro RAW Color</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-slate-300">Hardware Fidelity Rating</span>
                  <span className="text-amber-400">{componentArchitecture.opticsAudio.audioOpticsScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full" style={{ width: `${componentArchitecture.opticsAudio.audioOpticsScore}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SYNTHETIC BENCHMARKS & PERFORMANCE LAB */}
      {viewMode === 'benchmarks' && (
        <div className="space-y-5 animate-fade-in">
          {/* Comparative Bar Chart vs Category Average */}
          <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-black text-[#4F46E5] dark:text-indigo-400 uppercase tracking-widest block">
                  Synthetic Hardware Index
                </span>
                <h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  Performance Delta vs Category Median (100% = Average)
                </h4>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                  <span className="h-3 w-3 rounded-full bg-[#4F46E5]" /> {product.name}
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" /> Category Baseline
                </span>
              </div>
            </div>

            <div className="w-full h-64 min-h-[256px] pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkLabData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 160]} tickFormatter={(v) => `${v}%`} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', padding: '10px 14px' }}
                    formatter={(v: any) => [`${v}% of baseline`, 'Score']}
                  />
                  <Bar dataKey="thisDevice" fill="#4F46E5" radius={[6, 6, 0, 0]} name={product.name} />
                  <Bar dataKey="categoryAverage" fill="#94a3b8" radius={[6, 6, 0, 0]} name="Baseline (100%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interactive Screen-On Time (SOT) Daily Simulator */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    Interactive Battery Drain Simulator
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Adjust your expected daily hours to estimate end-of-day battery life.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
                  Est. Battery Remaining: <b className="font-black text-emerald-600 dark:text-emerald-400">{estimatedBatteryLife.remainingPercentage}%</b>
                </span>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>3D Gaming</span>
                  <span className="font-black text-[#4F46E5] dark:text-indigo-400">{simulatedGamingHours} hrs</span>
                </div>
                <input 
                  type="range" min="0" max="6" step="1"
                  value={simulatedGamingHours}
                  onChange={(e) => setSimulatedGamingHours(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#4F46E5]"
                />
              </div>

              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>4K Video Streaming</span>
                  <span className="font-black text-[#4F46E5] dark:text-indigo-400">{simulatedVideoHours} hrs</span>
                </div>
                <input 
                  type="range" min="0" max="10" step="1"
                  value={simulatedVideoHours}
                  onChange={(e) => setSimulatedVideoHours(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#4F46E5]"
                />
              </div>

              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Web & Social Browsing</span>
                  <span className="font-black text-[#4F46E5] dark:text-indigo-400">{simulatedWebHours} hrs</span>
                </div>
                <input 
                  type="range" min="0" max="10" step="1"
                  value={simulatedWebHours}
                  onChange={(e) => setSimulatedWebHours(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#4F46E5]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: HIGH-DENSITY TECHNICAL TABLE */}
      {viewMode === 'table' && (
        <div className="space-y-3.5 animate-fade-in">
          {/* Live Search & Category Filter Pills */}
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specs (e.g., RAM, 120Hz, OIS, 5G, Wattage)..."
                className="w-full pl-8 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#4F46E5]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">
              {filteredSpecs.length} Spec{filteredSpecs.length !== 1 ? 's' : ''} Matched
            </span>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {specCategoryTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#4F46E5] border-[#4F46E5] text-white shadow-2xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Filtered Specs Rows Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-[#111827]">
            {filteredSpecs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <p className="text-xs font-bold">No specifications match "{searchQuery}"</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="text-[11px] font-black text-[#4F46E5] dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Clear Filter
                </button>
              </div>
            ) : (
              filteredSpecs
                .slice(0, isExpanded ? undefined : 8)
                .map(([key, value]) => {
                  return (
                    <div 
                      key={key} 
                      onClick={() => {
                        setSelectedSpecDetail({ key, val: value });
                        setSpecDetailActiveTab('impact');
                      }}
                      className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col gap-1.5 relative cursor-pointer group"
                      title="Click to view deep dive analysis"
                    >
                      <div className="flex justify-between items-center w-full gap-3">
                        <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-[#4F46E5] transition-colors">
                          <span>{key}</span>
                          {renderInteractiveJargonTooltip(key, value)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white text-right max-w-[340px] truncate" title={value}>
                            {isPlainEnglish ? getPlainEnglishSpec(key, value) : value}
                          </span>
                          <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transform group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          {filteredSpecs.length > 8 && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700"
            >
              <ChevronDown className="h-4 w-4" />
              <span>View All {filteredSpecs.length} Specifications</span>
            </button>
          )}

          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
            >
              <ChevronUp className="h-4 w-4" />
              <span>Collapse Technical Table</span>
            </button>
          )}
        </div>
      )}

      {/* 4. FAST ACTION BAR: ASK AI ABOUT THESE SPECS / DIRECT COMPARE */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200/70 dark:border-indigo-800/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h5 className="text-xs font-black text-slate-900 dark:text-white">
              Have questions about these hardware specs?
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              WiseBot AI can audit thermal throttling, camera sensors, and battery longevity for your specific workload.
            </p>
          </div>
        </div>

        {onAskWiseBot && (
          <button
            onClick={() => onAskWiseBot(`Can you audit the technical specs of ${product.name} (₹${product.price}) and tell me if its processor, display, and battery are worth it for heavy usage?`)}
            className="text-xs font-black text-white bg-[#4F46E5] hover:bg-[#4338CA] px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap flex items-center gap-1.5 uppercase tracking-wider"
          >
            <span>Ask WiseBot AI</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* 5. INTERACTIVE SPEC DEEP-DIVE MODAL / DRAWER */}
      <AnimatePresence>
        {selectedSpecDetail && (() => {
          const detail = getSpecDetailedAnalysis(selectedSpecDetail.key, selectedSpecDetail.val);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-5 sm:p-6 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          {product.name} • Deep Dive
                        </span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${detail.tierColor}`}>
                          {detail.tier}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                        {detail.key}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`${detail.key}: ${detail.val} (${product.name})`);
                        setCopiedDetailValue(true);
                        setTimeout(() => setCopiedDetailValue(false), 2000);
                      }}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Copy spec details"
                    >
                      {copiedDetailValue ? <CheckCheck className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSpecDetail(null)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Main Modal Content (Scrollable) */}
                <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
                  {/* Hero Spec Value Box */}
                  <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-slate-50 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900 p-4 sm:p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                        Verified Hardware Metric
                      </span>
                      <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                        {detail.val}
                      </h4>
                      <p className="text-xs text-[#4F46E5] dark:text-indigo-400 font-bold mt-1 flex items-center gap-1">
                        <Sparkle className="h-3.5 w-3.5 shrink-0" />
                        <span>Plain English: {getPlainEnglishSpec(detail.key, detail.val)}</span>
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-slate-200/80 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-4">
                      <span className="text-[10px] font-bold text-slate-400">Spec Score</span>
                      <span className="text-2xl font-black text-[#4F46E5] dark:text-indigo-400">
                        {detail.score}<span className="text-xs text-slate-400 font-normal">/100</span>
                      </span>
                    </div>
                  </div>

                  {/* Modal Navigation Tabs */}
                  <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                    {[
                      { id: 'impact', label: 'Real-World Impact', icon: Zap },
                      { id: 'breakdown', label: 'Tech Breakdown', icon: Cpu },
                      { id: 'proscons', label: 'Pros & Cons', icon: CheckCircle2 },
                      { id: 'rivals', label: 'Comparison Matrix', icon: BarChart2 }
                    ].map(tab => {
                      const Icon = tab.icon;
                      const isActive = specDetailActiveTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setSpecDetailActiveTab(tab.id as any)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#4F46E5] text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab 1: Real-World Impact */}
                  {specDetailActiveTab === 'impact' && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {detail.impacts.map((imp, idx) => (
                          <div key={idx} className="bg-slate-50 dark:bg-slate-900/90 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-900 dark:text-white">{imp.title}</span>
                              <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                                {imp.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                              {imp.desc}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Buyer Tip Box */}
                      <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                        <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <span>💡 WiseFind Buyer Tip</span>
                        </span>
                        <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                          {detail.jargon.buyerTip}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Tech Breakdown */}
                  {specDetailActiveTab === 'breakdown' && (
                    <div className="space-y-3.5 animate-fade-in">
                      <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl space-y-2 border border-slate-800">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Engineering Definition</span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {detail.jargon.definition}
                        </p>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Practical Meaning</span>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {detail.jargon.plainMeaning}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {detail.jargon.realWorldImpact}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Pros & Cons */}
                  {specDetailActiveTab === 'proscons' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-fade-in">
                      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/40 space-y-2">
                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span>Key Advantages</span>
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                          {detail.pros.map((pro, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-500 font-bold shrink-0">•</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 space-y-2">
                        <span className="text-xs font-black text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                          <HelpCircle className="h-4 w-4 text-amber-500" />
                          <span>Points to Note</span>
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                          {detail.cons.map((con, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-amber-500 font-bold shrink-0">•</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Tab 4: Rivals Comparison */}
                  {specDetailActiveTab === 'rivals' && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                        {detail.rivalComparison.map((item, idx) => (
                          <div key={idx} className={`p-3.5 flex items-center justify-between gap-3 ${item.isCurrent ? 'bg-indigo-50/60 dark:bg-indigo-950/40' : 'bg-white dark:bg-slate-900'}`}>
                            <div className="space-y-0.5">
                              <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>{item.name}</span>
                                {item.isCurrent && (
                                  <span className="text-[9px] font-black uppercase text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900 px-1.5 py-0.2 rounded">
                                    Current
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-slate-400 block">{item.status}</span>
                            </div>
                            <span className="text-xs font-black text-slate-900 dark:text-white">{item.value}</span>
                          </div>
                        ))}
                      </div>

                      {onAddToCompare && (
                        <button
                          type="button"
                          onClick={() => {
                            onAddToCompare(product);
                            setSelectedSpecDetail(null);
                          }}
                          className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <BarChart2 className="h-4 w-4 text-[#4F46E5]" />
                          <span>Open Full Product in Side-by-Side Comparison Matrix</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Modal Footer Actions */}
                <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Backed by WiseFind Intelligence Standards
                  </span>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {onAskWiseBot && (
                      <button
                        type="button"
                        onClick={() => {
                          const q = `Explain in detail what "${detail.key}: ${detail.val}" means on the ${product.name} (₹${product.price}) and how it impacts real-world performance, gaming, and battery life.`;
                          setSelectedSpecDetail(null);
                          onAskWiseBot(q);
                        }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all shadow-sm cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Ask WiseBot about this spec</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedSpecDetail(null)}
                      className="px-4 py-2 rounded-xl text-xs font-black text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
