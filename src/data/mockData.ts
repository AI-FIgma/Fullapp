import { User, Category, Post, Comment, Achievement } from '../App';

// Blocked users set (for demonstration)
export const blockedUsers = new Set<string>(['troll-user-1', 'spam-bot-2']);

// Following users set
export const followingUsers = new Set<string>([
  'vet-top-1',
  'trainer-active-1',
  'rescue-hero-1',
  'dog-dad-1'
]);

// Followers Map: userId -> array of follower userIds
export const followersMap = new Map<string, string[]>([
  ['current-user', ['vet-top-1', 'trainer-active-1', 'dog-dad-1', 'user-poodle-1']],
  ['vet-top-1', ['current-user', 'mod-top-1', 'rescue-hero-1', 'cat-lady-1', 'trainer-active-1']],
  ['trainer-active-1', ['current-user', 'vet-top-1', 'dog-dad-1']],
  ['rescue-hero-1', ['current-user', 'vet-top-1', 'shelter-volunteer-1']],
  ['dog-dad-1', ['current-user', 'trainer-active-1']],
  ['user-poodle-1', ['vet-top-1', 'rescue-hero-1']],
]);

// Achievement definitions - Comprehensive and balanced system
export const allAchievements: Achievement[] = [
  // ========== PROLIFIC POSTER ==========
  // Creating posts
  {
    id: 'prolific-poster-bronze',
    name: 'Prolific Poster',
    description: 'Created 5 posts',
    icon: '✍️',
    level: 'bronze',
  },
  {
    id: 'prolific-poster-silver',
    name: 'Prolific Poster',
    description: 'Created 25 posts',
    icon: '✍️',
    level: 'silver',
  },
  {
    id: 'prolific-poster-gold',
    name: 'Prolific Poster',
    description: 'Created 75 posts',
    icon: '✍️',
    level: 'gold',
  },
  {
    id: 'prolific-poster-platinum',
    name: 'Prolific Poster',
    description: 'Created 200 posts',
    icon: '✍️',
    level: 'platinum',
  },

  // ========== HELPFUL MEMBER ==========
  // Receiving pawvotes
  {
    id: 'helpful-member-bronze',
    name: 'Helpful Member',
    description: 'Received 50 pawvotes',
    icon: '👍',
    level: 'bronze',
  },
  {
    id: 'helpful-member-silver',
    name: 'Helpful Member',
    description: 'Received 250 pawvotes',
    icon: '👍',
    level: 'silver',
  },
  {
    id: 'helpful-member-gold',
    name: 'Helpful Member',
    description: 'Received 750 pawvotes',
    icon: '👍',
    level: 'gold',
  },
  {
    id: 'helpful-member-platinum',
    name: 'Helpful Member',
    description: 'Received 2000 pawvotes',
    icon: '👍',
    level: 'platinum',
  },

  // ========== CONVERSATION STARTER ==========
  // Receiving comments on posts
  {
    id: 'conversation-starter-bronze',
    name: 'Conversation Starter',
    description: 'Received 50 comments',
    icon: '💬',
    level: 'bronze',
  },
  {
    id: 'conversation-starter-silver',
    name: 'Conversation Starter',
    description: 'Received 200 comments',
    icon: '💬',
    level: 'silver',
  },
  {
    id: 'conversation-starter-gold',
    name: 'Conversation Starter',
    description: 'Received 600 comments',
    icon: '💬',
    level: 'gold',
  },
  {
    id: 'conversation-starter-platinum',
    name: 'Conversation Starter',
    description: 'Received 1500 comments',
    icon: '💬',
    level: 'platinum',
  },

  // ========== ACTIVE COMMENTER ==========
  // Writing comments
  {
    id: 'active-commenter-bronze',
    name: 'Active Commenter',
    description: 'Posted 25 comments',
    icon: '💭',
    level: 'bronze',
  },
  {
    id: 'active-commenter-silver',
    name: 'Active Commenter',
    description: 'Posted 100 comments',
    icon: '💭',
    level: 'silver',
  },
  {
    id: 'active-commenter-gold',
    name: 'Active Commenter',
    description: 'Posted 300 comments',
    icon: '💭',
    level: 'gold',
  },
  {
    id: 'active-commenter-platinum',
    name: 'Active Commenter',
    description: 'Posted 750 comments',
    icon: '💭',
    level: 'platinum',
  },

  // ========== DAILY STREAK ==========
  // Consecutive login days
  {
    id: 'daily-streak-bronze',
    name: 'Daily Streak',
    description: 'Logged in 7 days in a row',
    icon: '🔥',
    level: 'bronze',
  },
  {
    id: 'daily-streak-silver',
    name: 'Daily Streak',
    description: 'Logged in 30 days in a row',
    icon: '🔥',
    level: 'silver',
  },
  {
    id: 'daily-streak-gold',
    name: 'Daily Streak',
    description: 'Logged in 90 days in a row',
    icon: '🔥',
    level: 'gold',
  },
  {
    id: 'daily-streak-platinum',
    name: 'Daily Streak',
    description: 'Logged in 365 days in a row',
    icon: '🔥',
    level: 'platinum',
  },

  // ========== REACTION ENTHUSIAST ==========
  // Receiving reactions (hearts, smiles, etc)
  {
    id: 'reaction-enthusiast-bronze',
    name: 'Reaction Enthusiast',
    description: 'Received 50 reactions',
    icon: '❤️',
    level: 'bronze',
  },
  {
    id: 'reaction-enthusiast-silver',
    name: 'Reaction Enthusiast',
    description: 'Received 200 reactions',
    icon: '❤️',
    level: 'silver',
  },
  {
    id: 'reaction-enthusiast-gold',
    name: 'Reaction Enthusiast',
    description: 'Received 600 reactions',
    icon: '❤️',
    level: 'gold',
  },
  {
    id: 'reaction-enthusiast-platinum',
    name: 'Reaction Enthusiast',
    description: 'Received 1500 reactions',
    icon: '❤️',
    level: 'platinum',
  },

  // ========== SUPPORTIVE MEMBER ==========
  // Giving pawvotes to others
  {
    id: 'supportive-member-bronze',
    name: 'Supportive Member',
    description: 'Gave 50 pawvotes',
    icon: '🤝',
    level: 'bronze',
  },
  {
    id: 'supportive-member-silver',
    name: 'Supportive Member',
    description: 'Gave 250 pawvotes',
    icon: '🤝',
    level: 'silver',
  },
  {
    id: 'supportive-member-gold',
    name: 'Supportive Member',
    description: 'Gave 750 pawvotes',
    icon: '🤝',
    level: 'gold',
  },
  {
    id: 'supportive-member-platinum',
    name: 'Supportive Member',
    description: 'Gave 2000 pawvotes',
    icon: '🤝',
    level: 'platinum',
  },

  // ========== DOG SPECIALIST ==========
  // Posts in Dogs category
  {
    id: 'dog-specialist-bronze',
    name: 'Dog Specialist',
    description: '10 posts in Dogs category',
    icon: '🐕',
    level: 'bronze',
  },
  {
    id: 'dog-specialist-silver',
    name: 'Dog Specialist',
    description: '30 posts in Dogs category',
    icon: '🐕',
    level: 'silver',
  },
  {
    id: 'dog-specialist-gold',
    name: 'Dog Specialist',
    description: '75 posts in Dogs category',
    icon: '🐕',
    level: 'gold',
  },
  {
    id: 'dog-specialist-platinum',
    name: 'Dog Specialist',
    description: '150 posts in Dogs category',
    icon: '🐕',
    level: 'platinum',
  },

  // ========== CAT SPECIALIST ==========
  // Posts in Cats category
  {
    id: 'cat-specialist-bronze',
    name: 'Cat Specialist',
    description: '10 posts in Cats category',
    icon: '🐈',
    level: 'bronze',
  },
  {
    id: 'cat-specialist-silver',
    name: 'Cat Specialist',
    description: '30 posts in Cats category',
    icon: '🐈',
    level: 'silver',
  },
  {
    id: 'cat-specialist-gold',
    name: 'Cat Specialist',
    description: '75 posts in Cats category',
    icon: '🐈',
    level: 'gold',
  },
  {
    id: 'cat-specialist-platinum',
    name: 'Cat Specialist',
    description: '150 posts in Cats category',
    icon: '🐈',
    level: 'platinum',
  },

  // ========== SHELTER CHAMPION ==========
  // Posts in Shelters & Rescue category
  {
    id: 'shelter-champion-bronze',
    name: 'Shelter Champion',
    description: '5 posts in Shelters & Rescue',
    icon: '🏠',
    level: 'bronze',
  },
  {
    id: 'shelter-champion-silver',
    name: 'Shelter Champion',
    description: '15 posts in Shelters & Rescue',
    icon: '🏠',
    level: 'silver',
  },
  {
    id: 'shelter-champion-gold',
    name: 'Shelter Champion',
    description: '40 posts in Shelters & Rescue',
    icon: '🏠',
    level: 'gold',
  },
  {
    id: 'shelter-champion-platinum',
    name: 'Shelter Champion',
    description: '100 posts in Shelters & Rescue',
    icon: '🏠',
    level: 'platinum',
  },

  // ========== LOST & FOUND HERO ==========
  // Posts in Lost & Found category
  {
    id: 'lost-found-hero-bronze',
    name: 'Lost & Found Hero',
    description: '3 posts in Lost & Found',
    icon: '🔍',
    level: 'bronze',
  },
  {
    id: 'lost-found-hero-silver',
    name: 'Lost & Found Hero',
    description: '10 posts in Lost & Found',
    icon: '🔍',
    level: 'silver',
  },
  {
    id: 'lost-found-hero-gold',
    name: 'Lost & Found Hero',
    description: '25 posts in Lost & Found',
    icon: '🔍',
    level: 'gold',
  },
  {
    id: 'lost-found-hero-platinum',
    name: 'Lost & Found Hero',
    description: '60 posts in Lost & Found',
    icon: '🔍',
    level: 'platinum',
  },

  // ========== EVENT MAVEN ==========
  // Posts in Events category
  {
    id: 'event-maven-bronze',
    name: 'Event Maven',
    description: '3 posts in Events category',
    icon: '📅',
    level: 'bronze',
  },
  {
    id: 'event-maven-silver',
    name: 'Event Maven',
    description: '10 posts in Events category',
    icon: '📅',
    level: 'silver',
  },
  {
    id: 'event-maven-gold',
    name: 'Event Maven',
    description: '25 posts in Events category',
    icon: '📅',
    level: 'gold',
  },
  {
    id: 'event-maven-platinum',
    name: 'Event Maven',
    description: '60 posts in Events category',
    icon: '📅',
    level: 'platinum',
  },

  // ========== POPULAR CREATOR ==========
  // Create posts with high engagement (100+ pawvotes)
  {
    id: 'popular-creator-bronze',
    name: 'Popular Creator',
    description: '1 post with 50+ pawvotes',
    icon: '🌟',
    level: 'bronze',
  },
  {
    id: 'popular-creator-silver',
    name: 'Popular Creator',
    description: '3 posts with 100+ pawvotes',
    icon: '🌟',
    level: 'silver',
  },
  {
    id: 'popular-creator-gold',
    name: 'Popular Creator',
    description: '10 posts with 150+ pawvotes',
    icon: '🌟',
    level: 'gold',
  },
  {
    id: 'popular-creator-platinum',
    name: 'Popular Creator',
    description: '25 posts with 200+ pawvotes',
    icon: '🌟',
    level: 'platinum',
  },

  // ========== COMMUNITY BUILDER ==========
  // Active in multiple categories (3+, 4+, 5+, all 6)
  {
    id: 'community-builder-bronze',
    name: 'Community Builder',
    description: 'Active in 3 different categories',
    icon: '🌍',
    level: 'bronze',
  },
  {
    id: 'community-builder-silver',
    name: 'Community Builder',
    description: 'Active in 4 different categories',
    icon: '🌍',
    level: 'silver',
  },
  {
    id: 'community-builder-gold',
    name: 'Community Builder',
    description: 'Active in 5 different categories',
    icon: '🌍',
    level: 'gold',
  },
  {
    id: 'community-builder-platinum',
    name: 'Community Builder',
    description: 'Active in all 6 categories',
    icon: '🌍',
    level: 'platinum',
  },

  // ========== SOCIAL BUTTERFLY ==========
  // Have followers
  {
    id: 'social-butterfly-bronze',
    name: 'Social Butterfly',
    description: 'Have 5 followers',
    icon: '🦋',
    level: 'bronze',
  },
  {
    id: 'social-butterfly-silver',
    name: 'Social Butterfly',
    description: 'Have 25 followers',
    icon: '🦋',
    level: 'silver',
  },
  {
    id: 'social-butterfly-gold',
    name: 'Social Butterfly',
    description: 'Have 75 followers',
    icon: '🦋',
    level: 'gold',
  },
  {
    id: 'social-butterfly-platinum',
    name: 'Social Butterfly',
    description: 'Have 200 followers',
    icon: '🦋',
    level: 'platinum',
  },

  // ========== SPECIAL ACHIEVEMENTS ==========
  // One-off achievements
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'Joined in the first month',
    icon: '🎖️',
    level: 'gold',
  },
  {
    id: 'veteran-member',
    name: 'Veteran Member',
    description: 'Member for over 1 year',
    icon: '⭐',
    level: 'gold',
  },
  {
    id: 'trusted-veteran',
    name: 'Trusted Veteran',
    description: 'Member for over 2 years',
    icon: '💎',
    level: 'platinum',
  },
  {
    id: 'verified-professional',
    name: 'Verified Professional',
    description: 'Verified veterinarian or trainer',
    icon: '✅',
    level: 'platinum',
  },
  {
    id: 'moderator-badge',
    name: 'Community Moderator',
    description: 'Helping keep the community safe',
    icon: '🛡️',
    level: 'platinum',
  },
  {
    id: 'poll-master',
    name: 'Poll Master',
    description: 'Created 10 polls',
    icon: '📊',
    level: 'silver',
  },
  {
    id: 'first-post',
    name: 'First Post',
    description: 'Created your first post',
    icon: '🎉',
    level: 'bronze',
  },
  {
    id: 'welcome-aboard',
    name: 'Welcome Aboard',
    description: 'Completed profile setup',
    icon: '👋',
    level: 'bronze',
  },
  {
    id: 'admin-badge',
    name: 'Platform Administrator',
    description: 'Managing the platform',
    icon: '🔧',
    level: 'platinum',
  }
];

