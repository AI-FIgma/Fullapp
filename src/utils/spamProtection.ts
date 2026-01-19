import type { User, Post, Comment } from '../App';

// Spam protection configuration
export const SPAM_CONFIG = {
  // Rate limits (posts per time period)
  NEW_USER_POST_LIMIT_PER_DAY: 3,
  NEW_USER_COMMENT_LIMIT_PER_HOUR: 10,
  REGULAR_USER_POST_LIMIT_PER_DAY: 10,
  REGULAR_USER_COMMENT_LIMIT_PER_HOUR: 30,
  VERIFIED_USER_POST_LIMIT_PER_DAY: 50,
  
  // Cooldown periods (in minutes)
  NEW_USER_POST_COOLDOWN: 10,
  NEW_USER_COMMENT_COOLDOWN: 2,
  REGULAR_USER_POST_COOLDOWN: 5,
  REGULAR_USER_COMMENT_COOLDOWN: 0.5,
  
  // Account age requirements (in days)
  NEW_USER_THRESHOLD_DAYS: 7,
  TRUSTED_USER_THRESHOLD_DAYS: 30,
  
  // Content validation
  MAX_LINKS_NEW_USER: 0,
  MAX_LINKS_REGULAR_USER: 2,
  MAX_IDENTICAL_POSTS_ALLOWED: 1,
  
  // Duplicate detection
  SIMILARITY_THRESHOLD: 0.85, // 85% similar = duplicate
  
  // Auto-moderation
  AUTO_FLAG_THRESHOLD: 3, // Auto-flag if 3+ reports
};

// User activity tracking (in real app, this would be in database)
export const userActivityLog: Record<string, {
  posts: Date[];
  comments: Date[];
  lastPostTime?: Date;
  lastCommentTime?: Date;
}> = {};

// Get account age in days
export function getAccountAgeDays(user: User): number {
  const now = new Date();
  const memberSince = new Date(user.memberSince);
  const diffTime = Math.abs(now.getTime() - memberSince.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Check if user is "new" (less than 7 days)
export function isNewUser(user: User): boolean {
  return getAccountAgeDays(user) < SPAM_CONFIG.NEW_USER_THRESHOLD_DAYS;
}

// Check if user is "trusted" (30+ days + verified or high pawvotes)
export function isTrustedUser(user: User): boolean {
  const ageDays = getAccountAgeDays(user);
  return ageDays >= SPAM_CONFIG.TRUSTED_USER_THRESHOLD_DAYS || 
         user.role === 'vet' || 
         user.role === 'trainer' || 
         user.role === 'moderator' || 
         user.role === 'admin';
}

// Get post limit for user
export function getPostLimitPerDay(user: User): number {
  if (isTrustedUser(user)) return SPAM_CONFIG.VERIFIED_USER_POST_LIMIT_PER_DAY;
  if (isNewUser(user)) return SPAM_CONFIG.NEW_USER_POST_LIMIT_PER_DAY;
  return SPAM_CONFIG.REGULAR_USER_POST_LIMIT_PER_DAY;
}

// Get comment limit for user
export function getCommentLimitPerHour(user: User): number {
  if (isTrustedUser(user)) return 999; // No practical limit
  if (isNewUser(user)) return SPAM_CONFIG.NEW_USER_COMMENT_LIMIT_PER_HOUR;
  return SPAM_CONFIG.REGULAR_USER_COMMENT_LIMIT_PER_HOUR;
}

// Get post cooldown for user (in minutes)
export function getPostCooldown(user: User): number {
  if (isTrustedUser(user)) return 0;
  if (isNewUser(user)) return SPAM_CONFIG.NEW_USER_POST_COOLDOWN;
  return SPAM_CONFIG.REGULAR_USER_POST_COOLDOWN;
}

// Get comment cooldown for user (in minutes)
export function getCommentCooldown(user: User): number {
  if (isTrustedUser(user)) return 0;
  if (isNewUser(user)) return SPAM_CONFIG.NEW_USER_COMMENT_COOLDOWN;
  return SPAM_CONFIG.REGULAR_USER_COMMENT_COOLDOWN;
}

// Initialize activity log for user
function initializeActivityLog(userId: string) {
  if (!userActivityLog[userId]) {
    userActivityLog[userId] = {
      posts: [],
      comments: []
    };
  }
}

// Count posts in last 24 hours
export function getPostsInLast24Hours(userId: string): number {
  initializeActivityLog(userId);
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  return userActivityLog[userId].posts.filter(date => date > oneDayAgo).length;
}

// Count comments in last hour
export function getCommentsInLastHour(userId: string): number {
  initializeActivityLog(userId);
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
  return userActivityLog[userId].comments.filter(date => date > oneHourAgo).length;
}

// Get remaining cooldown time in seconds
export function getRemainingCooldown(
  userId: string,
  type: 'post' | 'comment',
  user: User
): number {
  initializeActivityLog(userId);
  const log = userActivityLog[userId];
  const lastTime = type === 'post' ? log.lastPostTime : log.lastCommentTime;
  
  if (!lastTime) return 0;
  
  const cooldownMinutes = type === 'post' 
    ? getPostCooldown(user) 
    : getCommentCooldown(user);
  
  if (cooldownMinutes === 0) return 0;
  
  const now = new Date();
  const cooldownMs = cooldownMinutes * 60 * 1000;
  const elapsedMs = now.getTime() - lastTime.getTime();
  
  if (elapsedMs >= cooldownMs) return 0;
  
  return Math.ceil((cooldownMs - elapsedMs) / 1000);
}

// Format cooldown time for display
export function formatCooldownTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} sek.`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} min.`;
}

