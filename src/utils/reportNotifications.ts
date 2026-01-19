import { notificationStore } from './notificationGenerator';
import type { Report, User } from '../App';

/**
 * Report Notification System with Full Transparency
 * 
 * This system sends SEPARATE notifications to:
 * 1. Reporter (person who reported)
 * 2. Reported User (person whose content was reported) - only if action taken
 * 
 * Each recipient receives a CUSTOMIZED message appropriate to their role.
 */

interface ReportNotificationParams {
  report: Report;
  actionTaken: 'content_removed' | 'user_warned' | 'user_blocked' | 'dismissed' | 'verified';
  moderator: User;
  messageToReporter?: string; // Custom message for the reporter
  messageToReportedUser?: string; // Custom message for the reported user
}

/**
 * Send notifications when a report is resolved/dismissed
 */
export function sendReportNotifications(params: ReportNotificationParams) {
  const { report, actionTaken, moderator, messageToReporter, messageToReportedUser } = params;

  // 1. Send notification to REPORTER (always)
  sendReporterNotification({
    report,
    actionTaken,
    moderator,
    customMessage: messageToReporter
  });

  // 2. Send notification to REPORTED USER (only if action taken)
  if (actionTaken !== 'dismissed' && actionTaken !== 'verified') {
    sendReportedUserNotification({
      report,
      actionTaken,
      moderator,
      customMessage: messageToReportedUser
    });
  }

  console.log('✅ Report notifications sent:', {
    reportId: report.id,
    actionTaken,
    reporterNotified: true,
    reportedUserNotified: actionTaken !== 'dismissed' && actionTaken !== 'verified'
  });
}

/**
 * Send notification to the person who reported
 */
function sendReporterNotification(params: {
  report: Report;
  actionTaken: ReportNotificationParams['actionTaken'];
  moderator: User;
  customMessage?: string;
}) {
  const { report, actionTaken, moderator, customMessage } = params;

  let message = '';
  let status: 'reviewed' | 'resolved' | 'dismissed' | 'content_removed' | 'warned' | 'blocked' = 'reviewed';

  switch (actionTaken) {
    case 'content_removed':
      message = `✅ Your report was reviewed. The ${report.type} has been removed.`;
      status = 'content_removed';
      break;
    case 'user_warned':
      message = `✅ Your report was reviewed. The user has been warned.`;
      status = 'warned';
      break;
    case 'user_blocked':
      message = `✅ Your report was reviewed. The user has been blocked.`;
      status = 'blocked';
      break;
    case 'verified':
      message = `ℹ️ Your report was reviewed. The content has been verified as acceptable.`;
      status = 'dismissed';
      break;
    case 'dismissed':
      message = `ℹ️ Your report was reviewed. No policy violation was found.`;
      status = 'dismissed';
      break;
  }

  // Add custom message if provided
  const fullMessage = customMessage 
    ? `${message}\n\nModerator note: ${customMessage}`
    : message;

  notificationStore.addNotification({
    id: `report-reporter-${report.id}-${Date.now()}`,
    type: 'moderation',
    message: fullMessage,
    timestamp: new Date(),
    read: false,
    reportId: report.id,
    reportStatus: status,
    moderatorMessage: customMessage,
    canAppeal: false
  });

  console.log('📬 Reporter notification sent:', {
    recipientId: report.reporter.id,
    recipientUsername: report.reporter.username,
    message: fullMessage,
    status
  });
}

/**
 * Send notification to the person whose content was reported
 */
