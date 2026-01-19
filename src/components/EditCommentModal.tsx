import { useState } from 'react';
import { X, Save } from 'lucide-react';

interface EditCommentModalProps {
  commentId: string;
  currentContent: string;
  onClose: () => void;
  onSave: (newContent: string) => void;
}

export function EditCommentModal({ commentId, currentContent, onClose, onSave }: EditCommentModalProps) {
  const [content, setContent] = useState(currentContent);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = content !== currentContent;

  const handleSave = () => {
    if (!hasChanges || !content.trim()) return;

    setIsSaving(true);
    onSave(content);
    
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg">Redaguoti komentarą</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Content */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Turinys</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4DB8A8] transition-colors min-h-[150px] resize-none"
              placeholder="Jūsų komentaras..."
            />
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-sm text-blue-800">
              ℹ️ Redaguotas komentaras bus pažymėtas "Redaguota" badge ir išsaugota edit history.
            </p>
          </div>
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
            disabled={!hasChanges || !content.trim() || isSaving}
            className="flex-1 px-4 py-3 bg-[#4DB8A8] text-white rounded-xl hover:bg-[#3da595] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Išsaugoma...' : 'Išsaugoti'}
          </button>
        </div>
      </div>
    </div>
  );
}