interface AutoResponseTemplatesProps {
  onSelect: (template: string) => void;
  currentNote: string;
}

export function AutoResponseTemplates({ onSelect, currentNote }: AutoResponseTemplatesProps) {
  const templates = [
    { id: 'spam', label: 'Spam', text: 'This content has been removed for violating our spam policy.' },
    { id: 'harassment', label: 'Harassment', text: 'This content has been removed for harassment or bullying.' },
    { id: 'inappropriate', label: 'Inappropriate', text: 'This content has been removed as it violates our community guidelines.' },
    { id: 'misinformation', label: 'Misinformation', text: 'This content has been removed for spreading misinformation.' },
    { id: 'resolved', label: 'Resolved', text: 'Thank you for reporting. We have reviewed and resolved this issue.' },
    { id: 'warning', label: 'Warning Issued', text: 'User has been warned. Further violations may result in account suspension.' },
    { id: 'custom', label: 'Custom', text: '' },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm text-gray-700">Quick Response Templates</label>
      <div className="grid grid-cols-2 gap-2">
        {templates.map(template => (
          <button
            key={template.id}
            onClick={() => template.text && onSelect(template.text)}
            className={`px-3 py-2 text-xs rounded-xl border transition-colors text-left ${
              currentNote === template.text
                ? 'bg-teal-50 border-teal-300 text-teal-700'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
            type="button"
          >
            {template.label}
          </button>
        ))}
      </div>
    </div>
  );
}
