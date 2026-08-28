import { Product, BuyingGuide } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // Smartphones
  {
    id: 'phone-1',
    name: 'Apple iPhone 15 Pro',
    category: 'Smartphones',
    brand: 'Apple',
    price: 129900,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80',
    specs: {
      'Display': '6.1-inch Super Retina XDR OLED, 120Hz',
      'Processor': 'A17 Pro chip',
      'Storage': '128GB / 256GB / 512GB / 1TB',
      'Battery': 'Up to 23 hours video playback, 15W MagSafe',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP 3x Telephoto',
      'OS': 'iOS 17 (upgradable)',
      'Weight': '187g',
      'Warranty': '1 Year International'
    },
    description: 'The first iPhone to feature an aerospace-grade titanium design, using the same alloy that spacecraft use for missions to Mars. Superpowerful A17 Pro chip delivers groundbreaking graphics performance.',
    highlights: [
      'Aerospace-grade Titanium design with textured matte glass back',
      'A17 Pro chip with 6-core GPU for console-level gaming',
      'Pro camera system with 48MP Main and custom focal lengths',
      'New Action button for quick access to your favorite feature'
    ],
    pros: [
      'Incredibly lightweight yet durable titanium frame',
      'Class-leading performance and ray-tracing graphics',
      'Exceptional video recording capabilities',
      'Long-term software updates'
    ],
    cons: [
      'Extremely expensive pricing',
      'No power adapter included in the box',
      'Charging speed capped at 27W'
    ],
    aiScore: 94,
    aiRecommendation: 'A premium, no-compromise flagship. The 15 Pro is highly recommended for tech enthusiasts, mobile videographers, and anyone looking for a compact but extremely powerful iOS experience. It holds its value exceptionally well.',
    isEditorChoice: true,
    isBestPremium: true
  },
  {
    id: 'phone-2',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Smartphones',
    brand: 'Samsung',
    price: 129999,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80',
    specs: {
      'Display': '6.8-inch Dynamic AMOLED 2X, QHD+, 120Hz',
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy',
      'Storage': '256GB / 512GB / 1TB',
      'Battery': '5000mAh, 45W Fast Charging',
      'Camera': '200MP Main + 50MP + 12MP + 10MP Quad Camera',
      'OS': 'Android 14 (One UI 6.1)',
      'Weight': '232g',
      'Warranty': '1 Year Domestic'
    },
    description: 'Galaxy S24 Ultra marks a historic shift in mobile intelligence. Features Galaxy AI tools like Live Translate, Note Assist, and Circle to Search, alongside a gorgeous flat titanium screen and built-in S Pen.',
    highlights: [
      'Built-in S Pen for precise sketching and note-taking',
      'Stunning 200MP sensor with AI Zoom and Nightography',
      'Galaxy AI features integrated deeply into the user experience',
      'Corning Gorilla Armor screen reducing glare by up to 75%'
    ],
    pros: [
      'Unrivaled screen clarity and brightness in daylight',
      'Versatile quad camera with incredible 5x optical telephoto lens',
      '7 years of Android OS and security updates guaranteed',
      'Excellent battery life easily lasting 1.5 to 2 days'
    ],
    cons: [
      'Bulky and heavy in hand',
      'Very slow charging compared to Chinese flagships',
      'High price tag'
    ],
    aiScore: 95,
    aiRecommendation: 'The absolute king of productivity on Android. The built-in S Pen and class-leading flat display make it an outstanding tool for business professionals, artists, and power users. Truly futuristic mobile intelligence.',
    isTrending: true,
    isPopular: true
  },
  {
    id: 'phone-3',
    name: 'OnePlus 12R',
    category: 'Smartphones',
    brand: 'OnePlus',
    price: 39999,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
    specs: {
      'Display': '6.78-inch AMOLED, 1.5K, 120Hz ProXDR LTPO4.0',
      'Processor': 'Snapdragon 8 Gen 2',
      'Storage': '128GB / 256GB UFS 3.1/4.0',
      'Battery': '5500mAh, 100W SUPERVOOC charging',
      'Camera': '50MP Sony IMX890 + 8MP Ultra-wide + 2MP Macro',
      'OS': 'OxygenOS based on Android 14',
      'Weight': '207g',
      'Warranty': '1 Year Manufacturer'
    },
    description: 'The performance powerhouse that punches way above its price point. It pairs the high-performance Snapdragon 8 Gen 2 with an industry-leading 5500mAh battery and crazy fast 100W charging.',
    highlights: [
      'Massive 5500mAh battery - largest ever on a OnePlus phone',
      '100W SUPERVOOC charging - 1% to 100% in 26 minutes',
      '4th Generation LTPO ProXDR Display with up to 4500 nits peak brightness',
      'Dual Cryo-velocity VC cooling system for sustained gaming performance'
    ],
    pros: [
      'Incredible battery life and blazing fast charging speeds',
      'Top-tier flagship level display quality',
      'Very capable main camera in good lighting conditions',
      'Attractive metal frame premium build'
    ],
    cons: [
      'Secondary ultra-wide and macro cameras are mediocre',
      'No wireless charging',
      'No official IP68 rating (rated IP64 instead)'
    ],
    aiScore: 91,
    aiRecommendation: 'The ultimate performance-to-price champion. If you are a heavy mobile gamer, media consumer, or value battery endurance above all else and have a budget under ₹40,000, this is the absolute best buy.',
    isBestBudget: true,
    isPopular: true
  },

  // Laptops
  {
    id: 'lap-1',
    name: 'Apple MacBook Air M3 (13-inch)',
    category: 'Laptops',
    brand: 'Apple',
    price: 114900,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
    specs: {
      'Display': '13.6-inch Liquid Retina Display with True Tone',
      'Processor': 'Apple M3 chip (8-core CPU / 10-core GPU)',
      'Memory': '8GB / 16GB / 24GB Unified Memory',
      'Storage': '256GB / 512GB / 1TB / 2TB SSD',
      'Battery': 'Up to 18 hours wireless web',
      'Keyboard': 'Backlit Magic Keyboard with Touch ID',
      'Weight': '1.24 kg',
      'Warranty': '1 Year Apple Limited Warranty'
    },
    description: 'The world\'s most popular laptop is now even better with the supercharged M3 chip. With up to 18 hours of battery life and a striking, fanless, silent aluminum enclosure, it does it all with incredible speed.',
    highlights: [
      'Strikingly thin, fanless design that runs completely silent',
      'M3 chip supporting hardware-accelerated ray tracing',
      'Dual external display support (with laptop lid closed)',
      'MagSafe 3 charging port and two Thunderbolt / USB 4 ports'
    ],
    pros: [
      'Spectacular battery life and outstanding energy efficiency',
      'Superb keyboard, giant glass trackpad, and rich sound stage',
      'Ultra-portable, premium recycled aluminum chassis',
      'Zero performance drop when unplugged'
    ],
    cons: [
      'Base model starts with only 8GB unified memory and 256GB storage',
      'Not user-upgradable after purchase',
      'Only supports two external monitors when the lid is closed'
    ],
    aiScore: 96,
    aiRecommendation: 'The perfect all-round laptop for students, writers, developers, and general business workers. Opt for the 16GB memory configuration to futureproof your investment. It holds the crown for lightweight productivity.',
    isEditorChoice: true,
    isPopular: true
  },
  {
    id: 'lap-2',
    name: 'ASUS Vivobook 16 OLED',
    category: 'Laptops',
    brand: 'ASUS',
    price: 68990,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80',
    specs: {
      'Display': '16.0-inch, 3.2K (3200 x 2000) OLED 16:10, 120Hz',
      'Processor': 'Intel Core i5-13500H (13th Gen)',
      'Memory': '16GB DDR4 RAM',
      'Storage': '512GB M.2 NVMe PCIe 4.0 SSD',
      'Battery': '70WHrs, 3-cell Li-ion, up to 6 hours',
      'Graphics': 'Intel Iris Xe Graphics',
      'Weight': '1.88 kg',
      'Warranty': '1 Year Onsite'
    },
    description: 'Bring color and clarity to your world with Vivobook 16 OLED. Featuring a brilliant 16:10 aspect ratio 120Hz OLED screen, a robust 13th Gen Intel H-Series processor, and modern connectivity options.',
    highlights: [
      'Stunning 120Hz OLED NanoEdge display with 100% DCI-P3 gamut',
      'High-performance H-series processor for heavy multitasking',
      '180-degree lay-flat hinge for easy screen sharing',
      'ASUS ErgoSense keyboard for comfortable typing'
    ],
    pros: [
      'Absolutely breathtaking OLED screen with pure blacks and vivid colors',
      'Fast 13th Gen H-Series processor handles coding and media easily',
      '16GB RAM included out of the box at an attractive price',
      'Generous 16-inch screen real estate'
    ],
    cons: [
      'Battery life is mediocre due to large OLED screen',
      'Plastic build lacks premium metal feel',
      'Underwhelming graphics capability for modern high-end gaming'
    ],
    aiScore: 89,
    aiRecommendation: 'This is an outstanding choice for programmers, content editors, and office workers who want a gorgeous big screen and fast processing speed without spending over ₹70,000. It is a certified value-for-money winner.',
    isBestBudget: true,
    isTrending: true
  },

  // Tablets
  {
    id: 'tab-1',
    name: 'Apple iPad Air M2',
    category: 'Tablets',
    brand: 'Apple',
    price: 59900,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
    specs: {
      'Display': '11-inch Liquid Retina Display, True Tone, 500 nits',
      'Processor': 'Apple M2 chip (8-core CPU / 9-core GPU)',
      'Storage': '128GB / 256GB / 512GB / 1TB',
      'Camera': '12MP Wide back camera, 12MP Landscape Ultra Wide front camera',
      'Battery': 'Up to 10 hours of surfing the web on Wi-Fi',
      'OS': 'iPadOS 17',
      'Weight': '462g',
      'Warranty': '1 Year Apple Warranty'
    },
    description: 'The redesigned iPad Air is supercharged by the blazing-fast Apple M2 chip. It features a stunning Liquid Retina display, a new landscape front camera perfect for video calls, and supports Apple Pencil Pro.',
    highlights: [
      'Supercharged by Apple M2 chip with 8-core CPU and 9-core GPU',
      'Supports the brand new Apple Pencil Pro with squeeze gesture and haptic feedback',
      'Landscape 12MP Ultra Wide front camera with Center Stage',
      'Fast Wi-Fi 6E connectivity and landscape stereo speakers'
    ],
    pros: [
      'Incredibly fast M2 chip offers years of futureproofing',
      'Excellent center-aligned video calling experience',
      'Rich accessory ecosystem (Magic Keyboard, Apple Pencil Pro)',
      'Great screen aspect ratio for productivity'
    ],
    cons: [
      'Display is still locked to a standard 60Hz refresh rate',
      'Accessories are extremely expensive and sold separately',
      'Base storage is now 128GB, which is okay but not amazing'
    ],
    aiScore: 92,
    aiRecommendation: 'The iPad Air M2 is the sweet-spot iPad. For students, digital artists, and digital note-takers, this device offers 90% of the iPad Pro features and performance at a much more palatable price.',
    isEditorChoice: true
  },

  // Smartwatches
  {
    id: 'watch-1',
    name: 'Apple Watch Series 9',
    category: 'Smartwatches',
    brand: 'Apple',
    price: 41900,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80',
    specs: {
      'Display': 'Always-On Retina LTPO OLED, Up to 2000 nits brightness',
      'Processor': 'S9 SiP with 4-core Neural Engine',
      'Battery': 'Up to 18 hours (36 hours in Low Power Mode)',
      'Sensors': 'Blood Oxygen, ECG, Temperature, Optical Heart Rate',
      'Water Resistance': 'Swimproof (WR50), Dust resistant (IP6X)',
      'Connectivity': 'GPS / Cellular option, Ultra Wideband chip',
      'Warranty': '1 Year Apple Warranty'
    },
    description: 'Apple Watch Series 9 is more capable, easier to use, and faster than ever. Powered by the custom Apple silicon S9 SiP, it enables a magical new way to use your watch without touching the screen: Double Tap.',
    highlights: [
      'S9 SiP with 4-core Neural Engine for on-device Siri processing',
      'Double Tap gesture to answer calls, pause music, or scroll widgets',
      'Stunning 2000-nit display that goes down to just 1 nit in dark rooms',
      'Carbon-neutral case and band combinations available'
    ],
    pros: [
      'Double Tap gesture is incredibly intuitive in daily use',
      'Fastest, most fluid smartwatch interface on the market',
      'On-device Siri is incredibly quick and responsive',
      'Unmatched health tracking accuracy (ECG, Heart rate, Sleep)'
    ],
    cons: [
      'Battery life remains poor, requiring daily charging',
      'Only compatible with Apple iPhones',
      'Minor visual design updates over the Series 8'
    ],
    aiScore: 90,
    aiRecommendation: 'If you own an iPhone and want a smartwatch, look no further. The Series 9 is the gold standard of wearable technology with seamless ecosystem integration. If you want multi-day battery, consider the Garmin or Apple Ultra.',
    isTrending: true
  },

  // Earbuds & Headphones
  {
    id: 'audio-1',
    name: 'Sony WH-1000XM5',
    category: 'Headphones',
    brand: 'Sony',
    price: 29990,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    specs: {
      'Type': 'Over-ear, Closed-back wireless headphones',
      'Driver Size': '30mm high-compliance dome unit',
      'Battery Life': 'Up to 30 hours (ANC ON), 40 hours (ANC OFF)',
      'Charging': 'USB-PD Fast charging (3 min charge for 3 hours playback)',
      'Connectivity': 'Bluetooth 5.2, Multipoint, LDAC, AAC, SBC',
      'Microphones': '8 microphones total with beamforming & wind-noise reduction',
      'Weight': '250g',
      'Warranty': '1 Year National'
    },
    description: 'Sony WH-1000XM5 headphones rewrite the rules of distraction-free listening. Features two processors controlling 8 microphones, Auto NC Optimizer, and an ultra-comfortable lightweight design.',
    highlights: [
      'Industry-leading Active Noise Cancellation with Auto NC Optimizer',
      'High-Resolution audio wireless with LDAC support',
      'Superior hands-free call quality with 4 beamforming microphones',
      'Speak-to-Chat feature that automatically pauses music when you speak'
    ],
    pros: [
      'Unbelievable Active Noise Cancellation that blocks out planes and offices',
      'Rich, detailed sound stage with customizable EQ in the Sony app',
      'Multipoint connection works flawlessly between laptop and phone',
      'Industry-best microphone call clarity in noisy environments'
    ],
    cons: [
      'Headband design does not fold up compactly like the XM4',
      'Price is premium',
      'Not waterproof or water-resistant'
    ],
    aiScore: 95,
    aiRecommendation: 'The best noise-cancelling headphones money can buy. Perfect for frequent flyers, remote workers in noisy environments, and audiophiles who want wireless convenience. A gold-standard purchase.',
    isEditorChoice: true,
    isPopular: true
  },
  {
    id: 'audio-2',
    name: 'OnePlus Buds 3',
    category: 'Earbuds',
    brand: 'OnePlus',
    price: 5499,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
    specs: {
      'Type': 'Truly Wireless Earbuds',
      'Drivers': 'Dual dynamic drivers (10.4mm woofer + 6mm tweeter)',
      'ANC': 'Up to 49dB Smart Active Noise Cancellation',
      'Battery Life': 'Up to 44 hours total with case (ANC OFF)',
      'Charging': '10-minute charge for 7 hours of music playback',
      'Water Resistance': 'IP55 dust and water resistance',
      'Codecs': 'LHDC 5.0, AAC, SBC',
      'Warranty': '1 Year Manufacturer'
    },
    description: 'The OnePlus Buds 3 deliver premium audio performance and modern smart features at a fraction of the cost of typical flagship wireless earbuds. Dual drivers ensure powerful bass and crisp highs.',
    highlights: [
      'Dual Dynamic Drivers for exceptional high-resolution audio detail',
      'Powerful 49dB Adaptive Active Noise Cancellation',
      'LHDC 5.0 high-def codec for near-lossless wireless transmission',
      'Sliding volume control gestures directly on the earbud stems'
    ],
    pros: [
      'Unbelievable audio quality for a budget-friendly price point',
      'Extremely comfortable, lightweight fit inside the ear',
      'Excellent quick charging and stellar total battery longevity',
      'Outstanding companion app with deep EQ customization'
    ],
    cons: [
      'High-res LHDC codec is only supported on select compatible Android phones',
      'Case feels lightweight and slightly plasticky',
      'Fit might feel slightly loose during heavy workouts'
    ],
    aiScore: 92,
    aiRecommendation: 'An absolute budget masterpiece. At ₹5,499, these earbuds offer sound quality and noise cancellation features that easily rival earbuds costing ₹15,000+. A highly recommended buy for Android users.',
    isBestBudget: true
  },

  // Televisions
  {
    id: 'tv-1',
    name: 'LG C3 55-inch OLED TV',
    category: 'Televisions',
    brand: 'LG',
    price: 119990,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&q=80',
    specs: {
      'Display': '55-inch Self-lit OLED, 4K UHD, 120Hz native',
      'Processor': 'α9 AI Processor Gen6 4K',
      'HDR': 'Dolby Vision / HDR10 / HLG',
      'Audio': '40W 2.2 Channel Dolby Atmos audio system',
      'Smart OS': 'webOS 23 Smart TV platform',
      'Gaming': 'NVIDIA G-Sync, AMD FreeSync, 4 x HDMI 2.1 ports',
      'Warranty': '1 Year Comprehensive + 2 Years on Panel'
    },
    description: 'The absolute benchmark for television picture quality. Powered by the high-performance α9 AI Processor Gen6, LG C3 OLED displays feature self-lighting pixels that achieve infinite contrast and perfect blacks.',
    highlights: [
      'Self-lighting pixels with infinite contrast and 100% color volume',
      'α9 Gen6 AI processor optimizing audio and visual detail in real time',
      'Ultra-slim design with minimalist gallery stand mounting compatibility',
      'All 4 HDMI ports support full 48Gbps HDMI 2.1 specs for 4K 120Hz gaming'
    ],
    pros: [
      'Perfect black levels and unparalleled contrast ratio',
      'The absolute best television for modern gaming (PS5, Xbox Series X)',
      'Extremely intuitive Magic Remote with pointer control',
      'Stunningly thin aesthetic'
    ],
    cons: [
      'Does not get as bright as QD-OLED or high-end Mini-LED TVs',
      'Glossy screen can catch reflections in very bright rooms',
      'Audio quality is thin, and a dedicated soundbar is highly recommended'
    ],
    aiScore: 96,
    aiRecommendation: 'The standard-bearer for premium television displays. Whether you are a movie buff watching HDR content or a hardcore console gamer seeking zero latency, the LG C3 OLED is the absolute best screen in this size class.',
    isEditorChoice: true
  },

  // Gaming Accessories
  {
    id: 'game-1',
    name: 'Logitech G Pro X Superlight 2',
    category: 'Gaming Accessories',
    brand: 'Logitech',
    price: 15995,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80',
    specs: {
      'Sensor': 'HERO 2 Sensor, up to 32,000 DPI',
      'Polling Rate': 'Max 2000Hz (0.5ms response time)',
      'Switches': 'LIGHTFORCE Hybrid Optical-Mechanical Switches',
      'Weight': '60g ultra-lightweight design',
      'Battery Life': 'Up to 95 hours continuous motion',
      'Connectivity': 'LIGHTSPEED wireless, USB-C wired',
      'Warranty': '2 Years Limited Hardware Warranty'
    },
    description: 'The evolution of a championship-winning gaming mouse. Now faster, more precise, and weighing only 60 grams, it features the hybrid LIGHTFORCE switches and the ultra-accurate HERO 2 sensor.',
    highlights: [
      'Ultra-lightweight 60g chassis with perfect structural balance',
      'LIGHTFORCE optical-mechanical hybrid switches for crispy tactile clicks',
      'HERO 2 sensor delivering sub-micron tracking accuracy',
      'USB-C charging and full Powerplay charging pad compatibility'
    ],
    pros: [
      'Sensationally light weight and incredibly agile on the desk',
      'Legendary safe, comfortable ambidextrous shape',
      'Optical hybrid switches remove double-clicking issues completely',
      'Outstanding 95-hour battery longevity'
    ],
    cons: [
      'Extremely premium price tag for a mouse',
      'No dedicated DPI toggle button on the mouse itself',
      'No Bluetooth support (LIGHTSPEED dongle only)'
    ],
    aiScore: 93,
    aiRecommendation: 'The absolute standard for competitive esports gaming. If you play fast-paced shooters like Valorant, Apex Legends, or Counter-Strike, this lightweight wireless mouse offers unmatched precision.'
  },
  
  // Smartphones additions
  {
    id: 'phone-4',
    name: 'Google Pixel 8 Pro',
    category: 'Smartphones',
    brand: 'Google',
    price: 106999,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
    specs: {
      'Display': '6.7-inch Super Actua LTPO OLED, 120Hz',
      'Processor': 'Google Tensor G3 (Titan M2)',
      'Storage': '128GB / 256GB / 512GB / 1TB',
      'Battery': '5050mAh, 30W Fast Charging, Wireless Charging',
      'Camera': '50MP Main + 48MP Ultra-wide + 48MP 5x Telephoto',
      'OS': 'Android 14 (7 Years OS updates)',
      'Weight': '213g',
      'Warranty': '1 Year Domestic'
    },
    description: 'The ultimate AI-first smartphone. Driven by the custom-designed Google Tensor G3 chip, the Pixel 8 Pro delivers stunning photo and video editing capabilities like Magic Editor, Audio Magic Eraser, and Best Take, backed by an industry-first 7-year software guarantee.',
    highlights: [
      'Stunning Super Actua display - Google\'s brightest screen ever',
      'Advanced triple camera system with unmatched low-light performance',
      'Exclusive Gemini Nano AI integration for on-device summaries and smart replies',
      'Built-in thermometer sensor for instant temperature readings'
    ],
    pros: [
      'Best-in-class camera system, particularly for natural skin tones',
      '7 full years of Android OS, feature drops, and security updates',
      'Superb, highly intuitive vanilla Android user experience',
      'Outstanding AI tools that genuinely assist in daily tasks'
    ],
    cons: [
      'Tensor G3 processor runs warmer and is less powerful than rivals',
      'Charging speeds are slow compared to Chinese competitors',
      'Battery life is average under heavy 5G usage'
    ],
    aiScore: 93,
    aiRecommendation: 'The smartest smartphone on the planet. Pixel 8 Pro is the absolute best buy for camera purists, Android enthusiasts, and anyone who wants to experience cutting-edge AI features first-hand with the guarantee of a 7-year device life cycle.',
    isTrending: true,
    isPopular: true
  },
  {
    id: 'phone-5',
    name: 'Samsung Galaxy A55 5G',
    category: 'Smartphones',
    brand: 'Samsung',
    price: 39999,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80',
    specs: {
      'Display': '6.6-inch Super AMOLED, 120Hz, Gorilla Glass Victus+',
      'Processor': 'Exynos 1480 (4nm) with AMD Xclipse 530 GPU',
      'Storage': '128GB / 256GB with MicroSD support',
      'Battery': '5000mAh, 25W Fast Charging',
      'Camera': '50MP Main (OIS) + 12MP Ultra-wide + 5MP Macro',
      'OS': 'Android 14 (One UI 6.1)',
      'Weight': '213g',
      'Warranty': '1 Year Domestic'
    },
    description: 'Samsung\'s premium mid-ranger brings a gorgeous metal frame, flagship Gorilla Glass Victus+ protection, and a highly optimized AMD RDNA2-based graphics processor to the sub-40k price point.',
    highlights: [
      'Premium metal-and-glass build mimicking the flagship S24 look',
      'Excellent Exynos 1480 processor featuring AMD-powered gaming graphics',
      'Full IP67 dust and water resistance rating',
      '4 generation OS upgrades and 5 years of security updates'
    ],
    pros: [
      'Sensational build quality that feels indistinguishable from flagships',
      'Superb battery life easily reaching 2 days of moderate use',
      'MicroSD expandable card slot up to 1TB is a rare plus',
      'Beautiful, color-accurate AMOLED screen with high brightness'
    ],
    cons: [
      'Large, thick bezels around the front display',
      'Charges relatively slowly (25W, charger sold separately)',
      'Underwhelming low-light performance on ultra-wide camera'
    ],
    aiScore: 88,
    aiRecommendation: 'The safest, most durable premium mid-ranger. If you want flagship-level build aesthetics, standard waterproofing, and a long software support window without crossing the ₹40,000 mark, the Galaxy A55 is the king of reliability.',
    isBestBudget: true
  },
  {
    id: 'phone-6',
    name: 'Nothing Phone (2a)',
    category: 'Smartphones',
    brand: 'Nothing',
    price: 23999,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
    specs: {
      'Display': '6.7-inch Flexible AMOLED, 120Hz, 10-bit color',
      'Processor': 'MediaTek Dimensity 7200 Pro (4nm)',
      'Storage': '128GB / 256GB RAM options',
      'Battery': '5000mAh, 45W Fast Charging',
      'Camera': '50MP Main (OIS) + 50MP Ultra-wide dual array',
      'OS': 'Nothing OS 2.5 based on Android 14',
      'Weight': '190g',
      'Warranty': '1 Year Brand Warranty'
    },
    description: 'An exceptionally unique, designer-centric budget smartphone. It inherits Nothing\'s famous transparent back design and Glyph interface light strips while delivering punchy MediaTek performance and dual high-res 50MP rear cameras.',
    highlights: [
      'Iconic transparent design with functional back-lighting Glyph Interface',
      'Custom co-engineered MediaTek Dimensity 7200 Pro power efficiency',
      'Dual 50MP rear camera sensors - rare for this price category',
      'Clean Nothing OS with gorgeous widgets and zero bloatware'
    ],
    pros: [
      'Extremely striking visual look that stands out in a sea of clones',
      'Stellar battery life combined with rapid 45W charging',
      'Wonderfully smooth, fast UI with highly polished widget library',
      'Dual 50MP cameras capture excellent detailed shots with accurate HDR'
    ],
    cons: [
      'Completely plastic build (frame and back panel)',
      'No charger included in the retail packaging',
      'Glyph lighting is slightly stripped down compared to Phone (2)'
    ],
    aiScore: 90,
    aiRecommendation: 'The ultimate budget style statement. For under ₹25,000, Nothing Phone (2a) offers a clean Android experience, amazing battery, dual 50MP cameras, and a beautiful design. Highly recommended for students and creative professionals.',
    isBestBudget: true,
    isTrending: true
  },

  // Laptops additions
  {
    id: 'lap-3',
    name: 'Lenovo Legion Slim 5',
    category: 'Laptops',
    brand: 'Lenovo',
    price: 112990,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80',
    specs: {
      'Display': '16-inch WQXGA (2560x1600) IPS, 165Hz, 100% sRGB',
      'Processor': 'AMD Ryzen 7 7840HS (8 Cores / 16 Threads)',
      'Memory': '16GB DDR5 5600MHz RAM',
      'Storage': '1TB M.2 PCIe Gen 4 SSD',
      'Graphics': 'NVIDIA GeForce RTX 4060 (8GB GDDR6, 140W TGP)',
      'Battery': '80Wh with 230W Slim AC Adapter',
      'Weight': '2.3 kg',
      'Warranty': '1 Year Onsite + Accidental Damage Protection'
    },
    description: 'The ultimate balance of gaming raw power and portable design. Powered by the incredible 4nm AMD Ryzen 7 7840HS processor and high-wattage NVIDIA RTX 4060 graphics, the Legion Slim 5 delivers jaw-dropping framerates in a sleek, under-stated chassis perfect for coding, editing, and competitive esports.',
    highlights: [
      'Lenovo Legion Coldfront 5.0 advanced cooling system',
      'TrueStrike gaming keyboard with 4-zone customizable RGB backlight',
      'NVIDIA DLSS 3 frame generation support for cinematic framerates',
      'Lenovo LA1 AI chip optimizing system performance on the fly'
    ],
    pros: [
      'Incredible gaming performance at 1080p and 1440p resolutions',
      'Excellent thermal management - runs cool under sustained heavy workloads',
      'Ryzen 7840HS is highly power efficient, extending offline battery life',
      'Sturdy, understated aluminum design that doesn\'t shout "gamer"'
    ],
    cons: [
      'Power brick is large and heavy to carry around',
      'Average built-in webcam quality (1080p but looks grainy in low light)',
      'Display is IPS, not OLED, so blacks are not completely absolute'
    ],
    aiScore: 92,
    aiRecommendation: 'The gold standard for mid-range gaming and heavy engineering/coding workloads. The RTX 4060 combined with the Ryzen 7 is the absolute sweet spot for value-conscious gamers and creators alike.',
    isTrending: true
  },
  {
    id: 'lap-4',
    name: 'HP Spectre x360 14-inch',
    category: 'Laptops',
    brand: 'HP',
    price: 164999,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
    specs: {
      'Display': '14.0-inch, 2.8K (2880 x 1800) OLED Touchscreen, 120Hz',
      'Processor': 'Intel Core Ultra 7 155H with Intel Arc Graphics',
      'Memory': '32GB LPDDR5x onboard RAM',
      'Storage': '2TB M.2 NVMe PCIe 4.0 SSD',
      'Battery': '68Wh with 65W USB-C charger',
      'Form Factor': '2-in-1 convertible with HP rechargeable pen included',
      'Weight': '1.44 kg',
      'Warranty': '1 Year Onsite + ADP'
    },
    description: 'The pinnacle of Windows convertible luxury. HP\'s Spectre x360 features an outstanding 2.8K 120Hz OLED touch panel, the latest AI-enabled Intel Core Ultra 7 processor, dual Thunderbolt ports, and premium gemstone-cut styling.',
    highlights: [
      'Sensational 360-degree rotating hinge design with interactive touch pen',
      'Intel Core Ultra 7 platform with dedicated neural processing unit (NPU)',
      'Spectacular 9MP smart camera with AI auto-framing and walk-away locks',
      'Four Poly studio speakers for rich, enveloping surround sound'
    ],
    pros: [
      'Incredible design aesthetics, gem-cut styling with premium build',
      'Stunning 120Hz OLED screen with extreme color accuracy and deep contrast',
      'Includes 32GB RAM and massive 2TB SSD out of the box',
      'Includes active stylus and leather sleeve in the retail packaging'
    ],
    cons: [
      'Very expensive entry price tag',
      'Onboard memory is soldered and cannot be upgraded later',
      'Battery life decreases when pushed with high-intensity creator tasks'
    ],
    aiScore: 94,
    aiRecommendation: 'The ultimate premium 2-in-1 laptop. Perfect for executives, content creators, digital artists, and power users who demand high-tier performance, luxurious aesthetics, and the flexibility of tablet tablet-stylus interactions in one cohesive machine.',
    isEditorChoice: true,
    isBestPremium: true
  },

  // Tablets additions
  {
    id: 'tab-2',
    name: 'Samsung Galaxy Tab S9 FE',
    category: 'Tablets',
    brand: 'Samsung',
    price: 36999,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
    specs: {
      'Display': '10.9-inch WQXGA IPS LCD, 90Hz refresh rate',
      'Processor': 'Exynos 1380 (5nm)',
      'Memory': '6GB / 8GB RAM',
      'Storage': '128GB / 256GB (microSD expandable)',
      'Stylus': 'IP68 waterproof S Pen included in box',
      'Battery': '8000mAh, 45W Fast Charging',
      'OS': 'Android 14 (One UI 6 for Tablet)',
      'Weight': '523g',
      'Warranty': '1 Year Manufacturer Warranty'
    },
    description: 'Samsung\'s premium-style tablet brings standard IP68 waterproofing, a highly-functional metal chassis, and the iconic S Pen stylus (with 4096 pressure levels) directly to the mid-tier market.',
    highlights: [
      'Standard IP68 water and dust resistance - rare for any tablet',
      'S Pen included in box - zero accessory surcharge',
      'Samsung DeX desktop-mode integration for seamless work productivity',
      'Dual AKG-tuned stereo speakers with Dolby Atmos sound'
    ],
    pros: [
      'S Pen provides spectacular latency-free writing and drawing',
      'Waterproofing offers ultimate peace of mind near pools/beaches',
      'MicroSD expansion supports up to 1TB additional files',
      'Outstanding metal design and long-lasting 8000mAh battery'
    ],
    cons: [
      'Display is LCD, not AMOLED',
      'No charger included in the box',
      'Processor is average for high-performance 3D gaming'
    ],
    aiScore: 89,
    aiRecommendation: 'The best Android tablet for students and remote workers. If you want a digital writing tablet with an included premium pen, waterproof durability, and desktop multitasking capabilities (DeX), this is the absolute smart choice.',
    isBestBudget: true
  },
  {
    id: 'tab-3',
    name: 'Xiaomi Pad 6',
    category: 'Tablets',
    brand: 'Xiaomi',
    price: 24999,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
    specs: {
      'Display': '11.0-inch, 2.8K (2880 x 1800) IPS LCD, 144Hz, 10-bit',
      'Processor': 'Snapdragon 870 (7nm flagship tier)',
      'Memory': '6GB / 8GB LPDDR5 RAM',
      'Storage': '128GB / 256GB UFS 3.1 storage',
      'Battery': '8840mAh, 33W charging (charger in-box)',
      'OS': 'MIUI for Pad based on Android 13 (upgradable)',
      'Weight': '490g',
      'Warranty': '1 Year Brand Warranty'
    },
    description: 'The undisputed budget performance champion in tablets. Xiaomi Pad 6 packs a breathtaking 144Hz 2.8K display, a super-fast Snapdragon 870 processor, a full unibody metal chassis, and a monstrous 8840mAh battery for an unbeatable price.',
    highlights: [
      'Stunning 144Hz variable refresh rate 2.8K display',
      'Snapdragon 870 processor delivering top-tier sustained gaming performance',
      'Monolithic aluminum alloy unibody design - just 6.51mm thin',
      'Quad speakers with Dolby Vision and Dolby Atmos'
    ],
    pros: [
      'Incredible price-to-performance ratio',
      'Flawless 144Hz scroll speed and movie playback',
      'Powerful chipset easily handles heavy 3D games and multitasking',
      'Comes with a fast charger in the box'
    ],
    cons: [
      'No cellular LTE option (Wi-Fi only)',
      'No GPS chip or headphone jack',
      'Stylus and keyboard are sold separately and hard to find'
    ],
    aiScore: 92,
    aiRecommendation: 'The best budget tablet on the market. For entertainment, gaming, reading, and casual study, no other device comes close to the specs and value of the Xiaomi Pad 6 at under ₹25,000.',
    isBestBudget: true,
    isPopular: true
  },

  // Smartwatches additions
  {
    id: 'watch-2',
    name: 'Samsung Galaxy Watch 6 (44mm)',
    category: 'Smartwatches',
    brand: 'Samsung',
    price: 29999,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80',
    specs: {
      'Display': '1.5-inch Super AMOLED, Sapphire Crystal Glass, 2000 nits',
      'Processor': 'Exynos W930 (5nm dual-core)',
      'Battery': '425mAh (up to 40 hours)',
      'Sensors': 'BioActive sensor (Heart rate, ECG, BIA), Sleep tracker, Skin temp',
      'OS': 'Wear OS 4 with One UI 5 Watch',
      'Weight': '33.3g',
      'Warranty': '1 Year Domestic'
    },
    description: 'The standard-bearer for Android wearables. Features a larger active display with slimmed-down bezels, robust titanium-like aluminum construction, advanced sleep coaching, and full Body Composition analysis (BIA).',
    highlights: [
      'Large Super AMOLED display protected by highly durable Sapphire Crystal',
      'Bioelectrical Impedance Analysis (BIA) measuring body fat, skeletal muscle',
      'Personalized heart rate zones and custom fitness run logging',
      'Full suite of Wear OS applications (Google Maps, Wallet, Assistant)'
    ],
    pros: [
      'Brightest, crispest screen available on any Android watch',
      'Highly comprehensive health tracking suite',
      'Excellent Google app ecosystem and fluid performance',
      'Superb notification controls and keyboard reply options'
    ],
    cons: [
      'Battery life requires a daily charge under heavy sensor usage',
      'ECG and Blood Pressure tracking require a Samsung smartphone',
      'Not compatible with iOS devices'
    ],
    aiScore: 91,
    aiRecommendation: 'The absolute best everyday smartwatch for Android users. If you have a Samsung or standard Android phone and want seamless app installations, calling capability, and advanced medical tracking, this is the premier pick.',
    isTrending: true
  },
  {
    id: 'watch-3',
    name: 'Garmin Forerunner 265',
    category: 'Smartwatches',
    brand: 'Garmin',
    price: 50490,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80',
    specs: {
      'Display': '1.3-inch AMOLED touchscreen, Gorilla Glass 3',
      'GPS': 'Dual-Frequency Multi-Band GNSS (SatIQ technology)',
      'Battery': 'Up to 13 days in Smartwatch mode, 20 hours GPS mode',
      'Metrics': 'Training Readiness, HRV Status, Running Power, Garmin Coach',
      'Storage': '8GB onboard music storage',
      'Weight': '47g ultra-lightweight',
      'Warranty': '1 Year Garmin Warranty'
    },
    description: 'A sports-watch masterpiece co-engineered for serious athletes and runners. Garmin pairs a gorgeous, bright AMOLED touchscreen with industry-leading dual-band GPS accuracy and advanced physiological metrics.',
    highlights: [
      'Dual-band SatIQ GPS providing centimeter-level precision in city canyons',
      'Training Readiness Score analyzing sleep, recovery, and training load',
      'Morning Report summarizing sleep, HRV status, weather, and calendar',
      'Astonishing 13-day battery lifespan - eclipses Apple/Samsung'
    ],
    pros: [
      'Incredible battery longevity - charge only twice a month',
      'Unmatched GPS tracking and instant pace accuracy',
      'Deep, highly-detailed running dynamics and physiological recovery stats',
      'Super light on the wrist with both touch screen and buttons controls'
    ],
    cons: [
      'Very sporty plastic build doesn\'t match formal attire',
      'Smartwatch features are basic (no voice calling, limited apps)',
      'Premium pricing compared to general-purpose smartwatches'
    ],
    aiScore: 95,
    aiRecommendation: 'The ultimate wearable for active lifestyles, runners, and triathletes. If you value detailed recovery metrics, accurate route maps, and weeks of battery life over standard smart notification features, this Garmin is unbeatable.',
    isEditorChoice: true,
    isPopular: true
  },

  // Headphones additions
  {
    id: 'audio-3',
    name: 'Bose QuietComfort Ultra',
    category: 'Headphones',
    brand: 'Bose',
    price: 35999,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    specs: {
      'Type': 'Over-ear, wireless ANC headphones',
      'Battery': 'Up to 24 hours (18 hours with Immersive Audio)',
      'Charging': 'USB-C, 15 min quick charge for 2.5 hours',
      'Connectivity': 'Bluetooth 5.3, Snapdragon Sound, Multipoint',
      'Codecs': 'aptX Adaptive, AAC, SBC',
      'Audio Mode': 'Bose Immersive Spatial Audio with head-tracking',
      'Weight': '250g premium foldable design',
      'Warranty': '1 Year Bose Warranty'
    },
    description: 'Bose\'s ultimate noise-cancelling headphones. QC Ultra takes sound isolation to new heights while introducing groundbreaking Immersive Audio for a massive, head-tracking 3D soundstage, wrapped in the plushiest memory foam cushions.',
    highlights: [
      'Custom Tune智能 calibration tailoring noise cancellation to your ear canal',
      'Bose Immersive Spatial Audio with standard and head-tracking modes',
      'Ultra-comfortable design with padded headband and premium synthetic leather',
      'Snapdragon Sound certification for lossless high-resolution audio'
    ],
    pros: [
      'Unrivaled, legendary comfort - perfect for long transcontinental flights',
      'Spectacular noise cancellation that suppresses speech and baby cries',
      'Very wide, natural soundstage with deep punchy bass lines',
      'Folds up neatly into a highly compact protective case'
    ],
    cons: [
      'Premium pricing tag',
      'Immersive audio mode drains battery significantly faster',
      'Companion app is slightly slow to sync on some Android devices'
    ],
    aiScore: 94,
    aiRecommendation: 'The ultimate flight and travel companion. If comfort and premium active noise cancellation are your top priorities, Bose QuietComfort Ultra represents the pinnacle of travel luxury.',
    isBestPremium: true
  },

  // Earbuds additions
  {
    id: 'audio-4',
    name: 'Apple AirPods Pro 2 (USB-C)',
    category: 'Earbuds',
    brand: 'Apple',
    price: 24900,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
    specs: {
      'Type': 'In-ear Truly Wireless Earbuds',
      'Processor': 'Apple H2 chip (Earbuds), U1 chip (Case)',
      'ANC': 'Up to 2x more Active Noise Cancellation than Gen 1',
      'Battery Life': '6 hours per charge, 30 hours total with case',
      'Charging': 'USB-C, MagSafe, Apple Watch charger compatible',
      'Water Resistance': 'IP54 dust, sweat, and water resistant (Earbuds & Case)',
      'Tracking': 'Precision Finding via Find My app (speaker in case)',
      'Warranty': '1 Year Apple Warranty'
    },
    description: 'The absolute standard for wireless earbuds, now updated with USB-C and upgraded IP54 dust resistance. Powered by the H2 chip, it offers custom acoustic algorithms, adaptive audio transparency, and rich spatial audio with dynamic head tracking.',
    highlights: [
      'Advanced H2 silicon chip delivering custom-tuned acoustic dynamics',
      'Adaptive Audio intelligently blending transparency and ANC based on your room noise',
      'Precision Finding case with built-in speaker and loop anchor',
      'Conversational Awareness lowering volume automatically when you speak'
    ],
    pros: [
      'Unbelievably good active noise cancellation and transparency modes',
      'Flawless integration with the Apple iOS ecosystem',
      'Dynamic volume control via sliding swipe gestures on earbud stems',
      'Case can be tracked accurately to the centimeter'
    ],
    cons: [
      'Many advanced features are locked to Apple devices',
      'No custom EQ presets (only adaptive automated EQ)',
      'Silicone tip fit may not suit everyone'
    ],
    aiScore: 96,
    aiRecommendation: 'A must-buy for iPhone users. The integration, ANC performance, and conversational smart features make it the best everyday earbuds on earth for those inside the Apple ecosystem.',
    isEditorChoice: true,
    isPopular: true
  },
  {
    id: 'audio-5',
    name: 'Sony WF-1000XM5',
    category: 'Earbuds',
    brand: 'Sony',
    price: 21990,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
    specs: {
      'Type': 'Truly Wireless Noise Cancelling Earbuds',
      'Drivers': '8.4mm Dynamic Driver X',
      'Processors': 'Integrated Processor V2 + QN2e noise cancelling chip',
      'ANC': 'Industry-leading adaptive noise cancelling',
      'Battery Life': 'Up to 8 hours (24 hours total with case)',
      'Water Resistance': 'IPX4 splash proof',
      'Codecs': 'LDAC, AAC, SBC, LC3',
      'Weight': '5.9g per earbud (25% smaller than XM4)',
      'Warranty': '1 Year Manufacturer Warranty'
    },
    description: 'Sony\'s flagship earbuds redefine wireless sound fidelity. Features a massive 8.4mm Dynamic Driver X, co-processors for unmatched active noise cancellation, and high-res audio streaming via LDAC, all in an incredibly compact, lightweight gloss shell.',
    highlights: [
      'Dynamic Driver X for detailed, expansive low-end and high-end frequency clarity',
      'Dual processor-driven active noise cancellation with six micro-microphones',
      'High-Resolution Audio Wireless with LDAC and DSEE Extreme upscaling',
      'Polyurethane foam tips included for ultimate isolation and fit comfort'
    ],
    pros: [
      'Audiophile-grade sound quality with incredible clarity and instrument separation',
      'Substantial reduction in size and weight over previous generations',
      'Foam ear tips provide a perfect acoustic seal and secure grip',
      'Multipoint connection works perfectly between dual devices'
    ],
    cons: [
      'Glossy plastic body can feel slightly slippery in fingers',
      'Foam tips require replacement over time',
      'High price tag'
    ],
    aiScore: 94,
    aiRecommendation: 'The best sounding wireless earbuds for Android and audiophiles. If you enjoy deep acoustic detail, high-resolution LDAC audio, and want the best non-Apple noise isolation on the market, these are the pinnacle.',
    isTrending: true
  },

  // Televisions additions
  {
    id: 'tv-2',
    name: 'Sony BRAVIA A95L QD-OLED (55-inch)',
    category: 'Televisions',
    brand: 'Sony',
    price: 249990,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&q=80',
    specs: {
      'Display': '55-inch QD-OLED (Quantum Dot OLED), 4K UHD, 120Hz',
      'Processor': 'Cognitive Processor XR',
      'Panel Tech': 'Quantum Dot technology paired with self-lit OLED',
      'HDR': 'Dolby Vision, HDR10, HLG (calibrated modes)',
      'Audio': 'Acoustic Surface Audio+ (60W 2.2 Channel actuate screen)',
      'Smart OS': 'Google TV with Bravia Core streaming app',
      'Warranty': '2 Years Comprehensive Manufacturer Warranty'
    },
    description: 'Sony\'s master series television represents the zenith of display engineering. Combining Quantum Dot vibrant colors with self-lit OLED absolute contrast, all driven by the cognitive intelligence of the XR Processor, it achieves brightness levels and color volumes previously impossible in OLED technology.',
    highlights: [
      'QD-OLED panel delivering up to 200% more brightness than standard OLEDs',
      'Cognitive Processor XR replicating how humans see and hear in real time',
      'Acoustic Surface Audio+ where the entire TV screen vibrates to produce sound',
      'Integrated Google TV with premium hands-free voice controls'
    ],
    pros: [
      'The single best picture quality ever tested on a consumer television',
      'Stunning, mesmerizing color brightness and saturation even in daylit rooms',
      'Built-in audio is so incredible it rivals mid-range soundbars',
      'Beautifully premium metallic frame and flush-surface styling'
    ],
    cons: [
      'Astronomical, ultra-premium price tag',
      'Only 2 HDMI ports support full HDMI 2.1 specifications',
      'Heavier and thicker than standard OLED panels'
    ],
    aiScore: 97,
    aiRecommendation: 'The ultimate luxury television. For home cinema purists, videophiles, and luxury consumers who refuse to compromise on contrast, colors, and smart rendering, the Sony A95L is the absolute king of displays.',
    isBestPremium: true,
    isTrending: true
  },
  {
    id: 'tv-3',
    name: 'Xiaomi Smart TV X Pro (55-inch)',
    category: 'Televisions',
    brand: 'Xiaomi',
    price: 43999,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&q=80',
    specs: {
      'Display': '55-inch 4K UHD LED, 60Hz, Wide Color Gamut',
      'HDR': 'Dolby Vision IQ, HDR10+, HLG',
      'Audio': '40W Stereo speakers with Dolby Atmos and DTS-X',
      'Smart OS': 'Google TV with PatchWall interface integration',
      'Processor': 'Quad-core A55 with Mali-G52 GPU',
      'Connectivity': '3 x HDMI (1 with eARC), 2 x USB, Dual-band Wi-Fi',
      'Warranty': '1 Year Comprehensive + 1 Year on Panel'
    },
    description: 'Xiaomi\'s feature-packed smart TV delivers Dolby Vision IQ, powerful 40W stereo audio, a bezel-less metallic design, and Google TV integration at a highly competitive budget-friendly price point.',
    highlights: [
      'Dolby Vision IQ which dynamically adjusts screen brightness to room light levels',
      'Bezel-less sleek metallic premium frame design',
      'PatchWall UI running alongside Google TV for easy Indian content discovery',
      'Powerful 40W speaker output with virtual surround DTS tech'
    ],
    pros: [
      'Remarkable value for money for a large 55-inch 4K display',
      'Dolby Vision IQ content looks punchy and bright',
      'Robust audio volume that easily fills medium-sized living rooms',
      'Extremely clean Google TV user interface with fluent navigation'
    ],
    cons: [
      'Contrast is average compared to QLED or OLED (uses IPS/VA standard panel)',
      '60Hz refresh rate lacks high-end 120Hz smooth gaming support',
      'Slight color shifts when viewed from extreme side angles'
    ],
    aiScore: 91,
    aiRecommendation: 'The best budget 55-inch TV. If you want a large, cinematic 4K smart television for movie streaming, sports, and casual cable TV without breaking the bank, the Xiaomi X Pro is a certified value champion.',
    isBestBudget: true
  },

  // Handheld Consoles (New Unique Category!)
  {
    id: 'console-1',
    name: 'Steam Deck OLED (1TB)',
    category: 'Handheld Consoles',
    brand: 'Valve',
    price: 59999,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=500&q=80',
    specs: {
      'Display': '7.4-inch 90Hz HDR OLED, 1000 nits peak, anti-glare glass',
      'Processor': '6nm AMD APU (Zen 2 4c/8t + RDNA 2 8 CUs)',
      'Memory': '16GB LPDDR5 6400MT/s RAM',
      'Storage': '1TB NVMe SSD (Premium high-speed)',
      'Battery': '50Wh (3 to 12 hours of gameplay)',
      'OS': 'SteamOS 3 (Arch Linux-based)',
      'Weight': '640g ergonomic handgrip layout',
      'Warranty': '1 Year Seller Warranty'
    },
    description: 'The ultimate portable PC gaming handheld. Valve\'s upgraded Steam Deck features a glorious 90Hz HDR OLED panel, a power-efficient 6nm AMD APU, a substantially larger battery, premium haptics, and dual trackpads to make playing your massive Steam library on the go a dream.',
    highlights: [
      'Monstrous 7.4-inch 90Hz HDR OLED with 1,000,000:1 contrast ratio',
      'Custom 6nm AMD APU optimized for continuous handheld gaming workloads',
      'Two highly precise square trackpads with customizable haptic feedback',
      'Excellent SteamOS interface with console sleep-wake state resumption'
    ],
    pros: [
      'Incredible OLED display with rich, vibrant HDR colors and true black levels',
      'Greatly improved battery life compared to the original LCD version',
      'Superb ergonomics with large comfortable grips and analog triggers',
      'Huge open-source PC game compatibility, emulation capability, and mod support'
    ],
    cons: [
      'Imported pricing in India can fluctuate slightly',
      'Large, bulky physical dimensions can make travel packing tight',
      'Cannot run standard Windows-exclusive anticheat games out of the box'
    ],
    aiScore: 96,
    aiRecommendation: 'The absolute king of portable gaming. For PC gamers who want to tackle their backlog on the couch, or console players wanting high-performance handheld action, the Steam Deck OLED is the absolute benchmark of engineering.',
    isEditorChoice: true,
    isTrending: true
  },
  {
    id: 'console-2',
    name: 'ASUS ROG Ally X',
    category: 'Handheld Consoles',
    brand: 'ASUS',
    price: 89990,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=500&q=80',
    specs: {
      'Display': '7.0-inch FHD (1920x1080) IPS, 120Hz, 500 nits, VRR',
      'Processor': 'AMD Ryzen Z1 Extreme (Zen 4, 8c/16t, RDNA 3)',
      'Memory': '24GB LPDDR5X-7500 dual-channel RAM',
      'Storage': '1TB M.2 2280 NVMe SSD',
      'Battery': '80Wh (Massive double-capacity battery)',
      'OS': 'Windows 11 Home with Armoury Crate SE',
      'Weight': '678g ergonomically refined',
      'Warranty': '1 Year ASUS Warranty'
    },
    description: 'ASUS supercharges handheld Windows gaming. The ROG Ally X delivers the top-tier AMD Z1 Extreme chip paired with a massive 24GB of high-speed RAM, a full standard 1TB 2280 SSD, dual USB-C ports (one USB4), and a gigantic 80Wh battery that solves Windows portable battery issues once and for all.',
    highlights: [
      'Extreme gaming power with Zen 4 Ryzen Z1 Extreme and RDNA 3 graphics',
      'Monster 80Wh battery - double the capacity of the original Ally',
      '24GB of ultra-fast 7500MHz RAM to avoid gaming memory bottlenecks',
      '7-inch 120Hz FHD screen with full Variable Refresh Rate (VRR/FreeSync)'
    ],
    pros: [
      'Incredible performance - runs modern AAA games at smooth framerates',
      'Gigantic battery life that easily delivers 3-4 hours of heavy AAA gaming',
      'Supports full standard size M.2 2280 SSD upgrades',
      'Windows 11 allows playing ANY game launcher (Xbox, Epic, EA, Steam)'
    ],
    cons: [
      'Display is IPS, not OLED',
      'Windows 11 interface can occasionally feel clumsy on a small touch screen',
      'Relatively high price tag'
    ],
    aiScore: 94,
    aiRecommendation: 'The most powerful Windows handheld on the market. If you want to play Xbox Game Pass, Epic Games, and Steam titles at high framerates with VRR screen smoothness and massive battery endurance, the ROG Ally X is the ultimate workstation handheld.',
    isBestPremium: true
  },

  // Cameras (New Unique Category!)
  {
    id: 'camera-1',
    name: 'Sony Alpha 7 IV',
    category: 'Cameras',
    brand: 'Sony',
    price: 199990,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80',
    specs: {
      'Type': 'Mirrorless Interchangeable Lens Camera (Body Only)',
      'Sensor': '33.0 MP Full-Frame Exmor R CMOS back-illuminated',
      'Processor': 'BIONZ XR image processing engine',
      'Autofocus': '759 phase-detection points with Real-time Eye AF',
      'Video': '4K 60p (Super 35), 4K 30p (Full Frame) 10-bit 4:2:2',
      'Stabilization': '5-axis in-body image stabilization (5.5 stops)',
      'Connectivity': 'Full HDMI, USB-C (10Gbps), Dual card slots, Wi-Fi 5GHz',
      'Warranty': '2 Years Sony India Warranty'
    },
    description: 'The definitive hybrid camera for modern creators. Sony\'s Alpha 7 IV bridges the gap between professional-grade photography and cutting-edge cinema recording, boasting a high-resolution 33MP sensor, real-time autofocus tracking for humans/animals/birds, and internal 10-bit color video.',
    highlights: [
      '33MP back-illuminated sensor with exceptional 15-stop dynamic range',
      'BIONZ XR processor delivering 8x more processing capacity',
      'Real-time Eye AF tracking keeping subjects locked in perfect focus',
      '4K 10-bit 4:2:2 recording for rich, flexible color grading'
    ],
    pros: [
      'Phenomenal autofocus system that literally never misses',
      'Excellent 33MP resolution offers room for cropping photos',
      'Full-size HDMI port and robust dual-format card slots',
      'Extensive library of compatible Sony E-mount lenses'
    ],
    cons: [
      '4K 60p video comes with a heavy 1.5x crop factor',
      'Menu system is highly comprehensive but has a steep learning curve',
      'Does not include a charger inside the camera retail box'
    ],
    aiScore: 95,
    aiRecommendation: 'The best all-rounder hybrid camera on earth. For freelance videographers, professional portrait photographers, and high-end content creators looking to build their gear, the A7 IV is the industry gold standard.',
    isEditorChoice: true,
    isTrending: true
  },
  {
    id: 'camera-2',
    name: 'DJI Osmo Pocket 3',
    category: 'Cameras',
    brand: 'DJI',
    price: 43990,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80',
    specs: {
      'Sensor': '1-inch CMOS sensor with f/2.0 aperture lens',
      'Stabilization': 'Integrated 3-axis mechanical gimbal stabilization',
      'Display': '2.0-inch rotatable OLED touchscreen',
      'Video': '4K 120p slow-motion, 4K 60p standard, 10-bit D-Log M',
      'Battery': '1300mAh, 166 minutes recording, fast charge to 80% in 16 min',
      'Weight': '179g ultra-pocketable design',
      'Warranty': '1 Year DJI Authorized Warranty'
    },
    description: 'The ultimate vlogging and travel video tool. DJI packs a large 1-inch CMOS sensor, a physical 3-axis mechanical gimbal, a rotatable 2-inch OLED touchscreen, and advanced ActiveTrack 6.0 into an ultra-portable stick that fits in your pocket.',
    highlights: [
      'Massive 1-inch CMOS sensor capturing breathtaking low-light detail',
      'Mechanical 3-axis gimbal delivering perfectly cinematic, smooth video',
      '2-inch rotatable screen allowing instant horizontal or vertical filming',
      'ActiveTrack 6.0 face-auto tracking staying locked on you as you move'
    ],
    pros: [
      'Astounding low-light video clarity and beautiful background blur',
      'Buttery smooth stabilization far superior to electronic action cameras',
      'Rotatable OLED screen is incredibly clever and fun to interact with',
      'Fast charging goes from empty to usable in mere minutes'
    ],
    cons: [
      'Gimbal mechanism is delicate and requires careful storage in its case',
      'Lens focal length is fixed (no physical optical zoom)',
      'Not waterproof without a bulky external diving case'
    ],
    aiScore: 96,
    aiRecommendation: 'The absolute best vlogging and travel camera available. If you make TikToks, Reels, YouTube travel vlogs, or family movies and want professional-grade cinematic tracking in a pocketable stick, look no further.',
    isPopular: true,
    isTrending: true
  },

  // Smart Projectors (New Unique Category!)
  {
    id: 'projector-1',
    name: 'XGIMI Horizon Ultra',
    category: 'Smart Projectors',
    brand: 'XGIMI',
    price: 189999,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500&q=80',
    specs: {
      'Display': 'DLP, 4K UHD Resolution (3840 x 2116)',
      'Brightness': '2300 ISO Lumens (Dual Light laser & LED)',
      'Contrast': 'Dynamic calibration with Dolby Vision',
      'Audio': 'Dual 12W Harman Kardon speakers, DTS-HD',
      'Smart OS': 'Android TV 11.0 with Chromecast built-in',
      'Auto Keystone': 'ISA 3.0 (Auto-focus, auto-keystone, obstacle avoidance)',
      'Weight': '5.2 kg premium fabric-clad cube',
      'Warranty': '1 Year Brand Warranty'
    },
    description: 'The world\'s first 4K long-throw home projector equipped with Dolby Vision. XGIMI co-developed an innovative Dual Light system merging laser clarity with LED color warmth, paired with Harman Kardon audio and ISA 3.0 intelligent room adaptation.',
    highlights: [
      'Dual Light technology (Laser + LED) for ultra-accurate colors without speckling',
      'Dolby Vision decoding for true cinematic high-contrast HDR highlights',
      'ISA 3.0 intelligent room mapping - wall color adaptation & auto-alignment',
      'Dual 12W Harman Kardon built-in speakers for direct room sound'
    ],
    pros: [
      'Beautifully bright image that looks great even with lights on',
      'Instant, seamless automatic setup - perfectly squares the image on any wall',
      'Breathtaking Dolby Vision cinematic picture with accurate colors',
      'Gorgeous, elegant fabric and light gold chassis that blends into home decor'
    ],
    cons: [
      'Does not natively support Netflix out of the box (requires workaround)',
      'No optical zoom (digital zoom only, which reduces active pixels)',
      'Relatively large and heavy for portable outdoor use'
    ],
    aiScore: 93,
    aiRecommendation: 'The best premium home-theater projector. If you want a gigantic 150-inch cinema experience in your living room with gorgeous color accuracy, painless auto-setup, and built-in luxury audio, this is the ultimate unit.',
    isBestPremium: true
  },
  {
    id: 'projector-2',
    name: 'Anker Nebula Capsule 3 Laser',
    category: 'Smart Projectors',
    brand: 'Anker',
    price: 64999,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500&q=80',
    specs: {
      'Display': 'DLP, 1080p Full HD Native Resolution',
      'Light Source': 'Laser Light Source (lasts up to 30,000 hours)',
      'Brightness': '300 ANSI Lumens',
      'Audio': '8W Dolby Digital speaker',
      'Smart OS': 'Android TV 11.0 (Officially supports Netflix)',
      'Battery': '52Wh (runs up to 2.5 hours on a single charge)',
      'Weight': '950g soda-can portable design',
      'Warranty': '1 Year Brand Warranty'
    },
    description: 'An absolute pocket marvel. Anker\'s Capsule 3 uses a high-efficiency laser light source to deliver bright, sharp 1080p visuals, a built-in battery for untethered movie nights, Dolby sound, and official Android TV with native Netflix support.',
    highlights: [
      'Sleek, soda-can-sized cylindrical chassis - fits easily in backpacks',
      'Laser-driven technology - up to 1.8x brighter than standard LED projectors',
      'Built-in battery delivering 2.5 hours of continuous offline video playback',
      'Official Android TV with licensed Netflix streaming integration'
    ],
    pros: [
      'Exceptional portability - perfect for camping, backyard movies, and travel',
      'Laser light produces punchy, sharp, highly-detailed 1080p images',
      'Painless automatic focus and keystone adjustment',
      'Can be powered via standard USB-C power banks'
    ],
    cons: [
      '300 ANSI lumens is weak in lit rooms - requires a dark environment',
      '8W built-in speaker is decent but lacks deep cinema bass',
      'Long charge times when in active projection use'
    ],
    aiScore: 91,
    aiRecommendation: 'The ultimate portable camping and travel projector. For anyone who wants a portable, battery-powered movie screen that officially runs Netflix and Android TV, the Nebula Capsule 3 is the undisputed leader in size-to-performance.',
    isBestBudget: true,
    isPopular: true
  },

  // Mechanical Keyboards (New Unique Category!)
  {
    id: 'keyboard-1',
    name: 'Keychron Q1 Max (Red Switches)',
    category: 'Mechanical Keyboards',
    brand: 'Keychron',
    price: 18499,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    specs: {
      'Layout': '75% Layout (82 keys with CNC metal rotary encoder knob)',
      'Body': 'Full CNC machined anodized aluminum block',
      'Connectivity': 'Tri-mode (2.4GHz wireless / Bluetooth 5.1 / Type-C wired)',
      'Switches': 'Gateron Jupiter Red (Linear, pre-lubed)',
      'Stabilizers': 'PCB screw-in stabilizers (pre-lubed)',
      'Hot-swap': 'Yes, supports both 3-pin and 5-pin MX mechanical switches',
      'Battery': '4000mAh lithium-polymer',
      'Weight': '1.73 kg hefty stable desk anchor',
      'Warranty': '1 Year Brand Warranty'
    },
    description: 'The holy grail of custom mechanical keyboards. Keychron\'s Q1 Max features a solid, heavy CNC aluminum chassis, a double-gasket structural design for soft, flexible typing, pre-lubed linear red switches, custom IXPE acoustics foam, and full QMK/VIA key-remapping support.',
    highlights: [
      'Full premium CNC-machined heavy aluminum body for maximum desk stability',
      'Double-Gasket mounting design offering a bouncy, fatigue-free typing feel',
      'Full QMK & VIA web integration for unlimited macro and key remapping',
      'Premium PBT double-shot keycaps in classic color profiles'
    ],
    pros: [
      'Sensational, deep "thocky" sound out of the box - no modding required',
      'Exceptional build weight and premium robust feel',
      'Hot-swappable socket makes customizing switches incredibly easy',
      'Incredible wireless connectivity with zero-latency 2.4GHz dongle'
    ],
    cons: [
      'Very heavy (1.7kg) - strictly designed for fixed desk setups',
      'Keycaps do not let backlighting shine through the letters',
      'Battery life with RGB lighting at full brightness is mediocre'
    ],
    aiScore: 95,
    aiRecommendation: 'The ultimate premium keyboard for developers, writers, and keyboard enthusiasts. If you spend 8+ hours a day typing and want the absolute best sounding, feeling, and customisable mechanical keyboard, the Q1 Max is flawless.',
    isEditorChoice: true,
    isTrending: true
  },
  {
    id: 'keyboard-2',
    name: 'NuPhy Air75 V2',
    category: 'Mechanical Keyboards',
    brand: 'NuPhy',
    price: 12999,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    specs: {
      'Layout': '75% Ultra-low profile layout (84 keys)',
      'Body': 'Aluminum alloy top frame with translucent ABS bottom',
      'Connectivity': 'Tri-mode (2.4GHz low latency / Bluetooth 5.0 / Type-C wired)',
      'Switches': 'Gateron Low-Profile Cowberry (Linear, pre-lubed)',
      'Hot-swap': 'Yes, supports low-profile Gateron switches',
      'Keycaps': 'Double-shot PBT low-profile keycaps',
      'Weight': '598g highly portable',
      'Warranty': '1 Year Manufacturer Warranty'
    },
    description: 'The ultimate low-profile wireless mechanical keyboard. The NuPhy Air75 V2 packs a beautiful aluminum frame, pre-lubed low-profile linear switches, custom sound-absorbing silicone, stunning side LED status lights, and a ultra-thin 16mm design designed to fit perfectly on top of MacBook and Windows laptop keyboards.',
    highlights: [
      'Ultra-thin 16mm low-profile build with ergonomic typing angles',
      'Gateron LP Cowberry switches providing incredibly rapid, smooth key activation',
      'Fully compatible with Mac, Windows, and iPad keys mapping in box',
      'Dual customizable RGB sidelights and backlit keyboard animations'
    ],
    pros: [
      'Extremely lightweight, flat, and portable - perfect for traveling work',
      'Crisp, snappy, and satisfying tactile sound for a low-profile keyboard',
      'Fits neatly over MacBook keyboards to upgrade the typing experience',
      'Includes beautiful extra keycaps and tools inside the retail box'
    ],
    cons: [
      'Only compatible with low-profile switches (not standard Cherry MX)',
      'Translucent plastic back looks beautiful but can catch dust',
      'Low keycap profile takes a few days of adaptation for some users'
    ],
    aiScore: 93,
    aiRecommendation: 'The best portable mechanical keyboard in the world. Ideal for travelers, iPad power users, and programmers who want tactile typing on the go without the bulk of a heavy standard keyboard.',
    isBestBudget: true,
    isPopular: true
  },
  {
    id: 'phone-7',
    name: 'Google Pixel 8 Pro',
    category: 'Smartphones',
    brand: 'Google',
    price: 93999,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80',
    specs: {
      'Display': '6.7-inch Super Actua LTPO OLED, 120Hz, 2400 nits',
      'Processor': 'Google Tensor G3',
      'Storage': '128GB / 256GB / 512GB',
      'Battery': '5050mAh, 30W Fast Charging',
      'Camera': '50MP Main + 48MP Ultra-wide + 48MP 5x Telephoto',
      'OS': 'Android 14 (7 Years Updates)',
      'Weight': '213g',
      'Warranty': '1 Year Domestic'
    },
    description: 'The ultimate AI-first smartphone. With Google Tensor G3 and custom computational photography, the Pixel 8 Pro delivers cutting-edge software tricks like Magic Eraser, Best Take, and Video Boost with incredible night-sight video.',
    highlights: [
      'Pro camera system with incredible 5x optical zoom and Macro Focus',
      '7 full years of OS, security, and feature drop updates guaranteed',
      'Super Actua display is highly visible under direct heavy sunlight',
      'Integrated AI tools like Audio Magic Eraser and real-time live interpreter'
    ],
    pros: [
      'Exceptional skin tones and photo color rendition',
      'Clean Pixel Launcher experience with zero bloatware',
      'Phenomenal AI tools that actually simplify daily tasks',
      'Outstanding build quality with polished metal rails'
    ],
    cons: [
      'Tensor G3 runs warmer than Snapdragon 8 Gen 3 under load',
      'Charging speed is relatively sluggish at 30W',
      'Raw graphics performance trails competitive devices'
    ],
    aiScore: 92,
    aiRecommendation: 'For the absolute best still photography experience and a clean, premium Android interface with guaranteed support until 2030, this is the premier Android smartphone.',
    isTrending: true,
    isPopular: true
  },
  {
    id: 'phone-8',
    name: 'Nothing Phone (2a)',
    category: 'Smartphones',
    brand: 'Nothing',
    price: 23999,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80',
    specs: {
      'Display': '6.7-inch Flexible AMOLED, 120Hz, 1300 nits peak',
      'Processor': 'MediaTek Dimensity 7200 Pro',
      'Storage': '128GB / 256GB',
      'Battery': '5000mAh, 45W Fast Charging',
      'Camera': '50MP Main + 50MP Ultra-wide',
      'OS': 'Nothing OS 2.5 (Android 14)',
      'Weight': '190g',
      'Warranty': '1 Year Brand Warranty'
    },
    description: 'A spectacular budget smartphone featuring Nothing\'s iconic transparent design language, custom-built Glyph Interface lights, and a carefully co-engineered power-efficient chip.',
    highlights: [
      'Iconic transparent back with custom customizable Glyph notification LEDs',
      'Dimensity 7200 Pro chip optimized specifically for Nothing OS efficiency',
      'Stunning symmetric thin bezel display with buttery 120Hz scroll rate',
      'Zero-bloatware Nothing OS software experience with rich custom widgets'
    ],
    pros: [
      'Highly unique aesthetic that stands out from the crowd',
      'Outstanding battery life easily delivering 8+ hours screen-on time',
      'Very responsive daily UI performance with fluid transitions',
      'Symmetric thin front bezels look extremely premium'
    ],
    cons: [
      'No wireless charging support',
      'Does not include a charger inside the box',
      'Plastic frame can show fine hair-line scratches over time'
    ],
    aiScore: 89,
    aiRecommendation: 'An absolute masterpiece of budget design. If you want a phone that looks incredible, has a clean bloat-free software experience, and amazing battery under ₹25,000, this is our highest recommendation.',
    isBestBudget: true,
    isTrending: true
  },
  {
    id: 'lap-5',
    name: 'ASUS ROG Zephyrus G14',
    category: 'Laptops',
    brand: 'ASUS',
    price: 144990,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80',
    specs: {
      'Display': '14.0-inch 3K OLED, 120Hz, 0.2ms, G-Sync',
      'Processor': 'AMD Ryzen 9 8945HS (8 cores, up to 5.2GHz)',
      'Graphics': 'NVIDIA GeForce RTX 4060 8GB GDDR6',
      'Memory': '16GB LPDDR5X (6400MHz)',
      'Storage': '1TB M.2 NVMe PCIe 4.0 SSD',
      'Battery': '73WHrs, 100W Type-C Power Delivery',
      'Weight': '1.50 kg ultra-light',
      'Warranty': '1 Year Global + McAfee Security'
    },
    description: 'The absolute zenith of thin-and-light gaming. Combining a breathtaking CNC-machined aluminum body, a vibrant 3K 120Hz OLED screen, AMD\'s Ryzen 9 CPU with Ryzen AI, and dedicated NVIDIA RTX graphics in a lightweight 1.5kg frame.',
    highlights: [
      'Gorgeous ROG Nebula OLED display with infinite contrast and G-Sync support',
      'Sleek CNC-machined premium aluminum chassis with customized Slash Lighting',
      'Ryzen 9 processor combined with dedicated RTX 4060 for top-tier productivity/gaming',
      'Upgraded thermals with liquid metal cooling and custom tri-fan technology'
    ],
    pros: [
      'Spectacular premium build comparable to MacBook Pro',
      'Outstanding gaming and rendering power in a tiny 14-inch form factor',
      'Astonishingly punchy 6-speaker audio system with deep bass',
      'Great battery life (7-8 hours) for a powerful Windows gaming laptop'
    ],
    cons: [
      'Memory is fully soldered on the motherboard and not upgradable',
      'Runs noticeably hot under intensive gaming or rendering loads',
      'Premium price premium compared to chunkier budget gaming laptops'
    ],
    aiScore: 94,
    aiRecommendation: 'The ultimate laptop for developers who also love modern AAA gaming or need local machine learning power. A stellar, premium engineering masterpiece that handles code and graphics with ease.',
    isEditorChoice: true,
    isBestPremium: true
  },
  {
    id: 'lap-6',
    name: 'Lenovo Legion Slim 5',
    category: 'Laptops',
    brand: 'Lenovo',
    price: 95000,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80',
    specs: {
      'Display': '16.0-inch WQXGA IPS, 165Hz, 100% sRGB, G-Sync',
      'Processor': 'AMD Ryzen 7 7840HS (8 cores)',
      'Graphics': 'NVIDIA GeForce RTX 4060 8GB (140W TGP)',
      'Memory': '16GB DDR5 RAM (Upgradable to 64GB)',
      'Storage': '1TB PCIe 4.0 NVMe SSD (Dual slots)',
      'Battery': '80WHrs, up to 7 hours battery',
      'Weight': '2.30 kg',
      'Warranty': '1 Year Onsite + Accidental Damage Protection'
    },
    description: 'A powerful, balanced performance workstation with high thermal headroom. Designed for players, coders, and creators who need maximum graphics power without carrying an overly bulky system.',
    highlights: [
      'High power 140W TGP RTX 4060 GPU with Lenovo AI Engine+ chip',
      'Legion ColdFront 5.0 advanced cooling system for maximum sustained loads',
      '16-inch 16:10 spacious screen ideal for code files and split window workspace',
      'Tactile Legion TrueStrike keyboard with 4-zone customized RGB lights'
    ],
    pros: [
      'Unbelievably high sustained gaming and rendering performance',
      'Fully modular RAM and dual SSD slots for future upgrades',
      'One of the best laptop keyboards in the industry for rapid typing',
      'Quiet and cool operation during standard office work and coding'
    ],
    cons: [
      'Chunky power brick is heavy to travel with',
      'Plastic deck/bottom feels sturdy but isn\'t fully metal',
      'Underwhelming webcam quality (1080p but struggles in dim lighting)'
    ],
    aiScore: 91,
    aiRecommendation: 'Our top recommendation for students or professionals looking for a high-performance Windows laptop under ₹1 Lakh that can handle heavy software engineering, deep learning model training, and peak gaming workloads.',
    isPopular: true
  },
  {
    id: 'watch-4',
    name: 'Apple Watch Ultra 2',
    category: 'Smartwatches',
    brand: 'Apple',
    price: 89900,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&q=80',
    specs: {
      'Display': '49mm Always-On Retina LTPO OLED, 3000 nits peak',
      'Processor': 'S9 SiP with 4-core Neural Engine',
      'Chassis': 'Aerospace-grade Titanium with flat sapphire front crystal',
      'Battery': 'Up to 36 hours (72 hours in Low Power Mode)',
      'Waterproof': '100m water resistant, certified scuba dive down to 40m',
      'GPS': 'Precision dual-frequency GPS (L1 and L5)',
      'Weight': '61.4g (Chassis only)',
      'Warranty': '1 Year Apple Warranty'
    },
    description: 'The ultimate rugged companion watch. Built with an aerospace-grade titanium case, incredible 3000 nits display, precision dual-frequency GPS, specialized dive computer integration, and up to 3 days of battery life.',
    highlights: [
      'S9 SiP chip enabling magical double-tap hand gesture control',
      'Customizable physical action button in vibrant international orange',
      'Integrated dual-frequency GPS with highly accurate trackback and waypoint mapping',
      'Certified EN13319 standard for scuba diving up to 40 meters'
    ],
    pros: [
      'Astonishingly bright 3000 nits display visible anywhere',
      'Incredibly robust, drop-proof, scratch-resistant titanium and sapphire build',
      'The best microphone and speaker array for phone calls on a smartwatch',
      'Vastly improved battery life compared to standard Apple Watches'
    ],
    cons: [
      'Extremely chunky and heavy on small/average wrists',
      'Strictly locked to iPhone compatibility only',
      'Very expensive price point'
    ],
    aiScore: 95,
    aiRecommendation: 'For athletic users, outdoor adventurers, hikers, and iPhone owners who want the absolute peak premium, durable wearable on the market, the Ultra 2 stands completely uncontested.',
    isEditorChoice: true,
    isPopular: true
  },
  {
    id: 'tab-4',
    name: 'Samsung Galaxy Tab S9 FE',
    category: 'Tablets',
    brand: 'Samsung',
    price: 34999,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
    specs: {
      'Display': '10.9-inch WQXGA LCD, 90Hz refresh rate',
      'Processor': 'Exynos 1380',
      'Storage': '128GB / 256GB (Expandable up to 1TB with MicroSD)',
      'Stylus': 'S Pen included in the box (IP68 certified)',
      'Waterproof': 'IP68 certified dust and water resistant',
      'Battery': '8000mAh with 45W Fast Charging',
      'Weight': '523g',
      'Warranty': '1 Year Brand Warranty'
    },
    description: 'An exceptional mid-range productivity tablet that makes zero compromises on ruggedness. Ships with a pressure-sensitive S Pen in the box and offers official IP68 water resistance.',
    highlights: [
      'Full IP68 dust & water resistance - perfect for outdoor sketching or kitchen recipe reading',
      'Premium, ultra-low latency S Pen included directly in the box (no separate buy)',
      'Smooth 90Hz high resolution display with Vision Booster technology',
      'Samsung DeX support for a complete multi-window desktop computing layout'
    ],
    pros: [
      'Excellent price-to-performance value proposition',
      'Waterproof tablet and stylus are incredibly rare at this price',
      'Exceptional notes organization and annotation apps ecosystem pre-installed',
      'Sturdy full-metal luxury body'
    ],
    cons: [
      'Exynos 1380 is perfectly smooth for writing but struggles under heavy gaming',
      'Uses an LCD panel instead of Samsung\'s famous AMOLED screen',
      'Charger adapter is excluded from the box retail packaging'
    ],
    aiScore: 90,
    aiRecommendation: 'The smartest tablet for students, writers, and digital artists on a budget. Having the S Pen inside the box and total waterproof protection saves massive accessory costs.',
    isBestBudget: true,
    isTrending: true
  },
  {
    id: 'head-3',
    name: 'Bose QuietComfort Ultra',
    category: 'Headphones',
    brand: 'Bose',
    price: 35900,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    specs: {
      'Form Factor': 'Over-ear closed-back headphone',
      'ANC': 'Custom World-Class CustomTune adaptive cancellation',
      'Audio Modes': 'Quiet Mode, Aware Mode, Immersion Mode (Spatial)',
      'Battery': 'Up to 24 hours (18 hours with Immersive Audio)',
      'Bluetooth': 'Bluetooth 5.3 with Snapdragon Sound AptX Adaptive',
      'Controls': 'Capacitive volume strip and tactile multi-function buttons',
      'Weight': '250g ultra-comfortable',
      'Warranty': '1 Year International Warranty'
    },
    description: 'The absolute gold standard in luxury acoustic comfort. The Bose QuietComfort Ultra pairs legendary, silence-inducing ANC technology with revolutionary Immersive Spatial Audio and a featherlight design.',
    highlights: [
      'Revolutionary CustomTune technology that calibrates sound specifically to your ear canal',
      'Bose Immersive Audio creating an expansive, ultra-realistic acoustic sound stage',
      'Premium materials with protein leather ear cups for fatigue-free all-day wear',
      'Incredibly advanced voice microphones for clear calls even on noisy city streets'
    ],
    pros: [
      'Unquestionably the best Active Noise Cancellation in the world',
      'Superlative comfort and folding design for seamless flight travel',
      'Rich, warm, highly detailed sound signature with deep elastic bass',
      'Extremely intuitive capacitive slider volume controls'
    ],
    cons: [
      'Battery life is slightly lower than Sony WH-1000XM5 (30 hours)',
      'High luxury pricing premium',
      'Bose companion application is occasionally slow to connect'
    ],
    aiScore: 94,
    aiRecommendation: 'For business travelers, frequent flyers, and anyone who places absolute priority on maximum physical wearing comfort and silence-inducing ANC, the QC Ultra is peerless.',
    isTrending: true,
    isPopular: true
  },
  {
    id: 'earbuds-3',
    name: 'Sony WF-1000XM5',
    category: 'Earbuds',
    brand: 'Sony',
    price: 19990,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
    specs: {
      'Drivers': '8.4mm Dynamic Driver X (Custom wide-bandwidth driver)',
      'ANC': 'Integrated Processor V2 & HD Noise Cancelling Processor QN2e',
      'Hi-Res Audio': 'LDAC support, DSEE Extreme AI upscaling, 360 Reality Audio',
      'Battery': 'Up to 8 hours (24 hours total with wireless charging case)',
      'Microphones': '6 microphones total with bone conduction sensor',
      'Waterproof': 'IPX4 sweat and splash resistant',
      'Weight': '5.9g per earbud (25% smaller than XM4)',
      'Warranty': '1 Year Brand Warranty'
    },
    description: 'The pinnacle of true wireless earbud audio fidelity. Sony WF-1000XM5 packs high-fidelity LDAC codecs, custom-engineered wide-bandwidth drivers, and next-level bone-conduction microphones inside a sleek, tiny body.',
    highlights: [
      'Custom 8.4mm Dynamic Driver X delivering rich, vibrant vocals and ultra-deep bass',
      'State-of-the-art dual processor system offering world-class active noise blocking',
      'Bone conduction sensors and AI noise reduction algorithm for crystal-clear calling',
      'Includes premium polyurethane memory-foam tips for incredible passive isolation'
    ],
    pros: [
      'Astonishingly detailed, audiophile-grade acoustic signature',
      'Vastly smaller, lighter, and more comfortable than prior generations',
      'Unparalleled customization via the Sony Headphones Connect application',
      'Superb battery life and convenient Qi wireless charging'
    ],
    cons: [
      'Slick glossy outer finish can be slippery to extract from case',
      'Foam tips require compression and care for the best fit',
      'Bluetooth multipoint pairing can sometimes require manual setup'
    ],
    aiScore: 93,
    aiRecommendation: 'For audiophiles and general music lovers who want unmatched custom EQ capabilities, high-res audio streaming, and robust noise blocking in a tiny pocketable form factor.',
    isBestBudget: false,
    isPopular: true
  }
];