export const categories: Category[] = [
  {
    id: 'dogs',
    name: 'Dogs',
    icon: '🐕',
    subcategories: [
      { id: 'dog-health', name: 'Health & Vet', categoryId: 'dogs', icon: '🩺' },
      { id: 'dog-training', name: 'Training & Behavior', categoryId: 'dogs', icon: '🎓' },
      { id: 'dog-breeds', name: 'Breeds', categoryId: 'dogs', icon: '🐶' },
      { id: 'dog-nutrition', name: 'Nutrition', categoryId: 'dogs', icon: '🍖' },
      { id: 'dog-grooming', name: 'Grooming & Care', categoryId: 'dogs', icon: '✂️' },
      { id: 'dog-gear', name: 'Gear & Products', categoryId: 'dogs', icon: '🦴' },
      { id: 'dog-sports', name: 'Sports & Activities', categoryId: 'dogs', icon: '⚽' },
      { id: 'dog-breeding', name: 'Breeding & Shows', categoryId: 'dogs', icon: '🏆' }
    ]
  },
  {
    id: 'cats',
    name: 'Cats',
    icon: '🐈',
    subcategories: [
      { id: 'cat-health', name: 'Health & Vet', categoryId: 'cats', icon: '🩺' },
      { id: 'cat-behavior', name: 'Behavior', categoryId: 'cats', icon: '😸' },
      { id: 'cat-breeds', name: 'Breeds', categoryId: 'cats', icon: '🐱' },
      { id: 'cat-nutrition', name: 'Nutrition', categoryId: 'cats', icon: '🐟' },
      { id: 'cat-grooming', name: 'Grooming & Care', categoryId: 'cats', icon: '✨' },
      { id: 'cat-gear', name: 'Gear & Products', categoryId: 'cats', icon: '🧶' },
      { id: 'cat-indoor-outdoor', name: 'Indoor vs Outdoor', categoryId: 'cats', icon: '🏡' }
    ]
  },
  {
    id: 'other-pets',
    name: 'Other Pets',
    icon: '🐾',
    subcategories: [
      { id: 'birds', name: 'Birds', categoryId: 'other-pets', icon: '🦜' },
      { id: 'small-animals', name: 'Small Animals', categoryId: 'other-pets', icon: '🐹' },
      { id: 'reptiles-fish', name: 'Reptiles & Fish', categoryId: 'other-pets', icon: '🐢' },
      { id: 'exotic-pets', name: 'Exotic Pets', categoryId: 'other-pets', icon: '🦎' }
    ]
  },
  {
    id: 'adoption',
    name: 'Adoption & Rescue',
    icon: '🏠',
    subcategories: [
      { id: 'available-adoption', name: 'Available for Adoption', categoryId: 'adoption', icon: '❤️' },
      { id: 'adoption-stories', name: 'Adoption Stories', categoryId: 'adoption', icon: '📖' },
      { id: 'foster-volunteer', name: 'Foster & Volunteer', categoryId: 'adoption', icon: '🤝' },
      { id: 'shelter-support', name: 'Shelter Support', categoryId: 'adoption', icon: '💝' }
    ]
  },
  {
    id: 'community',
    name: 'Community',
    icon: '💬',
    subcategories: [
      { id: 'announcements', name: 'Announcements', categoryId: 'community', icon: '📢' },
      { id: 'introductions', name: 'Introductions', categoryId: 'community', icon: '👋' },
      { id: 'show-off', name: 'Show Off', categoryId: 'community', icon: '📸' },
      { id: 'stories', name: 'Stories & Moments', categoryId: 'community', icon: '💭' },
      { id: 'rainbow-bridge', name: 'Rainbow Bridge', categoryId: 'community', icon: '🌈' },
      { id: 'ask-pros', name: 'Ask the Pros', categoryId: 'community', icon: '💡' },
      { id: 'general-discussion', name: 'General Discussion', categoryId: 'community', icon: '💬' }
    ]
  },
  {
    id: 'local-events',
    name: 'Local & Events',
    icon: '📍',
    subcategories: [
      { id: 'events-meetups', name: 'Events & Meetups', categoryId: 'local-events', icon: '🎉' },
      { id: 'pet-friendly', name: 'Pet-Friendly Places', categoryId: 'local-events', icon: '☕' },
      { id: 'local-recommendations', name: 'Local Recommendations', categoryId: 'local-events', icon: '⭐' },
      { id: 'travel-tips', name: 'Travel Tips', categoryId: 'local-events', icon: '✈️' }
    ]
  },
  {
    id: 'lost-found',
    name: 'Lost & Found',
    icon: '🔍',
    subcategories: [
      { id: 'lost-pets', name: 'Lost Pets', categoryId: 'lost-found', icon: '🚨' },
      { id: 'found-pets', name: 'Found Pets', categoryId: 'lost-found', icon: '👀' },
      { id: 'reunited', name: 'Reunited', categoryId: 'lost-found', icon: '🎊' },
      { id: 'prevention-tips', name: 'Prevention Tips', categoryId: 'lost-found', icon: '🛡️' }
    ]
  },
  {
    id: 'resources',
    name: 'Resources',
    icon: '📚',
    subcategories: [
      { id: 'guides-tips', name: 'Guides & Tips', categoryId: 'resources', icon: '📝' },
      { id: 'laws-regulations', name: 'Laws & Regulations', categoryId: 'resources', icon: '⚖️' },
      { id: 'pet-insurance', name: 'Pet Insurance', categoryId: 'resources', icon: '🛡️' },
      { id: 'emergency-info', name: 'Emergency Info', categoryId: 'resources', icon: '🚑' },
      { id: 'product-reviews', name: 'Product Reviews', categoryId: 'resources', icon: '⭐' }
    ]
  }
];

