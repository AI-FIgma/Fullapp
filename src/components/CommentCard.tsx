import { ArrowUp, Reply, MoreVertical, Flag, Copy, Trash2, Edit2, Clock, Ban } from 'lucide-react';
import { UserBadge } from './UserBadge';
import { currentUser } from '../data/mockData';
import type { Comment } from '../App';
import { useState } from 'react';
import { EditCommentModal } from './EditCommentModal';
import { EditHistoryModal } from './EditHistoryModal';
import { copyToClipboard } from '../utils/clipboard';
import { OnlineStatusIndicator } from './OnlineStatusIndicator';
import { ReactionBar } from './ReactionBar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface CommentCardProps {
  comment: Comment;
  onViewProfile: (userId: string) => void;
  onDelete?: (commentId: string) => void;
  onReply?: (parentId: string, content: string) => void;
  onReport?: (commentId: string, reason: string) => void;
  onEdit?: (commentId: string, newContent: string) => void;
  onBlockUser?: (userId: string) => void;
  onUpvote?: (commentId: string) => void;
  depth?: number; // Track nesting depth
}

export function CommentCard({ comment, onViewProfile, onDelete, onReply, onReport, onEdit, onBlockUser, onUpvote, depth = 0 }: CommentCardProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const canDelete = 
    currentUser.role === 'admin' || 
    currentUser.role === 'moderator' || 
    currentUser.id === comment.author.id;

  const handleReplySubmit = () => {
    if (replyContent.trim() && onReply) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setShowReplyInput(false);
    }
  };

  // Limit nesting depth to 3 levels
  const maxDepth = 3;

  return (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-200 pl-3' : ''}`}>
      <div className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <div className="flex gap-2">
          <div className="relative flex-shrink-0 w-7 h-7">
            <img
              src={comment.author.avatar}
              alt={comment.author.username}
              className="w-full h-full rounded-full cursor-pointer"
              onClick={() => onViewProfile(comment.author.id)}
            />
            <OnlineStatusIndicator user={comment.author} size="sm" position="bottom-right" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <span
                className="text-sm text-gray-900 cursor-pointer hover:underline"
                onClick={() => onViewProfile(comment.author.id)}
              >
                {comment.author.username}
              </span>
              <UserBadge role={comment.author.role} size="sm" />
              <span className="text-xs text-gray-500">{getTimeAgo(comment.timestamp)}</span>
            </div>
            <p className="text-sm text-gray-700 mb-1.5">{comment.content}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpvote?.(comment.id);
                }}
                className={`flex items-center gap-1 text-xs text-gray-500 hover:text-teal-500 transition-colors ${
                  comment.hasUpvoted ? 'text-teal-500' : ''
                }`}
              >
                <span className="text-sm">🐾</span>
                <span>{comment.upvotes}</span>
              </button>

              <div onClick={(e) => e.stopPropagation()}>
                <ReactionBar reactions={comment.reactions || []} compact={true} />
              </div>
              
              {/* Reply button - only show if depth is less than max */}
              {depth < maxDepth && onReply && (
                <button
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-teal-500 transition-colors"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              )}

              {/* Menu button */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-teal-500 transition-colors focus:outline-none">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuItem
                    onClick={async () => {
                      const success = await copyToClipboard(comment.content);
                      if (success) {
                        alert('Comment copied to clipboard!');
                      } else {
                        alert('Failed to copy to clipboard');
                      }
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Comment
                  </DropdownMenuItem>

                  {onReport && currentUser.id !== comment.author.id && currentUser.role !== 'admin' && currentUser.role !== 'moderator' && (
                    <DropdownMenuItem
                      onClick={() => {
                        const reason = prompt('Why are you reporting this comment?');
                        if (reason && reason.trim()) {
                          onReport(comment.id, reason);
                          alert('Comment reported. Thank you!');
                        }
                      }}
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Report Comment
                    </DropdownMenuItem>
                  )}

                  {onBlockUser && (currentUser.role === 'admin' || currentUser.role === 'moderator') && currentUser.id !== comment.author.id && (
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={() => onBlockUser(comment.author.id)}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Block User
                    </DropdownMenuItem>
                  )}

                  {canDelete && onDelete && (
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={() => {
                        if (confirm('Delete this comment?')) {
                          onDelete(comment.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Comment
                    </DropdownMenuItem>
                  )}

                  {onEdit && (currentUser.id === comment.author.id || currentUser.role === 'admin' || currentUser.role === 'moderator') && (
                    <DropdownMenuItem
                      onClick={() => setShowEditModal(true)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Comment
                    </DropdownMenuItem>
                  )}

                  {comment.isEdited && (
                    <DropdownMenuItem
                      onClick={() => setShowHistoryModal(true)}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Edit History
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Reply Input */}
            {showReplyInput && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleReplySubmit();
                    }
                  }}
                  placeholder={`Reply to ${comment.author.username}...`}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus
                />
                <button
                  onClick={handleReplySubmit}
                  disabled={!replyContent.trim()}
                  className="px-3 py-1.5 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map(reply => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onViewProfile={onViewProfile}
              onDelete={onDelete}
              onReply={onReply}
              onReport={onReport}
              onBlockUser={onBlockUser}
              onUpvote={onUpvote}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {/* Edit Comment Modal */}
      {showEditModal && (
        <EditCommentModal
          commentId={comment.id}
          currentContent={comment.content}
          onClose={() => setShowEditModal(false)}
          onSave={(newContent) => {
            if (onEdit) {
              onEdit(comment.id, newContent);
            }
            setShowEditModal(false);
          }}
        />
      )}

      {/* Edit History Modal */}
      {showHistoryModal && comment.editHistory && (
        <EditHistoryModal
          currentContent={comment.content}
          history={comment.editHistory}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
}