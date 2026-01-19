import { CheckCircle, XCircle, Clock, Calendar, AlertTriangle, MessageSquare, User } from 'lucide-react';
import { useState } from 'react';
import { currentUser } from '../data/mockData';

interface BanAppeal {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  banReason: string;
  banDuration: '1d' | '7d' | '30d' | 'permanent';
  bannedAt: Date;
  bannedBy: string;
  appealReason: string;
  appealedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNote?: string;
}

// Mock appeals data
const mockAppeals: BanAppeal[] = [
  {
    id: 'appeal-1',
    userId: '5',
    username: 'DogLover22',
    avatar: 'https://i.pravatar.cc/150?img=12',
    banReason: 'Repeated spam posting',
    banDuration: '7d',
    bannedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    bannedBy: 'Admin',
    appealReason: 'I apologize for the spam. I was sharing helpful resources but didn\'t realize I was posting too frequently. I\'ve read the community guidelines and understand now. I promise to be more mindful of posting frequency.',
    appealedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'pending'
  },
  {
    id: 'appeal-2',
    userId: '6',
    username: 'CatMom123',
    avatar: 'https://i.pravatar.cc/150?img=45',
    banReason: 'Inappropriate language',
    banDuration: '1d',
    bannedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    bannedBy: 'Moderator',
    appealReason: 'I was having a bad day and responded poorly to a comment. This was completely out of character for me and I deeply regret it. I\'ve been an active member for months. Please give me another chance.',
    appealedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'pending'
  },
  {
    id: 'appeal-3',
    userId: '7',
    username: 'PetRescue99',
    avatar: 'https://i.pravatar.cc/150?img=33',
    banReason: 'Misinformation about pet care',
    banDuration: '30d',
    bannedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    bannedBy: 'Admin',
    appealReason: 'I shared outdated information that I genuinely believed was correct. I understand now why it was harmful and I\'ve educated myself. I would like to contribute positively to the community with accurate information.',
    appealedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    status: 'approved',
    reviewedBy: 'Admin',
    reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    reviewNote: 'User showed genuine remorse and understanding. Unbanned with warning.'
  }
];

type FilterType = 'pending' | 'approved' | 'rejected' | 'all';

export function BanAppeals() {
  const [filter, setFilter] = useState<FilterType>('pending');
  const [selectedAppeal, setSelectedAppeal] = useState<BanAppeal | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'moderator';

  const filteredAppeals = mockAppeals.filter(appeal => {
    if (filter === 'all') return true;
    return appeal.status === filter;
  });

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getBanDurationLabel = (duration: string) => {
    const labels: { [key: string]: string } = {
      '1d': '1 Day',
      '7d': '7 Days',
      '30d': '30 Days',
      'permanent': 'Permanent'
    };
    return labels[duration] || duration;
  };

  const handleApprove = (appeal: BanAppeal) => {
    if (!confirm(`Approve appeal and unban ${appeal.username}?`)) return;
    
    console.log('Approving appeal:', appeal.id);
    console.log('Review note:', reviewNote);
    alert(`✅ Appeal approved!\n\n${appeal.username} has been unbanned.${reviewNote ? '\n\nNote: ' + reviewNote : ''}`);
    
    setSelectedAppeal(null);
    setReviewNote('');
  };

  const handleReject = (appeal: BanAppeal) => {
    if (!reviewNote.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    
    if (!confirm(`Reject ${appeal.username}'s appeal?`)) return;
    
    console.log('Rejecting appeal:', appeal.id);
    console.log('Rejection reason:', reviewNote);
    alert(`❌ Appeal rejected.\n\nReason: ${reviewNote}\n\nBan remains in effect.`);
    
    setSelectedAppeal(null);
    setReviewNote('');
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            filter === 'pending'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending ({mockAppeals.filter(a => a.status === 'pending').length})
          </div>
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            filter === 'approved'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Approved
          </div>
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            filter === 'rejected'
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Rejected
          </div>
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            filter === 'all'
              ? 'bg-teal-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({mockAppeals.length})
        </button>
      </div>

      {/* Appeals List */}
      {filteredAppeals.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No {filter !== 'all' ? filter : ''} appeals</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppeals.map(appeal => (
            <div
              key={appeal.id}
              className="p-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-teal-200 transition-all cursor-pointer"
              onClick={() => setSelectedAppeal(appeal)}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={appeal.avatar}
                  alt={appeal.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{appeal.username}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      appeal.status === 'pending' 
                        ? 'bg-orange-100 text-orange-700'
                        : appeal.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {appeal.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Banned for: {appeal.banReason}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{getTimeAgo(appeal.appealedAt)}</p>
                  <p className="text-xs text-red-600 mt-1">{getBanDurationLabel(appeal.banDuration)}</p>
                </div>
              </div>

              {/* Appeal Reason Preview */}
              <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                {appeal.appealReason}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Banned {getTimeAgo(appeal.bannedAt)}
                  </span>
                  <span>by {appeal.bannedBy}</span>
                </div>
                {appeal.reviewedBy && (
                  <span className="text-teal-600">
                    Reviewed by {appeal.reviewedBy}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appeal Detail Modal */}
      {selectedAppeal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Ban Appeal
              </h2>
              <button
                onClick={() => {
                  setSelectedAppeal(null);
                  setReviewNote('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <img
                  src={selectedAppeal.avatar}
                  alt={selectedAppeal.username}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm">{selectedAppeal.username}</p>
                  <p className="text-xs text-gray-500">User ID: {selectedAppeal.userId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedAppeal.status === 'pending' 
                    ? 'bg-orange-100 text-orange-700'
                    : selectedAppeal.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {selectedAppeal.status.toUpperCase()}
                </span>
              </div>

              {/* Ban Details */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
                <h4 className="text-sm font-medium text-red-900">Ban Information</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reason:</span>
                    <span className="text-red-700">{selectedAppeal.banReason}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="text-red-700">{getBanDurationLabel(selectedAppeal.banDuration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Banned by:</span>
                    <span className="text-red-700">{selectedAppeal.bannedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Banned at:</span>
                    <span className="text-red-700">{selectedAppeal.bannedAt.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Appeal Reason */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Appeal Reason
                </h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedAppeal.appealReason}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Submitted {getTimeAgo(selectedAppeal.appealedAt)}
                </p>
              </div>

              {/* Previous Review (if exists) */}
              {selectedAppeal.reviewedBy && (
                <div className={`p-4 border rounded-xl ${
                  selectedAppeal.status === 'approved'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <h4 className="text-sm font-medium mb-2">
                    {selectedAppeal.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                  </h4>
                  <p className="text-sm text-gray-700 mb-1">
                    Reviewed by: {selectedAppeal.reviewedBy}
                  </p>
                  {selectedAppeal.reviewNote && (
                    <p className="text-sm text-gray-600 mb-1">
                      Note: {selectedAppeal.reviewNote}
                    </p>
                  )}
                  {selectedAppeal.reviewedAt && (
                    <p className="text-xs text-gray-500">
                      {selectedAppeal.reviewedAt.toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Review Section (only for pending appeals) */}
              {selectedAppeal.status === 'pending' && isAdmin && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm mb-2 block">Admin Review Note</label>
                    <textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                      rows={3}
                      placeholder="Add a note about your decision (required for rejection)..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReject(selectedAppeal)}
                      className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Appeal
                    </button>
                    <button
                      onClick={() => handleApprove(selectedAppeal)}
                      className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve & Unban
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
