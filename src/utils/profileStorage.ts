import { Product, UserRole } from '../types';

export interface UserTaskOrAlert {
  id: string;
  type: 'price_alert' | 'todo' | 'purchase_plan';
  title: string;
  targetPrice?: number;
  productId?: string;
  productName?: string;
  status: 'active' | 'completed';
  createdAt: string;
}

export interface UserProfileData {
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  budgetGoal?: number;
  preferredCategories?: string[];
  preferredBrands?: string[];
  hourlyRate?: number; // for experts
  domainSpecialty?: string; // for experts
  wishlists: { id: string; name: string; description?: string; productIds: string[] }[];
  favorites: string[]; // product IDs
  searchHistory: string[];
  compareHistory: { id: string; names: string[]; timestamp: string }[];
  tasks: UserTaskOrAlert[];
  consultations: {
    id: string;
    expertName: string;
    clientName: string;
    topic: string;
    date: string;
    status: 'Confirmed' | 'Completed' | 'Pending';
    fee: number;
  }[];
}

const DEFAULT_GUEST_DATA: UserProfileData = {
  name: 'Guest Explorer',
  email: 'guest@wisefind.local',
  role: 'user',
  wishlists: [
    { id: 'default', name: 'General Favorites', description: 'Quick saved items', productIds: [] }
  ],
  favorites: [],
  searchHistory: ['Laptops for coding', 'Flagship camera phone', 'Noise cancelling headphones'],
  compareHistory: [],
  tasks: [],
  consultations: []
};

export function getStorageKey(email: string): string {
  return `wisefind_profile_${email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_')}`;
}

export function loadUserDataForEmail(email: string | null | undefined): UserProfileData {
  if (!email) {
    // Return guest session data
    const guestRaw = localStorage.getItem('wisefind_guest_session');
    if (guestRaw) {
      try {
        const parsed = JSON.parse(guestRaw);
        return { ...DEFAULT_GUEST_DATA, ...parsed, email: 'guest@wisefind.local' };
      } catch (e) {
        return DEFAULT_GUEST_DATA;
      }
    }
    return DEFAULT_GUEST_DATA;
  }

  const key = getStorageKey(email);
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_GUEST_DATA,
        ...parsed,
        email: email
      };
    } catch (e) {
      console.error('Error parsing stored user data for', email, e);
    }
  }

  // Pre-seed default data for Karim or known accounts if newly initialized
  const initialRole: UserRole = email.toLowerCase().includes('admin') || email === 'kadivarkarim21@gmail.com' 
    ? 'admin' 
    : email.toLowerCase().includes('expert') ? 'expert' : 'user';

  const newProfile: UserProfileData = {
    name: email.split('@')[0].replace('.', ' '),
    email: email,
    role: initialRole,
    wishlists: [
      { id: 'default', name: 'My Tech Wishlist', description: 'Primary tracking list', productIds: [] }
    ],
    favorites: [],
    searchHistory: [],
    compareHistory: [],
    tasks: [],
    consultations: []
  };

  try {
    localStorage.setItem(key, JSON.stringify(newProfile));
  } catch (e) {
    console.error('Error saving initial profile', e);
  }

  return newProfile;
}

export function saveUserDataForEmail(email: string | null | undefined, data: Partial<UserProfileData>): void {
  if (!email) {
    try {
      const guestRaw = localStorage.getItem('wisefind_guest_session');
      const current = guestRaw ? JSON.parse(guestRaw) : DEFAULT_GUEST_DATA;
      const updated = { ...DEFAULT_GUEST_DATA, ...current, ...data };
      localStorage.setItem('wisefind_guest_session', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving guest session', e);
    }
    return;
  }

  const key = getStorageKey(email);
  try {
    const stored = localStorage.getItem(key);
    const existing = stored ? JSON.parse(stored) : null;
    const updated: UserProfileData = {
      ...DEFAULT_GUEST_DATA,
      ...(existing || {}),
      ...data,
      email: email
    };
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving user data for', email, e);
  }
}
