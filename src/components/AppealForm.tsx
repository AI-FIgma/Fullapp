import { useState } from 'react';
import { X, AlertCircle, Send } from 'lucide-react';
import { submitAppeal, BlockedContent } from '../utils/moderationQueue';

interface AppealFormProps {
  blockedContent: BlockedContent;
  onClose: () => void;
  onSubmit: () => void;
}

export function AppealForm({ blockedContent, onClose, onSubmit }: AppealFormProps) {
  const [appealReason, setAppealReason] = useState('');
  const [selectedReason, setSelectedReason] = useState<string>('');
  
  // Prevent appeals for comments - only posts can be appealed
  if (blockedContent.type !== 'post') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
        <div className="bg-white w-full rounded-t-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base">Cannot Appeal</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-900 mb-1">Comments Cannot Be Appealed</p>
                <p className="text-xs text-red-700">
                  Only blocked posts can be appealed. Blocked comments cannot be reviewed through the appeal system.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full mt-4 px-4 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  
  const predefinedReasons = [
    'My content does not violate community guidelines',
    'This was taken out of context',
    'The AI made a mistake - no inappropriate content',
    'False positive - my content is appropriate',
    'Other (explain below)'
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appealReason.trim() && !selectedReason) {
      alert('Please provide a reason for your appeal');
      return;
    }
    
    const fullReason = selectedReason === 'Other (explain below)' 
      ? appealReason 
      : `${selectedReason}${appealReason ? ` - ${appealReason}` : ''}`;
    
    const success = submitAppeal(blockedContent.id, fullReason);
    
    if (success) {
      alert('✅ Your appeal has been submitted. A moderator will review it within 24 hours.');
      onSubmit();
      onClose();
    } else {
      alert('❌ Failed to submit appeal. Please try again.');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base">Appeal Blocked Content</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Info Notice */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 mb-1">Appeal Process</p>
                <p className="text-xs text-blue-700">
                  Your appeal will be reviewed by a human moderator within 24 hours. If approved, your content will be published immediately.
                </p>
              </div>
            </div>
          </div>
          
          {/* Blocked Content Summary */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-xs text-red-600 mb-1">Blocked Content:</p>
            {blockedContent.title && (
              <p className="text-sm mb-1">{blockedContent.title}</p>
            )}
            <p className="text-sm text-gray-700 line-clamp-3">{blockedContent.content}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                {blockedContent.blockReason.replace('-', ' ')}
              </span>
              <span className="text-xs text-red-600">
                Blocked: {new Date(blockedContent.blockedAt).toLocaleString()}
              </span>
            </div>
          </div>
          
          {/* Reason Selection */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Why do you believe this was blocked incorrectly?
            </label>
            <div className="space-y-2">
              {predefinedReasons.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                    selectedReason === reason
                      ? 'bg-teal-50 border-teal-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mt-0.5 w-4 h-4 text-teal-500 focus:ring-2 focus:ring-teal-400"
                  />
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Additional Details */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Additional Details {selectedReason === 'Other (explain below)' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={appealReason}
              onChange={(e) => setAppealReason(e.target.value)}
              placeholder="Provide any additional context that would help us review your appeal..."
              rows={4}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Be specific and respectful. Appeals with clear explanations are reviewed faster.
            </p>
          </div>
          
          {/* Guidelines Reminder */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-600 mb-2">Remember our guidelines:</p>
            <ul className="text-xs text-gray-500 space-y-0.5">
              <li>• No profanity or offensive language</li>
              <li>• No hate speech or discrimination</li>
              <li>• No spam or self-promotion</li>
              <li>• No inappropriate images or videos</li>
            </ul>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedReason || (selectedReason === 'Other (explain below)' && !appealReason.trim())}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-2xl hover:from-teal-500 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Send className="w-5 h-5" />
            Submit Appeal
          </button>
          
          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}