export const MULTI_CATEGORY_PRODUCTS = [
    // ==========================================
    // HOME & KITCHEN
    // ==========================================
    {
        id: 'hk-1',
        name: 'Philips Digital Air Fryer HD9252/90 (4.1L)',
        category: 'Home & Kitchen',
        subCategory: 'Air Fryers & Ovens',
        brand: 'Philips',
        price: 7999,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=500&q=80',
        specs: {
            'Capacity': '4.1 Liters (Up to 4 Portions)',
            'Wattage': '1400 Watts',
            'Technology': 'Rapid Air Technology (90% Less Fat)',
            'Preset Menus': '7 Touchscreen Presets (Fries, Chicken, Fish, Cake)',
            'Temperature Range': '60°C to 200°C',
            'Cleaning': 'Dishwasher-safe QuickClean Basket',
            'Warranty': '2 Years Brand Warranty'
        },
        description: 'Bake, grill, roast, and fry with up to 90% less fat. Patented starfish bottom creates rapid 360-degree hot air circulation for perfectly crispy exteriors and tender interiors without drowning food in oil.',
        highlights: [
            'Rapid Air Starfish design for uniform heat without constant manual shaking',
            'Intuitive digital touchscreen with 7 presets and Keep Warm mode',
            'NutriU recipe app integration with 500+ customized Indian & global dishes',
            'Auto-shutoff safety timer with sound alert'
        ],
        pros: [
            'Consistently crisp fries, samosas, and roasted vegetables',
            'Very easy to clean non-stick basket',
            'Compact kitchen counter footprint',
            'Substantial 2-year warranty with strong nationwide service'
        ],
        cons: [
            '4.1L capacity is best suited for 2-4 people; large families may need 6L+',
            'Exterior casing warms up during extended 200°C baking'
        ],
        aiScore: 94,
        aiRecommendation: 'The undisputed gold-standard air fryer for Indian households. Perfect balance of build reliability, heating precision, and compact countertop footprint.',
        isEditorChoice: true,
        isPopular: true
    },
    {
        id: 'hk-2',
        name: 'Prestige Iris 750W Mixer Grinder (4 Jars)',
        category: 'Home & Kitchen',
        subCategory: 'Mixer Grinders & Blenders',
        brand: 'Prestige',
        price: 3299,
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&q=80',
        specs: {
            'Motor Power': '750 Watts Heavy Duty Motor',
            'Jars Included': '3 Stainless Steel Jars + 1 Transparent Juicer Jar',
            'Jar Capacities': '1.5L Wet Jar, 1.0L Dry Jar, 0.3L Chutney Jar, 1.5L Juicer',
            'Speed Settings': '3 Speed Rotary Control with Incher / Pulse',
            'Blade Material': 'High-Grade Stainless Steel Multi-Utility Blades',
            'Safety': 'Overload Protector with Reset Switch',
            'Warranty': '2 Years on Product & Motor'
        },
        description: 'A household workhorse engineered for heavy grinding tasks like idli/dosa batter, tough turmeric, garam masalas, and smooth fruit juices. Features heavy-duty stainless steel jars and ergonomic handles.',
        highlights: [
            'Robust 750W motor tackles hard spices and raw legumes smoothly',
            'Transparent juicer jar with stainless steel mesh sieve for fresh pulp-free juices',
            'Ergonomically designed jar handles with firm grip and non-slip rubber feet',
            'Overload protection switch prevents motor coil burnout'
        ],
        pros: [
            'Superb value under ₹3,500 with 4 versatile jars',
            'Excellent torque for fine chutney and wet batter grinding',
            'Durable jar locking mechanism'
        ],
        cons: [
            'Can be loud under heavy load (80-85 dB)',
            'Initial motor smell during first few uses as varnish settles'
        ],
        aiScore: 91,
        aiRecommendation: 'A dependable, budget-friendly kitchen essential for everyday cooking. Handles tough Indian cooking demands effortlessly.',
        isBestBudget: true
    },
    {
        id: 'hk-3',
        name: 'Dyson V12 Detect Slim Cordless Vacuum',
        category: 'Home & Kitchen',
        subCategory: 'Robot Vacuums & Cleaners',
        brand: 'Dyson',
        price: 49900,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80',
        specs: {
            'Suction Power': '150 Air Watts (Hyperdymium Motor)',
            'Filtration': 'Fully-Sealed Whole-Machine HEPA Filtration (99.99% down to 0.3 microns)',
            'Laser Technology': 'Illumination reveals invisible dust on hard floors',
            'Run Time': 'Up to 60 Minutes (Eco Mode) with Click-in battery',
            'Dust Bin Volume': '0.35 Liters with hygienic "point and shoot" ejector',
            'Weight': 'Featherlight 2.2 kg',
            'Warranty': '2 Years Comprehensive Dyson Warranty'
        },
        description: 'Dyson\'s lightest intelligent cordless vacuum with laser detection. Piezo sensor continuously measures and categorizes microscopic dust particles, dynamically ramping up suction when heavy debris is encountered.',
        highlights: [
            'Angled green laser optic makes invisible pet hair and floor dust instantly visible',
            'LCD screen displays scientific proof of a deep clean in real time',
            'Single-button power control—no need to hold down a continuous trigger',
            'Anti-tangle Hair Screw tool clears long hair without roller wrapping'
        ],
        pros: [
            'Incredibly lightweight and agile around tight furniture',
            'Laser illumination is genuinely transformative for tile and hardwood cleanliness',
            'Hygienic point-and-shoot bin emptying keeps hands clean'
        ],
        cons: [
            'Premium pricing investment',
            '0.35L bin requires frequent emptying in dusty environments'
        ],
        aiScore: 96,
        aiRecommendation: 'The pinnacle of handheld home cleaning technology. If your budget allows, the illuminated floor head and lightweight ergonomics make routine cleaning effortless.',
        isEditorChoice: true,
        isBestPremium: true
    },
    {
        id: 'hk-4',
        name: 'Meyer Anolon Advanced 28cm Hard-Anodized Non-Stick Kadai',
        category: 'Home & Kitchen',
        subCategory: 'Cookware & Pots',
        brand: 'Meyer',
        price: 3499,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&q=80',
        specs: {
            'Material': 'Hard-Anodized Heavy-Gauge Aluminum (Twice as hard as Stainless Steel)',
            'Coating': 'PFOA-Free Premium Triple-Layer Non-Stick',
            'Capacity': '3.8 Liters (28cm Diameter)',
            'Handles': 'Dual Riveted Cast Stainless Steel with Silicone Grips',
            'Compatibility': 'Gas, Electric, Ceramic (Oven Safe up to 200°C)',
            'Lid': 'Shatter-Resistant Tempered Glass Lid',
            'Warranty': 'Lifetime Limited Warranty'
        },
        description: 'Engineered for exceptional heat conductivity and lasting durability. The heavy-gauge hard-anodized base distributes heat evenly without hot spots, while the triple-layer non-stick surface allows effortless food release with minimal oil.',
        highlights: [
            'Heavy-gauge hard-anodized core is twice as hard as stainless steel for zero warping',
            'Ergonomic SureGrip handles provide a secure, comfortable, and cool-to-touch hold',
            'Deep kadai walls prevent hot oil splatters during stir-frying and deep curries'
        ],
        pros: [
            'Even heating eliminates hot-spot burning',
            'Superior non-stick longevity with wooden/silicone spatulas',
            'Sturdy riveted construction'
        ],
        cons: [
            'Not compatible with induction cooktops (requires standard Anolon Induction edition)',
            'Hand washing strongly recommended over harsh dishwasher tablets'
        ],
        aiScore: 92,
        aiRecommendation: 'An exceptional culinary investment for those who cook frequently. The durable non-stick surface and uniform heat dispersion elevate everyday cooking.',
        isPopular: true
    },
    {
        id: 'hk-5',
        name: 'Nespresso Inissia Espresso Coffee Machine',
        category: 'Home & Kitchen',
        subCategory: 'Coffee Makers & Kettles',
        brand: 'Nespresso',
        price: 14999,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80',
        specs: {
            'Pump Pressure': '19-Bar High Pressure Extraction',
            'Heat-up Time': 'Rapid 25 Seconds Fast Thermoblock',
            'Cup Sizes': 'Espresso (40ml) & Lungo (110ml) Programmable Buttons',
            'Water Tank': '0.7 Liter Removable Water Reservoir',
            'Energy Saving': 'Automatic Power-off after 9 minutes of inactivity',
            'Capsule Container': 'Holds up to 11 used capsules',
            'Weight': 'Ultra-compact 2.4 kg'
        },
        description: 'Cafe-grade Italian espresso delivered in 25 seconds with a single touch. Compact, colorful, and equipped with a 19-bar extraction pump that pierces coffee capsules to unlock rich crema and aromatic depth.',
        highlights: [
            '19-bar extraction pump delivers dense, velvety crema identical to cafe machines',
            'Compact footprint easily slots into small kitchen corners or work desks',
            'Programmable volume buttons remember exact cup extractions'
        ],
        pros: [
            'Consistently rich espresso with zero mess or coffee grind cleanup',
            'Heats up almost instantaneously in 25 seconds',
            'Extensive third-party and original capsule compatibility'
        ],
        cons: [
            'Recurring cost of single-serve coffee pods',
            'Small water reservoir requires refilling after 4-5 cups'
        ],
        aiScore: 90,
        aiRecommendation: 'The quickest way to enjoy authentic espresso and Americanos at home or in an office corner without mastering complex manual barista equipment.'
    },
    // ==========================================
    // FASHION & APPAREL
    // ==========================================
    {
        id: 'fash-1',
        name: 'Nike Air Zoom Pegasus 40 Running Shoes',
        category: 'Fashion & Apparel',
        subCategory: 'Footwear & Sneakers',
        brand: 'Nike',
        price: 10495,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
        specs: {
            'Cushioning': 'Dual Air Zoom units (forefoot and heel) + React Foam',
            'Support Type': 'Neutral daily trainer with high arch support',
            'Upper Material': 'Engineered Single-Layer Mesh with redesign midfoot strap',
            'Outsole': 'Waffle-inspired durable rubber pattern with flex grooves',
            'Drop': '10mm Heel-to-Toe Drop',
            'Weight': '288g (Men\'s UK 8.5)',
            'Ideal Use': 'Daily Road Running, Marathon Training, Walking'
        },
        description: 'A springy, responsive ride for every run. The Pegasus 40 features trusted React foam cushioning paired with dual Air Zoom units to deliver energetic toe-offs, improved collar padding, and enhanced midfoot wrap.',
        highlights: [
            'Dual Zoom Air units deliver energized forward momentum on pavement and track',
            'Engineered mesh upper maximizes air flow and regulates foot temperature',
            'Waffle-inspired rubber outsole provides dependable wet and dry road traction',
            'Redesigned midfoot strap comfortably locks down the arch without pinching'
        ],
        pros: [
            'Legendary durability—easily logs 600-800 km without foam deadening',
            'Extremely versatile as both a daily runner and all-day walking sneaker',
            'Breathable, fatigue-free fit'
        ],
        cons: [
            'Slightly heavier than dedicated carbon-plated race day shoes',
            'Narrow toe-box for runners with wide feet (size up half a size)'
        ],
        aiScore: 95,
        aiRecommendation: 'The most reliable daily running shoe ever produced. Whether training for a 10K or needing supreme all-day sneaker comfort, the Pegasus 40 is a benchmark purchase.',
        isEditorChoice: true,
        isPopular: true
    },
    {
        id: 'fash-2',
        name: 'Casio G-Shock GA-2100-1A1 "CasiOak" Carbon Core Guard',
        category: 'Fashion & Apparel',
        subCategory: 'Watches & Clocks',
        brand: 'Casio',
        price: 7995,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80',
        specs: {
            'Case Material': 'Carbon / Bio-based Resin with Carbon Core Guard',
            'Water Resistance': '200 Meters (20 Bar ISO compliant)',
            'Dial Type': 'Analog-Digital Octagonal Bezel',
            'Glass': 'Scratch-Resistant Mineral Crystal Glass',
            'Illumination': 'Double LED Light (Super Illuminator) with Afterglow',
            'Battery Life': 'Approx. 3 Years on SR726W x 2',
            'Dimensions': '48.5 x 45.4 x 11.8 mm (Slimmest G-Shock profile)',
            'Weight': 'Featherlight 51g'
        },
        description: 'The modern horology sensation. Nicknamed the "CasiOak" for its iconic octagonal bezel, it delivers legendary G-Shock drop and shock resistance inside an ultra-slim, stealthy 11.8mm carbon fiber reinforced profile.',
        highlights: [
            'Carbon Core Guard structure shields internal movement against drops and vibrations',
            'Slim 11.8mm case profile slides effortlessly under shirt cuffs',
            'Stealth black-out aesthetic pairs with both casual streetwear and formal attire',
            'World time 31 time zones with 5 daily alarms and 1/100-sec stopwatch'
        ],
        pros: [
            'Virtually indestructible build withstands drops, water, and gym workouts',
            'Iconic minimalist octagonal aesthetic loved by watch collectors',
            'Lightweight 51g wrist feel'
        ],
        cons: [
            'Stealth black hands can be tricky to read in dim light without pressing the LED button',
            'Negative digital display is relatively small'
        ],
        aiScore: 96,
        aiRecommendation: 'An absolute modern classic. Combines luxury styling cues with unbreakable durability at an approachable price point.',
        isEditorChoice: true
    },
    {
        id: 'fash-3',
        name: 'Levi\'s 511 Slim Fit Stretch Denim Jeans',
        category: 'Fashion & Apparel',
        subCategory: "Men's Wear",
        brand: "Levi's",
        price: 3199,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80',
        specs: {
            'Fit': 'Slim from Hip to Ankle, Mid Rise',
            'Fabric Composition': '99% Cotton, 1% Elastane (Water<Less Eco Tech)',
            'Stretch Level': 'Comfort Stretch with authentic denim texture',
            'Closure': 'Zip Fly with signature shank button closure',
            'Pocket Styling': 'Classic 5-pocket design with Arcuate back pocket stitching',
            'Care': 'Machine wash cold inside out, tumble dry medium'
        },
        description: 'A modern slim with room to move. The 511 Slim Fit Jeans are a contemporary staple cut lean through the thigh with a straight leg opening, crafted with built-in stretch for all-day mobility.',
        highlights: [
            'Engineered with comfort stretch that retains authentic rigid denim character',
            'Clean slim silhouette that balances modern tailoring with casual ease',
            'Sustainably produced using Levi\'s Water<Less techniques saving water'
        ],
        pros: [
            'Exceptional fit versatility across body types',
            'Retains shape without knee-bagging over months of wear',
            'Premium hardware and durable stitching'
        ],
        cons: [
            'Color crocking can occur during the first two washes with indigo dyes',
            'Slight sizing variance across international factories'
        ],
        aiScore: 92,
        aiRecommendation: 'The most versatile pair of denim you can own. Pairs seamlessly with sneakers, dress shoes, plain tees, or tailored blazers.'
    },
    {
        id: 'fash-4',
        name: 'American Tourister Kamiliant 68cm Spinner Trolley Bag',
        category: 'Fashion & Apparel',
        subCategory: 'Bags, Backpacks & Luggage',
        brand: 'American Tourister',
        price: 3699,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=500&q=80',
        specs: {
            'Material': 'Scratch-Resistant Polypropylene (Hard Case)',
            'Dimensions': '68 cm x 47 cm x 29 cm (Medium Check-In)',
            'Wheels': '4 Multi-Directional 360-Degree Smooth Spinner Wheels',
            'Lock Type': 'Integrated 3-Digit Fixed Combination Lock',
            'Capacity': '71 Liters Packing Volume',
            'Interior': 'Cross ribbons and zippered mesh separator pocket',
            'Warranty': '3 Years International Manufacturer Warranty'
        },
        description: 'Designed for globetrotters who demand resilient luggage without luggage weight penalties. The polypropylene hard shell flexes to absorb baggage carousel impacts and springs back into shape.',
        highlights: [
            'High-impact polypropylene shell withstands heavy airport baggage handling',
            'Dual-texture scratch-resistant finish keeps luggage looking fresh after multiple flights',
            'Smooth 360-degree 4-wheel spinner system provides effortless glide across terminals'
        ],
        pros: [
            'Remarkably lightweight for a hard-shell medium check-in bag',
            'Spacious 71L interior easily accommodates 7-10 days of travel packing',
            'Great price point with 3-year international warranty'
        ],
        cons: [
            'Fixed lock is standard combination rather than TSA-approved key lock',
            'Side grab handle lacks silicone cushioning'
        ],
        aiScore: 89,
        aiRecommendation: 'A durable and stylish travel companion that offers heavy-duty impact resistance without adding heavy tare weight to airline allowances.'
    },
    // ==========================================
    // BEAUTY & PERSONAL CARE
    // ==========================================
    {
        id: 'beauty-1',
        name: 'Minimalist 10% Niacinamide + Zinc PCA Serum (30ml)',
        category: 'Beauty & Personal Care',
        subCategory: 'Skincare & Serums',
        brand: 'Minimalist',
        price: 599,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
        specs: {
            'Active Ingredients': '10% Pure Niacinamide (Vitamin B3) + 1% Zinc PCA',
            'Target Concerns': 'Blemishes, Acne Scars, Enlarged Pores, Excess Sebum',
            'Skin Types': 'Oily, Combination, Acne-Prone, Normal Skin',
            'Formulation': 'Lightweight Oil-Free Watery Serum',
            'Safety Standards': 'Fragrance-Free, Essential Oil-Free, Non-Comedogenic, pH 5.5 - 6.5',
            'Volume': '30 ml Amber Dropper Bottle',
            'Shelf Life': '24 Months'
        },
        description: 'A clinical-grade formula engineered to reduce blemishes, regulate sebum secretion, and repair the dermal lipid barrier. Powered by high-grade EU Niacinamide with Zinc PCA for anti-inflammatory blemish soothing.',
        highlights: [
            'Pure EU-sourced Niacinamide effectively fades hyperpigmentation and post-acne marks',
            '1% Zinc PCA suppresses excess oil and bacterial triggers responsible for breakouts',
            'Aloe-based base formulation delivers soothing hydration without greasy residue',
            'Dermatologically tested and completely free of artificial perfumes and drying alcohols'
        ],
        pros: [
            'Noticeable pore refinement and oil reduction within 2-3 weeks',
            'Zero pore-clogging ingredients; layers smoothly under sunscreen',
            'Exceptional value compared to imported dermatological serums'
        ],
        cons: [
            'First-time users may experience mild purging if transitioning from harsh astringents',
            'Best used with a hydrating moisturizer in dry winter weather'
        ],
        aiScore: 95,
        aiRecommendation: 'The most effective, transparently formulated blemish and pore control serum available in India. Backed by solid dermatological research.',
        isEditorChoice: true,
        isPopular: true
    },
    {
        id: 'beauty-2',
        name: 'Philips OneBlade QP2824 Face & Body Trimmer',
        category: 'Beauty & Personal Care',
        subCategory: "Men's Grooming & Trimmers",
        brand: 'Philips',
        price: 2199,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&q=80',
        specs: {
            'Blade Tech': 'Fast-Moving Cutter (12,000x per min) with Dual Protection System',
            'Shave & Trim': 'Trims, Edges, and Shaves any length of hair without razor burn',
            'Wet & Dry': '100% Waterproof (IPX7) for sink or shower use',
            'Battery': 'Rechargeable Li-ion, 45 Minutes Cordless Runtime (USB-A charging)',
            'Accessories': '5-in-1 Adjustable Stubble Comb (1-5mm) + Body Skin Guard',
            'Blade Longevity': 'Up to 4 Months per replaceable blade head',
            'Warranty': '2 Years Brand Warranty'
        },
        description: 'Revolutionary hybrid groomer that trims, edges, and shaves clean lines on any hair length. Unlike traditional foil or rotary razors, the OneBlade does not shave too close to the skin, preventing cuts, nicks, and ingrown hairs.',
        highlights: [
            'Dual protection system with rounded polymer tips glides safely over sensitive skin',
            'Fast-moving 12,000 RPM cutter powers through coarse stubble without pulling',
            'Two-sided blade allows edging in either direction with complete line precision',
            '100% waterproof for easy cleaning under running tap water'
        ],
        pros: [
            'Zero razor burn, redness, or ingrown hairs even on sensitive neck areas',
            'Handy USB charging cable ideal for travel luggage',
            'Adjustable 5-in-1 comb replaces multiple clunky attachments'
        ],
        cons: [
            'Does not provide baby-smooth zero shave (leaves micro-stubble equivalent to 0.1mm)',
            'Blades require periodic replacement every 3-4 months'
        ],
        aiScore: 93,
        aiRecommendation: 'The smartest grooming tool for men who dislike traditional razor irritation. Effortlessly trims beards and body hair with total safety.',
        isBestBudget: true
    },
    {
        id: 'beauty-3',
        name: 'Dyson Airwrap Multi-Styler Complete Long',
        category: 'Beauty & Personal Care',
        subCategory: 'Haircare & Styling',
        brand: 'Dyson',
        price: 49900,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80',
        specs: {
            'Motor': 'Dyson Digital Motor V9 (110,000 RPM creating 3.2kPa pressure)',
            'Heat Control': 'Intelligent Heat Control measuring airflow temp over 40 times per second',
            'Airflow Technology': 'Enhanced Coanda Airflow for curling, shaping, and smoothing',
            'Max Temperature': 'Strictly regulated below 150°C to prevent thermal hair damage',
            'Attachments': '30mm & 40mm Long Barrels, Firm Smoothing Brush, Soft Smoothing Brush, Round Volumizing Brush, Coanda Smoothing Dryer',
            'Case': 'Prussian Blue Storage Case with copper trim',
            'Warranty': '2 Years International Dyson Guarantee'
        },
        description: 'The viral hair styling icon that harnesses aerodynamic Coanda airflow instead of frying hair with extreme heat. Styles from damp to dry, simultaneously curling, shaping, and hiding flyaways with salon-grade smoothness.',
        highlights: [
            'Bi-directional Coanda curling barrels create clockwise and counter-clockwise curls with one click',
            'Smart temperature sensor prevents extreme thermal damage, preserving natural hair moisture and shine',
            'Multifunctional smoothing dryer hides flyaways in a single pass for a sleek salon blowout finish'
        ],
        pros: [
            'Zero burnt hair smell or heat damage',
            'Replaces blow dryer, curling wand, and straightening irons in one kit',
            'Saves tremendous styling time once the Coanda technique is mastered'
        ],
        cons: [
            'Substantial luxury investment',
            'Curls may require styling mousse/hairspray on naturally straight fine hair'
        ],
        aiScore: 94,
        aiRecommendation: 'An unrivaled luxury beauty investment for those who style their hair regularly. Prevents cumulative heat damage while producing salon-standard results.',
        isBestPremium: true
    },
    // ==========================================
    // LARGE APPLIANCES
    // ==========================================
    {
        id: 'app-1',
        name: 'LG 8 Kg 5 Star AI Direct Drive Front Load Washing Machine',
        category: 'Large Appliances',
        subCategory: 'Front & Top Load Washing Machines',
        brand: 'LG',
        price: 36990,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&q=80',
        specs: {
            'Capacity': '8.0 Kg (Ideal for families of 3-5 members)',
            'Energy Rating': '5 Star BEE Energy Efficiency',
            'Motor Tech': 'AI Inverter Direct Drive (Belt-less motor attached directly to drum)',
            'Spin Speed': '1400 RPM for rapid water extraction',
            'Steam Feature': 'Steam+ technology removes 99.9% allergens and reduces wrinkles by 30%',
            'Smart Connectivity': 'ThinQ Wi-Fi with Remote Cycle Start and Smart Diagnosis',
            'Tub Material': 'Full Stainless Steel Lifters & Drum',
            'Warranty': '2 Years on Product, 10 Years on Motor'
        },
        description: 'Intelligent fabric protection powered by AI Direct Drive. Deep learning sensors detect load weight and fabric softness, automatically selecting optimal drum wash motions to protect delicate garments while deep-cleaning.',
        highlights: [
            'AI DD motor chooses from 20,000 wash combinations for 18% greater fabric preservation',
            'Steam Allergy Care cycle neutralizes house dust mites and pollen allergens',
            'TurboWash 59 delivers a full thorough laundry cycle in under an hour without wasting water',
            'Whisper-quiet direct drive motor eliminates belt squeal and vibration'
        ],
        pros: [
            'Astonishingly quiet even during 1400 RPM spin extraction',
            'Significant water and electricity savings with 5-star rating',
            'Robust stainless steel drum construction prevents bacterial growth'
        ],
        cons: [
            'Heavy unit (70+ kg) requires professional leveling during initial install',
            'Requires minimum 1.0 bar water pressure (pressure pump needed for low overhead tanks)'
        ],
        aiScore: 95,
        aiRecommendation: 'Our highest-rated washing machine. The AI Direct Drive motor and steam hygiene cycle provide unmatched fabric longevity and quiet operation.',
        isEditorChoice: true,
        isPopular: true
    },
    {
        id: 'app-2',
        name: 'Samsung 324L 3-Star Double Door Frost Free Refrigerator',
        category: 'Large Appliances',
        subCategory: 'Frost-Free Refrigerators',
        brand: 'Samsung',
        price: 34990,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&q=80',
        specs: {
            'Capacity': '324 Liters (Fresh Food 236L, Freezer 88L)',
            'Energy Star': '3 Star BEE Efficiency Rating',
            'Compressor': 'Digital Inverter Compressor with 20-Year Warranty',
            'Cooling Tech': 'Twin Cooling Plus (Independent cooling systems for fridge and freezer)',
            'Convertible Modes': 'Convertible 5-in-1 (Normal, Extra Fridge, Seasonal, Vacation, Home Alone)',
            'Shelves': 'Toughened Glass Shelves (Holds up to 175 kg)',
            'Voltage Protection': 'Stabilizer-Free Operation (100V - 300V)',
            'Warranty': '1 Year Comprehensive, 20 Years on Compressor'
        },
        description: 'Transform your storage with Convertible 5-in-1 Twin Cooling Plus. Twin independent evaporators preserve up to 70% humidity in the vegetable drawer and prevent food odor crossover between the freezer and fresh food compartments.',
        highlights: [
            'Convertible 5-in-1 mode converts the freezer into extra fridge space at the push of a button',
            'Twin Cooling Plus retains vegetable crispness twice as long without frost dehydration',
            'Digital Inverter compressor automatically adjusts 7 cooling speeds according to room temperature',
            'Anti-bacterial deodorizing carbon filter keeps interior air pure and fresh'
        ],
        pros: [
            'Very flexible convertible modes during party and festival hosting',
            'Twin cooling completely stops ice cream from smelling like curry or onions',
            'Industry-leading 20-year compressor warranty'
        ],
        cons: [
            '3-star energy rating draws slightly more units than premium 4/5-star models',
            'Glossy finish attracts fingerprint smudges'
        ],
        aiScore: 93,
        aiRecommendation: 'The most versatile double-door refrigerator for medium-to-large Indian families. The 5-in-1 convertible versatility and twin cooling tech offer tremendous everyday value.',
        isPopular: true
    },
    {
        id: 'app-3',
        name: 'Sony Bravia 55-inch 4K Ultra HD Smart OLED Google TV (A80L)',
        category: 'Large Appliances',
        subCategory: 'Smart 4K Televisions',
        brand: 'Sony',
        price: 139990,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80',
        specs: {
            'Screen Size': '55 Inches (139 cm) Self-Illuminating OLED Panel',
            'Resolution': '4K Ultra HD (3840 x 2160 pixels), 120Hz Refresh Rate',
            'Processor': 'Cognitive Processor XR (Recreates content the way humans see and hear)',
            'HDR Support': 'Dolby Vision, HDR10, HLG, IMAX Enhanced, Netflix Calibrated Mode',
            'Audio': 'Acoustic Surface Audio+ (50W Actuators turn the entire glass screen into a speaker)',
            'Gaming': 'HDMI 2.1, 4K 120fps, VRR, ALLM, Auto HDR Tone Mapping for PS5',
            'Operating System': 'Google TV with Hands-free Voice Search & Apple AirPlay 2',
            'Warranty': '2 Years Comprehensive Manufacturer Warranty'
        },
        description: 'The pinnacle of home theater immersion. Cognitive Processor XR delivers pure OLED contrast with infinite black levels, while innovative Acoustic Surface Audio vibrates the display glass so audio tracks actors\' exact mouth positions.',
        highlights: [
            'Cognitive Processor XR with XR Triluminos Pro reproduces over a billion natural colors',
            'Screen-as-speaker technology synchronizes dialogue directly with on-screen actors',
            'Perfect for PlayStation 5 with Auto HDR Tone Mapping and Auto Genre Picture Mode',
            'Dolby Vision and Dolby Atmos deliver reference-grade cinema fidelity'
        ],
        pros: [
            'Infinite contrast ratio with pitch-black cinema rendering and zero backlight blooming',
            'Remarkable audio clarity eliminates the mandatory need for a soundbar',
            'Smooth 120Hz refresh rate with low input lag'
        ],
        cons: [
            'Very high price tag',
            'Best suited for light-controlled rooms rather than directly sunlight-drenched spaces'
        ],
        aiScore: 97,
        aiRecommendation: 'The ultimate television for discerning movie lovers and console gamers. The self-lit OLED panel combined with Sony\'s Cognitive image processing is unmatched.',
        isEditorChoice: true,
        isBestPremium: true
    },
    // ==========================================
    // SPORTS, FITNESS & OUTDOOR
    // ==========================================
    {
        id: 'sport-1',
        name: 'Garmin Forerunner 265 Running GPS Smartwatch',
        category: 'Sports, Fitness & Outdoor',
        subCategory: 'Sports Equipment',
        brand: 'Garmin',
        price: 46990,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=500&q=80',
        specs: {
            'Display': '1.3-inch Brilliant AMOLED Touchscreen + 5 Physical Navigation Buttons',
            'GPS System': 'Multi-Band Satellite GNSS with SatIQ Technology',
            'Battery Life': 'Up to 13 Days in Smartwatch Mode (Up to 20 Hours in GPS Mode)',
            'Metrics': 'HRV Status, Training Readiness, VO2 Max, Running Dynamics on Wrist',
            'Music Storage': 'Built-in storage for Spotify and Amazon Music offline playlists',
            'Water Rating': '5 ATM (Swim proof down to 50 meters)',
            'Weight': 'Featherweight 47g'
        },
        description: 'Level up your training with a brilliant AMOLED touchscreen. Get morning reports on sleep, recovery, and training readiness scores, and conquer your next 10K or marathon with Garmin Coach adaptive training plans.',
        highlights: [
            'Vivid AMOLED screen readable even under intense direct midday sunlight',
            'Multi-band GNSS with SatIQ provides pinpoint GPS tracking under dense tree canopies and tall buildings',
            'Wrist-based running power and running dynamics without requiring separate chest strap sensors'
        ],
        pros: [
            'Unrivaled training analytics, recovery suggestions, and race pace predictors',
            'Class-leading 13-day battery eliminates nightly charging anxiety',
            'Physical buttons make lap marking effortless while running with sweaty hands'
        ],
        cons: [
            'Premium athletic price tag',
            'Lacks microphone and speaker for phone call taking'
        ],
        aiScore: 96,
        aiRecommendation: 'The definitive tool for runners, triathletes, and serious fitness enthusiasts. Superior GPS tracking accuracy and in-depth physiological feedback.'
    },
    {
        id: 'sport-2',
        name: 'Decathlon Domyos 500 Foldable Incline Weight Bench',
        category: 'Sports, Fitness & Outdoor',
        subCategory: 'Gym & Home Fitness',
        brand: 'Decathlon',
        price: 8999,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80',
        specs: {
            'Max Load Capacity': '220 Kg (User weight + Dumbbells/Barbell)',
            'Backrest Positions': '4 Incline Angles (0°, 30°, 45°, 80°) + 2 Seat Adjustments',
            'Foldability': 'Folds flat in under 30 seconds for under-bed or closet storage',
            'Padding': 'High-Density Thick Ergonomic Foam with Sweat-Resistant Vinyl',
            'Frame': '100% Solid Steel Construction with rubber floor protector end-caps',
            'Folded Dimensions': '130 x 35 x 20 cm',
            'Warranty': '2 Years Decathlon Warranty'
        },
        description: 'Transform any living space into a dedicated home gym. Robust, stable, and easily foldable, this versatile bench enables flat bench presses, incline chest flies, shoulder presses, and core dumbbell work.',
        highlights: [
            'Quick lock adjustment pins allow switching backrest incline in seconds',
            'Foldable compact design slides under standard beds or leans in wardrobes',
            'Wide stabilizing steel feet prevent wobbling during heavy dumbbell lifts'
        ],
        pros: [
            'Extremely solid steel construction with zero squeaking under load',
            'High 220kg total load capacity accommodates serious weightlifters',
            'Compact storage convenience for apartment living'
        ],
        cons: [
            'Does not support decline bench position (flat and incline only)',
            'Assembly takes approximately 20-30 minutes out of the box'
        ],
        aiScore: 92,
        aiRecommendation: 'The most reliable, space-saving dumbbell bench for home workouts. Combines gym-grade structural stability with practical foldability.',
        isBestBudget: true
    },
    // ==========================================
    // BOOKS, MEDIA & STATIONERY
    // ==========================================
    {
        id: 'book-1',
        name: 'Atomic Habits by James Clear (Collector\'s Edition Hardcover)',
        category: 'Books, Media & Stationery',
        subCategory: 'Bestsellers & Non-Fiction',
        brand: 'Random House',
        price: 699,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
        specs: {
            'Author': 'James Clear',
            'Publisher': 'Random House Business Books',
            'Format': 'Deluxe Hardcover with Ribbon Bookmark',
            'Pages': '320 Pages',
            'Language': 'English',
            'Genre': 'Self-Help / Behavioral Psychology / Productivity',
            'ISBN-13': '978-0735211292'
        },
        description: 'The revolutionary #1 New York Times bestseller with over 15 million copies sold globally. A comprehensive, practical guide on how small daily changes (1% better every day) compound into remarkable life-altering results.',
        highlights: [
            'Master the 4 Laws of Behavior Change: Make it Obvious, Attractive, Easy, and Satisfying',
            'Discover how to design environments that make positive habits natural and bad habits difficult',
            'Includes practical habit scorecards, habit stacking templates, and implementation formulas'
        ],
        pros: [
            'Actionable and evidence-backed framework with zero filler fluff',
            'Accessible prose with engaging historical and scientific anecdotes',
            'Premium hardcover paper and binding quality'
        ],
        cons: [
            'Requires consistent personal discipline to apply long-term',
            'Many core principles may already be familiar to avid psychology readers'
        ],
        aiScore: 98,
        aiRecommendation: 'The single most practical and transformative book on habit formation ever written. A must-read for students, professionals, and entrepreneurs.',
        isEditorChoice: true,
        isPopular: true
    },
    {
        id: 'book-2',
        name: 'Kindle Paperwhite (16 GB, 6.8-inch display)',
        category: 'Books, Media & Stationery',
        subCategory: 'Bestsellers & Non-Fiction',
        brand: 'Amazon',
        price: 14999,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500&q=80',
        specs: {
            'Display': '6.8-inch Glare-Free 300 ppi E-Ink Paperwhite Screen',
            'Lighting': '17 LED Front Light with Adjustable Warm Light (White to Amber)',
            'Storage': '16 GB (Holds thousands of books)',
            'Battery Life': 'Up to 10 Weeks on a single USB-C charge',
            'Waterproofing': 'IPX8 Rated (Protected against accidental water submersion up to 2m)',
            'Connectivity': 'Dual-Band Wi-Fi (2.4 GHz and 5.0 GHz)',
            'Weight': '205g'
        },
        description: 'Read comfortably anywhere without eye strain. Featuring a larger 6.8-inch 300 ppi glare-free screen that reads like real paper even in bright sunlight, with an adjustable warm light to shift screen shade from white to amber.',
        highlights: [
            '300 ppi glare-free screen displays laser-quality text that eliminates digital eye fatigue',
            'Adjustable warm light shifts screen tone for peaceful late-night reading in bed',
            'IPX8 waterproof build lets you read worry-free in the bath, poolside, or at the beach',
            'USB-C fast charging with astonishing 10-week battery endurance'
        ],
        pros: [
            'Reads identical to printed paper without blue light or screen glare',
            'Battery lasts for over two months of daily reading',
            'Instant access to millions of Kindle titles, dictionaries, and vocabulary builders'
        ],
        cons: [
            'Monochrome display only (cannot display color comic books or magazines)',
            'Page-turn speed is slower than an iPad or smartphone'
        ],
        aiScore: 96,
        aiRecommendation: 'The ultimate dedicated reading companion. If you love books, the glare-free display and lack of social media notifications provide pure literary focus.',
        isEditorChoice: true
    },
    // ==========================================
    // GROCERIES & GOURMET
    // ==========================================
    {
        id: 'groc-1',
        name: 'Blue Tokai Coffee Roasters - Vienna Roast Ground Coffee (250g)',
        category: 'Groceries & Gourmet',
        subCategory: 'Artisanal Coffee & Green Tea',
        brand: 'Blue Tokai',
        price: 490,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80',
        specs: {
            'Bean Origin': '100% Specialty Grade Arabica from Chikmagalur Estates, Karnataka',
            'Roast Profile': 'Dark Roast (Vienna Roast)',
            'Flavor Notes': 'Bittersweet Dark Cocoa, Toasted Walnut, Oaky Spice',
            'Grind Size': 'Customizable (Channi, French Press, Aeropress, Espresso, Whole Beans)',
            'Processing': 'Washed & Sun-Dried',
            'Packaging': 'One-Way Degassing Valve Foil Bag with Zip Lock',
            'Weight': '250g'
        },
        description: 'India\'s premier specialty coffee. Freshly roasted in small batches to order, Vienna Roast offers a full-bodied cup with low acidity and rich notes of dark chocolate and roasted nuts. Perfect with milk or black.',
        highlights: [
            'Single-estate ethically sourced 100% Arabica beans graded 82+ by Q-graders',
            'Roasted to order and dispatched with clear roast date stamping',
            'One-way valve pouch locks in essential aromatic CO2 while keeping oxygen out'
        ],
        pros: [
            'Outstanding aroma and rich cocoa crema',
            'Low bitterness with zero sour astringency',
            'Fresh roast date transparently printed on every pack'
        ],
        cons: [
            'Must be consumed within 4-6 weeks of roast date for peak aromatics',
            'Requires standard brewing apparatus (French press, moka pot, or filter channi)'
        ],
        aiScore: 94,
        aiRecommendation: 'The best introduction to specialty Indian coffee. Rich, deeply satisfying, and far superior to mass-produced commercial instant powders.',
        isEditorChoice: true
    },
    {
        id: 'groc-2',
        name: 'The Whole Truth 100% Whey Protein Isolate (Unflavored, 1kg)',
        category: 'Groceries & Gourmet',
        subCategory: 'Healthy Snacks & Superfoods',
        brand: 'The Whole Truth',
        price: 3199,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80',
        specs: {
            'Protein Content': '27g Pure Protein per 30g scoop (90% protein concentration)',
            'Ingredient List': '100% Whey Protein Isolate (Single Ingredient)',
            'BCAAs': '6.4g naturally occurring Branched Chain Amino Acids',
            'Artificial Additives': '0g Sugar, 0g Sucralose/Stevia, 0g Gums, 0g Soy Lecithin',
            'Processing': 'Cross-Flow Cold Microfiltration (Preserves native immunoglobulins)',
            'Digestibility': 'Virtually lactose-free (<0.5g lactose per scoop)',
            'Certifications': 'Informed Sport & Trustified Lab Certified for heavy metals and purity'
        },
        description: 'The cleanest protein powder in the country. Zero artificial sweeteners, zero thickeners, zero flavoring agents. Just 100% pure cold-microfiltered whey isolate sourced from grass-fed cows.',
        highlights: [
            'Only one single ingredient on the entire nutrition label',
            'Delivers an incredible 27 grams of pure bioavailable protein per 30g serving',
            'Third-party blind lab tested for protein percentage, heavy metals, and zero amino spiking'
        ],
        pros: [
            'Zero bloating, cramps, or chemical aftertaste',
            'Blends smoothly into milkshakes, smoothies, oats, or pancake batter',
            'Transparent batch-specific lab test reports accessible online'
        ],
        cons: [
            'Unflavored taste is naturally milky and plain (requires blending with cocoa/fruit)',
            'Premium price over budget whey concentrates'
        ],
        aiScore: 96,
        aiRecommendation: 'The cleanest, most trustworthy protein supplement on the market. If you want zero artificial chemicals or hidden fillers, this is the benchmark.',
        isEditorChoice: true,
        isBestPremium: true
    },
    // ==========================================
    // AUTOMOTIVE & HARDWARE
    // ==========================================
    {
        id: 'auto-1',
        name: '70mai A810 4K HDR Dual Dash Cam (Front + Rear)',
        category: 'Automotive & Hardware',
        subCategory: 'Dash Cams & GPS',
        brand: '70mai',
        price: 19999,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&q=80',
        specs: {
            'Image Sensor': 'Sony Starvis 2 IMX678 (Industry first 1/1.8" automotive sensor)',
            'Resolution': '4K UHD (3840x2160) Front + 1080P Full HD Rear',
            'Night Vision': 'Exclusive MaiColor Vivid+ with Dual HDR (Handles high contrast glare)',
            'Power Source': 'Super Capacitor (Heat resistant up to 70°C for Indian summers)',
            'GPS & ADAS': 'Built-in GPS with Lane Departure & Forward Collision Warnings',
            'Parking Guard': '24-Hour AI Motion Detection & G-Sensor Collision Recording',
            'Storage': 'MicroSD card support up to 256GB Class 10 U3'
        },
        description: 'Capture crystal-clear license plates day and night. Powered by the next-generation Sony Starvis 2 sensor, the A810 records native 4K with dual HDR to eliminate headlight flare and provide undeniable legal insurance evidence.',
        highlights: [
            'Sony Starvis 2 IMX678 sensor captures license plates even at high speeds in dim light',
            'Super capacitor replaces lithium batteries to prevent swelling in hot parked vehicles',
            'Dual-channel recording captures both forward traffic and rear bumper tailgaters',
            '70mai mobile app enables instant Wi-Fi video downloads to smartphones'
        ],
        pros: [
            'Unbeatable low-light nighttime license plate legibility',
            'Super capacitor design ensures long-term safety in extreme Indian heat',
            'Accurate GPS speed and route coordinate stamping'
        ],
        cons: [
            '24-hour parking surveillance requires optional hardwire kit installation',
            'Rear camera routing requires running a cable through vehicle headliner'
        ],
        aiScore: 95,
        aiRecommendation: 'The single best automotive safety accessory you can install. The 4K Starvis 2 image clarity provides indisputable evidence in road disputes.',
        isEditorChoice: true
    },
    {
        id: 'auto-2',
        name: 'Bosch GSB 500W Impact Drill Kit (100-Piece Accessories)',
        category: 'Automotive & Hardware',
        subCategory: 'Power & Hand Tools',
        brand: 'Bosch',
        price: 3899,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&q=80',
        specs: {
            'Power Input': '500 Watts High-Torque Motor',
            'No-Load Speed': '0 - 2,600 RPM with Variable Speed Trigger',
            'Impact Rate': '0 - 41,600 BPM (Beats Per Minute for Masonry)',
            'Drilling Capacity': 'Concrete 10mm, Steel 8mm, Wood 20mm',
            'Chuck Capacity': '1.5 - 10 mm Keyed Chuck',
            'Kit Contents': '100 Accessories: Masonry/Wood bits, Screwdriver bits, Plugs, Screws, Hammer, Pliers',
            'Warranty': '1 Year Bosch Domestic Warranty'
        },
        description: 'The definitive all-in-one home DIY kit. Switch between rotary drilling for wood and impact hammering for concrete walls. Ships in a heavy-duty carry case loaded with 100 essential drills, bits, hammer, and hand tools.',
        highlights: [
            'Impact hammering mode effortlessly drills into solid concrete and brick walls',
            'Variable speed trigger with forward/reverse switch for driving and removing screws',
            'Comprehensive 100-piece accessory toolbox covers every household mounting job'
        ],
        pros: [
            'High power 500W motor drills into tough concrete without stalling',
            'Compact, ergonomic grip with depth gauge guide',
            'Phenomenal value considering all included bits and hand tools'
        ],
        cons: [
            'Keyed chuck takes slightly longer to swap bits than keyless models',
            'Corded tool requires nearby electrical socket or extension lead'
        ],
        aiScore: 92,
        aiRecommendation: 'An indispensable toolkit for every home. Never wait for an electrician or carpenter again to hang wall frames, TVs, or drill shelves.',
        isBestBudget: true,
        isPopular: true
    }
];
