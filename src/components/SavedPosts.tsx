import { ArrowLeft, Bookmark } from 'lucide-react';
import { PostCard } from './PostCard';
import { ForumHeader } from './ForumHeader';
import { mockPosts } from '../data/mockData';

interface SavedPostsProps {
  onBack: () => void;
  onViewPost: (postId: string) => void;
  onViewProfile: (userId: string) => void;
  unreadNotifications: number;
  onNavigate: (view: 'notifications' | 'saved' | 'settings') => void;
  onCategoryChange?: (categoryId: string, subcategoryId: string | null) => void;
}

export function SavedPosts({ onBack, onViewPost, onViewProfile, unreadNotifications, onNavigate, onCategoryChange }: SavedPostsProps) {
  // Filter saved posts
  const savedPosts = mockPosts.filter(post => post.isSaved);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-gray-600 hover:text-teal-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base">Saved Posts</h2>
          </div>
          <ForumHeader
            unreadNotifications={unreadNotifications}
            onOpenNotifications={() => onNavigate('notifications')}
            onOpenSaved={() => {}}
            onOpenSettings={() => onNavigate('settings')}
          />
        </div>
      </div>

      {/* Saved Posts List */}
      {savedPosts.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {savedPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => onViewPost(post.id)}
              onViewProfile={onViewProfile}
              onToggleSave={(postId) => {
                // In real app, this would call API to unsave
                console.log('Unsave post:', postId);
              }}
              onCategoryClick={(categoryId, subcategoryId) => {
                if (onCategoryChange) {
                  onCategoryChange(categoryId, subcategoryId);
                  onBack(); // Go back to home with selected category
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Bookmark className="w-12 h-12 text-gray-300 mb-3" />
          <h3 className="text-sm text-gray-500 mb-1">No saved posts yet</h3>
          <p className="text-xs text-gray-400">
            Save posts to easily find them later
          </p>
        </div>
      )}
    </div>
  );
}