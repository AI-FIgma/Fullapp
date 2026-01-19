import { X, Clock } from 'lucide-react';
import type { EditHistoryEntry } from '../App';

interface EditHistoryModalProps {
  currentContent: string;
  currentTitle?: string;
  history: EditHistoryEntry[];
  onClose: () => void;
}

export function EditHistoryModal({ currentContent, currentTitle, history, onClose }: EditHistoryModalProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('lt-LT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#4DB8A8]" />
            <h2 className="text-lg">Redagavimo istorija</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* History entries */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Current version */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                Dabartinė versija
              </span>
            </div>
            {currentTitle && (
              <h3 className="mb-2 text-gray-900">{currentTitle}</h3>
            )}
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{currentContent}</p>
          </div>

          {/* Previous versions */}
          {history.map((entry, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Redaguota: {formatDate(entry.editedAt)}</span>
              </div>
              {entry.title && (
                <h3 className="mb-2 text-gray-900">{entry.title}</h3>
              )}
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{entry.content}</p>
            </div>
          ))}

          {/* Original version indicator */}
          {history.length > 0 && (
            <div className="text-center text-sm text-gray-400 py-2">
              <span>— Originalus įrašas —</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
