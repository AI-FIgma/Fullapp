import { NotificationHelpers } from '../utils/notificationGenerator';
import { Bell, AlertTriangle, Shield, DollarSign, TrendingUp, Award } from 'lucide-react';

// Demo component to trigger various notification types for testing
export function NotificationDemoTriggers() {
  const triggerReportNotification = () => {
    NotificationHelpers.onNewReport(
      'post',
      'Spam/Scam Content',
      `report_${Date.now()}`,
      'post_123'
    );
  };

  const triggerUserReportNotification = () => {
    NotificationHelpers.onUserReported(
      'spammer_user',
      'user_456',
      'Multiple spam posts',
      `report_${Date.now()}`
    );
  };

  const triggerBanAppealNotification = () => {
    NotificationHelpers.onBanAppeal(
      'banned_user',
      'user_789',
      `appeal_${Date.now()}`
    );
  };

  const triggerSpamDetection = () => {
    NotificationHelpers.onSpamDetected(
      'spam_bot',
      'user_999',
      7,
      '5 minutes',
      ['post_1', 'post_2', 'post_3', 'post_4', 'post_5', 'post_6', 'post_7']
    );
  };

  const triggerCriticalReports = () => {
    NotificationHelpers.onCriticalReports(
      'post',
      'post_controversial',
      8
    );
  };

  const triggerVerificationRequest = () => {
    NotificationHelpers.onVerificationRequest(
      'dr_john_smith',
      'user_vet_123',
      'Veterinarian'
    );
  };

  const triggerBanActivity = () => {
    NotificationHelpers.onBanActivity(
      'toxic_user',
      'user_toxic_456',
      'banned',
      '7 days',
      'admin_001'
    );
  };

  const triggerKeywordTrigger = () => {
    NotificationHelpers.onKeywordTrigger(
      'prohibited_term',
      'comment',
      'comment_789'
    );
  };

  const triggerAIModeration = () => {
    NotificationHelpers.onAIModeration(
      'image',
      'post_img_123',
      'Potentially inappropriate content',
      0.87,
      'high'
    );
  };

  const triggerProfanity = () => {
    NotificationHelpers.onProfanityDetected(
      'angry_user',
      'comment',
      'comment_profane_123',
      ['word1', 'word2']
    );
  };

  const triggerAutoModeration = () => {
    NotificationHelpers.onAutoModerated(
      'post',
      'post_auto_456',
      'Profanity filter triggered'
    );
  };

  const triggerMassEdit = () => {
    NotificationHelpers.onMassEdit(
      'editor_user',
      'user_editor_789',
      12,
      '1 hour'
    );
  };

  const triggerMilestone = () => {
    NotificationHelpers.onMilestone(
      '10,000 active users',
      10000
    );
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 bg-white/95 backdrop-blur-sm border-2 border-teal-400 rounded-2xl shadow-2xl p-4 max-w-xs">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
        <Bell className="w-4 h-4 text-teal-500" />
        <h3 className="text-sm font-semibold text-gray-900">Notification Triggers</h3>
        <span className="text-xs text-gray-500 ml-auto">DEMO</span>
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {/* Reports & Moderation */}
        <div className="pb-2 border-b border-gray-100">
          <p className="text-xs text-red-600 mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Reports & Moderation
          </p>
          <div className="space-y-1">
            <button
              onClick={triggerReportNotification}
              className="w-full text-left px-2 py-1.5 text-xs bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              New Content Report
            </button>
            <button
              onClick={triggerUserReportNotification}
              className="w-full text-left px-2 py-1.5 text-xs bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              User Reported
            </button>
            <button
              onClick={triggerBanAppealNotification}
              className="w-full text-left px-2 py-1.5 text-xs bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              Ban Appeal
            </button>
            <button
              onClick={triggerSpamDetection}
              className="w-full text-left px-2 py-1.5 text-xs bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              Spam Detection
            </button>
            <button
              onClick={triggerCriticalReports}
              className="w-full text-left px-2 py-1.5 text-xs bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              Critical Reports (5+)
            </button>
          </div>
        </div>

        {/* Community Management */}
        <div className="pb-2 border-b border-gray-100">
          <p className="text-xs text-purple-600 mb-2 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Community
          </p>
          <div className="space-y-1">
            <button
              onClick={triggerVerificationRequest}
              className="w-full text-left px-2 py-1.5 text-xs bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              Verification Request
            </button>
            <button
              onClick={triggerBanActivity}
              className="w-full text-left px-2 py-1.5 text-xs bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              Ban Activity
            </button>
            <button
              onClick={triggerKeywordTrigger}
              className="w-full text-left px-2 py-1.5 text-xs bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              Keyword Trigger
            </button>
          </div>
        </div>

        {/* Content Moderation */}
        <div className="pb-2 border-b border-gray-100">
          <p className="text-xs text-orange-600 mb-2">Content Moderation</p>
          <div className="space-y-1">
            <button
              onClick={triggerAIModeration}
              className="w-full text-left px-2 py-1.5 text-xs bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              AI Moderation Flag
            </button>
            <button
              onClick={triggerProfanity}
              className="w-full text-left px-2 py-1.5 text-xs bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              Profanity Detected
            </button>
            <button
              onClick={triggerAutoModeration}
              className="w-full text-left px-2 py-1.5 text-xs bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              Auto-Moderated
            </button>
            <button
              onClick={triggerMassEdit}
              className="w-full text-left px-2 py-1.5 text-xs bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              Mass Edit Detection
            </button>
          </div>
        </div>

        {/* Analytics */}
        <div>
          <p className="text-xs text-indigo-600 mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Analytics
          </p>
          <div className="space-y-1">
            <button
              onClick={triggerMilestone}
              className="w-full text-left px-2 py-1.5 text-xs bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              Milestone Reached
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">Click buttons to test notifications</p>
      </div>
    </div>
  );
}
