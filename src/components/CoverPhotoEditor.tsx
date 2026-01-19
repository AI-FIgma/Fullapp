import { X, Camera, Sparkles, Check } from 'lucide-react';
import { useState } from 'react';

interface CoverPhotoEditorProps {
  isOpen: boolean;
  onClose: () => void;
  currentCover: CoverPhotoOption;
  onSave: (cover: CoverPhotoOption) => void;
}

export type CoverPhotoOption = {
  type: 'gradient' | 'image' | 'achievement';
  value: string; // Gradient classes or image URL
};

const gradientPresets = [
  { id: 'teal-blue', name: 'Ocean Wave', gradient: 'from-teal-400 to-blue-400', preview: 'linear-gradient(to right, #4DB8A8, #60A5FA)' },
  { id: 'purple-pink', name: 'Sunset Dream', gradient: 'from-purple-400 via-pink-400 to-orange-400', preview: 'linear-gradient(to right, #C084FC, #F472B6, #FB923C)' },
  { id: 'green-teal', name: 'Forest Path', gradient: 'from-green-400 to-teal-500', preview: 'linear-gradient(to right, #4ADE80, #14B8A6)' },
  { id: 'indigo-purple', name: 'Midnight Sky', gradient: 'from-indigo-500 to-purple-500', preview: 'linear-gradient(to right, #6366F1, #A855F7)' },
  { id: 'orange-red', name: 'Autumn Blaze', gradient: 'from-orange-400 to-red-500', preview: 'linear-gradient(to right, #FB923C, #EF4444)' },
  { id: 'cyan-blue', name: 'Arctic Ice', gradient: 'from-cyan-300 to-blue-500', preview: 'linear-gradient(to right, #67E8F9, #3B82F6)' },
];

export function CoverPhotoEditor({ isOpen, onClose, currentCover, onSave }: CoverPhotoEditorProps) {
  const [selectedCover, setSelectedCover] = useState<CoverPhotoOption>(currentCover);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedCover);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      {/* Modal */}
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-teal-500" />
            <h2 className="text-lg text-gray-900">Edit Cover Photo</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {/* Achievement-based option */}
            <button
              onClick={() => setSelectedCover({ type: 'achievement', value: '' })}
              className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                selectedCover.type === 'achievement'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">Achievement Colors</span>
                    {selectedCover.type === 'achievement' && (
                      <Check className="w-4 h-4 text-teal-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Based on your highest achievement level
                  </p>
                </div>
              </div>
            </button>

            {/* Gradient presets */}
            {gradientPresets.map(preset => (
              <button
                key={preset.id}
                onClick={() => setSelectedCover({ type: 'gradient', value: preset.gradient })}
                className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                  selectedCover.type === 'gradient' && selectedCover.value === preset.gradient
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-16 h-16 rounded-lg"
                    style={{ background: preset.preview }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900">{preset.name}</span>
                      {selectedCover.type === 'gradient' && selectedCover.value === preset.gradient && (
                        <Check className="w-4 h-4 text-teal-500" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-xl hover:from-teal-500 hover:to-teal-600 transition-all shadow-md"
          >
            Save Cover
          </button>
        </div>
      </div>
    </div>
  );
}
