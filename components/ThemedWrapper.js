'use client';

import { useThemeStore, themes } from '../lib/store/themeStore';
import { useEffect } from 'react';

export default function ThemedWrapper({ children }) {
  const { currentTheme } = useThemeStore();
  const theme = themes[currentTheme] || themes.classic;

  useEffect(() => {
    const root = document.documentElement;
    
    Object.entries(theme).forEach(([key, value]) => {
      if (key !== 'name') {
        root.style.setProperty(`--${key}`, value);
      }
    });

    if (theme.backdropFilter) {
      root.style.setProperty('--backdropFilter', theme.backdropFilter);
    } else {
      root.style.setProperty('--backdropFilter', 'none');
    }
  }, [currentTheme, theme]);

  return <>{children}</>;
}
