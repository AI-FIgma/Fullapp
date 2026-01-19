import './styles/globals.css';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Home } from './components/Home';
import { Forum } from './components/Forum';
import { PostDetail } from './components/PostDetail';
import { Profile } from './components/Profile';
import { CreatePost } from './components/CreatePost';
import { Notifications } from './components/Notifications';
import { Settings } from './components/Settings';
import { SavedPosts } from './components/SavedPosts';
import { ReportCenter } from './components/ReportCenter';
import { ModerationQueue } from './components/ModerationQueue';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminPanel } from './components/AdminPanel';
import { Analytics } from './components/Analytics';
import { VerificationRequest } from './components/VerificationRequest';
import { ContactSupport } from './components/ContactSupport';
import { About } from './components/About';
import { TermsOfService } from './components/TermsOfService';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { CommunityGuidelines } from './components/CommunityGuidelines';
import { BottomNav } from './components/BottomNav';
import { SupportTickets } from './components/SupportTickets';
import { TicketDetails } from './components/TicketDetails';
import { MyPets } from './components/MyPets';
import { PersonalProfile } from './components/PersonalProfile';
import { PetProfile } from './components/PetProfile';
import { CreatePet } from './components/CreatePet';
import { AddPetReminder } from './components/AddPetReminder';
import { InvitePetMember } from './components/InvitePetMember';
import { EditPet } from './components/EditPet';
import { Services } from './components/Services';
import { Explore } from './components/Explore';
import { Dashboard } from './components/Dashboard';
import { AppSettings } from './components/AppSettings';
import { MainProfileEdit } from './components/MainProfileEdit';

import { currentUser, mockNotifications, sponsoredAds } from './data/mockData';
import { notificationStore } from './utils/notificationGenerator';
import { initializeMockModerationQueue } from './utils/moderationQueue';
import { getCurrentLanguage, setCurrentLanguage, type Language } from './utils/i18n';
import { supabase } from './utils/supabase/client';
import { Toaster } from 'sonner@2.0.3';
import { getUserProfile, updateUserProfile } from './utils/userApi';

export type UserRole = 'member' | 'vet' | 'trainer' | 'admin' | 'moderator';

export type AchievementLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: AchievementLevel;
  unlockedAt?: Date;
  progress?: number; // Current progress
  maxProgress?: number; // Max needed for next level
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  role: UserRole;
  bio?: string;
  achievements?: Achievement[]; // All unlocked achievements
  displayedBadges?: string[]; // IDs of badges to show (max 2-3)
  memberSince?: Date; // Join date
  // Streak tracking for Daily Streak achievements
  lastLoginDate?: Date; // Last time user logged in
  currentStreak?: number; // Current consecutive days
  bestStreak?: number; // Best streak ever achieved
  // Reputation & Activity
  reputation?: number; // Karma/reputation points
  lastActive?: Date; // Last activity timestamp
  // Moderation
  warningCount?: number; // Number of warnings received
  isBlocked?: boolean; // Blocked status
  // Professional contact info (for verified vets and trainers)
  professionalInfo?: {
    businessName?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  // Privacy & Online Status
  isOnline?: boolean; // Online status
  showOnlineStatus?: boolean; // Privacy setting - show online status to others
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  icon?: string;
}

export interface Post {
  id: string;
  author: User;
  title: string;
  content: string;
  category: string;
  subcategory?: string;
  pawvotes: number;
  commentCount: number;
  timestamp: Date;
  hasUpvoted: boolean;
  pinLevel?: 'global' | 'category' | 'subcategory' | null;
  isPinned?: boolean; // @deprecated use pinLevel
  isGlobalPin?: boolean; // @deprecated use pinLevel
  reactions?: Reaction[];
  video?: string;
  imageUrl?: string; // Optional image attachment
  images?: string[]; // Multiple images
  location?: string; // Location for events, lost&found
  poll?: Poll; // Poll data
  reportStatus?: 'none' | 'pending' | 'resolved'; // Report status
  isSaved?: boolean; // Saved status
  isEdited?: boolean; // Edit indicator
  editHistory?: EditHistoryEntry[]; // Edit history
  isDeleted?: boolean; // Soft delete
}

