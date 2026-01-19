import { TrendingWidget } from './TrendingWidget';
import { PinPostDialog } from './PinPostDialog';
import { SponsoredBanner } from './SponsoredBanner';
import { LoadingSkeletonList } from './LoadingSkeleton';
import { ReportModal } from './ReportModal';
import { CreateForumProfile } from './CreateForumProfile'; // Import new component
import { sponsoredAds } from '../data/mockData';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Plus, TrendingUp, Clock, ArrowUp, Menu, X, Users, ChevronDown } from 'lucide-react';
import { PostCard } from './PostCard';
import { Sidebar } from './Sidebar';
import { ForumHeader } from './ForumHeader';
import { mockPosts, categories, currentUser, followingUsers } from '../data/mockData';
import type { Post, User } from '../App';
import { useTranslation } from '../utils/useTranslation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ForumProps {
  onViewPost: (postId: string) => void;
  onCreatePost: () => void;
  onViewProfile: (userId: string) => void;
  selectedCategory: string;
  selectedSubcategory: string | null;
  onCategoryChange: (categoryId: string, subcategoryId: string | null) => void;
  unreadNotifications: number;
  onNavigate: (view: any) => void;
  currentUser?: User; // Optional prop to pass active user from App
  onProfileUpdate?: (data: Partial<User>) => void; // Callback to update App user
}

type SortOption = 'hot' | 'new' | 'top' | 'following';
type TopTimeframe = 'today' | 'week' | 'month' | 'all';

