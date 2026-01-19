import { Ban, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface BannedUserNoticeProps {
  banReason: string;
  banDuration: '1d' | '7d' | '30d' | 'permanent';
  bannedAt: Date;
  expiresAt?: Date;
  hasAppeal?: boolean;
  appealStatus?: 'pending' | 'approved' | 'rejected';
}

export function BannedUserNotice({ 
  banReason, 
  banDuration, 
  bannedAt,
  expiresAt,
  hasAppeal = false,
  appealStatus
}: BannedUserNoticeProps) {
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [appealText, setAppealText] = useState('');

  const getDurationLabel = (duration: string) => {
    const labels: { [key: string]: string } = {
      '1d': '1 Day',
      '7d': '7 Days',
      '30d': '30 Days',
      'permanent': 'Permanent'
    };
    return labels[duration] || duration;
  };

  const getTimeRemaining = () => {
    if (!expiresAt || banDuration === 'permanent') return null;
    
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days !== 1 ? 's' : ''} remaining`;
    return `${hours} hour${hours !== 1 ? 's' : ''} remaining`;
  };

  const handleSubmitAppeal = () => {
    if (!appealText.trim()) {
      alert('Please provide a reason for your appeal.');
      return;
    }

    if (appealText.trim().length < 50) {
      alert('Please provide a more detailed explanation (minimum 50 characters).');
      return;
    }

    // In real app: Submit to backend
    console.log('Submitting appeal:', appealText);
    alert('✅ Your appeal has been submitted!\n\nOur moderation team will review it within 24-48 hours.\nYou will be notified of the decision.');
    
    setShowAppealForm(false);
    setAppealText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-red-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-center gap-2">
          <Ban className="w-5 h-5" />
          <h1 className="text-lg">Account Suspended</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* Ban Information */}
        <div className="bg-white border-2 border-red-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-base">Your account has been suspended</h2>
          </div>

          <div className="space-y-2 text-sm">
            <div className="p-3 bg-red-50 rounded-xl">
              <p className="text-xs text-gray-600 mb-1">Reason for suspension:</p>
              <p className="text-gray-900">{banReason}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-600 mb-1">Duration</p>
                <p className="text-gray-900">{getDurationLabel(banDuration)}</p>
              </div>
              {banDuration !== 'permanent' && expiresAt && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Time Remaining</p>
                  <p className="text-gray-900">{getTimeRemaining()}</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-600 mb-1">Suspended on</p>
              <p className="text-gray-900">{bannedAt.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* What this means */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <h3 className="text-sm font-medium mb-2">What this means</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-red-500">✕</span>
              <span>You cannot create new posts</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-500">✕</span>
              <span>You cannot comment on posts</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-500">✕</span>
              <span>You cannot send direct messages</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500">✓</span>
              <span>You can still browse content</span>
            </li>
          </ul>
        </div>

        {/* Appeal Status or Submit Appeal */}
        {hasAppeal ? (
          <div className={`border-2 rounded-2xl p-4 ${
            appealStatus === 'pending'
              ? 'bg-orange-50 border-orange-200'
              : appealStatus === 'approved'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {appealStatus === 'pending' && (
                <>
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                  <h3 className="text-sm font-medium text-orange-900">Appeal Under Review</h3>
                </>
              )}
              {appealStatus === 'approved' && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-medium text-green-900">Appeal Approved</h3>
                </>
              )}
              {appealStatus === 'rejected' && (
                <>
                  <Ban className="w-5 h-5 text-red-600" />
                  <h3 className="text-sm font-medium text-red-900">Appeal Rejected</h3>
                </>
              )}
            </div>
            <p className="text-sm text-gray-700">
              {appealStatus === 'pending' && 'Your appeal is being reviewed by our moderation team. You will be notified within 24-48 hours.'}
              {appealStatus === 'approved' && 'Your appeal has been approved! Your account will be unbanned shortly.'}
              {appealStatus === 'rejected' && 'Your appeal has been reviewed and rejected. The ban remains in effect.'}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-teal-600" />
              <h3 className="text-sm font-medium">Submit an Appeal</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              If you believe this suspension was made in error or would like to appeal, you can submit a request for review.
            </p>

            {!showAppealForm ? (
              <button
                onClick={() => setShowAppealForm(true)}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-xl hover:from-teal-500 hover:to-teal-600 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Submit Appeal
              </button>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">
                    Why should we reconsider this ban?
                  </label>
                  <textarea
                    value={appealText}
                    onChange={(e) => setAppealText(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={5}
                    placeholder="Please explain why you believe this ban should be reconsidered. Be honest and respectful. Minimum 50 characters."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {appealText.length}/50 characters minimum
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-xs text-blue-800">
                    💡 <strong>Tips for a successful appeal:</strong>
                  </p>
                  <ul className="text-xs text-blue-700 mt-2 space-y-1 ml-4">
                    <li>• Be honest and take responsibility</li>
                    <li>• Explain what you've learned</li>
                    <li>• Show that you understand the community rules</li>
                    <li>• Avoid making excuses or blaming others</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowAppealForm(false);
                      setAppealText('');
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitAppeal}
                    className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                  >
                    Submit Appeal
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Community Guidelines */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <h3 className="text-sm font-medium mb-2">Community Guidelines</h3>
          <p className="text-sm text-gray-600 mb-2">
            To avoid future suspensions, please review our community guidelines:
          </p>
          <ul className="space-y-1.5 text-sm text-gray-700">
            <li className="flex gap-2">
              <span>📜</span>
              <span>Be respectful and kind to all members</span>
            </li>
            <li className="flex gap-2">
              <span>🚫</span>
              <span>No spam, harassment, or inappropriate content</span>
            </li>
            <li className="flex gap-2">
              <span>✅</span>
              <span>Share accurate information about pet care</span>
            </li>
            <li className="flex gap-2">
              <span>🤝</span>
              <span>Help create a positive community</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
