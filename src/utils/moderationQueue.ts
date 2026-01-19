/**
 * Moderation Queue System (Mock)
 * 
 * Simulates a backend service that manages auto-blocked content.
 * In a real application, this would be replaced by database tables (e.g., 'blocked_content', 'appeals')
 * and API endpoints.
 * 
 * Workflow:
 * 1. AI/Filters detect sensitive content -> addToModerationQueue()
 * 2. Content is hidden from public feed
 * 3. Admins review in ModerationQueue component -> approveContent() or rejectContent()
 * 4. If rejected, users can appeal -> submitAppeal()
 * 5. Admins review appeal -> reviewAppeal()
 */

export interface BlockedContent {
  id: string;
  type: 'post' | 'comment';
  userId: string;
  username: string;
  userAvatar: string;
  title?: string; // for posts
  content: string;
  images?: string[];
  video?: string;
  category?: string;
  subcategory?: string;
  
  // Moderation details
  blockReason: 'profanity' | 'hate-speech' | 'spam' | 'inappropriate-content';
  blockedAt: Date;
  blockedWords?: string[];
  severity: 'low' | 'medium' | 'high';
  autoBlocked: boolean; // true if AI blocked, false if user reported
  
  // Review status
  status: 'pending' | 'approved' | 'rejected' | 'appealed';
  reviewedBy?: string; // admin username
  reviewedAt?: Date;
  reviewNotes?: string;
  
  // User appeal
  appealedAt?: Date;
  appealReason?: string;
  appealStatus?: 'pending' | 'approved' | 'rejected';
}

// In-memory store (in production, use database)
const moderationQueue: BlockedContent[] = [];

/**
 * Add blocked content to moderation queue
 */
