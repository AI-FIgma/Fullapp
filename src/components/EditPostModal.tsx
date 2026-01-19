import { useState } from 'react';
import { X, Save, FolderTree } from 'lucide-react';
import type { Post, EditHistoryEntry } from '../App';
import { currentUser, categories } from '../data/mockData';

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
  onSave: (postId: string, newTitle: string, newContent: string, newCategory?: string, newSubcategory?: string | null) => void;
}

export function EditPostModal({ post, onClose, onSave }: EditPostModalProps) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [category, setCategory] = useState(post.category);
  const [subcategory, setSubcategory] = useState(post.subcategory || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showMajorEditWarning, setShowMajorEditWarning] = useState(false);

  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'moderator';
  const hasChanges = title !== post.title || content !== post.content || category !== post.category || subcategory !== (post.subcategory || '');

  const selectedCategory = categories.find(c => c.id === category);
  const availableSubcategories = selectedCategory?.subcategories || [];

  // Calculate how much content has changed (Levenshtein distance approximation)
  const calculateChangePercentage = () => {
    const originalWords = post.content.toLowerCase().split(/\s+/);
    const newWords = content.toLowerCase().split(/\s+/);
    
    const maxLength = Math.max(originalWords.length, newWords.length);
    if (maxLength === 0) return 0;
    
    const commonWords = originalWords.filter(word => newWords.includes(word));
    const similarity = (commonWords.length / maxLength) * 100;
    return Math.round(100 - similarity);
  };

  // Check if post can be edited
  const canEdit = () => {
    const isAdmin = currentUser.role === 'admin' || currentUser.role === 'moderator';
    
    // Admins/Moderators can always edit
    if (isAdmin) return { allowed: true, reason: '' };

    // Check time limit (2 hours = 7200000ms)
    const postAge = Date.now() - post.timestamp.getTime();
    const twoHours = 2 * 60 * 60 * 1000;
    
    if (postAge > twoHours) {
      return { 
        allowed: false, 
        reason: 'Galima redaguoti tik per 2 valandas po publikavimo' 
      };
    }

    // Check if post is too popular (engagement threshold)
    const isPopular = post.pawvotes > 50 || post.commentCount > 20;
    
    if (isPopular) {
      return { 
        allowed: false, 
        reason: 'Šis įrašas per populiarus redagavimui (>50 pawvotes arba >20 komentarų). Kreipkitės į moderatorius.' 
      };
    }

    return { allowed: true, reason: '' };
  };

  const editCheck = canEdit();
  const changePercentage = calculateChangePercentage();
  const isMajorEdit = changePercentage > 50;

  const handleSave = () => {
    if (!hasChanges || !title.trim() || !content.trim()) return;
    
    // Show warning for major edits
    if (isMajorEdit && !showMajorEditWarning) {
      setShowMajorEditWarning(true);
      return;
    }

    setIsSaving(true);
    onSave(post.id, title, content, category, subcategory);
    
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 300);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg">Redaguoti įrašą</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Pavadinimas</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4DB8A8] transition-colors"
              placeholder="Įrašo pavadinimas"
              maxLength={200}
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-gray-600">Turinys</label>
              {hasChanges && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isMajorEdit 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {changePercentage}% pakeista {isMajorEdit && '⚠️'}
                </span>
              )}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4DB8A8] transition-colors min-h-[200px] resize-none"
              placeholder="Jūsų žinutė..."
            />
          </div>

          {/* Category and Subcategory - Admin/Moderator only */}
          {isAdmin && (
            <>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FolderTree className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-800 font-medium">Moderatoriaus įrankiai</span>
                </div>
                <p className="text-xs text-purple-700">
                  Galite perkelti įrašą į kitą kategoriją/subkategoriją
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Kategorija</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory(''); // Reset subcategory when category changes
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4DB8A8] transition-colors"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {availableSubcategories.length > 0 && (
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Subkategorija (pasirenkama)</label>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4DB8A8] transition-colors"
                  >
                    <option value="">Nėra subkategorijos</option>
                    {availableSubcategories.map(subcat => (
                      <option key={subcat.id} value={subcat.id}>
                        {subcat.icon} {subcat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-sm text-blue-800">
              ℹ️ Redaguotas įrašas bus pažymėtas "Redaguota" badge ir išsaugota edit history.
            </p>
          </div>

          {/* Major Edit Warning */}
          {showMajorEditWarning && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xl">⚠️</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 mb-1">Didelis turinio pakeitimas</h4>
                  <p className="text-sm text-amber-800 mb-2">
                    Jūs keičiate ~{changePercentage}% posto turinio. Tai gali būti klaidinga vartotojams, kurie jau spaudė pawvote arba komentavo originalų turinį.
                  </p>
                  <p className="text-sm text-amber-800">
                    Ar tikrai norite tęsti? Visi pakeitimai bus įrašyti į edit history.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Edit Check Warning */}
          {!editCheck.allowed && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-800">
                ⚠️ {editCheck.reason}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Atšaukti
          </button>
          <button
            onClick={handleSave}
            disabled={!editCheck.allowed || !hasChanges || !title.trim() || !content.trim() || isSaving}
            className="flex-1 px-4 py-3 bg-[#4DB8A8] text-white rounded-xl hover:bg-[#3da595] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Išsaugoma...' : showMajorEditWarning ? 'Patvirtinti redagavimą' : 'Išsaugoti'}
          </button>
        </div>
      </div>
    </div>
  );
}