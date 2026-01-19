import { ArrowUp, MessageCircle, Share2, Bookmark, Pin, MapPin, AlertCircle, Clock, Trash2, Edit2, MoreVertical, Ban, Flag } from 'lucide-react';
import { useState, memo } from 'react';
import { toast } from 'sonner@2.0.3';
import { UserBadge } from './UserBadge';
import { PollComponent } from './PollComponent';
import { ReactionBar } from './ReactionBar';
import { EditPostModal } from './EditPostModal';
import { EditHistoryModal } from './EditHistoryModal';
import { OnlineStatusIndicator } from './OnlineStatusIndicator';
import { MoreMenu } from './MoreMenu';
import { categories } from '../data/mockData';
import type { Post, User } from '../App';

interface PostCardProps {
  post: Post;
  onClick: () => void;
  onViewProfile: (userId: string) => void;
  currentUser?: User;
  onDelete?: (postId: string) => void;
  onTogglePin?: (postId: string) => void;
  shouldShowPinnedBadge?: boolean;
  onToggleSave?: (postId: string) => void;
  onEdit?: (postId: string, newTitle: string, newContent: string, newCategory?: string, newSubcategory?: string | null) => void;
  onBlockUser?: (userId: string) => void;
  onReport?: (postId: string) => void;
  onCategoryClick?: (categoryId: string, subcategoryId: string | null) => void;
  onToggleReaction?: (postId: string, emoji: string) => void;
}

