import { useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

// Mock data - in real app this would come from database/API
const defaultBlacklist = [
  'fuck',
  'shit',
  'damn',
  'bitch',
  'ass',
  'hell',
  'crap',
  'piss',
  'cock',
  'dick',
  'pussy',
  'bastard',
  'slut',
  'whore',
  'fag',
  'nigger',
  'retard'
];

export function KeywordBlacklist() {
  const [keywords, setKeywords] = useState<string[]>(defaultBlacklist);
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim().toLowerCase();
    if (!trimmed) return;
    
    if (keywords.includes(trimmed)) {
      alert('This keyword is already in the blacklist!');
      return;
    }

    setKeywords([...keywords, trimmed]);
    setNewKeyword('');
    alert(`Added "${trimmed}" to blacklist`);
  };

  const handleRemoveKeyword = (keyword: string) => {
    if (confirm(`Remove "${keyword}" from blacklist?`)) {
      setKeywords(keywords.filter(k => k !== keyword));
      alert(`Removed "${keyword}" from blacklist`);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <h3 className="text-lg">Keyword Blacklist Management</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Add or remove words that will be automatically flagged by the content moderation system.
        Posts containing these words will be blocked and sent to the moderation queue.
      </p>

      {/* Add new keyword */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddKeyword();
            }
          }}
          placeholder="Add new keyword..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4DB8A8] transition-colors"
        />
        <button
          onClick={handleAddKeyword}
          disabled={!newKeyword.trim()}
          className="px-4 py-2 bg-[#4DB8A8] text-white rounded-xl hover:bg-[#3da595] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Keywords list */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {keywords.map((keyword) => (
          <div
            key={keyword}
            className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <span className="text-sm text-gray-700 font-mono">{keyword}</span>
            <button
              onClick={() => handleRemoveKeyword(keyword)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove keyword"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Total keywords: <span className="font-semibold">{keywords.length}</span>
        </p>
      </div>
    </div>
  );
}
