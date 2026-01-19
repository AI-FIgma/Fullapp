import { X, MessageCircle, FileText, AlertCircle, ThumbsUp } from 'lucide-react';
import type { User, Post, Comment } from '../App';
import { mockPosts } from '../data/mockData';

interface UserHistoryModalProps {
  user: User;
  onClose: () => void;
  onViewPost?: (postId: string) => void;
}

export function UserHistoryModal({ user, onClose, onViewPost }: UserHistoryModalProps) {
  // Get user's posts and comments
  const userPosts = mockPosts.filter(p => p.author.id === user.id);
  
  // Calculate stats
  const totalPawvotes = userPosts.reduce((sum, post) => sum + post.pawvotes, 0);
  const totalComments = userPosts.reduce((sum, post) => sum + post.commentCount, 0);
  
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
    return `${Math.floor(diffInDays / 30)}mo ago`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="text-lg">{user.username}</h2>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <FileText className="w-5 h-5 text-teal-500" />
            </div>
            <p className="text-2xl">{userPosts.length}</p>
            <p className="text-xs text-gray-500">Posts</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <ThumbsUp className="w-5 h-5 text-teal-500" />
            </div>
            <p className="text-2xl">{totalPawvotes}</p>
            <p className="text-xs text-gray-500">Pawvotes</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <MessageCircle className="w-5 h-5 text-teal-500" />
            </div>
            <p className="text-2xl">{totalComments}</p>
            <p className="text-xs text-gray-500">Comments</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-2xl">{user.warningCount || 0}</p>
            <p className="text-xs text-gray-500">Warnings</p>
          </div>
        </div>

        {/* Posts List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm text-gray-600 mb-3">Recent Posts</h3>
          {userPosts.length > 0 ? (
            <div className="space-y-3">
              {userPosts.slice(0, 10).map(post => (
                <div
                  key={post.id}
                  className="border border-gray-200 rounded-xl p-3 hover:border-teal-300 transition-colors cursor-pointer"
                  onClick={() => {
                    if (onViewPost) {
                      onViewPost(post.id);
                      onClose();
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm text-gray-900 line-clamp-1">{post.title}</h4>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {getTimeAgo(post.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">{post.content}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      🐾 {post.pawvotes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.commentCount}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No posts yet</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
