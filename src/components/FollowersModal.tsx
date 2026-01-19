import { X, UserMinus, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { UserBadge } from './UserBadge';
import type { User } from '../App';

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'followers' | 'following';
  users: User[];
  onRemoveFollower?: (userId: string) => void; // Remove from followers list
  onUnfollow?: (userId: string) => void; // Unfollow user
  onViewProfile: (userId: string) => void;
}

export function FollowersModal({ 
  isOpen, 
  onClose, 
  type, 
  users, 
  onRemoveFollower,
  onUnfollow,
  onViewProfile 
}: FollowersModalProps) {
  const [localUsers, setLocalUsers] = useState(users);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRemove = (userId: string, username: string) => {
    // Animate removal
    setRemovingUserId(userId);
    
    setTimeout(() => {
      if (type === 'followers' && onRemoveFollower) {
        onRemoveFollower(userId);
      } else if (type === 'following' && onUnfollow) {
        onUnfollow(userId);
      }
      
      // Remove from local list
      setLocalUsers(prev => prev.filter(u => u.id !== userId));
      setRemovingUserId(null);
      
      // Show success message
      const message = type === 'followers' 
        ? `Removed ${username} from followers` 
        : `Unfollowed ${username}`;
      
      // Simple toast notification (you can replace with proper toast library)
      console.log('✅', message);
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      {/* Modal */}
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {type === 'followers' ? 'Followers' : 'Following'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {localUsers.length} {localUsers.length === 1 ? 'person' : 'people'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {localUsers.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-900 mb-1">
                {type === 'followers' 
                  ? 'No followers yet' 
                  : 'Not following anyone yet'}
              </p>
              <p className="text-xs text-gray-500">
                {type === 'followers' 
                  ? 'Share great content to gain followers!' 
                  : 'Start following community members to see their posts'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {localUsers.map(user => (
                <div 
                  key={user.id} 
                  className={`p-4 flex items-center gap-3 hover:bg-gray-50 transition-all ${
                    removingUserId === user.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                  }`}
                >
                  {/* User Info - Clickable */}
                  <button
                    onClick={() => {
                      onViewProfile(user.id);
                      onClose();
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left group"
                  >
                    <img 
                      src={user.avatar} 
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-transparent group-hover:ring-teal-200 transition-all"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm text-gray-900 truncate group-hover:text-teal-600 transition-colors">
                          {user.username}
                        </span>
                        <UserBadge role={user.role} size="xs" />
                      </div>
                      {user.bio && (
                        <p className="text-xs text-gray-500 truncate">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </button>

                  {/* Remove/Unfollow Button */}
                  <button
                    onClick={() => handleRemove(user.id, user.username)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 flex-shrink-0 active:scale-95 ${
                      type === 'followers'
                        ? 'bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 hover:border-red-200 border border-gray-200'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {type === 'followers' ? (
                      <>
                        <UserMinus className="w-3.5 h-3.5" />
                        Remove
                      </>
                    ) : (
                      <>
                        <UserMinus className="w-3.5 h-3.5" />
                        Unfollow
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}