function sendReportedUserNotification(params: {
  report: Report;
  actionTaken: ReportNotificationParams['actionTaken'];
  moderator: User;
  customMessage?: string;
}) {
  const { report, actionTaken, moderator, customMessage } = params;

  let message = '';
  let status: 'content_removed' | 'warned' | 'blocked' = 'content_removed';
  let canAppeal = false;

  switch (actionTaken) {
    case 'content_removed':
      message = `⚠️ Your ${report.type} was removed for violating Community Guidelines.\nReason: ${getReasonLabel(report.reason)}`;
      status = 'content_removed';
      canAppeal = report.type === 'post'; // Only posts can be appealed
      break;
    case 'user_warned':
      message = `⚠️ You received a warning for violating Community Guidelines.\nReason: ${getReasonLabel(report.reason)}`;
      status = 'warned';
      canAppeal = false;
      break;
    case 'user_blocked':
      message = `🚫 Your account has been blocked for violating Community Guidelines.\nReason: ${getReasonLabel(report.reason)}`;
      status = 'blocked';
      canAppeal = true; // Can appeal bans
      break;
  }

  // Add custom message if provided
  const fullMessage = customMessage 
    ? `${message}\n\nModerator note: ${customMessage}`
    : message;

  // Add appeal info if applicable
  const finalMessage = canAppeal
    ? `${fullMessage}\n\nYou can appeal this decision from the Moderation Queue.`
    : fullMessage;

  notificationStore.addNotification({
    id: `report-target-${report.id}-${Date.now()}`,
    type: 'moderation',
    message: finalMessage,
    timestamp: new Date(),
    read: false,
    reportId: report.id,
    reportStatus: status,
    moderatorMessage: customMessage,
    canAppeal
  });

  console.log('📬 Reported user notification sent:', {
    recipientId: report.targetAuthor.id,
    recipientUsername: report.targetAuthor.username,
    message: finalMessage,
    status,
    canAppeal
  });
}

/**
 * Get human-readable reason label
 */
function getReasonLabel(reason: Report['reason']): string {
  const labels = {
    spam: 'Spam',
    harassment: 'Harassment',
    inappropriate: 'Inappropriate Content',
    misinformation: 'Misinformation',
    other: 'Other'
  };
  return labels[reason];
}

/**
 * Message templates for REPORTER (person who reported)
 */
export const reporterMessageTemplates = [
  {
    id: 'thanks-action-taken',
    label: 'Thanks - Action Taken',
    message: 'Thank you for helping keep our community safe. We have taken appropriate action.'
  },
  {
    id: 'thanks-content-removed',
    label: 'Thanks - Content Removed',
    message: 'Thank you for reporting. The content has been removed for violating our guidelines.'
  },
  {
    id: 'thanks-user-warned',
    label: 'Thanks - User Warned',
    message: 'Thank you for reporting. The user has been issued a warning.'
  },
  {
    id: 'no-violation',
    label: 'No Violation Found',
    message: 'After careful review, we found no policy violation. Thank you for helping us maintain community standards.'
  },
  {
    id: 'content-verified',
    label: 'Content Verified',
    message: 'We have reviewed the content and verified it complies with our Community Guidelines.'
  },
  {
    id: 'custom',
    label: 'Custom Message',
    message: ''
  }
];

/**
 * Message templates for REPORTED USER (person whose content was reported)
 */
export const reportedUserMessageTemplates = [
  {
    id: 'warning-respect',
    label: 'Warning - Be Respectful',
    message: 'Please be respectful to all community members. Continued violations may result in a ban.'
  },
  {
    id: 'warning-spam',
    label: 'Warning - Spam',
    message: 'Please avoid posting spam or promotional content. Focus on meaningful contributions to the community.'
  },
  {
    id: 'removed-inappropriate',
    label: 'Removed - Inappropriate',
    message: 'This content was removed as it does not meet our community standards. Please review our Community Guidelines.'
  },
  {
    id: 'removed-harassment',
    label: 'Removed - Harassment',
    message: 'Harassment and disrespectful behavior are not tolerated. Please treat all members with kindness.'
  },
  {
    id: 'final-warning',
    label: 'Final Warning',
    message: 'This is your final warning. Any further violations will result in an immediate and permanent ban.'
  },
  {
    id: 'blocked-explanation',
    label: 'Blocked - Explanation',
    message: 'Your account has been blocked due to repeated violations. You may appeal this decision if you believe it was made in error.'
  },
  {
    id: 'custom',
    label: 'Custom Message',
    message: ''
  }
];
