# 📬 Real-Time Notification System

## How the System Works

### 1. **Notification Generator** (`/utils/notificationGenerator.ts`)
Centralized notification creation system with event-based architecture.

#### Supported Events:
```typescript
- new_report            // New report submitted
- user_reported         // User has been reported
- ban_appeal            // Ban appeal submitted
- spam_detected         // Spam detection triggered
- critical_reports      // 5+ reports on same content
- verification_request  // Vet/Trainer verification request
- ban_activity          // Ban/unban actions
- keyword_trigger       // Blacklist keyword detected
- ai_moderation         // AI flagged content
- profanity_detected    // Profanity filter triggered
- auto_moderated        // Auto-removed content
- mass_edit             // 5+ edits per hour
- payment_issue         // Payment failures
- subscription_change   // Premium plan changes
- system_error          // System errors
- performance_issue     // Performance degradation
- security_alert        // Security threats
- engagement_drop       // -20% engagement
- trending_content      // Viral posts
- milestone_reached     // Community milestones
```

### 2. **NotificationStore** (Singleton)
Real-time subscription system:

```typescript
// Subscribe to notifications
useEffect(() => {
  const unsubscribe = notificationStore.subscribe((newNotification) => {
    console.log('New notification:', newNotification);
    setNotifications(prev => [newNotification, ...prev]);
  });

  return () => unsubscribe();
}, []);
```

### 3. **Notification Helpers**
Pre-made functions for common events:

```typescript
// Example: New report
NotificationHelpers.onNewReport(
  'post',                    // contentType
  'Spam/Scam Content',      // reason
  'report_123',             // reportId
  'post_456'                // contentId
);

// Example: Ban appeal
NotificationHelpers.onBanAppeal(
  'banned_user',            // username
  'user_789',               // userId
  'appeal_123'              // appealId
);

// Example: Spam detection
NotificationHelpers.onSpamDetected(
  'spam_bot',               // username
  'user_999',               // userId
  7,                        // post count
  '5 minutes',              // time window
  ['post_1', 'post_2', ...]  // post IDs
);
```

## How to Use

### ✅ **App.tsx** - Main integration:
```typescript
// 1. Import
import { notificationStore } from './utils/notificationGenerator';

// 2. State
const [liveNotifications, setLiveNotifications] = useState<Notification[]>([...allNotifications]);

// 3. Subscribe
useEffect(() => {
  const unsubscribe = notificationStore.subscribe((newNotification) => {
    setLiveNotifications(prev => [newNotification, ...prev]);
  });
  return () => unsubscribe();
}, []);
```

### ✅ **Trigger notifications from any component:**
```typescript
import { NotificationHelpers } from '../utils/notificationGenerator';

// Report center
const handleSubmitReport = () => {
  NotificationHelpers.onNewReport('post', reason, reportId, postId);
};

// Ban system
const handleBanUser = () => {
  NotificationHelpers.onBanActivity(username, userId, 'banned', '7 days', adminId);
};

// Verification
const handleVerificationRequest = () => {
  NotificationHelpers.onVerificationRequest(username, userId, 'Veterinarian');
};
```

## Notification Priority Levels

```typescript
priority: 'critical' | 'high' | 'medium' | 'low'
```

- **Critical**: Payment issues, security alerts, system errors
- **High**: Reports, spam, AI moderation flags, ban appeals
- **Medium**: Verification requests, keyword triggers, mass edits
- **Low**: Trending content, milestones, subscription changes

## Real-world Integration

### 1. **PostCard.tsx** - Report submission:
```typescript
const handleReport = () => {
  // Submit report to backend
  api.submitReport(postId, reason);
  
  // Instantly notify admin
  NotificationHelpers.onNewReport('post', reason, reportId, postId);
};
```

### 2. **CreatePost.tsx** - Spam detection:
```typescript
const handleSubmit = () => {
  // Check for spam
  if (isSpam) {
    NotificationHelpers.onSpamDetected(
      user.username, 
      user.id, 
      recentPostCount, 
      '5 minutes',
      postIds
    );
  }
};
```

### 3. **AdminPanel.tsx** - Ban action:
```typescript
const handleBan = (userId, duration) => {
  // Ban user
  api.banUser(userId, duration);
  
  // Notify admins
  NotificationHelpers.onBanActivity(
    user.username,
    userId,
    'banned',
    duration,
    currentUser.id
  );
};
```

## Demo Triggers

**NotificationDemoTriggers.tsx** - Testing panel (visible only to admins):
- Floats on bottom-right of Home page
- Buttons trigger all notification types
- See real-time notifications instantly!

## Settings Integration

Notification settings (`/components/Settings.tsx`) control:
- Which notifications to receive
- Priority levels (All/High Priority/Off)
- Quiet hours
- Batch mode
- Critical only mode

Backend should respect these settings and filter notifications before sending.

## Backend Implementation (TODO)

```typescript
// Server-side
app.post('/api/reports', async (req, res) => {
  const report = await db.createReport(req.body);
  
  // Send notification to admins
  const admins = await db.getAdmins();
  admins.forEach(admin => {
    if (admin.settings.notifications.newReports !== 'off') {
      sendPushNotification(admin.id, {
        type: 'new_report',
        data: { reportId: report.id, ... }
      });
    }
  });
});
```

## WebSocket Integration

```typescript
// Real-time with Socket.io
socket.on('notification', (notification) => {
  notificationStore.emit(notification);
});
```

---

**Status**: ✅ Fully implemented  
**Last updated**: 2024-12-12  
**Dependencies**: None (standalone system)
