import { ArrowLeft, BadgeCheck, Award, MapPin, Phone, Mail, Globe, UserX, UserPlus, UserCheck, Calendar, TrendingUp, Flame, Clock, MessageCircle, ArrowUp, FileText, ChevronDown, Heart, Smile, Users, Shield, ShieldCheck, AlertTriangle, Ban, X, Edit2, Trash2, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ForumHeader } from './ForumHeader';
import { mockUsers, mockPosts, currentUser, blockedUsers, followingUsers, allAchievements, mockComments, mockFollowers, mockFollowing, followersMap } from '../data/mockData';
import { AchievementBadge } from './AchievementBadge';
import { ModeratorHistoryCard } from './ModeratorHistoryCard';
import { UserHistoryModal } from './UserHistoryModal';
import { FollowersModal } from './FollowersModal';
import { CoverPhotoEditor, type CoverPhotoOption } from './CoverPhotoEditor';
import { OnlineStatusIndicator } from './OnlineStatusIndicator';
import type { Achievement, Comment, User } from '../App';

interface ProfileProps {
  userId: string;
  onBack: () => void;
  unreadNotifications: number;
  onNavigate: (view: 'notifications' | 'saved' | 'settings') => void;
  onViewPost: (postId: string) => void;
  onViewProfile: (userId: string) => void;
  showBackButton?: boolean;
  onCreatePost?: () => void;
}

type TabType = 'posts' | 'about';
type SortOption = 'recent' | 'hot' | 'top';