// Check if user can post
export function canUserPost(user: User): {
  allowed: boolean;
  reason?: string;
  cooldownSeconds?: number;
  postsToday?: number;
  limit?: number;
} {
  const userId = user.id;
  
  // Check cooldown
  const cooldownSeconds = getRemainingCooldown(userId, 'post', user);
  if (cooldownSeconds > 0) {
    return {
      allowed: false,
      reason: `Palaukite ${formatCooldownTime(cooldownSeconds)} prieš kurdami kitą įrašą`,
      cooldownSeconds
    };
  }
  
  // Check daily limit
  const postsToday = getPostsInLast24Hours(userId);
  const limit = getPostLimitPerDay(user);
  
  if (postsToday >= limit) {
    return {
      allowed: false,
      reason: `Pasiekėte dienos limitą (${limit} įrašų per dieną)`,
      postsToday,
      limit
    };
  }
  
  return { allowed: true, postsToday, limit };
}

// Check if user can comment
export function canUserComment(user: User): {
  allowed: boolean;
  reason?: string;
  cooldownSeconds?: number;
  commentsThisHour?: number;
  limit?: number;
} {
  const userId = user.id;
  
  // Check cooldown
  const cooldownSeconds = getRemainingCooldown(userId, 'comment', user);
  if (cooldownSeconds > 0) {
    return {
      allowed: false,
      reason: `Palaukite ${formatCooldownTime(cooldownSeconds)} prieš rašant kitą komentarą`,
      cooldownSeconds
    };
  }
  
  // Check hourly limit
  const commentsThisHour = getCommentsInLastHour(userId);
  const limit = getCommentLimitPerHour(user);
  
  if (commentsThisHour >= limit) {
    return {
      allowed: false,
      reason: `Pasiekėte valandos limitą (${limit} komentarų per valandą)`,
      commentsThisHour,
      limit
    };
  }
  
  return { allowed: true, commentsThisHour, limit };
}

// Record post creation
export function recordPostCreation(userId: string) {
  initializeActivityLog(userId);
  userActivityLog[userId].posts.push(new Date());
  userActivityLog[userId].lastPostTime = new Date();
}

// Record comment creation
export function recordCommentCreation(userId: string) {
  initializeActivityLog(userId);
  userActivityLog[userId].comments.push(new Date());
  userActivityLog[userId].lastCommentTime = new Date();
}

