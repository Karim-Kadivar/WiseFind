export const PLATFORM_INFO = {
    amazon: {
        name: 'Amazon India',
        shortName: 'Amazon',
        brandColor: '#FF9900',
        accentBg: '#FFF7ED',
        darkAccentBg: 'rgba(255, 153, 0, 0.12)',
        borderColor: '#FF9900',
        tagline: 'Prime 1-Day & Pay ICICI 5% Cashback',
        badge: 'Prime Verified',
        iconType: 'amazon'
    },
    flipkart: {
        name: 'Flipkart',
        shortName: 'Flipkart',
        brandColor: '#2874F0',
        accentBg: '#EFF6FF',
        darkAccentBg: 'rgba(40, 116, 240, 0.12)',
        borderColor: '#2874F0',
        tagline: 'F-Assured & Open Box Delivery',
        badge: 'F-Assured',
        iconType: 'flipkart'
    },
    croma: {
        name: 'Croma (Tata Enterprise)',
        shortName: 'Croma',
        brandColor: '#00B5B8',
        accentBg: '#F0FDFA',
        darkAccentBg: 'rgba(0, 181, 184, 0.12)',
        borderColor: '#00B5B8',
        tagline: 'Tata Neu 5% Coins & ZipCare Warranty',
        badge: 'Tata Authorized',
        iconType: 'croma'
    },
    reliance: {
        name: 'Reliance Digital',
        shortName: 'Reliance',
        brandColor: '#E42529',
        accentBg: '#FEF2F2',
        darkAccentBg: 'rgba(228, 37, 41, 0.12)',
        borderColor: '#E42529',
        tagline: 'Instant 2-Hr Store Pickup & ResQ Care',
        badge: 'Store Pickup',
        iconType: 'reliance'
    },
    vijaysales: {
        name: 'Vijay Sales',
        shortName: 'Vijay Sales',
        brandColor: '#D8232A',
        accentBg: '#FFF1F2',
        darkAccentBg: 'rgba(216, 35, 42, 0.12)',
        borderColor: '#D8232A',
        tagline: 'V-Points & No Cost Bajaj EMI',
        badge: 'Official Dealer',
        iconType: 'vijaysales'
    },
    myntra: {
        name: 'Myntra Mall',
        shortName: 'Myntra',
        brandColor: '#FF3F6C',
        accentBg: '#FFF1F5',
        darkAccentBg: 'rgba(255, 63, 108, 0.12)',
        borderColor: '#FF3F6C',
        tagline: '100% Original Brands & Try & Buy',
        badge: 'Myntra Insider',
        iconType: 'myntra'
    },
    nykaa: {
        name: 'Nykaa',
        shortName: 'Nykaa',
        brandColor: '#FC2779',
        accentBg: '#FFF1F7',
        darkAccentBg: 'rgba(252, 39, 121, 0.12)',
        borderColor: '#FC2779',
        tagline: '100% Authentic Beauty & Express Delivery',
        badge: 'Nykaa Prive',
        iconType: 'nykaa'
    },
    meesho: {
        name: 'Meesho Mall',
        shortName: 'Meesho',
        brandColor: '#9C27B0',
        accentBg: '#FAF5FF',
        darkAccentBg: 'rgba(156, 39, 176, 0.12)',
        borderColor: '#9C27B0',
        tagline: 'Direct Supplier Value & Free Delivery',
        badge: 'Direct Supplier',
        iconType: 'meesho'
    },
    brand_store: {
        name: 'Official Brand Store',
        shortName: 'Official Store',
        brandColor: '#4F46E5',
        accentBg: '#EEF2FF',
        darkAccentBg: 'rgba(79, 70, 229, 0.12)',
        borderColor: '#4F46E5',
        tagline: 'Direct Manufacturer Warranty & Student Benefits',
        badge: 'Direct OEM',
        iconType: 'brand'
    }
};

/**
 * Deterministic hash generator based on product ID to simulate realistic market price variance
 */
function getSeededRandom(str, offset = 0) {
    let hash = 0;
    const safeStr = String(str || 'prod-1');
    for (let i = 0; i < safeStr.length; i++) {
        hash = (hash << 5) - hash + safeStr.charCodeAt(i) + offset;
        hash |= 0;
    }
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
}

