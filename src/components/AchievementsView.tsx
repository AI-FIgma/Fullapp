import { useState, useRef, useEffect } from 'react';
import { Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { allAchievements, currentUser, mockPosts, mockUsers, followersMap } from '../data/mockData';
import type { Achievement } from '../App';

interface AchievementsViewProps {
  onBack: () => void;
}

// Achievement group names for mutual exclusivity
const achievementGroups = [
  'Prolific Poster',
  'Helpful Member',
  'Conversation Starter',
  'Active Commenter',
  'Daily Streak',
  'Reaction Enthusiast',
  'Supportive Member',
  'Dog Specialist',
  'Cat Specialist',
  'Shelter Champion',
  'Lost & Found Hero',
  'Event Maven',
  'Popular Creator',
  'Community Builder',
  'Social Butterfly'
];

// Special achievements configurations (one-off achievements)
const specialAchievementsConfig = [
  {
    id: 'welcome-aboard',
    name: 'Welcome Aboard',
    icon: '👋',
    color: 'from-blue-400 to-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    description: 'Complete your profile and join the community',
    howToGet: 'Fill out your bio and upload an avatar'
  },
  {
    id: 'first-post',
    name: 'First Post',
    icon: '🎉',
    color: 'from-green-400 to-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    description: 'Share your first post with the community',
    howToGet: 'Create your first post in any category'
  },
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    icon: '🎖️',
    color: 'from-yellow-400 to-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    description: 'Joined within the first month of launch',
    howToGet: 'Be one of the first members to join'
  },
  {
    id: 'veteran-member',
    name: 'Veteran Member',
    icon: '⭐',
    color: 'from-orange-400 to-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    description: 'Been a member for over 1 year',
    howToGet: 'Stay active for 1 year'
  },
  {
    id: 'trusted-veteran',
    name: 'Trusted Veteran',
    icon: '💎',
    color: 'from-purple-400 to-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    description: 'Been a trusted member for over 2 years',
    howToGet: 'Stay active for 2 years'
  },
  {
    id: 'verified-professional',
    name: 'Verified Professional',
    icon: '✅',
    color: 'from-teal-400 to-teal-500',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    description: 'Verified veterinarian or trainer',
    howToGet: 'Submit verification documents as a vet or trainer'
  },
  {
    id: 'moderator-badge',
    name: 'Community Moderator',
    icon: '🛡️',
    color: 'from-red-400 to-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    description: 'Helping keep the community safe',
    howToGet: 'Be appointed as a community moderator'
  },
  {
    id: 'poll-master',
    name: 'Poll Master',
    icon: '📊',
    color: 'from-indigo-400 to-indigo-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    description: 'Created 10 engaging polls',
    howToGet: 'Create 10 polls that get good engagement'
  }
];

