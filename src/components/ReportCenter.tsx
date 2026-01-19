import { ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle, Trash2, AlertCircle, MessageSquare, FileText, Clock, Filter, UserX, RotateCcw, Unlock, Send } from 'lucide-react';
import { useState } from 'react';
import { ForumHeader } from './ForumHeader';
import { mockReports, currentUser, mockPosts, mockComments } from '../data/mockData';
import { addToModerationQueue } from '../utils/moderationQueue';
import { ReporterMessageTemplates } from './ReporterMessageTemplates';
import { sendReportNotifications } from '../utils/reportNotifications';
import type { Report } from '../App';

/**
 * ReportCenter Component
 * 
 * Central hub for moderators and admins to review user reports.
 * Features:
 * - Filtering reports by status (pending, resolved, dismissed)
 * - Detailed view of report with context (reporter, target content)
 * - Actions: Dismiss, Warn User, Delete Content, Block User
 * - Communication: Send template messages to reporters
 * - Internal notes for team collaboration
 */

interface ReportCenterProps {
  onBack: () => void;
  unreadNotifications: number;
  onNavigate: (view: 'notifications' | 'saved' | 'settings') => void;
  onViewPost: (postId: string) => void;
}

type StatusFilter = 'all' | 'pending' | 'resolved' | 'dismissed';