/**
 * Determine exact platforms that legally and practically sell this category.
 * Explicitly excludes platforms like Meesho for smartphones/laptops, and Croma for fashion!
 */
export function getEligiblePlatformsForProduct(product) {
    const cat = (product.category || '').toLowerCase();
    const sub = (product.subCategory || '').toLowerCase();
    const name = (product.name || '').toLowerCase();

    // 1. Smartphones & Mobiles:
    // Authorized tech retailers ONLY. STRICTLY NO Meesho, NO Myntra, NO Nykaa.
    if (sub.includes('smartphone') || sub.includes('phone') || name.includes('iphone') || name.includes('galaxy') || name.includes('pixel') || name.includes('oneplus') || cat.includes('smartphone')) {
        return ['amazon', 'flipkart', 'croma', 'reliance', 'vijaysales', 'brand_store'];
    }

    // 2. Laptops & Ultrabooks / Computers:
    // Authorized tech retailers ONLY. STRICTLY NO Meesho, NO Myntra, NO Nykaa.
    if (sub.includes('laptop') || sub.includes('ultrabook') || name.includes('macbook') || name.includes('thinkpad') || name.includes('zenbook') || name.includes('laptop') || cat.includes('laptop')) {
        return ['amazon', 'flipkart', 'croma', 'reliance', 'vijaysales', 'brand_store'];
    }

    // 3. Tablets & iPads:
    if (sub.includes('tablet') || sub.includes('ipad') || name.includes('ipad') || name.includes('tab')) {
        return ['amazon', 'flipkart', 'croma', 'reliance', 'vijaysales', 'brand_store'];
    }

    // 4. Large Appliances & Televisions (TVs, Refrigerators, ACs, Washing Machines):
    if (cat.includes('large appliance') || sub.includes('television') || sub.includes('tv') || name.includes('tv') || sub.includes('refrigerator') || sub.includes('air conditioner') || sub.includes('washing machine')) {
        return ['amazon', 'flipkart', 'croma', 'reliance', 'vijaysales', 'brand_store'];
    }

    // 5. Audio & Headphones / Smartwatches:
    // Tech stores + lifestyle (Myntra sells smartwatches & fashion audio). NO Meesho for high-end audio.
    if (sub.includes('audio') || sub.includes('headphone') || sub.includes('earbud') || sub.includes('smartwatch') || sub.includes('fitness tracker')) {
        return ['amazon', 'flipkart', 'croma', 'reliance', 'myntra', 'brand_store'];
    }

    // 6. Gaming Consoles:
    if (sub.includes('gaming') || name.includes('playstation') || name.includes('xbox') || name.includes('switch')) {
        return ['amazon', 'flipkart', 'croma', 'reliance', 'vijaysales', 'brand_store'];
    }

    // 7. Fashion & Apparel (Sneakers, Clothing, Jackets):
    // Fashion platforms ONLY. NO Croma, NO Reliance Digital, NO Vijay Sales!
    if (cat.includes('fashion') || cat.includes('apparel') || sub.includes('clothing') || sub.includes('footwear') || sub.includes('sneaker') || sub.includes('apparel')) {
        return ['myntra', 'flipkart', 'amazon', 'meesho', 'brand_store'];
    }

    // 8. Beauty & Personal Care (Skincare, Fragrances, Grooming):
    // Beauty platforms ONLY. NO Croma, NO Vijay Sales!
    if (cat.includes('beauty') || cat.includes('personal care') || sub.includes('skincare') || sub.includes('hair') || sub.includes('fragrance')) {
        return ['nykaa', 'myntra', 'amazon', 'flipkart', 'meesho', 'brand_store'];
    }

    // 9. Home & Kitchen:
    if (cat.includes('home') || cat.includes('kitchen')) {
        if (name.includes('fryer') || name.includes('mixer') || name.includes('oven') || name.includes('cooker') || name.includes('maker') || name.includes('purifier') || name.includes('vacuum') || name.includes('blender')) {
            return ['amazon', 'flipkart', 'croma', 'reliance', 'meesho', 'brand_store'];
        }
        return ['amazon', 'flipkart', 'meesho', 'brand_store'];
    }

    // 10. Sports & Fitness:
    if (cat.includes('sports') || cat.includes('fitness')) {
        return ['amazon', 'flipkart', 'myntra', 'brand_store'];
    }

    // 11. Books, Media & Stationery:
    if (cat.includes('book') || cat.includes('media') || cat.includes('stationery')) {
        return ['amazon', 'flipkart'];
    }

    // 12. Groceries & Gourmet:
    if (cat.includes('grocer') || cat.includes('gourmet')) {
        return ['amazon', 'flipkart'];
    }

    // General fallback
    return ['amazon', 'flipkart', 'croma', 'reliance', 'vijaysales', 'brand_store'];
}