export function AchievementsView({ onBack }: AchievementsViewProps) {
  const userAchievements = currentUser.achievements || [];
  
  // Clean up displayedBadges - keep only highest level from each group
  const cleanDisplayedBadges = () => {
    const badges = currentUser.displayedBadges || [];
    const cleaned: string[] = [];
    
    badges.forEach(badgeId => {
      const achievement = allAchievements.find(a => a.id === badgeId);
      if (!achievement) return;
      
      // Check if it's from a multi-level group
      const isMultiLevel = achievementGroups.includes(achievement.name);
      
      if (isMultiLevel) {
        // Check if we already have a badge from this group
        const groupAchievements = allAchievements.filter(a => a.name === achievement.name);
        const existingFromGroup = cleaned.find(id => 
          groupAchievements.some(ga => ga.id === id)
        );
        
        if (!existingFromGroup) {
          // No badge from this group yet, add this one
          cleaned.push(badgeId);
        } else {
          // Already have a badge from this group - keep the higher level
          const existingAch = allAchievements.find(a => a.id === existingFromGroup);
          const levelOrder = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
          const existingLevel = levelOrder[existingAch?.level as keyof typeof levelOrder] || 0;
          const currentLevel = levelOrder[achievement.level as keyof typeof levelOrder] || 0;
          
          if (currentLevel > existingLevel) {
            // Replace with higher level
            const index = cleaned.indexOf(existingFromGroup);
            cleaned[index] = badgeId;
          }
        }
      } else {
        // Special achievement - just add it
        cleaned.push(badgeId);
      }
    });
    
    return cleaned;
  };
  
  const [selectedBadges, setSelectedBadges] = useState<string[]>(cleanDisplayedBadges());
  
  // Calculate user stats for progress
  const userPosts = mockPosts.filter(p => p.author.id === currentUser.id);
  const totalPawvotes = userPosts.reduce((sum, post) => sum + post.pawvotes, 0);
  const totalComments = userPosts.reduce((sum, post) => sum + post.commentCount, 0);
  
  // Mock additional stats (in real app would come from backend)
  const totalReactions = userPosts.reduce((sum, post) => {
    return sum + (post.reactions?.reduce((total, r) => total + r.count, 0) || 0);
  }, 0);
  const commentsGiven = 120; // Mock - would be actual comments written by user
  const pawvotesGiven = 180; // Mock - would be actual pawvotes given by user
  
  // Followers count
  const followersCount = followersMap.get(currentUser.id)?.length || 0;
  
  // Category-specific post counts
  const dogsPosts = userPosts.filter(p => p.category === 'dogs').length;
  const catsPosts = userPosts.filter(p => p.category === 'cats').length;
  const shelterPosts = userPosts.filter(p => p.category === 'shelters').length;
  const lostFoundPosts = userPosts.filter(p => p.category === 'lost-found').length;
  const eventPosts = userPosts.filter(p => p.category === 'events').length;
  
  // Popular posts count (posts with high pawvotes)
  const popularPosts50 = userPosts.filter(p => p.pawvotes >= 50).length;
  const popularPosts100 = userPosts.filter(p => p.pawvotes >= 100).length;
  const popularPosts150 = userPosts.filter(p => p.pawvotes >= 150).length;
  const popularPosts200 = userPosts.filter(p => p.pawvotes >= 200).length;
  
  // Categories user has posted in
  const categoriesPostedIn = new Set(userPosts.map(p => p.category)).size;
  
  // Member months
  const memberMonths = currentUser.memberSince 
    ? Math.floor((new Date().getTime() - currentUser.memberSince.getTime()) / (1000 * 60 * 60 * 24 * 30))
    : 0;
  
  // Streak stats
  const currentStreak = currentUser.currentStreak || 0;
  const bestStreak = currentUser.bestStreak || 0;

  const isUnlocked = (achievementId: string) => {
    return userAchievements.some(a => a.id === achievementId);
  };

  const toggleBadgeSelection = (achievementId: string) => {
    // Find the achievement
    const achievement = allAchievements.find(a => a.id === achievementId);
    if (!achievement) return;
    
    // Check if it's from a multi-level group
    const isMultiLevel = achievementGroups.includes(achievement.name);
    
    if (isMultiLevel) {
      // Get all achievements from this group
      const groupAchievements = allAchievements.filter(a => a.name === achievement.name);
      const groupIds = groupAchievements.map(a => a.id);
      
      if (selectedBadges.includes(achievementId)) {
        // Remove this achievement
        setSelectedBadges(selectedBadges.filter(id => id !== achievementId));
      } else {
        // Remove all other levels from this group and add the selected one
        const newSelection = selectedBadges.filter(id => !groupIds.includes(id));
        setSelectedBadges([...newSelection, achievementId]);
      }
    } else {
      // Special achievement - just toggle normally
      if (selectedBadges.includes(achievementId)) {
        setSelectedBadges(selectedBadges.filter(id => id !== achievementId));
      } else {
        setSelectedBadges([...selectedBadges, achievementId]);
      }
    }
  };

  const handleSave = () => {
    // Update the displayedBadges in the current user
    currentUser.displayedBadges = selectedBadges;
    onBack();
  };

  const getRequirementText = (achievement: Achievement) => {
    const desc = achievement.description;
    
    // Prolific Poster
    if (desc.includes('Created 5 posts')) return { target: 5, current: userPosts.length };
    if (desc.includes('Created 25 posts')) return { target: 25, current: userPosts.length };
    if (desc.includes('Created 75 posts')) return { target: 75, current: userPosts.length };
    if (desc.includes('Created 200 posts')) return { target: 200, current: userPosts.length };
    
    // Helpful Member (pawvotes)
    if (desc.includes('Received 50 pawvotes')) return { target: 50, current: totalPawvotes };
    if (desc.includes('Received 250 pawvotes')) return { target: 250, current: totalPawvotes };
    if (desc.includes('Received 750 pawvotes')) return { target: 750, current: totalPawvotes };
    if (desc.includes('Received 2000 pawvotes')) return { target: 2000, current: totalPawvotes };
    
    // Conversation Starter (comments received)
    if (desc.includes('Received 50 comments')) return { target: 50, current: totalComments };
    if (desc.includes('Received 200 comments')) return { target: 200, current: totalComments };
    if (desc.includes('Received 600 comments')) return { target: 600, current: totalComments };
    if (desc.includes('Received 1500 comments')) return { target: 1500, current: totalComments };
    
    // Active Commenter (comments given)
    if (desc.includes('Posted 25 comments')) return { target: 25, current: commentsGiven };
    if (desc.includes('Posted 100 comments')) return { target: 100, current: commentsGiven };
    if (desc.includes('Posted 300 comments')) return { target: 300, current: commentsGiven };
    if (desc.includes('Posted 750 comments')) return { target: 750, current: commentsGiven };
    
    // Daily Streak
    if (desc.includes('7 days in a row')) return { target: 7, current: currentStreak };
    if (desc.includes('30 days in a row')) return { target: 30, current: currentStreak };
    if (desc.includes('90 days in a row')) return { target: 90, current: currentStreak };
    if (desc.includes('365 days in a row')) return { target: 365, current: currentStreak };
    
    // Reaction Enthusiast
    if (desc.includes('Received 50 reactions')) return { target: 50, current: totalReactions };
    if (desc.includes('Received 200 reactions')) return { target: 200, current: totalReactions };
    if (desc.includes('Received 600 reactions')) return { target: 600, current: totalReactions };
    if (desc.includes('Received 1500 reactions')) return { target: 1500, current: totalReactions };
    
    // Supportive Member (pawvotes given)
    if (desc.includes('Gave 50 pawvotes')) return { target: 50, current: pawvotesGiven };
    if (desc.includes('Gave 250 pawvotes')) return { target: 250, current: pawvotesGiven };
    if (desc.includes('Gave 750 pawvotes')) return { target: 750, current: pawvotesGiven };
    if (desc.includes('Gave 2000 pawvotes')) return { target: 2000, current: pawvotesGiven };
    
    // Dog Specialist
    if (desc.includes('10 posts in Dogs')) return { target: 10, current: dogsPosts };
    if (desc.includes('30 posts in Dogs')) return { target: 30, current: dogsPosts };
    if (desc.includes('75 posts in Dogs')) return { target: 75, current: dogsPosts };
    if (desc.includes('150 posts in Dogs')) return { target: 150, current: dogsPosts };
    
    // Cat Specialist
    if (desc.includes('10 posts in Cats')) return { target: 10, current: catsPosts };
    if (desc.includes('30 posts in Cats')) return { target: 30, current: catsPosts };
    if (desc.includes('75 posts in Cats')) return { target: 75, current: catsPosts };
    if (desc.includes('150 posts in Cats')) return { target: 150, current: catsPosts };
    
    // Shelter Champion
    if (desc.includes('5 posts in Shelters')) return { target: 5, current: shelterPosts };
    if (desc.includes('15 posts in Shelters')) return { target: 15, current: shelterPosts };
    if (desc.includes('40 posts in Shelters')) return { target: 40, current: shelterPosts };
    if (desc.includes('100 posts in Shelters')) return { target: 100, current: shelterPosts };
    
    // Lost & Found Hero
    if (desc.includes('3 posts in Lost & Found')) return { target: 3, current: lostFoundPosts };
    if (desc.includes('10 posts in Lost & Found')) return { target: 10, current: lostFoundPosts };
    if (desc.includes('25 posts in Lost & Found')) return { target: 25, current: lostFoundPosts };
    if (desc.includes('60 posts in Lost & Found')) return { target: 60, current: lostFoundPosts };
    
    // Event Maven
    if (desc.includes('3 posts in Events')) return { target: 3, current: eventPosts };
    if (desc.includes('10 posts in Events')) return { target: 10, current: eventPosts };
    if (desc.includes('25 posts in Events')) return { target: 25, current: eventPosts };
    if (desc.includes('60 posts in Events')) return { target: 60, current: eventPosts };
    
    // Popular Creator
    if (desc.includes('1 post with 50+')) return { target: 1, current: popularPosts50 };
    if (desc.includes('3 posts with 100+')) return { target: 3, current: popularPosts100 };
    if (desc.includes('10 posts with 150+')) return { target: 10, current: popularPosts150 };
    if (desc.includes('25 posts with 200+')) return { target: 25, current: popularPosts200 };
    
    // Community Builder
    if (desc.includes('Active in 3 different')) return { target: 3, current: categoriesPostedIn };
    if (desc.includes('Active in 4 different')) return { target: 4, current: categoriesPostedIn };
    if (desc.includes('Active in 5 different')) return { target: 5, current: categoriesPostedIn };
    if (desc.includes('Active in all 6')) return { target: 6, current: categoriesPostedIn };
    
    // Social Butterfly
    if (desc.includes('Have 5 followers')) return { target: 5, current: followersCount };
    if (desc.includes('Have 25 followers')) return { target: 25, current: followersCount };
    if (desc.includes('Have 75 followers')) return { target: 75, current: followersCount };
    if (desc.includes('Have 200 followers')) return { target: 200, current: followersCount };
    
    return null;
  };

  // Multi-level achievement groups
  const multiLevelGroups = [
    {
      name: 'Prolific Poster',
      icon: '✍️',
      achievements: allAchievements.filter(a => a.name === 'Prolific Poster').sort((a, b) => {
        const order = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
        return (order[a.level as keyof typeof order] || 0) - (order[b.level as keyof typeof order] || 0);
      }),
      currentProgress: userPosts.length,
      progressLabel: `${userPosts.length} posts created`
    },
    {
      name: 'Helpful Member',
      icon: '👍',
      achievements: allAchievements.filter(a => a.name === 'Helpful Member').sort((a, b) => {
        const order = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
        return (order[a.level as keyof typeof order] || 0) - (order[b.level as keyof typeof order] || 0);
      }),
      currentProgress: totalPawvotes,
      progressLabel: `${totalPawvotes} pawvotes received`
    },
    {
      name: 'Conversation Starter',
      icon: '💬',
      achievements: allAchievements.filter(a => a.name === 'Conversation Starter').sort((a, b) => {
        const order = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
        return (order[a.level as keyof typeof order] || 0) - (order[b.level as keyof typeof order] || 0);
      }),
      currentProgress: totalComments,
      progressLabel: `${totalComments} comments received`
    },
    {
      name: 'Active Commenter',
      icon: '💭',
      achievements: allAchievements.filter(a => a.name === 'Active Commenter').sort((a, b) => {
        const order = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
        return (order[a.level as keyof typeof order] || 0) - (order[b.level as keyof typeof order] || 0);
      }),
      currentProgress: commentsGiven,
      progressLabel: `${commentsGiven} comments posted`
    },
    {
      name: 'Daily Streak',
      icon: '🔥',
      achievements: allAchievements.filter(a => a.name === 'Daily Streak').sort((a, b) => {
        const order = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
        return (order[a.level as keyof typeof order] || 0) - (order[b.level as keyof typeof order] || 0);
      }),
      currentProgress: currentStreak,
      progressLabel: `${currentStreak} day streak • Best: ${bestStreak} days`
    },
    {
      name: 'Reaction Enthusiast',
      icon: '❤️',
      achievements: allAchievements.filter(a => a.name === 'Reaction Enthusiast').sort((a, b) => {
        const order = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
        return (order[a.level as keyof typeof order] || 0) - (order[b.level as keyof typeof order] || 0);
      }),
      currentProgress: totalReactions,
      progressLabel: `${totalReactions} reactions received`
    },
    {
      name: 'Supportive Member',
      icon: '🤝',
      achievements: allAchievements.filter(a => a.name === 'Supportive Member').sort((a, b) => {
        const order = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
        return (order[a.level as keyof typeof order] || 0) - (order[b.level as keyof typeof order] || 0);
      }),
      currentProgress: pawvotesGiven,
      progressLabel: `${pawvotesGiven} pawvotes given`
    },
    {
      name: 'Dog Specialist',
      icon: '🐕',
      achievements: allAchievements.filter(a => a.name === 'Dog Specialist').sort((a, b) => {
        const order = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
        return (order[a.level as keyof typeof order] || 0) - (order[b.level as keyof typeof order] || 0);
      }),
      currentProgress: dogsPosts,
      progressLabel: `${dogsPosts} posts in Dogs category`
    },
    {
      name: 'Cat Specialist',
      icon: '🐈',
      achievements: allAchievements.filter(a => a.name === 'Cat Specialist').sort((a, b) => {
        const order = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
        return (order[a.level as keyof typeof order] || 0) - (order[b.level as keyof typeof order] || 0);
      }),
      currentProgress: catsPosts,
      progressLabel: `${catsPosts} posts in Cats category`
    },
    {
      name: 'Shelter Champion',
      icon: '🏠',
      achievements: allAchievements.filter(a => a.name === 'Shelter Champion').sort((a, b) => {
        const order = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
        return (order[a.level as keyof typeof order] || 0) - (order[b.level as keyof typeof order] || 0);
      }),
      currentProgress: shelterPosts,
      progressLabel: `${shelterPosts} posts in Shelters & Rescue`
    },
    {
      name: 'Lost & Found Hero',
      icon: '🔍',
      achievements: allAchievements.filter(a => a.name === 'Lost & Found Hero').sort((a, b) => {
        const order = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
        return (order[a.level as keyof typeof order] || 0) - (order[b.level as keyof typeof order] || 0);
      }),
      currentProgress: lostFoundPosts,
      progressLabel: `${lostFoundPosts} posts in Lost & Found`
    },
    {
      name: 'Event Maven',
      icon: '📅',
      achievements: allAchievements.filter(a => a.name === 'Event Maven').sort((a, b) => {
        const order = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
        return (order[a.level as keyof typeof order] || 0) - (order[b.level as keyof typeof order] || 0);
      }),
      currentProgress: eventPosts,
      progressLabel: `${eventPosts} posts in Events`
    },
    {
      name: 'Popular Creator',
      icon: '🌟',
      achievements: allAchievements.filter(a => a.name === 'Popular Creator').sort((a, b) => {
        const order = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
        return (order[a.level as keyof typeof order] || 0) - (order[b.level as keyof typeof order] || 0);
      }),
      currentProgress: popularPosts50,
      progressLabel: `${popularPosts50} popular posts`
    },
    {
      name: 'Community Builder',
      icon: '🌍',
      achievements: allAchievements.filter(a => a.name === 'Community Builder').sort((a, b) => {
        const order = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
        return (order[a.level as keyof typeof order] || 0) - (order[b.level as keyof typeof order] || 0);
      }),
      currentProgress: categoriesPostedIn,
      progressLabel: `Active in ${categoriesPostedIn} categories`
    },
    {
      name: 'Social Butterfly',
      icon: '🦋',
      achievements: allAchievements.filter(a => a.name === 'Social Butterfly').sort((a, b) => {
        const order = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
        return (order[a.level as keyof typeof order] || 0) - (order[b.level as keyof typeof order] || 0);
      }),
      currentProgress: followersCount,
      progressLabel: `${followersCount} followers`
    },
  ];

  // Multi-level scroll component
  const MultiLevelAchievement = ({ group }: { group: typeof multiLevelGroups[0] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // Auto-scroll to the in-progress level (next level to unlock) on mount
    useEffect(() => {
      if (scrollRef.current) {
        // Find the first in-progress achievement (next level to unlock)
        let inProgressIndex = -1;
        group.achievements.forEach((ach, index) => {
          if (inProgressIndex === -1) {
            const unlocked = isUnlocked(ach.id);
            if (!unlocked) {
              // Check if all previous levels are unlocked
              const previousAchievements = group.achievements.slice(0, index);
              const allPreviousUnlocked = previousAchievements.every(prev => isUnlocked(prev.id));
              if (allPreviousUnlocked) {
                inProgressIndex = index; // This is the in-progress level
              }
            }
          }
        });

        // Scroll to in-progress achievement, or stay at first if all locked, or last if all unlocked
        if (inProgressIndex >= 0) {
          setTimeout(() => {
            const cardWidth = 300; // 288px (w-72) + 12px gap
            scrollRef.current?.scrollTo({
              left: inProgressIndex * cardWidth,
              behavior: 'smooth'
            });
          }, 100);
        } else {
          // Check if all are unlocked - if so, scroll to last
          const allUnlocked = group.achievements.every(ach => isUnlocked(ach.id));
          if (allUnlocked) {
            setTimeout(() => {
              const cardWidth = 300;
              scrollRef.current?.scrollTo({
                left: (group.achievements.length - 1) * cardWidth,
                behavior: 'smooth'
              });
            }, 100);
          }
        }
      }
    }, []); // Run only on mount
    
    const scroll = (direction: 'left' | 'right') => {
      if (scrollRef.current) {
        const scrollAmount = 300;
        scrollRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    };

    // Determine each achievement's status
    const getAchievementStatus = (achievement: Achievement, index: number) => {
      const unlocked = isUnlocked(achievement.id);
      
      if (unlocked) {
        return 'unlocked';
      }
      
      // Check if all previous levels are unlocked
      const previousAchievements = group.achievements.slice(0, index);
      const allPreviousUnlocked = previousAchievements.every(prev => isUnlocked(prev.id));
      
      if (allPreviousUnlocked) {
        return 'in-progress'; // This is the next level to unlock
      }
      
      return 'locked'; // Future levels
    };

    // Get stars based on level
    const getLevelStars = (level: string) => {
      switch (level) {
        case 'bronze': return '⭐';
        case 'silver': return '⭐⭐';
        case 'gold': return '⭐⭐⭐';
        case 'platinum': return '✨';
        default: return '⭐';
      }
    };

    // Get gradient color based on level
    const getLevelGradient = (level: string) => {
      switch (level) {
        case 'bronze': return 'from-orange-300 to-orange-400';
        case 'silver': return 'from-gray-200 to-gray-300';
        case 'gold': return 'from-yellow-300 to-amber-500';
        case 'platinum': return 'from-purple-400 to-pink-600';
        default: return 'from-gray-400 to-gray-500';
      }
    };

    // Get badge border color based on level
    const getLevelBorder = (level: string) => {
      switch (level) {
        case 'bronze': return 'border-orange-300';
        case 'silver': return 'border-gray-300';
        case 'gold': return 'border-yellow-300';
        case 'platinum': return 'border-purple-300';
        default: return 'border-gray-300';
      }
    };

    // Get text color based on level
    const getLevelTextColor = (level: string) => {
      switch (level) {
        case 'bronze': return 'text-orange-800';
        case 'silver': return 'text-gray-700';
        case 'gold': return 'text-yellow-900';
        case 'platinum': return 'text-purple-900';
        default: return 'text-gray-900';
      }
    };

    return (
      <div className="mb-6">
        <h3 className="text-sm mb-2 flex items-center gap-2">
          <span>{group.icon}</span>
          <span>{group.name}</span>
        </h3>
        <p className="text-xs text-gray-500 mb-3 ml-6">{group.progressLabel}</p>
        
        <div className="relative">
          {/* Scroll buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Scrollable achievements */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-10"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {group.achievements.map((achievement, index) => {
              const status = getAchievementStatus(achievement, index);
              const unlocked = status === 'unlocked';
              const inProgress = status === 'in-progress';
              const locked = status === 'locked';
              const isSelected = selectedBadges.includes(achievement.id);
              const requirement = getRequirementText(achievement);
              const progress = requirement 
                ? Math.min(100, (requirement.current / requirement.target) * 100)
                : 0;

              // Check if there's a next level
              const nextLevel = group.achievements[index + 1];
              const hasNextLevel = nextLevel !== undefined;
              const nextRequirement = hasNextLevel ? getRequirementText(nextLevel) : null;
              const progressToNext = nextRequirement
                ? Math.min(100, (nextRequirement.current / nextRequirement.target) * 100)
                : 0;

              return (
                <div
                  key={achievement.id}
                  className={`flex-shrink-0 w-72 snap-center p-4 rounded-2xl border transition-all ${
                    unlocked
                      ? 'bg-white border-gray-200 hover:border-teal-300 cursor-pointer'
                      : 'bg-gray-50 border-gray-100'
                  } ${isSelected ? 'ring-2 ring-teal-400 border-teal-400' : ''}`}
                  onClick={() => unlocked && toggleBadgeSelection(achievement.id)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0">
                      {unlocked ? (
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm">
                          <span className="text-2xl">{achievement.icon}</span>
                        </div>
                      ) : inProgress ? (
                        <div className="w-12 h-12 rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center opacity-40">
                          <span className="text-2xl">{achievement.icon}</span>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <Lock className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className={`inline-flex items-center px-3 py-1.5 text-sm gap-1.5 bg-gradient-to-r ${getLevelGradient(achievement.level)} border ${getLevelBorder(achievement.level)} rounded-full ${getLevelTextColor(achievement.level)} ${!unlocked && 'opacity-50'}`}>
                          <span className="text-sm">{getLevelStars(achievement.level)}</span>
                          <span className="text-sm">{achievement.icon}</span>
                          <span className="whitespace-nowrap text-xs font-medium">{achievement.level.toUpperCase()}</span>
                        </div>
                        {isSelected && unlocked && (
                          <span className="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-full whitespace-nowrap">
                            Displaying
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className={`text-xs mb-3 ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>{achievement.description}</p>
                  
                  {/* Show progress bar ONLY for in-progress achievements (next level to unlock) */}
                  {inProgress && requirement && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Progress to unlock</span>
                        <span className="font-medium">{requirement.current}/{requirement.target}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getLevelGradient(achievement.level)} transition-all`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {locked && (
                    <div className="px-3 py-2 bg-gray-100 rounded-xl">
                      <p className="text-xs text-gray-500">
                        <Lock className="w-3 h-3 inline mr-1" />
                        Complete previous levels to unlock
                      </p>
                    </div>
                  )}
                  
                  {unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-gray-400 mt-2">
                      Unlocked {achievement.unlockedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 p-3">
          <button onClick={onBack} className="text-gray-600 hover:text-teal-500 transition-colors">
            ←
          </button>
          <h2 className="text-base">Achievements</h2>
        </div>
      </div>

      <div className="p-4">
        {/* Info Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl">
          <h3 className="text-sm mb-1 flex items-center gap-2">
            <span>🏆</span>
            <span>Your Progress</span>
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Unlock achievements by being active. Tap unlocked badges to select which ones to display on your profile. Scroll sideways to see all levels.
          </p>
          <div className="flex items-center gap-2 text-xs text-purple-700">
            <span>Selected: {selectedBadges.length} badge{selectedBadges.length !== 1 ? 's' : ''}</span>
            <span>•</span>
            <span>Unlocked: {userAchievements.length}/{allAchievements.length}</span>
          </div>
        </div>

        {/* Multi-level achievements */}
        {multiLevelGroups.map((group) => (
          <MultiLevelAchievement key={group.name} group={group} />
        ))}

        {/* Special Achievements */}
        <div className="mb-6">
          <h3 className="text-sm mb-3 flex items-center gap-2">
            <span>⭐</span>
            <span>Special Achievements</span>
          </h3>
          
          <div className="space-y-2">
            {specialAchievementsConfig.map((config) => {
              const achievement = allAchievements.find(a => 
                a.id === config.id ||
                a.name.toLowerCase().replace(/\s+/g, '-') === config.id ||
                a.name === config.name
              );
              
              const unlocked = achievement ? isUnlocked(achievement.id) : false;
              const isSelected = achievement ? selectedBadges.includes(achievement.id) : false;

              return (
                <div
                  key={config.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    unlocked
                      ? 'bg-white border-gray-200 hover:border-teal-300 cursor-pointer'
                      : 'bg-gray-50 border-gray-100 opacity-70'
                  } ${isSelected ? 'ring-2 ring-teal-400 border-teal-400' : ''}`}
                  onClick={() => unlocked && achievement && toggleBadgeSelection(achievement.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon instead of medal for special achievements */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center text-2xl ${!unlocked && 'grayscale opacity-50'}`}>
                      {config.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h4 className="text-sm mb-0.5">{config.name}</h4>
                          <p className="text-xs text-gray-600">{config.description}</p>
                        </div>
                        {isSelected && unlocked && (
                          <span className="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-full whitespace-nowrap">
                            Displaying
                          </span>
                        )}
                      </div>
                      
                      {!unlocked && (
                        <div className={`mt-2 px-3 py-2 ${config.bgColor} rounded-xl`}>
                          <p className={`text-xs ${config.textColor}`}>
                            <span className="font-medium">How to get:</span> {config.howToGet}
                          </p>
                        </div>
                      )}
                      
                      {unlocked && achievement?.unlockedAt && (
                        <p className="text-xs text-gray-400 mt-2">
                          Unlocked {achievement.unlockedAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="sticky bottom-20 mt-6">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-2xl shadow-lg hover:from-teal-500 hover:to-teal-600 transition-all"
          >
            Save Selection
          </button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}