export function ReportCenter({ onBack, unreadNotifications, onNavigate, onViewPost }: ReportCenterProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [moderatorNote, setModeratorNote] = useState(''); // Internal note
  const [messageToReporter, setMessageToReporter] = useState(''); // Message to reporter
  const [markAsVerified, setMarkAsVerified] = useState(false); // Checkbox state for content verification

  // Check if current user has mod/admin access
  const hasAccess = currentUser.role === 'admin' || currentUser.role === 'moderator';

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-3">
            <button onClick={onBack} className="text-gray-600 hover:text-teal-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg">Access Denied</h1>
            <div className="w-5" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Shield className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl mb-2">Access Restricted</h2>
          <p className="text-sm text-gray-600">This page is only accessible to moderators and administrators.</p>
        </div>
      </div>
    );
  }

  // Filter reports by status
  const filteredReports = mockReports.filter(report => {
    if (statusFilter === 'all') return true;
    return report.status === statusFilter;
  });

  // Count reports by status
  const pendingCount = mockReports.filter(r => r.status === 'pending').length;
  const resolvedCount = mockReports.filter(r => r.status === 'resolved').length;
  const dismissedCount = mockReports.filter(r => r.status === 'dismissed').length;

  // Time ago helper
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Get reason label
  const getReasonLabel = (reason: Report['reason']) => {
    const labels = {
      spam: 'Spam',
      harassment: 'Harassment',
      inappropriate: 'Inappropriate Content',
      misinformation: 'Misinformation',
      other: 'Other'
    };
    return labels[reason];
  };

  // Get reason color
  const getReasonColor = (reason: Report['reason']) => {
    const colors = {
      spam: 'text-orange-600 bg-orange-50 border-orange-200',
      harassment: 'text-red-600 bg-red-50 border-red-200',
      inappropriate: 'text-purple-600 bg-purple-50 border-purple-200',
      misinformation: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      other: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[reason];
  };

  // Handle report actions
  const handleResolve = (report: Report) => {
    // In real app: API call to update report status
    // console.log('Resolving report:', report.id, 'Note:', moderatorNote);
    alert(`Report marked as resolved${moderatorNote ? ' with note: ' + moderatorNote : ''}`);
    setSelectedReport(null);
    setModeratorNote('');
  };

  const handleDismiss = (report: Report) => {
    if (!confirm('Are you sure you want to dismiss this report?')) return;
    
    // Determine action type
    const actionTaken = markAsVerified ? 'verified' : 'dismissed';
    
    // Send notifications to reporter (and NOT to reported user for dismissals)
    sendReportNotifications({
      report,
      actionTaken,
      moderator: currentUser,
      messageToReporter: messageToReporter || undefined,
      messageToReportedUser: undefined // Never send to reported user for dismiss/verify
    });
    
    if (markAsVerified) {
      alert(`✅ Report dismissed\n\n✅ Content marked as VERIFIED\n\nFuture reports about this content will be tracked silently. You'll see a counter in the report list if more reports arrive.${moderatorNote ? '\n\nInternal note saved: ' + moderatorNote : ''}\n\n📬 Reporter notified of decision`);
    } else {
      alert(`Report dismissed${moderatorNote ? '\n\nInternal note: ' + moderatorNote : ''}\n\n📬 Reporter notified of decision`);
    }
    
    setSelectedReport(null);
    setModeratorNote('');
    setMessageToReporter('');
    setMarkAsVerified(false);
  };

  const handleDeleteContent = (report: Report) => {
    // Calculate warning count
    const currentWarnings = report.targetAuthor.warningCount || 0;
    const newWarningCount = currentWarnings + 1;
    const willBeBlocked = newWarningCount >= 3;

    const confirmMessage = willBeBlocked
      ? `⚠️ DELETE CONTENT & FINAL WARNING for ${report.targetAuthor.username}!\n\nThis will:\n• Delete the ${report.type}\n• Issue WARNING #${newWarningCount}\n• AUTOMATICALLY BLOCK the user (3 warnings reached)\n\nProceed?`
      : `Delete this ${report.type} and warn ${report.targetAuthor.username}?\n\nThis will:\n• Delete the ${report.type}\n• Issue WARNING #${newWarningCount}/3\n${newWarningCount === 2 ? '• Next warning will result in automatic block' : ''}\n\nProceed?`;

    if (!confirm(confirmMessage)) return;

    // Determine action type
    const actionTaken = willBeBlocked ? 'user_blocked' : 'user_warned';
    
    // Send notifications with SEPARATE messages
    sendReportNotifications({
      report,
      actionTaken,
      moderator: currentUser,
      messageToReporter: messageToReporter || undefined,
      messageToReportedUser: undefined // Never send to reported user for dismiss/verify
    });

    // Log warning and content deletion
    
    // Only posts can be appealed - add to moderation queue (but not if auto-blocked)
    if (report.type === 'post' && !willBeBlocked) {
      // Add to moderation queue so user can appeal
      addToModerationQueue({
        type: 'post',
        userId: report.targetAuthor.id,
        username: report.targetAuthor.username,
        userAvatar: report.targetAuthor.avatar,
        title: `Reported: ${getReasonLabel(report.reason)}`,
        content: report.targetContent,
        category: 'general',
        blockReason: report.reason === 'spam' ? 'spam' : 
                     report.reason === 'harassment' ? 'hate-speech' :
                     report.reason === 'inappropriate' ? 'inappropriate-content' : 
                     'profanity',
        severity: report.reason === 'harassment' ? 'high' : 'medium'
      });
    }

    // If blocked due to 3 warnings, delete all user content
    if (willBeBlocked) {
      // Delete all posts by this user
      const userPosts = mockPosts.filter(post => post.author.id === report.targetAuthor.id);
      userPosts.forEach(post => {
        post.isDeleted = true;
      });
      
      // Delete all comments by this user
      const userComments = mockComments.filter(comment => comment.author.id === report.targetAuthor.id);
      userComments.forEach(comment => {
        comment.isDeleted = true;
      });

      alert(`⚠️ WARNING #${newWarningCount} issued to ${report.targetAuthor.username}\n\n🚫 User AUTOMATICALLY BLOCKED (3 warnings reached)\n✅ ${report.type.toUpperCase()} deleted\n\n📊 All user content deleted:\n  • ${userPosts.length} post(s)\n  • ${userComments.length} comment(s)\n\n📬 Notifications sent to:\n  • Reporter${messageToReporter ? ' (custom message)' : ''}\n  • ${report.targetAuthor.username} (with ban appeal option)`);
    } else if (report.type === 'post') {
      alert(`⚠️ WARNING #${newWarningCount}/3 issued to ${report.targetAuthor.username}\n\n✅ Post deleted and added to moderation queue\n📝 User can appeal this decision\n${newWarningCount === 2 ? '\n⚠️ Next warning will result in automatic block!' : ''}\n\n📬 Notifications sent to:\n  • Reporter${messageToReporter ? ' (custom message)' : ''}\n  • ${report.targetAuthor.username} (with appeal option)`);
    } else {
      alert(`⚠️ WARNING #${newWarningCount}/3 issued to ${report.targetAuthor.username}\n\n✅ Comment deleted (cannot be appealed)\n${newWarningCount === 2 ? '\n⚠️ Next warning will result in automatic block!' : ''}\n\n📬 Notifications sent to:\n  • Reporter${messageToReporter ? ' (custom message)' : ''}\n  • ${report.targetAuthor.username}`);
    }
    
    setSelectedReport(null);
    setModeratorNote('');
    setMessageToReporter('');
  };

  const handleBlockUser = (report: Report) => {
    // Both moderators and admins can block
    if (currentUser.role !== 'admin' && currentUser.role !== 'moderator') return;
    
    if (!confirm(`🚫 PERMANENT BAN\n\nThis will permanently ban user "${report.targetAuthor.username}" and delete all their content.\n\n⚠️ Only admins can unban users.\n\nContinue?`)) return;
    
    // Mark report as resolved
    report.status = 'resolved';
    report.resolvedBy = currentUser;
    report.resolvedAt = new Date();
    report.moderatorNote = moderatorNote || 'User permanently banned for policy violations';
    
    // Send notifications
    sendReportNotifications({
      report,
      action: 'blocked',
      messageToReporter,
      moderatorName: currentUser.username
    });
    
    // Block user
    
    // Delete all posts by this user
    const userPosts = mockPosts.filter(post => post.author.id === report.targetAuthor.id);
    userPosts.forEach(post => {
      post.isDeleted = true;
    });
    
    // Delete all comments by this user
    const userComments = mockComments.filter(comment => comment.author.id === report.targetAuthor.id);
    userComments.forEach(comment => {
      comment.isDeleted = true;
    });
    
    alert(`🚫 PERMANENT BAN APPLIED\n\nUser: ${report.targetAuthor.username}\nBanned by: ${currentUser.username} (${currentUser.role})\n\n✅ ${userPosts.length} post(s) deleted\n✅ ${userComments.length} comment(s) deleted\n\n⚠️ Only admins can unban this user\n\n📬 Notifications sent to:\n  • Reporter${messageToReporter ? ' (custom message)' : ''}\n  • ${report.targetAuthor.username} (with ban appeal option)`);
    setSelectedReport(null);
    setModeratorNote('');
    setMessageToReporter('');
  };

  // Admin-only functions
  const handleUnblockUser = (userId: string, username: string) => {
    if (currentUser.role !== 'admin') return;
    if (!confirm(`Unblock user ${username}?`)) return;
    console.log('Unblocking user:', userId);
    alert(`User ${username} has been unblocked`);
  };

  const handleResetWarnings = (userId: string, username: string) => {
    if (currentUser.role !== 'admin') return;
    if (!confirm(`Reset all warnings for ${username}?`)) return;
    console.log('Resetting warnings for user:', userId);
    alert(`All warnings reset for ${username}`);
  };

  // Render report detail modal
  const renderReportDetail = () => {
    if (!selectedReport) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl">
            <h3 className="text-lg">Report Details</h3>
            <button onClick={() => setSelectedReport(null)} className="text-gray-500 hover:text-gray-700">
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Report Info */}
            <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Report Type</span>
                <span className={`px-2.5 py-1 rounded-full text-xs border ${
                  selectedReport.type === 'post' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-green-50 text-green-600 border-green-200'
                }`}>
                  {selectedReport.type === 'post' ? <FileText className="w-3 h-3 inline mr-1" /> : <MessageSquare className="w-3 h-3 inline mr-1" />}
                  {selectedReport.type}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Reason</span>
                <span className={`px-2.5 py-1 rounded-full text-xs border ${getReasonColor(selectedReport.reason)}`}>
                  {getReasonLabel(selectedReport.reason)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Status</span>
                <span className={`px-2.5 py-1 rounded-full text-xs border ${
                  selectedReport.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  selectedReport.status === 'resolved' ? 'bg-green-50 text-green-600 border-green-200' :
                  'bg-gray-100 text-gray-600 border-gray-200'
                }`}>
                  {selectedReport.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Reported</span>
                <span className="text-sm">{getTimeAgo(selectedReport.timestamp)}</span>
              </div>
            </div>

            {/* Reporter Info */}
            <div>
              <h4 className="text-sm mb-2">Reported By</h4>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                <img src={selectedReport.reporter.avatar} alt={selectedReport.reporter.username} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm">{selectedReport.reporter.username}</p>
                  <p className="text-xs text-gray-500">{selectedReport.reporter.role}</p>
                </div>
              </div>
              {selectedReport.customReason && (
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-xs text-amber-900"><span className="opacity-70">Reason:</span> {selectedReport.customReason}</p>
                </div>
              )}
            </div>

            {/* Reported Content */}
            <div>
              <h4 className="text-sm mb-2">Reported Content</h4>
              <div 
                onClick={() => {
                  setSelectedReport(null);
                  if (selectedReport.type === 'post') {
                    onViewPost(selectedReport.targetId);
                  } else if (selectedReport.type === 'comment' && selectedReport.postId) {
                    onViewPost(selectedReport.postId);
                  }
                }}
                className="p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img src={selectedReport.targetAuthor.avatar} alt={selectedReport.targetAuthor.username} className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm">{selectedReport.targetAuthor.username}</p>
                    <p className="text-xs text-gray-500">{selectedReport.targetAuthor.role}</p>
                  </div>
                  {/* Warning Count Badge */}
                  {selectedReport.targetAuthor.warningCount !== undefined && selectedReport.targetAuthor.warningCount > 0 && (
                    <div className={`px-2.5 py-1 rounded-full text-xs border ${
                      selectedReport.targetAuthor.warningCount >= 2 
                        ? 'bg-red-50 text-red-700 border-red-300' 
                        : 'bg-orange-50 text-orange-700 border-orange-300'
                    }`}>
                      ⚠️ {selectedReport.targetAuthor.warningCount} warning{selectedReport.targetAuthor.warningCount > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-700 border-t border-gray-200 pt-2 mt-2">{selectedReport.targetContent}</p>
              </div>
              
              {/* Warning Alert */}
              {selectedReport.targetAuthor.warningCount !== undefined && selectedReport.targetAuthor.warningCount >= 2 && (
                <div className="mt-2 p-3 bg-red-50 border border-red-300 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-red-900">
                        <strong>High Risk User:</strong> This user has {selectedReport.targetAuthor.warningCount} previous warnings.
                        {selectedReport.targetAuthor.warningCount === 2 && ' One more warning will result in automatic account block.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin-Only User Management (shown for all statuses) */}
              {currentUser.role === 'admin' && (
                <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-900">Admin Tools</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {/* Unblock User (only if blocked) */}
                    {selectedReport.targetAuthor.isBlocked && (
                      <button
                        onClick={() => handleUnblockUser(selectedReport.targetAuthor.id, selectedReport.targetAuthor.username)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        Unblock User
                      </button>
                    )}
                    
                    {/* Reset Warnings (only if has warnings) */}
                    {(selectedReport.targetAuthor.warningCount || 0) > 0 && (
                      <button
                        onClick={() => handleResetWarnings(selectedReport.targetAuthor.id, selectedReport.targetAuthor.username)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-yellow-500 text-white text-xs rounded-lg hover:bg-yellow-600 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Warnings
                      </button>
                    )}
                  </div>
                  
                  <p className="text-[10px] text-purple-700 mt-1">
                    ⚠️ Admin-only actions • Use with caution
                  </p>
                </div>
              )}
            </div>

            {/* Previous Resolution Info */}
            {selectedReport.status !== 'pending' && selectedReport.resolvedBy && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-900">Resolved by {selectedReport.resolvedBy.username}</span>
                </div>
                {selectedReport.moderatorNote && (
                  <p className="text-xs text-blue-800 mt-2">Note: {selectedReport.moderatorNote}</p>
                )}
                {selectedReport.resolvedAt && (
                  <p className="text-xs text-blue-600 mt-1">{getTimeAgo(selectedReport.resolvedAt)}</p>
                )}
                
                {/* Verified Status */}
                {selectedReport.isContentVerified && selectedReport.verifiedBy && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-teal-600" />
                      <span className="text-sm text-teal-900">✅ Content verified by {selectedReport.verifiedBy.username}</span>
                    </div>
                    {selectedReport.verifiedAt && (
                      <p className="text-xs text-teal-600">{getTimeAgo(selectedReport.verifiedAt)}</p>
                    )}
                    {selectedReport.newReportsAfterVerification !== undefined && selectedReport.newReportsAfterVerification > 0 && (
                      <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-xs text-orange-900">
                          ⚠️ <strong>{selectedReport.newReportsAfterVerification} new report{selectedReport.newReportsAfterVerification > 1 ? 's' : ''}</strong> received after verification. 
                          Consider reviewing again if the number is high.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Moderator Note Input (only for pending) */}
            {selectedReport.status === 'pending' && (
              <div className="space-y-3">
                {/* Internal Moderator Note */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Internal Moderator Note</span>
                  </div>
                  
                  <div>
                    <label className="text-sm mb-2 block text-gray-700">Private Note (optional)</label>
                    <textarea
                      value={moderatorNote}
                      onChange={(e) => setModeratorNote(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                      rows={2}
                      placeholder="Add an internal note (only visible to moderators)..."
                    />
                    <p className="text-xs text-gray-500 mt-1">🔒 This note is only visible to moderators and admins</p>
                  </div>
                </div>

                {/* Public Message to Users */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-900">Message to Reporter</span>
                  </div>

                  {/* Public Message Templates */}
                  <ReporterMessageTemplates 
                    onSelect={(template) => setMessageToReporter(template)}
                    currentMessage={messageToReporter}
                  />
                  
                  <div className="mt-3">
                    <label className="text-sm mb-2 block text-green-900">Message to Reporter (optional)</label>
                    <textarea
                      value={messageToReporter}
                      onChange={(e) => setMessageToReporter(e.target.value)}
                      className="w-full p-3 border border-green-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                      rows={2}
                      placeholder="Add a message that will be sent to the reporter..."
                    />
                    <p className="text-xs text-green-700 mt-1">
                      📬 Will be sent to: <strong>Reporter</strong> (always)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons (only for pending) */}
            {selectedReport.status === 'pending' && (
              <div className="space-y-2 pt-2">
                {/* Mark as Verified Checkbox */}
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={markAsVerified}
                      onChange={(e) => setMarkAsVerified(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-teal-900 mb-1">✅ Mark content as verified</p>
                      <p className="text-xs text-teal-700 leading-relaxed">
                        Future reports about this content will be tracked but won't create new notifications. You'll see a counter if more reports arrive.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Dismiss - False Report */}
                <button
                  onClick={() => handleDismiss(selectedReport)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Dismiss Report</span>
                </button>

                {/* Action Grid - All resolve automatically */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDeleteContent(selectedReport)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">Delete & Warn</span>
                  </button>

                  <button
                    onClick={() => handleBlockUser(selectedReport)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-700 text-white rounded-xl hover:bg-red-800 transition-colors"
                  >
                    <UserX className="w-4 h-4" />
                    <span className="text-sm">Block User</span>
                  </button>
                </div>

                {/* Info text */}
                <p className="text-xs text-gray-500 text-center pt-2">
                  ⚠️ <strong>Delete & Warn:</strong> Issues warning + deletes content. <strong>Block User:</strong> Permanent ban (only admins can unban). Both actions mark report as <strong>resolved</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-gray-600 hover:text-teal-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base">Report Center</h2>
              <p className="text-xs text-gray-500">{pendingCount} pending</p>
            </div>
          </div>
          <ForumHeader
            unreadNotifications={unreadNotifications}
            onOpenNotifications={() => onNavigate('notifications')}
            onOpenSaved={() => onNavigate('saved')}
            onOpenSettings={() => onNavigate('settings')}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-3 gap-3">
        <div className="p-3 bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-xs text-yellow-700">Pending</span>
          </div>
          <p className="text-2xl text-yellow-900">{pendingCount}</p>
        </div>

        <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-700">Resolved</span>
          </div>
          <p className="text-2xl text-green-900">{resolvedCount}</p>
        </div>

        <div className="p-3 bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-700">Dismissed</span>
          </div>
          <p className="text-2xl text-gray-900">{dismissedCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl p-1 flex gap-1 shadow-sm border border-gray-100">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
              statusFilter === 'pending'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
              statusFilter === 'resolved'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
          <button
            onClick={() => setStatusFilter('dismissed')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
              statusFilter === 'dismissed'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Dismissed ({dismissedCount})
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="px-4 space-y-3">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No {statusFilter === 'all' ? '' : statusFilter} reports</p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="p-4 bg-white border border-gray-100 rounded-2xl hover:border-teal-200 transition-all cursor-pointer active:scale-[0.98]"
            >
              {/* Report Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${getReasonColor(report.reason)}`}>
                      {getReasonLabel(report.reason)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      report.type === 'post' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {report.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{getTimeAgo(report.timestamp)}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs border ${
                  report.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  report.status === 'resolved' ? 'bg-green-50 text-green-600 border-green-200' :
                  'bg-gray-100 text-gray-600 border-gray-200'
                }`}>
                  {report.status}
                </span>
              </div>

              {/* Content Preview */}
              <p className="text-sm text-gray-700 mb-3 line-clamp-2">{report.targetContent}</p>

              {/* Verified Content Badge (if verified) */}
              {report.isContentVerified && (
                <div className="mb-3 p-2 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                  <div className="flex-1">
                    <p className="text-xs text-teal-900">
                      ✅ Content verified by {report.verifiedBy?.username}
                    </p>
                  </div>
                  {report.newReportsAfterVerification !== undefined && report.newReportsAfterVerification > 0 && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs border border-orange-300">
                      +{report.newReportsAfterVerification} new
                    </span>
                  )}
                </div>
              )}

              {/* Reporter & Author */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img src={report.reporter.avatar} alt={report.reporter.username} className="w-6 h-6 rounded-full" />
                  <span className="text-gray-600">reported</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">by</span>
                  <img src={report.targetAuthor.avatar} alt={report.targetAuthor.username} className="w-6 h-6 rounded-full" />
                  <span className="text-gray-900">{report.targetAuthor.username}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Detail Modal */}
      {renderReportDetail()}
    </div>
  );
}