export const mockUsers: User[] = [
  {
    id: 'current-user',
    username: 'farent19',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=farent19',
    role: 'member',
    bio: 'Animal lover and forum enthusiast! Always happy to help fellow pet parents.',
    memberSince: new Date(2023, 5, 15),
    lastLoginDate: new Date(),
    currentStreak: 15,
    bestStreak: 23,
    achievements: [
      { ...allAchievements[0], unlockedAt: new Date(2024, 7, 20) }, // Prolific Poster Bronze (5 posts) - historical
      { ...allAchievements[4], unlockedAt: new Date(2024, 9, 15) }, // Helpful Member Bronze (50 pawvotes) - turim 112
      { ...allAchievements[8], unlockedAt: new Date(2024, 6, 5) }, // Conversation Starter Bronze (50 comments) - turim 101
      { ...allAchievements[12], unlockedAt: new Date(2024, 7, 10) }, // Active Commenter Bronze (25 comments) - mock 120
      { ...allAchievements[13], unlockedAt: new Date(2024, 8, 10) }, // Active Commenter Silver (100 comments) - mock 120
      { ...allAchievements[16], unlockedAt: new Date(2024, 11, 8) }, // Daily Streak Bronze (7 days) - turim 15
      { ...allAchievements[20], unlockedAt: new Date(2024, 10, 5) }, // Reaction Enthusiast Bronze (50 reactions) - turim 55
      { ...allAchievements[24], unlockedAt: new Date(2024, 9, 20) }, // Supportive Member Bronze (50 pawvotes given) - mock 180
      { ...allAchievements[48], unlockedAt: new Date(2024, 10, 15) }, // Popular Creator Bronze (1 post 50+ pawvotes) - post-7 has 67
      { ...allAchievements[77], unlockedAt: new Date(2023, 5, 15) }, // Welcome Aboard
      { ...allAchievements[76], unlockedAt: new Date(2023, 5, 16) }, // First Post
    ],
    featuredAchievements: ['prolific-poster-bronze', 'helpful-member-bronze', 'daily-streak-bronze'],
    displayedBadges: ['prolific-poster-bronze', 'helpful-member-bronze', 'daily-streak-bronze'],
    isOnline: true,
    showOnlineStatus: true
  },
  {
    id: 'vet-top-1',
    username: 'Dr. Emma Sullivan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DrEmma',
    role: 'vet',
    bio: 'Veterinary surgeon | 12+ years experience | Specializing in emergency care and surgery',
    memberSince: new Date(2022, 10, 8),
    lastLoginDate: new Date(),
    currentStreak: 156,
    bestStreak: 200,
    professionalInfo: {
      businessName: 'Central Veterinary Hospital',
      address: 'Gedimino pr. 45, Vilnius',
      phone: '+370 612 34567',
      email: 'dr.sullivan@centralvet.lt',
      website: 'www.centralvet.lt'
    },
    achievements: [
      { ...allAchievements[3], unlockedAt: new Date(2023, 11, 15) }, // Prolific Poster Platinum
      { ...allAchievements[7], unlockedAt: new Date(2024, 2, 20) }, // Helpful Member Platinum
      { ...allAchievements[15], unlockedAt: new Date(2024, 4, 10) }, // Active Commenter Platinum
      { ...allAchievements[19], unlockedAt: new Date(2024, 8, 5) }, // Daily Streak Gold
      { ...allAchievements[73], unlockedAt: new Date(2023, 11, 1) }, // Veteran Member
      { ...allAchievements[75], unlockedAt: new Date(2023, 10, 8) }, // Verified Professional
      { ...allAchievements[67], unlockedAt: new Date(2024, 6, 15) }, // Community Builder Gold
      { ...allAchievements[71], unlockedAt: new Date(2024, 9, 1) }, // Social Butterfly Gold
    ],
    displayedBadges: ['verified-professional', 'helpful-member-platinum', 'daily-streak-gold', 'prolific-poster-platinum', 'veteran-member'],
    isOnline: true,
    showOnlineStatus: true
  },
  {
    id: 'mod-top-1',
    username: 'ModAlex',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ModAlex',
    role: 'moderator',
    bio: 'Community moderator | Here to keep discussions positive and helpful 💚',
    memberSince: new Date(2023, 2, 12),
    lastLoginDate: new Date(),
    currentStreak: 89,
    bestStreak: 120,
    achievements: [
      { ...allAchievements[2], unlockedAt: new Date(2024, 5, 10) }, // Prolific Poster Gold
      { ...allAchievements[6], unlockedAt: new Date(2024, 8, 22) }, // Helpful Member Gold
      { ...allAchievements[19], unlockedAt: new Date(2024, 10, 1) }, // Daily Streak Gold
      { ...allAchievements[73], unlockedAt: new Date(2024, 2, 12) }, // Veteran Member
      { ...allAchievements[76], unlockedAt: new Date(2023, 11, 20) }, // Moderator Badge
      { ...allAchievements[67], unlockedAt: new Date(2024, 7, 5) }, // Community Builder Gold
    ],
    displayedBadges: ['moderator-badge', 'helpful-member-gold', 'daily-streak-gold'],
    isOnline: false,
    showOnlineStatus: true
  },
  {
    id: 'trainer-active-1',
    username: 'TrainerMark',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TrainerMark',
    role: 'trainer',
    bio: 'Certified dog trainer | Positive reinforcement specialist | Free consultations on Fridays!',
    memberSince: new Date(2023, 8, 3),
    lastLoginDate: new Date(),
    currentStreak: 45,
    bestStreak: 67,
    professionalInfo: {
      businessName: 'Pawsitive Training Academy',
      address: 'Konstitucijos pr. 12, Vilnius',
      phone: '+370 698 12345',
      email: 'mark@pawsitivetraining.lt',
      website: 'www.pawsitivetraining.lt'
    },
    achievements: [
      { ...allAchievements[2], unlockedAt: new Date(2024, 6, 15) }, // Prolific Poster Gold
      { ...allAchievements[6], unlockedAt: new Date(2024, 9, 8) }, // Helpful Member Gold
      { ...allAchievements[38], unlockedAt: new Date(2024, 10, 20) }, // Dog Specialist Gold
      { ...allAchievements[75], unlockedAt: new Date(2023, 8, 5) }, // Verified Professional
      { ...allAchievements[18], unlockedAt: new Date(2024, 10, 15) }, // Daily Streak Silver
    ],
    displayedBadges: ['verified-professional', 'dog-specialist-gold', 'helpful-member-gold'],
    isOnline: true,
    showOnlineStatus: true
  },
  {
    id: 'rescue-hero-1',
    username: 'ShelterHeart',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ShelterHeart',
    role: 'member',
    bio: 'Shelter volunteer | Helping animals find their forever homes 🏠❤️',
    memberSince: new Date(2023, 1, 20),
    lastLoginDate: new Date(),
    currentStreak: 34,
    bestStreak: 50,
    achievements: [
      { ...allAchievements[1], unlockedAt: new Date(2024, 4, 12) }, // Prolific Poster Silver
      { ...allAchievements[5], unlockedAt: new Date(2024, 7, 25) }, // Helpful Member Silver
      { ...allAchievements[50], unlockedAt: new Date(2024, 9, 30) }, // Shelter Champion Gold
      { ...allAchievements[73], unlockedAt: new Date(2024, 1, 20) }, // Veteran Member
      { ...allAchievements[66], unlockedAt: new Date(2024, 8, 10) }, // Community Builder Bronze
    ],
    displayedBadges: ['shelter-champion-gold', 'helpful-member-silver', 'veteran-member'],
    isOnline: false,
    showOnlineStatus: true
  },
  {
    id: 'dog-dad-1',
    username: 'GoldenDad',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoldenDad',
    role: 'member',
    bio: 'Proud dad of 2 Golden Retrievers 🐕🐕 | Love hiking and outdoor adventures',
    memberSince: new Date(2023, 9, 10),
    lastLoginDate: new Date(),
    currentStreak: 12,
    bestStreak: 18,
    achievements: [
      { ...allAchievements[1], unlockedAt: new Date(2024, 8, 5) }, // Prolific Poster Silver
      { ...allAchievements[37], unlockedAt: new Date(2024, 10, 12) }, // Dog Specialist Silver
      { ...allAchievements[17], unlockedAt: new Date(2024, 11, 1) }, // Daily Streak Bronze
      { ...allAchievements[73], unlockedAt: new Date(2024, 9, 10) }, // Veteran Member
    ],
    displayedBadges: ['dog-specialist-silver', 'prolific-poster-silver', 'veteran-member'],
    isOnline: true,
    showOnlineStatus: false
  },
  {
    id: 'cat-lady-1',
    username: 'CatWhisperer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CatWhisperer',
    role: 'member',
    bio: 'Cat behaviorist | 5 rescue cats | Here to help with feline mysteries 🐱‍⬛',
    memberSince: new Date(2023, 6, 22),
    lastLoginDate: new Date(),
    currentStreak: 28,
    bestStreak: 35,
    achievements: [
      { ...allAchievements[2], unlockedAt: new Date(2024, 9, 18) }, // Prolific Poster Gold
      { ...allAchievements[6], unlockedAt: new Date(2024, 10, 5) }, // Helpful Member Gold
      { ...allAchievements[42], unlockedAt: new Date(2024, 11, 2) }, // Cat Specialist Gold
      { ...allAchievements[73], unlockedAt: new Date(2024, 6, 22) }, // Veteran Member
      { ...allAchievements[18], unlockedAt: new Date(2024, 11, 20) }, // Daily Streak Silver
    ],
    displayedBadges: ['cat-specialist-gold', 'helpful-member-gold', 'veteran-member'],
    isOnline: false,
    showOnlineStatus: true
  },
  {
    id: 'user-poodle-1',
    username: 'PoodlePerfection',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PoodlePerfection',
    role: 'member',
    bio: 'Standard Poodle enthusiast | Grooming tips and breed info',
    memberSince: new Date(2024, 2, 5),
    lastLoginDate: new Date(),
    currentStreak: 8,
    bestStreak: 10,
    achievements: [
      { ...allAchievements[0], unlockedAt: new Date(2024, 8, 15) }, // Prolific Poster Bronze
      { ...allAchievements[36], unlockedAt: new Date(2024, 10, 8) }, // Dog Specialist Bronze
      { ...allAchievements[77], unlockedAt: new Date(2024, 2, 5) }, // Welcome Aboard
      { ...allAchievements[76], unlockedAt: new Date(2024, 2, 6) }, // First Post
    ],
    displayedBadges: ['dog-specialist-bronze', 'prolific-poster-bronze', 'welcome-aboard'],
    isOnline: true,
    showOnlineStatus: true
  },
  {
    id: 'shelter-volunteer-1',
    username: 'RescueWarrior',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RescueWarrior',
    role: 'member',
    bio: 'Foster parent | Every animal deserves love ❤️',
    memberSince: new Date(2023, 11, 8),
    lastLoginDate: new Date(),
    currentStreak: 22,
    bestStreak: 30,
    achievements: [
      { ...allAchievements[1], unlockedAt: new Date(2024, 7, 12) }, // Prolific Poster Silver
      { ...allAchievements[49], unlockedAt: new Date(2024, 10, 25) }, // Shelter Champion Silver
      { ...allAchievements[73], unlockedAt: new Date(2024, 11, 8) }, // Veteran Member
      { ...allAchievements[18], unlockedAt: new Date(2024, 11, 30) }, // Daily Streak Silver
    ],
    displayedBadges: ['shelter-champion-silver', 'prolific-poster-silver', 'veteran-member'],
    isOnline: false,
    showOnlineStatus: true
  },
  {
    id: 'user-pending-1',
    username: 'SarahVetMD',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahVet',
    role: 'member',
    bio: 'Aspiring vet helper.',
    memberSince: new Date(2023, 11, 20),
    lastLoginDate: new Date(),
    currentStreak: 5,
    bestStreak: 5,
    achievements: [],
    displayedBadges: [],
    isOnline: true,
    showOnlineStatus: true
  },
  {
    id: 'user-pending-2',
    username: 'DogTrainerMike',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MikeTrainer',
    role: 'member',
    bio: 'Dog enthusiast and trainer.',
    memberSince: new Date(2024, 0, 15),
    lastLoginDate: new Date(),
    currentStreak: 3,
    bestStreak: 3,
    achievements: [],
    displayedBadges: [],
    isOnline: false,
    showOnlineStatus: true
  },
  {
    id: 'user-pending-3',
    username: 'CatBehavioristLisa',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LisaCat',
    role: 'member',
    bio: 'Cat lover.',
    memberSince: new Date(2024, 1, 10),
    lastLoginDate: new Date(),
    currentStreak: 1,
    bestStreak: 1,
    achievements: [],
    displayedBadges: [],
    isOnline: false,
    showOnlineStatus: true
  },
  // ADMIN ACCOUNT
  {
    id: 'admin-root',
    username: 'AdminLT',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminLT',
    role: 'admin',
    bio: 'Platform Administrator | Managing PawForum LT 🔧',
    memberSince: new Date(2022, 0, 1),
    lastLoginDate: new Date(),
    currentStreak: 365,
    bestStreak: 500,
    achievements: [
      // Prolific Poster progression (5, 25, 75, 200 posts) - has 21 posts so unlock Bronze and Silver
      { ...allAchievements[0], unlockedAt: new Date(2023, 1, 5) }, // Bronze (5 posts)
      { ...allAchievements[1], unlockedAt: new Date(2023, 3, 12) }, // Silver (25 posts)
      
      // Helpful Member progression (50, 250, 750, 2000 pawvotes) - has 1157 pawvotes
      { ...allAchievements[4], unlockedAt: new Date(2023, 2, 8) }, // Bronze (50)
      { ...allAchievements[5], unlockedAt: new Date(2023, 5, 15) }, // Silver (250)
      { ...allAchievements[6], unlockedAt: new Date(2023, 8, 20) }, // Gold (750)
      
      // Conversation Starter (50, 200, 600, 1500 comments received)
      { ...allAchievements[8], unlockedAt: new Date(2023, 3, 10) }, // Bronze
      { ...allAchievements[9], unlockedAt: new Date(2023, 6, 20) }, // Silver
      
      // Active Commenter (25, 100, 300, 750 comments posted) - mock 120 comments
      { ...allAchievements[12], unlockedAt: new Date(2023, 2, 14) }, // Bronze
      { ...allAchievements[13], unlockedAt: new Date(2023, 5, 18) }, // Silver
      
      // Daily Streak (7, 30, 90, 365 days) - has 365 day streak
      { ...allAchievements[16], unlockedAt: new Date(2023, 0, 7) }, // Bronze
      { ...allAchievements[17], unlockedAt: new Date(2023, 1, 15) }, // Silver
      { ...allAchievements[18], unlockedAt: new Date(2023, 4, 10) }, // Gold
      { ...allAchievements[19], unlockedAt: new Date(2024, 5, 1) }, // Platinum
      
      // Reaction Enthusiast (50, 200, 600, 1500 reactions)
      { ...allAchievements[20], unlockedAt: new Date(2023, 3, 5) }, // Bronze
      { ...allAchievements[21], unlockedAt: new Date(2023, 6, 12) }, // Silver
      
      // Supportive Member (50, 250, 750, 2000 pawvotes given) - has 180 pawvotes given
      { ...allAchievements[24], unlockedAt: new Date(2023, 2, 20) }, // Bronze
      { ...allAchievements[25], unlockedAt: new Date(2023, 5, 25) }, // Silver
      
      // Dog Specialist (10, 30, 75, 150 posts in Dogs)
      { ...allAchievements[28], unlockedAt: new Date(2023, 3, 8) }, // Bronze
      
      // Cat Specialist (10, 30, 75, 150 posts in Cats)
      { ...allAchievements[32], unlockedAt: new Date(2023, 3, 9) }, // Bronze
      
      // Shelter Champion (5, 15, 40, 100 posts in Shelters)
      { ...allAchievements[36], unlockedAt: new Date(2023, 4, 3) }, // Bronze
      
      // Community Builder (3, 4, 5, 6 categories)
      { ...allAchievements[52], unlockedAt: new Date(2023, 2, 15) }, // Bronze
      { ...allAchievements[53], unlockedAt: new Date(2023, 4, 20) }, // Silver
      { ...allAchievements[54], unlockedAt: new Date(2023, 6, 25) }, // Gold
      
      // Social Butterfly (5, 25, 75, 200 followers)
      { ...allAchievements[56], unlockedAt: new Date(2023, 3, 12) }, // Bronze
      { ...allAchievements[57], unlockedAt: new Date(2023, 7, 5) }, // Silver
      
      // Special Achievements
      { ...allAchievements[60], unlockedAt: new Date(2022, 0, 1) }, // Welcome Aboard
      { ...allAchievements[61], unlockedAt: new Date(2022, 0, 2) }, // First Post
      { ...allAchievements[62], unlockedAt: new Date(2022, 0, 1) }, // Early Adopter
      { ...allAchievements[63], unlockedAt: new Date(2023, 0, 1) }, // Veteran Member
      { ...allAchievements[64], unlockedAt: new Date(2024, 0, 1) }, // Trusted Veteran
      { ...allAchievements[77], unlockedAt: new Date(2022, 0, 1) }, // Admin Badge
    ],
    displayedBadges: ['admin-badge', 'helpful-member-gold', 'daily-streak-platinum'],
    isOnline: true,
    showOnlineStatus: true
  }
];