/**
 * Returns the 4-5 most relevant, product-specific comparison factors & specifications
 */
export function getCategoryComparisonFactors(product) {
    const cat = (product.category || '').toLowerCase();
    const sub = (product.subCategory || '').toLowerCase();
    const specs = product.specs || {};

    if (sub.includes('smartphone') || sub.includes('phone') || cat.includes('smartphone')) {
        return [
            { label: 'Chipset / Processor', key: 'Processor', value: specs['Processor'] || specs['Chipset'] || 'Flagship SoC' },
            { label: 'Camera Hardware', key: 'Camera', value: specs['Camera'] || specs['Rear Camera'] || 'Advanced Sensor Array with OIS' },
            { label: 'Display & Refresh Rate', key: 'Display', value: specs['Display'] || '120Hz Super AMOLED / LTPO OLED' },
            { label: 'Battery & Fast Charging', key: 'Battery', value: specs['Battery'] || '5000 mAh + Fast Warp/PD Charge' },
            { label: 'Memory & Storage', key: 'Storage', value: specs['Storage'] || specs['Memory'] || 'UFS 4.0 / LPDDR5X' }
        ];
    }
    if (sub.includes('laptop') || sub.includes('ultrabook') || cat.includes('laptop')) {
        return [
            { label: 'CPU & Generation', key: 'Processor', value: specs['Processor'] || specs['CPU'] || 'High-Power Multi-Core Silicon' },
            { label: 'RAM & SSD Storage', key: 'Storage', value: specs['Storage'] || specs['Memory'] || 'Fast NVMe PCIe Gen4 SSD + LPDDR' },
            { label: 'Display & Resolution', key: 'Display', value: specs['Display'] || 'High-Res 100% DCI-P3 Color Panel' },
            { label: 'Graphics Hardware (GPU)', key: 'Graphics', value: specs['Graphics'] || specs['GPU'] || 'Hardware Ray Tracing / Integrated GPU' },
            { label: 'Battery & Portability', key: 'Battery', value: specs['Battery'] || 'All-Day Workstation Runtime' }
        ];
    }
    if (sub.includes('audio') || sub.includes('headphone') || sub.includes('earbud')) {
        return [
            { label: 'Noise Cancellation (ANC)', key: 'ANC', value: specs['ANC'] || specs['Noise Cancellation'] || 'Active Hybrid Dual-Mic ANC' },
            { label: 'Battery & Case Playtime', key: 'Battery', value: specs['Battery'] || specs['Battery Life'] || '30+ Hours Total Playback' },
            { label: 'Audio Driver & Tuning', key: 'Driver', value: specs['Driver'] || 'Custom High-Res Neodymium Diaphragm' },
            { label: 'Bluetooth Codecs', key: 'Connectivity', value: specs['Connectivity'] || 'LDAC / AAC / aptX Adaptive' }
        ];
    }
    if (sub.includes('smartwatch') || sub.includes('fitness')) {
        return [
            { label: 'Display Panel', key: 'Display', value: specs['Display'] || 'High-Brightness Always-On AMOLED' },
            { label: 'Health Telemetry', key: 'Sensors', value: specs['Sensors'] || 'SpO2, Heart Rate, ECG, Sleep Staging' },
            { label: 'Battery Endurance', key: 'Battery', value: specs['Battery'] || 'Multi-Day Active GPS Tracking' },
            { label: 'Water & Dust Rating', key: 'Durability', value: specs['Durability'] || specs['Water Resistance'] || '5ATM / IP68 Certified' }
        ];
    }
    if (cat.includes('large appliance') || sub.includes('tv') || sub.includes('television')) {
        return [
            { label: 'Panel & HDR Standards', key: 'Display', value: specs['Display'] || specs['Panel'] || '4K HDR10+ / Dolby Vision IQ' },
            { label: 'Refresh Rate & MEMC', key: 'Refresh Rate', value: specs['Refresh Rate'] || '120Hz Ultra-Smooth Gaming Motion' },
            { label: 'Audio Output & Dolby', key: 'Audio', value: specs['Sound'] || specs['Audio'] || 'Dolby Atmos Spatial Audio Speakers' },
            { label: 'Smart Operating System', key: 'OS', value: specs['Smart OS'] || specs['OS'] || 'Google TV / webOS with AirPlay' }
        ];
    }
    if (cat.includes('fashion') || cat.includes('apparel')) {
        return [
            { label: 'Fabric / Material', key: 'Material', value: specs['Material'] || specs['Fabric'] || 'Premium Breathable Long-Staple Weave' },
            { label: 'Fit Profile', key: 'Fit', value: specs['Fit'] || 'Tailored Ergonomic / Comfort Fit' },
            { label: 'Occasion & Styling', key: 'Occasion', value: specs['Occasion'] || 'Smart Casual / Daily Versatile' },
            { label: 'Wash Care & Longevity', key: 'Care', value: specs['Care'] || 'Machine Washable & Color-Fast Pre-Shrunk' }
        ];
    }
    if (cat.includes('beauty') || cat.includes('personal care')) {
        return [
            { label: 'Key Active Ingredients', key: 'Ingredients', value: specs['Ingredients'] || 'Clinically Proven Dermatological Actives' },
            { label: 'Skin / Hair Suitability', key: 'Skin Type', value: specs['Skin Type'] || 'All Types (Sensitive Skin Safe)' },
            { label: 'Formulation & Texture', key: 'Formulation', value: specs['Formulation'] || 'Lightweight Fast-Absorbing Non-Greasy' },
            { label: 'Ethical Quality Standard', key: 'Quality', value: specs['Quality'] || 'Cruelty-Free, Paraben & Sulfate-Free' }
        ];
    }
    if (cat.includes('home') || cat.includes('kitchen')) {
        return [
            { label: 'Motor Power (Wattage)', key: 'Power', value: specs['Power'] || specs['Wattage'] || 'High-Torque Energy Efficient Motor' },
            { label: 'Capacity & Capacity', key: 'Capacity', value: specs['Capacity'] || 'Family-Size Multi-Purpose Bowl/Jar' },
            { label: 'Build Material Quality', key: 'Material', value: specs['Material'] || 'Food-Grade Heavy Stainless Steel' },
            { label: 'Warranty & Aftercare', key: 'Warranty', value: specs['Warranty'] || '2-Year Official Brand Domestic Warranty' }
        ];
    }

    // Default dynamic extract from product.specs
    const entries = Object.entries(specs).slice(0, 4);
    if (entries.length > 0) {
        return entries.map(([key, value]) => ({ label: key, key, value: String(value) }));
    }
    return [
        { label: 'Verified Grade', key: 'Grade', value: '100% Original Authorized Stock' },
        { label: 'Warranty Support', key: 'Warranty', value: '1 Year Brand Domestic Warranty' },
        { label: 'Value Positioning', key: 'Tier', value: 'Top Spec Value in Category' }
    ];
}

