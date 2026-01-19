import { X, Shield, AlertTriangle, CheckCircle, XCircle, Clock, MessageSquare, FileText, Eye, ChevronDown, ChevronUp, AlertOctagon, TrendingUp, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { ForumHeader } from './ForumHeader';
import type { BlockedContent } from '../utils/moderationQueue';
import { 
  getPendingModerations, 
  getAppealedModerations, 
  getModerationHistory,
  getModerationStats,
  approveContent,
  rejectContent,
  reviewAppeal
} from '../utils/moderationQueue';

interface ModerationQueueProps {
  onClose: () => void;
  unreadNotifications?: number;
  onNavigate?: (view: 'notifications' | 'saved' | 'settings') => void;
}

export function ModerationQueue({ onClose, unreadNotifications = 0, onNavigate }: ModerationQueueProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'appeals' | 'history' | 'stats'>('pending');
  const [selectedItem, setSelectedItem] = useState<BlockedContent | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [infoBannerExpanded, setInfoBannerExpanded] = useState(false);
  
  const pendingItems = getPendingModerations();
  const appealedItems = getAppealedModerations();
  const historyItems = getModerationHistory();
  const stats = getModerationStats();
  
  const handleApprove = (id: string) => {
    const success = approveContent(id, reviewNotes);
    if (success) {
      alert('✅ Content approved and published');
      setSelectedItem(null);
      setReviewNotes('');
    }
  };
  
  const handleReject = (id: string) => {
    const success = rejectContent(id, reviewNotes);
    if (success) {
      alert('🚫 Content rejected');
      setSelectedItem(null);
      setReviewNotes('');
    }
  };
  
  const handleAppealApprove = (id: string) => {
    const success = reviewAppeal(id, true, reviewNotes);
    if (success) {
      alert('✅ Appeal approved - content published');
      setSelectedItem(null);
      setReviewNotes('');
    }
  };
  
  const handleAppealReject = (id: string) => {
    const success = reviewAppeal(id, false, reviewNotes);
    if (success) {
      alert('🚫 Appeal rejected');
      setSelectedItem(null);
      setReviewNotes('');
    }
  };
  
  const getReasonBadge = (reason: string) => {
    const badges = {
      'profanity': { color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Profanity' },
      'hate-speech': { color: 'bg-red-100 text-red-700 border-red-200', label: 'Hate Speech' },
      'spam': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Spam' },
      'inappropriate-content': { color: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Inappropriate' }
    };
    const badge = badges[reason as keyof typeof badges] || badges['profanity'];
    return <span className={`px-2 py-0.5 rounded-full text-xs border ${badge.color}`}>{badge.label}</span>;
  };
  
  const getSeverityBadge = (severity: string) => {
    const badges = {
      'low': { color: 'bg-blue-100 text-blue-700', label: 'Low' },
      'medium': { color: 'bg-orange-100 text-orange-700', label: 'Medium' },
      'high': { color: 'bg-red-100 text-red-700', label: 'High' }
    };
    const badge = badges[severity as keyof typeof badges] || badges['low'];
    return <span className={`px-2 py-0.5 rounded-full text-xs ${badge.color}`}>{badge.label}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-gray-600 hover:text-teal-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base">Moderation Queue</h2>
              <p className="text-xs text-gray-500">Review auto-blocked content</p>
            </div>
          </div>
          {onNavigate ? (
            <ForumHeader
              unreadNotifications={unreadNotifications}
              onOpenNotifications={() => onNavigate('notifications')}
              onOpenSaved={() => onNavigate('saved')}
              onOpenSettings={() => onNavigate('settings')}
            />
          ) : (
            <Shield className="w-5 h-5 text-teal-500" />
          )}
        </div>
        
        {/* Tabs */}
        <div className="flex gap-1 px-3 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
              activeTab === 'pending'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pending ({pendingItems.length})
          </button>
          <button
            onClick={() => setActiveTab('appeals')}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
              activeTab === 'appeals'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Appeals ({appealedItems.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
              activeTab === 'history'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
              activeTab === 'stats'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Stats
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Pending Tab */}
        {activeTab === 'pending' && (
          <div className="space-y-3">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl overflow-hidden">
              {/* Collapsible Header */}
              <button
                onClick={() => setInfoBannerExpanded(!infoBannerExpanded)}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-900">ℹ️ Quick Guide</span>
                  <span className="text-xs text-blue-600">(Click to {infoBannerExpanded ? 'hide' : 'show'})</span>
                </div>
                {infoBannerExpanded ? (
                  <ChevronUp className="w-4 h-4 text-blue-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-blue-600" />
                )}
              </button>
              
              {/* Collapsible Content */}
              {infoBannerExpanded && (
                <div className="px-3 pb-3 space-y-2">
                  <div>
                    <p className="text-xs text-blue-900 mb-1">📋 About Pending Queue:</p>
                    <p className="text-xs text-blue-700">
                      This content is <strong>already auto-blocked</strong> and hidden from users. Review and decide:
                    </p>
                    <ul className="text-xs text-blue-700 mt-1 ml-3 space-y-0.5">
                      <li>• <strong className="text-green-700">Approve</strong> = Content is OK (false positive) → Publish</li>
                      <li>• <strong className="text-red-700">Keep Blocked</strong> = Content is inappropriate → Keep hidden</li>
                    </ul>
                  </div>
                  
                  <div className="pt-2 border-t border-blue-300">
                    <p className="text-xs text-blue-900 mb-1">🎯 Severity Levels:</p>
                    <ul className="text-xs text-blue-700 space-y-0.5">
                      <li>• <span className="px-1.5 py-0.5 bg-blue-200 text-blue-800 rounded">Low</span> = 1 bad word, likely typo/false positive</li>
                      <li>• <span className="px-1.5 py-0.5 bg-orange-200 text-orange-800 rounded">Medium</span> = 2-3 bad words, spam patterns</li>
                      <li>• <span className="px-1.5 py-0.5 bg-red-200 text-red-800 rounded">High</span> = Hate speech, threats, extreme content</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            {pendingItems.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-gray-600">No pending items!</p>
                <p className="text-xs text-gray-400 mt-1">All caught up 🎉</p>
              </div>
            ) : (
              pendingItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  {/* Item Header */}
                  <div className="p-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img src={item.userAvatar} alt={item.username} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-sm">{item.username}</p>
                          <p className="text-xs text-gray-500">
                            {item.type === 'post' ? <FileText className="w-3 h-3 inline mr-1" /> : <MessageSquare className="w-3 h-3 inline mr-1" />}
                            {item.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getReasonBadge(item.blockReason)}
                        {getSeverityBadge(item.severity)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(item.blockedAt).toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Content */}
                  <div className="p-3">
                    {item.title && (
                      <h3 className="text-sm mb-1">{item.title}</h3>
                    )}
                    <p className="text-sm text-gray-700 mb-2">{item.content}</p>
                    
                    {item.blockedWords && item.blockedWords.length > 0 && (
                      <div className="mb-2 p-2 bg-red-50 rounded-lg">
                        <p className="text-xs text-red-700">
                          <AlertTriangle className="w-3 h-3 inline mr-1" />
                          Blocked words: <strong>{item.blockedWords.join(', ')}</strong>
                        </p>
                      </div>
                    )}
                    
                    {/* Images */}
                    {item.images && item.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {item.images.map((img, idx) => (
                          <img key={idx} src={img} alt="" className="w-full h-24 object-cover rounded-lg" />
                        ))}
                      </div>
                    )}
                    
                    {/* Review Actions */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="flex items-center justify-center gap-1 px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve & Publish</span>
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Keep Blocked</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {/* Appeals Tab */}
        {activeTab === 'appeals' && (
          <div className="space-y-3">
            {/* Info Banner - Appeals Policy */}
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-orange-900 mb-0.5">📝 Appeal Policy:</p>
                  <p className="text-xs text-orange-700">
                    Only <strong>blocked posts</strong> can be appealed. Comments cannot be appealed and must be reposted if appropriate.
                  </p>
                </div>
              </div>
            </div>
            
            {appealedItems.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-gray-600">No pending appeals</p>
              </div>
            ) : (
              appealedItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-orange-200 overflow-hidden">
                  {/* Item Header */}
                  <div className="p-3 bg-orange-50 border-b border-orange-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img src={item.userAvatar} alt={item.username} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-sm">{item.username}</p>
                          <p className="text-xs text-gray-500">Appeal submitted</p>
                        </div>
                      </div>
                      {getReasonBadge(item.blockReason)}
                    </div>
                    <p className="text-xs text-gray-400">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Appealed: {item.appealedAt && new Date(item.appealedAt).toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Original Content */}
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Original Content:</p>
                    {item.title && <h3 className="text-sm mb-1">{item.title}</h3>}
                    <p className="text-sm text-gray-700">{item.content}</p>
                  </div>
                  
                  {/* Appeal Reason */}
                  <div className="p-3 bg-blue-50">
                    <p className="text-xs text-gray-500 mb-1">User's Appeal:</p>
                    <p className="text-sm text-gray-800">{item.appealReason}</p>
                  </div>
                  
                  {/* Review Actions */}
                  <div className="p-3 flex gap-2">
                    <button
                      onClick={() => handleAppealApprove(item.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Appeal
                    </button>
                    <button
                      onClick={() => handleAppealReject(item.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Appeal
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {historyItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img src={item.userAvatar} alt={item.username} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-sm">{item.username}</p>
                      <p className="text-xs text-gray-500">{item.type}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {item.status === 'approved' ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">✓ Approved</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">✗ Rejected</span>
                    )}
                    {getReasonBadge(item.blockReason)}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{item.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Reviewed by: {item.reviewedBy}</span>
                  <span>{item.reviewedAt && new Date(item.reviewedAt).toLocaleDateString()}</span>
                </div>
                {item.reviewNotes && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Note: {item.reviewNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-3">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-2xl p-4 text-white">
                <p className="text-xs opacity-90 mb-1">Total Blocked</p>
                <p className="text-2xl">{stats.total}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-4 text-white">
                <p className="text-xs opacity-90 mb-1">Pending Review</p>
                <p className="text-2xl">{stats.pending}</p>
              </div>
              <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-4 text-white">
                <p className="text-xs opacity-90 mb-1">Approved</p>
                <p className="text-2xl">{stats.approved}</p>
              </div>
              <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-2xl p-4 text-white">
                <p className="text-xs opacity-90 mb-1">Rejected</p>
                <p className="text-2xl">{stats.rejected}</p>
              </div>
            </div>
            
            {/* By Reason */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <h3 className="text-sm mb-3">Block Reasons</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Profanity</span>
                  <span className="text-sm">{stats.byReason.profanity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Hate Speech</span>
                  <span className="text-sm">{stats.byReason.hateSpeech}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Spam</span>
                  <span className="text-sm">{stats.byReason.spam}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Inappropriate Content</span>
                  <span className="text-sm">{stats.byReason.inappropriate}</span>
                </div>
              </div>
            </div>
            
            {/* AI Accuracy */}
            <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-90 mb-1">AI Accuracy (False Positives)</p>
                  <p className="text-2xl">{stats.accuracy}%</p>
                </div>
                <TrendingUp className="w-8 h-8 opacity-75" />
              </div>
              <p className="text-xs opacity-75 mt-2">
                Lower is better - shows % of approved content
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base">Review Content</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              {/* User Info */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <img src={selectedItem.userAvatar} alt={selectedItem.username} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="text-sm">{selectedItem.username}</p>
                  <p className="text-xs text-gray-500">{selectedItem.type}</p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-3 bg-white border border-gray-200 rounded-xl">
                {selectedItem.title && (
                  <h4 className="text-sm mb-2">{selectedItem.title}</h4>
                )}
                <p className="text-sm text-gray-700">{selectedItem.content}</p>
              </div>
              
              {/* Block Info */}
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertOctagon className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-900">Block Details</span>
                </div>
                <div className="space-y-1 text-xs text-red-700">
                  <p>Reason: {getReasonBadge(selectedItem.blockReason)}</p>
                  <p>Severity: {getSeverityBadge(selectedItem.severity)}</p>
                  {selectedItem.blockedWords && (
                    <p>Words: <strong>{selectedItem.blockedWords.join(', ')}</strong></p>
                  )}
                </div>
              </div>
              
              {/* Review Notes */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Review Notes (Optional)</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(selectedItem.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve & Publish
                </button>
                <button
                  onClick={() => handleReject(selectedItem.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}