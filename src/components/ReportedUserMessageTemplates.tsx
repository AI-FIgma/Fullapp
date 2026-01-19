import { AlertTriangle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { reportedUserMessageTemplates } from '../utils/reportNotifications';

interface ReportedUserMessageTemplatesProps {
  onSelect: (message: string) => void;
  currentMessage: string;
  actionType: 'content_removed' | 'user_warned' | 'user_blocked' | null;
}

export function ReportedUserMessageTemplates({ onSelect, currentMessage, actionType }: ReportedUserMessageTemplatesProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Don't show for dismiss/verify actions
  if (!actionType) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm flex items-center gap-2 text-orange-900">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <span>Reported User Message Templates</span>
        </label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700"
        >
          {isOpen ? 'Hide' : 'Show'} templates
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="grid grid-cols-2 gap-2">
          {reportedUserMessageTemplates.map(template => (
            <button
              key={template.id}
              type="button"
              onClick={() => {
                if (template.message) {
                  onSelect(template.message);
                }
                setIsOpen(false);
              }}
              className={`p-2 text-left rounded-lg border transition-all ${
                currentMessage === template.message
                  ? 'bg-orange-50 border-orange-300 text-orange-900'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <p className="text-xs">{template.label}</p>
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <p className="text-xs text-orange-700 mt-2">
          ⚠️ This message will be sent to the person whose content was reported
        </p>
      )}
    </div>
  );
}
