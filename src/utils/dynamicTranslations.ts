/**
 * Dynamic Translations Utility
 * 
 * Handles translations for user-generated content (categories, tags, etc.)
 * Unlike static UI translations (/locales/*.ts), these are stored in database
 * and can be edited by admins at runtime.
 */

import type { Language } from './i18n';

/**
 * Interface for translatable content
 */
export interface TranslatableContent {
  id: string;
  translations: {
    en: string;
    lt: string;
  };
}

/**
 * Get translation for dynamic content
 * @param content - Translatable content object
 * @param lang - Target language
 * @returns Translated string
 */
export function getDynamicTranslation(
  content: TranslatableContent | undefined,
  lang: Language
): string {
  if (!content) return '';
  return content.translations[lang] || content.translations.en || '';
}

/**
 * Create translatable content with both languages
 * @param en - English text
 * @param lt - Lithuanian text
 * @returns TranslatableContent object
 */
export function createTranslation(en: string, lt: string): TranslatableContent['translations'] {
  return { en, lt };
}

/**
 * Validate that both translations are provided
 * @param translations - Translation object
 * @returns True if both languages are present
 */
export function validateTranslations(translations: { en?: string; lt?: string }): boolean {
  return Boolean(translations.en?.trim() && translations.lt?.trim());
}

/**
 * Mock auto-translate function
 * In production, this would call Google Translate API, DeepL, etc.
 * 
 * @param text - Text to translate
 * @param fromLang - Source language
 * @param toLang - Target language
 * @returns Translated text (mock)
 */
export async function autoTranslate(
  text: string,
  fromLang: Language,
  toLang: Language
): Promise<string> {
  // Mock implementation - in production, call real API
  // Example: Google Cloud Translation API
  // const response = await fetch('https://translation.googleapis.com/...');
  
  console.log(`🌍 Auto-translating "${text}" from ${fromLang} to ${toLang}`);
  
  // Mock translations for common words
  const mockTranslations: Record<string, Record<Language, string>> = {
    'Birds': { en: 'Birds', lt: 'Paukščiai' },
    'Reptiles': { en: 'Reptiles', lt: 'Ropliai' },
    'Fish': { en: 'Fish', lt: 'Žuvys' },
    'Rabbits': { en: 'Rabbits', lt: 'Triušiai' },
    'Horses': { en: 'Horses', lt: 'Arkliai' },
  };
  
  // Check mock dictionary
  const mock = mockTranslations[text];
  if (mock) {
    return mock[toLang];
  }
  
  // Fallback: return original text with indicator
  return `${text} [auto-${toLang}]`;
}

/**
 * In-memory storage for dynamic translations (mock database)
 * In production, this would be replaced with actual database calls
 */
class DynamicTranslationStore {
  private store: Map<string, TranslatableContent> = new Map();

  /**
   * Save translatable content
   */
  async save(id: string, translations: { en: string; lt: string }): Promise<void> {
    // Mock database save
    this.store.set(id, { id, translations });
    console.log(`💾 Saved translation for ${id}:`, translations);
  }

  /**
   * Get translatable content by ID
   */
  async get(id: string): Promise<TranslatableContent | undefined> {
    return this.store.get(id);
  }

  /**
   * Get all translatable content
   */
  async getAll(): Promise<TranslatableContent[]> {
    return Array.from(this.store.values());
  }

  /**
   * Delete translatable content
   */
  async delete(id: string): Promise<void> {
    this.store.delete(id);
    console.log(`🗑️ Deleted translation for ${id}`);
  }

  /**
   * Update single language translation
   */
  async updateLanguage(id: string, lang: Language, text: string): Promise<void> {
    const existing = this.store.get(id);
    if (existing) {
      existing.translations[lang] = text;
      this.store.set(id, existing);
      console.log(`✏️ Updated ${lang} translation for ${id}: "${text}"`);
    }
  }
}

// Singleton instance
export const dynamicTranslationStore = new DynamicTranslationStore();