export const currentUser = mockUsers[0]; // Regular User - PawParent2023

// Mock notifications
export const mockNotifications = [
  // Forum Notifications
  {
    id: '1',
    type: 'pawvote' as const,
    message: 'Dr. Emma Sullivan pawvoted your post',
    time: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    postId: 'post-1'
  },
  {
    id: '2',
    type: 'comment' as const,
    message: 'TrainerMark commented on your post',
    time: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    postId: 'post-2'
  },
  {
    id: '3',
    type: 'follow' as const,
    message: 'ShelterHeart started following you',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
    userId: 'rescue-hero-1'
  },
  // App/System Notifications
  {
    id: '4',
    type: 'system' as const,
    message: '🎉 Daily Streak! You have logged in for 15 days in a row.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 1),
    read: false
  },
  {
    id: '5',
    type: 'achievement' as const,
    message: '🏆 New Badge Unlocked: "Early Adopter"',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true
  },
  {
    id: '6',
    type: 'system' as const,
    message: '🔔 Reminder: Bella\'s vaccination is due next week.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 48),
    read: false
  }
];

// Mock comments structure
export const mockComments: { [postId: string]: Comment[] } = {
  'post-mod-1': [
    {
      id: 'c1',
      author: mockUsers[0],
      content: 'This is amazing! Finally I can track my streak properly. 🔥',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      upvotes: 12,
      hasUpvoted: true,
      replies: [
        {
          id: 'c1-r1',
          author: mockUsers[2],
          content: 'Glad you like it! Let us know if you find any bugs.',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          upvotes: 5
        }
      ]
    },
    {
      id: 'c2',
      author: mockUsers[3],
      content: 'Great update team! The profile customization looks sleek.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      upvotes: 8
    }
  ],
  'post-2': [
    {
      id: 'c3',
      author: mockUsers[6],
      content: 'Very important info! I always keep a first aid kit handy.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      upvotes: 15,
      hasUpvoted: true
    },
    {
      id: 'c4',
      author: mockUsers[5],
      content: 'What should go into a basic pet first aid kit?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
      upvotes: 3,
      replies: [
        {
          id: 'c4-r1',
          author: mockUsers[1],
          content: 'Great question! Bandages, antiseptic wipes, tweezers, and hydrogen peroxide (ask vet first!) are essentials.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          upvotes: 20,
          hasUpvoted: true
        }
      ]
    }
  ],
  'post-7': [
     {
      id: 'c5',
      author: mockUsers[8],
      content: 'My Bengal loves anything that moves! Feather wands are top tier.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      upvotes: 7
    },
    {
      id: 'c6',
      author: mockUsers[7],
      content: 'We use puzzle toys for mental stimulation. Highly recommend!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      upvotes: 10,
      hasUpvoted: true
    }
  ]
};

