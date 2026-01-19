// Character limits for user-generated content
export const VALIDATION_LIMITS = {
  // Account Information
  USERNAME_MIN: 3,
  USERNAME_MAX: 20,
  BIO_MAX: 150,
  
  // Forum Content
  POST_TITLE_MIN: 10,
  POST_TITLE_MAX: 150,
  POST_CONTENT_MIN: 20,
  POST_CONTENT_MAX: 5000,
  COMMENT_MIN: 1,
  COMMENT_MAX: 1000,
  
  // Professional Information
  BUSINESS_NAME_MAX: 100,
  ADDRESS_MAX: 200,
  PHONE_MAX: 20,
  EMAIL_MAX: 100,
  WEBSITE_MAX: 200,
  
  // Support & Moderation
  TICKET_SUBJECT_MIN: 5,
  TICKET_SUBJECT_MAX: 100,
  TICKET_MESSAGE_MIN: 20,
  TICKET_MESSAGE_MAX: 2000,
  MODERATOR_NOTE_MAX: 500,
  REPORT_REASON_MAX: 300,
  
  // Advertisements
  AD_TITLE_MAX: 60,
  AD_DESCRIPTION_MAX: 150,
  AD_URL_MAX: 500,
  
  // Broadcast
  BROADCAST_TITLE_MAX: 100,
  BROADCAST_MESSAGE_MAX: 500,
} as const;

// Validation helper functions
export const validateUsername = (username: string): { valid: boolean; error?: string } => {
  if (!username || username.trim().length === 0) {
    return { valid: false, error: 'Username is required' };
  }
  if (username.length < VALIDATION_LIMITS.USERNAME_MIN) {
    return { valid: false, error: `Username must be at least ${VALIDATION_LIMITS.USERNAME_MIN} characters` };
  }
  if (username.length > VALIDATION_LIMITS.USERNAME_MAX) {
    return { valid: false, error: `Username cannot exceed ${VALIDATION_LIMITS.USERNAME_MAX} characters` };
  }
  // Check for valid characters (alphanumeric, underscore, hyphen)
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }
  return { valid: true };
};

export const validateBio = (bio: string): { valid: boolean; error?: string } => {
  if (bio.length > VALIDATION_LIMITS.BIO_MAX) {
    return { valid: false, error: `Bio cannot exceed ${VALIDATION_LIMITS.BIO_MAX} characters` };
  }
  return { valid: true };
};

export const validatePostTitle = (title: string): { valid: boolean; error?: string } => {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Title is required' };
  }
  if (title.length < VALIDATION_LIMITS.POST_TITLE_MIN) {
    return { valid: false, error: `Title must be at least ${VALIDATION_LIMITS.POST_TITLE_MIN} characters` };
  }
  if (title.length > VALIDATION_LIMITS.POST_TITLE_MAX) {
    return { valid: false, error: `Title cannot exceed ${VALIDATION_LIMITS.POST_TITLE_MAX} characters` };
  }
  return { valid: true };
};

export const validatePostContent = (content: string): { valid: boolean; error?: string } => {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'Content is required' };
  }
  if (content.length < VALIDATION_LIMITS.POST_CONTENT_MIN) {
    return { valid: false, error: `Content must be at least ${VALIDATION_LIMITS.POST_CONTENT_MIN} characters` };
  }
  if (content.length > VALIDATION_LIMITS.POST_CONTENT_MAX) {
    return { valid: false, error: `Content cannot exceed ${VALIDATION_LIMITS.POST_CONTENT_MAX} characters` };
  }
  return { valid: true };
};

export const validateComment = (comment: string): { valid: boolean; error?: string } => {
  if (!comment || comment.trim().length === 0) {
    return { valid: false, error: 'Comment is required' };
  }
  if (comment.length < VALIDATION_LIMITS.COMMENT_MIN) {
    return { valid: false, error: `Comment must be at least ${VALIDATION_LIMITS.COMMENT_MIN} character` };
  }
  if (comment.length > VALIDATION_LIMITS.COMMENT_MAX) {
    return { valid: false, error: `Comment cannot exceed ${VALIDATION_LIMITS.COMMENT_MAX} characters` };
  }
  return { valid: true };
};

// Helper to get character count color based on limits
export const getCharCountColor = (current: number, max: number, threshold = 0.9): string => {
  if (current > max) return 'text-red-500';
  if (current > max * threshold) return 'text-orange-500';
  return 'text-gray-400';
};

// Helper to check if near limit (for warnings)
export const isNearLimit = (current: number, max: number, threshold = 0.9): boolean => {
  return current > max * threshold;
};

// Helper to check if over limit
export const isOverLimit = (current: number, max: number): boolean => {
  return current > max;
};
