import { useState } from 'react';
import { X, AlertTriangle, Flag } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'post' | 'comment';
  contentId: string;
}

const reportReasons = [
  { id: 'spam', label: 'Spam or self-promotion', icon: '📢' },
  { id: 'harassment', label: 'Harassment or bullying', icon: '🚫' },
  { id: 'misinformation', label: 'False health/safety information', icon: '⚠️' },
  { id: 'inappropriate', label: 'Inappropriate content', icon: '🔞' },
  { id: 'copyright', label: 'Copyright violation', icon: '©️' },
  { id: 'other', label: 'Other (please specify)', icon: '💬' }
];

export function ReportModal({ isOpen, onClose, type, contentId }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedReason) return;
    
    setIsSubmitting(true);
    
    // In real app, send report to backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Auto close after 2 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedReason('');
      setAdditionalInfo('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-3xl">✓</div>
            </div>
            <h3 className="text-lg mb-2">Report Submitted</h3>
            <p className="text-sm text-gray-600">Thank you for helping keep our community safe!</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-500" />
                <h3 className="text-base">Report {type}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-140px)]">
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  False reports may result in penalties. Please report only genuine violations of community guidelines.
                </p>
              </div>

              <p className="text-sm text-gray-700 mb-4">Why are you reporting this {type}?</p>

              <div className="space-y-2 mb-4">
                {reportReasons.map((reason) => (
                  <button
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.id)}
                    className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                      selectedReason === reason.id
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{reason.icon}</span>
                      <span className="text-sm">{reason.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {selectedReason && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-2">
                    Additional information (optional)
                  </label>
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Provide any additional details that might help us review this report..."
                    className="w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                    rows={3}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedReason || isSubmitting}
                className="flex-1 px-4 py-2.5 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