// Sponsored ads
export const sponsoredAds = [
  {
    id: 'ad-1',
    title: 'Premium Organic Pet Food - 20% OFF',
    description: 'High-quality, organic pet food for your furry friends. First-time customers get 20% off with code: FORUM20',
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    ctaText: 'Shop Now',
    targetUrl: 'https://petfoodplus.example.com',
    sponsor: 'PetFood Plus LT',
    sponsorLogo: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=200&q=80',
    isActive: true,
    impressions: 15847,
    clicks: 523,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-12-31'),
    targetCategories: ['dogs', 'cats', 'all']
  },
  {
    id: 'ad-2',
    title: 'Pet Insurance - Get Protected Today',
    description: 'Comprehensive pet insurance starting at €15/month. Cover vet bills, surgeries, and more.',
    imageUrl: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80',
    ctaText: 'Get Quote',
    targetUrl: 'https://petinsurance.example.com',
    sponsor: 'SafePaws Insurance',
    sponsorLogo: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=200&q=80',
    isActive: true,
    impressions: 12334,
    clicks: 789,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2025-12-31'),
    targetCategories: ['all']
  },
  {
    id: 'ad-3',
    title: 'Professional Dog Training Classes',
    description: 'Expert trainers, proven methods. Group and private sessions available. First class free!',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    ctaText: 'Book Now',
    targetUrl: 'https://dogtraining.example.com',
    sponsor: 'ProPaws Training Center',
    sponsorLogo: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=200&q=80',
    isActive: true,
    impressions: 8923,
    clicks: 412,
    startDate: new Date('2024-09-01'),
    endDate: new Date('2025-06-30'),
    targetCategories: ['dogs']
  }
];

