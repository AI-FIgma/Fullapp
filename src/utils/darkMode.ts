// Dark mode utility functions
export type ThemeMode = 'light' | 'dark' | 'auto';

const THEME_STORAGE_KEY = 'theme-mode';

/**
 * Get the stored theme preference from localStorage
 */
export function getStoredTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored;
  }
  return 'light'; // Default to light mode
}

/**
 * Save theme preference to localStorage
 */
export function setStoredTheme(theme: ThemeMode): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Check if system prefers dark mode
 */
export function getSystemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Apply dark mode class to document root based on theme preference
 */
export function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else if (theme === 'light') {
    root.classList.remove('dark');
  } else if (theme === 'auto') {
    // Auto mode - follow system preference
    if (getSystemPrefersDark()) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}

/**
 * Initialize theme on app load
 */
export function initializeTheme(): ThemeMode {
  const storedTheme = getStoredTheme();
  applyTheme(storedTheme);
  return storedTheme;
}

/**
 * Listen for system theme changes (for auto mode)
 */
export function watchSystemTheme(callback: (isDark: boolean) => void): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };
  
  mediaQuery.addEventListener('change', handler);
  
  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}
