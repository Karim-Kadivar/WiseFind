import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('wisefind_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    // Default to dark theme as requested
    return 'dark';
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    const root = document.documentElement;

    // Trigger cross-fade transition class on subsequent theme switches
    if (!isInitialMount.current) {
      root.classList.add('theme-transitioning');
      const timer = setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 400);
      
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('wisefind_theme', theme);
      
      return () => {
        clearTimeout(timer);
      };
    } else {
      isInitialMount.current = false;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('wisefind_theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const applyToggle = () => {
      setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(applyToggle);
    } else {
      applyToggle();
    }
  };

  const setTheme = (newTheme: Theme) => {
    const applySet = () => {
      setThemeState(newTheme);
    };

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(applySet);
    } else {
      applySet();
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if rendered outside ThemeProvider
    return {
      theme: 'light',
      toggleTheme: () => {},
      setTheme: () => {}
    };
  }
  return context;
};