// Mock posts
export const mockPosts = [
  // GLOBAL PINNED ANNOUNCEMENT - ADMIN
  {
    id: 'post-global-1',
    author: mockUsers[9], // AdminLT
    title: '🎉 Welcome to PawForum LT - Community Guidelines & Rules',
    content: 'Welcome to our growing pet community! Please read our community guidelines carefully. Be respectful, share helpful information, and help us build the best pet forum in Lithuania! For any questions, contact our mod team.',
    category: 'community',
    subcategory: 'announcements',
    pawvotes: 456,
    commentCount: 89,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    hasUpvoted: false,
    isPinned: true,
    isGlobalPin: true,
    pinLevel: 'global',
    reactions: [
      { emoji: '🎉', count: 123 },
      { emoji: '❤️', count: 89 },
      { emoji: '👍', count: 67 }
    ]
  },
  // MODERATOR ANNOUNCEMENT
  {
    id: 'post-mod-1',
    author: mockUsers[2], // ModAlex
    title: '📢 New Forum Features Released - Check Them Out!',
    content: 'Exciting news! We just released several new features including achievement system, improved moderation tools, and enhanced profile customization. Check your settings page to explore!',
    category: 'community',
    subcategory: 'announcements',
    pawvotes: 234,
    commentCount: 45,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14),
    hasUpvoted: true,
    isPinned: true,
    pinLevel: 'category',
    reactions: [
      { emoji: '🚀', count: 78 },
      { emoji: '🎉', count: 56 },
      { emoji: '❤️', count: 43 }
    ]
  },
  {
    id: 'post-1',
    author: mockUsers[0],
    title: 'Best training tips for puppies?',
    content: 'Just got a new Golden Retriever puppy and looking for effective training methods. What worked for you?',
    category: 'dogs',
    subcategory: 'dog-training',
    pawvotes: 45,
    commentCount: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    hasUpvoted: false,
    pinLevel: 'subcategory',
    reactions: [
      { emoji: '❤️', count: 8 },
      { emoji: '🐕', count: 5 }
    ]
  },
  {
    id: 'post-2',
    author: mockUsers[1], // Dr. Emma
    title: 'Emergency Care Guide: What Every Pet Owner Should Know',
    content: 'As a veterinary surgeon, I want to share essential emergency care tips that could save your pet\'s life. Here are the top 5 things you should always have ready...',
    category: 'community',
    subcategory: 'ask-pros',
    pawvotes: 234,
    commentCount: 45,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    hasUpvoted: true,
    isPinned: true,
    pinLevel: 'subcategory',
    reactions: [
      { emoji: '❤️', count: 67 },
      { emoji: '👍', count: 43 },
      { emoji: '🙏', count: 28 }
    ]
  },
  // ADMIN POST WITH IMAGES
  {
    id: 'post-admin-2',
    author: mockUsers[9], // AdminLT
    title: '🏆 Monthly Top Contributors - December 2024',
    content: 'Congratulations to our top contributors this month! Your dedication to helping fellow pet owners is truly appreciated. Keep up the amazing work! 🌟',
    category: 'community',
    subcategory: 'announcements',
    pawvotes: 189,
    commentCount: 34,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    hasUpvoted: false,
    images: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80',
      'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80'
    ],
    reactions: [
      { emoji: '🏆', count: 67 },
      { emoji: '🎉', count: 45 },
      { emoji: '❤️', count: 38 }
    ]
  },
  {
    id: 'post-3',
    author: mockUsers[3], // TrainerMark
    title: 'Free Training Workshop This Saturday!',
    content: 'Join me for a free positive reinforcement training workshop at Central Park. All skill levels welcome! 🐕',
    category: 'local-events',
    subcategory: 'events-meetups',
    pawvotes: 89,
    commentCount: 23,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    hasUpvoted: false,
    location: 'Central Park, Vilnius',
    reactions: [
      { emoji: '🎉', count: 34 },
      { emoji: '🐕', count: 21 }
    ]
  },
  // MODERATOR HELPING USER
  {
    id: 'post-mod-2',
    author: mockUsers[2], // ModAlex
    title: 'Common Mistakes New Pet Owners Make (And How to Avoid Them)',
    content: 'Based on hundreds of posts I\'ve reviewed, here are the top 10 mistakes I see new pet owners making. Let\'s learn from each other and help our pets thrive! 🐾',
    category: 'community',
    subcategory: 'general-discussion',
    pawvotes: 167,
    commentCount: 78,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10),
    hasUpvoted: false,
    reactions: [
      { emoji: '💡', count: 56 },
      { emoji: '👍', count: 43 },
      { emoji: '📚', count: 32 }
    ]
  },
  {
    id: 'post-4',
    author: mockUsers[4], // ShelterHeart
    title: 'Meet Luna - Looking for Her Forever Home',
    content: 'Luna is a 2-year-old mixed breed who loves cuddles and playtime. She\'s great with kids and other dogs. Can you give her a loving home?',
    category: 'adoption',
    subcategory: 'available-adoption',
    pawvotes: 156,
    commentCount: 34,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    hasUpvoted: true,
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
    reactions: [
      { emoji: '❤️', count: 89 },
      { emoji: '🐕', count: 45 },
      { emoji: '🏠', count: 22 }
    ]
  },
  // ADMIN POLL
  {
    id: 'post-admin-poll',
    author: mockUsers[9], // AdminLT
    title: '📊 Community Feedback: What features would you like to see next?',
    content: 'Help us prioritize our development roadmap! Vote for the features you\'d like to see implemented in the coming months. Your feedback matters! 🗳️',
    category: 'community',
    subcategory: 'announcements',
    pawvotes: 278,
    commentCount: 92,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 15),
    hasUpvoted: true,
    poll: {
      question: 'What feature do you want most?',
      options: [
        { id: 'feat-1', text: 'Video posts & stories', votes: 123 },
        { id: 'feat-2', text: 'Pet health tracker', votes: 156 },
        { id: 'feat-3', text: 'Marketplace section', votes: 89 },
        { id: 'feat-4', text: 'Live chat groups', votes: 134 }
      ],
      totalVotes: 502,
      hasVoted: true,
      votedOptionId: 'feat-2',
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 72)
    },
    reactions: [
      { emoji: '📊', count: 45, hasReacted: true },
      { emoji: '👍', count: 67, hasReacted: false },
      { emoji: '💡', count: 38, hasReacted: false },
      { emoji: '❤️', count: 12, hasReacted: true },
      { emoji: '🎉', count: 8, hasReacted: false },
      { emoji: '🔥', count: 5, hasReacted: true },
      { emoji: '👀', count: 3, hasReacted: false }
    ]
  },
  {
    id: 'post-5',
    author: mockUsers[6], // CatWhisperer
    title: 'Understanding Cat Body Language',
    content: 'Many people misinterpret cat behavior. Here\'s a comprehensive guide to understanding what your cat is trying to tell you through body language.',
    category: 'cats',
    subcategory: 'cat-behavior',
    pawvotes: 178,
    commentCount: 56,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18),
    hasUpvoted: false,
    reactions: [
      { emoji: '😺', count: 67 },
      { emoji: '👍', count: 44 },
      { emoji: '❤️', count: 38 }
    ]
  },
  {
    id: 'post-6',
    author: mockUsers[5], // GoldenDad
    title: 'Lost: Golden Retriever in Downtown Area',
    content: 'URGENT: My Golden Retriever Max went missing near Gedimino Avenue. He\'s wearing a blue collar with tags. Please contact if you\'ve seen him!',
    category: 'lost-found',
    subcategory: 'lost-pets',
    pawvotes: 203,
    commentCount: 67,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    hasUpvoted: true,
    isPinned: true,
    location: 'Gedimino Avenue, Vilnius',
    reactions: [
      { emoji: '🙏', count: 89 },
      { emoji: '❤️', count: 56 }
    ]
  },
  {
    id: 'post-7',
    author: mockUsers[0],
    title: 'What\'s your pet\'s favorite toy?',
    content: 'Curious to know what toys your pets absolutely love! Share photos if you can 📸',
    category: 'community',
    subcategory: 'show-off',
    pawvotes: 67,
    commentCount: 89,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
    hasUpvoted: false,
    poll: {
      question: 'What type of toys does your pet prefer?',
      options: [
        { id: 'opt-1', text: 'Chew toys', votes: 45 },
        { id: 'opt-2', text: 'Interactive toys', votes: 67 },
        { id: 'opt-3', text: 'Plush toys', votes: 34 },
        { id: 'opt-4', text: 'Balls', votes: 78 }
      ],
      totalVotes: 224,
      hasVoted: true,
      votedOptionId: 'opt-2',
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 48)
    },
    reactions: [
      { emoji: '🎾', count: 23 },
      { emoji: '🧸', count: 19 }
    ]
  },
  // MODERATOR COMMUNITY ENGAGEMENT
  {
    id: 'post-mod-3',
    author: mockUsers[2], // ModAlex
    title: '🎯 Weekly Challenge: Share Your Pet\'s Funniest Moment!',
    content: 'Let\'s spread some joy! Share your pet\'s funniest, silliest, or most adorable moment this week. We all need a good laugh! 😄 Best stories get featured!',
    category: 'community',
    subcategory: 'show-off',
    pawvotes: 145,
    commentCount: 112,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28),
    hasUpvoted: false,
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80'
    ],
    reactions: [
      { emoji: '😂', count: 78 },
      { emoji: '❤️', count: 56 },
      { emoji: '🐾', count: 34 }
    ]
  },
  // VET PROFESSIONAL POST
  {
    id: 'post-vet-1',
    author: mockUsers[1], // Dr. Emma
    title: '💉 Vaccination Schedule for Puppies & Kittens',
    content: 'As a vet, I often get asked about vaccination schedules. Here\'s a comprehensive guide with recommended timelines, what each vaccine protects against, and important reminders. Save this for reference!',
    category: 'community',
    subcategory: 'ask-pros',
    pawvotes: 312,
    commentCount: 67,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40),
    hasUpvoted: true,
    images: [
      'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80'
    ],
    reactions: [
      { emoji: '📋', count: 89 },
      { emoji: '❤️', count: 76 },
      { emoji: '🙏', count: 54 }
    ]
  },
  // TRAINER PROFESSIONAL POST
  {
    id: 'post-trainer-1',
    author: mockUsers[3], // TrainerMark
    title: '🎓 Puppy Socialization: Critical Windows and Best Practices',
    content: 'The first 16 weeks are crucial for puppy socialization! Here\'s everything you need to know about safe socialization during this critical period. Includes dos and don\'ts.',
    category: 'dogs',
    subcategory: 'dog-training',
    pawvotes: 198,
    commentCount: 54,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 45),
    hasUpvoted: false,
    reactions: [
      { emoji: '🐕', count: 67 },
      { emoji: '👍', count: 45 },
      { emoji: '📚', count: 32 }
    ]
  },
  // MORE REGULAR POSTS WITH ACTIVITY
  {
    id: 'post-8',
    author: mockUsers[7], // PoodlePerfection
    title: 'Best grooming tips for long-haired breeds?',
    content: 'My poodle\'s coat gets matted so easily. What are your best grooming routines and product recommendations?',
    category: 'dogs',
    subcategory: 'dog-grooming',
    pawvotes: 78,
    commentCount: 34,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    hasUpvoted: false,
    reactions: [
      { emoji: '✂️', count: 23 },
      { emoji: '🐩', count: 18 }
    ]
  },
  {
    id: 'post-9',
    author: mockUsers[6], // CatWhisperer
    title: 'DIY Cat Enrichment Ideas on a Budget',
    content: 'You don\'t need expensive toys! Here are 15 DIY enrichment ideas using household items. My cats love #7!',
    category: 'cats',
    subcategory: 'cat-behavior',
    pawvotes: 134,
    commentCount: 45,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 52),
    hasUpvoted: true,
    images: [
      'https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=800&q=80',
      'https://images.unsplash.com/photo-1573865526739-10c1dd7fc2f7?w=800&q=80'
    ],
    reactions: [
      { emoji: '😺', count: 56 },
      { emoji: '💡', count: 34 },
      { emoji: '❤️', count: 29 }
    ]
  },
  // ADMIN MODERATION EXAMPLE
  {
    id: 'post-admin-3',
    author: mockUsers[9], // AdminLT
    title: '⚠️ Reminder: Report Suspicious Posts & Scams',
    content: 'We\'ve seen an increase in suspicious posts lately. Please use the report feature if you see scams, spam, or inappropriate content. Our mod team reviews all reports within 24 hours. Stay safe! 🛡️',
    category: 'community',
    subcategory: 'announcements',
    pawvotes: 234,
    commentCount: 56,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 60),
    hasUpvoted: false,
    reactions: [
      { emoji: '🛡️', count: 78 },
      { emoji: '👍', count: 67 },
      { emoji: '🙏', count: 45 }
    ]
  },
  {
    id: 'post-10',
    author: mockUsers[4], // ShelterHeart
    title: '🏠 Success Story: Buddy Found His Forever Home!',
    content: 'Amazing news! Buddy, who we posted about last month, has been adopted by a loving family. Thank you to everyone who shared and supported! This is why we do what we do ❤️',
    category: 'adoption',
    subcategory: 'adoption-stories',
    pawvotes: 289,
    commentCount: 78,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 65),
    hasUpvoted: true,
    images: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80'
    ],
    reactions: [
      { emoji: '❤️', count: 145 },
      { emoji: '🎉', count: 89 },
      { emoji: '🏠', count: 56 }
    ]
  },
  {
    id: 'post-11',
    author: mockUsers[5], // GoldenDad
    title: 'Best dog parks in Vilnius?',
    content: 'Looking for recommendations on dog-friendly parks where my Golden can run off-leash and socialize safely.',
    category: 'local-events',
    subcategory: 'local-recommendations',
    pawvotes: 92,
    commentCount: 43,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 70),
    hasUpvoted: false,
    location: 'Vilnius, Lithuania',
    reactions: [
      { emoji: '🏞️', count: 34 },
      { emoji: '🐕', count: 28 }
    ]
  },
  // MODERATOR EDUCATIONAL POST
  {
    id: 'post-mod-4',
    author: mockUsers[2], // ModAlex
    title: '📚 Beginner\'s Guide to Pet First Aid',
    content: 'Every pet owner should know basic first aid! Here\'s a comprehensive guide covering common emergencies, what supplies to keep on hand, and when to rush to the vet vs. monitoring at home.',
    category: 'community',
    subcategory: 'ask-pros',
    pawvotes: 267,
    commentCount: 89,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 75),
    hasUpvoted: true,
    images: [
      'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&q=80'
    ],
    reactions: [
      { emoji: '🏥', count: 89 },
      { emoji: '📋', count: 67 },
      { emoji: '🙏', count: 54 }
    ]
  },
  {
    id: 'post-12',
    author: mockUsers[0],
    title: 'Puppy won\'t stop biting - help!',
    content: 'My 3-month-old puppy keeps nipping at hands and furniture. I\'ve tried redirecting but nothing works. Any advice?',
    category: 'dogs',
    subcategory: 'dog-training',
    pawvotes: 56,
    commentCount: 67,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 80),
    hasUpvoted: false,
    reactions: [
      { emoji: '😅', count: 23 },
      { emoji: '🐕', count: 18 }
    ]
  },
  {
    id: 'post-13',
    author: mockUsers[8], // BengalLover
    title: 'Bengal cat behavior - anyone else have experience?',
    content: 'My Bengal is SO energetic and vocal. Is this normal for the breed? Looking for tips to keep him entertained.',
    category: 'cats',
    subcategory: 'cat-behavior',
    pawvotes: 87,
    commentCount: 38,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 85),
    hasUpvoted: false,
    reactions: [
      { emoji: '😺', count: 34 },
      { emoji: '💪', count: 21 }
    ]
  },
  // VET RESPONDING TO COMMON QUESTION
  {
    id: 'post-vet-2',
    author: mockUsers[1], // Dr. Emma
    title: '🩺 Why Annual Vet Checkups Matter (Even for Healthy Pets)',
    content: 'I see many owners skip annual checkups because their pet "seems fine." Here\'s why preventive care is crucial and what we look for during wellness exams that you might miss at home.',
    category: 'community',
    subcategory: 'ask-pros',
    pawvotes: 223,
    commentCount: 54,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 90),
    hasUpvoted: true,
    reactions: [
      { emoji: '🩺', count: 78 },
      { emoji: '❤️', count: 65 },
      { emoji: '👍', count: 43 }
    ]
  },
  {
    id: 'post-14',
    author: mockUsers[7], // PoodlePerfection
    title: 'Amazing dog-friendly cafe in Old Town!',
    content: 'Just discovered the cutest pet-friendly cafe near Cathedral Square. They even have a special menu for dogs! 🐕☕',
    category: 'local-events',
    subcategory: 'local-recommendations',
    pawvotes: 112,
    commentCount: 29,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 95),
    hasUpvoted: false,
    location: 'Old Town, Vilnius',
    images: [
      'https://images.unsplash.com/photo-1554224311-beee415c201f?w=800&q=80'
    ],
    reactions: [
      { emoji: '☕', count: 45 },
      { emoji: '🐕', count: 34 },
      { emoji: '❤️', count: 28 }
    ]
  }
];

