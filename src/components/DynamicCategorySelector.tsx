import { useState, useEffect } from 'react';
import { getDynamicTranslation, dynamicTranslationStore, type TranslatableContent } from '../utils/dynamicTranslations';
import { useTranslation } from '../utils/useTranslation';

interface Category extends TranslatableContent {
  icon: string;
  color: string;
}

interface DynamicCategorySelectorProps {
  value: string;
  onChange: (categoryId: string) => void;
}

/**
 * Dynamic Category Selector
 * 
 * Displays categories created by admins with proper translations
 * Updates automatically when language changes
 */
export function DynamicCategorySelector({ value, onChange }: DynamicCategorySelectorProps) {
  const { currentLang, t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load categories from store (in production: fetch from database)
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      // In production: const { data } = await supabase.from('categories').select('*');
      const data = await dynamicTranslationStore.getAll() as Category[];
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-sm text-gray-500">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t('post.category')}
      </label>
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
      >
        <option value="">
          {t('common.select')} {t('post.category')}
        </option>
        
        {/* Static categories (from /locales/*.ts) */}
        <optgroup label="Default Categories">
          <option value="dogs">🐕 {t('categories.dogs')}</option>
          <option value="cats">🐈 {t('categories.cats')}</option>
          <option value="shelters">🏠 {t('categories.shelters')}</option>
          <option value="general">💬 {t('categories.general')}</option>
          <option value="events">📅 {t('categories.events')}</option>
          <option value="lostFound">🔍 {t('categories.lostFound')}</option>
        </optgroup>

        {/* Dynamic categories (from database) */}
        {categories.length > 0 && (
          <optgroup label="Custom Categories">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {getDynamicTranslation(cat, currentLang)}
              </option>
            ))}
          </optgroup>
        )}
      </select>

      {/* Selected category preview */}
      {value && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {(() => {
            // Find selected category
            const selectedDynamic = categories.find(c => c.id === value);
            if (selectedDynamic) {
              return (
                <>
                  <span className="text-lg">{selectedDynamic.icon}</span>
                  <span>
                    {getDynamicTranslation(selectedDynamic, currentLang)}
                  </span>
                  <span 
                    className="ml-2 w-4 h-4 rounded-full" 
                    style={{ backgroundColor: selectedDynamic.color }}
                  />
                </>
              );
            }
            
            // Static category icons
            const staticIcons: Record<string, string> = {
              dogs: '🐕',
              cats: '🐈',
              shelters: '🏠',
              general: '💬',
              events: '📅',
              lostFound: '🔍',
            };
            
            return (
              <>
                <span className="text-lg">{staticIcons[value]}</span>
                <span>{t(`categories.${value}` as any)}</span>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
