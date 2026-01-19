import { Languages } from 'lucide-react';
import { useTranslation } from '../utils/useTranslation';
import { getAvailableLanguages, type Language } from '../utils/i18n';
import { useState } from 'react';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';
}

/**
 * Language Switcher Component
 * 
 * Allows users to change the application language.
 * Supports two variants:
 * - compact: Icon button with dropdown
 * - full: Full language selection UI (for Settings page)
 */
export function LanguageSwitcher({ variant = 'compact' }: LanguageSwitcherProps) {
  const { t, currentLang, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const languages = getAvailableLanguages();

  const handleLanguageChange = (lang: Language) => {
    changeLanguage(lang);
    setIsOpen(false);
  };

  // Compact variant (icon button with dropdown)
  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
          title={t('settings.changeLanguage')}
        >
          <Languages className="w-5 h-5 text-gray-600" />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-20 min-w-[160px]">
              <div className="p-2">
                <p className="px-3 py-2 text-xs text-gray-500 font-medium">
                  {t('settings.selectLanguage')}
                </p>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      currentLang === lang.code
                        ? 'bg-teal-50 text-teal-700 font-medium'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="flex-1 text-left">{lang.name}</span>
                    {currentLang === lang.code && (
                      <span className="text-teal-500">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Full variant (for Settings page)
  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-base font-medium text-gray-900">
          {t('settings.language')}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {t('settings.selectLanguage')}
        </p>
      </div>
      
      <div className="p-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
              currentLang === lang.code
                ? 'bg-teal-50 text-teal-700 font-medium'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span className="text-2xl">{lang.flag}</span>
            <div className="flex-1 text-left">
              <p className="font-medium">{lang.name}</p>
              <p className="text-xs text-gray-500">{lang.code.toUpperCase()}</p>
            </div>
            {currentLang === lang.code && (
              <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
