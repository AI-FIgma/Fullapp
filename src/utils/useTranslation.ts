/**
 * useTranslation Hook
 * 
 * React hook for using translations in components
 * Provides access to translation function and current language
 */

import { useState, useEffect, useCallback } from 'react';
import { translate, getCurrentLanguage, setCurrentLanguage, type Language } from './i18n';

/**
 * Custom hook for translations
 * @returns Object with translation function, current language, and language setter
 */
export function useTranslation() {
  const [currentLang, setCurrentLang] = useState<Language>(getCurrentLanguage());

  // Subscribe to language changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'app_language' && (e.newValue === 'en' || e.newValue === 'lt')) {
        setCurrentLang(e.newValue);
      }
    };

    const handleLanguageChange = () => {
      const newLang = getCurrentLanguage();
      setCurrentLang(newLang);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('languageChange', handleLanguageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  // Translation function
  const t = useCallback(
    (key: string, variables?: Record<string, string | number>) => {
      return translate(key, currentLang, variables);
    },
    [currentLang]
  );

  // Change language function
  const changeLanguage = useCallback((lang: Language) => {
    setCurrentLanguage(lang);
    setCurrentLang(lang);
    
    // Trigger storage event for other tabs/components
    window.dispatchEvent(new Event('languageChange'));
  }, []);

  return {
    t,
    currentLang,
    changeLanguage,
  };
}