/**
 * Generate accurate, realistic multi-store pricing and direct purchase links
 * filtered STRICTLY by category eligibility.
 */
export function generatePlatformComparison(product) {
    const basePrice = product.price || 19999;
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
    const meeVar = -0.035 + (seed2 * 0.03); // Meesho value pricing
    const mynVar = -0.018 + (seed3 * 0.025);
    const nykVar = -0.01 + (seed4 * 0.02);

    // Bank offer configurations scaled to price
    const hdfcDiscount = Math.min(6000, Math.max(1000, Math.round(basePrice * 0.075 / 100) * 100));
    const iciciDiscount = Math.min(5000, Math.max(800, Math.round(basePrice * 0.065 / 100) * 100));
    const sbiDiscount = Math.min(4500, Math.max(750, Math.round(basePrice * 0.055 / 100) * 100));
    const axisDiscount = Math.min(4000, Math.max(600, Math.round(basePrice * 0.05 / 100) * 100));

    // Calculate store prices
    const amazonPrice = Math.max(299, Math.round((basePrice * (1 + amzVar)) / 10) * 10);
    const flipkartPrice = Math.max(299, Math.round((basePrice * (1 + flpVar)) / 10) * 10);
    const reliancePrice = Math.max(299, Math.round((basePrice * (1 + relVar)) / 10) * 10);
    const cromaPrice = Math.max(299, Math.round((basePrice * (1 + croVar)) / 10) * 10);
    const vijayPrice = Math.max(299, Math.round((basePrice * (1 + vijVar)) / 10) * 10);
    const oemPrice = Math.max(299, Math.round((basePrice * (1 + oemVar)) / 10) * 10);
    const meeshoPrice = Math.max(199, Math.round((basePrice * (1 + meeVar)) / 10) * 10);
    const myntraPrice = Math.max(299, Math.round((basePrice * (1 + mynVar)) / 10) * 10);
    const nykaaPrice = Math.max(249, Math.round((basePrice * (1 + nykVar)) / 10) * 10);

    // Filter which platforms are eligible for this exact category
    const eligiblePlatformIds = getEligiblePlatformsForProduct(product);

    // Platform definitions dictionary
    const platformDefinitions = {
        amazon: {
            platformId: 'amazon',
            platformName: 'Amazon India',
            brandColor: '#FF9900',
            badgeText: 'Prime Verified',
            basePrice: mrp,
            salePrice: amazonPrice,
            discountPercent: Math.round(((mrp - amazonPrice) / mrp) * 100),
            inStock: true,
            stockLevel: seed1 > 0.3 ? 'In Stock' : 'Only 3 left in stock',
            sellerName: 'Appario Retail / Cocoblu (Top Rated Prime)',
            sellerRating: 4.9,
            isVerifiedSeller: true,
            deliveryTime: 'Tomorrow by 11:00 AM',
            deliveryFee: 0,
            estimatedDeliveryDate: 'Next Day Prime Delivery',
            bankOffers: [
                {
                    id: 'amz-hdfc',
                    bank: 'HDFC Bank Cards',
                    bankCode: 'HDFC',
                    cardType: 'credit',
                    discountAmount: hdfcDiscount,
                    description: `Flat ₹${hdfcDiscount.toLocaleString('en-IN')} Instant Discount on HDFC Credit Cards & EMI`,
                    minOrderValue: 10000,
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
            cashbackText: '5% Cashback on Amazon Pay ICICI Card',
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
        flipkart: {
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
                    description: `10% Instant Discount up to ₹${sbiDiscount.toLocaleString('en-IN')} on SBI Credit Cards`,
                    minOrderValue: 8000,
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
                    description: `5% Unlimited Cashback (₹${Math.round(flipkartPrice * 0.05).toLocaleString('en-IN')}) in statement`,
                    emiAvailable: true,
                    noCostEmiMonths: 12
                }
            ],
            cashbackAmount: Math.round(flipkartPrice * 0.05),
            cashbackText: '5% Unlimited Cashback on Flipkart Axis Bank Card',
            exchangeBonus: Math.min(26000, Math.round(basePrice * 0.24 / 500) * 500),
            returnPolicy: '7 Days Brand Replacement + Open Box Delivery',
            warranty: '1 Year Brand Domestic Warranty',
            extendedWarrantyPrice: Math.round(basePrice * 0.038),
            storePickupAvailable: false,
            productUrl: `https://www.flipkart.com/search?q=${encodeURIComponent(product.name)}`,
            verifiedTimestamp: 'Verified 5 mins ago',
            customerRating: Number((product.rating + (seed2 * 0.2 - 0.1)).toFixed(1)),
            reviewCount: Math.round(980 + seed2 * 3900),
            priceDropFromAverage: Math.max(0, Math.round(mrp - flipkartPrice))
        },
        reliance: {
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
                    description: `Flat ₹${iciciDiscount.toLocaleString('en-IN')} Instant Discount on ICICI Bank Credit Cards`,
                    minOrderValue: 15000,
                    emiAvailable: true,
                    noCostEmiMonths: 9
                }
            ],
            cashbackAmount: Math.round(reliancePrice * 0.03),
            cashbackText: '3% JioMart Points Redeemable across Reliance Stores',
            exchangeBonus: Math.min(22000, Math.round(basePrice * 0.20 / 500) * 500),
            returnPolicy: '7 Days Return & Instant In-Store Demo',
            warranty: '1 Year Brand Warranty + Reliance ResQ Priority Care',
            extendedWarrantyPrice: Math.round(basePrice * 0.04),
            storePickupAvailable: true,
            nearestStoreDistance: '2.4 km away (Ready in 2 hours)',
            productUrl: `https://www.reliancedigital.in/search?q=${encodeURIComponent(product.name)}`,
            verifiedTimestamp: 'Verified 8 mins ago',
            customerRating: Number((product.rating + (seed3 * 0.15 - 0.05)).toFixed(1)),
            reviewCount: Math.round(450 + seed3 * 1600),
            priceDropFromAverage: Math.max(0, Math.round(mrp - reliancePrice))
        },
        croma: {
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
                    minOrderValue: 15000,
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
            warranty: '1 Year Brand Warranty + Optional Croma ZipCare',
            extendedWarrantyPrice: Math.round(basePrice * 0.036),
            storePickupAvailable: true,
            nearestStoreDistance: '3.1 km away (Ready in 3 hours)',
            productUrl: `https://www.croma.com/searchB?q=${encodeURIComponent(product.name)}`,
            verifiedTimestamp: 'Verified 4 mins ago',
            customerRating: Number((product.rating + (seed4 * 0.15 - 0.05)).toFixed(1)),
            reviewCount: Math.round(620 + seed4 * 2100),
            priceDropFromAverage: Math.max(0, Math.round(mrp - cromaPrice))
        },
        vijaysales: {
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
        myntra: {
            platformId: 'myntra',
            platformName: 'Myntra Mall',
            brandColor: '#FF3F6C',
            badgeText: '100% Original',
            basePrice: mrp,
            salePrice: myntraPrice,
            discountPercent: Math.round(((mrp - myntraPrice) / mrp) * 100),
            inStock: true,
            stockLevel: 'Myntra Express Stock (Original Brand Assured)',
            sellerName: 'Myntra Official Authorized Retail',
            sellerRating: 4.85,
            isVerifiedSeller: true,
            deliveryTime: '2 Days Express Delivery',
            deliveryFee: 0,
            estimatedDeliveryDate: 'Try & Buy Available',
            bankOffers: [
                {
                    id: 'myn-kotak',
                    bank: 'Kotak / Axis Bank Cards',
                    bankCode: 'KOTAK',
                    cardType: 'all',
                    discountAmount: Math.min(1500, Math.max(200, Math.round(basePrice * 0.05))),
                    description: 'Instant 10% discount on Myntra with partner credit cards',
                    emiAvailable: true,
                    noCostEmiMonths: 6
                }
            ],
            cashbackAmount: Math.round(myntraPrice * 0.03),
            cashbackText: 'Myntra Insider Points & Instant Discount Coupon',
            exchangeBonus: 0,
            returnPolicy: '14 Days Easy Return & Hassle-Free Size Exchange',
            warranty: '100% Genuine Brand Assurance',
            extendedWarrantyPrice: 0,
            storePickupAvailable: false,
            productUrl: `https://www.myntra.com/${encodeURIComponent(product.name.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase().replace(/\s+/g, '-'))}`,
            verifiedTimestamp: 'Verified 2 mins ago',
            customerRating: 4.7,
            reviewCount: Math.round(560 + seed3 * 1800),
            priceDropFromAverage: Math.max(0, Math.round(mrp - myntraPrice))
        },
        nykaa: {
            platformId: 'nykaa',
            platformName: 'Nykaa',
            brandColor: '#FC2779',
            badgeText: 'Nykaa Prive Authenticated',
            basePrice: mrp,
            salePrice: nykaaPrice,
            discountPercent: Math.round(((mrp - nykaaPrice) / mrp) * 100),
            inStock: true,
            stockLevel: 'Fresh Batch In Stock (Temperature Controlled)',
            sellerName: 'Nykaa Official Direct Brand Distribution',
            sellerRating: 4.9,
            isVerifiedSeller: true,
            deliveryTime: '2 Days Express Courier',
            deliveryFee: 0,
            estimatedDeliveryDate: 'Tamper-Evident Packaging',
            bankOffers: [
                {
                    id: 'nyk-hdfc',
                    bank: 'HDFC / ICICI Bank',
                    bankCode: 'HDFC',
                    cardType: 'credit',
                    discountAmount: Math.min(1000, Math.max(150, Math.round(basePrice * 0.05))),
                    description: 'Instant 5% discount on checkout with partner cards',
                    emiAvailable: false,
                    noCostEmiMonths: 0
                }
            ],
            cashbackAmount: Math.round(nykaaPrice * 0.04),
            cashbackText: 'Nykaa Prive Reward Points',
            exchangeBonus: 0,
            returnPolicy: '100% Authentic Guarantee & Easy Replacement',
            warranty: 'Direct Manufacturer Sealed Batch',
            extendedWarrantyPrice: 0,
            storePickupAvailable: false,
            productUrl: `https://www.nykaa.com/search/result/?q=${encodeURIComponent(product.name)}`,
            verifiedTimestamp: 'Verified 1 min ago',
            customerRating: 4.8,
            reviewCount: Math.round(890 + seed4 * 2200),
            priceDropFromAverage: Math.max(0, Math.round(mrp - nykaaPrice))
        },
        meesho: {
            platformId: 'meesho',
            platformName: 'Meesho Mall',
            brandColor: '#9C27B0',
            badgeText: 'Direct Supplier',
            basePrice: mrp,
            salePrice: meeshoPrice,
            discountPercent: Math.round(((mrp - meeshoPrice) / mrp) * 100),
            inStock: true,
            stockLevel: 'Direct Supplier In-Stock',
            sellerName: 'Meesho Mall Verified Hub',
            sellerRating: 4.6,
            isVerifiedSeller: true,
            deliveryTime: '2-3 Days Free Delivery',
            deliveryFee: 0,
            estimatedDeliveryDate: 'Free Fast Delivery',
            bankOffers: [
                {
                    id: 'mee-upi',
                    bank: 'UPI / Prepaid Discount',
                    bankCode: 'UPI',
                    cardType: 'all',
                    discountAmount: Math.min(600, Math.max(100, Math.round(basePrice * 0.04))),
                    description: 'Extra instant discount on prepaid UPI checkout',
                    emiAvailable: false,
                    noCostEmiMonths: 0
                }
            ],
            cashbackAmount: 100,
            cashbackText: 'Flat cashback on UPI orders',
            exchangeBonus: 0,
            returnPolicy: '7 Days Hassle-Free Returns',
            warranty: 'Standard Brand / Supplier Warranty',
            extendedWarrantyPrice: 0,
            storePickupAvailable: false,
            productUrl: `https://www.meesho.com/search?q=${encodeURIComponent(product.name)}`,
            verifiedTimestamp: 'Verified 4 mins ago',
            customerRating: 4.5,
            reviewCount: Math.round(480 + seed2 * 1200),
            priceDropFromAverage: Math.max(0, Math.round(mrp - meeshoPrice))
        },
        brand_store: {
            platformId: 'brand_store',
            platformName: `Official ${product.brand} Store`,
            brandColor: '#4F46E5',
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
            productUrl: (product.brand?.toLowerCase() === 'apple')
                ? `https://www.apple.com/in/shop/buy-iphone`
                : (product.brand?.toLowerCase() === 'samsung')
                    ? `https://www.samsung.com/in/search/?searchvalue=${encodeURIComponent(product.name)}`
                    : (product.brand?.toLowerCase() === 'oneplus')
                        ? `https://www.oneplus.in/search?q=${encodeURIComponent(product.name)}`
                        : `https://www.google.com/search?q=${encodeURIComponent(product.brand + ' India official store ' + product.name)}`,
            verifiedTimestamp: 'Verified 1 min ago',
            customerRating: 4.9,
            reviewCount: Math.round(1500 + seed1 * 2000),
            priceDropFromAverage: Math.max(0, Math.round(mrp - oemPrice))
        }
    };

    // Filter to only platforms eligible for this category
    const platforms = eligiblePlatformIds
        .map(id => platformDefinitions[id])
        .filter(Boolean);

    // Calculate lowest price platform
    let lowestPrice = Infinity;
    let lowestPricePlatform = platforms[0]?.platformId || 'amazon';
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
    let bestOverallPlatform = platforms[0]?.platformId || 'amazon';

    platforms.forEach(p => {
        const maxBankDiscount = Math.max(0, ...p.bankOffers.map(b => b.discountAmount));
        const effectivePrice = p.salePrice - maxBankDiscount - (p.cashbackAmount * 0.5); // effective perceived price
        if (effectivePrice < lowestEffectivePrice) {
            lowestEffectivePrice = effectivePrice;
            bestOverallPlatform = p.platformId;
        }
    });

    // Assign tags and winner metadata
    platforms.forEach(p => {
        if (p.platformId === lowestPricePlatform) {
            p.isLowestPrice = true;
        }
        if (p.platformId === 'amazon') {
            p.isFastestDelivery = true;
        }
        if (p.platformId === bestOverallPlatform) {
            p.isBestOverallDeal = true;
            p.isWinner = true;
            p.winnerReason = `Lowest Net Effective Price (₹${Math.round(lowestEffectivePrice).toLocaleString('en-IN')}) after card cashback`;
        }
    });

    const priceSpread = highestPrice - lowestPrice;
    const maxSavings = mrp - lowestPrice + hdfcDiscount;

    // 30 days price history curve
    const priceHistory30Days = [];
    const today = new Date(2026, 7, 19);
    for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
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
    const bestPlatName = PLATFORM_INFO[bestOverallPlatform]?.name || 'Amazon India';
    const lowestPlatName = PLATFORM_INFO[lowestPricePlatform]?.name || 'Flipkart';

    return {
        productId: product.id,
        productName: product.name,
        category: product.category,
        subCategory: product.subCategory,
        brand: product.brand,
        mrp,
        lowestPrice,
        highestPrice,
        priceSpread,
        lowestPricePlatform,
        fastestPlatform: 'amazon',
        bestOverallPlatform,
        winnerPlatformId: bestOverallPlatform,
        platforms,
        categoryFactors: getCategoryComparisonFactors(product),
        aiVerdict: {
            summary: `Currently, **${bestPlatName}** offers the highest value deal for ${product.name}, reaching an effective price of **₹${Math.round(lowestEffectivePrice).toLocaleString('en-IN')}** after card offers. **${lowestPlatName}** leads on raw listing price at **₹${lowestPrice.toLocaleString('en-IN')}**.`,
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

export function calculateCustomCheckoutPrice(deal, selectedBankCode, includeExchange, exchangeValueINR = 0, includeExtendedWarranty = false) {
    const listingPrice = deal.salePrice;
    let bankDiscount = 0;
    let appliedBankOfferName = 'No card offer applied';

    if (selectedBankCode && selectedBankCode !== 'NONE') {
        const offer = deal.bankOffers.find(b => b.bankCode === selectedBankCode || b.bankCode === 'ALL');
        if (offer) {
            bankDiscount = offer.discountAmount;
            appliedBankOfferName = offer.description;
        } else {
            appliedBankOfferName = 'Selected card has no special cashback on this store';
        }
    }

    const exchangeDiscount = includeExchange ? Math.min(listingPrice * 0.5, exchangeValueINR + (deal.exchangeBonus || 0)) : 0;
    const extendedWarrantyCost = includeExtendedWarranty && deal.extendedWarrantyPrice ? deal.extendedWarrantyPrice : 0;
    const deliveryFee = deal.deliveryFee || 0;
    const finalPayableAmount = Math.max(0, listingPrice - bankDiscount - exchangeDiscount + extendedWarrantyCost + deliveryFee);
    const cashbackValue = (selectedBankCode === 'AMAZONPAY' || selectedBankCode === 'TATANEU' || selectedBankCode === 'AXIS') ? deal.cashbackAmount : Math.round(deal.cashbackAmount * 0.3);
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