export const INITIAL_BUYING_GUIDES: BuyingGuide[] = [
  {
    id: 'guide-smartphones',
    category: 'Smartphones',
    title: 'How to Choose Your Next Smartphone (2026 Edition)',
    description: 'A comprehensive buying guide to finding the perfect mobile companion without overspending.',
    keyFactors: [
      {
        title: 'Processor (SOC) performance',
        desc: 'The brain of your phone. For heavy gaming and multitasking, opt for Snapdragon 8 Gen series or Apple A-series. For basic use, Snapdragon 6-series or MediaTek Dimensity are perfectly adequate.'
      },
      {
        title: 'Display & Refresh Rate',
        desc: 'Look for AMOLED or OLED panels instead of LCD for rich colors and deep blacks. Ensure it supports at least 90Hz or 120Hz refresh rate for buttery-smooth scrolling.'
      },
      {
        title: 'Battery Capacity & Charging',
        desc: 'Aim for a minimum of 5000mAh for Android or 4000mAh for iPhones. Look for at least 30W charging so you do not have to wait hours near a plug.'
      },
      {
        title: 'Camera Quality over Megapixels',
        desc: 'Do not be fooled by 108MP/200MP claims. Look for sensor size, Optical Image Stabilization (OIS), and low-light aperture (lower f-number is better).'
      }
    ],
    budgetRanges: [
      {
        range: 'Under ₹20,000',
        advice: 'Focus on 5G connectivity, standard AMOLED screen, and large battery. Do not expect premium zoom cameras or metal bodies.'
      },
      {
        range: '₹20,000 to ₹40,000',
        advice: 'The sweet spot. You get flagship-grade displays, powerful sub-flagship chips (like Snapdragon 8 Gen 2 or Exynos 2200), and excellent main cameras.'
      },
      {
        range: 'Above ₹50,000',
        advice: 'Premium tier. Look for telephoto optical zoom lenses, official IP68 water resistance, wireless charging, titanium/metal-glass builds, and long-term OS support (5+ years).'
      }
    ],
    jargonBuster: [
      {
        term: 'LTPO Display',
        explanation: 'Low-Temperature Polycrystalline Oxide. A display technology that dynamically adjusts refresh rate from 1Hz to 120Hz, saving massive amounts of battery.'
      },
      {
        term: 'OIS (Optical Image Stabilization)',
        explanation: 'A mechanical system inside the camera that physically moves the lens to compensate for hand shakes, ensuring sharp photos and smooth videos.'
      },
      {
        term: 'IP68 rating',
        explanation: 'Ingress Protection code. Level 6 dustproof and level 8 waterproof (can survive being submerged in fresh water up to 1.5 meters for 30 minutes).'
      }
    ],
    editorsAdvice: 'Do not buy a phone based on the launch hype. Most users only need a ₹30,000 smartphone. Only purchase ultra-premium flagships if you actively use mobile cameras for professional content or require highly specific productivity tools like the stylus.'
  },
  {
    id: 'guide-laptops',
    category: 'Laptops',
    title: 'Ultimate Laptop Buying Guide: Performance, Portability & Budget',
    description: 'Decide between Mac and Windows, understand processor tiers, and find the right fit for work, coding, or gaming.',
    keyFactors: [
      {
        title: 'Processor (CPU) Selection',
        desc: 'For Mac, any M-series (M1/M2/M3) is superb. For Windows, look for Intel Core Ultra or AMD Ryzen 7000/8000 series. Prefer "H" series for power, "U" series for maximum battery life.'
      },
      {
        title: 'RAM & Futureproofing',
        desc: 'Never buy an 8GB RAM laptop in 2026 if your budget allows. 16GB is the absolute baseline for smooth web browsing, office work, coding, and light media editing.'
      },
      {
        title: 'Screen Technology',
        desc: 'If you edit photos or watch movies, choose an OLED or IPS display with at least 100% sRGB coverage. Look for 16:10 aspect ratio screens as they show more vertical text.'
      },
      {
        title: 'Battery Endurance',
        desc: 'A laptop is useless if it is tethered to a wall. ARM-based laptops (MacBook Air/Pro and the new Snapdragon X Elite Windows laptops) easily offer 12-18 hours of real-world usage.'
      }
    ],
    budgetRanges: [
      {
        range: 'Under ₹40,000',
        advice: 'Great for basic office documents, attending online classes, and web surfing. Stick to Core i3/Ryzen 3 with 8GB RAM. Avoid heavy gaming or video rendering.'
      },
      {
        range: '₹40,000 to ₹80,000',
        advice: 'The mainstream productivity tier. You can secure premium high-resolution OLED displays, Intel Core i5/Ryzen 5/7 CPUs, 16GB RAM, and fast PCIe Gen 4 SSD storage.'
      },
      {
        range: 'Above ₹90,000',
        advice: 'Premium and power workhorse territory. Choose a MacBook Air/Pro, or a Windows laptop featuring dedicated NVIDIA RTX 40-series graphics if you are a creator or gamer.'
      }
    ],
    jargonBuster: [
      {
        term: 'Unified Memory',
        explanation: 'Apple\'s RAM architecture where CPU, GPU, and Neural Engine share the same memory pool, resulting in extremely high bandwidth and speed.'
      },
      {
        term: 'OLED (Organic Light Emitting Diode)',
        explanation: 'Display technology where every single pixel lights up individually. This creates perfect black levels, rich vibrant colors, and rapid response times.'
      },
      {
        term: 'TDP (Thermal Design Power)',
        explanation: 'The maximum heat a chip is designed to dissipate under load, measured in watts. Higher wattage (e.g. 45W) means more performance but hotter temperatures and less battery.'
      }
    ],
    editorsAdvice: 'For 90% of office workers, writers, students, and light programmers, a MacBook Air M2 or M3 with 16GB RAM is the most flawless, durable, and reliable computer you can purchase. If you must have Windows, look closely at Asus Vivobook OLEDs or Dell XPS series.'
  }
];

