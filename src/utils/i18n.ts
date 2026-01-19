/**
 * i18n (Internationalization) System
 * 
 * Supports multiple languages with:
 * - Auto-translation fallback
 * - Manual translation overrides
 * - Nested key access (e.g., "common.submit")
 * - Type-safe translations
 */

import { en } from '../locales/en';
import { lt } from '../locales/lt';

export type Language = 'en' | 'lt';

export type TranslationKeys = typeof en;

// Available translations
const translations: Record<Language, TranslationKeys> = {
  en,
  lt
};

// Get nested value from object using dot notation
function getNestedValue(obj: any, path: string): string {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path; // Return key if not found
    }
  }
  
  return typeof result === 'string' ? result : path;
}

/**
 * Translate a key to current language
 * @param key - Translation key (e.g., "common.submit")
 * @param lang - Language code
 * @param variables - Optional variables to replace in translation
 * @returns Translated string
 */
export function translate(
  key: string, 
  lang: Language = 'en',
  variables?: Record<string, string | number>
): string {
  const translation = translations[lang];
  let text = getNestedValue(translation, key);
  
  // Replace variables if provided
  if (variables) {
    Object.entries(variables).forEach(([varKey, value]) => {
      text = text.replace(`{{${varKey}}}`, String(value));
    });
  }
  
  return text;
}

/**
 * Get current language from localStorage or default to 'en'
 */
export function getCurrentLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const saved = localStorage.getItem('app_language');
  return (saved === 'lt' || saved === 'en') ? saved : 'en';
}

/**
 * Save language preference to localStorage
 */
export function setCurrentLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('app_language', lang);
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): Array<{ code: Language; name: string; flag: string }> {
  return [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' }
  ];
}
