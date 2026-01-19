import { X, Globe, Layout, ListTree } from 'lucide-react';
import type { Post } from '../App';
import { categories } from '../data/mockData';

interface PinPostDialogProps {
  post: Post | null;
  onClose: () => void;
  onPin: (postId: string, pinLevel: 'global' | 'category' | 'subcategory') => void;
}

export function PinPostDialog({ post, onClose, onPin }: PinPostDialogProps) {
  if (!post) return null;

  // Find category and subcategory names for display
  const category = categories.find(c => c.id === post.category);
  const subcategory = category?.subcategories.find(s => s.id === post.subcategory);

  const handlePin = (pinLevel: 'global' | 'category' | 'subcategory') => {
    onPin(post.id, pinLevel);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Pin Post</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <p className="text-sm text-gray-600 mb-2">
            Select where you want to pin <span className="font-medium text-gray-900">"{post.title}"</span>:
          </p>

          {/* Global Pin */}
          <button
            onClick={() => handlePin('global')}
            className={`w-full p-4 text-left border rounded-xl transition-all group relative flex items-start gap-4 ${
              post.pinLevel === 'global' || post.isGlobalPin
                ? 'border-teal-500 bg-teal-50/50 ring-1 ring-teal-500'
                : 'border-gray-200 hover:border-teal-500 hover:bg-teal-50'
            }`}
          >
            <div className={`p-2 rounded-lg ${post.pinLevel === 'global' ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-500 group-hover:bg-teal-100 group-hover:text-teal-600'}`}>
              <Globe className="size-5" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Pin Globally</div>
              <div className="text-xs text-gray-500 mt-1">
                Visible at the top of Home and all categories.
              </div>
            </div>
          </button>

          {/* Category Pin */}
          <button
            onClick={() => handlePin('category')}
            className={`w-full p-4 text-left border rounded-xl transition-all group relative flex items-start gap-4 ${
              post.pinLevel === 'category'
                ? 'border-teal-500 bg-teal-50/50 ring-1 ring-teal-500'
                : 'border-gray-200 hover:border-teal-500 hover:bg-teal-50'
            }`}
          >
             <div className={`p-2 rounded-lg ${post.pinLevel === 'category' ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-500 group-hover:bg-teal-100 group-hover:text-teal-600'}`}>
              <Layout className="size-5" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Pin to {category?.name || 'Category'}</div>
              <div className="text-xs text-gray-500 mt-1">
                Visible at the top of the <span className="font-medium">{category?.name}</span> category.
              </div>
            </div>
          </button>

          {/* Subcategory Pin (Only if post has subcategory) */}
          {post.subcategory && (
            <button
              onClick={() => handlePin('subcategory')}
              className={`w-full p-4 text-left border rounded-xl transition-all group relative flex items-start gap-4 ${
                post.pinLevel === 'subcategory'
                  ? 'border-teal-500 bg-teal-50/50 ring-1 ring-teal-500'
                  : 'border-gray-200 hover:border-teal-500 hover:bg-teal-50'
              }`}
            >
               <div className={`p-2 rounded-lg ${post.pinLevel === 'subcategory' ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-500 group-hover:bg-teal-100 group-hover:text-teal-600'}`}>
                <ListTree className="size-5" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Pin to {subcategory?.name || 'Subcategory'}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Visible at the top of the <span className="font-medium">{subcategory?.name}</span> subcategory.
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}