// Helper to shuffle array
const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export function Forum({ 
  onViewPost, 
  onCreatePost, 
  onViewProfile, 
  selectedCategory, 
  selectedSubcategory, 
  onCategoryChange,
  unreadNotifications,
  onNavigate,
  currentUser: appUser, // Receive user from props
  onProfileUpdate
}: ForumProps) {
  const { t } = useTranslation();
  
  // State
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('hot');
  const [topTimeframe, setTopTimeframe] = useState<TopTimeframe>('week');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pinningPost, setPinningPost] = useState<Post | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  
  // Profile Creation State
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  // Initialize forumUser from props if available, otherwise use default
  const [forumUser, setForumUser] = useState<typeof currentUser>(appUser || currentUser);

  // Sync forumUser with appUser when props change
  useEffect(() => {
    if (appUser) {
      setForumUser(appUser);
    }
  }, [appUser]);

  useEffect(() => {
    // Check if user has a forum profile (only if not passed via props or needs validation)
    const profileKey = `forum_profile_${currentUser.username}`;
    const storedProfile = localStorage.getItem(profileKey);

    if (storedProfile) {
      const parsed = JSON.parse(storedProfile);
      // If we don't have appUser passed, or if we want to ensure sync
      if (!appUser) {
        setForumUser({
          ...currentUser,
          username: parsed.username,
          avatar: parsed.avatar,
          bio: parsed.bio
        });
      }
    } else {
      setShowProfileSetup(true);
    }
  }, []);

  // New posts indicator logic
  const [lastViewedFollowing, setLastViewedFollowing] = useState(new Date(Date.now() - 1000 * 60 * 60 * 24)); // Mock: checked 24h ago
  
  const unseenFollowingCount = useMemo(() => {
    return posts.filter(p => 
      followingUsers.has(p.author.id) && 
      p.timestamp > lastViewedFollowing
    ).length;
  }, [posts, lastViewedFollowing]);
  
  // Lazy loading state
  const [postsToShow, setPostsToShow] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Header visibility state
  const [showFilters, setShowFilters] = useState(true);
  const lastScrollY = useRef(0); // Use Ref to track scroll position without re-renders
  
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleCategoryChange = (categoryId: string) => {
    onCategoryChange(categoryId, null);
  };

  const setSelectedSubcategory = (categoryId: string, subcategoryId: string | null) => {
    onCategoryChange(categoryId, subcategoryId);
  };

  const handlePinPost = (postId: string, pinLevel: 'global' | 'category' | 'subcategory') => {
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === postId) {
        return { 
          ...p, 
          pinLevel, 
          isPinned: true, // Legacy compatibility
          isGlobalPin: pinLevel === 'global' // Legacy compatibility
        };
      }
      return p;
    }));
    setPinDialogOpen(false);
    setPinningPost(null);
  };

  const handleUnpinPost = (postId: string) => {
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === postId) {
        return { 
          ...p, 
          pinLevel: null, // Clear pin level
          isPinned: false, 
          isGlobalPin: false 
        };
      }
      return p;
    }));
  };

  const handleReportPost = (postId: string) => {
    setReportingPostId(postId);
    setReportModalOpen(true);
  };

  const handleToggleReaction = (postId: string, emoji: string) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id !== postId) return post;

      const reactions = post.reactions ? [...post.reactions] : [];
      const existingReactionIndex = reactions.findIndex(r => r.emoji === emoji);

      if (existingReactionIndex >= 0) {
        // Toggle existing
        const reaction = reactions[existingReactionIndex];
        if (reaction.hasReacted) {
          // Remove reaction
          reaction.count = Math.max(0, reaction.count - 1);
          reaction.hasReacted = false;
        } else {
          // Add reaction
          reaction.count += 1;
          reaction.hasReacted = true;
        }
        
        // Remove if count is 0
        if (reaction.count === 0) {
          reactions.splice(existingReactionIndex, 1);
        } else {
          reactions[existingReactionIndex] = reaction;
        }
      } else {
        // Add new reaction
        reactions.push({
          emoji,
          count: 1,
          hasReacted: true
        });
      }

      return {
        ...post,
        reactions
      };
    }));
  };

  // Filter posts based on category, subcategory, search, etc.
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const isGlobal = post.pinLevel === 'global' || post.isGlobalPin;

      // 1. Search Filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' || 
                           post.title.toLowerCase().includes(searchLower) ||
                           post.content.toLowerCase().includes(searchLower) ||
                           post.author.username.toLowerCase().includes(searchLower) ||
                           post.category.toLowerCase().includes(searchLower) ||
                           (post.subcategory && post.subcategory.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;

      // 2. Following Filter (if active)
      if (sortBy === 'following' && !followingUsers.has(post.author.id)) {
        // Global pins might still show up in 'following' feed depending on design, 
        // but typically 'following' is strict. Let's keep it strict.
        return false;
      }

      // 3. Category/Subcategory Filter
      // Global pins are ALWAYS shown unless filtered by search/following
      if (isGlobal) return true;

      if (selectedCategory === 'all') {
        return true;
      } else if (selectedSubcategory) {
        return post.subcategory === selectedSubcategory && post.category === selectedCategory;
      } else {
        return post.category === selectedCategory;
      }
    });
  }, [posts, searchQuery, sortBy, selectedCategory, selectedSubcategory]);

  // Sort posts: Global > Category Pins > Subcategory Pins > Regular
  const sortedPosts = useMemo(() => {
    const globals: Post[] = [];
    const catPins: Post[] = [];
    const subPins: Post[] = [];
    const regular: Post[] = [];

    filteredPosts.forEach(post => {
      const isGlobal = post.pinLevel === 'global' || post.isGlobalPin;
      
      // Determine if it acts as a Category Pin IN THIS CONTEXT
      // It acts as a category pin if:
      // 1. It is pinned to category
      // 2. We are viewing its category (or subcategory of its category)
      // Note: If we are in 'all' view, typically only Global pins show at top.
      const isCategoryPin = (post.pinLevel === 'category' || (post.isPinned && !post.isGlobalPin && !post.pinLevel)) 
                            && post.category === selectedCategory;

      // Determine if it acts as a Subcategory Pin IN THIS CONTEXT
      const isSubcategoryPin = post.pinLevel === 'subcategory' 
                               && post.subcategory === selectedSubcategory;

      if (isGlobal) {
        globals.push(post);
      } else if (isSubcategoryPin) {
        subPins.push(post);
      } else if (isCategoryPin) {
        catPins.push(post);
      } else {
        regular.push(post);
      }
    });

    // Randomize pins
    const shuffledGlobals = shuffle(globals);
    const shuffledCatPins = shuffle(catPins);
    const shuffledSubPins = shuffle(subPins);

    // Sort regular posts
    const sortedRegular = regular.sort((a, b) => {
       switch (sortBy) {
        case 'hot':
          // Hot: Show only posts from last 2 weeks, sorted by engagement
          const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
          const isRecentA = a.timestamp.getTime() > twoWeeksAgo;
          const isRecentB = b.timestamp.getTime() > twoWeeksAgo;
          
          if (isRecentA && !isRecentB) return -1;
          if (!isRecentA && isRecentB) return 1;
          
          if (isRecentA && isRecentB) {
            const scoreA = (a.pawvotes + a.commentCount * 2) / Math.max(1, (Date.now() - a.timestamp.getTime()) / (1000 * 60 * 60));
            const scoreB = (b.pawvotes + b.commentCount * 2) / Math.max(1, (Date.now() - b.timestamp.getTime()) / (1000 * 60 * 60));
            return scoreB - scoreA;
          }
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'new':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'top':
          const timeframeAgo = topTimeframe === 'today' ? Date.now() - (24 * 60 * 60 * 1000) :
                           topTimeframe === 'week' ? Date.now() - (7 * 24 * 60 * 60 * 1000) :
                           topTimeframe === 'month' ? Date.now() - (30 * 24 * 60 * 60 * 1000) :
                           Date.now() - (365 * 24 * 60 * 60 * 1000);
          const isTimeframeA = a.timestamp.getTime() > timeframeAgo;
          const isTimeframeB = b.timestamp.getTime() > timeframeAgo;
          
          if (isTimeframeA && !isTimeframeB) return -1;
          if (!isTimeframeA && isTimeframeB) return 1;
          
          if (isTimeframeA && isTimeframeB) {
            return b.pawvotes - a.pawvotes;
          }
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'following':
          return b.timestamp.getTime() - a.timestamp.getTime();
        default:
          return 0;
      }
    });

    // Combine based on view hierarchy
    // If viewing Subcategory: Global -> Sub Pins -> Cat Pins -> Regular
    if (selectedSubcategory) {
      return [...shuffledGlobals, ...shuffledSubPins, ...shuffledCatPins, ...sortedRegular];
    }
    // If viewing Category: Global -> Cat Pins -> Regular
    else if (selectedCategory !== 'all') {
      return [...shuffledGlobals, ...shuffledCatPins, ...sortedRegular];
    }
    // If viewing Home: Global -> Regular
    else {
      return [...shuffledGlobals, ...sortedRegular];
    }
  }, [filteredPosts, sortBy, topTimeframe, selectedCategory, selectedSubcategory]);

  // Determine if pinned badge should be shown for a post in current view
  const shouldShowPinnedBadge = (post: Post) => {
    // Always show for global
    if (post.pinLevel === 'global' || post.isGlobalPin) return true;
    
    // Show category pin if we are in that category (or subcategory of it)
    if ((post.pinLevel === 'category' || (post.isPinned && !post.pinLevel)) && 
        post.category === selectedCategory) {
      return true;
    }

    // Show subcategory pin if we are in that subcategory
    if (post.pinLevel === 'subcategory' && post.subcategory === selectedSubcategory) {
      return true;
    }

    return false;
  };

  // Lazy loading logic
  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef || isLoadingMore) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && sortedPosts.length > postsToShow) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setPostsToShow(prev => prev + 20);
            setIsLoadingMore(false);
          }, 800);
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(currentRef);
    
    return () => {
      observer.disconnect();
    };
  }, [isLoadingMore, postsToShow, sortedPosts.length]);

  // Scroll handler for header visibility and scroll-to-top
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastY = lastScrollY.current;
      
      // Filter visibility logic
      // Only update state if needed
      if (currentScrollY < 10) {
        if (!showFilters) setShowFilters(true);
      } 
      // Hide filters if scrolling down and past threshold
      else if (currentScrollY > lastY && currentScrollY > 60) {
        if (showFilters) setShowFilters(false);
      } 
      // Show filters if scrolling up significantly
      else if (currentScrollY < lastY && (lastY - currentScrollY > 20)) {
        if (!showFilters) setShowFilters(true);
      }
      
      lastScrollY.current = currentScrollY;
      
      // Scroll to top button logic
      if (currentScrollY > 300) {
        if (!showScrollTop) setShowScrollTop(true);
      } else {
        if (showScrollTop) setShowScrollTop(false);
      }
    };
    
    // Throttle scroll event slightly for performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showFilters, showScrollTop]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset postsToShow when filters change
  useEffect(() => {
    setPostsToShow(20);
    window.scrollTo({ top: 0 });
  }, [selectedCategory, selectedSubcategory, sortBy, searchQuery]);

  if (showProfileSetup) {
    return (
      <CreateForumProfile 
        initialUsername={forumUser?.username || appUser?.username || currentUser.username}
        onCancel={() => {
          // Allow user to back out if they don't want to create a profile yet
          onNavigate('home');
        }}
        onComplete={(data) => {
          const profileKey = `forum_profile_${currentUser.username}`;
          localStorage.setItem(profileKey, JSON.stringify(data));
          
          const updatedUser = {
            ...currentUser,
            username: data.username,
            avatar: data.avatar,
            bio: data.bio
          };

          setForumUser(updatedUser);

          // Notify App about the update
          if (onProfileUpdate) {
            onProfileUpdate({
              username: data.username,
              avatar: data.avatar,
              bio: data.bio
            });
          }
          
          setShowProfileSetup(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onSelectCategory={handleCategoryChange}
        onSelectSubcategory={setSelectedSubcategory}
        categories={categories}
      />

      {/* Main Content */}
      <div className="pb-16">
        {/* Sticky Header Wrapper */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm transition-all duration-300">
          {/* Top Bar - Always Visible */}
          <div className="flex items-center justify-between p-4 relative z-20 bg-white/95 backdrop-blur-sm">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-9 h-9 flex-shrink-0 rounded-xl bg-gradient-to-br from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 flex items-center justify-center text-white transition-all shadow-md hover:shadow-lg"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 truncate">
                  {selectedSubcategory ? (
                    <>
                      <span className="text-base flex-shrink-0">
                        {categories
                          .find(c => c.id === selectedCategory)
                          ?.subcategories.find(s => s.id === selectedSubcategory)?.icon}
                      </span>
                      <span className="truncate">
                        {categories
                          .find(c => c.id === selectedCategory)
                          ?.subcategories.find(s => s.id === selectedSubcategory)?.name}
                      </span>
                    </>
                  ) : selectedCategory === 'all' ? (
                    'All Posts'
                  ) : (
                    <>
                      <span className="text-base flex-shrink-0">{categories.find(c => c.id === selectedCategory)?.icon}</span>
                      <span className="truncate">{categories.find(c => c.id === selectedCategory)?.name}</span>
                    </>
                  )}
                </h2>
                {selectedSubcategory && (
                  <p className="text-xs text-gray-500 truncate">
                    {categories
                      .find(c => c.id === selectedCategory)
                      ?.subcategories.find(s => s.id === selectedSubcategory)?.description
                    }
                  </p>
                )}
              </div>
            </div>
            <ForumHeader
              unreadNotifications={unreadNotifications}
              onOpenNotifications={() => onNavigate('notifications')}
              onOpenSaved={() => onNavigate('saved')}
              onOpenSettings={() => onNavigate('settings')}
            />
          </div>

          {/* Collapsible Filters Section */}
          <div 
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              showFilters ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {/* Search */}
            <div className="relative px-3 mb-2">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('home.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {/* Sort Options - Added top padding to prevent badge clipping */}
            <div className="flex gap-2 px-3 pb-3 pt-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSortBy('hot')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                  sortBy === 'hot' 
                    ? 'bg-gradient-to-r from-teal-400 to-teal-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                {t('home.sortHot')}
              </button>
              <button
                onClick={() => setSortBy('new')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                  sortBy === 'new' 
                    ? 'bg-gradient-to-r from-teal-400 to-teal-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {t('home.sortNew')}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap outline-none ${
                      sortBy === 'top' 
                        ? 'bg-gradient-to-r from-teal-400 to-teal-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    {t('home.sortTop')}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-32 z-50">
                  {['today', 'week', 'month', 'all'].map((tf) => (
                    <DropdownMenuItem
                      key={tf}
                      onClick={() => {
                        setSortBy('top');
                        setTopTimeframe(tf as TopTimeframe);
                      }}
                      className={`${topTimeframe === tf && sortBy === 'top' ? 'text-teal-600 font-medium' : 'text-gray-700'}`}
                    >
                      {t(`time.${tf}`)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                onClick={() => {
                  setSortBy('following');
                  setLastViewedFollowing(new Date());
                }}
                className={`relative flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                  sortBy === 'following' 
                    ? 'bg-gradient-to-r from-teal-400 to-teal-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                {t('home.sortFollowing')}
                {unseenFollowingCount > 0 && sortBy !== 'following' && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white z-10">
                    {unseenFollowingCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Trending Widget */}
        {selectedCategory === 'all' && (
          <div className="px-3 pt-4">
            <TrendingWidget posts={posts} onViewPost={onViewPost} />
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-2 pb-20" ref={scrollContainerRef}>
          {sortedPosts.length > 0 ? (
            sortedPosts.slice(0, postsToShow).map((post, index) => (
              <div key={`post-wrapper-${post.id}-${index}`}>
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={() => onViewPost(post.id)}
                  onViewProfile={onViewProfile}
                  currentUser={forumUser}
                  onDelete={(postId) => {
                    setPosts(prev => prev.filter(p => p.id !== postId));
                  }}
                  onTogglePin={(postId) => {
                    const targetPost = posts.find(p => p.id === postId);
                    if (targetPost) {
                      if (targetPost.isPinned || targetPost.pinLevel) {
                        if (confirm('Unpin this post?')) {
                          handleUnpinPost(postId);
                        }
                      } else {
                        setPinningPost(targetPost);
                        setPinDialogOpen(true);
                      }
                    }
                  }}
                  onToggleSave={(postId) => {
                     setPosts(prev => prev.map(p => 
                      p.id === postId ? { ...p, isSaved: !p.isSaved } : p
                    ));
                  }}
                  onCategoryClick={(categoryId, subcategoryId) => {
                    onCategoryChange(categoryId, subcategoryId);
                  }}
                  onEdit={(postId, newTitle, newContent, newCategory, newSubcategory) => {
                    setPosts(prev => prev.map(p => {
                      if (p.id === postId) {
                        const history = p.editHistory || [];
                        return {
                          ...p,
                          title: newTitle,
                          content: newContent,
                          category: newCategory || p.category,
                          subcategory: newSubcategory || p.subcategory,
                          isEdited: true,
                          editHistory: [
                            {
                              content: p.content,
                              title: p.title,
                              editedAt: new Date(),
                              editedBy: forumUser.id
                            },
                            ...history
                          ]
                        };
                      }
                      return p;
                    }));
                  }}
                  onBlockUser={(userId) => {
                    if (confirm('Are you sure you want to block this user? This will remove all their posts and comments.')) {
                      setPosts(prev => prev.filter(p => p.author.id !== userId));
                      // In a real app, we would also call an API to block the user
                      alert('User blocked and content removed.');
                    }
                  }}
                  onReport={handleReportPost}
                  onToggleReaction={handleToggleReaction}
                  shouldShowPinnedBadge={shouldShowPinnedBadge(post)}
                />
                
                {/* Show sponsored ad after every 10th post (not after pinned posts) */}
                {!(post.isPinned || post.pinLevel) && (index + 1) % 10 === 0 && (
                  <div className="p-3 bg-gray-50/50">
                    <SponsoredBanner
                      ad={sponsoredAds[Math.floor(((index + 1) / 10 - 1) % sponsoredAds.length)]}
                      onImpression={(adId) => { /* Track impression in analytics */ }}
                      onClick={(adId) => { /* Track click in analytics */ }}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">{t('home.noPosts')}</p>
              <p className="text-xs mt-1">{t('home.noPostsSubtext')}</p>
            </div>
          )}
          {isLoadingMore && (
            <div className="p-3">
              <LoadingSkeletonList count={5} />
            </div>
          )}
          <div ref={loadMoreRef} className="h-4" />
        </div>

        {/* Floating Action Button */}
        <button
          onClick={onCreatePost}
          className="fixed bottom-20 right-4 w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 text-white rounded-2xl shadow-lg flex items-center justify-center hover:from-teal-500 hover:to-teal-600 transition-all z-20"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-36 right-4 w-12 h-12 bg-white border-2 border-teal-400 text-teal-500 rounded-2xl shadow-lg flex items-center justify-center hover:bg-teal-50 transition-all z-20 animate-bounce"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Pin Post Dialog */}
      <PinPostDialog
        isOpen={pinDialogOpen}
        onClose={() => {
          setPinDialogOpen(false);
          setPinningPost(null);
        }}
        onPin={(level) => pinningPost && handlePinPost(pinningPost.id, level)}
        postTitle={pinningPost?.title || ''}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false);
          setReportingPostId(null);
        }}
        onSubmit={(reason, details) => {
          // Here we would submit the report to backend
          console.log('Report submitted:', { postId: reportingPostId, reason, details });
          
          // Show confirmation
          alert(t('report.thankYou'));
          
          setReportModalOpen(false);
          setReportingPostId(null);
        }}
        type="post"
      />
    </div>
  );
}