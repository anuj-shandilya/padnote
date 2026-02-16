import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Theme, ThemeConfig } from '@/types';

const themes: ThemeConfig[] = [
  { name: 'Light', class: 'light', icon: 'Sun', description: 'Clean and bright' },
  { name: 'Dark', class: 'dark', icon: 'Moon', description: 'Easy on the eyes' },
  { name: 'Midnight', class: 'theme-midnight', icon: 'Star', description: 'Deep blue elegance' },
  { name: 'Purple', class: 'theme-purple', icon: 'Sparkles', description: 'Dreamy vibes' },
  { name: 'Cream', class: 'theme-cream', icon: 'Coffee', description: 'Warm and cozy' },
  { name: 'Mint', class: 'theme-mint', icon: 'Leaf', description: 'Fresh and clean' },
  { name: 'Rose', class: 'theme-rose', icon: 'Heart', description: 'Soft and romantic' },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: ThemeConfig[];
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notepad-theme') as Theme;
      return saved || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    themes.forEach(t => root.classList.remove(t.class));
    
    // Add current theme class
    const themeConfig = themes.find(t => t.class === theme);
    if (themeConfig) {
      root.classList.add(themeConfig.class);
    }
    
    // Save to localStorage
    localStorage.setItem('notepad-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const themeOrder: Theme[] = ['light', 'dark', 'midnight', 'purple', 'cream', 'mint', 'rose'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setThemeState(themeOrder[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