export function Profile({ userId, onBack, unreadNotifications, onNavigate, onViewPost, onViewProfile, showBackButton = true, currentUser: appUser, onCreatePost }: ProfileProps & { currentUser?: User }) {
  const activeUser = appUser || currentUser;
  // If viewing own profile, use activeUser, otherwise find in mockUsers
  // Note: For other users, we still rely on mockUsers as we don't have a backend
  const user = userId === activeUser.id ? activeUser : mockUsers.find(u => u.id === userId);
  
  const userPosts = mockPosts.filter(p => p.author.id === userId);
  const [isBlocked, setIsBlocked] = useState(blockedUsers.has(userId));
  const [isFollowing, setIsFollowing] = useState(followingUsers.has(userId));
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showUserHistory, setShowUserHistory] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banDuration, setBanDuration] = useState<'1d' | '7d' | '30d' | 'permanent'>('7d');
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showCoverEditor, setShowCoverEditor] = useState(false);
  const [showProfessionalContact, setShowProfessionalContact] = useState(false);
  const isOwnProfile = userId === activeUser.id;
  const isAdmin = activeUser.role === 'admin' || activeUser.role === 'moderator';

  // Load cover photo from localStorage
  const [coverPhoto, setCoverPhoto] = useState<CoverPhotoOption>(() => {
    const saved = localStorage.getItem(`coverPhoto_${userId}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return { type: 'achievement', value: '' };
  });

  // Save cover photo to localStorage
  const handleSaveCoverPhoto = (newCover: CoverPhotoOption) => {
    setCoverPhoto(newCover);
    localStorage.setItem(`coverPhoto_${userId}`, JSON.stringify(newCover));
  };

  // Get followers/following lists
  const followerIds = followersMap.get(userId) || [];
  // For following, if viewing current user's profile, use followingUsers set; otherwise empty
  const followingIds = userId === activeUser.id ? Array.from(followingUsers) : [];
  const followerUsersList = mockUsers.filter(u => followerIds.includes(u.id));
  const followingUsersList = mockUsers.filter(u => followingIds.includes(u.id));

  // Mock followers count (in real app would be from database)
  const followersCount = followerIds.length || (userId === '2' ? 1234 : userId === '3' ? 3456 : userId === '4' ? 892 : 156);
  const followingCount = followingIds.length || (userId === '2' ? 89 : userId === '3' ? 234 : userId === '4' ? 45 : 78);

  if (!user) {
    return <div>User not found</div>;
  }

  // Calculate stats
  const totalPawvotes = userPosts.reduce((sum, post) => sum + post.pawvotes, 0);
  const totalComments = userPosts.reduce((sum, post) => sum + post.commentCount, 0);
  const currentStreak = user.currentStreak || 0;
  const bestStreak = user.bestStreak || currentStreak;

  // Get streak colors based on streak length
  const getStreakColors = (streak: number) => {
    if (streak >= 100) {
      return {
        bg: 'from-orange-400 via-red-500 to-pink-500',
        border: 'border-red-400',
        iconColor: 'text-white',
        textColor: 'text-white',
        gradientStrong: 'from-orange-400 via-red-500 to-pink-500'
      };
    } else if (streak >= 50) {
      return {
        bg: 'from-red-50 to-orange-50',
        border: 'border-red-200',
        iconColor: 'text-red-500',
        textColor: 'text-red-600',
        gradientStrong: 'from-red-400 to-red-500'
      };
    } else if (streak >= 20) {
      return {
        bg: 'from-orange-50 to-red-50',
        border: 'border-orange-300',
        iconColor: 'text-orange-600',
        textColor: 'text-orange-700',
        gradientStrong: 'from-orange-400 to-red-400'
      };
    } else {
      return {
        bg: 'from-orange-50 to-orange-100',
        border: 'border-orange-200',
        iconColor: 'text-orange-500',
        textColor: 'text-orange-700',
        gradientStrong: 'from-orange-300 to-orange-400'
      };
    }
  };

  const streakColors = getStreakColors(currentStreak);

  // Additional stats calculations
  // Count comments written by user
  const countUserComments = (comments: Comment[]): number => {
    let count = 0;
    comments.forEach(comment => {
      if (comment.author.id === userId) count++;
      if (comment.replies) count += countUserComments(comment.replies);
    });
    return count;
  };
  
  // Get all comments from all posts and count user's comments
  const commentsWritten = Object.values(mockComments).reduce((total, postComments) => {
    return total + countUserComments(postComments);
  }, 0);

  // Count pawvotes given (mock data - in real app would be from database)
  const pawvotesGiven = userPosts.filter(p => p.hasUpvoted).length + Math.floor(commentsWritten * 0.6);

  // Count reactions given (mock - would be from database)
  const reactionsGiven = userPosts.reduce((sum, post) => {
    return sum + (post.reactions?.filter(r => r.hasReacted).length || 0);
  }, 0) + Math.floor(userPosts.length * 0.3);

  // Count reactions received
  const reactionsReceived = userPosts.reduce((sum, post) => {
    return sum + (post.reactions?.reduce((total, r) => total + r.count, 0) || 0);
  }, 0);

  // Achievement stats
  const totalAchievements = user.achievements?.length || 0;
  const totalPossibleAchievements = allAchievements.length;
  
  // Calculate Reputation Score with weighted formula
  // Formula: 
  // - Pawvotes Received × 2 (quality content)
  // - Posts × 5 (contribution)
  // - Comments Written × 1 (engagement)
  // - Comments Received × 3 (discussion starter)
  // - Reactions Received × 2 (emotional impact)
  // - Achievement Count × 50 (milestones)
  // - Current Streak × 10 (consistency)
  // - Followers × 0.5 (community trust)
  
  const reputation = Math.round(
    (totalPawvotes * 2) +
    (userPosts.length * 5) +
    (commentsWritten * 1) +
    (totalComments * 3) +
    (reactionsReceived * 2) +
    (totalAchievements * 50) +
    (currentStreak * 10) +
    (followersCount * 0.5)
  );

  // Most active category
  const categoryCount: { [key: string]: number } = {};
  userPosts.forEach(post => {
    categoryCount[post.category] = (categoryCount[post.category] || 0) + 1;
  });
  const mostActiveCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
  
  // Get pretty category name
  const getCategoryName = (catId: string) => {
    const categoryMap: { [key: string]: string } = {
      'dogs': 'Dogs',
      'cats': 'Cats',
      'shelters': 'Shelters & Rescue',
      'general': 'General',
      'events': 'Events',
      'lost-found': 'Lost & Found'
    };
    return categoryMap[catId] || catId;
  };

  // Average pawvotes per post
  const avgPawvotes = userPosts.length > 0 ? Math.round(totalPawvotes / userPosts.length) : 0;

  // Time ago helper
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Get cover gradient based on achievements
  const getCoverGradient = () => {
    const achievements = user.achievements || [];
    if (achievements.some(a => a.level === 'platinum')) {
      return 'from-purple-400 via-pink-400 to-teal-400';
    }
    if (achievements.some(a => a.level === 'gold')) {
      return 'from-yellow-400 via-teal-400 to-blue-400';
    }
    if (achievements.some(a => a.level === 'silver')) {
      return 'from-gray-400 via-teal-400 to-blue-400';
    }
    return 'from-teal-400 to-blue-400';
  };

  const handleBlockUser = () => {
    if (isBlocked) {
      blockedUsers.delete(userId);
      setIsBlocked(false);
    } else {
      blockedUsers.add(userId);
      setIsBlocked(true);
      // Auto-unfollow when blocking
      if (isFollowing) {
        followingUsers.delete(userId);
        setIsFollowing(false);
      }
    }
  };

  const handleFollowUser = () => {
    if (isFollowing) {
      followingUsers.delete(userId);
      setIsFollowing(false);
    } else {
      followingUsers.add(userId);
      setIsFollowing(true);
    }
  };

  // Calculate achievement progress for each multi-level group
  const getAchievementProgress = () => {
    const userAchievements = user.achievements || [];
    
    const groups = [
      {
        name: 'Prolific Poster',
        icon: '✍️',
        achievements: allAchievements.filter(a => a.name === 'Prolific Poster'),
        current: userPosts.length
      },
      {
        name: 'Helpful Member',
        icon: '👍',
        achievements: allAchievements.filter(a => a.name === 'Helpful Member'),
        current: totalPawvotes
      },
      {
        name: 'Conversation Starter',
        icon: '💬',
        achievements: allAchievements.filter(a => a.name === 'Conversation Starter'),
        current: totalComments
      },
      {
        name: 'Daily Streak',
        icon: '🔥',
        achievements: allAchievements.filter(a => a.name === 'Daily Streak'),
        current: currentStreak
      }
    ];

    return groups.map(group => {
      const unlocked = group.achievements.filter(a => 
        userAchievements.some(ua => ua.id === a.id)
      );
      const nextLevel = group.achievements.find(a => 
        !userAchievements.some(ua => ua.id === a.id)
      );

      return {
        ...group,
        unlockedCount: unlocked.length,
        totalCount: group.achievements.length,
        nextLevel
      };
    });
  };

  const getRequirementFromDesc = (desc: string) => {
    const match = desc.match(/(\\d+)/);
    return match ? parseInt(match[0]) : 0;
  };

  // Sort user posts
  const sortedUserPosts = [...userPosts].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.timestamp.getTime() - a.timestamp.getTime();
      case 'hot':
        // Hot algorithm: Recent posts with engagement (pawvotes + comments)
        const hoursSinceA = (Date.now() - a.timestamp.getTime()) / (1000 * 60 * 60);
        const hoursSinceB = (Date.now() - b.timestamp.getTime()) / (1000 * 60 * 60);
        const scoreA = (a.pawvotes + a.commentCount * 2) / Math.pow(hoursSinceA + 2, 1.5);
        const scoreB = (b.pawvotes + b.commentCount * 2) / Math.pow(hoursSinceB + 2, 1.5);
        return scoreB - scoreA;
      case 'top':
        // Top: All-time best by pawvotes
        return b.pawvotes - a.pawvotes;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            {showBackButton && (
              <button onClick={onBack} className="text-gray-600 hover:text-teal-500 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className={showBackButton ? "" : "ml-1"}>
              <h2 className="text-sm font-semibold">{user.username}</h2>
              <p className="text-xs text-gray-500">{userPosts.length} posts</p>
            </div>
          </div>
          <ForumHeader
            unreadNotifications={unreadNotifications}
            onOpenNotifications={() => onNavigate('notifications')}
            onOpenSaved={() => onNavigate('saved')}
            onOpenSettings={() => onNavigate('settings')}
          />
        </div>
      </div>

      {/* Cover Photo */}
      <div className="relative h-32 z-0">
        {coverPhoto.type === 'image' ? (
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: coverPhoto.value.startsWith('unsplash:') 
                ? `url(https://images.unsplash.com/photo-${Date.now()}?w=800&h=320&fit=crop)` 
                : `url(${coverPhoto.value})`
            }}
          />
        ) : coverPhoto.type === 'gradient' ? (
          <div className={`w-full h-full bg-gradient-to-r ${coverPhoto.value}`} />
        ) : (
          <div className={`w-full h-full bg-gradient-to-r ${getCoverGradient()}`} />
        )}
        
        {/* Edit Cover Button - Only for own profile */}
        {isOwnProfile && (
          <button
            onClick={() => setShowCoverEditor(true)}
            className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-md transition-all flex items-center gap-1.5 text-xs backdrop-blur-sm border border-gray-200/50"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Edit Cover</span>
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 -mt-12 mb-4 relative z-10">
        <div className="flex items-end justify-between mb-3">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-24 h-24 rounded-full ring-4 ring-white shadow-lg"
            />
            <OnlineStatusIndicator user={user} size="md" position="bottom-right" />
          </div>
          {!isOwnProfile && (
            <div className="flex gap-2 mb-2">
              <button
                onClick={handleFollowUser}
                disabled={isBlocked}
                className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${ 
                  isBlocked
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isFollowing
                    ? 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200'
                    : 'bg-gradient-to-r from-teal-400 to-teal-500 text-white hover:from-teal-500 hover:to-teal-600 shadow-md'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Follow</span>
                  </>
                )}
              </button>
              <button
                onClick={handleBlockUser}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${ 
                  isBlocked
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <UserX className="w-4 h-4" />
                <span>{isBlocked ? 'Blocked' : 'Block'}</span>
              </button>
            </div>
          )}
        </div>

        <div className="mb-3">
          <h3 className="text-xl mb-2">{user.username}</h3>
          
          {/* Followers/Following/Posts Stats - Instagram style */}
          <div className="flex items-center gap-5 mb-3">
            {isOwnProfile ? (
              <>
                {/* Own Profile - Clickable to view lists */}
                <button 
                  onClick={() => setShowFollowersModal(true)}
                  className="hover:opacity-70 transition-opacity text-left"
                >
                  <span className="text-gray-900 mr-1">{followersCount.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">followers</span>
                </button>
                <button 
                  onClick={() => setShowFollowingModal(true)}
                  className="hover:opacity-70 transition-opacity text-left"
                >
                  <span className="text-gray-900 mr-1">{followingCount.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">following</span>
                </button>
              </>
            ) : (
              <>
                {/* Other User's Profile - Just numbers, no click */}
                <div>
                  <span className="text-gray-900 mr-1">{followersCount.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">followers</span>
                </div>
                <div>
                  <span className="text-gray-900 mr-1">{followingCount.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">following</span>
                </div>
              </>
            )}
            <div>
              <span className="text-gray-900 mr-1">{userPosts.length}</span>
              <span className="text-sm text-gray-500">posts</span>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-sm text-gray-700 mb-3">{user.bio}</p>
          )}

          {/* All badges in one consistent row - Role + Streak + Achievements */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Role Badge */}
            {user.role === 'vet' && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-full">
                <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs text-blue-700">Verified Vet</span>
              </div>
            )}
            {user.role === 'trainer' && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-full">
                <BadgeCheck className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs text-green-700">Certified Trainer</span>
              </div>
            )}
            {user.role === 'admin' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-xs font-medium ml-1">Admin</span>
              </span>
            )}
            {user.role === 'moderator' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full">
                <Shield className="w-3.5 h-3.5" />
                <span className="text-xs font-medium ml-1">Mod</span>
              </span>
            )}

            {/* Streak Badge */}
            {currentStreak > 0 && (
              <div className={`inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r ${streakColors.bg} border ${streakColors.border} rounded-full`}>
                <Flame className={`w-3.5 h-3.5 ${streakColors.iconColor}`} />
                <span className={`text-xs ${streakColors.textColor}`}>{currentStreak} day streak</span>
              </div>
            )}

            {/* Achievement Badges */}
            {user.displayedBadges && user.displayedBadges.length > 0 && user.achievements && (
              <>
                {user.displayedBadges
                  .map(badgeId => user.achievements?.find(a => a.id === badgeId))
                  .filter(Boolean)
                  .map((achievement) => (
                    <AchievementBadge 
                      key={achievement!.id} 
                      achievement={achievement!} 
                      size="xs"
                    />
                  ))}
              </>
            )}
          </div>
        </div>

        {/* Professional Contact Info - Prominent for Verified Professionals */}
        {(user.role === 'vet' || user.role === 'trainer') && user.professionalInfo && (
          <div className="mb-4">
            {/* Collapsed Header - Always visible */}
            <button
              onClick={() => setShowProfessionalContact(!showProfessionalContact)}
              className="w-full p-3 bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50 border-2 border-teal-200 rounded-2xl shadow-sm flex items-center justify-between hover:border-teal-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">📞</span>
                <span className="text-sm text-teal-900">Professional Contact</span>
              </div>
              <ChevronDown 
                className={`w-4 h-4 text-teal-600 transition-transform ${showProfessionalContact ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* Expandable Content */}
            {showProfessionalContact && (
              <div className="mt-2 p-4 bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50 border-2 border-teal-200 rounded-2xl shadow-sm space-y-3">
                {user.professionalInfo.businessName && (
                  <div className="flex items-start gap-3 p-2.5 bg-white/70 rounded-xl">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <span className="text-base">🏢</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Business Name</p>
                      <p className="text-sm text-gray-900">{user.professionalInfo.businessName}</p>
                    </div>
                  </div>
                )}
                {user.professionalInfo.address && (
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(user.professionalInfo.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-2.5 bg-white/70 rounded-xl hover:bg-white transition-colors active:scale-[0.98]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MapPin className="w-4 h-4 text-teal-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Location</p>
                      <p className="text-sm text-teal-700 font-medium hover:underline">{user.professionalInfo.address}</p>
                    </div>
                  </a>
                )}
                {user.professionalInfo.phone && (
                  <a 
                    href={`tel:${user.professionalInfo.phone}`}
                    className="flex items-start gap-3 p-2.5 bg-white/70 rounded-xl hover:bg-white transition-colors active:scale-[0.98]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone className="w-4 h-4 text-teal-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Phone</p>
                      <p className="text-sm text-teal-700 font-medium hover:underline">{user.professionalInfo.phone}</p>
                    </div>
                  </a>
                )}
                {user.professionalInfo.email && (
                  <a 
                    href={`mailto:${user.professionalInfo.email}`}
                    className="flex items-start gap-3 p-2.5 bg-white/70 rounded-xl hover:bg-white transition-colors active:scale-[0.98]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Mail className="w-4 h-4 text-teal-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="text-sm text-teal-700 font-medium hover:underline break-all">{user.professionalInfo.email}</p>
                    </div>
                  </a>
                )}
                {user.professionalInfo.website && (
                  <a 
                    href={user.professionalInfo.website.startsWith('http') ? user.professionalInfo.website : `https://${user.professionalInfo.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-2.5 bg-white/70 rounded-xl hover:bg-white transition-colors active:scale-[0.98]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Globe className="w-4 h-4 text-teal-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Website</p>
                      <p className="text-sm text-teal-700 font-medium hover:underline break-all">{user.professionalInfo.website}</p>
                    </div>
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="sticky top-[57px] z-10 bg-white border-b border-gray-100">
        <div className="flex px-4">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 text-sm transition-colors relative ${
              activeTab === 'posts' ? 'text-teal-600' : 'text-gray-600'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Posts</span>
            </div>
            {activeTab === 'posts' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-3 text-sm transition-colors relative ${
              activeTab === 'about' ? 'text-teal-600' : 'text-gray-600'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span>About</span>
            </div>
            {activeTab === 'about' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" />
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-3">
            {/* Create Post Card - Only for own profile */}
            {isOwnProfile && onCreatePost && (
              <div 
                onClick={onCreatePost}
                className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors mb-2"
              >
                <img 
                  src={activeUser.avatar} 
                  alt={activeUser.username}
                  className="w-10 h-10 rounded-full bg-gray-100"
                />
                <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm text-gray-500">
                  What's on your mind?
                </div>
                <div className="p-2 bg-teal-50 rounded-full text-teal-600">
                  <Edit2 className="w-4 h-4" />
                </div>
              </div>
            )}

            {/* Sort Filter */}
            {userPosts.length > 0 && (
              <div className="flex gap-2 pb-2 border-b border-gray-100">
                <button
                  onClick={() => setSortBy('recent')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    sortBy === 'recent'
                      ? 'bg-teal-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Recent</span>
                  </div>
                </button>
                <button
                  onClick={() => setSortBy('hot')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    sortBy === 'hot'
                      ? 'bg-teal-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Hot</span>
                  </div>
                </button>
                <button
                  onClick={() => setSortBy('top')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    sortBy === 'top'
                      ? 'bg-teal-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>Top</span>
                  </div>
                </button>
              </div>
            )}

            {userPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No posts yet</p>
              </div>
            ) : (
              sortedUserPosts.map(post => (
                <div 
                  key={post.id} 
                  className="p-3 bg-white border border-gray-100 rounded-2xl hover:border-teal-200 transition-colors"
                >
                  <div 
                    className="cursor-pointer"
                    onClick={() => onViewPost(post.id)}
                  >
                    <h5 className="text-sm mb-1.5">{post.title}</h5>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{post.content}</p>
                    <div className="flex items-center gap-3 text-gray-500 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="text-base">🐾</span>
                        {post.pawvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {post.commentCount}
                      </span>
                      <span className="ml-auto text-gray-400">{getTimeAgo(post.timestamp)}</span>
                    </div>
                  </div>

                  {/* Edit/Delete buttons (only for own posts) */}
                  {isOwnProfile && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('Edit Post functionality!\\n\\nIn real app: Opens EditPostModal');
                        }}
                        className="flex-1 px-3 py-1.5 text-xs bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${post.title}"?`)) {
                            alert('Delete Post functionality!\\n\\nIn real app: Removes post from list');
                          }
                        }}
                        className="flex-1 px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-4">
            {/* Member Since */}
            {user.memberSince && (
              <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-teal-500" />
                  <div>
                    <p className="text-xs text-gray-500">Member since</p>
                    <p className="text-sm">
                      {user.memberSince.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Streak Info */}
            {(currentStreak > 0 || bestStreak > 0) && (
              <div className={`p-4 bg-gradient-to-br ${streakColors.bg} border ${streakColors.border} rounded-2xl`}>
                <div className="flex items-center gap-2 mb-3">
                  <Flame className={`w-5 h-5 ${streakColors.iconColor}`} />
                  <h5 className="text-sm">Daily Login Streak</h5>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Current Streak</p>
                    <p className={`text-lg ${streakColors.textColor}`}>{currentStreak} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Best Streak</p>
                    <p className={`text-lg ${currentStreak >= 100 ? 'text-white' : 'text-orange-600'}`}>{bestStreak} days</p>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Stats */}
            <div className="p-4 bg-white border border-gray-100 rounded-2xl">
              <h5 className="text-sm mb-3">Activity Stats</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Total Posts</span>
                  <span className="text-sm">{userPosts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Comments Written</span>
                  <span className="text-sm">{commentsWritten.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Comments Received</span>
                  <span className="text-sm">{totalComments.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Pawvotes Given</span>
                  <span className="text-sm">{pawvotesGiven.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Pawvotes Received</span>
                  <span className="text-sm text-teal-600">{totalPawvotes.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Reactions Given</span>
                  <span className="text-sm">{reactionsGiven.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Reactions Received</span>
                  <span className="text-sm">{reactionsReceived.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-2">
                  <span className="text-xs text-gray-600">Reputation Score</span>
                  <span className="text-sm text-teal-600">{reputation.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Moderator History - Only visible to moderators/admins */}
            {(currentUser.role === 'admin' || currentUser.role === 'moderator') && !isOwnProfile && (
              <ModeratorHistoryCard user={user} getTimeAgo={getTimeAgo} />
            )}

            {/* ADMIN ACTIONS - Ban User + View History */}
            {isAdmin && !isOwnProfile && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  <h5 className="text-sm text-red-900">Admin Actions</h5>
                </div>
                
                {/* View User History */}
                <button
                  onClick={() => setShowUserHistory(true)}
                  className="w-full px-4 py-2.5 bg-white hover:bg-gray-50 border border-red-200 text-red-700 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <AlertTriangle className="w-4 h-4" />
                  View User History
                </button>

                {/* Ban User */}
                <button
                  onClick={() => setShowBanModal(true)}
                  className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Ban className="w-4 h-4" />
                  Ban User
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User History Modal */}
      {showUserHistory && user && (
        <UserHistoryModal
          user={user}
          onClose={() => setShowUserHistory(false)}
          onViewPost={onViewPost}
        />
      )}

      {/* Ban User Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg flex items-center gap-2">
                <Ban className="w-5 h-5 text-red-600" />
                Ban User
              </h2>
              <button
                onClick={() => setShowBanModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm">{user.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Duration</label>
                <div className="grid grid-cols-4 gap-2">
                  {['1d', '7d', '30d', 'permanent'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setBanDuration(d as any)}
                      className={`py-2 text-sm rounded-lg border transition-all ${
                        banDuration === d
                          ? 'bg-red-50 border-red-200 text-red-700 font-medium'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {d === 'permanent' ? 'Perm' : d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowBanModal(false)}
                  className="flex-1 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(`User banned for ${banDuration}`);
                    setShowBanModal(false);
                    onBack();
                  }}
                  className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                >
                  Ban User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Followers Modal */}
      {showFollowersModal && (
        <FollowersModal
          type="followers"
          users={followerUsersList}
          onClose={() => setShowFollowersModal(false)}
          onViewProfile={(uid) => {
            setShowFollowersModal(false);
            onViewProfile(uid);
          }}
          currentUserId={currentUser.id}
          onFollow={(uid) => {
             // Mock follow logic
             console.log('Follow', uid);
          }}
        />
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <FollowersModal
          type="following"
          users={followingUsersList}
          onClose={() => setShowFollowingModal(false)}
          onViewProfile={(uid) => {
            setShowFollowingModal(false);
            onViewProfile(uid);
          }}
          currentUserId={currentUser.id}
          onFollow={(uid) => {
             // Mock follow logic
             console.log('Follow', uid);
          }}
        />
      )}

      {/* Cover Photo Editor */}
      {showCoverEditor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold">Edit Cover Photo</h3>
              <button onClick={() => setShowCoverEditor(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <CoverPhotoEditor
              current={coverPhoto}
              onSave={(newCover) => {
                handleSaveCoverPhoto(newCover);
                setShowCoverEditor(false);
              }}
              onClose={() => setShowCoverEditor(false)}
              achievements={user.achievements || []}
            />
          </div>
        </div>
      )}
    </div>
  );
}