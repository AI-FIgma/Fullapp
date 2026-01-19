import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { Poll } from '../App';

interface PollComponentProps {
  poll: Poll;
  compact?: boolean; // For preview in feed
  onCollapse?: () => void; // Optional callback for collapsing
}

export function PollComponent({ poll, compact = false, onCollapse }: PollComponentProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(poll.hasVoted);

  const handleVote = (optionId: string) => {
    if (hasVoted) return;
    setSelectedOption(optionId);
    setHasVoted(true);
    // In real app, send vote to backend
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const diff = poll.endsAt.getTime() - now.getTime();
    if (diff <= 0) return 'Poll ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const getPercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  if (compact) {
    return (
      <div 
        className="mt-3 p-3 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl border border-teal-100 hover:border-teal-300 transition-all cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onCollapse?.();
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="text-lg">📊</div>
          <span className="text-xs text-teal-700 font-medium">Poll</span>
          <span className="ml-auto text-xs text-teal-600">Tap to expand →</span>
        </div>
        <p className="text-sm mb-2 font-medium">{poll.question}</p>
        <span className="text-xs text-gray-500">{poll.totalVotes} votes • {getTimeRemaining()}</span>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl border-2 border-teal-200 shadow-sm">
      {/* Header - clickable to collapse */}
      <div 
        className="flex items-center justify-between mb-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onCollapse?.();
        }}
      >
        <div className="flex items-center gap-2">
          <div className="text-xl">📊</div>
          <span className="text-sm text-teal-700 font-medium">Poll</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">{getTimeRemaining()}</span>
          <span className="text-xs text-teal-600 font-medium">Tap to collapse</span>
        </div>
      </div>

      <h4 className="text-sm mb-4 font-medium">{poll.question}</h4>

      {/* Voting area - not clickable for collapse */}
      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
        {poll.options.map((option) => {
          const percentage = getPercentage(option.votes);
          const isSelected = selectedOption === option.id;
          const isWinning = hasVoted && option.votes === Math.max(...poll.options.map(o => o.votes));

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted}
              className={`w-full text-left relative overflow-hidden rounded-lg transition-all ${
                hasVoted ? 'cursor-default' : 'cursor-pointer hover:scale-[1.02]'
              }`}
            >
              {/* Progress bar background */}
              {hasVoted && (
                <div
                  className={`absolute inset-0 transition-all duration-500 ${
                    isWinning ? 'bg-teal-200/60' : 'bg-gray-200/60'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              )}

              {/* Option content */}
              <div className={`relative p-3 border-2 rounded-lg ${
                hasVoted 
                  ? isWinning 
                    ? 'border-teal-400 bg-white/80' 
                    : 'border-gray-200 bg-white/60'
                  : 'border-gray-200 bg-white hover:border-teal-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {hasVoted && isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-teal-500" />
                    )}
                    <span className="text-sm">{option.text}</span>
                  </div>
                  {hasVoted && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{option.votes}</span>
                      <span className={`text-sm ${isWinning ? 'font-semibold text-teal-600' : 'text-gray-600'}`}>
                        {percentage}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-gray-500 text-center">
        {poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'}
      </div>
    </div>
  );
}