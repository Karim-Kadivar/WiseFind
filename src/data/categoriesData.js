import { Smartphone, UtensilsCrossed, Shirt, Sparkles, Tv, Activity, BookOpen, Coffee, Car, Baby } from 'lucide-react';
export const MASTER_CATEGORIES = [
    {
        id: 'electronics',
        name: 'Electronics & Gadgets',
        shortName: 'Electronics',
        iconEmoji: '📱',
        icon: Smartphone,
        description: 'Smartphones, Laptops, Audio, Wearables & Accessories',
        gradient: 'from-blue-500/10 via-cyan-500/5 to-transparent',
        badgeTheme: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
        hoverBorder: 'hover:border-cyan-400 dark:hover:border-cyan-500',
        hoverGlow: 'hover:shadow-cyan-500/15',
        accentColor: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
        subCategories: [
            'Smartphones',
            'Laptops & Ultrabooks',
            'Audio & Headphones',
            'Smartwatches & Fitness Trackers',
            'Tablets & iPads',
            'Cameras & Gear',
            'Gaming Consoles & Handhelds',
            'Keyboards & Accessories'
        ]
    },
    {
        id: 'home-kitchen',
        name: 'Home & Kitchen',
        shortName: 'Home & Kitchen',
        iconEmoji: '🍳',
        icon: UtensilsCrossed,
        description: 'Air Fryers, Cookware, Coffee Machines & Smart Cleaners',
        gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
        badgeTheme: 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        hoverBorder: 'hover:border-amber-400 dark:hover:border-amber-500',
        hoverGlow: 'hover:shadow-amber-500/15',
        accentColor: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
        subCategories: [
            'Cookware & Pots',
            'Air Fryers & Ovens',
            'Coffee Makers & Kettles',
            'Robot Vacuums & Cleaners',
            'Mixer Grinders & Blenders',
            'Home Decor & Storage'
        ]
    },
    {
        id: 'fashion',
        name: 'Fashion & Apparel',
        shortName: 'Fashion',
        iconEmoji: '👕',
        icon: Shirt,
        description: 'Sneakers, Watches, Denim, Bags & Everyday Style',
        gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
        badgeTheme: 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        hoverBorder: 'hover:border-rose-400 dark:hover:border-rose-500',
        hoverGlow: 'hover:shadow-rose-500/15',
        accentColor: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
        subCategories: [
            "Men's Wear",
            "Women's Western & Ethnic",
            'Footwear & Sneakers',
            'Watches & Clocks',
            'Bags, Backpacks & Luggage',
            'Sunglasses & Eyewear'
        ]
    },
    {
        id: 'beauty',
        name: 'Beauty & Personal Care',
        shortName: 'Beauty & Care',
        iconEmoji: '✨',
        icon: Sparkles,
        description: 'Dermatological Skincare, Haircare, Trimmers & Scents',
        gradient: 'from-purple-500/10 via-fuchsia-500/5 to-transparent',
        badgeTheme: 'bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        hoverBorder: 'hover:border-purple-400 dark:hover:border-purple-500',
        hoverGlow: 'hover:shadow-purple-500/15',
        accentColor: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
        subCategories: [
            'Skincare & Serums',
            'Haircare & Styling',
            "Men's Grooming & Trimmers",
            'Fragrances & Perfumes',
            'Oral & Body Care'
        ]
    },
    {
        id: 'appliances',
        name: 'Large Appliances',
        shortName: 'Appliances',
        iconEmoji: '🧊',
        icon: Tv,
        description: 'Smart TVs, Inverter ACs, Washing Machines & Refrigerators',
        gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
        badgeTheme: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-500',
        hoverGlow: 'hover:shadow-emerald-500/15',
        accentColor: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
        subCategories: [
            'Smart 4K Televisions',
            'Inverter Air Conditioners',
            'Front & Top Load Washing Machines',
            'Frost-Free Refrigerators',
            'Microwave Ovens & Dishwashers'
        ]
    },
    {
        id: 'sports',
        name: 'Sports, Fitness & Outdoor',
        shortName: 'Sports & Fitness',
        iconEmoji: '🏃',
        icon: Activity,
        description: 'Home Gym Equipment, Running Shoes, Cycles & Badminton',
        gradient: 'from-red-500/10 via-orange-500/5 to-transparent',
        badgeTheme: 'bg-red-50 text-red-700 dark:bg-red-950/80 dark:text-red-300 border-red-200 dark:border-red-800',
        hoverBorder: 'hover:border-red-400 dark:hover:border-red-500',
        hoverGlow: 'hover:shadow-red-500/15',
        accentColor: 'group-hover:text-red-600 dark:group-hover:text-red-400',
        subCategories: [
            'Gym & Home Fitness',
            'Running Shoes & Trainers',
            'Yoga Mats & Wellness',
            'Bicycles & Cycling',
            'Sports Equipment'
        ]
    },
    {
        id: 'books',
        name: 'Books, Media & Stationery',
        shortName: 'Books & Media',
        iconEmoji: '📚',
        icon: BookOpen,
        description: 'Bestsellers, E-Readers, Hardcovers & Luxury Pens',
        gradient: 'from-indigo-500/10 via-violet-500/5 to-transparent',
        badgeTheme: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        hoverBorder: 'hover:border-indigo-400 dark:hover:border-indigo-500',
        hoverGlow: 'hover:shadow-indigo-500/15',
        accentColor: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
        subCategories: [
            'Bestsellers & Non-Fiction',
            'Tech, Business & Startup',
            'Fiction & Literature',
            'Premium Notebooks & Pens'
        ]
    },
    {
        id: 'groceries',
        name: 'Groceries & Gourmet',
        shortName: 'Groceries',
        iconEmoji: '🥑',
        icon: Coffee,
        description: 'Artisanal Coffee, Premium Dry Fruits, Whey & Superfoods',
        gradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
        badgeTheme: 'bg-teal-50 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200 dark:border-teal-800',
        hoverBorder: 'hover:border-teal-400 dark:hover:border-teal-500',
        hoverGlow: 'hover:shadow-teal-500/15',
        accentColor: 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
        subCategories: [
            'Artisanal Coffee & Green Tea',
            'Dry Fruits, Nuts & Seeds',
            'Healthy Snacks & Superfoods',
            'Gourmet Chocolates & Spreads'
        ]
    },
    {
        id: 'automotive',
        name: 'Automotive & Hardware',
        shortName: 'Auto & Tools',
        iconEmoji: '🚗',
        icon: Car,
        description: '4K Dash Cams, Power Tools, Pressure Washers & Helmets',
        gradient: 'from-sky-500/10 via-blue-500/5 to-transparent',
        badgeTheme: 'bg-sky-50 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 border-sky-200 dark:border-sky-800',
        hoverBorder: 'hover:border-sky-400 dark:hover:border-sky-500',
        hoverGlow: 'hover:shadow-sky-500/15',
        accentColor: 'group-hover:text-sky-600 dark:group-hover:text-sky-400',
        subCategories: [
            'Dash Cams & GPS',
            'Car Care & Pressure Washers',
            'Power & Hand Tools',
            'Riding Helmets & Accessories'
        ]
    },
    {
        id: 'baby-toys',
        name: 'Baby, Kids & Toys',
        shortName: 'Baby & Kids',
        iconEmoji: '🧸',
        icon: Baby,
        description: 'Strollers, STEM Building Sets, Action Figures & Baby Care',
        gradient: 'from-yellow-500/10 via-amber-500/5 to-transparent',
        badgeTheme: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/80 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
        hoverBorder: 'hover:border-yellow-400 dark:hover:border-yellow-500',
        hoverGlow: 'hover:shadow-yellow-500/15',
        accentColor: 'group-hover:text-yellow-600 dark:group-hover:text-yellow-400',
        subCategories: [
            'Strollers & Travel Gear',
            'STEM & Educational Toys',
            'Action Toys & LEGO',
            'Baby Care Essentials'
        ]
    }
];
export const ALL_CATEGORY_SUBCATEGORIES_MAP = MASTER_CATEGORIES.reduce((acc, cat) => {
    acc[cat.name] = cat.subCategories;
    acc[cat.shortName] = cat.subCategories;
    return acc;
}, {});