// Count links in text
export function countLinks(text: string): number {
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.(com|org|net|lt|eu|io|co)[^\s]*)/gi;
  const matches = text.match(urlRegex);
  return matches ? matches.length : 0;
}

// Check if content has too many links
export function hasExcessiveLinks(text: string, user: User): {
  allowed: boolean;
  reason?: string;
  linkCount?: number;
  maxLinks?: number;
} {
  const linkCount = countLinks(text);
  const maxLinks = isNewUser(user) 
    ? SPAM_CONFIG.MAX_LINKS_NEW_USER 
    : SPAM_CONFIG.MAX_LINKS_REGULAR_USER;
  
  if (linkCount > maxLinks) {
    return {
      allowed: false,
      reason: isNewUser(user) 
        ? 'Nauji vartotojai negali rašyti nuorodų. Palaukite 7 dienas.'
        : `Per daug nuorodų (max ${maxLinks})`,
      linkCount,
      maxLinks
    };
  }
  
  return { allowed: true, linkCount, maxLinks };
}

// Simple text similarity check (Jaccard similarity)
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

// Check for duplicate content
export function isDuplicateContent(
  newContent: string,
  existingPosts: Post[],
  userId: string
): {
  isDuplicate: boolean;
  similarPost?: Post;
  similarity?: number;
} {
  for (const post of existingPosts) {
    // Only check user's own posts from last 7 days
    if (post.author.id !== userId) continue;
    
    const postAge = Date.now() - post.timestamp.getTime();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (postAge > sevenDays) continue;
    
    const contentToCheck = `${post.title} ${post.content}`;
    const similarity = calculateSimilarity(newContent, contentToCheck);
    
    if (similarity >= SPAM_CONFIG.SIMILARITY_THRESHOLD) {
      return {
        isDuplicate: true,
        similarPost: post,
        similarity
      };
    }
  }
  
  return { isDuplicate: false };
}

// Comprehensive spam check
export function checkSpam(
  content: string,
  user: User,
  existingPosts: Post[],
  type: 'post' | 'comment'
): {
  allowed: boolean;
  reason?: string;
  details?: any;
} {
  // Check rate limits
  if (type === 'post') {
    const postCheck = canUserPost(user);
    if (!postCheck.allowed) {
      return { allowed: false, reason: postCheck.reason, details: postCheck };
    }
  } else {
    const commentCheck = canUserComment(user);
    if (!commentCheck.allowed) {
      return { allowed: false, reason: commentCheck.reason, details: commentCheck };
    }
  }
  
  // Check for excessive links
  const linkCheck = hasExcessiveLinks(content, user);
  if (!linkCheck.allowed) {
    return { allowed: false, reason: linkCheck.reason, details: linkCheck };
  }
  
  // Check for duplicate content (posts only)
  if (type === 'post') {
    const duplicateCheck = isDuplicateContent(content, existingPosts, user.id);
    if (duplicateCheck.isDuplicate) {
      return {
        allowed: false,
        reason: 'Panašus įrašas jau egzistuoja. Prašome nekartoti to paties turinio.',
        details: duplicateCheck
      };
    }
  }
  
  return { allowed: true };
}

// Get user restrictions summary
export function getUserRestrictionsSummary(user: User): {
  accountAge: number;
  isNew: boolean;
  isTrusted: boolean;
  postLimit: number;
  commentLimit: number;
  postCooldown: number;
  commentCooldown: number;
  maxLinks: number;
  postsToday: number;
  commentsThisHour: number;
} {
  return {
    accountAge: getAccountAgeDays(user),
    isNew: isNewUser(user),
    isTrusted: isTrustedUser(user),
    postLimit: getPostLimitPerDay(user),
    commentLimit: getCommentLimitPerHour(user),
    postCooldown: getPostCooldown(user),
    commentCooldown: getCommentCooldown(user),
    maxLinks: isNewUser(user) ? SPAM_CONFIG.MAX_LINKS_NEW_USER : SPAM_CONFIG.MAX_LINKS_REGULAR_USER,
    postsToday: getPostsInLast24Hours(user.id),
    commentsThisHour: getCommentsInLastHour(user.id)
  };
}
