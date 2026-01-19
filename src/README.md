# 🐾 Pet Forum Mobile App

A mobile-first community forum application for dog and cat owners with Discord/Reddit-style functionality, professional verification system, and comprehensive moderation tools.

**✨ NEW: PWA Support!** This app can now be installed on your phone as a native-like app with your custom logo! [Setup Guide →](/START_PWA_SETUP.md)

## 🎯 Project Overview

This is a full-featured mobile forum application designed for pet owners, featuring:
- 🌍 **Multi-language support** (English/Lithuanian with i18n system)
- Real-time notifications
- Professional (Veterinarian/Trainer) verification system
- Advanced content moderation with AI integration
- Spam protection and anti-abuse systems
- Native advertising platform
- Ban appeals system
- Follower/Following social features
- Achievement badges and gamification

## 🎨 Design System

- **Primary Color**: Teal (#4DB8A8)
- **Platform**: Mobile-first (optimized for phones)
- **Navigation**: Bottom navigation bar
- **Layout**: Discord/Reddit inspired
- **Languages**: 🇬🇧 English / 🇱🇹 Lithuanian (switchable)
- **i18n**: Full internationalization support

## 📁 Project Structure

```
/
├── App.tsx                          # Main app component with routing
├── components/                      # React components
│   ├── Home.tsx                    # Main feed view
│   ├── PostDetail.tsx              # Post detail with comments
│   ├── Profile.tsx                 # User profile with cover photos
│   ├── CreatePost.tsx              # Post creation form
│   ├── Notifications.tsx           # Notification center
│   ├── Settings.tsx                # User settings
│   ├── AdminDashboard.tsx          # Admin advertising dashboard
│   ├── ModerationQueue.tsx         # Content moderation interface
│   ├── ReportCenter.tsx            # Report management
│   ├── BanAppeals.tsx             # Ban appeal system
│   ├── FollowersModal.tsx         # Followers/Following management
│   ├── LanguageSwitcher.tsx       # Language selection component
│   └── ...                        # Additional components
├── utils/                          # Utility functions
│   ├── notificationGenerator.ts   # Real-time notification system
│   ├── moderationQueue.ts         # Content moderation queue
│   ├── contentModeration.ts       # Profanity & AI moderation
│   ├── spamProtection.ts          # Spam detection & prevention
│   ├── i18n.ts                    # Translation utilities
│   ├── useTranslation.ts          # React translation hook
│   └── README_NOTIFICATIONS.md    # Notification system docs
├── locales/                        # Translation files
│   ├── en.ts                      # English translations
│   ├── lt.ts                      # Lithuanian translations
│   └── README_i18n.md             # i18n documentation
├── data/                           # Mock data
│   └── mockData.ts                # Sample posts, users, categories
└── styles/                         # Global styles
    └── globals.css                # Tailwind CSS styles
```

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4.0
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Custom view-based navigation
- **Build Tool**: Vite (assumed from Figma Make)

## 🚀 Key Features

### 1. **Forum Categories**
- Dogs 🐕
- Cats 🐈
- Shelters 🏠
- General Discussion 💬
- Events 📅
- Lost & Found 🔍

### 2. **Professional Verification**
- Veterinarian verification
- Trainer verification
- Badge display system
- Contact information for professionals

### 3. **Content Moderation**
- **Profanity Filter**: Auto-detects inappropriate language (Lithuanian & English)
- **AI Image/Video Moderation**: Flags NSFW content
- **Keyword Blacklist**: Custom banned words
- **Spam Protection**: Rate limiting and duplicate detection
- **Auto-Response Templates**: Quick responses for common violations

### 4. **Moderation Tools**
- Content review queue
- Ban duration options (1d, 7d, 30d, permanent)
- User history viewer
- Report management
- Appeal system

### 5. **Advertising System**
- Native ad banners (`SponsoredBanner.tsx`)
- Admin dashboard for ad management
- Frequency control (1 ad per 10 posts)
- Performance tracking (impressions)

### 6. **Social Features**
- Follow/Unfollow users
- Followers/Following lists
- Achievement badges (Bronze, Silver, Gold, Platinum)
- User reputation system
- Profile customization (cover photos)

### 7. **Real-Time Notifications**
- Event-based notification system
- 24 notification types
- Priority levels (Critical, High, Medium, Low)
- Admin-only notifications (reports, moderation)
- Live subscription with cleanup

### 8. **Interactive Content**
- Polls with real-time voting
- Image attachments (multiple)
- Video embeds
- Reactions (emoji)
- @Mention autocomplete
- Edit history tracking

## 📱 Navigation System

### View Types
```typescript
type View = 'home' | 'post' | 'profile' | 'create' | 'notifications' 
          | 'settings' | 'verification' | 'saved' | 'reports' 
          | 'moderation' | 'admin';
```

### Navigation History
- Stack-based navigation (similar to browser history)
- Back button support
- Forum button resets to home

### Bottom Navigation
1. **Pagrindinis** (Home) - Main feed
2. **Tyrinėti** (Explore) - Coming soon
3. **Paslaugos** (Services) - Coming soon
4. **Forumai** (Forum) - **Active** - Resets to home
5. **Mano augint.** (My Pets) - Coming soon

## 🔐 User Roles

```typescript
type UserRole = 'member' | 'vet' | 'trainer' | 'admin' | 'moderator';
```

### Permissions:
- **Member**: Basic posting, commenting, voting
- **Vet/Trainer**: Verified badge, professional info display
- **Moderator**: Content moderation, user management
- **Admin**: Full system access, advertising management

## 📊 Data Models

### Post Interface
```typescript
interface Post {
  id: string;
  author: User;
  title: string;
  content: string;
  category: string;
  subcategory?: string;
  pawvotes: number;           // Upvotes
  commentCount: number;
  timestamp: Date;
  isPinned?: boolean;         // Category pin
  isGlobalPin?: boolean;      // Announcement
  poll?: Poll;                // Interactive polls
  images?: string[];
  video?: string;
  location?: string;          // For events/lost&found
  isSaved?: boolean;
  isEdited?: boolean;
  editHistory?: EditHistoryEntry[];
  isDeleted?: boolean;        // Soft delete
}
```

### User Interface
```typescript
interface User {
  id: string;
  username: string;
  avatar: string;
  role: UserRole;
  bio?: string;
  achievements?: Achievement[];
  displayedBadges?: string[];
  memberSince?: Date;
  reputation?: number;
  warningCount?: number;
  isBlocked?: boolean;
  professionalInfo?: {        // For verified vets/trainers
    businessName?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
}
```

## 🎮 How to Use

### Development Mode
1. The app runs in Figma Make environment
2. All data is currently **mock data** (`/data/mockData.ts`)
3. No backend required for demo

### Language Switching
- Click the 🌍 globe icon in the top-right header
- Select **English** or **Lietuvių**
- Language preference is saved automatically
- No page reload required

### Testing Features

#### Test Ban Appeal System
Uncomment in `App.tsx` (lines 211-224):
```typescript
const isBanned = true;
const banInfo = { ... };
```

#### Test Real-Time Notifications
Uncomment in `App.tsx` (line 382):
```typescript
{hasModAccess && currentView === 'home' && <NotificationDemoTriggers />}
```

## 🌍 Internationalization (i18n)

### Overview
The app supports **full internationalization** with:
- 🇬🇧 **English** (default for developers)
- 🇱🇹 **Lithuanian** (perfect for end users)
- ✅ **Manual translation overrides** - Edit translations anytime
- ✅ **Type-safe** - TypeScript ensures all keys exist
- ✅ **Persistent** - Language saved in localStorage

### Quick Start

#### Using translations in components:
```tsx
import { useTranslation } from '../utils/useTranslation';

export function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('nav.forum')}</h1>
      <button>{t('common.submit')}</button>
    </div>
  );
}
```

#### Adding new translations:
1. Add to `/locales/en.ts`:
   ```ts
   myFeature: { title: 'My Feature' }
   ```
2. Add to `/locales/lt.ts`:
   ```ts
   myFeature: { title: 'Mano Funkcija' }
   ```
3. Use: `{t('myFeature.title')}`

### Dynamic Content Translations

**For admin-created content** (categories, tags):

```tsx
import { getDynamicTranslation } from '../utils/dynamicTranslations';

// Display category in current language
{getDynamicTranslation(category, currentLang)}

// Category data from database:
{
  id: 'cat_123',
  translations: { en: 'Birds', lt: 'Paukščiai' },
  icon: '🐦'
}
```

**Admin creates new category:**
1. Opens `AdminCategoryManager`
2. Enters Lithuanian: "Triušiai"
3. Clicks "Auto-translate to EN" → "Rabbits"
4. Saves → Appears everywhere instantly!

**Key difference:**
- **Static** (`t('key')`) = UI elements, changed by developers
- **Dynamic** (`getDynamicTranslation()`) = User content, changed by admins

### Translation Files
- **English**: `/locales/en.ts` (source of truth)
- **Lithuanian**: `/locales/lt.ts` (can be manually improved)
- **Documentation**: 
  - `/locales/README_i18n.md` - Complete i18n guide
  - `/locales/README_DYNAMIC_TRANSLATIONS.md` - Admin content guide
  - `/locales/TRANSLATION_FLOW_DIAGRAM.md` - Visual flow diagrams
  - `/locales/QUICK_EXAMPLES.md` - Real-world examples
  - `/locales/CHEAT_SHEET.md` - Quick reference

### Language Switcher
- **Compact**: Icon button in header (ForumHeader)
- **Full**: Settings page integration (coming soon)

**How to switch language:**
1. Click 🌍 globe icon in top-right corner
2. Select language (🇬🇧 English or 🇱🇹 Lietuvių)
3. Done! Everything changes instantly ⚡

**Features:**
- ✅ Bidirectional switching (EN ↔ LT)
- ✅ No page reload needed
- ✅ Persistent (saved to localStorage)
- ✅ Real-time updates

**See:** `/HOW_TO_SWITCH_LANGUAGE.md` for detailed guide

## 📱 Progressive Web App (PWA)

### Overview
This app supports **PWA installation** - users can add it to their phone's home screen and use it like a native app!

### Features:
- ✅ **Custom Icon** - Use your own logo (dog + cat design)
- ✅ **Fullscreen Mode** - No browser UI
- ✅ **Instant Launch** - Tap icon → app opens instantly
- ✅ **Cross-Platform** - Works on Android + iOS
- ✅ **"Add to Home Screen"** - Simple installation

### Setup Time: ~13 minutes

### Quick Start:
1. **Deploy** to Vercel/Netlify
2. **Create Icons** using `/icon-placeholder.html` tool
3. **Upload** to GitHub `/public` directory

### Documentation:
- **Quick Start**: `/QUICKSTART.md` (3 steps)
- **Full Guide (Lithuanian)**: `/PWA_LIETUVIŠKAI.md` ⭐ **START HERE**
- **Complete Setup**: `/FINAL_PWA_SETUP.md`
- **Visual Guide**: `/PWA_VISUAL_GUIDE.md`
- **Checklist**: `/PWA_CHECKLIST.md`

### What Users Will See:
```
📱 Phone Home Screen:

┌─────────┐
│  [🐕🐈] │  ← YOUR LOGO!
└─────────┘
PawConnect

Tap → Instant Open! 🚀
```

**See:** `/START_PWA_SETUP.md` for getting started

## 🔧 Recent Changes

### Latest Updates (January 19, 2026):

**📱 PWA Support (Progressive Web App):**
1. ✅ **PWA manifest configuration** - `/public/manifest.json`
2. ✅ **Custom logo support** - Use your own branding
3. ✅ **Icon generator tool** - `/public/icon-placeholder.html`
4. ✅ **Meta tags setup** - Full PWA meta tags
5. ✅ **Cross-platform support** - Android + iOS
6. ✅ **Comprehensive documentation** - 7+ guides in Lithuanian & English
7. ✅ **Quick setup** - ~13 minutes total

### Previous Updates (Dec 12, 2024):

**🌍 i18n System (Internationalization):**
1. ✅ **Complete i18n implementation** - Full multi-language support
2. ✅ **Translation utilities** - `/utils/i18n.ts` + `useTranslation` hook
3. ✅ **English + Lithuanian files** - `/locales/en.ts` + `/locales/lt.ts`
4. ✅ **LanguageSwitcher component** - Globe icon in header
5. ✅ **BottomNav translated** - Navigation uses translation system
6. ✅ **Dynamic translations** - Admin-created content support
7. ✅ **AdminCategoryManager** - UI for creating multilingual categories
8. ✅ **Auto-translate support** - API integration ready (mock impl.)
9. ✅ **Comprehensive documentation** - 5 detailed guides in `/locales/`

**Previous Updates:**
10. ✅ Fixed `useState` → `useEffect` bug in App.tsx (moderation queue init)
11. ✅ Cover photo no longer overlaps profile picture
12. ✅ Forum icon in bottom nav resets to home + clears history
13. ✅ Translated `/utils/README_NOTIFICATIONS.md` to English
14. ✅ Created project README

### Previous Features:
- Full followers/following system
- Cover photo customization
- Navigation history stack
- Real-time admin notifications
- Native advertising with admin dashboard

## 📝 Code Quality

### Comments & Documentation
- ✅ All TypeScript interfaces documented
- ✅ Utils files have JSDoc comments
- ✅ Inline comments in English
- ✅ README files for complex systems
- ⚠️ Some components lack JSDoc headers (can be improved)

### Type Safety
- Fully typed with TypeScript
- No `any` types (strict typing)
- Proper interface exports

## 🚧 Future Backend Integration

Currently using mock data. For production:

1. **Replace Mock Data** with API calls:
   ```typescript
   // Instead of:
   const posts = mockPosts;
   
   // Use:
   const { data: posts } = await api.getPosts();
   ```

2. **WebSocket for Real-Time**:
   ```typescript
   socket.on('notification', (notification) => {
     notificationStore.emit(notification);
   });
   ```

3. **Database Schema** - Ready to map:
   - Users table
   - Posts table
   - Comments table (nested)
   - Reports table
   - Notifications table
   - Moderation queue table

## 📚 Documentation Files

### **Main Documentation:**
- `/README.md` - This file (project overview)
- `/utils/README_NOTIFICATIONS.md` - Notification system guide
- `/Attributions.md` - Third-party credits

### **PWA Documentation:**
- `/START_PWA_SETUP.md` - **Start here** for PWA setup
- `/QUICKSTART.md` - 3-step quick guide
- `/PWA_LIETUVIŠKAI.md` - Full guide in Lithuanian
- `/FINAL_PWA_SETUP.md` - Complete setup instructions
- `/PWA_VISUAL_GUIDE.md` - Visual diagrams and screenshots
- `/PWA_CHECKLIST.md` - Setup checklist
- `/PWA_SUMMARY.md` - Technical summary
- `/public/PWA_DEPLOYMENT_GUIDE.md` - Deployment specific guide
- `/public/icon-placeholder.html` - Icon generator tool

### **Translation Documentation:**
- `/locales/README_i18n.md` - Complete i18n system guide
- `/locales/README_DYNAMIC_TRANSLATIONS.md` - Admin-created content translations
- `/locales/TRANSLATION_FLOW_DIAGRAM.md` - Visual flow diagrams
- `/locales/QUICK_EXAMPLES.md` - Real-world usage examples
- `/locales/CHEAT_SHEET.md` - Quick reference for common tasks

## 🎯 Design Patterns

### Component Architecture
- **Presentational Components**: UI-only (PostCard, UserBadge)
- **Container Components**: Logic + State (Home, Profile)
- **Modal Components**: Overlays (ReportModal, FollowersModal)

### State Management
- **Local State**: Component-specific (useState)
- **Prop Drilling**: Parent → Child communication
- **Singleton Store**: Notifications (event emitter)

### Navigation
- **View-based routing**: No react-router needed
- **History stack**: Array-based navigation
- **Callback props**: Navigation handlers

## 🐛 Known Issues

None currently! All major bugs fixed. ✅

## 🤝 Contributing

When adding features:
1. Keep components in `/components`
2. Keep utilities in `/utils`
3. Add TypeScript interfaces to `App.tsx` or component file
4. Document complex functions with JSDoc
5. Use English for all code comments
6. Follow existing naming conventions

## 📄 License

[Add your license here]

---

**Built with** ❤️ **using Figma Make**  
**Last Updated**: January 19, 2026