export function addToModerationQueue(content: Omit<BlockedContent, 'id' | 'blockedAt' | 'status' | 'autoBlocked'>): string {
  const id = `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const blockedContent: BlockedContent = {
    ...content,
    id,
    blockedAt: new Date(),
    status: 'pending',
    autoBlocked: true
  };
  
  moderationQueue.push(blockedContent);
  
  return id;
}

/**
 * Get all pending moderation items (for admin dashboard)
 */
export function getPendingModerations(): BlockedContent[] {
  return moderationQueue.filter(item => item.status === 'pending');
}

/**
 * Get all appealed items
 */
export function getAppealedModerations(): BlockedContent[] {
  return moderationQueue.filter(item => item.status === 'appealed');
}

/**
 * Get moderation history
 */
export function getModerationHistory(): BlockedContent[] {
  return moderationQueue.filter(item => item.status === 'approved' || item.status === 'rejected');
}

/**
 * Get user's blocked content
 */
export function getUserBlockedContent(userId: string): BlockedContent[] {
  return moderationQueue.filter(item => item.userId === userId);
}

/**
 * Admin approves content (was false positive)
 */
export function approveContent(id: string, adminUsername: string, notes?: string): boolean {
  const item = moderationQueue.find(m => m.id === id);
  
  if (!item) return false;
  
  item.status = 'approved';
  item.reviewedBy = adminUsername;
  item.reviewedAt = new Date();
  item.reviewNotes = notes;
  
  // In production, would publish the content to live feed
  
  return true;
}

/**
 * Admin rejects content (correctly blocked)
 */
export function rejectContent(id: string, adminUsername: string, notes?: string): boolean {
  const item = moderationQueue.find(m => m.id === id);
  
  if (!item) return false;
  
  item.status = 'rejected';
  item.reviewedBy = adminUsername;
  item.reviewedAt = new Date();
  item.reviewNotes = notes;
  
  return true;
}

/**
 * User submits appeal for blocked content
 * NOTE: Only posts can be appealed - comments cannot be appealed
 */
export function submitAppeal(id: string, appealReason: string): boolean {
  const item = moderationQueue.find(m => m.id === id);
  
  if (!item) return false;
  
  // ONLY POSTS can be appealed - not comments
  if (item.type !== 'post') {
    return false;
  }
  
  // Can only appeal rejected or pending items
  if (item.status !== 'pending' && item.status !== 'rejected') {
    return false;
  }
  
  item.status = 'appealed';
  item.appealedAt = new Date();
  item.appealReason = appealReason;
  item.appealStatus = 'pending';
  
  return true;
}

/**
 * Admin reviews appeal
 */
export function reviewAppeal(id: string, approved: boolean, adminUsername: string, notes?: string): boolean {
  const item = moderationQueue.find(m => m.id === id);
  
  if (!item || item.status !== 'appealed') return false;
  
  item.appealStatus = approved ? 'approved' : 'rejected';
  item.status = approved ? 'approved' : 'rejected';
  item.reviewedBy = adminUsername;
  item.reviewedAt = new Date();
  item.reviewNotes = notes;
  
  return true;
}

/**
 * Get statistics for admin dashboard
 */
export function getModerationStats() {
  const total = moderationQueue.length;
  const pending = moderationQueue.filter(m => m.status === 'pending').length;
  const appealed = moderationQueue.filter(m => m.status === 'appealed').length;
  const approved = moderationQueue.filter(m => m.status === 'approved').length;
  const rejected = moderationQueue.filter(m => m.status === 'rejected').length;
  
  const byReason = {
    profanity: moderationQueue.filter(m => m.blockReason === 'profanity').length,
    hateSpeech: moderationQueue.filter(m => m.blockReason === 'hate-speech').length,
    spam: moderationQueue.filter(m => m.blockReason === 'spam').length,
    inappropriate: moderationQueue.filter(m => m.blockReason === 'inappropriate-content').length
  };
  
  const bySeverity = {
    low: moderationQueue.filter(m => m.severity === 'low').length,
    medium: moderationQueue.filter(m => m.severity === 'medium').length,
    high: moderationQueue.filter(m => m.severity === 'high').length
  };
  
  return {
    total,
    pending,
    appealed,
    approved,
    rejected,
    byReason,
    bySeverity,
    accuracy: total > 0 ? ((approved / total) * 100).toFixed(1) : '0' // False positive rate
  };
}

// Mock data for testing
export function initializeMockModerationQueue() {
  // Add some sample blocked content
  const pendingPost1 = addToModerationQueue({
    type: 'post',
    userId: 'user_123',
    username: 'TestUser',
    userAvatar: 'https://i.pravatar.cc/150?img=8',
    title: 'Check this out!',
    content: 'This is a test post with some spam content $$$ click here now to earn money fast!',
    category: 'general',
    subcategory: 'chat',
    blockReason: 'spam',
    severity: 'medium'
  });
  
  const pendingComment = addToModerationQueue({
    type: 'comment',
    userId: 'user_456',
    username: 'AnotherUser',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    content: 'This contains inappropriate language that was blocked',
    blockReason: 'profanity',
    severity: 'low',
    blockedWords: ['inappropriate']
  });
  
  const hateSpeechPost = addToModerationQueue({
    type: 'post',
    userId: 'user_789',
    username: 'ProblemUser',
    userAvatar: 'https://i.pravatar.cc/150?img=15',
    title: 'Hate speech test',
    content: 'Content with hate speech keywords that triggered auto-block',
    category: 'general',
    blockReason: 'hate-speech',
    severity: 'high'
  });
  
  // Add appealed items
  const appeal1 = addToModerationQueue({
    type: 'post',
    userId: 'user_101',
    username: 'DogLover42',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    title: 'Mano šuo vėl pradėjo kąsti lauko šiukšles',
    content: 'Sveiki! Mano šuo pradėjo kąsti lauko šiukšles ir aš nežinau ką daryti. Ar kas nors galėtų padėti?',
    category: 'dogs',
    subcategory: 'behavior',
    blockReason: 'profanity',
    severity: 'low',
    blockedWords: ['šik']
  });
  
  // Submit appeal for appeal1
  submitAppeal(
    appeal1,
    'Norėjau parašyti "šiukšles", bet automatinė sistema aptiko kaip necenzūrinį žodį. Nėra jokio netinkamo turinio - tiesiog rašau apie savo šuns elgesį.'
  );
  
  // Add second appeal
  const appeal2 = addToModerationQueue({
    type: 'post',
    userId: 'user_202',
    username: 'CatMom',
    userAvatar: 'https://i.pravatar.cc/150?img=20',
    title: 'Best cat food recommendations?',
    content: 'Looking for quality cat food brands. Click here to see my full review and comparison! www.catfood-review.com',
    category: 'cats',
    subcategory: 'nutrition',
    blockReason: 'spam',
    severity: 'medium',
    blockedWords: ['click here']
  });
  
  submitAppeal(
    appeal2,
    'This is not spam - I\'m sharing a genuine review website that I created myself to help other cat owners. It\'s educational content, not advertising.'
  );
  
  // Add third appeal - image moderation false positive
  const appeal3 = addToModerationQueue({
    type: 'post',
    userId: 'user_303',
    username: 'VetDrSmith',
    userAvatar: 'https://i.pravatar.cc/150?img=33',
    title: 'Skin condition diagnosis help',
    content: 'Can anyone help identify this skin condition on my patient? Posting medical images for educational purposes.',
    images: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop'],
    category: 'general',
    subcategory: 'health',
    blockReason: 'inappropriate-content',
    severity: 'medium'
  });
  
  submitAppeal(
    appeal3,
    'I am a verified veterinarian posting educational medical content. These are clinical images for diagnosis purposes, not inappropriate content. Please review context.'
  );
  
  // Add some history items (already reviewed)
  const approvedItem = addToModerationQueue({
    type: 'comment',
    userId: 'user_404',
    username: 'HelperUser',
    userAvatar: 'https://i.pravatar.cc/150?img=40',
    content: 'Great post! This really helped me with my dog training.',
    blockReason: 'profanity',
    severity: 'low',
    blockedWords: ['hell']
  });
  
  // Approve it
  approveContent(approvedItem, 'AdminUser', 'False positive - "hell" used in "helped" context');
  
  const rejectedItem = addToModerationQueue({
    type: 'post',
    userId: 'user_505',
    username: 'SpamBot',
    userAvatar: 'https://i.pravatar.cc/150?img=50',
    title: '🔥 EARN MONEY NOW 🔥',
    content: 'Make $5000 per day working from home! Click here now! Limited time offer! www.scam-site.com',
    category: 'general',
    blockReason: 'spam',
    severity: 'high'
  });
  
  // Reject it
  rejectContent(rejectedItem, 'AdminUser', 'Clear spam - multiple violations');
}