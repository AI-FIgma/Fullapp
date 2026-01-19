import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { reporterMessageTemplates } from '../utils/reportNotifications';

interface ReporterMessageTemplatesProps {
  onSelect: (message: string) => void;
  currentMessage: string;
}

export function ReporterMessageTemplates({ onSelect, currentMessage }: ReporterMessageTemplatesProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-all border border-green-200"
      >
        <span className="text-sm">{isOpen ? 'Hide' : 'Show'} templates</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="grid grid-cols-2 gap-2">
          {reporterMessageTemplates.map(template => (
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
                  ? 'bg-green-50 border-green-300 text-green-900'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <p className="text-xs">{template.label}</p>
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <p className="text-xs text-green-700 mt-2">
          💡 This message will be sent to the person who reported
        </p>
      )}
    </div>
  );
}