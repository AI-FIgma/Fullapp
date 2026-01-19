// Content Moderation System
// Protects community from inappropriate content (profanity, nudity, hate speech)

// Lithuanian and English profanity list (sample - in production use comprehensive list)
const profanityList = [
  // Lithuanian
  'šikti', 'šikt', 'šūdas', 'šūd', 'pisa', 'pist', 'bybis', 'pimpė', 'pederastas',
  'kurva', 'kalė', 'paleistuvė', 'velnia', 'velnias', 'po velnių',
  
  // English
  'fuck', 'shit', 'bitch', 'bastard', 'asshole', 'dick', 'cock', 'pussy', 'cunt',
  'damn', 'hell', 'whore', 'slut', 'fag', 'nigger', 'retard',
  
  // Common variations
  'f*ck', 'sh*t', 'b*tch', 'a**hole', 'wtf', 'stfu', 'ffs'
];

// Hate speech and discrimination keywords
const hateSpeechKeywords = [
  'nazi', 'hitler', 'terrorist', 'kill yourself', 'kys', 'die', 'suicide',
  'racist', 'racism', 'sexist', 'homophobic', 'transphobic'
];

// Spam patterns
const spamPatterns = [
  /viagra/i,
  /cialis/i,
  /crypto.*investment/i,
  /click.*here.*now/i,
  /earn.*money.*fast/i,
  /\$\$\$/g,
  /💰.*💰.*💰/g,
];

interface ModerationResult {
  isClean: boolean;
  reason?: 'profanity' | 'hate-speech' | 'spam' | 'inappropriate-content';
  blockedWords?: string[];
  severity: 'low' | 'medium' | 'high';
}

/**
 * Check text content for profanity and inappropriate language
 */
export function moderateText(text: string): ModerationResult {
  if (!text) {
    return { isClean: true, severity: 'low' };
  }

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  // Check for profanity
  const foundProfanity = profanityList.filter(word => 
    lowerText.includes(word.toLowerCase())
  );
  
  if (foundProfanity.length > 0) {
    // Severity based on count and severity of words
    let severity: 'low' | 'medium' | 'high' = 'low';
    
    if (foundProfanity.length >= 4) {
      severity = 'high'; // Excessive profanity
    } else if (foundProfanity.length >= 2) {
      severity = 'medium'; // Multiple profane words
    } else {
      severity = 'low'; // Single word (could be typo/false positive)
    }
    
    return {
      isClean: false,
      reason: 'profanity',
      blockedWords: foundProfanity,
      severity
    };
  }

  // Check for hate speech
  const foundHateSpeech = hateSpeechKeywords.filter(keyword =>
    lowerText.includes(keyword.toLowerCase())
  );

  if (foundHateSpeech.length > 0) {
    return {
      isClean: false,
      reason: 'hate-speech',
      blockedWords: foundHateSpeech,
      severity: 'high'
    };
  }

  // Check for spam patterns
  for (const pattern of spamPatterns) {
    if (pattern.test(text)) {
      return {
        isClean: false,
        reason: 'spam',
        severity: 'medium'
      };
    }
  }

  return { isClean: true, severity: 'low' };
}

/**
 * Censor profanity in text by replacing with asterisks
 */
export function censorText(text: string): string {
  let censored = text;
  
  profanityList.forEach(word => {
    const regex = new RegExp(word, 'gi');
    censored = censored.replace(regex, (match) => 
      match[0] + '*'.repeat(match.length - 1)
    );
  });
  
  return censored;
}

/**
 * Mock image moderation using AI content detection
 * In production, use: AWS Rekognition, Google Cloud Vision, Azure Content Moderator
 */
export async function moderateImage(imageUrl: string): Promise<ModerationResult> {
  // Mock API call - in production this would call a real service
  // Example: AWS Rekognition DetectModerationLabels
  
  console.log('[Content Moderation] Checking image:', imageUrl);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock detection (in real app, this comes from AI service)
  // For demo purposes, block specific test patterns
  if (imageUrl.includes('inappropriate') || imageUrl.includes('nsfw')) {
    return {
      isClean: false,
      reason: 'inappropriate-content',
      severity: 'high'
    };
  }
  
  // In production, would return actual AI detection results:
  // {
  //   isClean: false/true,
  //   reason: 'inappropriate-content',
  //   confidence: 0.95,
  //   labels: ['Nudity', 'Explicit Content', 'Violence'],
  //   severity: 'high'
  // }
  
  return { isClean: true, severity: 'low' };
}

/**
 * Mock video moderation
 * In production, use video analysis APIs
 */
export async function moderateVideo(videoUrl: string): Promise<ModerationResult> {
  console.log('[Content Moderation] Checking video:', videoUrl);
  
  // Simulate API delay (videos take longer to process)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock detection
  if (videoUrl.includes('inappropriate') || videoUrl.includes('nsfw')) {
    return {
      isClean: false,
      reason: 'inappropriate-content',
      severity: 'high'
    };
  }
  
  return { isClean: true, severity: 'low' };
}

/**
 * Comprehensive content check for posts
 */
export async function moderatePost(content: {
  text?: string;
  images?: string[];
  video?: string;
}): Promise<ModerationResult> {
  // Check text first (fastest)
  if (content.text) {
    const textResult = moderateText(content.text);
    if (!textResult.isClean) {
      return textResult;
    }
  }

  // Check images (parallel for speed)
  if (content.images && content.images.length > 0) {
    const imageResults = await Promise.all(
      content.images.map(img => moderateImage(img))
    );
    
    const inappropriateImage = imageResults.find(result => !result.isClean);
    if (inappropriateImage) {
      return inappropriateImage;
    }
  }

  // Check video
  if (content.video) {
    const videoResult = await moderateVideo(content.video);
    if (!videoResult.isClean) {
      return videoResult;
    }
  }

  return { isClean: true, severity: 'low' };
}

/**
 * Get user-friendly error message
 */
export function getModerationMessage(result: ModerationResult): string {
  if (result.isClean) return '';

  switch (result.reason) {
    case 'profanity':
      return '⚠️ Jūsų žinutėje aptikti necenzūriniai žodžiai. Prašome laikytis bendruomenės taisyklių.';
    
    case 'hate-speech':
      return '🚫 Aptiktas neapykantos kalba. Tokios žinutės yra draudžiamos.';
    
    case 'spam':
      return '⚠️ Jūsų žinutė panaši į reklamą/spam. Prašome dalintis autentiška informacija.';
    
    case 'inappropriate-content':
      return '🚫 Aptiktas netinkamas turinys (nudity/violence). Tokios nuotraukos/video yra draudžiami.';
    
    default:
      return '⚠️ Jūsų turinys nepraėjo moderavimo. Prašome laikytis bendruomenės taisyklių.';
  }
}

/**
 * Track violations per user (for ban system)
 */
const userViolations = new Map<string, number>();

export function recordViolation(userId: string): number {
  const current = userViolations.get(userId) || 0;
  const newCount = current + 1;
  userViolations.set(userId, newCount);
  return newCount;
}

export function getViolationCount(userId: string): number {
  return userViolations.get(userId) || 0;
}

export function shouldBanUser(userId: string): boolean {
  const violations = getViolationCount(userId);
  // Ban after 3 violations
  return violations >= 3;
}

export function resetViolations(userId: string): void {
  userViolations.delete(userId);
}