export interface EditHistoryEntry {
  content: string;
  title?: string;
  editedAt: Date;
  editedBy: string; // User ID
}

export interface Poll {
  question: string;
  options: PollOption[];
  totalVotes: number;
  endsAt: Date;
  hasVoted: boolean;
  
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Reaction {
  emoji: string;
  count: number;
  hasReacted: boolean;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: Date;
  upvotes: number;
  hasUpvoted?: boolean;
  reactions?: Reaction[];
  replies?: Comment[]; // Nested replies
  parentId?: string; // Reference to parent comment
  isEdited?: boolean; // Edit indicator
  editHistory?: EditHistoryEntry[]; // Edit history
  isDeleted?: boolean; // Soft delete
}

export interface Report {
  id: string;
  type: 'post' | 'comment';
  targetId: string; // Post ID or Comment ID
  postId?: string; // For comment reports - the post containing the comment
  targetContent: string; // Preview of reported content
  targetAuthor: User;
  reporter: User;
  reason: 'spam' | 'harassment' | 'inappropriate' | 'misinformation' | 'other';
  customReason?: string;
  timestamp: Date;
  status: 'pending' | 'resolved' | 'dismissed';
  moderatorNote?: string; // Internal note - only visible to mods/admins
  messageToReporter?: string; // Message sent to the person who reported
  messageToReportedUser?: string; // Message sent to the person whose content was reported
  resolvedBy?: User;
  resolvedAt?: Date;
  actionTaken?: 'content_removed' | 'user_warned' | 'user_blocked' | 'dismissed' | 'verified'; // Action taken by moderator
  isContentVerified?: boolean; // Content reviewed and deemed acceptable
  verifiedAt?: Date; // When content was verified
  verifiedBy?: User; // Who verified the content
  newReportsAfterVerification?: number; // Count of new reports after verification
  banDuration?: '1d' | '7d' | '30d' | 'permanent'; // Ban duration if user was banned
}

export interface Notification {
  id: string;
  type: 'comment' | 'mention' | 'upvote' | 'report' | 'verification' | 'follow' | 'achievement' | 'moderation' | 'system';
  user?: User;
  post?: { id: string; title: string };
  message: string;
  timestamp: Date;
  read?: boolean;
  isRead?: boolean; // Alternative property name
  // Report-specific fields
  reportId?: string;
  reportStatus?: 'reviewed' | 'resolved' | 'dismissed' | 'content_removed' | 'warned' | 'blocked';
  moderatorMessage?: string; // Public message from moderator
  canAppeal?: boolean; // If user can appeal the decision
}

type View = 'home' | 'forum' | 'post' | 'profile' | 'create' | 'notifications' | 'settings' | 'verification' | 'saved' | 'reports' | 'moderation' | 'admin' | 'contact' | 'about' | 'terms' | 'privacy' | 'guidelines' | 'supportTickets' | 'ticketDetails' | 'analytics' | 'dashboard' | 'explore' | 'services' | 'myPets' | 'petProfile' | 'createPet' | 'addPetReminder' | 'invitePetMember' | 'editPet' | 'personalProfile' | 'appSettings' | 'editMainProfile';

interface NavigationHistoryItem {
  view: View;
  postId?: string;
  userId?: string;
  ticketId?: string;
}

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<View>('home');
  const [navigationHistory, setNavigationHistory] = useState<NavigationHistoryItem[]>([{ view: 'home' }]);
  
