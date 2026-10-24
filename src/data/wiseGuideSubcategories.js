// WiseGuide Category & Subcategory Playbook Data
// Provides deep-dive actionable specifications, target personas, rupee sweet-spots,
// non-negotiable demanded specs, marketing traps to avoid, and editorial advice.

export const SUBCATEGORY_MAP = {
    'Smartphones': [
        {
            id: 'smartphones-all',
            name: 'All Smartphones',
            tag: 'Category Overview',
            idealBudget: '₹12,000 - ₹1,40,000',
            persona: 'Universal Smartphone Buyer',
            keySpecs: [
                'Minimum 8GB Physical RAM (Never count Virtual RAM)',
                '120Hz FHD+ AMOLED Display (>1000 nits HBM)',
                '50MP Primary Camera with Optical Image Stabilization (OIS)',
                '5000mAh Battery with 33W+ Fast Charging',
                'At least 3-4 Years Guaranteed Android / iOS Updates'
            ],
            dontBuy: [
                '2MP Macro and 2MP Depth filler sensors added for marketing',
                'Virtual RAM expansion marketing claims disguised as physical memory',
                'Sluggish 64GB storage variants that fill up within months',
                'Curved screens if accident-prone due to high replacement costs'
            ],
            verdict: 'Evaluate real-world camera stabilization (OIS), update guarantees, and thermal cooling before looking at billboard megapixel counts.'
        },
        {
            id: 'smartphones-budget',
            name: 'Budget Value Sweet-Spot (₹12k - ₹25k)',
            tag: 'Best Value',
            idealBudget: '₹12,000 - ₹25,000',
            persona: 'Students, Daily Commuters & Practical Value Seekers',
            keySpecs: [
                '120Hz FHD+ AMOLED with Widevine L1 for HD Netflix',
                '5000mAh Battery with in-box 33W-45W Fast Charger',
                '8GB Physical RAM + 128GB UFS 2.2/3.1 Storage',
                'Dimensity 7000/7200 or Snapdragon 6/7 Gen series chip',
                'Clean Android UI with minimal lockscreen ads'
            ],
            dontBuy: [
                'Sub-₹15k phones with dull 60Hz/90Hz TFT LCD screens',
                'Single mono speakers that get muffled during hands-free calls',
                'Outdated Micro-USB or 10W-18W snail charging'
            ],
            verdict: 'The sweet spot for everyday reliability. Moto G series, Samsung Galaxy M/F series, and Realme offer outstanding value without overspending.'
        },
        {
            id: 'smartphones-midrange',
            name: 'Midrange All-Rounders (₹25k - ₹45k)',
            tag: 'Consumer Sweet-Spot',
            idealBudget: '₹25,000 - ₹45,000',
            persona: 'Office Professionals, Mobile Photographers & Tech Savvy Users',
            keySpecs: [
                'Sony IMX or LYT 50MP sensor with Hardware OIS',
                'UFS 3.1 / UFS 4.0 High-Speed Flash Storage for instant app launch',
                'IP65 / IP68 Dust and Water Ingress Protection',
                'Guaranteed 4 Years of Android OS + 5 Years Security Updates',
                'Sub-190g balanced ergonomics and premium matte glass back'
            ],
            dontBuy: [
                'Plastic glossy frames that scratch and attract oily fingerprints',
                'Phones that omit the wall adapter without factoring in an extra ₹2,500'
            ],
            verdict: 'Delivers 90% of flagship performance at 40% of the price. OnePlus Nord/R series, Samsung Galaxy A-series, and Pixel A-series lead this tier.'
        },
        {
            id: 'smartphones-flagship',
            name: 'Flagship & Pro Cameras (₹50k+)',
            tag: 'No Compromises',
            idealBudget: '₹55,000 - ₹1,40,000',
            persona: 'Content Creators, Executives & Tech Enthusiasts',
            keySpecs: [
                'Periscope 3x-5x Optical Telephoto Zoom Lens',
                'LTPO 1-120Hz Dynamic Refresh Rate Display',
                '4K60 Dolby Vision HDR or Apple ProRes Log Video Recording',
                'Grade 5 Aerospace Titanium or Armor Aluminum Body',
                '7 Years of Guaranteed OS Upgrades and Global Service Support'
            ],
            dontBuy: [
                'Overpriced base 128GB variants if shooting 4K video',
                'Phones with thermal throttling that cut camera frame rates in summer'
            ],
            verdict: 'Apple iPhone 17/18 Pro or Samsung Galaxy S24/S25 Ultra deliver uncompromised cameras, elite gaming, and the highest resale value on the market.'
        },
        {
            id: 'smartphones-gaming',
            name: 'Gaming & Raw Performance',
            tag: 'FPS Champions',
            idealBudget: '₹30,000 - ₹65,000',
            persona: 'Competitive Mobile Gamers (BGMI, CoD) & Heavy Multitaskers',
            keySpecs: [
                'Snapdragon 8 Gen 3/4 or MediaTek Dimensity 9300+ Chipset',
                'Minimum 6,000mm² to 10,000mm² Dual-Vapor Cooling Chamber',
                '144Hz Refresh Rate with 2160Hz Instant Touch Sampling',
                'Bypass Charging (powers the chip directly without heating battery)'
            ],
            dontBuy: [
                'Ultra-thin slim phones with no vapor chamber cooling',
                'Heavy software skins that kill background gaming memory'
            ],
            verdict: 'iQOO Neo/Pro series and OnePlus R-series give 90-120 FPS gaming performance without paying ₹1,00,000+ for flagship luxury branding.'
        },
        {
            id: 'smartphones-compact',
            name: 'Compact & Flip / Foldables',
            tag: 'Design & Ergonomics',
            idealBudget: '₹45,000 - ₹1,20,000',
            persona: 'One-Handed Users, Trendsetters & Minimalists',
            keySpecs: [
                'Display under 6.36" or Dual-Screen Foldable Clamshell',
                'Crease-resistant teardrop zero-gap hinge mechanism',
                'Full outer cover screen with interactive typing widgets',
                'IPX8 Water Resistance Rating'
            ],
            dontBuy: [
                'First-gen foldables with zero dust or splash protection',
                'Tiny sub-3800mAh batteries paired with inefficient chips'
            ],
            verdict: 'Samsung Galaxy Z Flip or Moto Razr for pocketable style; Google Pixel base or iPhone base for pure one-handed comfort.'
        }
    ],
    'Laptops': [
        {
            id: 'laptops-all',
            name: 'All Laptops',
            tag: 'Category Overview',
            idealBudget: '₹35,000 - ₹2,50,000',
            persona: 'Universal Laptop Buyer',
            keySpecs: [
                '16GB RAM Dual-Channel (Mandatory 2026 standard)',
                '512GB PCIe NVMe M.2 SSD (Never accept eMMC)',
                '16:10 Aspect Ratio with 100% sRGB Color Gamut',
                'USB-C Power Delivery (PD) Universal Charging',
                'Backlit Keyboard with Precision Multi-Touch Trackpad'
            ],
            dontBuy: [
                '8GB soldered non-upgradable RAM',
                'Sluggish eMMC flash storage',
                '45% NTSC washed-out gray screens that cause eye strain',
                'Old 11th/12th Gen Core i7 chips sold at inflated clearance prices'
            ],
            verdict: '16GB RAM and NVMe SSD are non-negotiable in 2026. Prioritize screen color accuracy and real unplugged battery life over theoretical clock speeds.'
        },
        {
            id: 'laptops-ultrabooks',
            name: 'Thin & Light (14hr+ Battery)',
            tag: 'Mobility & Battery',
            idealBudget: '₹60,000 - ₹1,30,000',
            persona: 'Office Pros, Remote Workers, Consultants & Frequent Travelers',
            keySpecs: [
                'Apple M2/M3 Silicon or Intel Core Ultra / AMD Ryzen 8000 Zen 4',
                'Weight under 1.35 kg with Full Aluminum Unibody',
                'Fanless or Whisper-Quiet Single Fan Cooling',
                '14 to 18 Hours of Genuine Unplugged Web/Office Battery'
            ],
            dontBuy: [
                'Heavy 2.2kg gaming laptops if your daily job is taking notes in meetings',
                'Laptops requiring proprietary barrel-pin charging bricks'
            ],
            verdict: 'MacBook Air M2 or M3 is the gold standard for silent, cool, all-day work. For Windows, Asus Zenbook OLED or Lenovo IdeaPad Slim lead.'
        },
        {
            id: 'laptops-gaming',
            name: 'Dedicated Gaming & High TGP',
            tag: 'Maximum Raw Power',
            idealBudget: '₹65,000 - ₹1,50,000',
            persona: 'PC Gamers, 3D Animators, Video Editors & Engineering Students',
            keySpecs: [
                'Dedicated NVIDIA RTX 4050/4060/4070 with High TGP (105W+)',
                '16GB-32GB DDR5 RAM with 2 Accessible SO-DIMM Slots',
                '144Hz-165Hz IPS Display with 100% sRGB & G-Sync/FreeSync',
                'Dual High-Blade Exhaust Fans with Dedicated Heatpipes'
            ],
            dontBuy: [
                '45W low-power crippled GPUs disguised as "Gaming Laptops"',
                'Single-channel 8GB RAM setups that severely bottleneck graphics frame rates'
            ],
            verdict: 'Lenovo LOQ / Legion and Asus ROG / TUF deliver genuine high-wattage graphics that sustain FPS without thermal throttling.'
        },
        {
            id: 'laptops-creative',
            name: 'MacBook & Creative Studio',
            tag: 'Design & Production',
            idealBudget: '₹90,000 - ₹2,50,000',
            persona: 'Video Editors, UI/UX Designers, Musicians & Architects',
            keySpecs: [
                'Mini-LED Liquid Retina XDR or OLED 100% DCI-P3 Color Calibrated',
                '16GB to 36GB Unified Memory for 4K/8K Multi-Stream Timelines',
                'SD Card Slot (UHS-II) and Full HDMI 2.1 Output',
                'Studio-Quality 6-Speaker Sound System with Force-Cancelling Woofers'
            ],
            dontBuy: [
                '8GB unified memory MacBooks for professional video rendering',
                'Windows laptops with loud, high-pitched fan coil whine'
            ],
            verdict: 'MacBook Pro 14"/16" (M3 Pro) is the undisputed king of battery-backed creative work. For Windows: Asus ProArt / Dell XPS.'
        },
        {
            id: 'laptops-student',
            name: 'Student & Everyday College (< ₹50k)',
            tag: 'College Sweet-Spot',
            idealBudget: '₹32,000 - ₹50,000',
            persona: 'College Students, Writers, School Kids & Online Learning',
            keySpecs: [
                'Intel Core i5 (12th/13th Gen) or AMD Ryzen 5 (7000 series)',
                '16GB RAM or 8GB with an Open Expansion Slot',
                'FHD (1920x1080) IPS Anti-Glare Display',
                '512GB NVMe PCIe SSD + Backlit Keyboard'
            ],
            dontBuy: [
                'Sub-₹30k Celeron or Athlon chips that stutter on Zoom calls',
                'HD 1366x768 resolution screens with narrow viewing angles'
            ],
            verdict: 'Lenovo IdeaPad Slim 3, Asus Vivobook 15, and Acer Aspire 5 provide reliable, snappy performance for 4+ college years.'
        }
    ],
    'Audio & Headphones': [
        {
            id: 'audio-all',
            name: 'All Audio & Headphones',
            tag: 'Category Overview',
            idealBudget: '₹1,500 - ₹35,000',
            persona: 'Universal Music & Commute Guide',
            keySpecs: [
                'Silicone Ear Tip Seal (Accounting for 60% of acoustic performance)',
                'Bluetooth 5.3 with Fast Pair Support',
                'IPX4 Minimum Water Resistance for Rain/Sweat',
                'Companion Smartphone App with Custom Multi-Band EQ'
            ],
            dontBuy: [
                'Open half-in-ear earbuds claiming Active Noise Cancellation',
                'Yellow "Hi-Res" stickers paired with basic SBC codec',
                'Fake 8D audio marketing apps'
            ],
            verdict: 'A proper silicone ear seal accounts for 60% of bass depth and noise isolation. Always choose customized EQ over gimmicky preset sound.'
        },
        {
            id: 'audio-tws',
            name: 'True Wireless (TWS) Earbuds',
            tag: 'Everyday Portability',
            idealBudget: '₹2,000 - ₹18,000',
            persona: 'Daily Commuters, Hybrid Office Workers & Casual Listeners',
            keySpecs: [
                '35dB to 45dB Hybrid Active Noise Cancellation',
                'Dual-Device Multipoint Bluetooth (Phone + Laptop)',
                '6-Mic Array with Wind-Resistant AI Beamforming for Calls',
                'Compact Pocketable Case with Wireless Qi Charging'
            ],
            dontBuy: [
                'Earbuds with uncustomizable touch controls that misfire in rain',
                'Fragile plastic case hinges that snap in tight pockets'
            ],
            verdict: 'Realme Buds Air / OnePlus Buds Nord for budget excellence; Sony WF-1000XM5 or Apple AirPods Pro 2 for market-leading noise cancellation.'
        },
        {
            id: 'audio-anc',
            name: 'Over-Ear ANC Headphones',
            tag: 'Silence & Luxury',
            idealBudget: '₹7,000 - ₹35,000',
            persona: 'Frequent Flyers, Deep-Focus Workers & Long-Haul Travelers',
            keySpecs: [
                'Plush Memory Foam Earcups with Low Clamping Force',
                'Weight under 260g to Prevent Neck Strain',
                '30+ Hours Continuous Battery with ANC Enabled',
                'Natural Ambient Transparency Mode for Conversations'
            ],
            dontBuy: [
                'Heavy headphones with tight clamping pressure that cause headaches',
                'Earcups made with flaking cheap PU leather'
            ],
            verdict: 'Sony WH-1000XM5 and Bose QuietComfort Ultra lead the world in pure acoustic silence, voice isolation, and plush cloud-like comfort.'
        },
        {
            id: 'audio-audiophile',
            name: 'Audiophile & Studio Wired',
            tag: 'Pure Acoustic Fidelity',
            idealBudget: '₹6,000 - ₹40,000',
            persona: 'Critical Music Listeners, Sound Mixers & Vinyl Fans',
            keySpecs: [
                'Open-Back Acoustic Design for Expansive Spatial Soundstage',
                'Planar Magnetic or Matched Dynamic Drivers (<0.1% THD)',
                'Detachable Oxygen-Free Copper Cable with 3.5mm/6.3mm Jacks',
                'Paired with a Portable High-Res USB-C DAC / Amp'
            ],
            dontBuy: [
                'Artificial bass-boosted consumer headphones that drown out acoustic vocals',
                'Bluetooth compression when streaming lossless FLAC or Apple Lossless'
            ],
            verdict: 'Sennheiser HD 560S or HD 650 paired with an affordable USB DAC provides a holographic soundstage that wireless headphones cannot physically replicate.'
        }
    ],
    'Smartwatches & Wearables': [
        {
            id: 'wearables-all',
            name: 'All Smartwatches & Trackers',
            tag: 'Category Overview',
            idealBudget: '₹2,500 - ₹75,000',
            persona: 'Universal Health & Fitness Tracking',
            keySpecs: [
                'Vivid AMOLED Display (>600 nits daylight brightness)',
                'Accurate Optical Heart Rate & SpO2 Sensors',
                'Comprehensive Sleep Stage Tracking (Deep, REM, Light)',
                '5ATM or IP68 Water Resistance with Swappable Straps'
            ],
            dontBuy: [
                'Fictional Blood Pressure or Blood Sugar claims on budget watches',
                'Laggy 30Hz displays without Always-On Display (AOD)',
                'Proprietary non-replaceable strap brackets'
            ],
            verdict: 'Decide first: Do you want 14-day battery life (RTOS fitness tracker) or full app interactivity (WearOS / Apple Watch)?'
        },
        {
            id: 'wearables-fitness',
            name: 'Fitness & RTOS Trackers (10-14 Day Battery)',
            tag: 'Battery Champions',
            idealBudget: '₹2,500 - ₹8,000',
            persona: 'Casual Step Counters, Busy Pros & Travelers who Hate Daily Charging',
            keySpecs: [
                '10 to 14 Days Real-World Battery Life on a Single Charge',
                'Built-in Standalone GPS for Running without Carrying Phone',
                'Bright AMOLED Display with 60Hz Smooth UI',
                '5ATM Water Rating Safe for Pool Swimming and Showers'
            ],
            dontBuy: [
                'Sub-₹2,000 watches with inaccurate random-number step algorithms'
            ],
            verdict: 'Amazfit Active, CMF Watch Pro, and OnePlus Watch 2R give gorgeous AMOLED screens and multi-week battery without annoying daily recharges.'
        },
        {
            id: 'wearables-smart',
            name: 'WearOS & Apple Watch (Full App Stores)',
            tag: 'True Smartwatch',
            idealBudget: '₹15,000 - ₹75,000',
            persona: 'Executives, Power Users & iPhone / Pixel Ecosystem Owners',
            keySpecs: [
                'Full App Store (Google Play Store / Apple watchOS)',
                'NFC Tap-to-Pay Support (Google Wallet / Apple Pay)',
                'Full Voice Reply, Text Typing, and WhatsApp Dictation',
                'Cellular LTE eSIM Option for Phone-Free Phone Calls'
            ],
            dontBuy: [
                'Buying a full smartwatch if you are unwilling to charge it once every 24-48 hours'
            ],
            verdict: 'Samsung Galaxy Watch 6/7 or Apple Watch SE 2/Series 10 turn notifications into actionable mini-smartphones on your wrist.'
        },
        {
            id: 'wearables-gps',
            name: 'Marathon & Outdoor Adventure GPS',
            tag: 'Athlete Precision',
            idealBudget: '₹20,000 - ₹85,000',
            persona: 'Marathon Runners, Cyclists, Triathletes & Mountain Hikers',
            keySpecs: [
                'Dual-Band (L1 + L5) Multi-GNSS Satellite Precision',
                'Titanium Case with Scratch-Proof Sapphire Crystal Glass',
                'Training Readiness, HRV Status & Race Pace Predictors',
                'Barometric Altimeter and Offline Topo Breadcrumb Maps'
            ],
            dontBuy: [
                'Single-frequency GPS watches that lose signal between tall metro buildings'
            ],
            verdict: 'Garmin Forerunner 165/265 or Apple Watch Ultra 2 deliver pinpoint pace tracking and clinical training analytics for serious athletes.'
        }
    ],
    'Home & Kitchen': [
        {
            id: 'kitchen-all',
            name: 'All Home & Kitchen Appliances',
            tag: 'Category Overview',
            idealBudget: '₹2,500 - ₹45,000',
            persona: 'Home Cooks, Health Conscious Families & Automation Seekers',
            keySpecs: [
                '100% Pure Copper Motor Winding (Essential for heavy Indian spices)',
                'Food-Grade Heavy-Gauge Stainless Steel / Tri-Ply Metal',
                'BPA-Free and PFOA-Free Certified Food Contact Parts',
                'BIS / ISI Safety Certified with Thermal Overload Cut-Off'
            ],
            dontBuy: [
                'Aluminum motor coils in heavy grinders that smoke and burn out',
                'Cheap Teflon non-stick coatings that peel toxic chemicals into food',
                'Sub-3 Liter tiny air fryer baskets'
            ],
            verdict: 'In Indian cooking, build quality and motor torque matter far more than digital app bells and whistles.'
        },
        {
            id: 'kitchen-fryers',
            name: 'Air Fryers & Convection Fryer-Ovens',
            tag: 'Crispy Guilt-Free',
            idealBudget: '₹4,500 - ₹14,000',
            persona: 'Crispy Samosas, Roasted Veggies & Oil-Free Tikkas for 2-5 Members',
            keySpecs: [
                '4.5L to 6.5L Basket Capacity (Fits whole chicken or batch of 8 snacks)',
                '1500W to 1800W Rapid Convection Hot Air Circulation',
                'Viewing Glass Window with Internal Light to Monitor Browning',
                'Dishwasher Safe Non-Stick Removable Crisper Plate'
            ],
            dontBuy: [
                'Tiny 2.5L-3L baskets that force you to cook dinner in 4 consecutive batches'
            ],
            verdict: 'Philips Digital Air Fryer or Instant Pot Vortex cooks crispy samosas, chicken tikka, and roasted veggies with 90% less oil.'
        },
        {
            id: 'kitchen-mixers',
            name: 'Heavy-Duty 750W-1000W Mixer Grinders',
            tag: 'Indian Kitchen Workhorse',
            idealBudget: '₹3,500 - ₹9,500',
            persona: 'Dosa Batter, Chana Dal, Coconut Chutney & Whole Turmeric Grinding',
            keySpecs: [
                '100% Pure Copper Motor with High Starting Torque',
                '750W to 1000W Heavy-Duty Power Rating',
                'Heavy-Gauge Stainless Steel Jars with Flow Breakers',
                'Self-Resetting Thermal Overload Protection Switch'
            ],
            dontBuy: [
                'Budget mixers with aluminum windings that smoke and burn out on thick dal batters'
            ],
            verdict: 'Preethi Zodiac, Sujata Dynamix, and Bosch TrueMixx provide heavy commercial grinding durability that lasts 10+ years.'
        },
        {
            id: 'kitchen-robots',
            name: 'Robot Vacuum & LiDAR Wet Mops',
            tag: 'Hands-Free Living',
            idealBudget: '₹18,000 - ₹42,000',
            persona: 'Daily Hands-Free Floor Cleaning & Pet Hair Management',
            keySpecs: [
                'LiDAR / Laser LDS Real-Time Room Mapping',
                '4000Pa+ Strong Suction Power for Rugs & Marble Floors',
                'Vibrating or Dual-Rotary Pressure Wet Mop Pad',
                'No-Go Virtual Boundaries and Scheduled Multi-Floor Cleaning'
            ],
            dontBuy: [
                'Cheap bump-and-turn infrared robots that get trapped under sofas'
            ],
            verdict: 'Dreame, Eureka Forbes, and Xiaomi Robot Vacuums automate daily dust sweeping and wet mopping effortlessly.'
        }
    ],
    'Smart TVs & Entertainment': [
        {
            id: 'tv-all',
            name: 'All Smart TVs & Soundbars',
            tag: 'Category Overview',
            idealBudget: '₹18,000 - ₹1,80,000',
            persona: 'Home Theater Enthusiasts, Binge Watchers & Console Gamers',
            keySpecs: [
                '4K Ultra HD (3840x2160) Resolution',
                'HDR10+ / Dolby Vision Dynamic Tone Mapping',
                'Google TV or LG webOS with Wide App Availability',
                'HDMI eARC for Lossless Dolby Atmos Soundbar Pass-Through'
            ],
            dontBuy: [
                '720p or 1080p panels on screens larger than 43 inches',
                'Fake "120Hz" marketing via backlight blinking on 60Hz panels'
            ],
            verdict: 'Panel type (OLED vs QLED vs IPS) determines 80% of picture quality. Factor in a soundbar for crystal-clear dialogue.'
        },
        {
            id: 'tv-oled',
            name: 'OLED & Mini-LED Cinema Flagships',
            tag: 'Hollywood Cinema',
            idealBudget: '₹75,000 - ₹2,20,000',
            persona: 'Movie Cinephiles & Dark-Room Home Theater Enthusiasts',
            keySpecs: [
                'Self-Lit OLED Pixels or 1000+ Local Dimming Zones Mini-LED',
                'Infinite Contrast Ratio with Inky Deep Blacks and Zero Halo Blooming',
                '120Hz / 144Hz Variable Refresh Rate (VRR) with AMD FreeSync',
                'Dolby Vision IQ with Ambient Light Sensor Adjustment'
            ],
            dontBuy: [
                'Edge-lit LCD TVs claiming "OLED-like contrast" with severe backlight bleeding'
            ],
            verdict: 'LG C-Series OLED and Sony Bravia XR deliver Hollywood-grade color fidelity and zero blooming in dark rooms.'
        },
        {
            id: 'tv-qled',
            name: '4K QLED Living Room Sweet-Spot',
            tag: 'Bright Room Champ',
            idealBudget: '₹28,000 - ₹55,000',
            persona: 'Bright Living Rooms, Cricket Matches & Family OTT Streaming',
            keySpecs: [
                'Quantum Dot Color Filter (1 Billion+ Colors)',
                '600+ Nits Brightness for Daylight Glare Cut-Through',
                'Google TV with Hands-Free Far-Field Voice Assistant',
                'MEMC Frame Interpolation for Smooth Sports Motion'
            ],
            dontBuy: [
                'Clunky proprietary operating systems that lack Netflix or Disney+ Hotstar support'
            ],
            verdict: 'Hisense, TCL, and Samsung QLED deliver vibrant pop and daylight clarity without spending ₹1,00,000.'
        }
    ]
};