export const TESTIMONIALS = [
  {
    name: 'Karim Kadivar',
    role: 'Lead Developer',
    text: 'WiseFind completely eliminated my decision fatigue. I put in my exact budget and programming needs, and the platform recommended a lightweight machine that was spot on. Highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'
  },
  {
    name: 'Priyanka Sharma',
    role: 'Product Designer',
    text: 'The side-by-side comparison feature is a work of art. Comparing screens, color spaces, and battery levels dynamically made me purchase my monitor with absolute confidence.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'
  },
  {
    name: 'Rohit Verma',
    role: 'Casual Gamer & Tech Enthusiast',
    text: 'WiseBot is shockingly smart! I asked it to explain the difference between a 100W and 45W charger for my specific phone and it gave me a simple, direct answer instantly.',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80'
  }
];

export const FAQS = [
  {
    question: 'How is WiseFind different from Amazon, Flipkart, or other marketplaces?',
    answer: 'Marketplaces are e-commerce platforms designed to sell you products, often highlighting sponsored items or clearing warehouse stocks. WiseFind does not sell products. We are a neutral Buying Intelligence Platform that analyzes technical specifications, reviews, and pricing objectively using advanced AI to find what genuinely fits *your* needs.'
  },
  {
    question: 'What is the AI Match Score?',
    answer: 'The AI Match Score is a percentage rating calculated by our system that indicates how perfectly a product meets your specified criteria. It evaluates your natural language query (budget, primary use cases, battery/screen/storage preference) against the real-world performance of the product.'
  },
  {
    question: 'Does WiseFind support Indian Rupees (INR) and local market pricing?',
    answer: 'Yes! WiseFind is fully calibrated for Indian market specifications, currency exchange rates, and local retailer pricing. All product recommendations are calculated in INR (₹) with real-world Indian retailer prices.'
  },
  {
    question: 'How can I personalize my experience?',
    answer: 'By creating a free account, you unlock your personalized Dashboard. Here, you can save your favorite products, manage multiple wishlists, save your search and recommendation history, set buying preferences (e.g., "Prioritize battery life", "Only show Apple/Samsung"), and view past product comparisons.'
  }
];
