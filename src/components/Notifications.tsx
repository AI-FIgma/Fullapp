import { ArrowLeft, Check, CheckCheck, Trash2 } from 'lucide-react';
import { UserBadge } from './UserBadge';
import { ForumHeader } from './ForumHeader';
import { currentUser, type Notification } from '../data/mockData';
import { useMemo } from 'react';

interface NotificationsProps {
  onBack: () => void;
  onViewPost: (postId: string) => void;
  unreadNotifications: number;
  onNavigate: (view: 'notifications' | 'saved' | 'settings' | 'reports') => void;
  notifications: Notification[];
  onUpdateNotifications: (notifications: Notification[]) => void;
  filter?: 'app' | 'forum' | 'all';
}

export function Notifications({ 
  onBack, 
  onViewPost, 
  unreadNotifications, 
  onNavigate, 
  notifications: allNotifications, 
  onUpdateNotifications,
  filter = 'all'
}: NotificationsProps) {
  // Filter notifications based on user role - only admin/moderator see report notifications
  const hasModAccess = currentUser.role === 'admin' || currentUser.role === 'moderator';
  const forumTypes = ['comment', 'mention', 'upvote', 'pawvote', 'follow'];

  const filteredNotifications = useMemo(() => {
    let base = allNotifications;

    // 1. Role filter (Reports)
    if (!hasModAccess) {
      base = base.filter(n => n.type !== 'report');
    }

    // 2. Context filter
    if (filter === 'app') {
      base = base.filter(n => !forumTypes.includes(n.type));
    } else if (filter === 'forum') {
      base = base.filter(n => forumTypes.includes(n.type));
    }

    return base;
  }, [allNotifications, hasModAccess, filter, forumTypes]);

  const updateParent = (updatedList: Notification[]) => {
    onUpdateNotifications(updatedList);
  };

  const markAsRead = (id: string) => {
    const updated = allNotifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    updateParent(updated);
  };

  const deleteNotification = (id: string) => {
    const updated = allNotifications.filter(n => n.id !== id);
    updateParent(updated);
  };

  const markAllAsRead = () => {
    // Only mark visible notifications as read? Or all?
    // Usually mark all currently visible ones.
    const visibleIds = new Set(filteredNotifications.map(n => n.id));
    const updated = allNotifications.map(n => 
      visibleIds.has(n.id) ? { ...n, read: true } : n
    );
    updateParent(updated);
  };

  const deleteAll = () => {
    if (confirm('Are you sure you want to delete all visible notifications?')) {
      const visibleIds = new Set(filteredNotifications.map(n => n.id));
      const updated = allNotifications.filter(n => !visibleIds.has(n.id));
      updateParent(updated);
    }
  };

  const getTimeAgo = (date: Date | undefined) => {
    if (!date) return 'just now';
    
    const now = new Date();
    const timestamp = date instanceof Date ? date : new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return '💬';
      case 'mention':
        return '@';
      case 'verification':
        return '✅';
      case 'report':
        return '🚨';
      case 'support':
        return '💬';
      case 'achievement':
        return '🏆';
      case 'admin':
        return '⚠️';
      case 'system':
        return '🔔';
      default:
        return '🔔';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-gray-600 hover:text-teal-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-semibold">
              {filter === 'app' ? 'Notifications' : 
               filter === 'forum' ? 'Community Updates' : 'All Notifications'}
            </h2>
          </div>
          {/* Only show Forum Header actions if not in App-only mode, or maybe show simplified version */}
          {filter !== 'app' ? (
            <ForumHeader
              unreadNotifications={unreadNotifications}
              onOpenNotifications={() => {}}
              onOpenSaved={() => onNavigate('saved')}
              onOpenSettings={() => onNavigate('settings')}
            />
          ) : (
            <div className="w-8" /> /* Spacer */
          )}
        </div>
        {/* Bulk Actions */}
        {filteredNotifications.length > 0 && (
          <div className="flex items-center justify-end gap-3 px-3 py-2 border-t border-gray-100 bg-gray-50">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-teal-500 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
            <button
              onClick={deleteAll}
              className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete all</span>
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-gray-100">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">🔔</div>
            <p className="text-sm">No new notifications</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`group p-3 transition-colors ${
                notification.type === 'report' && !notification.read 
                  ? 'bg-red-50' // Special red background for unread reports
                  : !notification.read 
                  ? 'bg-teal-50' 
                  : ''
              } ${notification.post || notification.type === 'report' ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
              onClick={() => {
                if (notification.type === 'report') {
                  onNavigate('reports'); // Navigate to Report Center
                  markAsRead(notification.id);
                } else if (notification.post) {
                  onViewPost(notification.post.id);
                } else {
                  // If it's a system notification (like treatment), just mark as read on click
                  if (!notification.read) markAsRead(notification.id);
                }
              }}
            >
              <div className="flex gap-2">
                <span className={`text-xl flex-shrink-0 ${
                  notification.type === 'report' ? 'animate-pulse' : ''
                }`}>
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="flex-1 min-w-0">
                  {notification.user && (
                    <div className="flex items-center gap-1 mb-1">
                      <img
                        src={notification.user.avatar}
                        alt={notification.user.username}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="text-sm text-gray-900 truncate">{notification.user.username}</span>
                      <UserBadge role={notification.user.role} />
                    </div>
                  )}
                  
                  {/* Special styling for report notifications */}
                  {notification.type === 'report' ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full border border-red-300">
                          Moderation
                        </span>
                        {!notification.read && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full border border-yellow-300 animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      {notification.post && (
                        <p className="text-xs text-gray-500 truncate">"{notification.post.title}"</p>
                      )}
                      <p className="text-xs text-red-600 mt-1">👆 Tap to open Report Center</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-700 mb-0.5">{notification.message}</p>
                      {notification.post && (
                        <p className="text-xs text-gray-500 truncate">"{notification.post.title}"</p>
                      )}
                    </>
                  )}
                  
                  <span className="text-[10px] text-gray-500">{getTimeAgo(notification.timestamp)}</span>
                </div>
                
                {/* Individual Actions */}
                <div className="flex gap-1 flex-shrink-0 items-start opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-teal-500 hover:bg-teal-50 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Unread indicator */}
                {!notification.read && (
                  <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}