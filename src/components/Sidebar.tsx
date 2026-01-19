import { MessageCircle, ChevronDown, ChevronRight } from 'lucide-react';
import type { Category } from '../App';
import { useState, useEffect } from 'react';

interface SidebarProps {
  isOpen: boolean;
  selectedCategory: string;
  selectedSubcategory: string | null;
  onSelectCategory: (categoryId: string) => void;
  onSelectSubcategory: (categoryId: string, subcategoryId: string | null) => void;
  categories: Array<{
    id: string;
    name: string;
    icon: string;
    subcategories: Array<{ id: string; name: string; description?: string; icon?: string }>;
  }>;
  onClose?: () => void; // New prop to close sidebar
}

export function Sidebar({ 
  isOpen,
  selectedCategory, 
  selectedSubcategory,
  onSelectCategory, 
  onSelectSubcategory,
  categories,
  onClose
}: SidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Auto-expand category if it's selected
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      setExpandedCategory(selectedCategory);
    }
  }, [selectedCategory, selectedSubcategory]);
  
  const handleCategoryClick = (categoryId: string) => {
    // Always expand and select category (never collapse)
    onSelectCategory(categoryId);
    onSelectSubcategory(categoryId, null); // Pass categoryId so Home doesn't use old state
    setExpandedCategory(categoryId);
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    onSelectCategory(categoryId);
    onSelectSubcategory(categoryId, subcategoryId); // Pass categoryId explicitly
  };

  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 z-40 shadow-xl overflow-y-auto pb-4">
      <div className="p-4">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-gray-700">
          <h2 className="text-white text-sm">Categories</h2>
        </div>

        {/* All Posts */}
        <button
          onClick={() => {
            onSelectCategory('all');
            onSelectSubcategory('all', null); // Pass 'all' as categoryId
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mb-2 ${
            selectedCategory === 'all' && !selectedSubcategory
              ? 'bg-teal-500 text-white shadow-lg'
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <MessageCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">All Posts</span>
        </button>

        <div className="h-px bg-gray-700 my-3" />

        {/* Categories with subcategories */}
        {categories.map((category) => {
          const isExpanded = expandedCategory === category.id;
          const isCategorySelected = selectedCategory === category.id && !selectedSubcategory;
          const isCategoryWithSubSelected = selectedCategory === category.id && selectedSubcategory;
          
          return (
            <div key={category.id} className="mb-1">
              {/* Category Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryClick(category.id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isCategorySelected
                    ? 'bg-teal-500 text-white shadow-lg'
                    : isCategoryWithSubSelected
                    ? 'bg-teal-500/60 text-white shadow-md'
                    : isExpanded
                    ? 'bg-teal-600/30 text-teal-300'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span className="text-lg flex-shrink-0">{category.icon}</span>
                <span className="text-sm flex-1 text-left">{category.name}</span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                )}
              </button>

              {/* Subcategories */}
              {isExpanded && (
                <div className="mt-1 ml-4 space-y-0.5 border-l-2 border-gray-700 pl-2">
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubcategoryClick(category.id, sub.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedSubcategory === sub.id
                          ? 'bg-teal-500/40 text-white shadow-sm'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {sub.icon && <span className="text-base">{sub.icon}</span>}
                        <span>{sub.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}