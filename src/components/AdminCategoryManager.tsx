import { useState } from 'react';
import { Plus, Edit2, Trash2, Globe, Check, X } from 'lucide-react';
import { useTranslation } from '../utils/useTranslation';
import { 
  createTranslation, 
  validateTranslations,
  autoTranslate,
  dynamicTranslationStore,
  getDynamicTranslation,
  type TranslatableContent
} from '../utils/dynamicTranslations';

interface CategoryWithTranslations extends TranslatableContent {
  icon: string;
  color: string;
}

/**
 * Admin Category Manager Component
 * 
 * Allows admins to create/edit/delete categories with multi-language support
 * 
 * Features:
 * - Manual translation input (both EN + LT)
 * - Auto-translate button (one language → other)
 * - Live preview in both languages
 * - Validation (both languages required)
 */
export function AdminCategoryManager() {
  const { t, currentLang } = useTranslation();
  const [categories, setCategories] = useState<CategoryWithTranslations[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    nameEn: '',
    nameLt: '',
    icon: '📁',
    color: '#4DB8A8',
  });

  const [isAutoTranslating, setIsAutoTranslating] = useState(false);

  /**
   * Auto-translate from Lithuanian to English (or vice versa)
   */
  const handleAutoTranslate = async (direction: 'lt-to-en' | 'en-to-lt') => {
    setIsAutoTranslating(true);

    try {
      if (direction === 'lt-to-en' && formData.nameLt) {
        const translated = await autoTranslate(formData.nameLt, 'lt', 'en');
        setFormData({ ...formData, nameEn: translated });
      } else if (direction === 'en-to-lt' && formData.nameEn) {
        const translated = await autoTranslate(formData.nameEn, 'en', 'lt');
        setFormData({ ...formData, nameLt: translated });
      }
    } catch (error) {
      console.error('Auto-translate error:', error);
      alert('Auto-translate failed. Please enter manually.');
    } finally {
      setIsAutoTranslating(false);
    }
  };

  /**
   * Save category (create or update)
   */
  const handleSave = async () => {
    const translations = { en: formData.nameEn, lt: formData.nameLt };

    // Validate both languages are filled
    if (!validateTranslations(translations)) {
      alert('⚠️ Both English and Lithuanian names are required!');
      return;
    }

    const newCategory: CategoryWithTranslations = {
      id: editingId || `cat_${Date.now()}`,
      translations: createTranslation(formData.nameEn, formData.nameLt),
      icon: formData.icon,
      color: formData.color,
    };

    // Save to mock database
    await dynamicTranslationStore.save(newCategory.id, newCategory.translations);

    // Update local state
    if (editingId) {
      setCategories(categories.map(cat => cat.id === editingId ? newCategory : cat));
    } else {
      setCategories([...categories, newCategory]);
    }

    // Reset form
    resetForm();
  };

  /**
   * Delete category
   */
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await dynamicTranslationStore.delete(id);
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  /**
   * Start editing category
   */
  const handleEdit = (category: CategoryWithTranslations) => {
    setFormData({
      nameEn: category.translations.en,
      nameLt: category.translations.lt,
      icon: category.icon,
      color: category.color,
    });
    setEditingId(category.id);
    setIsCreating(true);
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setFormData({ nameEn: '', nameLt: '', icon: '📁', color: '#4DB8A8' });
    setIsCreating(false);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {t('admin.settings')} - Categories
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage forum categories with multi-language support
              </p>
            </div>
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-xl font-medium active:scale-95 transition-transform"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Create/Edit Form */}
        {isCreating && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Category' : 'New Category'}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* English Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  🇬🇧 English Name
                  <button
                    onClick={() => handleAutoTranslate('lt-to-en')}
                    disabled={!formData.nameLt || isAutoTranslating}
                    className="ml-auto text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Globe className="w-3 h-3" />
                    Auto-translate from LT
                  </button>
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g., Birds"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Lithuanian Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  🇱🇹 Lithuanian Name
                  <button
                    onClick={() => handleAutoTranslate('en-to-lt')}
                    disabled={!formData.nameEn || isAutoTranslating}
                    className="ml-auto text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Globe className="w-3 h-3" />
                    Auto-translate from EN
                  </button>
                </label>
                <input
                  type="text"
                  value={formData.nameLt}
                  onChange={(e) => setFormData({ ...formData, nameLt: e.target.value })}
                  placeholder="pvz., Paukščiai"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Icon & Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="📁"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center text-2xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-11 border border-gray-300 rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              {/* Preview */}
              {(formData.nameEn || formData.nameLt) && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Preview:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{formData.icon}</span>
                      <div>
                        <p className="text-sm font-medium" style={{ color: formData.color }}>
                          🇬🇧 {formData.nameEn || '(not set)'}
                        </p>
                        <p className="text-sm font-medium" style={{ color: formData.color }}>
                          🇱🇹 {formData.nameLt || '(not set)'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  disabled={!formData.nameEn || !formData.nameLt}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 text-white rounded-xl font-medium active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  {editingId ? 'Update Category' : 'Create Category'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium active:scale-95 transition-transform"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category List */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500 px-2">
            Existing Categories ({categories.length})
          </h3>
          
          {categories.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <p className="text-gray-500">No categories yet. Create one!</p>
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-2xl p-4 flex items-center gap-4"
              >
                {/* Icon */}
                <div className="text-3xl">{category.icon}</div>

                {/* Names */}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {getDynamicTranslation(category, currentLang)}
                  </p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-gray-500">
                      🇬🇧 {category.translations.en}
                    </span>
                    <span className="text-xs text-gray-500">
                      🇱🇹 {category.translations.lt}
                    </span>
                  </div>
                </div>

                {/* Color Badge */}
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: category.color }}
                />

                {/* Actions */}
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            How Dynamic Translations Work
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ Each category has English + Lithuanian name</li>
            <li>✅ Auto-translate helps fill both languages quickly</li>
            <li>✅ You can edit translations anytime</li>
            <li>✅ Users see correct language based on their preference</li>
            <li>✅ Changes update everywhere instantly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
