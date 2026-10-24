import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const ThemeContext = createContext(undefined);

// Theme CSS variable presets for programmatic runtime synchronization
const THEME_CSS_VARS = {
    light: {
        '--theme-bg-primary': '#F8FAFC',
        '--theme-bg-secondary': '#FFFFFF',
        '--theme-bg-tertiary': '#F1F5F9',
        '--theme-bg-card': '#FFFFFF',
        '--theme-bg-card-hover': '#F8FAFC',
        '--theme-bg-elevated': '#FFFFFF',
        '--theme-bg-subtle': '#F1F5F9',
        '--theme-bg-input': '#F8FAFC',
        '--theme-bg-glass': 'rgba(255, 255, 255, 0.88)',
        '--theme-text-primary': '#0F172A',
        '--theme-text-secondary': '#334155',
        '--theme-text-muted': '#64748B',
        '--theme-text-subtle': '#94A3B8',
        '--theme-border-primary': '#E2E8F0',
        '--theme-border-secondary': '#CBD5E1',
        '--theme-border-subtle': '#F1F5F9',
        '--theme-primary': '#4F46E5',
        '--theme-primary-hover': '#4338CA',
        '--theme-accent': '#7C3AED',
        '--theme-accent-hover': '#6D28D9',
        '--theme-brand-accent': '#F59E0B',
        '--theme-success': '#10B981',
        '--theme-warning': '#F59E0B',
        '--theme-error': '#EF4444',
        '--theme-glow-primary': 'rgba(79, 70, 229, 0.15)',
    },
    dark: {
        '--theme-bg-primary': '#090D16',
        '--theme-bg-secondary': '#0E1424',
        '--theme-bg-tertiary': '#12182B',
        '--theme-bg-card': '#101526',
        '--theme-bg-card-hover': '#171E36',
        '--theme-bg-elevated': '#161D33',
        '--theme-bg-subtle': '#0B101D',
        '--theme-bg-input': '#0B101D',
        '--theme-bg-glass': 'rgba(14, 20, 36, 0.88)',
        '--theme-text-primary': '#F8FAFC',
        '--theme-text-secondary': '#CBD5E1',
        '--theme-text-muted': '#94A3B8',
        '--theme-text-subtle': '#64748B',
        '--theme-border-primary': '#1E293B',
        '--theme-border-secondary': '#334155',
        '--theme-border-subtle': 'rgba(255, 255, 255, 0.06)',
        '--theme-primary': '#6366F1',
        '--theme-primary-hover': '#818CF8',
        '--theme-accent': '#8B5CF6',
        '--theme-accent-hover': '#A78BFA',
        '--theme-brand-accent': '#FBBF24',
        '--theme-success': '#34D399',
        '--theme-warning': '#FBBF24',
        '--theme-error': '#F87171',
        '--theme-glow-primary': 'rgba(99, 102, 241, 0.25)',
    }
};

/**
 * Apply theme to document element, update global CSS variables, and synchronize metadata
 */
function applyThemeToDocument(newTheme) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // 1. Synchronize classes & dataset attributes
    if (newTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
    } else {
        root.classList.remove('dark');
        root.classList.add('light');
    }
    root.setAttribute('data-theme', newTheme);
    root.style.colorScheme = newTheme;

    // 2. Synchronize global CSS variables directly on root
    const cssVars = THEME_CSS_VARS[newTheme] || THEME_CSS_VARS.dark;
    Object.entries(cssVars).forEach(([key, val]) => {
        root.style.setProperty(key, val);
    });

    // 3. Update mobile status bar theme-color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#090D16' : '#F8FAFC');
    }

    // 4. Dispatch a custom window event for external listeners
    window.dispatchEvent(new CustomEvent('wisefind-theme-change', { 
        detail: { theme: newTheme, isDark: newTheme === 'dark' } 
    }));
}

export const ThemeProvider = ({ children }) => {
    // Read persisted theme from session/local storage or system preference
    const [theme, setThemeState] = useState(() => {
        try {
            const sessionSaved = sessionStorage.getItem('wisefind_theme');
            if (sessionSaved === 'dark' || sessionSaved === 'light') {
                return sessionSaved;
            }
            const localSaved = localStorage.getItem('wisefind_theme');
            if (localSaved === 'dark' || localSaved === 'light') {
                return localSaved;
            }
            // Fallback to system preference or default dark
            if (typeof window !== 'undefined' && window.matchMedia) {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
        } catch (e) {
            console.warn('Storage access restricted:', e);
        }
        return 'dark';
    });

    const isInitialMount = useRef(true);

    // Apply theme changes and persist across session & local storage
    useEffect(() => {
        const root = document.documentElement;

        // Apply smooth transition class for subsequent user toggles
        if (!isInitialMount.current) {
            root.classList.add('theme-transitioning');
            const timer = setTimeout(() => {
                root.classList.remove('theme-transitioning');
            }, 350);

            applyThemeToDocument(theme);

            // Persist across session and future visits
            try {
                sessionStorage.setItem('wisefind_theme', theme);
                localStorage.setItem('wisefind_theme', theme);
            } catch (e) {
                console.warn('Could not save theme:', e);
            }

            return () => clearTimeout(timer);
        } else {
            isInitialMount.current = false;
            applyThemeToDocument(theme);
            try {
                sessionStorage.setItem('wisefind_theme', theme);
                localStorage.setItem('wisefind_theme', theme);
            } catch (e) {}
        }
    }, [theme]);

    // Synchronize theme across multiple browser tabs in the session
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'wisefind_theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
                setThemeState(e.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Toggle theme between light and dark with optional View Transition API support
    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        const applyToggle = () => {
            setThemeState(nextTheme);
        };

        if (typeof document !== 'undefined' && 'startViewTransition' in document) {
            document.startViewTransition(applyToggle);
        } else {
            applyToggle();
        }
    };

    // Explicitly set theme ('light' | 'dark')
    const setTheme = (newTheme) => {
        if (newTheme !== 'light' && newTheme !== 'dark') return;
        const applySet = () => {
            setThemeState(newTheme);
        };

        if (typeof document !== 'undefined' && 'startViewTransition' in document) {
            document.startViewTransition(applySet);
        } else {
            applySet();
        }
    };

    const value = {
        theme,
        isDark: theme === 'dark',
        isLight: theme === 'light',
        toggleTheme,
        setTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        return {
            theme: 'dark',
            isDark: true,
            isLight: false,
            toggleTheme: () => {},
            setTheme: () => {}
        };
    }
    return context;
};
