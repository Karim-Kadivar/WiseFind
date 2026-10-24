/**
 * Translates technical hardware specifications into friendly, plain-English everyday explanations.
 */
/**
 * Translates technical hardware specifications into friendly, plain-English everyday explanations.
 */
export function translateSpecToPlainEnglish(key, value, category = '') {
  const k = (key || '').toLowerCase();
  const v = (value || '').toString().toLowerCase();
  const cat = (category || '').toLowerCase();

  // 1. Processors, SOCs & Silicon
  if (k.includes('processor') || k.includes('cpu') || k.includes('chip') || k.includes('silicon')) {
    if (v.includes('m5') || v.includes('m4') || v.includes('m3') || v.includes('m2') || v.includes('ultra') || v.includes('max')) {
      return 'Blazing-fast pro-grade workstation silicon. Delivers staggering speed for 8K video exports, 3D modeling, and dozens of heavy apps without breaking a sweat.';
    }
    if (v.includes('8 elite') || v.includes('8 gen') || v.includes('a18') || v.includes('a17') || v.includes('tensor g4') || v.includes('dimensity 9400') || v.includes('dimensity 9300')) {
      return 'Pinnacle flagship processor. Unrivaled speed, lightning-fast app launches, console-grade gaming graphics, and next-gen on-device AI.';
    }
    if (v.includes('core ultra') || v.includes('i9') || v.includes('ryzen 9') || v.includes('ryzen ai')) {
      return 'Elite multicore powerhouse. Handles 40+ browser tabs, intensive code compilation, and creative rendering effortlessly with cool thermals.';
    }
    if (v.includes('i7') || v.includes('i5') || v.includes('ryzen 7') || v.includes('ryzen 5') || v.includes('snapdragon 7') || v.includes('dimensity 8')) {
      return 'Snappy, smooth everyday multitasking. Perfect for demanding office workflows, college projects, and fluid gaming.';
    }
    return 'Reliable, energy-efficient performance for fast web browsing, streaming, and daily multitasking.';
  }

  // 2. Audio, Acoustic Drivers & Noise Cancellation
  if (k.includes('audio') || k.includes('sound') || k.includes('noise') || k.includes('anc') || k.includes('driver') || cat.includes('audio') || cat.includes('headphone') || cat.includes('earbud')) {
    if (k.includes('anc') || k.includes('noise') || v.includes('anc') || v.includes('noise cancellation') || v.includes('transparent')) {
      return 'Studio-grade Active Noise Cancellation. Completely silences noisy cafes, airplane engine rumble, and office chatter for pure immersion.';
    }
    if (v.includes('titanium') || v.includes('40mm') || v.includes('hi-res') || v.includes('ldac') || v.includes('dolby atmos') || v.includes('spatial')) {
      return 'Concert-hall spatial acoustics with deep sub-bass, crystal-clear vocals, and master studio fidelity.';
    }
    if (k.includes('battery') || v.includes('hour') || v.includes('hrs')) {
      return 'Marathon battery endurance. Listen for days on a single charge with ultra-rapid top-up.';
    }
    return 'Rich, immersive soundstage with balanced treble, deep bass, and crystal-clear voice calls.';
  }

  // 3. Displays & Screens
  if (k.includes('display') || k.includes('screen') || k.includes('panel')) {
    if (v.includes('oled') || v.includes('amoled') || v.includes('retina xdr') || v.includes('mini-led')) {
      return 'Vibrant, jaw-dropping colors with pitch-black contrast and ultra-high dynamic range. Perfect for movies and design work.';
    }
    if (v.includes('120hz') || v.includes('144hz') || v.includes('165hz') || v.includes('240hz') || v.includes('ltpo') || v.includes('promotion')) {
      return 'Silky-smooth adaptive high refresh rate. Scrolling, gaming, and app switching feel instantaneous with zero stutter.';
    }
    if (v.includes('nits') || v.includes('2000') || v.includes('3000') || v.includes('4000')) {
      return 'Sunlight-piercing brightness. Perfectly readable outdoors even under harsh midday Indian sunlight.';
    }
    return 'Sharp, bright high-definition display that is comfortable and easy on your eyes for long sessions.';
  }

  // 4. Battery & Charging Speed
  if (k.includes('battery') || k.includes('charging') || k.includes('power')) {
    if (v.includes('100w') || v.includes('120w') || v.includes('80w') || v.includes('67w') || v.includes('65w') || v.includes('hypercharge')) {
      return 'Ultra-rapid warp charging. Go from empty to full battery in just 20-35 minutes.';
    }
    if (v.includes('5000') || v.includes('6000') || v.includes('20 hour') || v.includes('22 hour') || v.includes('24 hour') || v.includes('36 hour')) {
      return 'Massive all-day and overnight battery endurance. Never worry about reaching for a charger before bedtime.';
    }
    return 'Solid battery endurance that comfortably powers you through a full demanding workday.';
  }

  // 5. Cameras & Optics
  if (k.includes('camera') || k.includes('sensor') || k.includes('lens') || cat.includes('camera')) {
    if (v.includes('200mp') || v.includes('periscope') || v.includes('zeiss') || v.includes('hasselblad') || v.includes('telephoto') || v.includes('1-inch')) {
      return 'Professional studio-grade imaging with lossless optical zoom, creamy background blur, and stunning low-light detail.';
    }
    if (v.includes('50mp') || v.includes('ois') || v.includes('4k') || v.includes('8k')) {
      return 'Sharp, blur-free photos and rock-steady video recording with lifelike colors and skin tones.';
    }
    return 'Reliable, clear imaging with AI enhancements for memorable family photos, reels, and video meetings.';
  }

  // 6. RAM & System Memory
  if (k.includes('ram') || k.includes('memory')) {
    if (v.includes('16gb') || v.includes('32gb') || v.includes('64gb') || v.includes('96gb') || v.includes('128gb')) {
      return 'Monster multitasking headroom. Keep 40+ browser tabs, heavy spreadsheets, and creative apps open simultaneously without reloads.';
    }
    if (v.includes('12gb') || v.includes('8gb')) {
      return 'Generous unified memory for lag-free app switching, fluid animations, and heavy background workloads.';
    }
    return 'Smooth day-to-day memory management for effortless app switching.';
  }

  // 7. Internal Storage
  if (k.includes('storage') || k.includes('ssd') || k.includes('rom')) {
    if (v.includes('512gb') || v.includes('1tb') || v.includes('2tb') || v.includes('nvme')) {
      return 'Massive ultra-fast storage. Stores tens of thousands of high-res photos, 4K video projects, and massive games with instant file opening.';
    }
    return 'Spacious built-in storage for all your daily apps, personal photos, documents, and media libraries.';
  }

  // 8. Smartwatches & Wearable Sensors
  if (cat.includes('watch') || cat.includes('wearable') || k.includes('sensor') || k.includes('water')) {
    if (v.includes('ecg') || v.includes('blood oxygen') || v.includes('spo2') || v.includes('heart') || v.includes('temperature')) {
      return 'Continuous clinical-grade health tracking. Monitors heart rhythm, sleep cycles, stress levels, and early wellness warning signs.';
    }
    if (v.includes('50m') || v.includes('100m') || v.includes('10atm') || v.includes('ip68') || v.includes('titanium')) {
      return 'Rugged aerospace-grade build. Safe for lap swimming, rugged trails, sweat, and extreme weather.';
    }
    return 'Intelligent wellness & fitness tracking that keeps you connected all day right from your wrist.';
  }

  // 9. Kitchen & Home Appliances
  if (cat.includes('kitchen') || cat.includes('cook') || cat.includes('home') || cat.includes('appliance')) {
    if (v.includes('watt') || v.includes('motor') || v.includes('rpm') || v.includes('rapid air') || v.includes('cyclon')) {
      return 'High-powered culinary efficiency. Cooks crispy, healthier food with up to 90% less oil and faster turnaround.';
    }
    if (v.includes('litre') || v.includes('liter') || v.includes('capacity')) {
      return 'Generous family-sized capacity designed to prepare generous meals in a single convenient batch.';
    }
    return 'Effortless automated cooking and food preparation with easy-to-clean dishwasher-safe parts.';
  }

  // 10. Official Warranty & Durability
  if (k.includes('warranty') || k.includes('guarantee')) {
    return 'Official brand manufacturer protection with authorized service centers and genuine replacement parts.';
  }

  // Generic friendly fallback based on value
  return `${value} — Verified hardware component audited for durability and long-term reliability.`;
}

