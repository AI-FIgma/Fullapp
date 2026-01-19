import { ArrowLeft, Send, Pin, Trash2, MapPin, Flag, Bookmark, Edit2, MoreVertical, Ban, Clock, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import { ForumHeader } from './ForumHeader';
import { UserBadge } from './UserBadge';
import { ReactionBar } from './ReactionBar';
import { PollComponent } from './PollComponent';
import { ReportModal } from './ReportModal';
import { CommentCard } from './CommentCard';
import { MoreMenu } from './MoreMenu';
import { EditPostModal } from './EditPostModal';
import { EditHistoryModal } from './EditHistoryModal';
import { OnlineStatusIndicator } from './OnlineStatusIndicator';
import { mockPosts, mockComments, currentUser, categories } from '../data/mockData';
import type { Comment } from '../App';

interface PostDetailProps {
  postId: string;
  onBack: () => void;
  onViewProfile: (userId: string) => void;
  unreadNotifications: number;
  onNavigate: (view: 'notifications' | 'saved' | 'settings') => void;
  onCategoryClick?: (categoryId: string, subcategoryId: string | null) => void;
}

export function PostDetail({ postId, onBack, onViewProfile, unreadNotifications, onNavigate, onCategoryClick }: PostDetailProps) {
  const [commentText, setCommentText] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [pollCollapsed, setPollCollapsed] = useState(false);
  
  // Initialize post state from mock data
  const [post, setPost] = useState(mockPosts.find(p => p.id === postId));
  const [comments, setComments] = useState<Comment[]>(mockComments[postId] || []);

  // Update state when postId changes
  useEffect(() => {
    setPost(mockPosts.find(p => p.id === postId));
    setComments(mockComments[postId] || []);
  }, [postId]);

  if (!post) {
    return <div>Post not found</div>;
  }

  // Handle upvoting a post (Pawvote)
  // Updates local state and increments counter
  const handlePostUpvote = () => {
    if (!post) return;
    setPost(prev => prev ? ({
      ...prev,
      hasUpvoted: !prev.hasUpvoted,
      pawvotes: prev.pawvotes + (!prev.hasUpvoted ? 1 : -1)
    }) : undefined);
  };

  // Handle upvoting a specific comment
  // Recursive function to find and update comment or nested reply
  const handleCommentUpvote = (commentId: string) => {
    const updateComments = (list: Comment[]): Comment[] => {
      return list.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            hasUpvoted: !c.hasUpvoted,
            upvotes: c.upvotes + (!c.hasUpvoted ? 1 : -1)
          };
        }
        // Recursively check replies
        if (c.replies) {
          return { ...c, replies: updateComments(c.replies) };
        }
        return c;
      });
    };
    setComments(prev => updateComments(prev));
  };

  const getCategoryColor = (category: string) => {
    const categoryInfo = categories.find(c => c.name === category);
    return categoryInfo ? `bg-${categoryInfo.color}-100 text-${categoryInfo.color}-700` : 'bg-teal-100 text-teal-700';
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const removeCommentsByUser = (commentsList: Comment[], userId: string): Comment[] => {
    return commentsList
      .filter(c => c.author.id !== userId)
      .map(c => ({
        ...c,
        replies: c.replies ? removeCommentsByUser(c.replies, userId) : undefined
      }));
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      // In a real app, this would add the comment to the database
      setCommentText('');
    }
  };

  // Build menu items
  const menuItems = [];
  const canPin = currentUser.role === 'admin' || currentUser.role === 'moderator';
  const canDelete = post.author.id === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'moderator';
  const canEdit = post.author.id === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'moderator';
  const canReport = post.author.id !== currentUser.id && currentUser.role !== 'admin' && currentUser.role !== 'moderator';

  // Save is always available
  menuItems.push({
    icon: <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />,
    label: isSaved ? 'Unsave post' : 'Save post',
    onClick: () => {
      setIsSaved(!isSaved);
      alert(isSaved ? 'Removed from saved' : 'Saved to collection!');
    },
    variant: 'primary' as const,
    active: isSaved
  });

  menuItems.push({
    icon: <Share2 className="w-4 h-4" />,
    label: 'Share post',
    onClick: () => {
      const url = `${window.location.origin}?post=${postId}`;
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

  if (canPin) {
    menuItems.push({
      icon: <Pin className="w-4 h-4" />,
      label: post.isPinned ? 'Unpin post' : 'Pin post',
      onClick: () => alert(post.isPinned ? 'Post unpinned' : 'Post pinned to top!'),
      variant: 'primary' as const,
      active: post.isPinned
    });
  }
  if (canEdit) {
    menuItems.push({
      icon: <Edit2 className="w-4 h-4" />,
      label: 'Edit post',
      onClick: () => setShowEditModal(true),
      variant: 'default' as const
    });
  }
  if (canReport) {
    menuItems.push({
      icon: <Flag className="w-4 h-4" />,
      label: 'Report post',
      onClick: () => setReportModalOpen(true),
      variant: 'danger' as const
    });
  }

  const canBlock = (currentUser.role === 'admin' || currentUser.role === 'moderator') && post.author.id !== currentUser.id;
  if (canBlock) {
    menuItems.push({
      icon: <Ban className="w-4 h-4" />,
      label: 'Block User',
      onClick: () => {
        if (confirm('Are you sure you want to block this user? All their posts and comments will be removed.')) {
          alert('User blocked. Redirecting to home feed...');
          onBack();
        }
      },
      variant: 'danger' as const
    });
  }
  if (canDelete) {
    menuItems.push({
      icon: <Trash2 className="w-4 h-4" />,
      label: 'Delete post',
      onClick: () => {
        if (confirm('Are you sure you want to delete this post?')) {
          alert('Post deleted!');
          onBack();
        }
      },
      variant: 'danger' as const
    });
  }

  // Handle saving edited post
  // This updates the local state to reflect changes immediately
  // In a real application, this would make an API call to the backend
  const handleSavePost = (postId: string, newTitle: string, newContent: string, newCategory?: string, newSubcategory?: string) => {
    setPost(prev => {
      if (!prev) return undefined;
      
      // Create new history entry capturing previous state
      const historyEntry = {
        editedAt: new Date(),
        editedBy: currentUser,
        previousContent: prev.content,
        previousTitle: prev.title
      };

      return {
        ...prev,
        title: newTitle,
        content: newContent,
        category: newCategory || prev.category,
        subcategory: newSubcategory !== undefined ? newSubcategory : prev.subcategory,
        isEdited: true,
        editHistory: [...(prev.editHistory || []), historyEntry]
      };
    });
    
    alert('Post updated successfully!');
    setShowEditModal(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="text-gray-600 hover:text-teal-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base">Post</h2>
          </div>
          <ForumHeader
            unreadNotifications={unreadNotifications}
            onOpenNotifications={() => onNavigate('notifications')}
            onOpenSaved={() => onNavigate('saved')}
            onOpenSettings={() => onNavigate('settings')}
          />
        </div>
      </div>

      {/* Post Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-3 border-b border-gray-200">
          {/* Author Info */}
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex-shrink-0">
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-8 h-8 rounded-full cursor-pointer ring-2 ring-gray-100"
                onClick={() => onViewProfile(post.author.id)}
              />
              <OnlineStatusIndicator user={post.author} size="sm" position="bottom-right" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Username and badges row */}
              <div className="flex items-center gap-1.5 min-w-0 mb-0.5">
                <span
                  className="text-gray-900 cursor-pointer hover:underline truncate font-semibold"
                  onClick={() => onViewProfile(post.author.id)}
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
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] bg-teal-50 text-teal-700 cursor-pointer hover:bg-teal-100 transition-colors"
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
                        onCategoryClick?.(post.category, post.subcategory || null);
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

          {/* Post Text */}
          <h3 className="mb-2 font-semibold">
            {post.title}
          </h3>
          <p className="text-sm text-gray-700 mb-3">{post.content}</p>

          {/* Edited Badge */}
          {post.isEdited && (
            <button
              onClick={() => setShowHistoryModal(true)}
              className="inline-flex items-center gap-1 mb-3 text-xs text-gray-500 hover:text-teal-600 transition-colors"
            >
              <Clock className="w-3 h-3" />
              <span>Redaguota</span>
            </button>
          )}

          {/* Location Tag */}
          {post.location && (
            <div className="mb-3 flex items-center gap-2 p-2 bg-teal-50 rounded-lg border border-teal-100">
              <MapPin className="w-4 h-4 text-teal-500" />
              <span className="text-sm text-gray-700">{post.location}</span>
            </div>
          )}

          {/* Poll */}
          {post.poll && (
            <div className="mb-3">
              <PollComponent 
                poll={post.poll} 
                compact={pollCollapsed}
                onCollapse={() => setPollCollapsed(!pollCollapsed)}
              />
            </div>
          )}

          {/* Video */}
          {post.videoUrl && (
            <div className="mb-4 rounded-xl overflow-hidden bg-gray-100">
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
            <div className={`grid gap-2 mb-4 ${
              post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
            }`}>
              {post.images.map((image, index) => (
                <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Actions Bar - Pawvote and Reactions in one row */}
          <div className="flex items-center gap-3 text-gray-500">
            <button
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl transition-all ${
                post.hasUpvoted ? 'bg-teal-50 text-teal-600' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handlePostUpvote();
              }}
            >
              <span className="text-lg">🐾</span>
              <span className="text-sm font-medium">{post.pawvotes}</span>
            </button>

            {/* Separator */}
            <div className="w-px h-4 bg-gray-300" />

            {/* Reactions */}
            <ReactionBar reactions={post.reactions || []} compact={false} />
          </div>
        </div>

        {/* Comments */}
        <div>
          <div className="p-3 border-b border-gray-200">
            <h4 className="text-sm">{comments.length} Comments</h4>
          </div>
          {comments.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onViewProfile={onViewProfile}
              onUpvote={handleCommentUpvote}
              onDelete={(commentId) => {
                // In real app, this would call API to delete
                console.log('Delete comment:', commentId);
              }}
              onReply={(parentId, content) => {
                // In real app, this would call API to add reply
                console.log('Reply to', parentId, ':', content);
                // Mock reply - would be handled by backend
                alert(`Reply sent: "${content}"`);
              }}
              onReport={(commentId, reason) => {
                // In real app, this would call API to report
                console.log('Report comment:', commentId, 'Reason:', reason);
                alert('Comment reported successfully!');
              }}
              onBlockUser={(userId) => {
                if (confirm('Are you sure you want to block this user? All their comments will be removed.')) {
                  setComments(prev => removeCommentsByUser(prev, userId));
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Comment Input */}
      <div className="fixed bottom-14 left-0 right-0 bg-white border-t border-gray-100 p-3 z-20">
        <form onSubmit={handleSubmitComment} className="flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 px-3 py-2 text-sm bg-gray-50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 text-white rounded-full flex items-center justify-center hover:from-teal-500 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        type="post"
        contentId={postId}
      />

      {/* Edit Post Modal - Allows author/admin to modify content */}
      {showEditModal && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onSave={handleSavePost}
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
}