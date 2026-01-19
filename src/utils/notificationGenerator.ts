// Notification Generator - Real-time notification creation system
import type { Notification } from '../data/mockData';

export type NotificationEvent = 
  | 'new_report'
  | 'user_reported'
  | 'ban_appeal'
  | 'spam_detected'
  | 'critical_reports'
  | 'verification_request'
  | 'ban_activity'
  | 'keyword_trigger'
  | 'ai_moderation'
  | 'profanity_detected'
  | 'auto_moderated'
  | 'mass_edit'
  | 'payment_issue'
  | 'subscription_change'
  | 'system_error'
  | 'performance_issue'
  | 'security_alert'
  | 'engagement_drop'
  | 'trending_content'
  | 'milestone_reached'
  | 'ticket_assigned'
  | 'treatment_added';

interface NotificationEventData {
  userId?: string;
  postId?: string;
  commentId?: string;
  reportId?: string;
  ticketId?: string;
  ticketSubject?: string;
  assignedBy?: string;
  reason?: string;
  count?: number;
  value?: number;
  username?: string;
  [key: string]: any;
}

// Singleton notification store
class NotificationStore {
  private listeners: Array<(notification: Notification) => void> = [];
  private notificationIdCounter = 1000;

  subscribe(callback: (notification: Notification) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  emit(notification: Notification) {
    this.listeners.forEach(listener => listener(notification));
  }

  generateId(): string {
    return `notif_${this.notificationIdCounter++}_${Date.now()}`;
  }
}

export const notificationStore = new NotificationStore();

// Generate notification based on event type
export function createNotification(
  event: NotificationEvent,
  data: NotificationEventData = {}
): Notification {
  const timestamp = new Date();
  const id = notificationStore.generateId();

  let notification: Notification;

  switch (event) {
    // 🚨 REPORTS & MODERATION
    case 'new_report':
      notification = {
        id,
        type: 'report',
        message: `New ${data.contentType || 'content'} report: ${data.reason || 'Violation'}`,
        timestamp,
        read: false,
        metadata: {
          reportId: data.reportId,
          contentId: data.postId || data.commentId,
          priority: 'high'
        }
      };
      break;

    case 'user_reported':
      notification = {
        id,
        type: 'report',
        message: `User @${data.username} has been reported for ${data.reason || 'violation'}`,
        timestamp,
        read: false,
        metadata: {
          userId: data.userId,
          reportId: data.reportId,
          priority: 'high'
        }
      };
      break;

    case 'ban_appeal':
      notification = {
        id,
        type: 'system',
        message: `New ban appeal from @${data.username}`,
        timestamp,
        read: false,
        metadata: {
          userId: data.userId,
          appealId: data.appealId,
          priority: 'high'
        }
      };
      break;

    case 'spam_detected':
      notification = {
        id,
        type: 'system',
        message: `Spam detected: ${data.count || 3} posts from @${data.username} in ${data.timeWindow || '5 minutes'}`,
        timestamp,
        read: false,
        metadata: {
          userId: data.userId,
          postIds: data.postIds,
          priority: 'high'
        }
      };
      break;

    case 'critical_reports':
      notification = {
        id,
        type: 'report',
        message: `⚠️ CRITICAL: ${data.count || 5}+ reports on same ${data.contentType || 'content'}`,
        timestamp,
        read: false,
        metadata: {
          contentId: data.postId || data.commentId,
          reportCount: data.count,
          priority: 'critical'
        }
      };
      break;

    // 👥 COMMUNITY MANAGEMENT
    case 'verification_request':
      notification = {
        id,
        type: 'system',
        message: `${data.verificationType || 'Professional'} verification request from @${data.username}`,
        timestamp,
        read: false,
        metadata: {
          userId: data.userId,
          verificationType: data.verificationType,
          priority: 'medium'
        }
      };
      break;

    case 'ban_activity':
      notification = {
        id,
        type: 'system',
        message: `User @${data.username} has been ${data.action || 'banned'} for ${data.duration || 'permanent'}`,
        timestamp,
        read: false,
        metadata: {
          userId: data.userId,
          moderatorId: data.moderatorId,
          action: data.action,
          priority: 'medium'
        }
      };
      break;

    case 'keyword_trigger':
      notification = {
        id,
        type: 'system',
        message: `Blacklist keyword "${data.keyword}" detected in ${data.contentType || 'post'}`,
        timestamp,
        read: false,
        metadata: {
          contentId: data.postId || data.commentId,
          keyword: data.keyword,
          priority: 'high'
        }
      };
      break;

    // 🔍 CONTENT MODERATION
    case 'ai_moderation':
      notification = {
        id,
        type: 'system',
        message: `AI flagged ${data.mediaType || 'image'}: ${data.reason || 'Inappropriate content'}`,
        timestamp,
        read: false,
        metadata: {
          contentId: data.postId,
          confidence: data.confidence,
          priority: data.priority || 'medium'
        }
      };
      break;

    case 'profanity_detected':
      notification = {
        id,
        type: 'system',
        message: `Profanity detected in ${data.contentType || 'post'} by @${data.username}`,
        timestamp,
        read: false,
        metadata: {
          contentId: data.postId || data.commentId,
          words: data.words,
          priority: 'medium'
        }
      };
      break;

    case 'auto_moderated':
      notification = {
        id,
        type: 'system',
        message: `Content auto-removed: ${data.reason || 'Policy violation'}`,
        timestamp,
        read: false,
        metadata: {
          contentId: data.postId || data.commentId,
          reason: data.reason,
          priority: 'high'
        }
      };
      break;

    case 'mass_edit':
      notification = {
        id,
        type: 'system',
        message: `⚠️ Mass edit detected: @${data.username} edited ${data.count || 5}+ posts in ${data.timeWindow || '1 hour'}`,
        timestamp,
        read: false,
        metadata: {
          userId: data.userId,
          editCount: data.count,
          priority: 'medium'
        }
      };
      break;

    // 💰 MONETIZATION
    case 'payment_issue':
      notification = {
        id,
        type: 'system',
        message: `Payment failed: ${data.reason || 'Card declined'}`,
        timestamp,
        read: false,
        metadata: {
          transactionId: data.transactionId,
          amount: data.amount,
          priority: 'critical'
        }
      };
      break;

    case 'subscription_change':
      notification = {
        id,
        type: 'system',
        message: `User @${data.username} ${data.action || 'upgraded'} to ${data.plan || 'Premium'}`,
        timestamp,
        read: false,
        metadata: {
          userId: data.userId,
          plan: data.plan,
          priority: 'low'
        }
      };
      break;

    // ⚙️ TECHNICAL
    case 'system_error':
      notification = {
        id,
        type: 'system',
        message: `🚨 SYSTEM ERROR: ${data.error || 'Unknown error'}`,
        timestamp,
        read: false,
        metadata: {
          errorType: data.errorType,
          stackTrace: data.stackTrace,
          priority: 'critical'
        }
      };
      break;

    case 'performance_issue':
      notification = {
        id,
        type: 'system',
        message: `Performance degradation: ${data.metric || 'Response time'} is ${data.value || 'high'}`,
        timestamp,
        read: false,
        metadata: {
          metric: data.metric,
          value: data.value,
          priority: 'high'
        }
      };
      break;

    case 'security_alert':
      notification = {
        id,
        type: 'system',
        message: `🔒 SECURITY ALERT: ${data.threat || 'Suspicious activity detected'}`,
        timestamp,
        read: false,
        metadata: {
          threatType: data.threat,
          ipAddress: data.ipAddress,
          priority: 'critical'
        }
      };
      break;

    // 📊 ANALYTICS
    case 'engagement_drop':
      notification = {
        id,
        type: 'system',
        message: `📉 Engagement dropped by ${data.percentage || 20}% in last ${data.timeframe || '24h'}`,
        timestamp,
        read: false,
        metadata: {
          percentage: data.percentage,
          timeframe: data.timeframe,
          priority: 'medium'
        }
      };
      break;

    case 'trending_content':
      notification = {
        id,
        type: 'system',
        message: `🔥 Trending: "${data.title}" has ${data.upvotes || 100}+ upvotes`,
        timestamp,
        read: false,
        metadata: {
          postId: data.postId,
          upvotes: data.upvotes,
          priority: 'low'
        }
      };
      break;

    case 'milestone_reached':
      notification = {
        id,
        type: 'system',
        message: `🎉 Milestone reached: ${data.milestone || '1000 users'}!`,
        timestamp,
        read: false,
        metadata: {
          milestone: data.milestone,
          value: data.value,
          priority: 'low'
        }
      };
      break;

    case 'ticket_assigned':
      notification = {
        id,
        type: 'system',
        message: `🎫 New ticket assigned: #${data.ticketId?.split('-')[1]} - ${data.ticketSubject}`,
        timestamp,
        read: false,
        metadata: {
          ticketId: data.ticketId,
          assignedBy: data.assignedBy,
          priority: 'medium'
        }
      };
      break;

    case 'treatment_added':
      notification = {
        id,
        type: 'system',
        message: `💊 Treatment logged: ${data.product} (${data.type === 'fleaTick' ? 'Flea & Tick' : 'Worming'})`,
        timestamp,
        read: false,
        metadata: {
          petId: data.petId,
          product: data.product,
          priority: 'medium'
        }
      };
      break;

    default:
      notification = {
        id,
        type: 'system',
        message: 'Unknown notification event',
        timestamp,
        read: false,
        metadata: { priority: 'low' }
      };
  }

  // Emit notification to all listeners
  notificationStore.emit(notification);

  return notification;
}

// Helper functions for common events
export const NotificationHelpers = {
  onNewReport: (contentType: 'post' | 'comment', reason: string, reportId: string, contentId: string) => {
    return createNotification('new_report', {
      contentType,
      reason,
      reportId,
      [contentType === 'post' ? 'postId' : 'commentId']: contentId
    });
  },

  onUserReported: (username: string, userId: string, reason: string, reportId: string) => {
    return createNotification('user_reported', {
      username,
      userId,
      reason,
      reportId
    });
  },

  onBanAppeal: (username: string, userId: string, appealId: string) => {
    return createNotification('ban_appeal', {
      username,
      userId,
      appealId
    });
  },

  onSpamDetected: (username: string, userId: string, postCount: number, timeWindow: string, postIds: string[]) => {
    return createNotification('spam_detected', {
      username,
      userId,
      count: postCount,
      timeWindow,
      postIds
    });
  },

  onCriticalReports: (contentType: 'post' | 'comment', contentId: string, reportCount: number) => {
    return createNotification('critical_reports', {
      contentType,
      [contentType === 'post' ? 'postId' : 'commentId']: contentId,
      count: reportCount
    });
  },

  onVerificationRequest: (username: string, userId: string, verificationType: 'Veterinarian' | 'Trainer') => {
    return createNotification('verification_request', {
      username,
      userId,
      verificationType
    });
  },

  onBanActivity: (username: string, userId: string, action: 'banned' | 'unbanned' | 'suspended', duration: string, moderatorId: string) => {
    return createNotification('ban_activity', {
      username,
      userId,
      action,
      duration,
      moderatorId
    });
  },

  onKeywordTrigger: (keyword: string, contentType: 'post' | 'comment', contentId: string) => {
    return createNotification('keyword_trigger', {
      keyword,
      contentType,
      [contentType === 'post' ? 'postId' : 'commentId']: contentId
    });
  },

  onAIModeration: (mediaType: 'image' | 'video', postId: string, reason: string, confidence: number, priority: 'high' | 'medium' | 'low') => {
    return createNotification('ai_moderation', {
      mediaType,
      postId,
      reason,
      confidence,
      priority
    });
  },

  onProfanityDetected: (username: string, contentType: 'post' | 'comment', contentId: string, words: string[]) => {
    return createNotification('profanity_detected', {
      username,
      contentType,
      [contentType === 'post' ? 'postId' : 'commentId']: contentId,
      words
    });
  },

  onAutoModerated: (contentType: 'post' | 'comment', contentId: string, reason: string) => {
    return createNotification('auto_moderated', {
      contentType,
      [contentType === 'post' ? 'postId' : 'commentId']: contentId,
      reason
    });
  },

  onMassEdit: (username: string, userId: string, editCount: number, timeWindow: string) => {
    return createNotification('mass_edit', {
      username,
      userId,
      count: editCount,
      timeWindow
    });
  },

  onMilestone: (milestone: string, value: number) => {
    return createNotification('milestone_reached', {
      milestone,
      value
    });
  },

  onTicketAssigned: (ticketId: string, ticketSubject: string, assignedBy: string) => {
    return createNotification('ticket_assigned', {
      ticketId,
      ticketSubject,
      assignedBy
    });
  },

  onTreatmentAdded: (petId: string, type: 'fleaTick' | 'worming', product: string) => {
    return createNotification('treatment_added', {
      petId,
      type,
      product
    });
  }
};
