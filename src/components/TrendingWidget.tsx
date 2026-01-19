import { TrendingUp, MessageCircle, ArrowUp, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { Post } from '../App';

interface TrendingWidgetProps {
  posts: Post[];
  onViewPost: (postId: string) => void;
}

export function TrendingWidget({ posts, onViewPost }: TrendingWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate trending score for posts from last 3 days only
  const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
  const trendingPosts = posts
    .filter(p => !p.isPinned && p.timestamp.getTime() > threeDaysAgo) // Only last 3 days
    .map(post => {
      const ageInHours = (Date.now() - post.timestamp.getTime()) / (1000 * 60 * 60);
      const recencyBonus = Math.max(0, 100 - ageInHours * 1.5); // Adjusted decay for 3-day window
      const trendingScore = post.upvotes + (post.commentCount * 2) + recencyBonus;
      return { ...post, trendingScore };
    })
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, 5);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dogs':
        return 'bg-orange-100 text-orange-700';
      case 'cats':
        return 'bg-purple-100 text-purple-700';
      case 'shelters':
        return 'bg-pink-100 text-pink-700';
      case 'events':
        return 'bg-green-100 text-green-700';
      case 'lost-found':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-teal-100 text-teal-700';
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl border border-teal-100 mb-4 overflow-hidden">
      {/* Collapsed Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-white/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-sm">Trending Now</h3>
            <p className="text-xs text-gray-600">{trendingPosts.length} hot topics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && trendingPosts.length > 0 && (
            <div className="flex -space-x-1">
              {trendingPosts.slice(0, 3).map((post, index) => (
                <div
                  key={post.id}
                  className="w-6 h-6 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white"
                >
                  {index + 1}
                </div>
              ))}
            </div>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-teal-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-teal-600" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-2 animate-in slide-in-from-top duration-200">
          {trendingPosts.map((post, index) => (
            <button
              key={post.id}
              onClick={() => {
                onViewPost(post.id);
                setIsExpanded(false);
              }}
              className="w-full text-left p-3 bg-white rounded-xl hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xs">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-clamp-2 group-hover:text-teal-600 transition-colors mb-1">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className={`px-1.5 py-0.5 rounded ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500 truncate">#{post.subcategory}</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <ArrowUp className="w-3 h-3" />
                      <span>{post.upvotes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{post.commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}

          <div className="pt-2 border-t border-teal-200">
            <p className="text-xs text-center text-gray-600">
              Based on engagement and recency
            </p>
          </div>
        </div>
      )}
    </div>
  );
}