export const PostCard = memo(function PostCard({ post, onClick, onViewProfile, currentUser, onDelete, onTogglePin, shouldShowPinnedBadge = true, onToggleSave, onEdit, onBlockUser, onReport, onCategoryClick, onToggleReaction }: PostCardProps) {
  const [isPollExpanded, setIsPollExpanded] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  const getCategoryColor = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData ? `bg-${categoryData.color}-100 text-${categoryData.color}-700` : 'bg-teal-100 text-teal-700';
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const canDelete = currentUser && (
    currentUser.role === 'admin' || 
    currentUser.role === 'moderator' || 
    currentUser.id === post.author.id
  );

  const canEdit = currentUser && (
    currentUser.id === post.author.id || 
    currentUser.role === 'admin' || 
    currentUser.role === 'moderator'
  );

  const canPin = currentUser && (
    currentUser.role === 'admin' || 
    currentUser.role === 'moderator'
  );

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && confirm('Are you sure you want to delete this post?')) {
      onDelete(post.id);
    }
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTogglePin) {
      onTogglePin(post.id);
    }
  };

  // Build menu items for MoreMenu
  const menuItems = [];
  
  // Save is always available
  menuItems.push({
    icon: <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-current' : ''}`} />,
    label: post.isSaved ? 'Unsave post' : 'Save post',
    onClick: () => {
      if (onToggleSave) {
        onToggleSave(post.id);
      }
    },
    variant: 'primary' as const,
    active: post.isSaved
  });

  menuItems.push({
    icon: <Share2 className="w-4 h-4" />,
    label: 'Share post',
    onClick: () => {
      const url = `${window.location.origin}?post=${post.id}`;
      if (navigator.share) {
        navigator.share({
          title: post.title,
          text: post.content,
          url: url
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      }
    },
    variant: 'primary' as const
  });
  
  if (canPin && onTogglePin) {
    menuItems.push({
      icon: <Pin className="w-4 h-4" />,
      label: post.isPinned ? 'Unpin post' : 'Pin post',
      onClick: () => onTogglePin(post.id),
      variant: 'primary' as const,
      active: post.isPinned
    });
  }
  if (canEdit && onEdit) {
    menuItems.push({
      icon: <Edit2 className="w-4 h-4" />,
      label: 'Edit post',
      onClick: () => setShowEditModal(true),
      variant: 'default' as const
    });
  }

  const canReport = currentUser && currentUser.id !== post.author.id;
  
  if (canReport && onReport) {
    menuItems.push({
      icon: <Flag className="w-4 h-4" />,
      label: 'Report post',
      onClick: () => onReport(post.id),
      variant: 'danger' as const
    });
  }

  const canBlock = currentUser && (
    currentUser.role === 'admin' || 
    currentUser.role === 'moderator'
  ) && currentUser.id !== post.author.id;

  if (canBlock && onBlockUser) {
    menuItems.push({
      icon: <Ban className="w-4 h-4" />,
      label: 'Block User',
      onClick: () => onBlockUser(post.author.id),
      variant: 'danger' as const
    });
  }

  if (canDelete && onDelete) {
    menuItems.push({
      icon: <Trash2 className="w-4 h-4" />,
      label: 'Delete post',
      onClick: () => {
        if (confirm('Are you sure you want to delete this post?')) {
          onDelete(post.id);
        }
      },
      variant: 'danger' as const
    });
  }

  return (
    <div className="p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onClick={onClick}>
      {/* Pinned Badge */}
      {post.isPinned && shouldShowPinnedBadge && (
        <div className={`flex items-center gap-1 text-xs mb-2 ${
          post.isGlobalPin 
            ? 'text-amber-600 font-medium' 
            : 'text-teal-600'
        }`}>
          {post.isGlobalPin ? (
            <>
              <span>📢</span>
              <span>Global Announcement</span>
            </>
          ) : (
            <>
              <span>📌</span>
              <span>Pinned Post</span>
            </>
          )}
        </div>
      )}

      {/* Author Info */}
      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-shrink-0">
          <img
            src={post.author.avatar}
            alt={post.author.username}
            className="w-8 h-8 rounded-full cursor-pointer ring-2 ring-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile(post.author.id);
            }}
          />
          <OnlineStatusIndicator user={post.author} size="sm" position="bottom-right" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Username and badges row */}
          <div className="flex items-center gap-1.5 min-w-0 mb-0.5">
            <span
              className="text-gray-900 cursor-pointer hover:underline truncate font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                onViewProfile(post.author.id);
              }}
            >
              {post.author.username}
            </span>
            <UserBadge role={post.author.role} size="md" />
          </div>
          
          {/* Tags row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-gray-500">{getTimeAgo(post.timestamp)}</span>
            <span className="text-gray-300">•</span>
            <span 
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] cursor-pointer hover:opacity-80 transition-opacity bg-teal-50 text-teal-700"
              onClick={(e) => {
                e.stopPropagation();
                onCategoryClick?.(post.category, null);
              }}
            >
              <span className="text-xs leading-none">{categories.find(c => c.id === post.category)?.icon}</span>
              <span className="leading-none">{categories.find(c => c.id === post.category)?.name}</span>
            </span>
            {post.subcategory && (
              <>
                <span className="text-gray-300 text-[10px]">›</span>
                <span 
                  className="flex items-center px-1.5 py-0.5 rounded-md text-xs bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryClick?.(post.category, post.subcategory);
                  }}
                  title={categories
                    .find(c => c.id === post.category)
                    ?.subcategories.find(s => s.id === post.subcategory)?.name}
                >
                  <span className="leading-none">
                    {categories
                      .find(c => c.id === post.category)
                      ?.subcategories.find(s => s.id === post.subcategory)?.icon}
                  </span>
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Action buttons column - aligned center */}
        <div className="flex items-center flex-shrink-0">
          <MoreMenu items={menuItems} />
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-2">
        <h4 className="text-gray-900 mb-1 font-semibold line-clamp-2">
          {post.title}
        </h4>
        <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>
        
        {/* Edited Badge */}
        {post.isEdited && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowHistoryModal(true);
            }}
            className="inline-flex items-center gap-1 mt-1 text-xs text-gray-500 hover:text-teal-600 transition-colors"
          >
            <Clock className="w-3 h-3" />
            <span>Redaguota</span>
          </button>
        )}
      </div>

      {/* Location Tag */}
      {post.location && (
        <div className="mb-2 flex items-center gap-1 text-xs text-gray-600">
          <MapPin className="w-3.5 h-3.5 text-teal-500" />
          <span>{post.location}</span>
        </div>
      )}

      {/* Poll Preview/Expanded */}
      {post.poll && (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setIsPollExpanded(!isPollExpanded);
          }}
          className="cursor-pointer hover:scale-[1.01] transition-all"
        >
          <PollComponent 
            poll={post.poll} 
            compact={!isPollExpanded}
            onCollapse={() => setIsPollExpanded(!isPollExpanded)}
          />
        </div>
      )}

      {/* Video */}
      {post.videoUrl && (
        <div className="mb-2 rounded-xl overflow-hidden bg-gray-100">
          <video
            src={post.videoUrl}
            controls
            className="w-full aspect-video object-cover"
            preload="metadata"
          />
        </div>
      )}

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className={`grid gap-1.5 mb-2 ${
          post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
        }`}>
          {post.images.slice(0, 4).map((image, index) => (
            <div key={index} className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 3 && post.images!.length > 4 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs">
                  +{post.images!.length - 4} more
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions Bar - Upvote, Comments, and Reactions in one row */}
      <div className="flex items-center justify-between gap-3 text-gray-500">
        <div className="flex items-center gap-3">
          <button
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl transition-all ${
              post.hasUpvoted ? 'bg-teal-50 text-teal-600' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              // Toggle pawvote
            }}
          >
            <span className="text-lg">🐾</span>
            <span className="text-sm font-medium">{post.pawvotes}</span>
          </button>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.commentCount}</span>
          </div>

          {/* Separator */}
          <div className="w-px h-4 bg-gray-300" />

          {/* Compact Reactions */}
          <div onClick={(e) => e.stopPropagation()}>
            <ReactionBar 
              reactions={post.reactions || []} 
              compact={true} 
              onToggleReaction={(emoji) => onToggleReaction?.(post.id, emoji)}
            />
          </div>
        </div>
      </div>

      {/* Edit Post Modal */}
      {showEditModal && onEdit && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onSave={onEdit}
        />
      )}

      {/* Edit History Modal */}
      {showHistoryModal && post.editHistory && (
        <EditHistoryModal
          currentContent={post.content}
          currentTitle={post.title}
          history={post.editHistory}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
});