  // Auth State
  const [session, setSession] = useState<any>(null);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Selected Item State
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketViewAsAdmin, setTicketViewAsAdmin] = useState(false);
  
  // Pet Logic State
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // Settings State
  const [settingsKey, setSettingsKey] = useState(0);

  // Language State
  const [currentLanguage, setCurrentLanguageState] = useState<Language>('en');

  // Load custom forum profile
  const [activeUser, setActiveUser] = useState<User>(currentUser);

  // PWA Service Worker Registration
  useEffect(() => {
    // CRITICAL: COMPLETELY DISABLE PWA in ALL preview/development environments
    // ONLY enable in production deployments (Vercel, Netlify, custom domain)
    
    const hostname = window.location.hostname.toLowerCase();
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
    const isFigma = hostname.includes('figma');
    const isPreview = hostname.includes('preview');
    const isDevelopment = isLocalhost || isFigma || isPreview;
    
    // Log detection for debugging
    console.log('🔍 PWA Environment Detection:', {
      hostname,
      isLocalhost,
      isFigma,
      isPreview,
      isDevelopment
    });
    
    // If ANY development indicator is found, DISABLE PWA completely
    if (isDevelopment) {
      console.log('❌ PWA DISABLED - Development/Preview environment detected');
      
      // CRITICAL: Remove ALL manifest links to prevent 404 errors in preview
      const manifestLinks = document.querySelectorAll('link[rel="manifest"]');
      manifestLinks.forEach(link => {
        link.remove();
        console.log('🗑️ Removed manifest link (preview mode)');
      });
      
      // CRITICAL: Unregister ALL service workers in preview
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          if (registrations.length > 0) {
            console.log(`🗑️ Found ${registrations.length} service worker(s), unregistering...`);
            registrations.forEach((registration) => {
              registration.unregister().then(() => {
                console.log('✅ Service worker unregistered');
              });
            });
          }
        }).catch((err) => {
          console.warn('⚠️ Failed to check service workers:', err);
        });
        
        // Also clear all caches to remove old PWA data
        if ('caches' in window) {
          caches.keys().then((cacheNames) => {
            if (cacheNames.length > 0) {
              console.log(`🗑️ Clearing ${cacheNames.length} cache(s)...`);
              cacheNames.forEach((cacheName) => {
                caches.delete(cacheName);
              });
            }
          });
        }
      }
      
      return; // EXIT EARLY - DO NOT CONTINUE TO PWA REGISTRATION
    }

    // ============ PRODUCTION MODE - ENABLE PWA ============
    // This code should ONLY run on production deployments (Vercel, Netlify, etc.)
    console.log('✅ PWA ENABLED - Production environment detected');
    console.log('📍 Production hostname:', hostname);
    
    // Triple-check we're not in development (failsafe)
    if (hostname.includes('figma') || hostname.includes('preview') || hostname === 'localhost') {
      console.error('🚨 CRITICAL: PWA attempted to run in development! Aborting.');
      return; // Emergency exit
    }
    
    // Ensure manifest link exists
    if (!document.querySelector('link[rel="manifest"]')) {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/manifest.json';
      document.head.appendChild(manifestLink);
      console.log('✅ Manifest link added');
    }
    
    // Inline Service Worker code
    const serviceWorkerCode = `
      const CACHE_NAME = 'amipeta-v1';
      const RUNTIME_CACHE = 'amipeta-runtime';

      const PRECACHE_URLS = [
        '/',
        '/manifest.json',
        '/icon.svg'
      ];

      self.addEventListener('install', (event) => {
        console.log('[Service Worker] Installing...');
        event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Precaching app shell');
            return cache.addAll(PRECACHE_URLS);
          })
        );
        self.skipWaiting();
      });

      self.addEventListener('activate', (event) => {
        console.log('[Service Worker] Activating...');
        event.waitUntil(
          caches.keys().then((cacheNames) => {
            return Promise.all(
              cacheNames
                .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
                .map((name) => {
                  console.log('[Service Worker] Deleting old cache:', name);
                  return caches.delete(name);
                })
            );
          })
        );
        self.clients.claim();
      });

      self.addEventListener('fetch', (event) => {
        // Skip non-GET requests
        if (event.request.method !== 'GET') return;

        // Skip chrome extensions and other non-http requests
        if (!event.request.url.startsWith('http')) return;

        event.respondWith(
          caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }

            return fetch(event.request).then((response) => {
              // Don't cache non-successful responses
              if (!response || response.status !== 200 || response.type === 'error') {
                return response;
              }

              // Clone the response
              const responseToCache = response.clone();

              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(event.request, responseToCache);
              });

              return response;
            });
          })
        );
      });
    `;

    // Register Service Worker - ONLY in production
    if ('serviceWorker' in navigator) {
      // Final failsafe check before creating blob
      if (window.location.hostname.includes('figma') || 
          window.location.hostname.includes('preview') || 
          window.location.hostname === 'localhost') {
        console.error('🚨 Blocked blob creation in development environment');
        return;
      }
      
      try {
        const blob = new Blob([serviceWorkerCode], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);

        navigator.serviceWorker
          .register(swUrl)
          .then((registration) => {
            console.log('✅ PWA Service Worker registered:', registration.scope);
          })
          .catch((error) => {
            console.error('❌ Service Worker registration failed:', error);
          });
      } catch (error) {
        console.error('❌ Failed to create Service Worker blob:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthLoading) return; // Wait for auth to load

    // Check if user has a custom forum profile from database (KV store)
    const loadProfile = async () => {
      try {
        const currentUserId = session?.user?.id || currentUser.id;
        
        // Fetch Auth User to get latest metadata (avatar, name) from Postgres
        let authData: Partial<User> = {};
        
        if (session?.user) {
           try {
             // Try to get from profiles table
             const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
             if (profile && !error) {
                authData = {
                  username: profile.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                  avatar: profile.avatar_url || session.user.user_metadata?.avatar_url
                };
             } else {
                authData = {
                  username: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                  avatar: session.user.user_metadata?.avatar_url
                };
             }
           } catch (e) {
             console.log('Error fetching profile from profiles table', e);
             authData = {
                username: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                avatar: session.user.user_metadata?.avatar_url
             };
           }
        }

        // First try to get from API (Database) using REAL ID
        const apiProfile = await getUserProfile(currentUserId);
        
        if (apiProfile && Object.keys(apiProfile).length > 0) {
          console.log('App: Loaded active user profile from Database:', apiProfile);
          
          // Merge Auth Data - Prioritize KV store (apiProfile) over Auth Data to preserve manual edits
          const mergedProfile = { 
             ...apiProfile,
             id: currentUserId, // Ensure ID is correct
             username: apiProfile.username || authData.username || activeUser.username,
             avatar: apiProfile.avatar || authData.avatar || activeUser.avatar
          };

          setActiveUser(prev => ({ ...prev, ...mergedProfile }));
          
          // Sync to localStorage for backup/offline support
          const profileKey = `forum_profile_${currentUserId}`;
          localStorage.setItem(profileKey, JSON.stringify(mergedProfile));
          
          // Only sync back to KV if we actually filled in missing data from Auth
          // or if the ID was wrong. We do NOT want to overwrite custom forum data with Auth data.
          if ((!apiProfile.username && authData.username) || 
              (!apiProfile.avatar && authData.avatar) ||
              apiProfile.id !== currentUserId) {
              updateUserProfile(currentUserId, mergedProfile);
          }

        } else {
          // Fallback: Check localStorage
          const profileKey = `forum_profile_${currentUserId}`;
          const storedProfile = localStorage.getItem(profileKey);
  
          if (storedProfile) {
            try {
              const parsed = JSON.parse(storedProfile);
              const mergedProfile = {
                ...parsed,
                id: currentUserId,
                ...(authData.username ? { username: authData.username } : {}),
                ...(authData.avatar ? { avatar: authData.avatar } : {})
              };
              
              setActiveUser(prev => ({ ...prev, ...mergedProfile }));
              console.log('App: Loaded active user profile from LocalStorage:', parsed);
              
              await updateUserProfile(currentUserId, mergedProfile);
            } catch (e) {
              console.error('Failed to parse forum profile', e);
            }
          } else {
              // No KV, No LocalStorage. Seed with default mock data but with REAL ID and Auth Metadata
              console.log('App: Seeding new user profile for', currentUserId);
              const newProfile = {
                  ...currentUser,
                  id: currentUserId,
                  // Use Auth Data for username/avatar if available, otherwise fallback to nice defaults (NOT "farent19")
                  username: authData.username || `User_${currentUserId.slice(0, 4)}`,
                  avatar: authData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserId}`,
                  // Clear the mock bio
                  bio: '',
                  // Reset stats for new user
                  achievements: [], 
                  currentStreak: 0,
                  bestStreak: 0,
                  reputation: 0,
                  memberSince: new Date(),
                  lastLoginDate: new Date(),
                  role: 'member' as const
              };
              
              setActiveUser(prev => ({ ...prev, ...newProfile }));
              await updateUserProfile(currentUserId, newProfile);
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    
    loadProfile();
  }, [currentView, session, isAuthLoading]); // Reload when view, session or auth loading state changes

  // Callback to update active user when profile changes in Forum
  const handleProfileUpdate = async (newData: Partial<User>) => {
    // Optimistic update
    setActiveUser(prev => ({ ...prev, ...newData }));
    
    // Save to Database
    const currentUserId = session?.user?.id || currentUser.id;
    await updateUserProfile(currentUserId, newData);
  };
  
  // Auth Effect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  // Real-time notifications state
  const [liveNotifications, setLiveNotifications] = useState<Notification[]>([...mockNotifications]);
  const [notificationFilter, setNotificationFilter] = useState<'app' | 'forum' | 'all'>('all');
  
  // Initialize language on mount
  useEffect(() => {
    const initialLang = getCurrentLanguage();
    setCurrentLanguageState(initialLang);
  }, []);
  
  // Handle language change
  const handleLanguageChange = (newLang: Language) => {
    setCurrentLanguageState(newLang);
    setCurrentLanguage(newLang);
  };
  
  // Subscribe to real-time notifications
  useEffect(() => {
    const unsubscribe = notificationStore.subscribe((newNotification) => {
      console.log('📬 New notification received:', newNotification);
      setLiveNotifications(prev => [newNotification, ...prev]);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  
  // Initialize moderation queue with mock data
  useEffect(() => {
    initializeMockModerationQueue();
  }, []);
  
  // Calculate unread notifications based on user role and separation logic
  const hasModAccess = activeUser.role === 'admin' || activeUser.role === 'moderator';
  const visibleNotifications = hasModAccess 
    ? liveNotifications 
    : liveNotifications.filter(n => n.type !== 'report');

  // Separate notifications
  const forumTypes = ['comment', 'mention', 'upvote', 'pawvote', 'follow'];
  
  const forumNotifications = visibleNotifications.filter(n => forumTypes.includes(n.type));
  const appNotifications = visibleNotifications.filter(n => !forumTypes.includes(n.type));

  const unreadForumNotifications = forumNotifications.filter(n => !n.read).length;
  const unreadAppNotifications = appNotifications.filter(n => !n.read).length;

  // ------------------------------------------------------------------
  // NAVIGATION HANDLERS
  // ------------------------------------------------------------------

  // Navigate to a specific post detail view
  // Pushes to history stack for back navigation
  const handleViewPost = (postId: string) => {
    window.scrollTo(0, 0);
    setSelectedPostId(postId);
    setCurrentView('post');
    setNavigationHistory(prev => [...prev, { view: 'post', postId }]);
  };

  // Navigate to a user profile
  const handleViewProfile = (userId: string) => {
    window.scrollTo(0, 0);
    setSelectedUserId(userId);
    setCurrentView('profile');
    setNavigationHistory(prev => [...prev, { view: 'profile', userId }]);
  };

  // Navigate to ticket details
  // Supports 'asAdmin' flag for moderator/admin view
  const handleViewTicket = (ticketId: string, asAdmin: boolean = false) => {
    window.scrollTo(0, 0);
    setSelectedTicketId(ticketId);
    setTicketViewAsAdmin(asAdmin); // Set admin view flag
    setCurrentView('ticketDetails');
    setNavigationHistory(prev => [...prev, { view: 'ticketDetails', ticketId }]);
  };

  // Navigate to pet profile
  const handleViewPet = (petId: string) => {
    window.scrollTo(0, 0);
    setSelectedPetId(petId);
    setCurrentView('petProfile');
    setNavigationHistory(prev => [...prev, { view: 'petProfile' }]); // simplified history
  };

  // Navigate to Add Reminder
  const handleAddPetReminder = (petId: string) => {
    window.scrollTo(0, 0);
    setSelectedPetId(petId);
    setCurrentView('addPetReminder');
    setNavigationHistory(prev => [...prev, { view: 'addPetReminder' }]);
  };

  // Navigate to Invite Member
  const handleInvitePetMember = (petId: string) => {
    window.scrollTo(0, 0);
    setSelectedPetId(petId);
    setCurrentView('invitePetMember');
    setNavigationHistory(prev => [...prev, { view: 'invitePetMember' }]);
  };

  // Navigate to Edit Pet
  const handleEditPet = (petId: string) => {
    window.scrollTo(0, 0);
    setSelectedPetId(petId);
    setCurrentView('editPet');
    setNavigationHistory(prev => [...prev, { view: 'editPet' }]);
  };

  // Generic back handler
  // Pops the last item from history stack and restores previous view state
  const handleBack = () => {
    window.scrollTo(0, 0);
    const prevItem = navigationHistory[navigationHistory.length - 2];
    if (prevItem) {
      setCurrentView(prevItem.view);
      setSelectedPostId(prevItem.postId || null);
      setSelectedUserId(prevItem.userId || null);
      setSelectedTicketId(prevItem.ticketId || null);
      setNavigationHistory(prev => prev.slice(0, -1));
      
      // Reset ticket view mode when going back from ticket details
      if (prevItem.view !== 'ticketDetails') {
        setTicketViewAsAdmin(false);
      }
    }
  };

  // Open the post creation screen
  const handleCreatePost = () => {
    window.scrollTo(0, 0);
    setCurrentView('create');
    setNavigationHistory(prev => [...prev, { view: 'create' }]);
  };

  // Callback when post is successfully created
  const handlePostCreated = () => {
    window.scrollTo(0, 0);
    setCurrentView('home');
    setNavigationHistory(prev => prev.slice(0, -1));
  };

  // Handle category selection from Home or other views
  const handleCategoryChange = (categoryId: string, subcategoryId: string | null) => {
    window.scrollTo(0, 0);
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
  };

  // Generic navigation handler for main menu items
  const handleNavigate = (view: View) => {
    window.scrollTo(0, 0);
    
    // If navigating to profile tab, set current user
    if (view === 'profile') {
      setSelectedUserId(activeUser.id);
    }
    
    setCurrentView(view);
    setNavigationHistory(prev => [...prev, { view }]);
    
    // Reset ticket view mode when navigating away from ticket details
    if (view !== 'ticketDetails') {
      setTicketViewAsAdmin(false);
    }
    
    // Force re-mount Settings component when navigating to settings (fixes Settings icon not working from sub-views)
    if (view === 'settings') {
      setSettingsKey(prev => prev + 1);
    }
  };

  // Reset to initial Home state (All Posts)
  // Used by BottomNav home button
  const handleNavigateHome = () => {
    window.scrollTo(0, 0);
    setCurrentView('home');
    setSelectedPostId(null);
    setSelectedUserId(null);
    // Reset category selection to "All Posts"
    setSelectedCategory('all');
    setSelectedSubcategory(null);
    // Reset navigation history to just home
    setNavigationHistory([{ view: 'home' }]);
  };

  const handleSendBroadcast = (message: string) => {
    // Implement broadcast logic here
    console.log('Broadcast message:', message);
  };

  // Helper to determine if we are in forum context for shared pages (About, Privacy, Terms)
  const isForumContext = () => {
     // Check if we came from Forum or Settings (which is Forum Settings)
     const lastView = navigationHistory[navigationHistory.length - 2]?.view;
     return ['forum', 'settings', 'post', 'profile', 'saved', 'notifications'].includes(lastView || '') 
            || (currentView === 'settings' || currentView === 'forum');
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return authView === 'login' ? (
      <Login 
        onSuccess={() => {}} // Auth state change handles the view switch
        onNavigateToSignup={() => setAuthView('signup')} 
      />
    ) : (
      <Signup 
        onSuccess={() => setAuthView('login')} 
        onNavigateToLogin={() => setAuthView('login')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {currentView === 'home' && (
        <Home 
          onViewPost={handleViewPost} 
          onCreatePost={handleCreatePost} 
          onViewProfile={handleViewProfile}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onCategoryChange={handleCategoryChange}
          unreadNotifications={unreadAppNotifications}
          notifications={appNotifications}
          onNavigate={(view) => {
            if (view === 'notifications') setNotificationFilter('app');
            handleNavigate(view);
          }}
        />
      )}
      {currentView === 'forum' && (
        <Forum 
          onViewPost={handleViewPost} 
          onCreatePost={handleCreatePost} 
          onViewProfile={handleViewProfile}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onCategoryChange={handleCategoryChange}
          unreadNotifications={unreadForumNotifications}
          onNavigate={(view) => {
            if (view === 'notifications') setNotificationFilter('forum');
            handleNavigate(view);
          }}
          currentUser={activeUser}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
      {currentView === 'post' && selectedPostId && (
        <PostDetail 
          postId={selectedPostId} 
          onBack={handleBack} 
          onViewProfile={handleViewProfile}
          unreadNotifications={unreadForumNotifications}
          onNavigate={handleNavigate}
          onCategoryClick={(categoryId, subcategoryId) => {
            handleCategoryChange(categoryId, subcategoryId);
            setCurrentView('home');
            setSelectedPostId(null);
          }}
          currentUser={activeUser}
        />
      )}
      {currentView === 'profile' && selectedUserId && (
        <Profile 
          userId={selectedUserId} 
          onBack={handleBack}
          unreadNotifications={unreadForumNotifications}
          onNavigate={handleNavigate}
          onViewPost={handleViewPost}
          onViewProfile={handleViewProfile}
          showBackButton={selectedUserId !== activeUser.id}
          currentUser={activeUser}
          onCreatePost={handleCreatePost}
        />
      )}
      {currentView === 'personalProfile' && (
        <PersonalProfile 
          onBack={handleBack}
          onNavigate={handleNavigate}
          onLanguageChange={handleLanguageChange}
          onSignOut={async () => {
            await supabase.auth.signOut();
            // Auth state change will trigger re-render to Login view
          }}
        />
      )}
      {currentView === 'appSettings' && (
        <AppSettings
          onBack={handleBack}
          onNavigate={handleNavigate}
          onLanguageChange={handleLanguageChange}
        />
      )}
      {currentView === 'editMainProfile' && (
        <MainProfileEdit 
          onBack={handleBack} 
        />
      )}
      {currentView === 'create' && (
        <CreatePost 
          onBack={handleBack} 
          onPostCreated={handlePostCreated}
          unreadNotifications={unreadForumNotifications}
          onNavigate={handleNavigate}
        />
      )}
      {currentView === 'notifications' && (
        <Notifications 
          onBack={handleBack} 
          onViewPost={handleViewPost}
          unreadNotifications={unreadAppNotifications}
          onNavigate={handleNavigate}
          notifications={liveNotifications}
          onUpdateNotifications={setLiveNotifications}
          filter={notificationFilter}
        />
      )}
      {currentView === 'settings' && (
        <Settings 
          onBack={handleBack} 
          onNavigate={handleNavigate}
          onViewProfile={handleViewProfile}
          unreadNotifications={unreadAppNotifications}
          onLanguageChange={handleLanguageChange}
          onViewTicket={handleViewTicket}
          currentUser={activeUser}
          onProfileUpdate={handleProfileUpdate}
          key={settingsKey} // Force re-mount
        />
      )}
      {currentView === 'saved' && (
        <SavedPosts 
          onBack={handleBack} 
          onViewPost={handleViewPost} 
          onViewProfile={handleViewProfile}
          unreadNotifications={unreadForumNotifications}
          onNavigate={handleNavigate}
          onCategoryChange={handleCategoryChange}
        />
      )}
      {currentView === 'reports' && (
        <ReportCenter 
          onBack={handleBack} 
          unreadNotifications={unreadForumNotifications}
          onNavigate={handleNavigate}
          onViewPost={handleViewPost}
        />
      )}
      {currentView === 'moderation' && (
        <ModerationQueue 
          onClose={handleBack}
          unreadNotifications={unreadForumNotifications}
          onNavigate={handleNavigate}
        />
      )}
      {currentView === 'admin' && (
        <AdminPanel 
          ads={sponsoredAds}
          onBack={handleBack}
          onViewTicket={handleViewTicket}
          onNavigateAnalytics={() => handleNavigate('analytics')}
          unreadNotifications={unreadAppNotifications}
          onNavigate={handleNavigate}
          currentUserRole={currentUser.role as 'admin' | 'moderator'}
          onSendBroadcast={handleSendBroadcast}
        />
      )}
      {currentView === 'verification' && (
        <VerificationRequest 
          onBack={handleBack}
          unreadNotifications={unreadAppNotifications}
          onNavigate={handleNavigate}
        />
      )}
      {currentView === 'contact' && (
        <ContactSupport 
          onBack={handleBack}
          onViewTickets={() => handleNavigate('supportTickets')}
          unreadNotifications={unreadAppNotifications}
          onNavigate={handleNavigate}
        />
      )}
      {currentView === 'about' && (
        <About 
          onBack={handleBack}
          unreadNotifications={unreadAppNotifications}
          onNavigate={handleNavigate}
          isForumContext={isForumContext()}
        />
      )}
      {currentView === 'terms' && (
        <TermsOfService 
          onBack={handleBack}
          unreadNotifications={unreadAppNotifications}
          onNavigate={handleNavigate}
          isForumContext={isForumContext()}
        />
      )}
      {currentView === 'privacy' && (
        <PrivacyPolicy 
          onBack={handleBack}
          unreadNotifications={unreadAppNotifications}
          onNavigate={handleNavigate}
          isForumContext={isForumContext()}
        />
      )}
      {currentView === 'guidelines' && (
        <CommunityGuidelines 
          onBack={handleBack}
          unreadNotifications={unreadForumNotifications}
          onNavigate={handleNavigate}
        />
      )}
      {currentView === 'supportTickets' && (
        <SupportTickets 
          onBack={handleBack}
          onCreateTicket={() => handleNavigate('contact')}
          onViewTicket={handleViewTicket}
          unreadNotifications={unreadAppNotifications}
          onNavigate={handleNavigate}
        />
      )}
      {currentView === 'ticketDetails' && selectedTicketId && (
        <TicketDetails 
          ticketId={selectedTicketId}
          onBack={handleBack}
          isAdmin={ticketViewAsAdmin && (currentUser.role === 'admin' || currentUser.role === 'moderator')}
        />
      )}
      {currentView === 'analytics' && (
        <Analytics 
          onBack={handleBack}
          unreadNotifications={unreadAppNotifications}
          onNavigate={handleNavigate}
        />
      )}
      {currentView === 'dashboard' && (
        <Dashboard onNavigate={handleNavigate} />
      )}
      {currentView === 'explore' && (
        <Explore onNavigate={handleNavigate} />
      )}
      {currentView === 'services' && (
        <Services onNavigate={handleNavigate} />
      )}
      {currentView === 'myPets' && (
        <MyPets 
          onNavigate={handleNavigate} 
          onViewPet={handleViewPet}
          onAddPet={() => handleNavigate('createPet')}
          onAddReminder={handleAddPetReminder}
          onInviteMember={handleInvitePetMember}
          onEditPet={handleEditPet}
        />
      )}
      {currentView === 'petProfile' && selectedPetId && (
        <PetProfile 
          petId={selectedPetId}
          onBack={handleBack}
          onNavigate={handleNavigate}
        />
      )}
      {currentView === 'createPet' && (
        <CreatePet 
          onBack={handleBack}
          onNavigate={handleNavigate}
        />
      )}
      {currentView === 'addPetReminder' && selectedPetId && (
        <AddPetReminder 
          petId={selectedPetId}
          onBack={handleBack}
        />
      )}
      {currentView === 'invitePetMember' && selectedPetId && (
        <InvitePetMember 
          petId={selectedPetId}
          onBack={handleBack}
        />
      )}
      {currentView === 'editPet' && selectedPetId && (
        <EditPet 
          petId={selectedPetId}
          onBack={handleBack}
        />
      )}
      
      {/* Bottom Navigation */}
      <BottomNav 
        currentView={currentView}
        onNavigate={handleNavigate}
        onHomeClick={handleNavigateHome}
      />

      <Toaster />
    </div>
  );
}