/**
 * Returns the assigned Category Advisor for a given product category
 */
export function getAdvisorForCategory(category = '') {
  const cat = category.toLowerCase();
  
  if (cat.includes('laptop') || cat.includes('computer')) {
    return {
      id: 'adv-1',
      name: 'Vikramaditya Sengupta',
      title: 'Senior Systems Architect',
      specialty: 'Laptops & Workstations',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      chatRateINR: 199,
      isOnline: true
    };
  }
  
  if (cat.includes('phone') || cat.includes('mobile')) {
    return {
      id: 'adv-2',
      name: 'Ananya Deshmukh',
      title: 'Mobile Camera Specialist',
      specialty: 'Smartphones & Gadgets',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      chatRateINR: 149,
      isOnline: true
    };
  }

  if (cat.includes('audio') || cat.includes('headphone') || cat.includes('earbud')) {
    return {
      id: 'adv-3',
      name: 'Rohan Varma',
      title: 'Certified Acoustic Engineer',
      specialty: 'Audio & Sound Gear',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      chatRateINR: 179,
      isOnline: false
    };
  }

  if (cat.includes('kitchen') || cat.includes('cook') || cat.includes('home')) {
    return {
      id: 'adv-4',
      name: 'Meera Krishnan',
      title: 'Kitchen Tech Specialist',
      specialty: 'Home & Kitchen Appliances',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      chatRateINR: 129,
      isOnline: true
    };
  }

  if (cat.includes('beauty') || cat.includes('skin') || cat.includes('care')) {
    return {
      id: 'adv-5',
      name: 'Dr. Tanya Chawla',
      title: 'Cosmetic Formulation Analyst',
      specialty: 'Skincare & Personal Care',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      chatRateINR: 199,
      isOnline: true
    };
  }

  if (cat.includes('fashion') || cat.includes('shoe') || cat.includes('wear') || cat.includes('apparel')) {
    return {
      id: 'adv-6',
      name: 'Kabir Malhotra',
      title: 'Footwear & Apparel Specialist',
      specialty: 'Fashion & Sneakers',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      chatRateINR: 129,
      isOnline: true
    };
  }

  if (cat.includes('game') || cat.includes('gaming') || cat.includes('gpu')) {
    return {
      id: 'adv-7',
      name: 'Devraj Chauhan',
      title: 'Esports Hardware Analyst',
      specialty: 'Gaming & PC Builds',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      chatRateINR: 149,
      isOnline: true
    };
  }

  // Fallback Wearables / Gadgets
  return {
    id: 'adv-8',
    name: 'Pooja Sundaram',
    title: 'Sports Tech Consultant',
    specialty: 'Fitness & Wearables',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    chatRateINR: 149,
    isOnline: true
  };
}

/**
 * Formats a clean product title without repeating the brand name if it is already part of the name.
 * e.g., formatProductName('Apple', 'iPhone 16 Pro') -> 'Apple iPhone 16 Pro'
 * e.g., formatProductName('Apple', 'Apple iPhone 16 Pro') -> 'Apple iPhone 16 Pro'
 */
export function formatProductName(brand, name) {
  if (!brand) return (name || '').trim();
  if (!name) return (brand || '').trim();
  const cleanBrand = brand.trim();
  const cleanName = name.trim();
  if (cleanName.toLowerCase().startsWith(cleanBrand.toLowerCase())) {
    return cleanName;
  }
  return `${cleanBrand} ${cleanName}`;
}

