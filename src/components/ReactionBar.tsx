import { useState } from 'react';
import type { Reaction } from '../App';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface ReactionBarProps {
  reactions: Reaction[];
  compact?: boolean; // Compact mode for smaller display
  onToggleReaction?: (emoji: string) => void;
}

export function ReactionBar({ reactions, compact = false, onToggleReaction }: ReactionBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Popular emoji choices for pet posts
  const availableEmojis = [
    '❤️', '😍', '😂', '👍', '🐕', '🐱', '🐾', 
    '😊', '🥰', '👏', '🙌', '💯', '🔥', '⭐',
    '😢', '😮', '🤔', '🙏', '💪', '✅', '✨'
  ];

  const handleEmojiClick = (emoji: string) => {
    console.log('Emoji selected:', emoji);
    if (onToggleReaction) {
      onToggleReaction(emoji);
    }
    setIsOpen(false);
  };

  // Logic for displaying reactions based on mode
  let displayReactions = [...reactions];
  let hiddenCount = 0;

  if (compact) {
    // In compact (list) view:
    // 1. Sort by count descending (most popular first)
    // 2. Take only top 3 to ensure fit on mobile screens
    displayReactions.sort((a, b) => b.count - a.count);
    
    if (displayReactions.length > 3) {
      hiddenCount = displayReactions.length - 3;
      displayReactions = displayReactions.slice(0, 3);
    }
  }
  // In detail view (compact=false), show all reactions naturally

  return (
    <div className={`flex items-center gap-1.5 ${compact ? 'flex-nowrap' : 'flex-wrap'}`}>
      {/* Fixed Add Reaction Button at the start */}
      <Popover open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <PopoverTrigger asChild>
          <button 
            className={`flex-shrink-0 rounded-full bg-gray-100 hover:bg-teal-100 transition-colors flex items-center justify-center text-gray-600 border border-transparent hover:border-teal-200 ${
              compact ? 'w-6 h-6 text-xs' : 'w-7 h-7 text-sm'
            }`}
          >
            +
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3 rounded-2xl" side="top" align="start">
            {/* Header */}
            <div className="mb-2 pb-2 border-b border-gray-100">
              <h4 className="text-xs text-gray-600">React with emoji</h4>
            </div>

            {/* Emoji Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {availableEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-xl hover:bg-teal-50 rounded-lg transition-colors active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Tip */}
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 text-center">
                Click an emoji to react
              </p>
            </div>
        </PopoverContent>
      </Popover>

      {/* Reactions List */}
      {displayReactions.map((reaction, index) => (
        <button
          key={index}
          onClick={() => handleEmojiClick(reaction.emoji)}
          className={`flex-shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full transition-all border ${
            compact ? 'text-[10px]' : 'text-xs'
          } ${
            reaction.hasReacted
              ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className={compact ? 'text-xs' : 'text-sm'}>{reaction.emoji}</span>
          <span className={reaction.hasReacted ? 'font-medium' : ''}>
            {reaction.count}
          </span>
        </button>
      ))}
      
      {/* Hidden Count Indicator (only in compact mode) */}
      {compact && hiddenCount > 0 && (
        <div className="flex-shrink-0 flex items-center justify-center h-6 px-1.5 rounded-full bg-gray-50 border border-gray-100 text-[10px] text-gray-500 font-medium">
          +{hiddenCount}
        </div>
      )}
    </div>
  );
}