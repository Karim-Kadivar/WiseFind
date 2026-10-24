const DEFAULT_GUEST_DATA = {
    name: 'Guest Explorer',
    email: 'guest@wisefind.local',
    role: 'user',
    wishlists: [
        { id: 'default', name: 'General WiseList', description: 'Quick saved items', productIds: [] }
    ],
    favorites: [],
    searchHistory: ['Laptops for coding', 'Flagship camera phone', 'Noise cancelling headphones'],
    compareHistory: [],
    tasks: [],
    consultations: []
};
export function getStorageKey(email) {
    return `wisefind_profile_${email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_')}`;
}
export function loadUserDataForEmail(email) {
    if (!email) {
        // Return guest session data
        const guestRaw = localStorage.getItem('wisefind_guest_session');
        if (guestRaw) {
            try {
                const parsed = JSON.parse(guestRaw);
                return { ...DEFAULT_GUEST_DATA, ...parsed, email: 'guest@wisefind.local' };
            }
            catch (e) {
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
        }
        catch (e) {
            console.error('Error parsing stored user data for', email, e);
        }
    }
    // Pre-seed default data for Karim or known accounts if newly initialized
    const initialRole = email.toLowerCase().includes('admin') || email === 'kadivarkarim21@gmail.com'
        ? 'admin'
        : (email.toLowerCase().includes('expert') || email.toLowerCase().includes('advisor')) ? 'expert' : 'user';
    const newProfile = {
        name: email.split('@')[0].replace('.', ' '),
        email: email,
        role: initialRole,
        wishlists: [
            { id: 'default', name: 'My Tech WiseList', description: 'Primary tracking list', productIds: [] }
        ],
        favorites: [],
        searchHistory: [],
        compareHistory: [],
        tasks: [],
        consultations: []
    };
    try {
        localStorage.setItem(key, JSON.stringify(newProfile));
    }
    catch (e) {
        console.error('Error saving initial profile', e);
    }
    return newProfile;
}
export function saveUserDataForEmail(email, data) {
    if (!email) {
        try {
            const guestRaw = localStorage.getItem('wisefind_guest_session');
            const current = guestRaw ? JSON.parse(guestRaw) : DEFAULT_GUEST_DATA;
            const updated = { ...DEFAULT_GUEST_DATA, ...current, ...data };
            localStorage.setItem('wisefind_guest_session', JSON.stringify(updated));
        }
        catch (e) {
            console.error('Error saving guest session', e);
        }
        return;
    }
    const key = getStorageKey(email);
    try {
        const stored = localStorage.getItem(key);
        const existing = stored ? JSON.parse(stored) : null;
        const updated = {
            ...DEFAULT_GUEST_DATA,
            ...(existing || {}),
            ...data,
            email: email
        };
        localStorage.setItem(key, JSON.stringify(updated));

        // Sync WiseLists to MongoDB backend if wishlists were changed
        if (data.wishlists && Array.isArray(data.wishlists)) {
            try {
                fetch(`/api/wiselists/${encodeURIComponent(email)}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data.wishlists)
                }).catch(() => {});
            } catch (e) {}
        }
    }
    catch (e) {
        console.error('Error saving user data for', email, e);
    }
}

/**
 * Fetch and sync WiseLists from MongoDB
 */
export async function syncWiseListsFromMongo(email) {
    if (!email) return [];
    try {
        const res = await fetch(`/api/wiselists/${encodeURIComponent(email)}`);
        if (res.ok) {
            const serverLists = await res.json();
            if (Array.isArray(serverLists) && serverLists.length > 0) {
                saveUserDataForEmail(email, { wishlists: serverLists });
                return serverLists;
            }
        }
    } catch (e) {}
    const local = loadUserDataForEmail(email);
    return local.wishlists || [];
}