// Mock followers - users who follow the current user
export const mockFollowers = [
  mockUsers[1], // Dr. Emma Sullivan
  mockUsers[3], // TrainerMark
  mockUsers[5], // GoldenDad
  mockUsers[7]  // PoodlePerfection
];

// Mock following - users the current user follows
export const mockFollowing = [
  mockUsers[1], // Dr. Emma Sullivan
  mockUsers[3], // TrainerMark
  mockUsers[4], // ShelterHeart
  mockUsers[5]  // GoldenDad
];

// Mock reports for admin/moderator
export const mockReports = [
  {
    id: 'report-1',
    type: 'post' as const,
    targetId: 'post-1', // Existing post about puppy training
    targetContent: 'Just got a new Golden Retriever puppy and looking for effective training methods. What worked for you?',
    targetAuthor: mockUsers[0],
    reporter: mockUsers[4], // ShelterHeart reports it
    reason: 'spam' as const,
    customReason: 'Suspected spam - multiple similar posts',
    status: 'pending' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 'report-2',
    type: 'comment' as const,
    targetId: 'comment-offensive-1',
    postId: 'post-2', // Dr. Emma's emergency care post
    targetContent: 'This is completely wrong advice! You have no idea what you\'re talking about...',
    targetAuthor: { id: 'troll-1', username: 'AngryUser', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AngryUser', role: 'member' as const, memberSince: new Date(2024, 10, 15), lastLoginDate: new Date(), currentStreak: 1, bestStreak: 1, achievements: [], displayedBadges: [], isOnline: false, showOnlineStatus: true, warningCount: 2 },
    reporter: mockUsers[1], // Dr. Emma reports offensive comment
    reason: 'harassment' as const,
    customReason: 'Offensive language and personal attacks towards other members',
    status: 'pending' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: 'report-3',
    type: 'post' as const,
    targetId: 'post-5', // CatWhisperer's cat body language post
    targetContent: 'Understanding Cat Body Language - Many people misinterpret cat behavior...',
    targetAuthor: mockUsers[6], // CatWhisperer
    reporter: { id: 'user-bad-reporter', username: 'BadReporter', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BadReporter', role: 'member' as const, memberSince: new Date(2024, 9, 10), lastLoginDate: new Date(), currentStreak: 1, bestStreak: 1, achievements: [], displayedBadges: [], isOnline: false, showOnlineStatus: true },
    reason: 'misinformation' as const,
    customReason: 'Claims this information about cats is incorrect',
    status: 'resolved' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    resolvedBy: mockUsers[2], // ModAlex resolved it
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
    moderatorNote: 'Content verified by veterinary professionals - report dismissed as false claim',
    isContentVerified: true,
    verifiedBy: mockUsers[2],
    verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
    newReportsAfterVerification: 3
  },
  {
    id: 'report-4',
    type: 'post' as const,
    targetId: 'post-7', // Poll post about pet toys
    targetContent: 'What\'s your pet\'s favorite toy? Curious to know what toys your pets absolutely love!',
    targetAuthor: mockUsers[0],
    reporter: { id: 'user-reporter-2', username: 'ConcernedMember', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Concerned', role: 'member' as const, memberSince: new Date(2024, 8, 5), lastLoginDate: new Date(), currentStreak: 3, bestStreak: 5, achievements: [], displayedBadges: [], isOnline: true, showOnlineStatus: true },
    reason: 'inappropriate' as const,
    customReason: 'Contains inappropriate images in comments',
    status: 'pending' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5)
  },
  {
    id: 'report-5',
    type: 'post' as const,
    targetId: 'post-3', // Mark's puppy anxiety post
    targetContent: 'My puppy gets very anxious when left alone. Looking for advice on separation anxiety...',
    targetAuthor: mockUsers[3], // PawsomeDad
    reporter: { id: 'user-false-reporter-1', username: 'OverlyProtective', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Protective', role: 'member' as const, memberSince: new Date(2024, 7, 20), lastLoginDate: new Date(), currentStreak: 2, bestStreak: 4, achievements: [], displayedBadges: [], isOnline: false, showOnlineStatus: true },
    reason: 'misinformation' as const,
    customReason: 'This advice is dangerous and misleading',
    status: 'dismissed' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    resolvedBy: mockUsers[2], // ModAlex
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    moderatorNote: 'Post reviewed by certified trainer - content is safe and helpful. Marked as verified.',
    isContentVerified: true,
    verifiedBy: mockUsers[2],
    verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    newReportsAfterVerification: 7
  },
  {
    id: 'report-6',
    type: 'post' as const,
    targetId: 'post-spam-1',
    targetContent: 'CHECK OUT MY WEBSITE FOR CHEAP PET SUPPLIES!!! CLICK HERE NOW!!!',
    targetAuthor: { id: 'spammer-1', username: 'SpamBot2024', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SpamBot', role: 'member' as const, memberSince: new Date(2024, 11, 1), lastLoginDate: new Date(), currentStreak: 1, bestStreak: 1, achievements: [], displayedBadges: [], isOnline: false, showOnlineStatus: true, isBlocked: true, warningCount: 3 },
    reporter: mockUsers[2], // ModAlex
    reason: 'spam' as const,
    customReason: 'Obvious spam bot posting commercial links',
    status: 'resolved' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
    resolvedBy: mockUsers[9], // AdminLT
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 70),
    moderatorNote: 'User blocked after 3 warnings. All content deleted.'
  }
];